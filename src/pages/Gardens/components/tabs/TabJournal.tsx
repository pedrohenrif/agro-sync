import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { BookOpen, Tag, AlignLeft, Save, Clock, User } from 'lucide-react';
import { getEntriesByGarden } from '../../../../service/journalService';
import * as gardenService from '../../../../service/gardenService';

import './TabJournal.css';

const TabJournal: React.FC<{ garden: any }> = ({ garden }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split('T')[0],
    entryType: "Observation",
    description: ""
  });
  const [entries, setEntries] = useState<any[]>([]); // Estado para o histórico
  const [isLoading, setIsLoading] = useState(false);

  // Carregar histórico ao abrir a aba
  useEffect(() => {
    fetchHistory();
  }, [garden.id]);

  const fetchHistory = async () => {
    try {
      const data = await getEntriesByGarden(garden.id);
      setEntries(data);
    } catch (err) {
      console.error("Erro ao carregar histórico.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await gardenService.addJournalEntry({ 
        gardenId: garden.id, 
        ...formData,
        type: formData.entryType // Mapeando entryType para type do model
      });
      toast.success("Entrada salva no diário!");
      setFormData({ ...formData, title: "", description: "" });
      fetchHistory(); // Atualiza a lista automaticamente
    } catch (error) {
      toast.error("Erro ao salvar entrada.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tab-content-container gdm-journal-wrapper">
      <div className="journal-header">
        <div className="header-icon-box"><BookOpen size={20} /></div>
        <div className="header-text">
          <h3>Diário de Campo</h3>
          <p>Registre e consulte o histórico deste canteiro.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="modal-form-reused journal-form-compact">
        <div className="form-grid">
          <div className="form-group">
            <label><Tag size={14} /> Título</label>
            <input 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              required className="form-input" placeholder="Ex: Aplicação de fertilizante" 
            />
          </div>
          <div className="form-group">
            <label><Tag size={14} /> Tipo</label>
            <select 
              value={formData.entryType} 
              onChange={e => setFormData({...formData, entryType: e.target.value})} 
              className="form-select"
            >
              <option value="Observation">Observação Geral</option>
              <option value="Application">Aplicação (Água/Insumo)</option>
              <option value="Pest">Praga / Doença</option>
              <option value="Harvest">Nota de Colheita</option>
            </select>
          </div>
        </div>
        <div className="form-group full-width">
          <label><AlignLeft size={14} /> Descrição</label>
          <textarea 
            rows={3} value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
            className="form-textarea" placeholder="Detalhes da ocorrência..." 
          />
        </div>
        <div className="journal-actions">
          <button type="submit" className="btn-save-journal" disabled={isLoading}>
            <Save size={18} /> {isLoading ? "Salvando..." : "Salvar Registro"}
          </button>
        </div>
      </form>

      {/* --- LINHA DO TEMPO (HISTÓRICO) --- */}
      <div className="journal-history-section">
        <h4 className="history-title"><Clock size={16} /> Histórico Recente</h4>
        <div className="journal-timeline">
          {entries.length === 0 ? (
            <p className="no-entries">Nenhum registro encontrado para este canteiro.</p>
          ) : (
            entries.map(entry => (
              <div key={entry.id} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="timeline-date">{new Date(entry.createdAt).toLocaleDateString('pt-BR')}</span>
                    <span className={`entry-badge ${entry.type.toLowerCase()}`}>{entry.type}</span>
                  </div>
                  <h5>{entry.title}</h5>
                  <p>{entry.description}</p>
                  <div className="timeline-footer">
                    <User size={12} /> <span>{entry.user?.name || 'Sistema'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TabJournal;