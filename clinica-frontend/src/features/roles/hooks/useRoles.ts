import { useState, useEffect, useCallback } from 'react';
import { getRolesApi } from '../services/roleService';
import type { UserRole } from '../../auth/store/authStore';

export const useRoles = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getRolesApi();
      setRoles(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || (err instanceof Error ? err.message : 'Error al cargar roles.');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return { roles, isLoading, error, refetch: fetchRoles };
};
