import type { Doctor } from '../../doctors/types/doctor';
import type { Paciente } from '../../patients/types/patient';

export interface Sucursal {
  id: number;
  codigo_sucursal: string;
  nombre: string;
  ubicacion: string;
  telefono: string | null;
  horario_atencion: string | null;
  estado: boolean;
  doctores_count?: number;
  pacientes_count?: number;
  users_count?: number;
  doctores?: Doctor[];
  pacientes?: Paciente[];
  created_at?: string;
  updated_at?: string;
}

export interface SucursalFormData {
  codigo_sucursal: string;
  nombre: string;
  ubicacion: string;
  telefono?: string;
  horario_atencion?: string;
  estado?: boolean;
}

export interface AssignDoctorFormData {
  doctor_id: number;
}
