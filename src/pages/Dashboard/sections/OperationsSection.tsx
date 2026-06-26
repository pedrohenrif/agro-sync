import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ClipboardList, CheckCircle2, Clock } from 'lucide-react';

const COLORS_TASKS = ['#ffa000', '#2196f3', '#4caf50'];

const OperationsSection: React.FC<{ tasks: any }> = ({ tasks }) => {
  const taskPieData = [
    { name: 'Pendentes', value: tasks.pending },
    { name: 'Em Curso',  value: tasks.inProgress },
    { name: 'Concluídas', value: tasks.completed },
  ];

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <ClipboardList size={20} className="text-amber-500" />
        <h2 className="text-lg font-bold text-slate-900">Eficiência Operacional</h2>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5 mb-5">
        {/* Taxa de Conclusão */}
        <div className="bg-white px-5 py-5 rounded-xl shadow-card border border-slate-200 flex items-center gap-4 transition-all hover:shadow-card-hover hover:-translate-y-0.5">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-emerald-500 to-emerald-600">
            <CheckCircle2 size={22} />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-[0.04em]">Taxa de Conclusão</span>
            <span className="text-[1.75rem] font-extrabold text-slate-900 leading-[1.1] mt-0.5">{tasks.completionRate}%</span>
            <div className="w-full h-[5px] bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-[width] duration-[800ms]"
                style={{ width: `${tasks.completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tarefas Atrasadas */}
        <div className={`bg-white px-5 py-5 rounded-xl shadow-card border flex items-center gap-4 transition-all hover:shadow-card-hover hover:-translate-y-0.5 ${tasks.overdue > 0 ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}>
          <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-red-500 to-red-600">
            <Clock size={22} />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-[0.04em]">Tarefas Atrasadas</span>
            <span className="text-[1.75rem] font-extrabold text-red-500 leading-[1.1] mt-0.5">{tasks.overdue}</span>
            {tasks.overdue > 0 && (
              <span className="text-xs text-red-500 font-bold uppercase">Ação Necessária</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div className="bg-white p-6 rounded-xl shadow-card border border-slate-200">
          <h3 className="text-base text-slate-900 font-semibold mb-5">Status das Atividades</h3>
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
