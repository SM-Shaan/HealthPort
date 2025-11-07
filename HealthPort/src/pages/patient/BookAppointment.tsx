import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { Schedule } from '../../types';

const BookAppointment = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // TODO: Fetch session details from API
    setSession({
      scheduleid: 1,
      docid: 1,
      title: 'General Checkup Session',
      scheduledate: '2024-12-15',
      scheduletime: '10:00 AM',
      nop: 10,
      docname: 'Dr. John Smith',
      specialtyName: 'Cardiology',
    });
  }, [scheduleId]);

  const handleBooking = async () => {
    setIsLoading(true);
    setError('');

    try {
      // TODO: Call API to book appointment
      console.log('Booking appointment for schedule:', scheduleId);
      // Navigate to confirmation or appointments page
      navigate('/patient/appointments', {
        state: { message: 'Appointment booked successfully!' }
      });
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Book Appointment</h1>

      <div className="bg-white p-8 rounded-lg shadow space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{session.title}</h2>
          <p className="text-gray-600">Book your appointment for this session</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Doctor</p>
              <p className="font-semibold text-gray-800">{session.docname}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Specialty</p>
              <p className="font-semibold text-gray-800">{session.specialtyName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-semibold text-gray-800">{session.scheduledate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-semibold text-gray-800">{session.scheduletime}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Available Slots</p>
            <p className="font-semibold text-gray-800">{session.nop} patients</p>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/patient/sessions')}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            onClick={handleBooking}
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
