export interface Appointment {
  appoid: number;
  pid: number;
  apponum: number;
  scheduleid: number;
  appodate: string;
  patient_name?: string;
  doctor_name?: string;
  schedule_title?: string;
  specialty?: string;
}

export interface AppointmentCreate {
  patientId: number;
  scheduleId: number;
  appointmentDate: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

export const appointmentService = {
  async createAppointment(data: AppointmentCreate): Promise<Appointment> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || response.statusText;
        throw new Error(`${response.status}: ${errorMessage}`);
      }

      const appointment = await response.json();
      return appointment;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  async getPatientAppointments(patientId: number): Promise<Appointment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/patient/${patientId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch appointments: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching patient appointments:', error);
      throw error;
    }
  },

  async getAllAppointments(): Promise<Appointment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/`);

      if (!response.ok) {
        throw new Error(`Failed to fetch appointments: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  async getDoctorAppointments(doctorId: number): Promise<Appointment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/doctor/${doctorId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch doctor appointments: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
      throw error;
    }
  },

  async deleteAppointment(appointmentId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete appointment: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  },
};
