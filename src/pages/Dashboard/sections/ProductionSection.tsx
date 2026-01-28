import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { DollarSign, Target, TrendingUp, Activity, Leaf, Maximize2 } from 'lucide-react';

const COLORS_CROP = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

interface ProductionSectionProps {
  production: any;
  charts: any;
}

const ProductionSection: React.FC<ProductionSectionProps> = ({ production, charts }) => {
  return (
    <section className="dashboard-section">
      <div className="section-header">
        <TrendingUp size={20} className="text-emerald" />
        <h2>Desempenho de Produção & Financeiro</h2>
      </div>

      <div className="stats-grid">
        {/* Card de Receita */}
        <div className="stat-card highlight">
          <div className="stat-icon bg-emerald"><DollarSign /></div>
          <div className="stat-info">
            <span className="stat-label">Receita Projetada</span>
            <span className="stat-value text-emerald">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(production.projectedRevenue)}
            </span>
          </div>
        </div>

        {/* Card de Plantas */}
        <div className="stat-card">
          <div className="stat-icon bg-blue"><Target /></div>
          <div className="stat-info">
            <span className="stat-label">Estande Total (Plantas)</span>
            <span className="stat-value">{production.totalPlants.toLocaleString()} un</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-slate"><Maximize2 /></div>
          <div className="stat-info">
            <span className="stat-label">Área Ativa</span>
            <span className="stat-value">{production.totalArea} m²</span>
          </div>
        </div>
      </div>

      <div className="charts-container">
        {/* Gráfico de Linha - Produção */}
        <div className="chart-card main-chart">
          <h3>Evolução de Colheita (kg)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={charts.harvestHistory}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pizza - Culturas */}
        <div className="chart-card">
          <h3>Mix de Plantio</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={charts.cropsDistribution} innerRadius={60} outerRadius={80} dataKey="value">
                {charts.cropsDistribution.map((_entry: any, index: number) => (
                  <Cell key={index} fill={COLORS_CROP[index % COLORS_CROP.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default ProductionSection;