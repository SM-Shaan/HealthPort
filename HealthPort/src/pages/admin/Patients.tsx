import { useState, useEffect } from 'react';
import Table from '../../components/Table';
import Input from '../../components/Input';
import { Patient } from '../../types';

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // TODO: Fetch patients from API
    setPatients([
      {
        pid: 1,
        pemail: 'patient@example.com',
        pname: 'John Doe',
        paddress: '123 Main St, City',
        pnic: '987654321',
        pdob: '1990-01-01',
        ptel: '0771234567',
      },
    ]);
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.pname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.pemail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const patientColumns = [
    { header: 'Name', accessor: 'pname' as keyof Patient },
    { header: 'Email', accessor: 'pemail' as keyof Patient },
    { header: 'Phone', accessor: 'ptel' as keyof Patient },
    { header: 'NIC', accessor: 'pnic' as keyof Patient },
    { header: 'Date of Birth', accessor: 'pdob' as keyof Patient },
    { header: 'Address', accessor: 'paddress' as keyof Patient },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Patient Management</h1>

      <div className="bg-white p-4 rounded-lg shadow">
        <Input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
      </div>

      <Table
        columns={patientColumns}
        data={filteredPatients}
        emptyMessage="No patients found"
      />
    </div>
  );
};

export default Patients;
