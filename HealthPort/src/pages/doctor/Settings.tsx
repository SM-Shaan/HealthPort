import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'Dr. John Smith',
    email: user?.email || '',
    tel: '0771234567',
    nic: '123456789',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // TODO: Call API to update profile
      console.log('Updating profile:', formData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Call API to delete account
      navigate('/login');
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>

      {/* Profile Settings */}
      <div className="bg-white p-8 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              {success}
            </div>
          )}

          <Input
            type="text"
            name="name"
            label="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="tel"
              name="tel"
              label="Phone Number"
              value={formData.tel}
              onChange={handleChange}
              required
            />

            <Input
              type="text"
              name="nic"
              label="NIC Number"
              value={formData.nic}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit">Update Profile</Button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-white p-8 rounded-lg shadow border-2 border-red-200">
        <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
        <p className="text-gray-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button variant="danger" onClick={handleDeleteAccount}>
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default Settings;
