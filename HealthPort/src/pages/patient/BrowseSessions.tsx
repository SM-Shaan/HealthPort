import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { Schedule, Doctor } from '../../types';

const BrowseSessions = () => {
  const [sessions, setSessions] = useState<Schedule[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    // TODO: Fetch sessions and doctors from API
    setSessions([
      {
        scheduleid: 1,
        docid: 1,
        title: 'General Checkup Session',
        scheduledate: '2024-12-15',
        scheduletime: '10:00 AM',
        nop: 10,
        docname: 'Dr. John Smith',
        specialtyName: 'Cardiology',
      },
      {
        scheduleid: 2,
        docid: 2,
        title: 'Consultation',
        scheduledate: '2024-12-16',
        scheduletime: '2:00 PM',
        nop: 8,
        docname: 'Dr. Jane Doe',
        specialtyName: 'Dermatology',
      },
    ]);

    setDoctors([
      {
        docid: 1,
        docemail: 'doctor@example.com',
        docname: 'Dr. John Smith',
        docnic: '123',
        doctel: '077',
        specialties: 1,
        specialtyName: 'Cardiology',
      },
      {
        docid: 2,
        docemail: 'doctor2@example.com',
        docname: 'Dr. Jane Doe',
        docnic: '987',
        doctel: '079',
        specialties: 2,
        specialtyName: 'Dermatology',
      },
    ]);
  }, []);

  const filteredSessions = sessions.filter(session => {
    const matchesDoctor = selectedDoctor === '' || session.docid.toString() === selectedDoctor;
    const matchesDate = selectedDate === '' || session.scheduledate === selectedDate;
    return matchesDoctor && matchesDate;
  });

  const sessionColumns = [
    { header: 'Session Title', accessor: 'title' as keyof Schedule },
    { header: 'Doctor', accessor: 'docname' as keyof Schedule },
    { header: 'Specialty', accessor: 'specialtyName' as keyof Schedule },
    { header: 'Date', accessor: 'scheduledate' as keyof Schedule },
    { header: 'Time', accessor: 'scheduletime' as keyof Schedule },
    { header: 'Slots', accessor: 'nop' as keyof Schedule },
    {
      header: 'Action',
      accessor: (session: Schedule) => (
        <Link to={`/patient/book/${session.scheduleid}`}>
          <Button className="text-sm px-3 py-1">Book Now</Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Available Sessions</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            options={[
              { value: '', label: 'All Doctors' },
              ...doctors.map(d => ({ value: d.docid.toString(), label: d.docname }))
            ]}
            fullWidth
          />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            fullWidth
          />
        </div>
      </div>

      <Table
        columns={sessionColumns}
        data={filteredSessions}
        emptyMessage="No sessions available"
      />
    </div>
  );
};

export default BrowseSessions;
