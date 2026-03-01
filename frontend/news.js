const axios = require("axios");
const express = require("express");

const app = express();
let latestNews = [];

// Get date N days ago in YYYY-MM-DD (NewsAPI accepts this)
function getDateNDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

// Fetch latest flood news from the past week
async function fetchFloodNewsPastWeek(limit = 5) {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) throw new Error("NEWS_API_KEY is not set");

    const fromDate = getDateNDaysAgo(7);

    const url =
      `https://newsapi.org/v2/everything` +
      `?q=flood` +
      `&from=${fromDate}` +
      `&sortBy=publishedAt` +
      `&language=en` +
      `&pageSize=${limit}` +
      `&apiKey=${apiKey}`;

    const response = await axios.get(url);
    const articles = response.data?.articles ?? [];

    console.log(`Fetched ${articles.length} articles (past week).`);
    return articles.slice(0, limit);
  } catch (error) {
    console.error("Failed to fetch flood news:", error.message);
    return [];
  }
}

// Update in-memory cache
async function updateNews() {
  const articles = await fetchFloodNewsPastWeek(5);
  latestNews = articles;
  console.log("Updated latestNews count:", latestNews.length);
}

// Serve cached news
app.get("/news", (req, res) => {
  if (latestNews.length === 0) {
    return res
      .status(503)
      .json({ error: "News not available yet, try again shortly." });
  }
  res.json({
    updatedAt: new Date().toISOString(),
    count: latestNews.length,
    articles: latestNews,
  });
});

// Start server
app.listen(3000, () => {
  console.log("News server running on port 3000");
});

// Run immediately, then every 10 minutes
updateNews();
setInterval(updateNews, 10 * 60 * 1000); // 10 minutes