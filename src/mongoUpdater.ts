import { MongoClient, Db, ObjectId } from "mongodb";
import { createReadStream } from "fs";
import * as csvParser from "csv-parser";
import { __MONGO_CONN, __OPEN_AI_KEY, __OUT_CSV_FILE } from "./config";
import { logError, logInfo, logSuccess } from "./log";

// Connection URL
//
// Database Name
const dbName = "reaction";

// Create a new MongoClient

logInfo("Using mongo url: " + __MONGO_CONN);
const client = new MongoClient(__MONGO_CONN);

// Connect to the MongoDB cluster
client.connect().then(() => {
  logInfo(`Connected successfully to mongo server`);

  const db: Db = client.db(dbName);
  const catalogCollection = db.collection("Catalog");
  const productsCollection = db.collection("Product");
  const stream = createReadStream(__OUT_CSV_FILE);

  const pipeFn = () => {
    const pipe = stream.pipe(csvParser());

    pipe.on("data", async (data) => {
      pipe.pause();

      const description = data["product_description"];

      logInfo("Updated catalog: " + data["catalog_id"]);
      await catalogCollection.updateOne(
        // @ts-ignore
        { _id: data["catalog_id"] },
        {
          $set: {
            "product.description": description,
          },
        }
      );

      logSuccess("Updated catalog: " + data["catalog_id"]);

      logInfo("Updating product: " + data["product_id"]);

      await productsCollection.updateOne(
        // @ts-ignore
        { _id: data["product_id"] },
        {
          $set: {
            description: description,
          },
        }
      );

      logSuccess("Updated product: " + data["product_id"]);

      pipe.resume();
    });

    pipe.on("end", () => {
      console.log("end");
    });

    pipe.on("close", () => {
      client.close();
      console.log("close!");
    });

    pipe.on("error", (err) => {
      console.log(err, "err");
    });
  };

  pipeFn();

  // Example update operation

  // Ensures that the client will close when you finish/error
});
