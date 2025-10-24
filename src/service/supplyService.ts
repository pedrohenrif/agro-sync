// src/services/supplyService.ts
import axios from 'axios';
import api from '../service/api';

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

export const getCategories = async () => {
  try {
    const response = await api.get('/supply/get-categories');
    return response.data;

  } catch (erro) {
    console.log('Erro ao buscar categorias:', erro)
    throw new Error('Erro ao buscar categorias')
  }
};

export const getSupplys = async () => {
  try{
    const response = await api.get('/supply/get-supplys');
    return response.data;

  } catch (error) {
    console.log('Erro ao buscar lista de Insumos:', error)
    throw new Error('Erro ao buscar Insumos')
  }
};