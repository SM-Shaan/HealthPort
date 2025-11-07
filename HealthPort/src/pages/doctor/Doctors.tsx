import { useState, useEffect } from 'react';
import Table from '../../components/Table';
import Input from '../../components/Input';
import { Doctor } from '../../types';

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // TODO: Fetch all doctors from API
    setDoctors([
      {
        docid: 1,
        docemail: 'doctor@example.com',
        docname: 'Dr. John Smith',
        docnic: '123456789',
        doctel: '0771234567',
        specialties: 1,
        specialtyName: 'Cardiology',
      },
    ]);
  }, []);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.docname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialtyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const doctorColumns = [
    { header: 'Name', accessor: 'docname' as keyof Doctor },
    { header: 'Specialty', accessor: 'specialtyName' as keyof Doctor },
    { header: 'Email', accessor: 'docemail' as keyof Doctor },
    { header: 'Phone', accessor: 'doctel' as keyof Doctor },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">All Doctors</h1>

      <div className="bg-white p-4 rounded-lg shadow">
        <Input
          type="text"
          placeholder="Search by name or specialty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
      </div>

      <Table
        columns={doctorColumns}
        data={filteredDoctors}
        emptyMessage="No doctors found"
      />
    </div>
  );
};

export default Doctors;
