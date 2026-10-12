import React, { useState, useMemo } from 'react';
import { Download, RefreshCcw, Trash2, Database, X } from 'lucide-react';
import type { Backup } from '../types/backup';
import { useAuthStore } from '../../auth/store/authStore';

interface BackupTableProps {
  backups: Backup[];
  onRestore: (backup: Backup) => void;
  onDelete: (backup: Backup) => void;
}

export const BackupTable: React.FC<BackupTableProps> = ({
  backups,
  onRestore,
  onDelete,
}) => {
  const { user } = useAuthStore();
  const isAdmin = user?.rol?.nombre === 'Administrador';
  const token = localStorage.getItem('token'); 

  const [searchTerm, setSearchTerm] = useState('');

  const filteredBackups = useMemo(() => {
    return backups.filter((b) => 
      b.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [backups, searchTerm]);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const handleDownload = (filename: string) => {
    const url = `${import.meta.env.VITE_API_URL}/api/backups/download/${filename}`;
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a); 
      a.click();
      a.remove();
    })
    .catch(console.error);
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
      {/* TOOLBAR */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-surface flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar respaldo por nombre..."
            className="w-full px-3 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {filteredBackups.length === 0 ? (
        <div className="p-4 bg-slate-50 dark:bg-dark-bg/20">
          <div className="py-12 text-center text-slate-500 font-medium bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800">
            No se encontraron copias de seguridad de la base de datos.
          </div>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 select-none">
                  <th className="py-3 px-4">NOMBRE DEL ARCHIVO</th>
                  <th className="py-3 px-4">TAMAÑO</th>
                  <th className="py-3 px-4">FECHA DE CREACIÓN</th>
                  <th className="py-3 px-4 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-small text-slate-700 dark:text-slate-300 font-medium">
                {filteredBackups.map((backup) => (
                  <tr
                    key={backup.filename}
                    className="bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-dark-bg/50 transition-colors duration-200"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Database size={16} className="text-primary dark:text-secondary" />
                        <span className="font-mono font-bold text-primary-dark dark:text-white">
                          {backup.filename}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-tiny font-bold">
                        {formatBytes(backup.size)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {formatDate(backup.last_modified)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDownload(backup.filename)}
                          title="Descargar Respaldo"
                          className="p-1.5 rounded-sm bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 transition-colors cursor-pointer flex items-center gap-1 px-2"
                        >
                          <Download size={14} />
                          <span className="text-tiny uppercase font-bold hidden lg:inline">Descargar</span>
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              onClick={() => onRestore(backup)}
                              title="Restaurar este respaldo"
                              className="p-1.5 rounded-sm bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 transition-colors cursor-pointer flex items-center gap-1 px-2"
                            >
                              <RefreshCcw size={14} />
                              <span className="text-tiny uppercase font-bold hidden lg:inline">Restaurar</span>
                            </button>
                            <button
                              onClick={() => onDelete(backup)}
                              title="Eliminar respaldo"
                              className="p-1.5 rounded-sm bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 transition-colors cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS VIEW */}
          <div className="block md:hidden p-4 bg-slate-50 dark:bg-slate-900">
            <div className="grid grid-cols-1 gap-4">
              {filteredBackups.map((backup) => (
                <div
                  key={backup.filename}
                  className="flex flex-col bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg">
                    <div className="flex items-center gap-2">
                      <Database size={16} className="text-primary dark:text-secondary" />
                      <span className="text-xs font-bold text-primary-dark dark:text-white break-all">
                        {backup.filename}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1">
                    <div className="mb-3">
                      <div className="text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        Tamaño
                      </div>
                      <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-tiny font-bold inline-block">
                        {formatBytes(backup.size)}
                      </span>
                    </div>

                    <div className="mb-2">
                      <div className="text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        Fecha de Creación
                      </div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {formatDate(backup.last_modified)}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-3 bg-slate-50 dark:bg-dark-bg border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                    <button
                      onClick={() => handleDownload(backup.filename)}
                      title="Descargar Respaldo"
                      className="flex-1 p-2 rounded-sm bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Download size={14} />
                      <span className="text-tiny uppercase font-bold">Descargar</span>
                    </button>

                    {isAdmin && (
                      <>
                        <button
                          onClick={() => onRestore(backup)}
                          title="Restaurar este respaldo"
                          className="p-2 rounded-sm bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 transition-colors cursor-pointer flex items-center justify-center"
                        >
                          <RefreshCcw size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(backup)}
                          title="Eliminar respaldo"
                          className="p-2 rounded-sm bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 transition-colors cursor-pointer flex items-center justify-center"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div>
          Total de respaldos: <strong>{filteredBackups.length}</strong>
        </div>
      </div>
    </div>
  );
};
