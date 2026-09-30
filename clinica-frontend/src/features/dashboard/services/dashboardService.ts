import api from '../../../services/api';
import type { AdminDashboardData, DoctorDashboardData } from '../types/dashboardTypes';

export const getAdminDashboardStatsApi = async (): Promise<AdminDashboardData> => {
  const response = await api.get<AdminDashboardData>('/dashboard/admin-stats');
  return response.data;
};

export const getDoctorDashboardStatsApi = async (doctorId?: number): Promise<DoctorDashboardData> => {
  const params = doctorId ? { doctor_id: doctorId } : {};
  const response = await api.get<DoctorDashboardData>('/dashboard/doctor-stats', { params });
  return response.data;
};
