import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { Garden } from '../../types';
import * as gardenService from '../../../../service/gardenService';

const TabEdit: React.FC<{ garden: Garden; onClose: () => void; onSave: (g: Garden) => void }> = ({ garden, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: garden.name,
    crop: garden.crop,
    plantingDate: new Date(garden.plantingDate).toISOString().split('T')[0],
    sizeInM2: garden.sizeInM2.toString(),
    location: garden.location || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updated = await gardenService.updateGarden(garden.id, { ...formData, sizeInM2: parseFloat(formData.sizeInM2) || 0 });
      toast.success("Informações atualizadas!");
      onSave(updated); onClose();
    } catch { toast.error("Falha ao atualizar o canteiro."); }
    finally { setIsLoading(false); }
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1";

  return (
    <div className="p-6">
      <div className="mb-5">
        <h3 className="text-base font-bold text-slate-900">Atualizar Dados do Canteiro</h3>
        <p className="text-sm text-slate-500 mt-0.5">Modifique as informações básicas de registro deste lote.</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Nome do Canteiro</label>
            <input name="name" value={formData.name} onChange={handleChange} required className={inputCls} placeholder="Ex: Canteiro Norte 01" />
          </div>
          <div>
            <label className={labelCls}>Cultura / Variedade</label>
            <input name="crop" value={formData.crop} onChange={handleChange} required className={inputCls} placeholder="Ex: Alface Crespa" />
          </div>
          <div>
            <label className={labelCls}>Data de Plantio</label>
            <input type="date" name="plantingDate" value={formData.plantingDate} onChange={handleChange} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Tamanho da Área (m²)</label>
            <input type="number" name="sizeInM2" value={formData.sizeInM2} onChange={handleChange} required step="0.1" className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Localização / Referência</label>
          <input name="location" value={formData.location} onChange={handleChange} className={inputCls} placeholder="Ex: Setor A - Próximo à caixa d'água" />
        </div>
        <div className="flex justify-end pt-2">
          <button type="submit" disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition shadow-sm disabled:opacity-60">
            <Save size={16} /> {isLoading ? "Atualizando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TabEdit;
