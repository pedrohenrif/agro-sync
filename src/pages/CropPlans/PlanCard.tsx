import React from 'react';
import { Pencil, Trash2, Package, ListChecks, Calendar } from 'lucide-react';
import { CropPlan } from './types';

interface PlanCardProps {
  plan: CropPlan;
  onEdit: (plan: CropPlan) => void;
  onDelete: (plan: CropPlan) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-card-hover transition-all flex flex-col">
    <div className="h-1 rounded-t-xl bg-emerald-400" />
    <div className="p-5 flex-1">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-base font-bold text-slate-900 leading-tight">{plan.name}</h3>
        <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">
          <Calendar size={11} /> {plan.durationDays} dias
        </span>
      </div>

      <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 mb-3">
        {plan.culture}
      </span>

      <p className="text-sm text-slate-500 line-clamp-2 mb-4">
        {plan.description || "Sem descrição disponível para este plano."}
      </p>

      <div className="flex items-center gap-4 text-sm text-slate-600">
        <span className="flex items-center gap-1.5">
          <Package size={14} className="text-emerald-500" />
          {(plan.planSupplies?.length || 0)} Insumo(s)
        </span>
        <span className="flex items-center gap-1.5">
          <ListChecks size={14} className="text-blue-500" />
          {(plan.planTasks?.length || 0)} Tarefa(s)
        </span>
      </div>
    </div>

    <div className="flex items-center justify-end gap-1 px-4 pb-4">
      <button onClick={() => onEdit(plan)} title="Editar"
        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition">
        <Pencil size={16} />
      </button>
      <button onClick={() => onDelete(plan)} title="Excluir"
        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

export default PlanCard;
