import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Task, TaskPriority, TaskStatus } from './types';

import './AddTaskModal.css'; // Usará o CSS de modal padrão

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newTask: Omit<Task, 'id'>) => void; // Envia a tarefa (sem ID) para o pai
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [dueDate, setDueDate] = useState('');
  const [gardenName, setGardenName] = useState(''); // Simplificado
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // No futuro, aqui você faria a chamada API
    // Por agora, só passamos os dados para o componente pai
    try {
      onSave({
        title,
        description,
        priority,
        status,
        dueDate,
        gardenName
      });
      toast.success("Tarefa criada com sucesso!");
      onClose();
      // Limpa o formulário
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('pending');
      setDueDate('');
      setGardenName('');
    } catch (error) {
      toast.error("Erro ao criar tarefa.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-task-modal-backdrop">
      <div className="add-task-modal-content">
        <form onSubmit={handleSubmit} className="add-task-modal-form">
          <div className="modal-header">
            <h2 className="modal-title">Nova Tarefa</h2>
            <button type="button" className="modal-close-button" onClick={onClose} disabled={isLoading}>
              <X size={24} />
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="task-title">Título da Tarefa:</label>
            <input id="task-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="form-input" />
          </div>
          
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="task-status">Status:</label>
              <select id="task-status" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} className="form-select">
                <option value="pending">A Fazer</option>
                <option value="in_progress">Em Andamento</option>
                <option value="done">Concluído</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="task-priority">Prioridade:</label>
              <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className="form-select">
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="task-garden">Canteiro (Opcional):</label>
              <input id="task-garden" type="text" value={gardenName} onChange={(e) => setGardenName(e.target.value)} className="form-input" placeholder="Ex: Horta Principal" />
            </div>
            <div className="form-group">
              <label htmlFor="task-dueDate">Data Limite (Opcional):</label>
              <input id="task-dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="form-input" />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="task-description">Descrição (Opcional):</label>
            <textarea id="task-description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="form-textarea" />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-button cancel" onClick={onClose} disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="modal-button submit" disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar Tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;