import api from '../../../services/api';
import type { Sucursal, SucursalFormData } from '../types/sucursal';
import type { Doctor } from '../../doctors/types/doctor';

export interface SucursalesResponse {
  sucursales: Sucursal[];
}

export interface SucursalSingleResponse {
  message?: string;
  sucursal: Sucursal;
}

export interface AssignDoctorResponse {
  message?: string;
  doctor: Doctor;
}

export const getSucursalesApi = async (): Promise<Sucursal[]> => {
  const response = await api.get<SucursalesResponse>('/sucursales');
  return response.data.sucursales;
};

export const createSucursalApi = async (data: SucursalFormData): Promise<Sucursal> => {
  const response = await api.post<SucursalSingleResponse>('/sucursales', data);
  return response.data.sucursal;
};

export const updateSucursalApi = async (id: number, data: SucursalFormData): Promise<Sucursal> => {
  const response = await api.put<SucursalSingleResponse>(`/sucursales/${id}`, data);
  return response.data.sucursal;
};

export const deleteSucursalApi = async (id: number): Promise<void> => {
  await api.delete(`/sucursales/${id}`);
};

export const assignDoctorSucursalApi = async (sucursalId: number, doctorId: number): Promise<Doctor> => {
  const response = await api.post<AssignDoctorResponse>(`/sucursales/${sucursalId}/asignar-doctor`, {
    doctor_id: doctorId,
  });
  return response.data.doctor;
};
