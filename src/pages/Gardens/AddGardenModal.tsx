import React, { useState, useEffect } from 'react';
import { X, Sprout, Calculator, Wheat, Hash, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import * as gardenService from '../../service/gardenService';
import api from '../../service/api';

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
    crop: "Vazio", // Valor padrão para canteiros sem plantio imediato
    plantingDate: "", // Vazio inicialmente
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
      api.get('/crop-plans')
        .then(res => setCropPlans(res.data))
        .catch(() => toast.error("Erro ao carregar planos de cultivo."));
    }
  }, [isOpen]);

  // 2. Lógica de Cálculo Automático (Estande) - Só dispara se houver plano selecionado
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.sizeInM2 && formData.cropPlanId) {
        handleCalculate();
      } else {
        setCalcResult(null); // Limpa cálculos se desmarcar o plano
      }
    }, 600);
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
    
    if (name === 'cropPlanId') {
      const selectedPlan = cropPlans.find(p => p.id === Number(value));
      setFormData(prev => ({ 
        ...prev, 
        cropPlanId: value, 
        crop: selectedPlan?.culture || "Vazio",
        // Se selecionar um plano, sugere a data de hoje para o plantio
        plantingDate: value ? new Date().toISOString().split('T')[0] : "" 
      }));
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
        cropPlanId: formData.cropPlanId ? Number(formData.cropPlanId) : null,
        plantingDate: formData.plantingDate || undefined 
      };
      
      const newGarden = await gardenService.createGarden(payload);
      
      const successMsg = payload.cropPlanId 
        ? "Plantio registrado com sucesso! Lote gerado." 
        : "Canteiro criado e disponível para plantio!";
        
      toast.success(successMsg);
      onSave(newGarden);
      onClose();
      
      // Reset do estado
      setFormData({ name: "", crop: "Vazio", plantingDate: "", sizeInM2: "", location: "", cropPlanId: "" });
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
              <Sprout size={24} color="#2e7d32" /> Configurar Novo Canteiro
            </h2>
            <button type="button" className="modal-close-button" onClick={onClose}><X size={24} /></button>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Identificação/Nome:</label>
              <input name="name" placeholder="Ex: Canteiro 01 - Setor Norte" value={formData.name} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label>Área Útil (m²):</label>
              <input type="number" name="sizeInM2" placeholder="Ex: 50" value={formData.sizeInM2} onChange={handleInputChange} required />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label style={{ color: '#2e7d32', fontWeight: 'bold' }}>Plano de Cultivo (Opcional):</label>
              <select name="cropPlanId" value={formData.cropPlanId} onChange={handleInputChange}>
                <option value="">Não iniciar plantio agora (Canteiro Vazio)</option>
                {cropPlans.map(plan => (
                  <option key={plan.id} value={plan.id}>{plan.name} ({plan.culture})</option>
                ))}
              </select>
              <small className="help-text">Selecione um plano se desejar iniciar o cultivo imediatamente.</small>
            </div>

            {/* Campos condicionais: Só aparecem se houver um plano selecionado */}
            {formData.cropPlanId && (
              <>
                <div className="form-group animate-in">
                  <label>Data de Início do Plantio:</label>
                  <input type="date" name="plantingDate" value={formData.plantingDate} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Localização:</label>
                  <input name="location" placeholder="Ex: Estufa A" value={formData.location} onChange={handleInputChange} />
                </div>
              </>
            )}
          </div>

          {/* PAINEL DE INTELIGÊNCIA - Só renderiza se houver cálculo e plano */}
          {calcResult && formData.cropPlanId && (
            <div className="calc-summary-box animate-in">
              <div className="summary-header">
                <Calculator size={18} /> <span>Projeção de Safra</span>
              </div>
              <div className="summary-grid">
                <div className="summary-item">
                  <Hash size={16} className="text-amber" />
                  <div>
                    <span className="summary-label">Estande</span>
                    <span className="summary-value">{calcResult.baseStand.toLocaleString()} un</span>
                  </div>
                </div>
                <div className="summary-item">
                  <Sprout size={16} className="text-emerald" />
                  <div>
                    <span className="summary-label">Sementes</span>
                    <span className="summary-value">{calcResult.requiredSeeds.toLocaleString()} un</span>
                  </div>
                </div>
                <div className="summary-item">
                  <Wheat size={16} className="text-blue" />
                  <div>
                    <span className="summary-label">Produção Est.</span>
                    <span className="summary-value">{calcResult.expectedYieldKg.toLocaleString()} kg</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isCalculating && <div className="calculating-loader">Processando estimativas...</div>}

          <div className="modal-actions">
            <button type="button" className="modal-button cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="modal-button submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Finalizar Cadastro"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddGardenModal;