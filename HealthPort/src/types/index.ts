export type UserType = 'admin' | 'doctor' | 'patient' | 'hospital_manager';

export interface User {
  email: string;
  usertype: UserType;
  name?: string;
  id?: number;
  hospital_id?: number; // For hospital managers
}

export interface Admin {
  aemail: string;
  apassword: string;
}

export interface Doctor {
  docid: number;
  docemail: string;
  docname: string;
  docnic: string;
  doctel: string;
  specialties: number;
  specialtyName?: string;
}

export interface Patient {
  pid: number;
  pemail: string;
  pname: string;
  paddress: string;
  pnic: string;
  pdob: string;
  ptel: string;
}

export interface Schedule {
  scheduleid: number;
  docid: number;
  title: string;
  scheduledate: string;
  scheduletime: string;
  nop: number;
  docname?: string;
  specialtyName?: string;
}

export interface Appointment {
  appoid: number;
  pid: number;
  apponum: number;
  scheduleid: number;
  appodate: string;
  pname?: string;
  docname?: string;
  scheduletime?: string;
  title?: string;
}

export interface Specialty {
  id: number;
  sname: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
