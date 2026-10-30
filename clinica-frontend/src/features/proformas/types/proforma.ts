import type { Paciente } from '../../patients/types/patient';
import type { Doctor } from '../../doctors/types/doctor';
import type { Sucursal } from '../../sucursales/types/sucursal';
import type { Servicio } from '../../services/types/servicio';

export type ProformaEstado = 'Borrador' | 'Aprobado' | 'Rechazado';

export interface DetalleProforma {
  id?: number;
  proforma_id?: number;
  servicio_id: number;
  nombre_servicio: string;
  precio: number;
  descuento: number;
  subtotal: number;
  servicio?: Servicio;
}

export interface Proforma {
  id: number;
  codigo_proforma: string;
  paciente_id?: number | null;
  doctor_id?: number | null;
  sucursal_id: number;
  nombre: string;
  apellido: string;
  edad: number;
  sexo: string; // 'M' | 'F' | 'Otro'
  celular: string;
  fecha_nacimiento?: string | null;
  domicilio_actual?: string | null;
  fecha_emision: string;
  dias_validez: number;
  monto_total: number;
  estado: ProformaEstado;
  observaciones?: string | null;
  created_at?: string;
  updated_at?: string;
  paciente?: Paciente | null;
  doctor?: Doctor | null;
  sucursal?: Sucursal | null;
  detalles?: DetalleProforma[];
}

export interface DetalleProformaItemForm {
  servicio_id: number;
  nombre_servicio?: string;
  precio: number;
  descuento: number;
}

export interface ProformaFormData {
  paciente_id?: number | null;
  doctor_id?: number | null;
  sucursal_id: number;
  nombre: string;
  apellido: string;
  edad: number;
  sexo: string;
  celular: string;
  fecha_nacimiento?: string;
  domicilio_actual?: string;
  fecha_emision: string;
  dias_validez: number;
  observaciones?: string;
  detalles: DetalleProformaItemForm[];
}

export interface CambiarEstadoProformaData {
  estado: ProformaEstado;
  paciente_id?: number | null;
  registrar_nuevo_paciente?: boolean;
  datos_paciente_extra?: {
    ocupacion?: string;
    estado_civil?: string;
    fecha_nacimiento?: string;
    telefono_emergencia?: string;
    nombre_contacto_emergencia?: string;
    apellido_contacto_emergencia?: string;
    parentesco_contacto_emergencia?: string;
  };
}
