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
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-tiny font-bold bg-cyan-50 dark:bg-cyan-900/30 text-primary dark:text-secondary border border-cyan-200 dark:border-cyan-800">
            <CheckCircle2 size={11} />
            CONFIRMADA
          </span>
        );
      case 'finalizada':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-tiny font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 size={11} />
            FINALIZADA
          </span>
        );
      case 'cancelada':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-tiny font-bold bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <XCircle size={11} />
            CANCELADA
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-tiny font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Clock3 size={11} />
            PENDIENTE
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

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return null;
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    const mins = (h2 * 60 + m2) - (h1 * 60 + m1);
    return mins > 0 ? `${mins} min` : null;
  };

  const duracion = calculateDuration(cita.hora_inicio, cita.hora_fin);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-primary">
              <Calendar size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-tiny font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {cita.numero_cita || `CITA-${cita.id}`}
                </span>
                {getStatusBadge(cita.estado)}
              </div>
              <h2 className="text-sm font-bold text-primary-dark dark:text-white mt-0.5 uppercase tracking-wide">
                Detalles de Cita
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-slate-700 dark:text-slate-200">
          {/* Fecha y Horario Banner */}
          <div className="p-3 rounded-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-primary">
                <Calendar size={16} />
              </div>
              <div>
                <div className="text-tiny font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fecha Programada</div>
                <div className="text-xs font-bold text-primary-dark dark:text-white">
                  {cita.fecha ? String(cita.fecha).split('T')[0] : 'Sin fecha'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 text-primary">
                <Clock size={16} />
              </div>
              <div>
                <div className="text-tiny font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Horario de Atención</div>
                <div className="text-xs font-mono font-bold text-primary-dark dark:text-white flex items-center gap-1.5">
                  <span>{cita.hora_inicio?.substring(0, 5)} - {cita.hora_fin?.substring(0, 5)}</span>
                  {duracion && (
                    <span className="text-micro font-semibold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      ({duracion})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Paciente y Doctor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* PACIENTE CARD */}
            <div className="p-3 rounded-sm border border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-dark-surface">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 text-slate-700 dark:text-slate-300 font-bold text-tiny uppercase tracking-wider">
                <User size={13} className="text-primary" />
                <span>Paciente</span>
              </div>

              {cita.paciente ? (
                <div className="space-y-2 text-small">
                  <div>
                    <div className="text-micro text-slate-500">Nombre Completo</div>
                    <div className="font-bold text-primary-dark dark:text-white">
                      {cita.paciente.nombre} {cita.paciente.apellido}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-micro text-slate-500">Código</div>
                      <div className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        {cita.paciente.codigo_paciente}
                      </div>
                    </div>
                    {cita.paciente.edad !== undefined && (
                      <div>
                        <div className="text-micro text-slate-500">Edad / Sexo</div>
                        <div className="font-semibold text-slate-700 dark:text-slate-300">
                          {cita.paciente.edad} años ({cita.paciente.sexo})
                        </div>
                      </div>
                    )}
                  </div>

                  {(cita.paciente.celular || cita.paciente.telefono_emergencia) && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                      {cita.paciente.celular && (
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                          <Phone size={10} />
                          <span>{cita.paciente.celular}</span>
                        </div>
                      )}
                      {cita.paciente.telefono_emergencia && (
                        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500">
                          <Phone size={10} />
                          <span>Emergencia: {cita.paciente.telefono_emergencia}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2 text-small">
                  <div>
                    <div className="text-micro text-slate-500">Paciente No Registrado</div>
                    <div className="font-bold text-primary-dark dark:text-white">
                      {cita.nombre_paciente_unregistered || 'No especificado'}
                    </div>
                  </div>
                  <span className="inline-block px-1.5 py-0.5 rounded text-micro font-semibold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    Atención sin expediente
                  </span>
                </div>
              )}
            </div>

            {/* DOCTOR CARD */}
            <div className="p-3 rounded-sm border border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-dark-surface">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 text-slate-700 dark:text-slate-300 font-bold text-tiny uppercase tracking-wider">
                <Stethoscope size={13} className="text-primary" />
                <span>Doctor Asignado</span>
              </div>

              {cita.doctor ? (
                <div className="space-y-2 text-small">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                      {doctorInitials}
                    </div>
                    <div>
                      <div className="font-bold text-primary-dark dark:text-white">
                        Dr. {cita.doctor.nombre} {cita.doctor.apellido}
                      </div>
                      <div className="text-micro text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                        {doctorEspecialidades}
                      </div>
                    </div>
                  </div>

                  {(cita.doctor.usuario?.email || doctorTelefonos) && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                      {cita.doctor.usuario?.email && (
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 truncate">
                          <Mail size={10} />
                          <span className="truncate">{cita.doctor.usuario.email}</span>
                        </div>
                      )}
                      {doctorTelefonos && (
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                          <Phone size={10} />
                          <span>{doctorTelefonos}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-small text-slate-500 italic py-2">
                  Sin doctor asignado
                </div>
              )}
            </div>
          </div>

          {/* SUCURSAL CARD */}
          <div className="p-3 rounded-sm border border-slate-200 dark:border-slate-800 space-y-2 bg-white dark:bg-dark-surface">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 text-slate-700 dark:text-slate-300 font-bold text-tiny uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Building2 size={13} className="text-primary" />
                <span>Sucursal de Atención</span>
              </div>
              {cita.sucursal?.codigo_sucursal && (
                <span className="font-mono text-micro px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {cita.sucursal.codigo_sucursal}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-small">
              <div>
                <div className="text-micro text-slate-500">Nombre</div>
                <div className="font-bold text-primary-dark dark:text-white">
                  {cita.sucursal?.nombre || 'Sucursal Principal'}
                </div>
              </div>

              <div>
                <div className="text-micro text-slate-500 flex items-center gap-1">
                  <MapPin size={9} />
                  <span>Ubicación</span>
                </div>
                <div className="font-semibold text-slate-700 dark:text-slate-300">
                  {cita.sucursal?.ubicacion || 'Central'}
                </div>
              </div>
            </div>
          </div>

          {/* METADATA */}
          <div className="p-2 rounded-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-micro text-slate-500 font-mono">
            <div className="flex items-center gap-1">
              <ShieldCheck size={10} />
              <span>Registro: Cita #{cita.id}</span>
            </div>
            {cita.created_at && (
              <div>Registrado: {String(cita.created_at).split('T')[0]}</div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-small font-semibold border border-slate-300 dark:border-slate-700 transition-colors"
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
              className="px-4 py-1.5 rounded bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-bold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Edit2 size={12} />
              <span>Editar Cita</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
