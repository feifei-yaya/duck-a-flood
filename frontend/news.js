const API_BASE = "http://127.0.0.1:8000";

async function getFloodNews(city = "georgia") {
  const query = encodeURIComponent(`${city} flood`);
  const res = await fetch(`${API_BASE}/news?q=${query}&pageSize=10`);
  if (!res.ok) throw new Error(`Failed to fetch news: ${res.status}`);
  const data = await res.json();
  return data.articles ?? [];
}

async function renderNews() {
  const track = document.getElementById("news-track");
  track.innerHTML = "";

  try {
    const articles = await getFloodNews();

    if (!articles.length) {
      track.innerHTML =
        '<div class="news-article">No news available.</div>';
      return;
    }

    articles.forEach(article => {
      const div = document.createElement("div");
      div.className = "news-article";
      div.innerHTML = `
        <h3>
          <a href="${article.url}" target="_blank">
            ${article.title || "No title"}
          </a>
        </h3>
        <small>${article.source?.name || "Unknown"}</small>
      `;
      track.appendChild(div);
    });

    // Duplicate for seamless scroll
    track.innerHTML += track.innerHTML;

  } catch (err) {
    track.innerHTML =
      '<div class="news-article">Error loading news.</div>';
    console.error(err);
  }
}

renderNews();