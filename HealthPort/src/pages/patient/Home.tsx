import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import StatusCard from '../../components/StatusCard';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Appointment } from '../../types';

const PatientHome = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [upcomingBookings, setUpcomingBookings] = useState<Appointment[]>([]);

  useEffect(() => {
    // TODO: Fetch upcoming bookings from API
    setUpcomingBookings([
      {
        appoid: 1,
        pid: 1,
        apponum: 1,
        scheduleid: 1,
        appodate: '2024-12-15',
        docname: 'Dr. John Smith',
        scheduletime: '10:00 AM',
        title: 'General Checkup',
      },
    ]);
  }, []);

  const bookingColumns = [
    { header: 'Appt #', accessor: 'apponum' as keyof Appointment },
    { header: 'Doctor', accessor: 'docname' as keyof Appointment },
    { header: 'Session', accessor: 'title' as keyof Appointment },
    { header: 'Date', accessor: 'appodate' as keyof Appointment },
    { header: 'Time', accessor: 'scheduletime' as keyof Appointment },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user?.name || 'Patient'}!
        </h1>
        <p className="text-gray-600">Book appointments with your preferred doctors easily.</p>
      </div>

      {/* Quick Search */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Find a Doctor</h2>
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Search by doctor name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
          <Link to="/patient/doctors">
            <Button>Search</Button>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/patient/doctors">
          <StatusCard
            icon="👨‍⚕️"
            title="Browse Doctors"
            count={0}
            bgColor="bg-blue-50"
          />
        </Link>
        <Link to="/patient/sessions">
          <StatusCard
            icon="📅"
            title="Available Sessions"
            count={0}
            bgColor="bg-green-50"
          />
        </Link>
        <Link to="/patient/appointments">
          <StatusCard
            icon="📋"
            title="My Bookings"
            count={upcomingBookings.length}
            bgColor="bg-purple-50"
          />
        </Link>
      </div>

      {/* Upcoming Bookings */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Upcoming Appointments</h2>
          <Link to="/patient/appointments">
            <Button variant="secondary">View All</Button>
          </Link>
        </div>
        <Table
          columns={bookingColumns}
          data={upcomingBookings}
          emptyMessage="No upcoming appointments. Book one now!"
        />
      </div>
    </div>
  );
};

export default PatientHome;
