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
      <div className="bg-white dark:bg-[#002D5E] rounded-2xl p-6 shadow-xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-center text-[#0077D4] dark:text-blue-200/80 text-sm mb-6">
        No hay datos de doctores para los filtros seleccionados.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#002D5E] rounded-2xl shadow-xl shadow-sm dark:shadow-[#001C3D]/50 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 overflow-hidden mb-6">
      <div className="p-4 bg-[#E5F7FF] dark:bg-[#0840A8]/30 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0077D4]/20 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-[#0077D4] dark:text-[#00C2E0] flex items-center justify-center font-bold shrink-0">
            <UserCheck className="w-5 h-5 text-[#0077D4] dark:text-[#00C2E0]" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#0840A8] dark:text-white">
              Rendimiento Financiero por Doctor
            </h4>
            <p className="text-xs text-[#0077D4] dark:text-blue-200/80">
              Desglose de boletas, ingresos generados, recaudados y comisiones por odontólogo
            </p>
          </div>
        </div>
      </div>

      {/* VISTA DESKTOP (TABLA) */}
      <div className="hidden md:block overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[11px] font-bold text-[#0077D4] dark:text-blue-200/90 uppercase tracking-wider border-b border-[#0840A8]/15 dark:border-[#0077D4]/30">
              <th className="py-3 px-4">Doctor / Odontólogo</th>
              <th className="py-3 px-4">Especialidad</th>
              <th className="py-3 px-4 text-center">Boletas</th>
              <th className="py-3 px-4 text-right">Total Facturado</th>
              <th className="py-3 px-4 text-right">Total Cobrado</th>
              <th className="py-3 px-4 text-right">Pendiente</th>
              <th className="py-3 px-4 text-right">Comisión Doctor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0840A8]/15 dark:divide-[#0840A8]/40 text-xs text-[#0840A8] dark:text-white">
            {doctores.map((doc) => (
              <tr key={doc.doctor_id} className="hover:bg-[#E5F7FF] dark:hover:bg-[#0840A8]/30 transition-colors">
                <td className="py-3 px-4 font-bold text-[#0840A8] dark:text-white flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#00C2E0]/20 border border-[#0840A8]/15 dark:border-[#00C2E0]/40 text-[#0077D4] dark:text-[#00C2E0] font-black text-[10px] flex items-center justify-center shrink-0">
                    {doc.nombre_doctor.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="truncate max-w-[200px]" title={doc.nombre_doctor}>
                    {doc.nombre_doctor}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#0077D4] dark:text-blue-200/80">
                  <span className="inline-flex items-center gap-1 bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/30 text-[#0077D4] dark:text-blue-200 px-2 py-0.5 rounded-lg text-[10px]">
                    <Stethoscope className="w-3 h-3 text-[#0077D4] dark:text-[#00C2E0] shrink-0" />
                    {doc.especialidad}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-bold">
                  <span className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#0077D4]/30 px-2 py-0.5 rounded-md font-mono">
                    {doc.total_boletas}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-[#0840A8] dark:text-white whitespace-nowrap">
                  {formatBs(doc.monto_total_generado)}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                  {formatBs(doc.monto_total_cobrado)}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-amber-600 dark:text-amber-300 whitespace-nowrap">
                  {formatBs(doc.monto_total_pendiente)}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-sky-300 whitespace-nowrap">
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
            className="bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 rounded-xl p-3.5 space-y-3"
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-[#0840A8]/15 dark:border-[#0840A8]/40">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#00C2E0]/20 border border-[#0840A8]/15 dark:border-[#00C2E0]/40 text-[#0077D4] dark:text-[#00C2E0] font-black text-xs flex items-center justify-center shrink-0">
                  {doc.nombre_doctor.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-[#0840A8] dark:text-white text-xs block truncate">
                    {doc.nombre_doctor}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#0077D4] dark:text-blue-200/70">
                    <Stethoscope className="w-3 h-3 text-[#0077D4] dark:text-[#00C2E0]" />
                    {doc.especialidad}
                  </span>
                </div>
              </div>
              <span className="bg-[#0077D4]/30 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono shrink-0">
                {doc.total_boletas} boletas
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div>
                <span className="text-[10px] text-[#0077D4] dark:text-blue-200/60 uppercase block">Facturado</span>
                <span className="font-bold font-mono text-[#0840A8] dark:text-white text-xs">
                  {formatBs(doc.monto_total_generado)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#0077D4] dark:text-blue-200/60 uppercase block">Cobrado</span>
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-xs">
                  {formatBs(doc.monto_total_cobrado)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#0077D4] dark:text-blue-200/60 uppercase block">Saldo Pendiente</span>
                <span className="font-bold font-mono text-amber-600 dark:text-amber-300 text-xs">
                  {formatBs(doc.monto_total_pendiente)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#0077D4] dark:text-blue-200/60 uppercase block">Comisión Doctor</span>
                <span className="font-bold font-mono text-sky-300 text-xs">
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
