import React, { useState, useEffect, useMemo } from 'react';
import {
  Receipt,
  Plus,
  AlertCircle,
  Trash2,
  DollarSign,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
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

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [boletaToView, setBoletaToView] = useState<BoletaServicioPrestado | null>(null);
  const [boletaToDelete, setBoletaToDelete] = useState<BoletaServicioPrestado | null>(null);

  const fetchBoletas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBoletasApi();
      setBoletas(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cargar las boletas de servicios prestados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoletas();
  }, []);

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
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al eliminar la boleta');
    }
  };

  // Metrics calculation
  const totalBoletas = boletas.length;
  const totalMontoRecaudado = useMemo(() => {
    return boletas.reduce((acc, b) => acc + Number(b.monto_total || 0), 0);
  }, [boletas]);

  const boletasPagadas = useMemo(() => {
    return boletas.filter((b) => b.estado === 'pagada').length;
  }, [boletas]);

  const boletasEnCuotas = useMemo(() => {
    return boletas.filter((b) => b.tipo_paga === 'Cuotas' || b.cantidad_cuotas > 1).length;
  }, [boletas]);

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#002D5E] p-6 rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-lg shadow-sm dark:shadow-[#001C3D]/50">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#0840A8] dark:text-white flex items-center gap-2">
            <Receipt className="text-[#0077D4] dark:text-[#00C2E0]" size={26} />
            Boletas de Servicios Prestados (Ventas)
          </h1>
          <p className="text-xs text-[#0077D4] dark:text-blue-200/80 mt-1">
            Registro de venta de tratamientos prestados, emisión de comprobantes, relacionamiento con doctor y plan de cuotas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-[#0077D4]/30 cursor-pointer transition-all flex items-center gap-2 shrink-0 bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#0840A8] hover:to-[#0077D4] text-white"
          >
            <Plus size={16} />
            <span>Emitir Nueva Boleta</span>
          </button>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* METRICS SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#002D5E] p-4 rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/30 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-[#0077D4]/20 text-[#0077D4] dark:text-[#00C2E0]">
            <Receipt size={20} />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-[#0077D4] dark:text-blue-200/80">Total Boletas</div>
            <div className="text-lg font-bold text-[#0840A8] dark:text-white font-mono">{totalBoletas}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#002D5E] p-4 rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/30 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-[#0077D4]/20 text-emerald-600 dark:text-emerald-400">
            <DollarSign size={20} />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-[#0077D4] dark:text-blue-200/80">Monto Total Vendas</div>
            <div className="text-lg font-bold text-[#0840A8] dark:text-white font-mono">Bs. {totalMontoRecaudado.toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#002D5E] p-4 rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/30 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-[#0077D4]/20 text-cyan-400">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-[#0077D4] dark:text-blue-200/80">Boletas Pagadas</div>
            <div className="text-lg font-bold text-[#0840A8] dark:text-white font-mono">{boletasPagadas}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#002D5E] p-4 rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/30 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-[#0077D4]/20 text-amber-600 dark:text-amber-300">
            <CreditCard size={20} />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-[#0077D4] dark:text-blue-200/80">Planes en Cuotas</div>
            <div className="text-lg font-bold text-[#0840A8] dark:text-white font-mono">{boletasEnCuotas}</div>
          </div>
        </div>
      </div>

      {/* TABLE CONTENT */}
      {loading ? (
        <div className="p-12 text-center text-[#0077D4] dark:text-blue-200/80 text-sm font-medium">
          Cargando registro de boletas de venta...
        </div>
      ) : (
        <BoletasTable
          boletas={boletas}
          onView={(b) => setBoletaToView(b)}
          onDelete={(b) => setBoletaToDelete(b)}
        />
      )}

      {/* CREATE BOLETA MODAL */}
      <BoletaCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBoleta}
      />

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#002D5E] border border-rose-500/40 rounded-2xl shadow-2xl shadow-[#001C3D]/80 w-full max-w-md p-6 text-[#0840A8] dark:text-white space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0840A8] dark:text-white">Eliminar Boleta de Venta</h3>
                <p className="text-xs text-[#0077D4] dark:text-blue-200/70">Esta acción no se puede deshacer.</p>
              </div>
            </div>

            <p className="text-xs text-[#0077D4] dark:text-blue-100">
              ¿Estás seguro de que deseas eliminar la boleta Nº{' '}
              <strong className="text-[#0840A8] dark:text-white font-bold">{boletaToDelete.numero_boleta}</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50">
              <button
                type="button"
                onClick={() => setBoletaToDelete(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white border border-white/10 text-xs font-semibold cursor-pointer transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-[#0840A8] dark:text-white text-xs font-bold shadow-md shadow-rose-900/50 cursor-pointer transition-all"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
