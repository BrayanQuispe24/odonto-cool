import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  getUsersApi,
  getProfileApi,
  updateProfileApi,
  uploadAvatarApi,
  deleteAvatarApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  type CreateUserPayload,
  type UpdateUserPayload,
  type UpdateProfilePayload,
} from '../services/userService';
import { useAuthStore, type User } from '../../auth/store/authStore';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const currentUser = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState<User | null>(currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateCurrentUserState = useAuthStore((state) => state.updateUser);

  const isAdmin = currentUser?.rol?.nombre === 'Administrador';

  const fetchUsersData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isAdmin) {
        const [data, profData] = await Promise.all([getUsersApi(), getProfileApi()]);
        setUsers(data);
        setProfile(profData);
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

  const updateProfile = async (payload: UpdateProfilePayload) => {
    setIsSubmitting(true);
    try {
      const updated = await updateProfileApi(payload);
      toast.success('Perfil actualizado exitosamente');
      setProfile(updated);
      updateCurrentUserState(updated);
      return updated;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al actualizar el perfil';
      toast.error(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    setIsSubmitting(true);
    try {
      const updated = await uploadAvatarApi(file);
      toast.success('Foto de perfil actualizada exitosamente');
      setProfile(updated);
      updateCurrentUserState(updated);
      if (isAdmin) {
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      }
      return updated;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al subir foto de perfil';
      toast.error(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteAvatar = async () => {
    setIsSubmitting(true);
    try {
      const updated = await deleteAvatarApi();
      toast.success('Foto de perfil eliminada exitosamente');
      setProfile(updated);
      updateCurrentUserState(updated);
      if (isAdmin) {
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      }
      return updated;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al eliminar foto de perfil';
      toast.error(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const createUser = async (payload: CreateUserPayload) => {
    setIsSubmitting(true);
    try {
      const res = await createUserApi(payload);
      toast.success(res.message || 'Usuario registrado exitosamente. Se enviaron las credenciales de acceso por correo.');
      await fetchUsersData();
      return res.usuario;
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
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    createUser,
    updateUser,
    deleteUser,
  };
};
