import React, { useState, useEffect } from 'react';
import { Leaf, Maximize2, TrendingUp, ShoppingBasket, History, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import * as gardenService from '../../../../service/gardenService';
import api from '../../../../service/api';

const TabOverview: React.FC<{ garden: any; onUpdate: any; onClose: any }> = ({ garden, onUpdate, onClose }) => {
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [harvestData, setHarvestData] = useState({ yieldKg: '', isFinal: true });
  const [harvestHistory, setHarvestHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.get(`/harvest/garden/${garden.id}`)
      .then(res => setHarvestHistory(res.data))
      .catch(() => {});
  }, [garden.id]);

  const handleHarvest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/harvest', {
        gardenId: garden.id,
        yieldKg: parseFloat(harvestData.yieldKg),
        isFinalHarvest: harvestData.isFinal,
        harvestDate: new Date().toISOString()
      });
      toast.success("Safra colhida!");
      if (harvestData.isFinal) { onUpdate({ ...garden, isActive: false }); onClose(); }
      else {
        const res = await api.get(`/harvest/garden/${garden.id}`);
        setHarvestHistory(res.data); setIsHarvesting(false);
      }
    } catch { toast.error("Erro ao colher."); }
    finally { setIsLoading(false); }
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition";

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Informações Gerais do Canteiro</h3>
          {garden.lotCode && <span className="text-xs text-slate-500">LOTE: {garden.lotCode}</span>}
        </div>
        {!isHarvesting && (
          <button onClick={() => setIsHarvesting(true)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition">
            <ShoppingBasket size={16} /> Registrar Colheita
          </button>
        )}
      </div>

      {isHarvesting ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
          <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-700 mb-1">
            <ShoppingBasket size={16} /> Finalizar Safra
          </h4>
          <p className="text-xs text-slate-500 mb-4">Insira os dados da colheita para atualizar a produção.</p>
          <form onSubmit={handleHarvest} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Peso Total Colhido (kg)</label>
              <input type="number" step="0.1" placeholder="Ex: 250.5" value={harvestData.yieldKg}
                onChange={e => setHarvestData({...harvestData, yieldKg: e.target.value})} required className={inputCls} />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={harvestData.isFinal}
                onChange={e => setHarvestData({...harvestData, isFinal: e.target.checked})}
                className="w-4 h-4 accent-emerald-500" />
              Encerrar ciclo e liberar canteiro?
            </label>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setIsHarvesting(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                Cancelar
              </button>
              <button type="submit" disabled={isLoading}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition shadow-sm disabled:opacity-60">
                {isLoading ? <><Loader2 size={14} className="animate-spin" /> Processando...</> : "Confirmar Colheita"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* KPI grid */}
          <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
            {[
              { icon: <Leaf size={18} className="text-emerald-600" />, bg: 'bg-emerald-50', label: 'Estande (Plantas)', value: `${(garden.sizeInM2 * 11).toLocaleString()} un` },
              { icon: <Maximize2 size={18} className="text-blue-600" />, bg: 'bg-blue-50', label: 'Área de Plantio', value: `${garden.sizeInM2} m²` },
              { icon: <TrendingUp size={18} className="text-amber-600" />, bg: 'bg-amber-50', label: 'Produção Estimada', value: '~ 7.500 kg' },
            ].map(kpi => (
              <div key={kpi.label} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${kpi.bg}`}>
                  {kpi.icon}
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">{kpi.label}</p>
                  <p className="text-base font-extrabold text-slate-900">{kpi.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Harvest history */}
          <div>
            <h4 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-3">
              <History size={15} /> Histórico de Colheitas
            </h4>
            {harvestHistory.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">Nenhuma colheita registrada para este lote.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {harvestHistory.map(h => (
                  <div key={h.id} className="flex items-center justify-between px-3 py-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <p className="text-xs font-medium text-slate-700">{new Date(h.harvestDate).toLocaleDateString('pt-BR')}</p>
                      {h.notes && <p className="text-xs text-slate-500">{h.notes}</p>}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-extrabold text-slate-900">{h.yieldKg} kg</span>
                      <CheckCircle size={14} className="text-emerald-500" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TabOverview;
