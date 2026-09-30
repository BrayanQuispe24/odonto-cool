import React from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { AdminDashboardView } from '../components/AdminDashboardView';
import { DoctorDashboardView } from '../components/DoctorDashboardView';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  const roleName = user?.rol?.nombre?.toLowerCase() || '';
  const isDoctor = roleName === 'doctor' || roleName === 'odontologo' || Boolean((user as any)?.doctor_id);

  if (isDoctor) {
    return <DoctorDashboardView />;
  }

  return <AdminDashboardView />;
};
