from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import requests
from model import score_city 

app = FastAPI()

# Allow your frontend to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

NEWS_API_KEY = os.getenv("NEWS_API_KEY")  # stored in .env or terminal environment

@app.get("/health") 
async def main(): 
    return {"status": "ok"} 
@app.get('/score') # gets request from frontend def 
def score(city: str): 
    return {"risk_score": score_city(city), "city": city}

@app.get("/news")
def get_news(q: str = "georgia flood", pageSize: int = 10):
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