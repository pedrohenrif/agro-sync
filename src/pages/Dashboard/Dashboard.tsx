import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './dashboard.css';
import { BarChart3, Leaf, CheckCircle } from 'lucide-react';
import TotalGardensBarChart from './TotalGardensBarChart';


interface DashboardData {
  totalGardens: number;
  activeGardens: number;
  cropsDistribution: { crop: string; count: number }[];
  averageSize: number;
  uniqueCrops: number;
  oldestGardenDate: string;
}

const COLORS = ['#4CAF50', '#FF9800', '#03A9F4', '#E91E63', '#9C27B0'];

export default function DashboardStats() {
  const [data, setData] = useState<DashboardData | null>(null);

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

  if (!data) return <p>Carregando estatísticas...</p>;

  const cropsDistribution = Array.isArray(data.cropsDistribution) ? data.cropsDistribution : [];

  const scrollCards = (direction: 'left' | 'right') => {
    const container = document.getElementById('scrollCards');
    if (container) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="dashboard-container">
      <div className="stat-cards-wrapper">
        <div
          className="scroll-zone left"
          onMouseEnter={() => scrollCards('left')}
        />
        <div
          className="scroll-zone right"
          onMouseEnter={() => scrollCards('right')}
        />
  
        <div className="stat-cards" id="scrollCards">
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

          <div className="stat-card average-size">
            <h3>Área Média</h3>
            <p>{data.averageSize.toFixed(2)} m²</p>
          </div>

          <div className="stat-card unique-crops">
            <h3>Culturas Únicas</h3>
            <p>{data.uniqueCrops}</p>
          </div>

          <div className="stat-card oldest-garden">
            <h3>Horta Mais Antiga</h3>
            <p>{new Date(data.oldestGardenDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
  
      <TotalGardensBarChart /> 
    </div>
  );  
}
