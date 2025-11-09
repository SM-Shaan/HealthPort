export interface Hospital {
  hospital_id: number;
  name: string;
  address: string;
  contact_no: string;
  admin_email: string;
  latitude?: string;
  longitude?: string;
}

export interface HospitalWithDistance extends Hospital {
  distance_km: number;
  distance_formatted: string;
}

export interface DoctorInHospital {
  docid: number;
  docemail: string;
  docname: string;
  doctel: string;
  specialty_name?: string;
}

export interface HospitalWithDoctors extends HospitalWithDistance {
  doctors: DoctorInHospital[];
  doctor_count: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const hospitalService = {
  async getAllHospitals(): Promise<Hospital[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/hospitals/`);

      if (!response.ok) {
        throw new Error(`Failed to fetch hospitals: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      throw error;
    }
  },

  async getNearestHospitals(
    latitude: number,
    longitude: number,
    limit: number = 10
  ): Promise<HospitalWithDistance[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/hospitals/nearest/find?latitude=${latitude}&longitude=${longitude}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch nearest hospitals: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching nearest hospitals:', error);
      throw error;
    }
  },

  async getNearestHospitalsBySpecialty(
    latitude: number,
    longitude: number,
    specialtyId: number,
    limit: number = 10
  ): Promise<HospitalWithDoctors[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/hospitals/nearest/by-specialty?latitude=${latitude}&longitude=${longitude}&specialty_id=${specialtyId}&limit=${limit}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || response.statusText;
        throw new Error(`${response.status}: ${errorMessage}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching nearest hospitals by specialty:', error);
      throw error;
    }
  },

  async getUserLocation(): Promise<UserLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          let errorMessage = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  },
};
