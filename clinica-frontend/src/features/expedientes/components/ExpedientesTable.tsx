import React, { useState, useMemo } from 'react';
import { Search, X, Eye, Trash2, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import type { Expediente } from '../types/expediente';

interface ExpedientesTableProps {
  expedientes: Expediente[];
  onView: (expediente: Expediente) => void;
  onDelete: (expediente: Expediente) => void;
}

export const ExpedientesTable: React.FC<ExpedientesTableProps> = ({
  expedientes,
  onView,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // 12 cards per page (fits 3x4 grid well)

  const filteredExpedientes = useMemo(() => {
    return expedientes.filter((e) => {
      const term = searchTerm.toLowerCase();
      const pacName = e.paciente
        ? `${e.paciente.nombre} ${e.paciente.apellido}`.toLowerCase()
        : '';
      const titulo = (e.titulo || '').toLowerCase();
      const tipo = (e.tipo_documento || '').toLowerCase();

      return (
        pacName.includes(term) ||
        titulo.includes(term) ||
        tipo.includes(term)
      );
    });
  }, [expedientes, searchTerm]);

  const totalPages = Math.ceil(filteredExpedientes.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedExpedientes = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredExpedientes.slice(start, start + pageSize);
  }, [filteredExpedientes, safeCurrentPage, pageSize]);

  const startRecord = (safeCurrentPage - 1) * pageSize + 1;
  const endRecord = Math.min(safeCurrentPage * pageSize, filteredExpedientes.length);

  return (
    <div className="bg-white dark:bg-[#002D5E] rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 overflow-hidden transition-all duration-300">
      {/* TOOLBAR */}
      <div className="p-4 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-white dark:bg-[#002D5E] flex flex-col md:flex-row md:items-center justify-between gap-3">
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
            placeholder="Buscar por paciente, título o tipo..."
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
      </div>

      {/* CARDS CONTENT */}
      <div className="p-4 bg-white dark:bg-[#001C3D]/20">
        {paginatedExpedientes.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center bg-white dark:bg-[#002D5E] rounded-xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30">
            <FileText size={48} className="text-[#0077D4]/30 dark:text-[#00C2E0]/30 mb-4" />
            <p className="text-[#0077D4] dark:text-blue-200/70 font-medium text-lg">
              No se encontraron expedientes.
            </p>
            <p className="text-[#0840A8]/60 dark:text-blue-200/50 text-sm mt-1">
              Sube un nuevo documento PDF para comenzar.
            </p>
          </div>
        ) : (
          <>
            {/* VISTA MOBILE/TABLET (Tarjetas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden">
              {paginatedExpedientes.map((exp) => {
                const pacName = exp.paciente
                  ? `${exp.paciente.nombre} ${exp.paciente.apellido}`
                  : 'Paciente Desconocido';
                const dateStr = exp.created_at ? new Date(exp.created_at).toLocaleDateString() : '';

                return (
                  <div
                    key={exp.id}
                    className="flex flex-col bg-white dark:bg-[#002D5E] rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-lg shadow-[#0077D4]/5 dark:shadow-[#001C3D]/50 hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between p-4 border-b border-[#0840A8]/10 dark:border-[#00C2E0]/20 bg-gradient-to-r from-[#F4F9FF] to-white dark:from-[#001C3D] dark:to-[#002D5E]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0840A8] dark:text-blue-200">
                          📅 {dateStr}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E5F7FF] dark:bg-[#0077D4]/30 text-[#0077D4] dark:text-[#00C2E0] border border-[#0077D4]/20 dark:border-[#00C2E0]/30 uppercase tracking-wider">
                          {exp.tipo_documento}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onView(exp)}
                          title="Ver Documento PDF"
                          className="p-1.5 rounded-lg bg-[#E5F7FF] hover:bg-[#0077D4] text-[#0077D4] hover:text-white dark:bg-[#0077D4]/30 dark:hover:bg-[#0077D4]/50 dark:text-[#00C2E0] transition-colors cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(exp)}
                          title="Eliminar Expediente"
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white dark:bg-rose-500/20 dark:hover:bg-rose-500/30 dark:text-rose-300 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-extrabold text-[#0840A8] dark:text-white leading-tight mb-2 line-clamp-2" title={exp.titulo}>
                          {exp.titulo}
                        </h3>
                        {exp.descripcion && (
                          <p className="text-xs text-[#0840A8]/80 dark:text-blue-100 line-clamp-2 mb-3" title={exp.descripcion}>
                            {exp.descripcion}
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-2 pt-3 border-t border-[#0840A8]/10 dark:border-[#00C2E0]/20">
                        <div className="text-[10px] font-semibold text-[#0077D4] dark:text-[#00C2E0] uppercase tracking-wider mb-0.5">
                          Paciente
                        </div>
                        <div className="text-sm font-bold text-[#0840A8] dark:text-white flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-[#0077D4]/20 dark:bg-[#00C2E0]/20 flex items-center justify-center text-[10px] text-[#0077D4] dark:text-[#00C2E0]">
                            {exp.paciente?.nombre.charAt(0)}{exp.paciente?.apellido.charAt(0)}
                          </div>
                          <span className="truncate" title={pacName}>{pacName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* VISTA DESKTOP (Tabla) */}
            <div className="hidden xl:block overflow-x-auto rounded-xl border border-[#0840A8]/10 dark:border-[#00C2E0]/20">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-blue-200">
                  <tr>
                    <th className="px-4 py-3 font-bold">Fecha</th>
                    <th className="px-4 py-3 font-bold">Paciente</th>
                    <th className="px-4 py-3 font-bold">Documento</th>
                    <th className="px-4 py-3 font-bold">Tipo</th>
                    <th className="px-4 py-3 font-bold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0840A8]/10 dark:divide-[#00C2E0]/10">
                  {paginatedExpedientes.map((exp) => {
                    const pacName = exp.paciente
                      ? `${exp.paciente.nombre} ${exp.paciente.apellido}`
                      : 'Paciente Desconocido';
                    const dateStr = exp.created_at ? new Date(exp.created_at).toLocaleDateString() : '';

                    return (
                      <tr key={exp.id} className="hover:bg-[#F4F9FF]/50 dark:hover:bg-[#001C3D]/50 transition-colors">
                        <td className="px-4 py-3 text-[#0840A8] dark:text-blue-100">{dateStr}</td>
                        <td className="px-4 py-3 font-bold text-[#0840A8] dark:text-white">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#0077D4]/20 dark:bg-[#00C2E0]/20 flex items-center justify-center text-[10px] text-[#0077D4] dark:text-[#00C2E0]">
                              {exp.paciente?.nombre.charAt(0)}{exp.paciente?.apellido.charAt(0)}
                            </div>
                            {pacName}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-[#0840A8] dark:text-white max-w-[200px] truncate" title={exp.titulo}>
                            {exp.titulo}
                          </div>
                          {exp.descripcion && (
                            <div className="text-xs text-[#0840A8]/70 dark:text-blue-200/70 max-w-[200px] truncate" title={exp.descripcion}>
                              {exp.descripcion}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[#E5F7FF] dark:bg-[#0077D4]/30 text-[#0077D4] dark:text-[#00C2E0] border border-[#0077D4]/20 dark:border-[#00C2E0]/30 uppercase tracking-wider">
                            {exp.tipo_documento}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onView(exp)}
                              title="Ver Documento"
                              className="p-1.5 rounded-lg bg-[#E5F7FF] hover:bg-[#0077D4] text-[#0077D4] hover:text-white dark:bg-[#0077D4]/30 dark:hover:bg-[#0077D4]/50 dark:text-[#00C2E0] transition-colors cursor-pointer"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => onDelete(exp)}
                              title="Eliminar Expediente"
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
      <div className="p-4 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-white dark:bg-[#002D5E] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#0077D4] dark:text-blue-200/80">
        <div>
          Mostrando <strong>{filteredExpedientes.length === 0 ? 0 : startRecord}</strong> -{' '}
          <strong>{endRecord}</strong> de <strong>{filteredExpedientes.length}</strong> expedientes
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
