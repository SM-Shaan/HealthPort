"""
Seed data for HealthPort database
Populates all tables with comprehensive test data
"""
from datetime import datetime, date, time, timedelta
from sqlalchemy.orm import Session
from app.models import (
    WebUser, Admin, Hospital, HospitalManager, Doctor, Patient,
    Specialty, Schedule, Appointment, Notification
)
from app.database import SessionLocal

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

def seed_admin(db: Session):
    """Seed default admin user"""
    existing_admin = db.query(WebUser).filter(WebUser.email == "admin@healthport.com").first()
    if existing_admin:
        print("[SEED] Admin user already exists. Skipping...")
        return

    print("[SEED] Creating default admin user...")
    password = "admin123"

    admin_user = WebUser(email="admin@healthport.com", usertype="a")
    db.add(admin_user)
    db.flush()

    admin_profile = Admin(aemail="admin@healthport.com", apassword=password)
    db.add(admin_profile)

    db.commit()
    print(f"[SEED] Admin user created - Email: admin@healthport.com, Password: {password}")

def seed_hospitals(db: Session):
    """Seed hospital data"""
    admin = db.query(WebUser).filter(WebUser.email == "admin@healthport.com").first()
    if not admin:
        print("[SEED] Admin user must be created before hospitals. Skipping hospitals...")
        return

    hospitals_data = [
        {"name": "Apollo Hospital Dhaka", "address": "Plot 81, Block E, Bashundhara R/A, Dhaka 1229",
         "contact_no": "+8801777777777", "latitude": "23.8103", "longitude": "90.4125"},
        {"name": "Square Hospital", "address": "18/F, Bir Uttam Qazi Nuruzzaman Sarak, Dhaka 1205",
         "contact_no": "+8801888888888", "latitude": "23.7515", "longitude": "90.3771"},
        {"name": "United Hospital", "address": "Plot 15, Road 71, Gulshan, Dhaka 1212",
         "contact_no": "+8801999999999", "latitude": "23.8041", "longitude": "90.4152"},
        {"name": "Labaid Specialized Hospital", "address": "House 6, Road 4, Dhanmondi, Dhaka 1205",
         "contact_no": "+8801666666666", "latitude": "23.7937", "longitude": "90.4066"},
        {"name": "Ibn Sina Hospital", "address": "House 48, Road 9/A, Dhanmondi, Dhaka 1209",
         "contact_no": "+8801555555555", "latitude": "23.7644", "longitude": "90.3686"}
    ]

    existing_count = db.query(Hospital).count()
    if existing_count > 0:
        print(f"[SEED] Hospitals already exist ({existing_count} records). Skipping...")
        return

    print("[SEED] Adding hospitals...")
    for hospital_data in hospitals_data:
        hospital = Hospital(
            name=hospital_data["name"], address=hospital_data["address"],
            contact_no=hospital_data["contact_no"], admin_email="admin@healthport.com",
            latitude=hospital_data["latitude"], longitude=hospital_data["longitude"]
        )
        db.add(hospital)

    db.commit()
    print(f"[SEED] Added {len(hospitals_data)} hospitals")

def seed_hospital_managers(db: Session):
    """Seed hospital managers"""
    existing_count = db.query(HospitalManager).count()
    if existing_count > 0:
        print(f"[SEED] Hospital Managers already exist ({existing_count} records). Skipping...")
        return

    hospitals = db.query(Hospital).all()
    if not hospitals:
        print("[SEED] No hospitals found. Skipping managers...")
        return

    managers_data = [
        {"email": "manager1@hospital.com", "name": "Michael Anderson", "phone": "+8801711111111", "hospital_idx": 0},
        {"email": "manager2@hospital.com", "name": "Sarah Thompson", "phone": "+8801722222222", "hospital_idx": 1},
        {"email": "manager3@hospital.com", "name": "David Lee", "phone": "+8801733333333", "hospital_idx": 2},
    ]

    print("[SEED] Adding hospital managers...")
    for mgr_data in managers_data:
        # Add WebUser first
        web_user = WebUser(email=mgr_data["email"], usertype="h")  # Fixed: 'h' not 'm'
        db.add(web_user)
        db.flush()

        # Add Manager
        manager = HospitalManager(
            email=mgr_data["email"], name=mgr_data["name"],
            password="manager123", phone=mgr_data["phone"],
            hospital_id=hospitals[mgr_data["hospital_idx"]].hospital_id
        )
        db.add(manager)

    db.commit()
    print(f"[SEED] Added {len(managers_data)} hospital managers")

def seed_doctors(db: Session):
    """Seed doctors"""
    existing_count = db.query(Doctor).count()
    if existing_count > 0:
        print(f"[SEED] Doctors already exist ({existing_count} records). Skipping...")
        return

    hospitals = db.query(Hospital).all()
    specialties = db.query(Specialty).all()

    if not hospitals or not specialties:
        print("[SEED] Hospitals or specialties not found. Skipping doctors...")
        return

    doctors_data = [
        {"email": "dr.smith@healthport.com", "name": "Dr. John Smith", "nic": "1234567890123",
         "tel": "+8801733111111", "specialty": "Cardiology", "hospital_idx": 0},
        {"email": "dr.jones@healthport.com", "name": "Dr. Emily Jones", "nic": "2345678901234",
         "tel": "+8801744222222", "specialty": "Neurology", "hospital_idx": 0},
        {"email": "dr.wilson@healthport.com", "name": "Dr. Robert Wilson", "nic": "3456789012345",
         "tel": "+8801755333333", "specialty": "Orthopaedics", "hospital_idx": 1},
        {"email": "dr.brown@healthport.com", "name": "Dr. Lisa Brown", "nic": "4567890123456",
         "tel": "+8801766444444", "specialty": "Paediatrics", "hospital_idx": 1},
        {"email": "dr.taylor@healthport.com", "name": "Dr. James Taylor", "nic": "5678901234567",
         "tel": "+8801777555555", "specialty": "General Practice", "hospital_idx": 2},
    ]

    print("[SEED] Adding doctors...")
    specialty_map = {s.sname: s.id for s in specialties}

    for doc_data in doctors_data:
        # Add WebUser first
        web_user = WebUser(email=doc_data["email"], usertype="d")
        db.add(web_user)
        db.flush()

        # Add Doctor
        doctor = Doctor(
            docemail=doc_data["email"], docname=doc_data["name"],
            docpassword="doctor123", docnic=doc_data["nic"],
            doctel=doc_data["tel"],
            specialties=specialty_map.get(doc_data["specialty"], 1),
            hospital_id=hospitals[doc_data["hospital_idx"]].hospital_id
        )
        db.add(doctor)

    db.commit()
    print(f"[SEED] Added {len(doctors_data)} doctors")

def seed_patients(db: Session):
    """Seed patients"""
    existing_count = db.query(Patient).count()
    if existing_count > 0:
        print(f"[SEED] Patients already exist ({existing_count} records). Skipping...")
        return

    patients_data = [
        {"email": "john.doe@email.com", "name": "John Doe", "address": "789 Oak Street, Dhaka",
         "nic": "5678901234567", "dob": date(1990, 5, 15), "tel": "+8801777111111"},
        {"email": "jane.smith@email.com", "name": "Jane Smith", "address": "321 Elm Street, Dhaka",
         "nic": "6789012345678", "dob": date(1985, 8, 22), "tel": "+8801788222222"},
        {"email": "bob.johnson@email.com", "name": "Bob Johnson", "address": "654 Pine Avenue, Dhaka",
         "nic": "7890123456789", "dob": date(1995, 3, 10), "tel": "+8801799333333"},
        {"email": "alice.williams@email.com", "name": "Alice Williams", "address": "987 Maple Road, Dhaka",
         "nic": "8901234567890", "dob": date(2000, 11, 5), "tel": "+8801700444444"},
        {"email": "charlie.davis@email.com", "name": "Charlie Davis", "address": "159 Cedar Lane, Dhaka",
         "nic": "9012345678901", "dob": date(1988, 7, 30), "tel": "+8801711555555"},
    ]

    print("[SEED] Adding patients...")
    for pat_data in patients_data:
        # Add WebUser first
        web_user = WebUser(email=pat_data["email"], usertype="p")
        db.add(web_user)
        db.flush()

        # Add Patient
        patient = Patient(
            pemail=pat_data["email"], pname=pat_data["name"],
            ppassword="patient123", paddress=pat_data["address"],
            pnic=pat_data["nic"], pdob=pat_data["dob"], ptel=pat_data["tel"]
        )
        db.add(patient)

    db.commit()
    print(f"[SEED] Added {len(patients_data)} patients")

def seed_schedules(db: Session):
    """Seed doctor schedules"""
    existing_count = db.query(Schedule).count()
    if existing_count > 0:
        print(f"[SEED] Schedules already exist ({existing_count} records). Skipping...")
        return

    doctors = db.query(Doctor).all()
    if not doctors:
        print("[SEED] No doctors found. Skipping schedules...")
        return

    print("[SEED] Adding schedules for next 7 days...")
    schedules = []

    # Create schedules for the next 7 days
    for i in range(7):
        schedule_date = date.today() + timedelta(days=i)

        for idx, doctor in enumerate(doctors[:3]):  # First 3 doctors
            schedules.append(Schedule(
                docid=doctor.docid,
                title=f"Consultation - {doctor.docname}",
                scheduledate=schedule_date,
                scheduletime=time(9 + idx * 3, 0),  # 9:00, 12:00, 15:00
                nop=10
            ))

    db.add_all(schedules)
    db.commit()
    print(f"[SEED] Added {len(schedules)} schedules")

def seed_appointments(db: Session):
    """Seed appointments"""
    existing_count = db.query(Appointment).count()
    if existing_count > 0:
        print(f"[SEED] Appointments already exist ({existing_count} records). Skipping...")
        return

    patients = db.query(Patient).all()
    schedules = db.query(Schedule).all()

    if not patients or not schedules:
        print("[SEED] Patients or schedules not found. Skipping appointments...")
        return

    print("[SEED] Adding appointments...")
    appointments = []

    for i, schedule in enumerate(schedules[:10]):
        if i < len(patients):
            appointments.append(Appointment(
                pid=patients[i % len(patients)].pid,
                apponum=i % 10 + 1,
                scheduleid=schedule.scheduleid,
                appodate=datetime.combine(schedule.scheduledate, schedule.scheduletime)
            ))

    db.add_all(appointments)
    db.commit()
    print(f"[SEED] Added {len(appointments)} appointments")

def seed_notifications(db: Session):
    """Seed notifications"""
    existing_count = db.query(Notification).count()
    if existing_count > 0:
        print(f"[SEED] Notifications already exist ({existing_count} records). Skipping...")
        return

    patients = db.query(Patient).all()
    doctors = db.query(Doctor).all()

    if not patients or not doctors:
        print("[SEED] Patients or doctors not found. Skipping notifications...")
        return

    print("[SEED] Adding notifications...")
    notifications = [
        Notification(
            recipient_email=patients[0].pemail, recipient_type="patient",
            notification_type="appointment_booked", subject="Appointment Confirmed",
            message="Your appointment has been confirmed for tomorrow at 9:00 AM with Dr. John Smith.",
            sent_at=datetime.now(), status="sent"
        ),
        Notification(
            recipient_email=patients[1].pemail, recipient_type="patient",
            notification_type="appointment_reminder", subject="Appointment Reminder",
            message="Reminder: You have an appointment tomorrow at 2:00 PM.",
            sent_at=datetime.now(), status="sent"
        ),
        Notification(
            recipient_email=doctors[0].docemail, recipient_type="doctor",
            notification_type="new_appointment", subject="New Appointment Booked",
            message=f"A new appointment has been booked for your schedule on {date.today()}",
            sent_at=datetime.now(), status="sent"
        ),
    ]

    db.add_all(notifications)
    db.commit()
    print(f"[SEED] Added {len(notifications)} notifications")

def seed_database():
    """Main seeding function"""
    print("\n" + "="*60)
    print("HEALTHPORT DATABASE SEEDING")
    print("="*60 + "\n")

    db = SessionLocal()
    try:
        # Seed in order (respecting foreign key constraints)
        seed_admin(db)
        seed_specialties(db)
        seed_hospitals(db)
        seed_hospital_managers(db)
        seed_doctors(db)
        seed_patients(db)
        seed_schedules(db)
        seed_appointments(db)
        seed_notifications(db)

        print("\n" + "="*60)
        print("SEEDING COMPLETED SUCCESSFULLY!")
        print("="*60)
        print("\nTest Credentials:")
        print("-" * 60)
        print("Admin: admin@healthport.com | Password: admin123")
        print("\nManagers: manager1@hospital.com | Password: manager123")
        print("          manager2@hospital.com | Password: manager123")
        print("\nDoctors: dr.smith@healthport.com | Password: doctor123")
        print("         dr.jones@healthport.com | Password: doctor123")
        print("         dr.wilson@healthport.com | Password: doctor123")
        print("\nPatients: john.doe@email.com | Password: patient123")
        print("          jane.smith@email.com | Password: patient123")
        print("="*60 + "\n")

    except Exception as e:
        print(f"\n[ERROR] Seeding failed: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
