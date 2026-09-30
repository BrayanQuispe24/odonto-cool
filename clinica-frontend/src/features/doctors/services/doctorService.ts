import api from '../../../services/api';
import type { Doctor, DoctorFormData } from '../types/doctor';

export interface DoctorsResponse {
  doctores: Doctor[];
}

export interface DoctorSingleResponse {
  message?: string;
  doctor: Doctor;
}

export const getDoctoresApi = async (): Promise<Doctor[]> => {
  const response = await api.get<DoctorsResponse>('/doctores');
  return response.data.doctores;
};

export const createDoctorApi = async (data: DoctorFormData): Promise<Doctor> => {
  const response = await api.post<DoctorSingleResponse>('/doctores', data);
  return response.data.doctor;
};

export const updateDoctorApi = async (id: number, data: DoctorFormData): Promise<Doctor> => {
  const response = await api.put<DoctorSingleResponse>(`/doctores/${id}`, data);
  return response.data.doctor;
};

export const deleteDoctorApi = async (id: number): Promise<void> => {
  await api.delete(`/doctores/${id}`);
};
