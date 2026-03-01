const apiKey = 'YOUR_NEWSAPI_KEY_HERE'; // replace with your key

async function fetchFloodNews() {
    try {
        const url = `https://newsapi.org/v2/everything?q=flood&sortBy=publishedAt&language=en&pageSize=10&apiKey=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        return data.articles || [];
    } catch (err) {
        console.error('Failed to fetch news', err);
        return [];
    }
}

async function updateNewsFeed() {
    const articles = await fetchFloodNews();
    const track = document.querySelector('#news-feed .news-track');
    track.innerHTML = '';

    articles.forEach(article => {
        const div = document.createElement('div');
        div.className = 'news-article';
        div.innerHTML = `
            <a href="${article.url}" target="_blank">${article.title}</a>
            <small>${article.source.name} | ${new Date(article.publishedAt).toLocaleTimeString()}</small>
        `;
        track.appendChild(div);
    });
}

// Initial load
updateNewsFeed();

// Refresh every 60 seconds
setInterval(updateNewsFeed, 60*1000);