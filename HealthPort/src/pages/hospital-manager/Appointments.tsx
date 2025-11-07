import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Table from '../../components/Table';

interface Appointment {
  appoid: number;
  pid: number;
  apponum: number;
  scheduleid: number;
  appodate: string;
  patient_name: string;
  doctor_name: string;
  schedule_title: string;
  specialty: string;
}

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/hospital-manager/${user.id}/appointments`
      );

      if (!response.ok) {
        throw new Error('Failed to load appointments');
      }

      const data = await response.json();

      // Format dates for display
      const formattedData = data.map((apt: Appointment) => ({
        ...apt,
        appodate: new Date(apt.appodate).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));

      setAppointments(formattedData);
    } catch (err) {
      console.error('Error loading appointments:', err);
      alert('Failed to load appointments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { header: 'Appt #', accessor: 'apponum' as keyof Appointment },
    { header: 'Patient', accessor: 'patient_name' as keyof Appointment },
    { header: 'Doctor', accessor: 'doctor_name' as keyof Appointment },
    { header: 'Session', accessor: 'schedule_title' as keyof Appointment },
    { header: 'Specialty', accessor: 'specialty' as keyof Appointment },
    { header: 'Date & Time', accessor: 'appodate' as keyof Appointment },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Appointments
          </h1>
          <p className="text-gray-600">
            View all appointments at your hospital
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading appointments...</div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">📋</div>
          <p className="text-gray-600">No appointments found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table columns={columns} data={appointments} />
        </div>
      )}
    </div>
  );
};

export default Appointments;
