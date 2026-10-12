import React, { useEffect, useState } from 'react';
import {
  Stethoscope,
  DollarSign,
  Calendar,
  Users,
  Receipt,
  CheckCircle2,
  Clock,
  User,
  Coins,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import type { DoctorDashboardData } from '../types/dashboardTypes';
import { getDoctorDashboardStatsApi } from '../services/dashboardService';
import { useAuthStore } from '../../auth/store/authStore';
import { BoletaDetailsModal } from '../../boletas/components/BoletaDetailsModal';
import type { BoletaServicioPrestado } from '../../boletas/types/boleta';

export const DoctorDashboardView: React.FC = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<DoctorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedBoleta, setSelectedBoleta] = useState<BoletaServicioPrestado | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const loadDoctorStats = async () => {
    setLoading(true);
    try {
      const stats = await getDoctorDashboardStatsApi();
      setData(stats);
    } catch (err) {
      console.error('Error al cargar datos del dashboard de doctor:', err);
      toast.error('No se pudieron cargar sus estadísticas de consulta');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorStats();
  }, []);

  const formatBs = (val: number) =>
    `Bs. ${val.toLocaleString('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-white dark:bg-dark-surface rounded-2xl border border-primary-dark/15 dark:border-secondary/20"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white dark:bg-dark-surface rounded-2xl border border-primary-dark/15 dark:border-secondary/20"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const doctorNombre = data.doctor
    ? data.doctor.nombre
    : user?.name || 'Dr. Odontólogo';

  const especialidad = data.doctor
    ? data.doctor.especialidad
    : 'Odontología General';

  return (
    <div className="space-y-6">
      {/* BANNER DE BIENVENIDA AL DOCTOR */}
      <div className="relative overflow-hidden rounded-sm bg-white dark:bg-dark-surface p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-sm bg-[#0077D4]/10 border border-[#0077D4]/20 text-[#0077D4] text-tiny font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Stethoscope className="w-3.5 h-3.5" />
                Panel Médico Clínico • {especialidad}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-200">
              Bienvenido(a), Dr(a). {doctorNombre}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
              Resumen de sus boletas emitidas, cálculo de comisiones ganadas, pacientes atendidos y agenda de citas para hoy.
            </p>
          </div>
        </div>
      </div>

      {/* KPIS PERSONALIZADOS DEL DOCTOR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MIS VENTAS MES */}
        <div className="bg-white dark:bg-dark-surface rounded-sm p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Mis Ventas del Mes
            </span>
            <div className="p-2 rounded-sm bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 font-mono">
              {formatBs(data.mis_ventas_mes)}
            </h3>
            <span className="text-small text-slate-500 dark:text-slate-400 mt-1 block">
              Monto total de boletas emitidas
            </span>
          </div>
        </div>

        {/* MIS COMISIONES */}
        <div className="bg-white dark:bg-dark-surface rounded-sm p-5 shadow-sm border border-emerald-200 dark:border-emerald-800/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Mis Comisiones Ganadas
            </span>
            <div className="p-2 rounded-sm bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {formatBs(data.mis_comisiones_mes)}
            </h3>
            <span className="text-small text-emerald-600/70 dark:text-emerald-400/70 mt-1 block">
              Honorarios acumulados este mes
            </span>
          </div>
        </div>

        {/* MIS CITAS HOY */}
        <div className="bg-white dark:bg-dark-surface rounded-sm p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Mis Citas de Hoy
            </span>
            <div className="p-2 rounded-sm bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 text-amber-600 dark:text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-[#0077D4] font-mono">
              {data.mis_citas_hoy_count}
            </h3>
            <span className="text-small text-slate-500 dark:text-slate-400 mt-1 block">
              Pacientes agendados para su consulta
            </span>
          </div>
        </div>

        {/* MIS PACIENTES ATENDIDOS */}
        <div className="bg-white dark:bg-dark-surface rounded-sm p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Mis Pacientes Atendidos
            </span>
            <div className="p-2 rounded-sm bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800/50 text-sky-600 dark:text-sky-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 font-mono">
              {data.mis_pacientes_count}
            </h3>
            <span className="text-small text-slate-500 dark:text-slate-400 mt-1 block">
              Pacientes únicos en su expediente
            </span>
          </div>
        </div>
      </div>

      {/* AGENDA DEL DOCTOR PARA HOY */}
      <div className="bg-white dark:bg-dark-surface rounded-sm shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-500" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Mi Agenda de Consultas para Hoy ({data.citas_hoy.length})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[650px] text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-dark-surface text-small font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Horario</th>
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4">Sucursal</th>
                <th className="py-3 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
              {data.citas_hoy.map((cita) => {
                const pacName = cita.paciente
                  ? `${cita.paciente.nombre} ${cita.paciente.apellido}`
                  : cita.nombre_paciente_unregistered || 'Paciente';

                return (
                  <tr key={cita.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-600 dark:text-slate-400">
                      {cita.hora_inicio ? cita.hora_inicio.substring(0, 5) : '09:00'} - {cita.hora_fin ? cita.hora_fin.substring(0, 5) : '10:00'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {pacName}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {cita.sucursal?.nombre || 'Central'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-sm text-tiny font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {cita.estado || 'Programada'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {data.citas_hoy.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400 text-xs">
                    No tiene citas agendadas para el día de hoy
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ÚLTIMAS BOLETAS EMITIDAS POR EL DOCTOR */}
      <div className="bg-white dark:bg-dark-surface rounded-sm shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Receipt className="w-5 h-5 text-slate-500" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Mis Últimas Boletas Emitidas
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-dark-surface text-small font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">N° Boleta</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4 text-right">Monto Total</th>
                <th className="py-3 px-4 text-right">Mi Comisión</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
              {data.ultimas_boletas.map((b) => {
                const pacName = b.cita?.paciente
                  ? `${b.cita.paciente.nombre} ${b.cita.paciente.apellido}`
                  : b.cita?.nombre_paciente_unregistered || 'Paciente';

                return (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-600 dark:text-slate-400">
                      {b.numero_boleta || `BOL-${b.id}`}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {b.fecha_emision ? new Date(b.fecha_emision).toLocaleDateString('es-ES') : '-'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {pacName}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                      {formatBs(Number(b.monto_total) || 0)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatBs(Number(b.monto_comision_dr) || 0)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {b.estado === 'completado' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-tiny font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          Completado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-tiny font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                          <Clock className="w-3 h-3 text-amber-500" />
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedBoleta(b);
                          setIsDetailsModalOpen(true);
                        }}
                        className="p-1.5 rounded-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                        title="Ver detalle de boleta"
                      >
                        <Eye className="w-4 h-4 text-slate-500" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {data.ultimas_boletas.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400 text-xs">
                    No ha emitido boletas aún
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETALLE BOLETA */}
      {selectedBoleta && (
        <BoletaDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedBoleta(null);
          }}
          boleta={selectedBoleta}
          onBoletaUpdated={loadDoctorStats}
        />
      )}
    </div>
  );
};
