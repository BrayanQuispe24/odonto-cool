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
        <div className="w-20 h-20 bg-rose-500/20 border border-rose-500/30 text-rose-500 rounded-full flex items-center justify-center mb-4">
          <BarChart3 size={40} />
        </div>
        <h2 className="text-2xl font-black text-[#0840A8] dark:text-white">Acceso Restringido</h2>
        <p className="text-[#0077D4]/80 dark:text-blue-200/80 max-w-md">
          Su cuenta con rol de Especialista Médico no cuenta con los permisos necesarios para visualizar métricas, finanzas y reportes analíticos globales.
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* HEADER DE PÁGINA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#002D5E] p-4 sm:p-6 rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-lg shadow-sm dark:shadow-[#001C3D]/50">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#0077D4]/20 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-[#0077D4] dark:text-[#00C2E0] flex items-center justify-center shadow-md shrink-0">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-[#0077D4] dark:text-[#00C2E0]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#0840A8] dark:text-white tracking-tight">
                Módulo de Reportes & Analítica
              </h1>
              <span className="bg-[#00C2E0]/20 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/40 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                En Tiempo Real
              </span>
            </div>
            <p className="text-xs text-[#0077D4] dark:text-blue-200/80 mt-1">
              Informe consolidado de todo lo generado en la clínica: ventas, recaudaciones, comisiones médicas y estado de comprobantes.
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchReporte(filtros)}
          disabled={loading}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#0840A8] hover:bg-[#0077D4] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 text-[#0077D4] dark:text-[#00C2E0] ${loading ? 'animate-spin' : ''}`} />
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
