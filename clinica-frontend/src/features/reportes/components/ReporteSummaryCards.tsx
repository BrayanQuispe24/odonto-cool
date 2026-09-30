import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Clock,
  UserCheck,
  FlaskConical,
  Coins,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import type { ReporteResumen } from '../types/reporteTypes';

interface Props {
  resumen: ReporteResumen;
  loading: boolean;
}

export const ReporteSummaryCards: React.FC<Props> = ({ resumen, loading }) => {
  const formatBs = (val: number) =>
    `Bs. ${val.toLocaleString('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4 mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-28 bg-white dark:bg-[#002D5E] rounded-2xl p-4 shadow-xl border border-[#0840A8]/15 dark:border-[#00C2E0]/20 animate-pulse flex flex-col justify-between"
          >
            <div className="h-4 bg-[#0840A8] rounded w-2/3"></div>
            <div className="h-7 bg-[#0840A8] rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4 mb-6">
      {/* CARD 1: TOTAL GENERADO */}
      <div className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white rounded-2xl p-4 shadow-xl border border-[#0840A8]/15 dark:border-[#00C2E0]/40 relative overflow-hidden flex flex-col justify-between min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#0077D4] dark:text-[#00C2E0] block truncate">
            Total Facturado
          </span>
          <div className="p-1.5 rounded-lg bg-[#0077D4]/20 text-[#0077D4] dark:text-[#00C2E0] shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-lg sm:text-xl font-black tracking-tight font-mono text-[#0840A8] dark:text-white truncate" title={formatBs(resumen.monto_total_generado)}>
          {formatBs(resumen.monto_total_generado)}
        </h3>
        <div className="mt-3 pt-2 border-t border-[#0840A8]/15 dark:border-[#0840A8]/60 flex items-center justify-between text-[11px] text-[#0077D4] dark:text-blue-200/80">
          <span className="truncate">{resumen.total_boletas} boletas</span>
          <FileCheck className="w-3.5 h-3.5 text-[#0077D4] dark:text-[#00C2E0] shrink-0" />
        </div>
      </div>

      {/* CARD 2: TOTAL COBRADO */}
      <div className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white rounded-2xl p-4 shadow-xl border border-emerald-500/30 relative overflow-hidden flex flex-col justify-between min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 block truncate">
            Total Cobrado
          </span>
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-lg sm:text-xl font-black tracking-tight font-mono text-emerald-600 dark:text-emerald-400 truncate" title={formatBs(resumen.monto_total_cobrado)}>
          {formatBs(resumen.monto_total_cobrado)}
        </h3>
        <div className="mt-3 pt-2 border-t border-[#0840A8]/15 dark:border-[#0840A8]/60 flex items-center justify-between text-[11px] text-[#0077D4] dark:text-blue-200/80">
          <span className="truncate">Ingresos en caja</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        </div>
      </div>

      {/* CARD 3: SALDO PENDIENTE */}
      <div className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white rounded-2xl p-4 shadow-xl border border-amber-500/30 relative overflow-hidden flex flex-col justify-between min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-300 block truncate">
            Saldo Pendiente
          </span>
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-300 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-lg sm:text-xl font-black tracking-tight font-mono text-amber-600 dark:text-amber-300 truncate" title={formatBs(resumen.monto_total_pendiente)}>
          {formatBs(resumen.monto_total_pendiente)}
        </h3>
        <div className="mt-3 pt-2 border-t border-[#0840A8]/15 dark:border-[#0840A8]/60 flex items-center justify-between text-[11px] text-[#0077D4] dark:text-blue-200/80">
          <span className="truncate">{resumen.boletas_pendientes} por saldar</span>
        </div>
      </div>

      {/* CARD 4: COMISIONES DOCTORES */}
      <div className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white rounded-2xl p-4 shadow-xl border border-sky-500/30 relative overflow-hidden flex flex-col justify-between min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-sky-300 block truncate">
            Comisiones Doctores
          </span>
          <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-300 shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-lg sm:text-xl font-black tracking-tight font-mono text-sky-300 truncate" title={formatBs(resumen.monto_comisiones_dr)}>
          {formatBs(resumen.monto_comisiones_dr)}
        </h3>
        <div className="mt-3 pt-2 border-t border-[#0840A8]/15 dark:border-[#0840A8]/60 flex items-center justify-between text-[11px] text-[#0077D4] dark:text-blue-200/80">
          <span className="truncate">Honorarios médicos</span>
        </div>
      </div>

      {/* CARD 5: COSTOS LABORATORIO */}
      <div className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white rounded-2xl p-4 shadow-xl border border-rose-500/30 relative overflow-hidden flex flex-col justify-between min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 block truncate">
            Costos Laboratorio
          </span>
          <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
            <FlaskConical className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-lg sm:text-xl font-black tracking-tight font-mono text-rose-400 truncate" title={formatBs(resumen.monto_costo_laboratorio)}>
          {formatBs(resumen.monto_costo_laboratorio)}
        </h3>
        <div className="mt-3 pt-2 border-t border-[#0840A8]/15 dark:border-[#0840A8]/60 flex items-center justify-between text-[11px] text-[#0077D4] dark:text-blue-200/80">
          <span className="truncate">Trabajos externos</span>
        </div>
      </div>

      {/* CARD 6: GANANCIA NETA ESTIMADA */}
      <div className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white rounded-2xl p-4 shadow-xl border border-teal-400/30 relative overflow-hidden flex flex-col justify-between min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-teal-300 block truncate">
            Ganancia Neta Est.
          </span>
          <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 shrink-0">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-lg sm:text-xl font-black tracking-tight font-mono text-teal-300 truncate" title={formatBs(resumen.ganancia_neta_estimada)}>
          {formatBs(resumen.ganancia_neta_estimada)}
        </h3>
        <div className="mt-3 pt-2 border-t border-[#0840A8]/15 dark:border-[#0840A8]/60 flex items-center justify-between text-[11px] text-[#0077D4] dark:text-blue-200/80">
          <span className="truncate">Cobrado - Com - Lab</span>
        </div>
      </div>
    </div>
  );
};
