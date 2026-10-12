import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Stethoscope, Save } from 'lucide-react';
import type { Doctor, DoctorFormData } from '../types/doctor';
import type { User } from '../../auth/store/authStore';
import { getUsersApi } from '../../users/services/userService';

interface DoctorFormPanelProps {
  onSubmit: (data: DoctorFormData) => Promise<void>;
  onCancel: () => void;
  doctor?: Doctor | null;
  isReadOnly?: boolean;
}

export const DoctorFormPanel: React.FC<DoctorFormPanelProps> = ({
  onSubmit,
  onCancel,
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
    getUsersApi()
      .then((uList) => setUsers(uList))
      .catch(() => {});
  }, []);

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
  }, [doctor]);

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
      onCancel();
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
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al guardar el doctor');
      setIsSubmitting(false);
    }
  };

  const isEdit = Boolean(doctor);

  return (
    <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2 text-primary-dark dark:text-white uppercase tracking-wider">
          <Stethoscope className="text-primary dark:text-secondary" size={18} />
          {isReadOnly
            ? 'Detalles del Doctor'
            : isEdit
            ? 'Editar Doctor'
            : 'Registrar Nuevo Doctor'}
        </h3>
        <button
          onClick={onCancel}
          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="p-3 rounded-sm bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Col 1 */}
          <div className="space-y-4">
            {/* Usuario del Sistema */}
            <div>
              <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Usuario de Sistema Vinculado <span className="text-rose-500">*</span>
              </label>
              <select
                value={usuarioId}
                onChange={(e) => setUsuarioId(Number(e.target.value))}
                disabled={isReadOnly || isEdit}
                className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60 transition-all cursor-pointer"
              >
                <option value="">-- Seleccionar Usuario --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name || u.email} ({u.rol?.nombre || 'Usuario'})
                  </option>
                ))}
              </select>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Nombre <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={isReadOnly}
                placeholder="Ej. Carlos"
                className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60 transition-all"
              />
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Apellido <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                disabled={isReadOnly}
                placeholder="Ej. Mendoza"
                className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60 transition-all"
              />
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-4">
            {/* Especialidades */}
            <div>
              <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Especialidades Médicas
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {especialidades.map((spec, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    <span>{spec}</span>
                    {!isReadOnly && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEspecialidad(spec)}
                        className="text-slate-400 hover:text-rose-500 cursor-pointer transition-colors"
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
                    className="flex-1 px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleAddEspecialidad}
                    className="px-4 py-1.5 rounded-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-small font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    Añadir
                  </button>
                </div>
              )}
            </div>

            {/* Teléfonos */}
            <div>
              <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
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
                      className="flex-1 px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60 transition-all"
                    />
                    {!isReadOnly && telefonos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTelefono(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-sm cursor-pointer transition-colors"
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
                    className="text-tiny font-bold text-primary hover:text-primary-dark flex items-center gap-1 mt-1.5 cursor-pointer transition-colors uppercase tracking-wider"
                  >
                    <Plus size={12} />
                    <span>Agregar otro teléfono</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Footer */}
        <div className="pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 text-small font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-full sm:w-auto"
          >
            {isReadOnly ? 'Cerrar' : 'Cancelar y Volver'}
          </button>
          
          {!isReadOnly && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-1.5 rounded-sm bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-semibold shadow-sm disabled:opacity-50 cursor-pointer transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Save size={16} />
              {isSubmitting ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Registrar Doctor'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
