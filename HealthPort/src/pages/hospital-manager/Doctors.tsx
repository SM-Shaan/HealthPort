import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';

interface Doctor {
  docid: number;
  docemail: string;
  docname: string;
  docnic: string;
  doctel: string;
  specialties: number;
  specialty_name: string;
}

interface Specialty {
  id: number;
  sname: string;
}

const Doctors = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    docemail: '',
    docname: '',
    docnic: '',
    doctel: '',
    specialties: '',
    docpassword: '',
    hospital_id: 0
  });

  useEffect(() => {
    loadDoctors();
    loadSpecialties();
  }, []);

  const loadDoctors = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/hospital-manager/${user.id}/doctors`
      );

      if (!response.ok) {
        throw new Error('Failed to load doctors');
      }

      const data = await response.json();
      setDoctors(data);
    } catch (err) {
      console.error('Error loading doctors:', err);
      alert('Failed to load doctors. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSpecialties = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/specialties`
      );

      if (!response.ok) {
        throw new Error('Failed to load specialties');
      }

      const data = await response.json();
      setSpecialties(data);
    } catch (err) {
      console.error('Error loading specialties:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/hospital-manager/${user.id}/doctors`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            specialties: parseInt(formData.specialties),
            hospital_id: user.hospital_id || 1
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to add doctor');
      }

      alert('Doctor added successfully!');
      setShowAddForm(false);
      setFormData({
        docemail: '',
        docname: '',
        docnic: '',
        doctel: '',
        specialties: '',
        docpassword: '',
        hospital_id: 0
      });
      loadDoctors();
    } catch (err: any) {
      console.error('Error adding doctor:', err);
      alert(err.message || 'Failed to add doctor. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'docid' as keyof Doctor },
    { header: 'Name', accessor: 'docname' as keyof Doctor },
    { header: 'Email', accessor: 'docemail' as keyof Doctor },
    { header: 'Specialty', accessor: 'specialty_name' as keyof Doctor },
    { header: 'Phone', accessor: 'doctel' as keyof Doctor },
    { header: 'NIC', accessor: 'docnic' as keyof Doctor },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Doctors</h1>
          <p className="text-gray-600">
            Manage doctors at your hospital
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Doctor'}
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Doctor</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor Name
                </label>
                <Input
                  type="text"
                  name="docname"
                  value={formData.docname}
                  onChange={handleInputChange}
                  placeholder="Enter doctor name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  name="docemail"
                  value={formData.docemail}
                  onChange={handleInputChange}
                  placeholder="doctor@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIC
                </label>
                <Input
                  type="text"
                  name="docnic"
                  value={formData.docnic}
                  onChange={handleInputChange}
                  placeholder="Enter NIC"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <Input
                  type="tel"
                  name="doctel"
                  value={formData.doctel}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty
                </label>
                <Select
                  name="specialties"
                  value={formData.specialties}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Specialty</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.sname}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  name="docpassword"
                  value={formData.docpassword}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Doctor'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {isLoading && !showAddForm ? (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading doctors...</div>
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">👨‍⚕️</div>
          <p className="text-gray-600">No doctors found at your hospital.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table columns={columns} data={doctors} />
        </div>
      )}
    </div>
  );
};

export default Doctors;
