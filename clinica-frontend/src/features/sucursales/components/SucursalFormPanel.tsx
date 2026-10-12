import React, { useState, useEffect } from 'react';
import { X, Building2, MapPin, Phone, Clock, Hash, CheckCircle2, Save } from 'lucide-react';
import type { Sucursal, SucursalFormData } from '../types/sucursal';

interface SucursalFormPanelProps {
  onSubmit: (data: SucursalFormData) => Promise<void>;
  onCancel: () => void;
  sucursalToEdit?: Sucursal | null;
}

export const SucursalFormPanel: React.FC<SucursalFormPanelProps> = ({
  onSubmit,
  onCancel,
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
  }, [sucursalToEdit]);

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
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al guardar los datos de la sucursal.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm flex flex-col w-full text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2 text-primary-dark dark:text-white uppercase tracking-wider">
          <Building2 className="text-primary dark:text-secondary" size={18} />
          {sucursalToEdit ? 'Editar Sucursal' : 'Registrar Nueva Sucursal'}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Código */}
          <div>
            <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Hash size={12} className="text-slate-400" />
              Código de Sucursal <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.codigo_sucursal}
              onChange={(e) => setFormData({ ...formData, codigo_sucursal: e.target.value })}
              placeholder="Ej. SUC-001"
              required
              className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Building2 size={12} className="text-slate-400" />
              Nombre de Sucursal <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej. Sede Central Matrix"
              required
              className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
            <MapPin size={12} className="text-slate-400" />
            Ubicación / Dirección Exacta <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.ubicacion}
            onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
            placeholder="Ej. Av. Principal 1230, Centro Médico Lux"
            required
            className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Teléfono */}
          <div>
            <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Phone size={12} className="text-slate-400" />
              Teléfono de Contacto
            </label>
            <input
              type="text"
              value={formData.telefono || ''}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="Ej. (02) 294-8500"
              className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          {/* Horario */}
          <div>
            <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Clock size={12} className="text-slate-400" />
              Horario de Atención
            </label>
            <input
              type="text"
              value={formData.horario_atencion || ''}
              onChange={(e) => setFormData({ ...formData, horario_atencion: e.target.value })}
              placeholder="Ej. 08:00 - 20:00"
              className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
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
            className="w-4 h-4 rounded-sm border-slate-300 dark:border-slate-700 text-primary focus:ring-primary cursor-pointer"
          />
          <label htmlFor="estado-checkbox" className="text-small font-bold cursor-pointer flex items-center gap-1.5 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <CheckCircle2 size={14} className="text-emerald-500" />
            Sucursal Operativa / Activa
          </label>
        </div>

        {/* Actions Footer */}
        <div className="pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 text-small font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-full sm:w-auto"
          >
            Cancelar y Volver
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-1.5 rounded-sm bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-semibold shadow-sm disabled:opacity-50 cursor-pointer transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Save size={16} />
            {loading ? 'Guardando...' : sucursalToEdit ? 'Actualizar Sucursal' : 'Crear Sucursal'}
          </button>
        </div>
      </form>
    </div>
  );
};
