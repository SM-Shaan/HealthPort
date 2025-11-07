from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Patient
from app.schemas import PatientResponse, PatientUpdate
from typing import List

router = APIRouter(prefix="/patients", tags=["patients"])

@router.get("/", response_model=List[PatientResponse])
async def get_all_patients(db: Session = Depends(get_db)):
    """
    Get all patients
    """
    patients = db.query(Patient).all()
    return patients

@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(patient_id: int, db: Session = Depends(get_db)):
    """
    Get specific patient by ID
    """
    patient = db.query(Patient).filter(Patient.pid == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return patient

@router.put("/{patient_id}", response_model=PatientResponse)
async def update_patient(patient_id: int, request: PatientUpdate, db: Session = Depends(get_db)):
    """
    Update patient information
    """
    patient = db.query(Patient).filter(Patient.pid == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Update fields if provided
    if request.name is not None:
        patient.pname = request.name
    if request.address is not None:
        patient.paddress = request.address
    if request.tel is not None:
        patient.ptel = request.tel

    db.commit()
    db.refresh(patient)

    return patient
