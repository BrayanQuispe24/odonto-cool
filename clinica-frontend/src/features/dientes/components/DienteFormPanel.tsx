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
    <div className="bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col sticky top-6">
      {/* Panel Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between">
        <h3 className="text-small font-bold uppercase tracking-wider text-primary-dark dark:text-white flex items-center gap-1.5">
          {diente ? (
            <>
              <Edit3 className="text-primary" size={14} />
              <span>Editar Pieza Dental #{diente.numero_diente}</span>
            </>
          ) : (
            <>
              <PlusCircle className="text-primary" size={14} />
              <span>Nueva Pieza Dental</span>
            </>
          )}
        </h3>

        {diente && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-2 py-1 rounded bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-tiny font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw size={10} />
            <span>Cancelar</span>
          </button>
        )}
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4 text-slate-700 dark:text-slate-200">
        {!isAdmin && (
          <div className="p-2.5 rounded-sm bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-small font-semibold flex items-center gap-2">
            <AlertTriangle size={14} className="shrink-0" />
            <span>Solo Administradores pueden registrar o editar piezas dentales FDI.</span>
          </div>
        )}

        {error && (
          <div className="p-2.5 rounded-sm bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-small font-semibold">
            {error}
          </div>
        )}

        {/* Número FDI y Nombre */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Hash size={11} className="text-primary" />
              Nº FDI <span className="text-rose-500">*</span>
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
              className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary dark:text-secondary text-small font-mono font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-60"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nombre Anatómico <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              disabled={!isAdmin}
              placeholder="Ej. Incisivo Central Superior Derecho"
              className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary-dark dark:text-white text-small font-medium placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-60"
            />
          </div>
        </div>

        {/* Cuadrante y Tipo Dentición */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Layers size={11} className="text-primary" />
              Cuadrante
            </label>
            <select
              value={cuadrante}
              onChange={(e) => setCuadrante(e.target.value)}
              disabled={!isAdmin}
              className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer disabled:opacity-60"
            >
              {CUADRANTES_DENTALES.map((c) => (
                <option key={c} value={c} className="bg-white dark:bg-dark-surface">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tipo Dentición
            </label>
            <select
              value={tipoDenticion}
              onChange={(e) => setTipoDenticion(e.target.value as 'permanente' | 'deciduo')}
              disabled={!isAdmin}
              className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer disabled:opacity-60"
            >
              <option value="permanente" className="bg-white dark:bg-dark-surface">Permanente</option>
              <option value="deciduo" className="bg-white dark:bg-dark-surface">Deciduo</option>
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
            <FileText size={11} className="text-primary" />
            Descripción Anatómica
          </label>
          <textarea
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            disabled={!isAdmin}
            placeholder="Posición anatómica..."
            className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary-dark dark:text-white text-small font-medium placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none disabled:opacity-60"
          />
        </div>

        {/* Checkbox Estado */}
        <div>
          <label className="flex items-center gap-2 p-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-dark-bg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <input
              type="checkbox"
              checked={estado}
              onChange={(e) => setEstado(e.target.checked)}
              disabled={!isAdmin}
              className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer disabled:opacity-60"
            />
            <span className="text-small font-bold text-slate-700 dark:text-slate-300">
              Pieza Dental Activa
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          {diente && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="w-1/3 py-1.5 rounded bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-small font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !isAdmin}
            className={`${diente ? 'w-2/3' : 'w-full'} py-1.5 px-4 rounded bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-bold shadow-sm disabled:opacity-50 transition-colors flex items-center justify-center gap-2`}
          >
            <CheckCircle2 size={13} />
            <span>{isSubmitting ? 'Guardando...' : diente ? 'Guardar Cambios' : 'Registrar Diente'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
