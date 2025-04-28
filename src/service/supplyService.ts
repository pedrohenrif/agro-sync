// src/services/supplyService.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/agroSync',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createSupply = async (data: {
  name: string;
  quantity: number;
  unitId: number;
  categoryId: number;
  userId: number;
  isActive?: boolean;
}) => {
  try {
    const response = await api.post('/supply/add', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar insumo:', error);
    throw new Error('Erro ao criar insumo');
  }
};

export const updateSupply = async (id: number, data: any) => {
  try {
    const response = await api.put(`/supply/update/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar insumo:', error);
    throw new Error('Erro ao atualizar insumo');
  }
};

export const deleteSupply = async (id: number) => {
  try {
    const response = await api.put(`/supply/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir insumo:', error);
    throw new Error('Erro ao excluir insumo');
  }
};