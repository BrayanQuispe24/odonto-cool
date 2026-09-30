import * as XLSX from 'xlsx';
import type { ReporteFinancieroResponse, ReporteFiltros } from '../types/reporteTypes';

export const exportarReporteExcel = (
  data: ReporteFinancieroResponse,
  filtros: ReporteFiltros,
  sucursalNombre?: string,
  doctorNombre?: string
) => {
  const wb = XLSX.utils.book_new();

  // 1. Hoja de Resumen
  const resumenRows = [
    ['REPORTE GENERAL DE CLINICA DENTAL'],
    ['Fecha de Generación', new Date().toLocaleString()],
    ['Rango de Fechas', `${filtros.fecha_inicio || 'Inicio'} al ${filtros.fecha_fin || 'Actual'}`],
    ['Sucursal', sucursalNombre || 'Todas las Sucursales'],
    ['Doctor', doctorNombre || 'Todos los Doctores'],
    ['Tipo de Pago', filtros.tipo_pago ? (filtros.tipo_pago === 'contado' ? 'Contado' : 'Crédito') : 'Todos'],
    ['Método de Pago', filtros.metodo_pago ? filtros.metodo_pago.toUpperCase() : 'Todos'],
    ['Estado Boleta', filtros.estado ? (filtros.estado === 'completado' ? 'Completado' : 'Pendiente') : 'Todos'],
    [],
    ['MÉTRICAS Y KPIS GENERALES'],
    ['Métrica', 'Valor'],
    ['Total Boletas Generadas', data.resumen.total_boletas],
    ['Monto Total Generado (Bs.)', data.resumen.monto_total_generado],
    ['Monto Total Cobrado / Recaudado (Bs.)', data.resumen.monto_total_cobrado],
    ['Saldo Pendiente de Cobro (Bs.)', data.resumen.monto_total_pendiente],
    ['Comisiones Médicas Totales (Bs.)', data.resumen.monto_comisiones_dr],
    ['Costos de Laboratorio Totales (Bs.)', data.resumen.monto_costo_laboratorio],
    ['Ganancia Neta Estimada (Bs.)', data.resumen.ganancia_neta_estimada],
    ['Boletas Completadas', data.resumen.boletas_completadas],
    ['Boletas Pendientes', data.resumen.boletas_pendientes],
    [],
    ['DESGLOSE POR DOCTOR'],
    ['Doctor', 'Especialidad', 'Boletas', 'Generado (Bs.)', 'Cobrado (Bs.)', 'Pendiente (Bs.)', 'Comisiones (Bs.)'],
    ...data.desglose_doctores.map(d => [
      d.nombre_doctor,
      d.especialidad,
      d.total_boletas,
      d.monto_total_generado,
      d.monto_total_cobrado,
      d.monto_total_pendiente,
      d.comisiones_totales
    ]),
    [],
    ['DESGLOSE POR SUCURSAL'],
    ['Sucursal', 'Boletas', 'Generado (Bs.)', 'Cobrado (Bs.)'],
    ...data.desglose_sucursales.map(s => [
      s.nombre_sucursal,
      s.total_boletas,
      s.monto_total_generado,
      s.monto_total_cobrado
    ]),
    [],
    ['DESGLOSE POR MÉTODO DE PAGO'],
    ['Método de Pago', 'Transacciones Pagadas', 'Monto Cobrado (Bs.)'],
    ...data.desglose_metodos_pago.map(m => [
      m.metodo_pago.toUpperCase(),
      m.cantidad_transacciones,
      m.monto_total
    ])
  ];

  const wsResumen = XLSX.utils.aoa_to_sheet(resumenRows);
  XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen General');

  // 2. Hoja Detalle de Boletas
  const boletasHeaders = [
    'N° Boleta',
    'Fecha Emisión',
    'Paciente',
    'Doctor',
    'Sucursal',
    'Tipo Pago',
    'Cuotas Total',
    'Monto Total (Bs.)',
    'Monto Cobrado (Bs.)',
    'Saldo Pendiente (Bs.)',
    'Comisión Doctor (Bs.)',
    'Costo Lab (Bs.)',
    'Estado'
  ];

  const boletasDataRows = data.boletas.map(b => {
    const pacienteNombre = b.cita?.paciente
      ? `${b.cita.paciente.nombre} ${b.cita.paciente.apellido}`
      : b.cita?.nombre_paciente_unregistered || 'Paciente';

    const doctorNombre = b.doctor
      ? `${b.doctor.nombre} ${b.doctor.apellido}`
      : b.cita?.doctor
      ? `${b.cita.doctor.nombre} ${b.cita.doctor.apellido}`
      : 'Sin Asignar';

    const sucursalNombre = b.cita?.sucursal?.nombre || 'Central';

    const montoTotal = Number(b.monto_total) || 0;
    const montoCobrado = b.cuotas
      ? b.cuotas.filter(c => c.estado === 'pagado').reduce((sum: number, c) => sum + (Number(c.monto_cuota) || 0), 0)
      : 0;
    const saldoPendiente = Math.max(0, montoTotal - montoCobrado);

    return [
      b.numero_boleta || `BOL-${b.id}`,
      b.fecha_emision ? new Date(b.fecha_emision).toLocaleDateString('es-ES') : '-',
      pacienteNombre,
      doctorNombre,
      sucursalNombre,
      b.tipo_pago ? (b.tipo_pago === 'contado' ? 'Contado' : 'Crédito') : 'Contado',
      b.cantidad_cuotas || 1,
      montoTotal,
      montoCobrado,
      saldoPendiente,
      Number(b.monto_comision_dr) || 0,
      Number(b.costo_laboratorio) || 0,
      b.estado === 'completado' ? 'Completado' : 'Pendiente'
    ];
  });

  const wsBoletas = XLSX.utils.aoa_to_sheet([boletasHeaders, ...boletasDataRows]);
  XLSX.utils.book_append_sheet(wb, wsBoletas, 'Detalle de Boletas');

  // Guardar archivo
  const fechaStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `Reporte_Clinica_Dental_${fechaStr}.xlsx`);
};
