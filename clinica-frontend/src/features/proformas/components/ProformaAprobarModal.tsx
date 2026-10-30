import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  UserPlus,
  UserCheck,
  Calendar,
  AlertTriangle,
  Sparkles,
  Receipt,
} from 'lucide-react';
import type { Proforma, ProformaEstado } from '../types/proforma';
import type { Paciente } from '../../patients/types/patient';
import { getPacientesApi } from '../../patients/services/patientService';
import { cambiarEstadoProformaApi } from '../services/proformaService';
import { toast } from 'sonner';

interface ProformaAprobarModalProps {
  isOpen: boolean;
  onClose: () => void;
  proforma: Proforma | null;
  onProformaActualizada: (proforma: Proforma) => void;
  onAgendarCita?: (proforma: Proforma) => void;
  onFacturarDirecto?: (proforma: Proforma) => void;
}

export const ProformaAprobarModal: React.FC<ProformaAprobarModalProps> = ({
  isOpen,
  onClose,
  proforma,
  onProformaActualizada,
  onAgendarCita,
  onFacturarDirecto,
}) => {
  const [nuevoEstado, setNuevoEstado] = useState<ProformaEstado>('Aprobado');
  const [opcionPaciente, setOpcionPaciente] = useState<'crear' | 'vincular'>('crear');
  const [selectedPacienteId, setSelectedPacienteId] = useState<number | ''>('');
  const [deseaCita, setDeseaCita] = useState<boolean>(false);
  const [deseaFacturar, setDeseaFacturar] = useState<boolean>(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNuevoEstado('Aprobado');
      setDeseaCita(false);
      setDeseaFacturar(false);
      setSelectedPacienteId('');
      if (proforma?.paciente_id) {
        setOpcionPaciente('vincular');
        setSelectedPacienteId(proforma.paciente_id);
      } else {
        setOpcionPaciente('crear');
      }

      getPacientesApi()
        .then((list) => setPacientes(list))
        .catch(() => {});
    }
  }, [isOpen, proforma]);

  if (!isOpen || !proforma) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (nuevoEstado === 'Rechazado') {
        const updated = await cambiarEstadoProformaApi(proforma.id, {
          estado: 'Rechazado',
        });
        toast.info(`Presupuesto ${proforma.codigo_proforma} marcado como Rechazado.`);
        onProformaActualizada(updated);
        onClose();
        return;
      }

      // Estado Aprobado
      const payload: any = {
        estado: 'Aprobado',
      };

      if (opcionPaciente === 'vincular' && selectedPacienteId) {
        payload.paciente_id = Number(selectedPacienteId);
      } else if (opcionPaciente === 'crear' && !proforma.paciente_id) {
        payload.registrar_nuevo_paciente = true;
      }

      const updated = await cambiarEstadoProformaApi(proforma.id, payload);
      toast.success(
        `¡Presupuesto ${proforma.codigo_proforma} APROBADO exitosamente!` +
          (payload.registrar_nuevo_paciente
            ? ' Se generó la nueva ficha del paciente.'
            : '')
      );
      onProformaActualizada(updated);
      onClose();

      if (deseaCita && onAgendarCita) {
        onAgendarCita(updated);
      } else if (deseaFacturar && onFacturarDirecto) {
        onFacturarDirecto(updated);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al actualizar el estado de la proforma.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-2xl w-full max-w-lg overflow-hidden text-slate-800 dark:text-slate-200">
        {/* HEADER */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-dark-bg">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-primary/10 text-primary">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary-dark dark:text-white">
                Gestionar Decisión del Cliente
              </h3>
              <p className="text-tiny text-slate-500 dark:text-slate-400 font-mono">
                Cotización: {proforma.codigo_proforma} • {proforma.nombre} {proforma.apellido}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* SELECCIÓN DE ESTADO */}
          <div>
            <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 mb-2">
              ¿Cuál fue la respuesta del cliente a esta proforma?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-sm border cursor-pointer flex items-center gap-2.5 transition-all ${
                  nuevoEstado === 'Aprobado'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="estado"
                  value="Aprobado"
                  checked={nuevoEstado === 'Aprobado'}
                  onChange={() => setNuevoEstado('Aprobado')}
                  className="accent-emerald-600"
                />
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <div>
                  <span>Aprobado</span>
                  <p className="text-micro font-normal text-slate-500 mt-0.5">
                    Acepta presupuesto y continúa
                  </p>
                </div>
              </label>

              <label
                className={`p-3 rounded-sm border cursor-pointer flex items-center gap-2.5 transition-all ${
                  nuevoEstado === 'Rechazado'
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 font-bold'
                    : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="estado"
                  value="Rechazado"
                  checked={nuevoEstado === 'Rechazado'}
                  onChange={() => setNuevoEstado('Rechazado')}
                  className="accent-rose-600"
                />
                <XCircle size={16} className="text-rose-600 shrink-0" />
                <div>
                  <span>Rechazado</span>
                  <p className="text-micro font-normal text-slate-500 mt-0.5">
                    Declina y finaliza el flujo
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* FLUJO CONDICIONAL: SOLO SI ES APROBADO */}
          {nuevoEstado === 'Aprobado' && (
            <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800 animate-fade-in">
              {/* PASO 1: PACIENTE EN EL SISTEMA */}
              <div className="bg-slate-50 dark:bg-dark-bg p-3.5 rounded-sm border border-slate-200 dark:border-slate-800 space-y-2.5">
                <span className="font-bold uppercase tracking-wider text-tiny text-primary flex items-center gap-1.5">
                  <UserCheck size={14} />
                  <span>1. Registro del Paciente en el Sistema</span>
                </span>

                {proforma.paciente_id ? (
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 size={14} className="shrink-0" />
                    <span>
                      Ya está vinculado con: <strong>{proforma.paciente?.nombre} {proforma.paciente?.apellido}</strong> ({proforma.paciente?.codigo_paciente}).
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="opcionPaciente"
                        checked={opcionPaciente === 'crear'}
                        onChange={() => setOpcionPaciente('crear')}
                        className="accent-primary"
                      />
                      <UserPlus size={14} className="text-primary shrink-0" />
                      <span>
                        <strong>Registrar como Paciente Nuevo</strong> con los datos de esta cotización ({proforma.nombre} {proforma.apellido}, {proforma.edad} años).
                      </span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="opcionPaciente"
                        checked={opcionPaciente === 'vincular'}
                        onChange={() => setOpcionPaciente('vincular')}
                        className="accent-primary"
                      />
                      <UserCheck size={14} className="text-slate-400 shrink-0" />
                      <span>Vincular a un paciente ya registrado anteriormente</span>
                    </label>

                    {opcionPaciente === 'vincular' && (
                      <div className="pl-6 pt-1">
                        <select
                          value={selectedPacienteId}
                          onChange={(e) => setSelectedPacienteId(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface"
                          required
                        >
                          <option value="">Seleccione un paciente...</option>
                          {pacientes.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.codigo_paciente} - {p.nombre} {p.apellido} (CI/Telf: {p.celular})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* PASO 2: OPCIONES DE AGENDAMIENTO & FACTURACIÓN */}
              <div className="bg-slate-50 dark:bg-dark-bg p-3.5 rounded-sm border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold uppercase tracking-wider text-tiny text-slate-500 block mb-1">
                  2. Siguientes Pasos (Opcionales)
                </span>

                <label className="flex items-start gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deseaCita}
                    onChange={(e) => {
                      setDeseaCita(e.target.checked);
                      if (e.target.checked) setDeseaFacturar(false);
                    }}
                    className="accent-primary mt-0.5"
                  />
                  <div>
                    <span className="font-semibold flex items-center gap-1.5">
                      <Calendar size={13} className="text-primary" />
                      <span>Agendar Cita Clínica de Inicio</span>
                    </span>
                    <p className="text-tiny text-slate-500">
                      Abrirá inmediatamente el agendador de citas con este paciente y doctor preseleccionados.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2 text-slate-700 dark:text-slate-300 cursor-pointer pt-1 border-t border-slate-200 dark:border-slate-700">
                  <input
                    type="checkbox"
                    checked={deseaFacturar}
                    onChange={(e) => {
                      setDeseaFacturar(e.target.checked);
                      if (e.target.checked) setDeseaCita(false);
                    }}
                    className="accent-primary mt-0.5"
                  />
                  <div>
                    <span className="font-semibold flex items-center gap-1.5">
                      <Receipt size={13} className="text-primary" />
                      <span>Emitir Boleta / Cobro Inmediato</span>
                    </span>
                    <p className="text-tiny text-slate-500">
                      Redirigirá a Facturación cargando los servicios cotizados listos para cobrar.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* MENSAJE DE RECHAZADO */}
          {nuevoEstado === 'Rechazado' && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-sm text-xs text-rose-700 dark:text-rose-400">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <AlertTriangle size={14} />
                <span>Culminación del flujo</span>
              </div>
              <p>
                Al marcar como <strong>Rechazado</strong>, no se registrará paciente ni se habilitará facturación. La proforma quedará archivada para trazabilidad y estadísticas.
              </p>
            </div>
          )}

          {/* BOTONES DE ACCIÓN */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-1.5 rounded-sm text-white font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
                nuevoEstado === 'Aprobado'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Sparkles size={14} className="animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : nuevoEstado === 'Aprobado' ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Confirmar Aprobación</span>
                </>
              ) : (
                <>
                  <XCircle size={14} />
                  <span>Confirmar Rechazo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
