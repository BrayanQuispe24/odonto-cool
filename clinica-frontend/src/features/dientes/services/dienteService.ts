import api from '../../../services/api';
import type { Diente, DienteFormData } from '../types/diente';

export interface DientesResponse {
  dientes: Diente[];
}

export interface DienteSingleResponse {
  message?: string;
  diente: Diente;
}

export const getDientesApi = async (filters?: {
  cuadrante?: string;
  tipo_denticion?: string;
  estado?: boolean;
}): Promise<Diente[]> => {
  const params = new URLSearchParams();
  if (filters?.cuadrante) params.append('cuadrante', filters.cuadrante);
  if (filters?.tipo_denticion) params.append('tipo_denticion', filters.tipo_denticion);
  if (filters?.estado !== undefined) params.append('estado', String(filters.estado));

  const response = await api.get<DientesResponse>(`/dientes?${params.toString()}`);
  return response.data.dientes;
};

export const createDienteApi = async (data: DienteFormData): Promise<Diente> => {
  const response = await api.post<DienteSingleResponse>('/dientes', data);
  return response.data.diente;
};

export const updateDienteApi = async (id: number, data: Partial<DienteFormData>): Promise<Diente> => {
  const response = await api.put<DienteSingleResponse>(`/dientes/${id}`, data);
  return response.data.diente;
};

export const deleteDienteApi = async (id: number): Promise<void> => {
  await api.delete(`/dientes/${id}`);
};
