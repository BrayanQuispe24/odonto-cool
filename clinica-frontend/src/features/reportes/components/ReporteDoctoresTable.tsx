import React from 'react';
import { UserCheck, Stethoscope } from 'lucide-react';
import type { DesgloseDoctor } from '../types/reporteTypes';

interface Props {
  doctores: DesgloseDoctor[];
}

export const ReporteDoctoresTable: React.FC<Props> = ({ doctores }) => {
  const formatBs = (val: number) =>
    `Bs. ${val.toLocaleString('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  if (doctores.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-surface rounded-sm p-6 shadow-sm border border-slate-200 dark:border-slate-800 text-center text-slate-500 text-sm mb-6">
        No hay datos de doctores para los filtros seleccionados.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-surface rounded-sm shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
      <div className="px-3 py-2 bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#0077D4]/10 text-[#0077D4] flex items-center justify-center shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-small font-bold uppercase tracking-wider text-primary-dark dark:text-white">
              Rendimiento Financiero por Doctor
            </h4>
            <p className="text-tiny text-slate-500 dark:text-slate-400">
              Desglose de boletas, ingresos generados, recaudados y comisiones por odontólogo
            </p>
          </div>
        </div>
      </div>

      {/* VISTA DESKTOP (TABLA) */}
      <div className="hidden md:block overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800">
              <th className="py-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Doctor / Odontólogo</th>
              <th className="py-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Especialidad</th>
              <th className="py-2 px-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Boletas</th>
              <th className="py-2 px-3 text-right text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Total Facturado</th>
              <th className="py-2 px-3 text-right text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Total Cobrado</th>
              <th className="py-2 px-3 text-right text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Pendiente</th>
              <th className="py-2 px-3 text-right text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Comisión Doctor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-small text-slate-700 dark:text-slate-300">
            {doctores.map((doc) => (
              <tr key={doc.doctor_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-2 px-3 font-medium flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#0077D4]/10 text-[#0077D4] font-bold text-xs flex items-center justify-center shrink-0">
                    {doc.nombre_doctor.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="truncate max-w-[200px]" title={doc.nombre_doctor}>
                    {doc.nombre_doctor}
                  </span>
                </td>
                <td className="py-2 px-3 text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Stethoscope className="w-3 h-3 text-slate-400 shrink-0" />
                    {doc.especialidad}
                  </span>
                </td>
                <td className="py-2 px-3 text-center">
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-sm font-mono text-xs">
                    {doc.total_boletas}
                  </span>
                </td>
                <td className="py-2 px-3 text-right font-mono font-medium whitespace-nowrap">
                  {formatBs(doc.monto_total_generado)}
                </td>
                <td className="py-2 px-3 text-right font-mono font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                  {formatBs(doc.monto_total_cobrado)}
                </td>
                <td className="py-2 px-3 text-right font-mono font-medium text-amber-600 dark:text-amber-400 whitespace-nowrap">
                  {formatBs(doc.monto_total_pendiente)}
                </td>
                <td className="py-2 px-3 text-right font-mono font-medium text-sky-600 dark:text-sky-400 whitespace-nowrap">
                  {formatBs(doc.comisiones_totales)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VISTA MÓVIL (TARJETAS) */}
      <div className="block md:hidden p-3 space-y-3">
        {doctores.map((doc) => (
          <div
            key={doc.doctor_id}
            className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 rounded-sm p-3.5 space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded bg-[#0077D4]/10 text-[#0077D4] font-bold text-xs flex items-center justify-center shrink-0">
                  {doc.nombre_doctor.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-slate-800 dark:text-white text-xs block truncate">
                    {doc.nombre_doctor}
                  </span>
                  <span className="inline-flex items-center gap-1 text-tiny text-slate-500">
                    <Stethoscope className="w-3 h-3" />
                    {doc.especialidad}
                  </span>
                </div>
              </div>
              <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-tiny font-bold px-2 py-0.5 rounded-sm font-mono shrink-0">
                {doc.total_boletas} bol.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div>
                <span className="text-tiny text-slate-500 uppercase block">Facturado</span>
                <span className="font-medium font-mono text-slate-700 dark:text-white text-xs">
                  {formatBs(doc.monto_total_generado)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-tiny text-slate-500 uppercase block">Cobrado</span>
                <span className="font-medium font-mono text-emerald-600 dark:text-emerald-400 text-xs">
                  {formatBs(doc.monto_total_cobrado)}
                </span>
              </div>
              <div>
                <span className="text-tiny text-slate-500 uppercase block">Pendiente</span>
                <span className="font-medium font-mono text-amber-600 dark:text-amber-400 text-xs">
                  {formatBs(doc.monto_total_pendiente)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-tiny text-slate-500 uppercase block">Comisión</span>
                <span className="font-medium font-mono text-sky-600 dark:text-sky-400 text-xs">
                  {formatBs(doc.comisiones_totales)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
