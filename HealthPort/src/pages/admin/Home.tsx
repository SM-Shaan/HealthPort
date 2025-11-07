import { useState, useEffect } from 'react';
import StatusCard from '../../components/StatusCard';
import Table from '../../components/Table';
import { Appointment } from '../../types';
import { adminService } from '../../services/adminService';
import Button from '../../components/Button';

const AdminHome = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    sessions: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch statistics and upcoming appointments in parallel
      const [statistics, upcoming] = await Promise.all([
        adminService.getStatistics(),
        adminService.getUpcomingAppointments(7),
      ]);

      setStats({
        doctors: statistics.totalDoctors,
        patients: statistics.totalPatients,
        appointments: statistics.totalAppointments,
        sessions: statistics.todaySessions,
      });

      // Map appointments to display format
      const displayAppointments: Appointment[] = upcoming.map((apt) => ({
        appoid: apt.appoid,
        pid: apt.pid,
        apponum: apt.apponum,
        scheduleid: apt.scheduleid,
        appodate: new Date(apt.appodate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        pname: apt.patient_name || 'Unknown',
        docname: apt.doctor_name || 'Unknown',
        scheduletime: new Date(apt.appodate).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        title: apt.schedule_title || 'Consultation',
      }));

      setUpcomingAppointments(displayAppointments);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      alert('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const appointmentColumns = [
    { header: 'Appointment #', accessor: 'apponum' as keyof Appointment },
    { header: 'Patient', accessor: 'pname' as keyof Appointment },
    { header: 'Doctor', accessor: 'docname' as keyof Appointment },
    { header: 'Session', accessor: 'title' as keyof Appointment },
    { header: 'Date', accessor: 'appodate' as keyof Appointment },
    { header: 'Time', accessor: 'scheduletime' as keyof Appointment },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>
        <Button onClick={loadDashboardData} variant="secondary" disabled={isLoading}>
          Refresh
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      )}

      {/* Status Cards */}
      {!isLoading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatusCard
              icon="👨‍⚕️"
              title="Total Doctors"
              count={stats.doctors}
              bgColor="bg-blue-50"
            />
            <StatusCard
              icon="👥"
              title="Total Patients"
              count={stats.patients}
              bgColor="bg-green-50"
            />
            <StatusCard
              icon="📋"
              title="Total Appointments"
              count={stats.appointments}
              bgColor="bg-purple-50"
            />
            <StatusCard
              icon="📅"
              title="Today's Sessions"
              count={stats.sessions}
              bgColor="bg-orange-50"
            />
          </div>

          {/* Upcoming Appointments */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Upcoming Appointments (Next 7 Days)</h2>
            </div>
            <Table
              columns={appointmentColumns}
              data={upcomingAppointments}
              emptyMessage="No upcoming appointments in the next 7 days"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminHome;
