import React, { useState, useEffect } from 'react';
import { UserPlus, Building2, AlertCircle } from 'lucide-react';
import type { PacienteFormData } from '../types/patient';
import type { Sucursal } from '../../sucursales/types/sucursal';
import { getSucursalesApi } from '../../sucursales/services/sucursalService';

interface PatientFormPanelProps {
  onSubmit: (data: PacienteFormData) => Promise<void>;
  onCancel: () => void;
}

export const PatientFormPanel: React.FC<PatientFormPanelProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [codigoPaciente, setCodigoPaciente] = useState(`PAC-${Math.floor(100 + Math.random() * 900)}`);
  const [sucursalId, setSucursalId] = useState<number | ''>(1);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState<number | ''>('');
  const [sexo, setSexo] = useState('Masculino');
  const [celular, setCelular] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [ocupacion, setOcupacion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSucursalesApi()
      .then((list) => {
        setSucursales(list);
        if (list.length > 0) {
          setSucursalId(list[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !apellido.trim() || !sucursalId) {
      setError('Nombre, Apellido y Sucursal son obligatorios.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        codigo_paciente: codigoPaciente,
        sucursal_id: Number(sucursalId),
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        edad: edad === '' ? 0 : Number(edad),
        sexo,
        celular: celular.trim(),
        fecha_nacimiento: fechaNacimiento || '1995-01-01',
        domicilio_actual: domicilio.trim(),
        ocupacion: ocupacion.trim(),
      });
      // Optionally reset form if staying on the same tab
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al registrar el paciente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-all duration-300">
      {/* Panel Header */}
      <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-primary-dark dark:text-slate-300 flex items-center gap-2">
          <UserPlus size={14} className="text-primary dark:text-secondary" />
          <span>Registrar Nuevo Paciente</span>
        </h3>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
        {error && (
          <div className="p-3 rounded bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* Dense Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          
          {/* COLUMN 1 */}
          <div className="space-y-4">
            <div>
              <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Código de Paciente <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={codigoPaciente}
                onChange={(e) => setCodigoPaciente(e.target.value)}
                required
                className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small font-mono font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Building2 size={11} className="text-primary dark:text-secondary" />
                Sucursal Registro <span className="text-rose-500">*</span>
              </label>
              <select
                value={sucursalId}
                onChange={(e) => setSucursalId(Number(e.target.value))}
                required
                className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
              >
                {sucursales.map((suc) => (
                  <option key={suc.id} value={suc.id} className="bg-white dark:bg-dark-surface text-primary-dark dark:text-white">
                    {suc.nombre} ({suc.codigo_sucursal})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombres <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  placeholder="Ej. Juan"
                  className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Apellidos <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                  placeholder="Ej. Pérez"
                  className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Domicilio Actual
              </label>
              <input
                type="text"
                value={domicilio}
                onChange={(e) => setDomicilio(e.target.value)}
                placeholder="Dirección..."
                className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          {/* COLUMN 2 */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">Edad</label>
                <input
                  type="number"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Ej. 30"
                  className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">Sexo</label>
                <select
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                >
                  <option value="Masculino" className="bg-white dark:bg-dark-surface text-primary-dark dark:text-white">Masculino</option>
                  <option value="Femenino" className="bg-white dark:bg-dark-surface text-primary-dark dark:text-white">Femenino</option>
                  <option value="Otro" className="bg-white dark:bg-dark-surface text-primary-dark dark:text-white">Otro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">Celular</label>
              <input
                type="text"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                placeholder="76543210"
                className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small font-mono placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">Ocupación</label>
                <input
                  type="text"
                  value={ocupacion}
                  onChange={(e) => setOcupacion(e.target.value)}
                  placeholder="Ej. Docente..."
                  className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 rounded bg-white dark:bg-dark-bg hover:bg-slate-50 dark:hover:bg-dark-surface text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-small font-semibold cursor-pointer transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-1.5 rounded bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-semibold disabled:opacity-50 cursor-pointer transition-all flex items-center gap-2"
          >
            <UserPlus size={14} />
            <span>{isSubmitting ? 'Registrando...' : 'Registrar Paciente'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
