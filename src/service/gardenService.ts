// src/services/gardenService.ts
import api from '../service/api';
import { Garden } from '../pages/Gardens/types';

export const getGardens = async (): Promise<Garden[]> => {
  const response = await api.get('/gardens');
  return response.data;
};

export const createGarden = async (data: Partial<Garden>): Promise<Garden> => {
  const response = await api.post('/gardens', data);
  return response.data;
};

export const updateGarden = async (id: number, data: Partial<Garden>): Promise<Garden> => {
  const response = await api.put(`/gardens/${id}`, data);
  return response.data;
};

export const deleteGarden = async (id: number): Promise<void> => {
  await api.delete(`/gardens/${id}`);
};

export const addJournalEntry = async (data: any) => {
  const response = await api.post('/gardens/journal', data);
  return response.data;
};

// src/service/gardenService.ts
export const getGardenTasks = (gardenId: number) => {
  return api.get(`/tasks/garden/${gardenId}`).then(res => res.data);
};

export const getGardenJournal = (id: number) => api.get(`/gardens/${id}/journal`).then(res => res.data);
export const getSupplyHistory = (id: number) => api.get(`/usage/history/${id}`).then(res => res.data);