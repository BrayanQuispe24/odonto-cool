import React, { useState, useMemo, useEffect } from 'react';
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
  Building2,
  Receipt,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import type { Proforma, ProformaEstado } from '../types/proforma';
import type { Sucursal } from '../../sucursales/types/sucursal';
import { getSucursalesApi } from '../../sucursales/services/sucursalService';
import { useUserRole } from '../../../hooks/useUserRole';

interface ProformasTableProps {
  proformas: Proforma[];
  onView: (proforma: Proforma) => void;
  onPrintPdf: (proforma: Proforma) => void;
  onOpenAprobarModal: (proforma: Proforma) => void;
  onFacturar: (proforma: Proforma) => void;
  onDelete: (proforma: Proforma) => void;
}

const EstadoBadge: React.FC<{ estado: ProformaEstado }> = ({ estado }) => {
  if (estado === 'Aprobado') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
        <CheckCircle2 size={10} />
        APROBADO
      </span>
    );
  }
  if (estado === 'Rechazado') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
        <XCircle size={10} />
        RECHAZADO
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
      <Clock size={10} />
      BORRADOR
    </span>
  );
};

export const ProformasTable: React.FC<ProformasTableProps> = ({
  proformas,
  onView,
  onPrintPdf,
  onOpenAprobarModal,
  onFacturar,
  onDelete,
}) => {
  const { isAdmin } = useUserRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSucursal, setSelectedSucursal] = useState<string>('all');
  const [selectedEstado, setSelectedEstado] = useState<string>('all');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    if (isAdmin) {
      getSucursalesApi()
        .then((data) => setSucursales(data))
        .catch(() => {});
    }
  }, [isAdmin]);

  const filteredProformas = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return proformas.filter((p) => {
      const codigo = (p.codigo_proforma || '').toLowerCase();
      const clientName = `${p.nombre} ${p.apellido}`.toLowerCase();
      const phone = (p.celular || '').toLowerCase();
      const docName = p.doctor ? `${p.doctor.nombre} ${p.doctor.apellido}`.toLowerCase() : '';

      const matchesSearch =
        codigo.includes(term) ||
        clientName.includes(term) ||
        phone.includes(term) ||
        docName.includes(term);

      const matchesEstado = selectedEstado === 'all' || p.estado === selectedEstado;

      const matchesSucursal =
        !isAdmin || selectedSucursal === 'all' || String(p.sucursal_id) === selectedSucursal;

      let matchesFecha = true;
      if (fechaDesde || fechaHasta) {
        const pFecha = String(p.fecha_emision || '').split('T')[0];
        if (pFecha) {
          if (fechaDesde && pFecha < fechaDesde) matchesFecha = false;
          if (fechaHasta && pFecha > fechaHasta) matchesFecha = false;
        }
      }

      return matchesSearch && matchesEstado && matchesSucursal && matchesFecha;
    });
  }, [proformas, searchTerm, selectedEstado, selectedSucursal, fechaDesde, fechaHasta, isAdmin]);

  const totalSum = useMemo(() => {
    return filteredProformas.reduce((acc, p) => acc + Number(p.monto_total || 0), 0);
  }, [filteredProformas]);

  const totalPages = Math.ceil(filteredProformas.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProformas = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredProformas.slice(start, start + pageSize);
  }, [filteredProformas, safeCurrentPage, pageSize]);

  const startRecord = (safeCurrentPage - 1) * pageSize + 1;
  const endRecord = Math.min(safeCurrentPage * pageSize, filteredProformas.length);

  const selectClass =
    'py-1.5 px-2 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer';

  return (
    <div className="bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[60vh]">
      {/* TOOLBAR */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
        {/* BUSCADOR */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
            <Search size={13} />
          </div>
          <input
            id="proformas-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por código, cliente, doctor o celular..."
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

        {/* FILTROS */}
        <div className="flex flex-wrap items-center gap-2">
          {/* FECHAS */}
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

          {/* SUCURSAL (Exclusivo Administrador) */}
          {isAdmin && (
            <div className="flex items-center gap-1.5 ml-1 border-l border-slate-200 dark:border-slate-700 pl-2">
              <Building2 size={12} className="text-slate-400" />
              <select
                id="proformas-filter-sucursal"
                value={selectedSucursal}
                onChange={(e) => {
                  setSelectedSucursal(e.target.value);
                  setCurrentPage(1);
                }}
                className={`${selectClass} min-w-[140px]`}
              >
                <option value="all">Todas las sucursales</option>
                {sucursales.map((suc) => (
                  <option key={suc.id} value={String(suc.id)}>
                    {suc.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ESTADO */}
          <div className="flex items-center gap-1.5 ml-1 border-l border-slate-200 dark:border-slate-700 pl-2">
            <Filter size={12} className="text-slate-400" />
            <select
              id="proformas-filter-estado"
              value={selectedEstado}
              onChange={(e) => {
                setSelectedEstado(e.target.value);
                setCurrentPage(1);
              }}
              className={`${selectClass} min-w-[130px]`}
            >
              <option value="all">Todos los estados</option>
              <option value="Borrador">Borrador</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Rechazado">Rechazado</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-x-auto bg-white dark:bg-dark-surface">
        <table className="w-full text-left text-small whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-dark-bg text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-2.5">Código / Fecha</th>
              <th className="px-4 py-2.5">Cliente / Paciente</th>
              <th className="px-4 py-2.5">Sede & Especialista</th>
              <th className="px-4 py-2.5">Tratamientos Cotizados</th>
              <th className="px-4 py-2.5">Estado</th>
              <th className="px-4 py-2.5 text-right">Total Presupuestado</th>
              <th className="px-4 py-2.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedProformas.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-400 font-medium italic">
                  No se encontraron proformas o presupuestos con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              paginatedProformas.map((proforma) => {
                const tratamientosStr =
                  (proforma.detalles || [])
                    .map((d) => d.nombre_servicio || d.servicio?.nombre)
                    .filter(Boolean)
                    .join(', ') || 'Procedimientos odontológicos';

                const isAprobado = proforma.estado === 'Aprobado';
                const isBorrador = proforma.estado === 'Borrador';

                return (
                  <tr
                    key={proforma.id}
                    onDoubleClick={() => onView(proforma)}
                    className="hover:bg-slate-50 dark:hover:bg-dark-bg/50 transition-colors"
                  >
                    {/* CODIGO Y FECHA */}
                    <td className="px-4 py-2.5">
                      <div className="font-mono font-bold text-primary dark:text-secondary">
                        {proforma.codigo_proforma}
                      </div>
                      <div className="text-tiny text-slate-500 font-mono mt-0.5">
                        {String(proforma.fecha_emision).split('T')[0]} • Validez {proforma.dias_validez}d
                      </div>
                    </td>

                    {/* CLIENTE / PACIENTE */}
                    <td className="px-4 py-2.5">
                      <div className="font-bold text-slate-800 dark:text-white">
                        {proforma.nombre} {proforma.apellido}
                      </div>
                      <div className="text-tiny text-slate-500 flex items-center gap-1 mt-0.5">
                        <span>{proforma.edad} años ({proforma.sexo})</span>
                        <span>• Cel: {proforma.celular}</span>
                        {proforma.paciente && (
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold ml-1">
                            [{proforma.paciente.codigo_paciente}]
                          </span>
                        )}
                      </div>
                    </td>

                    {/* SUCURSAL Y DOCTOR */}
                    <td className="px-4 py-2.5">
                      <div className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1">
                        <Building2 size={11} className="text-primary shrink-0" />
                        <span className="truncate max-w-[150px]">
                          {proforma.sucursal?.nombre || 'Central'}
                        </span>
                      </div>
                      <div className="text-tiny text-slate-500 mt-0.5">
                        {proforma.doctor
                          ? `Dr(a). ${proforma.doctor.nombre} ${proforma.doctor.apellido}`
                          : 'Sin doctor asignado'}
                      </div>
                    </td>

                    {/* TRATAMIENTOS */}
                    <td
                      className="px-4 py-2.5 max-w-[220px] truncate text-slate-600 dark:text-slate-300"
                      title={tratamientosStr}
                    >
                      {tratamientosStr}
                    </td>

                    {/* ESTADO */}
                    <td className="px-4 py-2.5">
                      <EstadoBadge estado={proforma.estado} />
                    </td>

                    {/* TOTAL ESTIMADO */}
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                      Bs. {Number(proforma.monto_total).toFixed(2)}
                    </td>

                    {/* ACCIONES */}
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* BOTÓN FACTURAR: SOLO SI ESTÁ APROBADO */}
                        {isAprobado && (
                          <button
                            onClick={() => onFacturar(proforma)}
                            title="Emitir boleta / Facturar presupuesto"
                            className="px-2 py-1 rounded bg-[#0077D4] hover:bg-[#0840A8] text-white font-bold text-tiny flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                          >
                            <Receipt size={11} />
                            <span>Facturar</span>
                          </button>
                        )}

                        {/* GESTIONAR ESTADO: SI ESTÁ EN BORRADOR */}
                        {isBorrador && (
                          <button
                            onClick={() => onOpenAprobarModal(proforma)}
                            title="Gestionar aprobación del cliente"
                            className="p-1 rounded bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-900/40 text-amber-600 dark:text-amber-400 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 size={13} />
                          </button>
                        )}

                        {/* VER DETALLES */}
                        <button
                          onClick={() => onView(proforma)}
                          title="Ver detalle del presupuesto"
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-dark-bg dark:hover:bg-slate-800 text-primary dark:text-secondary transition-colors cursor-pointer"
                        >
                          <Eye size={13} />
                        </button>

                        {/* IMPRIMIR PDF */}
                        <button
                          onClick={() => onPrintPdf(proforma)}
                          title="Imprimir proforma para el cliente"
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-dark-bg dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                        >
                          <Printer size={13} />
                        </button>

                        {/* ELIMINAR */}
                        <button
                          onClick={() => onDelete(proforma)}
                          title="Eliminar proforma"
                          className="p-1 rounded bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
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

          {filteredProformas.length > 0 && (
            <tfoot className="bg-slate-50 dark:bg-dark-bg border-t-2 border-slate-200 dark:border-slate-700 text-small">
              <tr>
                <td colSpan={5} className="px-4 py-2 font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Totales ({filteredProformas.length} proformas filtradas)
                </td>
                <td className="px-4 py-2 text-right font-mono font-bold text-base text-[#0840A8] dark:text-secondary">
                  Bs. {totalSum.toFixed(2)}
                </td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* FOOTER PAGINATION */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between text-small text-slate-500 dark:text-slate-400 shrink-0">
        <div>
          Mostrando <strong>{filteredProformas.length === 0 ? 0 : startRecord}</strong> -{' '}
          <strong>{endRecord}</strong> de <strong>{filteredProformas.length}</strong>
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
