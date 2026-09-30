import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, AlertTriangle, Layers, Hash, RotateCcw, PlusCircle, Edit3 } from 'lucide-react';
import type { Diente, DienteFormData } from '../types/diente';
import { CUADRANTES_DENTALES } from '../types/diente';
import { useAuthStore } from '../../auth/store/authStore';

interface DienteFormPanelProps {
  onSubmit: (data: DienteFormData) => Promise<void>;
  diente?: Diente | null;
  onCancelEdit?: () => void;
}

export const DienteFormPanel: React.FC<DienteFormPanelProps> = ({
  onSubmit,
  diente,
  onCancelEdit,
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
  }, [diente]);

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

      if (!diente) {
        setNumeroDiente(11);
        setNombre('');
        setCuadrante(CUADRANTES_DENTALES[0]);
        setTipoDenticion('permanente');
        setDescripcion('');
        setUrl('');
        setEstado(true);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al guardar la pieza dental.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#002D5E] rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 overflow-hidden text-[#0840A8] dark:text-white flex flex-col sticky top-6">
      {/* Panel Header */}
      <div className="p-4 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-[#0840A8]/20 flex items-center justify-between">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0077D4] dark:text-[#00C2E0] flex items-center gap-2 font-mono">
          {diente ? (
            <>
              <Edit3 className="text-[#0077D4] dark:text-[#00C2E0]" size={16} />
              <span>Editar Pieza Dental FDI #{diente.numero_diente}</span>
            </>
          ) : (
            <>
              <PlusCircle className="text-[#0077D4] dark:text-[#00C2E0]" size={16} />
              <span>Nueva Pieza Dental (FDI)</span>
            </>
          )}
        </h3>

        {diente && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-2.5 py-1 rounded-lg bg-[#F4F9FF] dark:bg-[#001C3D] hover:bg-[#0077D4]/30 border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-xs font-semibold text-[#0077D4] dark:text-blue-100 flex items-center gap-1 transition-all cursor-pointer"
            title="Cancelar edición"
          >
            <RotateCcw size={12} />
            <span>Cancelar</span>
          </button>
        )}
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {!isAdmin && (
          <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400 shrink-0" />
            <span>Solo Administradores pueden registrar o editar piezas dentales FDI.</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Número FDI y Nombre */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100/90 mb-1 flex items-center gap-1">
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
            <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100/90 mb-1">
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
            <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100/90 mb-1 flex items-center gap-1">
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
            <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100/90 mb-1">
              Tipo Dentición
            </label>
            <select
              value={tipoDenticion}
              onChange={(e) => setTipoDenticion(e.target.value as 'permanente' | 'deciduo')}
              disabled={!isAdmin}
              className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all cursor-pointer disabled:opacity-60"
            >
              <option value="permanente" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">Permanente (Adulto)</option>
              <option value="deciduo" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">Deciduo (Infantil)</option>
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100/90 mb-1 flex items-center gap-1">
            <FileText size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
            Descripción Anatómica
          </label>
          <textarea
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            disabled={!isAdmin}
            placeholder="Posición anatómica, funciones principales..."
            className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all resize-none disabled:opacity-60"
          />
        </div>

        {/* Checkbox Estado */}
        <div>
          <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 cursor-pointer select-none hover:border-[#0840A8]/15 dark:border-[#00C2E0]/50 transition-all">
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

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center gap-2">
          {diente && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="w-1/3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] hover:bg-white/10 text-[#0840A8] dark:text-white border border-white/10 text-xs font-semibold cursor-pointer transition-all text-center"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !isAdmin}
            className={`${diente ? 'w-2/3' : 'w-full'} py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#00C2E0] hover:to-[#0077D4] text-white text-xs font-extrabold shadow-md shadow-[#0077D4]/30 hover:shadow-[#00C2E0]/40 disabled:opacity-40 cursor-pointer transition-all border border-white/10 flex items-center justify-center gap-2`}
          >
            <CheckCircle2 size={16} />
            <span>{isSubmitting ? 'Guardando...' : diente ? 'Guardar Cambios' : 'Registrar Diente'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
