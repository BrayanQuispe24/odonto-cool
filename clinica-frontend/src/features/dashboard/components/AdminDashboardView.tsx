import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Users,
  Calendar,
  Building2,
  DollarSign,
  BarChart3,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import type { AdminDashboardData } from '../types/dashboardTypes';
import { getAdminDashboardStatsApi } from '../services/dashboardService';

export const AdminDashboardView: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const stats = await getAdminDashboardStatsApi();
        setData(stats);
      } catch (err) {
        console.error('Error al cargar datos del dashboard de administrador:', err);
        toast.error('No se pudieron cargar las estadísticas del sistema');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
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

  const maxVenta = Math.max(...data.grafico_ventas.map((g) => g.total), 1);

  return (
    <div className="space-y-6">
      {/* BANNER BIENVENIDA ADMINISTRADOR */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#002D5E] via-[#0840A8] to-[#0077D4] text-white p-6 sm:p-8 shadow-xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-[#00C2E0]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                Panel de Administración Global
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm">
              Visión General de la Clínica Dental
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl font-medium">
              Consolidado en tiempo real de ventas globales, registro total de pacientes, sucursales activas y volumen de citas.
            </p>
          </div>
        </div>
      </div>

      {/* KPIS PRINCIPALES DEL SISTEMA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL VENTAS MES */}
        <div className="bg-white dark:bg-[#002D5E] rounded-2xl p-5 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0077D4] dark:text-blue-200/90 uppercase tracking-wider">
              Ventas del Mes
            </span>
            <div className="p-2.5 rounded-xl bg-[#0077D4]/20 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-[#0077D4] dark:text-[#00C2E0]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-[#0840A8] dark:text-white font-mono">
              {formatBs(data.ventas_mes)}
            </h3>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Recaudado: {formatBs(data.cobrado_mes)}
            </span>
          </div>
        </div>

        {/* REGISTRO DE PACIENTES */}
        <div className="bg-white dark:bg-[#002D5E] rounded-2xl p-5 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0077D4] dark:text-blue-200/90 uppercase tracking-wider">
              Pacientes Totales
            </span>
            <div className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-600 dark:text-sky-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-[#0840A8] dark:text-white font-mono">
              {data.total_pacientes}
            </h3>
            <span className="text-[11px] text-[#0077D4] dark:text-blue-200/70 mt-1 block">
              Registrados en todo el sistema
            </span>
          </div>
        </div>

        {/* CITAS PROGRAMADAS HOY */}
        <div className="bg-white dark:bg-[#002D5E] rounded-2xl p-5 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0077D4] dark:text-blue-200/90 uppercase tracking-wider">
              Citas de Hoy
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-600 dark:text-amber-300">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-[#0077D4] dark:text-[#00C2E0] font-mono">
              {data.citas_hoy_count}
            </h3>
            <span className="text-[11px] text-[#0077D4] dark:text-blue-200/70 mt-1 block">
              Agendadas para la jornada
            </span>
          </div>
        </div>

        {/* ESTADO BOLETAS */}
        <div className="bg-white dark:bg-[#002D5E] rounded-2xl p-5 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0077D4] dark:text-blue-200/90 uppercase tracking-wider">
              Boletas Emitidas
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-600 dark:text-emerald-400">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold block">Completadas</span>
              <span className="text-xl font-black text-[#0840A8] dark:text-white font-mono">{data.boletas_completadas}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-amber-600 dark:text-amber-300 uppercase font-bold block">Pendientes</span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-300 font-mono">{data.boletas_pendientes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* GRÁFICO HISTÓRICO DE VENTAS Y SUCURSALES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRÁFICO DE TENDENCIA DE VENTAS */}
        <div className="lg:col-span-2 bg-white dark:bg-[#002D5E] rounded-2xl p-5 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#0077D4]/20 text-[#0077D4] dark:text-[#00C2E0]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0840A8] dark:text-white">
                  Histórico de Ventas (Últimos 6 Meses)
                </h3>
                <p className="text-xs text-[#0077D4] dark:text-blue-200/80">
                  Tendencia mensual de ingresos facturados
                </p>
              </div>
            </div>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-4 px-2">
            {data.grafico_ventas.map((g, idx) => {
              const heightPercent = Math.max(12, Math.round((g.total / maxVenta) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-[#0077D4] dark:text-[#00C2E0] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {formatBs(g.total)}
                  </span>
                  <div className="w-full bg-[#F4F9FF] dark:bg-[#001C3D] rounded-t-xl h-full flex items-end p-1">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-[#0077D4] to-[#00C2E0] rounded-t-lg transition-all duration-500 group-hover:from-[#0840A8] group-hover:to-[#00C2E0]"
                    />
                  </div>
                  <span className="text-xs font-bold text-[#0077D4] dark:text-blue-200/80">
                    {g.mes}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RESUMEN POR SUCURSALES */}
        <div className="bg-white dark:bg-[#002D5E] rounded-2xl p-5 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-[#0077D4] dark:text-[#00C2E0]" />
              <h3 className="text-base font-bold text-[#0840A8] dark:text-white">
                Ventas por Sucursal
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {data.ventas_sucursales.map((suc) => (
              <div
                key={suc.id}
                className="p-3.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/30 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#0840A8] dark:text-white block">
                    {suc.nombre}
                  </h4>
                  <span className="text-[10px] text-[#0077D4] dark:text-blue-200/70">
                    {suc.citas_count} citas registradas
                  </span>
                </div>
                <span className="text-sm font-black font-mono text-[#0077D4] dark:text-[#00C2E0]">
                  {formatBs(suc.total_generado)}
                </span>
              </div>
            ))}
            {data.ventas_sucursales.length === 0 && (
              <div className="text-center text-[#0077D4] dark:text-blue-200/60 py-6 text-xs">
                Sin registros de sucursales
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CITAS PROGRAMADAS DE HOY */}
      <div className="bg-white dark:bg-[#002D5E] rounded-2xl shadow-xl shadow-sm dark:shadow-[#001C3D]/50 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 overflow-hidden">
        <div className="p-4 bg-[#E5F7FF] dark:bg-[#0840A8]/30 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#0077D4] dark:text-[#00C2E0]" />
            <h3 className="text-base font-bold text-[#0840A8] dark:text-white">
              Citas Programadas para Hoy ({data.citas_hoy.length})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[11px] font-bold text-[#0077D4] dark:text-blue-200/90 uppercase tracking-wider border-b border-[#0840A8]/15 dark:border-[#0077D4]/30">
                <th className="py-3 px-4">Horario</th>
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4">Doctor</th>
                <th className="py-3 px-4">Sucursal</th>
                <th className="py-3 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0840A8]/15 dark:divide-[#0840A8]/40 text-xs text-[#0840A8] dark:text-white">
              {data.citas_hoy.map((cita) => {
                const pacName = cita.paciente
                  ? `${cita.paciente.nombre} ${cita.paciente.apellido}`
                  : cita.nombre_paciente_unregistered || 'Paciente';

                const docName = cita.doctor
                  ? `${cita.doctor.nombre} ${cita.doctor.apellido}`
                  : 'Sin Asignar';

                return (
                  <tr key={cita.id} className="hover:bg-[#E5F7FF] dark:hover:bg-[#0840A8]/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#0077D4] dark:text-[#00C2E0]">
                      {cita.hora_inicio ? cita.hora_inicio.substring(0, 5) : '09:00'} - {cita.hora_fin ? cita.hora_fin.substring(0, 5) : '10:00'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#0840A8] dark:text-white">
                      {pacName}
                    </td>
                    <td className="py-3 px-4 text-[#0077D4] dark:text-blue-200">
                      Dr(a). {docName}
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
                  <td colSpan={5} className="py-6 text-center text-[#0077D4] dark:text-blue-200/60 text-xs">
                    No hay citas agendadas para el día de hoy
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
