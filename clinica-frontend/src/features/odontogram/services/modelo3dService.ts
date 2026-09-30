import api from '../../../services/api';

export interface Modelo3DItem {
  id: number;
  nombre: string;
  descripcion?: string | null;
  archivo_path: string;
  tamanio_bytes: number;
  mime_type?: string;
  url: string;
  user_id?: number | null;
  created_at?: string;
  updated_at?: string;
}

export const modelo3dService = {
  /**
   * Fetch all uploaded 3D GLB models from backend Laravel
   */
  async getModelos(): Promise<Modelo3DItem[]> {
    const response = await api.get<Modelo3DItem[]>('/modelos-3d');
    return response.data;
  },

  /**
   * Upload a new .glb model file to backend Laravel
   */
  async uploadModelo(
    nombre: string,
    file: File,
    descripcion?: string,
    onProgress?: (percent: number) => void
  ): Promise<Modelo3DItem> {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('archivo', file);
    if (descripcion) {
      formData.append('descripcion', descripcion);
    }

    const response = await api.post<{ message: string; data: Modelo3DItem }>('/modelos-3d', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    return response.data.data;
  },

  /**
   * Delete a model by ID from backend Laravel
   */
  async deleteModelo(id: number): Promise<void> {
    await api.delete(`/modelos-3d/${id}`);
  },
};
