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
    <div className="bg-white dark:bg-[#002D5E] rounded-2xl p-4 sm:p-6 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 sm:pb-5 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0077D4]/20 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-[#0077D4] dark:text-[#00C2E0] flex items-center justify-center font-bold shrink-0">
            <Filter className="w-5 h-5 text-[#0077D4] dark:text-[#00C2E0]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0840A8] dark:text-white">
              Filtros Avanzados del Reporte
            </h3>
            <p className="text-xs text-[#0077D4] dark:text-blue-200/80">
              Personalice los parámetros para consultar lo generado en la clínica
            </p>
          </div>
        </div>

        {/* ACCIONES DE EXPORTACIÓN */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
          <button
            onClick={onReset}
            type="button"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0077D4] dark:text-blue-200 hover:text-white bg-[#0840A8] hover:bg-[#0077D4] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 rounded-xl transition-all cursor-pointer"
            title="Restablecer todos los filtros"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#0077D4] dark:text-[#00C2E0]" />
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
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 rounded-xl transition-all shadow-md cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Exportar Excel (.xlsx)
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
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#0840A8] hover:to-[#0077D4] rounded-xl transition-all shadow-md shadow-[#0077D4]/30 cursor-pointer"
              >
                {({ loading: pdfLoading }) => (
                  <>
                    <FileText className="w-4 h-4 text-[#0840A8] dark:text-white" />
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
          <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-200/90 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#0077D4] dark:text-[#00C2E0]" />
            Fecha Inicio
          </label>
          <input
            type="date"
            value={filtros.fecha_inicio}
            onChange={(e) => handleChange('fecha_inicio', e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0]"
          />
        </div>

        {/* Rango Fecha Fin */}
        <div>
          <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-200/90 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#0077D4] dark:text-[#00C2E0]" />
            Fecha Fin
          </label>
          <input
            type="date"
            value={filtros.fecha_fin}
            onChange={(e) => handleChange('fecha_fin', e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0]"
          />
        </div>

        {/* Sucursal */}
        <div>
          <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-200/90 mb-1.5 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-[#0077D4] dark:text-[#00C2E0]" />
            Sucursal
          </label>
          <select
            value={filtros.sucursal_id}
            onChange={(e) => handleChange('sucursal_id', e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0]"
          >
            <option value="" className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">Todas las Sucursales</option>
            {sucursales.map((suc) => (
              <option key={suc.id} value={suc.id} className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">
                {suc.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Doctor */}
        <div>
          <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-200/90 mb-1.5 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-[#0077D4] dark:text-[#00C2E0]" />
            Doctor / Odontólogo
          </label>
          <select
            value={filtros.doctor_id}
            onChange={(e) => handleChange('doctor_id', e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0]"
          >
            <option value="" className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">Todos los Doctores</option>
            {doctores.map((doc) => (
              <option key={doc.id} value={doc.id} className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">
                Dr(a). {doc.nombre} {doc.apellido}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de Pago */}
        <div>
          <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-200/90 mb-1.5 flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-[#0077D4] dark:text-[#00C2E0]" />
            Tipo de Pago
          </label>
          <select
            value={filtros.tipo_pago}
            onChange={(e) => handleChange('tipo_pago', e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0]"
          >
            <option value="" className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">Todos los Tipos</option>
            <option value="contado" className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">Al Contado</option>
            <option value="credito" className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">Al Crédito (Cuotas)</option>
          </select>
        </div>

        {/* Modo / Método de Pago */}
        <div>
          <label className="block text-xs font-semibold text-[#0077D4] dark:text-blue-200/90 mb-1.5 flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5 text-[#0077D4] dark:text-[#00C2E0]" />
            Método de Pago
          </label>
          <select
            value={filtros.metodo_pago}
            onChange={(e) => handleChange('metodo_pago', e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0]"
          >
            <option value="" className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">Todos los Métodos</option>
            <option value="efectivo" className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">Efectivo</option>
            <option value="qr" className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">Pago QR</option>
            <option value="tarjeta" className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">Tarjeta Débito/Crédito</option>
            <option value="transferencia" className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">Transferencia Bancaria</option>
          </select>
        </div>
      </div>
    </div>
  );
};
