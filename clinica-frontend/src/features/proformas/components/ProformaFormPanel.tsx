import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  DollarSign,
  User,
  Building2,
  Stethoscope,
  Calendar,
  AlertCircle,
  Sparkles,
  Search,
  CheckCircle2,
} from 'lucide-react';
import type { ProformaFormData, DetalleProformaItemForm } from '../types/proforma';
import type { Servicio } from '../../services/types/servicio';
import type { Sucursal } from '../../sucursales/types/sucursal';
import type { Doctor } from '../../doctors/types/doctor';
import type { Paciente } from '../../patients/types/patient';
import { getServiciosApi } from '../../services/services/servicioService';
import { getSucursalesApi } from '../../sucursales/services/sucursalService';
import { getDoctoresApi } from '../../doctors/services/doctorService';
import { getPacientesApi } from '../../patients/services/patientService';
import { useAuthStore } from '../../auth/store/authStore';

interface ProformaFormPanelProps {
  onCancel: () => void;
  onSubmit: (data: ProformaFormData) => Promise<void>;
}

const inputClass =
  'w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-dark-bg';
const labelClass =
  'block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1';
const panelClass =
  'bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden';
const panelHeaderClass =
  'px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between gap-2 text-small font-bold uppercase tracking-wider text-primary-dark dark:text-white';

export const ProformaFormPanel: React.FC<ProformaFormPanelProps> = ({
  onCancel,
  onSubmit,
}) => {
  const { user } = useAuthStore();

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  // Form State
  const [esPacienteRegistrado, setEsPacienteRegistrado] = useState<boolean>(false);
  const [selectedPacienteId, setSelectedPacienteId] = useState<number | ''>('');

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState<number | ''>('');
  const [sexo, setSexo] = useState<'M' | 'F' | 'Otro'>('M');
  const [celular, setCelular] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [domicilioActual, setDomicilioActual] = useState('');

  const [sucursalId, setSucursalId] = useState<number | ''>('');
  const [doctorId, setDoctorId] = useState<number | ''>('');
  const [fechaEmision, setFechaEmision] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [diasValidez, setDiasValidez] = useState<number>(15);
  const [observaciones, setObservaciones] = useState('');

  // Items State
  const [detalles, setDetalles] = useState<DetalleProformaItemForm[]>([]);
  const [tempServicioId, setTempServicioId] = useState<number | ''>('');
  const [tempPrecio, setTempPrecio] = useState<number | ''>('');
  const [tempDescuento, setTempDescuento] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getServiciosApi(),
      getSucursalesApi(),
      getDoctoresApi(),
      getPacientesApi(),
    ])
      .then(([srvList, sucList, docList, pacList]) => {
        setServicios(srvList.filter((s) => s.estado !== false));
        setSucursales(sucList.filter((s) => s.estado !== false));
        setDoctores(docList);
        setPacientes(pacList);

        if (sucList.length > 0) {
          const userSucursal = user?.sucursal_id
            ? sucList.find((s) => s.id === user.sucursal_id)
            : sucList[0];
          setSucursalId(userSucursal ? userSucursal.id : sucList[0].id);
        }

        // Si el usuario logueado es Doctor, preseleccionarlo
        if (user && user.rol && user.rol.nombre === 'Doctor') {
          const doctorUser = docList.find((d) => d.usuario_id === user.id);
          if (doctorUser) setDoctorId(doctorUser.id);
        }
      })
      .catch(() => {
        setError('Error al cargar datos necesarios para la cotización.');
      });
  }, [user]);

  // Manejo de autocompletado si se selecciona paciente existente
  const handleSelectPaciente = (pacId: number | '') => {
    setSelectedPacienteId(pacId);
    if (!pacId) {
      setNombre('');
      setApellido('');
      setEdad('');
      setSexo('M');
      setCelular('');
      setFechaNacimiento('');
      setDomicilioActual('');
      return;
    }

    const pac = pacientes.find((p) => p.id === Number(pacId));
    if (pac) {
      setNombre(pac.nombre);
      setApellido(pac.apellido);
      setEdad(pac.edad);
      setSexo(pac.sexo === 'F' ? 'F' : pac.sexo === 'Otro' ? 'Otro' : 'M');
      setCelular(pac.celular || '');
      setFechaNacimiento(pac.fecha_nacimiento ? String(pac.fecha_nacimiento).split('T')[0] : '');
      setDomicilioActual(pac.domicilio_actual || '');
    }
  };

  // Manejo de cambio en selector de servicio temporal
  const handleSelectServicio = (srvId: number | '') => {
    setTempServicioId(srvId);
    if (!srvId) {
      setTempPrecio('');
      return;
    }
    const srv = servicios.find((s) => s.id === Number(srvId));
    if (srv) {
      setTempPrecio(Number(srv.precio_base || 0));
    }
  };

  const handleAddDetalle = () => {
    if (!tempServicioId) return;
    const srv = servicios.find((s) => s.id === Number(tempServicioId));
    if (!srv) return;

    const precio = tempPrecio !== '' ? Number(tempPrecio) : Number(srv.precio_base || 0);
    const descuento = Number(tempDescuento) || 0;

    const newItem: DetalleProformaItemForm = {
      servicio_id: srv.id,
      nombre_servicio: srv.nombre,
      precio: Math.max(0, precio),
      descuento: Math.max(0, descuento),
    };

    setDetalles((prev) => [...prev, newItem]);
    setTempServicioId('');
    setTempPrecio('');
    setTempDescuento(0);
  };

  const handleRemoveDetalle = (index: number) => {
    setDetalles((prev) => prev.filter((_, i) => i !== index));
  };

  // Cálculos de totales
  const totalCotizado = useMemo(() => {
    return detalles.reduce((acc, item) => {
      return acc + Math.max(0, item.precio - item.descuento);
    }, 0);
  }, [detalles]);

  const totalBruto = useMemo(() => {
    return detalles.reduce((acc, item) => acc + item.precio, 0);
  }, [detalles]);

  const totalDescuentos = useMemo(() => {
    return detalles.reduce((acc, item) => acc + item.descuento, 0);
  }, [detalles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sucursalId) {
      setError('Por favor selecciona una sucursal.');
      return;
    }
    if (!nombre.trim() || !apellido.trim()) {
      setError('Por favor ingresa nombre y apellido del cliente.');
      return;
    }
    if (!celular.trim()) {
      setError('Por favor ingresa un celular o teléfono de contacto.');
      return;
    }
    if (edad === '' || Number(edad) < 0) {
      setError('Por favor ingresa una edad válida.');
      return;
    }
    if (detalles.length === 0) {
      setError('Debes agregar al menos un tratamiento odontológico a la cotización.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: ProformaFormData = {
        sucursal_id: Number(sucursalId),
        paciente_id: esPacienteRegistrado && selectedPacienteId ? Number(selectedPacienteId) : null,
        doctor_id: doctorId ? Number(doctorId) : null,
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        edad: Number(edad),
        sexo,
        celular: celular.trim(),
        fecha_nacimiento: fechaNacimiento || undefined,
        domicilio_actual: domicilioActual.trim() || undefined,
        fecha_emision: fechaEmision,
        dias_validez: Number(diasValidez) || 15,
        observaciones: observaciones.trim() || undefined,
        detalles,
      };

      await onSubmit(payload);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al emitir el presupuesto.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full lg:w-4/5 xl:w-3/4 mx-auto pb-12 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-sm text-rose-700 dark:text-rose-400 text-small font-bold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. DATOS DEL CLIENTE / PACIENTE */}
        <div className={panelClass}>
          <div className={panelHeaderClass}>
            <div className="flex items-center gap-2">
              <User size={15} className="text-primary" />
              <span>1. Identificación del Cliente / Paciente</span>
            </div>
            {/* TOGGLE PACIENTE REGISTRADO */}
            <div className="flex items-center gap-2 text-tiny font-bold">
              <span className="text-slate-500">¿Ya es paciente de la clínica?</span>
              <button
                type="button"
                onClick={() => {
                  setEsPacienteRegistrado(!esPacienteRegistrado);
                  handleSelectPaciente('');
                }}
                className={`px-2 py-0.5 rounded text-tiny font-bold uppercase transition-colors cursor-pointer border ${
                  esPacienteRegistrado
                    ? 'bg-primary text-white border-primary'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}
              >
                {esPacienteRegistrado ? 'SÍ, REGISTRADO' : 'NO, PROSPECTO'}
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {esPacienteRegistrado && (
              <div className="p-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 rounded-sm">
                <label className={labelClass}>Seleccionar Paciente Existente</label>
                <select
                  value={selectedPacienteId}
                  onChange={(e) => handleSelectPaciente(e.target.value ? Number(e.target.value) : '')}
                  className={inputClass}
                >
                  <option value="">Buscar paciente por nombre o código...</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.codigo_paciente} — {p.nombre} {p.apellido} (Cel: {p.celular})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>
                  Nombre(s) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Juan Carlos"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Apellido(s) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Ej. Pérez Quispe"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Celular / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  placeholder="Ej. 78912345"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Edad (Años) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ej. 28"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Sexo</label>
                <select
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value as any)}
                  className={inputClass}
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2 md:col-span-3">
                <label className={labelClass}>Domicilio Actual</label>
                <input
                  type="text"
                  value={domicilioActual}
                  onChange={(e) => setDomicilioActual(e.target.value)}
                  placeholder="Dirección, zona o ciudad..."
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. PARAMETROS DE EMISIÓN */}
        <div className={panelClass}>
          <div className={panelHeaderClass}>
            <div className="flex items-center gap-2">
              <Building2 size={15} className="text-primary" />
              <span>2. Parámetros de Sede & Emisión</span>
            </div>
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className={labelClass}>
                Sucursal <span className="text-rose-500">*</span>
              </label>
              <select
                value={sucursalId}
                onChange={(e) => setSucursalId(Number(e.target.value))}
                className={inputClass}
                disabled={user?.rol?.nombre !== 'Administrador'}
                required
              >
                {sucursales.map((suc) => (
                  <option key={suc.id} value={suc.id}>
                    {suc.nombre}
                  </option>
                ))}
              </select>
              {user?.rol?.nombre !== 'Administrador' && (
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Sede asignada a su turno clínico
                </span>
              )}
            </div>

            <div>
              <label className={labelClass}>Especialista / Doctor</label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value ? Number(e.target.value) : '')}
                className={inputClass}
                disabled={user?.rol?.nombre === 'Doctor'}
              >
                <option value="">Seleccione doctor emisor...</option>
                {doctores.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    Dr. {doc.nombre} {doc.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Fecha de Emisión</label>
              <input
                type="date"
                value={fechaEmision}
                onChange={(e) => setFechaEmision(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Días de Validez</label>
              <input
                type="number"
                min="1"
                max="90"
                value={diasValidez}
                onChange={(e) => setDiasValidez(Number(e.target.value))}
                className={inputClass}
                required
              />
            </div>
          </div>
        </div>

        {/* 3. TRATAMIENTOS COTIZADOS */}
        <div className={panelClass}>
          <div className={panelHeaderClass}>
            <div className="flex items-center gap-2">
              <Stethoscope size={15} className="text-primary" />
              <span>3. Tratamientos y Servicios Odontológicos</span>
            </div>
            <span className="text-tiny font-mono text-slate-500">
              {detalles.length} servicios agregados
            </span>
          </div>

          <div className="p-4 space-y-4">
            {/* AGREGADOR DE SERVICIOS */}
            <div className="p-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 rounded-sm grid grid-cols-1 md:grid-cols-12 gap-2.5 items-end">
              <div className="md:col-span-6">
                <label className={labelClass}>Seleccionar Tratamiento</label>
                <select
                  value={tempServicioId}
                  onChange={(e) => handleSelectServicio(e.target.value ? Number(e.target.value) : '')}
                  className={inputClass}
                >
                  <option value="">Seleccione un servicio del catálogo...</option>
                  {servicios.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.nombre} (Ref: Bs. {Number(srv.precio_base).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Precio (Bs.)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={tempPrecio}
                  onChange={(e) => setTempPrecio(e.target.value ? Number(e.target.value) : '')}
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Desc. (Bs.)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={tempDescuento}
                  onChange={(e) => setTempDescuento(Number(e.target.value))}
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={handleAddDetalle}
                  disabled={!tempServicioId}
                  className="w-full py-1.5 px-3 rounded-sm bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <Plus size={14} />
                  <span>Añadir</span>
                </button>
              </div>
            </div>

            {/* TABLA DE DETALLES */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-sm overflow-hidden">
              <table className="w-full text-left text-small">
                <thead className="bg-slate-100 dark:bg-dark-bg text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold uppercase text-tiny">
                  <tr>
                    <th className="px-3 py-2 w-10">#</th>
                    <th className="px-3 py-2">Tratamiento</th>
                    <th className="px-3 py-2 text-right w-28">Precio Base</th>
                    <th className="px-3 py-2 text-right w-24">Descuento</th>
                    <th className="px-3 py-2 text-right w-28">Subtotal</th>
                    <th className="px-3 py-2 text-center w-12">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {detalles.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-slate-400 font-medium italic text-small"
                      >
                        No has añadido ningún servicio a la cotización aún.
                      </td>
                    </tr>
                  ) : (
                    detalles.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-3 py-2 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="px-3 py-2 font-bold text-slate-800 dark:text-slate-200">
                          {item.nombre_servicio}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-slate-600 dark:text-slate-300">
                          Bs. {item.precio.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-rose-600 dark:text-rose-400">
                          {item.descuento > 0 ? `-Bs. ${item.descuento.toFixed(2)}` : '0.00'}
                        </td>
                        <td className="px-3 py-2 text-right font-mono font-bold text-primary dark:text-secondary">
                          Bs. {Math.max(0, item.precio - item.descuento).toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveDetalle(idx)}
                            className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* TOTALES RESUMEN */}
            {detalles.length > 0 && (
              <div className="flex justify-end">
                <div className="w-full sm:w-72 bg-slate-50 dark:bg-dark-bg p-3 rounded-sm border border-slate-200 dark:border-slate-800 space-y-1.5 text-small">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal Bruto:</span>
                    <span className="font-mono">Bs. {totalBruto.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-rose-600 dark:text-rose-400">
                    <span>Total Descuentos:</span>
                    <span className="font-mono">-Bs. {totalDescuentos.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-sm text-[#0840A8] dark:text-secondary">
                    <span>Total Presupuesto:</span>
                    <span className="font-mono">Bs. {totalCotizado.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. OBSERVACIONES Y NOTAS */}
        <div className={panelClass}>
          <div className={panelHeaderClass}>
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-primary" />
              <span>4. Observaciones o Plan Clínico Propuesto</span>
            </div>
          </div>
          <div className="p-4">
            <textarea
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Ej. Plan estimado para colocación de brackets autoligados en arcada superior e inferior. Incluye profilaxis inicial..."
              className={inputClass}
            />
          </div>
        </div>

        {/* BOTONES ACCIÓN FOOTER */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-small cursor-pointer transition-colors shadow-sm"
          >
            Cancelar y Volver
          </button>

          <button
            type="submit"
            disabled={isSubmitting || detalles.length === 0}
            className="px-6 py-2 rounded-sm bg-[#0077D4] hover:bg-[#0840A8] text-white font-bold text-small transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Sparkles size={16} className="animate-spin" />
                <span>Guardando Proforma...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>Guardar Proforma (Borrador)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
