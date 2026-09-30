import React, { useState, useEffect } from 'react';
import { X, UserPlus, Building2 } from 'lucide-react';
import type { PacienteFormData } from '../types/patient';
import type { Sucursal } from '../../sucursales/types/sucursal';
import { getSucursalesApi } from '../../sucursales/services/sucursalService';

interface PatientCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PacienteFormData) => Promise<void>;
}

export const PatientCreateModal: React.FC<PatientCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
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
    if (isOpen) {
      setCodigoPaciente(`PAC-${Math.floor(100 + Math.random() * 900)}`);
      setNombre('');
      setApellido('');
      setEdad('');
      setSexo('Masculino');
      setCelular('');
      setFechaNacimiento('');
      setDomicilio('');
      setOcupacion('');
      setError(null);
      setIsSubmitting(false);

      getSucursalesApi()
        .then((list) => {
          setSucursales(list);
          if (list.length > 0) {
            setSucursalId(list[0].id);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al registrar el paciente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 rounded-2xl shadow-2xl shadow-[#001C3D]/80 w-full max-w-lg overflow-hidden text-[#0840A8] dark:text-white flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-between bg-gradient-to-r from-[#0840A8] to-[#0077D4]">
          <h3 className="text-base font-bold flex items-center gap-2 text-[#0840A8] dark:text-white">
            <UserPlus className="text-[#0077D4] dark:text-[#00C2E0]" size={18} />
            <span>Registrar Nuevo Paciente</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#0077D4] dark:text-blue-100/80 hover:text-[#0840A8] dark:text-white hover:bg-white/10 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
                Código de Paciente <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={codigoPaciente}
                onChange={(e) => setCodigoPaciente(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-mono font-bold focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1 flex items-center gap-1">
                <Building2 size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
                Sucursal Registro <span className="text-rose-400">*</span>
              </label>
              <select
                value={sucursalId}
                onChange={(e) => setSucursalId(Number(e.target.value))}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
              >
                {sucursales.map((suc) => (
                  <option key={suc.id} value={suc.id} className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">
                    {suc.nombre} ({suc.codigo_sucursal})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
                Nombres <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Ej. Juan"
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
                Apellidos <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
                placeholder="Ej. Pérez"
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">Edad</label>
              <input
                type="number"
                value={edad}
                onChange={(e) => setEdad(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ej. 30"
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">Sexo</label>
              <select
                value={sexo}
                onChange={(e) => setSexo(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
              >
                <option value="Masculino" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">Masculino</option>
                <option value="Femenino" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">Femenino</option>
                <option value="Otro" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">Celular</label>
              <input
                type="text"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                placeholder="76543210"
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-mono placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">Ocupación</label>
              <input
                type="text"
                value={ocupacion}
                onChange={(e) => setOcupacion(e.target.value)}
                placeholder="Ej. Docente..."
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
              Domicilio Actual
            </label>
            <input
              type="text"
              value={domicilio}
              onChange={(e) => setDomicilio(e.target.value)}
              placeholder="Dirección..."
              className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
            />
          </div>

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
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#0840A8] hover:to-[#0077D4] text-white text-xs font-bold shadow-md shadow-[#0077D4]/30 disabled:opacity-50 cursor-pointer transition-all"
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
