import React from 'react';
import { Task } from './types';
import { Calendar, Tag, MapPin, Edit2, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatDate'; 

import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  
  // Função helper para retornar a classe CSS da prioridade
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-low';
    }
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <span className={`task-priority-tag ${getPriorityClass(task.priority)}`}>
          <Tag size={12} /> {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        <div className="task-card-actions">
          <button onClick={() => onEdit(task)} title="Editar Tarefa"><Edit2 size={15} /></button>
          <button onClick={() => onDelete(task)} title="Excluir Tarefa"><Trash2 size={15} /></button>
        </div>
      </div>

      <h3 className="task-card-title">{task.title}</h3>
      
      {task.description && (
        <p className="task-card-description">{task.description}</p>
      )}

      <div className="task-card-footer">
        {task.gardenName && (
          <span className="task-card-info">
            <MapPin size={14} /> {task.gardenName}
          </span>
        )}
        {task.dueDate && (
          <span className="task-card-info">
            <Calendar size={14} /> {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;