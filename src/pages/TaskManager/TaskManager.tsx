import React, { useState, useMemo } from 'react';
import { PlusCircle, Loader, Edit2, Trash2 } from 'lucide-react';
import { Task, TaskStatus } from './types';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import { toast } from 'react-toastify';

import './TaskManager.css';
import 'uuid'; 
import { v4 as uuidv4 } from 'uuid'; 

// --- DADOS MOCK (SIMULADOS) ---
// No futuro, isso virá de uma chamada API no useEffect
const MOCK_TASKS: Task[] = [
  { id: uuidv4(), title: 'Regar Canteiro 1', status: 'pending', priority: 'medium', gardenName: 'Canteiro 1' },
  { id: uuidv4(), title: 'Verificar pragas', status: 'pending', priority: 'high', dueDate: '2025-11-15' },
  { id: uuidv4(), title: 'Adubar Horta de Ervas', status: 'in_progress', priority: 'medium', gardenName: 'Horta de Ervas' },
  { id: uuidv4(), title: 'Comprar fertilizante NPK', status: 'done', priority: 'low' },
];

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [isLoading, setIsLoading] = useState(false); // No futuro, useEffect controlará isso
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null); // Para edição futura
  const [deletingTask, setDeletingTask] = useState<Task | null>(null); // Para deleção futura

  // Função para adicionar a nova tarefa (do modal) à lista
  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    // No frontend, nós criamos um ID (no futuro, o backend faria isso)
    const newTask: Task = {
      ...taskData,
      id: uuidv4(), // Gera um ID único
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    // setIsModalOpen(false); // O modal já se fecha
  };
  
  // (Funções placeholder para os botões dos cards)
  const handleEdit = (task: Task) => {
    // setEditingTask(task);
    // setIsModalOpen(true); // Reutilizaria o modal para edição
    toast.info("Função 'Editar' ainda não implementada.");
  };

  const handleDelete = (task: Task) => {
    // setDeletingTask(task);
    // setIsDeleteModalOpen(true);
    toast.info("Função 'Excluir' ainda não implementada.");
  };

  // Filtra as tarefas em colunas usando useMemo para otimização
  const filteredTasks = useMemo(() => {
    return {
      pending: tasks.filter(t => t.status === 'pending'),
      in_progress: tasks.filter(t => t.status === 'in_progress'),
      done: tasks.filter(t => t.status === 'done'),
    };
  }, [tasks]);

  return (
    <div className="task-manager-container">
      <div className="task-manager-header">
        <h2><span role="img" aria-label="tasks">📋</span> Gerenciador de Tarefas</h2>
        <button
          type="button"
          className="new-task-button"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircle size={18} />
          Nova Tarefa
        </button>
      </div>

      {isLoading ? (
        <div className="loading-message">Carregando tarefas...</div>
      ) : (
        <div className="task-board-container">
          
          {/* Coluna A Fazer */}
          <div className="task-column">
            <h3 className="column-title" id="pending-title">
              <span className="status-dot pending"></span> A Fazer ({filteredTasks.pending.length})
            </h3>
            <div className="task-list" aria-labelledby="pending-title">
              {filteredTasks.pending.length === 0 ? (
                <p className="empty-column-message">Nenhuma tarefa pendente.</p>
              ) : (
                filteredTasks.pending.map(task => (
                  <TaskCard key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
                ))
              )}
            </div>
          </div>
          
          {/* Coluna Em Andamento */}
          <div className="task-column">
            <h3 className="column-title" id="progress-title">
              <span className="status-dot in_progress"></span> Em Andamento ({filteredTasks.in_progress.length})
            </h3>
            <div className="task-list" aria-labelledby="progress-title">
              {filteredTasks.in_progress.length === 0 ? (
                <p className="empty-column-message">Nenhuma tarefa em andamento.</p>
              ) : (
                filteredTasks.in_progress.map(task => (
                  <TaskCard key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
                ))
              )}
            </div>
          </div>
          
          {/* Coluna Concluído */}
          <div className="task-column">
            <h3 className="column-title" id="done-title">
              <span className="status-dot done"></span> Concluído ({filteredTasks.done.length})
            </h3>
            <div className="task-list" aria-labelledby="done-title">
              {filteredTasks.done.length === 0 ? (
                <p className="empty-column-message">Nenhuma tarefa concluída.</p>
              ) : (
                filteredTasks.done.map(task => (
                  <TaskCard key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* Renderização do Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTask}
      />
    </div>
  );
};

export default TaskManager;