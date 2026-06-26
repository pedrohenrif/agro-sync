import React, { useState } from "react";
import { toast } from 'react-toastify';
import { X, BookText, Save } from 'lucide-react';
import { Garden } from "./types";
import * as gardenService from '../../service/gardenService';

type EntryType = "Observation" | "Application" | "Pest" | "Harvest";

interface FieldJournalModalProps {
  garden: Garden;
  onClose: () => void;
  onSave?: () => void;
}

const FieldJournalModal: React.FC<FieldJournalModalProps> = ({ garden, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [entryType, setEntryType] = useState<EntryType>("Observation");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await gardenService.addJournalEntry({ gardenId: garden.id, title, date, entryType, description });
      toast.success("Entrada no diário salva com sucesso!");
      onSave?.(); onClose();
    } catch { toast.error("Falha ao salvar a entrada. Tente novamente."); }
    finally { setIsLoading(false); }
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition disabled:bg-slate-50";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-lg animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <BookText size={20} className="text-emerald-600" /> Diário de Campo: {garden.name}
          </h2>
          <button onClick={onClose} disabled={isLoading} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className={labelCls}>Título da Entrada</label>
            <input type="text" placeholder="Ex: Primeiros brotos visíveis"
              value={title} onChange={e => setTitle(e.target.value)} required disabled={isLoading} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Data</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required disabled={isLoading} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Tipo de Entrada</label>
              <select value={entryType} onChange={e => setEntryType(e.target.value as EntryType)} disabled={isLoading} className={inputCls}>
                <option value="Observation">Observação</option>
                <option value="Application">Aplicação (Fertilizante, Água)</option>
                <option value="Pest">Praga / Doença</option>
                <option value="Harvest">Colheita</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Notas (Descrição)</label>
            <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Descreva o que aconteceu, o que foi aplicado, etc."
              disabled={isLoading} className={inputCls + " resize-none"} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition shadow-sm disabled:opacity-60">
              <Save size={16} /> {isLoading ? "Salvando..." : "Salvar no Diário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldJournalModal;
