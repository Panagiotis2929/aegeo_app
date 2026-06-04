from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(
    title="Aegeo Premium AI Trip API",
    description="The cutting-edge backend engine powering Aegeo Trip Planner.",
    version="2.0.0"
)

# --- MODELS (Καθαρή αρχιτεκτονική δεδομένων) ---

class Activity(BaseModel):
    id: int
    title: str
    time_of_day: str  # Πρωί, Μεσημέρι, Βράδυ
    description: str
    duration_hours: float
    location_name: str
    coordinates: Optional[dict] = None  # {"lat": float, "lng": float} για τον χάρτη

class DayPlan(BaseModel):
    day_number: int
    theme: str
    activities: List[Activity]

class TripPlanResponse(BaseModel):
    destination: str
    total_days: int
    trip_style: str
    itinerary: List[DayPlan]


# --- THE PREMIUM REPOSITORY (Η έξυπνη "βάση" μας) ---

# Προσομοίωση βάσης με πλούσιο περιεχόμενο για δοκιμές
destinations_data = {
    "Naxos": {
        "Adventure": [
            DayPlan(
                day_number=1,
                theme="Trekking & Sunset Photography",
                activities=[
                    Activity(id=101, title="High-Altitude Hike to Mount Zeus", time_of_day="Πρωί", description="Απαιτητική πεζοπορία στην κορυφή του Κυκλαδικού συμπλέγματος με πανοραμική θέα.", duration_hours=4.5, location_name="Mount Zeus Trailhead"),
                    Activity(id=102, title="Local Cycladic Feast", time_of_day="Μεσημέρι", description="Παραδοσιακό γεύμα στο ορεινό χωριό Φιλώτι για αναπλήρωση ενέργειας.", duration_hours=1.5, location_name="Filoti Village"),
                    Activity(id=103, title="Golden Hour at Portara", time_of_day="Βράδυ", description="Φωτογράφιση του ηλιοβασιλέματος στον εμβληματικό ναό του Απόλλωνα.", duration_hours=2.0, location_name="Chora Portara")
                ]
            ),
            DayPlan(
                day_number=2,
                theme="Water Sports & Coastline Exploration",
                activities=[
                    Activity(id=104, title="Windsurfing Session", time_of_day="Πρωί", description="Μάθημα ή ελεύθερο ride σε ένα από τα παγκοσμίως κορυφαία spots.", duration_hours=3.0, location_name="Mikri Vigla Beach"),
                    Activity(id=105, title="Seafood & Chill", time_of_day="Μεσημέρι", description="Φρέσκο ψάρι πάνω στο κύμα μακριά από την πολυκοσμία.", duration_hours=2.0, location_name="Agiassos Tavern")
                ]
            )
        ],
        "Relax": [
            DayPlan(
                day_number=1,
                theme="Beach Hopping & Chora Alleyways",
                activities=[
                    Activity(id=106, title="Sunbathing & Crystal Waters", time_of_day="Πρωί", description="Χαλάρωση στις χρυσές αμμουδιές της Νάξου.", duration_hours=4.0, location_name="Agios Prokopios Beach"),
                    Activity(id=107, title="Exploration of the Venetian Castle", time_of_day="Βράδυ", description="Ατμοσφαιρικός περίπατος στα στενά του Κάστρου με στάση για cocktail.", duration_hours=3.0, location_name="Naxos Kastro")
                ]
            )
        ]
    }
}


# --- ENDPOINTS (The Core Engine) ---

@app.get("/", tags=["System"])
def system_status():
    return {
        "app": "Aegeo Engine",
        "status": "Fully Operational",
        "developer_mode": "Protoporos Mode ON"
    }

# Το "Μαγικό" Endpoint που θα καλεί το Frontend
@app.get("/api/v1/planner", response_model=TripPlanResponse, tags=["AI Planner"])
def generate_trip(
    destination: str = Query(..., description="Το νησί ή η περιοχή (π.χ. Naxos)"),
    style: str = Query("Adventure", description="Στυλ ταξιδιού: Adventure, Relax, Culture"),
    days: int = Query(2, description="Αριθμός ημερών (1-5)")
):
    # Μετατροπή πρώτου γράμματος σε κεφαλαίο για σιγουριά
    dest_key = destination.capitalize()
    style_key = style.capitalize()

    if dest_key not in destinations_data:
        raise HTTPException(status_code=404, detail=f"Ο προορισμός '{destination}' δεν υποστηρίζεται ακόμα. Δοκίμασε 'Naxos'!")
    
    if style_key not in destinations_data[dest_key]:
        raise HTTPException(status_code=400, detail=f"Το στυλ '{style}' δεν είναι διαθέσιμο για αυτόν τον προορισμό. Δοκίμασε 'Adventure' ή 'Relax'.")

    # Παίρνουμε το έτοιμο itinerary και κόβουμε ανάλογα με τις ημέρες που ζήτησε ο χρήστης
    full_itinerary = destinations_data[dest_key][style_key]
    sliced_itinerary = full_itinerary[:days]

    return TripPlanResponse(
        destination=dest_key,
        total_days=len(sliced_itinerary),
        trip_style=style_key,
        itinerary=sliced_itinerary
    )