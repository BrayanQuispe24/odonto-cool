import type { Doctor } from '../../doctors/types/doctor';
import type { Paciente } from '../../patients/types/patient';
import type { Sucursal } from '../../sucursales/types/sucursal';

export type CitaEstado = 'pendiente' | 'confirmada' | 'cancelada' | 'finalizada';

export interface Cita {
  id: number;
  numero_cita: string;
  doctor_id: number;
  sucursal_id: number;
  paciente_id?: number | null;
  nombre_paciente_unregistered?: string | null;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: CitaEstado;
  created_at?: string;
  updated_at?: string;
  doctor?: Doctor;
  sucursal?: Sucursal;
  paciente?: Paciente;
  boletaServicioPrestado?: any;
}

export interface CitaFormData {
  doctor_id: number;
  sucursal_id: number;
  paciente_id?: number | null;
  nombre_paciente_unregistered?: string | null;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado?: CitaEstado;
}
