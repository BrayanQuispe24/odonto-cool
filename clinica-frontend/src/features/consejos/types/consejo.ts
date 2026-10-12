export interface Consejo {
  id: number;
  titulo: string;
  categoria?: string | null;
  descripcion: string;
  imagen_url?: string | null;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ConsejoFormData {
  titulo: string;
  categoria?: string;
  descripcion: string;
  imagen?: File;
  estado?: boolean;
}
