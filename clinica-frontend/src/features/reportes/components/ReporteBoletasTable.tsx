import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  User,
  Building2,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import type { BoletaServicioPrestado } from '../../boletas/types/boleta';

interface Props {
  boletas: BoletaServicioPrestado[];
  onViewBoleta?: (boleta: BoletaServicioPrestado) => void;
}

export const ReporteBoletasTable: React.FC<Props> = ({ boletas, onViewBoleta }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatBs = (val: number) =>
    `Bs. ${val.toLocaleString('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const filteredBoletas = boletas.filter((b) => {
    const searchLower = searchTerm.toLowerCase();
    const nroBoleta = b.numero_boleta ? b.numero_boleta.toLowerCase() : '';
    const pacienteNombre = b.cita?.paciente
      ? `${b.cita.paciente.nombre} ${b.cita.paciente.apellido}`.toLowerCase()
      : (b.cita?.nombre_paciente_unregistered || '').toLowerCase();
    const doctorNombre = b.doctor
      ? `${b.doctor.nombre} ${b.doctor.apellido}`.toLowerCase()
      : b.cita?.doctor
      ? `${b.cita.doctor.nombre} ${b.cita.doctor.apellido}`.toLowerCase()
      : '';
    const sucursalNombre = (b.cita?.sucursal?.nombre || '').toLowerCase();

    return (
      nroBoleta.includes(searchLower) ||
      pacienteNombre.includes(searchLower) ||
      doctorNombre.includes(searchLower) ||
      sucursalNombre.includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredBoletas.length / itemsPerPage) || 1;
  const paginatedBoletas = filteredBoletas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white dark:bg-dark-surface rounded-sm shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
      <div className="p-4 bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#0077D4]/10 border border-slate-200 dark:border-slate-800 text-[#0077D4] flex items-center justify-center font-bold shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-small font-bold uppercase tracking-wider text-primary-dark dark:text-white">
              Detalle Completo de Boletas Emitidas
            </h4>
            <p className="text-tiny text-slate-500 dark:text-slate-400">
              Listado general de comprobantes con estado de cuotas e información clínica
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por N° boleta, paciente, doctor..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-small rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* VISTA DESKTOP (TABLA) */}
      <div className="hidden md:block overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800">
              <th className="py-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Boleta / Emisión</th>
              <th className="py-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Paciente</th>
              <th className="py-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Doctor & Sucursal</th>
              <th className="py-2 px-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Tipo / Cuotas</th>
              <th className="py-2 px-3 text-right text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Monto Total</th>
              <th className="py-2 px-3 text-right text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Monto Cobrado</th>
              <th className="py-2 px-3 text-right text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Saldo Pendiente</th>
              <th className="py-2 px-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Estado</th>
              {onViewBoleta && <th className="py-2 px-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-small text-slate-700 dark:text-slate-300">
            {paginatedBoletas.map((b) => {
              const pacienteNombre = b.cita?.paciente
                ? `${b.cita.paciente.nombre} ${b.cita.paciente.apellido}`
                : b.cita?.nombre_paciente_unregistered || 'Paciente';

              const doctorNombre = b.doctor
                ? `${b.doctor.nombre} ${b.doctor.apellido}`
                : b.cita?.doctor
                ? `${b.cita.doctor.nombre} ${b.cita.doctor.apellido}`
                : 'Sin Asignar';

              const sucursalNombre = b.cita?.sucursal?.nombre || 'Central';

              const montoTotal = Number(b.monto_total) || 0;
              const montoCobrado = b.cuotas
                ? b.cuotas
                    .filter((c) => c.estado === 'pagado')
                    .reduce((sum, c) => sum + (Number(c.monto_cuota) || 0), 0)
                : 0;
              const saldoPendiente = Math.max(0, montoTotal - montoCobrado);

              return (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2 px-3">
                    <span className="font-bold text-slate-800 dark:text-white block font-mono">
                      {b.numero_boleta || `BOL-${b.id}`}
                    </span>
                    <span className="text-tiny text-slate-500 whitespace-nowrap">
                      {b.fecha_emision
                        ? new Date(b.fecha_emision).toLocaleDateString('es-ES')
                        : '-'}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-medium text-slate-800 dark:text-white">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[180px]" title={pacienteNombre}>
                        {pacienteNombre}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-white">
                      <Stethoscope className="w-3 h-3 text-slate-400 shrink-0" />
                      Dr(a). {doctorNombre}
                    </div>
                    <div className="flex items-center gap-1.5 text-tiny text-slate-500 mt-0.5">
                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                      {sucursalNombre}
                    </div>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded-sm text-tiny font-bold uppercase border ${
                        b.tipo_pago === 'credito'
                          ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                          : 'bg-slate-50 dark:bg-dark-bg text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {b.tipo_pago || 'contado'} ({b.cantidad_cuotas || 1} cuota{b.cantidad_cuotas && b.cantidad_cuotas > 1 ? 's' : ''})
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-medium font-mono whitespace-nowrap">
                    {formatBs(montoTotal)}
                  </td>
                  <td className="py-2 px-3 text-right font-medium font-mono text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    {formatBs(montoCobrado)}
                  </td>
                  <td className="py-2 px-3 text-right font-medium font-mono text-amber-600 dark:text-amber-500 whitespace-nowrap">
                    {formatBs(saldoPendiente)}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {b.estado === 'completado' ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-tiny font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
                        <CheckCircle2 className="w-3 h-3" />
                        Completado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-tiny font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        Pendiente
                      </span>
                    )}
                  </td>
                  {onViewBoleta && (
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => onViewBoleta(b)}
                        className="p-1 rounded-sm text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer inline-flex items-center justify-center border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
                        title="Ver detalle de boleta"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
            {filteredBoletas.length === 0 && (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500 text-xs">
                  No se encontraron boletas para la búsqueda o filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VISTA MÓVIL (TARJETAS) */}
      <div className="block md:hidden p-3 space-y-3">
        {paginatedBoletas.map((b) => {
          const pacienteNombre = b.cita?.paciente
            ? `${b.cita.paciente.nombre} ${b.cita.paciente.apellido}`
            : b.cita?.nombre_paciente_unregistered || 'Paciente';

          const doctorNombre = b.doctor
            ? `${b.doctor.nombre} ${b.doctor.apellido}`
            : b.cita?.doctor
            ? `${b.cita.doctor.nombre} ${b.cita.doctor.apellido}`
            : 'Sin Asignar';

          const sucursalNombre = b.cita?.sucursal?.nombre || 'Central';

          const montoTotal = Number(b.monto_total) || 0;
          const montoCobrado = b.cuotas
            ? b.cuotas
                .filter((c) => c.estado === 'pagado')
                .reduce((sum, c) => sum + (Number(c.monto_cuota) || 0), 0)
            : 0;
          const saldoPendiente = Math.max(0, montoTotal - montoCobrado);

          return (
            <div
              key={b.id}
              className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm p-3.5 space-y-3"
            >
              {/* HEADER DE LA TARJETA */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="font-bold text-slate-800 dark:text-white text-xs font-mono block">
                    {b.numero_boleta || `BOL-${b.id}`}
                  </span>
                  <span className="text-tiny text-slate-500">
                    {b.fecha_emision
                      ? new Date(b.fecha_emision).toLocaleDateString('es-ES')
                      : '-'}
                  </span>
                </div>

                {b.estado === 'completado' ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-tiny font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" />
                    Completado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-tiny font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    <Clock className="w-3 h-3" />
                    Pendiente
                  </span>
                )}
              </div>

              {/* DETALLES DE LA BOLETA */}
              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <User className="w-3 h-3" /> Paciente:
                  </span>
                  <span className="font-medium truncate max-w-[170px]">
                    {pacienteNombre}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Stethoscope className="w-3 h-3" /> Doctor:
                  </span>
                  <span className="font-medium truncate max-w-[170px]">
                    Dr(a). {doctorNombre}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> Sucursal:
                  </span>
                  <span className="font-medium">
                    {sucursalNombre}
                  </span>
                </div>
              </div>

              {/* VALORES MONETARIOS Y ACCIÓN */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="grid grid-cols-3 gap-2 text-center w-full pr-2 text-xs">
                  <div>
                    <span className="text-tiny uppercase text-slate-500 block">Total</span>
                    <span className="font-mono font-medium text-slate-800 dark:text-white">
                      {formatBs(montoTotal)}
                    </span>
                  </div>
                  <div>
                    <span className="text-tiny uppercase text-slate-500 block">Cobrado</span>
                    <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      {formatBs(montoCobrado)}
                    </span>
                  </div>
                  <div>
                    <span className="text-tiny uppercase text-slate-500 block">Saldo</span>
                    <span className="font-mono font-medium text-amber-600 dark:text-amber-500">
                      {formatBs(saldoPendiente)}
                    </span>
                  </div>
                </div>

                {onViewBoleta && (
                  <button
                    onClick={() => onViewBoleta(b)}
                    className="p-2 rounded-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer"
                    title="Ver detalle"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredBoletas.length === 0 && (
          <div className="text-center text-slate-500 py-6 text-xs">
            No se encontraron boletas para la búsqueda o filtros aplicados.
          </div>
        )}
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="p-4 bg-slate-50 dark:bg-dark-bg border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Mostrando {paginatedBoletas.length} de {filteredBoletas.length} boletas
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-sm bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-800 dark:text-white">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-sm bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
