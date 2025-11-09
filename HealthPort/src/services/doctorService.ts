import { Doctor, Specialty } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface DoctorAPIResponse {
  docid: number;
  docemail: string;
  docname: string;
  docnic: string;
  doctel: string;
  specialties: number;
  specialty_name?: string;
  hospital_id?: number;
}

export const doctorService = {
  async getAllDoctors(): Promise<Doctor[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/`);

      if (!response.ok) {
        throw new Error(`Failed to fetch doctors: ${response.statusText}`);
      }

      const data: DoctorAPIResponse[] = await response.json();

      // Map API response to frontend types
      return data.map(doctor => ({
        docid: doctor.docid,
        docemail: doctor.docemail,
        docname: doctor.docname,
        docnic: doctor.docnic,
        doctel: doctor.doctel,
        specialties: doctor.specialties,
        specialtyName: doctor.specialty_name,
      }));
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  },

  async getDoctorById(id: number): Promise<Doctor> {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch doctor: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching doctor ${id}:`, error);
      throw error;
    }
  },

  async getAllSpecialties(): Promise<Specialty[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/specialties/`);

      if (!response.ok) {
        throw new Error(`Failed to fetch specialties: ${response.statusText}`);
      }

      const data: { id: number; name: string }[] = await response.json();

      // Map API response to frontend types (API returns 'name', frontend expects 'sname')
      return data.map(specialty => ({
        id: specialty.id,
        sname: specialty.name,
      }));
    } catch (error) {
      console.error('Error fetching specialties:', error);
      throw error;
    }
  },
};
