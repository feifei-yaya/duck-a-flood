const express = require('express');
const axios = require('axios');
const app = express();
let latestNews = [];

async function updateNews() {
    try {
        const apiKey = 'YOUR_NEWSAPI_KEY';
        const url = `https://newsapi.org/v2/everything?q=flood&sortBy=publishedAt&language=en&apiKey=${apiKey}`;
        const res = await axios.get(url);
        latestNews = res.data.articles.slice(0, 10);
    } catch (err) {
        console.error(err);
    }
}

// Update on start and every 5 minutes
updateNews();
setInterval(updateNews, 5 * 60 * 1000);

// Serve news
app.get('/news', (req, res) => {
    res.json(latestNews);
});

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

app.listen(3000, () => console.log('Server running on port 3000'));