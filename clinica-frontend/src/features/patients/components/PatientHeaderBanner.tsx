import React from 'react';
import { Phone, Calendar, MapPin, Edit3, Trash2, Building2 } from 'lucide-react';
import type { Paciente } from '../types/patient';

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
  const getInitials = (name: string, lastName: string) => {
    const n = name ? name.charAt(0).toUpperCase() : 'P';
    const l = lastName ? lastName.charAt(0).toUpperCase() : 'A';
    return `${n}${l}`;
  };

  const initials = getInitials(patient.nombre, patient.apellido);

  return (
    <div className="bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Avatar & Info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0077D4] to-[#00C2E0] text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-md shadow-[#0077D4]/20 border-2 border-white">
            {initials}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-[#0840A8] dark:text-white">
                {patient.nombre} {patient.apellido}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#E5F7FF] dark:bg-[#0840A8] text-[#0840A8] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/40">
                {patient.codigo_paciente}
              </span>
              {patient.sucursal && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E5F7FF] text-[#0840A8] border border-[#0840A8]/15 dark:border-[#00C2E0]/40 dark:bg-[#0840A8]/60 dark:text-[#00C2E0]">
                  <Building2 size={11} className="text-[#0077D4] dark:text-[#00C2E0]" />
                  {patient.sucursal.ubicacion}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E5F7FF] text-[#0840A8] border border-[#0840A8]/15 dark:border-[#00C2E0]/40 dark:bg-[#0840A8]/60 dark:text-[#00C2E0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C2E0] animate-pulse" />
                PACIENTE ACTIVO
              </span>
            </div>

            <div className="flex items-center gap-4 flex-wrap mt-1 text-xs text-[#002D5E] dark:text-slate-200 font-semibold">
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
                {patient.edad} años ({patient.sexo})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Phone size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
                {patient.celular || 'Sin celular'}
              </span>
              {patient.domicilio_actual && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 truncate max-w-[250px]">
                    <MapPin size={13} className="text-[#0077D4] dark:text-[#00C2E0] shrink-0" />
                    {patient.domicilio_actual}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onEdit}
            className="px-3.5 py-2 rounded-xl bg-[#F4F9FF] dark:bg-[#0840A8]/60 hover:bg-white text-[#0840A8] dark:text-white border border-[#0840A8]/15 dark:border-[#0840A8]/20 dark:border-[#00C2E0]/40 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
          >
            <Edit3 size={14} className="text-[#0077D4] dark:text-[#00C2E0]" />
            <span>Editar Datos</span>
          </button>

          <button
            onClick={onDelete}
            className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/80 dark:text-rose-300 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800/60 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
          >
            <Trash2 size={14} />
            <span>Suspender</span>
          </button>
        </div>
      </div>
    </div>
  );
};
