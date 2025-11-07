from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, doctors, appointments, schedules, patients, specialties, hospitals, hospital_manager
import os
from dotenv import load_dotenv

load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="HealthPort API",
    description="FastAPI backend for HealthPort appointment system",
    version="2.0.0"
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:5173",  # Vite dev server
]

# Add production URL if set
client_url = os.getenv("CLIENT_URL")
if client_url:
    origins.append(client_url)
    # Also allow without trailing slash
    if client_url.endswith("/"):
        origins.append(client_url.rstrip("/"))
    else:
        origins.append(client_url + "/")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(doctors.router, prefix="/api")
app.include_router(hospitals.router)
app.include_router(appointments.router, prefix="/api")
app.include_router(schedules.router, prefix="/api")
app.include_router(patients.router, prefix="/api")
app.include_router(specialties.router, prefix="/api")
app.include_router(hospital_manager.router)

@app.get("/api/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "ok",
        "message": "HealthPort FastAPI is running",
        "version": "2.0.0"
    }

@app.on_event("startup")
async def startup_event():
    """
    Test database connection on startup
    """
    try:
        # Test connection
        connection = engine.connect()
        connection.close()
        print("[SUCCESS] MySQL Database connected successfully")
        print(f"[SERVER] FastAPI running on http://localhost:{os.getenv('PORT', 5000)}")
        print(f"[DOCS] API documentation at http://localhost:{os.getenv('PORT', 5000)}/docs")
    except Exception as e:
        print(f"[ERROR] Database connection failed: {e}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
