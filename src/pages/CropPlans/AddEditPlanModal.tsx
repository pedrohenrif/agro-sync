import React, { useState, useEffect } from 'react';
import { X, Save, Info, Package, ListChecks } from 'lucide-react';
import { toast } from 'react-toastify';

import { getSupplys } from '../../service/supplyService';
import { createCropPlan, updateCropPlan } from '../../service/cropPlanService';
import { CropPlan, PlanSupply, PlanTask } from './types';

import InfoTab from './components/InfoTab';
import SuppliesTab from './components/SuppliesTab';
import TasksTab from './components/TasksTab';

import './AddEditPlanModal.css';

interface AddEditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingPlan: CropPlan | null;
}

type ActiveTab = 'info' | 'supplies' | 'tasks';

const AddEditPlanModal: React.FC<AddEditPlanModalProps> = ({ isOpen, onClose, onSave, editingPlan }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('info');
  const [stock, setStock] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Definimos o tipo explicitamente para evitar o erro de 'never[]' e 'undefined'
  const [formData, setFormData] = useState<Omit<CropPlan, 'id'>>({
    name: '',
    culture: '',
    durationDays: 90,
    description: '',
    planSupplies: [] as PlanSupply[],
    planTasks: [] as PlanTask[]
  });

  useEffect(() => {
    if (isOpen) {
      getSupplys().then(setStock).catch(() => toast.error("Erro ao carregar estoque."));
      
      if (editingPlan) {
        // Resolvemos o erro TS2345 removendo o ID e garantindo a string na descrição
        const { id, ...planData } = editingPlan;
        setFormData({
          ...planData,
          description: planData.description || '',
          planSupplies: planData.planSupplies || [],
          planTasks: planData.planTasks || []
        });
      } else {
        setFormData({ 
          name: '', 
          culture: '', 
          durationDays: 90, 
          description: '', 
          planSupplies: [], 
          planTasks: [] 
        });
      }
      setActiveTab('info');
    }
  }, [isOpen, editingPlan]);

  const handleSave = async () => {
    if (!formData.name || !formData.culture) {
      toast.error("Nome e Cultura são obrigatórios.");
      setActiveTab('info');
      return;
    }

    setIsLoading(true);
    try {
      // Limpeza para o Backend
      const payload = {
        ...formData,
        planSupplies: formData.planSupplies.map(({ id, ...rest }: any) => rest),
        planTasks: formData.planTasks.map(({ id, ...rest }: any) => rest),
      };

      if (editingPlan?.id) {
        await updateCropPlan(editingPlan.id, payload);
      } else {
        await createCropPlan(payload as any);
      }

      toast.success("Plano salvo!");
      onSave();
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cpm-backdrop" onClick={onClose}>
      <div className="cpm-modal" onClick={e => e.stopPropagation()}>
        <header className="cpm-header">
          <h2>{editingPlan ? 'Editar Plano' : 'Novo Plano de Cultivo'}</h2>
          <button onClick={onClose} className="cpm-close-btn"><X /></button>
        </header>

        <nav className="cpm-tab-nav">
          <button className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}><Info size={18}/> Info</button>
          <button className={activeTab === 'supplies' ? 'active' : ''} onClick={() => setActiveTab('supplies')}><Package size={18}/> Insumos</button>
          <button className={activeTab === 'tasks' ? 'active' : ''} onClick={() => setActiveTab('tasks')}><ListChecks size={18}/> Tarefas</button>
        </nav>

        <main className="cpm-tab-content">
          {activeTab === 'info' && <InfoTab formData={formData} setFormData={setFormData} />}
          {activeTab === 'supplies' && <SuppliesTab formData={formData} setFormData={setFormData} stock={stock} />}
          {activeTab === 'tasks' && <TasksTab formData={formData} setFormData={setFormData} />}
        </main>

        <footer className="cpm-footer">
          <button onClick={onClose} className="modal-button cancel">Cancelar</button>
          <button onClick={handleSave} className="modal-button submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : <><Save size={18} /> Salvar Plano</>}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AddEditPlanModal;