import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

// Importação dos serviços reais e tipos
import { getCropPlans, deleteCropPlan as deletePlanService } from '../../service/cropPlanService';
import { CropPlan } from './types';

import PlanCard from './PlanCard';
import AddEditPlanModal from './AddEditPlanModal';

import './cropPlans.css';

const CropPlans: React.FC = () => {
  const [plans, setPlans] = useState<CropPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<CropPlan | null>(null);

  // --- CARREGAMENTO DE DADOS ---
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getCropPlans();
      setPlans(data);
    } catch (error) {
      console.error("Erro ao carregar planos:", error);
      toast.error("Não foi possível carregar os planos de cultivo.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- HANDLERS ---
  const handleOpenAddModal = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (plan: CropPlan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleSavePlan = () => {
    fetchData(); 
  };

  const handleDeletePlan = async (planToDelete: CropPlan) => {
    if (!window.confirm(`Tem certeza que deseja excluir o plano "${planToDelete.name}"?`)) return;

    try {
      await deletePlanService(planToDelete.id);
      toast.success(`Plano "${planToDelete.name}" excluído.`);
      fetchData(); // Atualiza a lista após deletar
    } catch (error) {
      toast.error("Erro ao excluir plano.");
    }
  };
  
  return (
    <div className="crop-plans-container">
      <div className="crop-plans-header">
        <h2><span role="img" aria-label="clipboard">📝</span> Planos de Cultivo</h2>
        <button
          type="button"
          className="new-plan-button"
          onClick={handleOpenAddModal}
          disabled={isLoading}
        >
          <PlusCircle size={18} />
          Criar Novo Plano
        </button>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <Loader2 className="spinner" />
          <p>Sincronizando planos com o servidor...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum plano de cultivo criado ainda.</p>
          <button onClick={handleOpenAddModal} className="text-button">Comece criando o seu primeiro plano</button>
        </div>
      ) : (
        <div className="crop-plans-grid">
          {plans.map((plan) => (
            <PlanCard 
              key={plan.id} 
              plan={plan} 
              onEdit={handleOpenEditModal}
              onDelete={handleDeletePlan}
            />
          ))}
        </div>
      )}

      {/* Modal Conectado */}
      <AddEditPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlan} // Função simples de refresh
        editingPlan={editingPlan}
      />
    </div>
  );
};

export default CropPlans;