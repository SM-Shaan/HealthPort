import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import DoctorHome from './Home';
import MyAppointments from './MyAppointments';
import MySchedule from './MySchedule';
import MyPatients from './MyPatients';
import Doctors from './Doctors';
import Settings from './Settings';

const menuItems = [
  { name: 'Dashboard', path: '/doctor', icon: '📊' },
  { name: 'My Appointments', path: '/doctor/appointments', icon: '📋' },
  { name: 'My Schedule', path: '/doctor/schedule', icon: '📅' },
  { name: 'My Patients', path: '/doctor/patients', icon: '👥' },
  { name: 'All Doctors', path: '/doctor/doctors', icon: '👨‍⚕️' },
  { name: 'Settings', path: '/doctor/settings', icon: '⚙️' },
];

const DoctorDashboard = () => {
  return (
    <DashboardLayout menuItems={menuItems}>
      <Routes>
        <Route index element={<DoctorHome />} />
        <Route path="appointments" element={<MyAppointments />} />
        <Route path="schedule" element={<MySchedule />} />
        <Route path="patients" element={<MyPatients />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/doctor" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
