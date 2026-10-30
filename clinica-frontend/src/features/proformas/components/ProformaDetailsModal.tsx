import React from 'react';
import {
  X,
  FileText,
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Building2,
  DollarSign,
  Calendar,
  Receipt,
  ArrowRight,
} from 'lucide-react';
import type { Proforma } from '../types/proforma';

interface ProformaDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  proforma: Proforma | null;
  onOpenPdf: (proforma: Proforma) => void;
  onOpenAprobarModal: (proforma: Proforma) => void;
  onFacturar: (proforma: Proforma) => void;
}

export const ProformaDetailsModal: React.FC<ProformaDetailsModalProps> = ({
  isOpen,
  onClose,
  proforma,
  onOpenPdf,
  onOpenAprobarModal,
  onFacturar,
}) => {
  if (!isOpen || !proforma) return null;

  const isBorrador = proforma.estado === 'Borrador';
  const isAprobado = proforma.estado === 'Aprobado';
  const isRechazado = proforma.estado === 'Rechazado';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl w-full max-w-3xl overflow-hidden text-slate-800 dark:text-slate-200 flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-dark-bg shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-primary/10 text-primary">
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-primary-dark dark:text-white">
                  Presupuesto {proforma.codigo_proforma}
                </h3>
                <span
                  className={`text-tiny uppercase font-bold px-2 py-0.5 rounded border ${
                    isAprobado
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                      : isRechazado
                      ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {proforma.estado}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Emitido el {String(proforma.fecha_emision).split('T')[0]} • Vigencia: {proforma.dias_validez} días
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* BANNER INFORMATIVO SEGÚN ESTADO */}
          {isBorrador && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-sm text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
                <span>
                  Esta cotización está en <strong>Borrador</strong>. Si el cliente decide realizarse el tratamiento, cámbiala a <strong>Aprobado</strong> para continuar con el registro y facturación.
                </span>
              </div>
              <button
                onClick={() => onOpenAprobarModal(proforma)}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-xs shrink-0 ml-3 transition-colors cursor-pointer"
              >
                Gestionar Aprobación
              </button>
            </div>
          )}

          {isAprobado && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-sm text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  Presupuesto <strong>Aprobado</strong>. {proforma.paciente ? `Vinculado al paciente ${proforma.paciente.nombre} ${proforma.paciente.apellido} (${proforma.paciente.codigo_paciente}).` : 'Paciente listo para atención.'}
                </span>
              </div>
              <button
                onClick={() => onFacturar(proforma)}
                className="px-3 py-1 bg-[#0077D4] hover:bg-[#0840A8] text-white rounded font-bold text-xs flex items-center gap-1.5 shrink-0 ml-3 transition-colors cursor-pointer shadow-sm"
              >
                <Receipt size={14} />
                <span>Emitir Boleta</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}

          {isRechazado && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-sm text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
              <XCircle size={16} className="text-rose-600 dark:text-rose-400 shrink-0" />
              <span>
                Esta cotización fue <strong>Rechazada</strong> por el cliente. El flujo comercial culminó y no genera citas ni boletas.
              </span>
            </div>
          )}

          {/* DATOS DEL CLIENTE Y DOCTOR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-dark-bg p-4 rounded-sm border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="font-bold uppercase tracking-wider text-slate-400 text-tiny block mb-1">
                Cliente / Prospecto
              </span>
              <p className="font-bold text-sm text-slate-800 dark:text-white">
                {proforma.nombre} {proforma.apellido}
              </p>
              <p className="text-slate-500 mt-1">
                Edad: <strong className="text-slate-700 dark:text-slate-300">{proforma.edad} años</strong> • Sexo:{' '}
                <strong className="text-slate-700 dark:text-slate-300">{proforma.sexo}</strong>
              </p>
              <p className="text-slate-500 mt-0.5">
                Celular / WhatsApp: <strong className="font-mono text-primary">{proforma.celular}</strong>
              </p>
              {proforma.domicilio_actual && (
                <p className="text-slate-500 mt-0.5">Domicilio: {proforma.domicilio_actual}</p>
              )}
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider text-slate-400 text-tiny block mb-1">
                Sede y Especialista
              </span>
              <p className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Building2 size={13} className="text-primary" />
                <span>{proforma.sucursal?.nombre || 'Sucursal Central'}</span>
              </p>
              <p className="text-slate-500 mt-1 flex items-center gap-1.5">
                <UserCheck size={13} className="text-slate-400" />
                <span>
                  {proforma.doctor
                    ? `Dr. ${proforma.doctor.nombre} ${proforma.doctor.apellido}`
                    : 'Sin doctor asignado'}
                </span>
              </p>
              {proforma.paciente && (
                <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-1.5">
                  Paciente Registrado: {proforma.paciente.codigo_paciente}
                </p>
              )}
            </div>
          </div>

          {/* TABLA DE SERVICIOS */}
          <div>
            <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-tiny block mb-2">
              Tratamientos y Servicios Cotizados
            </span>
            <div className="border border-slate-200 dark:border-slate-800 rounded-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-dark-bg text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold uppercase text-tiny">
                  <tr>
                    <th className="px-3 py-2">#</th>
                    <th className="px-3 py-2">Tratamiento</th>
                    <th className="px-3 py-2 text-right">Precio Base</th>
                    <th className="px-3 py-2 text-right">Descuento</th>
                    <th className="px-3 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {(proforma.detalles || []).map((det, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-3 py-2 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="px-3 py-2 font-semibold text-slate-800 dark:text-slate-200">
                        {det.nombre_servicio || det.servicio?.nombre}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-slate-600 dark:text-slate-300">
                        Bs. {Number(det.precio).toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-rose-600 dark:text-rose-400">
                        {Number(det.descuento) > 0 ? `-Bs. ${Number(det.descuento).toFixed(2)}` : '0.00'}
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-primary dark:text-secondary">
                        Bs. {Number(det.subtotal).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 dark:bg-dark-bg border-t border-slate-200 dark:border-slate-800 font-bold text-xs">
                  <tr>
                    <td colSpan={4} className="px-3 py-2.5 text-right uppercase tracking-wider text-slate-500">
                      Monto Total Presupuestado:
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-base text-[#0840A8] dark:text-secondary">
                      Bs. {Number(proforma.monto_total).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* OBSERVACIONES */}
          {proforma.observaciones && (
            <div className="bg-slate-50 dark:bg-dark-bg p-3 rounded-sm border border-slate-200 dark:border-slate-800 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-tiny block mb-1">
                Observaciones del Doctor
              </span>
              <p className="text-slate-700 dark:text-slate-300">{proforma.observaciones}</p>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between shrink-0">
          <button
            onClick={() => onOpenPdf(proforma)}
            className="px-3.5 py-1.5 rounded-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300 dark:border-slate-700"
          >
            <Printer size={14} />
            <span>Imprimir Proforma (PDF)</span>
          </button>

          <div className="flex items-center gap-2">
            {isBorrador && (
              <button
                onClick={() => onOpenAprobarModal(proforma)}
                className="px-4 py-1.5 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <CheckCircle2 size={14} />
                <span>Aprobar / Concretar</span>
              </button>
            )}

            {isAprobado && (
              <button
                onClick={() => onFacturar(proforma)}
                className="px-4 py-1.5 rounded-sm bg-[#0077D4] hover:bg-[#0840A8] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Receipt size={14} />
                <span>Emitir Boleta / Facturar</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-sm bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
