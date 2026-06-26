import React, { useEffect, useState, useMemo } from 'react';
import { PlusCircle, ClipboardList, Loader2 } from 'lucide-react';
import { Task, TaskStatus } from './types';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import { toast } from 'react-toastify';
import * as taskService from '../../service/taskService';

const COLUMNS: { key: keyof ReturnType<typeof useCols>; label: string; dot: string }[] = [
  { key: 'pending',     label: 'A Fazer',      dot: 'bg-slate-400' },
  { key: 'in_progress', label: 'Em Andamento',  dot: 'bg-blue-500' },
  { key: 'done',        label: 'Concluído',     dot: 'bg-emerald-500' },
];

function useCols(tasks: Task[]) {
  return useMemo(() => ({
    pending:     tasks.filter(t => t.status === 'PENDING'),
    in_progress: tasks.filter(t => t.status === 'IN_PROGRESS'),
    done:        tasks.filter(t => t.status === 'DONE'),
  }), [tasks]);
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const cols = useCols(tasks);

  const fetchTasks = async () => {
    setIsLoading(true);
    try { setTasks(await taskService.getTasks()); }
    catch { toast.error("Erro ao carregar tarefas!"); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleUpdateStatus = async (id: number, status: TaskStatus) => {
    try {
      await taskService.updateTaskStatus(id, status);
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    } catch { toast.error("Erro ao atualizar status."); }
  };

  const handleDelete = async (id: number) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success("Tarefa excluída.");
    } catch { toast.error("Erro ao excluir tarefa."); }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <ClipboardList size={28} className="text-emerald-600" />
          <h1 className="text-2xl font-extrabold text-slate-900">Gerenciador de Tarefas</h1>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-all hover:-translate-y-px shadow-sm"
        >
          <PlusCircle size={18} /> Nova Tarefa
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[300px] gap-3 text-emerald-600 font-semibold">
          <Loader2 size={20} className="animate-spin" /> Sincronizando tarefas...
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
          {COLUMNS.map(col => (
            <div key={col.key} className="bg-slate-50 rounded-xl border border-slate-200 flex flex-col min-h-[400px]">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200">
                <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                <h3 className="text-sm font-semibold text-slate-700">
                  {col.label} <span className="text-slate-400 font-normal">({cols[col.key].length})</span>
                </h3>
              </div>
              <div className="flex flex-col gap-3 p-3 flex-1">
                {cols[col.key].map(task => (
                  <div key={task.id} onClick={() => setSelectedTask(task)} className="cursor-pointer">
                    <TaskCard task={task} onUpdateStatus={handleUpdateStatus} onDelete={handleDelete} />
                  </div>
                ))}
                {cols[col.key].length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-sm text-slate-400 py-8">
                    Nenhuma tarefa
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddTaskModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={fetchTasks} />
      <EditTaskModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={fetchTasks}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TaskManager;
