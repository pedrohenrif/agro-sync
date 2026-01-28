import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BookOpen, Tag, AlignLeft, Save } from 'lucide-react';
import * as gardenService from '../../../../../service/gardenService';

import './TabJournal.css';

const TabJournal: React.FC<{ garden: any }> = ({ garden }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split('T')[0],
    entryType: "Observation",
    description: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await gardenService.addJournalEntry({ gardenId: garden.id, ...formData });
      toast.success("Entrada salva no diário!");
      setFormData({ ...formData, title: "", description: "" });
    } catch (error) {
      toast.error("Erro ao salvar entrada.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tab-content-container gdm-journal-wrapper">
      <div className="journal-header">
        <div className="header-icon-box">
          <BookOpen size={20} />
        </div>
        <div className="header-text">
          <h3>Diário de Campo</h3>
          <p>Registre observações, pragas ou aplicações feitas neste canteiro.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="modal-form-reused">
        <div className="form-grid">
          <div className="form-group">
            <label><Tag size={14} /> Título da Ocorrência</label>
            <input 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              required 
              className="form-input" 
              placeholder="Ex: Identificação de Pulgão" 
            />
          </div>

          <div className="form-group">
            <label><Tag size={14} /> Tipo de Registro</label>
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
          <label><AlignLeft size={14} /> Descrição Detalhada</label>
          <textarea 
            rows={5} 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
            className="form-textarea" 
            placeholder="Descreva aqui o que foi observado, produtos utilizados ou qualquer detalhe relevante para o histórico..." 
          />
        </div>

        <div className="journal-actions">
          <button type="submit" className="btn-save-journal" disabled={isLoading}>
            {isLoading ? "Salvando..." : (
              <>
                <Save size={18} /> Salvar Registro
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TabJournal;