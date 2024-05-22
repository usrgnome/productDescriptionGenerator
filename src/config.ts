import { logInfo } from "./log";
import { config } from "dotenv";

// load the .env varaibles
config({ path: __dirname + "/.env" });

export const __OPEN_AI_KEY = process.env.OPENAI_API_KEY;
export const __CSV_FILE = process.env.CSV_FILE;
export const __OUT_CSV_FILE = process.env.OUT_CSV_FILE;
export const __INTERVAL_MILISECONDS = 3 * 1000;

logInfo("Parsing CSV: " + __CSV_FILE);
logInfo("Outputting to CSV: " + __OUT_CSV_FILE);