from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from app.database import get_db
from app.models import Appointment, Patient, Schedule, Doctor, Specialty, Notification, Hospital
from app.schemas import AppointmentCreate, AppointmentResponse
from app.utils.notification import notification_service
from typing import List

router = APIRouter(prefix="/appointments", tags=["appointments"])

@router.get("/", response_model=List[AppointmentResponse])
async def get_all_appointments(db: Session = Depends(get_db)):
    """
    Get all appointments with full details
    """
    appointments = db.query(
        Appointment.appoid,
        Appointment.pid,
        Appointment.apponum,
        Appointment.scheduleid,
        Appointment.appodate,
        Patient.pname.label("patient_name"),
        Doctor.docname.label("doctor_name"),
        Schedule.title.label("schedule_title"),
        Specialty.sname.label("specialty")
    ).outerjoin(Patient, Appointment.pid == Patient.pid)\
     .outerjoin(Schedule, Appointment.scheduleid == Schedule.scheduleid)\
     .outerjoin(Doctor, Schedule.docid == Doctor.docid)\
     .outerjoin(Specialty, Doctor.specialties == Specialty.id)\
     .all()

    return [
        AppointmentResponse(
            appoid=app.appoid,
            pid=app.pid,
            apponum=app.apponum,
            scheduleid=app.scheduleid,
            appodate=app.appodate,
            patient_name=app.patient_name,
            doctor_name=app.doctor_name,
            schedule_title=app.schedule_title,
            specialty=app.specialty
        )
        for app in appointments
    ]

@router.get("/{appointment_id}", response_model=AppointmentResponse)
async def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    """
    Get specific appointment by ID
    """
    appointment = db.query(
        Appointment.appoid,
        Appointment.pid,
        Appointment.apponum,
        Appointment.scheduleid,
        Appointment.appodate,
        Patient.pname.label("patient_name"),
        Doctor.docname.label("doctor_name"),
        Schedule.title.label("schedule_title"),
        Specialty.sname.label("specialty")
    ).outerjoin(Patient, Appointment.pid == Patient.pid)\
     .outerjoin(Schedule, Appointment.scheduleid == Schedule.scheduleid)\
     .outerjoin(Doctor, Schedule.docid == Doctor.docid)\
     .outerjoin(Specialty, Doctor.specialties == Specialty.id)\
     .filter(Appointment.appoid == appointment_id)\
     .first()

    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    return AppointmentResponse(
        appoid=appointment.appoid,
        pid=appointment.pid,
        apponum=appointment.apponum,
        scheduleid=appointment.scheduleid,
        appodate=appointment.appodate,
        patient_name=appointment.patient_name,
        doctor_name=appointment.doctor_name,
        schedule_title=appointment.schedule_title,
        specialty=appointment.specialty
    )

@router.get("/patient/{patient_id}", response_model=List[AppointmentResponse])
async def get_patient_appointments(patient_id: int, db: Session = Depends(get_db)):
    """
    Get all appointments for a specific patient
    """
    appointments = db.query(
        Appointment.appoid,
        Appointment.pid,
        Appointment.apponum,
        Appointment.scheduleid,
        Appointment.appodate,
        Patient.pname.label("patient_name"),
        Doctor.docname.label("doctor_name"),
        Schedule.title.label("schedule_title"),
        Specialty.sname.label("specialty")
    ).outerjoin(Patient, Appointment.pid == Patient.pid)\
     .outerjoin(Schedule, Appointment.scheduleid == Schedule.scheduleid)\
     .outerjoin(Doctor, Schedule.docid == Doctor.docid)\
     .outerjoin(Specialty, Doctor.specialties == Specialty.id)\
     .filter(Appointment.pid == patient_id)\
     .all()

    return [
        AppointmentResponse(
            appoid=app.appoid,
            pid=app.pid,
            apponum=app.apponum,
            scheduleid=app.scheduleid,
            appodate=app.appodate,
            patient_name=app.patient_name,
            doctor_name=app.doctor_name,
            schedule_title=app.schedule_title,
            specialty=app.specialty
        )
        for app in appointments
    ]

@router.get("/doctor/{doctor_id}", response_model=List[AppointmentResponse])
async def get_doctor_appointments(doctor_id: int, db: Session = Depends(get_db)):
    """
    Get all appointments for a specific doctor
    """
    appointments = db.query(
        Appointment.appoid,
        Appointment.pid,
        Appointment.apponum,
        Appointment.scheduleid,
        Appointment.appodate,
        Patient.pname.label("patient_name"),
        Doctor.docname.label("doctor_name"),
        Schedule.title.label("schedule_title"),
        Specialty.sname.label("specialty")
    ).outerjoin(Patient, Appointment.pid == Patient.pid)\
     .outerjoin(Schedule, Appointment.scheduleid == Schedule.scheduleid)\
     .outerjoin(Doctor, Schedule.docid == Doctor.docid)\
     .outerjoin(Specialty, Doctor.specialties == Specialty.id)\
     .filter(Schedule.docid == doctor_id)\
     .all()

    return [
        AppointmentResponse(
            appoid=app.appoid,
            pid=app.pid,
            apponum=app.apponum,
            scheduleid=app.scheduleid,
            appodate=app.appodate,
            patient_name=app.patient_name,
            doctor_name=app.doctor_name,
            schedule_title=app.schedule_title,
            specialty=app.specialty
        )
        for app in appointments
    ]

@router.post("/", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
async def create_appointment(request: AppointmentCreate, db: Session = Depends(get_db)):
    """
    Create a new appointment
    """
    # Get current count for this schedule
    count = db.query(func.count(Appointment.appoid))\
              .filter(Appointment.scheduleid == request.scheduleId)\
              .scalar()

    appointment_number = count + 1

    # Check if schedule exists and has capacity
    schedule = db.query(Schedule).filter(Schedule.scheduleid == request.scheduleId).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    if appointment_number > schedule.nop:
        raise HTTPException(status_code=400, detail="Schedule is full")

    # Create appointment
    new_appointment = Appointment(
        pid=request.patientId,
        apponum=appointment_number,
        scheduleid=request.scheduleId,
        appodate=request.appointmentDate
    )

    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)

    # Get full appointment details including patient and doctor info
    appointment = db.query(
        Appointment.appoid,
        Appointment.pid,
        Appointment.apponum,
        Appointment.scheduleid,
        Appointment.appodate,
        Patient.pname.label("patient_name"),
        Patient.pemail.label("patient_email"),
        Doctor.docname.label("doctor_name"),
        Doctor.docemail.label("doctor_email"),
        Doctor.hospital_id.label("hospital_id"),
        Schedule.title.label("schedule_title"),
        Specialty.sname.label("specialty")
    ).outerjoin(Patient, Appointment.pid == Patient.pid)\
     .outerjoin(Schedule, Appointment.scheduleid == Schedule.scheduleid)\
     .outerjoin(Doctor, Schedule.docid == Doctor.docid)\
     .outerjoin(Specialty, Doctor.specialties == Specialty.id)\
     .filter(Appointment.appoid == new_appointment.appoid)\
     .first()

    # Get hospital name
    hospital_name = "HealthPort"
    if appointment.hospital_id:
        hospital = db.query(Hospital).filter(Hospital.hospital_id == appointment.hospital_id).first()
        if hospital:
            hospital_name = hospital.name

    # Send notification to patient
    try:
        patient_notification_sent = notification_service.send_appointment_confirmation(
            patient_email=appointment.patient_email,
            patient_name=appointment.patient_name,
            doctor_name=appointment.doctor_name,
            appointment_date=appointment.appodate,
            appointment_number=appointment_number,
            hospital_name=hospital_name
        )

        # Log patient notification
        patient_notif = Notification(
            recipient_email=appointment.patient_email,
            recipient_type="patient",
            notification_type="appointment_booked",
            subject=f"Appointment Confirmation - {hospital_name}",
            message=f"Appointment #{appointment_number} with Dr. {appointment.doctor_name}",
            sent_at=datetime.now(),
            status="sent" if patient_notification_sent else "failed"
        )
        db.add(patient_notif)

        # Send notification to doctor
        doctor_notification_sent = notification_service.send_doctor_appointment_notification(
            doctor_email=appointment.doctor_email,
            doctor_name=appointment.doctor_name,
            patient_name=appointment.patient_name,
            appointment_date=appointment.appodate,
            appointment_number=appointment_number
        )

        # Log doctor notification
        doctor_notif = Notification(
            recipient_email=appointment.doctor_email,
            recipient_type="doctor",
            notification_type="appointment_booked",
            subject="New Appointment Booked",
            message=f"Appointment #{appointment_number} with {appointment.patient_name}",
            sent_at=datetime.now(),
            status="sent" if doctor_notification_sent else "failed"
        )
        db.add(doctor_notif)

        db.commit()
    except Exception as e:
        print(f"Error sending notifications: {str(e)}")
        # Don't fail the appointment creation if notifications fail

    return AppointmentResponse(
        appoid=appointment.appoid,
        pid=appointment.pid,
        apponum=appointment.apponum,
        scheduleid=appointment.scheduleid,
        appodate=appointment.appodate,
        patient_name=appointment.patient_name,
        doctor_name=appointment.doctor_name,
        schedule_title=appointment.schedule_title,
        specialty=appointment.specialty
    )

@router.delete("/{appointment_id}")
async def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    """
    Delete an appointment
    """
    appointment = db.query(Appointment).filter(Appointment.appoid == appointment_id).first()

    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    db.delete(appointment)
    db.commit()

    return {"message": "Appointment deleted successfully"}
