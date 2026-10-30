export interface LandingFaq {
  id: number;
  pregunta: string;
  respuesta: string;
  orden: number;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LandingFaqFormData {
  pregunta: string;
  respuesta: string;
  orden: number;
  estado: boolean;
}
