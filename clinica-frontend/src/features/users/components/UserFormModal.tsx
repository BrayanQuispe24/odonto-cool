import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Mail, Lock, Shield, Eye } from 'lucide-react';
import { useRoles } from '../../roles/hooks/useRoles';
import type { User } from '../../auth/store/authStore';

const createUserSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es obligatorio')
    .email('Ingrese un correo válido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rol_id: z.coerce.number().min(1, 'Debe seleccionar un rol'),
});

const updateUserSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es obligatorio')
    .email('Ingrese un correo válido'),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: 'La contraseña debe tener al menos 6 caracteres si se modifica',
    }),
  rol_id: z.coerce.number().min(1, 'Debe seleccionar un rol'),
});

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  userToEdit?: User | null;
  isSubmitting?: boolean;
  isReadOnly?: boolean;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userToEdit,
  isSubmitting,
  isReadOnly = false,
}) => {
  const { roles } = useRoles();
  const isEditing = Boolean(userToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      rol_id: roles[0]?.id || 1,
    },
  });

  useEffect(() => {
    if (userToEdit) {
      reset({
        email: userToEdit.email,
        password: '',
        rol_id: userToEdit.rol_id || userToEdit.rol?.id || 1,
      });
    } else {
      reset({
        email: '',
        password: '',
        rol_id: roles[0]?.id || 1,
      });
    }
  }, [userToEdit, reset, roles]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: any) => {
    if (isReadOnly) return;
    const payload = { ...data };
    if (isEditing && !payload.password) {
      delete payload.password;
    }
    await onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#002D5E] rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-[#001C3D]/80 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 relative text-[#0840A8] dark:text-white">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#0077D4] dark:text-blue-200/70 hover:text-[#0840A8] dark:text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* TITLE */}
        <div className="flex items-center gap-2 mb-1">
          {isReadOnly && <Eye size={20} className="text-[#0077D4] dark:text-[#00C2E0] shrink-0" />}
          <h2 className="text-xl font-bold font-display text-[#0840A8] dark:text-white">
            {isReadOnly ? 'Detalles del Usuario' : isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
        </div>
        <p className="text-xs text-[#0077D4] dark:text-blue-200/80 mb-6">
          {isReadOnly
            ? 'Consulta de credenciales y rol asignado al usuario.'
            : isEditing
            ? 'Modifique las credenciales y rol del usuario.'
            : 'Complete el formulario para crear una nueva cuenta.'}
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#0077D4] dark:text-blue-100 uppercase tracking-wider">
              Correo Electrónico
            </label>
            <div className={`relative flex items-center border rounded-xl px-3 py-2.5 transition-all ${
              isReadOnly
                ? 'border-[#0840A8]/15 dark:border-[#0840A8]/40 bg-[#F4F9FF] dark:bg-[#001C3D]/60 opacity-90'
                : 'border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] focus-within:border-[#00C2E0] focus-within:ring-1 focus-within:ring-[#00C2E0]'
            }`}>
              <Mail size={18} className="text-[#0077D4] dark:text-[#00C2E0] mr-2 shrink-0" />
              <input
                type="email"
                disabled={isReadOnly || isSubmitting}
                placeholder="usuario@clinica.com"
                {...register('email')}
                className="w-full bg-transparent text-xs text-[#0840A8] dark:text-white placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none disabled:cursor-not-allowed"
              />
            </div>
            {!isReadOnly && errors.email && (
              <span className="text-xs text-rose-400 font-medium">
                {errors.email.message as string}
              </span>
            )}
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#0077D4] dark:text-blue-100 uppercase tracking-wider">
              {isReadOnly ? 'Contraseña' : isEditing ? 'Contraseña (Opcional)' : 'Contraseña'}
            </label>
            <div className={`relative flex items-center border rounded-xl px-3 py-2.5 transition-all ${
              isReadOnly
                ? 'border-[#0840A8]/15 dark:border-[#0840A8]/40 bg-[#F4F9FF] dark:bg-[#001C3D]/60 opacity-90'
                : 'border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] focus-within:border-[#00C2E0] focus-within:ring-1 focus-within:ring-[#00C2E0]'
            }`}>
              <Lock size={18} className="text-[#0077D4] dark:text-[#00C2E0] mr-2 shrink-0" />
              <input
                type="password"
                disabled={isReadOnly || isSubmitting}
                placeholder={isReadOnly ? '•••••••• (Protegida)' : isEditing ? '•••••••• (Dejar en blanco para no cambiar)' : '••••••••'}
                {...register('password')}
                className="w-full bg-transparent text-xs text-[#0840A8] dark:text-white placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none disabled:cursor-not-allowed"
              />
            </div>
            {!isReadOnly && errors.password && (
              <span className="text-xs text-rose-400 font-medium">
                {errors.password.message as string}
              </span>
            )}
          </div>

          {/* ROL SELECT */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#0077D4] dark:text-blue-100 uppercase tracking-wider">
              Rol del Sistema
            </label>
            <div className={`relative flex items-center border rounded-xl px-3 py-2.5 transition-all ${
              isReadOnly
                ? 'border-[#0840A8]/15 dark:border-[#0840A8]/40 bg-[#F4F9FF] dark:bg-[#001C3D]/60 opacity-90'
                : 'border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] focus-within:border-[#00C2E0] focus-within:ring-1 focus-within:ring-[#00C2E0]'
            }`}>
              <Shield size={18} className="text-[#0077D4] dark:text-[#00C2E0] mr-2 shrink-0" />
              <select
                disabled={isReadOnly || isSubmitting}
                {...register('rol_id')}
                className="w-full bg-transparent text-xs text-[#0840A8] dark:text-white focus:outline-none cursor-pointer disabled:cursor-not-allowed"
              >
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id} className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">
                    {rol.nombre}
                  </option>
                ))}
              </select>
            </div>
            {!isReadOnly && errors.rol_id && (
              <span className="text-xs text-rose-400 font-medium">
                {errors.rol_id.message as string}
              </span>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50">
            {isReadOnly ? (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white border border-white/10 text-xs font-semibold cursor-pointer transition-all"
              >
                Cerrar
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white border border-white/10 text-xs font-semibold cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#0840A8] hover:to-[#0077D4] text-white text-xs font-bold shadow-md shadow-[#0077D4]/30 disabled:opacity-50 cursor-pointer transition-all"
                >
                  {isSubmitting
                    ? 'Guardando...'
                    : isEditing
                    ? 'Guardar Cambios'
                    : 'Crear Usuario'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
