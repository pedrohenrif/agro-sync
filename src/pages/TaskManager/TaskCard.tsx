import React from 'react';
import { Task, TaskStatus } from './types';
import { Calendar, Tag, MapPin, Trash2, ArrowRight, ArrowLeft, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (id: number, newStatus: TaskStatus) => void;
  onDelete: (id: number) => void;
}

const PRIORITY_MAP: Record<string, { label: string; cls: string }> = {
  HIGH:   { label: 'Alta',   cls: 'bg-red-50 text-red-700 border border-red-200' },
  MEDIUM: { label: 'Média',  cls: 'bg-amber-50 text-amber-700 border border-amber-200' },
  LOW:    { label: 'Baixa',  cls: 'bg-slate-100 text-slate-600 border border-slate-200' },
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdateStatus, onDelete }) => {
  const isOverdue = task.dueDate &&
    new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0)) &&
    task.status !== 'DONE';

  const priority = PRIORITY_MAP[task.priority] ?? PRIORITY_MAP.LOW;

  const statusIcon = task.status === 'DONE'
    ? <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
    : task.status === 'IN_PROGRESS'
      ? <PlayCircle size={18} className="text-blue-500 flex-shrink-0" />
      : <Clock size={18} className="text-slate-400 flex-shrink-0" />;

  const stop = (e: React.MouseEvent, fn: () => void) => { e.stopPropagation(); fn(); };

  return (
    <div className={`bg-white rounded-xl border shadow-sm transition-all hover:shadow-card-hover
      ${task.status === 'DONE' ? 'border-emerald-200 opacity-75' : 'border-slate-200'}`}>

      {/* Priority indicator */}
      <div className={`h-0.5 rounded-t-xl ${task.priority === 'HIGH' ? 'bg-red-400' : task.priority === 'MEDIUM' ? 'bg-amber-400' : 'bg-slate-300'}`} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${priority.cls}`}>
            <Tag size={11} /> {priority.label}
          </span>
          <button
            onClick={e => stop(e, () => onDelete(task.id))}
            title="Excluir"
            className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Title */}
        <div className="flex items-start gap-2 mb-2">
          {statusIcon}
          <h3 className={`text-sm font-semibold leading-snug ${task.status === 'DONE' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
            {task.title}
          </h3>
        </div>

        {task.description && (
          <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>
        )}

        {/* Meta info */}
        <div className="flex flex-col gap-1.5">
          {task.dueDate && (
            <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? 'text-red-500 font-semibold' : 'text-slate-500'}`}>
              <Calendar size={12} />
              {new Date(task.dueDate).toLocaleDateString('pt-BR')}
              {isOverdue && <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold">Atrasada</span>}
            </div>
          )}
          {task.garden?.name && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin size={12} /> {task.garden.name}
            </div>
          )}
        </div>
      </div>

      {/* Status controls */}
      <div className="flex justify-end gap-2 px-3 pb-3">
        {task.status !== 'PENDING' && (
          <button
            onClick={e => stop(e, () => onUpdateStatus(task.id, 'PENDING'))}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md font-medium transition-all"
          >
            <ArrowLeft size={13} /> Voltar
          </button>
        )}
        {task.status === 'PENDING' && (
          <button
            onClick={e => stop(e, () => onUpdateStatus(task.id, 'IN_PROGRESS'))}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md font-medium transition-all"
          >
            Iniciar <ArrowRight size={13} />
          </button>
        )}
        {task.status === 'IN_PROGRESS' && (
          <button
            onClick={e => stop(e, () => onUpdateStatus(task.id, 'DONE'))}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md font-medium transition-all"
          >
            Concluir <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
