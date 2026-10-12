import React, { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { X, Download, Printer } from 'lucide-react';
import type { Paciente } from '../types/patient';
import type { Antecedente } from '../types/antecedente';
import { getAntecedentesApi } from '../services/patientService';
import { useExpedienteStore } from '../../expedientes/store/useExpedienteStore';
import { HistorialPDFDocument } from './HistorialPDFDocument';
import type { BoletaServicioPrestado } from '../../boletas/types/boleta';

interface HistorialPDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Paciente;
  boletas: BoletaServicioPrestado[];
}

export const HistorialPDFViewerModal: React.FC<HistorialPDFViewerModalProps> = ({
  isOpen,
  onClose,
  patient,
  boletas = [],
}) => {
  const [antecedente, setAntecedente] = useState<Partial<Antecedente>>({});
  const { expedientes, fetchExpedientes } = useExpedienteStore();

  useEffect(() => {
    if (isOpen && patient) {
      getAntecedentesApi(patient.id)
        .then((data) => setAntecedente(data || {}))
        .catch(console.error);
      fetchExpedientes();
    }
  }, [isOpen, patient, fetchExpedientes]);

  if (!isOpen || !patient) return null;

  const patientExpedientes = expedientes.filter(e => e.paciente_id === patient.id);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl w-full max-w-5xl overflow-hidden flex flex-col h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-dark-bg shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#0077D4]/10 text-[#0077D4] dark:text-[#0077D4]">
              <Printer size={18} />
            </div>
            <div>
              <h3 className="text-small font-bold uppercase tracking-wider text-primary-dark dark:text-slate-200">
                Vista Previa - Historial Clínico (Facturado)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                Paciente: {patient.nombre} {patient.apellido} | Cód: {patient.codigo_paciente}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PDFDownloadLink
              document={<HistorialPDFDocument patient={patient} boletas={boletas} antecedente={antecedente} expedientes={patientExpedientes} />}
              fileName={`Historial_Clinico_${patient.codigo_paciente}.pdf`}
              className="px-4 py-1.5 rounded bg-[#0077D4] hover:bg-[#0840A8] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              {({ loading }) => (
                <>
                  <Download size={15} />
                  <span>{loading ? 'Generando PDF...' : 'Descargar PDF'}</span>
                </>
              )}
            </PDFDownloadLink>

            <button
              onClick={onClose}
              className="p-1.5 rounded-sm text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PDF Viewer Container */}
        <div className="flex-1 bg-slate-200 dark:bg-slate-900 w-full overflow-hidden">
          <PDFViewer className="w-full h-full border-0">
            <HistorialPDFDocument patient={patient} boletas={boletas} antecedente={antecedente} expedientes={patientExpedientes} />
          </PDFViewer>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-dark-bg shrink-0 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Documento estructurado con <strong>@react-pdf/renderer</strong>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 text-small font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

