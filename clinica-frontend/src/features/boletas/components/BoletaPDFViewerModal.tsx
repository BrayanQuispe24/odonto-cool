import React from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { X, Download, FileText } from 'lucide-react';
import type { BoletaServicioPrestado } from '../types/boleta';
import { BoletaPDFDocument } from './BoletaPDFDocument';

interface BoletaPDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  boleta: BoletaServicioPrestado | null;
}

export const BoletaPDFViewerModal: React.FC<BoletaPDFViewerModalProps> = ({
  isOpen,
  onClose,
  boleta,
}) => {
  if (!isOpen || !boleta) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/40 rounded-2xl shadow-2xl shadow-[#001C3D]/90 w-full max-w-5xl overflow-hidden text-[#0840A8] dark:text-white flex flex-col h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-between bg-gradient-to-r from-[#0840A8] via-[#0077D4] to-[#00C2E0] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/15 border border-white/20 text-[#0077D4] dark:text-[#00C2E0]">
              <FileText size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2 text-[#0840A8] dark:text-white">
                <span>Vista Previa de Boleta en PDF (React PDF)</span>
              </h3>
              <p className="text-xs text-[#0077D4] dark:text-blue-100/90 font-mono">
                Boleta Nº {boleta.numero_boleta} | Paciente:{' '}
                {boleta.cita?.paciente
                  ? `${boleta.cita.paciente.nombre} ${boleta.cita.paciente.apellido}`
                  : 'Paciente General'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <PDFDownloadLink
              document={<BoletaPDFDocument boleta={boleta} />}
              fileName={`Boleta-${boleta.numero_boleta}.pdf`}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0840A8] dark:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/30"
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
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white/80 hover:text-[#0840A8] dark:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Viewer Container */}
        <div className="flex-1 bg-slate-900 w-full overflow-hidden p-2">
          <PDFViewer className="w-full h-full border-0 rounded-xl">
            <BoletaPDFDocument boleta={boleta} />
          </PDFViewer>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-between bg-[#0840A8]/20 shrink-0 text-xs text-[#0077D4] dark:text-blue-200/80">
          <div>
            Generado con <strong>@react-pdf/renderer</strong> • Listo para imprimir o descargar
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white text-xs font-semibold cursor-pointer transition-all border border-white/10"
          >
            Cerrar Vista Previa
          </button>
        </div>
      </div>
    </div>
  );
};
