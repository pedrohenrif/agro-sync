import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Calendar as CalendarIcon, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import * as taskService from '../../service/taskService';
import './TaskAgenda.css';

const TaskAgenda = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodayTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getTodayTasks();
      setTasks(data);
    } catch (err) {
      toast.error("Não foi possível carregar as tarefas de hoje.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTodayTasks(); }, []);

  const handleToggleTask = async (taskId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await taskService.updateTaskStatus(taskId, newStatus as any);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      if (newStatus === 'COMPLETED') toast.success("Tarefa concluída!");
    } catch (err) {
      toast.error("Erro ao atualizar o status da tarefa.");
    }
  };

  return (
    <div className="agenda-container">
      <header className="agenda-header">
        <h1><CalendarIcon size={32} /> Agenda de Hoje</h1>
        <p>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </header>

      {loading ? (
        <div className="agenda-loader"><Loader2 className="animate-spin" /> Carregando atividades...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-agenda">
          <CheckCircle2 size={48} color="#2e7d32" />
          <p>Tudo pronto! Você não tem tarefas pendentes para hoje.</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map(task => (
            <div key={task.id} className={`task-item ${task.status === 'COMPLETED' ? 'done' : ''}`}>
              <button className="check-btn" onClick={() => handleToggleTask(task.id, task.status)}>
                {task.status === 'COMPLETED' ? 
                  <CheckCircle2 size={26} color="#2e7d32" /> : 
                  <Circle size={26} color="#cbd5e1" />
                }
              </button>
              
              <div className="task-info">
                <h3>{task.title}</h3>
                <div className="task-meta">
                  <span className="garden-name"><MapPin size={14} /> {task.garden?.name}</span>
                  <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                    {task.priority === 'HIGH' ? 'Urgente' : task.priority === 'MEDIUM' ? 'Normal' : 'Baixa'}
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