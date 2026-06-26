import React, { useState, useEffect } from 'react';
import { X, Sprout, Calculator, Wheat, Hash, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import * as gardenService from '../../service/gardenService';
import api from '../../service/api';

interface CropPlan { id: number; name: string; culture: string }
interface CalcResult { baseStand: number; requiredSeeds: number; expectedYieldKg: number }

interface AddGardenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newGarden: any) => void;
}

const AddGardenModal: React.FC<AddGardenModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "", crop: "Vazio", plantingDate: "", sizeInM2: "", location: "", cropPlanId: ""
  });
  const [cropPlans, setCropPlans] = useState<CropPlan[]>([]);
  const [calcResult, setCalcResult] = useState<CalcResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.get('/crop-plans')
        .then(res => setCropPlans(res.data))
        .catch(() => toast.error("Erro ao carregar planos de cultivo."));
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.sizeInM2 && formData.cropPlanId) {
        setIsCalculating(true);
        api.post('/gardens/calculate-stand', { areaM2: Number(formData.sizeInM2), cropPlanId: Number(formData.cropPlanId) })
          .then(res => setCalcResult(res.data))
          .catch(() => setCalcResult(null))
          .finally(() => setIsCalculating(false));
      } else { setCalcResult(null); }
    }, 600);
    return () => clearTimeout(timer);
  }, [formData.sizeInM2, formData.cropPlanId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'cropPlanId') {
      const selectedPlan = cropPlans.find(p => p.id === Number(value));
      setFormData(prev => ({
        ...prev, cropPlanId: value, crop: selectedPlan?.culture || "Vazio",
        plantingDate: value ? new Date().toISOString().split('T')[0] : ""
      }));
    } else { setFormData(prev => ({ ...prev, [name]: value })); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        sizeInM2: Number(formData.sizeInM2),
        cropPlanId: formData.cropPlanId ? Number(formData.cropPlanId) : null,
        plantingDate: formData.plantingDate || undefined
      };
      const newGarden = await gardenService.createGarden(payload);
      toast.success(payload.cropPlanId ? "Plantio registrado com sucesso! Lote gerado." : "Canteiro criado e disponível para plantio!");
      onSave(newGarden);
      onClose();
      setFormData({ name: "", crop: "Vazio", plantingDate: "", sizeInM2: "", location: "", cropPlanId: "" });
      setCalcResult(null);
    } catch { toast.error("Falha ao criar o canteiro."); }
    finally { setIsLoading(false); }
  };

  if (!isOpen) return null;

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-lg animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Sprout size={20} className="text-emerald-600" /> Configurar Novo Canteiro
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Identificação/Nome</label>
              <input name="name" placeholder="Ex: Canteiro 01 - Setor Norte"
                value={formData.name} onChange={handleInputChange} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Área Útil (m²)</label>
              <input type="number" name="sizeInM2" placeholder="Ex: 50"
                value={formData.sizeInM2} onChange={handleInputChange} required className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls + " text-emerald-700"}>Plano de Cultivo (Opcional)</label>
            <select name="cropPlanId" value={formData.cropPlanId} onChange={handleInputChange} className={inputCls}>
              <option value="">Não iniciar plantio agora (Canteiro Vazio)</option>
              {cropPlans.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.name} ({plan.culture})</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-400">Selecione um plano se desejar iniciar o cultivo imediatamente.</p>
          </div>

          {formData.cropPlanId && (
            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              <div>
                <label className={labelCls}>Data de Início do Plantio</label>
                <input type="date" name="plantingDate" value={formData.plantingDate}
                  onChange={handleInputChange} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Localização</label>
                <input name="location" placeholder="Ex: Estufa A" value={formData.location}
                  onChange={handleInputChange} className={inputCls} />
              </div>
            </div>
          )}

          {isCalculating && (
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
              <Loader2 size={14} className="animate-spin" /> Processando estimativas...
            </div>
          )}

          {calcResult && formData.cropPlanId && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 mb-3">
                <Calculator size={16} /> Projeção de Safra
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <Hash size={15} className="text-amber-500" />, label: 'Estande', value: `${calcResult.baseStand.toLocaleString()} un` },
                  { icon: <Sprout size={15} className="text-emerald-500" />, label: 'Sementes', value: `${calcResult.requiredSeeds.toLocaleString()} un` },
                  { icon: <Wheat size={15} className="text-blue-500" />, label: 'Produção Est.', value: `${calcResult.expectedYieldKg.toLocaleString()} kg` },
                ].map(item => (
                  <div key={item.label} className="bg-white rounded-lg p-3 border border-emerald-100 text-center">
                    <div className="flex justify-center mb-1">{item.icon}</div>
                    <p className="text-[10px] text-slate-500 font-medium">{item.label}</p>
                    <p className="text-sm font-extrabold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition shadow-sm disabled:opacity-60">
              {isLoading ? "Salvando..." : "Finalizar Cadastro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGardenModal;
