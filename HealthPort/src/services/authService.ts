import { User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Invalid credentials' }));
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();

    // Map backend response to frontend User type
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      usertype: data.usertype,
      hospital_id: data.hospital_id, // For hospital managers
    };
  },

  async signup(data: {
    fname: string;
    lname: string;
    address: string;
    nic: string;
    dob: string;
    email: string;
    tel: string;
    password: string;
  }): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Signup failed');
    }
  },

  async logout(): Promise<void> {
    // Clear server session if needed
    await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
    });
  },
};
