export interface Antecedente {
  id: number;
  paciente_id: number;
  tiene_diabetes: boolean;
  descripcion_diabetes?: string | null;
  tiene_hipertencion: boolean;
  descripcion_hipertencion?: string | null;
  tiene_cancer: boolean;
  descripcion_cancer?: string | null;
  tiene_reumatismo: boolean;
  descripcion_reumatismo?: string | null;
  tiene_alergias: boolean;
  descripcion_alergias?: string | null;
  tiene_gastritis: boolean;
  descripcion_gastritis?: string | null;
  otros?: string | null;
  esta_siendo_atendido_por_otro_doctor: boolean;
  esta_tomando_algun_medicamento: boolean;
  descripcion_medicamentos?: string | null;
  lo_han_intervenido_quirurgicamente: boolean;
  descripcion_intervencion?: string | null;
  esta_embarazada: boolean;
  descripcion_embarazo?: string | null;
  created_at?: string;
  updated_at?: string;
}
