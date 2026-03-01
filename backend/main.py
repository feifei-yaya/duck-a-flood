from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import requests

app = FastAPI()

# Allow your frontend to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:5173",  # if you later use Vite
        "http://localhost:5173"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

NEWS_API_KEY = os.getenv("NEWS_API_KEY")  # stored in .env or terminal environment

@app.get("/news")
def get_news(q: str = "texas flood", pageSize: int = 10):
    if not NEWS_API_KEY:
        return {"error": "NEWS_API_KEY is not set"}

    url = "https://newsapi.org/v2/everything"
    params = {
        "q": q,
        "language": "en",
        "pageSize": pageSize,
        "sortBy": "publishedAt",
        "apiKey": NEWS_API_KEY,
    }

    r = requests.get(url, params=params, timeout=10)
    r.raise_for_status()
    data = r.json()

    # Return only what your frontend needs
    articles = []
    for a in data.get("articles", []):
        articles.append({
            "title": a.get("title"),
            "url": a.get("url"),
            "description": a.get("description"),
            "publishedAt": a.get("publishedAt"),
            "source": {"name": (a.get("source") or {}).get("name")}
        })

    return {"articles": articles}