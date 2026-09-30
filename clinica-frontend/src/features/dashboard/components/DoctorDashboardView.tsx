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
        <div className="h-32 bg-white dark:bg-[#002D5E] rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/20"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white dark:bg-[#002D5E] rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/20"></div>
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#002D5E] via-[#0840A8] to-[#0077D4] text-white p-6 sm:p-8 shadow-xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-[#00C2E0]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Stethoscope className="w-3.5 h-3.5 text-white" />
                Panel Médico Clínico • {especialidad}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm">
              Bienvenido(a), Dr(a). {doctorNombre}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl font-medium">
              Resumen de sus boletas emitidas, cálculo de comisiones ganadas, pacientes atendidos y agenda de citas para hoy.
            </p>
          </div>
        </div>
      </div>

      {/* KPIS PERSONALIZADOS DEL DOCTOR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MIS VENTAS MES */}
        <div className="bg-white dark:bg-[#002D5E] rounded-2xl p-5 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0077D4] dark:text-blue-200/90 uppercase tracking-wider">
              Mis Ventas del Mes
            </span>
            <div className="p-2.5 rounded-xl bg-[#0077D4]/20 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-[#0077D4] dark:text-[#00C2E0]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-[#0840A8] dark:text-white font-mono">
              {formatBs(data.mis_ventas_mes)}
            </h3>
            <span className="text-[11px] text-[#0077D4] dark:text-blue-200/70 mt-1 block">
              Monto total de boletas emitidas
            </span>
          </div>
        </div>

        {/* MIS COMISIONES */}
        <div className="bg-white dark:bg-[#002D5E] rounded-2xl p-5 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 border border-emerald-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Mis Comisiones Ganadas
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-600 dark:text-emerald-400">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {formatBs(data.mis_comisiones_mes)}
            </h3>
            <span className="text-[11px] text-emerald-300/80 mt-1 block">
              Honorarios acumulados este mes
            </span>
          </div>
        </div>

        {/* MIS CITAS HOY */}
        <div className="bg-white dark:bg-[#002D5E] rounded-2xl p-5 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0077D4] dark:text-blue-200/90 uppercase tracking-wider">
              Mis Citas de Hoy
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-600 dark:text-amber-300">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-[#0077D4] dark:text-[#00C2E0] font-mono">
              {data.mis_citas_hoy_count}
            </h3>
            <span className="text-[11px] text-[#0077D4] dark:text-blue-200/70 mt-1 block">
              Pacientes agendados para su consulta
            </span>
          </div>
        </div>

        {/* MIS PACIENTES ATENDIDOS */}
        <div className="bg-white dark:bg-[#002D5E] rounded-2xl p-5 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0077D4] dark:text-blue-200/90 uppercase tracking-wider">
              Mis Pacientes Atendidos
            </span>
            <div className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-600 dark:text-sky-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-[#0840A8] dark:text-white font-mono">
              {data.mis_pacientes_count}
            </h3>
            <span className="text-[11px] text-[#0077D4] dark:text-blue-200/70 mt-1 block">
              Pacientes únicos en su expediente
            </span>
          </div>
        </div>
      </div>

      {/* AGENDA DEL DOCTOR PARA HOY */}
      <div className="bg-white dark:bg-[#002D5E] rounded-2xl shadow-xl shadow-sm dark:shadow-[#001C3D]/50 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 overflow-hidden">
        <div className="p-4 bg-[#E5F7FF] dark:bg-[#0840A8]/30 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#0077D4] dark:text-[#00C2E0]" />
            <h3 className="text-base font-bold text-[#0840A8] dark:text-white">
              Mi Agenda de Consultas para Hoy ({data.citas_hoy.length})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[650px] text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[11px] font-bold text-[#0077D4] dark:text-blue-200/90 uppercase tracking-wider border-b border-[#0840A8]/15 dark:border-[#0077D4]/30">
                <th className="py-3 px-4">Horario</th>
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4">Sucursal</th>
                <th className="py-3 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0840A8]/15 dark:divide-[#0840A8]/40 text-xs text-[#0840A8] dark:text-white">
              {data.citas_hoy.map((cita) => {
                const pacName = cita.paciente
                  ? `${cita.paciente.nombre} ${cita.paciente.apellido}`
                  : cita.nombre_paciente_unregistered || 'Paciente';

                return (
                  <tr key={cita.id} className="hover:bg-[#E5F7FF] dark:hover:bg-[#0840A8]/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#0077D4] dark:text-[#00C2E0]">
                      {cita.hora_inicio ? cita.hora_inicio.substring(0, 5) : '09:00'} - {cita.hora_fin ? cita.hora_fin.substring(0, 5) : '10:00'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#0840A8] dark:text-white">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-[#0077D4] dark:text-blue-200/70" />
                        {pacName}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#0077D4] dark:text-blue-200">
                      {cita.sucursal?.nombre || 'Central'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#0077D4]/30 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/30">
                        {cita.estado || 'Programada'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {data.citas_hoy.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-[#0077D4] dark:text-blue-200/60 text-xs">
                    No tiene citas agendadas para el día de hoy
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ÚLTIMAS BOLETAS EMITIDAS POR EL DOCTOR */}
      <div className="bg-white dark:bg-[#002D5E] rounded-2xl shadow-xl shadow-sm dark:shadow-[#001C3D]/50 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 overflow-hidden">
        <div className="p-4 bg-[#E5F7FF] dark:bg-[#0840A8]/30 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Receipt className="w-5 h-5 text-[#0077D4] dark:text-[#00C2E0]" />
            <h3 className="text-base font-bold text-[#0840A8] dark:text-white">
              Mis Últimas Boletas Emitidas
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[11px] font-bold text-[#0077D4] dark:text-blue-200/90 uppercase tracking-wider border-b border-[#0840A8]/15 dark:border-[#0077D4]/30">
                <th className="py-3 px-4">N° Boleta</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4 text-right">Monto Total</th>
                <th className="py-3 px-4 text-right">Mi Comisión</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0840A8]/15 dark:divide-[#0840A8]/40 text-xs text-[#0840A8] dark:text-white">
              {data.ultimas_boletas.map((b) => {
                const pacName = b.cita?.paciente
                  ? `${b.cita.paciente.nombre} ${b.cita.paciente.apellido}`
                  : b.cita?.nombre_paciente_unregistered || 'Paciente';

                return (
                  <tr key={b.id} className="hover:bg-[#E5F7FF] dark:hover:bg-[#0840A8]/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#0077D4] dark:text-[#00C2E0]">
                      {b.numero_boleta || `BOL-${b.id}`}
                    </td>
                    <td className="py-3 px-4 text-[#0077D4] dark:text-blue-200/70">
                      {b.fecha_emision ? new Date(b.fecha_emision).toLocaleDateString('es-ES') : '-'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#0840A8] dark:text-white">
                      {pacName}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#0840A8] dark:text-white">
                      {formatBs(Number(b.monto_total) || 0)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatBs(Number(b.monto_comision_dr) || 0)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {b.estado === 'completado' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          Completado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-600 dark:text-amber-300 border border-amber-500/40">
                          <Clock className="w-3 h-3 text-amber-400" />
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
                        className="p-1.5 rounded-lg text-[#0077D4] dark:text-blue-200/80 hover:text-[#0840A8] dark:text-white hover:bg-[#0077D4]/40 transition-colors cursor-pointer"
                        title="Ver detalle de boleta"
                      >
                        <Eye className="w-4 h-4 text-[#0077D4] dark:text-[#00C2E0]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {data.ultimas_boletas.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-[#0077D4] dark:text-blue-200/60 text-xs">
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
