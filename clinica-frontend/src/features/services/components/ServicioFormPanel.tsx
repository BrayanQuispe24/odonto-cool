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
    <div className="bg-white dark:bg-[#002D5E] rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 overflow-hidden text-[#0840A8] dark:text-white flex flex-col sticky top-6">
      {/* Panel Header - Mismo tono y borde que la barra del listado */}
      <div className="p-4 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-[#0840A8]/20 flex items-center justify-between">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0077D4] dark:text-[#00C2E0] flex items-center gap-2 font-mono">
          {servicio ? (
            <>
              <Edit3 className="text-[#0077D4] dark:text-[#00C2E0]" size={16} />
              <span>Editar Servicio #{servicio.codigo_servicio || servicio.id}</span>
            </>
          ) : (
            <>
              <PlusCircle className="text-[#0077D4] dark:text-[#00C2E0]" size={16} />
              <span>Nuevo Servicio y Precio</span>
            </>
          )}
        </h3>

        {servicio && onCancelEdit && (
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
            <span>Solo Administradores pueden registrar o editar tarifas de servicios.</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Nombre del Servicio */}
        <div>
          <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100/90 mb-1">
            Nombre del Servicio <span className="text-rose-400">*</span>
          </label>
          <input
            id="servicio-nombre-input"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            disabled={!isAdmin}
            placeholder="Ej. Limpieza Ultrasónica Profiláctica"
            className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all disabled:opacity-60"
          />
        </div>

        {/* Código y Categoría */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100/90 mb-1">
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

          <div>
            <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100/90 mb-1 flex items-center gap-1">
              <Tag size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
              Categoría
            </label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              disabled={!isAdmin}
              placeholder="Ej. Odontología General"
              className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all disabled:opacity-60"
            />
          </div>
        </div>

        {/* Precio & Duración */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100/90 mb-1 flex items-center gap-1">
              <DollarSign size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
              Precio (Bs.) <span className="text-rose-400">*</span>
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
              className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-mono font-bold text-[#0077D4] dark:text-[#00C2E0] focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100/90 mb-1 flex items-center gap-1">
              <Clock size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
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
              className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all disabled:opacity-60"
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100/90 mb-1 flex items-center gap-1">
            <FileText size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
            Descripción del Servicio
          </label>
          <textarea
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            disabled={!isAdmin}
            placeholder="Breve resumen del procedimiento clínico..."
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
              Servicio Activo en Catálogo
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center gap-2">
          {servicio && onCancelEdit && (
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
            className={`${servicio ? 'w-2/3' : 'w-full'} py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#00C2E0] hover:to-[#0077D4] text-white text-xs font-extrabold shadow-md shadow-[#0077D4]/30 hover:shadow-[#00C2E0]/40 disabled:opacity-40 cursor-pointer transition-all border border-white/10 flex items-center justify-center gap-2`}
          >
            <CheckCircle2 size={16} />
            <span>{isSubmitting ? 'Guardando...' : servicio ? 'Guardar Cambios' : 'Registrar Servicio'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
