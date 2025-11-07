import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Hospital {
  hospital_id: number;
  name: string;
  address: string;
  contact_no: string;
  admin_email: string;
  latitude?: string;
  longitude?: string;
}

const HospitalInfo = () => {
  const { user } = useAuth();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadHospital();
  }, []);

  const loadHospital = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/hospital-manager/${user.id}/hospital`
      );

      if (!response.ok) {
        throw new Error('Failed to load hospital');
      }

      const data = await response.json();
      setHospital(data);
    } catch (err) {
      console.error('Error loading hospital:', err);
      alert('Failed to load hospital information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600">Loading hospital information...</div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-400 text-4xl mb-4">🏥</div>
        <p className="text-gray-600">Hospital information not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Hospital Information
        </h1>
        <p className="text-gray-600">View your hospital details</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center">
            <div className="text-4xl mr-4">🏥</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {hospital.name}
              </h2>
              <p className="text-gray-600">Hospital ID: {hospital.hospital_id}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <p className="text-gray-900">{hospital.address}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <p className="text-gray-900">{hospital.contact_no}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <p className="text-gray-900">{hospital.admin_email}</p>
            </div>

            {hospital.latitude && hospital.longitude && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Coordinates
                </label>
                <p className="text-gray-900">
                  Lat: {hospital.latitude}, Lng: {hospital.longitude}
                </p>
              </div>
            )}
          </div>

          {hospital.latitude && hospital.longitude && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Map Location
              </label>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <a
                  href={`https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalInfo;
