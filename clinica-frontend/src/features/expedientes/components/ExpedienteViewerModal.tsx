import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import type { Expediente } from '../types/expediente';

interface ExpedienteViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  expediente: Expediente | null;
}

export const ExpedienteViewerModal: React.FC<ExpedienteViewerModalProps> = ({
  isOpen,
  onClose,
  expediente,
}) => {
  if (!isOpen || !expediente) return null;

  // Assuming backend returns relative path inside public storage (e.g. "expedientes/xyz.pdf")
  // We need to construct the full URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  // Strip '/api' from the end of the base URL to point to the public root
  const baseUrl = API_URL.replace(/\/api\/?$/, '');
  
  const fileUrl = `${baseUrl}/storage/${expediente.archivo_path}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-[#001C3D]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#F4F9FF] dark:bg-[#001C3D] w-full max-w-5xl h-[85vh] rounded-2xl flex flex-col shadow-2xl border border-[#0840A8]/20 dark:border-[#00C2E0]/30 overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#0840A8]/15 dark:border-[#00C2E0]/30 bg-white dark:bg-[#002D5E] shrink-0">
          <div>
            <h2 className="text-lg font-extrabold text-[#0840A8] dark:text-white line-clamp-1">
              {expediente.titulo}
            </h2>
            <p className="text-xs font-semibold text-[#0077D4] dark:text-[#00C2E0]">
              {expediente.paciente?.nombre} {expediente.paciente?.apellido} • {expediente.tipo_documento}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E5F7FF] dark:bg-[#0077D4]/30 text-[#0077D4] dark:text-[#00C2E0] hover:bg-[#0077D4] hover:text-white dark:hover:bg-[#0077D4]/50 transition-colors text-xs font-bold"
            >
              <ExternalLink size={14} />
              <span>Abrir en otra pestaña</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#0077D4] hover:bg-[#E5F7FF] dark:text-blue-200 dark:hover:bg-[#0840A8]/30 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div className="flex-1 w-full h-full bg-[#E5F7FF] dark:bg-[#001836] p-2 sm:p-4">
          {/* We use an iframe to render the PDF natively in the browser */}
          <iframe
            src={fileUrl}
            title={expediente.titulo}
            className="w-full h-full rounded-xl border border-[#0840A8]/20 dark:border-[#00C2E0]/20 shadow-inner bg-white dark:bg-[#002D5E]"
          />
        </div>
        
        {/* Footer info (optional) */}
        {expediente.descripcion && (
          <div className="px-6 py-3 bg-white dark:bg-[#002D5E] border-t border-[#0840A8]/15 dark:border-[#00C2E0]/30 shrink-0">
            <p className="text-xs text-[#0840A8] dark:text-blue-100">
              <span className="font-bold text-[#0077D4] dark:text-[#00C2E0]">Descripción: </span>
              {expediente.descripcion}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
