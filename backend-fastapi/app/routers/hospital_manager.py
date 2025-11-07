from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.database import get_db
from app.models import HospitalManager, Hospital, Doctor, Patient, Appointment, Schedule, Specialty
from app.schemas import (
    HospitalManagerResponse,
    HospitalResponse,
    DoctorResponse,
    AppointmentResponse,
    PatientResponse,
    ScheduleResponse
)

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
