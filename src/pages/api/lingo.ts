import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const { text, action, targetLanguage, targetLevel } = req.body;

  let prompt = "";

  if (action === "Correct") {
    prompt = `You are a language teacher. Highlight errors and improvements that can be made to this text: "${text}". Respond with 3 sections: "errors", "improvements" and "revised text".`;
  } else if (action === "Simplify") {
    prompt = `Simplify this text for a ${targetLevel} level: ${text}`;
  } else if (action === "Translate") {
    prompt = `Translate this text to ${targetLanguage}: "${text}"`;
  }

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 2048,
      n: 1,
      stop: "",
      temperature: 0.5,
    });

    res.status(200).json({
      response: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Could not get response from OpenAI API",
    });
  }
};

export default handler;
