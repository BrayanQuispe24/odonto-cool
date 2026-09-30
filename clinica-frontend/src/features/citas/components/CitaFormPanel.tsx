import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  PlusCircle,
  Edit3,
  RotateCcw,
} from 'lucide-react';
import type { Cita, CitaFormData, CitaEstado } from '../types/cita';
import type { Doctor } from '../../doctors/types/doctor';
import type { Paciente } from '../../patients/types/patient';
import type { Sucursal } from '../../sucursales/types/sucursal';
import { getDoctoresApi } from '../../doctors/services/doctorService';
import { getPacientesApi } from '../../patients/services/patientService';
import { getSucursalesApi } from '../../sucursales/services/sucursalService';
import { checkDisponibilidadApi, type DisponibilidadResponse } from '../services/citaService';
import { useAuthStore } from '../../auth/store/authStore';

interface CitaFormPanelProps {
  onSubmit: (data: CitaFormData) => Promise<void>;
  cita?: Cita | null;
  onCancelEdit?: () => void;
}

export const CitaFormPanel: React.FC<CitaFormPanelProps> = ({
  onSubmit,
  cita,
  onCancelEdit,
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
    setSucursalId(isDoctorRole && user?.sucursal_id ? user.sucursal_id : '');
    setDisponibilidad(null);
    setError(null);
  };

  useEffect(() => {
    setError(null);
    setDisponibilidad(null);

    Promise.all([getDoctoresApi(), getPacientesApi(), getSucursalesApi()])
      .then(([dList, pList, sList]) => {
        setDoctores(dList);
        setPacientes(pList);
        setSucursales(sList);

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
          resetFormState();
        }
      })
      .catch(() => {});
  }, [cita]);

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
    if (doctorId && sucursalId && fecha) {
      const timer = setTimeout(() => {
        verifyAvailability();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [doctorId, sucursalId, fecha, horaInicio, horaFin, verifyAvailability]);

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
      if (!cita) {
        resetFormState();
      }
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
    <div
      id="cita-form-panel"
      className="bg-white dark:bg-[#002D5E] rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 overflow-hidden text-[#0840A8] dark:text-white flex flex-col sticky top-6 transition-all duration-300"
    >
      {/* Panel Header */}
      <div className="p-4 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-white dark:bg-[#0840A8]/20 flex items-center justify-between">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0077D4] dark:text-[#00C2E0] flex items-center gap-2 font-mono">
          {cita ? (
            <>
              <Edit3 className="text-[#0077D4] dark:text-[#00C2E0]" size={16} />
              <span>Editar Cita {cita.numero_cita ? `#${cita.numero_cita}` : ''}</span>
            </>
          ) : (
            <>
              <PlusCircle className="text-[#0077D4] dark:text-[#00C2E0]" size={16} />
              <span>Registrar Nueva Cita Médica</span>
            </>
          )}
        </h3>

        {cita && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-2.5 py-1 rounded-lg bg-[#F4F9FF] dark:bg-[#001C3D] hover:bg-[#0077D4]/30 border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-xs font-semibold text-[#0077D4] dark:text-blue-100 flex items-center gap-1 transition-all cursor-pointer"
            title="Cancelar edición"
          >
            <RotateCcw size={12} />
            <span>Cancelar</span>
          </button>
        )}
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {!isDoctorRole && !cita && (
          <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400 shrink-0" />
            <span>Solo usuarios con rol Doctor están autorizados para registrar nuevas citas.</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Paciente Selector / Input */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
            <label className="text-xs font-semibold text-[#0077D4] dark:text-blue-100/90 flex items-center gap-1">
              <User size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
              Paciente <span className="text-rose-400">*</span>
            </label>
            <label className="flex items-center gap-1.5 text-[11px] text-[#0077D4] dark:text-[#00C2E0] font-medium cursor-pointer select-none">
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
              <span>No registrado</span>
            </label>
          </div>

          {isUnregisteredPatient ? (
            <input
              type="text"
              value={nombreUnregistered}
              onChange={(e) => setNombreUnregistered(e.target.value)}
              required={isUnregisteredPatient}
              placeholder="Escriba nombre completo del paciente no registrado..."
              className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
            />
          ) : (
            <select
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value ? Number(e.target.value) : '')}
              required={!isUnregisteredPatient}
              className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all cursor-pointer"
            >
              <option value="" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">-- Seleccionar Paciente --</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id} className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">
                  {p.nombre} {p.apellido} ({p.codigo_paciente})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Doctor & Sucursal */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100/90 mb-1 flex items-center gap-1">
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
            <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100/90 mb-1 flex items-center gap-1">
              <Building2 size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
              Sucursal <span className="text-rose-400">*</span>
            </label>
            <select
              value={sucursalId}
              onChange={(e) => setSucursalId(e.target.value ? Number(e.target.value) : '')}
              required
              disabled={isDoctorRole}
              className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all cursor-pointer disabled:opacity-60"
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

        {/* Fecha & Horarios */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100/90 mb-1 flex items-center gap-1">
              <Calendar size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
              Fecha de la Cita <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-medium focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100/90 mb-1 flex items-center gap-1">
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
              <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100/90 mb-1 flex items-center gap-1">
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
        </div>

        {/* Live Availability verification output */}
        {disponibilidad && (
          <div className="space-y-2">
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
                    Horario de sucursal: {disponibilidad.horario_sucursal}
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

            {disponibilidad.citas_ocupadas && disponibilidad.citas_ocupadas.length > 0 && (
              <div className="p-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/30 space-y-1.5">
                <div className="text-[11px] font-bold text-[#0077D4] dark:text-blue-200 flex items-center justify-between">
                  <span>Citas ya agendadas en la fecha:</span>
                  <span className="text-[10px] text-blue-300 font-mono">({disponibilidad.citas_ocupadas.length})</span>
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
          <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-100/90 mb-1">
            Estado de la Cita
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
              * Solo los usuarios con rol Doctor pueden cambiar el estado.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-white dark:bg-[#0840A8]/20 flex items-center gap-2">
          {cita && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="w-1/3 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] hover:bg-white/10 text-[#0840A8] dark:text-white border border-white/10 text-xs font-semibold cursor-pointer transition-all text-center"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={isFormDisabled}
            className={`${cita ? 'w-2/3' : 'w-full'} py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#00C2E0] hover:to-[#0077D4] text-white text-xs font-extrabold shadow-md shadow-[#0077D4]/30 hover:shadow-[#00C2E0]/40 disabled:opacity-40 cursor-pointer transition-all border border-white/10 flex items-center justify-center gap-2`}
          >
            <CheckCircle2 size={16} />
            <span>{isSubmitting ? 'Guardando...' : cita ? 'Guardar Cambios' : 'Registrar Cita'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
