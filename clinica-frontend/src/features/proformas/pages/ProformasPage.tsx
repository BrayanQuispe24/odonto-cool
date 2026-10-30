import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calculator,
  List,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Proforma, ProformaFormData } from '../types/proforma';
import {
  getProformasApi,
  createProformaApi,
  deleteProformaApi,
} from '../services/proformaService';
import { ProformasTable } from '../components/ProformasTable';
import { ProformaFormPanel } from '../components/ProformaFormPanel';
import { ProformaDetailsModal } from '../components/ProformaDetailsModal';
import { ProformaAprobarModal } from '../components/ProformaAprobarModal';
import { ProformaPDFViewerModal } from '../components/ProformaPDFViewerModal';

export const ProformasPage: React.FC = () => {
  const navigate = useNavigate();

  const [proformas, setProformas] = useState<Proforma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tabs state
  const [mainTab, setMainTab] = useState<'list' | 'form'>('list');

  // Modals state
  const [proformaToView, setProformaToView] = useState<Proforma | null>(null);
  const [proformaToPdf, setProformaToPdf] = useState<Proforma | null>(null);
  const [proformaToAprobar, setProformaToAprobar] = useState<Proforma | null>(null);
  const [proformaToDelete, setProformaToDelete] = useState<Proforma | null>(null);

  const fetchProformas = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getProformasApi();
      setProformas(list);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cargar los presupuestos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProformas();
  }, []);

  const borradoresCount = useMemo(() => {
    return proformas.filter((p) => p.estado === 'Borrador').length;
  }, [proformas]);

  const aprobadasCount = useMemo(() => {
    return proformas.filter((p) => p.estado === 'Aprobado').length;
  }, [proformas]);

  const handleCreateProforma = async (formData: ProformaFormData) => {
    const newProforma = await createProformaApi(formData);
    toast.success(`Presupuesto Nº ${newProforma.codigo_proforma} generado exitosamente en Borrador.`);
    await fetchProformas();
    setMainTab('list');
    setProformaToView(newProforma);
  };

  const handleConfirmDelete = async () => {
    if (!proformaToDelete) return;
    try {
      await deleteProformaApi(proformaToDelete.id);
      toast.info(`Presupuesto ${proformaToDelete.codigo_proforma} eliminado.`);
      setProformaToDelete(null);
      await fetchProformas();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al eliminar el presupuesto.');
    }
  };

  const handleFacturarProforma = (proforma: Proforma) => {
    if (proforma.estado !== 'Aprobado') {
      toast.warning('Solo las proformas en estado Aprobado pueden facturarse.');
      return;
    }
    // Redirige a facturación con state
    navigate('/dashboard/billing', {
      state: {
        fromProforma: true,
        proforma,
      },
    });
  };

  const handleAgendarCitaFromProforma = (proforma: Proforma) => {
    navigate('/dashboard/appointments', {
      state: {
        fromProforma: true,
        pacienteId: proforma.paciente_id,
        doctorId: proforma.doctor_id,
        sucursalId: proforma.sucursal_id,
        proformaCodigo: proforma.codigo_proforma,
      },
    });
  };

  const tabClass = (active: boolean) =>
    `whitespace-nowrap px-4 py-2 text-small font-bold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
      active
        ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
        : 'border-transparent text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-secondary'
    }`;

  return (
    <div className="space-y-4 pb-12">
      {/* TABS HEADER */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-4">
        <div className="flex overflow-x-auto">
          <button
            id="proformas-tab-list"
            onClick={() => setMainTab('list')}
            className={tabClass(mainTab === 'list')}
          >
            <List size={14} />
            <span>Listado de Proformas ({proformas.length})</span>
            {borradoresCount > 0 && (
              <span className="px-1.5 py-0.5 rounded text-micro font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                {borradoresCount} BORRADOR
              </span>
            )}
            {aprobadasCount > 0 && (
              <span className="px-1.5 py-0.5 rounded text-micro font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {aprobadasCount} APROBADAS
              </span>
            )}
          </button>

          <button
            id="proformas-tab-form"
            onClick={() => setMainTab('form')}
            className={tabClass(mainTab === 'form')}
          >
            <Calculator size={14} />
            <span>Emitir Nueva Proforma</span>
          </button>
        </div>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="p-3 rounded-sm bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-small font-bold flex items-center gap-2 shadow-sm">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* MAIN CONTENT */}
      {mainTab === 'list' &&
        (loading ? (
          <div className="py-12 text-center text-small font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center gap-2">
            <Sparkles className="animate-spin text-primary" size={20} />
            <span>Cargando presupuestos y proformas...</span>
          </div>
        ) : (
          <ProformasTable
            proformas={proformas}
            onView={(p) => setProformaToView(p)}
            onPrintPdf={(p) => setProformaToPdf(p)}
            onOpenAprobarModal={(p) => setProformaToAprobar(p)}
            onFacturar={handleFacturarProforma}
            onDelete={(p) => setProformaToDelete(p)}
          />
        ))}

      {mainTab === 'form' && (
        <ProformaFormPanel
          onCancel={() => setMainTab('list')}
          onSubmit={handleCreateProforma}
        />
      )}

      {/* DETALLES MODAL */}
      <ProformaDetailsModal
        isOpen={!!proformaToView}
        onClose={() => setProformaToView(null)}
        proforma={proformaToView}
        onOpenPdf={(p) => {
          setProformaToView(null);
          setProformaToPdf(p);
        }}
        onOpenAprobarModal={(p) => {
          setProformaToView(null);
          setProformaToAprobar(p);
        }}
        onFacturar={handleFacturarProforma}
      />

      {/* APROBAR / GESTIONAR DECISIÓN MODAL */}
      <ProformaAprobarModal
        isOpen={!!proformaToAprobar}
        onClose={() => setProformaToAprobar(null)}
        proforma={proformaToAprobar}
        onProformaActualizada={(updated) => {
          fetchProformas();
          setProformaToView(updated);
        }}
        onAgendarCita={handleAgendarCitaFromProforma}
        onFacturarDirecto={handleFacturarProforma}
      />

      {/* PDF VIEWER MODAL */}
      <ProformaPDFViewerModal
        isOpen={!!proformaToPdf}
        onClose={() => setProformaToPdf(null)}
        proforma={proformaToPdf}
      />

      {/* ELIMINAR CONFIRMACIÓN MODAL */}
      {proformaToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl p-4 w-full max-w-sm text-slate-700 dark:text-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle size={20} />
              <span>Eliminar Presupuesto</span>
            </div>
            <p className="text-small text-slate-600 dark:text-slate-300">
              ¿Estás seguro de que deseas eliminar la cotización Nº{' '}
              <strong className="font-mono text-primary-dark dark:text-white">
                {proformaToDelete.codigo_proforma}
              </strong>{' '}
              para{' '}
              <strong>
                {proformaToDelete.nombre} {proformaToDelete.apellido}
              </strong>{' '}
              por{' '}
              <strong className="font-mono text-primary-dark dark:text-white">
                Bs. {Number(proformaToDelete.monto_total).toFixed(2)}
              </strong>
              ? Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setProformaToDelete(null)}
                className="px-3 py-1.5 rounded bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-small font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-small font-bold shadow-sm transition-colors cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
