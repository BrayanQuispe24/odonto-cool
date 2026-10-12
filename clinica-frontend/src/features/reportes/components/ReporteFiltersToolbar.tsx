import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Building2,
  UserCheck,
  CreditCard,
  Wallet,
  RotateCcw,
  FileSpreadsheet,
  FileText,
  Filter,
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import type { ReporteFiltros, ReporteFinancieroResponse } from '../types/reporteTypes';
import { getSucursalesApi } from '../../sucursales/services/sucursalService';
import { getDoctoresApi } from '../../doctors/services/doctorService';
import type { Sucursal } from '../../sucursales/types/sucursal';
import type { Doctor } from '../../doctors/types/doctor';
import { exportarReporteExcel } from '../utils/excelExport';
import { ReportePDFDocument } from './ReportePDFDocument';

interface Props {
  filtros: ReporteFiltros;
  onFiltrosChange: (newFiltros: ReporteFiltros) => void;
  onReset: () => void;
  reporteData: ReporteFinancieroResponse | null;
  loading?: boolean;
}

export const ReporteFiltersToolbar: React.FC<Props> = ({
  filtros,
  onFiltrosChange,
  onReset,
  reporteData,
}) => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [doctores, setDoctores] = useState<Doctor[]>([]);

  useEffect(() => {
    const loadSelectOptions = async () => {
      try {
        const [sucData, docData] = await Promise.all([
          getSucursalesApi(),
          getDoctoresApi(),
        ]);
        setSucursales(sucData);
        setDoctores(docData);
      } catch (err) {
        console.error('Error al cargar opciones de sucursales o doctores:', err);
      }
    };
    loadSelectOptions();
  }, []);

  const handleChange = (key: keyof ReporteFiltros, value: string) => {
    onFiltrosChange({
      ...filtros,
      [key]: value,
    });
  };

  const selectedSucursal = sucursales.find(
    (s) => String(s.id) === String(filtros.sucursal_id)
  );
  const selectedDoctor = doctores.find(
    (d) => String(d.id) === String(filtros.doctor_id)
  );

  return (
    <div className="bg-white dark:bg-dark-surface rounded-sm p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 sm:pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 text-primary dark:text-secondary flex items-center justify-center font-bold shrink-0">
            <Filter className="w-5 h-5 text-primary dark:text-secondary" />
          </div>
          <div>
            <h3 className="text-small font-bold uppercase tracking-wider text-primary-dark dark:text-white">
              Filtros Avanzados del Reporte
            </h3>
            <p className="text-tiny text-slate-500 dark:text-slate-400">
              Personalice los parámetros para consultar lo generado en la clínica
            </p>
          </div>
        </div>

        {/* ACCIONES DE EXPORTACIÓN */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            onClick={onReset}
            type="button"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-small font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-sm transition-all cursor-pointer"
            title="Restablecer todos los filtros"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpiar
          </button>

          {reporteData && (
            <>
              <button
                onClick={() =>
                  exportarReporteExcel(
                    reporteData,
                    filtros,
                    selectedSucursal?.nombre,
                    selectedDoctor
                      ? `${selectedDoctor.nombre} ${selectedDoctor.apellido}`
                      : undefined
                  )
                }
                type="button"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-1.5 text-small font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 rounded-sm transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Exportar Excel
              </button>

              <PDFDownloadLink
                document={
                  <ReportePDFDocument
                    data={reporteData}
                    filtros={filtros}
                    sucursalNombre={selectedSucursal?.nombre}
                    doctorNombre={
                      selectedDoctor
                        ? `${selectedDoctor.nombre} ${selectedDoctor.apellido}`
                        : undefined
                    }
                  />
                }
                fileName={`Reporte_Financiero_Clinica_${
                  new Date().toISOString().split('T')[0]
                }.pdf`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-1.5 text-small font-semibold text-white bg-[#0077D4] hover:bg-[#0840A8] rounded-sm transition-all shadow-sm cursor-pointer"
              >
                {({ loading: pdfLoading }) => (
                  <>
                    <FileText className="w-4 h-4" />
                    {pdfLoading ? 'Generando PDF...' : 'Descargar PDF'}
                  </>
                )}
              </PDFDownloadLink>
            </>
          )}
        </div>
      </div>

      {/* GRID DE FILTROS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4 mt-4 sm:mt-5">
        {/* Rango Fecha Inicio */}
        <div>
          <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Fecha Inicio
          </label>
          <input
            type="date"
            value={filtros.fecha_inicio}
            onChange={(e) => handleChange('fecha_inicio', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Rango Fecha Fin */}
        <div>
          <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Fecha Fin
          </label>
          <input
            type="date"
            value={filtros.fecha_fin}
            onChange={(e) => handleChange('fecha_fin', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Sucursal */}
        <div>
          <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            Sucursal
          </label>
          <select
            value={filtros.sucursal_id}
            onChange={(e) => handleChange('sucursal_id', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Todas las Sucursales</option>
            {sucursales.map((suc) => (
              <option key={suc.id} value={suc.id}>
                {suc.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Doctor */}
        <div>
          <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
            <UserCheck className="w-3 h-3" />
            Doctor
          </label>
          <select
            value={filtros.doctor_id}
            onChange={(e) => handleChange('doctor_id', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Todos los Doctores</option>
            {doctores.map((doc) => (
              <option key={doc.id} value={doc.id}>
                Dr(a). {doc.nombre} {doc.apellido}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de Pago */}
        <div>
          <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            Tipo de Pago
          </label>
          <select
            value={filtros.tipo_pago}
            onChange={(e) => handleChange('tipo_pago', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Todos los Tipos</option>
            <option value="contado">Al Contado</option>
            <option value="credito">Al Crédito</option>
          </select>
        </div>

        {/* Modo / Método de Pago */}
        <div>
          <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
            <Wallet className="w-3 h-3" />
            Método de Pago
          </label>
          <select
            value={filtros.metodo_pago}
            onChange={(e) => handleChange('metodo_pago', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Todos los Métodos</option>
            <option value="efectivo">Efectivo</option>
            <option value="qr">Pago QR</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
      </div>
    </div>
  );
};
