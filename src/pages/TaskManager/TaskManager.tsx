import React, { useEffect, useState, useMemo } from 'react';
import { PlusCircle, ClipboardList } from 'lucide-react';
import { Task, TaskStatus } from './types';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import { toast } from 'react-toastify';
import * as taskService from '../../service/taskService';

import './TaskManager.css';

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // Controla a edição

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      toast.error("Erro ao carregar tarefas!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: TaskStatus) => {
    try {
      await taskService.updateTaskStatus(id, newStatus);
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch (err) {
      toast.error("Erro ao atualizar status.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success("Tarefa excluída.");
    } catch (err) {
      toast.error("Erro ao excluir tarefa.");
    }
  };

  const filteredTasks = useMemo(() => {
    return {
      pending: tasks.filter(t => t.status === 'PENDING'),
      in_progress: tasks.filter(t => t.status === 'IN_PROGRESS'),
      done: tasks.filter(t => t.status === 'DONE'),
    };
  }, [tasks]);

  return (
    <div className="task-manager-container">
      <div className="task-manager-header">
        <div className="header-title">
          <ClipboardList size={28} color="#2e7d32" />
          <h2>Gerenciador de Tarefas</h2>
        </div>
        <button className="new-task-button" onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle size={18} /> Nova Tarefa
        </button>
      </div>

      {isLoading ? (
        <div className="loading-message">Sincronizando tarefas...</div>
      ) : (
        <div className="task-board-container">
          
          {/* Coluna A Fazer */}
          <div className="task-column">
            <h3 className="column-title">
              <span className="status-dot pending"></span> A Fazer ({filteredTasks.pending.length})
            </h3>
            <div className="task-list">
              {filteredTasks.pending.map(task => (
                <div key={task.id} onClick={() => setSelectedTask(task)} className="clickable-card">
                  <TaskCard task={task} onUpdateStatus={handleUpdateStatus} onDelete={handleDelete} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Coluna Em Andamento */}
          <div className="task-column">
            <h3 className="column-title">
              <span className="status-dot in_progress"></span> Em Andamento ({filteredTasks.in_progress.length})
            </h3>
            <div className="task-list">
              {filteredTasks.in_progress.map(task => (
                <div key={task.id} onClick={() => setSelectedTask(task)} className="clickable-card">
                  <TaskCard task={task} onUpdateStatus={handleUpdateStatus} onDelete={handleDelete} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Coluna Concluído */}
          <div className="task-column">
            <h3 className="column-title">
              <span className="status-dot done"></span> Concluído ({filteredTasks.done.length})
            </h3>
            <div className="task-list">
              {filteredTasks.done.map(task => (
                <div key={task.id} onClick={() => setSelectedTask(task)} className="clickable-card">
                  <TaskCard task={task} onUpdateStatus={handleUpdateStatus} onDelete={handleDelete} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal para Adicionar */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={fetchTasks}
      />

    {/* Modal para Editar/Visualizar Detalhes */}
      <EditTaskModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={fetchTasks}
        onDelete={handleDelete} // <--- ADICIONE ESTA LINHA AQUI
      />
    </div>
  );
};

export default TaskManager;