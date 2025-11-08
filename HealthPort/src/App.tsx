import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import CreateAccount from './pages/auth/CreateAccount'
import AdminDashboard from './pages/admin/Dashboard'
import DoctorDashboard from './pages/doctor/Dashboard'
import PatientDashboard from './pages/patient/Dashboard'
import HospitalManagerDashboard from './pages/hospital-manager/Dashboard'
import LandingPage from './pages/LandingPage'
import ProtectedRoute from './components/ProtectedRoute'
import Debug from './pages/Debug'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/debug" element={<Debug />} />

          {/* Protected routes - Admin */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Protected routes - Doctor */}
          <Route path="/doctor/*" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />

          {/* Protected routes - Patient */}
          <Route path="/patient/*" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />

          {/* Protected routes - Hospital Manager */}
          <Route path="/hospital-manager/*" element={
            <ProtectedRoute allowedRoles={['hospital_manager']}>
              <HospitalManagerDashboard />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
