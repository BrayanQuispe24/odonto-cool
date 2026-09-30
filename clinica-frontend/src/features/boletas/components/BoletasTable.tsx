import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
} from 'lucide-react';
import type { BoletaServicioPrestado } from '../types/boleta';

interface BoletasTableProps {
  boletas: BoletaServicioPrestado[];
  onView: (boleta: BoletaServicioPrestado) => void;
  onDelete: (boleta: BoletaServicioPrestado) => void;
}

export const BoletasTable: React.FC<BoletasTableProps> = ({
  boletas,
  onView,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<string>('all');
  const [selectedTipoPaga, setSelectedTipoPaga] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredBoletas = useMemo(() => {
    return boletas.filter((b) => {
      const term = searchTerm.toLowerCase();
      const numBoleta = (b.numero_boleta || '').toLowerCase();
      const numCita = (b.cita?.numero_cita || '').toLowerCase();
      const pacName = b.cita?.paciente
        ? `${b.cita.paciente.nombre} ${b.cita.paciente.apellido}`.toLowerCase()
        : (b.cita?.nombre_paciente_unregistered || '').toLowerCase();
      const docName = b.doctor
        ? `${b.doctor.nombre} ${b.doctor.apellido}`.toLowerCase()
        : b.cita?.doctor
        ? `${b.cita.doctor.nombre} ${b.cita.doctor.apellido}`.toLowerCase()
        : '';

      const matchesSearch =
        numBoleta.includes(term) ||
        numCita.includes(term) ||
        pacName.includes(term) ||
        docName.includes(term);

      const matchesEstado = selectedEstado === 'all' || b.estado === selectedEstado;
      const matchesTipoPaga = selectedTipoPaga === 'all' || b.tipo_paga === selectedTipoPaga;

      return matchesSearch && matchesEstado && matchesTipoPaga;
    });
  }, [boletas, searchTerm, selectedEstado, selectedTipoPaga]);

  const totalPages = Math.ceil(filteredBoletas.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedBoletas = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredBoletas.slice(start, start + pageSize);
  }, [filteredBoletas, safeCurrentPage, pageSize]);

  const startRecord = (safeCurrentPage - 1) * pageSize + 1;
  const endRecord = Math.min(safeCurrentPage * pageSize, filteredBoletas.length);

  return (
    <div className="bg-white dark:bg-[#002D5E] rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 overflow-hidden transition-all duration-300">
      {/* TOOLBAR */}
      <div className="p-4 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-white dark:bg-[#0840A8]/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* SEARCH INPUT */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0077D4] dark:text-[#00C2E0]">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por Nº boleta, paciente, doctor o cita..."
            className="w-full pl-9 pr-8 py-2 rounded-xl text-xs font-medium border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#0077D4] dark:text-blue-200/70 hover:text-[#0840A8] dark:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Tipo Pago Filter */}
          <select
            value={selectedTipoPaga}
            onChange={(e) => {
              setSelectedTipoPaga(e.target.value);
              setCurrentPage(1);
            }}
            className="py-2 px-3 rounded-xl text-xs font-medium border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white focus:outline-none focus:border-[#00C2E0] transition-all cursor-pointer"
          >
            <option value="all" className="bg-[#F4F9FF] dark:bg-[#001C3D]">Todos los tipos de pago</option>
            <option value="Contado" className="bg-[#F4F9FF] dark:bg-[#001C3D]">Al Contado</option>
            <option value="Credito" className="bg-[#F4F9FF] dark:bg-[#001C3D]">Al Crédito</option>
          </select>

          {/* Estado Filter */}
          <select
            value={selectedEstado}
            onChange={(e) => {
              setSelectedEstado(e.target.value);
              setCurrentPage(1);
            }}
            className="py-2 px-3 rounded-xl text-xs font-medium border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white focus:outline-none focus:border-[#00C2E0] transition-all cursor-pointer"
          >
            <option value="all" className="bg-[#F4F9FF] dark:bg-[#001C3D]">Todos los estados</option>
            <option value="completado" className="bg-[#F4F9FF] dark:bg-[#001C3D]">Completado</option>
            <option value="pendiente" className="bg-[#F4F9FF] dark:bg-[#001C3D]">Pendiente</option>
            <option value="anulada" className="bg-[#F4F9FF] dark:bg-[#001C3D]">Anuladas</option>
          </select>
        </div>
      </div>

      {/* CARDS CONTENT */}
      <div className="p-4 bg-[#F4F9FF] dark:bg-[#001C3D]/20">
        {paginatedBoletas.length === 0 ? (
          <div className="py-12 text-center text-[#0077D4] dark:text-blue-200/70 font-medium bg-white dark:bg-[#002D5E] rounded-xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30">
            No se encontraron boletas de servicios prestados registradas.
          </div>
        ) : (
          <>
            {/* VISTA MÓVIL (TARJETAS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
              {paginatedBoletas.map((boleta) => {
                const pac = boleta.cita?.paciente;
                const pacName = pac
                  ? `${pac.nombre} ${pac.apellido}`
                  : boleta.cita?.nombre_paciente_unregistered || 'Paciente General';
                const hc = pac?.codigo_paciente || '-';

                const tratamientos =
                  boleta.detalles?.map((d) => d.servicio?.nombre || d.descripcion).filter(Boolean).join(', ') ||
                  'Atención Odontológica';

                const labCost = Number(boleta.costo_laboratorio || 0);
                const pctComision = Number(boleta.porcentaje_comision_dr || 40);
                const doctorComision =
                  boleta.monto_comision_dr !== undefined
                    ? Number(boleta.monto_comision_dr)
                    : Math.max(0, (Number(boleta.monto_total) - labCost) * (pctComision / 100));

                return (
                  <div
                    key={boleta.id}
                    className="flex flex-col bg-white dark:bg-[#002D5E] rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-lg shadow-[#0077D4]/5 dark:shadow-[#001C3D]/50 hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between p-4 border-b border-[#0840A8]/10 dark:border-[#00C2E0]/20 bg-gradient-to-r from-[#F4F9FF] to-white dark:from-[#001C3D] dark:to-[#002D5E]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0840A8] dark:text-blue-200">
                          📅 {String(boleta.fecha_emision).split('T')[0]}
                        </span>
                        {boleta.estado === 'completado' || boleta.estado === 'pagada' ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                            Completado
                          </span>
                        ) : boleta.estado === 'anulada' ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-500/40 uppercase tracking-wider">
                            Anulada
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                            Pendiente
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onView(boleta)}
                          title="Ver Boleta Detallada"
                          className="p-1.5 rounded-lg bg-[#E5F7FF] hover:bg-[#0077D4] text-[#0077D4] hover:text-white dark:bg-[#0077D4]/30 dark:hover:bg-[#0077D4]/50 dark:text-[#00C2E0] transition-colors cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(boleta)}
                          title="Eliminar Boleta"
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white dark:bg-rose-500/20 dark:hover:bg-rose-500/30 dark:text-rose-300 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1">
                      <div className="mb-3">
                        <div className="text-xs font-semibold text-[#0077D4] dark:text-[#00C2E0] mb-0.5">
                          Paciente
                        </div>
                        <div className="text-base font-extrabold text-[#0840A8] dark:text-white leading-tight">
                          {pacName}
                        </div>
                        <div className="text-[10px] font-mono text-[#0077D4] dark:text-blue-200/70 mt-0.5">
                          HC: {hc}
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-xs font-semibold text-[#0077D4] dark:text-[#00C2E0] mb-1">
                          Tratamientos
                        </div>
                        <p className="text-xs text-[#0840A8]/80 dark:text-blue-100 line-clamp-2" title={tratamientos}>
                          {tratamientos}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer Grid */}
                    <div className="grid grid-cols-2 gap-px bg-[#0840A8]/10 dark:bg-[#00C2E0]/20 border-t border-[#0840A8]/10 dark:border-[#00C2E0]/20">
                      <div className="bg-[#F4F9FF] dark:bg-[#001C3D] p-3">
                        <div className="text-[10px] font-semibold text-[#0077D4] dark:text-[#00C2E0] uppercase tracking-wider mb-1">Costo Total</div>
                        <div className="font-mono font-bold text-[#0840A8] dark:text-white flex items-center justify-between">
                          <span className="text-xs">Bs.</span>
                          <span className="text-sm">{Number(boleta.monto_total).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="bg-[#F4F9FF] dark:bg-[#001C3D] p-3">
                        <div className="text-[10px] font-semibold text-[#0077D4] dark:text-[#00C2E0] uppercase tracking-wider mb-1">Comisión Dr</div>
                        <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                          <span className="text-xs">Bs.</span>
                          <span className="text-sm">{doctorComision.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="bg-[#F4F9FF] dark:bg-[#001C3D] p-3">
                        <div className="text-[10px] font-semibold text-[#0077D4] dark:text-[#00C2E0] uppercase tracking-wider mb-1">Laboratorio</div>
                        <div className="font-mono font-semibold text-rose-600 dark:text-rose-300 flex items-center justify-between">
                          <span className="text-xs">Bs.</span>
                          <span className="text-sm">{labCost.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="bg-[#F4F9FF] dark:bg-[#001C3D] p-3 flex flex-col justify-center items-end">
                        <div className="text-[10px] font-semibold text-[#0077D4] dark:text-[#00C2E0] uppercase tracking-wider mb-1 flex items-center gap-1">Tipo Pago</div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E5F7FF] dark:bg-[#0840A8]/40 text-[#0077D4] dark:text-blue-100 border border-[#0077D4]/20">
                          {boleta.tipo_pago || boleta.tipo_paga || 'Contado'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* VISTA DESKTOP (TABLA) */}
            <div className="hidden lg:block overflow-x-auto rounded-xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-sm">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-gradient-to-r from-[#F4F9FF] to-white dark:from-[#001C3D] dark:to-[#002D5E] border-b border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-[#0077D4] dark:text-[#00C2E0] text-[11px] font-bold uppercase tracking-wider">
                    <th className="px-4 py-4">Fecha</th>
                    <th className="px-4 py-4">Paciente</th>
                    <th className="px-4 py-4 min-w-[200px] max-w-[300px]">Tratamientos</th>
                    <th className="px-4 py-4">Estado</th>
                    <th className="px-4 py-4 text-right">Costo Total</th>
                    <th className="px-4 py-4 text-right">Comisión Dr</th>
                    <th className="px-4 py-4 text-right">Laboratorio</th>
                    <th className="px-4 py-4 text-center">Tipo Pago</th>
                    <th className="px-4 py-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-[#002D5E] divide-y divide-[#0840A8]/10 dark:divide-[#00C2E0]/20">
                  {paginatedBoletas.map((boleta) => {
                    const pac = boleta.cita?.paciente;
                    const pacName = pac
                      ? `${pac.nombre} ${pac.apellido}`
                      : boleta.cita?.nombre_paciente_unregistered || 'Paciente General';
                    const hc = pac?.codigo_paciente || '-';

                    const tratamientos =
                      boleta.detalles?.map((d) => d.servicio?.nombre || d.descripcion).filter(Boolean).join(', ') ||
                      'Atención Odontológica';

                    const labCost = Number(boleta.costo_laboratorio || 0);
                    const pctComision = Number(boleta.porcentaje_comision_dr || 40);
                    const doctorComision =
                      boleta.monto_comision_dr !== undefined
                        ? Number(boleta.monto_comision_dr)
                        : Math.max(0, (Number(boleta.monto_total) - labCost) * (pctComision / 100));

                    return (
                      <tr key={boleta.id} className="hover:bg-[#F4F9FF] dark:hover:bg-[#0840A8]/20 transition-colors group">
                        <td className="px-4 py-3 text-xs font-bold text-[#0840A8] dark:text-blue-100">
                          {String(boleta.fecha_emision).split('T')[0]}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-bold text-[#0840A8] dark:text-white">
                            {pacName}
                          </div>
                          <div className="text-[10px] font-mono text-[#0077D4] dark:text-blue-200/70">
                            HC: {hc}
                          </div>
                        </td>
                        <td className="px-4 py-3 min-w-[200px] max-w-[300px] truncate text-xs text-[#0840A8]/80 dark:text-blue-100" title={tratamientos}>
                          {tratamientos}
                        </td>
                        <td className="px-4 py-3">
                          {boleta.estado === 'completado' || boleta.estado === 'pagada' ? (
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                              Completado
                            </span>
                          ) : boleta.estado === 'anulada' ? (
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                              Anulada
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                              Pendiente
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-[#0840A8] dark:text-white text-sm">
                          Bs. {Number(boleta.monto_total).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          Bs. {doctorComision.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-rose-600 dark:text-rose-300 text-sm">
                          Bs. {labCost.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#E5F7FF] dark:bg-[#0840A8]/40 text-[#0077D4] dark:text-blue-100 border border-[#0077D4]/20">
                            {boleta.tipo_pago || boleta.tipo_paga || 'Contado'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onView(boleta)}
                              title="Ver Boleta Detallada"
                              className="p-1.5 rounded-lg bg-[#E5F7FF] hover:bg-[#0077D4] text-[#0077D4] hover:text-white dark:bg-[#0077D4]/30 dark:hover:bg-[#0077D4]/50 dark:text-[#00C2E0] transition-colors cursor-pointer"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => onDelete(boleta)}
                              title="Eliminar Boleta"
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white dark:bg-rose-500/20 dark:hover:bg-rose-500/30 dark:text-rose-300 transition-colors cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* FOOTER PAGINATION */}
      <div className="p-4 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-white dark:bg-[#0840A8]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#0077D4] dark:text-blue-200/80">
        <div>
          Mostrando <strong>{filteredBoletas.length === 0 ? 0 : startRecord}</strong> -{' '}
          <strong>{endRecord}</strong> de <strong>{filteredBoletas.length}</strong> boletas
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage === 1}
            className="p-1.5 rounded-lg border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft size={15} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                safeCurrentPage === p
                  ? 'bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white shadow-md shadow-[#0077D4]/30'
                  : 'bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0077D4] dark:text-blue-100 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage === totalPages}
            className="p-1.5 rounded-lg border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
