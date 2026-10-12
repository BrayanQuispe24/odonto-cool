import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Tag,
  CheckCircle2,
  XCircle,
  Filter,
  Eye,
  Clock,
  DollarSign,
  FileText,
  Sparkles,
} from 'lucide-react';
import type { Servicio } from '../types/servicio';
import { useAuthStore } from '../../auth/store/authStore';

interface ServicioTableProps {
  servicios: Servicio[];
  onEdit: (servicio: Servicio) => void;
  onDelete: (servicio: Servicio) => void;
}

export const ServicioTable: React.FC<ServicioTableProps> = ({
  servicios,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuthStore();
  const isAdmin = user?.rol?.nombre === 'Administrador';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewServicio, setViewServicio] = useState<Servicio | null>(null);
  const pageSize = 8;

  const categoriasDisponibles = useMemo(() => {
    const set = new Set<string>();
    servicios.forEach((s) => {
      if (s.categoria && s.categoria.trim()) {
        set.add(s.categoria.trim());
      }
    });
    return Array.from(set);
  }, [servicios]);

  const filteredServicios = useMemo(() => {
    return servicios.filter((serv) => {
      const term = searchTerm.toLowerCase();
      const numCod = (serv.codigo_servicio || '').toLowerCase();
      const nomServ = (serv.nombre || '').toLowerCase();
      const descServ = (serv.descripcion || '').toLowerCase();
      const catServ = (serv.categoria || '').toLowerCase();

      const matchesSearch =
        numCod.includes(term) || nomServ.includes(term) || descServ.includes(term) || catServ.includes(term);

      const matchesCategoria =
        selectedCategoria === 'all' || serv.categoria === selectedCategoria;

      return matchesSearch && matchesCategoria;
    });
  }, [servicios, searchTerm, selectedCategoria]);

  const totalPages = Math.ceil(filteredServicios.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedServicios = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredServicios.slice(start, start + pageSize);
  }, [filteredServicios, safeCurrentPage, pageSize]);

  const startRecord = (safeCurrentPage - 1) * pageSize + 1;
  const endRecord = Math.min(safeCurrentPage * pageSize, filteredServicios.length);

  return (
    <div className="bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[60vh]">
      {/* TOOLBAR */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
        {/* SEARCH INPUT */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
            <Search size={13} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por código, nombre o categoría..."
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

        {/* CATEGORY FILTER */}
        <div className="flex items-center gap-1.5">
          <Filter size={12} className="text-slate-400" />
          <select
            value={selectedCategoria}
            onChange={(e) => {
              setSelectedCategoria(e.target.value);
              setCurrentPage(1);
            }}
            className="py-1.5 px-2 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer min-w-[160px]"
          >
            <option value="all">Todas las categorías</option>
            {categoriasDisponibles.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-x-auto bg-white dark:bg-dark-surface">
        <table className="w-full text-left text-small whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-dark-bg text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-2 font-bold w-24">Código</th>
              <th className="px-4 py-2 font-bold">Servicio / Procedimiento</th>
              <th className="px-4 py-2 font-bold w-32">Categoría</th>
              <th className="px-4 py-2 font-bold w-32">Precio</th>
              <th className="px-4 py-2 font-bold w-24">Estado</th>
              <th className="px-4 py-2 font-bold text-right w-24">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200 font-medium">
            {paginatedServicios.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500 font-semibold">
                  No se encontraron servicios ni precios registrados.
                </td>
              </tr>
            ) : (
              paginatedServicios.map((serv) => {
                return (
                  <tr
                    key={serv.id}
                    className="hover:bg-slate-50 dark:hover:bg-dark-bg/50 transition-colors"
                  >
                    {/* CÓDIGO */}
                    <td className="px-4 py-2">
                      <span className="font-mono font-bold text-primary dark:text-secondary">
                        {serv.codigo_servicio}
                      </span>
                    </td>

                    {/* NOMBRE Y DESCRIPCIÓN */}
                    <td className="px-4 py-2">
                      <div>
                        <div className="font-bold text-primary-dark dark:text-white">
                          {serv.nombre}
                        </div>
                        {serv.descripcion && (
                          <div className="text-tiny text-slate-500 truncate max-w-xs mt-0.5">
                            {serv.descripcion}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* CATEGORÍA */}
                    <td className="px-4 py-2">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                        <Tag size={10} className="text-slate-400" />
                        {serv.categoria || 'General'}
                      </span>
                    </td>

                    {/* PRECIO REFERENCIAL */}
                    <td className="px-4 py-2">
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-primary dark:text-secondary">
                        Bs. {Number(serv.precio).toFixed(2)}
                      </span>
                    </td>

                    {/* ESTADO */}
                    <td className="px-4 py-2">
                      {serv.estado ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-cyan-50 dark:bg-cyan-900/30 text-primary dark:text-secondary border border-cyan-200 dark:border-cyan-800">
                          <CheckCircle2 size={10} />
                          ACTIVO
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                          <XCircle size={10} />
                          INACTIVO
                        </span>
                      )}
                    </td>

                    {/* ACCIONES */}
                    <td className="px-4 py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewServicio(serv)}
                          title="Ver detalle"
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-dark-bg dark:hover:bg-slate-800 text-primary dark:text-secondary transition-colors"
                        >
                          <Eye size={13} />
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              onClick={() => onEdit(serv)}
                              title="Editar"
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-dark-bg dark:hover:bg-slate-800 text-primary dark:text-secondary transition-colors"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => onDelete(serv)}
                              title="Eliminar"
                              className="p-1 rounded bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER PAGINATION */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between text-small text-slate-500 dark:text-slate-400 shrink-0">
        <div>
          Mostrando <strong>{filteredServicios.length === 0 ? 0 : startRecord}</strong> -{' '}
          <strong>{endRecord}</strong> de <strong>{filteredServicios.length}</strong>
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

      {/* DETAIL MODAL FOR VER SERVICIO */}
      {viewServicio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-primary-dark dark:text-white text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} className="text-primary" />
                <span>Detalle del Servicio</span>
              </div>
              <button
                onClick={() => setViewServicio(null)}
                className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4 text-slate-700 dark:text-slate-200 bg-white dark:bg-dark-surface">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-tiny font-mono text-primary dark:text-secondary font-bold block mb-0.5">
                    {viewServicio.codigo_servicio}
                  </span>
                  <h3 className="text-sm font-bold text-primary-dark dark:text-white">
                    {viewServicio.nombre}
                  </h3>
                </div>
                <div>
                  {viewServicio.estado ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-micro font-bold bg-cyan-50 dark:bg-cyan-900/30 text-primary dark:text-secondary border border-cyan-200 dark:border-cyan-800">
                      <CheckCircle2 size={10} />
                      ACTIVO
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-micro font-bold bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                      <XCircle size={10} />
                      INACTIVO
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg">
                  <div className="text-micro text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Tag size={10} className="text-primary" />
                    Categoría
                  </div>
                  <div className="text-small font-bold text-primary-dark dark:text-white mt-1">
                    {viewServicio.categoria || 'General'}
                  </div>
                </div>

                <div className="p-3 rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg">
                  <div className="text-micro text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <DollarSign size={10} className="text-primary" />
                    Precio Base
                  </div>
                  <div className="text-sm font-bold font-mono text-primary dark:text-secondary mt-1">
                    Bs. {Number(viewServicio.precio).toFixed(2)}
                  </div>
                </div>

                <div className="col-span-2 p-3 rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg">
                  <div className="text-micro text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Clock size={10} className="text-primary" />
                    Duración Estimada
                  </div>
                  <div className="text-small font-bold font-mono text-primary-dark dark:text-white mt-1">
                    {viewServicio.duracion_estimada_minutos} minutos
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-surface">
                <div className="text-micro text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
                  <FileText size={10} className="text-primary" />
                  Descripción
                </div>
                <p className="text-small text-slate-600 dark:text-slate-300 leading-relaxed">
                  {viewServicio.descripcion || 'Sin descripción adicional registrada para este servicio.'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-end">
              <button
                onClick={() => setViewServicio(null)}
                className="px-4 py-1.5 rounded bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-small font-semibold border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
