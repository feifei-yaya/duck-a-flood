const axios = require('axios');

// Function to fetch flood news
async function fetchFloodNews() {
    try {
        // Using NewsAPI (free tier available at newsapi.org)
        const apiKey = '6cf87caeaa834e3c935c7e82c35fc3b1'; // Get free key from newsapi.org
        const url = `https://newsapi.org/v2/everything?q=flood&sortBy=publishedAt&language=en&apiKey=${apiKey}`;

        const response = await axios.get(url);
        
        // Optionally add other news sources
        const sources = ['bbc-news', 'cnn', 'the-new-york-times', 'reuters'];
        const urlWithSources = `https://newsapi.org/v2/everything?q=flood&sortBy=publishedAt&language=en&sources=${sources.join(',')}&apiKey=${apiKey}`;
        const responseWithSources = await axios.get(urlWithSources);
        const articles = responseWithSources.data.articles.slice(0, 10); // Get top 10 articles

        console.log('Recent Flood News:');
        articles.forEach((article, index) => {
            console.log(`\n${index + 1}. ${article.title}`);
            console.log(`Source: ${article.source.name}`);
            console.log(`Time: ${article.publishedAt}`);
            console.log(`URL: ${article.url}`);
        });

        return articles;
    } catch (error) {
        console.error('Failed to fetch flood news, retrying in 5 mins:', error.message);
        setTimeout(fetchFloodNews, 300000); // Retry in 5 minutes (300000 ms)
    }
}

// Schedule to run every hour (3600000 ms)
setInterval(fetchFloodNews, 3600000);
setInterval(updateNews, 3600000);
// Run immediately on start
fetchFloodNews();

module.exports = { fetchFloodNews };

let latestNews = [];

async function updateNews() {
    latestNews = await fetchFloodNews();
    latestNews = latestNews.slice(0,10);
    
}
const express = require('express');
const app = express();
app.get('/news', (req, res) => {
    res.json(latestNews);
});
app.listen(3000, () => {
    console.log('News server running on port 3000');
});