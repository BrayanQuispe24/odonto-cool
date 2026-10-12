import React from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { X, Download, FileText } from 'lucide-react';
import type { BoletaServicioPrestado } from '../types/boleta';
import { BoletasListPDFDocument } from './BoletasListPDFDocument';

interface BoletasListPDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  boletas: BoletaServicioPrestado[];
  fechaDesde?: string;
  fechaHasta?: string;
}

export const BoletasListPDFViewerModal: React.FC<BoletasListPDFViewerModalProps> = ({
  isOpen,
  onClose,
  boletas,
  fechaDesde,
  fechaHasta,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl w-full max-w-5xl overflow-hidden text-slate-800 dark:text-slate-200 flex flex-col h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-dark-surface shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-sm bg-[#0077D4]/10 dark:bg-[#0077D4]/20 text-[#0077D4]">
              <FileText size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2 text-primary-dark dark:text-white">
                <span>Vista Previa del Reporte de Boletas (React PDF)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                Total de registros: {boletas.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <PDFDownloadLink
              document={
                <BoletasListPDFDocument
                  boletas={boletas}
                  fechaDesde={fechaDesde}
                  fechaHasta={fechaHasta}
                />
              }
              fileName={`Reporte-Boletas-${new Date().toISOString().split('T')[0]}.pdf`}
              className="px-4 py-2 rounded-sm bg-[#0077D4] hover:bg-[#0840A8] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
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
              className="p-1.5 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Viewer Container */}
        <div className="flex-1 bg-slate-200 dark:bg-slate-900 w-full overflow-hidden p-0 sm:p-2 border-y border-slate-200 dark:border-slate-800">
          <PDFViewer className="w-full h-full border-0 rounded-sm">
            <BoletasListPDFDocument
              boletas={boletas}
              fechaDesde={fechaDesde}
              fechaHasta={fechaHasta}
            />
          </PDFViewer>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-dark-bg flex items-center justify-between shrink-0 text-small text-slate-500 dark:text-slate-400">
          <div>
            Generado con <strong>@react-pdf/renderer</strong> • Listo para imprimir o descargar
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-sm bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-small font-semibold shadow-sm cursor-pointer transition-colors"
          >
            Cerrar Vista Previa
          </button>
        </div>
      </div>
    </div>
  );
};
