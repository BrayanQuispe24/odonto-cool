import React, { useEffect, useState, useCallback } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../../auth/store/authStore';
import type { ReporteFiltros, ReporteFinancieroResponse } from '../types/reporteTypes';
import { getReporteFinancieroApi } from '../services/reporteService';
import { ReporteFiltersToolbar } from '../components/ReporteFiltersToolbar';
import { ReporteSummaryCards } from '../components/ReporteSummaryCards';
import { ReporteDoctoresTable } from '../components/ReporteDoctoresTable';
import { ReporteSucursalesTable } from '../components/ReporteSucursalesTable';
import { ReporteBoletasTable } from '../components/ReporteBoletasTable';
import { BoletaDetailsModal } from '../../boletas/components/BoletaDetailsModal';
import type { BoletaServicioPrestado } from '../../boletas/types/boleta';

export const ReportesPage: React.FC = () => {
  const { user } = useAuthStore();
  const isDoctorRole = user?.rol?.nombre === 'Doctor';

  const [filtros, setFiltros] = useState<ReporteFiltros>({
    fecha_inicio: '',
    fecha_fin: '',
    sucursal_id: '',
    doctor_id: '',
    tipo_pago: '',
    metodo_pago: '',
    estado: '',
  });

  const [reporteData, setReporteData] = useState<ReporteFinancieroResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBoleta, setSelectedBoleta] = useState<BoletaServicioPrestado | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  const fetchReporte = useCallback(async (currentFiltros: ReporteFiltros) => {
    setLoading(true);
    try {
      const data = await getReporteFinancieroApi(currentFiltros);
      setReporteData(data);
    } catch (err) {
      console.error('Error al cargar reporte financiero:', err);
      toast.error('Ocurrió un error al cargar los datos del reporte');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isDoctorRole) {
      fetchReporte(filtros);
    }
  }, [filtros, fetchReporte, isDoctorRole]);

  const handleResetFiltros = () => {
    const defaultFiltros: ReporteFiltros = {
      fecha_inicio: '',
      fecha_fin: '',
      sucursal_id: '',
      doctor_id: '',
      tipo_pago: '',
      metodo_pago: '',
      estado: '',
    };
    setFiltros(defaultFiltros);
  };

  const handleViewBoleta = (boleta: BoletaServicioPrestado) => {
    setSelectedBoleta(boleta);
    setIsDetailsModalOpen(true);
  };

  const handleBoletaUpdated = () => {
    fetchReporte(filtros);
  };

  if (isDoctorRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 rounded-sm flex items-center justify-center mb-4">
          <BarChart3 size={32} />
        </div>
        <h2 className="text-small font-bold uppercase tracking-wider text-primary-dark dark:text-white">Acceso Restringido</h2>
        <p className="text-small text-slate-600 dark:text-slate-400 max-w-md">
          Su cuenta con rol de Doctor no cuenta con los permisos necesarios para visualizar métricas y reportes analíticos globales.
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 space-y-4 max-w-[1600px] mx-auto min-h-screen">
      {/* HEADER DE PÁGINA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-dark-surface p-4 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 text-primary dark:text-secondary flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-small font-bold uppercase tracking-wider text-primary-dark dark:text-white">
                Módulo de Reportes & Analítica
              </h1>
              <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold text-micro px-1.5 py-0.5 rounded uppercase tracking-wider">
                Tiempo Real
              </span>
            </div>
            <p className="text-tiny text-slate-500 dark:text-slate-400 mt-0.5">
              Informe consolidado de ventas, recaudaciones, comisiones y estado de comprobantes.
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchReporte(filtros)}
          disabled={loading}
          className="w-full md:w-auto px-4 py-1.5 rounded-sm bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualizar Datos
        </button>
      </div>

      {/* FILTROS Y BARRA DE HERRAMIENTAS */}
      <ReporteFiltersToolbar
        filtros={filtros}
        onFiltrosChange={setFiltros}
        onReset={handleResetFiltros}
        reporteData={reporteData}
        loading={loading}
      />

      {/* TARJETAS KPI RESUMEN EJECUTIVO */}
      {reporteData && (
        <ReporteSummaryCards resumen={reporteData.resumen} loading={loading} />
      )}

      {/* CONTENIDO PRINCIPAL: DESGLOSE Y TABLAS */}
      {reporteData && (
        <>
          {/* DESGLOSE POR SUCURSALES Y MÉTODOS DE PAGO */}
          <ReporteSucursalesTable
            sucursales={reporteData.desglose_sucursales}
            metodosPago={reporteData.desglose_metodos_pago}
            tiposPago={reporteData.desglose_tipos_pago}
          />

          {/* DESGLOSE POR DOCTOR */}
          <ReporteDoctoresTable doctores={reporteData.desglose_doctores} />

          {/* TABLA DE BOLETAS Y DETALLES */}
          <ReporteBoletasTable
            boletas={reporteData.boletas}
            onViewBoleta={handleViewBoleta}
          />
        </>
      )}

      {/* MODAL DETALLE DE BOLETA */}
      {selectedBoleta && (
        <BoletaDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedBoleta(null);
          }}
          boleta={selectedBoleta}
          onBoletaUpdated={handleBoletaUpdated}
        />
      )}
    </div>
  );
};
