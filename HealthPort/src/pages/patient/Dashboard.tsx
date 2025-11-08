import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import PatientHome from './Home';
import BrowseDoctors from './BrowseDoctors';
import BrowseSessions from './BrowseSessions';
import BookAppointment from './BookAppointment';
import MyAppointments from './MyAppointments';
import NearestHospitals from './NearestHospitals';
import Settings from './Settings';

const menuItems = [
  { name: 'Home', path: '/patient', icon: '🏠' },
  { name: 'All Doctors', path: '/patient/doctors', icon: '👨‍⚕️' },
  { name: 'Nearest Hospitals', path: '/patient/hospitals', icon: '🏥' },
  { name: 'Browse Sessions', path: '/patient/sessions', icon: '📅' },
  { name: 'My Bookings', path: '/patient/appointments', icon: '📋' },
  { name: 'Settings', path: '/patient/settings', icon: '⚙️' },
];

const PatientDashboard = () => {
  return (
    <DashboardLayout menuItems={menuItems}>
      <Routes>
        <Route index element={<PatientHome />} />
        <Route path="doctors" element={<BrowseDoctors />} />
        <Route path="hospitals" element={<NearestHospitals />} />
        <Route path="sessions" element={<BrowseSessions />} />
        <Route path="book/:scheduleId" element={<BookAppointment />} />
        <Route path="appointments" element={<MyAppointments />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/patient" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default PatientDashboard;
