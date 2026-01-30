import React from 'react';
import { Pencil, Trash2, Package, ListChecks, Calendar } from 'lucide-react';
import { CropPlan } from './types';
import './PlanCard.css';

interface PlanCardProps {
  plan: CropPlan;
  onEdit: (plan: CropPlan) => void;
  onDelete: (plan: CropPlan) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onEdit, onDelete }) => {
  return (
    <div className="plan-card">
      <div className="card-content">
        <div className="card-header-flex">
          <h3>{plan.name}</h3>
          <span className="duration-badge">
            <Calendar size={12} /> {plan.durationDays} dias
          </span>
        </div>
        
        <p className="category-tag">{plan.culture}</p>
        <p className="plan-description">
          {plan.description || "Sem descrição disponível para este plano."}
        </p>
        
        <div className="plan-summary">
          <div className="summary-item">
            <Package size={16} />
            {/* Atualizado para planSupplies */}
            <span>{(plan.planSupplies?.length || 0)} Insumo(s)</span>
          </div>
          <div className="summary-item">
            <ListChecks size={16} />
            {/* Atualizado para planTasks */}
            <span>{(plan.planTasks?.length || 0)} Tarefa(s)</span>
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