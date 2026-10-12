import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, Tag, FileText, CheckCircle2, AlertTriangle, RotateCcw, PlusCircle, Edit3 } from 'lucide-react';
import type { Servicio, ServicioFormData } from '../types/servicio';
import { useAuthStore } from '../../auth/store/authStore';

interface ServicioFormPanelProps {
  onSubmit: (data: ServicioFormData) => Promise<void>;
  servicio?: Servicio | null;
  onCancelEdit?: () => void;
}

export const ServicioFormPanel: React.FC<ServicioFormPanelProps> = ({
  onSubmit,
  servicio,
  onCancelEdit,
}) => {
  const { user } = useAuthStore();
  const isAdmin = user?.rol?.nombre === 'Administrador';

  const [codigoServicio, setCodigoServicio] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState<string>('Odontología General');
  const [precio, setPrecio] = useState<number | ''>(150);
  const [duracion, setDuracion] = useState<number>(30);
  const [estado, setEstado] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (servicio) {
      setCodigoServicio(servicio.codigo_servicio || '');
      setNombre(servicio.nombre || '');
      setDescripcion(servicio.descripcion || '');
      setCategoria(servicio.categoria || 'Odontología General');
      setPrecio(Number(servicio.precio) || 0);
      setDuracion(Number(servicio.duracion_estimada_minutos) || 30);
      setEstado(servicio.estado ?? true);
    } else {
      setCodigoServicio('');
      setNombre('');
      setDescripcion('');
      setCategoria('Odontología General');
      setPrecio(150);
      setDuracion(30);
      setEstado(true);
    }
    setError(null);
  }, [servicio]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAdmin) {
      setError('Solo los usuarios con rol Administrador están autorizados para registrar o modificar servicios y precios.');
      return;
    }

    if (!nombre.trim() || precio === '' || Number(precio) <= 0) {
      setError('El nombre y un precio válido mayor a 0 son obligatorios.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        codigo_servicio: codigoServicio.trim() || undefined,
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        categoria,
        precio: Number(precio),
        duracion_estimada_minutos: Number(duracion) || 30,
        estado,
      });

      if (!servicio) {
        setCodigoServicio('');
        setNombre('');
        setDescripcion('');
        setPrecio(150);
        setDuracion(30);
        setEstado(true);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al guardar el servicio dental.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col sticky top-6">
      {/* Panel Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between">
        <h3 className="text-small font-bold uppercase tracking-wider text-primary-dark dark:text-white flex items-center gap-1.5">
          {servicio ? (
            <>
              <Edit3 className="text-primary" size={14} />
              <span>Editar Servicio #{servicio.codigo_servicio || servicio.id}</span>
            </>
          ) : (
            <>
              <PlusCircle className="text-primary" size={14} />
              <span>Nuevo Servicio y Precio</span>
            </>
          )}
        </h3>

        {servicio && onCancelEdit && (
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
            <span>Solo Administradores pueden registrar o editar tarifas de servicios.</span>
          </div>
        )}

        {error && (
          <div className="p-2.5 rounded-sm bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-small font-semibold">
            {error}
          </div>
        )}

        {/* Nombre del Servicio */}
        <div>
          <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1">
            Nombre del Servicio <span className="text-rose-500">*</span>
          </label>
          <input
            id="servicio-nombre-input"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            disabled={!isAdmin}
            placeholder="Ej. Limpieza Ultrasónica Profiláctica"
            className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary-dark dark:text-white text-small font-medium placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-60"
          />
        </div>

        {/* Código y Categoría */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1">
              Código (Opcional)
            </label>
            <input
              type="text"
              value={codigoServicio}
              onChange={(e) => setCodigoServicio(e.target.value)}
              disabled={!isAdmin}
              placeholder="Auto (SERV-xxx)"
              className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary-dark dark:text-white text-small font-mono font-medium placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Tag size={11} className="text-primary" />
              Categoría
            </label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              disabled={!isAdmin}
              placeholder="Ej. Odontología General"
              className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary-dark dark:text-white text-small font-medium placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-60"
            />
          </div>
        </div>

        {/* Precio & Duración */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <DollarSign size={11} className="text-primary" />
              Precio (Bs.) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={precio}
              onChange={(e) => setPrecio(e.target.value === '' ? '' : Number(e.target.value))}
              required
              disabled={!isAdmin}
              placeholder="150.00"
              className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary dark:text-secondary text-small font-mono font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Clock size={11} className="text-primary" />
              Duración (Min)
            </label>
            <input
              type="number"
              step="5"
              min="5"
              max="480"
              value={duracion}
              onChange={(e) => setDuracion(Number(e.target.value))}
              disabled={!isAdmin}
              className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-60"
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
            <FileText size={11} className="text-primary" />
            Descripción del Servicio
          </label>
          <textarea
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            disabled={!isAdmin}
            placeholder="Breve resumen del procedimiento clínico..."
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
              Servicio Activo en Catálogo
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          {servicio && onCancelEdit && (
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
            className={`${servicio ? 'w-2/3' : 'w-full'} py-1.5 px-4 rounded bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-bold shadow-sm disabled:opacity-50 transition-colors flex items-center justify-center gap-2`}
          >
            <CheckCircle2 size={13} />
            <span>{isSubmitting ? 'Guardando...' : servicio ? 'Guardar Cambios' : 'Registrar Servicio'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
