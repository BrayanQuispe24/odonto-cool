import api from '../../../services/api';
import type { UserRole } from '../../auth/store/authStore';

export interface RolesResponse {
  roles: UserRole[];
}

export const getRolesApi = async (): Promise<UserRole[]> => {
  const response = await api.get<RolesResponse>('/roles');
  return response.data.roles;
};
