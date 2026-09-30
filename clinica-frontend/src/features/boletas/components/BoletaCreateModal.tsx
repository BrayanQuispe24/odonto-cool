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
  Calendar,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Percent,
} from 'lucide-react';
import type { Cita } from '../../citas/types/cita';
import type { Servicio } from '../../services/types/servicio';
import type { Diente } from '../../dientes/types/diente';
import type { BoletaFormData, DetalleServicioItem, BoletaEstado } from '../types/boleta';
import { getServiciosApi } from '../../services/services/servicioService';
import { getDientesApi } from '../../dientes/services/dienteService';
import { getCitasApi } from '../../citas/services/citaService';
import { useAuthStore } from '../../auth/store/authStore';

interface BoletaCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BoletaFormData) => Promise<void>;
  preselectedCita?: Cita | null;
}

export const BoletaCreateModal: React.FC<BoletaCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  preselectedCita,
}) => {
  const { user } = useAuthStore();

  const [citas, setCitas] = useState<Cita[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [dientes, setDientes] = useState<Diente[]>([]);

  const [selectedCitaId, setSelectedCitaId] = useState<number | ''>('');
  const [tipoPaga, setTipoPaga] = useState<string>('Contado');
  const [metodoPago, setMetodoPago] = useState<string>('Efectivo');
  const [cantidadCuotas, setCantidadCuotas] = useState<number>(1);
  const [estado, setEstado] = useState<BoletaEstado>('pagada');

  // Line items
  const [detallesItems, setDetallesItems] = useState<DetalleServicioItem[]>([]);

  // Temp line item form state
  const [selectedServicioId, setSelectedServicioId] = useState<number | ''>('');
  const [selectedDienteId, setSelectedDienteId] = useState<number | ''>('');
  const [itemDescripcion, setItemDescripcion] = useState('');
  const [itemDescuento, setItemDescuento] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      Promise.all([getCitasApi(), getServiciosApi(), getDientesApi()])
        .then(([cList, sList, dList]) => {
          setCitas(cList);
          setServicios(sList);
          setDientes(dList);

          if (preselectedCita) {
            setSelectedCitaId(preselectedCita.id);
          } else if (cList.length > 0) {
            setSelectedCitaId(cList[0].id);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, preselectedCita]);

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
    if (!selectedServicioId) {
      setError('Selecciona un servicio para agregar a la boleta.');
      return;
    }

    const serv = servicios.find((s) => s.id === Number(selectedServicioId));
    if (!serv) return;

    const newItem: DetalleServicioItem = {
      servicio_id: serv.id,
      diente_id: selectedDienteId ? Number(selectedDienteId) : null,
      descripcion: itemDescripcion.trim() || serv.nombre,
      descuento: Math.max(0, Number(itemDescuento) || 0),
      precio_unitario: Number(serv.precio) || 0,
    };

    setDetallesItems((prev) => [...prev, newItem]);
    setSelectedServicioId('');
    setSelectedDienteId('');
    setItemDescripcion('');
    setItemDescuento(0);
    setError(null);
  };

  const handleRemoveItem = (index: number) => {
    setDetallesItems((prev) => prev.filter((_, i) => i !== index));
  };

  const [costoLaboratorio, setCostoLaboratorio] = useState<number>(0);
  const [porcentajeComisionDr, setPorcentajeComisionDr] = useState<number>(40);

  // Installment payments breakdown (Only Cuota 1 registered initially)
  const [montoCuenta1, setMontoCuenta1] = useState<number>(0);
  const [metodoPagoCuenta1, setMetodoPagoCuenta1] = useState<string>('QR');

  // Auto-calculated Doctor Commission
  const montoComisionDr = useMemo(() => {
    const base = Math.max(0, montoTotal - (Number(costoLaboratorio) || 0));
    return (base * (Number(porcentajeComisionDr) || 0)) / 100;
  }, [montoTotal, costoLaboratorio, porcentajeComisionDr]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCitaId) {
      setError('Debes seleccionar una cita médica.');
      return;
    }

    if (detallesItems.length === 0) {
      setError('Debes agregar al menos un servicio prestado a la boleta.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const emitidoPor = user ? (user.name || user.email) : 'Sistema ODONTO COOL';
      const doctorId = activeCita?.doctor_id || null;

      const isContado = tipoPaga === 'Contado';

      // Construct cuotas array with Cuota 1
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
        cita_id: Number(selectedCitaId),
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

      // Reset
      setDetallesItems([]);
      setCostoLaboratorio(0);
      setPorcentajeComisionDr(40);
      setMontoCuenta1(0);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al generar la boleta de servicios prestados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 rounded-2xl shadow-2xl shadow-[#001C3D]/80 w-full max-w-3xl overflow-hidden text-[#0840A8] dark:text-white flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-between bg-gradient-to-r from-[#0840A8] to-[#0077D4]">
          <h3 className="text-base font-bold flex items-center gap-2 text-[#0840A8] dark:text-white">
            <Receipt className="text-[#0077D4] dark:text-[#00C2E0]" size={20} />
            <span>Emitir Boleta de Servicios Prestados (Venta)</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#0077D4] dark:text-blue-100/80 hover:text-[#0840A8] dark:text-white hover:bg-white/10 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Cita Reference Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1 flex items-center gap-1">
              <Calendar size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
              Cita Médica de Origen <span className="text-rose-400">*</span>
            </label>
            {preselectedCita ? (
              <div className="p-3 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#00C2E0]/40 flex items-center justify-between text-xs">
                <div className="font-mono font-bold text-[#0077D4] dark:text-[#00C2E0]">{preselectedCita.numero_cita}</div>
                <div className="text-[#0840A8] dark:text-white font-semibold">
                  Paciente: {preselectedCita.paciente ? `${preselectedCita.paciente.nombre} ${preselectedCita.paciente.apellido}` : preselectedCita.nombre_paciente_unregistered}
                </div>
                <div className="text-[#0077D4] dark:text-blue-200/80">
                  Doctor: Dr. {preselectedCita.doctor?.nombre} {preselectedCita.doctor?.apellido}
                </div>
              </div>
            ) : (
              <select
                value={selectedCitaId}
                onChange={(e) => setSelectedCitaId(e.target.value ? Number(e.target.value) : '')}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">-- Seleccionar Cita Médica --</option>
                {citas.map((c) => {
                  const pac = c.paciente ? `${c.paciente.nombre} ${c.paciente.apellido}` : c.nombre_paciente_unregistered || 'No especificado';
                  const doc = c.doctor ? `Dr. ${c.doctor.nombre} ${c.doctor.apellido}` : 'Sin doctor';
                  return (
                    <option key={c.id} value={c.id} className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">
                      {c.numero_cita} | Paciente: {pac} | Doctor: {doc} ({String(c.fecha).split('T')[0]})
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          {/* Patient and Doctor Active Preview Card */}
          {activeCita && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D]/80 border border-[#0840A8]/15 dark:border-[#0077D4]/30 text-xs">
              <div className="space-y-0.5">
                <div className="text-[10px] text-[#0077D4] dark:text-blue-200/70 flex items-center gap-1">
                  <User size={11} className="text-[#0077D4] dark:text-[#00C2E0]" /> Paciente
                </div>
                <div className="font-bold text-[#0840A8] dark:text-white">
                  {activeCita.paciente ? `${activeCita.paciente.nombre} ${activeCita.paciente.apellido}` : activeCita.nombre_paciente_unregistered}
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-[10px] text-[#0077D4] dark:text-blue-200/70 flex items-center gap-1">
                  <Stethoscope size={11} className="text-[#0077D4] dark:text-[#00C2E0]" /> Doctor Atendido
                </div>
                <div className="font-bold text-[#0840A8] dark:text-white">
                  {activeCita.doctor ? `Dr. ${activeCita.doctor.nombre} ${activeCita.doctor.apellido}` : 'Sin doctor'}
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-[10px] text-[#0077D4] dark:text-blue-200/70 flex items-center gap-1">
                  <Building2 size={11} className="text-[#0077D4] dark:text-[#00C2E0]" /> Sucursal
                </div>
                <div className="font-bold text-[#0840A8] dark:text-white">
                  {activeCita.sucursal?.nombre || activeCita.sucursal?.ubicacion || 'Central'}
                </div>
              </div>
            </div>
          )}

          {/* ADD SERVICES SECTION */}
          <div className="p-4 rounded-2xl bg-[#F4F9FF] dark:bg-[#001C3D]/60 border border-[#0840A8]/15 dark:border-[#0077D4]/40 space-y-3">
            <h4 className="text-xs font-bold text-[#0077D4] dark:text-[#00C2E0] uppercase tracking-wider flex items-center gap-1.5">
              <Plus size={14} />
              <span>Agregar Servicios Prestados a la Boleta</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
              <div className="sm:col-span-4">
                <label className="block text-[11px] font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
                  Servicio Dental <span className="text-rose-400">*</span>
                </label>
                <select
                  value={selectedServicioId}
                  onChange={(e) => setSelectedServicioId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0]"
                >
                  <option value="" className="bg-white dark:bg-[#002D5E]">-- Seleccionar Servicio --</option>
                  {servicios.map((s) => (
                    <option key={s.id} value={s.id} className="bg-white dark:bg-[#002D5E]">
                      {s.nombre} (Bs. {Number(s.precio).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
                  Pieza FDI (Opcional)
                </label>
                <select
                  value={selectedDienteId}
                  onChange={(e) => setSelectedDienteId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0]"
                >
                  <option value="" className="bg-white dark:bg-[#002D5E]">-- Ninguna / General --</option>
                  {dientes.map((d) => (
                    <option key={d.id} value={d.id} className="bg-white dark:bg-[#002D5E]">
                      FDI #{d.numero_diente} - {d.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
                  Descuento (Bs.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={itemDescuento}
                  onChange={(e) => setItemDescuento(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-mono font-bold text-[#0077D4] dark:text-[#00C2E0] focus:outline-none focus:border-[#00C2E0]"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#0840A8] hover:to-[#0077D4] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus size={14} />
                  <span>Añadir</span>
                </button>
              </div>
            </div>
          </div>

          {/* LIST OF ADDED ITEMS */}
          <div className="border border-[#0840A8]/15 dark:border-[#0077D4]/40 rounded-xl overflow-hidden bg-[#F4F9FF] dark:bg-[#001C3D]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#E5F7FF] dark:bg-[#0840A8]/40 border-b border-[#0840A8]/15 dark:border-[#0840A8]/60 text-[10px] font-extrabold uppercase text-[#0077D4] dark:text-blue-100">
                  <th className="py-2.5 px-3">SERVICIO</th>
                  <th className="py-2.5 px-3">PIEZA DENTAL</th>
                  <th className="py-2.5 px-3 text-right">PRECIO STDA</th>
                  <th className="py-2.5 px-3 text-right">DESCUENTO</th>
                  <th className="py-2.5 px-3 text-right">SUBTOTAL</th>
                  <th className="py-2.5 px-3 text-center">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0840A8]/15 dark:divide-[#0840A8]/30">
                {detallesItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#0077D4] dark:text-blue-200/60 font-medium">
                      No has agregado ningún servicio a esta boleta.
                    </td>
                  </tr>
                ) : (
                  detallesItems.map((item, idx) => {
                    const serv = servicios.find((s) => s.id === item.servicio_id);
                    const dien = dientes.find((d) => d.id === item.diente_id);
                    const lineSubtotal = Math.max(0, (item.precio_unitario || 0) - item.descuento);

                    return (
                      <tr key={idx} className="hover:bg-[#0840A8]/20 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-[#0840A8] dark:text-white">
                          {serv?.nombre || item.descripcion}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[#0077D4] dark:text-blue-200">
                          {dien ? `FDI #${dien.numero_diente} (${dien.nombre})` : 'General / Sin pieza'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-[#0840A8] dark:text-white">
                          Bs. {(item.precio_unitario || 0).toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-amber-600 dark:text-amber-300">
                          {item.descuento > 0 ? `- Bs. ${item.descuento.toFixed(2)}` : '0.00'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-[#0077D4] dark:text-[#00C2E0]">
                          Bs. {lineSubtotal.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 rounded text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* TOTALS SUMMARY BANNER */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#001C3D] via-[#0840A8]/40 to-[#001C3D] border border-[#0840A8]/15 dark:border-[#00C2E0]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 text-xs">
              <div className="text-[#0077D4] dark:text-blue-200/70 font-semibold">Resumen de Importes</div>
              <div className="flex flex-wrap items-center gap-4 text-[#0077D4] dark:text-blue-100">
                <span>Subtotal: <strong className="font-mono text-[#0840A8] dark:text-white">Bs. {subtotal.toFixed(2)}</strong></span>
                <span>Descuentos: <strong className="font-mono text-amber-600 dark:text-amber-300">Bs. {totalDescuentos.toFixed(2)}</strong></span>
                <span>Base Comisión: <strong className="font-mono text-emerald-300">Bs. {Math.max(0, montoTotal - (Number(costoLaboratorio) || 0)).toFixed(2)}</strong></span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-[#0077D4] dark:text-blue-200/80 uppercase font-bold tracking-wider">MONTO TOTAL BOLETA</div>
              <div className="text-2xl font-black text-[#0077D4] dark:text-[#00C2E0] font-mono">
                Bs. {montoTotal.toFixed(2)}
              </div>
            </div>
          </div>

          {/* DR COMMISSION & LAB COSTS SECTION */}
          <div className="p-4 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D]/80 border border-[#0840A8]/15 dark:border-[#0077D4]/40 space-y-3">
            <h4 className="text-xs font-bold text-[#0077D4] dark:text-[#00C2E0] uppercase tracking-wider flex items-center justify-between">
              <span>Laboratorio Dental y Comisión Doctor</span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                Fórmula: (Total - Laboratorio) × %Comisión
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
                  Costo Laboratorio (Bs.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={costoLaboratorio}
                  onChange={(e) => setCostoLaboratorio(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-mono font-bold focus:outline-none focus:border-[#00C2E0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
                  % Comisión Doctor
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={porcentajeComisionDr}
                  onChange={(e) => setPorcentajeComisionDr(Number(e.target.value))}
                  placeholder="40"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-mono font-bold focus:outline-none focus:border-[#00C2E0]"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-[#E5F7FF] dark:bg-[#0840A8]/30 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 flex flex-col justify-center">
                <span className="text-[10px] text-[#0077D4] dark:text-blue-200 uppercase font-bold">Monto Comisión DR</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  Bs. {montoComisionDr.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* PAYMENT OPTIONS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1 flex items-center gap-1">
                <CreditCard size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
                Tipo de Pago <span className="text-rose-400">*</span>
              </label>
              <select
                value={tipoPaga}
                onChange={(e) => setTipoPaga(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] cursor-pointer"
              >
                <option value="Contado" className="bg-white dark:bg-[#002D5E]">Al Contado (1 Cuota / Auto Completado)</option>
                <option value="Credito" className="bg-white dark:bg-[#002D5E]">Al Crédito / En Cuotas</option>
              </select>
            </div>

            {tipoPaga === 'Credito' ? (
              <div>
                <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1 flex items-center gap-1">
                  <Percent size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
                  Cantidad de Cuotas <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min="2"
                  max="36"
                  value={cantidadCuotas}
                  onChange={(e) => setCantidadCuotas(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-mono font-bold focus:outline-none focus:border-[#00C2E0]"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1 flex items-center gap-1">
                  <DollarSign size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
                  Método de Pago
                </label>
                <select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] cursor-pointer"
                >
                  <option value="EFEC" className="bg-white dark:bg-[#002D5E]">Efectivo (EFEC)</option>
                  <option value="QR" className="bg-white dark:bg-[#002D5E]">QR / Pago Móvil</option>
                  <option value="Transferencia" className="bg-white dark:bg-[#002D5E]">Transferencia Bancaria</option>
                  <option value="Tarjeta" className="bg-white dark:bg-[#002D5E]">Tarjeta de Crédito / Débito</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
                Estado Inicial
              </label>
              <select
                value={tipoPaga === 'Contado' ? 'completado' : estado}
                disabled={tipoPaga === 'Contado'}
                onChange={(e) => setEstado(e.target.value as BoletaEstado)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] cursor-pointer disabled:opacity-60"
              >
                <option value="completado" className="bg-white dark:bg-[#002D5E]">Completado (Pago 100%)</option>
                <option value="pendiente" className="bg-white dark:bg-[#002D5E]">Pendiente de Cuotas</option>
              </select>
            </div>
          </div>

          {/* REGISTRO DE PRIMER ABONO (CUOTA 1) */}
          {tipoPaga === 'Credito' && (
            <div className="p-4 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D]/80 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 space-y-3">
              <h4 className="text-xs font-bold text-[#0077D4] dark:text-[#00C2E0] uppercase tracking-wider">
                Registro del Primer Abono (Cuota 1)
              </h4>

              <div className="p-3 rounded-xl bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#0077D4]/40">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
                      Monto Primer Abono (Bs.)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={montoCuenta1}
                      onChange={(e) => setMontoCuenta1(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
                      Método de Pago (QR / EFEC)
                    </label>
                    <select
                      value={metodoPagoCuenta1}
                      onChange={(e) => setMetodoPagoCuenta1(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white font-mono"
                    >
                      <option value="QR">QR Transferencia</option>
                      <option value="EFEC">EFECTIVO</option>
                      <option value="Tarjeta">Tarjeta Débito/Crédito</option>
                      <option value="Transferencia">Transferencia Bancaria</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
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
              disabled={isSubmitting || detallesItems.length === 0}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#0840A8] hover:to-[#0077D4] text-white text-xs font-bold shadow-md shadow-[#0077D4]/30 disabled:opacity-40 cursor-pointer transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 size={15} />
              <span>{isSubmitting ? 'Generando Boleta...' : 'Emitir Boleta de Servicios'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
