import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { BookOpen, Tag, AlignLeft, Save, Clock, User } from 'lucide-react';
import { getEntriesByGarden } from '../../../../service/journalService';
import * as gardenService from '../../../../service/gardenService';

const TYPE_BADGE: Record<string, string> = {
  Observation: 'bg-blue-50 text-blue-700 border-blue-200',
  Application:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pest:         'bg-red-50 text-red-700 border-red-200',
  Harvest:      'bg-amber-50 text-amber-700 border-amber-200',
};

const TabJournal: React.FC<{ garden: any }> = ({ garden }) => {
  const [formData, setFormData] = useState({ title: "", date: new Date().toISOString().split('T')[0], entryType: "Observation", description: "" });
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = () => getEntriesByGarden(garden.id).then(setEntries).catch(() => {});

  useEffect(() => { fetchHistory(); }, [garden.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await gardenService.addJournalEntry({ gardenId: garden.id, ...formData, type: formData.entryType });
      toast.success("Entrada salva no diário!");
      setFormData({ ...formData, title: "", description: "" });
      fetchHistory();
    } catch { toast.error("Erro ao salvar entrada."); }
    finally { setIsLoading(false); }
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition";
  const labelCls = "flex items-center gap-1 text-xs font-semibold text-slate-600 mb-1";

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
          <BookOpen size={18} />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Diário de Campo</h3>
          <p className="text-xs text-slate-500">Registre e consulte o histórico deste canteiro.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-slate-50 rounded-xl border border-slate-200 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}><Tag size={12} /> Título</label>
            <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              required className={inputCls} placeholder="Ex: Aplicação de fertilizante" />
          </div>
          <div>
            <label className={labelCls}><Tag size={12} /> Tipo</label>
            <select value={formData.entryType} onChange={e => setFormData({...formData, entryType: e.target.value})} className={inputCls}>
              <option value="Observation">Observação Geral</option>
              <option value="Application">Aplicação (Água/Insumo)</option>
              <option value="Pest">Praga / Doença</option>
              <option value="Harvest">Nota de Colheita</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}><AlignLeft size={12} /> Descrição</label>
          <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
            className={inputCls + " resize-none"} placeholder="Detalhes da ocorrência..." />
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition shadow-sm disabled:opacity-60">
            <Save size={15} /> {isLoading ? "Salvando..." : "Salvar Registro"}
          </button>
        </div>
      </form>

      {/* History */}
      <div>
        <h4 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-3">
          <Clock size={14} /> Histórico Recente
        </h4>
        {entries.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">Nenhum registro encontrado para este canteiro.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {entries.map(entry => (
              <div key={entry.id} className="flex gap-4 bg-white rounded-xl border border-slate-200 p-4">
                <div className="w-1 rounded-full bg-emerald-300 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs text-slate-400">{new Date(entry.createdAt).toLocaleDateString('pt-BR')}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TYPE_BADGE[entry.type] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {entry.type}
                    </span>
                  </div>
                  <h5 className="text-sm font-semibold text-slate-900">{entry.title}</h5>
                  {entry.description && <p className="text-xs text-slate-500 mt-0.5">{entry.description}</p>}
                  <div className="flex items-center gap-1 mt-1.5 text-[11px] text-slate-400">
                    <User size={11} /> {entry.user?.name || 'Sistema'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabJournal;
