import React, { useState, useEffect } from 'react';
import { PlusCircle, History, Package, ArrowRight, Beaker } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../../../service/api';
import * as gardenService from '../../../../service/gardenService';

import './TabSupplies.css';

const TabSupplies: React.FC<{ garden: any }> = ({ garden }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [availableSupplies, setAvailableSupplies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ supplyId: '', quantity: '', notes: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [hist, supplies] = await Promise.all([
          gardenService.getSupplyHistory(garden.id),
          api.get('/supplies')
        ]);
        setHistory(hist);
        setAvailableSupplies(supplies.data);
      } catch (err) {
        console.error("Erro ao carregar insumos:", err);
      }
    };
    loadData();
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* Adicionada a classe gdm-supplies-wrapper para isolamento */
    <div className="tab-supplies-container gdm-supplies-wrapper">
      {/* CARD DE REGISTRO RÁPIDO */}
      <section className="usage-registration-card">
        <div className="card-header">
          <div className="title-icon"><PlusCircle size={20} /></div>
          <div className="title-text">
            <h4>Registrar Manejo</h4>
            <p>Selecione o insumo e a quantidade aplicada neste canteiro.</p>
          </div>
        </div>

        <form onSubmit={handleApply} className="horizontal-usage-form">
          <div className="input-group main">
            <label><Package size={14} /> Insumo</label>
            <select 
              value={form.supplyId} 
              onChange={e => setForm({...form, supplyId: e.target.value})} 
              required
            >
              <option value="">Selecione um insumo...</option>
              {availableSupplies.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.quantity} {s.unit?.abbreviation} em estoque)
                </option>
              ))}
            </select>
          </div>

          <div className="input-group qty">
            <label><Beaker size={14} /> Qtd</label>
            <input 
              type="number" 
              step="0.01" 
              placeholder="0.00"
              value={form.quantity} 
              onChange={e => setForm({...form, quantity: e.target.value})} 
              required 
            />
          </div>

          <button type="submit" className="btn-apply-supply" disabled={isLoading}>
            {isLoading ? "..." : <ArrowRight size={20} />}
          </button>
        </form>
      </section>

      {/* LINHA DO TEMPO DE MANEJO */}
      <section className="history-section">
        <div className="section-header">
          <History size={18} />
          <h4>Histórico de Aplicações</h4>
        </div>

        <div className="history-list">
          {history.length === 0 ? (
            <div className="empty-history">
              <Package size={40} />
              <p>Nenhum insumo foi aplicado neste ciclo ainda.</p>
            </div>
          ) : (
            history.map(item => (
              <div key={item.id} className="history-item-card">
                <div className="date-badge">
                  <span className="day">{new Date(item.usedAt).getDate()}</span>
                  <span className="month">
                    {new Date(item.usedAt).toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}
                  </span>
                </div>
                
                <div className="item-details">
                  <div className="item-main">
                    <span className="supply-name">{item.supply.name}</span>
                    <span className="usage-qty">-{item.quantityUsed} {item.supply.unit?.abbreviation}</span>
                  </div>
                  {item.notes && <p className="item-notes">{item.notes}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default TabSupplies;