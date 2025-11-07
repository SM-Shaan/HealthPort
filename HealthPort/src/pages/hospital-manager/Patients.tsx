import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Table from '../../components/Table';

interface Patient {
  pid: number;
  pemail: string;
  pname: string;
  paddress: string;
  pnic: string;
  pdob: string;
  ptel: string;
}

const Patients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/hospital-manager/${user.id}/patients`
      );

      if (!response.ok) {
        throw new Error('Failed to load patients');
      }

      const data = await response.json();

      // Format dates for display
      const formattedData = data.map((patient: Patient) => ({
        ...patient,
        pdob: new Date(patient.pdob).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      }));

      setPatients(formattedData);
    } catch (err) {
      console.error('Error loading patients:', err);
      alert('Failed to load patients. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'pid' as keyof Patient },
    { header: 'Name', accessor: 'pname' as keyof Patient },
    { header: 'Email', accessor: 'pemail' as keyof Patient },
    { header: 'Phone', accessor: 'ptel' as keyof Patient },
    { header: 'Date of Birth', accessor: 'pdob' as keyof Patient },
    { header: 'Address', accessor: 'paddress' as keyof Patient },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Patients</h1>
          <p className="text-gray-600">
            View all patients with appointments at your hospital
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading patients...</div>
        </div>
      ) : patients.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">👥</div>
          <p className="text-gray-600">No patients found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table columns={columns} data={patients} />
        </div>
      )}
    </div>
  );
};

export default Patients;
