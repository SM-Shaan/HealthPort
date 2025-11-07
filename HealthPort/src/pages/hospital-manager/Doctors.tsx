import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Table from '../../components/Table';

interface Doctor {
  docid: number;
  docemail: string;
  docname: string;
  docnic: string;
  doctel: string;
  specialties: number;
  specialty_name: string;
}

const Doctors = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/hospital-manager/${user.id}/doctors`
      );

      if (!response.ok) {
        throw new Error('Failed to load doctors');
      }

      const data = await response.json();
      setDoctors(data);
    } catch (err) {
      console.error('Error loading doctors:', err);
      alert('Failed to load doctors. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'docid' as keyof Doctor },
    { header: 'Name', accessor: 'docname' as keyof Doctor },
    { header: 'Email', accessor: 'docemail' as keyof Doctor },
    { header: 'Specialty', accessor: 'specialty_name' as keyof Doctor },
    { header: 'Phone', accessor: 'doctel' as keyof Doctor },
    { header: 'NIC', accessor: 'docnic' as keyof Doctor },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Doctors</h1>
          <p className="text-gray-600">
            View all doctors at your hospital
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading doctors...</div>
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">👨‍⚕️</div>
          <p className="text-gray-600">No doctors found at your hospital.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table columns={columns} data={doctors} />
        </div>
      )}
    </div>
  );
};

export default Doctors;
