import React, { useState, useEffect } from 'react';
import { PlusCircle, History, Package, ArrowRight, Beaker, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../../../service/api';
import * as gardenService from '../../../../service/gardenService';

const TabSupplies: React.FC<{ garden: any }> = ({ garden }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [availableSupplies, setAvailableSupplies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ supplyId: '', quantity: '', notes: '' });

  useEffect(() => {
    Promise.all([gardenService.getSupplyHistory(garden.id), api.get('/supplies')])
      .then(([hist, supplies]) => { setHistory(hist); setAvailableSupplies(supplies.data); })
      .catch(() => {});
  }, [garden.id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/usage/apply', {
        gardenId: garden.id,
        supplyId: Number(form.supplyId),
        quantityApplied: Number(form.quantity),
        notes: form.notes
      });
      toast.success("Insumo aplicado com sucesso!");
      const updated = await gardenService.getSupplyHistory(garden.id);
      setHistory(updated);
      setForm({ supplyId: '', quantity: '', notes: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erro ao registrar aplicação.");
    } finally { setIsLoading(false); }
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition";

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Quick register card */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
            <PlusCircle size={16} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Registrar Manejo</h4>
            <p className="text-xs text-slate-500">Selecione o insumo e a quantidade aplicada.</p>
          </div>
        </div>
        <form onSubmit={handleApply} className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1"><Package size={11} /> Insumo</label>
            <select value={form.supplyId} onChange={e => setForm({...form, supplyId: e.target.value})} required className={inputCls}>
              <option value="">Selecione um insumo...</option>
              {availableSupplies.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.quantity} {s.unit?.abbreviation} em estoque)</option>
              ))}
            </select>
          </div>
          <div className="w-24">
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1"><Beaker size={11} /> Qtd</label>
            <input type="number" step="0.01" placeholder="0.00" value={form.quantity}
              onChange={e => setForm({...form, quantity: e.target.value})} required className={inputCls} />
          </div>
          <button type="submit" disabled={isLoading}
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition disabled:opacity-60">
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={18} />}
          </button>
        </form>
      </div>

      {/* History */}
      <div>
        <h4 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-3">
          <History size={15} /> Histórico de Aplicações
        </h4>
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400 gap-2">
            <Package size={32} className="text-slate-300" />
            <p className="text-sm">Nenhum insumo foi aplicado neste ciclo ainda.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {history.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200">
                <div className="w-10 text-center flex-shrink-0">
                  <p className="text-base font-extrabold text-slate-900">{new Date(item.usedAt).getDate()}</p>
                  <p className="text-[10px] text-slate-400 uppercase">
                    {new Date(item.usedAt).toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900">{item.supply.name}</span>
                    <span className="text-sm font-bold text-red-600">-{item.quantityUsed} {item.supply.unit?.abbreviation}</span>
                  </div>
                  {item.notes && <p className="text-xs text-slate-500 mt-0.5">{item.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabSupplies;
