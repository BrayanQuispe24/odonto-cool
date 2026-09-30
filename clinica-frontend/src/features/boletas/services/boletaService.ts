import api from '../../../services/api';
import type { BoletaServicioPrestado, BoletaFormData } from '../types/boleta';

export const getBoletasApi = async (params?: {
  cita_id?: number;
  doctor_id?: number;
  paciente_id?: number;
  estado?: string;
}): Promise<BoletaServicioPrestado[]> => {
  const response = await api.get('/boletas', { params });
  return response.data.boletas;
};

export const getBoletaByIdApi = async (id: number): Promise<BoletaServicioPrestado> => {
  const response = await api.get(`/boletas/${id}`);
  return response.data.boleta;
};

export const createBoletaApi = async (data: BoletaFormData): Promise<BoletaServicioPrestado> => {
  const response = await api.post('/boletas', data);
  return response.data.boleta;
};

export const updateBoletaApi = async (
  id: number,
  data: Partial<BoletaFormData>
): Promise<BoletaServicioPrestado> => {
  const response = await api.put(`/boletas/${id}`, data);
  return response.data.boleta;
};

export const deleteBoletaApi = async (id: number): Promise<void> => {
  await api.delete(`/boletas/${id}`);
};

export const pagarCuotaApi = async (
  boletaId: number,
  cuotaId: number,
  data?: { fecha_pago?: string; metodo_pago?: string; url_comprobante?: string }
): Promise<BoletaServicioPrestado> => {
  const response = await api.post(`/boletas/${boletaId}/cuotas/${cuotaId}/pagar`, data);
  return response.data.boleta;
};

export const addCuotaApi = async (
  boletaId: number,
  data: {
    monto_cuota: number;
    fecha_pago?: string;
    modo_pago?: string;
    metodo_pago?: string;
    url_comprobante?: string;
    estado?: 'pendiente' | 'pagado';
  }
): Promise<BoletaServicioPrestado> => {
  const response = await api.post(`/boletas/${boletaId}/cuotas`, data);
  return response.data.boleta;
};

export const updateCuotaApi = async (
  boletaId: number,
  cuotaId: number,
  data: {
    monto_cuota?: number;
    fecha_pago?: string;
    modo_pago?: string;
    metodo_pago?: string;
    url_comprobante?: string;
    estado?: 'pendiente' | 'pagado';
  }
): Promise<BoletaServicioPrestado> => {
  const response = await api.put(`/boletas/${boletaId}/cuotas/${cuotaId}`, data);
  return response.data.boleta;
};

export const deleteCuotaApi = async (
  boletaId: number,
  cuotaId: number
): Promise<BoletaServicioPrestado> => {
  const response = await api.delete(`/boletas/${boletaId}/cuotas/${cuotaId}`);
  return response.data.boleta;
};
