import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';

interface Appointment {
  appoid: number;
  pid: number;
  apponum: number;
  scheduleid: number;
  appodate: string;
  patient_name: string;
  doctor_name: string;
  schedule_title: string;
  specialty: string;
}

interface Patient {
  pid: number;
  pname: string;
  pemail: string;
  ptel: string;
}

interface Schedule {
  scheduleid: number;
  title: string;
  scheduledate: string;
  scheduletime: string;
  nop: number;
  doctor_name: string;
  specialty_name: string;
  available_slots: number;
}

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isNewPatient, setIsNewPatient] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    patientId: '',
    scheduleId: '',
  });

  // New patient form state
  const [newPatientData, setNewPatientData] = useState({
    pname: '',
    pemail: '',
    ptel: '',
    paddress: '',
    pnic: '',
    pdob: '',
    ppassword: '',
    scheduleId: '',
  });

  useEffect(() => {
    loadAppointments();
    loadPatients();
    loadSchedules();
  }, []);

  const loadAppointments = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/hospital-manager/${user.id}/appointments`
      );

      if (!response.ok) {
        throw new Error('Failed to load appointments');
      }

      const data = await response.json();

      // Format dates for display
      const formattedData = data.map((apt: Appointment) => ({
        ...apt,
        appodate: new Date(apt.appodate).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));

      setAppointments(formattedData);
    } catch (err) {
      console.error('Error loading appointments:', err);
      alert('Failed to load appointments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPatients = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/hospital-manager/${user.id}/patients`
      );

      if (!response.ok) {
        throw new Error('Failed to load patients');
      }

      const data = await response.json();
      setPatients(data);
    } catch (err) {
      console.error('Error loading patients:', err);
    }
  };

  const loadSchedules = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/hospital-manager/${user.id}/schedules`
      );

      if (!response.ok) {
        throw new Error('Failed to load schedules');
      }

      const data = await response.json();
      // Filter to only show schedules with available slots
      const availableSchedules = data.filter((s: Schedule) => s.available_slots > 0);
      setSchedules(availableSchedules);
    } catch (err) {
      console.error('Error loading schedules:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewPatientInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPatientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsLoading(true);
    try {
      let response;

      if (isNewPatient) {
        // Create appointment with new patient
        response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/hospital-manager/${user.id}/appointments/new-patient`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              scheduleId: parseInt(newPatientData.scheduleId),
              appointmentDate: new Date().toISOString(),
              pemail: newPatientData.pemail,
              pname: newPatientData.pname,
              ppassword: newPatientData.ppassword,
              paddress: newPatientData.paddress,
              pnic: newPatientData.pnic,
              pdob: newPatientData.pdob,
              ptel: newPatientData.ptel,
            }),
          }
        );
      } else {
        // Create appointment with existing patient
        response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/hospital-manager/${user.id}/appointments`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              patientId: parseInt(formData.patientId),
              scheduleId: parseInt(formData.scheduleId),
              appointmentDate: new Date().toISOString()
            }),
          }
        );
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create appointment');
      }

      alert('Appointment created successfully!');
      setShowAddForm(false);
      setIsNewPatient(false);
      setFormData({
        patientId: '',
        scheduleId: '',
      });
      setNewPatientData({
        pname: '',
        pemail: '',
        ptel: '',
        paddress: '',
        pnic: '',
        pdob: '',
        ppassword: '',
        scheduleId: '',
      });
      loadAppointments();
      loadSchedules(); // Reload to update available slots
      loadPatients(); // Reload to include new patient if created
    } catch (err: any) {
      console.error('Error creating appointment:', err);
      alert(err.message || 'Failed to create appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { header: 'Appt #', accessor: 'apponum' as keyof Appointment },
    { header: 'Patient', accessor: 'patient_name' as keyof Appointment },
    { header: 'Doctor', accessor: 'doctor_name' as keyof Appointment },
    { header: 'Session', accessor: 'schedule_title' as keyof Appointment },
    { header: 'Specialty', accessor: 'specialty' as keyof Appointment },
    { header: 'Date & Time', accessor: 'appodate' as keyof Appointment },
  ];

  const selectedSchedule = isNewPatient
    ? schedules.find(s => s.scheduleid === parseInt(newPatientData.scheduleId))
    : schedules.find(s => s.scheduleid === parseInt(formData.scheduleId));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Appointments
          </h1>
          <p className="text-gray-600">
            Manage appointments at your hospital
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Create Appointment'}
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Appointment</h2>

          {/* Toggle between existing and new patient */}
          <div className="mb-6 flex gap-4">
            <button
              type="button"
              onClick={() => setIsNewPatient(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !isNewPatient
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Existing Patient
            </button>
            <button
              type="button"
              onClick={() => setIsNewPatient(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isNewPatient
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              New Patient
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isNewPatient ? (
              // Existing Patient Form
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Patient
                  </label>
                  <Select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map((patient) => (
                      <option key={patient.pid} value={patient.pid}>
                        {patient.pname} - {patient.pemail}
                      </option>
                    ))}
                  </Select>
                  {patients.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      No patients found. Try creating a new patient instead.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Schedule
                  </label>
                  <Select
                    name="scheduleId"
                    value={formData.scheduleId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Schedule</option>
                    {schedules.map((schedule) => (
                      <option key={schedule.scheduleid} value={schedule.scheduleid}>
                        Dr. {schedule.doctor_name} - {schedule.specialty_name} - {schedule.scheduledate} at {schedule.scheduletime} ({schedule.available_slots} slots available)
                      </option>
                    ))}
                  </Select>
                  {schedules.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      No available schedules. Please ask doctors to create schedules first.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              // New Patient Form
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name *
                    </label>
                    <Input
                      type="text"
                      name="pname"
                      value={newPatientData.pname}
                      onChange={handleNewPatientInputChange}
                      placeholder="Enter patient name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      name="pemail"
                      value={newPatientData.pemail}
                      onChange={handleNewPatientInputChange}
                      placeholder="patient@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <Input
                      type="tel"
                      name="ptel"
                      value={newPatientData.ptel}
                      onChange={handleNewPatientInputChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIC *
                    </label>
                    <Input
                      type="text"
                      name="pnic"
                      value={newPatientData.pnic}
                      onChange={handleNewPatientInputChange}
                      placeholder="Enter NIC"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <Input
                      type="date"
                      name="pdob"
                      value={newPatientData.pdob}
                      onChange={handleNewPatientInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <Input
                      type="password"
                      name="ppassword"
                      value={newPatientData.ppassword}
                      onChange={handleNewPatientInputChange}
                      placeholder="Create password for patient"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <Input
                      type="text"
                      name="paddress"
                      value={newPatientData.paddress}
                      onChange={handleNewPatientInputChange}
                      placeholder="Enter address"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Schedule *
                    </label>
                    <Select
                      name="scheduleId"
                      value={newPatientData.scheduleId}
                      onChange={handleNewPatientInputChange}
                      required
                    >
                      <option value="">Select Schedule</option>
                      {schedules.map((schedule) => (
                        <option key={schedule.scheduleid} value={schedule.scheduleid}>
                          Dr. {schedule.doctor_name} - {schedule.specialty_name} - {schedule.scheduledate} at {schedule.scheduletime} ({schedule.available_slots} slots available)
                        </option>
                      ))}
                    </Select>
                    {schedules.length === 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        No available schedules. Please ask doctors to create schedules first.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {selectedSchedule && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Schedule Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Doctor:</span>
                    <span className="ml-2 font-medium">Dr. {selectedSchedule.doctor_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Specialty:</span>
                    <span className="ml-2 font-medium">{selectedSchedule.specialty_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-2 font-medium">{selectedSchedule.scheduledate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Time:</span>
                    <span className="ml-2 font-medium">{selectedSchedule.scheduletime}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Available Slots:</span>
                    <span className="ml-2 font-medium">{selectedSchedule.available_slots} / {selectedSchedule.nop}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setIsNewPatient(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  schedules.length === 0 ||
                  (!isNewPatient && patients.length === 0)
                }
              >
                {isLoading ? 'Creating...' : 'Create Appointment'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {isLoading && !showAddForm ? (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading appointments...</div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">📋</div>
          <p className="text-gray-600">No appointments found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table columns={columns} data={appointments} />
        </div>
      )}
    </div>
  );
};

export default Appointments;
