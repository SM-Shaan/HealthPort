import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import StatusCard from '../../components/StatusCard';
import Table from '../../components/Table';
import { Schedule } from '../../types';

const DoctorHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    sessions: 0,
    appointments: 0,
    patients: 0,
  });
  const [upcomingSessions, setUpcomingSessions] = useState<Schedule[]>([]);

  useEffect(() => {
    // TODO: Fetch stats from API
    setStats({
      sessions: 5,
      appointments: 12,
      patients: 35,
    });

    setUpcomingSessions([
      {
        scheduleid: 1,
        docid: 1,
        title: 'General Checkup',
        scheduledate: '2024-12-15',
        scheduletime: '10:00 AM',
        nop: 10,
      },
    ]);
  }, []);

  const sessionColumns = [
    { header: 'Session Title', accessor: 'title' as keyof Schedule },
    { header: 'Date', accessor: 'scheduledate' as keyof Schedule },
    { header: 'Time', accessor: 'scheduletime' as keyof Schedule },
    { header: 'Capacity', accessor: 'nop' as keyof Schedule },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user?.name || 'Doctor'}!
        </h1>
        <p className="text-gray-600">Here's an overview of your schedule and appointments.</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard
          icon="📅"
          title="My Sessions"
          count={stats.sessions}
          bgColor="bg-blue-50"
        />
        <StatusCard
          icon="📋"
          title="Appointments"
          count={stats.appointments}
          bgColor="bg-green-50"
        />
        <StatusCard
          icon="👥"
          title="My Patients"
          count={stats.patients}
          bgColor="bg-purple-50"
        />
      </div>

      {/* Upcoming Sessions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Sessions (Next Week)</h2>
        <Table
          columns={sessionColumns}
          data={upcomingSessions}
          emptyMessage="No upcoming sessions"
        />
      </div>
    </div>
  );
};

export default DoctorHome;
