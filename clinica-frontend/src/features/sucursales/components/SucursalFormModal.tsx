import React, { useState, useEffect } from 'react';
import { X, Building2, MapPin, Phone, Clock, Hash, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { Sucursal, SucursalFormData } from '../types/sucursal';

interface SucursalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SucursalFormData) => Promise<void>;
  sucursalToEdit?: Sucursal | null;
}

export const SucursalFormModal: React.FC<SucursalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  sucursalToEdit,
}) => {
  const [formData, setFormData] = useState<SucursalFormData>({
    codigo_sucursal: '',
    nombre: '',
    ubicacion: '',
    telefono: '',
    horario_atencion: '',
    estado: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sucursalToEdit) {
      setFormData({
        codigo_sucursal: sucursalToEdit.codigo_sucursal || '',
        nombre: sucursalToEdit.nombre || '',
        ubicacion: sucursalToEdit.ubicacion || '',
        telefono: sucursalToEdit.telefono || '',
        horario_atencion: sucursalToEdit.horario_atencion || '',
        estado: sucursalToEdit.estado ?? true,
      });
    } else {
      setFormData({
        codigo_sucursal: `SUC-00${Math.floor(Math.random() * 90) + 10}`,
        nombre: '',
        ubicacion: '',
        telefono: '',
        horario_atencion: '08:00 - 20:00',
        estado: true,
      });
    }
    setError(null);
  }, [sucursalToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.codigo_sucursal.trim() || !formData.nombre.trim() || !formData.ubicacion.trim()) {
      setError('Por favor completa todos los campos requeridos (*).');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al guardar los datos de la sucursal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden text-[#0840A8] dark:text-white space-y-0">
        {/* Header */}
        <div className="p-5 border-b border-[#0840A8]/15 dark:border-[#00C2E0]/30 flex items-center justify-between bg-[#F4F9FF]/80 dark:bg-[#0840A8]/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#0077D4]/15 dark:bg-[#00C2E0]/20 text-[#0077D4] dark:text-[#00C2E0]">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {sucursalToEdit ? 'Editar Sucursal' : 'Registrar Nueva Sucursal'}
              </h3>
              <p className="text-xs text-[#002D5E] dark:text-slate-200">
                Modulo de administración Multi-Tenant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-200 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Código */}
            <div>
              <label className="block text-xs font-bold mb-1 flex items-center gap-1">
                <Hash size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
                Código de Sucursal *
              </label>
              <input
                type="text"
                value={formData.codigo_sucursal}
                onChange={(e) => setFormData({ ...formData, codigo_sucursal: e.target.value })}
                placeholder="Ej. SUC-001"
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#0840A8]/15 dark:border-[#0840A8]/20 dark:border-[#00C2E0]/30 bg-white dark:bg-[#001C3D] text-[#0840A8] dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#0077D4]/50"
              />
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-xs font-bold mb-1 flex items-center gap-1">
                <Building2 size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
                Nombre de Sucursal *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej. Sede Central Matrix"
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#0840A8]/15 dark:border-[#0840A8]/20 dark:border-[#00C2E0]/30 bg-white dark:bg-[#001C3D] text-[#0840A8] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0077D4]/50"
              />
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-xs font-bold mb-1 flex items-center gap-1">
              <MapPin size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
              Ubicación / Dirección Exacta *
            </label>
            <input
              type="text"
              value={formData.ubicacion}
              onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              placeholder="Ej. Av. Principal 1230, Centro Médico Lux"
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#0840A8]/15 dark:border-[#0840A8]/20 dark:border-[#00C2E0]/30 bg-white dark:bg-[#001C3D] text-[#0840A8] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0077D4]/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Teléfono */}
            <div>
              <label className="block text-xs font-bold mb-1 flex items-center gap-1">
                <Phone size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
                Teléfono de Contacto
              </label>
              <input
                type="text"
                value={formData.telefono || ''}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="Ej. (02) 294-8500"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#0840A8]/15 dark:border-[#0840A8]/20 dark:border-[#00C2E0]/30 bg-white dark:bg-[#001C3D] text-[#0840A8] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0077D4]/50"
              />
            </div>

            {/* Horario */}
            <div>
              <label className="block text-xs font-bold mb-1 flex items-center gap-1">
                <Clock size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
                Horario de Atención
              </label>
              <input
                type="text"
                value={formData.horario_atencion || ''}
                onChange={(e) => setFormData({ ...formData, horario_atencion: e.target.value })}
                placeholder="Ej. 08:00 - 20:00"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#0840A8]/15 dark:border-[#0840A8]/20 dark:border-[#00C2E0]/30 bg-white dark:bg-[#001C3D] text-[#0840A8] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0077D4]/50"
              />
            </div>
          </div>

          {/* Estado Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="estado-checkbox"
              checked={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.checked })}
              className="w-4 h-4 rounded border-[#0840A8]/15 dark:border-[#0840A8]/30 text-[#0077D4] focus:ring-[#0077D4]"
            />
            <label htmlFor="estado-checkbox" className="text-xs font-bold cursor-pointer flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              Sucursal Operativa / Activa
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#0840A8]/15 dark:border-[#00C2E0]/20">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button variant="teal" type="submit" disabled={loading}>
              {loading ? 'Guardando...' : sucursalToEdit ? 'Actualizar Sucursal' : 'Crear Sucursal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
