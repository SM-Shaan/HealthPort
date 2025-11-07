from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from app.database import get_db
from app.models import Schedule, Doctor, Specialty, Appointment
from app.schemas import ScheduleCreate, ScheduleResponse
from typing import List

router = APIRouter(prefix="/schedules", tags=["schedules"])

@router.get("/", response_model=List[ScheduleResponse])
async def get_all_schedules(db: Session = Depends(get_db)):
    """
    Get all schedules
    """
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
     .all()

    result = []
    for sched in schedules:
        booked = db.query(func.count(Appointment.appoid))\
                   .filter(Appointment.scheduleid == sched.scheduleid)\
                   .scalar()

        result.append(ScheduleResponse(
            scheduleid=sched.scheduleid,
            docid=sched.docid,
            title=sched.title,
            scheduledate=sched.scheduledate,
            scheduletime=sched.scheduletime,
            nop=sched.nop,
            doctor_name=sched.doctor_name,
            specialty_name=sched.specialty_name,
            booked=booked,
            available_slots=sched.nop - booked
        ))

    return result

@router.get("/available/upcoming", response_model=List[ScheduleResponse])
async def get_available_schedules(db: Session = Depends(get_db)):
    """
    Get available upcoming schedules
    """
    today = date.today()

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
     .filter(Schedule.scheduledate >= today)\
     .all()

    result = []
    for sched in schedules:
        booked = db.query(func.count(Appointment.appoid))\
                   .filter(Appointment.scheduleid == sched.scheduleid)\
                   .scalar()

        available_slots = sched.nop - booked

        if available_slots > 0:
            result.append(ScheduleResponse(
                scheduleid=sched.scheduleid,
                docid=sched.docid,
                title=sched.title,
                scheduledate=sched.scheduledate,
                scheduletime=sched.scheduletime,
                nop=sched.nop,
                doctor_name=sched.doctor_name,
                specialty_name=sched.specialty_name,
                booked=booked,
                available_slots=available_slots
            ))

    return result

@router.get("/{schedule_id}", response_model=ScheduleResponse)
async def get_schedule(schedule_id: int, db: Session = Depends(get_db)):
    """
    Get specific schedule by ID
    """
    schedule = db.query(
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
     .filter(Schedule.scheduleid == schedule_id)\
     .first()

    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    booked = db.query(func.count(Appointment.appoid))\
               .filter(Appointment.scheduleid == schedule.scheduleid)\
               .scalar()

    return ScheduleResponse(
        scheduleid=schedule.scheduleid,
        docid=schedule.docid,
        title=schedule.title,
        scheduledate=schedule.scheduledate,
        scheduletime=schedule.scheduletime,
        nop=schedule.nop,
        doctor_name=schedule.doctor_name,
        specialty_name=schedule.specialty_name,
        booked=booked,
        available_slots=schedule.nop - booked
    )

@router.get("/doctor/{doctor_id}", response_model=List[ScheduleResponse])
async def get_doctor_schedules(doctor_id: int, db: Session = Depends(get_db)):
    """
    Get all schedules for a specific doctor
    """
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
     .filter(Schedule.docid == doctor_id)\
     .all()

    result = []
    for sched in schedules:
        booked = db.query(func.count(Appointment.appoid))\
                   .filter(Appointment.scheduleid == sched.scheduleid)\
                   .scalar()

        result.append(ScheduleResponse(
            scheduleid=sched.scheduleid,
            docid=sched.docid,
            title=sched.title,
            scheduledate=sched.scheduledate,
            scheduletime=sched.scheduletime,
            nop=sched.nop,
            doctor_name=sched.doctor_name,
            specialty_name=sched.specialty_name,
            booked=booked,
            available_slots=sched.nop - booked
        ))

    return result

@router.get("/doctor/{doctor_id}/available", response_model=List[ScheduleResponse])
async def get_doctor_available_schedules(doctor_id: int, db: Session = Depends(get_db)):
    """
    Get available upcoming schedules for a specific doctor
    """
    today = date.today()

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
     .filter(Schedule.docid == doctor_id)\
     .filter(Schedule.scheduledate >= today)\
     .order_by(Schedule.scheduledate, Schedule.scheduletime)\
     .all()

    result = []
    for sched in schedules:
        booked = db.query(func.count(Appointment.appoid))\
                   .filter(Appointment.scheduleid == sched.scheduleid)\
                   .scalar()

        available_slots = sched.nop - booked

        # Only include schedules with available slots
        if available_slots > 0:
            result.append(ScheduleResponse(
                scheduleid=sched.scheduleid,
                docid=sched.docid,
                title=sched.title,
                scheduledate=sched.scheduledate,
                scheduletime=sched.scheduletime,
                nop=sched.nop,
                doctor_name=sched.doctor_name,
                specialty_name=sched.specialty_name,
                booked=booked,
                available_slots=available_slots
            ))

    return result

@router.post("/", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED)
async def create_schedule(request: ScheduleCreate, db: Session = Depends(get_db)):
    """
    Create a new schedule
    """
    # Check if doctor exists
    doctor = db.query(Doctor).filter(Doctor.docid == request.docid).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    # Create schedule
    new_schedule = Schedule(
        docid=request.docid,
        title=request.title,
        scheduledate=request.scheduledate,
        scheduletime=request.scheduletime,
        nop=request.nop
    )

    db.add(new_schedule)
    db.commit()
    db.refresh(new_schedule)

    # Get full schedule details
    schedule = db.query(
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
     .filter(Schedule.scheduleid == new_schedule.scheduleid)\
     .first()

    return ScheduleResponse(
        scheduleid=schedule.scheduleid,
        docid=schedule.docid,
        title=schedule.title,
        scheduledate=schedule.scheduledate,
        scheduletime=schedule.scheduletime,
        nop=schedule.nop,
        doctor_name=schedule.doctor_name,
        specialty_name=schedule.specialty_name,
        booked=0,
        available_slots=schedule.nop
    )

@router.delete("/{schedule_id}")
async def delete_schedule(schedule_id: int, db: Session = Depends(get_db)):
    """
    Delete a schedule
    """
    schedule = db.query(Schedule).filter(Schedule.scheduleid == schedule_id).first()

    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    db.delete(schedule)
    db.commit()

    return {"message": "Schedule deleted successfully"}
