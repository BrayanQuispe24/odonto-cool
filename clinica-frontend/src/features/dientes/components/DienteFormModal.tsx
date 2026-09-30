import React, { useState, useEffect } from 'react';
import { X, Activity, FileText, CheckCircle2, AlertTriangle, Layers, Hash } from 'lucide-react';
import type { Diente, DienteFormData } from '../types/diente';
import { CUADRANTES_DENTALES } from '../types/diente';
import { useAuthStore } from '../../auth/store/authStore';

interface DienteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DienteFormData) => Promise<void>;
  diente?: Diente | null;
}

export const DienteFormModal: React.FC<DienteFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  diente,
}) => {
  const { user } = useAuthStore();
  const isAdmin = user?.rol?.nombre === 'Administrador';

  const [numeroDiente, setNumeroDiente] = useState<number | ''>(11);
  const [nombre, setNombre] = useState('');
  const [cuadrante, setCuadrante] = useState<string>(CUADRANTES_DENTALES[0]);
  const [tipoDenticion, setTipoDenticion] = useState<'permanente' | 'deciduo'>('permanente');
  const [descripcion, setDescripcion] = useState('');
  const [url, setUrl] = useState('');
  const [estado, setEstado] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (diente) {
        setNumeroDiente(diente.numero_diente);
        setNombre(diente.nombre || '');
        setCuadrante(diente.cuadrante || CUADRANTES_DENTALES[0]);
        setTipoDenticion(diente.tipo_denticion || 'permanente');
        setDescripcion(diente.descripcion || '');
        setUrl(diente.url || '');
        setEstado(diente.estado ?? true);
      } else {
        setNumeroDiente(11);
        setNombre('');
        setCuadrante(CUADRANTES_DENTALES[0]);
        setTipoDenticion('permanente');
        setDescripcion('');
        setUrl('');
        setEstado(true);
      }
      setError(null);
    }
  }, [isOpen, diente]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAdmin) {
      setError('Solo los usuarios con rol Administrador están autorizados para registrar o modificar piezas dentales.');
      return;
    }

    if (!numeroDiente || !nombre.trim()) {
      setError('El número FDI y el nombre anatómico del diente son obligatorios.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        numero_diente: Number(numeroDiente),
        nombre: nombre.trim(),
        cuadrante: cuadrante.trim() || undefined,
        tipo_denticion: tipoDenticion,
        descripcion: descripcion.trim() || undefined,
        url: url.trim() || undefined,
        estado,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al guardar la pieza dental.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 rounded-2xl shadow-2xl shadow-[#001C3D]/80 w-full max-w-lg overflow-hidden text-[#0840A8] dark:text-white flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-between bg-gradient-to-r from-[#0840A8] to-[#0077D4]">
          <h3 className="text-base font-bold flex items-center gap-2 text-[#0840A8] dark:text-white">
            <Activity className="text-[#0077D4] dark:text-[#00C2E0]" size={18} />
            <span>{diente ? 'Editar Pieza Dental (FDI)' : 'Registrar Nueva Pieza Dental'}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#0077D4] dark:text-blue-100/80 hover:text-[#0840A8] dark:text-white hover:bg-white/10 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {!isAdmin && (
            <div className="p-3.5 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-400 shrink-0" />
              <span>
                Restricción de Permisos: Solo los usuarios con rol <strong>Administrador</strong> están autorizados para registrar o modificar piezas dentales.
              </span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Número FDI y Nombre */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1 flex items-center gap-1">
                <Hash size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
                Nº FDI <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="11"
                max="85"
                value={numeroDiente}
                onChange={(e) => setNumeroDiente(e.target.value === '' ? '' : Number(e.target.value))}
                required
                disabled={!isAdmin}
                placeholder="Ej. 11"
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-mono font-bold text-[#0077D4] dark:text-[#00C2E0] focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all disabled:opacity-60"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
                Nombre Anatómico <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                disabled={!isAdmin}
                placeholder="Ej. Incisivo Central Superior Derecho"
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Cuadrante y Tipo Dentición */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1 flex items-center gap-1">
                <Layers size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
                Cuadrante
              </label>
              <select
                value={cuadrante}
                onChange={(e) => setCuadrante(e.target.value)}
                disabled={!isAdmin}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all cursor-pointer disabled:opacity-60"
              >
                {CUADRANTES_DENTALES.map((c) => (
                  <option key={c} value={c} className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
                Tipo de Dentición
              </label>
              <select
                value={tipoDenticion}
                onChange={(e) => setTipoDenticion(e.target.value as 'permanente' | 'deciduo')}
                disabled={!isAdmin}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all cursor-pointer disabled:opacity-60"
              >
                <option value="permanente" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">Permanente (Adulto)</option>
                <option value="deciduo" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">Deciduo (Infantil / Leche)</option>
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1 flex items-center gap-1">
              <FileText size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
              Descripción Anatómica
            </label>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={!isAdmin}
              placeholder="Detalles de la posición anatómica, cúspides o funciones..."
              className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all resize-none disabled:opacity-60"
            />
          </div>

          {/* Activo / Inactivo */}
          <div>
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={estado}
                onChange={(e) => setEstado(e.target.checked)}
                disabled={!isAdmin}
                className="rounded border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-white dark:bg-[#002D5E] text-[#0077D4] dark:text-[#00C2E0] focus:ring-[#00C2E0] cursor-pointer disabled:opacity-60"
              />
              <span className="text-xs font-medium text-[#0077D4] dark:text-blue-100">
                Pieza Dental Activa en Registro
              </span>
            </label>
          </div>

          {/* Buttons Footer */}
          <div className="pt-4 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white border border-white/10 text-xs font-semibold cursor-pointer transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isAdmin}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#0840A8] hover:to-[#0077D4] text-white text-xs font-bold shadow-md shadow-[#0077D4]/30 disabled:opacity-40 cursor-pointer transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 size={15} />
              <span>{isSubmitting ? 'Guardando...' : diente ? 'Guardar Cambios' : 'Registrar Diente'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
