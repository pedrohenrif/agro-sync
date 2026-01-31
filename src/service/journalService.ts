import api from './api';

export const getEntriesByGarden = async (gardenId: number) => {
  const response = await api.get(`/journals/garden/${gardenId}`);
  return response.data;
};

export const createEntry = async (data: any) => {
  const response = await api.post('/journals', data);
  return response.data;
};