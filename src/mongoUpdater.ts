import { MongoClient, Db, ObjectId } from "mongodb";
import { createReadStream } from "fs";
import * as csvParser from "csv-parser";
import { __MONGO_CONN, __OPEN_AI_KEY, __OUT_CSV_FILE } from "./config";
import { logError, logInfo, logSuccess, logWarn } from "./log";

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

  let catModifiedCntr = 0;
  let prodModifiedCntr = 0;
  let prodNoModifiedCntr = 0;
  let catNoModifiedCntr = 0;

  const pipe = stream.pipe(csvParser());
  let running = false;
  let finnished = false;

  const onEnd = () => {
    console.log("end");
    client.close();
    console.log(`modified catalogs: ${catModifiedCntr}`);
    console.log(`modified prods: ${prodModifiedCntr}`);
    console.log(`unmodified cats: ${catNoModifiedCntr}`);
    console.log(`unmodified prods: ${prodNoModifiedCntr}`);
  };

  pipe.on("data", async (data) => {
    pipe.pause();
    running = true;

    const description = data["product_description"];

    logInfo("Updated catalog: " + data["catalog_id"]);
    let catRes = await catalogCollection.updateOne(
      // @ts-ignore
      { _id: data["catalog_id"] },
      {
        $set: {
          "product.description": description,
          "product.metaDescription": description,
        },
      }
    );

    if (catRes.matchedCount) {
      catModifiedCntr++;
      logSuccess("Updated catalog: " + data["catalog_id"]);
    } else {
      catNoModifiedCntr++;
      logWarn("Couldnt update catalog: " + data["catalog_id"]);
    }

    logInfo("Updating product: " + data["product_id"]);

    const prodRes = await productsCollection.updateOne(
      // @ts-ignore
      { _id: data["product_id"] },
      {
        $set: {
          description: description,
          metaDescription: description,
        },
      }
    );

    if (prodRes.modifiedCount) {
      prodModifiedCntr++;
      logSuccess("Updated product: " + data["product_id"]);
    } else {
      prodNoModifiedCntr++;
      logWarn("Couldnt product: " + data["product_id"]);
    }

    pipe.resume();
    running = false;
    if (finnished) {
      onEnd();
    }
  });

  pipe.on("end", () => {
    finnished = true;
    if (!running) {
      onEnd();
    }
  });

  pipe.on("close", () => {
    console.log("close!");
  });

  pipe.on("error", (err) => {
    console.log(err, "err");
  });
});
