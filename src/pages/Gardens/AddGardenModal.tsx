import React, { useState, useEffect } from 'react';
import { X, Sprout, Calculator, Wheat, Hash, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import * as gardenService from '../../service/gardenService';
import api from '../../service/api'; // Certifique-se de ter o axios configurado

import './AddGardenModal.css';

interface CropPlan {
  id: number;
  name: string;
  culture: string;
}

interface CalcResult {
  baseStand: number;
  requiredSeeds: number;
  expectedYieldKg: number;
}

interface AddGardenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newGarden: any) => void;
}

const AddGardenModal: React.FC<AddGardenModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    crop: "",
    plantingDate: new Date().toISOString().split('T')[0],
    sizeInM2: "",
    location: "",
    cropPlanId: ""
  });

  const [cropPlans, setCropPlans] = useState<CropPlan[]>([]);
  const [calcResult, setCalcResult] = useState<CalcResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // 1. Carregar Planos de Cultivo ao abrir
  useEffect(() => {
    if (isOpen) {
      api.get('/crop-plans').then(res => setCropPlans(res.data)).catch(() => toast.error("Erro ao carregar planos de cultivo."));
    }
  }, [isOpen]);

  // 2. Lógica de Cálculo Automático (Estande)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.sizeInM2 && formData.cropPlanId) {
        handleCalculate();
      }
    }, 600); // Espera 600ms após o usuário parar de digitar
    return () => clearTimeout(timer);
  }, [formData.sizeInM2, formData.cropPlanId]);

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const res = await api.post('/gardens/calculate-stand', {
        areaM2: Number(formData.sizeInM2),
        cropPlanId: Number(formData.cropPlanId)
      });
      setCalcResult(res.data);
    } catch (err) {
      setCalcResult(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Se mudar o plano, já preenche o nome da cultura automaticamente
    if (name === 'cropPlanId') {
      const selectedPlan = cropPlans.find(p => p.id === Number(value));
      setFormData(prev => ({ ...prev, cropPlanId: value, crop: selectedPlan?.culture || "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        sizeInM2: Number(formData.sizeInM2),
        cropPlanId: formData.cropPlanId ? Number(formData.cropPlanId) : null
      };
      
      const newGarden = await gardenService.createGarden(payload);
      toast.success("Plantio registrado com sucesso! Lote gerado.");
      onSave(newGarden);
      onClose();
      setFormData({ name: "", crop: "", plantingDate: "", sizeInM2: "", location: "", cropPlanId: "" });
      setCalcResult(null);
    } catch (error: any) {
      toast.error("Falha ao criar o canteiro.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-garden-modal-backdrop">
      <div className="add-garden-modal-content">
        <form onSubmit={handleSubmit} className="add-garden-modal-form">
          
          <div className="modal-header">
            <h2 className="modal-title">
              <Sprout size={24} color="#2e7d32" /> Novo Planejamento de Safra
            </h2>
            <button type="button" className="modal-close-button" onClick={onClose}><X size={24} /></button>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Identificação do Talhão:</label>
              <input name="name" placeholder="Ex: Estufa 04 - Setor Sul" value={formData.name} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label>Plano de Cultivo (Template):</label>
              <select name="cropPlanId" value={formData.cropPlanId} onChange={handleInputChange} required>
                <option value="">Selecione um plano...</option>
                {cropPlans.map(plan => (
                  <option key={plan.id} value={plan.id}>{plan.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Área de Plantio (m²):</label>
              <input type="number" name="sizeInM2" placeholder="Ex: 500" value={formData.sizeInM2} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label>Data Prevista do Plantio:</label>
              <input type="date" name="plantingDate" value={formData.plantingDate} onChange={handleInputChange} required />
            </div>
          </div>

          {/* PAINEL DE INTELIGÊNCIA (Calculado em tempo real) */}
          {calcResult && (
            <div className="calc-summary-box">
              <div className="summary-header">
                <Calculator size={18} /> <span>Estimativa Técnica de Safra</span>
              </div>
              <div className="summary-grid">
                <div className="summary-item">
                  <Hash size={16} className="text-amber" />
                  <div>
                    <span className="summary-label">Estande (Plantas)</span>
                    <span className="summary-value">{calcResult.baseStand.toLocaleString()} un</span>
                  </div>
                </div>
                <div className="summary-item">
                  <Sprout size={16} className="text-emerald" />
                  <div>
                    <span className="summary-label">Sementes/Mudas</span>
                    <span className="summary-value">{calcResult.requiredSeeds.toLocaleString()} un</span>
                  </div>
                </div>
                <div className="summary-item">
                  <Wheat size={16} className="text-blue" />
                  <div>
                    <span className="summary-label">Produtividade Esperada</span>
                    <span className="summary-value">{calcResult.expectedYieldKg.toLocaleString()} kg</span>
                  </div>
                </div>
              </div>
              <p className="summary-footer">
                <Info size={12} /> Margem de segurança de 10% e germinação de 95% aplicadas.
              </p>
            </div>
          )}

          {isCalculating && <div className="calculating-loader">Recalculando estande...</div>}

          <div className="modal-actions">
            <button type="button" className="modal-button cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="modal-button submit" disabled={isLoading}>
              {isLoading ? "Processando..." : "Confirmar e Gerar Lote"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddGardenModal;