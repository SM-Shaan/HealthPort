from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.database import get_db
from app.models import Doctor, Specialty
from app.schemas import DoctorResponse
from typing import List

router = APIRouter(prefix="/doctors", tags=["doctors"])

@router.get("/", response_model=List[DoctorResponse])
async def get_all_doctors(db: Session = Depends(get_db)):
    """
    Get all doctors with their specialties
    """
    doctors = db.query(
        Doctor.docid,
        Doctor.docemail,
        Doctor.docname,
        Doctor.docnic,
        Doctor.doctel,
        Doctor.specialties,
        Specialty.sname.label("specialty_name")
    ).join(Specialty, Doctor.specialties == Specialty.id).all()

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

@router.get("/{doctor_id}", response_model=DoctorResponse)
async def get_doctor_by_id(doctor_id: int, db: Session = Depends(get_db)):
    """
    Get specific doctor by ID
    """
    doctor = db.query(
        Doctor.docid,
        Doctor.docemail,
        Doctor.docname,
        Doctor.docnic,
        Doctor.doctel,
        Doctor.specialties,
        Specialty.sname.label("specialty_name")
    ).join(Specialty, Doctor.specialties == Specialty.id).filter(
        Doctor.docid == doctor_id
    ).first()

    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    return DoctorResponse(
        docid=doctor.docid,
        docemail=doctor.docemail,
        docname=doctor.docname,
        docnic=doctor.docnic,
        doctel=doctor.doctel,
        specialties=doctor.specialties,
        specialty_name=doctor.specialty_name
    )

@router.get("/specialty/{specialty_id}", response_model=List[DoctorResponse])
async def get_doctors_by_specialty(specialty_id: int, db: Session = Depends(get_db)):
    """
    Get all doctors with a specific specialty
    """
    doctors = db.query(
        Doctor.docid,
        Doctor.docemail,
        Doctor.docname,
        Doctor.docnic,
        Doctor.doctel,
        Doctor.specialties,
        Specialty.sname.label("specialty_name")
    ).join(Specialty, Doctor.specialties == Specialty.id).filter(
        Doctor.specialties == specialty_id
    ).all()

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

@router.get("/search/{query}", response_model=List[DoctorResponse])
async def search_doctors(query: str, db: Session = Depends(get_db)):
    """
    Search doctors by name
    """
    doctors = db.query(
        Doctor.docid,
        Doctor.docemail,
        Doctor.docname,
        Doctor.docnic,
        Doctor.doctel,
        Doctor.specialties,
        Specialty.sname.label("specialty_name")
    ).join(Specialty, Doctor.specialties == Specialty.id).filter(
        Doctor.docname.like(f"%{query}%")
    ).all()

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
