import { logInfo } from "./log";
import { config } from "dotenv";

// load the .env varaibles
config({ path: ".env" });

export const __OPEN_AI_KEY = process.env.OPENAI_API_KEY;
export const __CSV_FILE = process.env.CSV_FILE;
export const __OUT_CSV_FILE = process.env.OUT_CSV_FILE;
export const __TESTING = process.env.TESTING === "true";
export const __INTERVAL_MILISECONDS = 3 * 1000;

logInfo("Parsing CSV: " + __CSV_FILE);
logInfo("Outputting to CSV: " + __OUT_CSV_FILE);

if (__TESTING) {
  logInfo("Running in test mode!");
} else {
  logInfo("Running in prod mode!");
}
