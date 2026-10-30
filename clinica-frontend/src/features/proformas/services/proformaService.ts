import api from '../../../services/api';
import type {
  Proforma,
  ProformaFormData,
  CambiarEstadoProformaData,
  ProformaEstado,
} from '../types/proforma';

export const getProformasApi = async (params?: {
  sucursal_id?: number | string;
  estado?: ProformaEstado | string;
  search?: string;
  doctor_id?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
}): Promise<Proforma[]> => {
  const response = await api.get('/proformas', { params });
  return response.data.proformas;
};

export const getProformaByIdApi = async (id: number): Promise<Proforma> => {
  const response = await api.get(`/proformas/${id}`);
  return response.data.proforma;
};

export const createProformaApi = async (data: ProformaFormData): Promise<Proforma> => {
  const response = await api.post('/proformas', data);
  return response.data.proforma;
};

export const cambiarEstadoProformaApi = async (
  id: number,
  data: CambiarEstadoProformaData
): Promise<Proforma> => {
  const response = await api.put(`/proformas/${id}/cambiar-estado`, data);
  return response.data.proforma;
};

export const deleteProformaApi = async (id: number): Promise<void> => {
  await api.delete(`/proformas/${id}`);
};
