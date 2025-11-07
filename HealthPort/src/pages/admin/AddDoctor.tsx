import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import { Specialty } from '../../types';

const AddDoctor = () => {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    nic: '',
    specialty: '',
    email: '',
    tel: '',
    password: '',
    cpassword: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // TODO: Fetch specialties from API
    setSpecialties([
      { id: 1, sname: 'Cardiology' },
      { id: 2, sname: 'Dermatology' },
      { id: 3, sname: 'Neurology' },
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

    if (formData.password !== formData.cpassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // TODO: Call API to add doctor
      console.log('Adding doctor:', formData);
      navigate('/admin/doctors');
    } catch (err) {
      setError('Failed to add doctor');
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Doctor</h1>

      <div className="bg-white p-8 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <Input
            type="text"
            name="name"
            label="Doctor Name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Dr. John Doe"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="text"
              name="nic"
              label="NIC Number"
              value={formData.nic}
              onChange={handleChange}
              required
              maxLength={15}
            />

            <Select
              name="specialty"
              label="Specialty"
              value={formData.specialty}
              onChange={handleChange}
              required
              options={[
                { value: '', label: 'Select Specialty' },
                ...specialties.map(s => ({ value: s.id.toString(), label: s.sname }))
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="email"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              type="tel"
              name="tel"
              label="Phone Number"
              value={formData.tel}
              onChange={handleChange}
              required
              maxLength={15}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              type="password"
              name="cpassword"
              label="Confirm Password"
              value={formData.cpassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/doctors')}
            >
              Cancel
            </Button>
            <Button type="submit">Add Doctor</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
