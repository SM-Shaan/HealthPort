import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import AdminHome from './Home';
import Doctors from './Doctors';
import AddDoctor from './AddDoctor';
import EditDoctor from './EditDoctor';
import Schedule from './Schedule';
import AddSession from './AddSession';
import Appointments from './Appointments';
import Patients from './Patients';

const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: '📊' },
  { name: 'Doctors', path: '/admin/doctors', icon: '👨‍⚕️' },
  { name: 'Schedule', path: '/admin/schedule', icon: '📅' },
  { name: 'Appointments', path: '/admin/appointments', icon: '📋' },
  { name: 'Patients', path: '/admin/patients', icon: '👥' },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout menuItems={menuItems}>
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/add" element={<AddDoctor />} />
        <Route path="doctors/edit/:id" element={<EditDoctor />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="schedule/add" element={<AddSession />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="patients" element={<Patients />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;
