import api from '../service/api';

export const createSupply = async (data: {
  name: string;
  quantity: number;
  unitId: number;
  categoryId: number;
  isActive?: boolean;
}) => {
  try {
    const response = await api.post('/supplies', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar insumo:', error);
    throw new Error('Erro ao criar insumo');
  }
};

export const updateSupply = async (id: number, data: any) => {
  try {
    const response = await api.put(`/supplies/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar insumo:', error);
    throw new Error('Erro ao atualizar insumo');
  }
};

export const deleteSupply = async (id: number) => {
  try {
    const response = await api.delete(`/supplies/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir insumo:', error);
    throw new Error('Erro ao excluir insumo');
  }
};

export const getSupplys = async () => {
  try {
    const response = await api.get('/supplies');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar lista de Insumos:', error);
    throw new Error('Erro ao buscar Insumos');
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/supplies/categories');
    return response.data;
  } catch (erro) {
    console.error('Erro ao buscar categorias:', erro);
    throw new Error('Erro ao buscar categorias');
  }
};

export const getUnits = async () => {
  try {
    const response = await api.get('/supplies/units');
    return response.data;
  } catch (erro) {
    console.error('Erro ao buscar unidades:', erro);
    throw new Error('Erro ao buscar unidades');
  }
};