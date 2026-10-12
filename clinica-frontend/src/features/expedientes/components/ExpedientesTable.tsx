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
  const pageSize = 10; // Fits well on screen

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
    <div className="bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col w-full">
      {/* TOOLBAR */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between gap-3">
        {/* SEARCH INPUT */}
        <div className="relative flex-1 max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search size={13} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por paciente, título o tipo..."
            className="w-full pl-8 pr-8 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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
      </div>

      {/* CARDS CONTENT */}
      <div className="bg-white dark:bg-dark-surface">
        {paginatedExpedientes.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <FileText size={32} className="text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs">
              No se encontraron expedientes.
            </p>
          </div>
        ) : (
          <>
            {/* VISTA MOBILE/TABLET (Tarjetas) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 xl:hidden">
              {paginatedExpedientes.map((exp) => {
                const pacName = exp.paciente
                  ? `${exp.paciente.nombre} ${exp.paciente.apellido}`
                  : 'Paciente Desconocido';
                const dateStr = exp.created_at ? new Date(exp.created_at).toLocaleDateString() : '';

                return (
                  <div
                    key={exp.id}
                    className="flex flex-col bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between p-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg">
                      <div className="flex items-center gap-2">
                        <span className="text-tiny font-bold text-slate-500 dark:text-slate-400">
                          {dateStr}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-micro font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          {exp.tipo_documento}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onView(exp)}
                          className="p-1 rounded bg-[#0077D4]/10 hover:bg-[#0077D4] text-primary hover:text-white transition-colors"
                        >
                          <Eye size={12} />
                        </button>
                        <button
                          onClick={() => onDelete(exp)}
                          className="p-1 rounded bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white transition-colors dark:bg-rose-900/30"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-primary-dark dark:text-white line-clamp-1" title={exp.titulo}>
                          {exp.titulo}
                        </h3>
                        {exp.descripcion && (
                          <p className="text-tiny text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5" title={exp.descripcion}>
                            {exp.descripcion}
                          </p>
                        )}
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-small font-medium text-slate-700 dark:text-slate-300">
                        {pacName}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* VISTA DESKTOP (Tabla) */}
            <div className="hidden xl:block overflow-x-auto">
              <table className="w-full text-left text-small whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-dark-bg text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2 font-bold w-28">Fecha</th>
                    <th className="px-4 py-2 font-bold w-48">Paciente</th>
                    <th className="px-4 py-2 font-bold">Documento</th>
                    <th className="px-4 py-2 font-bold w-32">Tipo</th>
                    <th className="px-4 py-2 font-bold text-right w-24">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedExpedientes.map((exp) => {
                    const pacName = exp.paciente
                      ? `${exp.paciente.nombre} ${exp.paciente.apellido}`
                      : 'Paciente Desconocido';
                    const dateStr = exp.created_at ? new Date(exp.created_at).toLocaleDateString() : '';

                    return (
                      <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-dark-bg/50 transition-colors">
                        <td className="px-4 py-2 font-mono text-slate-500 dark:text-slate-400">{dateStr}</td>
                        <td className="px-4 py-2 font-semibold text-primary-dark dark:text-white truncate max-w-[200px]" title={pacName}>
                          {pacName}
                        </td>
                        <td className="px-4 py-2">
                          <div className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[300px]" title={exp.titulo}>
                            {exp.titulo}
                          </div>
                          {exp.descripcion && (
                            <div className="text-tiny text-slate-500 dark:text-slate-400 truncate max-w-[300px]" title={exp.descripcion}>
                              {exp.descripcion}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <span className="px-1.5 py-0.5 rounded text-tiny font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                            {exp.tipo_documento}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onView(exp)}
                              title="Ver Documento"
                              className="p-1 rounded text-primary hover:bg-[#0077D4]/10 transition-colors cursor-pointer"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => onDelete(exp)}
                              title="Eliminar Expediente"
                              className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer"
                            >
                              <Trash2 size={14} />
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
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between text-small text-slate-500 dark:text-slate-400">
        <div>
          Mostrando <strong>{filteredExpedientes.length === 0 ? 0 : startRecord}</strong> -{' '}
          <strong>{endRecord}</strong> de <strong>{filteredExpedientes.length}</strong>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage === 1}
            className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface disabled:opacity-40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft size={13} />
          </button>
          
          <span className="px-2 font-semibold">
            Página {safeCurrentPage} de {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage === totalPages}
            className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface disabled:opacity-40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
