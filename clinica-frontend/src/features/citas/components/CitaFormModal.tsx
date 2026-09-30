import React, { useState, useEffect, useCallback } from 'react';
import { X, Calendar, Clock, User, Stethoscope, Building2, AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import type { Cita, CitaFormData, CitaEstado } from '../types/cita';
import type { Doctor } from '../../doctors/types/doctor';
import type { Paciente } from '../../patients/types/patient';
import type { Sucursal } from '../../sucursales/types/sucursal';
import { getDoctoresApi } from '../../doctors/services/doctorService';
import { getPacientesApi } from '../../patients/services/patientService';
import { getSucursalesApi } from '../../sucursales/services/sucursalService';
import { checkDisponibilidadApi, type DisponibilidadResponse } from '../services/citaService';
import { useAuthStore } from '../../auth/store/authStore';

interface CitaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CitaFormData) => Promise<void>;
  cita?: Cita | null;
}

export const CitaFormModal: React.FC<CitaFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  cita,
}) => {
  const { user } = useAuthStore();
  const isDoctorRole = user?.rol?.nombre === 'Doctor';

  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);

  const [doctorId, setDoctorId] = useState<number | ''>('');
  const [pacienteId, setPacienteId] = useState<number | ''>('');
  const [isUnregisteredPatient, setIsUnregisteredPatient] = useState(false);
  const [nombreUnregistered, setNombreUnregistered] = useState('');
  const [sucursalId, setSucursalId] = useState<number | ''>('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [horaFin, setHoraFin] = useState('09:30');
  const [estado, setEstado] = useState<CitaEstado>('confirmada');

  const [disponibilidad, setDisponibilidad] = useState<DisponibilidadResponse | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to reset all form fields to clean default state
  const resetFormState = () => {
    const today = new Date().toISOString().split('T')[0];
    setFecha(today);
    setHoraInicio('09:00');
    setHoraFin('09:30');
    setEstado('confirmada');
    setIsUnregisteredPatient(false);
    setNombreUnregistered('');
    setPacienteId('');
    setDoctorId('');
    setSucursalId('');
    setDisponibilidad(null);
    setError(null);
  };

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setDisponibilidad(null);

      Promise.all([getDoctoresApi(), getPacientesApi(), getSucursalesApi()])
        .then(([dList, pList, sList]) => {
          setDoctores(dList);
          setPacientes(pList);
          setSucursales(sList);

          // If editing an existing cita
          if (cita) {
            setDoctorId(cita.doctor_id);
            setSucursalId(cita.sucursal_id);
            setFecha(cita.fecha ? String(cita.fecha).split('T')[0] : new Date().toISOString().split('T')[0]);
            setHoraInicio(cita.hora_inicio ? String(cita.hora_inicio).substring(0, 5) : '09:00');
            setHoraFin(cita.hora_fin ? String(cita.hora_fin).substring(0, 5) : '09:30');
            setEstado(cita.estado || 'confirmada');

            if (cita.paciente_id) {
              setIsUnregisteredPatient(false);
              setPacienteId(cita.paciente_id);
              setNombreUnregistered('');
            } else {
              setIsUnregisteredPatient(true);
              setPacienteId('');
              setNombreUnregistered(cita.nombre_paciente_unregistered || '');
            }
          } else {
            // New Cita: Reset all fields to clean blank initial state
            resetFormState();
          }
        })
        .catch(() => {});
    }
  }, [isOpen, cita]);

  // Live availability verification
  const verifyAvailability = useCallback(async () => {
    if (!doctorId || !sucursalId || !fecha) {
      setDisponibilidad(null);
      return;
    }

    setCheckingAvailability(true);
    try {
      const res = await checkDisponibilidadApi({
        doctor_id: Number(doctorId),
        sucursal_id: Number(sucursalId),
        fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        ignore_cita_id: cita?.id,
      });
      setDisponibilidad(res);
    } catch {
      setDisponibilidad(null);
    } finally {
      setCheckingAvailability(false);
    }
  }, [doctorId, sucursalId, fecha, horaInicio, horaFin, cita]);

  useEffect(() => {
    if (isOpen && doctorId && sucursalId && fecha) {
      const timer = setTimeout(() => {
        verifyAvailability();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, doctorId, sucursalId, fecha, horaInicio, horaFin, verifyAvailability]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDoctorRole && !cita) {
      setError('Solo los usuarios con rol Doctor están autorizados para registrar nuevas citas médicas.');
      return;
    }

    if (!doctorId || !sucursalId || !fecha || !horaInicio || !horaFin) {
      setError('Doctor, Sucursal, Fecha y Horario son obligatorios.');
      return;
    }

    if (disponibilidad && !disponibilidad.disponible) {
      setError(disponibilidad.mensaje || 'El horario seleccionado no está disponible.');
      return;
    }

    if (!isUnregisteredPatient && !pacienteId) {
      setError('Debes seleccionar un paciente registrado o marcar la casilla de paciente no registrado.');
      return;
    }

    if (isUnregisteredPatient && !nombreUnregistered.trim()) {
      setError('Escribe el nombre del paciente no registrado.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        doctor_id: Number(doctorId),
        sucursal_id: Number(sucursalId),
        paciente_id: !isUnregisteredPatient && pacienteId ? Number(pacienteId) : null,
        nombre_paciente_unregistered: isUnregisteredPatient ? nombreUnregistered.trim() : null,
        fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        estado,
      });
      resetFormState();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al guardar la cita médica.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled =
    isSubmitting ||
    (!isDoctorRole && !cita) ||
    (disponibilidad !== null && !disponibilidad.disponible);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 rounded-2xl shadow-2xl shadow-[#001C3D]/80 w-full max-w-lg overflow-hidden text-[#0840A8] dark:text-white flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-between bg-gradient-to-r from-[#0840A8] to-[#0077D4]">
          <h3 className="text-base font-bold flex items-center gap-2 text-[#0840A8] dark:text-white">
            <Calendar className="text-[#0077D4] dark:text-[#00C2E0]" size={18} />
            <span>{cita ? 'Editar Cita Médica' : 'Registrar Nueva Cita Médica'}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#0077D4] dark:text-blue-100/80 hover:text-[#0840A8] dark:text-white hover:bg-white/10 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {!isDoctorRole && !cita && (
            <div className="p-3.5 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-400 shrink-0" />
              <span>
                Restricción de Seguridad: Solo los usuarios con rol <strong>Doctor</strong> están autorizados para registrar nuevas citas médicas.
              </span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Paciente Selector or Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#0077D4] dark:text-blue-100 flex items-center gap-1">
                <User size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
                Paciente <span className="text-rose-400">*</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs text-[#0077D4] dark:text-[#00C2E0] font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isUnregisteredPatient}
                  onChange={(e) => {
                    setIsUnregisteredPatient(e.target.checked);
                    setPacienteId('');
                    setNombreUnregistered('');
                  }}
                  className="rounded border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0077D4] dark:text-[#00C2E0] focus:ring-[#00C2E0] cursor-pointer"
                />
                <span>El paciente no está registrado</span>
              </label>
            </div>

            {isUnregisteredPatient ? (
              <input
                type="text"
                value={nombreUnregistered}
                onChange={(e) => setNombreUnregistered(e.target.value)}
                required={isUnregisteredPatient}
                placeholder="Escriba el nombre completo del paciente no registrado..."
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
              />
            ) : (
              <select
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value ? Number(e.target.value) : '')}
                required={!isUnregisteredPatient}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">-- Seleccionar Paciente Registrado --</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">
                    {p.nombre} {p.apellido} ({p.codigo_paciente})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Doctor Selector & Sucursal Selector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1 flex items-center gap-1">
                <Stethoscope size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
                Doctor Asignado <span className="text-rose-400">*</span>
              </label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value ? Number(e.target.value) : '')}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">-- Seleccionar Doctor --</option>
                {doctores.map((d) => (
                  <option key={d.id} value={d.id} className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">
                    Dr. {d.nombre} {d.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1 flex items-center gap-1">
                <Building2 size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
                Sucursal Registro <span className="text-rose-400">*</span>
              </label>
              <select
                value={sucursalId}
                onChange={(e) => setSucursalId(e.target.value ? Number(e.target.value) : '')}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">-- Seleccionar Sucursal --</option>
                {sucursales.map((s) => (
                  <option key={s.id} value={s.id} className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">
                    {s.nombre || s.ubicacion} ({s.codigo_sucursal})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fecha, Hora Inicio, Hora Fin */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1 flex items-center gap-1">
                <Calendar size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
                Fecha <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1 flex items-center gap-1">
                <Clock size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
                Hora Inicio <span className="text-rose-400">*</span>
              </label>
              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1 flex items-center gap-1">
                <Clock size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
                Hora Fin <span className="text-rose-400">*</span>
              </label>
              <input
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
              />
            </div>
          </div>

          {/* VISUAL AVAILABILITY BANNER & SLOTS LIST */}
          {disponibilidad && (
            <div className="space-y-2">
              {/* Status Banner */}
              {disponibilidad.disponible ? (
                <div className="p-3 rounded-xl bg-cyan-950/80 border border-[#0840A8]/15 dark:border-[#00C2E0]/40 text-[#0077D4] dark:text-[#00C2E0] text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0 text-[#0077D4] dark:text-[#00C2E0]" />
                  <div>
                    <div>Horario Disponible para la Cita</div>
                    <div className="text-[10px] text-[#0077D4] dark:text-blue-200/80 font-normal">
                      Atención sucursal: {disponibilidad.horario_sucursal}
                    </div>
                  </div>
                </div>
              ) : disponibilidad.fuera_horario_sucursal ? (
                <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle size={16} className="shrink-0 text-amber-400" />
                  <div>
                    <div>{disponibilidad.mensaje}</div>
                    <div className="text-[10px] text-amber-600 dark:text-amber-300/80 font-normal">
                      Recuerde que el horario oficial de esta sucursal es {disponibilidad.horario_sucursal}.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-semibold flex items-center gap-2">
                  <XCircle size={16} className="shrink-0 text-rose-400" />
                  <div>
                    <div>Conflicto de Horario</div>
                    <div className="text-[10px] text-rose-300/80 font-normal">
                      {disponibilidad.mensaje}
                    </div>
                  </div>
                </div>
              )}

              {/* Occupied Slots Badges */}
              {disponibilidad.citas_ocupadas && disponibilidad.citas_ocupadas.length > 0 && (
                <div className="p-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/30 space-y-1.5">
                  <div className="text-[11px] font-bold text-[#0077D4] dark:text-blue-200 flex items-center justify-between">
                    <span>Citas ya agendadas del Doctor en esta fecha:</span>
                    <span className="text-[10px] text-blue-300 font-mono">({disponibilidad.citas_ocupadas.length} reservadas)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {disponibilidad.citas_ocupadas.map((c) => (
                      <span
                        key={c.id}
                        className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] font-mono font-medium flex items-center gap-1"
                      >
                        <Clock size={10} />
                        {c.hora_inicio} - {c.hora_fin} ({c.paciente})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {checkingAvailability && (
            <div className="text-[11px] text-[#0077D4] dark:text-[#00C2E0] font-medium flex items-center gap-1.5">
              <Info size={13} className="animate-spin" />
              <span>Verificando disponibilidad de horario...</span>
            </div>
          )}

          {/* Estado Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100 mb-1">
              Estado de la Cita (Por defecto Aprobada)
            </label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as CitaEstado)}
              disabled={!isDoctorRole}
              className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all cursor-pointer disabled:opacity-60"
            >
              <option value="confirmada" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">Confirmada (Aprobada)</option>
              <option value="pendiente" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">Pendiente</option>
              <option value="finalizada" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">Finalizada</option>
              <option value="cancelada" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">Cancelada</option>
            </select>
            {!isDoctorRole && (
              <p className="text-[10px] text-amber-600 dark:text-amber-300/80 mt-1">
                * Solo los usuarios con rol Doctor pueden aprobar o cancelar el estado de las citas.
              </p>
            )}
          </div>

          {/* Buttons Footer */}
          <div className="pt-4 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white border border-white/10 text-xs font-semibold cursor-pointer transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isFormDisabled}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#0840A8] hover:to-[#0077D4] text-white text-xs font-bold shadow-md shadow-[#0077D4]/30 disabled:opacity-40 cursor-pointer transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 size={15} />
              <span>{isSubmitting ? 'Guardando...' : cita ? 'Guardar Cambios' : 'Registrar Cita (Aprobada)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

