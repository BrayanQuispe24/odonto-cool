import api from '../../../services/api';
import type { DoctorDestacado, ServicioDestacado } from '../types/landingDestacados';

/**
 * Public doctors for landing page showcase.
 */
export const getPublicDoctoresDestacadosApi = async (): Promise<DoctorDestacado[]> => {
  const response = await api.get<{ doctores: DoctorDestacado[] }>('/public/doctores');
  return response.data.doctores;
};

/**
 * Admin list of all doctors.
 */
export const getAdminDoctoresApi = async (): Promise<DoctorDestacado[]> => {
  const response = await api.get<{ doctores: DoctorDestacado[] }>('/doctores');
  return response.data.doctores;
};

/**
 * Toggle doctor visibility on landing page or update bio.
 */
export const toggleDoctorLandingApi = async (
  id: number,
  data?: { destacado_en_landing?: boolean; bio_landing?: string }
): Promise<DoctorDestacado> => {
  const response = await api.put<{ message: string; doctor: DoctorDestacado }>(
    `/doctores/${id}/toggle-landing`,
    data || {}
  );
  return response.data.doctor;
};

/**
 * Admin list of all services.
 */
export const getAdminServiciosApi = async (): Promise<ServicioDestacado[]> => {
  const response = await api.get<{ servicios: ServicioDestacado[] }>('/servicios');
  return response.data.servicios;
};

/**
 * Toggle service visibility on landing page.
 */
export const toggleServicioLandingApi = async (id: number): Promise<ServicioDestacado> => {
  const response = await api.put<{ message: string; servicio: ServicioDestacado }>(
    `/servicios/${id}/toggle-landing`
  );
  return response.data.servicio;
};
