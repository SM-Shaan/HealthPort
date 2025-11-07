from sqlalchemy import Column, Integer, String, Date, Time, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class WebUser(Base):
    __tablename__ = "webuser"

    email = Column(String(255), primary_key=True, index=True)
    usertype = Column(String(1))

class Admin(Base):
    __tablename__ = "admin"

    aemail = Column(String(255), primary_key=True, index=True)
    apassword = Column(String(255))

    hospitals = relationship("Hospital", back_populates="admin")

class Hospital(Base):
    __tablename__ = "hospital"

    hospital_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(150))
    address = Column(Text)
    contact_no = Column(String(20))
    admin_email = Column(String(255), ForeignKey("admin.aemail"))
    latitude = Column(String(20), nullable=True)
    longitude = Column(String(20), nullable=True)

    admin = relationship("Admin", back_populates="hospitals")
    doctors = relationship("Doctor", back_populates="hospital")
    managers = relationship("HospitalManager", back_populates="hospital")

class HospitalManager(Base):
    __tablename__ = "hospital_manager"

    manager_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True)
    name = Column(String(255))
    password = Column(String(255))
    phone = Column(String(15))
    hospital_id = Column(Integer, ForeignKey("hospital.hospital_id"))

    hospital = relationship("Hospital", back_populates="managers")

class Doctor(Base):
    __tablename__ = "doctor"

    docid = Column(Integer, primary_key=True, index=True, autoincrement=True)
    docemail = Column(String(255), unique=True, index=True)
    docname = Column(String(255))
    docpassword = Column(String(255))
    docnic = Column(String(15))
    doctel = Column(String(15))
    specialties = Column(Integer, ForeignKey("specialties.id"))
    hospital_id = Column(Integer, ForeignKey("hospital.hospital_id"), nullable=True)

    specialty = relationship("Specialty", back_populates="doctors")
    schedules = relationship("Schedule", back_populates="doctor")
    hospital = relationship("Hospital", back_populates="doctors")

class Patient(Base):
    __tablename__ = "patient"

    pid = Column(Integer, primary_key=True, index=True, autoincrement=True)
    pemail = Column(String(255), unique=True, index=True)
    pname = Column(String(255))
    ppassword = Column(String(255))
    paddress = Column(String(255))
    pnic = Column(String(15))
    pdob = Column(Date)
    ptel = Column(String(15))

    appointments = relationship("Appointment", back_populates="patient")

class Specialty(Base):
    __tablename__ = "specialties"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    sname = Column(String(50))

    doctors = relationship("Doctor", back_populates="specialty")

class Schedule(Base):
    __tablename__ = "schedule"

    scheduleid = Column(Integer, primary_key=True, index=True, autoincrement=True)
    docid = Column(Integer, ForeignKey("doctor.docid"))
    title = Column(String(255))
    scheduledate = Column(Date)
    scheduletime = Column(Time)
    nop = Column(Integer)

    doctor = relationship("Doctor", back_populates="schedules")
    appointments = relationship("Appointment", back_populates="schedule")

class Appointment(Base):
    __tablename__ = "appointment"

    appoid = Column(Integer, primary_key=True, index=True, autoincrement=True)
    pid = Column(Integer, ForeignKey("patient.pid"))
    apponum = Column(Integer)
    scheduleid = Column(Integer, ForeignKey("schedule.scheduleid"))
    appodate = Column(DateTime)

    patient = relationship("Patient", back_populates="appointments")
    schedule = relationship("Schedule", back_populates="appointments")

class Notification(Base):
    __tablename__ = "notification"

    notification_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    recipient_email = Column(String(255))
    recipient_type = Column(String(20))  # 'patient', 'doctor', 'manager'
    notification_type = Column(String(50))  # 'appointment_booked', 'appointment_cancelled', etc.
    subject = Column(String(255))
    message = Column(Text)
    sent_at = Column(DateTime)
    status = Column(String(20))  # 'sent', 'failed', 'pending'
