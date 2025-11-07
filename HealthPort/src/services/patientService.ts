export interface Patient {
  pid: number;
  pemail: string;
  pname: string;
  pnic: string;
  ptel: string;
  paddress: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

export const patientService = {
  async getAllPatients(): Promise<Patient[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/`);

      if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  async getPatientById(patientId: number): Promise<Patient> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${patientId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch patient: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }
  },
};
