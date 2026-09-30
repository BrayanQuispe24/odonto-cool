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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 rounded-2xl shadow-2xl shadow-[#001C3D]/80 w-full max-w-lg overflow-hidden text-[#0840A8] dark:text-white flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-between bg-gradient-to-r from-[#0840A8] to-[#0077D4]">
          <h3 className="text-base font-bold flex items-center gap-2 text-[#0840A8] dark:text-white">
            <Sparkles className="text-[#0077D4] dark:text-[#00C2E0]" size={18} />
            <span>{servicio ? 'Editar Servicio y Precio' : 'Registrar Nuevo Servicio y Precio'}</span>
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
                Restricción de Permisos: Solo los usuarios con rol <strong>Administrador</strong> están autorizados para registrar o modificar servicios y precios.
              </span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Nombre & Código */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
                Nombre del Servicio <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                disabled={!isAdmin}
                placeholder="Ej. Blanqueamiento Dental LED"
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
                Código (Opcional)
              </label>
              <input
                type="text"
                value={codigoServicio}
                onChange={(e) => setCodigoServicio(e.target.value)}
                disabled={!isAdmin}
                placeholder="Auto (SERV-xxx)"
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-mono font-medium placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Categoría y Precio */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1 flex items-center gap-1">
                <Tag size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
                Categoría
              </label>
              <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                disabled={!isAdmin}
                placeholder="Ej. Estética Dental, Ortodoncia..."
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1 flex items-center gap-1">
                <DollarSign size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
                Precio Oficial (Bs.) <span className="text-rose-400">*</span>
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
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-mono font-bold text-[#0077D4] dark:text-[#00C2E0] focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Duración y Estado */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1 flex items-center gap-1">
                <Clock size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
                Duración Estimada (Minutos)
              </label>
              <input
                type="number"
                step="5"
                min="5"
                max="480"
                value={duracion}
                onChange={(e) => setDuracion(Number(e.target.value))}
                disabled={!isAdmin}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={estado}
                  onChange={(e) => setEstado(e.target.checked)}
                  disabled={!isAdmin}
                  className="rounded border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-white dark:bg-[#002D5E] text-[#0077D4] dark:text-[#00C2E0] focus:ring-[#00C2E0] cursor-pointer disabled:opacity-60"
                />
                <span className="text-xs font-medium text-[#0077D4] dark:text-blue-100">
                  Servicio Activo en Catálogo
                </span>
              </label>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1 flex items-center gap-1">
              <FileText size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
              Descripción del Procedimiento
            </label>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={!isAdmin}
              placeholder="Detalle de lo que incluye el procedimiento dental..."
              className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all resize-none disabled:opacity-60"
            />
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
              <span>{isSubmitting ? 'Guardando...' : servicio ? 'Guardar Cambios' : 'Registrar Servicio'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
