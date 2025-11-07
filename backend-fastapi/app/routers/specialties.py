from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Specialty
from app.schemas import SpecialtyResponse
from typing import List

router = APIRouter(prefix="/specialties", tags=["specialties"])

@router.get("/", response_model=List[SpecialtyResponse])
async def get_all_specialties(db: Session = Depends(get_db)):
    """
    Get all medical specialties
    """
    specialties = db.query(Specialty).all()
    return [
        SpecialtyResponse(id=spec.id, name=spec.sname)
        for spec in specialties
    ]

@router.get("/{specialty_id}", response_model=SpecialtyResponse)
async def get_specialty(specialty_id: int, db: Session = Depends(get_db)):
    """
    Get specific specialty by ID
    """
    specialty = db.query(Specialty).filter(Specialty.id == specialty_id).first()

    if not specialty:
        raise HTTPException(status_code=404, detail="Specialty not found")

    return SpecialtyResponse(id=specialty.id, name=specialty.sname)
