// news.js (FRONTEND MODULE)
// This runs in the browser and calls your FastAPI backend.

const API_BASE = "http://127.0.0.1:8000";

export async function getFloodNews(city = "georgia") {
  const query = encodeURIComponent(`${city} flood`);
  const res = await fetch(`${API_BASE}/news?q=${query}&pageSize=10`);
  if (!res.ok) throw new Error(`Failed to fetch news: ${res.status}`);
  const data = await res.json();
  return data.articles ?? [];
}
const track = document.getElementById('news-track');
track.innerHTML = '';

if (!articles.length) {
  track.innerHTML = '<div class="news-article">No news available.</div>';
  return;
}

articles.forEach(article => {
  const div = document.createElement('div');
  div.className = "news-article";
  div.innerHTML = `
    <h3><a href="${article.url}" target="_blank">
      ${article.title || 'No title'}
    </a></h3>
    <small>${article.source?.name || 'Unknown'}</small>
  `;
  track.appendChild(div);
});

/* Duplicate content for seamless loop */
track.innerHTML += track.innerHTML;