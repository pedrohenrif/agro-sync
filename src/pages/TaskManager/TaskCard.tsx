import React from 'react';
import { Task, TaskStatus } from './types';
import { 
  Calendar, 
  Tag, 
  MapPin, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  PlayCircle 
} from 'lucide-react';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (id: number, newStatus: TaskStatus) => void;
  onDelete: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdateStatus, onDelete }) => {
  
  // 🚨 Lógica para verificar se a tarefa está atrasada
  // Só considera atrasada se tiver data, a data for menor que agora e não estiver concluída
  const isOverdue = 
    task.dueDate && 
    new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0)) && 
    task.status !== 'DONE';

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'HIGH': return { label: 'Alta', class: 'priority-high' };
      case 'MEDIUM': return { label: 'Média', class: 'priority-medium' };
      case 'LOW': return { label: 'Baixa', class: 'priority-low' };
      default: return { label: 'Baixa', class: 'priority-low' };
    }
  };

  const priority = getPriorityInfo(task.priority);

  const getStatusIcon = () => {
    switch (task.status) {
      case 'DONE': return <CheckCircle2 size={20} color="#4CAF50" />;
      case 'IN_PROGRESS': return <PlayCircle size={20} color="#2196F3" />;
      default: return <Clock size={20} color="#666" />;
    }
  };

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div className={`task-card status-${task.status.toLowerCase()}`}>
      <div className="task-card-header">
        <span className={`task-priority-tag ${priority.class}`}>
          <Tag size={12} /> {priority.label}
        </span>
        <div className="task-card-actions">
          <button 
            onClick={(e) => handleAction(e, () => onDelete(task.id))} 
            title="Excluir Tarefa" 
            className="btn-delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="task-body">
        <div className="task-title-wrapper">
          {getStatusIcon()}
          <h3 className="task-card-title">{task.title}</h3>
        </div>
        
        {task.description && (
          <p className="task-card-description">{task.description}</p>
        )}

        <div className="task-card-footer">
          {/* 📅 DATA LIMITE COM ALERTA DE ATRASO */}
          {task.dueDate && (
            <span className={`task-card-info ${isOverdue ? 'overdue' : ''}`}>
              <Calendar size={14} /> 
              {new Date(task.dueDate).toLocaleDateString('pt-BR')}
              {isOverdue && <span className="overdue-label">Atrasada</span>}
            </span>
          )}

          {/* 🏡 CANTEIRO VINCULADO */}
          {task.garden?.name && (
            <span className="task-card-info garden-highlight">
              <MapPin size={14} /> 
              {task.garden.name}
            </span>
          )}
        </div>
      </div>

      {/* CONTROLES DE FLUXO */}
      <div className="task-status-controls">
        {task.status !== 'PENDING' && (
          <button 
            onClick={(e) => handleAction(e, () => onUpdateStatus(task.id, 'PENDING'))} 
            title="Mover para Pendente"
          >
            <ArrowLeft size={16} /> Voltar
          </button>
        )}
        
        {task.status === 'PENDING' && (
          <button 
            className="btn-next" 
            onClick={(e) => handleAction(e, () => onUpdateStatus(task.id, 'IN_PROGRESS'))}
          >
            Iniciar <ArrowRight size={16} />
          </button>
        )}

        {task.status === 'IN_PROGRESS' && (
          <button 
            className="btn-next" 
            onClick={(e) => handleAction(e, () => onUpdateStatus(task.id, 'DONE'))}
          >
            Concluir <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;