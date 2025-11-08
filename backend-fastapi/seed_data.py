"""
Seed data for HealthPort database
Populates initial specialties, hospitals, and admin user
"""
from sqlalchemy.orm import Session
from app.models import Specialty, Hospital, WebUser, Admin
from app.database import SessionLocal, engine

def seed_specialties(db: Session):
    """Seed medical specialties"""
    specialties_data = [
        "Accident and Emergency Medicine", "Allergology", "Anaesthetics", "Biological Hematology",
        "Cardiology", "Child Psychiatry", "Clinical Biology", "Clinical Chemistry",
        "Clinical Neurophysiology", "Clinical Radiology", "Dental, Oral and Maxillo-Facial Surgery",
        "Dermato-Venereology", "Dermatology", "Endocrinology", "Gastro-Enterologic Surgery",
        "Gastroenterology", "General Hematology", "General Practice", "General Surgery",
        "Geriatrics", "Immunology", "Infectious Diseases", "Internal Medicine",
        "Laboratory Medicine", "Maxillo-Facial Surgery", "Microbiology", "Nephrology",
        "Neuro-Psychiatry", "Neurology", "Neurosurgery", "Nuclear Medicine",
        "Obstetrics and Gynecology", "Occupational Medicine", "Ophthalmology",
        "Orthopaedics", "Otorhinolaryngology", "Paediatric Surgery", "Paediatrics",
        "Pathology", "Pharmacology", "Physical Medicine and Rehabilitation",
        "Plastic Surgery", "Podiatric Medicine", "Podiatric Surgery", "Psychiatry",
        "Public Health and Preventive Medicine", "Radiology", "Radiotherapy",
        "Respiratory Medicine", "Rheumatology", "Stomatology", "Thoracic Surgery",
        "Tropical Medicine", "Urology", "Vascular Surgery", "Venereology"
    ]

    existing_count = db.query(Specialty).count()
    if existing_count > 0:
        print(f"[SEED] Specialties already exist ({existing_count} records). Skipping...")
        return

    print("[SEED] Adding specialties...")
    for idx, name in enumerate(specialties_data, start=1):
        specialty = Specialty(id=idx, sname=name)
        db.add(specialty)

    db.commit()
    print(f"[SEED] Added {len(specialties_data)} specialties")

def seed_hospitals(db: Session):
    """Seed hospital data"""
    # First ensure admin exists
    admin = db.query(WebUser).filter(WebUser.email == "admin@healthport.com").first()
    if not admin:
        print("[SEED] Admin user must be created before hospitals. Skipping hospitals...")
        return

    hospitals_data = [
        {
            "name": "Apollo Hospital Dhaka",
            "address": "Plot 81, Block E, Bashundhara R/A, Dhaka 1229",
            "contact_no": "+8801777777777",
            "latitude": "23.8103",
            "longitude": "90.4125"
        },
        {
            "name": "Square Hospital",
            "address": "18/F, Bir Uttam Qazi Nuruzzaman Sarak, Dhaka 1205",
            "contact_no": "+8801888888888",
            "latitude": "23.7515",
            "longitude": "90.3771"
        },
        {
            "name": "United Hospital",
            "address": "Plot 15, Road 71, Gulshan, Dhaka 1212",
            "contact_no": "+8801999999999",
            "latitude": "23.8041",
            "longitude": "90.4152"
        },
        {
            "name": "Labaid Specialized Hospital",
            "address": "House 6, Road 4, Dhanmondi, Dhaka 1205",
            "contact_no": "+8801666666666",
            "latitude": "23.7937",
            "longitude": "90.4066"
        },
        {
            "name": "Ibn Sina Hospital",
            "address": "House 48, Road 9/A, Dhanmondi, Dhaka 1209",
            "contact_no": "+8801555555555",
            "latitude": "23.7644",
            "longitude": "90.3686"
        }
    ]

    existing_count = db.query(Hospital).count()
    if existing_count > 0:
        print(f"[SEED] Hospitals already exist ({existing_count} records). Skipping...")
        return

    print("[SEED] Adding hospitals...")
    for hospital_data in hospitals_data:
        hospital = Hospital(
            name=hospital_data["name"],
            address=hospital_data["address"],
            contact_no=hospital_data["contact_no"],
            admin_email="admin@healthport.com",
            latitude=hospital_data["latitude"],
            longitude=hospital_data["longitude"]
        )
        db.add(hospital)

    db.commit()
    print(f"[SEED] Added {len(hospitals_data)} hospitals")

def seed_admin(db: Session):
    """Seed default admin user"""
    # Check if admin already exists
    existing_admin = db.query(WebUser).filter(WebUser.email == "admin@healthport.com").first()
    if existing_admin:
        print("[SEED] Admin user already exists. Skipping...")
        return

    print("[SEED] Creating default admin user...")

    # Password (stored as plain text to match existing system pattern)
    password = "admin123"

    admin_user = WebUser(
        email="admin@healthport.com",
        usertype="a"  # 'a' for admin
    )
    db.add(admin_user)
    db.flush()  # Get the ID

    # Create admin profile
    admin_profile = Admin(
        aemail="admin@healthport.com",
        apassword=password
    )
    db.add(admin_profile)

    db.commit()
    print(f"[SEED] Admin user created - Email: admin@healthport.com, Password: {password}")
    print("[SEED] ⚠️  IMPORTANT: Change the default password after first login!")

def seed_database():
    """Main seeding function"""
    print("\n[SEED] Starting database seeding...")
    db = SessionLocal()
    try:
        seed_admin(db)  # Admin must be created first (hospitals reference admin)
        seed_specialties(db)
        seed_hospitals(db)
        print("[SEED] Database seeding completed successfully!\n")
    except Exception as e:
        print(f"[ERROR] Seeding failed: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
