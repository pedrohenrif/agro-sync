import React, { useState } from "react";
import { toast } from 'react-toastify';
import { X, BookText } from 'lucide-react'; 
import { Garden } from "./types";
import * as gardenService from '../../service/gardenService';

import './FieldJournalModal.css'; 

// Tipagem interna permanece em inglês para padronização do código
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

    const newEntry = {
      gardenId: garden.id,
      title,
      date,
      entryType,
      description,
    };

    try {
      await gardenService.addJournalEntry(newEntry);
      toast.success("Entrada no diário salva com sucesso!"); 
      onSave?.();
      onClose();
    } catch (error) {
      console.error("Error saving journal entry:", error);
      toast.error("Falha ao salvar a entrada. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="field-journal-modal-backdrop"> 
      <div className="field-journal-modal-content"> 
        <form onSubmit={handleSubmit} className="field-journal-modal-form">
          
          <div className="modal-header">
            <h2 className="modal-title">
              <BookText size={24} color="#2e7d32" style={{ marginRight: '8px' }} /> 
              Diário de Campo: {garden.name}
            </h2>
            <button type="button" className="modal-close-button" onClick={onClose} disabled={isLoading}>
              <X size={24} />
            </button>
          </div>
          
          <div className="form-group">
            <label htmlFor="journal-title">Título da Entrada:</label>
            <input
              id="journal-title"
              type="text"
              placeholder="Ex: Primeiros brotos visíveis"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isLoading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="journal-date">Data:</label>
            <input
              id="journal-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={isLoading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="journal-entryType">Tipo de Entrada:</label>
            <select
              id="journal-entryType"
              value={entryType}
              onChange={(e) => setEntryType(e.target.value as EntryType)}
              disabled={isLoading}
              className="form-select"
            >
              <option value="Observation">Observação</option>
              <option value="Application">Aplicação (Fertilizante, Água)</option>
              <option value="Pest">Praga / Doença</option>
              <option value="Harvest">Colheita</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="journal-description">Notas (Descrição):</label>
            <textarea
              id="journal-description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o que aconteceu, o que foi aplicado, etc."
              disabled={isLoading}
              className="form-textarea"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-button cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="modal-button submit"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar no Diário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldJournalModal;