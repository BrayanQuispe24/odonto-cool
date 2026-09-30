import type { Paciente } from '../../patients/types/patient';

export interface Expediente {
  id: number;
  paciente_id: number;
  titulo: string;
  descripcion?: string | null;
  archivo_path: string;
  tipo_documento: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  paciente?: Paciente;
}
