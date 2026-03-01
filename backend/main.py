from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model import score_city

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], #asterisk because should be able to receive from any frontend website 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def main():
    return {"status": "ok"}


@app.get('/score')
def score(city: str):
    return {"risk_score": score_city(city), "city": city}