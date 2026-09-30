import api from '../../../services/api';
import type { Cita, CitaFormData } from '../types/cita';

export interface CitasResponse {
  citas: Cita[];
}

export interface CitaSingleResponse {
  message?: string;
  cita: Cita;
}

export const getCitasApi = async (filters?: {
  sucursal_id?: number;
  doctor_id?: number;
  fecha?: string;
  estado?: string;
}): Promise<Cita[]> => {
  const params = new URLSearchParams();
  if (filters?.sucursal_id) params.append('sucursal_id', String(filters.sucursal_id));
  if (filters?.doctor_id) params.append('doctor_id', String(filters.doctor_id));
  if (filters?.fecha) params.append('fecha', filters.fecha);
  if (filters?.estado) params.append('estado', filters.estado);

  const response = await api.get<CitasResponse>(`/citas?${params.toString()}`);
  return response.data.citas;
};

export const createCitaApi = async (data: CitaFormData): Promise<Cita> => {
  const response = await api.post<CitaSingleResponse>('/citas', data);
  return response.data.cita;
};

export const updateCitaApi = async (id: number, data: Partial<CitaFormData>): Promise<Cita> => {
  const response = await api.put<CitaSingleResponse>(`/citas/${id}`, data);
  return response.data.cita;
};

export const deleteCitaApi = async (id: number): Promise<void> => {
  await api.delete(`/citas/${id}`);
};

export interface DisponibilidadResponse {
  disponible: boolean;
  fuera_horario_sucursal: boolean;
  conflicto_doctor: boolean;
  horario_sucursal: string;
  citas_ocupadas: Array<{
    id: number;
    numero_cita: string;
    hora_inicio: string;
    hora_fin: string;
    paciente: string;
    estado: string;
  }>;
  mensaje: string;
}

export const checkDisponibilidadApi = async (params: {
  doctor_id: number;
  sucursal_id: number;
  fecha: string;
  hora_inicio?: string;
  hora_fin?: string;
  ignore_cita_id?: number;
}): Promise<DisponibilidadResponse> => {
  const q = new URLSearchParams();
  q.append('doctor_id', String(params.doctor_id));
  q.append('sucursal_id', String(params.sucursal_id));
  q.append('fecha', params.fecha);
  if (params.hora_inicio) q.append('hora_inicio', params.hora_inicio);
  if (params.hora_fin) q.append('hora_fin', params.hora_fin);
  if (params.ignore_cita_id) q.append('ignore_cita_id', String(params.ignore_cita_id));

  const response = await api.get<DisponibilidadResponse>(`/citas/disponibilidad?${q.toString()}`);
  return response.data;
};
