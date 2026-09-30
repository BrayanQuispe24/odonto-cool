import api from '../../../services/api';
import type { Expediente } from '../types/expediente';

export const expedienteService = {
  getAll: async () => {
    const response = await api.get<Expediente[]>('/expedientes');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Expediente>(`/expedientes/${id}`);
    return response.data;
  },

  upload: async (formData: FormData) => {
    // For file uploads, we need to send FormData and let axios set the correct Content-Type (multipart/form-data)
    const response = await api.post<Expediente>('/expedientes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<{ message: string }>(`/expedientes/${id}`);
    return response.data;
  },
};
