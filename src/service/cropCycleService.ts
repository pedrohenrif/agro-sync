import api from './api';

export const startPlanting = async (data: { gardenId: number; cropPlanId: number; startDate: string }) => {
  const response = await api.post('/crop-cycles', data);
  return response.data;
};