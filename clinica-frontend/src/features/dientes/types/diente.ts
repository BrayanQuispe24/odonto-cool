export interface Diente {
  id: number;
  numero_diente: number;
  nombre: string;
  cuadrante?: string | null;
  tipo_denticion: 'permanente' | 'deciduo';
  descripcion?: string | null;
  url?: string | null;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DienteFormData {
  numero_diente: number;
  nombre: string;
  cuadrante?: string;
  tipo_denticion?: 'permanente' | 'deciduo';
  descripcion?: string;
  url?: string;
  estado?: boolean;
}

export const CUADRANTES_DENTALES = [
  'Cuadrante 1 - Superior Derecho',
  'Cuadrante 2 - Superior Izquierdo',
  'Cuadrante 3 - Inferior Izquierdo',
  'Cuadrante 4 - Inferior Derecho',
] as const;
