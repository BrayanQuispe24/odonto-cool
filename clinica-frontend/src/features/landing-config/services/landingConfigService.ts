import api from '../../../services/api';
import type { LandingSettingsData } from '../types/landingConfig';

export interface LandingSettingsResponse {
  settings: LandingSettingsData;
  message?: string;
}

/**
 * Fetch public landing settings for visitors.
 */
export const getPublicLandingSettingsApi = async (): Promise<LandingSettingsData> => {
  const response = await api.get<LandingSettingsResponse>('/public/landing-settings');
  return response.data.settings;
};

/**
 * Fetch landing settings for admin dashboard.
 */
export const getAdminLandingSettingsApi = async (): Promise<LandingSettingsData> => {
  const response = await api.get<LandingSettingsResponse>('/landing-settings');
  return response.data.settings;
};

/**
 * Update landing settings with optional hero image upload.
 */
export const updateLandingSettingsApi = async (
  data: Partial<LandingSettingsData>,
  heroImageFile?: File
): Promise<LandingSettingsData> => {
  const formData = new FormData();

  if (heroImageFile) {
    formData.append('hero_imagen', heroImageFile);
  }

  if (data.hero) {
    formData.append('hero', JSON.stringify(data.hero));
  }
  if (data.contacto) {
    formData.append('contacto', JSON.stringify(data.contacto));
  }
  if (data.secciones_visibles) {
    formData.append('secciones_visibles', JSON.stringify(data.secciones_visibles));
  }
  if (data.anuncio_top) {
    formData.append('anuncio_top', JSON.stringify(data.anuncio_top));
  }

  const response = await api.post<LandingSettingsResponse>('/landing-settings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data.settings;
};
