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
    <div className="bg-white dark:bg-[#002D5E] rounded-2xl shadow-xl shadow-sm dark:shadow-[#001C3D]/50 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 overflow-hidden mb-6">
      <div className="p-4 bg-[#E5F7FF] dark:bg-[#0840A8]/30 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0077D4]/20 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-[#0077D4] dark:text-[#00C2E0] flex items-center justify-center font-bold shrink-0">
            <FileText className="w-5 h-5 text-[#0077D4] dark:text-[#00C2E0]" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#0840A8] dark:text-white">
              Detalle Completo de Boletas Emitidas
            </h4>
            <p className="text-xs text-[#0077D4] dark:text-blue-200/80">
              Listado general de comprobantes con estado de cuotas e información clínica
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#0077D4] dark:text-[#00C2E0]" />
          <input
            type="text"
            placeholder="Buscar por N° boleta, paciente, doctor..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0]"
          />
        </div>
      </div>

      {/* VISTA DESKTOP (TABLA) */}
      <div className="hidden md:block overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[11px] font-bold text-[#0077D4] dark:text-blue-200/90 uppercase tracking-wider border-b border-[#0840A8]/15 dark:border-[#0077D4]/30">
              <th className="py-3 px-4">Boleta / Emisión</th>
              <th className="py-3 px-4">Paciente</th>
              <th className="py-3 px-4">Doctor & Sucursal</th>
              <th className="py-3 px-4 text-center">Tipo / Cuotas</th>
              <th className="py-3 px-4 text-right">Monto Total</th>
              <th className="py-3 px-4 text-right">Monto Cobrado</th>
              <th className="py-3 px-4 text-right">Saldo Pendiente</th>
              <th className="py-3 px-4 text-center">Estado</th>
              {onViewBoleta && <th className="py-3 px-4 text-center">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0840A8]/15 dark:divide-[#0840A8]/40 text-xs text-[#0840A8] dark:text-white">
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
                <tr key={b.id} className="hover:bg-[#E5F7FF] dark:hover:bg-[#0840A8]/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#0077D4] dark:text-[#00C2E0] block font-mono">
                      {b.numero_boleta || `BOL-${b.id}`}
                    </span>
                    <span className="text-[10px] text-[#0077D4] dark:text-blue-200/60 whitespace-nowrap">
                      {b.fecha_emision
                        ? new Date(b.fecha_emision).toLocaleDateString('es-ES')
                        : '-'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#0840A8] dark:text-white">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#0077D4] dark:text-blue-200/70 shrink-0" />
                      <span className="truncate max-w-[180px]" title={pacienteNombre}>
                        {pacienteNombre}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-medium text-[#0840A8] dark:text-white">
                      <Stethoscope className="w-3 h-3 text-[#0077D4] dark:text-[#00C2E0] shrink-0" />
                      Dr(a). {doctorNombre}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#0077D4] dark:text-blue-200/60 mt-0.5">
                      <Building2 className="w-3 h-3 text-[#0077D4] dark:text-blue-200/60 shrink-0" />
                      {sucursalNombre}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                        b.tipo_pago === 'credito'
                          ? 'bg-amber-950/60 text-amber-600 dark:text-amber-300 border-amber-500/40'
                          : 'bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0077D4] dark:text-blue-200 border-[#0840A8]/15 dark:border-[#0077D4]/40'
                      }`}
                    >
                      {b.tipo_pago || 'contado'} ({b.cantidad_cuotas || 1} cuota
                      {b.cantidad_cuotas && b.cantidad_cuotas > 1 ? 's' : ''})
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold font-mono text-[#0840A8] dark:text-white whitespace-nowrap">
                    {formatBs(montoTotal)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold font-mono text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    {formatBs(montoCobrado)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold font-mono text-amber-600 dark:text-amber-300 whitespace-nowrap">
                    {formatBs(saldoPendiente)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {b.estado === 'completado' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 whitespace-nowrap">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        Completado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-600 dark:text-amber-300 border border-amber-500/40 whitespace-nowrap">
                        <Clock className="w-3 h-3 text-amber-400" />
                        Pendiente
                      </span>
                    )}
                  </td>
                  {onViewBoleta && (
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onViewBoleta(b)}
                        className="p-1.5 rounded-lg text-[#0077D4] dark:text-blue-200/80 hover:text-[#0840A8] dark:text-white hover:bg-[#0077D4]/40 transition-colors cursor-pointer"
                        title="Ver detalle de boleta"
                      >
                        <Eye className="w-4 h-4 text-[#0077D4] dark:text-[#00C2E0]" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
            {filteredBoletas.length === 0 && (
              <tr>
                <td colSpan={9} className="py-8 text-center text-[#0077D4] dark:text-blue-200/60 text-xs">
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
              className="bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 rounded-xl p-3.5 space-y-3"
            >
              {/* HEADER DE LA TARJETA */}
              <div className="flex items-center justify-between pb-2.5 border-b border-[#0840A8]/15 dark:border-[#0840A8]/40">
                <div>
                  <span className="font-bold text-[#0077D4] dark:text-[#00C2E0] text-xs font-mono block">
                    {b.numero_boleta || `BOL-${b.id}`}
                  </span>
                  <span className="text-[10px] text-[#0077D4] dark:text-blue-200/60">
                    {b.fecha_emision
                      ? new Date(b.fecha_emision).toLocaleDateString('es-ES')
                      : '-'}
                  </span>
                </div>

                {b.estado === 'completado' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Completado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-600 dark:text-amber-300 border border-amber-500/40">
                    <Clock className="w-3 h-3 text-amber-400" />
                    Pendiente
                  </span>
                )}
              </div>

              {/* DETALLES DE LA BOLETA */}
              <div className="space-y-1.5 text-xs text-[#0840A8] dark:text-white">
                <div className="flex items-center justify-between">
                  <span className="text-[#0077D4] dark:text-blue-200/60 text-[11px] flex items-center gap-1">
                    <User className="w-3 h-3 text-[#0077D4] dark:text-blue-200/70" /> Paciente:
                  </span>
                  <span className="font-semibold truncate max-w-[170px]">
                    {pacienteNombre}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#0077D4] dark:text-blue-200/60 text-[11px] flex items-center gap-1">
                    <Stethoscope className="w-3 h-3 text-[#0077D4] dark:text-[#00C2E0]" /> Doctor:
                  </span>
                  <span className="font-medium truncate max-w-[170px]">
                    Dr(a). {doctorNombre}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#0077D4] dark:text-blue-200/60 text-[11px] flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-[#0077D4] dark:text-blue-200/60" /> Sucursal:
                  </span>
                  <span className="font-medium text-[#0077D4] dark:text-blue-200">
                    {sucursalNombre}
                  </span>
                </div>
              </div>

              {/* VALORES MONETARIOS Y ACCIÓN */}
              <div className="pt-2 border-t border-[#0840A8]/15 dark:border-[#0840A8]/40 flex items-center justify-between">
                <div className="grid grid-cols-3 gap-2 text-center w-full pr-2 text-xs">
                  <div>
                    <span className="text-[9px] uppercase text-[#0077D4] dark:text-blue-200/60 block">Total</span>
                    <span className="font-mono font-bold text-[#0840A8] dark:text-white text-[11px]">
                      {formatBs(montoTotal)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-[#0077D4] dark:text-blue-200/60 block">Cobrado</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                      {formatBs(montoCobrado)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-[#0077D4] dark:text-blue-200/60 block">Saldo</span>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-300 text-[11px]">
                      {formatBs(saldoPendiente)}
                    </span>
                  </div>
                </div>

                {onViewBoleta && (
                  <button
                    onClick={() => onViewBoleta(b)}
                    className="p-2 rounded-xl bg-[#0077D4]/30 hover:bg-[#0077D4]/50 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shrink-0 cursor-pointer"
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
          <div className="text-center text-[#0077D4] dark:text-blue-200/60 py-6 text-xs">
            No se encontraron boletas para la búsqueda o filtros aplicados.
          </div>
        )}
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="p-4 bg-[#F4F9FF] dark:bg-[#001C3D] border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#0077D4] dark:text-blue-200/80">
          <span>
            Mostrando {paginatedBoletas.length} de {filteredBoletas.length} boletas
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-[#0077D4] dark:text-[#00C2E0]">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
