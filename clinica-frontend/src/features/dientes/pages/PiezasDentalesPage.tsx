import React, { useState, useEffect } from 'react';
import { Plus, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { Diente, DienteFormData } from '../types/diente';
import {
  getDientesApi,
  createDienteApi,
  updateDienteApi,
  deleteDienteApi,
} from '../services/dienteService';
import { DienteTable } from '../components/DienteTable';
import { DienteFormPanel } from '../components/DienteFormPanel';
import { useAuthStore } from '../../auth/store/authStore';

export const PiezasDentalesPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.rol?.nombre === 'Administrador';

  const [dientes, setDientes] = useState<Diente[]>([]);
  const [loadingDientes, setLoadingDientes] = useState(true);
  
  // Navigation state
  const [mainTab, setMainTab] = useState<'list' | 'form'>('list');
  const [selectedDiente, setSelectedDiente] = useState<Diente | null>(null);
  const [dienteToDelete, setDienteToDelete] = useState<Diente | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchDientes = async () => {
    setLoadingDientes(true);
    try {
      const data = await getDientesApi();
      setDientes(data);
      setError(null);
    } catch {
      setError('Error al cargar el directorio de piezas dentales.');
    } finally {
      setLoadingDientes(false);
    }
  };

  useEffect(() => {
    fetchDientes();
  }, []);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleCreateOrUpdateDiente = async (formData: DienteFormData) => {
    try {
      if (selectedDiente) {
        await updateDienteApi(selectedDiente.id, formData);
        showNotification('Pieza dental actualizada correctamente.');
      } else {
        await createDienteApi(formData);
        showNotification('Nueva pieza dental registrada exitosamente.');
      }
      setMainTab('list');
      setSelectedDiente(null);
      fetchDientes();
    } catch (err: any) {
      throw err;
    }
  };

  const handleDeleteDiente = async () => {
    if (!dienteToDelete) return;
    try {
      await deleteDienteApi(dienteToDelete.id);
      showNotification('Pieza dental eliminada correctamente.');
      setDienteToDelete(null);
      if (selectedDiente?.id === dienteToDelete.id) {
        setSelectedDiente(null);
      }
      fetchDientes();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al eliminar la pieza dental.');
    }
  };

  const totalDientes = dientes.length;

  return (
    <div className="space-y-4 pb-12">
      {/* NOTIFICATIONS */}
      {successMsg && (
        <div className="p-3 rounded-sm bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 text-primary dark:text-secondary text-small font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-sm bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-small font-bold flex items-center gap-2 shadow-sm">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
        <button
          onClick={() => setMainTab('list')}
          className={`px-4 py-2 text-small font-semibold border-b-2 transition-all cursor-pointer ${
            mainTab === 'list'
              ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary'
          }`}
        >
          Listado de Piezas Dentales
        </button>
        {isAdmin && (
          <button
            onClick={() => {
              setSelectedDiente(null);
              setMainTab('form');
            }}
            className={`px-4 py-2 text-small font-semibold border-b-2 transition-all cursor-pointer ${
              mainTab === 'form'
                ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary'
            }`}
          >
            Registrar Nueva Pieza
          </button>
        )}
      </div>

      {/* TAB CONTENT */}
      {loadingDientes ? (
        <div className="py-12 text-center text-small font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center gap-2">
          <Activity className="animate-spin text-primary" size={20} />
          <span>Cargando directorio de piezas dentales...</span>
        </div>
      ) : mainTab === 'list' ? (
        <div className="w-full animate-fade-in">
          <DienteTable
            dientes={dientes}
            onEdit={isAdmin ? (d) => {
              setSelectedDiente(d);
              setMainTab('form');
            } : undefined}
            onDelete={isAdmin ? (d) => {
              setDienteToDelete(d);
            } : undefined}
          />
        </div>
      ) : mainTab === 'form' ? (
        <div className="w-full lg:w-3/5 mx-auto animate-fade-in">
          <DienteFormPanel
            onSubmit={handleCreateOrUpdateDiente}
            diente={selectedDiente}
            onCancelEdit={() => {
              setSelectedDiente(null);
              setMainTab('list');
            }}
          />
        </div>
      ) : null}

      {/* DELETE CONFIRMATION MODAL */}
      {dienteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl p-4 w-full max-w-sm text-slate-700 dark:text-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle size={20} />
              <span>Eliminar Pieza Dental</span>
            </div>
            <p className="text-small text-slate-600 dark:text-slate-300">
              ¿Estás seguro de que deseas eliminar la pieza dental FDI Nº{' '}
              <strong className="text-primary-dark dark:text-white">{dienteToDelete.numero_diente}</strong> ({dienteToDelete.nombre})? Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setDienteToDelete(null)}
                className="px-3 py-1.5 rounded bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-small font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteDiente}
                className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-small font-bold shadow-sm transition-colors"
              >
                Eliminar Pieza
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
