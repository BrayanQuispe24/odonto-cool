import type { Doctor } from '../../doctors/types/doctor';

export type DoctorDestacado = Doctor & {
  destacado_en_landing: boolean;
};

export interface ServicioDestacado {
  id: number;
  codigo_servicio: string;
  nombre: string;
  descripcion?: string | null;
  categoria: string;
  precio: number;
  duracion_estimada_minutos: number;
  estado: boolean;
  destacado_en_landing: boolean;
}
