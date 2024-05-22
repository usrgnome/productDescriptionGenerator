import { getImageAsBase64 } from "./imageAsBase64";

export async function GetProductThumbnailAsBase64FromUrl(url: string) {
  url = `https://gecko.rent/${url}`;
  if (!url || typeof url !== "string") return "";
  if (url.endsWith("/null")) return "";
  const base64 = await getImageAsBase64(url);
  return base64;
}
