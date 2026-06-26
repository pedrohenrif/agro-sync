import React, { useState } from "react";
import { X, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { Garden } from "./types";
import * as gardenService from '../../service/gardenService';

interface EditGardenModalProps {
  garden: Garden;
  onClose: () => void;
  onSave: (updatedGarden: Garden) => void;
}

const formatDate = (d: string) => { try { return new Date(d).toISOString().split('T')[0]; } catch { return ''; } };

const EditGardenModal: React.FC<EditGardenModalProps> = ({ garden, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: garden.name,
    crop: garden.crop,
    plantingDate: formatDate(garden.plantingDate),
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
      toast.success("Canteiro atualizado com sucesso!");
      onSave(updated); onClose();
    } catch { toast.error("Falha ao atualizar o canteiro."); }
    finally { setIsLoading(false); }
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition disabled:bg-slate-50";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Editar Canteiro</h2>
          <button onClick={onClose} disabled={isLoading} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className={labelCls}>Nome do Canteiro</label>
            <input name="name" value={formData.name} onChange={handleChange} required disabled={isLoading} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Cultura</label>
            <input name="crop" value={formData.crop} onChange={handleChange} required disabled={isLoading} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Data de Plantio</label>
              <input type="date" name="plantingDate" value={formData.plantingDate} onChange={handleChange} required disabled={isLoading} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Tamanho (m²)</label>
              <input type="number" name="sizeInM2" value={formData.sizeInM2} onChange={handleChange} required step="0.1" disabled={isLoading} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Localização</label>
            <input name="location" value={formData.location} onChange={handleChange} disabled={isLoading} className={inputCls} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition shadow-sm disabled:opacity-60">
              <Save size={16} /> {isLoading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGardenModal;
