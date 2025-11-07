# HealthPort FastAPI Backend

Modern FastAPI backend for the HealthPort appointment booking system with MySQL database.

## Features

- **FastAPI** - Modern, fast, async Python web framework
- **SQLAlchemy ORM** - Powerful database ORM with relationships
- **Pydantic** - Data validation using Python type annotations
- **MySQL** - Relational database with existing schema
- **Auto Documentation** - Interactive API docs at `/docs`
- **CORS Enabled** - Ready for React frontend integration

## Tech Stack

- Python 3.12+
- FastAPI 0.115.5
- SQLAlchemy 2.0.36
- PyMySQL 1.1.1
- Uvicorn (ASGI server)
- Pydantic for validation

## Quick Start

### 1. Install Dependencies

```bash
cd backend-fastapi
pip install -r requirements.txt
```

### 2. Configure Environment

Update `.env` file with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=shaan
DB_PASSWORD=yourpassword
DB_NAME=edoc
PORT=5000
```

### 3. Run Server

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn main:app --reload --port 5000
```

Server runs at: http://localhost:5000

## API Documentation

FastAPI provides automatic interactive documentation:

- **Swagger UI**: http://localhost:5000/docs
- **ReDoc**: http://localhost:5000/redoc
- **OpenAPI JSON**: http://localhost:5000/openapi.json

## API Endpoints

### Authentication

```
POST /api/auth/login             - User login (all roles)
POST /api/auth/register          - Register new patient
POST /api/auth/register-manager  - Register hospital manager (admin only)
```

### Doctors

```
GET  /api/doctors                  - Get all doctors with specialties
GET  /api/doctors/{id}             - Get specific doctor
GET  /api/doctors/specialty/{id}   - Get doctors by specialty
GET  /api/doctors/search/{query}   - Search doctors by name
```

### Appointments

```
GET    /api/appointments                    - Get all appointments
GET    /api/appointments/{id}               - Get specific appointment
GET    /api/appointments/patient/{id}       - Get patient's appointments
GET    /api/appointments/doctor/{id}        - Get doctor's appointments
POST   /api/appointments                    - Create new appointment
DELETE /api/appointments/{id}               - Delete appointment
```

### Schedules

```
GET    /api/schedules                       - Get all schedules
GET    /api/schedules/{id}                  - Get specific schedule
GET    /api/schedules/available/upcoming    - Get available upcoming slots
GET    /api/schedules/doctor/{id}           - Get doctor's schedules
POST   /api/schedules                       - Create new schedule
DELETE /api/schedules/{id}                  - Delete schedule
```

### Patients

```
GET  /api/patients            - Get all patients
GET  /api/patients/{id}       - Get specific patient
PUT  /api/patients/{id}       - Update patient info
```

### Specialties

```
GET  /api/specialties         - Get all medical specialties (56 types)
GET  /api/specialties/{id}    - Get specific specialty
```

### Hospital Manager

```
GET  /api/hospital-manager/{id}/statistics    - Hospital statistics
GET  /api/hospital-manager/{id}/doctors       - Hospital doctors list
GET  /api/hospital-manager/{id}/appointments  - Hospital appointments
GET  /api/hospital-manager/{id}/patients      - Hospital patients
GET  /api/hospital-manager/{id}/schedules     - Hospital schedules
GET  /api/hospital-manager/{id}/hospital      - Hospital details
```

### Hospitals

```
GET  /api/hospitals/                          - List all hospitals
GET  /api/hospitals/{id}                      - Get specific hospital
GET  /api/hospitals/nearest/find              - Find nearest hospitals
GET  /api/hospitals/nearest/by-specialty      - Nearest by specialty
POST /api/hospitals/                          - Create hospital
```

### Health Check

```
GET  /api/health              - API health status
```

## Request Examples

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@edoc.com","password":"123"}'
```

Response:
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "patient@edoc.com",
    "name": "Test Patient",
    "usertype": "patient"
  }
}
```

### Get Available Schedules

```bash
curl http://localhost:5000/api/schedules/available/upcoming
```

### Create Appointment

```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": 1,
    "scheduleId": 1,
    "appointmentDate": "2024-12-15T10:00:00"
  }'
```

## Database Models

The backend uses SQLAlchemy ORM with the following models:

- **WebUser** - User authentication (email, usertype)
- **Admin** - Admin accounts
- **HospitalManager** - Hospital manager accounts (NEW)
- **Hospital** - Hospital information
- **Doctor** - Doctor profiles with specialties
- **Patient** - Patient information
- **Specialty** - Medical specialties (56 types)
- **Schedule** - Doctor schedules
- **Appointment** - Appointment bookings
- **Notification** - Email notification logs (NEW)

All models map to MySQL tables.

## Project Structure

```
backend-fastapi/
├── app/
│   ├── __init__.py
│   ├── database.py              # Database connection & session
│   ├── models/
│   │   └── __init__.py          # SQLAlchemy models
│   ├── schemas/
│   │   └── __init__.py          # Pydantic schemas
│   └── routers/
│       ├── __init__.py
│       ├── auth.py              # Authentication endpoints
│       ├── doctors.py           # Doctor endpoints
│       ├── appointments.py      # Appointment endpoints
│       ├── schedules.py         # Schedule endpoints
│       ├── patients.py          # Patient endpoints
│       └── specialties.py       # Specialty endpoints
├── main.py                      # FastAPI app & server
├── requirements.txt             # Python dependencies
├── .env                         # Environment configuration
└── README.md                    # This file
```

## Key Features

### 1. Automatic Data Validation

Pydantic schemas automatically validate request data:

```python
class AppointmentCreate(BaseModel):
    patientId: int
    scheduleId: int
    appointmentDate: datetime
```

### 2. Database Connection Pooling

Efficient connection management:

```python
engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=3600)
```

### 3. Relationship Loading

SQLAlchemy handles complex joins automatically:

```python
appointments = db.query(Appointment)\
    .join(Patient)\
    .join(Schedule)\
    .join(Doctor)\
    .all()
```

### 4. CORS Configuration

Ready for React frontend:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Features Added (v2.0)

### Email Notifications
- Automated emails on appointment booking
- Patient confirmation emails
- Doctor notification emails
- SMTP configuration in `.env`
- Logs all notifications in database

### Hospital Manager Role
- Hospital-specific management
- Role-based access control
- Dashboard with statistics
- Manage hospital doctors, appointments, patients

### Location-Based Search
- Haversine distance calculation
- Find nearest hospitals
- Search by specialty and location

## Development

### Run in Development Mode

```bash
python main.py
```

This starts uvicorn with auto-reload enabled.

### Access Interactive Documentation

Open http://localhost:5000/docs to:
- Test all endpoints
- View request/response schemas
- See model definitions
- Execute API calls directly

## Advantages over Node.js/Express

1. **Type Safety** - Pydantic validation catches errors early
2. **Auto Documentation** - Swagger UI generated automatically
3. **Modern Python** - Async/await, type hints, clean syntax
4. **ORM Power** - SQLAlchemy handles complex relationships
5. **Performance** - FastAPI is one of the fastest Python frameworks
6. **Developer Experience** - Interactive docs, auto-completion

## Database Schema Compatibility

This FastAPI backend uses the **exact same MySQL database** as the original Node.js backend. All table names, column names, and relationships are preserved:

- Tables: `webuser`, `admin`, `doctor`, `patient`, `appointment`, `schedule`, `specialties`
- No migration needed
- Drop-in replacement for Node.js backend

## Environment Variables

Required in `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=edoc

# Server
PORT=5000
CLIENT_URL=http://localhost:3000

# JWT (Optional)
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email Notifications (Optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=noreply@healthport.com
```

**Note:** Leave SMTP credentials empty for development (emails log to console)

## Troubleshooting

**Port already in use?**
```bash
# Change PORT in .env
PORT=5001
```

**Database connection error?**
```bash
# Verify MySQL is running
# Check credentials in .env
# Test connection: mysql -u shaan -p
```

**Import errors?**
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

## Production Deployment

For production deployment:

1. Set proper environment variables
2. Use production-grade MySQL
3. Enable HTTPS
4. Set up proper logging
5. Use gunicorn with uvicorn workers:

```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## License

MIT

## Contact

For issues or questions about the FastAPI backend, please open an issue in the repository.
