import React, { useState, useEffect } from 'react';
import { X, Save, Info, Package, ListChecks } from 'lucide-react';
import { toast } from 'react-toastify';
import { getSupplys } from '../../service/supplyService';
import { createCropPlan, updateCropPlan } from '../../service/cropPlanService';
import { CropPlan, PlanSupply, PlanTask } from './types';
import InfoTab from './components/InfoTab';
import SuppliesTab from './components/SuppliesTab';
import TasksTab from './components/TasksTab';

interface AddEditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingPlan: CropPlan | null;
}

type ActiveTab = 'info' | 'supplies' | 'tasks';

const TABS: { key: ActiveTab; label: string; icon: React.ReactNode }[] = [
  { key: 'info',     label: 'Info',     icon: <Info size={15} /> },
  { key: 'supplies', label: 'Insumos',  icon: <Package size={15} /> },
  { key: 'tasks',    label: 'Tarefas',  icon: <ListChecks size={15} /> },
];

const AddEditPlanModal: React.FC<AddEditPlanModalProps> = ({ isOpen, onClose, onSave, editingPlan }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('info');
  const [stock, setStock] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<CropPlan, 'id'>>({
    name: '', culture: '', durationDays: 90, description: '',
    planSupplies: [] as PlanSupply[], planTasks: [] as PlanTask[]
  });

  useEffect(() => {
    if (isOpen) {
      getSupplys().then(setStock).catch(() => toast.error("Erro ao carregar estoque."));
      if (editingPlan) {
        const { id, ...planData } = editingPlan;
        setFormData({ ...planData, description: planData.description || '', planSupplies: planData.planSupplies || [], planTasks: planData.planTasks || [] });
      } else {
        setFormData({ name: '', culture: '', durationDays: 90, description: '', planSupplies: [], planTasks: [] });
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
      const payload = {
        ...formData,
        planSupplies: formData.planSupplies.map(({ id, ...rest }: any) => rest),
        planTasks: formData.planTasks.map(({ id, ...rest }: any) => rest),
      };
      if (editingPlan?.id) { await updateCropPlan(editingPlan.id, payload); }
      else { await createCropPlan(payload as any); }
      toast.success("Plano salvo!");
      onSave();
      onClose();
    } catch { toast.error("Erro ao salvar."); }
    finally { setIsLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-lg font-bold text-slate-900">
            {editingPlan ? 'Editar Plano' : 'Novo Plano de Cultivo'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        {/* Tab nav */}
        <div className="flex border-b border-slate-100 flex-shrink-0 px-4">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition
                ${activeTab === tab.key
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'info' && <InfoTab formData={formData} setFormData={setFormData} />}
          {activeTab === 'supplies' && <SuppliesTab formData={formData} setFormData={setFormData} stock={stock} />}
          {activeTab === 'tasks' && <TasksTab formData={formData} setFormData={setFormData} />}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <button onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition shadow-sm disabled:opacity-60">
            {isLoading ? 'Salvando...' : <><Save size={16} /> Salvar Plano</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditPlanModal;
