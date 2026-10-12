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
            className="h-28 bg-white dark:bg-dark-surface rounded-sm p-4 shadow-sm border border-slate-200 dark:border-slate-800 animate-pulse flex flex-col justify-between"
          >
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
            <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4 mb-6">
      {/* CARD 1: TOTAL GENERADO */}
      <div className="bg-white dark:bg-dark-surface rounded-sm p-4 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-tiny uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block truncate">
            Total Facturado
          </span>
          <div className="p-1 rounded bg-[#0077D4]/10 text-[#0077D4] shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate" title={formatBs(resumen.monto_total_generado)}>
          {formatBs(resumen.monto_total_generado)}
        </h3>
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate">{resumen.total_boletas} boletas</span>
          <FileCheck className="w-3.5 h-3.5 shrink-0" />
        </div>
      </div>

      {/* CARD 2: TOTAL COBRADO */}
      <div className="bg-white dark:bg-dark-surface rounded-sm p-4 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-tiny uppercase font-bold tracking-wider text-emerald-600 block truncate">
            Total Cobrado
          </span>
          <div className="p-1 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate" title={formatBs(resumen.monto_total_cobrado)}>
          {formatBs(resumen.monto_total_cobrado)}
        </h3>
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate">Ingresos en caja</span>
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
        </div>
      </div>

      {/* CARD 3: SALDO PENDIENTE */}
      <div className="bg-white dark:bg-dark-surface rounded-sm p-4 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-tiny uppercase font-bold tracking-wider text-amber-600 block truncate">
            Saldo Pendiente
          </span>
          <div className="p-1 rounded bg-amber-50 dark:bg-amber-900/30 text-amber-600 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate" title={formatBs(resumen.monto_total_pendiente)}>
          {formatBs(resumen.monto_total_pendiente)}
        </h3>
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate">{resumen.boletas_pendientes} por saldar</span>
        </div>
      </div>

      {/* CARD 4: COMISIONES DOCTORES */}
      <div className="bg-white dark:bg-dark-surface rounded-sm p-4 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-tiny uppercase font-bold tracking-wider text-sky-600 block truncate">
            Comisiones Doctores
          </span>
          <div className="p-1 rounded bg-sky-50 dark:bg-sky-900/30 text-sky-600 shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate" title={formatBs(resumen.monto_comisiones_dr)}>
          {formatBs(resumen.monto_comisiones_dr)}
        </h3>
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate">Honorarios médicos</span>
        </div>
      </div>

      {/* CARD 5: COSTOS LABORATORIO */}
      <div className="bg-white dark:bg-dark-surface rounded-sm p-4 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-tiny uppercase font-bold tracking-wider text-rose-600 block truncate">
            Costos Laboratorio
          </span>
          <div className="p-1 rounded bg-rose-50 dark:bg-rose-900/30 text-rose-600 shrink-0">
            <FlaskConical className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate" title={formatBs(resumen.monto_costo_laboratorio)}>
          {formatBs(resumen.monto_costo_laboratorio)}
        </h3>
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate">Trabajos externos</span>
        </div>
      </div>

      {/* CARD 6: GANANCIA NETA ESTIMADA */}
      <div className="bg-white dark:bg-dark-surface rounded-sm p-4 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-tiny uppercase font-bold tracking-wider text-teal-600 block truncate">
            Ganancia Neta Est.
          </span>
          <div className="p-1 rounded bg-teal-50 dark:bg-teal-900/30 text-teal-600 shrink-0">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate" title={formatBs(resumen.ganancia_neta_estimada)}>
          {formatBs(resumen.ganancia_neta_estimada)}
        </h3>
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate">Cobrado - Com - Lab</span>
        </div>
      </div>
    </div>
  );
};
