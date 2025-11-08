import { useState, useEffect } from 'react';
import { appointmentService, Appointment } from '../../services/appointmentService';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAppointments();
  }, [user]);

  const loadAppointments = async () => {
    if (!user || !user.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await appointmentService.getPatientAppointments(user.id);
      setAppointments(data);
    } catch (err) {
      console.error('Error loading appointments:', err);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: number) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await appointmentService.deleteAppointment(appointmentId);
      alert('Appointment cancelled successfully!');
      loadAppointments(); // Reload the list
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
        <Button onClick={loadAppointments} variant="secondary">
          Refresh
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && appointments.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-24 h-24 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No appointments yet
          </h3>
          <p className="text-gray-600">
            Book your first appointment from the "Nearest Hospitals" or "All Doctors" section.
          </p>
        </div>
      )}

      {/* Appointments List */}
      {!isLoading && !error && appointments.length > 0 && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              You have {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
            </p>
          </div>

          {appointments.map((appointment) => (
            <div
              key={appointment.appoid}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Appointment Number */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        Appointment #{appointment.apponum}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        Confirmed
                      </span>
                    </div>

                    {/* Doctor and Specialty */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        Dr. {appointment.doctor_name}
                      </h3>
                      <p className="text-gray-600">{appointment.specialty}</p>
                    </div>

                    {/* Schedule Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-semibold">{formatDate(appointment.appodate)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500">Time</p>
                          <p className="font-semibold">{formatTime(appointment.appodate)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Session Title */}
                    {appointment.schedule_title && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500">Session</p>
                          <p className="font-semibold">{appointment.schedule_title}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cancel Button */}
                  <div>
                    <Button
                      onClick={() => handleCancelAppointment(appointment.appoid)}
                      variant="secondary"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer with additional info */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Booked on {formatDate(appointment.appodate)} at {formatTime(appointment.appodate)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
