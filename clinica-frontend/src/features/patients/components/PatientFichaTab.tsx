import React, { useState, useEffect } from 'react';
import { User, Phone, AlertCircle, CheckCircle, Building2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/Button';
import type { Paciente, PacienteFormData } from '../types/patient';
import type { Sucursal } from '../../sucursales/types/sucursal';
import { getSucursalesApi } from '../../sucursales/services/sucursalService';

interface PatientFichaTabProps {
  patient: Paciente;
  onSave: (data: PacienteFormData) => Promise<void>;
}

export const PatientFichaTab: React.FC<PatientFichaTabProps> = ({ patient, onSave }) => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [formData, setFormData] = useState<PacienteFormData>({
    codigo_paciente: patient.codigo_paciente,
    sucursal_id: patient.sucursal_id || 1,
    nombre: patient.nombre,
    apellido: patient.apellido,
    edad: patient.edad,
    sexo: patient.sexo,
    ocupacion: patient.ocupacion || '',
    estado_civil: patient.estado_civil || '',
    celular: patient.celular || '',
    domicilio_actual: patient.domicilio_actual || '',
    fecha_nacimiento: patient.fecha_nacimiento ? String(patient.fecha_nacimiento).split('T')[0] : '',
    telefono_emergencia: patient.telefono_emergencia || '',
    nombre_contacto_emergencia: patient.nombre_contacto_emergencia || '',
    apellido_contacto_emergencia: patient.apellido_contacto_emergencia || '',
    parentesco_contacto_emergencia: patient.parentesco_contacto_emergencia || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    getSucursalesApi()
      .then((list) => setSucursales(list))
      .catch((err) => console.error('Error al cargar sucursales:', err));
  }, []);

  useEffect(() => {
    setFormData({
      codigo_paciente: patient.codigo_paciente,
      sucursal_id: patient.sucursal_id || 1,
      nombre: patient.nombre,
      apellido: patient.apellido,
      edad: patient.edad,
      sexo: patient.sexo,
      ocupacion: patient.ocupacion || '',
      estado_civil: patient.estado_civil || '',
      celular: patient.celular || '',
      domicilio_actual: patient.domicilio_actual || '',
      fecha_nacimiento: patient.fecha_nacimiento ? String(patient.fecha_nacimiento).split('T')[0] : '',
      telefono_emergencia: patient.telefono_emergencia || '',
      nombre_contacto_emergencia: patient.nombre_contacto_emergencia || '',
      apellido_contacto_emergencia: patient.apellido_contacto_emergencia || '',
      parentesco_contacto_emergencia: patient.parentesco_contacto_emergencia || '',
    });
    setSuccessMsg(null);
    setErrorMsg(null);
  }, [patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'edad' || name === 'sucursal_id' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await onSave(formData);
      const msg = `¡Ficha de ${formData.nombre} ${formData.apellido} actualizada correctamente!`;
      setSuccessMsg(msg);
      toast.success(msg, {
        description: 'Se guardaron los datos personales y la sucursal asignada.',
      });
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || 'Error al guardar los cambios.';
      setErrorMsg(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <AlertCircle size={16} className="text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* SECCIÓN 1: DATOS PERSONALES */}
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm p-4 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary-dark dark:text-slate-300 flex items-center gap-2">
            <User className="text-primary dark:text-secondary" size={14} />
            <span>Datos Filiatorios & Personales</span>
          </h3>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-1.5 rounded bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-semibold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
          >
            <Save size={13} />
            <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Código de Paciente <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="codigo_paciente"
              value={formData.codigo_paciente}
              onChange={handleChange}
              required
              className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small font-mono font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Building2 size={11} className="text-primary dark:text-secondary" />
              Sucursal Registro <span className="text-rose-500">*</span>
            </label>
            <select
              name="sucursal_id"
              value={formData.sucursal_id}
              onChange={handleChange}
              required
              className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {sucursales.map((suc) => (
                <option key={suc.id} value={suc.id} className="bg-white dark:bg-dark-surface text-primary-dark dark:text-white">
                  {suc.nombre} ({suc.codigo_sucursal})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nombres <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Apellidos <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Edad <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Sexo <span className="text-rose-500">*</span>
            </label>
            <select
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              required
              className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Fecha de Nacimiento <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              required
              className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Celular de Contacto
            </label>
            <input
              type="text"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              placeholder="Ej. 76543210"
              className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
            />
          </div>

          <div>
            <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ocupación / Profesión
            </label>
            <input
              type="text"
              name="ocupacion"
              value={formData.ocupacion}
              onChange={handleChange}
              placeholder="Ej. Ingeniero, Estudiante..."
              className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Estado Civil
            </label>
            <input
              type="text"
              name="estado_civil"
              value={formData.estado_civil}
              onChange={handleChange}
              placeholder="Ej. Soltero(a), Casado(a)..."
              className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Domicilio Actual
            </label>
            <input
              type="text"
              name="domicilio_actual"
              value={formData.domicilio_actual}
              onChange={handleChange}
              placeholder="Dirección de residencia habitual..."
              className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: CONTACTO DE EMERGENCIA */}
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm p-4 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-primary-dark dark:text-slate-300 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 uppercase tracking-wider">
          <Phone className="text-primary dark:text-secondary" size={14} />
          <span>Contacto de Emergencia</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nombre del Contacto
            </label>
            <input
              type="text"
              name="nombre_contacto_emergencia"
              value={formData.nombre_contacto_emergencia}
              onChange={handleChange}
              placeholder="Ej. María"
              className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Apellido del Contacto
            </label>
            <input
              type="text"
              name="apellido_contacto_emergencia"
              value={formData.apellido_contacto_emergencia}
              onChange={handleChange}
              placeholder="Ej. Pérez"
              className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Parentesco
            </label>
            <input
              type="text"
              name="parentesco_contacto_emergencia"
              value={formData.parentesco_contacto_emergencia}
              onChange={handleChange}
              placeholder="Ej. Madre, Esposo(a), Hermano..."
              className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Teléfono de Emergencia
            </label>
            <input
              type="text"
              name="telefono_emergencia"
              value={formData.telefono_emergencia}
              onChange={handleChange}
              placeholder="Ej. 71234567"
              className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
