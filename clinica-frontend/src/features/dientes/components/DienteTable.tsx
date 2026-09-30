import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Filter,
  Layers,
  Eye,
  Activity,
  FileText,
  Sparkles,
} from 'lucide-react';
import type { Diente } from '../types/diente';
import { CUADRANTES_DENTALES } from '../types/diente';
import { useAuthStore } from '../../auth/store/authStore';

interface DienteTableProps {
  dientes: Diente[];
  onEdit: (diente: Diente) => void;
  onDelete: (diente: Diente) => void;
}

export const DienteTable: React.FC<DienteTableProps> = ({
  dientes,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuthStore();
  const isAdmin = user?.rol?.nombre === 'Administrador';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuadrante, setSelectedCuadrante] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewDiente, setViewDiente] = useState<Diente | null>(null);
  const pageSize = 8;

  const filteredDientes = useMemo(() => {
    return dientes.filter((d) => {
      const term = searchTerm.toLowerCase();
      const numDiente = String(d.numero_diente).toLowerCase();
      const nomDiente = (d.nombre || '').toLowerCase();
      const descDiente = (d.descripcion || '').toLowerCase();

      const matchesSearch =
        numDiente.includes(term) || nomDiente.includes(term) || descDiente.includes(term);

      const matchesCuadrante =
        selectedCuadrante === 'all' || d.cuadrante === selectedCuadrante;

      return matchesSearch && matchesCuadrante;
    });
  }, [dientes, searchTerm, selectedCuadrante]);

  const totalPages = Math.ceil(filteredDientes.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedDientes = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredDientes.slice(start, start + pageSize);
  }, [filteredDientes, safeCurrentPage, pageSize]);

  const startRecord = (safeCurrentPage - 1) * pageSize + 1;
  const endRecord = Math.min(safeCurrentPage * pageSize, filteredDientes.length);

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
            placeholder="Buscar por número FDI, nombre anatómico o cuadrante..."
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

        {/* QUADRANT FILTER */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#0077D4] dark:text-[#00C2E0]" />
          <select
            value={selectedCuadrante}
            onChange={(e) => {
              setSelectedCuadrante(e.target.value);
              setCurrentPage(1);
            }}
            className="py-2 px-3 rounded-xl text-xs font-medium border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all cursor-pointer min-w-[200px]"
          >
            <option value="all" className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">Todos los cuadrantes</option>
            {CUADRANTES_DENTALES.map((cuad) => (
              <option key={cuad} value={cuad} className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">
                {cuad}
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
              <th className="py-3.5 px-4">Nº FDI</th>
              <th className="py-3.5 px-4">NOMBRE ANATÓMICO</th>
              <th className="py-3.5 px-4">CUADRANTE</th>
              <th className="py-3.5 px-4">ESTADO</th>
              <th className="py-3.5 px-4 text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0840A8]/15 dark:divide-[#0840A8]/30 text-xs text-[#0840A8] dark:text-blue-50 font-medium">
            {paginatedDientes.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[#0077D4] dark:text-blue-200/70 font-medium">
                  No se encontraron piezas dentales registradas.
                </td>
              </tr>
            ) : (
              paginatedDientes.map((d) => {
                return (
                  <tr
                    key={d.id}
                    className="bg-white dark:bg-[#002D5E] even:bg-slate-50/50 dark:even:bg-[#002247]/60 hover:bg-[#E5F7FF] dark:hover:bg-[#0840A8]/30 transition-colors duration-200"
                  >
                    {/* Nº FDI BADGE */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#0077D4] to-[#00C2E0] text-white font-mono font-extrabold text-sm shadow-md shadow-[#0077D4]/30">
                        {d.numero_diente}
                      </span>
                    </td>

                    {/* NOMBRE Y DESCRIPCIÓN */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div>
                        <div className="font-bold text-[#0840A8] dark:text-white text-xs">
                          {d.nombre}
                        </div>
                        {d.descripcion && (
                          <div className="text-[10px] text-[#0077D4] dark:text-blue-200/70 line-clamp-1 mt-0.5">
                            {d.descripcion}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* CUADRANTE */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0077D4] dark:text-blue-100 border border-[#0840A8]/15 dark:border-[#0077D4]/40">
                        <Layers size={11} className="text-[#0077D4] dark:text-[#00C2E0]" />
                        {d.cuadrante || 'Sin cuadrante'}
                      </span>
                    </td>

                    {/* ESTADO */}
                    <td className="py-3.5 px-4">
                      {d.estado ? (
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

                    {/* ACCIONES (VER ACCESIBLE PARA TODOS, EDITAR/ELIMINAR PARA ADMIN) */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewDiente(d)}
                          title="Ver detalle del diente"
                          className="p-1.5 rounded-lg bg-[#00C2E0]/15 hover:bg-[#00C2E0]/30 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 transition-colors cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              onClick={() => onEdit(d)}
                              title="Editar pieza dental"
                              className="p-1.5 rounded-lg bg-[#0077D4]/30 hover:bg-[#0077D4]/50 text-[#0077D4] dark:text-blue-100 border border-[#0840A8]/15 dark:border-[#0077D4]/50 transition-colors cursor-pointer"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => onDelete(d)}
                              title="Eliminar pieza dental"
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
          Mostrando <strong>{filteredDientes.length === 0 ? 0 : startRecord}</strong> -{' '}
          <strong>{endRecord}</strong> de <strong>{filteredDientes.length}</strong> piezas dentales
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

      {/* DETAIL MODAL FOR VER DIENTE */}
      {viewDiente && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/40 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden text-[#0840A8] dark:text-white flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-[#E5F7FF] dark:bg-[#0840A8]/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#0077D4] dark:text-[#00C2E0] text-sm font-bold">
                <Activity size={18} />
                <span>Detalle Anatómico de Pieza Dental (FDI)</span>
              </div>
              <button
                onClick={() => setViewDiente(null)}
                className="p-1.5 rounded-lg text-[#0077D4] dark:text-blue-100 hover:text-[#0840A8] dark:text-white hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-[#0840A8]/15 dark:border-[#0840A8]/40 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0077D4] to-[#00C2E0] text-white font-mono font-extrabold text-base flex items-center justify-center shadow-lg shadow-[#0077D4]/40">
                    {viewDiente.numero_diente}
                  </span>
                  <div>
                    <span className="text-[10px] font-mono text-[#0077D4] dark:text-[#00C2E0] uppercase font-bold block">
                      Código FDI Nº {viewDiente.numero_diente}
                    </span>
                    <h3 className="text-base font-extrabold text-[#0840A8] dark:text-white">
                      {viewDiente.nombre}
                    </h3>
                  </div>
                </div>
                <div>
                  {viewDiente.estado ? (
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

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40">
                  <div className="text-[10px] text-[#0077D4] dark:text-blue-200/70 font-semibold flex items-center gap-1">
                    <Layers size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
                    Cuadrante Anatómico
                  </div>
                  <div className="text-xs font-bold text-[#0840A8] dark:text-white mt-1">
                    {viewDiente.cuadrante || 'No asignado'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40">
                  <div className="text-[10px] text-[#0077D4] dark:text-blue-200/70 font-semibold flex items-center gap-1">
                    <Sparkles size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
                    Tipo de Dentición
                  </div>
                  <div className="text-xs font-bold text-[#0840A8] dark:text-white capitalize mt-1">
                    {viewDiente.tipo_denticion === 'deciduo' ? 'Deciduo (Infantil)' : 'Permanente (Adulto)'}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40">
                <div className="text-[10px] text-[#0077D4] dark:text-blue-200/70 font-semibold flex items-center gap-1 mb-1">
                  <FileText size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
                  Descripción Anatómica & Posición
                </div>
                <p className="text-xs text-[#0077D4] dark:text-blue-100/90 leading-relaxed font-medium">
                  {viewDiente.descripcion || 'Sin descripción anatómica registrada para esta pieza dental.'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-white dark:bg-[#0840A8]/20 flex items-center justify-end">
              <button
                onClick={() => setViewDiente(null)}
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
