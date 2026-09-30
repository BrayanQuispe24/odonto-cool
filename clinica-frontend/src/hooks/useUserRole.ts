import { useAuthStore } from '../features/auth/store/authStore';

export const useUserRole = () => {
  const user = useAuthStore((state) => state.user);
  const roleName = user?.rol?.nombre ?? '';

  return {
    roleName,
    isAdmin: roleName === 'Administrador',
    isDoctor: roleName === 'Doctor',
    isPaciente: roleName === 'Paciente',
  };
};
