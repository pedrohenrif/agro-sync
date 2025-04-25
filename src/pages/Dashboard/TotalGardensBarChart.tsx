import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonthlyData {
  month: string;
  total: number;
}

const monthlyData: MonthlyData[] = [
  { month: 'Jan', total: 30 },
  { month: 'Feb', total: 45 },
  { month: 'Mar', total: 60 },
  { month: 'Apr', total: 80 },
  { month: 'May', total: 100 },
];

const TotalGardensBarChart = () => (
  <div className="chart-box">
    <h4>Total de Hortas por Mês</h4>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthlyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#4CAF50" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default TotalGardensBarChart;
