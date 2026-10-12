import React, { useState, useEffect, useMemo } from 'react';
import { Receipt, Plus, AlertTriangle, List, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { BoletasTable } from '../components/BoletasTable';
import { BoletaCreateModal } from '../components/BoletaCreateModal';
import { BoletaDetailsModal } from '../components/BoletaDetailsModal';
import type { BoletaServicioPrestado, BoletaFormData } from '../types/boleta';
import {
  getBoletasApi,
  createBoletaApi,
  deleteBoletaApi,
} from '../services/boletaService';

export const BoletasPage: React.FC = () => {
  const [boletas, setBoletas] = useState<BoletaServicioPrestado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals and Tabs state
  const [mainTab, setMainTab] = useState<'list' | 'form'>('list');
  const [boletaToView, setBoletaToView] = useState<BoletaServicioPrestado | null>(null);
  const [boletaToDelete, setBoletaToDelete] = useState<BoletaServicioPrestado | null>(null);

  const fetchBoletas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBoletasApi();
      setBoletas(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cargar las boletas de servicios prestados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoletas();
  }, []);

  const pendientes = useMemo(
    () => boletas.filter((b) => b.estado === 'pendiente').length,
    [boletas]
  );

  const handleCreateBoleta = async (formData: BoletaFormData) => {
    const newBoleta = await createBoletaApi(formData);
    toast.success(`Boleta Nº ${newBoleta.numero_boleta} emitida exitosamente`);
    await fetchBoletas();
  };

  const handleConfirmDelete = async () => {
    if (!boletaToDelete) return;
    try {
      await deleteBoletaApi(boletaToDelete.id);
      toast.info(`Boleta Nº ${boletaToDelete.numero_boleta} eliminada`);
      setBoletaToDelete(null);
      await fetchBoletas();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al eliminar la boleta');
    }
  };

  const tabClass = (active: boolean) =>
    `whitespace-nowrap px-4 py-2 text-small font-bold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
      active
        ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
        : 'border-transparent text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-secondary'
    }`;

  return (
    <div className="space-y-4 pb-12">
      {/* TABS NAVIGATION BAR & ACTIONS */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-4">
        <div className="flex overflow-x-auto">
          <button id="boletas-tab-list" onClick={() => setMainTab('list')} className={tabClass(mainTab === 'list')}>
            <List size={14} />
            <span>Listado de Boletas ({boletas.length})</span>
            {pendientes > 0 && (
              <span className="px-1.5 py-0.5 rounded text-micro font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                {pendientes} PEND.
              </span>
            )}
          </button>
          <button id="boletas-tab-form" onClick={() => setMainTab('form')} className={tabClass(mainTab === 'form')}>
            <Receipt size={14} />
            <span>Emitir Nueva Boleta</span>
          </button>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-3 rounded-sm bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-small font-bold flex items-center gap-2 shadow-sm">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* CONTENT AREA */}
      {mainTab === 'list' &&
        (loading ? (
          <div className="py-12 text-center text-small font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center gap-2">
            <Sparkles className="animate-spin text-primary" size={20} />
            <span>Cargando registro de boletas de venta...</span>
          </div>
        ) : (
          <BoletasTable
            boletas={boletas}
            onView={(b) => setBoletaToView(b)}
            onDelete={(b) => setBoletaToDelete(b)}
            onCreate={() => setMainTab('form')}
          />
        ))}

      {mainTab === 'form' && (
        <BoletaCreateModal
          isModal={false}
          onCancel={() => setMainTab('list')}
          onSubmit={async (data) => {
            await handleCreateBoleta(data);
            setMainTab('list');
          }}
        />
      )}

      {/* VIEW & PRINT BOLETA DETAILS MODAL */}
      <BoletaDetailsModal
        isOpen={!!boletaToView}
        onClose={() => setBoletaToView(null)}
        boleta={boletaToView}
        onBoletaUpdated={(updated) => {
          setBoletaToView(updated);
          fetchBoletas();
        }}
      />

      {/* DELETE CONFIRMATION MODAL */}
      {boletaToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl p-4 w-full max-w-sm text-slate-700 dark:text-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle size={20} />
              <span>Eliminar Boleta de Venta</span>
            </div>
            <p className="text-small text-slate-600 dark:text-slate-300">
              ¿Estás seguro de que deseas eliminar la boleta Nº{' '}
              <strong className="font-mono text-primary-dark dark:text-white">{boletaToDelete.numero_boleta}</strong> por{' '}
              <strong className="font-mono text-primary-dark dark:text-white">
                Bs. {Number(boletaToDelete.monto_total).toFixed(2)}
              </strong>
              ? Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setBoletaToDelete(null)}
                className="px-3 py-1.5 rounded bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-small font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-small font-bold shadow-sm transition-colors cursor-pointer"
              >
                Eliminar Boleta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
