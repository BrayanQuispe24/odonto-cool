import api from '../../../services/api';
import type { LandingFaq, LandingFaqFormData } from '../types/landingFaq';

export interface LandingFaqsResponse {
  faqs: LandingFaq[];
}

export interface LandingFaqSingleResponse {
  message?: string;
  faq: LandingFaq;
}

/**
 * Public FAQ endpoint for landing page visitors.
 */
export const getPublicFaqsApi = async (): Promise<LandingFaq[]> => {
  const response = await api.get<LandingFaqsResponse>('/public/faqs');
  return response.data.faqs;
};

/**
 * Admin FAQ endpoint to list all items (active & inactive).
 */
export const getAdminFaqsApi = async (): Promise<LandingFaq[]> => {
  const response = await api.get<LandingFaqsResponse>('/landing-faqs', {
    params: { all: true },
  });
  return response.data.faqs;
};

export const createFaqApi = async (data: LandingFaqFormData): Promise<LandingFaq> => {
  const response = await api.post<LandingFaqSingleResponse>('/landing-faqs', data);
  return response.data.faq;
};

export const updateFaqApi = async (
  id: number,
  data: Partial<LandingFaqFormData>
): Promise<LandingFaq> => {
  const response = await api.put<LandingFaqSingleResponse>(`/landing-faqs/${id}`, data);
  return response.data.faq;
};

export const deleteFaqApi = async (id: number): Promise<void> => {
  await api.delete(`/landing-faqs/${id}`);
};
