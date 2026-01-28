import React, { useState, useEffect } from 'react';
import { X, Save, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import { TaskPriority } from './types';
import * as taskService from '../../service/taskService';
import api from '../../service/api'; 

import './AddTaskModal.css';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newTask: any) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [gardenId, setGardenId] = useState(''); 
  const [gardens, setGardens] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchGardens = async () => {
        try {
          const response = await api.get('/gardens'); 
          setGardens(response.data);
        } catch (err) {
          console.error("Erro ao carregar canteiros no modal de tarefas:", err);
        }
      };
      fetchGardens();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const taskData = {
        title,
        priority,
        dueDate: dueDate || null,
        description,
        gardenId: gardenId ? Number(gardenId) : null 
      };
      
      const createdTask = await taskService.createTask(taskData);
      onSave(createdTask);
      onClose();
      
      setTitle(''); 
      setPriority('MEDIUM'); 
      setDueDate(''); 
      setDescription('');
      setGardenId('');
    } catch (error) {
      toast.error("Falha ao agendar tarefa.");
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
            <label>O que precisa ser feito?</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              placeholder="Ex: Adubar canteiro de tomates" 
              className="form-input"
            />
          </div>
          
          <div className="form-group-row">
            <div className="form-group">
              <label>Prioridade:</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className="form-select">
                <option value="LOW">Rotina (Baixa)</option>
                <option value="MEDIUM">Normal (Média)</option>
                <option value="HIGH">Urgente (Alta)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Data Limite:</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="form-input" />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} /> Vincular a um Canteiro (Opcional):
            </label>
            <select 
              value={gardenId} 
              onChange={(e) => setGardenId(e.target.value)} 
              className="form-select"
            >
              <option value="">Nenhum (Tarefa Geral da Fazenda)</option>
              {gardens.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} {g.lotCode ? `[Lote: ${g.lotCode}]` : ''}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Notas Adicionais:</label>
            <textarea 
              rows={3} 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="form-textarea" 
              placeholder="Descreva detalhes ou instruções aqui..." 
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-button cancel" onClick={onClose} disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="modal-button submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Agendar Tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;