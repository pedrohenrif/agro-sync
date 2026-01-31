import React, { useEffect, useState } from 'react';
import { X, CheckCircle, Calendar, Package, ArrowRight } from 'lucide-react';
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
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCropPlans().then(setPlans).catch(() => toast.error("Erro ao carregar planos."));
  }, []);

  const selectedPlan = plans.find(p => p.id === Number(selectedPlanId));

  const handleConfirm = async () => {
    if (!selectedPlanId) return toast.warn("Selecione um plano de cultivo.");

    setIsSubmitting(true);
    try {
      await startPlanting({
        gardenId: garden.id,
        cropPlanId: Number(selectedPlanId),
        startDate: startDate
      });
      toast.success(`Plantio de ${selectedPlan.culture} iniciado com sucesso!`);
      onConfirm();
      onClose();
    } catch (error) {
      toast.error("Erro ao iniciar plantio. Verifique o estoque.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cpm-backdrop" onClick={onClose}>
      <div className="cpm-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <header className="cpm-header">
          <h2>Iniciar Novo Cultivo</h2>
          <button onClick={onClose} className="cpm-close-btn"><X size={24} /></button>
        </header>

        <main className="cpm-tab-content">
          <div className="planting-summary">
            <p>Você está iniciando um cultivo no canteiro <strong>{garden.name}</strong>.</p>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Selecione o Plano de Cultivo (Template)</label>
            <select 
              className="form-select" 
              value={selectedPlanId} 
              onChange={e => setSelectedPlanId(e.target.value)}
            >
              <option value="">Escolha um plano...</option>
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.name} ({plan.culture})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Data de Início</label>
            <input 
              type="date" 
              className="form-input" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)} 
            />
          </div>

          {selectedPlan && (
            <div className="plan-preview-card animate-in">
              <h4><CheckCircle size={16} color="#22c55e" /> Resumo do Plano</h4>
              <div className="preview-details">
                <span><Calendar size={14} /> {selectedPlan.durationDays} dias de ciclo</span>
                <span><Package size={14} /> {selectedPlan.planSupplies?.length || 0} insumos necessários</span>
              </div>
              <p className="preview-note">O estoque será atualizado automaticamente ao confirmar.</p>
            </div>
          )}
        </main>

        <footer className="cpm-footer">
          <button className="modal-button cancel" onClick={onClose}>Cancelar</button>
          <button 
            className="modal-button submit" 
            onClick={handleConfirm} 
            disabled={isSubmitting || !selectedPlanId}
          >
            {isSubmitting ? "Processando..." : <><ArrowRight size={18} /> Confirmar Plantio</>}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default StartPlantingModal;