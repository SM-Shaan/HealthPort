# HealthPort - Hospital Appointment Management System

A modern, full-stack healthcare appointment management system with role-based access control, real-time notifications, and hospital-specific data filtering.

## Features

### Core Functionality
- 🏥 **Multi-Hospital Support** - Manage multiple hospitals in one system
- 👥 **Role-Based Access Control** - Admin, Hospital Manager, Doctor, Patient roles
- 📅 **Appointment Booking** - Easy scheduling with availability checking
- 🔔 **Email Notifications** - Automated notifications for patients and doctors
- 📍 **Location-Based Search** - Find nearest hospitals by specialty
- 📊 **Analytics Dashboard** - Real-time statistics for each role

### User Roles

#### 1. Admin
- Manage all hospitals in the system
- View and manage all doctors, patients, appointments
- Create hospital managers
- System-wide statistics and reports

#### 2. Hospital Manager
- Manage specific hospital data
- View doctors at their hospital
- Monitor appointments and schedules
- Track patient visits
- Hospital-specific statistics

#### 3. Doctor
- View personal appointment schedule
- Manage availability and time slots
- Access patient information
- View appointment history

#### 4. Patient
- Browse doctors by specialty
- Find nearest hospitals
- Book appointments
- View appointment history
- Manage profile

---

## Tech Stack

### Backend (FastAPI)
- **Framework:** FastAPI 0.115.5
- **Database:** MySQL with SQLAlchemy ORM
- **Authentication:** Role-based access control
- **Email:** SMTP (Gmail/SendGrid compatible)
- **API Docs:** Auto-generated Swagger UI

### Frontend (React)
- **Framework:** React 19.2.0 + TypeScript
- **Routing:** React Router v7.9.5
- **Styling:** Tailwind CSS 3.4.18
- **Build Tool:** Vite 5.4.21
- **State Management:** React Context API

---

## Project Structure

```
HealthPort/
├── backend-fastapi/          # Python FastAPI backend
│   ├── app/
│   │   ├── models/           # SQLAlchemy database models
│   │   ├── routers/          # API endpoint routers
│   │   ├── schemas/          # Pydantic validation schemas
│   │   ├── utils/            # Utility functions (notifications, distance calc)
│   │   └── database.py       # Database configuration
│   ├── migrations/           # SQL migration scripts
│   ├── main.py               # FastAPI application entry point
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment variables
│
├── HealthPort/               # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components by role
│   │   │   ├── admin/
│   │   │   ├── doctor/
│   │   │   ├── patient/
│   │   │   ├── hospital-manager/
│   │   │   └── auth/
│   │   ├── contexts/         # React Context (Auth)
│   │   ├── services/         # API service clients
│   │   ├── types/            # TypeScript type definitions
│   │   └── App.tsx           # Main application component
│   ├── package.json
│   └── .env                  # Frontend environment variables
│
├── IMPLEMENTATION_SUMMARY.md # Setup guide and feature documentation
└── README.md                 # This file
```

---

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- MySQL 8.0+

### 1. Database Setup

Create the database:
```sql
CREATE DATABASE edoc;
```

Run migrations:
```bash
cd backend-fastapi
mysql -u your_user -p edoc < migrations/001_add_hospital_manager_and_notifications.sql
```

### 2. Backend Setup

```bash
cd backend-fastapi

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start server
python main.py
```

Backend will run at: **http://localhost:5000**
API Docs: **http://localhost:5000/docs**

### 3. Frontend Setup

```bash
cd HealthPort

# Install dependencies
npm install

# Configure environment
# Create .env file with:
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

Frontend will run at: **http://localhost:3000**

---

## Default Accounts

After setting up, create accounts using the API or frontend:

**Hospital Manager:**
```bash
POST http://localhost:5000/api/auth/register-manager
{
  "name": "John Manager",
  "email": "manager@hospital.com",
  "password": "your_password",
  "phone": "555-0100",
  "hospital_id": 1
}
```

**Patient Registration:**
- Go to http://localhost:3000/signup
- Fill in the registration form

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login (all roles)
- `POST /api/auth/register` - Register patient
- `POST /api/auth/register-manager` - Register hospital manager (admin)

### Hospital Manager
- `GET /api/hospital-manager/{id}/statistics` - Hospital stats
- `GET /api/hospital-manager/{id}/doctors` - Hospital doctors
- `GET /api/hospital-manager/{id}/appointments` - Hospital appointments
- `GET /api/hospital-manager/{id}/patients` - Hospital patients
- `GET /api/hospital-manager/{id}/schedules` - Hospital schedules
- `GET /api/hospital-manager/{id}/hospital` - Hospital details

### Doctors
- `GET /api/doctors/` - List all doctors
- `GET /api/doctors/{id}` - Get doctor by ID
- `GET /api/doctors/specialty/{specialty_id}` - Filter by specialty
- `GET /api/doctors/search/{query}` - Search doctors

### Appointments
- `POST /api/appointments/` - Book appointment (sends notifications)
- `GET /api/appointments/patient/{patient_id}` - Patient appointments
- `GET /api/appointments/doctor/{doctor_id}` - Doctor appointments
- `DELETE /api/appointments/{id}` - Cancel appointment

### Hospitals
- `GET /api/hospitals/` - List all hospitals
- `GET /api/hospitals/nearest/find` - Find nearest hospitals by location
- `GET /api/hospitals/nearest/by-specialty` - Nearest hospitals with specific specialty

### Schedules
- `GET /api/schedules/` - List all schedules
- `GET /api/schedules/doctor/{doctor_id}` - Doctor schedules
- `POST /api/schedules/` - Create schedule

For complete API documentation, visit: **http://localhost:5000/docs**

---

## Email Notifications

### Configuration

Edit `backend-fastapi/.env`:

**For Development (Console Logging):**
```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=
FROM_EMAIL=noreply@healthport.com
```

**For Production (Gmail):**
```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=noreply@healthport.com
```

**Note:** For Gmail, create an App Password at https://myaccount.google.com/apppasswords

### Notification Events
- ✉️ Patient receives confirmation email when booking
- ✉️ Doctor receives notification of new appointment
- 📝 All notifications logged in database

---

## Database Schema

### Main Tables
- `webuser` - User authentication (email, usertype)
- `admin` - Admin accounts
- `hospital` - Hospital information
- `hospital_manager` - Hospital manager accounts
- `doctor` - Doctor profiles
- `patient` - Patient information
- `specialties` - Medical specialties (56 types)
- `schedule` - Doctor availability schedules
- `appointment` - Booked appointments
- `notification` - Email notification logs

---

## Development

### Backend Development

```bash
cd backend-fastapi

# Run with auto-reload
python main.py

# The server will restart automatically on code changes
```

### Frontend Development

```bash
cd HealthPort

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Structure Guidelines

**Backend:**
- Models in `app/models/` - SQLAlchemy ORM models
- Routers in `app/routers/` - API endpoint handlers
- Schemas in `app/schemas/` - Pydantic validation
- Utils in `app/utils/` - Helper functions

**Frontend:**
- Components are reusable and in `src/components/`
- Pages are organized by user role in `src/pages/`
- Services handle API calls in `src/services/`
- Types define TypeScript interfaces in `src/types/`

---

## Deployment

### Backend Deployment

1. Set production environment variables
2. Use a production WSGI server (Gunicorn)
3. Enable HTTPS
4. Configure proper CORS origins
5. Use a production database with connection pooling

```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:5000
```

### Frontend Deployment

```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

---

## Security Considerations

⚠️ **Current Implementation (Development):**
- Plain text passwords (for testing only)
- No JWT token authentication
- Basic role-based access control

✅ **Recommended for Production:**
- Implement bcrypt password hashing
- Add JWT token-based authentication
- Add API rate limiting
- Implement middleware for role verification
- Use HTTPS
- Validate and sanitize all inputs
- Add CSRF protection
- Implement proper session management

---

## Troubleshooting

### Backend Issues

**"Can't connect to database":**
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database `edoc` exists

**"Module not found":**
```bash
pip install -r requirements.txt
```

### Frontend Issues

**"VITE_API_BASE_URL not defined":**
- Create `.env` file with: `VITE_API_BASE_URL=http://localhost:5000/api`
- Restart dev server

**"Login redirects to wrong page":**
- Clear browser cache (Ctrl+Shift+R)
- Check usertype mapping in Login.tsx

### Email Issues

**"Emails not sending":**
- For development, leave SMTP credentials empty (logs to console)
- For production, verify SMTP settings
- For Gmail, use App Password, not regular password

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## License

This project is for educational purposes.

---

## Support

For detailed setup instructions and troubleshooting, see:
- `IMPLEMENTATION_SUMMARY.md` - Complete setup guide
- `backend-fastapi/NEW_FEATURES_README.md` - Feature documentation
- API Documentation: http://localhost:5000/docs

---

## Acknowledgments

Built with:
- FastAPI - https://fastapi.tiangolo.com/
- React - https://react.dev/
- Tailwind CSS - https://tailwindcss.com/
- SQLAlchemy - https://www.sqlalchemy.org/

---

**Version:** 2.0.0
**Last Updated:** November 2025
