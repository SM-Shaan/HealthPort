import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Table from '../../components/Table';

interface Schedule {
  scheduleid: number;
  docid: number;
  title: string;
  scheduledate: string;
  scheduletime: string;
  nop: number;
  doctor_name: string;
  specialty_name: string;
  booked: number;
  available_slots: number;
}

const Schedules = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/hospital-manager/${user.id}/schedules`
      );

      if (!response.ok) {
        throw new Error('Failed to load schedules');
      }

      const data = await response.json();

      // Format dates for display
      const formattedData = data.map((schedule: Schedule) => ({
        ...schedule,
        scheduledate: new Date(schedule.scheduledate).toLocaleDateString(
          'en-US',
          {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }
        ),
      }));

      setSchedules(formattedData);
    } catch (err) {
      console.error('Error loading schedules:', err);
      alert('Failed to load schedules. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'scheduleid' as keyof Schedule },
    { header: 'Doctor', accessor: 'doctor_name' as keyof Schedule },
    { header: 'Specialty', accessor: 'specialty_name' as keyof Schedule },
    { header: 'Title', accessor: 'title' as keyof Schedule },
    { header: 'Date', accessor: 'scheduledate' as keyof Schedule },
    { header: 'Time', accessor: 'scheduletime' as keyof Schedule },
    { header: 'Capacity', accessor: 'nop' as keyof Schedule },
    { header: 'Booked', accessor: 'booked' as keyof Schedule },
    { header: 'Available', accessor: 'available_slots' as keyof Schedule },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Schedules</h1>
          <p className="text-gray-600">
            View all doctor schedules at your hospital
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading schedules...</div>
        </div>
      ) : schedules.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">📅</div>
          <p className="text-gray-600">No schedules found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table columns={columns} data={schedules} />
        </div>
      )}
    </div>
  );
};

export default Schedules;
