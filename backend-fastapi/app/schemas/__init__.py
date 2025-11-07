from pydantic import BaseModel, EmailStr
from datetime import date, time, datetime
from typing import Optional

# Auth Schemas
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    address: str
    nic: str
    dob: date
    tel: str

class LoginResponse(BaseModel):
    id: int
    email: str
    name: str
    usertype: str
    message: str
    hospital_id: Optional[int] = None  # For hospital managers

    class Config:
        from_attributes = True

# Doctor Schemas
class DoctorResponse(BaseModel):
    docid: int
    docemail: str
    docname: str
    docnic: str
    doctel: str
    specialties: int
    specialty_name: Optional[str] = None

    class Config:
        from_attributes = True

# Specialty Schemas
class SpecialtyResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

# Hospital Schemas
class HospitalCreate(BaseModel):
    name: str
    address: str
    contact_no: str
    admin_email: str

class HospitalUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    contact_no: Optional[str] = None

class HospitalResponse(BaseModel):
    hospital_id: int
    name: str
    address: str
    contact_no: str
    admin_email: str
    latitude: Optional[str] = None
    longitude: Optional[str] = None

    class Config:
        from_attributes = True

class HospitalWithDistance(HospitalResponse):
    distance_km: float
    distance_formatted: str

class DoctorInHospital(BaseModel):
    docid: int
    docemail: str
    docname: str
    doctel: str
    specialty_name: Optional[str] = None

    class Config:
        from_attributes = True

class HospitalWithDoctors(HospitalWithDistance):
    doctors: list[DoctorInHospital] = []
    doctor_count: int = 0

# Schedule Schemas
class ScheduleCreate(BaseModel):
    docid: int
    title: str
    scheduledate: date
    scheduletime: time
    nop: int

class ScheduleResponse(BaseModel):
    scheduleid: int
    docid: int
    title: str
    scheduledate: date
    scheduletime: time
    nop: int
    doctor_name: Optional[str] = None
    specialty_name: Optional[str] = None
    booked: Optional[int] = 0
    available_slots: Optional[int] = 0

    class Config:
        from_attributes = True

# Appointment Schemas
class AppointmentCreate(BaseModel):
    patientId: int
    scheduleId: int
    appointmentDate: datetime

class AppointmentResponse(BaseModel):
    appoid: int
    pid: int
    apponum: int
    scheduleid: int
    appodate: datetime
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None
    schedule_title: Optional[str] = None
    specialty: Optional[str] = None

    class Config:
        from_attributes = True

# Patient Schemas
class PatientResponse(BaseModel):
    pid: int
    pemail: str
    pname: str
    paddress: str
    pnic: str
    pdob: date
    ptel: str

    class Config:
        from_attributes = True

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    tel: Optional[str] = None

# Hospital Manager Schemas
class HospitalManagerCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    hospital_id: int

class HospitalManagerResponse(BaseModel):
    manager_id: int
    email: str
    name: str
    phone: str
    hospital_id: int

    class Config:
        from_attributes = True

# Notification Schemas
class NotificationCreate(BaseModel):
    recipient_email: str
    recipient_type: str
    notification_type: str
    subject: str
    message: str

class NotificationResponse(BaseModel):
    notification_id: int
    recipient_email: str
    recipient_type: str
    notification_type: str
    subject: str
    message: str
    sent_at: datetime
    status: str

    class Config:
        from_attributes = True
