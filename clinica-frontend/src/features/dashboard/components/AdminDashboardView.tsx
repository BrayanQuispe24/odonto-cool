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

  const maxVenta = Math.max(...data.grafico_ventas.map((g) => g.total), 1);

  return (
    <div className="space-y-6">
      {/* BANNER BIENVENIDA ADMINISTRADOR */}
      <div className="relative overflow-hidden rounded-sm bg-white dark:bg-dark-surface p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-sm bg-[#0077D4]/10 border border-[#0077D4]/20 text-[#0077D4] text-tiny font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                Panel de Administración Global
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-200">
              Visión General de la Clínica Dental
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
              Consolidado en tiempo real de ventas globales, registro total de pacientes, sucursales activas y volumen de citas.
            </p>
          </div>
        </div>
      </div>

      {/* KPIS PRINCIPALES DEL SISTEMA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL VENTAS MES */}
        <div className="bg-white dark:bg-dark-surface rounded-sm p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Ventas del Mes
            </span>
            <div className="p-2 rounded-sm bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 font-mono">
              {formatBs(data.ventas_mes)}
            </h3>
            <span className="text-small text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Recaudado: {formatBs(data.cobrado_mes)}
            </span>
          </div>
        </div>

        {/* REGISTRO DE PACIENTES */}
        <div className="bg-white dark:bg-dark-surface rounded-sm p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pacientes Totales
            </span>
            <div className="p-2 rounded-sm bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800/50 text-sky-600 dark:text-sky-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 font-mono">
              {data.total_pacientes}
            </h3>
            <span className="text-small text-slate-500 dark:text-slate-400 mt-1 block">
              Registrados en todo el sistema
            </span>
          </div>
        </div>

        {/* CITAS PROGRAMADAS HOY */}
        <div className="bg-white dark:bg-dark-surface rounded-sm p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Citas de Hoy
            </span>
            <div className="p-2 rounded-sm bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 text-amber-600 dark:text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-[#0077D4] font-mono">
              {data.citas_hoy_count}
            </h3>
            <span className="text-small text-slate-500 dark:text-slate-400 mt-1 block">
              Agendadas para la jornada
            </span>
          </div>
        </div>

        {/* ESTADO BOLETAS */}
        <div className="bg-white dark:bg-dark-surface rounded-sm p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Boletas Emitidas
            </span>
            <div className="p-2 rounded-sm bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <span className="text-tiny text-emerald-600 dark:text-emerald-400 uppercase font-bold block">Completadas</span>
              <span className="text-xl font-bold text-slate-800 dark:text-slate-200 font-mono">{data.boletas_completadas}</span>
            </div>
            <div className="text-right">
              <span className="text-tiny text-amber-600 dark:text-amber-400 uppercase font-bold block">Pendientes</span>
              <span className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono">{data.boletas_pendientes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* GRÁFICO HISTÓRICO DE VENTAS Y SUCURSALES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRÁFICO DE TENDENCIA DE VENTAS */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-surface rounded-sm p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-sm bg-[#0077D4]/10 text-[#0077D4]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Histórico de Ventas (Últimos 6 Meses)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
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
                  <span className="text-tiny font-mono font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {formatBs(g.total)}
                  </span>
                  <div className="w-full bg-slate-50 dark:bg-dark-bg rounded-t-sm h-full flex items-end p-1">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-[#0077D4] rounded-t-sm transition-all duration-500 group-hover:bg-[#0840A8]"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {g.mes}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RESUMEN POR SUCURSALES */}
        <div className="bg-white dark:bg-dark-surface rounded-sm p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-slate-500" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Ventas por Sucursal
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {data.ventas_sucursales.map((suc) => (
              <div
                key={suc.id}
                className="p-3.5 rounded-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    {suc.nombre}
                  </h4>
                  <span className="text-tiny text-slate-500">
                    {suc.citas_count} citas registradas
                  </span>
                </div>
                <span className="text-sm font-bold font-mono text-[#0077D4]">
                  {formatBs(suc.total_generado)}
                </span>
              </div>
            ))}
            {data.ventas_sucursales.length === 0 && (
              <div className="text-center text-slate-400 py-6 text-xs">
                Sin registros de sucursales
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CITAS PROGRAMADAS DE HOY */}
      <div className="bg-white dark:bg-dark-surface rounded-sm shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-500" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Citas Programadas para Hoy ({data.citas_hoy.length})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-dark-surface text-small font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Horario</th>
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4">Doctor</th>
                <th className="py-3 px-4">Sucursal</th>
                <th className="py-3 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
              {data.citas_hoy.map((cita) => {
                const pacName = cita.paciente
                  ? `${cita.paciente.nombre} ${cita.paciente.apellido}`
                  : cita.nombre_paciente_unregistered || 'Paciente';

                const docName = cita.doctor
                  ? `${cita.doctor.nombre} ${cita.doctor.apellido}`
                  : 'Sin Asignar';

                return (
                  <tr key={cita.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-600 dark:text-slate-400">
                      {cita.hora_inicio ? cita.hora_inicio.substring(0, 5) : '09:00'} - {cita.hora_fin ? cita.hora_fin.substring(0, 5) : '10:00'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {pacName}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      Dr(a). {docName}
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
                  <td colSpan={5} className="py-6 text-center text-slate-400 text-xs">
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
