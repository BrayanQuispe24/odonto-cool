export interface Doctor {
  id: number;
  usuario_id: number;
  sucursal_id: number;
  nombre: string;
  apellido: string;
  telefonos?: string[] | null;
  especialidades?: string[] | null;
  destacado_en_landing?: boolean;
  bio_landing?: string | null;
  created_at?: string;
  updated_at?: string;
  usuario?: {
    id: number;
    name?: string;
    email: string;
    codigo_usuario?: string;
    foto_perfil?: string | null;
  };
  sucursal?: {
    id: number;
    nombre?: string;
    codigo_sucursal?: string;
    ubicacion?: string;
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
