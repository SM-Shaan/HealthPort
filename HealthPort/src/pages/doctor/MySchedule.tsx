import { useState, useEffect } from 'react';
import { scheduleService, Schedule } from '../../services/scheduleService';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';

const MySchedule = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    scheduledate: '',
    scheduletime: '',
    nop: 10,
  });

  useEffect(() => {
    loadSchedules();
  }, [user]);

  const loadSchedules = async () => {
    if (!user || !user.id) return;

    setIsLoading(true);
    try {
      const data = await scheduleService.getDoctorSchedules(user.id);
      setSchedules(data);
    } catch (err) {
      console.error('Error loading schedules:', err);
      alert('Failed to load schedules. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await scheduleService.deleteSchedule(id);
        alert('Schedule deleted successfully!');
        loadSchedules();
      } catch (err) {
        console.error('Error deleting schedule:', err);
        alert('Failed to delete schedule. There might be existing appointments for this session.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert('User information not found');
      return;
    }

    try {
      await scheduleService.createSchedule({
        docid: user.id,
        title: formData.title,
        scheduledate: formData.scheduledate,
        scheduletime: formData.scheduletime,
        nop: formData.nop,
      });

      alert('Schedule created successfully!');
      setShowCreateForm(false);
      setFormData({ title: '', scheduledate: '', scheduletime: '', nop: 10 });
      loadSchedules();
    } catch (err) {
      console.error('Error creating schedule:', err);
      alert('Failed to create schedule. Please try again.');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">My Schedule</h1>
        <div className="flex gap-2">
          <Button onClick={loadSchedules} variant="secondary">
            Refresh
          </Button>
          <Button onClick={() => setShowCreateForm(!showCreateForm)} variant="primary">
            {showCreateForm ? 'Cancel' : 'Create New Session'}
          </Button>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Session</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Title *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., General Consultation"
                required
                fullWidth
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <Input
                  type="date"
                  value={formData.scheduledate}
                  onChange={(e) => setFormData({ ...formData, scheduledate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  fullWidth
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <Input
                  type="time"
                  value={formData.scheduletime}
                  onChange={(e) => setFormData({ ...formData, scheduletime: e.target.value })}
                  required
                  fullWidth
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Patients *
                </label>
                <Input
                  type="number"
                  value={formData.nop}
                  onChange={(e) => setFormData({ ...formData, nop: parseInt(e.target.value) })}
                  min={1}
                  max={50}
                  required
                  fullWidth
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" variant="primary">
                Create Session
              </Button>
              <Button
                type="button"
                onClick={() => setShowCreateForm(false)}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading schedules...</p>
        </div>
      )}

      {/* Schedules List */}
      {!isLoading && schedules.length === 0 && (
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No sessions scheduled
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first session to start accepting appointments.
          </p>
          <Button onClick={() => setShowCreateForm(true)} variant="primary">
            Create New Session
          </Button>
        </div>
      )}

      {!isLoading && schedules.length > 0 && (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div
              key={schedule.scheduleid}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {schedule.title}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-500"
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
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-semibold text-gray-800">
                          {formatDate(schedule.scheduledate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-500"
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
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-semibold text-gray-800">{schedule.scheduletime}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-500"
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
                      <div>
                        <p className="text-sm text-gray-500">Capacity</p>
                        <p className="font-semibold text-gray-800">
                          {schedule.booked || 0} / {schedule.nop} booked
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        (schedule.available_slots || 0) > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {(schedule.available_slots || 0) > 0
                        ? `${schedule.available_slots} slots available`
                        : 'Fully Booked'}
                    </span>
                  </div>
                </div>

                <div>
                  <Button
                    onClick={() => handleDelete(schedule.scheduleid, schedule.title)}
                    variant="danger"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySchedule;
