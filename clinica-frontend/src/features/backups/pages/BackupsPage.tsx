import React, { useEffect, useState, useRef } from 'react';
import { Database, Plus, ShieldAlert, CheckCircle2, AlertTriangle, AlertOctagon, UploadCloud } from 'lucide-react';
import { BackupTable } from '../components/BackupTable';
import type { Backup } from '../types/backup';
import { getBackupsApi, createBackupApi, deleteBackupApi, restoreBackupApi, uploadBackupApi } from '../services/backupService';
import { useAuthStore } from '../../auth/store/authStore';

export const BackupsPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.rol?.nombre === 'Administrador';

  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isCreating, setIsCreating] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  
  const [backupToDelete, setBackupToDelete] = useState<Backup | null>(null);
  const [backupToRestore, setBackupToRestore] = useState<Backup | null>(null);
  const [confirmRestoreName, setConfirmRestoreName] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      const data = await getBackupsApi();
      setBackups(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los respaldos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateBackup = async () => {
    if (!isAdmin) return;
    try {
      setIsCreating(true);
      await createBackupApi();
      await fetchBackups();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al crear respaldo');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !isAdmin) return;
    
    try {
      setIsUploading(true);
      await uploadBackupApi(file);
      await fetchBackups();
      alert('Respaldo cargado correctamente.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al cargar respaldo');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteBackup = async () => {
    if (!backupToDelete || !isAdmin) return;
    try {
      await deleteBackupApi(backupToDelete.filename);
      await fetchBackups();
      setBackupToDelete(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar respaldo');
    }
  };

  const handleRestoreBackup = async () => {
    if (!backupToRestore || !isAdmin) return;
    if (confirmRestoreName !== backupToRestore.filename) {
      alert('El nombre del archivo no coincide. Restauración abortada por seguridad.');
      return;
    }
    
    try {
      setIsRestoring(true);
      await restoreBackupApi(backupToRestore.filename);
      alert('Respaldo restaurado exitosamente.');
      window.location.reload(); // Refresh fully to load restored data
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error crítico al restaurar respaldo');
      setIsRestoring(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-8">
        <ShieldAlert size={64} className="text-rose-500 mb-4 animate-pulse" />
        <h2 className="text-2xl font-black text-primary-dark dark:text-white mb-2">Acceso Denegado</h2>
        <p className="text-primary dark:text-blue-200/80 max-w-md">
          Este módulo de sistema está estrictamente reservado para usuarios con rol de Administrador.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 bg-white dark:bg-dark-surface p-5 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-primary-dark dark:text-white flex items-center gap-2">
              <Database className="text-primary dark:text-secondary" size={22} />
              Respaldos de Sistema
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Genera, descarga y restaura copias de seguridad de tu base de datos clínica.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input 
              type="file" 
              accept=".sql" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleUploadFile} 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-small font-semibold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {isUploading ? (
                <div className="animate-spin w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full" />
              ) : (
                <UploadCloud size={16} />
              )}
              {isUploading ? 'Subiendo...' : 'Subir Respaldo'}
            </button>
            <button
              onClick={handleCreateBackup}
              disabled={isCreating}
              className="px-4 py-1.5 rounded-sm bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-semibold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {isCreating ? (
                <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <Plus size={16} />
              )}
              {isCreating ? 'Generando...' : 'Crear Respaldo'}
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-medium">
          {error}
        </div>
      ) : loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-secondary/30 border-t-[#00C2E0] rounded-full mx-auto mb-4"></div>
          <p className="text-primary dark:text-blue-200/80 font-semibold animate-pulse">Cargando respaldos...</p>
        </div>
      ) : (
        <BackupTable 
          backups={backups} 
          onDelete={setBackupToDelete}
          onRestore={setBackupToRestore}
        />
      )}

      {/* Delete Modal */}
      {backupToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-sm bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-small font-bold uppercase tracking-wider text-primary-dark dark:text-white">
                  ¿Eliminar Respaldo?
                </h3>
              </div>
            </div>

            <div className="p-5">
              <p className="text-small text-slate-700 dark:text-slate-300 mb-3">
                Estás a punto de eliminar permanentemente el archivo:
              </p>
              <p className="text-xs font-mono bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-200 p-2 border border-slate-200 dark:border-slate-700 rounded-sm break-all font-bold">
                {backupToDelete.filename}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-dark-bg border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setBackupToDelete(null)}
                className="px-4 py-1.5 rounded-sm bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-small font-semibold transition-colors cursor-pointer shadow-sm"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteBackup}
                className="px-4 py-1.5 rounded-sm bg-rose-600 hover:bg-rose-700 text-white text-small font-semibold transition-colors cursor-pointer shadow-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Modal */}
      {backupToRestore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dark-surface border border-rose-500 rounded-sm shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-5 border-b border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 flex items-center gap-3">
              <div className="p-2 rounded-sm bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
                <AlertOctagon size={20} />
              </div>
              <div>
                <h3 className="text-small font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                  Advertencia Crítica de Restauración
                </h3>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-small text-slate-800 dark:text-slate-200 font-bold mb-4">
                Estás a punto de sobreescribir toda la base de datos con el archivo de respaldo seleccionado.
              </p>
              
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 rounded-sm mb-6">
                <p className="text-xs text-amber-800 dark:text-amber-400 font-semibold leading-relaxed">
                  ⚠️ <span className="font-bold">PELIGRO DE PÉRDIDA DE DATOS:</span> Cualquier paciente, cita, boleta o pago registrado después de que se generó este respaldo se perderá para siempre. Esta acción desconectará a los usuarios.
                </p>
              </div>

              <div className="mb-2">
                <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Escribe el nombre del archivo para confirmar:
                </label>
                <div className="text-xs font-mono bg-slate-50 dark:bg-dark-bg text-slate-600 dark:text-slate-400 p-2 border border-slate-200 dark:border-slate-700 rounded-sm break-all font-bold select-all mb-2">
                  {backupToRestore.filename}
                </div>
                <input 
                  type="text" 
                  value={confirmRestoreName}
                  onChange={(e) => setConfirmRestoreName(e.target.value)}
                  placeholder="Pega el nombre exacto aquí..."
                  className="w-full px-2.5 py-2 rounded-sm text-small font-medium border border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-white dark:bg-dark-surface text-primary-dark dark:text-white transition-colors outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-dark-bg border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setBackupToRestore(null);
                  setConfirmRestoreName('');
                }}
                className="w-full sm:w-auto px-4 py-1.5 rounded-sm bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-small font-semibold transition-colors cursor-pointer shadow-sm"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRestoreBackup}
                disabled={confirmRestoreName !== backupToRestore.filename || isRestoring}
                className="w-full sm:w-auto px-4 py-1.5 rounded-sm bg-rose-600 hover:bg-rose-700 text-white text-small font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isRestoring && <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />}
                {isRestoring ? 'Restaurando...' : 'Sí, Restaurar Ahora'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
