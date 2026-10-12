import React, { useState } from 'react';
import {
  X,
  Receipt,
  CheckCircle2,
  XCircle,
  Clock3,
  Calendar,
  User,
  Stethoscope,
  CreditCard,
  FileText,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Lock,
  ListChecks,
  FlaskConical,
} from 'lucide-react';
import type { BoletaServicioPrestado, Cuota } from '../types/boleta';
import {
  pagarCuotaApi,
  addCuotaApi,
  updateCuotaApi,
  deleteCuotaApi,
} from '../services/boletaService';
import { useAuthStore } from '../../auth/store/authStore';
import { toast } from 'sonner';
import { BoletaPDFViewerModal } from './BoletaPDFViewerModal';

interface BoletaDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  boleta: BoletaServicioPrestado | null;
  onBoletaUpdated?: (updatedBoleta: BoletaServicioPrestado) => void;
}

/* ---------- Enterprise design tokens ---------- */
const inputClass =
  'w-full px-2 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors';
const labelClass =
  'block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1';
const panelClass =
  'bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 overflow-hidden';
const panelHeaderClass =
  'px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between gap-2 text-small font-bold uppercase tracking-wider text-primary-dark dark:text-white';

export const BoletaDetailsModal: React.FC<BoletaDetailsModalProps> = ({
  isOpen,
  onClose,
  boleta,
  onBoletaUpdated,
}) => {
  const { user } = useAuthStore();
  const [payingCuotaId, setPayingCuotaId] = useState<number | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Cuota form states
  const [editingCuota, setEditingCuota] = useState<Cuota | null>(null);
  const [isAddingCuota, setIsAddingCuota] = useState(false);
  const [cuotaForm, setCuotaForm] = useState<{
    monto_cuota: number;
    fecha_pago: string;
    modo_pago: string;
    metodo_pago: string;
    estado: 'pendiente' | 'pagado';
  }>({
    monto_cuota: 0,
    fecha_pago: new Date().toISOString().split('T')[0],
    modo_pago: '',
    metodo_pago: 'Efectivo',
    estado: 'pendiente',
  });

  if (!isOpen || !boleta) return null;

  const totalPagado = (boleta.cuotas || [])
    .filter((c) => c.estado === 'pagado')
    .reduce((acc, c) => acc + Number(c.monto_cuota || 0), 0);

  const totalCuotasProgramadas = (boleta.cuotas || []).reduce(
    (acc, c) => acc + Number(c.monto_cuota || 0),
    0
  );

  const saldoPendiente = Math.max(0, Number(boleta.monto_total) - totalPagado);

  const isAdmin =
    user?.rol?.nombre?.toLowerCase() === 'administrador' ||
    user?.rol?.nombre?.toLowerCase() === 'admin';

  const isCompletado = boleta.estado === 'completado' || boleta.estado === 'pagada';
  const canModifyCuotas = !isCompletado || isAdmin;

  const openAddForm = () => {
    if (!canModifyCuotas) {
      toast.error('La boleta está completada. Solo un Administrador puede agregar cuotas.');
      return;
    }
    setEditingCuota(null);
    setCuotaForm({
      monto_cuota: saldoPendiente > 0 ? Number(saldoPendiente.toFixed(2)) : 0,
      fecha_pago: new Date().toISOString().split('T')[0],
      modo_pago: `Cuota ${(boleta.cuotas?.length || 0) + 1}`,
      metodo_pago: 'Efectivo',
      estado: 'pendiente',
    });
    setIsAddingCuota(true);
  };

  const openEditForm = (cuota: Cuota) => {
    if (!canModifyCuotas) {
      toast.error('La boleta está completada. Solo un Administrador puede editar cuotas.');
      return;
    }
    setIsAddingCuota(false);
    setEditingCuota(cuota);
    setCuotaForm({
      monto_cuota: Number(cuota.monto_cuota || 0),
      fecha_pago: cuota.fecha_pago ? String(cuota.fecha_pago).split('T')[0] : new Date().toISOString().split('T')[0],
      modo_pago: cuota.modo_pago || `Cuota ${cuota.numero_cuota || ''}`,
      metodo_pago: cuota.metodo_pago || 'Efectivo',
      estado: cuota.estado || 'pendiente',
    });
  };

  const handleSaveCuota = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      let updated: BoletaServicioPrestado;
      if (editingCuota && editingCuota.id) {
        updated = await updateCuotaApi(boleta.id, editingCuota.id, {
          monto_cuota: cuotaForm.monto_cuota,
          fecha_pago: cuotaForm.fecha_pago,
          modo_pago: cuotaForm.modo_pago,
          metodo_pago: cuotaForm.metodo_pago,
          estado: cuotaForm.estado,
        });
        toast.success('Cuota actualizada exitosamente');
      } else {
        updated = await addCuotaApi(boleta.id, {
          monto_cuota: cuotaForm.monto_cuota,
          fecha_pago: cuotaForm.fecha_pago,
          modo_pago: cuotaForm.modo_pago,
          metodo_pago: cuotaForm.metodo_pago,
          estado: cuotaForm.estado,
        });
        toast.success('Cuota agregada exitosamente');
      }
      setIsAddingCuota(false);
      setEditingCuota(null);
      if (onBoletaUpdated) {
        onBoletaUpdated(updated);
      }
    } catch {
      toast.error('Error al guardar la cuota');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteCuota = async (cuotaId: number) => {
    if (!window.confirm('¿Desea eliminar esta cuota? El saldo total se recalculará automáticamente.')) {
      return;
    }
    setLoadingAction(true);
    try {
      const updated = await deleteCuotaApi(boleta.id, cuotaId);
      toast.success('Cuota eliminada exitosamente');
      if (onBoletaUpdated) {
        onBoletaUpdated(updated);
      }
    } catch {
      toast.error('Error al eliminar la cuota');
    } finally {
      setLoadingAction(false);
    }
  };

  const handlePagarCuota = async (cuotaId: number) => {
    setPayingCuotaId(cuotaId);
    try {
      const updated = await pagarCuotaApi(boleta.id, cuotaId, {
        fecha_pago: new Date().toISOString().split('T')[0],
        metodo_pago: 'Efectivo',
      });
      toast.success('Cuota registrada como pagada exitosamente');
      if (onBoletaUpdated) {
        onBoletaUpdated(updated);
      }
    } catch {
      toast.error('Error al procesar el pago de la cuota');
    } finally {
      setPayingCuotaId(null);
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'completado':
      case 'pagada':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-cyan-50 dark:bg-cyan-900/30 text-primary dark:text-secondary border border-cyan-200 dark:border-cyan-800">
            <CheckCircle2 size={10} />
            COMPLETADO
          </span>
        );
      case 'anulada':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <XCircle size={10} />
            ANULADA
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Clock3 size={10} />
            PENDIENTE
          </span>
        );
    }
  };

  const subtotalSum = (boleta.detalles || []).reduce((acc, d) => {
    const p = Number(d.precio_unitario ?? d.servicio?.precio ?? 0);
    return acc + p;
  }, 0);

  const descuentoSum = (boleta.detalles || []).reduce((acc, d) => {
    return acc + Number(d.descuento || 0);
  }, 0);

  const pacienteName = boleta.paciente
    ? `${boleta.paciente.nombre} ${boleta.paciente.apellido}`
    : boleta.cita?.paciente
    ? `${boleta.cita.paciente.nombre} ${boleta.cita.paciente.apellido}`
    : boleta.cita?.nombre_paciente_unregistered || 'Paciente General';

  const doctorName = boleta.doctor
    ? `Dr. ${boleta.doctor.nombre} ${boleta.doctor.apellido}`
    : boleta.cita?.doctor
    ? `Dr. ${boleta.cita.doctor.nombre} ${boleta.cita.doctor.apellido}`
    : 'Sin doctor';

  const especialidad = boleta.doctor?.especialidades
    ? Array.isArray(boleta.doctor.especialidades)
      ? boleta.doctor.especialidades.join(', ')
      : boleta.doctor.especialidades
    : 'Odontólogo';

  const pctPagado = Number(boleta.monto_total) > 0
    ? Math.min(100, (totalPagado / Number(boleta.monto_total)) * 100)
    : 0;

  const metaItems: { icon: React.ReactNode; label: string; value: React.ReactNode; sub?: React.ReactNode }[] = [
    {
      icon: <User size={10} className="text-primary" />,
      label: 'Paciente',
      value: pacienteName,
      sub: <span className="font-mono">HC: {boleta.paciente?.codigo_paciente || boleta.cita?.paciente?.codigo_paciente || 'N/A'}</span>,
    },
    {
      icon: <Stethoscope size={10} className="text-primary" />,
      label: 'Doctor Tratante',
      value: doctorName,
      sub: especialidad,
    },
    {
      icon: <Calendar size={10} className="text-primary" />,
      label: 'Cita Origen',
      value: <span className="font-mono">{boleta.cita?.numero_cita || (boleta.cita_id ? `#${boleta.cita_id}` : 'Sin cita')}</span>,
      sub: `Sucursal: ${boleta.cita?.sucursal?.nombre || boleta.cita?.sucursal?.ubicacion || 'Central'}`,
    },
    {
      icon: <FileText size={10} className="text-primary" />,
      label: 'Emisión',
      value: <span className="font-mono">{String(boleta.fecha_emision).split('T')[0]}</span>,
      sub: `Por: ${boleta.emitido_por}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:p-0 print:bg-white print:static">
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl w-full max-w-4xl overflow-hidden text-slate-700 dark:text-slate-200 flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none">
        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2 flex-wrap">
            <Receipt size={14} className="text-primary dark:text-secondary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary-dark dark:text-white">
              Boleta de Servicios Prestados
            </span>
            <span className="font-mono text-small font-bold text-primary dark:text-secondary px-1.5 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface">
              {boleta.numero_boleta}
            </span>
            {getStatusBadge(boleta.estado)}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY (SINGLE COLUMN FLOW) */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-50/60 dark:bg-dark-bg/40 space-y-4">
          {/* METADATA STRIP */}
          <div className="grid grid-cols-2 lg:grid-cols-4 bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm divide-x divide-y lg:divide-y-0 divide-slate-200 dark:divide-slate-800 text-small">
            {metaItems.map((m) => (
              <div key={m.label} className="px-3 py-2 min-w-0">
                <div className="text-micro font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  {m.icon} {m.label}
                </div>
                <div className="font-bold text-primary-dark dark:text-white truncate">{m.value}</div>
                {m.sub && <div className="text-tiny text-slate-500 truncate">{m.sub}</div>}
              </div>
            ))}
          </div>

          {/* SINGLE COLUMN SECTIONS */}
          <div className="space-y-4">
            {/* 1. SERVICES TABLE */}
            <section className={panelClass}>
              <div className={panelHeaderClass}>
                <span className="flex items-center gap-1.5">
                  <ListChecks size={13} className="text-primary dark:text-secondary" />
                  Servicios Realizados ({boleta.detalles?.length || 0})
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-small whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-dark-bg text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                    <tr>
                      <th className="px-3 py-1.5 font-bold w-8">#</th>
                      <th className="px-3 py-1.5 font-bold">Servicio</th>
                      <th className="px-3 py-1.5 font-bold text-right w-28">Precio</th>
                      <th className="px-3 py-1.5 font-bold text-right w-28">Descuento</th>
                      <th className="px-3 py-1.5 font-bold text-right w-28">Neto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {(boleta.detalles || []).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-500 font-semibold">
                          Sin servicios registrados.
                        </td>
                      </tr>
                    ) : (
                      (boleta.detalles || []).map((det, index) => {
                        const p = Number(det.precio_unitario ?? det.servicio?.precio ?? 0);
                        const d = Number(det.descuento || 0);
                        const lineNet = Math.max(0, p - d);
                        return (
                          <tr key={det.id || index} className="hover:bg-slate-50 dark:hover:bg-dark-bg/50 transition-colors">
                            <td className="px-3 py-1.5 font-mono text-slate-400">{index + 1}</td>
                            <td className="px-3 py-1.5">
                              <span className="font-bold text-primary-dark dark:text-white">
                                {det.servicio?.nombre || 'Tratamiento Dental'}
                              </span>
                              {det.servicio?.codigo_servicio && (
                                <span className="ml-1.5 font-mono text-tiny text-primary dark:text-secondary">
                                  {det.servicio.codigo_servicio}
                                </span>
                              )}
                              {det.descripcion && det.descripcion !== det.servicio?.nombre && (
                                <div className="text-tiny text-slate-500">{det.descripcion}</div>
                              )}
                            </td>
                            <td className="px-3 py-1.5 text-right font-mono">Bs. {p.toFixed(2)}</td>
                            <td className="px-3 py-1.5 text-right font-mono text-amber-700 dark:text-amber-400">
                              {d > 0 ? `- ${d.toFixed(2)}` : '0.00'}
                            </td>
                            <td className="px-3 py-1.5 text-right font-mono font-bold text-primary dark:text-secondary">
                              Bs. {lineNet.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 dark:bg-dark-bg border-t-2 border-slate-200 dark:border-slate-700">
                    <tr>
                      <td colSpan={2} className="px-3 py-1.5 font-bold uppercase tracking-wider text-slate-500">Totales</td>
                      <td className="px-3 py-1.5 text-right font-mono font-bold text-primary-dark dark:text-white">Bs. {subtotalSum.toFixed(2)}</td>
                      <td className="px-3 py-1.5 text-right font-mono font-bold text-amber-700 dark:text-amber-400">- {descuentoSum.toFixed(2)}</td>
                      <td className="px-3 py-1.5 text-right font-mono font-bold text-primary dark:text-secondary">Bs. {Number(boleta.monto_total).toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            {/* 2. FINANCIAL SUMMARY AND COLLECTION PROGRESS */}
            <section className={panelClass}>
              <div className={panelHeaderClass}>
                <span className="flex items-center gap-1.5">
                  <Receipt size={13} className="text-primary dark:text-secondary" />
                  Resumen Financiero y Progreso de Cobro
                </span>
              </div>
              <div className="p-3 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border border-slate-200 dark:border-slate-800 rounded-sm divide-x divide-slate-200 dark:divide-slate-800 text-small">
                  <div className="p-2">
                    <span className="text-tiny text-slate-500 block">Tipo Pago</span>
                    <span className="font-semibold text-primary-dark dark:text-white">
                      {(boleta.tipo_pago || boleta.tipo_paga || 'Contado') === 'Credito' ? 'Crédito' : boleta.tipo_pago || boleta.tipo_paga || 'Contado'}
                    </span>
                  </div>
                  <div className="p-2">
                    <span className="text-tiny text-slate-500 block">Total</span>
                    <span className="font-mono font-bold text-primary dark:text-secondary">Bs. {Number(boleta.monto_total).toFixed(2)}</span>
                  </div>
                  <div className="p-2">
                    <span className="text-tiny text-slate-500 block">Abonado</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">Bs. {totalPagado.toFixed(2)}</span>
                  </div>
                  <div className="p-2">
                    <span className="text-tiny text-slate-500 block">Pendiente</span>
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400">Bs. {saldoPendiente.toFixed(2)}</span>
                  </div>
                  <div className="p-2">
                    <span className="text-tiny text-slate-500 block">Avance</span>
                    <span className="font-mono font-bold text-primary-dark dark:text-white">{pctPagado.toFixed(0)}%</span>
                  </div>
                </div>

                <div className="h-2 rounded-sm bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-[#0077D4] dark:bg-[#00C2E0] transition-all" style={{ width: `${pctPagado}%` }} />
                </div>
              </div>
            </section>

            {/* 3. CUOTAS & ABONOS */}
            <section className={panelClass}>
              <div className={panelHeaderClass}>
                <span className="flex items-center gap-1.5">
                  <CreditCard size={13} className="text-primary dark:text-secondary" />
                  Cuotas y Abonos ({boleta.cuotas?.length || 0})
                </span>
                {canModifyCuotas ? (
                  <button
                    type="button"
                    id="boleta-add-cuota"
                    onClick={openAddForm}
                    className="normal-case tracking-normal px-2.5 py-1 rounded-sm bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-bold flex items-center gap-1 cursor-pointer transition-colors print:hidden"
                  >
                    <Plus size={12} />
                    <span>Agregar Cuota</span>
                  </button>
                ) : (
                  <span className="normal-case tracking-normal px-2 py-0.5 rounded-sm border border-slate-300 dark:border-slate-700 text-slate-500 text-tiny font-semibold flex items-center gap-1 print:hidden">
                    <Lock size={11} className="text-amber-600" />
                    Solo Administrador
                  </span>
                )}
              </div>

              {(isCompletado && !isAdmin) || Math.abs(totalCuotasProgramadas - Number(boleta.monto_total)) > 0.01 ? (
                <div className="px-3 pt-3 space-y-2 print:hidden">
                  {isCompletado && !isAdmin && (
                    <div className="p-2 rounded-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-small flex items-center gap-2">
                      <Lock size={13} className="text-amber-600 shrink-0" />
                      <span>
                        Boleta <strong>COMPLETADA</strong>: las cuotas solo pueden ser modificadas por un <strong>Administrador</strong>.
                      </span>
                    </div>
                  )}
                  {Math.abs(totalCuotasProgramadas - Number(boleta.monto_total)) > 0.01 && (
                    <div className="p-2 rounded-sm bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-small flex items-center gap-2">
                      <AlertCircle size={13} className="shrink-0" />
                      <span>
                        Cuotas programadas (<span className="font-mono font-bold">Bs. {totalCuotasProgramadas.toFixed(2)}</span>) difieren del total (<span className="font-mono font-bold">Bs. {Number(boleta.monto_total).toFixed(2)}</span>).
                      </span>
                    </div>
                  )}
                </div>
              ) : null}

              {(isAddingCuota || editingCuota) && canModifyCuotas && (
                <form
                  onSubmit={handleSaveCuota}
                  className="m-3 rounded-sm border border-primary/40 dark:border-secondary/40 bg-cyan-50/40 dark:bg-dark-bg print:hidden"
                >
                  <div className="px-3 py-1.5 border-b border-primary/20 dark:border-secondary/20 flex items-center justify-between">
                    <span className="text-tiny font-bold uppercase tracking-wider text-primary dark:text-secondary">
                      {editingCuota ? `Editar ${editingCuota.modo_pago || 'Cuota'}` : 'Registrar Nueva Cuota / Abono'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCuota(false);
                        setEditingCuota(null);
                      }}
                      className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  </div>

                  <div className="p-3 grid grid-cols-2 md:grid-cols-5 gap-2 items-end">
                    <div>
                      <label className={labelClass}>Monto (Bs.)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        value={cuotaForm.monto_cuota}
                        onChange={(e) => setCuotaForm({ ...cuotaForm, monto_cuota: parseFloat(e.target.value) || 0 })}
                        className={`${inputClass} font-mono text-right`}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Descripción</label>
                      <input
                        type="text"
                        required
                        value={cuotaForm.modo_pago}
                        onChange={(e) => setCuotaForm({ ...cuotaForm, modo_pago: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Fecha</label>
                      <input
                        type="date"
                        required
                        value={cuotaForm.fecha_pago}
                        onChange={(e) => setCuotaForm({ ...cuotaForm, fecha_pago: e.target.value })}
                        className={`${inputClass} font-mono`}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Método</label>
                      <select
                        value={cuotaForm.metodo_pago}
                        onChange={(e) => setCuotaForm({ ...cuotaForm, metodo_pago: e.target.value })}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="Efectivo">Efectivo</option>
                        <option value="QR">QR</option>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="Transferencia">Transferencia</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Estado</label>
                      <div className="flex border border-slate-300 dark:border-slate-700 rounded-sm overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setCuotaForm({ ...cuotaForm, estado: 'pendiente' })}
                          className={`flex-1 px-2 py-1.5 text-tiny font-bold uppercase cursor-pointer transition-colors ${
                            cuotaForm.estado === 'pendiente'
                              ? 'bg-amber-500 text-white'
                              : 'bg-white dark:bg-dark-surface text-slate-500'
                          }`}
                        >
                          Pend.
                        </button>
                        <button
                          type="button"
                          onClick={() => setCuotaForm({ ...cuotaForm, estado: 'pagado' })}
                          className={`flex-1 px-2 py-1.5 text-tiny font-bold uppercase cursor-pointer transition-colors border-l border-slate-300 dark:border-slate-700 ${
                            cuotaForm.estado === 'pagado'
                              ? 'bg-[#0077D4] text-white'
                              : 'bg-white dark:bg-dark-surface text-slate-500'
                          }`}
                        >
                          Pagado
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="px-3 pb-3 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCuota(false);
                        setEditingCuota(null);
                      }}
                      className="px-3 py-1.5 rounded bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-small font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loadingAction}
                      className="px-4 py-1.5 rounded bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {loadingAction ? 'Guardando...' : editingCuota ? 'Actualizar Cuota' : 'Guardar Cuota'}
                    </button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto mt-3 border-t border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-small whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-dark-bg text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                    <tr>
                      <th className="px-3 py-1.5 font-bold w-8">#</th>
                      <th className="px-3 py-1.5 font-bold">Descripción</th>
                      <th className="px-3 py-1.5 font-bold w-24">Fecha</th>
                      <th className="px-3 py-1.5 font-bold w-24">Método</th>
                      <th className="px-3 py-1.5 font-bold w-24">Estado</th>
                      <th className="px-3 py-1.5 font-bold text-right w-28">Monto</th>
                      <th className="px-3 py-1.5 font-bold text-right w-32 print:hidden">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {boleta.cuotas && boleta.cuotas.length > 0 ? (
                      boleta.cuotas.map((cuota, idx) => {
                        const isPaid = cuota.estado === 'pagado';
                        const modoPagoText = (cuota.modo_pago || `Cuota ${idx + 1}`).replace(/Cuenta/gi, 'Cuota');
                        return (
                          <tr key={cuota.id || idx} className="hover:bg-slate-50 dark:hover:bg-dark-bg/50 transition-colors">
                            <td className="px-3 py-1.5 font-mono text-slate-400">{cuota.numero_cuota || idx + 1}</td>
                            <td className="px-3 py-1.5 font-semibold text-primary-dark dark:text-white">{modoPagoText}</td>
                            <td className="px-3 py-1.5 font-mono text-slate-600 dark:text-slate-300">
                              {cuota.fecha_pago ? String(cuota.fecha_pago).split('T')[0] : '—'}
                            </td>
                            <td className="px-3 py-1.5 text-slate-600 dark:text-slate-300">
                              {isPaid ? cuota.metodo_pago || 'Efectivo' : '—'}
                            </td>
                            <td className="px-3 py-1.5">
                              {isPaid ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-cyan-50 dark:bg-cyan-900/30 text-primary dark:text-secondary border border-cyan-200 dark:border-cyan-800">
                                  <CheckCircle2 size={10} /> PAGADO
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                  <Clock3 size={10} /> PENDIENTE
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-1.5 text-right font-mono font-bold text-primary-dark dark:text-white">
                              Bs. {Number(cuota.monto_cuota).toFixed(2)}
                            </td>
                            <td className="px-3 py-1.5 text-right print:hidden">
                              {canModifyCuotas ? (
                                <div className="flex items-center justify-end gap-1">
                                  {!isPaid && cuota.id && (
                                    <button
                                      type="button"
                                      disabled={payingCuotaId === cuota.id || loadingAction}
                                      onClick={() => handlePagarCuota(cuota.id!)}
                                      title="Marcar esta cuota como pagada"
                                      className="px-2 py-0.5 rounded-sm bg-[#0077D4] hover:bg-[#0840A8] text-white text-tiny font-bold transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                      {payingCuotaId === cuota.id ? '...' : 'Cobrar'}
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    disabled={loadingAction}
                                    onClick={() => openEditForm(cuota)}
                                    title="Editar cuota"
                                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-dark-bg dark:hover:bg-slate-800 text-primary dark:text-secondary transition-colors cursor-pointer"
                                  >
                                    <Pencil size={12} />
                                  </button>
                                  {cuota.id && (
                                    <button
                                      type="button"
                                      disabled={loadingAction}
                                      onClick={() => handleDeleteCuota(cuota.id!)}
                                      title="Eliminar cuota"
                                      className="p-1 rounded bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <Lock size={12} className="inline text-slate-400" />
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-slate-500 font-semibold">
                          No hay cuotas desglosadas registradas para esta boleta.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4. USO INTERNO (LABORATORIO Y COMISIÓN) */}
            <section className={`${panelClass} print:hidden`}>
              <div className={panelHeaderClass}>
                <span className="flex items-center gap-1.5">
                  <FlaskConical size={13} className="text-primary dark:text-secondary" />
                  4. Uso Interno (Laboratorio y Comisión Médica)
                </span>
              </div>
              <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-small">
                <div className="flex justify-between p-2 rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg">
                  <span className="text-slate-500 font-medium">Laboratorio</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    Bs. {Number(boleta.costo_laboratorio || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded-sm border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-900/20">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">
                    Comisión Dr. ({boleta.porcentaje_comision_dr || 40}%)
                  </span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    Bs. {Number(boleta.monto_comision_dr || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between shrink-0 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-small font-semibold border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
          <button
            type="button"
            id="boleta-print-pdf"
            onClick={() => setShowPdfModal(true)}
            className="px-4 py-1.5 rounded bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <FileText size={13} />
            <span>Imprimir / Ver PDF</span>
          </button>
        </div>
      </div>

      {/* REACT PDF PREVIEW VIEWER MODAL */}
      <BoletaPDFViewerModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        boleta={boleta}
      />
    </div>
  );
};
