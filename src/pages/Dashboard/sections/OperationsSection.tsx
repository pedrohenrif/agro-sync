import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ClipboardList, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

const COLORS_TASKS = ['#ffa000', '#2196f3', '#4caf50']; // Pendente, Em Curso, Concluído

interface OperationsSectionProps {
  tasks: any;
}

const OperationsSection: React.FC<OperationsSectionProps> = ({ tasks }) => {
  const taskPieData = [
    { name: 'Pendentes', value: tasks.pending },
    { name: 'Em Curso', value: tasks.inProgress },
    { name: 'Concluídas', value: tasks.completed }
  ];

  return (
    <section className="dashboard-section operations">
      <div className="section-header">
        <ClipboardList size={20} className="text-amber" />
        <h2>Eficiência Operacional</h2>
      </div>

      <div className="stats-grid">
        {/* KPI de Eficiência */}
        <div className="stat-card">
          <div className="stat-icon bg-emerald"><CheckCircle2 /></div>
          <div className="stat-info">
            <span className="stat-label">Taxa de Conclusão</span>
            <span className="stat-value">{tasks.completionRate}%</span>
            <div className="mini-progress-bar">
              <div className="fill" style={{ width: `${tasks.completionRate}%` }}></div>
            </div>
          </div>
        </div>

        {/* KPI de Atrasos (Crítico) */}
        <div className={`stat-card ${tasks.overdue > 0 ? 'alert-card-critical' : ''}`}>
          <div className="stat-icon bg-red"><Clock /></div>
          <div className="stat-info">
            <span className="stat-label">Tarefas Atrasadas</span>
            <span className="stat-value text-red">{tasks.overdue}</span>
            {tasks.overdue > 0 && <span className="overdue-tag">Ação Necessária</span>}
          </div>
        </div>
      </div>

      <div className="charts-container single-chart">
        <div className="chart-card">
          <h3>Status das Atividades</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={taskPieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {taskPieData.map((_entry, index) => (
                  <Cell key={index} fill={COLORS_TASKS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default OperationsSection;