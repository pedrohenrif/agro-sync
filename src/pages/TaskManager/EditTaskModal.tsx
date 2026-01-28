import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Tag, Calendar, MapPin } from 'lucide-react';
import api from '../../service/api';
import { toast } from 'react-toastify';
import { TaskPriority } from './types';

interface EditTaskModalProps {
  task: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: (id: number) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, isOpen, onClose, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState<any>(null);
  const [gardens, setGardens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && task) {
      setFormData({ 
        ...task, 
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        gardenId: task.gardenId || '',
        priority: task.priority || 'MEDIUM'
      });
      // Carrega os canteiros para o select
      api.get('/gardens').then(res => setGardens(res.data));
    }
  }, [isOpen, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put(`/tasks/${task.id}`, {
        ...formData,
        gardenId: formData.gardenId ? Number(formData.gardenId) : null,
        priority: formData.priority
      });
      toast.success("Tarefa atualizada!");
      onUpdate();
      onClose();
    } catch (err) {
      toast.error("Erro ao atualizar.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      onDelete(task.id);
      onClose();
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="add-task-modal-backdrop">
      <div className="add-task-modal-content">
        <header className="modal-header">
          <h2 className="modal-title">Detalhes da Tarefa</h2>
          <button type="button" onClick={onClose} className="modal-close-button"><X size={24} /></button>
        </header>

        <form onSubmit={handleSubmit} className="add-task-modal-form">
          <div className="form-group">
            <label>O que precisa ser feito?</label>
            <input 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              className="form-input" 
              required
            />
          </div>

          {/* FILA DE PRIORIDADE E DATA LIMITE */}
          <div className="form-group-row">
            <div className="form-group">
              <label><Tag size={14} /> Prioridade:</label>
              <select 
                value={formData.priority} 
                onChange={e => setFormData({...formData, priority: e.target.value as TaskPriority})} 
                className="form-select"
              >
                <option value="LOW">Rotina (Baixa)</option>
                <option value="MEDIUM">Normal (Média)</option>
                <option value="HIGH">Urgente (Alta)</option>
              </select>
            </div>
            <div className="form-group">
              <label><Calendar size={14} /> Data Limite:</label>
              <input 
                type="date" 
                value={formData.dueDate} 
                onChange={e => setFormData({...formData, dueDate: e.target.value})} 
                className="form-input" 
              />
            </div>
          </div>

          <div className="form-group">
            <label><MapPin size={14} /> Vincular Canteiro:</label>
            <select 
              value={formData.gardenId} 
              onChange={e => setFormData({...formData, gardenId: e.target.value})} 
              className="form-select"
            >
              <option value="">Nenhum (Tarefa Geral)</option>
              {gardens.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Descrição Completa:</label>
            <textarea 
              rows={5} 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className="form-textarea" 
              placeholder="Notas sobre a tarefa..."
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="modal-button cancel" 
              onClick={handleConfirmDelete} 
              disabled={isLoading}
            >
              <Trash2 size={18} /> Excluir
            </button>
            <button 
              type="submit" 
              className="modal-button submit" 
              disabled={isLoading}
            >
              <Save size={18} /> {isLoading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;