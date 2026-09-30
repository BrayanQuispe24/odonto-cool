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
        <h2 className="text-2xl font-black text-[#0840A8] dark:text-white mb-2">Acceso Denegado</h2>
        <p className="text-[#0077D4] dark:text-blue-200/80 max-w-md">
          Este módulo de sistema está estrictamente reservado para usuarios con rol de Administrador.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-[#002D5E] p-6 rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-xl shadow-[#0077D4]/5 dark:shadow-[#001C3D]/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#00C2E0]/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0840A8] to-[#0077D4] flex items-center justify-center shadow-lg shadow-[#0077D4]/40 text-white">
              <Database size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-[#0840A8] dark:text-white tracking-tight flex items-center gap-2">
                Respaldos de Sistema
              </h1>
              <p className="text-sm font-medium text-[#0077D4] dark:text-[#00C2E0]/80 mt-1">
                Genera, descarga y restaura copias de seguridad de tu base de datos clínica.
              </p>
            </div>
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
              className="group relative px-6 py-3 rounded-xl overflow-hidden font-bold text-sm text-[#0077D4] dark:text-[#00C2E0] bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 hover:bg-[#E5F7FF] dark:hover:bg-[#0840A8]/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              <div className="relative flex items-center justify-center gap-2">
                {isUploading ? (
                  <div className="animate-spin w-5 h-5 border-2 border-[#0077D4]/30 border-t-[#0077D4] rounded-full" />
                ) : (
                  <UploadCloud size={18} className="group-hover:-translate-y-1 transition-transform duration-300" />
                )}
                {isUploading ? 'Subiendo...' : 'Subir Respaldo'}
              </div>
            </button>
            <button
              onClick={handleCreateBackup}
              disabled={isCreating}
              className="group relative px-6 py-3 rounded-xl overflow-hidden font-bold text-sm text-white shadow-lg shadow-[#0077D4]/30 hover:shadow-xl hover:shadow-[#00C2E0]/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0077D4] to-[#00C2E0] transition-transform duration-300 group-hover:scale-105"></div>
              <div className="relative flex items-center justify-center gap-2">
                {isCreating ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                )}
                {isCreating ? 'Generando...' : 'Crear Respaldo'}
              </div>
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
          <div className="animate-spin w-10 h-10 border-4 border-[#00C2E0]/30 border-t-[#00C2E0] rounded-full mx-auto mb-4"></div>
          <p className="text-[#0077D4] dark:text-blue-200/80 font-semibold animate-pulse">Cargando respaldos...</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#002D5E] border border-rose-200 dark:border-rose-900/50 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden text-[#0840A8] dark:text-white">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mx-auto mb-4 text-rose-600 dark:text-rose-400">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-black text-[#0840A8] dark:text-white mb-2">
                ¿Eliminar Respaldo?
              </h3>
              <p className="text-sm text-[#0077D4] dark:text-blue-200/80 font-medium mb-1">
                Estás a punto de eliminar permanentemente el archivo:
              </p>
              <p className="text-xs font-mono bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-300 p-2 rounded-lg break-all">
                {backupToDelete.filename}
              </p>
              
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setBackupToDelete(null)}
                  className="flex-1 px-4 py-2 rounded-xl text-sm font-bold bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0077D4] dark:text-blue-100 border border-[#0840A8]/15 dark:border-[#0077D4]/40 hover:bg-[#E5F7FF] dark:hover:bg-[#0840A8]/30 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteBackup}
                  className="flex-1 px-4 py-2 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restore Modal */}
      {backupToRestore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#002D5E] border-2 border-rose-500 rounded-2xl shadow-[0_0_50px_-12px_rgba(244,63,94,0.5)] w-full max-w-lg overflow-hidden flex flex-col">
            <div className="bg-rose-600 p-5 flex items-center justify-center gap-3 text-white">
              <AlertOctagon size={28} className="animate-pulse" />
              <h3 className="text-xl font-black uppercase tracking-widest">Advertencia Crítica</h3>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-[#0840A8] dark:text-blue-100 font-bold mb-4 text-center">
                Estás a punto de sobreescribir toda la base de datos con el archivo de respaldo seleccionado.
              </p>
              
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 rounded-xl mb-6">
                <p className="text-xs text-amber-800 dark:text-amber-400 font-semibold leading-relaxed">
                  ⚠️ <span className="font-bold">PELIGRO DE PÉRDIDA DE DATOS:</span> Cualquier paciente, cita, boleta o pago registrado después de que se generó este respaldo <span className="underline">SE PERDERÁ PARA SIEMPRE</span>. 
                  Esta acción desconectará a los usuarios y detendrá temporalmente el sistema.
                </p>
              </div>

              <div className="mb-6 text-center">
                <p className="text-xs text-[#0077D4] dark:text-blue-200/70 font-semibold mb-2">Para confirmar la restauración, escribe el nombre del archivo exactamente:</p>
                <p className="text-xs font-mono bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-[#00C2E0] p-2 rounded-lg break-all border border-[#0840A8]/15 dark:border-[#0077D4]/40 font-bold select-all inline-block mb-3">
                  {backupToRestore.filename}
                </p>
                <input 
                  type="text" 
                  value={confirmRestoreName}
                  onChange={(e) => setConfirmRestoreName(e.target.value)}
                  placeholder="Pega el nombre del archivo aquí..."
                  className="w-full text-center px-4 py-3 rounded-xl text-sm font-mono border-2 border-rose-200 focus:border-rose-500 bg-white dark:bg-[#001C3D] text-[#0840A8] dark:text-white outline-none transition-all"
                />
              </div>

              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => {
                    setBackupToRestore(null);
                    setConfirmRestoreName('');
                  }}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white border border-[#0840A8]/15 dark:border-[#00C2E0]/30 hover:bg-[#E5F7FF] dark:hover:bg-[#0840A8]/30 transition-colors"
                >
                  ABORTAR ACCIÓN
                </button>
                <button
                  onClick={handleRestoreBackup}
                  disabled={confirmRestoreName !== backupToRestore.filename || isRestoring}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-black bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isRestoring ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <RefreshCcw size={16} />
                  )}
                  {isRestoring ? 'RESTAURANDO...' : 'SÍ, RESTAURAR AHORA'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
