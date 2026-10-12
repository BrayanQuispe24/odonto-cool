import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Mail, Lock, Shield, Eye, Save } from 'lucide-react';
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

interface UserFormPanelProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  userToEdit?: User | null;
  isSubmitting?: boolean;
  isReadOnly?: boolean;
}

export const UserFormPanel: React.FC<UserFormPanelProps> = ({
  onSubmit,
  onCancel,
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

  const handleFormSubmit = async (data: any) => {
    if (isReadOnly) return;
    const payload = { ...data };
    if (isEditing && !payload.password) {
      delete payload.password;
    }
    await onSubmit(payload);
  };

  return (
    <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm flex flex-col w-full text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2 text-primary-dark dark:text-white uppercase tracking-wider">
          {isReadOnly ? (
            <Eye className="text-primary dark:text-secondary" size={18} />
          ) : (
            <Shield className="text-primary dark:text-secondary" size={18} />
          )}
          {isReadOnly ? 'Detalles del Usuario' : isEditing ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
        <p className="text-xs text-slate-500 dark:text-slate-400 -mt-2">
          {isReadOnly
            ? 'Consulta de credenciales y rol asignado al usuario.'
            : isEditing
            ? 'Modifique las credenciales y rol del usuario.'
            : 'Complete el formulario para crear una nueva cuenta.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* EMAIL */}
          <div>
            <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Mail size={12} className="text-slate-400" />
              Correo Electrónico <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              disabled={isReadOnly || isSubmitting}
              placeholder="usuario@clinica.com"
              {...register('email')}
              className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            />
            {!isReadOnly && errors.email && (
              <span className="text-xs text-rose-500 font-medium mt-1 block">
                {errors.email.message as string}
              </span>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Lock size={12} className="text-slate-400" />
              {isReadOnly ? 'Contraseña' : isEditing ? 'Contraseña (Opcional)' : 'Contraseña'}
              {!isReadOnly && !isEditing && <span className="text-rose-500">*</span>}
            </label>
            <input
              type="password"
              disabled={isReadOnly || isSubmitting}
              placeholder={isReadOnly ? '•••••••• (Protegida)' : isEditing ? '•••••••• (Dejar en blanco para no cambiar)' : '••••••••'}
              {...register('password')}
              className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            />
            {!isReadOnly && errors.password && (
              <span className="text-xs text-rose-500 font-medium mt-1 block">
                {errors.password.message as string}
              </span>
            )}
          </div>

          {/* ROL SELECT */}
          <div>
            <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Shield size={12} className="text-slate-400" />
              Rol del Sistema <span className="text-rose-500">*</span>
            </label>
            <select
              disabled={isReadOnly || isSubmitting}
              {...register('rol_id')}
              className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id} className="bg-white dark:bg-dark-surface text-primary-dark dark:text-white">
                  {rol.nombre}
                </option>
              ))}
            </select>
            {!isReadOnly && errors.rol_id && (
              <span className="text-xs text-rose-500 font-medium mt-1 block">
                {errors.rol_id.message as string}
              </span>
            )}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 text-small font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-full sm:w-auto shadow-sm disabled:opacity-50"
          >
            {isReadOnly ? 'Volver al Listado' : 'Cancelar y Volver'}
          </button>
          
          {!isReadOnly && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-1.5 rounded-sm bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-semibold shadow-sm disabled:opacity-50 cursor-pointer transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Save size={16} />
              {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
