import * as https from "https";
import * as http from "http";
import * as url from "url";
import { logError } from "./log";

export function getImageAsBase64(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(imageUrl);
    const protocol = parsedUrl.protocol.startsWith("https:") ? https : http;
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (protocol === https ? 443 : 80),
      path: parsedUrl.path,
      method: "GET",
    };

    const req = protocol.request(options, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const fileType = res.headers["content-type"];
        const base64Image = Buffer.concat(chunks).toString("base64");
        resolve(`data:${fileType};base64,${base64Image}`);
      });
    });

    req.on("error", (error) => {
      logError(error.message);
      resolve("");
    });

    req.end();
  });
}
