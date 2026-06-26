import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { getDashboardData } from '../../service/dashboardService';
import ProductionSection from './sections/ProductionSection';
import OperationsSection from './sections/OperationsSection';
import InventoryBanner from './components/InventoryBanner';

const DashboardHub: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .catch(() => toast.error('Falha ao sincronizar painel de controle.'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return (
    <div className="flex items-center justify-center h-[300px] gap-3 text-emerald-600 font-semibold">
      <Loader2 size={20} className="animate-spin" />
      Carregando inteligência de dados...
    </div>
  );

  if (!data) return (
    <div className="flex items-center justify-center h-[300px] text-slate-500">
      Nenhum dado disponível no momento.
    </div>
  );

  return (
    <div className="animate-fade-in">
      <header className="flex justify-between items-start mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Gestão Centralizada</h1>
          <p className="mt-1 text-sm text-slate-500">Dados consolidados da sua organização agrícola</p>
        </div>
      </header>

      <ProductionSection production={data.production} charts={data.charts} />
      <OperationsSection tasks={data.tasks} />

      {data.inventory.lowStockAlerts > 0 && (
        <InventoryBanner count={data.inventory.lowStockAlerts} />
      )}
    </div>
  );
};

export default DashboardHub;
