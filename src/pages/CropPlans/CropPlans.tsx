import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Loader2, ClipboardList } from 'lucide-react';
import { toast } from 'react-toastify';
import { getCropPlans, deleteCropPlan as deletePlanService } from '../../service/cropPlanService';
import { CropPlan } from './types';
import PlanCard from './PlanCard';
import AddEditPlanModal from './AddEditPlanModal';

const CropPlans: React.FC = () => {
  const [plans, setPlans] = useState<CropPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<CropPlan | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try { setPlans(await getCropPlans()); }
    catch { toast.error("Não foi possível carregar os planos de cultivo."); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleOpenEditModal = (plan: CropPlan) => { setEditingPlan(plan); setIsModalOpen(true); };

  const handleDeletePlan = async (plan: CropPlan) => {
    if (!window.confirm(`Tem certeza que deseja excluir o plano "${plan.name}"?`)) return;
    try {
      await deletePlanService(plan.id);
      toast.success(`Plano "${plan.name}" excluído.`);
      fetchData();
    } catch { toast.error("Erro ao excluir plano."); }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <ClipboardList size={28} className="text-emerald-600" />
          <h1 className="text-2xl font-extrabold text-slate-900">Planos de Cultivo</h1>
        </div>
        <button
          onClick={() => { setEditingPlan(null); setIsModalOpen(true); }}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-all hover:-translate-y-px shadow-sm disabled:opacity-60"
        >
          <PlusCircle size={18} /> Criar Novo Plano
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[300px] gap-3 text-emerald-600 font-semibold">
          <Loader2 size={20} className="animate-spin" /> Sincronizando planos...
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 gap-3">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <ClipboardList size={28} />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">Nenhum plano criado ainda</h3>
          <button onClick={() => setIsModalOpen(true)}
            className="text-sm text-emerald-600 hover:underline font-medium">
            Comece criando o seu primeiro plano
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
          {plans.map(plan => (
            <PlanCard key={plan.id} plan={plan} onEdit={handleOpenEditModal} onDelete={handleDeletePlan} />
          ))}
        </div>
      )}

      <AddEditPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchData}
        editingPlan={editingPlan}
      />
    </div>
  );
};

export default CropPlans;
