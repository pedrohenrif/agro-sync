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
      api.get('/gardens').then(res => setGardens(res.data)).catch(() => {});
    }
  }, [isOpen, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put(`/tasks/${task.id}`, {
        ...formData,
        gardenId: formData.gardenId ? Number(formData.gardenId) : null,
      });
      toast.success("Tarefa atualizada!");
      onUpdate();
      onClose();
    } catch {
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

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-lg animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Detalhes da Tarefa</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className={labelCls}>O que precisa ser feito?</label>
            <input value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className={inputCls} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls + " flex items-center gap-1"}><Tag size={12} /> Prioridade</label>
              <select value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value as TaskPriority})}
                className={inputCls}>
                <option value="LOW">Rotina (Baixa)</option>
                <option value="MEDIUM">Normal (Média)</option>
                <option value="HIGH">Urgente (Alta)</option>
              </select>
            </div>
            <div>
              <label className={labelCls + " flex items-center gap-1"}><Calendar size={12} /> Data Limite</label>
              <input type="date" value={formData.dueDate}
                onChange={e => setFormData({...formData, dueDate: e.target.value})}
                className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls + " flex items-center gap-1"}><MapPin size={12} /> Vincular Canteiro</label>
            <select value={formData.gardenId}
              onChange={e => setFormData({...formData, gardenId: e.target.value})}
              className={inputCls}>
              <option value="">Nenhum (Tarefa Geral)</option>
              {gardens.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>

          <div>
            <label className={labelCls}>Descrição Completa</label>
            <textarea rows={4} value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Notas sobre a tarefa..."
              className={inputCls + " resize-none"} />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button type="button" onClick={handleConfirmDelete} disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition">
              <Trash2 size={15} /> Excluir
            </button>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} disabled={isLoading}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                Cancelar
              </button>
              <button type="submit" disabled={isLoading}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition shadow-sm disabled:opacity-60">
                <Save size={16} /> {isLoading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
