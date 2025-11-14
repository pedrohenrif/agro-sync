// ARQUIVO: src/pages/CropPlans/AddEditPlanModal.tsx

import React, { useState, useEffect } from 'react';
import { X, Info, Package, ListChecks, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { CropPlan, PlanSupply, PlanTask } from './types';
import { v4 as uuidv4 } from 'uuid';

import './AddEditPlanModal.css'; // Criaremos este CSS

type ActiveTab = 'info' | 'supplies' | 'tasks';

interface AddEditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: CropPlan) => void;
  editingPlan: CropPlan | null;
}

// --- Formulários temporários das abas ---
const SupplyForm: React.FC<{ onAdd: (supply: PlanSupply) => void }> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('un');

  const handleAdd = () => {
    if (!name || quantity <= 0) {
      toast.warn("Preencha o nome e a quantidade do insumo.");
      return;
    }
    onAdd({ id: uuidv4(), name, quantity, unit });
    setName(''); setQuantity(1); setUnit('un'); // Reseta
  };

  return (
    <div className="sub-form">
      <input type="text" placeholder="Nome do Insumo" value={name} onChange={e => setName(e.target.value)} className="form-input" />
      <input type="number" placeholder="Qtd" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="form-input" style={{width: '100px'}} />
      <select value={unit} onChange={e => setUnit(e.target.value)} className="form-select" style={{width: '100px'}}>
        <option value="un">un</option>
        <option value="kg">kg</option>
        <option value="g">g</option>
        <option value="L">L</option>
        <option value="mL">mL</option>
      </select>
      <button type="button" onClick={handleAdd} className="modal-button submit small"><Plus size={16} /> Adicionar</button>
    </div>
  );
};

const TaskForm: React.FC<{ onAdd: (task: PlanTask) => void }> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [dayToExecute, setDayToExecute] = useState(1);
  const [instructions, setInstructions] = useState('');

  const handleAdd = () => {
    if (!title) {
      toast.warn("Preencha o título da tarefa.");
      return;
    }
    onAdd({ id: uuidv4(), title, dayToExecute, instructions });
    setTitle(''); setDayToExecute(1); setInstructions(''); // Reseta
  };

  return (
    <div className="sub-form vertical">
      <input type="text" placeholder="Título da Tarefa (Ex: Regar)" value={title} onChange={e => setTitle(e.target.value)} className="form-input" />
      <input type="number" placeholder="Dia (após plantio)" value={dayToExecute} onChange={e => setDayToExecute(Number(e.target.value))} className="form-input" style={{width: '150px'}} />
      <textarea placeholder="Instruções (opcional)" value={instructions} onChange={e => setInstructions(e.target.value)} className="form-textarea" />
      <button type="button" onClick={handleAdd} className="modal-button submit small"><Plus size={16} /> Adicionar</button>
    </div>
  );
};


// --- Componente Principal do Modal ---
const AddEditPlanModal: React.FC<AddEditPlanModalProps> = ({ isOpen, onClose, onSave, editingPlan }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('info');
  const [formData, setFormData] = useState<Omit<CropPlan, 'id'>>({
    name: '',
    description: '',
    culture: '',
    durationDays: 90,
    supplies: [],
    tasks: []
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Preenche o formulário se estiver no modo de edição
  useEffect(() => {
    if (editingPlan && isOpen) {
      setFormData(editingPlan);
      setActiveTab('info'); // Sempre reseta para a primeira aba
    } else {
      // Reseta o formulário ao abrir para "Novo"
      setFormData({
        name: '', description: '', culture: '', durationDays: 90,
        supplies: [], tasks: []
      });
      setActiveTab('info');
    }
  }, [editingPlan, isOpen]);

  // Handler genérico para a aba "Info"
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'durationDays' ? Number(value) : value }));
  };

  // Salva o Plano
  const handleSubmit = () => {
    if (!formData.name || !formData.culture) {
      toast.error("Nome do Plano e Cultura são obrigatórios.");
      return;
    }
    
    setIsLoading(true);
    // No futuro, aqui faríamos a chamada API (POST ou PUT)
    
    // Por agora, só simulamos
    const planToSave: CropPlan = {
      ...formData,
      id: editingPlan ? editingPlan.id : uuidv4() // Mantém ID se editando, cria novo se não
    };
    
    onSave(planToSave);
    toast.success(`Plano "${planToSave.name}" ${editingPlan ? 'atualizado' : 'criado'} com sucesso!`);
    setIsLoading(false);
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => e.stopPropagation();
  if (!isOpen) return null;

  return (
    <div className="cpm-backdrop" onClick={onClose}>
      <div className="cpm-modal" onClick={handleModalClick}>
        
        <header className="cpm-header">
          <div className="cpm-header-title">
            <h2>{editingPlan ? "Editar Plano de Cultivo" : "Criar Novo Plano"}</h2>
          </div>
          <button className="cpm-close-btn" onClick={onClose} title="Fechar"><X size={24} /></button>
        </header>

        <nav className="cpm-tab-nav">
          <button className={`cpm-tab-button ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}><Info size={16} /> Informações</button>
          <button className={`cpm-tab-button ${activeTab === 'supplies' ? 'active' : ''}`} onClick={() => setActiveTab('supplies')}><Package size={16} /> Insumos</button>
          <button className={`cpm-tab-button ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}><ListChecks size={16} /> Tarefas</button>
        </nav>

        <main className="cpm-tab-content">
          {/* Aba 1: Informações */}
          {activeTab === 'info' && (
            <div className="tab-content-container">
              <form className="modal-form-reused">
                <div className="form-group"><label htmlFor="plan-name">Nome do Plano:</label><input id="plan-name" type="text" name="name" value={formData.name} onChange={handleInfoChange} required className="form-input" placeholder="Ex: Tomate Cereja (Verão)" /></div>
                <div className="form-group"><label htmlFor="plan-culture">Cultura Principal:</label><input id="plan-culture" type="text" name="culture" value={formData.culture} onChange={handleInfoChange} required className="form-input" placeholder="Ex: Tomate" /></div>
                <div className="form-group"><label htmlFor="plan-duration">Duração Média (dias):</label><input id="plan-duration" type="number" name="durationDays" value={formData.durationDays} onChange={handleInfoChange} required min="1" className="form-input" /></div>
                <div className="form-group"><label htmlFor="plan-description">Descrição:</label><textarea id="plan-description" name="description" value={formData.description} onChange={handleInfoChange} rows={3} className="form-textarea" /></div>
              </form>
            </div>
          )}

          {/* Aba 2: Insumos */}
          {activeTab === 'supplies' && (
            <div className="tab-content-container">
              <SupplyForm onAdd={(supply) => setFormData(prev => ({...prev, supplies: [...prev.supplies, supply]}))} />
              <div className="tab-divider"></div>
              <h4>Insumos do Plano ({formData.supplies.length})</h4>
              <ul className="plan-item-list">
                {formData.supplies.map(s => (
                  <li key={s.id}>
                    <span>{s.name} ({s.quantity} {s.unit})</span>
                    <button onClick={() => setFormData(prev => ({...prev, supplies: prev.supplies.filter(i => i.id !== s.id)}))}><Trash2 size={14} /></button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Aba 3: Tarefas */}
          {activeTab === 'tasks' && (
            <div className="tab-content-container">
              <TaskForm onAdd={(task) => setFormData(prev => ({...prev, tasks: [...prev.tasks, task]}))} />
              <div className="tab-divider"></div>
              <h4>Tarefas do Plano ({formData.tasks.length})</h4>
              <ul className="plan-item-list">
                {formData.tasks.map(t => (
                  <li key={t.id}>
                    <span>Dia {t.dayToExecute}: {t.title}</span>
                    <button onClick={() => setFormData(prev => ({...prev, tasks: prev.tasks.filter(i => i.id !== t.id)}))}><Trash2 size={14} /></button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
        
        <footer className="cpm-footer">
           <button type="button" className="modal-button cancel" onClick={onClose} disabled={isLoading}>Cancelar</button>
           <button type="button" className="modal-button submit" onClick={handleSubmit} disabled={isLoading}>
             {isLoading ? "Salvando..." : (editingPlan ? "Salvar Alterações" : "Criar Plano")}
           </button>
        </footer>

      </div>
    </div>
  );
};

export default AddEditPlanModal;