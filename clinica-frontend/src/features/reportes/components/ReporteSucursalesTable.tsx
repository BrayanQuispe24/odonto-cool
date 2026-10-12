import React from 'react';
import { Building2, CreditCard, Wallet, Banknote, QrCode } from 'lucide-react';
import type { DesgloseSucursal, DesgloseMetodoPago, DesgloseTipoPago } from '../types/reporteTypes';

interface Props {
  sucursales: DesgloseSucursal[];
  metodosPago: DesgloseMetodoPago[];
  tiposPago: DesgloseTipoPago[];
}

export const ReporteSucursalesTable: React.FC<Props> = ({
  sucursales,
  metodosPago,
  tiposPago,
}) => {
  const formatBs = (val: number) =>
    `Bs. ${val.toLocaleString('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const getMetodoIcon = (metodo: string) => {
    switch (metodo.toLowerCase()) {
      case 'efectivo':
        return <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      case 'qr':
        return <QrCode className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />;
      case 'tarjeta':
        return <CreditCard className="w-4 h-4 text-purple-400 shrink-0" />;
      case 'transferencia':
        return <Wallet className="w-4 h-4 text-primary dark:text-secondary shrink-0" />;
      default:
        return <Wallet className="w-4 h-4 text-primary dark:text-blue-200 shrink-0" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
      {/* SUCURSALES DESGLOSE */}
      <div className="bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#0077D4]/10 text-[#0077D4] flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-small font-bold uppercase tracking-wider text-primary-dark dark:text-white">
                  Ingresos por Sucursal
                </h4>
                <p className="text-tiny text-slate-500 dark:text-slate-400">
                  Volumen de boletas y monto cobrado según sede
                </p>
              </div>
            </div>
          </div>

          {/* VISTA DESKTOP (TABLA) */}
          <div className="hidden md:block overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Sucursal</th>
                  <th className="py-2 px-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Boletas</th>
                  <th className="py-2 px-3 text-right text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Facturado</th>
                  <th className="py-2 px-3 text-right text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Cobrado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-small text-slate-700 dark:text-slate-300">
                {sucursales.map((suc) => (
                  <tr key={suc.sucursal_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-2 px-3 font-medium">
                      {suc.nombre_sucursal}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-sm font-mono text-xs">
                        {suc.total_boletas}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-medium">
                      {formatBs(suc.monto_total_generado)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      {formatBs(suc.monto_total_cobrado)}
                    </td>
                  </tr>
                ))}
                {sucursales.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-500 text-xs">
                      Sin registros de sucursales
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* VISTA MÓVIL (TARJETAS) */}
          <div className="block md:hidden p-3 space-y-3">
            {sucursales.map((suc) => (
              <div
                key={suc.sucursal_id}
                className="bg-light-surface dark:bg-dark-bg border border-primary-dark/15 dark:border-primary/40 rounded-xl p-3.5 space-y-2.5"
              >
                <div className="flex items-center justify-between pb-2 border-b border-primary-dark/15 dark:border-primary-dark/40">
                  <div className="font-bold text-primary-dark dark:text-white text-xs flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary dark:text-secondary" />
                    {suc.nombre_sucursal}
                  </div>
                  <span className="bg-[#0077D4]/30 text-primary dark:text-secondary border border-primary-dark/15 dark:border-secondary/30 text-tiny font-bold px-2 py-0.5 rounded-md font-mono">
                    {suc.total_boletas} boletas
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-tiny text-primary dark:text-blue-200/60 uppercase block">Facturado</span>
                    <span className="font-bold font-mono text-primary-dark dark:text-white text-xs">
                      {formatBs(suc.monto_total_generado)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-tiny text-primary dark:text-blue-200/60 uppercase block">Cobrado</span>
                    <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-xs">
                      {formatBs(suc.monto_total_cobrado)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {sucursales.length === 0 && (
              <div className="text-center text-primary dark:text-blue-200/60 py-4 text-xs">
                Sin registros de sucursales
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MÉTODOS Y TIPOS DE PAGO DESGLOSE */}
      <div className="bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#0077D4]/10 text-[#0077D4] flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-small font-bold uppercase tracking-wider text-primary-dark dark:text-white">
                  Desglose por Métodos de Pago
                </h4>
                <p className="text-tiny text-slate-500 dark:text-slate-400">
                  Montos cobrados agrupados por forma de pago (Efectivo, QR, Tarjeta, etc.)
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {metodosPago.map((m) => (
              <div
                key={m.metodo_pago}
                className="p-3 rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg/80 flex items-center justify-between min-w-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-1.5 rounded bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-700 shrink-0">
                    {getMetodoIcon(m.metodo_pago)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 dark:text-white uppercase block truncate">
                      {m.metodo_pago}
                    </span>
                    <span className="block text-tiny text-slate-500 truncate">
                      {m.cantidad_transacciones} transacciones
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 pl-2">
                  <span className="text-small font-bold text-slate-800 dark:text-white font-mono block">
                    {formatBs(m.monto_total)}
                  </span>
                </div>
              </div>
            ))}
            {metodosPago.length === 0 && (
              <div className="col-span-1 sm:col-span-2 text-center text-slate-500 py-6 text-xs">
                Sin registros de pagos realizados en este periodo
              </div>
            )}
          </div>
        </div>

        {/* Tipos de Pago Footer bar */}
        <div className="p-3 bg-slate-50 dark:bg-dark-bg border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-around gap-2 text-xs">
          {tiposPago.map((tp) => (
            <div key={tp.tipo_pago} className="text-center px-2">
              <span className="text-tiny uppercase font-bold text-slate-500 block">
                Ventas a {tp.tipo_pago}
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-300 font-mono text-xs">
                {tp.cantidad_boletas} boletas ({formatBs(tp.monto_total)})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
