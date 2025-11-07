import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import { Doctor } from '../../types';

const AddSession = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [formData, setFormData] = useState({
    docid: '',
    title: '',
    date: '',
    time: '',
    capacity: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // TODO: Fetch doctors from API
    setDoctors([
      {
        docid: 1,
        docemail: 'doctor@example.com',
        docname: 'Dr. John Smith',
        docnic: '123',
        doctel: '077',
        specialties: 1,
        specialtyName: 'Cardiology',
      },
    ]);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // TODO: Call API to add session
      console.log('Adding session:', formData);
      navigate('/admin/schedule');
    } catch (err) {
      setError('Failed to add session');
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Session</h1>

      <div className="bg-white p-8 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <Select
            name="docid"
            label="Select Doctor"
            value={formData.docid}
            onChange={handleChange}
            required
            options={[
              { value: '', label: 'Choose a doctor' },
              ...doctors.map(d => ({
                value: d.docid.toString(),
                label: `${d.docname} - ${d.specialtyName}`
              }))
            ]}
          />

          <Input
            type="text"
            name="title"
            label="Session Title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., General Checkup Session"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="date"
              name="date"
              label="Session Date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <Input
              type="time"
              name="time"
              label="Session Time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            type="number"
            name="capacity"
            label="Number of Patients (Capacity)"
            value={formData.capacity}
            onChange={handleChange}
            required
            min="1"
            placeholder="e.g., 10"
          />

          <div className="flex gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/schedule')}
            >
              Cancel
            </Button>
            <Button type="submit">Add Session</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSession;
