import React, { useState, useEffect } from 'react';
import { X, Save, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import { TaskPriority } from './types';
import * as taskService from '../../service/taskService';
import api from '../../service/api';

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
      api.get('/gardens').then(r => setGardens(r.data)).catch(() => {});
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const created = await taskService.createTask({
        title, priority,
        dueDate: dueDate || null,
        description,
        gardenId: gardenId ? Number(gardenId) : null
      });
      onSave(created);
      onClose();
      setTitle(''); setPriority('MEDIUM'); setDueDate(''); setDescription(''); setGardenId('');
    } catch {
      toast.error("Falha ao agendar tarefa.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-lg animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Nova Tarefa</h2>
          <button onClick={onClose} disabled={isLoading} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className={labelCls}>O que precisa ser feito?</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
              placeholder="Ex: Adubar canteiro de tomates" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Prioridade</label>
              <select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)} className={inputCls}>
                <option value="LOW">Rotina (Baixa)</option>
                <option value="MEDIUM">Normal (Média)</option>
                <option value="HIGH">Urgente (Alta)</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Data Limite</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls + " flex items-center gap-1"}>
              <MapPin size={12} /> Vincular a um Canteiro (Opcional)
            </label>
            <select value={gardenId} onChange={e => setGardenId(e.target.value)} className={inputCls}>
              <option value="">Nenhum (Tarefa Geral)</option>
              {gardens.map(g => (
                <option key={g.id} value={g.id}>{g.name}{g.lotCode ? ` [Lote: ${g.lotCode}]` : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Notas Adicionais</label>
            <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Descreva detalhes ou instruções aqui..."
              className={inputCls + " resize-none"} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition shadow-sm disabled:opacity-60">
              <Save size={16} /> {isLoading ? "Salvando..." : "Agendar Tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
