import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Mail, Lock, Shield, Eye, EyeOff, Save, KeyRound, Send, Loader2 } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
      rol_id: roles[0]?.id || 1,
    },
  });

  const handleGeneratePassword = () => {
    const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowercase = 'abcdefghijkmnpqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%&*';
    const all = uppercase + lowercase + numbers + symbols;

    let pass = '';
    pass += uppercase[Math.floor(Math.random() * uppercase.length)];
    pass += lowercase[Math.floor(Math.random() * lowercase.length)];
    pass += numbers[Math.floor(Math.random() * numbers.length)];
    pass += symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = 4; i < 10; i++) {
      pass += all[Math.floor(Math.random() * all.length)];
    }

    // Mezclar caracteres
    pass = pass.split('').sort(() => 0.5 - Math.random()).join('');

    setValue('password', pass, { shouldValidate: true });
    setShowPassword(true);
  };

  // Solo resetear el formulario cuando cambie el usuario a editar
  useEffect(() => {
    if (userToEdit) {
      reset({
        email: userToEdit.email,
        password: '',
        rol_id: userToEdit.rol_id || userToEdit.rol?.id || 1,
      });
    }
  }, [userToEdit, reset]);

  // Si se cargan los roles por primera vez en modo creación, asignar el primer rol por defecto sin tocar email ni contraseña
  useEffect(() => {
    if (!userToEdit && roles.length > 0) {
      setValue('rol_id', roles[0].id);
    }
  }, [roles, userToEdit, setValue]);

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

        {/* BANNER EN PROCESO DE CARGA Y VERIFICACIÓN */}
        {isSubmitting && (
          <div className="p-3.5 rounded-sm bg-blue-50/90 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200 shadow-sm animate-pulse">
            <Loader2 size={18} className="text-primary dark:text-secondary shrink-0 mt-0.5 animate-spin" />
            <div className="leading-relaxed">
              <span className="font-bold text-primary-dark dark:text-white block mb-0.5">
                {isEditing ? 'Actualizando usuario...' : 'Verificando buzón y despachando credenciales...'}
              </span>
              <span>
                {isEditing
                  ? 'Guardando los cambios del usuario en el sistema...'
                  : 'Contactando en tiempo real al servidor de correo para comprobar la existencia del buzón y enviando las credenciales de acceso vía SMTP. Por favor, espere un momento.'}
              </span>
            </div>
          </div>
        )}

        {/* NOTIFICACIÓN INFORMATIVA DE ENVÍO DE CREDENCIALES (MODO NORMAL) */}
        {!isReadOnly && !isEditing && !isSubmitting && (
          <div className="p-3.5 rounded-sm bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200 shadow-xs">
            <Send size={16} className="text-primary dark:text-secondary shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-primary-dark dark:text-white block mb-0.5">
                Verificación de Correo y Envío Automático
              </span>
              <span>
                El sistema verificará la existencia real del buzón de correo ingresado. Tras la creación, el usuario recibirá automáticamente un email corporativo con su código de usuario y contraseña temporal para iniciar sesión.
              </span>
            </div>
          </div>
        )}

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
            <div className="flex items-center justify-between mb-1">
              <label className="text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Lock size={12} className="text-slate-400" />
                {isReadOnly ? 'Contraseña' : isEditing ? 'Contraseña (Opcional)' : 'Contraseña'}
                {!isReadOnly && !isEditing && <span className="text-rose-500">*</span>}
              </label>

              {!isReadOnly && !isEditing && (
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="text-tiny font-bold text-primary dark:text-secondary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <KeyRound size={11} />
                  Generar segura
                </button>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                disabled={isReadOnly || isSubmitting}
                placeholder={isReadOnly ? '•••••••• (Protegida)' : isEditing ? '•••••••• (Dejar en blanco para no cambiar)' : '••••••••'}
                {...register('password')}
                className="w-full px-2.5 py-1.5 pr-9 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              />
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              )}
            </div>

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
            className={`px-4 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 text-small font-semibold transition-colors w-full sm:w-auto shadow-sm ${
              isSubmitting
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {isReadOnly ? 'Volver al Listado' : 'Cancelar y Volver'}
          </button>
          
          {!isReadOnly && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-1.5 rounded-sm bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-semibold shadow-sm transition-all w-full sm:w-auto flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'opacity-80 cursor-wait pointer-events-none'
                  : 'cursor-pointer'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white shrink-0" />
                  <span>{isEditing ? 'Actualizando...' : 'Verificando y Creando...'}</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
