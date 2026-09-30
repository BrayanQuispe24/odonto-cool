import type { Cita } from '../../citas/types/cita';
import type { BoletaServicioPrestado } from '../../boletas/types/boleta';

export interface VentasSucursalItem {
  id: number;
  nombre: string;
  total_generado: number;
  citas_count: number;
}

export interface GraficoVentasItem {
  mes: string;
  ano: string;
  total: number;
}

export interface AdminDashboardData {
  ventas_mes: number;
  cobrado_mes: number;
  total_pacientes: number;
  citas_hoy_count: number;
  boletas_completadas: number;
  boletas_pendientes: number;
  ventas_sucursales: VentasSucursalItem[];
  grafico_ventas: GraficoVentasItem[];
  citas_hoy: Cita[];
}

export interface DoctorInfo {
  id: number;
  nombre: string;
  especialidad: string;
}

export interface DoctorDashboardData {
  doctor: DoctorInfo | null;
  mis_ventas_mes: number;
  mis_comisiones_mes: number;
  mis_citas_hoy_count: number;
  mis_pacientes_count: number;
  citas_hoy: Cita[];
  ultimas_boletas: BoletaServicioPrestado[];
}
