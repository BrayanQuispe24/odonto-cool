import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loginApi, type LoginCredentials, type LoginApiResponse } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const login = async (credentials: LoginCredentials): Promise<LoginApiResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loginApi(credentials);
      setAuth(data.usuario, data.token);
      toast.success(`¡Bienvenido de nuevo, ${data.usuario.email}!`);
      navigate('/dashboard', { replace: true });
      return data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        (err instanceof Error ? err.message : 'Credenciales incorrectas. Verifica tu usuario y contraseña.');
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error, setError };
};
