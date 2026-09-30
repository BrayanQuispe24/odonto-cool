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
      <div className="bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#0840A8]/15 dark:border-[#00C2E0]/20 pb-3">
          <h3 className="text-sm font-bold text-[#0840A8] dark:text-white flex items-center gap-2">
            <User className="text-[#0077D4] dark:text-[#00C2E0]" size={16} />
            <span>Datos Filiatorios & Personales</span>
          </h3>

          <Button
            type="submit"
            variant="teal"
            disabled={isSubmitting}
            className="text-xs px-3.5 py-1.5 font-bold shadow-md shadow-[#0077D4]/30 cursor-pointer flex items-center gap-1.5"
          >
            <Save size={14} />
            <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-teal-100 mb-1">
              Código de Paciente <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="codigo_paciente"
              value={formData.codigo_paciente}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#051E24] border border-ocean-deep/20 dark:border-teal-500/40 text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-teal-main/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-teal-100 mb-1 flex items-center gap-1">
              <Building2 size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
              Sucursal Registro <span className="text-rose-400">*</span>
            </label>
            <select
              name="sucursal_id"
              value={formData.sucursal_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#051E24] border border-ocean-deep/20 dark:border-teal-500/40 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-main/50 cursor-pointer"
            >
              {sucursales.map((suc) => (
                <option key={suc.id} value={suc.id} className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">
                  {suc.nombre} ({suc.codigo_sucursal})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-teal-100 mb-1">
              Nombres <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#051E24] border border-ocean-deep/20 dark:border-teal-500/40 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-main/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-teal-100 mb-1">
              Apellidos <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#051E24] border border-ocean-deep/20 dark:border-teal-500/40 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-main/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-teal-100 mb-1">
              Edad <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#051E24] border border-ocean-deep/20 dark:border-teal-500/40 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-main/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-teal-100 mb-1">
              Sexo <span className="text-rose-400">*</span>
            </label>
            <select
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#051E24] border border-ocean-deep/20 dark:border-teal-500/40 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-main/50"
            >
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-teal-100 mb-1">
              Fecha de Nacimiento <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#051E24] border border-ocean-deep/20 dark:border-teal-500/40 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-main/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-teal-100 mb-1">
              Celular de Contacto
            </label>
            <input
              type="text"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              placeholder="Ej. 76543210"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#051E24] border border-ocean-deep/20 dark:border-teal-500/40 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-main/50 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-teal-100 mb-1">
              Ocupación / Profesión
            </label>
            <input
              type="text"
              name="ocupacion"
              value={formData.ocupacion}
              onChange={handleChange}
              placeholder="Ej. Ingeniero, Estudiante..."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#051E24] border border-ocean-deep/20 dark:border-teal-500/40 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-main/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-teal-100 mb-1">
              Estado Civil
            </label>
            <input
              type="text"
              name="estado_civil"
              value={formData.estado_civil}
              onChange={handleChange}
              placeholder="Ej. Soltero(a), Casado(a)..."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#051E24] border border-ocean-deep/20 dark:border-teal-500/40 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-main/50"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-teal-100 mb-1">
              Domicilio Actual
            </label>
            <input
              type="text"
              name="domicilio_actual"
              value={formData.domicilio_actual}
              onChange={handleChange}
              placeholder="Dirección de residencia habitual..."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#051E24] border border-ocean-deep/20 dark:border-teal-500/40 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-main/50"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: CONTACTO DE EMERGENCIA */}
      <div className="bg-white dark:bg-[#072B33] border border-ocean-deep/10 dark:border-teal-500/20 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-ocean-deep/10 dark:border-teal-500/20 pb-3">
          <Phone className="text-teal-400" size={16} />
          <span>Contacto de Emergencia</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-teal-100 mb-1">
              Nombre del Contacto
            </label>
            <input
              type="text"
              name="nombre_contacto_emergencia"
              value={formData.nombre_contacto_emergencia}
              onChange={handleChange}
              placeholder="Ej. María"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#051E24] border border-ocean-deep/20 dark:border-teal-500/40 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-main/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-teal-100 mb-1">
              Apellido del Contacto
            </label>
            <input
              type="text"
              name="apellido_contacto_emergencia"
              value={formData.apellido_contacto_emergencia}
              onChange={handleChange}
              placeholder="Ej. Pérez"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#051E24] border border-ocean-deep/20 dark:border-teal-500/40 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-main/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-teal-100 mb-1">
              Parentesco
            </label>
            <input
              type="text"
              name="parentesco_contacto_emergencia"
              value={formData.parentesco_contacto_emergencia}
              onChange={handleChange}
              placeholder="Ej. Madre, Esposo(a), Hermano..."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#051E24] border border-ocean-deep/20 dark:border-teal-500/40 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-main/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-teal-100 mb-1">
              Teléfono de Emergencia
            </label>
            <input
              type="text"
              name="telefono_emergencia"
              value={formData.telefono_emergencia}
              onChange={handleChange}
              placeholder="Ej. 71234567"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#051E24] border border-ocean-deep/20 dark:border-teal-500/40 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-main/50 font-mono"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
