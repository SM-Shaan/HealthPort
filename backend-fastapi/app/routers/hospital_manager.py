from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime
from app.database import get_db
from app.models import HospitalManager, Hospital, Doctor, Patient, Appointment, Schedule, Specialty, WebUser
from app.schemas import (
    HospitalManagerResponse,
    HospitalResponse,
    DoctorResponse,
    DoctorCreate,
    AppointmentResponse,
    AppointmentCreate,
    AppointmentWithNewPatient,
    PatientResponse,
    PatientCreate,
    ScheduleResponse
)
from app.utils.notification import send_email_notification

router = APIRouter(
    prefix="/api/hospital-manager",
    tags=["hospital-manager"]
)

@router.get("/{manager_id}", response_model=HospitalManagerResponse)
async def get_manager_profile(manager_id: int, db: Session = Depends(get_db)):
    """Get hospital manager profile"""
    manager = db.query(HospitalManager).filter(HospitalManager.manager_id == manager_id).first()

    if not manager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hospital manager not found"
        )

    return manager

@router.get("/{manager_id}/hospital", response_model=HospitalResponse)
async def get_manager_hospital(manager_id: int, db: Session = Depends(get_db)):
    """Get hospital details for the manager"""
    manager = db.query(HospitalManager).filter(HospitalManager.manager_id == manager_id).first()

    if not manager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hospital manager not found"
        )

    hospital = db.query(Hospital).filter(Hospital.hospital_id == manager.hospital_id).first()

    if not hospital:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hospital not found"
        )

    return hospital

@router.get("/{manager_id}/doctors", response_model=List[DoctorResponse])
async def get_hospital_doctors(manager_id: int, db: Session = Depends(get_db)):
    """Get all doctors in the manager's hospital"""
    manager = db.query(HospitalManager).filter(HospitalManager.manager_id == manager_id).first()

    if not manager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hospital manager not found"
        )

    doctors = db.query(
        Doctor.docid,
        Doctor.docemail,
        Doctor.docname,
        Doctor.docnic,
        Doctor.doctel,
        Doctor.specialties,
        Specialty.sname.label("specialty_name")
    ).join(Specialty, Doctor.specialties == Specialty.id)\
     .filter(Doctor.hospital_id == manager.hospital_id)\
     .all()

    return [
        DoctorResponse(
            docid=doc.docid,
            docemail=doc.docemail,
            docname=doc.docname,
            docnic=doc.docnic,
            doctel=doc.doctel,
            specialties=doc.specialties,
            specialty_name=doc.specialty_name
        )
        for doc in doctors
    ]

@router.get("/{manager_id}/appointments", response_model=List[AppointmentResponse])
async def get_hospital_appointments(manager_id: int, db: Session = Depends(get_db)):
    """Get all appointments for the manager's hospital"""
    manager = db.query(HospitalManager).filter(HospitalManager.manager_id == manager_id).first()

    if not manager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hospital manager not found"
        )

    # Get appointments for all doctors in the hospital
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
     .filter(Doctor.hospital_id == manager.hospital_id)\
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

@router.get("/{manager_id}/patients", response_model=List[PatientResponse])
async def get_hospital_patients(manager_id: int, db: Session = Depends(get_db)):
    """Get all patients who have appointments at the manager's hospital"""
    manager = db.query(HospitalManager).filter(HospitalManager.manager_id == manager_id).first()

    if not manager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hospital manager not found"
        )

    # Get unique patients who have appointments with doctors in this hospital
    patients = db.query(Patient)\
        .join(Appointment, Patient.pid == Appointment.pid)\
        .join(Schedule, Appointment.scheduleid == Schedule.scheduleid)\
        .join(Doctor, Schedule.docid == Doctor.docid)\
        .filter(Doctor.hospital_id == manager.hospital_id)\
        .distinct()\
        .all()

    return patients

@router.get("/{manager_id}/schedules", response_model=List[ScheduleResponse])
async def get_hospital_schedules(manager_id: int, db: Session = Depends(get_db)):
    """Get all schedules for doctors in the manager's hospital"""
    manager = db.query(HospitalManager).filter(HospitalManager.manager_id == manager_id).first()

    if not manager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hospital manager not found"
        )

    schedules = db.query(
        Schedule.scheduleid,
        Schedule.docid,
        Schedule.title,
        Schedule.scheduledate,
        Schedule.scheduletime,
        Schedule.nop,
        Doctor.docname.label("doctor_name"),
        Specialty.sname.label("specialty_name")
    ).join(Doctor, Schedule.docid == Doctor.docid)\
     .join(Specialty, Doctor.specialties == Specialty.id)\
     .filter(Doctor.hospital_id == manager.hospital_id)\
     .all()

    # Get booked appointments count for each schedule
    result = []
    for schedule in schedules:
        booked_count = db.query(func.count(Appointment.appoid))\
            .filter(Appointment.scheduleid == schedule.scheduleid)\
            .scalar()

        result.append(ScheduleResponse(
            scheduleid=schedule.scheduleid,
            docid=schedule.docid,
            title=schedule.title,
            scheduledate=schedule.scheduledate,
            scheduletime=schedule.scheduletime,
            nop=schedule.nop,
            doctor_name=schedule.doctor_name,
            specialty_name=schedule.specialty_name,
            booked=booked_count,
            available_slots=schedule.nop - booked_count
        ))

    return result

@router.get("/{manager_id}/statistics")
async def get_hospital_statistics(manager_id: int, db: Session = Depends(get_db)):
    """Get statistics for the manager's hospital"""
    manager = db.query(HospitalManager).filter(HospitalManager.manager_id == manager_id).first()

    if not manager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hospital manager not found"
        )

    # Count doctors
    total_doctors = db.query(func.count(Doctor.docid))\
        .filter(Doctor.hospital_id == manager.hospital_id)\
        .scalar()

    # Count appointments
    total_appointments = db.query(func.count(Appointment.appoid))\
        .join(Schedule, Appointment.scheduleid == Schedule.scheduleid)\
        .join(Doctor, Schedule.docid == Doctor.docid)\
        .filter(Doctor.hospital_id == manager.hospital_id)\
        .scalar()

    # Count unique patients
    total_patients = db.query(func.count(func.distinct(Patient.pid)))\
        .join(Appointment, Patient.pid == Appointment.pid)\
        .join(Schedule, Appointment.scheduleid == Schedule.scheduleid)\
        .join(Doctor, Schedule.docid == Doctor.docid)\
        .filter(Doctor.hospital_id == manager.hospital_id)\
        .scalar()

    # Count schedules
    total_schedules = db.query(func.count(Schedule.scheduleid))\
        .join(Doctor, Schedule.docid == Doctor.docid)\
        .filter(Doctor.hospital_id == manager.hospital_id)\
        .scalar()

    return {
        "totalDoctors": total_doctors,
        "totalAppointments": total_appointments,
        "totalPatients": total_patients,
        "totalSchedules": total_schedules,
        "hospital_id": manager.hospital_id
    }

@router.post("/{manager_id}/doctors", response_model=DoctorResponse, status_code=status.HTTP_201_CREATED)
async def add_doctor(manager_id: int, doctor_data: DoctorCreate, db: Session = Depends(get_db)):
    """Add a new doctor to the manager's hospital"""

    # Verify manager exists and get their hospital
    manager = db.query(HospitalManager).filter(HospitalManager.manager_id == manager_id).first()
    if not manager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hospital manager not found"
        )

    # Check if email already exists
    existing_user = db.query(WebUser).filter(WebUser.email == doctor_data.docemail).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Verify specialty exists
    specialty = db.query(Specialty).filter(Specialty.id == doctor_data.specialties).first()
    if not specialty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Specialty not found"
        )

    # Override hospital_id with manager's hospital
    doctor_data.hospital_id = manager.hospital_id

    try:
        # Create webuser entry
        new_webuser = WebUser(
            email=doctor_data.docemail,
            usertype='d'  # 'd' for doctor
        )
        db.add(new_webuser)

        # Create doctor entry
        new_doctor = Doctor(
            docemail=doctor_data.docemail,
            docname=doctor_data.docname,
            docpassword=doctor_data.docpassword,
            docnic=doctor_data.docnic,
            doctel=doctor_data.doctel,
            specialties=doctor_data.specialties,
            hospital_id=manager.hospital_id
        )
        db.add(new_doctor)
        db.commit()
        db.refresh(new_doctor)

        # Send notification email to doctor
        try:
            send_email_notification(
                recipient_email=new_doctor.docemail,
                recipient_type="doctor",
                notification_type="account_created",
                subject="Welcome to HealthPort",
                message=f"Dear Dr. {new_doctor.docname},\n\nYour doctor account has been created by the hospital manager.\n\nEmail: {new_doctor.docemail}\n\nYou can now log in to the HealthPort system.\n\nBest regards,\nHealthPort Team",
                db=db
            )
        except Exception as e:
            # Don't fail the request if email fails
            print(f"Failed to send email notification: {e}")

        return DoctorResponse(
            docid=new_doctor.docid,
            docemail=new_doctor.docemail,
            docname=new_doctor.docname,
            docnic=new_doctor.docnic,
            doctel=new_doctor.doctel,
            specialties=new_doctor.specialties,
            specialty_name=specialty.sname
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create doctor: {str(e)}"
        )

@router.post("/{manager_id}/appointments", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
async def create_appointment(manager_id: int, appointment_data: AppointmentCreate, db: Session = Depends(get_db)):
    """Create a new appointment for a patient at the manager's hospital"""

    # Verify manager exists
    manager = db.query(HospitalManager).filter(HospitalManager.manager_id == manager_id).first()
    if not manager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hospital manager not found"
        )

    # Verify patient exists
    patient = db.query(Patient).filter(Patient.pid == appointment_data.patientId).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )

    # Verify schedule exists and belongs to manager's hospital
    schedule = db.query(Schedule).join(Doctor).filter(
        Schedule.scheduleid == appointment_data.scheduleId,
        Doctor.hospital_id == manager.hospital_id
    ).first()

    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found or does not belong to your hospital"
        )

    # Check if schedule is full
    booked_count = db.query(func.count(Appointment.appoid))\
        .filter(Appointment.scheduleid == appointment_data.scheduleId)\
        .scalar()

    if booked_count >= schedule.nop:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This schedule is fully booked"
        )

    # Check if patient already has appointment for this schedule
    existing_appointment = db.query(Appointment).filter(
        Appointment.pid == appointment_data.patientId,
        Appointment.scheduleid == appointment_data.scheduleId
    ).first()

    if existing_appointment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Patient already has an appointment for this schedule"
        )

    try:
        # Create appointment
        new_appointment = Appointment(
            pid=appointment_data.patientId,
            apponum=booked_count + 1,
            scheduleid=appointment_data.scheduleId,
            appodate=appointment_data.appointmentDate
        )
        db.add(new_appointment)
        db.commit()
        db.refresh(new_appointment)

        # Get doctor and specialty info
        doctor = db.query(Doctor).filter(Doctor.docid == schedule.docid).first()
        specialty = db.query(Specialty).filter(Specialty.id == doctor.specialties).first()

        # Send notification emails
        try:
            # Email to patient
            send_email_notification(
                recipient_email=patient.pemail,
                recipient_type="patient",
                notification_type="appointment_confirmation",
                subject="Appointment Confirmation",
                message=f"Dear {patient.pname},\n\nYour appointment has been booked:\n\nDoctor: Dr. {doctor.docname}\nSpecialty: {specialty.sname}\nDate: {schedule.scheduledate}\nTime: {schedule.scheduletime}\nAppointment Number: {new_appointment.apponum}\n\nPlease arrive 10 minutes early.\n\nBest regards,\nHealthPort Team",
                db=db
            )

            # Email to doctor
            send_email_notification(
                recipient_email=doctor.docemail,
                recipient_type="doctor",
                notification_type="new_appointment",
                subject="New Appointment Notification",
                message=f"Dear Dr. {doctor.docname},\n\nA new appointment has been booked by hospital manager:\n\nPatient: {patient.pname}\nDate: {schedule.scheduledate}\nTime: {schedule.scheduletime}\nAppointment Number: {new_appointment.apponum}\n\nBest regards,\nHealthPort Team",
                db=db
            )
        except Exception as e:
            # Don't fail the request if email fails
            print(f"Failed to send email notifications: {e}")

        return AppointmentResponse(
            appoid=new_appointment.appoid,
            pid=new_appointment.pid,
            apponum=new_appointment.apponum,
            scheduleid=new_appointment.scheduleid,
            appodate=new_appointment.appodate,
            patient_name=patient.pname,
            doctor_name=doctor.docname,
            schedule_title=schedule.title,
            specialty=specialty.sname
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create appointment: {str(e)}"
        )

@router.post("/{manager_id}/appointments/new-patient", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
async def create_appointment_with_new_patient(manager_id: int, appointment_data: AppointmentWithNewPatient, db: Session = Depends(get_db)):
    """Create a new patient and book an appointment for them at the manager's hospital"""

    # Verify manager exists
    manager = db.query(HospitalManager).filter(HospitalManager.manager_id == manager_id).first()
    if not manager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hospital manager not found"
        )

    # Check if email already exists
    existing_user = db.query(WebUser).filter(WebUser.email == appointment_data.pemail).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered. Please use the existing patient option."
        )

    # Verify schedule exists and belongs to manager's hospital
    schedule = db.query(Schedule).join(Doctor).filter(
        Schedule.scheduleid == appointment_data.scheduleId,
        Doctor.hospital_id == manager.hospital_id
    ).first()

    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found or does not belong to your hospital"
        )

    # Check if schedule is full
    booked_count = db.query(func.count(Appointment.appoid))\
        .filter(Appointment.scheduleid == appointment_data.scheduleId)\
        .scalar()

    if booked_count >= schedule.nop:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This schedule is fully booked"
        )

    try:
        # Create webuser entry for patient
        new_webuser = WebUser(
            email=appointment_data.pemail,
            usertype='p'  # 'p' for patient
        )
        db.add(new_webuser)

        # Create patient entry
        new_patient = Patient(
            pemail=appointment_data.pemail,
            pname=appointment_data.pname,
            ppassword=appointment_data.ppassword,
            paddress=appointment_data.paddress,
            pnic=appointment_data.pnic,
            pdob=appointment_data.pdob,
            ptel=appointment_data.ptel
        )
        db.add(new_patient)
        db.flush()  # Flush to get the patient ID

        # Create appointment
        new_appointment = Appointment(
            pid=new_patient.pid,
            apponum=booked_count + 1,
            scheduleid=appointment_data.scheduleId,
            appodate=appointment_data.appointmentDate
        )
        db.add(new_appointment)
        db.commit()
        db.refresh(new_appointment)

        # Get doctor and specialty info
        doctor = db.query(Doctor).filter(Doctor.docid == schedule.docid).first()
        specialty = db.query(Specialty).filter(Specialty.id == doctor.specialties).first()

        # Send notification emails
        try:
            # Email to patient
            send_email_notification(
                recipient_email=new_patient.pemail,
                recipient_type="patient",
                notification_type="account_and_appointment",
                subject="Welcome to HealthPort - Appointment Confirmation",
                message=f"Dear {new_patient.pname},\n\nYour account has been created and your appointment has been booked:\n\nEmail: {new_patient.pemail}\nDoctor: Dr. {doctor.docname}\nSpecialty: {specialty.sname}\nDate: {schedule.scheduledate}\nTime: {schedule.scheduletime}\nAppointment Number: {new_appointment.apponum}\n\nPlease arrive 10 minutes early.\n\nYou can now log in to HealthPort to manage your appointments.\n\nBest regards,\nHealthPort Team",
                db=db
            )

            # Email to doctor
            send_email_notification(
                recipient_email=doctor.docemail,
                recipient_type="doctor",
                notification_type="new_appointment",
                subject="New Appointment Notification",
                message=f"Dear Dr. {doctor.docname},\n\nA new appointment has been booked by hospital manager:\n\nPatient: {new_patient.pname} (New Patient)\nEmail: {new_patient.pemail}\nDate: {schedule.scheduledate}\nTime: {schedule.scheduletime}\nAppointment Number: {new_appointment.apponum}\n\nBest regards,\nHealthPort Team",
                db=db
            )
        except Exception as e:
            # Don't fail the request if email fails
            print(f"Failed to send email notifications: {e}")

        return AppointmentResponse(
            appoid=new_appointment.appoid,
            pid=new_appointment.pid,
            apponum=new_appointment.apponum,
            scheduleid=new_appointment.scheduleid,
            appodate=new_appointment.appodate,
            patient_name=new_patient.pname,
            doctor_name=doctor.docname,
            schedule_title=schedule.title,
            specialty=specialty.sname
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create patient and appointment: {str(e)}"
        )
