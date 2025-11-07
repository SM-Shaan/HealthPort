import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { authService } from '../../services/authService';

const CreateAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    tel: '',
    password: '',
    cpassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if step 1 data exists
    const step1Data = sessionStorage.getItem('signupStep1');
    if (!step1Data) {
      navigate('/signup');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.cpassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^[0][0-9]{9}$/;
    if (!phoneRegex.test(formData.tel)) {
      setError('Phone number must be 10 digits starting with 0');
      return;
    }

    setIsLoading(true);

    try {
      const step1Data = JSON.parse(sessionStorage.getItem('signupStep1') || '{}');

      await authService.signup({
        ...step1Data,
        ...formData,
      });

      // Clear session storage
      sessionStorage.removeItem('signupStep1');

      // Navigate to login with success message
      navigate('/login', { state: { message: 'Account created successfully! Please login.' } });
    } catch (err) {
      setError('Failed to create account. Email may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-12">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">Step 2 of 2: Account Details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <Input
            type="email"
            name="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="email@example.com"
          />

          <Input
            type="tel"
            name="tel"
            label="Phone Number"
            value={formData.tel}
            onChange={handleChange}
            required
            pattern="[0]{1}[0-9]{9}"
            placeholder="0XXXXXXXXX"
          />

          <Input
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Enter password"
          />

          <Input
            type="password"
            name="cpassword"
            label="Confirm Password"
            value={formData.cpassword}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Confirm password"
          />

          <div className="flex gap-4">
            <Link to="/signup" className="flex-1">
              <Button type="button" variant="secondary" fullWidth>
                ← Back
              </Button>
            </Link>
            <div className="flex-1">
              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
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

export default CreateAccount;
