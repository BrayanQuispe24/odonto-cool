import api from '../../../services/api';
import type { User } from '../store/authStore';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginApiResponse {
  message: string;
  token: string;
  usuario: User;
  token_type: string;
}

export const loginApi = async (credentials: LoginCredentials): Promise<LoginApiResponse> => {
  const response = await api.post<LoginApiResponse>('/login', credentials);
  return response.data;
};

export const logoutApi = async (): Promise<void> => {
  try {
    await api.post('/logout');
  } catch {
    // Ignore error if token is expired or invalid
  }
};
