import { create } from 'zustand';
import type { Expediente } from '../types/expediente';
import { expedienteService } from '../services/expedienteService';

interface ExpedienteState {
  expedientes: Expediente[];
  isLoading: boolean;
  error: string | null;
  
  fetchExpedientes: () => Promise<void>;
  uploadExpediente: (formData: FormData) => Promise<Expediente>;
  deleteExpediente: (id: number) => Promise<void>;
}

export const useExpedienteStore = create<ExpedienteState>((set, get) => ({
  expedientes: [],
  isLoading: false,
  error: null,

  fetchExpedientes: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await expedienteService.getAll();
      set({ expedientes: data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Error al cargar los expedientes', 
        isLoading: false 
      });
    }
  },

  uploadExpediente: async (formData: FormData) => {
    try {
      set({ isLoading: true, error: null });
      const newExpediente = await expedienteService.upload(formData);
      set({ 
        expedientes: [newExpediente, ...get().expedientes], 
        isLoading: false 
      });
      return newExpediente;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Error al subir el expediente', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteExpediente: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await expedienteService.delete(id);
      set({ 
        expedientes: get().expedientes.filter((e) => e.id !== id), 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Error al eliminar el expediente', 
        isLoading: false 
      });
      throw error;
    }
  },
}));
