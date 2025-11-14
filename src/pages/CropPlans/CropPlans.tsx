// ARQUIVO: src/pages/CropPlans/CropPlans.tsx

import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { CropPlan } from './types';
import PlanCard from './PlanCard';
import AddEditPlanModal from './AddEditPlanModal';
import { toast } from 'react-toastify';

import './cropPlans.css'; // O CSS da página principal

// --- DADOS MOCK (SIMULADOS) ---
const MOCK_PLANS: CropPlan[] = [
  {
    id: uuidv4(),
    name: "Plano Padrão Tomate Cereja",
    description: "Plano otimizado para cultivo de tomate cereja em 90 dias.",
    culture: "Tomate",
    durationDays: 90,
    supplies: [
      { id: uuidv4(), name: "Semente de Tomate", quantity: 50, unit: "un" },
      { id: uuidv4(), name: "Adubo NPK 10-10-10", quantity: 1, unit: "kg" }
    ],
    tasks: [
      { id: uuidv4(), title: "Preparar solo", dayToExecute: 1, instructions: "Revolver terra e misturar adubo." },
      { id: uuidv4(), title: "Adubação de Cobertura", dayToExecute: 30, instructions: "Aplicar 50g de NPK." }
    ]
  },
  {
    id: uuidv4(),
    name: "Plano Rápido Alface Crespa",
    description: "Ciclo curto de 45 dias para alface em canteiros elevados.",
    culture: "Alface",
    durationDays: 45,
    supplies: [
      { id: uuidv4(), name: "Semente de Alface", quantity: 100, unit: "un" }
    ],
    tasks: [
      { id: uuidv4(), title: "Regar diariamente", dayToExecute: 1, instructions: "Manter o solo úmido." }
    ]
  }
];

// --- Componente da Página ---
const CropPlans: React.FC = () => {
  const [plans, setPlans] = useState<CropPlan[]>(MOCK_PLANS);
  const [isLoading, setIsLoading] = useState(false); // Para futuras chamadas API

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<CropPlan | null>(null);

  const handleOpenAddModal = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (plan: CropPlan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleSavePlan = (planToSave: CropPlan) => {
    // No frontend (por enquanto), ou adicionamos ou atualizamos a lista
    setPlans(prevPlans => {
      const exists = prevPlans.find(p => p.id === planToSave.id);
      if (exists) {
        // Atualiza
        return prevPlans.map(p => p.id === planToSave.id ? planToSave : p);
      } else {
        // Adiciona
        return [...prevPlans, planToSave];
      }
    });
    // O modal já fecha e mostra o toast
  };

  const handleDeletePlan = (planToDelete: CropPlan) => {
    // Apenas simulação de deleção
    setPlans(prevPlans => prevPlans.filter(p => p.id !== planToDelete.id));
    toast.success(`Plano "${planToDelete.name}" excluído.`);
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

      {isLoading && <div className="loading-message">Carregando planos...</div>}

      {!isLoading && plans.length === 0 && (
        <div className="empty-state">
          <p>Nenhum plano de cultivo criado ainda.</p>
        </div>
      )}

      {!isLoading && plans.length > 0 && (
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

      {/* Renderização do Modal */}
      <AddEditPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlan}
        editingPlan={editingPlan}
      />
    </div>
  );
};

export default CropPlans;