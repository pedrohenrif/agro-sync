import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getDashboardData } from '../../service/dashboardService';

// Importação dos componentes que vamos criar a seguir
import ProductionSection from './sections/ProductionSection';
import OperationsSection from './sections/OperationsSection';
import InventoryBanner from './components/InventoryBanner';

import './dashboard.css';

const DashboardHub: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDashboardData();
        setData(result);
      } catch (err) {
        toast.error('Falha ao sincronizar painel de controle.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div className="loading-state">Carregando inteligência de dados...</div>;
  if (!data) return <div className="error-state">Nenhum dado disponível no momento.</div>;

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div>
          <h1>Gestão Centralizada</h1>
          <p>Dados consolidados da sua organização agrícola</p>
        </div>
      </header>

      {/* Seção 1: Produção e Financeiro */}
      <ProductionSection 
        production={data.production} 
        charts={data.charts} 
      />

      {/* Seção 2: Operações e Tarefas */}
      <OperationsSection 
        tasks={data.tasks} 
      />

      {/* Alerta Global de Estoque (Se houver) */}
      {data.inventory.lowStockAlerts > 0 && (
        <InventoryBanner count={data.inventory.lowStockAlerts} />
      )}
    </div>
  );
};

export default DashboardHub;