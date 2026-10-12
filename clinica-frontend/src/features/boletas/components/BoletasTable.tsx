import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Printer,
} from 'lucide-react';
import type { BoletaServicioPrestado } from '../types/boleta';
import { BoletasListPDFViewerModal } from './BoletasListPDFViewerModal';

interface BoletasTableProps {
  boletas: BoletaServicioPrestado[];
  onView: (boleta: BoletaServicioPrestado) => void;
  onDelete: (boleta: BoletaServicioPrestado) => void;
  onCreate?: () => void;
}

const getPacienteName = (b: BoletaServicioPrestado): string =>
  b.paciente
    ? `${b.paciente.nombre} ${b.paciente.apellido}`
    : b.cita?.paciente
    ? `${b.cita.paciente.nombre} ${b.cita.paciente.apellido}`
    : b.cita?.nombre_paciente_unregistered || 'Paciente General';

const getDoctorName = (b: BoletaServicioPrestado): string =>
  b.doctor
    ? `${b.doctor.nombre} ${b.doctor.apellido}`
    : b.cita?.doctor
    ? `${b.cita.doctor.nombre} ${b.cita.doctor.apellido}`
    : '';

const getComision = (b: BoletaServicioPrestado): number => {
  const labCost = Number(b.costo_laboratorio || 0);
  const pct = Number(b.porcentaje_comision_dr || 40);
  return b.monto_comision_dr !== undefined && b.monto_comision_dr !== null
    ? Number(b.monto_comision_dr)
    : Math.max(0, (Number(b.monto_total) - labCost) * (pct / 100));
};

const EstadoBadge: React.FC<{ estado?: string }> = ({ estado }) => {
  if (estado === 'completado' || estado === 'pagada') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-cyan-50 dark:bg-cyan-900/30 text-primary dark:text-secondary border border-cyan-200 dark:border-cyan-800">
        <CheckCircle2 size={10} />
        COMPLETADO
      </span>
    );
  }
  if (estado === 'anulada') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
        <XCircle size={10} />
        ANULADA
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
      <Clock size={10} />
      PENDIENTE
    </span>
  );
};

export const BoletasTable: React.FC<BoletasTableProps> = ({ boletas, onView, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<string>('all');
  const [selectedTipoPaga, setSelectedTipoPaga] = useState<string>('all');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const pageSize = 12;

  const filteredBoletas = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return boletas.filter((b) => {
      const numBoleta = (b.numero_boleta || '').toLowerCase();
      const numCita = (b.cita?.numero_cita || '').toLowerCase();
      const pacName = getPacienteName(b).toLowerCase();
      const docName = getDoctorName(b).toLowerCase();

      const matchesSearch =
        numBoleta.includes(term) ||
        numCita.includes(term) ||
        pacName.includes(term) ||
        docName.includes(term);

      const matchesEstado =
        selectedEstado === 'all' ||
        b.estado === selectedEstado ||
        (selectedEstado === 'completado' && b.estado === 'pagada');
      const matchesTipoPaga =
        selectedTipoPaga === 'all' || (b.tipo_paga || b.tipo_pago) === selectedTipoPaga;

      let matchesFecha = true;
      if (fechaDesde || fechaHasta) {
        // b.fecha_emision usually is 'YYYY-MM-DDTHH:mm:ss.000Z' or similar string
        const boletaFechaStr = String(b.fecha_emision || b.fecha_creacion || '').split('T')[0];
        if (boletaFechaStr) {
          if (fechaDesde && boletaFechaStr < fechaDesde) matchesFecha = false;
          if (fechaHasta && boletaFechaStr > fechaHasta) matchesFecha = false;
        }
      }

      return matchesSearch && matchesEstado && matchesTipoPaga && matchesFecha;
    });
  }, [boletas, searchTerm, selectedEstado, selectedTipoPaga, fechaDesde, fechaHasta]);

  const totals = useMemo(() => {
    return filteredBoletas.reduce(
      (acc, b) => {
        acc.total += Number(b.monto_total || 0);
        acc.comision += getComision(b);
        acc.lab += Number(b.costo_laboratorio || 0);
        return acc;
      },
      { total: 0, comision: 0, lab: 0 }
    );
  }, [filteredBoletas]);

  const totalPages = Math.ceil(filteredBoletas.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedBoletas = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredBoletas.slice(start, start + pageSize);
  }, [filteredBoletas, safeCurrentPage, pageSize]);

  const startRecord = (safeCurrentPage - 1) * pageSize + 1;
  const endRecord = Math.min(safeCurrentPage * pageSize, filteredBoletas.length);

  const selectClass =
    'py-1.5 px-2 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer';

  return (
    <div className="bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[60vh]">
      {/* TOOLBAR */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
            <Search size={13} />
          </div>
          <input
            id="boletas-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por Nº boleta, paciente, doctor o cita..."
            className="w-full pl-8 pr-8 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <div className="flex items-center gap-1 bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 rounded-sm px-2">
            <span className="text-tiny font-bold text-slate-500 uppercase">Desde</span>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => {
                setFechaDesde(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1 text-small font-medium bg-transparent text-primary-dark dark:text-white focus:outline-none cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-1 bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 rounded-sm px-2">
            <span className="text-tiny font-bold text-slate-500 uppercase">Hasta</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => {
                setFechaHasta(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1 text-small font-medium bg-transparent text-primary-dark dark:text-white focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 dark:border-slate-700 pl-2">
            <Filter size={12} className="text-slate-400" />
            <select
              id="boletas-filter-tipo"
              value={selectedTipoPaga}
              onChange={(e) => {
                setSelectedTipoPaga(e.target.value);
                setCurrentPage(1);
              }}
              className={`${selectClass} min-w-[140px]`}
            >
              <option value="all">Todos los tipos de pago</option>
              <option value="Contado">Al Contado</option>
              <option value="Credito">Al Crédito</option>
            </select>
            <select
              id="boletas-filter-estado"
              value={selectedEstado}
              onChange={(e) => {
                setSelectedEstado(e.target.value);
                setCurrentPage(1);
              }}
              className={`${selectClass} min-w-[130px]`}
            >
              <option value="all">Todos los estados</option>
              <option value="completado">Completado</option>
              <option value="pendiente">Pendiente</option>
              <option value="anulada">Anuladas</option>
            </select>
          </div>
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="py-1.5 px-3 rounded-sm bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm ml-2"
          >
            <Printer size={14} />
            Imprimir
          </button>
        </div>
      </div>

      <BoletasListPDFViewerModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        boletas={filteredBoletas}
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
      />

      {/* TABLE */}
      <div className="flex-1 overflow-x-auto bg-white dark:bg-dark-surface print:overflow-visible">
        <table className="w-full text-left text-small whitespace-nowrap print:text-xs">
          <thead className="bg-slate-50 dark:bg-dark-bg text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider print:bg-transparent print:text-black print:border-b-2 print:border-black">
            <tr>
              <th className="px-4 py-2 font-bold w-28">Nº Boleta</th>
              <th className="px-4 py-2 font-bold w-24">Fecha</th>
              <th className="px-4 py-2 font-bold">Paciente</th>
              <th className="px-4 py-2 font-bold">Tratamientos</th>
              <th className="px-4 py-2 font-bold w-28">Estado</th>
              <th className="px-4 py-2 font-bold w-20">Pago</th>
              <th className="px-4 py-2 font-bold text-right w-28">Total</th>
              <th className="px-4 py-2 font-bold text-right w-28 print:hidden">Comisión Dr</th>
              <th className="px-4 py-2 font-bold text-right w-28 print:hidden">Laboratorio</th>
              <th className="px-4 py-2 font-bold text-right w-20 print:hidden">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200 font-medium print:divide-slate-300 print:text-black">
            {paginatedBoletas.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-500 font-semibold">
                  No se encontraron boletas de servicios prestados registradas.
                </td>
              </tr>
            ) : (
              paginatedBoletas.map((boleta) => {
                const pac = boleta.paciente || boleta.cita?.paciente;
                const pacName = getPacienteName(boleta);
                const docName = getDoctorName(boleta);
                const hc = pac?.codigo_paciente || '-';
                const tratamientos =
                  boleta.detalles
                    ?.map((d) => d.servicio?.nombre || d.descripcion)
                    .filter(Boolean)
                    .join(', ') || 'Atención Odontológica';
                const labCost = Number(boleta.costo_laboratorio || 0);
                const doctorComision = getComision(boleta);
                const tipo = boleta.tipo_pago || boleta.tipo_paga || 'Contado';
                const isAnulada = boleta.estado === 'anulada';

                return (
                  <tr
                    key={boleta.id}
                    onDoubleClick={() => onView(boleta)}
                    className={`hover:bg-slate-50 dark:hover:bg-dark-bg/50 transition-colors ${
                      isAnulada ? 'opacity-60 print:opacity-100 print:line-through' : ''
                    } print:break-inside-avoid`}
                  >
                    <td className="px-4 py-2">
                      <span className="font-mono font-bold text-primary dark:text-secondary print:text-black">
                        {boleta.numero_boleta}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-mono text-slate-600 dark:text-slate-300 print:text-black">
                      {String(boleta.fecha_emision).split('T')[0]}
                    </td>
                    <td className="px-4 py-2 print:whitespace-normal">
                      <div className="font-bold text-slate-800 dark:text-white print:text-black">{pacName}</div>
                      <div className="text-tiny text-slate-500 mt-0.5 print:text-black">
                        <span className="font-mono">HC: {hc}</span>
                        {docName && <span> · Dr. {docName}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-2 max-w-[240px] truncate text-slate-600 dark:text-slate-300 print:whitespace-normal print:text-black" title={tratamientos}>
                      {tratamientos}
                    </td>
                    <td className="px-4 py-2">
                      <EstadoBadge estado={boleta.estado} />
                    </td>
                    <td className="px-4 py-2">
                      <span className="font-semibold text-slate-600 dark:text-slate-300 print:text-black">
                        {tipo === 'Credito' ? 'Crédito' : tipo}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right font-mono font-bold text-slate-800 dark:text-white print:text-black">
                      Bs. {Number(boleta.monto_total).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400 print:hidden">
                      Bs. {doctorComision.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right font-mono font-semibold text-rose-600 dark:text-rose-400 print:hidden">
                      Bs. {labCost.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right print:hidden">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onView(boleta)}
                          title="Ver boleta detallada"
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-dark-bg dark:hover:bg-slate-800 text-primary dark:text-secondary transition-colors cursor-pointer"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => onDelete(boleta)}
                          title="Eliminar boleta"
                          className="p-1 rounded bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {filteredBoletas.length > 0 && (
            <tfoot className="bg-slate-50 dark:bg-dark-bg border-t-2 border-slate-200 dark:border-slate-700 text-small print:bg-transparent print:border-t-2 print:border-black">
              <tr>
                <td colSpan={6} className="px-4 py-2 font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:text-black">
                  Totales ({filteredBoletas.length} boletas filtradas)
                </td>
                <td className="px-4 py-2 text-right font-mono font-bold text-slate-800 dark:text-white print:text-black">
                  Bs. {totals.total.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 print:hidden">
                  Bs. {totals.comision.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-right font-mono font-bold text-rose-600 dark:text-rose-400 print:hidden">
                  Bs. {totals.lab.toFixed(2)}
                </td>
                <td className="print:hidden" />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* FOOTER PAGINATION */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between text-small text-slate-500 dark:text-slate-400 shrink-0 print:hidden">
        <div>
          Mostrando <strong>{filteredBoletas.length === 0 ? 0 : startRecord}</strong> -{' '}
          <strong>{endRecord}</strong> de <strong>{filteredBoletas.length}</strong>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage === 1}
            className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ChevronLeft size={13} />
          </button>
          <span className="px-2 font-semibold">
            Página {safeCurrentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage === totalPages}
            className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
