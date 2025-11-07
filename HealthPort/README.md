# HealthPort - Doctor Appointment Booking System

A modern React-based doctor appointment booking system converted from PHP to React + TypeScript with Tailwind CSS.

## 🚀 Features

### For Patients
- Browse available doctors by specialty
- View doctor schedules and available time slots
- Book appointments online
- Manage appointment bookings
- Update profile and account settings

### For Doctors
- View personal appointments and schedules
- Manage patient information
- View all doctors in the system
- Update profile settings

### For Administrators
- Manage doctors (Add, Edit, Delete)
- Manage appointment schedules
- View all appointments and patients
- Dashboard with statistics

## 📁 Project Structure

```
HealthPort/
├── src/
│   ├── components/        # Reusable React components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Table.tsx
│   │   ├── Sidebar.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── StatusCard.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── admin/         # Admin portal
│   │   ├── doctor/        # Doctor portal
│   │   ├── patient/       # Patient portal
│   │   └── LandingPage.tsx
│   ├── services/          # API services
│   │   └── authService.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Routing:** React Router v7
- **State Management:** React Context API
- **Backend:** (To be implemented - see API section below)

## 📦 Installation

### Prerequisites
- Node.js 20+ and npm

### Setup

1. Clone the repository:
```bash
cd E:\HealthPort\HealthPort
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run TypeScript type checking

## 🎨 UI/UX

The application uses a custom color scheme matching the original PHP design:

- **Primary Color:** `#0A76D8` (Blue)
- **Primary Hover:** `#006dd3`
- **Button Nice:** `#D8EBFA` (Light Blue)
- **Button Text:** `#1b62b3`

The design is fully responsive and works across all devices.

## 🔐 Authentication & Authorization

The system implements role-based access control (RBAC) with three user types:

1. **Admin** (`usertype: 'admin'`)
   - Full system access
   - Manage doctors, schedules, appointments, patients

2. **Doctor** (`usertype: 'doctor'`)
   - View own appointments and schedules
   - Manage own sessions
   - View patient details

3. **Patient** (`usertype: 'patient'`)
   - Browse doctors and sessions
   - Book appointments
   - Manage own bookings

## 🔌 API Integration

### Backend Requirements

The React frontend expects a REST API backend with the following endpoints:

#### Authentication
- `POST /api/login` - User login
- `POST /api/signup` - Patient registration
- `POST /api/logout` - User logout

#### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Add new doctor (admin only)
- `PUT /api/doctors/:id` - Update doctor (admin only)
- `DELETE /api/doctors/:id` - Delete doctor (admin only)

#### Schedules
- `GET /api/schedules` - Get all schedules
- `GET /api/schedules/:id` - Get schedule by ID
- `POST /api/schedules` - Create new schedule (admin/doctor)
- `DELETE /api/schedules/:id` - Delete schedule (admin/doctor)

#### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/patient/:pid` - Get patient appointments
- `GET /api/appointments/doctor/:did` - Get doctor appointments
- `POST /api/appointments` - Book appointment
- `DELETE /api/appointments/:id` - Cancel appointment

#### Patients
- `GET /api/patients` - Get all patients (admin/doctor)
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient profile

#### Specialties
- `GET /api/specialties` - Get all medical specialties

### Database Schema

The system uses the following database tables from the original PHP version:

```sql
-- webuser: Authentication
-- admin: Admin accounts
-- doctor: Doctor profiles
-- patient: Patient profiles
-- schedule: Appointment sessions
-- appointment: Patient bookings
-- specialties: Medical specialties (56 types)
```

See `E:\HealthPort\edoc-doctor-appointment-system\SQL_Database_edoc.sql` for the complete schema.

## 🔄 Migration from PHP

This React application is a conversion of the original PHP-based system located at:
`E:\HealthPort\edoc-doctor-appointment-system`

### Key Improvements

1. **Modern Stack:** React + TypeScript instead of vanilla PHP
2. **Component-Based:** Reusable UI components
3. **Type Safety:** Full TypeScript support
4. **Better UX:** Single-page application with client-side routing
5. **Tailwind CSS:** Utility-first CSS framework
6. **State Management:** Centralized auth and data management
7. **Security:** Token-based authentication (to be implemented)

### Migration Status

✅ Completed:
- React project setup with Vite + TypeScript
- Tailwind CSS configuration
- All UI components (Button, Input, Select, Table, etc.)
- Authentication pages (Login, Signup, Create Account)
- Landing page
- Admin portal (8 pages)
- Doctor portal (6 pages)
- Patient portal (6 pages)
- Protected routes with RBAC
- State management with Context API

⏳ To Do:
- Backend API implementation
- Database connection and queries
- JWT authentication
- Password hashing (bcrypt)
- Input validation and sanitization
- Error handling
- Loading states
- Success/error notifications
- API integration testing
- Deployment configuration

## 🔒 Security Considerations

### Issues in Original PHP Code
1. ❌ Plain text password storage
2. ❌ SQL injection vulnerabilities
3. ❌ No CSRF protection
4. ❌ Minimal input validation

### Recommended Improvements
1. ✅ Implement JWT tokens for authentication
2. ✅ Use bcrypt for password hashing
3. ✅ Add CSRF tokens to all forms
4. ✅ Implement input validation (Zod/Yup)
5. ✅ Use parameterized queries
6. ✅ Add rate limiting
7. ✅ Implement HTTPS only
8. ✅ Add security headers

## 🚧 Next Steps

### 1. Backend Implementation (Priority: High)
Create a Node.js/Express backend or use PHP with proper security:

```bash
# Example with Express
npm install express cors bcryptjs jsonwebtoken mysql2
```

### 2. API Service Implementation
Update `src/services/authService.ts` and create additional services:
- `doctorService.ts`
- `patientService.ts`
- `scheduleService.ts`
- `appointmentService.ts`

### 3. Database Connection
Connect to the MySQL database from the original PHP system or create a new one.

### 4. Testing
Add unit tests and integration tests:
```bash
npm install -D vitest @testing-library/react
```

### 5. Deployment
Configure for production deployment:
- Build optimization
- Environment variables
- CI/CD pipeline
- Hosting (Vercel, Netlify, etc.)

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=HealthPort
```

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is for educational/internal use.

## 👥 User Accounts (For Testing)

### Default Admin Account
- Email: `admin@edoc.com`
- Password: `123`

### Demo Doctor
- Create via admin panel

### Demo Patient
- Sign up via registration form

## 📞 Support

For issues or questions, please check the documentation or contact the development team.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
