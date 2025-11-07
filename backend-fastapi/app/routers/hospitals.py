from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Hospital, Admin, Doctor, Specialty
from app.schemas import HospitalCreate, HospitalUpdate, HospitalResponse, HospitalWithDistance, HospitalWithDoctors
from app.utils import haversine_distance, format_distance

router = APIRouter(
    prefix="/api/hospitals",
    tags=["hospitals"]
)

@router.post("/", response_model=HospitalResponse, status_code=status.HTTP_201_CREATED)
async def create_hospital(hospital: HospitalCreate, db: Session = Depends(get_db)):
    """Create a new hospital"""
    # Verify admin exists
    admin = db.query(Admin).filter(Admin.aemail == hospital.admin_email).first()
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Admin with email {hospital.admin_email} not found"
        )

    # Create new hospital
    new_hospital = Hospital(
        name=hospital.name,
        address=hospital.address,
        contact_no=hospital.contact_no,
        admin_email=hospital.admin_email
    )

    db.add(new_hospital)
    db.commit()
    db.refresh(new_hospital)

    return new_hospital

@router.get("/", response_model=List[HospitalResponse])
async def get_all_hospitals(db: Session = Depends(get_db)):
    """Get all hospitals"""
    hospitals = db.query(Hospital).all()
    return hospitals

@router.get("/{hospital_id}", response_model=HospitalResponse)
async def get_hospital(hospital_id: int, db: Session = Depends(get_db)):
    """Get a specific hospital by ID"""
    hospital = db.query(Hospital).filter(Hospital.hospital_id == hospital_id).first()

    if not hospital:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hospital with ID {hospital_id} not found"
        )

    return hospital

@router.put("/{hospital_id}", response_model=HospitalResponse)
async def update_hospital(
    hospital_id: int,
    hospital_update: HospitalUpdate,
    db: Session = Depends(get_db)
):
    """Update a hospital's information"""
    hospital = db.query(Hospital).filter(Hospital.hospital_id == hospital_id).first()

    if not hospital:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hospital with ID {hospital_id} not found"
        )

    # Update only provided fields
    update_data = hospital_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(hospital, field, value)

    db.commit()
    db.refresh(hospital)

    return hospital

@router.delete("/{hospital_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_hospital(hospital_id: int, db: Session = Depends(get_db)):
    """Delete a hospital"""
    hospital = db.query(Hospital).filter(Hospital.hospital_id == hospital_id).first()

    if not hospital:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hospital with ID {hospital_id} not found"
        )

    db.delete(hospital)
    db.commit()

    return None

@router.get("/admin/{admin_email}", response_model=List[HospitalResponse])
async def get_hospitals_by_admin(admin_email: str, db: Session = Depends(get_db)):
    """Get all hospitals managed by a specific admin"""
    hospitals = db.query(Hospital).filter(Hospital.admin_email == admin_email).all()
    return hospitals

@router.get("/nearest/find", response_model=List[HospitalWithDistance])
async def get_nearest_hospitals(
    latitude: float = Query(..., description="User's latitude"),
    longitude: float = Query(..., description="User's longitude"),
    limit: int = Query(10, description="Maximum number of hospitals to return"),
    db: Session = Depends(get_db)
):
    """
    Find nearest hospitals to user's location.
    Returns hospitals sorted by distance (closest first).
    """
    # Get all hospitals with coordinates
    hospitals = db.query(Hospital).filter(
        Hospital.latitude.isnot(None),
        Hospital.longitude.isnot(None)
    ).all()

    if not hospitals:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No hospitals with location data found"
        )

    # Calculate distance for each hospital
    hospitals_with_distance = []
    for hospital in hospitals:
        try:
            hospital_lat = float(hospital.latitude)
            hospital_lon = float(hospital.longitude)

            # Calculate distance in km
            distance = haversine_distance(latitude, longitude, hospital_lat, hospital_lon)

            # Create response with distance
            hospital_dict = {
                "hospital_id": hospital.hospital_id,
                "name": hospital.name,
                "address": hospital.address,
                "contact_no": hospital.contact_no,
                "admin_email": hospital.admin_email,
                "latitude": hospital.latitude,
                "longitude": hospital.longitude,
                "distance_km": round(distance, 2),
                "distance_formatted": format_distance(distance)
            }
            hospitals_with_distance.append(hospital_dict)
        except (ValueError, TypeError):
            # Skip hospitals with invalid coordinates
            continue

    # Sort by distance
    hospitals_with_distance.sort(key=lambda x: x["distance_km"])

    # Return limited results
    return hospitals_with_distance[:limit]

@router.get("/nearest/by-specialty", response_model=List[HospitalWithDoctors])
async def get_nearest_hospitals_by_specialty(
    latitude: float = Query(..., description="User's latitude"),
    longitude: float = Query(..., description="User's longitude"),
    specialty_id: int = Query(..., description="Specialty ID to filter by"),
    limit: int = Query(10, description="Maximum number of hospitals to return"),
    db: Session = Depends(get_db)
):
    """
    Find nearest hospitals that have doctors with the specified specialty.
    Returns hospitals sorted by distance with list of doctors in that specialty.
    """
    # Get the specialty name for reference
    specialty = db.query(Specialty).filter(Specialty.id == specialty_id).first()
    if not specialty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Specialty with ID {specialty_id} not found"
        )

    # Get all hospitals with coordinates
    hospitals = db.query(Hospital).filter(
        Hospital.latitude.isnot(None),
        Hospital.longitude.isnot(None)
    ).all()

    if not hospitals:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No hospitals with location data found"
        )

    # Calculate distance and get doctors for each hospital
    hospitals_with_doctors = []
    for hospital in hospitals:
        # Get doctors at this hospital with the specified specialty
        doctors = db.query(Doctor).filter(
            Doctor.hospital_id == hospital.hospital_id,
            Doctor.specialties == specialty_id
        ).all()

        # Skip hospitals without doctors in this specialty
        if not doctors:
            continue

        try:
            hospital_lat = float(hospital.latitude)
            hospital_lon = float(hospital.longitude)

            # Calculate distance in km
            distance = haversine_distance(latitude, longitude, hospital_lat, hospital_lon)

            # Build doctors list with specialty name
            doctors_list = []
            for doctor in doctors:
                doctors_list.append({
                    "docid": doctor.docid,
                    "docemail": doctor.docemail,
                    "docname": doctor.docname,
                    "doctel": doctor.doctel,
                    "specialty_name": specialty.sname
                })

            # Create response with distance and doctors
            hospital_dict = {
                "hospital_id": hospital.hospital_id,
                "name": hospital.name,
                "address": hospital.address,
                "contact_no": hospital.contact_no,
                "admin_email": hospital.admin_email,
                "latitude": hospital.latitude,
                "longitude": hospital.longitude,
                "distance_km": round(distance, 2),
                "distance_formatted": format_distance(distance),
                "doctors": doctors_list,
                "doctor_count": len(doctors_list)
            }
            hospitals_with_doctors.append(hospital_dict)
        except (ValueError, TypeError):
            # Skip hospitals with invalid coordinates
            continue

    if not hospitals_with_doctors:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No hospitals found with {specialty.sname} specialists nearby"
        )

    # Sort by distance
    hospitals_with_doctors.sort(key=lambda x: x["distance_km"])

    # Return limited results
    return hospitals_with_doctors[:limit]
