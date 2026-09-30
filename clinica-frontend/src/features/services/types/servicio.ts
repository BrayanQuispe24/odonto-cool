export interface Servicio {
  id: number;
  codigo_servicio: string;
  nombre: string;
  descripcion?: string | null;
  categoria?: string | null;
  precio: number;
  duracion_estimada_minutos: number;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ServicioFormData {
  codigo_servicio?: string;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  precio: number;
  duracion_estimada_minutos?: number;
  estado?: boolean;
}

export const CATEGORIAS_SERVICIO = [
  'Odontología General',
  'Ortodoncia',
  'Endodoncia',
  'Estética Dental',
  'Cirugía',
  'Rehabilitación Oral',
  'Odontopediatría',
  'Periodoncia',
] as const;

export type ServicioCategoria = typeof CATEGORIAS_SERVICIO[number];
