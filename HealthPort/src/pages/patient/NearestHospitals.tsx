import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hospitalService, HospitalWithDoctors, DoctorInHospital } from '../../services/hospitalService';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { Specialty } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';
import Select from '../../components/Select';
import BookingModal from '../../components/BookingModal';

const NearestHospitals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState<HospitalWithDoctors[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  // Booking modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorInHospital | null>(null);
  const [selectedHospitalName, setSelectedHospitalName] = useState('');

  // Load specialties on component mount
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const data = await doctorService.getAllSpecialties();
        setSpecialties(data);
      } catch (err) {
        console.error('Error loading specialties:', err);
      }
    };
    loadSpecialties();
  }, []);

  const findNearestHospitals = async () => {
    if (!selectedSpecialty) {
      setError('Please select a specialty first');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setHospitals([]); // Clear previous results

      // Get user's location
      const location = await hospitalService.getUserLocation();

      // Fetch nearest hospitals by specialty
      const nearestHospitals = await hospitalService.getNearestHospitalsBySpecialty(
        location.latitude,
        location.longitude,
        parseInt(selectedSpecialty),
        10
      );

      setHospitals(nearestHospitals);
      setLocationPermission('granted');
    } catch (err: any) {
      let errorMessage = 'Failed to find nearest hospitals';

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      // Check if it's a 404 error (no hospitals found)
      if (errorMessage.includes('404') || errorMessage.includes('not found') || errorMessage.includes('Not Found')) {
        const specialtyName = specialties.find(s => s.id.toString() === selectedSpecialty)?.sname || 'this specialty';
        setError(`No hospitals found with ${specialtyName} specialists near your location. Try selecting a different specialty or checking back later.`);
      } else if (errorMessage.includes('permission')) {
        setLocationPermission('denied');
        setError(errorMessage);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookAppointment = (doctor: DoctorInHospital, hospitalName: string) => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    setSelectedDoctor(doctor);
    setSelectedHospitalName(hospitalName);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = async (scheduleId: number, date: string, time: string) => {
    if (!user || !user.id) {
      alert('User information not found. Please log in again.');
      return;
    }

    try {
      // Create appointment in database
      const appointmentData = {
        patientId: user.id,
        scheduleId: scheduleId,
        appointmentDate: new Date().toISOString(), // Current timestamp
      };

      const appointment = await appointmentService.createAppointment(appointmentData);

      // Show success message
      alert(`Appointment booked successfully!\n\nAppointment Number: ${appointment.apponum}\nDoctor: ${selectedDoctor?.docname}\nHospital: ${selectedHospitalName}\nDate: ${date}\nTime: ${time}\n\nYou can view your appointment in the appointments section.`);

      // Close modal
      setIsBookingModalOpen(false);

      // Navigate to appointments page
      navigate('/patient/appointments');
    } catch (error: any) {
      console.error('Error creating appointment:', error);

      let errorMessage = 'Failed to book appointment. Please try again.';
      if (error.message) {
        if (error.message.includes('full')) {
          errorMessage = 'Sorry, this time slot is now full. Please select another slot.';
        } else if (error.message.includes('not found')) {
          errorMessage = 'Schedule not found. Please try selecting a different time slot.';
        } else {
          errorMessage = error.message;
        }
      }

      alert(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Find Nearest Specialists</h1>
      </div>

      {/* Specialty Selector and Search Button */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Specialty
          </label>
          <Select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            options={[
              { value: '', label: 'Choose a specialty...' },
              ...specialties.map(s => ({ value: s.id.toString(), label: s.sname }))
            ]}
            fullWidth
          />
        </div>
        <Button onClick={findNearestHospitals} disabled={isLoading || !selectedSpecialty} fullWidth>
          {isLoading ? 'Finding Hospitals...' : 'Find Nearest Hospitals'}
        </Button>
      </div>

      {/* Instructions */}
      {hospitals.length === 0 && !error && !isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Find hospitals and specialists near you
          </h3>
          <p className="text-blue-700 mb-4">
            Select a medical specialty and click "Find Nearest Hospitals" to discover hospitals with specialists closest to your current location.
          </p>
          <ul className="list-disc list-inside text-blue-700 space-y-1">
            <li>Choose the medical specialty you need</li>
            <li>Your browser will ask for location permission</li>
            <li>We'll show you the nearest hospitals with doctors in that specialty</li>
            <li>View available doctors and book appointments directly</li>
          </ul>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Getting your location and finding nearest hospitals...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
          <p className="text-red-700 mb-4">{error}</p>

          {locationPermission === 'denied' && (
            <div className="mt-4 p-4 bg-white rounded border border-red-300">
              <p className="text-sm text-gray-700 font-semibold mb-2">
                To enable location access:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Click the location icon in your browser's address bar</li>
                <li>Select "Allow" for location permissions</li>
                <li>Refresh the page and try again</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Hospitals List with Doctors */}
      {hospitals.length > 0 && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              Found {hospitals.length} hospital{hospitals.length !== 1 ? 's' : ''} with{' '}
              {specialties.find(s => s.id.toString() === selectedSpecialty)?.sname} specialists near you
            </p>
          </div>

          {hospitals.map((hospital, index) => (
            <div
              key={hospital.hospital_id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Hospital Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold">#{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{hospital.name}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="font-semibold">{hospital.distance_formatted} away</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-blue-100 mb-1">Address</p>
                    <p className="text-white">{hospital.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-100 mb-1">Contact</p>
                    <p className="text-white">{hospital.contact_no}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white hover:text-blue-100 font-medium"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    Get Directions
                  </a>
                </div>
              </div>

              {/* Doctors List */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Available Doctors ({hospital.doctor_count})
                  </h4>
                </div>

                <div className="space-y-3">
                  {hospital.doctors.map((doctor) => (
                    <div
                      key={doctor.docid}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800">{doctor.docname}</h5>
                          <p className="text-sm text-gray-600">{doctor.specialty_name}</p>
                          <p className="text-sm text-gray-500">{doctor.doctel}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleBookAppointment(doctor, hospital.name)}
                        variant="primary"
                      >
                        Book Appointment
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        doctor={selectedDoctor}
        hospitalName={selectedHospitalName}
        patientName={user?.name || ''}
        patientEmail={user?.email || ''}
        onSubmit={handleBookingSubmit}
      />
    </div>
  );
};

export default NearestHospitals;
