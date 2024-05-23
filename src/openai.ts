import { OpenAI } from "openai";
import { __INTERVAL_MILISECONDS, __OPEN_AI_KEY, __TESTING } from "./config";

const openai = new OpenAI({ apiKey: __OPEN_AI_KEY });

export function fetchOpenAIDescription(
  prompt: string,
  imageURL: string
): Promise<{ message: string }> {
  return new Promise(async (resolve, reject) => {
    if (__TESTING) {
      setTimeout(() => {
        if (Math.random() > 0.3) {
          reject("err: " + "Rate limit error simulation");
        }
        resolve({ message: "Skibidi" });
      }, 2000);
    } else {
      openai.chat.completions
        .create({
          model: "gpt-4-turbo",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageURL,
                    detail: "low",
                  },
                },
              ],
            },
          ],
        })
        .then((response) => {
          resolve({ message: response.choices[0].message.content });
        })
        .catch((err) => {
          console.log(err);
          throw "Error: " + err;
        });
    }
  });
}
