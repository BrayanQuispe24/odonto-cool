import type { BoletaServicioPrestado } from '../../boletas/types/boleta';

export interface ReporteFiltros {
  fecha_inicio: string;
  fecha_fin: string;
  sucursal_id: string;
  doctor_id: string;
  tipo_pago: string;
  metodo_pago: string;
  estado: string;
}

export interface ReporteResumen {
  total_boletas: number;
  monto_total_generado: number;
  monto_total_cobrado: number;
  monto_total_pendiente: number;
  monto_comisiones_dr: number;
  monto_costo_laboratorio: number;
  ganancia_neta_estimada: number;
  boletas_completadas: number;
  boletas_pendientes: number;
}

export interface DesgloseDoctor {
  doctor_id: number;
  nombre_doctor: string;
  especialidad: string;
  total_boletas: number;
  monto_total_generado: number;
  monto_total_cobrado: number;
  monto_total_pendiente: number;
  comisiones_totales: number;
}

export interface DesgloseSucursal {
  sucursal_id: number;
  nombre_sucursal: string;
  total_boletas: number;
  monto_total_generado: number;
  monto_total_cobrado: number;
}

export interface DesgloseMetodoPago {
  metodo_pago: string;
  monto_total: number;
  cantidad_transacciones: number;
}

export interface DesgloseTipoPago {
  tipo_pago: string;
  monto_total: number;
  cantidad_boletas: number;
}

export interface ReporteFinancieroResponse {
  resumen: ReporteResumen;
  desglose_doctores: DesgloseDoctor[];
  desglose_sucursales: DesgloseSucursal[];
  desglose_metodos_pago: DesgloseMetodoPago[];
  desglose_tipos_pago: DesgloseTipoPago[];
  boletas: BoletaServicioPrestado[];
}
