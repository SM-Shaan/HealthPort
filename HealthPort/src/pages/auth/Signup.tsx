import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    address: '',
    nic: '',
    dob: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store data in sessionStorage and move to next step
    sessionStorage.setItem('signupStep1', JSON.stringify(formData));
    navigate('/create-account');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-12">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">Step 1 of 2: Personal Information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="text"
              name="fname"
              label="First Name"
              value={formData.fname}
              onChange={handleChange}
              required
              placeholder="John"
            />

            <Input
              type="text"
              name="lname"
              label="Last Name"
              value={formData.lname}
              onChange={handleChange}
              required
              placeholder="Doe"
            />
          </div>

          <Input
            type="text"
            name="address"
            label="Address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="123 Main Street, City"
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
              placeholder="Enter your NIC"
            />

            <Input
              type="date"
              name="dob"
              label="Date of Birth"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-4">
            <Link to="/login" className="flex-1">
              <Button type="button" variant="secondary" fullWidth>
                Cancel
              </Button>
            </Link>
            <div className="flex-1">
              <Button type="submit" fullWidth>
                Next Step →
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primaryHover font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
