from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, doctors, appointments, schedules, patients, specialties, hospitals, hospital_manager, diagnosis
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

# Add production URLs if set
client_url = os.getenv("CLIENT_URL")
if client_url:
    # Support comma-separated URLs
    for url in client_url.split(","):
        url = url.strip()
        origins.append(url)
        # Also allow without trailing slash
        if url.endswith("/"):
            origins.append(url.rstrip("/"))
        else:
            origins.append(url + "/")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",  # Allow all Vercel deployments
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
app.include_router(diagnosis.router, prefix="/api")  # AI diagnosis integration

@app.get("/")
async def root():
    """
    Root endpoint - API information
    """
    return {
        "name": "HealthPort API",
        "version": "2.0.0",
        "description": "Hospital appointment management system API",
        "status": "running",
        "endpoints": {
            "documentation": "/docs",
            "openapi_schema": "/openapi.json",
            "health_check": "/api/health"
        },
        "api_routes": {
            "auth": "/api/auth",
            "doctors": "/api/doctors",
            "appointments": "/api/appointments",
            "schedules": "/api/schedules",
            "patients": "/api/patients",
            "specialties": "/api/specialties",
            "hospitals": "/api/hospitals",
            "hospital_manager": "/api/hospital-manager"
        }
    }

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

@app.get("/api/debug/admin")
async def debug_admin():
    """
    Debug endpoint to check if admin exists (REMOVE IN PRODUCTION!)
    """
    from app.database import SessionLocal
    from app.models import WebUser, Admin

    db = SessionLocal()
    try:
        webuser = db.query(WebUser).filter(WebUser.email == 'admin@healthport.com').first()
        admin = db.query(Admin).filter(Admin.aemail == 'admin@healthport.com').first()

        return {
            "webuser_exists": webuser is not None,
            "webuser_type": webuser.usertype if webuser else None,
            "admin_exists": admin is not None,
            "admin_has_password": bool(admin.apassword) if admin else False,
            "password_length": len(admin.apassword) if admin and admin.apassword else 0
        }
    finally:
        db.close()

@app.get("/api/debug/fix-admin-password")
async def fix_admin_password():
    """
    One-time fix: Update admin password from bcrypt hash to plain text
    REMOVE IN PRODUCTION!
    """
    from app.database import SessionLocal
    from app.models import Admin

    db = SessionLocal()
    try:
        admin = db.query(Admin).filter(Admin.aemail == 'admin@healthport.com').first()

        if not admin:
            return {"status": "error", "message": "Admin user not found"}

        old_length = len(admin.apassword)

        # Check if password is hashed (bcrypt hashes are 60 chars)
        if old_length == 60:
            admin.apassword = "admin123"
            db.commit()
            return {
                "status": "success",
                "message": "Password updated from bcrypt hash to plain text",
                "old_length": old_length,
                "new_length": 8,
                "new_password": "admin123"
            }
        else:
            return {
                "status": "skipped",
                "message": "Password is already plain text",
                "password_length": old_length
            }

    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        db.close()

@app.get("/api/debug/test-admin-login")
async def test_admin_login():
    """
    Debug: Test admin login step by step
    """
    from app.database import SessionLocal
    from app.models import WebUser, Admin

    db = SessionLocal()
    try:
        test_email = "admin@healthport.com"
        test_password = "admin123"

        # Step 1: Check WebUser
        webuser = db.query(WebUser).filter(WebUser.email == test_email).first()
        if not webuser:
            return {"step": "webuser", "status": "FAIL", "message": "WebUser not found"}

        # Step 2: Check usertype
        if webuser.usertype != 'a':
            return {"step": "usertype", "status": "FAIL", "usertype": webuser.usertype}

        # Step 3: Check Admin
        admin = db.query(Admin).filter(Admin.aemail == test_email).first()
        if not admin:
            return {"step": "admin", "status": "FAIL", "message": "Admin profile not found"}

        # Step 4: Check password
        password_match = (admin.apassword == test_password)

        return {
            "step": "complete",
            "status": "SUCCESS" if password_match else "FAIL",
            "webuser_exists": True,
            "webuser_type": webuser.usertype,
            "admin_exists": True,
            "stored_password": admin.apassword,
            "test_password": test_password,
            "password_match": password_match,
            "password_length": len(admin.apassword)
        }

    finally:
        db.close()

@app.on_event("startup")
async def startup_event():
    """
    Test database connection, create tables, and seed initial data on startup
    """
    try:
        # Test connection
        connection = engine.connect()
        connection.close()
        print("[SUCCESS] MySQL Database connected successfully")

        # Create all tables if they don't exist
        print("[DATABASE] Creating tables if they don't exist...")
        Base.metadata.create_all(bind=engine)
        print("[SUCCESS] Database tables ready")

        # Seed initial data (specialties, hospitals, admin user)
        try:
            from seed_data import seed_database
            seed_database()
        except Exception as seed_error:
            print(f"[WARNING] Seeding failed (this is normal if data already exists): {seed_error}")

        print(f"[SERVER] FastAPI running on http://localhost:{os.getenv('PORT', 5000)}")
        print(f"[DOCS] API documentation at http://localhost:{os.getenv('PORT', 5000)}/docs")
    except Exception as e:
        print(f"[ERROR] Database connection failed: {e}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
