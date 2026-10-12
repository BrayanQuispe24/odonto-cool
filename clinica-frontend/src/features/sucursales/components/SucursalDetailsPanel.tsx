import React from 'react';
import {
  X,
  Building2,
  MapPin,
  Phone,
  Clock,
  UserCheck,
  Users,
  ShieldCheck,
  Stethoscope,
  Mail,
  UserPlus,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import type { Sucursal } from '../types/sucursal';
import { useUserRole } from '../../../hooks/useUserRole';

interface SucursalDetailsPanelProps {
  sucursal: Sucursal | null;
  onClose: () => void;
  onOpenAssignModal?: () => void;
}

export const SucursalDetailsPanel: React.FC<SucursalDetailsPanelProps> = ({
  sucursal,
  onClose,
  onOpenAssignModal,
}) => {
  if (!sucursal) return null;

  const { isAdmin } = useUserRole();
  const doctores = sucursal.doctores || [];

  return (
    <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm w-full overflow-hidden text-slate-800 dark:text-slate-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-dark-bg shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-sm bg-[#0077D4]/10 dark:bg-[#0077D4]/20 text-[#0077D4]">
            <Building2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-micro font-mono font-bold px-2 py-0.5 rounded-sm bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase">
                {sucursal.codigo_sucursal}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-micro font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                  sucursal.estado
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                    : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800'
                }`}
              >
                {sucursal.estado ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                {sucursal.estado ? 'Operativa' : 'Inactiva'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-primary-dark dark:text-white mt-1.5 leading-snug">
              {sucursal.nombre}
            </h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content Body */}
      <div className="p-6 space-y-6 overflow-y-auto flex-1 scroll-smooth">
        {/* Main Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
            <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider mb-2">
              <MapPin size={14} className="text-slate-400" />
              <span>Ubicación & Dirección</span>
            </div>
            <p className="text-small font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
              {sucursal.ubicacion}
            </p>
          </div>

          <div className="p-4 rounded-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
            <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider mb-2">
              <Phone size={14} className="text-slate-400" />
              <span>Teléfono de Contacto</span>
            </div>
            <p className="text-small font-medium text-slate-700 dark:text-slate-300">
              {sucursal.telefono || 'Sin número registrado'}
            </p>
          </div>

          <div className="p-4 rounded-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
            <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider mb-2">
              <Clock size={14} className="text-slate-400" />
              <span>Horario de Atención</span>
            </div>
            <p className="text-small font-medium text-slate-700 dark:text-slate-300">
              {sucursal.horario_atencion || 'Horario continuo'}
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div>
            <div className="text-2xl font-bold text-primary-dark dark:text-white">
              {doctores.length > 0 ? doctores.length : sucursal.doctores_count ?? 0}
            </div>
            <div className="text-micro font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1 mt-0.5">
              <UserCheck size={12} /> Doctores Asignados
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold text-primary-dark dark:text-white">
              {sucursal.pacientes_count ?? 0}
            </div>
            <div className="text-micro font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1 mt-0.5">
              <Users size={12} /> Pacientes Registrados
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold text-primary-dark dark:text-white">
              {sucursal.users_count ?? 0}
            </div>
            <div className="text-micro font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1 mt-0.5">
              <ShieldCheck size={12} /> Usuarios en Sistema
            </div>
          </div>
        </div>

        {/* Doctors Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <h3 className="font-bold text-small text-slate-800 dark:text-slate-200 flex items-center gap-2 uppercase tracking-wider">
              <Stethoscope size={16} className="text-slate-500" />
              <span>Especialistas Médicos Asignados ({doctores.length})</span>
            </h3>

            {isAdmin && onOpenAssignModal && (
              <button
                onClick={onOpenAssignModal}
                className="px-3 py-1.5 rounded-sm bg-[#0077D4] hover:bg-[#0840A8] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
              >
                <UserPlus size={14} />
                <span>Asignar Doctor</span>
              </button>
            )}
          </div>

          {doctores.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-dark-bg rounded-sm border border-slate-200 dark:border-slate-800">
              <Stethoscope size={32} className="mx-auto text-slate-400 mb-2" />
              <p className="text-small font-bold text-slate-700 dark:text-slate-300">
                No hay médicos asignados a esta sucursal actualmente.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Puedes asignar un doctor activo usando el botón de asignación.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctores.map((doc) => {
                const initials = `${doc.nombre?.charAt(0) || 'D'}${doc.apellido?.charAt(0) || 'R'}`;
                const especs = Array.isArray(doc.especialidades)
                  ? doc.especialidades.join(', ')
                  : doc.especialidades || 'Odontología General';

                return (
                  <div
                    key={doc.id}
                    className="p-4 rounded-sm bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 flex items-start gap-3 hover:border-[#0077D4] transition-colors shadow-sm"
                  >
                    <div className="w-11 h-11 rounded-sm bg-[#0077D4]/10 text-[#0077D4] font-bold text-sm flex items-center justify-center shrink-0">
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-small font-bold text-slate-800 dark:text-slate-200 truncate">
                        Dr. {doc.nombre} {doc.apellido}
                      </h4>

                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {especs}
                      </div>

                      {doc.usuario?.email && (
                         <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 truncate mt-1">
                           <Mail size={12} className="shrink-0" />
                           <span className="truncate">{doc.usuario.email}</span>
                         </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-50 dark:bg-dark-bg border-t border-slate-200 dark:border-slate-800 flex items-center justify-end shrink-0">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-sm bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-small font-semibold transition-colors cursor-pointer shadow-sm"
        >
          Volver al Listado
        </button>
      </div>
    </div>
  );
};
