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
            placeholder="Buscar por código, nombre o categoría..."
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

        {/* CATEGORY FILTER */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#0077D4] dark:text-[#00C2E0]" />
          <select
            value={selectedCategoria}
            onChange={(e) => {
              setSelectedCategoria(e.target.value);
              setCurrentPage(1);
            }}
            className="py-2 px-3 rounded-xl text-xs font-medium border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all cursor-pointer min-w-[180px]"
          >
            <option value="all" className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">Todas las categorías</option>
            {categoriasDisponibles.map((cat) => (
              <option key={cat} value={cat} className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#E5F7FF] dark:bg-[#0840A8]/40 border-b border-[#0840A8]/15 dark:border-[#0840A8]/60 text-[11px] font-extrabold uppercase tracking-wider text-[#0077D4] dark:text-blue-100 select-none">
              <th className="py-3.5 px-4">CÓDIGO</th>
              <th className="py-3.5 px-4">SERVICIO / PROCEDIMIENTO</th>
              <th className="py-3.5 px-4">CATEGORÍA</th>
              <th className="py-3.5 px-4">PRECIO OFICIAL</th>
              <th className="py-3.5 px-4">ESTADO</th>
              <th className="py-3.5 px-4 text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0840A8]/15 dark:divide-[#0840A8]/30 text-xs text-[#0840A8] dark:text-blue-50 font-medium">
            {paginatedServicios.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#0077D4] dark:text-blue-200/70 font-medium">
                  No se encontraron servicios ni precios registrados.
                </td>
              </tr>
            ) : (
              paginatedServicios.map((serv) => {
                return (
                  <tr
                    key={serv.id}
                    className="bg-white dark:bg-[#002D5E] even:bg-slate-50/50 dark:even:bg-[#002247]/60 hover:bg-[#E5F7FF] dark:hover:bg-[#0840A8]/30 transition-colors duration-200"
                  >
                    {/* CÓDIGO */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-xs text-[#0077D4] dark:text-[#00C2E0]">
                        {serv.codigo_servicio}
                      </span>
                    </td>

                    {/* NOMBRE Y DESCRIPCIÓN */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div>
                        <div className="font-bold text-[#0840A8] dark:text-white text-xs">
                          {serv.nombre}
                        </div>
                        {serv.descripcion && (
                          <div className="text-[10px] text-[#0077D4] dark:text-blue-200/70 line-clamp-1 mt-0.5">
                            {serv.descripcion}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* CATEGORÍA */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0077D4] dark:text-blue-100 border border-[#0840A8]/15 dark:border-[#0077D4]/40">
                        <Tag size={11} className="text-[#0077D4] dark:text-[#00C2E0]" />
                        {serv.categoria}
                      </span>
                    </td>

                    {/* PRECIO OFICIAL */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#0077D4] dark:text-[#00C2E0] font-mono bg-[#F4F9FF] dark:bg-[#001C3D]/80 px-2.5 py-1 rounded-lg border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-sm">
                        <span>Bs.</span>
                        <span>{Number(serv.precio).toFixed(2)}</span>
                      </span>
                    </td>

                    {/* ESTADO */}
                    <td className="py-3.5 px-4">
                      {serv.estado ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/80 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/40">
                          <CheckCircle2 size={11} className="text-[#0077D4] dark:text-[#00C2E0]" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50">
                          <XCircle size={11} />
                          Inactivo
                        </span>
                      )}
                    </td>

                    {/* ACCIONES (VER DISPONIBLE PARA TODOS, EDITAR/ELIMINAR SOLO ADMIN) */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewServicio(serv)}
                          title="Ver detalle del servicio"
                          className="p-1.5 rounded-lg bg-[#00C2E0]/15 hover:bg-[#00C2E0]/30 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 transition-colors cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              onClick={() => onEdit(serv)}
                              title="Editar servicio y precio"
                              className="p-1.5 rounded-lg bg-[#0077D4]/30 hover:bg-[#0077D4]/50 text-[#0077D4] dark:text-blue-100 border border-[#0840A8]/15 dark:border-[#0077D4]/50 transition-colors cursor-pointer"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => onDelete(serv)}
                              title="Eliminar servicio"
                              className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-colors cursor-pointer"
                            >
                              <Trash2 size={14} />
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
      <div className="p-4 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-white dark:bg-[#0840A8]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#0077D4] dark:text-blue-200/80">
        <div>
          Mostrando <strong>{filteredServicios.length === 0 ? 0 : startRecord}</strong> -{' '}
          <strong>{endRecord}</strong> de <strong>{filteredServicios.length}</strong> servicios
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

      {/* DETAIL MODAL FOR VER SERVICIO */}
      {viewServicio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/40 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden text-[#0840A8] dark:text-white flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-[#E5F7FF] dark:bg-[#0840A8]/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#0077D4] dark:text-[#00C2E0] text-sm font-bold">
                <Sparkles size={18} />
                <span>Detalle del Servicio Clínico</span>
              </div>
              <button
                onClick={() => setViewServicio(null)}
                className="p-1.5 rounded-lg text-[#0077D4] dark:text-blue-100 hover:text-[#0840A8] dark:text-white hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-[#0840A8]/15 dark:border-[#0840A8]/40 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-[#0077D4] dark:text-[#00C2E0] uppercase font-bold block">
                    {viewServicio.codigo_servicio}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#0840A8] dark:text-white mt-0.5">
                    {viewServicio.nombre}
                  </h3>
                </div>
                <div>
                  {viewServicio.estado ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-cyan-950/90 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/50">
                      <CheckCircle2 size={13} />
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50">
                      <XCircle size={13} />
                      Inactivo
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40">
                  <div className="text-[10px] text-[#0077D4] dark:text-blue-200/70 font-semibold flex items-center gap-1">
                    <Tag size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
                    Categoría
                  </div>
                  <div className="text-xs font-bold text-[#0840A8] dark:text-white mt-1">
                    {viewServicio.categoria || 'General'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40">
                  <div className="text-[10px] text-[#0077D4] dark:text-blue-200/70 font-semibold flex items-center gap-1">
                    <DollarSign size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
                    Precio Oficial
                  </div>
                  <div className="text-sm font-extrabold text-[#0077D4] dark:text-[#00C2E0] font-mono mt-1">
                    Bs. {Number(viewServicio.precio).toFixed(2)}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40">
                  <div className="text-[10px] text-[#0077D4] dark:text-blue-200/70 font-semibold flex items-center gap-1">
                    <Clock size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
                    Duración
                  </div>
                  <div className="text-xs font-bold text-[#0840A8] dark:text-white font-mono mt-1">
                    {viewServicio.duracion_estimada_minutos} minutos
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40">
                <div className="text-[10px] text-[#0077D4] dark:text-blue-200/70 font-semibold flex items-center gap-1 mb-1">
                  <FileText size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
                  Descripción del Procedimiento
                </div>
                <p className="text-xs text-[#0077D4] dark:text-blue-100/90 leading-relaxed font-medium">
                  {viewServicio.descripcion || 'Sin descripción adicional registrada para este servicio.'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-white dark:bg-[#0840A8]/20 flex items-center justify-end">
              <button
                onClick={() => setViewServicio(null)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white text-xs font-bold shadow-md cursor-pointer hover:opacity-90"
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
