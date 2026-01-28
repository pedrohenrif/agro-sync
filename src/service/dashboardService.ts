import api from '../service/api';

export const getDashboardData = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    throw new Error('Não foi possível carregar o resumo da fazenda.');
  }
};