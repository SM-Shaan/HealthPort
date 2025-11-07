import { useState, useEffect } from 'react';
import Table from '../../components/Table';
import Button from '../../components/Button';
import { appointmentService, Appointment as AppointmentType } from '../../services/appointmentService';
import { useAuth } from '../../contexts/AuthContext';

interface DisplayAppointment extends AppointmentType {
  pname?: string;
  scheduletime?: string;
  title?: string;
}

const MyAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<DisplayAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, [user]);

  const loadAppointments = async () => {
    if (!user || !user.id) return;

    setIsLoading(true);
    try {
      const data = await appointmentService.getDoctorAppointments(user.id);

      // Transform data to include display fields
      const displayData: DisplayAppointment[] = data.map(apt => ({
        ...apt,
        pname: apt.patient_name,
        scheduletime: new Date(apt.appodate).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        title: apt.schedule_title || 'Consultation',
      }));

      setAppointments(displayData);
    } catch (err) {
      console.error('Error loading appointments:', err);
      alert('Failed to load appointments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const appointmentColumns = [
    { header: 'Appt #', accessor: 'apponum' as keyof DisplayAppointment },
    { header: 'Patient Name', accessor: 'pname' as keyof DisplayAppointment },
    { header: 'Session', accessor: 'title' as keyof DisplayAppointment },
    {
      header: 'Date',
      accessor: (apt: DisplayAppointment) => new Date(apt.appodate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    },
    { header: 'Time', accessor: 'scheduletime' as keyof DisplayAppointment },
    {
      header: 'Actions',
      accessor: (appointment: DisplayAppointment) => (
        <Button
          variant="danger"
          className="text-sm px-3 py-1"
          onClick={() => handleCancel(appointment.appoid)}
        >
          Cancel
        </Button>
      ),
    },
  ];

  const handleCancel = async (id: number) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.deleteAppointment(id);
        alert('Appointment cancelled successfully!');
        loadAppointments(); // Reload appointments
      } catch (err) {
        console.error('Error cancelling appointment:', err);
        alert('Failed to cancel appointment. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
        <Button onClick={loadAppointments} variant="secondary">
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      ) : (
        <Table
          columns={appointmentColumns}
          data={appointments}
          emptyMessage="No appointments scheduled"
        />
      )}
    </div>
  );
};

export default MyAppointments;
