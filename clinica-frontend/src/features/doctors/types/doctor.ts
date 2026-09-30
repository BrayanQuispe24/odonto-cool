export interface Doctor {
  id: number;
  usuario_id: number;
  sucursal_id: number;
  nombre: string;
  apellido: string;
  telefonos?: string[] | null;
  especialidades?: string[] | null;
  created_at?: string;
  updated_at?: string;
  usuario?: {
    id: number;
    name?: string;
    email: string;
    codigo_usuario?: string;
  };
  sucursal?: {
    id: number;
    nombre?: string;
    codigo_sucursal?: string;
    ubicacion: string;
  };
}

export interface DoctorFormData {
  usuario_id: number;
  sucursal_id: number;
  nombre: string;
  apellido: string;
  telefonos: string[];
  especialidades: string[];
}
