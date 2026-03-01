const axios = require('axios');

// Function to fetch flood news
async function fetchFloodNews() {
    try {
        // Using NewsAPI (free tier available at newsapi.org)
        const apiKey = 'YOUR_NEWS_API_KEY'; // Get free key from newsapi.org
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
        console.error('Error fetching news:', error.message);
    }
}

// Schedule to run every hour (3600000 ms)
setInterval(fetchFloodNews, 3600000);

// Run immediately on start
fetchFloodNews();

module.exports = { fetchFloodNews };