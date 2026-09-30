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
import { Button } from '../../../components/ui/Button';
import type { Sucursal } from '../types/sucursal';
import { useUserRole } from '../../../hooks/useUserRole';

interface SucursalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sucursal: Sucursal | null;
  onOpenAssignModal?: () => void;
}

export const SucursalDetailsModal: React.FC<SucursalDetailsModalProps> = ({
  isOpen,
  onClose,
  sucursal,
  onOpenAssignModal,
}) => {
  if (!isOpen || !sucursal) return null;

  const { isAdmin } = useUserRole();
  const doctores = sucursal.doctores || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden text-[#0840A8] dark:text-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#0840A8]/15 dark:border-[#00C2E0]/30 flex items-center justify-between bg-gradient-to-r from-[#0840A8] to-[#0077D4] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/15 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-[#0077D4] dark:text-[#00C2E0]">
              <Building2 size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/20 text-[#0077D4] dark:text-[#00C2E0]">
                  {sucursal.codigo_sucursal}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    sucursal.estado
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                  }`}
                >
                  {sucursal.estado ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {sucursal.estado ? 'Operativa' : 'Inactiva'}
                </span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-[#0840A8] dark:text-white mt-1">
                {sucursal.nombre}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-[#0840A8] dark:text-white/80 hover:text-[#0840A8] dark:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 scroll-smooth">
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D]/60 border border-[#0840A8]/15 dark:border-[#00C2E0]/20 space-y-1">
              <div className="text-xs font-bold text-[#0077D4] dark:text-[#00C2E0] flex items-center gap-1.5">
                <MapPin size={14} />
                <span>Ubicación & Dirección</span>
              </div>
              <p className="text-xs font-semibold text-[#0840A8] dark:text-white leading-relaxed">
                {sucursal.ubicacion}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D]/60 border border-[#0840A8]/15 dark:border-[#00C2E0]/20 space-y-1">
              <div className="text-xs font-bold text-[#0077D4] dark:text-[#00C2E0] flex items-center gap-1.5">
                <Phone size={14} />
                <span>Teléfono de Contacto</span>
              </div>
              <p className="text-xs font-semibold text-[#0840A8] dark:text-white">
                {sucursal.telefono || 'Sin número registrado'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D]/60 border border-[#0840A8]/15 dark:border-[#00C2E0]/20 space-y-1">
              <div className="text-xs font-bold text-[#0077D4] dark:text-[#00C2E0] flex items-center gap-1.5">
                <Clock size={14} />
                <span>Horario de Atención</span>
              </div>
              <p className="text-xs font-semibold text-[#0840A8] dark:text-white">
                {sucursal.horario_atencion || 'Horario continuo'}
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#0077D4]/10 via-[#00C2E0]/15 to-[#0077D4]/10 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-center">
            <div>
              <div className="text-2xl font-black text-[#0840A8] dark:text-white">
                {doctores.length > 0 ? doctores.length : sucursal.doctores_count ?? 0}
              </div>
              <div className="text-xs font-bold text-[#0077D4] dark:text-[#00C2E0] flex items-center justify-center gap-1 mt-0.5">
                <UserCheck size={13} /> Doctores Asignados
              </div>
            </div>

            <div>
              <div className="text-2xl font-black text-[#0840A8] dark:text-white">
                {sucursal.pacientes_count ?? 0}
              </div>
              <div className="text-xs font-bold text-[#0077D4] dark:text-[#00C2E0] flex items-center justify-center gap-1 mt-0.5">
                <Users size={13} /> Pacientes Registrados
              </div>
            </div>

            <div>
              <div className="text-2xl font-black text-[#0840A8] dark:text-white">
                {sucursal.users_count ?? 0}
              </div>
              <div className="text-xs font-bold text-[#0077D4] dark:text-[#00C2E0] flex items-center justify-center gap-1 mt-0.5">
                <ShieldCheck size={13} /> Usuarios en Sistema
              </div>
            </div>
          </div>

          {/* Doctors Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#0840A8]/15 dark:border-[#00C2E0]/20 pb-2">
              <h3 className="font-bold text-sm text-[#0840A8] dark:text-white flex items-center gap-2">
                <Stethoscope size={18} className="text-[#0077D4] dark:text-[#00C2E0]" />
                <span>Especialistas Médicos Asignados ({doctores.length})</span>
              </h3>

              {isAdmin && onOpenAssignModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAssignModal();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:opacity-90 cursor-pointer transition-all"
                >
                  <UserPlus size={14} />
                  <span>Asignar Nuevo Doctor</span>
                </button>
              )}
            </div>

            {doctores.length === 0 ? (
              <div className="p-8 text-center bg-[#F4F9FF] dark:bg-[#001C3D]/40 rounded-xl border border-[#0840A8]/15 dark:border-[#0840A8]/10 dark:border-[#00C2E0]/20">
                <Stethoscope size={32} className="mx-auto text-[#0077D4] dark:text-[#00C2E0] mb-2" />
                <p className="text-xs font-bold text-[#0840A8] dark:text-white">
                  No hay médicos asignados a esta sucursal actualmente.
                </p>
                <p className="text-[11px] text-[#0077D4] dark:text-[#00C2E0] mt-1">
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
                      className="p-4 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D]/60 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 flex items-start gap-3 hover:border-[#0077D4] transition-all shadow-2xs"
                    >
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0077D4] to-[#00C2E0] text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm">
                        {initials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#0840A8] dark:text-white truncate">
                          Dr. {doc.nombre} {doc.apellido}
                        </h4>

                        <div className="text-[11px] font-semibold text-[#0077D4] dark:text-[#00C2E0] truncate mt-0.5">
                          {especs}
                        </div>

                        {doc.usuario?.email && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-300 truncate mt-1">
                            <Mail size={11} className="shrink-0 text-[#0077D4] dark:text-[#00C2E0]" />
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
        <div className="p-4 border-t border-[#0840A8]/15 dark:border-[#00C2E0]/20 flex items-center justify-end gap-3 bg-[#F4F9FF]/80 dark:bg-[#0840A8]/30 shrink-0">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};
