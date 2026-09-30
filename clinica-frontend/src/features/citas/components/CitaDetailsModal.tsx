import React from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Building2,
  CheckCircle2,
  XCircle,
  Clock3,
  Edit2,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import type { Cita, CitaEstado } from '../types/cita';

interface CitaDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cita: Cita | null;
  onEdit?: (cita: Cita) => void;
}

export const CitaDetailsModal: React.FC<CitaDetailsModalProps> = ({
  isOpen,
  onClose,
  cita,
  onEdit,
}) => {
  if (!isOpen || !cita) return null;

  const getStatusBadge = (estado: CitaEstado) => {
    switch (estado) {
      case 'confirmada':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-950/90 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/50 shadow-sm">
            <CheckCircle2 size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
            Confirmada (Aprobada)
          </span>
        );
      case 'finalizada':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-sm">
            <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
            Finalizada
          </span>
        );
      case 'cancelada':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950/90 text-rose-300 border border-rose-500/50 shadow-sm">
            <XCircle size={13} className="text-rose-400" />
            Cancelada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/90 text-amber-600 dark:text-amber-300 border border-amber-500/50 shadow-sm">
            <Clock3 size={13} className="text-amber-400" />
            Pendiente de atención
          </span>
        );
    }
  };

  const doctorInitials = cita.doctor
    ? `${cita.doctor.nombre?.charAt(0) || ''}${cita.doctor.apellido?.charAt(0) || ''}`
    : 'DR';

  const doctorEspecialidades = cita.doctor?.especialidades
    ? Array.isArray(cita.doctor.especialidades)
      ? cita.doctor.especialidades.join(', ')
      : cita.doctor.especialidades
    : 'Odontólogo Especialista';

  const doctorTelefonos = cita.doctor?.telefonos
    ? Array.isArray(cita.doctor.telefonos)
      ? cita.doctor.telefonos.join(', ')
      : cita.doctor.telefonos
    : null;

  // Calculate duration in minutes if hours are valid
  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return null;
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    const mins = (h2 * 60 + m2) - (h1 * 60 + m1);
    return mins > 0 ? `${mins} min` : null;
  };

  const duracion = calculateDuration(cita.hora_inicio, cita.hora_fin);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/40 rounded-2xl shadow-2xl shadow-[#001C3D]/90 w-full max-w-2xl overflow-hidden text-[#0840A8] dark:text-white flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-between bg-gradient-to-r from-[#0840A8] via-[#0077D4] to-[#00C2E0] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-white/15 border border-white/20 text-[#0077D4] dark:text-[#00C2E0]">
              <Calendar size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-white/20 text-[#0077D4] dark:text-[#00C2E0] border border-white/10">
                  {cita.numero_cita || `CITA-${cita.id}`}
                </span>
                {getStatusBadge(cita.estado)}
              </div>
              <h2 className="text-lg font-black tracking-tight text-[#0840A8] dark:text-white mt-1">
                Detalles Completos de la Cita Médica
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white/80 hover:text-[#0840A8] dark:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 scroll-smooth">
          {/* Fecha y Horario Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#001C3D] via-[#0840A8]/40 to-[#001C3D] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0077D4]/20 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-[#0077D4] dark:text-[#00C2E0]">
                <Calendar size={20} />
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#0077D4] dark:text-blue-200/80 uppercase tracking-wider">Fecha Programada</div>
                <div className="text-sm font-extrabold text-[#0840A8] dark:text-white">
                  {cita.fecha ? String(cita.fecha).split('T')[0] : 'Sin fecha'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0077D4]/20 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-[#0077D4] dark:text-[#00C2E0]">
                <Clock size={20} />
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#0077D4] dark:text-blue-200/80 uppercase tracking-wider">Horario de Atención</div>
                <div className="text-sm font-mono font-extrabold text-[#0840A8] dark:text-white flex items-center gap-1.5">
                  <span>{cita.hora_inicio?.substring(0, 5)} - {cita.hora_fin?.substring(0, 5)}</span>
                  {duracion && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#00C2E0]/20 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/30">
                      ({duracion})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Paciente y Doctor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PACIENTE CARD */}
            <div className="p-4 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D]/80 border border-[#0840A8]/15 dark:border-[#0077D4]/40 space-y-3">
              <div className="flex items-center gap-2 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 pb-2.5 text-[#0077D4] dark:text-[#00C2E0] font-bold text-xs uppercase tracking-wider">
                <User size={16} />
                <span>Información del Paciente</span>
              </div>

              {cita.paciente ? (
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-[10px] text-[#0077D4] dark:text-blue-200/70">Nombre Completo</div>
                    <div className="font-extrabold text-[#0840A8] dark:text-white text-sm">
                      {cita.paciente.nombre} {cita.paciente.apellido}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <div className="text-[10px] text-[#0077D4] dark:text-blue-200/70">Código Paciente</div>
                      <div className="font-mono font-bold text-[#0077D4] dark:text-[#00C2E0]">
                        {cita.paciente.codigo_paciente}
                      </div>
                    </div>
                    {cita.paciente.edad !== undefined && (
                      <div>
                        <div className="text-[10px] text-[#0077D4] dark:text-blue-200/70">Edad / Sexo</div>
                        <div className="font-medium text-[#0840A8] dark:text-white">{cita.paciente.edad} años ({cita.paciente.sexo})</div>
                      </div>
                    )}
                  </div>

                  {(cita.paciente.celular || cita.paciente.telefono_emergencia) && (
                    <div className="pt-2 border-t border-[#0840A8]/15 dark:border-[#0840A8]/40 space-y-1">
                      {cita.paciente.celular && (
                        <div className="flex items-center gap-1.5 text-[#0077D4] dark:text-blue-100 text-[11px]">
                          <Phone size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
                          <span>Celular: {cita.paciente.celular}</span>
                        </div>
                      )}
                      {cita.paciente.telefono_emergencia && (
                        <div className="flex items-center gap-1.5 text-[#0077D4] dark:text-blue-100 text-[11px] truncate">
                          <Phone size={12} className="text-amber-400" />
                          <span className="truncate">Emergencia: {cita.paciente.telefono_emergencia}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-[10px] text-[#0077D4] dark:text-blue-200/70">Paciente No Registrado</div>
                    <div className="font-extrabold text-[#0840A8] dark:text-white text-sm">
                      {cita.nombre_paciente_unregistered || 'No especificado'}
                    </div>
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                    Atención sin expediente previo
                  </span>
                </div>
              )}
            </div>

            {/* DOCTOR CARD */}
            <div className="p-4 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D]/80 border border-[#0840A8]/15 dark:border-[#0077D4]/40 space-y-3">
              <div className="flex items-center gap-2 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 pb-2.5 text-[#0077D4] dark:text-[#00C2E0] font-bold text-xs uppercase tracking-wider">
                <Stethoscope size={16} />
                <span>Doctor Asignado</span>
              </div>

              {cita.doctor ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0077D4] to-[#00C2E0] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm border border-white/20">
                      {doctorInitials}
                    </div>
                    <div>
                      <div className="font-extrabold text-[#0840A8] dark:text-white text-sm">
                        Dr. {cita.doctor.nombre} {cita.doctor.apellido}
                      </div>
                      <div className="text-[11px] text-[#0077D4] dark:text-[#00C2E0] font-semibold">
                        {doctorEspecialidades}
                      </div>
                    </div>
                  </div>

                  {(cita.doctor.usuario?.email || doctorTelefonos) && (
                    <div className="pt-2 border-t border-[#0840A8]/15 dark:border-[#0840A8]/40 space-y-1">
                      {cita.doctor.usuario?.email && (
                        <div className="flex items-center gap-1.5 text-[#0077D4] dark:text-blue-100 text-[11px] truncate">
                          <Mail size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
                          <span className="truncate">{cita.doctor.usuario.email}</span>
                        </div>
                      )}
                      {doctorTelefonos && (
                        <div className="flex items-center gap-1.5 text-[#0077D4] dark:text-blue-100 text-[11px]">
                          <Phone size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
                          <span>{doctorTelefonos}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-[#0077D4] dark:text-blue-200/70 italic py-2">
                  Sin doctor asignado
                </div>
              )}
            </div>
          </div>

          {/* SUCURSAL CARD */}
          <div className="p-4 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D]/80 border border-[#0840A8]/15 dark:border-[#0077D4]/40 space-y-2">
            <div className="flex items-center justify-between border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 pb-2 text-[#0077D4] dark:text-[#00C2E0] font-bold text-xs uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Building2 size={16} />
                <span>Sucursal de Atención</span>
              </div>
              {cita.sucursal?.codigo_sucursal && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#0077D4]/30 text-[#0840A8] dark:text-white border border-[#0840A8]/15 dark:border-[#00C2E0]/30">
                  {cita.sucursal.codigo_sucursal}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div>
                <div className="text-[10px] text-[#0077D4] dark:text-blue-200/70">Nombre de Sucursal</div>
                <div className="font-bold text-[#0840A8] dark:text-white">
                  {cita.sucursal?.nombre || 'Sucursal Principal'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-[#0077D4] dark:text-blue-200/70 flex items-center gap-1">
                  <MapPin size={11} className="text-[#0077D4] dark:text-[#00C2E0]" />
                  <span>Ubicación</span>
                </div>
                <div className="font-medium text-[#0077D4] dark:text-blue-100">
                  {cita.sucursal?.ubicacion || 'Central'}
                </div>
              </div>
            </div>
          </div>

          {/* TIMESTAMPS / METADATA */}
          <div className="p-3 rounded-xl bg-[#0840A8]/20 border border-[#0840A8]/15 dark:border-[#0840A8]/40 flex items-center justify-between text-[10px] text-[#0077D4] dark:text-blue-200/70 font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
              <span>Registro de Sistema: Cita #{cita.id}</span>
            </div>
            {cita.created_at && (
              <div>Registrado: {String(cita.created_at).split('T')[0]}</div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-between bg-[#0840A8]/20 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white text-xs font-semibold cursor-pointer transition-all border border-white/10"
          >
            Cerrar
          </button>

          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(cita);
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#0840A8] hover:to-[#0077D4] text-white text-xs font-bold shadow-md shadow-[#0077D4]/30 cursor-pointer transition-all flex items-center gap-2"
            >
              <Edit2 size={14} />
              <span>Editar Cita</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
