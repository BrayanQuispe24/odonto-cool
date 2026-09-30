export interface Paciente {
  id: number;
  codigo_paciente: string;
  sucursal_id: number;
  nombre: string;
  apellido: string;
  edad: number;
  sexo: string;
  ocupacion?: string | null;
  estado_civil?: string | null;
  celular?: string | null;
  domicilio_actual?: string | null;
  fecha_nacimiento: string;
  telefono_emergencia?: string | null;
  nombre_contacto_emergencia?: string | null;
  apellido_contacto_emergencia?: string | null;
  parentesco_contacto_emergencia?: string | null;
  created_at?: string;
  updated_at?: string;
  sucursal?: {
    id: number;
    nombre?: string;
    codigo_sucursal?: string;
    ubicacion: string;
  };
  antecedente?: any;
  citas?: any[];
}

export interface PacienteFormData {
  codigo_paciente: string;
  sucursal_id: number;
  nombre: string;
  apellido: string;
  edad: number;
  sexo: string;
  ocupacion?: string;
  estado_civil?: string;
  celular?: string;
  domicilio_actual?: string;
  fecha_nacimiento: string;
  telefono_emergencia?: string;
  nombre_contacto_emergencia?: string;
  apellido_contacto_emergencia?: string;
  parentesco_contacto_emergencia?: string;
}
