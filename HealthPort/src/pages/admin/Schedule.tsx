import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Table from '../../components/Table';
import Button from '../../components/Button';
import { Schedule as ScheduleType } from '../../types';

const Schedule = () => {
  const [schedules, setSchedules] = useState<ScheduleType[]>([]);

  useEffect(() => {
    // TODO: Fetch schedules from API
    setSchedules([
      {
        scheduleid: 1,
        docid: 1,
        title: 'General Checkup Session',
        scheduledate: '2024-12-15',
        scheduletime: '10:00:00',
        nop: 10,
        docname: 'Dr. John Smith',
        specialtyName: 'Cardiology',
      },
    ]);
  }, []);

  const scheduleColumns = [
    { header: 'Title', accessor: 'title' as keyof ScheduleType },
    { header: 'Doctor', accessor: 'docname' as keyof ScheduleType },
    { header: 'Specialty', accessor: 'specialtyName' as keyof ScheduleType },
    { header: 'Date', accessor: 'scheduledate' as keyof ScheduleType },
    { header: 'Time', accessor: 'scheduletime' as keyof ScheduleType },
    { header: 'Capacity', accessor: 'nop' as keyof ScheduleType },
    {
      header: 'Actions',
      accessor: (schedule: ScheduleType) => (
        <Button
          variant="danger"
          className="text-sm px-3 py-1"
          onClick={() => handleDelete(schedule.scheduleid)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      setSchedules(schedules.filter(s => s.scheduleid !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Schedule Management</h1>
        <Link to="/admin/schedule/add">
          <Button>+ Add New Session</Button>
        </Link>
      </div>

      <Table
        columns={scheduleColumns}
        data={schedules}
        emptyMessage="No sessions scheduled"
      />
    </div>
  );
};

export default Schedule;
