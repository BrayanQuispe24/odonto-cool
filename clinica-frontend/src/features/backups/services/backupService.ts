import api from '../../../services/api';
import type { Backup } from '../types/backup';

export const getBackupsApi = async (): Promise<Backup[]> => {
  const response = await api.get('/backups');
  return response.data;
};

export const createBackupApi = async (): Promise<{ message: string; filename: string }> => {
  const response = await api.post('/backups/create');
  return response.data;
};

export const restoreBackupApi = async (filename: string): Promise<{ message: string }> => {
  const response = await api.post('/backups/restore', { filename });
  return response.data;
};

export const deleteBackupApi = async (filename: string): Promise<{ message: string }> => {
  const response = await api.delete(`/backups/${filename}`);
  return response.data;
};

export const uploadBackupApi = async (file: File): Promise<{ message: string; filename: string }> => {
  const formData = new FormData();
  formData.append('backup_file', file);
  
  const response = await api.post('/backups/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
