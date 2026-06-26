import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Calendar as CalendarIcon, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import * as taskService from '../../service/taskService';

const PRIORITY_BADGE: Record<string, string> = {
  HIGH:   'bg-red-50 text-red-700 border border-red-200',
  MEDIUM: 'bg-amber-50 text-amber-700 border border-amber-200',
  LOW:    'bg-slate-100 text-slate-600 border border-slate-200',
};
const PRIORITY_LABEL: Record<string, string> = { HIGH: 'Urgente', MEDIUM: 'Normal', LOW: 'Baixa' };

const TaskAgenda = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodayTasks = async () => {
    setLoading(true);
    try { setTasks(await taskService.getTodayTasks()); }
    catch { toast.error("Não foi possível carregar as tarefas de hoje."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTodayTasks(); }, []);

  const handleToggleTask = async (taskId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await taskService.updateTaskStatus(taskId, newStatus as any);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      if (newStatus === 'COMPLETED') toast.success("Tarefa concluída!");
    } catch { toast.error("Erro ao atualizar o status da tarefa."); }
  };

  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <CalendarIcon size={28} className="text-emerald-600" />
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Agenda de Hoje</h1>
          <p className="text-sm text-slate-500 capitalize">{today}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[300px] gap-3 text-emerald-600 font-semibold">
          <Loader2 size={20} className="animate-spin" /> Carregando atividades...
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">Tudo pronto!</h3>
          <p className="text-sm text-slate-500">Você não tem tarefas pendentes para hoje.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-w-2xl">
          {tasks.map(task => (
            <div key={task.id}
              className={`flex items-center gap-4 px-4 py-4 bg-white rounded-xl border transition-all
                ${task.status === 'COMPLETED' ? 'border-emerald-200 opacity-70' : 'border-slate-200 hover:border-emerald-300 shadow-sm'}`}>
              <button onClick={() => handleToggleTask(task.id, task.status)}
                className="flex-shrink-0 transition-transform hover:scale-110">
                {task.status === 'COMPLETED'
                  ? <CheckCircle2 size={26} className="text-emerald-500" />
                  : <Circle size={26} className="text-slate-300" />}
              </button>
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-semibold ${task.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  {task.garden?.name && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin size={11} /> {task.garden.name}
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${PRIORITY_BADGE[task.priority] || PRIORITY_BADGE.LOW}`}>
                    {PRIORITY_LABEL[task.priority] || 'Baixa'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskAgenda;
