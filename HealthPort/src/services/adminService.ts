import { doctorService } from './doctorService';
import { patientService } from './patientService';
import { appointmentService, Appointment } from './appointmentService';
import { scheduleService } from './scheduleService';

export interface AdminStats {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  todaySessions: number;
}

export const adminService = {
  async getStatistics(): Promise<AdminStats> {
    try {
      // Fetch all data in parallel
      const [doctors, patients, appointments, schedules] = await Promise.all([
        doctorService.getAllDoctors(),
        patientService.getAllPatients(),
        appointmentService.getAllAppointments(),
        scheduleService.getAllSchedules(),
      ]);

      // Count today's sessions (schedules for today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todaySessions = schedules.filter((schedule) => {
        const scheduleDate = new Date(schedule.scheduledate);
        scheduleDate.setHours(0, 0, 0, 0);
        return scheduleDate.getTime() === today.getTime();
      }).length;

      return {
        totalDoctors: doctors.length,
        totalPatients: patients.length,
        totalAppointments: appointments.length,
        todaySessions,
      };
    } catch (error) {
      console.error('Error fetching admin statistics:', error);
      throw error;
    }
  },

  async getUpcomingAppointments(days: number = 7): Promise<Appointment[]> {
    try {
      const appointments = await appointmentService.getAllAppointments();

      // Filter appointments for the next N days
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + days);

      const upcomingAppointments = appointments.filter((apt) => {
        const aptDate = new Date(apt.appodate);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate >= today && aptDate < futureDate;
      });

      // Sort by date (earliest first)
      upcomingAppointments.sort((a, b) => {
        return new Date(a.appodate).getTime() - new Date(b.appodate).getTime();
      });

      return upcomingAppointments;
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      throw error;
    }
  },
};
