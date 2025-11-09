import { useState, useEffect } from 'react';
import Table from '../../components/Table';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { Doctor, Specialty } from '../../types';
import { doctorService } from '../../services/doctorService';
import { scheduleService } from '../../services/scheduleService';

interface DoctorWithSlots extends Doctor {
  totalAvailableSlots?: number;
  nextAvailableDate?: string;
  upcomingSchedules?: number;
}

const BrowseDoctors = () => {
  const [doctors, setDoctors] = useState<DoctorWithSlots[]>([]);
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

        // Fetch available schedules for each doctor and calculate slots
        const doctorsWithSlots: DoctorWithSlots[] = await Promise.all(
          doctorsData.map(async (doctor) => {
            try {
              // Get available schedules for this doctor
              const schedules = await scheduleService.getDoctorAvailableSchedules(doctor.docid);

              // Calculate total available slots
              const totalAvailableSlots = schedules.reduce(
                (sum, schedule) => sum + (schedule.available_slots || 0),
                0
              );

              // Get next available date
              const nextAvailableDate = schedules.length > 0 && schedules[0].scheduledate
                ? new Date(schedules[0].scheduledate).toLocaleDateString()
                : undefined;

              return {
                ...doctor,
                totalAvailableSlots,
                nextAvailableDate,
                upcomingSchedules: schedules.length,
              };
            } catch (error) {
              // If schedule fetch fails, return doctor without slot info
              console.error(`Failed to fetch schedules for doctor ${doctor.docid}:`, error);
              return {
                ...doctor,
                totalAvailableSlots: 0,
                upcomingSchedules: 0,
              };
            }
          })
        );

        setDoctors(doctorsWithSlots);
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
    { header: 'Doctor Name', accessor: 'docname' as keyof DoctorWithSlots },
    { header: 'Specialty', accessor: 'specialtyName' as keyof DoctorWithSlots },
    {
      header: 'Available Slots',
      accessor: (doctor: DoctorWithSlots) => {
        const slots = doctor.totalAvailableSlots;
        if (slots === undefined) return 'Loading...';
        if (slots === 0) return <span className="text-red-600 font-medium">No slots</span>;
        return <span className="text-green-600 font-semibold">{slots} slots available</span>;
      }
    },
    {
      header: 'Next Available',
      accessor: (doctor: DoctorWithSlots) => {
        const date = doctor.nextAvailableDate;
        return date ? (
          <span className="text-blue-600">{date}</span>
        ) : (
          <span className="text-gray-400">No upcoming sessions</span>
        );
      }
    },
    { header: 'Phone', accessor: 'doctel' as keyof DoctorWithSlots },
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

  // Calculate statistics
  const totalDoctors = filteredDoctors.length;
  const doctorsWithSlots = filteredDoctors.filter(d => (d.totalAvailableSlots || 0) > 0).length;
  const totalAvailableSlots = filteredDoctors.reduce((sum, d) => sum + (d.totalAvailableSlots || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">All Doctors</h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Doctors</div>
          <div className="text-3xl font-bold text-primary">{totalDoctors}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Doctors with Available Slots</div>
          <div className="text-3xl font-bold text-green-600">{doctorsWithSlots}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Available Slots</div>
          <div className="text-3xl font-bold text-blue-600">{totalAvailableSlots}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Search & Filter</h2>
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
