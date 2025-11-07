from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import WebUser, Patient, Doctor, Admin, HospitalManager
from app.schemas import LoginRequest, RegisterRequest, LoginResponse, HospitalManagerCreate, HospitalManagerResponse
from datetime import date

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Login endpoint - checks user type and returns user data
    """
    # Check if user exists in webuser table
    webuser = db.query(WebUser).filter(WebUser.email == request.email).first()

    if not webuser:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    usertype = webuser.usertype

    # Query appropriate table based on usertype
    if usertype == 'p':  # Patient
        user = db.query(Patient).filter(Patient.pemail == request.email).first()
        if not user or user.ppassword != request.password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        return LoginResponse(
            id=user.pid,
            email=user.pemail,
            name=user.pname,
            usertype="patient",
            message="Login successful"
        )

    elif usertype == 'd':  # Doctor
        user = db.query(Doctor).filter(Doctor.docemail == request.email).first()
        if not user or user.docpassword != request.password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        return LoginResponse(
            id=user.docid,
            email=user.docemail,
            name=user.docname,
            usertype="doctor",
            message="Login successful"
        )

    elif usertype == 'a':  # Admin
        user = db.query(Admin).filter(Admin.aemail == request.email).first()
        if not user or user.apassword != request.password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        return LoginResponse(
            id=0,
            email=user.aemail,
            name="Administrator",  # Admin table doesn't have a name field
            usertype="admin",
            message="Login successful"
        )

    elif usertype == 'h':  # Hospital Manager
        user = db.query(HospitalManager).filter(HospitalManager.email == request.email).first()
        if not user or user.password != request.password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        return LoginResponse(
            id=user.manager_id,
            email=user.email,
            name=user.name,
            usertype="hospital_manager",
            hospital_id=user.hospital_id,
            message="Login successful"
        )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid user type"
    )

@router.post("/register", response_model=LoginResponse)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register new patient
    """
    # Check if email already exists
    existing_user = db.query(WebUser).filter(WebUser.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create patient record
    new_patient = Patient(
        pemail=request.email,
        pname=request.name,
        ppassword=request.password,
        paddress=request.address,
        pnic=request.nic,
        pdob=request.dob,
        ptel=request.tel
    )
    db.add(new_patient)
    db.flush()

    # Create webuser record
    new_webuser = WebUser(
        email=request.email,
        usertype='p'
    )
    db.add(new_webuser)
    db.commit()
    db.refresh(new_patient)

    return LoginResponse(
        id=new_patient.pid,
        email=new_patient.pemail,
        name=new_patient.pname,
        usertype="patient",
        message="Registration successful"
    )

@router.post("/register-manager", response_model=HospitalManagerResponse)
async def register_hospital_manager(request: HospitalManagerCreate, db: Session = Depends(get_db)):
    """
    Register new hospital manager (admin only)
    """
    # Check if email already exists
    existing_user = db.query(WebUser).filter(WebUser.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create hospital manager record
    new_manager = HospitalManager(
        email=request.email,
        name=request.name,
        password=request.password,
        phone=request.phone,
        hospital_id=request.hospital_id
    )
    db.add(new_manager)
    db.flush()

    # Create webuser record
    new_webuser = WebUser(
        email=request.email,
        usertype='h'
    )
    db.add(new_webuser)
    db.commit()
    db.refresh(new_manager)

    return HospitalManagerResponse(
        manager_id=new_manager.manager_id,
        email=new_manager.email,
        name=new_manager.name,
        phone=new_manager.phone,
        hospital_id=new_manager.hospital_id
    )
