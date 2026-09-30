import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  getUsersApi,
  getProfileApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  type CreateUserPayload,
  type UpdateUserPayload,
} from '../services/userService';
import { useAuthStore, type User } from '../../auth/store/authStore';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useAuthStore((state) => state.user);

  const isAdmin = currentUser?.rol?.nombre === 'Administrador';

  const fetchUsersData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isAdmin) {
        const data = await getUsersApi();
        setUsers(data);
      } else {
        const profData = await getProfileApi();
        setProfile(profData);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || (err instanceof Error ? err.message : 'Error al obtener usuarios.');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  const createUser = async (payload: CreateUserPayload) => {
    setIsSubmitting(true);
    try {
      const newUser = await createUserApi(payload);
      toast.success('Usuario registrado exitosamente');
      await fetchUsersData();
      return newUser;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al crear el usuario';
      toast.error(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateUser = async (id: number | string, payload: UpdateUserPayload) => {
    setIsSubmitting(true);
    try {
      const updated = await updateUserApi(id, payload);
      toast.success('Usuario actualizado exitosamente');
      await fetchUsersData();
      return updated;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al actualizar usuario';
      toast.error(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteUser = async (id: number | string) => {
    setIsSubmitting(true);
    try {
      await deleteUserApi(id);
      toast.success('Usuario eliminado exitosamente');
      await fetchUsersData();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al eliminar usuario';
      toast.error(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    users,
    profile,
    isAdmin,
    isLoading,
    isSubmitting,
    error,
    refetch: fetchUsersData,
    createUser,
    updateUser,
    deleteUser,
  };
};
