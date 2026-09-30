import api from '../../../services/api';
import type { User } from '../../auth/store/authStore';

export interface CreateUserPayload {
  email: string;
  password?: string;
  rol_id: number;
}

export interface UpdateUserPayload {
  email: string;
  password?: string;
  rol_id?: number;
}

export interface UsersResponse {
  usuarios: User[];
}

export interface SingleUserResponse {
  message?: string;
  usuario: User;
}

export const getUsersApi = async (): Promise<User[]> => {
  const response = await api.get<UsersResponse>('/users');
  return response.data.usuarios;
};

export const getProfileApi = async (): Promise<User> => {
  const response = await api.get<SingleUserResponse>('/me');
  return response.data.usuario;
};

export const createUserApi = async (payload: CreateUserPayload): Promise<User> => {
  const response = await api.post<SingleUserResponse>('/users', payload);
  return response.data.usuario;
};

export const updateUserApi = async (id: number | string, payload: UpdateUserPayload): Promise<User> => {
  const response = await api.put<SingleUserResponse>(`/users/${id}`, payload);
  return response.data.usuario;
};

export const deleteUserApi = async (id: number | string): Promise<void> => {
  await api.delete(`/users/${id}`);
};
