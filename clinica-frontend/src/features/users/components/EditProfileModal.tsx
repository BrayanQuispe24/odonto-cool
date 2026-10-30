import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, Phone, Stethoscope, Plus, Trash2, Save, User as UserIcon, AlertCircle, Camera, RefreshCw } from 'lucide-react';
import type { User } from '../../auth/store/authStore';
import type { UpdateProfilePayload } from '../services/userService';
import { UserAvatar } from '../../../components/common/UserAvatar';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: User | null;
  onSave: (payload: UpdateProfilePayload) => Promise<unknown>;
  onUploadAvatar?: (file: File) => Promise<unknown>;
  onDeleteAvatar?: () => Promise<unknown>;
  isSubmitting?: boolean;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  onUploadAvatar,
  onDeleteAvatar,
  isSubmitting = false,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Doctor fields
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefonos, setTelefonos] = useState<string[]>([]);
  const [especialidades, setEspecialidades] = useState<string[]>([]);

  const [formError, setFormError] = useState<string | null>(null);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setEmail(profile.email || '');
      setPassword('');
      setConfirmPassword('');
      setFormError(null);

      if (profile.doctor) {
        setNombre(profile.doctor.nombre || '');
        setApellido(profile.doctor.apellido || '');
        setTelefonos(
          Array.isArray(profile.doctor.telefonos) && profile.doctor.telefonos.length > 0
            ? [...profile.doctor.telefonos]
            : ['']
        );
        setEspecialidades(
          Array.isArray(profile.doctor.especialidades) && profile.doctor.especialidades.length > 0
            ? [...profile.doctor.especialidades]
            : ['']
        );
      }
    }
  }, [profile, isOpen]);

  if (!isOpen || !profile) return null;

  const handleAddTelefono = () => {
    setTelefonos((prev) => [...prev, '']);
  };

  const handleRemoveTelefono = (index: number) => {
    setTelefonos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTelefonoChange = (index: number, val: string) => {
    setTelefonos((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleAddEspecialidad = () => {
    setEspecialidades((prev) => [...prev, '']);
  };

  const handleRemoveEspecialidad = (index: number) => {
    setEspecialidades((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEspecialidadChange = (index: number, val: string) => {
    setEspecialidades((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFormError('La imagen seleccionada supera el límite máximo permitido de 2 MB.');
      return;
    }

    if (onUploadAvatar) {
      setIsAvatarLoading(true);
      setFormError(null);
      try {
        await onUploadAvatar(file);
      } catch (err: any) {
        const msg = err.response?.data?.message || 'Error al actualizar la foto de perfil.';
        setFormError(msg);
      } finally {
        setIsAvatarLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleDeleteAvatar = async () => {
    if (!onDeleteAvatar) return;
    setIsAvatarLoading(true);
    setFormError(null);
    try {
      await onDeleteAvatar();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al eliminar la foto de perfil.';
      setFormError(msg);
    } finally {
      setIsAvatarLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim()) {
      setFormError('El correo electrónico es obligatorio.');
      return;
    }

    if (password) {
      if (password.length < 6) {
        setFormError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setFormError('Las contraseñas no coinciden.');
        return;
      }
    }

    const payload: UpdateProfilePayload = {
      email: email.trim(),
    };

    if (password) {
      payload.password = password;
    }

    if (profile.doctor) {
      if (!nombre.trim() || !apellido.trim()) {
        setFormError('El nombre y apellido son obligatorios.');
        return;
      }
      payload.nombre = nombre.trim();
      payload.apellido = apellido.trim();
      payload.telefonos = telefonos.map((t) => t.trim()).filter(Boolean);
      payload.especialidades = especialidades.map((e) => e.trim()).filter(Boolean);
    }

    try {
      await onSave(payload);
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al guardar los cambios.';
      setFormError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-dark-surface rounded-sm max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-dark-bg/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#0077D4]/10 text-[#0077D4] flex items-center justify-center font-bold">
              <UserIcon size={18} />
            </div>
            <div>
              <h3 className="text-small font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                Editar Mi Información
              </h3>
              <p className="text-tiny text-slate-500 dark:text-slate-400">
                Actualiza tus datos de contacto y credenciales de acceso
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {formError && (
            <div className="p-3 rounded-sm bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* FOTO DE PERFIL */}
          <div className="p-4 rounded-sm bg-slate-50 dark:bg-dark-bg/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group shrink-0">
              <UserAvatar
                src={profile.foto_perfil}
                name={profile.doctor ? `${profile.doctor.nombre} ${profile.doctor.apellido}` : profile.email}
                email={profile.email}
                size="xl"
              />
              {isAvatarLoading && (
                <div className="absolute inset-0 bg-slate-900/60 rounded-sm flex items-center justify-center text-white text-xs font-bold">
                  <RefreshCw size={18} className="animate-spin text-[#00C2E0]" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <h4 className="text-small font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Foto de Perfil
              </h4>
              <p className="text-tiny text-slate-500 dark:text-slate-400">
                Formatos permitidos: JPG, PNG o WEBP. Tamaño máximo: 2 MB.
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isAvatarLoading || isSubmitting}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-sm bg-[#0077D4] hover:bg-[#0840A8] text-white text-tiny font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  <Camera size={13} />
                  <span>{profile.foto_perfil ? 'Cambiar Foto' : 'Subir Foto'}</span>
                </button>

                {profile.foto_perfil && (
                  <button
                    type="button"
                    disabled={isAvatarLoading || isSubmitting}
                    onClick={handleDeleteAvatar}
                    className="px-3 py-1.5 rounded-sm border border-rose-300 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-tiny font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                    <span>Quitar</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CUENTA / CREDENCIALES */}
          <div className="space-y-4">
            <h4 className="text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
              <Mail size={12} className="text-[#0077D4]" />
              Datos de Cuenta
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-tiny font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Correo Electrónico <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="tucorreo@clinica.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Dejar en blanco para no cambiar"
                      className="w-full pl-9 pr-3 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita la nueva contraseña"
                      disabled={!password}
                      className="w-full pl-9 pr-3 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DOCTOR INFO (SI APLICA) */}
          {profile.doctor && (
            <div className="space-y-4 pt-2">
              <h4 className="text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                <Stethoscope size={12} className="text-[#0077D4]" />
                Información Profesional & Contacto
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Nombre <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Apellido <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </div>

              {/* TELÉFONOS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-tiny font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Teléfonos de Contacto
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTelefono}
                    className="text-tiny font-bold text-[#0077D4] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Añadir Teléfono</span>
                  </button>
                </div>
                {telefonos.map((tel, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={tel}
                        onChange={(e) => handleTelefonoChange(idx, e.target.value)}
                        placeholder="Ej. 71234567"
                        className="w-full pl-9 pr-3 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>
                    {telefonos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTelefono(idx)}
                        title="Eliminar teléfono"
                        className="p-1.5 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* ESPECIALIDADES */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-tiny font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Especialidades Odontológicas
                  </label>
                  <button
                    type="button"
                    onClick={handleAddEspecialidad}
                    className="text-tiny font-bold text-[#0077D4] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Añadir Especialidad</span>
                  </button>
                </div>
                {especialidades.map((esp, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Stethoscope size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={esp}
                        onChange={(e) => handleEspecialidadChange(idx, e.target.value)}
                        placeholder="Ej. Ortodoncia, Periodoncia"
                        className="w-full pl-9 pr-3 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>
                    {especialidades.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEspecialidad(idx)}
                        title="Eliminar especialidad"
                        className="p-1.5 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-small font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-sm bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-bold transition-colors flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Save size={14} />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
