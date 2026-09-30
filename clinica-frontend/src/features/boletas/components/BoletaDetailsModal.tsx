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
  Building2,
  CreditCard,
  FileText,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Lock,
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/50">
            <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
            Completado
          </span>
        );
      case 'anulada':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950/90 text-rose-300 border border-rose-500/50">
            <XCircle size={13} className="text-rose-400" />
            Anulada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/90 text-amber-600 dark:text-amber-300 border border-amber-500/50">
            <Clock3 size={13} className="text-amber-400" />
            Pendiente de Pago
          </span>
        );
    }
  };

  const subtotalSum = (boleta.detalles || []).reduce((acc, d) => {
    const p = Number(d.servicio?.precio || 0);
    return acc + p;
  }, 0);

  const descuentoSum = (boleta.detalles || []).reduce((acc, d) => {
    return acc + Number(d.descuento || 0);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white print:static">
      <div className="bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/40 rounded-2xl shadow-2xl shadow-[#001C3D]/90 w-full max-w-4xl overflow-hidden text-[#0840A8] dark:text-white flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:bg-white print:text-slate-900">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-between bg-gradient-to-r from-[#0840A8] via-[#0077D4] to-[#00C2E0] text-white shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/15 border border-white/20 text-[#0077D4] dark:text-[#00C2E0]">
              <Receipt size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-white/20 text-[#0077D4] dark:text-[#00C2E0] border border-white/10">
                  {boleta.numero_boleta}
                </span>
                {getStatusBadge(boleta.estado)}
              </div>
              <h2 className="text-lg font-black tracking-tight text-[#0840A8] dark:text-white mt-1">
                Boleta de Servicios Prestados
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white/80 hover:text-[#0840A8] dark:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTENT BODY */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 scroll-smooth print:p-8">
          {/* RECEIPT HEADER BRANDING */}
          <div className="flex flex-row items-start justify-between gap-4 border-b-2 border-[#0840A8]/15 dark:border-[#0840A8]/50 pb-4 print:border-[#002D5E]">
            <div className="flex flex-col items-start">
              <div className="text-xl font-black text-[#0840A8] dark:text-white print:text-[#002D5E] tracking-tight flex items-center gap-2">
                <Building2 className="text-[#0077D4] dark:text-[#00C2E0] print:text-[#002D5E]" size={22} />
                <span>ODONTO COOL PRO</span>
              </div>
              <p className="text-xs text-[#0077D4] dark:text-blue-200/80 print:text-slate-600 mt-0.5 uppercase tracking-wide">
                Clínica Odontológica Especializada • Boleta Oficial de Venta
              </p>
            </div>

            <div className="flex flex-col items-end text-right shrink-0">
              <div className="text-sm font-mono font-bold text-[#0077D4] dark:text-[#00C2E0] print:text-[#002D5E]">
                Nº {boleta.numero_boleta}
              </div>
              <div className="text-[11px] text-[#0077D4] dark:text-blue-100/90 print:text-slate-700 mt-0.5">
                Fecha Emisión: <strong>{String(boleta.fecha_emision).split('T')[0]}</strong>
              </div>
              <div className="text-[10px] text-[#0077D4] dark:text-blue-200/70 print:text-slate-500">
                Emitido Por: {boleta.emitido_por}
              </div>
            </div>
          </div>

          {/* PATIENT, DOCTOR & CITA METADATA GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D]/80 border border-[#0840A8]/15 dark:border-[#0077D4]/40 print:bg-slate-50 print:border-slate-400 text-xs font-sans">
            {/* PACIENTE */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-[#0077D4] dark:text-[#00C2E0] print:text-blue-900 uppercase tracking-wider flex items-center gap-1">
                <User size={12} /> PACIENTE / HISTORIA CLÍNICA (HC)
              </div>
              <div className="font-extrabold text-[#0840A8] dark:text-white print:text-slate-900 text-sm">
                {boleta.cita?.paciente
                  ? `${boleta.cita.paciente.nombre} ${boleta.cita.paciente.apellido}`
                  : boleta.cita?.nombre_paciente_unregistered || 'Paciente General'}
              </div>
              <div className="text-[11px] font-mono text-[#0077D4] dark:text-[#00C2E0] print:text-slate-700 font-bold">
                HC: {boleta.cita?.paciente?.codigo_paciente || 'N/A'}
              </div>
            </div>

            {/* DOCTOR */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-[#0077D4] dark:text-[#00C2E0] print:text-blue-900 uppercase tracking-wider flex items-center gap-1">
                <Stethoscope size={12} /> DOCTOR TRATANTE
              </div>
              <div className="font-extrabold text-[#0840A8] dark:text-white print:text-slate-900 text-sm">
                {boleta.doctor
                  ? `Dr. ${boleta.doctor.nombre} ${boleta.doctor.apellido}`
                  : boleta.cita?.doctor
                  ? `Dr. ${boleta.cita.doctor.nombre} ${boleta.cita.doctor.apellido}`
                  : 'Sin doctor'}
              </div>
              <div className="text-[11px] text-[#0077D4] dark:text-blue-200 print:text-slate-600">
                {boleta.doctor?.especialidades
                  ? Array.isArray(boleta.doctor.especialidades)
                    ? boleta.doctor.especialidades.join(', ')
                    : boleta.doctor.especialidades
                  : 'Odontólogo Specialist'}
              </div>
            </div>

            {/* CITA & SUCURSAL */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-[#0077D4] dark:text-[#00C2E0] print:text-blue-900 uppercase tracking-wider flex items-center gap-1">
                <Calendar size={12} /> CITA ORIGEN
              </div>
              <div className="font-mono font-bold text-[#0840A8] dark:text-white print:text-slate-900">
                Cita #{boleta.cita?.numero_cita || boleta.cita_id}
              </div>
              <div className="text-[11px] text-[#0077D4] dark:text-blue-200 print:text-slate-600">
                Sucursal: {boleta.cita?.sucursal?.nombre || boleta.cita?.sucursal?.ubicacion || 'Central'}
              </div>
            </div>
          </div>

          {/* TABLE OF SERVICES RENDERED */}
          <div className="rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/40 overflow-hidden bg-[#F4F9FF] dark:bg-[#001C3D] print:border-slate-400 print:bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#E5F7FF] dark:bg-[#0840A8]/40 border-b border-[#0840A8]/15 dark:border-[#0840A8]/60 text-[10px] font-extrabold uppercase text-[#0077D4] dark:text-blue-100 print:bg-slate-200 print:text-slate-900">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">SERVICIO REALIZADO</th>
                  <th className="py-2.5 px-3">PIEZA DENTAL</th>
                  <th className="py-2.5 px-3 text-right">PRECIO LISTA</th>
                  <th className="py-2.5 px-3 text-right">DESCUENTO</th>
                  <th className="py-2.5 px-3 text-right">TOTAL NETO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0840A8]/15 dark:divide-[#0840A8]/30 print:divide-slate-300">
                {(boleta.detalles || []).map((det, index) => {
                  const p = Number(det.servicio?.precio || 0);
                  const d = Number(det.descuento || 0);
                  const lineNet = Math.max(0, p - d);

                  return (
                    <tr key={det.id || index} className="hover:bg-[#0840A8]/20 print:hover:bg-transparent">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#0077D4] dark:text-[#00C2E0] print:text-slate-700">
                        {index + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-[#0840A8] dark:text-white print:text-slate-900">
                          {det.servicio?.nombre || 'Tratamiento Dental'}
                        </div>
                        {det.descripcion && det.descripcion !== det.servicio?.nombre && (
                          <div className="text-[11px] text-[#0077D4] dark:text-blue-200/80 print:text-slate-600">
                            {det.descripcion}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[#0077D4] dark:text-blue-200 print:text-slate-700">
                        {det.diente
                          ? `FDI #${det.diente.numero_diente} (${det.diente.nombre})`
                          : 'Odontología General'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#0840A8] dark:text-white print:text-slate-900">
                        Bs. {p.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-amber-600 dark:text-amber-300 print:text-amber-700">
                        {d > 0 ? `- Bs. ${d.toFixed(2)}` : '0.00'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#0077D4] dark:text-[#00C2E0] print:text-blue-900">
                        Bs. {lineNet.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* TOTALS & COMMISSION SUMMARY BANNER */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-[#001C3D] via-[#0840A8]/40 to-[#001C3D] border border-[#0840A8]/15 dark:border-[#00C2E0]/40 print:bg-slate-100 print:border-slate-400">
              <div className="space-y-1 text-xs text-[#0077D4] dark:text-blue-100 print:text-slate-700">
                <div>Tipo de Pago: <strong className="text-[#0840A8] dark:text-white print:text-slate-900">{boleta.tipo_pago || boleta.tipo_paga || 'Contado'}</strong></div>
                <div>Estado de Boleta: <strong className="text-[#0840A8] dark:text-white print:text-slate-900">{boleta.estado === 'completado' ? 'COMPLETADO' : 'PENDIENTE'}</strong></div>
              </div>

              <div className="space-y-1 text-right">
                <div className="text-[11px] text-[#0077D4] dark:text-blue-200 print:text-slate-600 font-medium">
                  Subtotal: <span className="font-mono font-bold text-[#0840A8] dark:text-white print:text-slate-900">Bs. {subtotalSum.toFixed(2)}</span> | Descuento Total: <span className="font-mono font-bold text-amber-600 dark:text-amber-300 print:text-amber-700">Bs. {descuentoSum.toFixed(2)}</span>
                </div>
                <div className="text-2xl font-black text-[#0077D4] dark:text-[#00C2E0] print:text-blue-900 font-mono">
                  TOTAL: Bs. {Number(boleta.monto_total).toFixed(2)}
                </div>
              </div>
            </div>

            {/* DOCTOR COMMISSION & LAB SUMMARY CARD (INTERNAL CLINIC USE ONLY - HIDDEN ON PRINT) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D]/60 border border-[#0840A8]/15 dark:border-[#0077D4]/30 text-xs print:hidden">
              <div className="flex justify-between items-center px-2 py-1">
                <span className="text-[#0077D4] dark:text-blue-200 font-semibold">Gasto de Laboratorio (Interno):</span>
                <span className="font-mono font-bold text-rose-300">
                  Bs. {Number(boleta.costo_laboratorio || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center px-2 py-1">
                <span className="text-[#0077D4] dark:text-blue-200 font-semibold">Comisión Doctor ({boleta.porcentaje_comision_dr || 40}%):</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Bs. {Number(boleta.monto_comision_dr || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* DYNAMIC INSTALLMENTS & CUOTAS MANAGER */}
          <div className="p-4 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D]/80 border border-[#0840A8]/15 dark:border-[#0077D4]/40 space-y-4 print:bg-white print:border-slate-400">
            {/* MANAGER HEADER & BALANCE SUMMARY */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 pb-3 print:border-slate-300">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#0077D4] dark:text-[#00C2E0] print:text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard size={15} />
                  <span>Gestión Dinámica de Cuotas y Abonos</span>
                </h4>
                <div className="text-[11px] text-[#0077D4] dark:text-blue-200 print:text-slate-600 flex items-center gap-3 font-mono">
                  <span>Abonado: <strong className="text-emerald-600 dark:text-emerald-400 print:text-emerald-800">Bs. {totalPagado.toFixed(2)}</strong></span>
                  <span>Saldo Pendiente: <strong className="text-amber-600 dark:text-amber-300 print:text-amber-800">Bs. {saldoPendiente.toFixed(2)}</strong></span>
                </div>
              </div>

              {canModifyCuotas ? (
                <button
                  type="button"
                  onClick={openAddForm}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#0840A8] hover:to-[#0077D4] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all print:hidden"
                >
                  <Plus size={14} />
                  <span>Agregar Cuota / Abono</span>
                </button>
              ) : (
                <div className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-600 text-amber-600 dark:text-amber-300 text-[11px] font-semibold flex items-center gap-1.5 print:hidden">
                  <Lock size={13} className="text-amber-400" />
                  <span>Bloqueado (Solo Administrador)</span>
                </div>
              )}
            </div>

            {/* COMPLETADO RESTRICTION NOTICE */}
            {isCompletado && !isAdmin && (
              <div className="p-2.5 rounded-lg bg-blue-950/80 border border-blue-500/40 text-[#0077D4] dark:text-blue-200 text-xs flex items-center gap-2 print:hidden font-mono">
                <Lock size={16} className="text-amber-400 shrink-0" />
                <span>
                  Esta boleta está en estado <strong>COMPLETADO</strong>. Las cuotas están protegidas y solo pueden ser modificadas por un <strong>Administrador</strong>.
                </span>
              </div>
            )}

            {/* BALANCE ALERT WARNING (If total cuotas sum does not match total boleta) */}
            {Math.abs(totalCuotasProgramadas - Number(boleta.monto_total)) > 0.01 && (
              <div className="p-2.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2 print:hidden font-mono">
                <AlertCircle size={16} className="text-amber-400 shrink-0" />
                <span>
                  Atención: La suma total de cuotas programadas (Bs. {totalCuotasProgramadas.toFixed(2)}) difiere del total de la boleta (Bs. {Number(boleta.monto_total).toFixed(2)}). Puede ajustar o agregar cuotas.
                </span>
              </div>
            )}

            {/* FORM TO ADD OR EDIT A CUOTA */}
            {(isAddingCuota || editingCuota) && canModifyCuotas && (
              <form onSubmit={handleSaveCuota} className="p-4 rounded-xl bg-[#E5F7FF] dark:bg-[#0840A8]/30 border border-[#0840A8]/15 dark:border-[#00C2E0]/50 space-y-3 print:hidden">
                <div className="flex items-center justify-between pb-2 border-b border-[#0840A8]/15 dark:border-[#00C2E0]/30">
                  <h5 className="text-xs font-bold text-[#0077D4] dark:text-[#00C2E0] uppercase tracking-wider">
                    {editingCuota ? `Editar ${editingCuota.modo_pago || 'Cuota'}` : 'Registrar Nueva Cuota / Abono'}
                  </h5>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCuota(false);
                      setEditingCuota(null);
                    }}
                    className="text-[#0840A8] dark:text-white/60 hover:text-[#0840A8] dark:text-white cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {/* MONTO */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#0077D4] dark:text-blue-200 mb-1">
                      Monto (Bs.)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={cuotaForm.monto_cuota}
                      onChange={(e) =>
                        setCuotaForm({ ...cuotaForm, monto_cuota: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0077D4] text-[#0840A8] dark:text-white focus:outline-none focus:border-[#00C2E0] font-mono"
                    />
                  </div>

                  {/* DESCRIPCIÓN / MODO DE PAGO */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#0077D4] dark:text-blue-200 mb-1">
                      Descripción (Ej: Abono 2)
                    </label>
                    <input
                      type="text"
                      required
                      value={cuotaForm.modo_pago}
                      onChange={(e) => setCuotaForm({ ...cuotaForm, modo_pago: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0077D4] text-[#0840A8] dark:text-white focus:outline-none focus:border-[#00C2E0]"
                    />
                  </div>

                  {/* FECHA PAGO */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#0077D4] dark:text-blue-200 mb-1">
                      Fecha Pago / Programada
                    </label>
                    <input
                      type="date"
                      required
                      value={cuotaForm.fecha_pago}
                      onChange={(e) => setCuotaForm({ ...cuotaForm, fecha_pago: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0077D4] text-[#0840A8] dark:text-white focus:outline-none focus:border-[#00C2E0] font-mono"
                    />
                  </div>

                  {/* METODO DE PAGO */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#0077D4] dark:text-blue-200 mb-1">
                      Método de Pago
                    </label>
                    <select
                      value={cuotaForm.metodo_pago}
                      onChange={(e) => setCuotaForm({ ...cuotaForm, metodo_pago: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0077D4] text-[#0840A8] dark:text-white focus:outline-none focus:border-[#00C2E0]"
                    >
                      <option value="Efectivo">Efectivo</option>
                      <option value="QR">QR Transferencia</option>
                      <option value="Tarjeta">Tarjeta Débito/Crédito</option>
                      <option value="Transferencia">Transferencia Bancaria</option>
                    </select>
                  </div>
                </div>

                {/* ESTADO DE CUOTA */}
                <div className="flex items-center gap-4 text-xs pt-1">
                  <span className="font-semibold text-[#0077D4] dark:text-blue-200">Estado:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="cuota_estado"
                      value="pendiente"
                      checked={cuotaForm.estado === 'pendiente'}
                      onChange={() => setCuotaForm({ ...cuotaForm, estado: 'pendiente' })}
                      className="accent-[#00C2E0]"
                    />
                    <span className="text-amber-600 dark:text-amber-300 font-bold">Pendiente</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="cuota_estado"
                      value="pagado"
                      checked={cuotaForm.estado === 'pagado'}
                      onChange={() => setCuotaForm({ ...cuotaForm, estado: 'pagado' })}
                      className="accent-[#00C2E0]"
                    />
                    <span className="text-emerald-300 font-bold">Pagado</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCuota(false);
                      setEditingCuota(null);
                    }}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loadingAction}
                    className="px-4 py-1 rounded-lg bg-[#00C2E0] hover:bg-[#0077D4] text-[#001C3D] font-bold text-xs cursor-pointer disabled:opacity-50"
                  >
                    {loadingAction ? 'Guardando...' : editingCuota ? 'Actualizar Cuota' : 'Guardar Cuota'}
                  </button>
                </div>
              </form>
            )}

            {/* CUOTAS LIST TABLE */}
            {boleta.cuotas && boleta.cuotas.length > 0 ? (
              <div className="divide-y divide-[#0840A8]/15 dark:divide-[#0840A8]/30 text-xs">
                {boleta.cuotas.map((cuota, idx) => {
                  const isPaid = cuota.estado === 'pagado';
                  const modoPagoText = (cuota.modo_pago || `Cuota ${idx + 1}`).replace(/Cuenta/gi, 'Cuota');

                  return (
                    <div
                      key={cuota.id || idx}
                      className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono hover:bg-[#0840A8]/10 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[#0840A8] dark:text-white print:text-slate-900">
                          #{cuota.numero_cuota || idx + 1} - {modoPagoText}
                        </span>
                        {isPaid ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Pagado ({cuota.metodo_pago || 'Efectivo'}) - {cuota.fecha_pago ? String(cuota.fecha_pago).split('T')[0] : 'Fecha registrada'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                            Pendiente ({cuota.fecha_pago ? String(cuota.fecha_pago).split('T')[0] : 'Sin fecha'})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                        <span className="font-bold text-[#0077D4] dark:text-[#00C2E0] print:text-slate-900 text-sm">
                          Bs. {Number(cuota.monto_cuota).toFixed(2)}
                        </span>

                        {canModifyCuotas && (
                          <div className="flex items-center gap-1.5 print:hidden">
                            {!isPaid && cuota.id && (
                              <button
                                type="button"
                                disabled={payingCuotaId === cuota.id || loadingAction}
                                onClick={() => handlePagarCuota(cuota.id!)}
                                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white text-[11px] font-bold hover:from-[#0840A8] hover:to-[#0077D4] cursor-pointer disabled:opacity-50"
                                title="Marcar esta cuota como pagada"
                              >
                                {payingCuotaId === cuota.id ? 'Registrando...' : 'Cobrar'}
                              </button>
                            )}

                            <button
                              type="button"
                              disabled={loadingAction}
                              onClick={() => openEditForm(cuota)}
                              className="p-1 rounded bg-white/10 hover:bg-white/20 text-[#0077D4] dark:text-blue-200 hover:text-[#0840A8] dark:text-white cursor-pointer"
                              title="Editar cuota"
                            >
                              <Pencil size={14} />
                            </button>

                            {cuota.id && (
                              <button
                                type="button"
                                disabled={loadingAction}
                                onClick={() => handleDeleteCuota(cuota.id!)}
                                className="p-1 rounded bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 hover:text-rose-100 cursor-pointer"
                                title="Eliminar cuota"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 text-center text-xs text-[#0077D4] dark:text-blue-200/70 italic">
                No hay cuotas desglosadas registradas para esta boleta.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-between bg-[#0840A8]/20 shrink-0 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white text-xs font-semibold cursor-pointer transition-all border border-white/10"
          >
            Cerrar
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPdfModal(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#0840A8] hover:to-[#0077D4] text-white text-xs font-bold shadow-md shadow-[#0077D4]/30 cursor-pointer transition-all flex items-center gap-2"
            >
              <FileText size={16} />
              <span>Imprimir / Ver PDF (React-PDF)</span>
            </button>
          </div>
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

