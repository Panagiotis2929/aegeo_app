from fastapi import FastAPI
from pydantic import BaseModel
import httpx
import os

app = FastAPI()

class TripRequest(BaseModel):
    departure: str
    budget: int
    days: int
    styles: list

@app.post("/api/generate-trip")
async def generate_trip(request: TripRequest):
    api_key = os.getenv("ANTHROPIC_API_KEY")
    # Εδώ μπαίνει η λογική κλήσης της Anthropic
    return {"message": "Το πλάνο σου θα δημιουργηθεί εδώ από την AI"}