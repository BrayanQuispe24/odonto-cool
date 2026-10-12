import React, { useState, useEffect } from 'react';
import { X, Sparkles, DollarSign, Clock, Tag, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { Servicio, ServicioFormData } from '../types/servicio';
import { useAuthStore } from '../../auth/store/authStore';

interface ServicioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServicioFormData) => Promise<void>;
  servicio?: Servicio | null;
}

export const ServicioFormModal: React.FC<ServicioFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  servicio,
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
    if (isOpen) {
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
    }
  }, [isOpen, servicio]);

  if (!isOpen) return null;

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
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al guardar el servicio dental.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between shrink-0">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-dark dark:text-white flex items-center gap-2">
            <Sparkles className="text-primary" size={16} />
            <span>{servicio ? 'Editar Servicio' : 'Registrar Servicio'}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1 text-slate-700 dark:text-slate-200 bg-white dark:bg-dark-surface">
          {!isAdmin && (
            <div className="p-2.5 rounded-sm bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-small font-semibold flex items-center gap-2">
              <AlertTriangle size={14} className="shrink-0" />
              <span>
                Solo los usuarios con rol <strong>Administrador</strong> están autorizados para registrar o modificar servicios y precios.
              </span>
            </div>
          )}

          {error && (
            <div className="p-2.5 rounded-sm bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-small font-semibold">
              {error}
            </div>
          )}

          {/* Nombre & Código */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nombre del Servicio <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                disabled={!isAdmin}
                placeholder="Ej. Blanqueamiento Dental LED"
                className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary-dark dark:text-white text-small font-medium placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1">
                Código
              </label>
              <input
                type="text"
                value={codigoServicio}
                onChange={(e) => setCodigoServicio(e.target.value)}
                disabled={!isAdmin}
                placeholder="Auto"
                className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary-dark dark:text-white text-small font-mono font-medium placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-60"
              />
            </div>
          </div>

          {/* Categoría & Precio */}
          <div className="grid grid-cols-2 gap-3">
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
                placeholder="Ej. Estética"
                className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary-dark dark:text-white text-small font-medium placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-60"
              />
            </div>

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
                placeholder="0.00"
                className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary dark:text-secondary text-small font-mono font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-60"
              />
            </div>
          </div>

          {/* Duración */}
          <div>
            <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Clock size={11} className="text-primary" />
              Duración (Minutos)
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

          {/* Descripción */}
          <div>
            <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <FileText size={11} className="text-primary" />
              Descripción
            </label>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={!isAdmin}
              placeholder="Detalles del procedimiento..."
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
        </form>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-small font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !isAdmin}
            className="px-6 py-1.5 rounded bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-bold shadow-sm disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 size={13} />
            <span>{isSubmitting ? 'Guardando...' : servicio ? 'Guardar Cambios' : 'Registrar Servicio'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
