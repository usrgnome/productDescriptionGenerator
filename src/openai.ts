import { OpenAI } from "openai";
import { __OPEN_AI_KEY } from "./config";

const openai = new OpenAI({ apiKey: __OPEN_AI_KEY });

export async function fetchOpenAIDescription(prompt: string, imageB64: string) {
  const response = await openai.chat.completions
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
                url: imageB64,
                detail: "low",
              },
            },
          ],
        },
      ],
    })
    .catch((err) => {
      console.log(err);
      throw "Error: " + err;
    });
  return { message: response.choices[0].message.content };
}
