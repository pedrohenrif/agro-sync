import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Clock, Calendar, AlertTriangle, ListChecks, Loader2 } from 'lucide-react';
import * as gardenService from '../../../../service/gardenService';
import * as taskService from '../../../../service/taskService';
import EditTaskModal from '../../../TaskManager/EditTaskModal';

const TabTasks: React.FC<{ garden: any }> = ({ garden }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const fetchGardenTasks = useCallback(() => {
    setLoading(true);
    gardenService.getGardenTasks(garden.id)
      .then(data => setTasks(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [garden.id]);

  useEffect(() => { fetchGardenTasks(); }, [fetchGardenTasks]);

  const isOverdue = (dueDate: string, status: string) =>
    status !== 'DONE' && new Date(dueDate) < new Date();

  const doneCount = tasks.filter(t => t.status === 'DONE').length;

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <ListChecks size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Cronograma do Lote</h3>
            <p className="text-xs text-slate-500">Gerencie as atividades planejadas para este canteiro.</p>
          </div>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          <strong className="text-emerald-600">{doneCount}</strong> de {tasks.length} concluídas
        </span>
      </div>

      {/* Task list */}
      {loading ? (
        <div className="flex items-center justify-center h-32 gap-3 text-emerald-600 font-semibold">
          <Loader2 size={18} className="animate-spin" /> Carregando cronograma...
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
          <Calendar size={32} className="text-slate-300" />
          <p className="text-sm">Nenhuma tarefa agendada para este lote.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map(task => {
            const overdue = isOverdue(task.dueDate, task.status);
            return (
              <div key={task.id} onClick={() => setSelectedTask(task)} className={`flex gap-4 px-4 py-3 bg-white rounded-xl border transition cursor-pointer hover:shadow-sm
                ${task.status === 'DONE' ? 'border-emerald-200 opacity-75' : overdue ? 'border-red-200' : 'border-slate-200 hover:border-emerald-200'}`}>
                <div className="flex-shrink-0 pt-0.5">
                  {task.status === 'DONE'
                    ? <CheckCircle size={20} className="text-emerald-500" />
                    : overdue
                      ? <AlertTriangle size={20} className="text-red-500" />
                      : <Clock size={20} className="text-slate-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className={`text-sm font-semibold ${task.status === 'DONE' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </h4>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0
                      ${overdue ? 'bg-red-100 text-red-700' : task.status === 'DONE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {overdue ? 'ATRASADO' : task.status === 'DONE' ? 'CONCLUÍDO' : 'PENDENTE'}
                    </span>
                  </div>
                  {task.description && <p className="text-xs text-slate-500 mb-1 line-clamp-1">{task.description}</p>}
                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar size={11} /> {new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <EditTaskModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={fetchGardenTasks}
        onDelete={async (id) => { await taskService.deleteTask(id); fetchGardenTasks(); }}
      />
    </div>
  );
};

export default TabTasks;
