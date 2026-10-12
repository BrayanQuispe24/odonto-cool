import React, { useState, useEffect } from 'react';
import { Clock, Stethoscope, Calendar, Printer, FileText, CheckCircle2, Clock as ClockIcon, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Paciente } from '../types/patient';
import type { BoletaServicioPrestado } from '../../boletas/types/boleta';
import { getBoletasApi } from '../../boletas/services/boletaService';
import { HistorialPDFViewerModal } from './HistorialPDFViewerModal';

interface PatientHistorialTabProps {
  patient: Paciente;
}

const EstadoBadge: React.FC<{ estado?: string }> = ({ estado }) => {
  if (estado === 'completado' || estado === 'pagada') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-cyan-50 dark:bg-cyan-900/30 text-primary dark:text-secondary border border-cyan-200 dark:border-cyan-800">
        <CheckCircle2 size={10} />
        COMPLETADO
      </span>
    );
  }
  if (estado === 'anulada') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
        <XCircle size={10} />
        ANULADA
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
      <ClockIcon size={10} />
      PENDIENTE
    </span>
  );
};

export const PatientHistorialTab: React.FC<PatientHistorialTabProps> = ({ patient }) => {
  const [boletas, setBoletas] = useState<BoletaServicioPrestado[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPDF, setShowPDF] = useState(false);

  useEffect(() => {
    const fetchHistorial = async () => {
      setLoading(true);
      try {
        const data = await getBoletasApi({ paciente_id: patient.id });
        setBoletas(data);
      } catch (err) {
        toast.error('Error al cargar el historial clínico');
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, [patient.id]);

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm p-4 flex items-center justify-between gap-4 shadow-sm">
        <div>
          <h3 className="text-xs font-bold text-primary-dark dark:text-slate-200 flex items-center gap-1.5">
            <Clock size={14} className="text-primary dark:text-secondary" />
            <span>Historial Clínico & Evolución (Facturado)</span>
          </h3>
          <p className="text-small text-slate-500 dark:text-slate-400 mt-1">
            Registro cronológico de los servicios prestados y tratamientos según boletas emitidas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPDF(true)}
            className="px-4 py-1.5 rounded bg-white dark:bg-dark-bg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-small font-semibold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
          >
            <Printer size={13} />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* ENTERPRISE DATA GRID FOR HISTORY */}
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-small whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-dark-bg text-primary-dark dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-2 font-semibold uppercase tracking-wider w-[15%]">Fecha</th>
                <th className="px-4 py-2 font-semibold uppercase tracking-wider w-[25%]">Doctor</th>
                <th className="px-4 py-2 font-semibold uppercase tracking-wider w-[60%]">Tratamientos Realizados</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-500 font-medium">
                    Cargando historial de servicios...
                  </td>
                </tr>
              ) : boletas.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    El paciente no tiene servicios facturados registrados.
                  </td>
                </tr>
              ) : (
                boletas.map((boleta) => {
                  const docName = boleta.doctor
                    ? `${boleta.doctor.nombre} ${boleta.doctor.apellido}`
                    : boleta.cita?.doctor
                    ? `${boleta.cita.doctor.nombre} ${boleta.cita.doctor.apellido}`
                    : 'Sin especificar';

                  const tratamientos =
                    boleta.detalles && boleta.detalles.length > 0
                      ? boleta.detalles
                      : [];

                  return (
                    <tr key={boleta.id} className="hover:bg-slate-50 dark:hover:bg-dark-bg/50 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-slate-600 dark:text-slate-400 align-top">
                        <div className="flex items-center gap-1 mt-0.5 font-bold">
                          <Calendar size={11} />
                          {String(boleta.fecha_emision).split('T')[0]}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300 align-top font-medium">
                        <div className="flex items-center gap-1 mt-0.5">
                          <Stethoscope size={11} className="text-primary dark:text-secondary" />
                          {docName}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 align-top whitespace-normal min-w-[280px]">
                        {tratamientos.length > 0 ? (
                          <ul className="space-y-1.5">
                            {tratamientos.map((det, idx) => (
                              <li key={idx} className="flex gap-1.5 items-start">
                                <FileText size={12} className="text-slate-400 mt-0.5 shrink-0" />
                                <span className="text-slate-700 dark:text-slate-200">
                                  {det.servicio?.nombre || det.descripcion || 'Tratamiento General'}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-slate-400 italic">No hay detalles</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <HistorialPDFViewerModal
        isOpen={showPDF}
        onClose={() => setShowPDF(false)}
        patient={patient}
        boletas={boletas}
      />
    </div>
  );
};

