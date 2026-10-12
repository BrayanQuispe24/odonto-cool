import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Receipt,
  Plus,
  Trash2,
  DollarSign,
  User,
  Stethoscope,
  Building2,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  FlaskConical,
  ListChecks,
} from 'lucide-react';
import type { Cita } from '../../citas/types/cita';
import type { Servicio } from '../../services/types/servicio';
import type { Diente } from '../../dientes/types/diente';
import type { BoletaFormData, DetalleServicioItem, BoletaEstado } from '../types/boleta';
import { getServiciosApi } from '../../services/services/servicioService';
import { getDientesApi } from '../../dientes/services/dienteService';
import { getCitasApi } from '../../citas/services/citaService';
import { getPacientesApi } from '../../patients/services/patientService';
import { getDoctoresApi } from '../../doctors/services/doctorService';
import type { Paciente } from '../../patients/types/patient';
import type { Doctor } from '../../doctors/types/doctor';
import { useAuthStore } from '../../auth/store/authStore';

interface BoletaCreateModalProps {
  isOpen?: boolean;
  isModal?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onSubmit: (data: BoletaFormData) => Promise<void>;
  preselectedCita?: Cita | null;
}

/* ---------- Enterprise design tokens ---------- */
const inputClass =
  'w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-dark-bg';
const labelClass =
  'block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1';
const panelClass =
  'bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden';
const panelHeaderClass =
  'px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between gap-2 text-small font-bold uppercase tracking-wider text-primary-dark dark:text-white';

export const BoletaCreateModal: React.FC<BoletaCreateModalProps> = ({
  isOpen = false,
  isModal = true,
  onClose,
  onCancel,
  onSubmit,
  preselectedCita,
}) => {
  const { user } = useAuthStore();

  const [citas, setCitas] = useState<Cita[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [dientes, setDientes] = useState<Diente[]>([]);

  const [selectedCitaId, setSelectedCitaId] = useState<number | ''>('');
  const [selectedPacienteId, setSelectedPacienteId] = useState<number | ''>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | ''>('');

  const [hasCita, setHasCita] = useState<boolean>(true);

  const [tipoPaga, setTipoPaga] = useState<string>('Contado');
  const [metodoPago, setMetodoPago] = useState<string>('Efectivo');
  const [cantidadCuotas, setCantidadCuotas] = useState<number>(1);
  const [estado, setEstado] = useState<BoletaEstado>('pagada');

  // Line items
  const [detallesItems, setDetallesItems] = useState<DetalleServicioItem[]>([]);

  // Temp line item form state
  const [selectedServicioId, setSelectedServicioId] = useState<number | ''>('');
  const [customPrecio, setCustomPrecio] = useState<number | ''>('');
  const [itemDescripcion, setItemDescripcion] = useState('');
  const [itemDescuento, setItemDescuento] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isActive = isOpen || !isModal;

  useEffect(() => {
    if (!isActive) {
      setError(null);
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      Promise.all([
        getCitasApi(),
        getServiciosApi(),
        getDientesApi(),
        getPacientesApi(),
        getDoctoresApi(),
      ])
        .then(([cList, sList, dList, pList, docList]) => {
          setCitas(cList);
          setServicios(sList);
          setDientes(dList);
          setPacientes(pList);
          setDoctores(docList);

          if (preselectedCita) {
            setSelectedCitaId(preselectedCita.id);
          }
        })
        .catch(() => { });
    }
  }, [isActive, preselectedCita]);

  const activeCita = useMemo(() => {
    if (preselectedCita && preselectedCita.id === Number(selectedCitaId)) {
      return preselectedCita;
    }
    return citas.find((c) => c.id === Number(selectedCitaId)) || null;
  }, [citas, selectedCitaId, preselectedCita]);

  // Calculate totals
  const subtotal = useMemo(() => {
    return detallesItems.reduce((sum, item) => sum + (item.precio_unitario || 0), 0);
  }, [detallesItems]);

  const totalDescuentos = useMemo(() => {
    return detallesItems.reduce((sum, item) => sum + (Number(item.descuento) || 0), 0);
  }, [detallesItems]);

  const montoTotal = useMemo(() => {
    return Math.max(0, subtotal - totalDescuentos);
  }, [subtotal, totalDescuentos]);

  const handleAddItem = () => {
    if (!selectedServicioId || customPrecio === '') {
      setError('Selecciona un servicio y establece su precio para agregarlo.');
      return;
    }

    const serv = servicios.find((s) => s.id === Number(selectedServicioId));
    if (!serv) return;

    const newItem: DetalleServicioItem = {
      servicio_id: serv.id,
      diente_id: null,
      descripcion: itemDescripcion.trim() || serv.nombre,
      descuento: Math.max(0, Number(itemDescuento) || 0),
      precio_unitario: Number(customPrecio) || 0,
    };

    setDetallesItems((prev) => [...prev, newItem]);
    setSelectedServicioId('');
    setCustomPrecio('');
    setItemDescripcion('');
    setItemDescuento(0);
    setError(null);
  };

  const handleRemoveItem = (index: number) => {
    setDetallesItems((prev) => prev.filter((_, i) => i !== index));
  };

  const [costoLaboratorio, setCostoLaboratorio] = useState<number>(0);
  const [porcentajeComisionDr, setPorcentajeComisionDr] = useState<number>(40);

  const [montoCuenta1, setMontoCuenta1] = useState<number>(0);
  const [metodoPagoCuenta1, setMetodoPagoCuenta1] = useState<string>('QR');

  const montoComisionDr = useMemo(() => {
    const base = Math.max(0, montoTotal - (Number(costoLaboratorio) || 0));
    return (base * (Number(porcentajeComisionDr) || 0)) / 100;
  }, [montoTotal, costoLaboratorio, porcentajeComisionDr]);

  const baseComision = Math.max(0, montoTotal - (Number(costoLaboratorio) || 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasCita && !selectedCitaId) {
      setError('Debes seleccionar una cita médica.');
      return;
    }

    if (!hasCita && (!selectedPacienteId || !selectedDoctorId)) {
      setError('Debes seleccionar un Paciente y un Doctor.');
      return;
    }

    if (detallesItems.length === 0) {
      setError('Debes agregar al menos un servicio prestado a la boleta.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const emitidoPor = user ? user.name || user.email : 'Sistema ODONTO COOL';

      let doctorId = activeCita?.doctor_id || null;
      let pacienteId = activeCita?.paciente_id || null;

      if (!hasCita || !selectedCitaId) {
        doctorId = selectedDoctorId ? Number(selectedDoctorId) : null;
        pacienteId = selectedPacienteId ? Number(selectedPacienteId) : null;
      }

      const isContado = tipoPaga === 'Contado';

      const cuotasList = [];
      if (!isContado && montoCuenta1 > 0) {
        cuotasList.push({
          numero_cuota: 1,
          fecha_pago: new Date().toISOString().split('T')[0],
          modo_pago: 'Cuota 1 / Primer Abono',
          monto_cuota: Number(montoCuenta1),
          metodo_pago: metodoPagoCuenta1,
          estado: 'pagado' as const,
        });
      }

      await onSubmit({
        cita_id: hasCita && selectedCitaId ? Number(selectedCitaId) : null,
        paciente_id: pacienteId,
        doctor_id: doctorId,
        fecha_emision: new Date().toISOString().split('T')[0],
        emitido_por: emitidoPor,
        monto_total: montoTotal,
        tipo_pago: tipoPaga,
        tipo_paga: tipoPaga,
        cantidad_cuotas: isContado ? 1 : Math.max(1, cantidadCuotas),
        metodo_pago: metodoPago,
        porcentaje_comision_dr: Number(porcentajeComisionDr) || 40,
        costo_laboratorio: Number(costoLaboratorio) || 0,
        monto_comision_dr: montoComisionDr,
        estado: isContado ? 'completado' : estado,
        detalles: detallesItems,
        cuotas: cuotasList.length > 0 ? cuotasList : undefined,
      });

      setDetallesItems([]);
      setCostoLaboratorio(0);
      setPorcentajeComisionDr(40);
      setMontoCuenta1(0);
      if (onClose) onClose();
      if (onCancel) onCancel();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al generar la boleta de servicios prestados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const segmentClass = (active: boolean) =>
    `flex-1 px-3 py-1 text-small font-bold uppercase tracking-wider transition-colors cursor-pointer ${active
      ? 'bg-[#0077D4] text-white'
      : 'bg-white dark:bg-dark-surface text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary'
    }`;

  const formContent = (
    <form
      onSubmit={handleSubmit}
      className={isModal ? 'p-4 overflow-y-auto flex-1 bg-slate-50/60 dark:bg-dark-bg/40 space-y-4' : 'space-y-4'}
    >
      {error && (
        <div className="p-2.5 rounded-sm bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-small font-bold flex items-center gap-2">
          <AlertTriangle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* SINGLE COLUMN FLOW */}
      <div className="space-y-4">
        {/* 1. DATOS DE ORIGEN */}
        <section className={panelClass}>
          <div className={panelHeaderClass}>
            <span className="flex items-center gap-1.5">
              <User size={13} className="text-primary dark:text-secondary" />
              1. Datos de Origen (Cita / Paciente / Doctor)
            </span>
            {!preselectedCita && (
              <div className="flex border border-slate-300 dark:border-slate-700 rounded-sm overflow-hidden normal-case">
                <button
                  type="button"
                  id="boleta-origen-con-cita"
                  onClick={() => {
                    setHasCita(true);
                    setSelectedPacienteId('');
                    setSelectedDoctorId('');
                  }}
                  className={segmentClass(hasCita)}
                >
                  Con cita
                </button>
                <button
                  type="button"
                  id="boleta-origen-sin-cita"
                  onClick={() => {
                    setHasCita(false);
                    setSelectedCitaId('');
                  }}
                  className={`${segmentClass(!hasCita)} border-l border-slate-300 dark:border-slate-700`}
                >
                  Sin cita
                </button>
              </div>
            )}
          </div>

          <div className="p-3 space-y-3">
            {hasCita && (
              <div>
                <label className={labelClass}>
                  Cita Médica de Origen <span className="text-rose-500">*</span>
                </label>
                {preselectedCita ? (
                  <div className="px-2 py-1.5 rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg text-small font-mono font-bold text-primary dark:text-secondary">
                    {preselectedCita.numero_cita}
                  </div>
                ) : (
                  <select
                    id="boleta-cita-select"
                    value={selectedCitaId}
                    onChange={(e) => setSelectedCitaId(e.target.value ? Number(e.target.value) : '')}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="">-- Seleccionar Cita Médica --</option>
                    {citas.map((c) => {
                      const pac = c.paciente
                        ? `${c.paciente.nombre} ${c.paciente.apellido}`
                        : c.nombre_paciente_unregistered || 'No especificado';
                      const doc = c.doctor ? `Dr. ${c.doctor.nombre} ${c.doctor.apellido}` : 'Sin doctor';
                      return (
                        <option key={c.id} value={c.id}>
                          {c.numero_cita} | {pac} | {doc} ({String(c.fecha).split('T')[0]})
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>
            )}

            {hasCita && activeCita && (
              <div className="grid grid-cols-1 sm:grid-cols-3 border border-slate-200 dark:border-slate-800 rounded-sm divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800 text-small">
                <div className="px-2.5 py-1.5">
                  <div className="text-micro font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <User size={10} className="text-primary" /> Paciente
                  </div>
                  <div className="font-bold text-primary-dark dark:text-white truncate">
                    {activeCita.paciente
                      ? `${activeCita.paciente.nombre} ${activeCita.paciente.apellido}`
                      : activeCita.nombre_paciente_unregistered}
                  </div>
                </div>
                <div className="px-2.5 py-1.5">
                  <div className="text-micro font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Stethoscope size={10} className="text-primary" /> Doctor
                  </div>
                  <div className="font-bold text-primary-dark dark:text-white truncate">
                    {activeCita.doctor
                      ? `Dr. ${activeCita.doctor.nombre} ${activeCita.doctor.apellido}`
                      : 'Sin doctor'}
                  </div>
                </div>
                <div className="px-2.5 py-1.5">
                  <div className="text-micro font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Building2 size={10} className="text-primary" /> Sucursal
                  </div>
                  <div className="font-bold text-primary-dark dark:text-white truncate">
                    {activeCita.sucursal?.nombre || activeCita.sucursal?.ubicacion || 'Central'}
                  </div>
                </div>
              </div>
            )}

            {!hasCita && !preselectedCita && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>
                    Paciente <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="boleta-paciente-select"
                    value={selectedPacienteId}
                    onChange={(e) => setSelectedPacienteId(e.target.value ? Number(e.target.value) : '')}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="">-- Seleccionar Paciente --</option>
                    {pacientes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} {p.apellido} (HC: {p.codigo_paciente})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    Doctor Atendido <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="boleta-doctor-select"
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value ? Number(e.target.value) : '')}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="">-- Seleccionar Doctor --</option>
                    {doctores.map((d) => (
                      <option key={d.id} value={d.id}>
                        Dr. {d.nombre} {d.apellido} - {Array.isArray(d.especialidades) ? d.especialidades.join(', ') : d.especialidades || ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 2. SERVICIOS PRESTADOS */}
        <section className={panelClass}>
          <div className={panelHeaderClass}>
            <span className="flex items-center gap-1.5">
              <ListChecks size={13} className="text-primary dark:text-secondary" />
              2. Servicios Prestados ({detallesItems.length})
            </span>
          </div>

          <div className="p-3 border-b border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
            <div className="sm:col-span-5">
              <label className={labelClass}>
                Servicio Dental <span className="text-rose-500">*</span>
              </label>
              <select
                id="boleta-servicio-select"
                value={selectedServicioId}
                onChange={(e) => {
                  const servId = e.target.value ? Number(e.target.value) : '';
                  setSelectedServicioId(servId);
                  if (servId) {
                    const serv = servicios.find((s) => s.id === servId);
                    setCustomPrecio(serv ? Number(serv.precio) : '');
                  } else {
                    setCustomPrecio('');
                  }
                }}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">-- Seleccionar Servicio --</option>
                {servicios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.codigo_servicio ? `${s.codigo_servicio} · ` : ''}
                    {s.nombre} (Ref. Bs. {Number(s.precio).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>
                Precio (Bs.) <span className="text-rose-500">*</span>
              </label>
              <input
                id="boleta-precio-input"
                type="number"
                min="0"
                step="0.1"
                value={customPrecio}
                onChange={(e) => setCustomPrecio(e.target.value ? Number(e.target.value) : '')}
                className={`${inputClass} font-mono text-right`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Desc. (Bs.)</label>
              <input
                id="boleta-descuento-input"
                type="number"
                step="0.01"
                min="0"
                value={itemDescuento}
                onChange={(e) => setItemDescuento(Number(e.target.value))}
                placeholder="0.00"
                className={`${inputClass} font-mono text-right`}
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="button"
                id="boleta-add-item"
                onClick={handleAddItem}
                className="w-full px-3 py-1.5 rounded-sm bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-bold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus size={13} />
                <span>Añadir Línea</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-small whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-dark-bg text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="px-3 py-1.5 font-bold w-8">#</th>
                  <th className="px-3 py-1.5 font-bold">Servicio</th>
                  <th className="px-3 py-1.5 font-bold text-right w-28">Precio</th>
                  <th className="px-3 py-1.5 font-bold text-right w-28">Descuento</th>
                  <th className="px-3 py-1.5 font-bold text-right w-28">Subtotal</th>
                  <th className="px-3 py-1.5 font-bold text-right w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                {detallesItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 font-semibold">
                      No has agregado ningún servicio a esta boleta.
                    </td>
                  </tr>
                ) : (
                  detallesItems.map((item, idx) => {
                    const serv = servicios.find((s) => s.id === item.servicio_id);
                    const dien = dientes.find((d) => d.id === item.diente_id);
                    const lineSubtotal = Math.max(0, (item.precio_unitario || 0) - item.descuento);

                    return (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-dark-bg/50 transition-colors">
                        <td className="px-3 py-1.5 font-mono text-slate-400">{idx + 1}</td>
                        <td className="px-3 py-1.5">
                          <span className="font-bold text-primary-dark dark:text-white">
                            {serv?.nombre || item.descripcion}
                          </span>
                          {serv?.codigo_servicio && (
                            <span className="ml-1.5 font-mono text-tiny text-primary dark:text-secondary">
                              {serv.codigo_servicio}
                            </span>
                          )}
                          {dien && (
                            <span className="ml-1.5 text-tiny px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 font-mono text-slate-600 dark:text-slate-300">
                              Pieza {dien.numero_diente}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono">
                          Bs. {(item.precio_unitario || 0).toFixed(2)}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono text-amber-700 dark:text-amber-400">
                          {item.descuento > 0 ? `- ${item.descuento.toFixed(2)}` : '0.00'}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono font-bold text-primary dark:text-secondary">
                          Bs. {lineSubtotal.toFixed(2)}
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            title="Quitar línea"
                            className="p-1 rounded bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {detallesItems.length > 0 && (
                <tfoot className="bg-slate-50 dark:bg-dark-bg border-t-2 border-slate-200 dark:border-slate-700">
                  <tr>
                    <td colSpan={2} className="px-3 py-1.5 font-bold uppercase tracking-wider text-slate-500">
                      Totales
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono font-bold text-primary-dark dark:text-white">
                      Bs. {subtotal.toFixed(2)}
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono font-bold text-amber-700 dark:text-amber-400">
                      - {totalDescuentos.toFixed(2)}
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono font-bold text-primary dark:text-secondary">
                      Bs. {montoTotal.toFixed(2)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </section>

        {/* 3. LABORATORIO DENTAL Y COMISIÓN DOCTOR */}
        <section className={panelClass}>
          <div className={panelHeaderClass}>
            <span className="flex items-center gap-1.5">
              <FlaskConical size={13} className="text-primary dark:text-secondary" />
              3. Laboratorio Dental y Comisión Doctor
            </span>
          </div>
          <div className="p-3 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className={labelClass}>Costo Lab. (Bs.)</label>
              <input
                id="boleta-costo-lab"
                type="number"
                step="0.01"
                min="0"
                value={costoLaboratorio}
                onChange={(e) => setCostoLaboratorio(Number(e.target.value))}
                placeholder="0.00"
                className={`${inputClass} font-mono text-right`}
              />
            </div>
            <div>
              <label className={labelClass}>% Comisión Dr.</label>
              <input
                id="boleta-pct-comision"
                type="number"
                step="1"
                min="0"
                max="100"
                value={porcentajeComisionDr}
                onChange={(e) => setPorcentajeComisionDr(Number(e.target.value))}
                placeholder="40"
                className={`${inputClass} font-mono text-right`}
              />
            </div>
            <div>
              <label className={labelClass}>Base Comisión</label>
              <div className="px-2.5 py-1.5 rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg font-mono text-small font-semibold text-primary-dark dark:text-white text-right">
                Bs. {baseComision.toFixed(2)}
              </div>
            </div>
            <div>
              <label className={labelClass}>Monto Comisión DR</label>
              <div className="px-2.5 py-1.5 rounded-sm border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 font-mono text-small font-bold text-emerald-700 dark:text-emerald-400 text-right">
                Bs. {montoComisionDr.toFixed(2)}
              </div>
            </div>
          </div>
        </section>

        {/* 4. CONDICIONES DE PAGO Y RESUMEN FINAL */}
        <section className={panelClass}>
          <div className={panelHeaderClass}>
            <span className="flex items-center gap-1.5">
              <CreditCard size={13} className="text-primary dark:text-secondary" />
              4. Condiciones de Pago & Resumen Importe Final
            </span>
          </div>

          <div className="p-3 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>
                  Tipo de Pago <span className="text-rose-500">*</span>
                </label>
                <div className="flex border border-slate-300 dark:border-slate-700 rounded-sm overflow-hidden">
                  <button
                    type="button"
                    id="boleta-tipo-contado"
                    onClick={() => setTipoPaga('Contado')}
                    className={segmentClass(tipoPaga === 'Contado')}
                  >
                    Contado
                  </button>
                  <button
                    type="button"
                    id="boleta-tipo-credito"
                    onClick={() => setTipoPaga('Credito')}
                    className={`${segmentClass(tipoPaga === 'Credito')} border-l border-slate-300 dark:border-slate-700`}
                  >
                    Crédito / Cuotas
                  </button>
                </div>
              </div>

              {tipoPaga === 'Credito' ? (
                <div>
                  <label className={labelClass}>
                    Nº Cuotas <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="boleta-cantidad-cuotas"
                    type="number"
                    min="2"
                    max="36"
                    value={cantidadCuotas}
                    onChange={(e) => setCantidadCuotas(Number(e.target.value))}
                    required
                    className={`${inputClass} font-mono text-right`}
                  />
                </div>
              ) : (
                <div>
                  <label className={labelClass}>Método de Pago</label>
                  <select
                    id="boleta-metodo-pago"
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="EFEC">Efectivo</option>
                    <option value="QR">QR / Pago Móvil</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Tarjeta">Tarjeta</option>
                  </select>
                </div>
              )}

              <div>
                <label className={labelClass}>Estado Inicial</label>
                <select
                  id="boleta-estado-inicial"
                  value={tipoPaga === 'Contado' ? 'completado' : estado}
                  disabled={tipoPaga === 'Contado'}
                  onChange={(e) => setEstado(e.target.value as BoletaEstado)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="completado">Completado</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>
            </div>

            {/* FIRST INSTALLMENT IF CREDITO */}
            {tipoPaga === 'Credito' && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div className="text-tiny font-bold uppercase tracking-wider text-primary dark:text-secondary flex items-center gap-1">
                  <DollarSign size={11} /> Registro Primer Abono (Cuota 1)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelClass}>Monto Primer Abono (Bs.)</label>
                    <input
                      id="boleta-monto-cuota1"
                      type="number"
                      step="0.01"
                      min="0"
                      value={montoCuenta1}
                      onChange={(e) => setMontoCuenta1(Number(e.target.value))}
                      placeholder="0.00"
                      className={`${inputClass} font-mono text-right`}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Método Abono</label>
                    <select
                      id="boleta-metodo-cuota1"
                      value={metodoPagoCuenta1}
                      onChange={(e) => setMetodoPagoCuenta1(e.target.value)}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="QR">QR</option>
                      <option value="EFEC">Efectivo</option>
                      <option value="Tarjeta">Tarjeta</option>
                      <option value="Transferencia">Transferencia</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TOTALS BANNER */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-dark-bg p-3 rounded-sm">
              <div className="flex flex-wrap items-center gap-4 text-small">
                <div>
                  <span className="text-slate-500 font-medium">Subtotal:</span>{' '}
                  <span className="font-mono font-bold text-primary-dark dark:text-white">Bs. {subtotal.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Descuentos:</span>{' '}
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400">- Bs. {totalDescuentos.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-tiny font-bold uppercase tracking-wider text-slate-500">Monto Total:</span>
                <span className="font-mono font-extrabold text-base text-primary dark:text-secondary">
                  Bs. {montoTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-end gap-2">
            {(onClose || onCancel) && (
              <button
                type="button"
                onClick={onClose || onCancel}
                className="px-3 py-1.5 rounded bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-small font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              id="boleta-submit"
              disabled={isSubmitting || detallesItems.length === 0}
              className="px-4 py-1.5 rounded bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-bold shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 size={13} />
              <span>{isSubmitting ? 'Generando...' : 'Emitir Boleta'}</span>
            </button>
          </div>
        </section>
      </div>
    </form>
  );

  if (!isModal) return formContent;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-primary-dark dark:text-white text-xs font-bold uppercase tracking-wider">
            <Receipt size={14} className="text-primary dark:text-secondary" />
            <span>Emitir Boleta de Servicios Prestados</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
        {formContent}
      </div>
    </div>
  );
};
