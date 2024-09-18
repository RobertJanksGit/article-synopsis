const OpenAI = require("openai");

const express = require("express");
// const cors = require("cors");
const app = express();
const PORT = 3000;

// app.use(cors());

require("dotenv").config();

// Configure the OpenAI client with your API key
const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY2"],
});

// Define an async function to interact with the OpenAI API
const getGPTResponse = async (body) => {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI designed to summarize articles in various styles based on the type specified. Here are the types and their corresponding styles: no-more-clickbait: Provide a straightforward, factual summary of the article, focusing on the key points without exaggeration or sensationalism. even-more-clickbait: Craft an exaggerated, sensational summary that amplifies the article's content to make it as attention-grabbing as possible, while still relating to the original content. just-for-laughs: Write a satirical summary in the style of The Babylon Bee. This should be humorous, possibly absurd, and take liberties with the truth for comedic effect, but still loosely based on the article's content.",
        },
        {
          role: "user",
          content: `Article: ${body.article}, Type: ${body.type}`,
        },
      ],
    });
    return response.choices[0].message;
  } catch (error) {
    console.error("Error contacting OpenAI:", error);
  }
};

// will parse JSON bodies from post request for all requests made
app.use(express.json());

app.post("/", async (req, res) => {
  console.log(req.body);
  const response = await getGPTResponse(req.body);
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
