import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Stethoscope } from 'lucide-react';
import type { Doctor, DoctorFormData } from '../types/doctor';
import type { User } from '../../auth/store/authStore';
import { getUsersApi } from '../../users/services/userService';

interface DoctorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DoctorFormData) => Promise<void>;
  doctor?: Doctor | null;
  isReadOnly?: boolean;
}

export const DoctorFormModal: React.FC<DoctorFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  doctor,
  isReadOnly = false,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [usuarioId, setUsuarioId] = useState<number | ''>('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefonos, setTelefonos] = useState<string[]>(['']);
  const [especialidades, setEspecialidades] = useState<string[]>(['Ortodoncia']);
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      getUsersApi()
        .then((uList) => setUsers(uList))
        .catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    if (doctor) {
      setUsuarioId(doctor.usuario_id);
      setNombre(doctor.nombre || '');
      setApellido(doctor.apellido || '');
      setTelefonos(doctor.telefonos && doctor.telefonos.length > 0 ? doctor.telefonos : ['']);
      setEspecialidades(
        doctor.especialidades && doctor.especialidades.length > 0
          ? doctor.especialidades
          : ['Ortodoncia']
      );
    } else {
      setUsuarioId('');
      setNombre('');
      setApellido('');
      setTelefonos(['']);
      setEspecialidades(['Ortodoncia']);
    }
    setError(null);
  }, [doctor, isOpen]);

  if (!isOpen) return null;

  const handleAddTelefono = () => {
    setTelefonos((prev) => [...prev, '']);
  };

  const handleRemoveTelefono = (index: number) => {
    setTelefonos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTelefonoChange = (index: number, value: string) => {
    setTelefonos((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleAddEspecialidad = () => {
    if (nuevaEspecialidad.trim() && !especialidades.includes(nuevaEspecialidad.trim())) {
      setEspecialidades((prev) => [...prev, nuevaEspecialidad.trim()]);
      setNuevaEspecialidad('');
    }
  };

  const handleRemoveEspecialidad = (spec: string) => {
    setEspecialidades((prev) => prev.filter((s) => s !== spec));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) {
      onClose();
      return;
    }

    if (!usuarioId) {
      setError('Debes seleccionar un usuario del sistema para vincular al doctor.');
      return;
    }
    if (!nombre.trim() || !apellido.trim()) {
      setError('Nombre y apellido son campos obligatorios.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        usuario_id: Number(usuarioId),
        sucursal_id: 1, // Default main branch
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        telefonos: telefonos.filter((t) => t.trim() !== ''),
        especialidades: especialidades,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al guardar el doctor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEdit = Boolean(doctor);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 rounded-2xl shadow-2xl shadow-[#001C3D]/80 w-full max-w-lg overflow-hidden text-[#0840A8] dark:text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-between bg-gradient-to-r from-[#0840A8] to-[#0077D4]">
          <h3 className="text-base font-bold flex items-center gap-2 text-[#0840A8] dark:text-white">
            <Stethoscope className="text-[#0077D4] dark:text-[#00C2E0]" size={18} />
            {isReadOnly
              ? 'Detalles del Doctor'
              : isEdit
              ? 'Editar Doctor'
              : 'Registrar Nuevo Doctor'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#0077D4] dark:text-blue-100/80 hover:text-[#0840A8] dark:text-white hover:bg-white/10 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Usuario del Sistema */}
          <div>
            <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
              Usuario de Sistema Vinculado <span className="text-rose-400">*</span>
            </label>
            <select
              value={usuarioId}
              onChange={(e) => setUsuarioId(Number(e.target.value))}
              disabled={isReadOnly || isEdit}
              className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] disabled:opacity-60 transition-all"
            >
              <option value="" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">-- Seleccionar Usuario --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id} className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">
                  {u.name || u.email} ({u.rol?.nombre || 'Usuario'})
                </option>
              ))}
            </select>
          </div>

          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
                Nombre <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={isReadOnly}
                placeholder="Ej. Carlos"
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] disabled:opacity-60 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
                Apellido <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                disabled={isReadOnly}
                placeholder="Ej. Mendoza"
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] disabled:opacity-60 transition-all"
              />
            </div>
          </div>

          {/* Teléfonos */}
          <div>
            <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
              Teléfono(s) de Contacto
            </label>
            <div className="space-y-2">
              {telefonos.map((tel, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tel}
                    onChange={(e) => handleTelefonoChange(idx, e.target.value)}
                    disabled={isReadOnly}
                    placeholder="Ej. 78912345"
                    className="flex-1 px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] disabled:opacity-60 transition-all"
                  />
                  {!isReadOnly && telefonos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTelefono(idx)}
                      className="p-2 text-rose-400 hover:text-rose-200 cursor-pointer transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={handleAddTelefono}
                  className="text-xs font-semibold text-[#0077D4] dark:text-[#00C2E0] hover:text-[#0840A8] dark:text-white flex items-center gap-1.5 mt-1 cursor-pointer transition-colors"
                >
                  <Plus size={14} />
                  <span>Agregar otro teléfono</span>
                </button>
              )}
            </div>
          </div>

          {/* Especialidades */}
          <div>
            <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
              Especialidades Médicas
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {especialidades.map((spec, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#0840A8]/50 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/40 shadow-xs"
                >
                  <span>{spec}</span>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEspecialidad(spec)}
                      className="text-rose-400 hover:text-rose-200 cursor-pointer transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {!isReadOnly && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nuevaEspecialidad}
                  onChange={(e) => setNuevaEspecialidad(e.target.value)}
                  placeholder="Ej. Endodoncia, Cirugía..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddEspecialidad}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white text-xs font-bold hover:shadow-md hover:shadow-[#0077D4]/40 transition-all cursor-pointer"
                >
                  Añadir
                </button>
              </div>
            )}
          </div>

          {/* Buttons Footer */}
          <div className="pt-4 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-end gap-3">
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
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white border border-white/10 text-xs font-semibold cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#0840A8] hover:to-[#0077D4] text-white text-xs font-bold shadow-md shadow-[#0077D4]/30 disabled:opacity-50 cursor-pointer transition-all"
                >
                  {isSubmitting ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Registrar Doctor'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
