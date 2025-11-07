import { useState, useEffect } from 'react';
import Table from '../../components/Table';
import Button from '../../components/Button';
import { Appointment } from '../../types';

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // TODO: Fetch appointments from API
    setAppointments([
      {
        appoid: 1,
        pid: 1,
        apponum: 1,
        scheduleid: 1,
        appodate: '2024-12-15',
        pname: 'John Doe',
        docname: 'Dr. Smith',
        scheduletime: '10:00 AM',
        title: 'General Checkup',
      },
    ]);
  }, []);

  const appointmentColumns = [
    { header: 'Appt #', accessor: 'apponum' as keyof Appointment },
    { header: 'Patient', accessor: 'pname' as keyof Appointment },
    { header: 'Doctor', accessor: 'docname' as keyof Appointment },
    { header: 'Session', accessor: 'title' as keyof Appointment },
    { header: 'Date', accessor: 'appodate' as keyof Appointment },
    { header: 'Time', accessor: 'scheduletime' as keyof Appointment },
    {
      header: 'Actions',
      accessor: (appointment: Appointment) => (
        <Button
          variant="danger"
          className="text-sm px-3 py-1"
          onClick={() => handleDelete(appointment.appoid)}
        >
          Cancel
        </Button>
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments(appointments.filter(a => a.appoid !== id));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">All Appointments</h1>

      <Table
        columns={appointmentColumns}
        data={appointments}
        emptyMessage="No appointments found"
      />
    </div>
  );
};

export default Appointments;
