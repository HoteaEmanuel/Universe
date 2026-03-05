import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const generateHashtags = async (req, res) => {
  const { postContent } = req.body;
  console.log("HERE IN AI");
  // Validare
  if (!postContent || postContent.trim() === "") {
    return res.status(400).json({
      error: "Post content is mandatory",
    });
  }
  console.log("GEMINI API" + process.env.GEMINI_API_KEY);
  console.log("Generating hashtags for post content:", postContent);
  try {
    console.log("Key prefix:", process.env.GEMINI_API_KEY?.slice(0, 6));

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `Genereaza exact 5 hashtag-uri relevante pentru aceasta postare pentru o retea sociala. Raspunde DOAR cu hashtag-uri separate prin spatii.Generezi doar cuvinte fara simboluri.

Continutul postarii: "${postContent}"

Hashtags:`;

    let result = await model.generateContent(prompt);

    const response = result.response;
    console.log("Google Generative AI Response:", response);
    const text = response.text();

    return res.status(200).json({
      hashtags: text.length > 0 ? text.split(" ") : ["social", "post", "share"],
    });
  } catch (error) {
    console.error("Google Generative AI Error:", error);
    return res.status(500).json({
      error: "Error in hashtags generator",
      details: error.message,
    });
  }
};

export const listModels = async (req, res) => {
  try {
    console.log("Listing AI models");
    const models = await genAI.listModels();
    console.log("Available models:", models);
    return res.status(200).json({
      models: models.map((m) => m.name),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
