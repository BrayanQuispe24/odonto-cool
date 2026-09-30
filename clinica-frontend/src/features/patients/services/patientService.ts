import api from '../../../services/api';
import type { Paciente, PacienteFormData } from '../types/patient';
import type { Antecedente } from '../types/antecedente';

export interface PacientesResponse {
  pacientes: Paciente[];
}

export interface PacienteSingleResponse {
  message?: string;
  paciente: Paciente;
}

export interface AntecedenteResponse {
  message?: string;
  antecedente: Antecedente;
}

export const getPacientesApi = async (): Promise<Paciente[]> => {
  const response = await api.get<PacientesResponse>('/pacientes');
  return response.data.pacientes;
};

export const createPacienteApi = async (data: PacienteFormData): Promise<Paciente> => {
  const response = await api.post<PacienteSingleResponse>('/pacientes', data);
  return response.data.paciente;
};

export const updatePacienteApi = async (id: number, data: PacienteFormData): Promise<Paciente> => {
  const response = await api.put<PacienteSingleResponse>(`/pacientes/${id}`, data);
  return response.data.paciente;
};

export const deletePacienteApi = async (id: number): Promise<void> => {
  await api.delete(`/pacientes/${id}`);
};

export const getAntecedentesApi = async (pacienteId: number): Promise<Antecedente> => {
  const response = await api.get<AntecedenteResponse>(`/pacientes/${pacienteId}/antecedentes`);
  return response.data.antecedente;
};

export const updateAntecedentesApi = async (
  pacienteId: number,
  data: Partial<Antecedente>
): Promise<Antecedente> => {
  const response = await api.put<AntecedenteResponse>(`/pacientes/${pacienteId}/antecedentes`, data);
  return response.data.antecedente;
};
