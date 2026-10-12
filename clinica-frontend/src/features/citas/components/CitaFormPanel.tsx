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

  const resetFormState = (dList: Doctor[] = doctores) => {
    const today = new Date().toISOString().split('T')[0];
    setFecha(today);
    setHoraInicio('09:00');
    setHoraFin('09:30');
    setEstado('confirmada');
    setIsUnregisteredPatient(false);
    setNombreUnregistered('');
    setPacienteId('');

    let defaultDoctorId: number | '' = '';
    if (isDoctorRole && user?.id) {
      const matchingDoctor = dList.find(d => String(d.usuario_id) === String(user.id));
      if (matchingDoctor) {
        defaultDoctorId = matchingDoctor.id;
      }
    }
    setDoctorId(defaultDoctorId);

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
          resetFormState(dList);
        }
      })
      .catch(() => {});
  }, [cita]);

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
      setError('Solo los usuarios con rol Doctor están autorizados para registrar nuevas citas.');
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
    <div className="bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sticky top-6">
      {/* Panel Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between">
        <h3 className="text-small font-bold uppercase tracking-wider text-primary-dark dark:text-slate-300 flex items-center gap-1.5">
          {cita ? (
            <>
              <Edit3 size={13} className="text-primary dark:text-secondary" />
              <span>Editar Cita {cita.numero_cita ? `#${cita.numero_cita}` : ''}</span>
            </>
          ) : (
            <>
              <PlusCircle size={13} className="text-primary dark:text-secondary" />
              <span>Registrar Nueva Cita Médica</span>
            </>
          )}
        </h3>

        {cita && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 dark:bg-dark-surface dark:hover:bg-[#0840A8] border border-slate-300 dark:border-slate-700 text-tiny font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
            title="Cancelar edición"
          >
            <RotateCcw size={11} />
            <span>Cancelar</span>
          </button>
        )}
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
        {!isDoctorRole && !cita && (
          <div className="p-2.5 rounded-sm bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-small font-semibold flex items-center gap-2 shadow-sm">
            <AlertTriangle size={14} className="shrink-0" />
            <span>Solo usuarios con rol Doctor están autorizados para registrar nuevas citas.</span>
          </div>
        )}

        {error && (
          <div className="p-2.5 rounded-sm bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-small font-semibold shadow-sm">
            {error}
          </div>
        )}

        {/* TWO-COLUMN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* COLUMN 1: General Info */}
          <div className="space-y-3">
            {/* Paciente Selector / Input */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <label className="text-small font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <User size={11} className="text-primary" />
                  Paciente <span className="text-rose-500">*</span>
                </label>
                <label className="flex items-center gap-1.5 text-tiny text-slate-600 dark:text-slate-400 font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isUnregisteredPatient}
                    onChange={(e) => {
                      setIsUnregisteredPatient(e.target.checked);
                      setPacienteId('');
                      setNombreUnregistered('');
                    }}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
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
                  placeholder="Escriba nombre completo del paciente..."
                  className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              ) : (
                <select
                  value={pacienteId}
                  onChange={(e) => setPacienteId(e.target.value ? Number(e.target.value) : '')}
                  required={!isUnregisteredPatient}
                  className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">-- Seleccionar Paciente --</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} {p.apellido} ({p.codigo_paciente})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Doctor */}
            <div>
              <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Stethoscope size={11} className="text-primary" />
                Doctor Asignado <span className="text-rose-500">*</span>
              </label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value ? Number(e.target.value) : '')}
                required
                className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="">-- Seleccionar Doctor --</option>
                {doctores.map((d) => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.nombre} {d.apellido}
                  </option>
                ))}
              </select>
            </div>

            {/* Sucursal */}
            <div>
              <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Building2 size={11} className="text-primary" />
                Sucursal <span className="text-rose-500">*</span>
              </label>
              <select
                value={sucursalId}
                onChange={(e) => setSucursalId(e.target.value ? Number(e.target.value) : '')}
                required
                disabled={isDoctorRole}
                className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60"
              >
                <option value="">-- Seleccionar Sucursal --</option>
                {sucursales.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre || s.ubicacion} ({s.codigo_sucursal})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* COLUMN 2: Fecha y Estado */}
          <div className="space-y-3">
            {/* Fecha */}
            <div>
              <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Calendar size={11} className="text-primary" />
                Fecha de la Cita <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Horarios */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Clock size={11} className="text-primary" />
                  Hora Inicio <span className="text-rose-500">*</span>
                </label>
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  required
                  className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Clock size={11} className="text-primary" />
                  Hora Fin <span className="text-rose-500">*</span>
                </label>
                <input
                  type="time"
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  required
                  className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-small font-bold text-slate-700 dark:text-slate-300 mb-1">
                Estado de la Cita
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as CitaEstado)}
                disabled={!isDoctorRole}
                className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-primary-dark dark:text-white text-small font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60"
              >
                <option value="confirmada">Confirmada (Aprobada)</option>
                <option value="pendiente">Pendiente</option>
                <option value="finalizada">Finalizada</option>
                <option value="cancelada">Cancelada</option>
              </select>
              {!isDoctorRole && (
                <p className="text-micro text-amber-600 dark:text-amber-400 mt-1">
                  * Solo doctores pueden cambiar el estado.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Live Availability verification output */}
        {disponibilidad && (
          <div className="space-y-1.5 mt-2">
            {disponibilidad.disponible ? (
              <div className="p-2.5 rounded-sm bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 text-primary dark:text-secondary text-small font-semibold flex items-center gap-2 shadow-sm">
                <CheckCircle2 size={14} className="shrink-0" />
                <div>
                  <div>Horario Disponible para la Cita</div>
                  <div className="text-micro font-normal opacity-80">
                    Atención sucursal: {disponibilidad.horario_sucursal}
                  </div>
                </div>
              </div>
            ) : disponibilidad.fuera_horario_sucursal ? (
              <div className="p-2.5 rounded-sm bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-small font-semibold flex items-center gap-2 shadow-sm">
                <AlertTriangle size={14} className="shrink-0" />
                <div>
                  <div>{disponibilidad.mensaje}</div>
                  <div className="text-micro font-normal opacity-80">
                    Horario de sucursal: {disponibilidad.horario_sucursal}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-sm bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-small font-semibold flex items-center gap-2 shadow-sm">
                <XCircle size={14} className="shrink-0" />
                <div>
                  <div>Conflicto de Horario</div>
                  <div className="text-micro font-normal opacity-80">
                    {disponibilidad.mensaje}
                  </div>
                </div>
              </div>
            )}

            {disponibilidad.citas_ocupadas && disponibilidad.citas_ocupadas.length > 0 && (
              <div className="p-2.5 rounded-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="text-tiny font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Citas agendadas en la fecha:</span>
                  <span className="font-mono">({disponibilidad.citas_ocupadas.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {disponibilidad.citas_ocupadas.map((c) => (
                    <span
                      key={c.id}
                      className="px-1.5 py-0.5 rounded-sm bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400 text-micro font-mono font-bold flex items-center gap-1"
                    >
                      <Clock size={9} />
                      {c.hora_inicio} - {c.hora_fin} ({c.paciente})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {checkingAvailability && (
          <div className="text-tiny text-primary dark:text-secondary font-medium flex items-center gap-1 mt-1">
            <Info size={11} className="animate-spin" />
            <span>Verificando disponibilidad...</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          {cita && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-4 py-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 text-small font-semibold transition-colors"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={isFormDisabled}
            className="px-6 py-1.5 rounded bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-bold shadow-sm disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 size={13} />
            <span>{isSubmitting ? 'Guardando...' : cita ? 'Guardar Cambios' : 'Registrar Cita'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
