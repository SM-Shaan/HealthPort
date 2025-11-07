import { useState, useEffect } from 'react';
import Table from '../../components/Table';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { Doctor, Specialty } from '../../types';
import { doctorService } from '../../services/doctorService';

const BrowseDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch doctors and specialties from API
        const [doctorsData, specialtiesData] = await Promise.all([
          doctorService.getAllDoctors(),
          doctorService.getAllSpecialties(),
        ]);

        setDoctors(doctorsData);
        setSpecialties(specialtiesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.docname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === '' || doctor.specialties.toString() === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const doctorColumns = [
    { header: 'Doctor Name', accessor: 'docname' as keyof Doctor },
    { header: 'Specialty', accessor: 'specialtyName' as keyof Doctor },
    { header: 'Email', accessor: 'docemail' as keyof Doctor },
    { header: 'Phone', accessor: 'doctel' as keyof Doctor },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">All Doctors</h1>
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">All Doctors</h1>
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-red-600">Error: {error}</p>
          <p className="text-gray-600 mt-2">Please make sure the backend server is running on http://localhost:5000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">All Doctors</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Search by doctor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
          <Select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            options={[
              { value: '', label: 'All Specialties' },
              ...specialties.map(s => ({ value: s.id.toString(), label: s.sname }))
            ]}
            fullWidth
          />
        </div>
      </div>

      <Table
        columns={doctorColumns}
        data={filteredDoctors}
        emptyMessage="No doctors found"
      />
    </div>
  );
};

export default BrowseDoctors;
