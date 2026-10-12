import api from '../../../services/api';
import type { Consejo, ConsejoFormData } from '../types/consejo';

export interface ConsejosResponse {
  consejos: Consejo[];
}

export interface ConsejoSingleResponse {
  message?: string;
  consejo: Consejo;
}

export const getPublicConsejosApi = async (): Promise<Consejo[]> => {
  const response = await api.get<ConsejosResponse>('/public/consejos');
  return response.data.consejos;
};

export const createConsejoApi = async (data: ConsejoFormData): Promise<Consejo> => {
  const formData = new FormData();
  formData.append('titulo', data.titulo);
  formData.append('descripcion', data.descripcion);
  if (data.categoria) formData.append('categoria', data.categoria);
  if (data.imagen) formData.append('imagen', data.imagen);

  const response = await api.post<ConsejoSingleResponse>('/consejos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.consejo;
};

export const updateConsejoApi = async (id: number, data: Partial<ConsejoFormData>): Promise<Consejo> => {
  const formData = new FormData();
  if (data.titulo) formData.append('titulo', data.titulo);
  if (data.descripcion) formData.append('descripcion', data.descripcion);
  if (data.categoria) formData.append('categoria', data.categoria);
  if (data.imagen) formData.append('imagen', data.imagen);
  // Laravel requires _method=PUT when sending FormData with file uploads
  formData.append('_method', 'PUT');

  const response = await api.post<ConsejoSingleResponse>(`/consejos/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.consejo;
};

export const deleteConsejoApi = async (id: number): Promise<void> => {
  await api.delete(`/consejos/${id}`);
};
