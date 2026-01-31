import React, { useState, useEffect } from 'react';
import { Leaf, Maximize2, TrendingUp, Calculator, ShoppingBasket, History, CheckCircle } from 'lucide-react';
import { BlockMath } from 'react-katex';
import { toast } from 'react-toastify';

import * as gardenService from '../../../../service/gardenService';
import api from '../../../../service/api';

import './TabOverview.css';

const TabOverview: React.FC<{ garden: any, onUpdate: any, onClose: any }> = ({ garden, onUpdate, onClose }) => {
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [harvestData, setHarvestData] = useState({ yieldKg: '', isFinal: true });
  const [harvestHistory, setHarvestHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/harvest/garden/${garden.id}`);
        setHarvestHistory(res.data);
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
      }
    };
    fetchHistory();
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
      if (harvestData.isFinal) {
        onUpdate({ ...garden, isActive: false });
        onClose();
      } else {
        const res = await api.get(`/harvest/garden/${garden.id}`);
        setHarvestHistory(res.data);
        setIsHarvesting(false);
      }
    } catch (err) {
      toast.error("Erro ao colher.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tab-content-container">
      {/* 1. CABEÇALHO */}
      <div className="overview-header-box">
        <div className="title-group">
          <h3>Informações Gerais do Canteiro</h3>
          <span className="lot-badge">LOTE: {garden.lotCode}</span>
        </div>
        
        {!isHarvesting && (
          <button className="btn-harvest-trigger" onClick={() => setIsHarvesting(true)}>
            <ShoppingBasket size={18} /> Registrar Colheita
          </button>
        )}
      </div>

      {/* 2. CONTEÚDO CONDICIONAL (FORMULÁRIO OU DASHBOARD) */}
      {isHarvesting ? (
        <div className="harvest-form-box">
          <div className="harvest-form-header">
            <h4><ShoppingBasket size={20} /> Finalizar Safra</h4>
            <p>Insira os dados da colheita para atualizar a produção e o dashboard.</p>
          </div>
          
          <form onSubmit={handleHarvest} className="mini-form-harvest">
            <div className="form-group">
              <label>Peso Total Colhido (kg):</label>
              <input 
                type="number" 
                step="0.1" 
                className="form-input"
                placeholder="Ex: 250.5"
                value={harvestData.yieldKg} 
                onChange={e => setHarvestData({...harvestData, yieldKg: e.target.value})} 
                required 
              />
            </div>
            
            <div className="form-check">
              <input 
                type="checkbox" 
                id="finalHarvest"
                checked={harvestData.isFinal} 
                onChange={e => setHarvestData({...harvestData, isFinal: e.target.checked})} 
              />
              <label htmlFor="finalHarvest">Encerrar ciclo e liberar canteiro?</label>
            </div>

            <div className="btn-group">
              <button type="button" className="btn-cancel" onClick={() => setIsHarvesting(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn-confirm-harvest" disabled={isLoading}>
                {isLoading ? "Processando..." : "Confirmar Colheita"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* GRID DE KPIs */}
          <div className="stats-kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon bg-emerald-light"><Leaf size={20} /></div>
              <div className="kpi-data">
                <span className="kpi-label">Estande (Plantas)</span>
                <span className="kpi-value">{(garden.sizeInM2 * 11).toLocaleString()} un</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon bg-blue-light"><Maximize2 size={20} /></div>
              <div className="kpi-data">
                <span className="kpi-label">Área de Plantio</span>
                <span className="kpi-value">{garden.sizeInM2} m²</span>
              </div>
            </div>

            <div className="kpi-card highlight-gold">
              <div className="kpi-icon bg-amber-light"><TrendingUp size={20} /></div>
              <div className="kpi-data">
                <span className="kpi-label">Produção Estimada</span>
                <span className="kpi-value">~ 7.500 kg</span>
              </div>
            </div>
          </div>

          <div className="tab-divider"></div>

          {/* HISTÓRICO DE COLHEITAS REALIZADAS */}
          <div className="harvest-history-section">
            <h4><History size={18} /> Histórico de Colheitas</h4>
            {harvestHistory.length === 0 ? (
              <p className="empty-msg">Nenhuma colheita registrada para este lote.</p>
            ) : (
              <div className="harvest-timeline">
                {harvestHistory.map(h => (
                  <div key={h.id} className="harvest-history-item">
                    <div className="h-info">
                      <span className="h-date">{new Date(h.harvestDate).toLocaleDateString('pt-BR')}</span>
                      <span className="h-notes">{h.notes}</span>
                    </div>
                    <div className="h-weight">
                      <strong>{h.yieldKg} kg</strong>
                      <CheckCircle size={16} color="#10b981" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="tab-divider"></div>

          {/* BASE AGRONÔMICA */}
          <div className="technical-calc-box">
            <h4><Calculator size={16} /> Cálculo de Base Agronômica</h4>
            <p>Projeção de produtividade baseada no mix de plantio e eficiência comercial:</p>
            <div className="formula-box">
              <BlockMath math="\text{Produtividade} = \text{Estande} \times \text{Peso Médio} \times \text{Eficiência}" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TabOverview;