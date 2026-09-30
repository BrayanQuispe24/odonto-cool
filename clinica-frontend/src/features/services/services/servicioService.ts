import api from '../../../services/api';
import type { Servicio, ServicioFormData } from '../types/servicio';

export interface ServiciosResponse {
  servicios: Servicio[];
}

export interface ServicioSingleResponse {
  message?: string;
  servicio: Servicio;
}

export const getServiciosApi = async (filters?: {
  categoria?: string;
  estado?: boolean;
}): Promise<Servicio[]> => {
  const params = new URLSearchParams();
  if (filters?.categoria) params.append('categoria', filters.categoria);
  if (filters?.estado !== undefined) params.append('estado', String(filters.estado));

  const response = await api.get<ServiciosResponse>(`/servicios?${params.toString()}`);
  return response.data.servicios;
};

export const createServicioApi = async (data: ServicioFormData): Promise<Servicio> => {
  const response = await api.post<ServicioSingleResponse>('/servicios', data);
  return response.data.servicio;
};

export const updateServicioApi = async (id: number, data: Partial<ServicioFormData>): Promise<Servicio> => {
  const response = await api.put<ServicioSingleResponse>(`/servicios/${id}`, data);
  return response.data.servicio;
};

export const deleteServicioApi = async (id: number): Promise<void> => {
  await api.delete(`/servicios/${id}`);
};
