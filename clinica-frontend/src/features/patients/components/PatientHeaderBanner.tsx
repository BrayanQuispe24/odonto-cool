import React, { useState, useEffect } from 'react';
import { Phone, Calendar, MapPin, Edit3, Trash2, Building2, Printer } from 'lucide-react';
import type { Paciente } from '../types/patient';
import type { BoletaServicioPrestado } from '../../boletas/types/boleta';
import { getBoletasApi } from '../../boletas/services/boletaService';
import { HistorialPDFViewerModal } from './HistorialPDFViewerModal';
import { toast } from 'sonner';

interface PatientHeaderBannerProps {
  patient: Paciente;
  onEdit: () => void;
  onDelete: () => void;
}

export const PatientHeaderBanner: React.FC<PatientHeaderBannerProps> = ({
  patient,
  onEdit,
  onDelete,
}) => {
  const [showPDF, setShowPDF] = useState(false);
  const [boletas, setBoletas] = useState<BoletaServicioPrestado[]>([]);

  useEffect(() => {
    if (showPDF && patient) {
      getBoletasApi({ paciente_id: patient.id })
        .then(setBoletas)
        .catch(() => toast.error('Error al cargar historial para imprimir'));
    }
  }, [showPDF, patient]);

  const getInitials = (name: string, lastName: string) => {
    const n = name ? name.charAt(0).toUpperCase() : 'P';
    const l = lastName ? lastName.charAt(0).toUpperCase() : 'A';
    return `${n}${l}`;
  };

  const initials = getInitials(patient.nombre, patient.apellido);

  return (
    <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm p-3 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left: Avatar & Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-[#0840A8] dark:bg-dark-bg border border-primary text-white font-bold text-sm flex items-center justify-center shrink-0">
          {initials}
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="text-sm font-bold text-primary-dark dark:text-white">
              {patient.nombre} {patient.apellido}
            </h2>
            <span className="px-1.5 py-0.5 rounded text-tiny font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {patient.codigo_paciente}
            </span>
            {patient.sucursal && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <Building2 size={10} className="text-primary dark:text-secondary" />
                {patient.sucursal.ubicacion}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              ACTIVO
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap text-small text-slate-600 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-primary dark:text-secondary" />
              {patient.edad} años ({patient.sexo})
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Phone size={12} className="text-primary dark:text-secondary" />
              {patient.celular || 'Sin celular'}
            </span>
            {patient.domicilio_actual && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 truncate max-w-[300px]">
                  <MapPin size={12} className="text-primary dark:text-secondary shrink-0" />
                  {patient.domicilio_actual}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Quick Action Buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => setShowPDF(true)}
          className="px-3 py-1.5 rounded bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 text-small font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Printer size={13} />
          <span>Imprimir Historial</span>
        </button>

        <button
          onClick={onEdit}
          className="px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-small font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Edit3 size={13} className="text-primary dark:text-secondary" />
          <span>Editar Datos</span>
        </button>

        <button
          onClick={onDelete}
          className="px-3 py-1.5 rounded bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 text-small font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Trash2 size={13} />
          <span>Suspender</span>
        </button>
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
