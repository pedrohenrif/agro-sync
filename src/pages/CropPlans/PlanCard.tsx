// ARQUIVO: src/pages/CropPlans/PlanCard.tsx

import React from 'react';
import { Pencil, Trash2, Package, ListChecks } from 'lucide-react';
import { CropPlan } from './types';
import './PlanCard.css'; // Criaremos este CSS

interface PlanCardProps {
  plan: CropPlan;
  onEdit: (plan: CropPlan) => void;
  onDelete: (plan: CropPlan) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onEdit, onDelete }) => {
  return (
    <div className="plan-card">
      <div className="card-content">
        <h3>{plan.name}</h3>
        <p className="category-tag">{plan.culture}</p>
        <p className="plan-description">{plan.description}</p>
        
        <div className="plan-summary">
          <div className="summary-item">
            <Package size={16} />
            <span>{plan.supplies.length} Insumo(s)</span>
          </div>
          <div className="summary-item">
            <ListChecks size={16} />
            <span>{plan.tasks.length} Tarefa(s)</span>
          </div>
        </div>
      </div>
      
      <div className="card-actions">
        <button 
          type="button" 
          className="action-button edit" 
          onClick={() => onEdit(plan)} 
          title="Editar Plano"
        >
          <Pencil size={16} />
        </button>
        <button 
          type="button" 
          className="action-button delete" 
          onClick={() => onDelete(plan)} 
          title="Deletar Plano"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default PlanCard;