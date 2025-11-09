export interface Schedule {
  scheduleid: number;
  docid: number;
  title: string;
  scheduledate: string;
  scheduletime: string;
  nop: number;
  doctor_name?: string;
  specialty_name?: string;
  booked?: number;
  available_slots?: number;
}

export interface ScheduleCreate {
  docid: number;
  title: string;
  scheduledate: string;
  scheduletime: string;
  nop: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const scheduleService = {
  async getAllSchedules(): Promise<Schedule[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedules/`);

      if (!response.ok) {
        throw new Error(`Failed to fetch schedules: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  },

  async getDoctorAvailableSchedules(doctorId: number): Promise<Schedule[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedules/doctor/${doctorId}/available`);

      if (!response.ok) {
        throw new Error(`Failed to fetch doctor schedules: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching doctor schedules:', error);
      throw error;
    }
  },

  async getDoctorSchedules(doctorId: number): Promise<Schedule[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedules/doctor/${doctorId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch doctor schedules: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching doctor schedules:', error);
      throw error;
    }
  },

  async createSchedule(scheduleData: ScheduleCreate): Promise<Schedule> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedules/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || response.statusText;
        throw new Error(`${response.status}: ${errorMessage}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },

  async deleteSchedule(scheduleId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedules/${scheduleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete schedule: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  },
};
