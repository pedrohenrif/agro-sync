import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './dashboard.css';
import { BarChart3, Leaf, CheckCircle } from 'lucide-react';

interface DashboardData {
  totalGardens: number;
  activeGardens: number;
  cropsDistribution: { crop: string; count: number }[];
}

const COLORS = ['#4CAF50', '#FF9800', '#03A9F4', '#E91E63', '#9C27B0'];

export default function DashboardStats() {
  const [data, setData] = useState<DashboardData>({
    totalGardens: 0,
    activeGardens: 0,
    cropsDistribution: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:3000/agroSync/dashboard/get-data-dashboard/${1}`);
        setData(response.data);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="stat-cards">
        <div className="stat-card total">
          <Leaf size={32} color="#ffffff" />
          <h3>Total de Hortas</h3>
          <p>{data.totalGardens}</p>
        </div>
        <div className="stat-card active">
          <CheckCircle size={32} color="#ffffff" />
          <h3>Hortas Ativas</h3>
          <p>{data.activeGardens}</p>
        </div>
      </div>

      <div className="charts">
        <div className="chart-box">
          <h4><BarChart3 size={20} /> Culturas Plantadas</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.cropsDistribution}
                dataKey="count"
                nameKey="crop"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {Array.isArray(data.cropsDistribution) &&
                  data.cropsDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
