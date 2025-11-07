import { useState, useEffect } from 'react';
import { appointmentService, Appointment } from '../../services/appointmentService';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';

interface PatientWithHistory {
  pid: number;
  patient_name: string;
  appointments: Appointment[];
  totalAppointments: number;
  lastAppointment: string;
}

const MyPatients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<PatientWithHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedPatient, setExpandedPatient] = useState<number | null>(null);

  useEffect(() => {
    loadPatients();
  }, [user]);

  const loadPatients = async () => {
    if (!user || !user.id) return;

    setIsLoading(true);
    try {
      const appointments = await appointmentService.getDoctorAppointments(user.id);

      // Group appointments by patient
      const patientMap = new Map<number, PatientWithHistory>();

      appointments.forEach((apt) => {
        if (!apt.pid) return;

        if (!patientMap.has(apt.pid)) {
          patientMap.set(apt.pid, {
            pid: apt.pid,
            patient_name: apt.patient_name || 'Unknown Patient',
            appointments: [],
            totalAppointments: 0,
            lastAppointment: apt.appodate,
          });
        }

        const patient = patientMap.get(apt.pid)!;
        patient.appointments.push(apt);
        patient.totalAppointments++;

        // Update last appointment if this one is more recent
        if (new Date(apt.appodate) > new Date(patient.lastAppointment)) {
          patient.lastAppointment = apt.appodate;
        }
      });

      // Convert map to array and sort by last appointment date
      const patientsList = Array.from(patientMap.values()).sort(
        (a, b) => new Date(b.lastAppointment).getTime() - new Date(a.lastAppointment).getTime()
      );

      setPatients(patientsList);
    } catch (err) {
      console.error('Error loading patients:', err);
      alert('Failed to load patient history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePatientExpansion = (pid: number) => {
    setExpandedPatient(expandedPatient === pid ? null : pid);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
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
        <h1 className="text-3xl font-bold text-gray-800">My Patients</h1>
        <Button onClick={loadPatients} variant="secondary">
          Refresh
        </Button>
      </div>

      {/* Summary Card */}
      {!isLoading && patients.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Total Patients: {patients.length}</h2>
              <p className="text-blue-100">
                {patients.reduce((sum, p) => sum + p.totalAppointments, 0)} total appointments
              </p>
            </div>
            <svg
              className="w-16 h-16 text-white opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading patient history...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && patients.length === 0 && (
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No patients yet
          </h3>
          <p className="text-gray-600">
            Patients will appear here once they book appointments with you.
          </p>
        </div>
      )}

      {/* Patients List */}
      {!isLoading && patients.length > 0 && (
        <div className="space-y-4">
          {patients.map((patient) => (
            <div
              key={patient.pid}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Patient Header */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => togglePatientExpansion(patient.pid)}
              >
                <div className="flex items-center justify-between">
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
                      <h3 className="text-lg font-bold text-gray-800">
                        {patient.patient_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {patient.totalAppointments} appointment{patient.totalAppointments !== 1 ? 's' : ''} •
                        Last visit: {formatDate(patient.lastAppointment)}
                      </p>
                    </div>
                  </div>
                  <svg
                    className={`w-6 h-6 text-gray-400 transition-transform ${
                      expandedPatient === patient.pid ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Appointment History (Expandable) */}
              {expandedPatient === patient.pid && (
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Appointment History
                  </h4>
                  <div className="space-y-3">
                    {patient.appointments.map((apt) => (
                      <div
                        key={apt.appoid}
                        className="bg-white p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-semibold">
                                Appt #{apt.apponum}
                              </span>
                              <span className="text-gray-700 font-medium">
                                {apt.schedule_title || 'Consultation'}
                              </span>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
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
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                {formatDate(apt.appodate)}
                              </div>
                              <div className="flex items-center gap-2">
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
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {formatTime(apt.appodate)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPatients;
