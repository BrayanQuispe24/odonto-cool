import api from '../../../services/api';
import type { ReporteFiltros, ReporteFinancieroResponse } from '../types/reporteTypes';

export const getReporteFinancieroApi = async (filtros: ReporteFiltros): Promise<ReporteFinancieroResponse> => {
  const params: Record<string, string> = {};

  if (filtros.fecha_inicio) params.fecha_inicio = filtros.fecha_inicio;
  if (filtros.fecha_fin) params.fecha_fin = filtros.fecha_fin;
  if (filtros.sucursal_id) params.sucursal_id = filtros.sucursal_id;
  if (filtros.doctor_id) params.doctor_id = filtros.doctor_id;
  if (filtros.tipo_pago) params.tipo_pago = filtros.tipo_pago;
  if (filtros.metodo_pago) params.metodo_pago = filtros.metodo_pago;
  if (filtros.estado) params.estado = filtros.estado;

  const response = await api.get<ReporteFinancieroResponse>('/reportes/financiero', { params });
  return response.data;
};
