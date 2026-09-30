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
        return <Wallet className="w-4 h-4 text-[#0077D4] dark:text-[#00C2E0] shrink-0" />;
      default:
        return <Wallet className="w-4 h-4 text-[#0077D4] dark:text-blue-200 shrink-0" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
      {/* SUCURSALES DESGLOSE */}
      <div className="bg-white dark:bg-[#002D5E] rounded-2xl shadow-xl shadow-sm dark:shadow-[#001C3D]/50 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 overflow-hidden flex flex-col justify-between">
        <div>
          <div className="p-4 bg-[#E5F7FF] dark:bg-[#0840A8]/30 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0077D4]/20 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-[#0077D4] dark:text-[#00C2E0] flex items-center justify-center font-bold shrink-0">
                <Building2 className="w-5 h-5 text-[#0077D4] dark:text-[#00C2E0]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#0840A8] dark:text-white">
                  Ingresos por Sucursal
                </h4>
                <p className="text-xs text-[#0077D4] dark:text-blue-200/80">
                  Volumen de boletas y monto cobrado según sede
                </p>
              </div>
            </div>
          </div>

          {/* VISTA DESKTOP (TABLA) */}
          <div className="hidden md:block overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[11px] font-bold text-[#0077D4] dark:text-blue-200/90 uppercase tracking-wider border-b border-[#0840A8]/15 dark:border-[#0077D4]/30">
                  <th className="py-3 px-4">Sucursal</th>
                  <th className="py-3 px-4 text-center">Boletas</th>
                  <th className="py-3 px-4 text-right">Facturado</th>
                  <th className="py-3 px-4 text-right">Cobrado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0840A8]/15 dark:divide-[#0840A8]/40 text-xs text-[#0840A8] dark:text-white">
                {sucursales.map((suc) => (
                  <tr key={suc.sucursal_id} className="hover:bg-[#E5F7FF] dark:hover:bg-[#0840A8]/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#0840A8] dark:text-white">
                      {suc.nombre_sucursal}
                    </td>
                    <td className="py-3 px-4 text-center font-bold">
                      <span className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#0077D4]/40 px-2 py-0.5 rounded-md font-mono">
                        {suc.total_boletas}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#0840A8] dark:text-white">
                      {formatBs(suc.monto_total_generado)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatBs(suc.monto_total_cobrado)}
                    </td>
                  </tr>
                ))}
                {sucursales.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-[#0077D4] dark:text-blue-200/60 text-xs">
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
                className="bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 rounded-xl p-3.5 space-y-2.5"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#0840A8]/15 dark:border-[#0840A8]/40">
                  <div className="font-bold text-[#0840A8] dark:text-white text-xs flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#0077D4] dark:text-[#00C2E0]" />
                    {suc.nombre_sucursal}
                  </div>
                  <span className="bg-[#0077D4]/30 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">
                    {suc.total_boletas} boletas
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#0077D4] dark:text-blue-200/60 uppercase block">Facturado</span>
                    <span className="font-bold font-mono text-[#0840A8] dark:text-white text-xs">
                      {formatBs(suc.monto_total_generado)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#0077D4] dark:text-blue-200/60 uppercase block">Cobrado</span>
                    <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-xs">
                      {formatBs(suc.monto_total_cobrado)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {sucursales.length === 0 && (
              <div className="text-center text-[#0077D4] dark:text-blue-200/60 py-4 text-xs">
                Sin registros de sucursales
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MÉTODOS Y TIPOS DE PAGO DESGLOSE */}
      <div className="bg-white dark:bg-[#002D5E] rounded-2xl shadow-xl shadow-sm dark:shadow-[#001C3D]/50 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 overflow-hidden flex flex-col justify-between">
        <div>
          <div className="p-4 bg-[#E5F7FF] dark:bg-[#0840A8]/30 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0077D4]/20 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-[#0077D4] dark:text-[#00C2E0] flex items-center justify-center font-bold shrink-0">
                <Wallet className="w-5 h-5 text-[#0077D4] dark:text-[#00C2E0]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#0840A8] dark:text-white">
                  Desglose por Métodos de Pago
                </h4>
                <p className="text-xs text-[#0077D4] dark:text-blue-200/80">
                  Montos cobrados agrupados por forma de pago (Efectivo, QR, Tarjeta, etc.)
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {metodosPago.map((m) => (
              <div
                key={m.metodo_pago}
                className="p-3.5 rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/30 bg-[#F4F9FF] dark:bg-[#001C3D]/80 flex items-center justify-between min-w-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-[#0077D4]/20 border border-[#0840A8]/15 dark:border-[#00C2E0]/20 shrink-0">
                    {getMetodoIcon(m.metodo_pago)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#0840A8] dark:text-white uppercase block truncate">
                      {m.metodo_pago}
                    </span>
                    <span className="block text-[10px] text-[#0077D4] dark:text-blue-200/70 truncate">
                      {m.cantidad_transacciones} transacciones
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 pl-2">
                  <span className="text-sm font-black text-[#0077D4] dark:text-[#00C2E0] font-mono block">
                    {formatBs(m.monto_total)}
                  </span>
                </div>
              </div>
            ))}
            {metodosPago.length === 0 && (
              <div className="col-span-1 sm:col-span-2 text-center text-[#0077D4] dark:text-blue-200/60 py-6 text-xs">
                Sin registros de pagos realizados en este periodo
              </div>
            )}
          </div>
        </div>

        {/* Tipos de Pago Footer bar */}
        <div className="p-3.5 bg-[#F4F9FF] dark:bg-[#001C3D] border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 flex flex-wrap items-center justify-around gap-2 text-xs">
          {tiposPago.map((tp) => (
            <div key={tp.tipo_pago} className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-[#0077D4] dark:text-blue-200/70 block">
                Ventas a {tp.tipo_pago}
              </span>
              <span className="font-bold text-[#0077D4] dark:text-[#00C2E0] font-mono">
                {tp.cantidad_boletas} boletas ({formatBs(tp.monto_total)})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
