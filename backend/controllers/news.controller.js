import axios from "axios";
import { redis } from "../lib/redis.js";
export const getNews = async (req, res) => {
  const category = req.params.category;
  try {
    const categoryNews = await redis.get(`news - ${category}`);
    console.log("CATEGORY NEWS FROM CACHE");
    console.log(categoryNews);
    if (categoryNews) return res.status(200).json(categoryNews);
    const response = await axios.get("https://gnews.io/api/v4/top-headlines", {
      params: {
        q: category,
        topic: category,
        lang: "ro",
        max: 100,
        apikey: process.env.GNEWS_API_KEY,
      },
    });
    console.log("CATEGORY NEWS");

    // Get only the articles that are relevant to the category
    // Relevant means that the category is mentioned in the title, description or content of the article

    const filteredArticles = response.data.articles.filter((article) => {
      const searchTerm = category.toLowerCase();
      const title = article.title.toLowerCase();
      const description = article.description?.toLowerCase() || "";
      const content = article.content?.toLowerCase() || "";
      return (
        title.includes(searchTerm) ||
        description.includes(searchTerm) ||
        content.includes(searchTerm)
      );
    });

    await redis.setex( 
      `news - ${category}`,
      600,
      JSON.stringify(filteredArticles),
    );
    return res.status(200).json(filteredArticles);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getTopNews = async (req, res) => {
  const limit = req.query.limit || 100;
  try {
    const topNews = await redis.get("top-news");
    if (topNews) {
      console.log("EXISTS IN THE CACHE");
      return res.status(200).json(topNews);
    }
    console.log("FETCHING THE NEWS");
    const response = await axios.get("https://gnews.io/api/v4/top-headlines", {
      params: {
        lang: "en",
        max: limit,
        apikey: process.env.GNEWS_API_KEY,
        category: "general",
      },
    });
    const articles = response.data.articles;
    await redis.setex("top-news", 600, articles);
    return res.status(200).json(articles);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
