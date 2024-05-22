import { createReadStream } from "fs";
import * as csvParser from "csv-parser";
import Product from "./product";
import { createObjectCsvWriter } from "csv-writer";
import { logError, logInfo, logSuccess, logWarn } from "./log";
import { __CSV_FILE, __INTERVAL_MILISECONDS } from "./config";
import { GetProductThumbnailAsBase64FromUrl } from "./getThumbnailAsBase64";
import { extractFeatures } from "./extractFeatures";
import { fetchOpenAIDescription } from "./openai";

// Create a CSV writer instance
const csvWriter = createObjectCsvWriter({
  path: "output.csv",
  header: [
    { id: "catalog_id", title: "catalog_id" },
    { id: "product_slug", title: "product_slug" },
    { id: "product_id", title: "product_id" },
    { id: "product_description", title: "product_description" },
  ],
});

let backoffCounter = 0;

const stream = createReadStream(__CSV_FILE);
const pipe = stream.pipe(csvParser());

pipe.on("data", (data) => {
  let finished = false;
  const features: string[] = [];
  const product = new Product(
    data["product._id"],
    data["product.slug"],
    data["product.title"],
    features
  );

  // some products dont have a handle yet, maybe they are temp??
  if (data["product.slug"] && data["product.media[0].URLs.small"]) {
    pipe.pause();

    const parse = async () => {
      // extract the features we want to use to assist the AI
      extractFeatures(features, data);

      const thumbnailB64 = await GetProductThumbnailAsBase64FromUrl(
        data["product.media[0].URLs.small"]
      );

      if (!thumbnailB64) throw "Missing thumbnail!";

      const specifications =
        features.length > 0
          ? `Don't make assumptions on how it's operated. Include this short list of specifications in the description: ${features.join(
              ", "
            )}. `
          : "";

      const productDescription = data["product.description"]
        ? `An examle description is provided: ${data["product.description"]}. `
        : "";

      const prompt = `Write a description of the product in this image that has a name of ${product.name} for a listing on a website for a business. The business is an event equipment rental business but do not make any mention of them doing delivery or setup. ${specifications}Make the description between 200 and 300 words. ${productDescription}Don't include a title. Use UK English please.`;

      const description = await (
        await fetchOpenAIDescription(prompt, thumbnailB64)
      ).message;

      csvWriter
        .writeRecords([
          {
            catalog_id: data["_id"],
            product_id: product.id,
            product_slug: product.slug,
            product_description: description,
          },
        ])
        .then(() => {
          logSuccess(
            `Processed id: ${product.id} slug: ${product.slug} successfully.`
          );
        })
        .catch((err) => {
          logError(
            `id: ${product.id} slug: ${product.slug} could not write: ${err}`
          );
        });
    };
    parse()
      .then(() => {
        finished = true;
        if (backoffCounter !== 0) {
          backoffCounter = 0;
          logWarn("Backoff counter reset!");
        }
      })
      .catch((err) => {
        logError(`id: ${product.id} slug: ${product.slug} err: ${err}`);
        finished = true;
        backoffCounter++;
        logWarn(`Backoff counter increased to: ${backoffCounter}`);
      });

    const interval = setInterval(() => {
      if (finished) {
        // begin processing the next one
        setTimeout(
          () => pipe.resume(),
          __INTERVAL_MILISECONDS + backoffCounter * 1000
        );
        clearInterval(interval);
        return;
      }
    }, __INTERVAL_MILISECONDS);
  } else {
    logError(`id: ${product.id} err: missing a slug`);
  }
});

pipe.on("end", () => {
  logInfo("CSV read pipe finished");
});
