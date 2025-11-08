import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import StatusCard from '../../components/StatusCard';

interface Statistics {
  totalDoctors: number;
  totalAppointments: number;
  totalPatients: number;
  totalSchedules: number;
  hospital_id: number;
}

const ManagerHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Statistics>({
    totalDoctors: 0,
    totalAppointments: 0,
    totalPatients: 0,
    totalSchedules: 0,
    hospital_id: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/hospital-manager/${user.id}/statistics`
      );

      if (!response.ok) {
        throw new Error('Failed to load statistics');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error loading statistics:', err);
      alert('Failed to load statistics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Hospital Manager Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {user?.name}! Here's your hospital overview.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading statistics...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatusCard
            title="Total Doctors"
            count={stats.totalDoctors}
            icon="👨‍⚕️"
            bgColor="bg-blue-50"
          />
          <StatusCard
            title="Total Appointments"
            count={stats.totalAppointments}
            icon="📋"
            bgColor="bg-green-50"
          />
          <StatusCard
            title="Total Patients"
            count={stats.totalPatients}
            icon="👥"
            bgColor="bg-purple-50"
          />
          <StatusCard
            title="Total Schedules"
            count={stats.totalSchedules}
            icon="📅"
            bgColor="bg-orange-50"
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/hospital-manager/doctors"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="text-2xl mb-2">👨‍⚕️</div>
            <h3 className="font-semibold text-gray-800">View Doctors</h3>
            <p className="text-sm text-gray-600">
              Manage your hospital's medical staff
            </p>
          </a>

          <a
            href="/hospital-manager/appointments"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold text-gray-800">View Appointments</h3>
            <p className="text-sm text-gray-600">
              Check all scheduled appointments
            </p>
          </a>

          <a
            href="/hospital-manager/schedules"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="text-2xl mb-2">📅</div>
            <h3 className="font-semibold text-gray-800">View Schedules</h3>
            <p className="text-sm text-gray-600">
              Manage doctor availability
            </p>
          </a>

          <a
            href="/hospital-manager/patients"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="text-2xl mb-2">👥</div>
            <h3 className="font-semibold text-gray-800">View Patients</h3>
            <p className="text-sm text-gray-600">
              See all registered patients
            </p>
          </a>

          <a
            href="/hospital-manager/hospital"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="text-2xl mb-2">🏥</div>
            <h3 className="font-semibold text-gray-800">Hospital Info</h3>
            <p className="text-sm text-gray-600">
              View hospital details
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ManagerHome;
