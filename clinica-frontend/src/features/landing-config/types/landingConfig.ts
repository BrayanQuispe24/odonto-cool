export interface HeroStats {
  pacientes_count: number;
  pacientes_label: string;
  satisfaccion_count: number;
  satisfaccion_label: string;
  experiencia_count: number;
  experiencia_label: string;
  dolor_count: number;
  dolor_label: string;
}

export interface HeroConfig {
  titulo: string;
  subtitulo: string;
  cta_texto: string;
  secundario_texto: string;
  imagen_url: string;
  stats: HeroStats;
}

export interface ContactoConfig {
  whatsapp: string;
  whatsapp_mensaje: string;
  telefono: string;
  email: string;
  direccion: string;
  horario: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
}

export interface SeccionesVisiblesConfig {
  hero: boolean;
  especialidades: boolean;
  doctores: boolean;
  instalaciones: boolean;
  articulos: boolean;
  faqs: boolean;
}

export interface AnuncioTopConfig {
  activo: boolean;
  mensaje: string;
  enlace: string;
}

export interface LandingSettingsData {
  hero: HeroConfig;
  contacto: ContactoConfig;
  secciones_visibles: SeccionesVisiblesConfig;
  anuncio_top: AnuncioTopConfig;
}
