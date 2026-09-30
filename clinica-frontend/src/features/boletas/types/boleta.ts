import type { Cita } from '../../citas/types/cita';
import type { Doctor } from '../../doctors/types/doctor';
import type { Servicio } from '../../services/types/servicio';
import type { Diente } from '../../dientes/types/diente';

export interface DetalleServicioPrestado {
  id?: number;
  boleta_servicio_prestado_id?: number;
  servicio_id: number;
  diente_id?: number | null;
  descripcion?: string | null;
  descuento: number;
  servicio?: Servicio;
  diente?: Diente;
}

export interface Cuota {
  id?: number;
  boleta_servicio_prestado_id?: number;
  numero_cuota?: number;
  fecha_pago?: string | null;
  modo_pago?: string | null;
  monto_cuota: number;
  metodo_pago?: string | null;
  url_comprobante?: string | null;
  estado?: 'pendiente' | 'pagado';
  created_at?: string;
}

export type BoletaEstado = 'completado' | 'pendiente' | 'anulada' | 'emitida' | 'pagada';

export interface BoletaServicioPrestado {
  id: number;
  cita_id: number;
  doctor_id?: number | null;
  fecha_emision: string;
  numero_boleta: string;
  emitido_por: string;
  monto_total: number;
  tipo_pago?: string;
  tipo_paga?: string;
  cantidad_cuotas: number;
  metodo_pago?: string;
  porcentaje_comision_dr?: number;
  monto_comision_dr?: number;
  costo_laboratorio?: number;
  url_comprobante?: string | null;
  estado: BoletaEstado;
  created_at?: string;
  updated_at?: string;
  cita?: Cita;
  doctor?: Doctor;
  detalles?: DetalleServicioPrestado[];
  cuotas?: Cuota[];
}

export interface DetalleServicioItem {
  servicio_id: number;
  diente_id?: number | null;
  descripcion?: string;
  descuento: number;
  precio_unitario?: number;
}

export interface BoletaFormData {
  cita_id: number;
  doctor_id?: number | null;
  fecha_emision: string;
  numero_boleta?: string;
  emitido_por: string;
  monto_total: number;
  tipo_pago?: string;
  tipo_paga?: string;
  cantidad_cuotas: number;
  metodo_pago?: string;
  porcentaje_comision_dr?: number;
  monto_comision_dr?: number;
  costo_laboratorio?: number;
  estado?: BoletaEstado;
  detalles: DetalleServicioItem[];
  cuotas?: {
    numero_cuota?: number;
    fecha_pago?: string;
    modo_pago?: string;
    monto_cuota: number;
    metodo_pago?: string;
    url_comprobante?: string;
    estado?: 'pendiente' | 'pagado';
  }[];
}
