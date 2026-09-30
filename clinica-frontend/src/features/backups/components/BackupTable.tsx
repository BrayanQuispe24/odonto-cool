import React, { useState, useMemo } from 'react';
import { Download, RefreshCcw, Trash2, Database, AlertTriangle, X } from 'lucide-react';
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
  const token = localStorage.getItem('token'); // Simplification for download

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
    // Tricky to pass auth token in standard window.open, 
    // Usually download requires passing token via query param or via fetch then blob.
    // We will do fetch + blob for secure download
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
    <div className="bg-white dark:bg-[#002D5E] rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 overflow-hidden transition-all duration-300">
      {/* TOOLBAR */}
      <div className="p-4 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-white dark:bg-[#0840A8]/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar respaldo por nombre..."
            className="w-full px-4 py-2 rounded-xl text-xs font-medium border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#0077D4] dark:text-blue-200/70 hover:text-[#0840A8] dark:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {filteredBackups.length === 0 ? (
        <div className="p-4 bg-[#F4F9FF] dark:bg-[#001C3D]/20">
          <div className="py-12 text-center text-[#0077D4] dark:text-blue-200/70 font-medium bg-white dark:bg-[#002D5E] rounded-xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30">
            No se encontraron copias de seguridad de la base de datos.
          </div>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E5F7FF] dark:bg-[#0840A8]/40 border-b border-[#0840A8]/15 dark:border-[#0840A8]/60 text-[11px] font-extrabold uppercase tracking-wider text-[#0077D4] dark:text-blue-100 select-none">
                  <th className="py-3.5 px-4">NOMBRE DEL ARCHIVO</th>
                  <th className="py-3.5 px-4">TAMAÑO</th>
                  <th className="py-3.5 px-4">FECHA DE CREACIÓN</th>
                  <th className="py-3.5 px-4 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0840A8]/15 dark:divide-[#0840A8]/30 text-xs text-[#0840A8] dark:text-blue-50 font-medium">
                {filteredBackups.map((backup) => (
                  <tr
                    key={backup.filename}
                    className="bg-white dark:bg-[#002D5E] even:bg-slate-50/50 dark:even:bg-[#002247]/60 hover:bg-[#E5F7FF] dark:hover:bg-[#0840A8]/30 transition-colors duration-200"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Database size={16} className="text-[#0077D4] dark:text-[#00C2E0]" />
                        <span className="font-mono font-bold text-[#0840A8] dark:text-white">
                          {backup.filename}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono bg-[#F4F9FF] dark:bg-[#001C3D]/80 px-2.5 py-1 rounded-lg border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-sm text-[#0077D4] dark:text-[#00C2E0] font-bold">
                        {formatBytes(backup.size)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-[#0077D4] dark:text-blue-100">
                      {formatDate(backup.last_modified)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDownload(backup.filename)}
                          title="Descargar Respaldo"
                          className="p-1.5 rounded-lg bg-[#00C2E0]/15 hover:bg-[#00C2E0]/30 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 transition-colors cursor-pointer flex items-center gap-1 px-2"
                        >
                          <Download size={14} />
                          <span className="text-[10px] uppercase font-bold hidden lg:inline">Descargar</span>
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              onClick={() => onRestore(backup)}
                              title="Restaurar este respaldo"
                              className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-600 dark:text-amber-400 border border-amber-500/40 transition-colors cursor-pointer flex items-center gap-1 px-2"
                            >
                              <RefreshCcw size={14} />
                              <span className="text-[10px] uppercase font-bold hidden lg:inline">Restaurar</span>
                            </button>
                            <button
                              onClick={() => onDelete(backup)}
                              title="Eliminar respaldo"
                              className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-500 dark:text-rose-400 border border-rose-500/40 transition-colors cursor-pointer"
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
          <div className="block md:hidden p-4 bg-[#F4F9FF] dark:bg-[#001C3D]/20">
            <div className="grid grid-cols-1 gap-4">
              {filteredBackups.map((backup) => (
                <div
                  key={backup.filename}
                  className="flex flex-col bg-white dark:bg-[#002D5E] rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-lg shadow-[#0077D4]/5 dark:shadow-[#001C3D]/50 hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between p-4 border-b border-[#0840A8]/10 dark:border-[#00C2E0]/20 bg-gradient-to-r from-[#F4F9FF] to-white dark:from-[#001C3D] dark:to-[#002D5E]">
                    <div className="flex items-center gap-2">
                      <Database size={16} className="text-[#0077D4] dark:text-[#00C2E0]" />
                      <span className="text-xs font-bold text-[#0840A8] dark:text-blue-200 break-all">
                        {backup.filename}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1">
                    <div className="mb-3">
                      <div className="text-[10px] font-semibold text-[#0077D4] dark:text-[#00C2E0] uppercase tracking-wider mb-1">
                        Tamaño
                      </div>
                      <span className="font-mono bg-[#F4F9FF] dark:bg-[#001C3D]/80 px-2.5 py-1 rounded-lg border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-sm text-[#0077D4] dark:text-[#00C2E0] font-bold inline-block">
                        {formatBytes(backup.size)}
                      </span>
                    </div>

                    <div className="mb-2">
                      <div className="text-[10px] font-semibold text-[#0077D4] dark:text-[#00C2E0] uppercase tracking-wider mb-1">
                        Fecha de Creación
                      </div>
                      <div className="text-xs font-semibold text-[#0077D4] dark:text-blue-100">
                        {formatDate(backup.last_modified)}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-3 bg-[#0840A8]/5 dark:bg-[#00C2E0]/10 border-t border-[#0840A8]/10 dark:border-[#00C2E0]/20 flex justify-end gap-2">
                    <button
                      onClick={() => handleDownload(backup.filename)}
                      title="Descargar Respaldo"
                      className="flex-1 p-2 rounded-lg bg-[#00C2E0]/15 hover:bg-[#00C2E0]/30 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Download size={14} />
                      <span className="text-[10px] uppercase font-bold">Descargar</span>
                    </button>

                    {isAdmin && (
                      <>
                        <button
                          onClick={() => onRestore(backup)}
                          title="Restaurar este respaldo"
                          className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-600 dark:text-amber-400 border border-amber-500/40 transition-colors cursor-pointer flex items-center justify-center"
                        >
                          <RefreshCcw size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(backup)}
                          title="Eliminar respaldo"
                          className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-500 dark:text-rose-400 border border-rose-500/40 transition-colors cursor-pointer flex items-center justify-center"
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
      
      <div className="p-4 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-white dark:bg-[#0840A8]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#0077D4] dark:text-blue-200/80">
        <div>
          Total de respaldos: <strong>{filteredBackups.length}</strong>
        </div>
      </div>
    </div>
  );
};
