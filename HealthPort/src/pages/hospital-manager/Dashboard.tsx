import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import ManagerHome from './Home';
import Doctors from './Doctors';
import Appointments from './Appointments';
import Patients from './Patients';
import Schedules from './Schedules';
import HospitalInfo from './HospitalInfo';

const menuItems = [
  { name: 'Dashboard', path: '/hospital-manager', icon: '📊' },
  { name: 'Hospital Info', path: '/hospital-manager/hospital', icon: '🏥' },
  { name: 'Doctors', path: '/hospital-manager/doctors', icon: '👨‍⚕️' },
  { name: 'Appointments', path: '/hospital-manager/appointments', icon: '📋' },
  { name: 'Schedules', path: '/hospital-manager/schedules', icon: '📅' },
  { name: 'Patients', path: '/hospital-manager/patients', icon: '👥' },
];

const HospitalManagerDashboard = () => {
  return (
    <DashboardLayout menuItems={menuItems} userRole="hospital_manager">
      <Routes>
        <Route index element={<ManagerHome />} />
        <Route path="hospital" element={<HospitalInfo />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="schedules" element={<Schedules />} />
        <Route path="patients" element={<Patients />} />
        <Route path="*" element={<Navigate to="/hospital-manager" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default HospitalManagerDashboard;
