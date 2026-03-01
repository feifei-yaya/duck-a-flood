// news.js (FRONTEND MODULE)
// This runs in the browser and calls your FastAPI backend.

const API_BASE = "http://127.0.0.1:8000";

export async function getFloodNews() {
  const res = await fetch(`${API_BASE}/news?q=texas%20flood&pageSize=10`);
  if (!res.ok) throw new Error(`Failed to fetch news: ${res.status}`);
  const data = await res.json();
  return data.articles ?? [];
}