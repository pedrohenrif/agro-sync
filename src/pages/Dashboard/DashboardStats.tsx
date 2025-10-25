// ARQUIVO: src/pages/Dashboard/DashboardStats.tsx

import React, { useEffect, useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import { Leaf, CheckCircle, Maximize2, Sprout, CalendarDays, BarChart3, AlertTriangle, ListChecks, Siren } from 'lucide-react';
import api from '../../service/api'; // Certifique-se que o caminho está correto

import './dashboard.css'; // O CSS que estiliza ESTE componente

// --- Interfaces (Podem ir para um arquivo types.ts depois) ---
interface DashboardData {
  totalGardens: number;
  activeGardens: number;
  cropsDistribution: { crop: string; count: number }[];
  averageSize: number;
  uniqueCrops: number;
  oldestGardenDate: string;
  recentProblemCount?: number;
}

interface CropData {
  name: string;
  value: number;
}

interface RecentActivity {
  id: number;
  date: string;
  type: string;
  description: string;
  gardenName?: string;
}

// --- Constantes ---
const PIE_CHART_COLORS = ['#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#FF5722'];
const FAKE_USER_ID = 1; // Substitua pela lógica real de obtenção do ID do usuário

// --- Componente Principal ---
export default function DashboardStats() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  // --- Efeito para buscar dados ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsLoadingActivities(true);
      setError(null);
      try {
        // Busca principal
        const dashboardResponse = await api.get(`/dashboard/get-data-dashboard/${FAKE_USER_ID}`);
        setData(dashboardResponse.data);

        // Busca de atividades (SIMULADA - substitua pela chamada real)
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockActivities: RecentActivity[] = [
          { id: 1, date: '2025-10-25', type: 'Diário', description: 'Adubação realizada no Canteiro Principal', gardenName: 'Canteiro Principal' },
          { id: 2, date: '2025-10-24', type: 'Diário', description: 'Identificada praga (pulgões) na Horta de Ervas', gardenName: 'Horta de Ervas'},
          { id: 3, date: '2025-10-23', type: 'Colheita', description: 'Colhido 1.5kg de Tomate Cereja', gardenName: 'Canteiro de Tomates'},
        ];
        setRecentActivities(mockActivities);

      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
        setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
        toast.error('Erro ao carregar dados do dashboard!');
      } finally {
        setIsLoading(false);
        setIsLoadingActivities(false);
      }
    };
    fetchData();
  }, []);

  // --- Preparação de dados para o gráfico ---
  const pieChartData: CropData[] = useMemo(() => {
    if (!data?.cropsDistribution || !Array.isArray(data.cropsDistribution)) return [];
    return data.cropsDistribution.map(item => ({ name: item.crop, value: item.count }));
  }, [data]);

  // --- Cálculo de porcentagem ---
  const activePercentage = data && data.totalGardens > 0
    ? ((data.activeGardens / data.totalGardens) * 100).toFixed(0)
    : 0;

  // --- Renderização ---
  return (
    // Note: O container principal agora pode ser só um Fragment ou div simples,
    // pois o container principal da PÁGINA estará no Dashboard.tsx
    <>
      <h1 className="dashboard-title">
        <BarChart3 size={28} /> Visão Geral da Operação
      </h1>

      {/* Grid de KPIs */}
      {isLoading ? (
         <div className="loading-message">Carregando indicadores...</div>
      ) : error ? (
         <div className="error-message">{error}</div>
      ) : data ? (
          <div className="kpi-grid">
            {/* KPI Cards */}
            <div className="kpi-card">
              <div className="kpi-icon icon-total"><Leaf size={24} /></div>
              <div className="kpi-content"><h3>Total de Canteiros</h3><p className="kpi-value">{data.totalGardens}</p></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon icon-active"><CheckCircle size={24} /></div>
              <div className="kpi-content"><h3>Canteiros Ativos</h3><p className="kpi-value">{data.activeGardens} <span className="kpi-percentage">({activePercentage}%)</span></p></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon icon-size"><Maximize2 size={24} /></div>
              <div className="kpi-content"><h3>Área Média / Canteiro</h3><p className="kpi-value">{data.averageSize.toFixed(1)} m²</p></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon icon-crops"><Sprout size={24} /></div>
              <div className="kpi-content"><h3>Culturas Diferentes</h3><p className="kpi-value">{data.uniqueCrops}</p></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon icon-date"><CalendarDays size={24} /></div>
              <div className="kpi-content"><h3>Início da Atividade</h3><p className="kpi-value">{new Date(data.oldestGardenDate).toLocaleDateString()}</p></div>
            </div>
            {/* Card de Alertas (condicional) */}
            {data.recentProblemCount !== undefined && data.recentProblemCount > 0 && (
                 <div className="kpi-card alert-card">
                    <div className="kpi-icon icon-alert"><Siren size={24} /></div>
                    <div className="kpi-content"><h3>Alertas (7 dias)</h3><p className="kpi-value">{data.recentProblemCount}</p><span className="kpi-subtext">Pragas/Doenças</span></div>
                 </div>
            )}
          </div>
      ) : null }

      {/* Seção de Colunas (Gráfico e Atividade) */}
      <div className="dashboard-columns">
        {/* Coluna Gráfico */}
        <div className="column column-chart">
           {isLoading ? (
               <div className="loading-message">Carregando gráfico...</div>
           ) : data && pieChartData.length > 0 ? (
               <div className="chart-section">
                 <h2 className="chart-title">Distribuição de Culturas</h2>
                 <div className="chart-container">
                   <ResponsiveContainer width="100%" height={350}>
                     <PieChart>
                       <Pie data={pieChartData} cx="50%" cy="50%" labelLine={false} outerRadius={120} fill="#8884d8" dataKey="value" nameKey="name">
                         {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />)}
                       </Pie>
                       <Tooltip formatter={(value: number, name: string) => [`${value} canteiro(s)`, name]} />
                       <Legend />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
               </div>
           ) : !isLoading && !error ? (
                <div className="empty-chart-message">Sem dados de cultura para exibir.</div>
           ) : null }
        </div>

        {/* Coluna Atividade Recente */}
        <div className="column column-activity">
          <div className="activity-section">
            <h2 className="activity-title"><ListChecks size={20} /> Atividade Recente</h2>
            {isLoadingActivities ? (
              <div className="loading-message small">Carregando atividades...</div>
            ) : recentActivities.length === 0 ? (
              <p className="empty-activity-message">Nenhuma atividade recente registrada.</p>
            ) : (
              <ul className="activity-list">
                {recentActivities.map(activity => (
                  <li key={activity.id} className="activity-item">
                    <span className="activity-date">{new Date(activity.date).toLocaleDateString()}</span>
                    <strong className={`activity-type type-${activity.type.toLowerCase()}`}>{activity.type}</strong>
                    <p className="activity-description">
                      {activity.description} {activity.gardenName && ` (em ${activity.gardenName})`}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </> // Usando Fragment <>...</> como container principal
  );
}