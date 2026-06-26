import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { DollarSign, Target, Maximize2, TrendingUp } from 'lucide-react';

const COLORS_CROP = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const StatCard = ({ icon, iconBg, label, value }: { icon: React.ReactNode; iconBg: string; label: string; value: string }) => (
  <div className="bg-white px-5 py-5 rounded-xl shadow-card border border-slate-200 flex items-center gap-4 transition-all hover:shadow-card-hover hover:-translate-y-0.5 cursor-default">
    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white ${iconBg}`}>
      {icon}
    </div>
    <div className="flex flex-col flex-1 min-w-0">
      <span className="text-xs text-slate-500 font-medium uppercase tracking-[0.04em]">{label}</span>
      <span className="text-[1.75rem] font-extrabold text-slate-900 leading-[1.1] mt-0.5">{value}</span>
    </div>
  </div>
);

const ProductionSection: React.FC<{ production: any; charts: any }> = ({ production, charts }) => (
  <section className="mb-10">
    <div className="flex items-center gap-3 mb-5">
      <TrendingUp size={20} className="text-emerald-500" />
      <h2 className="text-lg font-bold text-slate-900">Desempenho de Produção & Financeiro</h2>
    </div>

    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5 mb-5">
      <StatCard
        icon={<DollarSign size={22} />}
        iconBg="bg-gradient-to-br from-emerald-500 to-emerald-600"
        label="Receita Projetada"
        value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(production.projectedRevenue)}
      />
      <StatCard
        icon={<Target size={22} />}
        iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
        label="Estande Total (Plantas)"
        value={`${production.totalPlants.toLocaleString()} un`}
      />
      <StatCard
        icon={<Maximize2 size={22} />}
        iconBg="bg-gradient-to-br from-slate-500 to-slate-600"
        label="Área Ativa"
        value={`${production.totalArea} m²`}
      />
    </div>

    <div className="grid grid-cols-[2fr_1fr] gap-5 max-lg:grid-cols-1">
      <div className="bg-white p-6 rounded-xl shadow-card border border-slate-200">
        <div className="flex items-center gap-2 mb-5 text-slate-500">
          <h2 className="text-base text-slate-900 font-semibold">Evolução de Colheita (kg)</h2>
        </div>
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

      <div className="bg-white p-6 rounded-xl shadow-card border border-slate-200">
        <div className="flex items-center gap-2 mb-5">
          <h2 className="text-base text-slate-900 font-semibold">Mix de Plantio</h2>
        </div>
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

export default ProductionSection;
