import React, { useEffect, useState } from 'react';
import { X, CheckCircle, Calendar, Package, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { getCropPlans } from '../../../service/cropPlanService';
import { startPlanting } from '../../../service/cropCycleService';
import { Garden } from '../types';

interface StartPlantingModalProps {
  garden: Garden;
  onClose: () => void;
  onConfirm: () => void;
}

const StartPlantingModal: React.FC<StartPlantingModalProps> = ({ garden, onClose, onConfirm }) => {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCropPlans().then(setPlans).catch(() => toast.error("Erro ao carregar planos."));
  }, []);

  const selectedPlan = plans.find(p => p.id === Number(selectedPlanId));

  const handleConfirm = async () => {
    if (!selectedPlanId) { toast.warn("Selecione um plano de cultivo."); return; }
    setIsSubmitting(true);
    try {
      await startPlanting({ gardenId: garden.id, cropPlanId: Number(selectedPlanId), startDate });
      toast.success(`Plantio de ${selectedPlan.culture} iniciado com sucesso!`);
      onConfirm(); onClose();
    } catch { toast.error("Erro ao iniciar plantio. Verifique o estoque."); }
    finally { setIsSubmitting(false); }
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Iniciar Novo Cultivo</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-slate-600">
            Você está iniciando um cultivo no canteiro <strong className="text-slate-900">"{garden.name}"</strong>.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Selecione o Plano de Cultivo</label>
            <select className={inputCls} value={selectedPlanId} onChange={e => setSelectedPlanId(e.target.value)}>
              <option value="">Escolha um plano...</option>
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.name} ({plan.culture})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Data de Início</label>
            <input type="date" className={inputCls} value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>

          {selectedPlan && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 animate-fade-in">
              <h4 className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 mb-2">
                <CheckCircle size={15} /> Resumo do Plano
              </h4>
              <div className="flex items-center gap-4 text-xs text-slate-600 mb-2">
                <span className="flex items-center gap-1"><Calendar size={12} /> {selectedPlan.durationDays} dias de ciclo</span>
                <span className="flex items-center gap-1"><Package size={12} /> {selectedPlan.planSupplies?.length || 0} insumos necessários</span>
              </div>
              <p className="text-xs text-slate-500">O estoque será atualizado automaticamente ao confirmar.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 pb-6">
          <button onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
            Cancelar
          </button>
          <button onClick={handleConfirm} disabled={isSubmitting || !selectedPlanId}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition shadow-sm disabled:opacity-60">
            {isSubmitting ? <><Loader2 size={15} className="animate-spin" /> Processando...</> : <><ArrowRight size={15} /> Confirmar Plantio</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartPlantingModal;
