import api from './api';
import { CropPlan } from '../pages/CropPlans/types';

// Buscar todos os planos da organização
export const getCropPlans = async (): Promise<CropPlan[]> => {
  try {
    const response = await api.get('/crop-plans');
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar planos de cultivo:", error.response?.data || error.message);
    throw error;
  }
};

// Buscar um plano específico pelo ID
export const getCropPlanById = async (id: number): Promise<CropPlan> => {
  try {
    const response = await api.get(`/crop-plans/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao buscar plano ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Criar um novo plano
export const createCropPlan = async (data: CropPlan): Promise<CropPlan> => {
  try {
    const response = await api.post('/crop-plans', data);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar plano de cultivo:", error.response?.data || error.message);
    throw error;
  }
};

// Atualizar um plano existente
export const updateCropPlan = async (id: number, data: Partial<CropPlan>): Promise<CropPlan> => {
  try {
    const response = await api.put(`/crop-plans/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao atualizar plano ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Excluir um plano
export const deleteCropPlan = async (id: number): Promise<void> => {
  try {
    await api.delete(`/crop-plans/${id}`);
  } catch (error: any) {
    console.error(`Erro ao excluir plano ${id}:`, error.response?.data || error.message);
    throw error;
  }
};