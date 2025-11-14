// ARQUIVO: src/pages/HortasCadastradas/FieldJournalModal.tsx

import React, { useState } from "react";
import api from '../../service/api';
import { toast } from 'react-toastify';
import { X } from 'lucide-react'; // Importando o ícone de Fechar
import { Garden } from "./types";

import './FieldJournalModal.css'; 

type EntryType = "Observação" | "Aplicação" | "Praga" | "Colheita";

interface FieldJournalModalProps {
  garden: Garden;
  onClose: () => void;
  onSave?: () => void;
}

const FieldJournalModal: React.FC<FieldJournalModalProps> = ({ garden, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [entryType, setEntryType] = useState<EntryType>("Observação");
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
      await api.post('/manager-garden/add-journal-entry', newEntry);

      toast.success("Entrada do diário salva com sucesso!"); 
      setIsLoading(false);
      onSave?.();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar entrada do diário:", error);
      toast.error("Falha ao salvar a entrada. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <div className="field-journal-modal-backdrop"> 
      <div className="field-journal-modal-content"> 
        <form onSubmit={handleSubmit} className="field-journal-modal-form">
          
          <div className="modal-header">
            <h2 className="modal-title">
              <span role="img" aria-label="notebook">📓</span> Novo Diário de Campo: {garden.name}
            </h2>
            {/* Adicionando o botão de fechar (X) que faltava */}
            <button type="button" className="modal-close-button" onClick={onClose} disabled={isLoading}>
              <X size={24} />
            </button>
          </div>
          
          <div className="form-group">
            <label htmlFor="journal-title">Título da Entrada:</label>
            <input
              id="journal-title"
              type="text"
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
              <option value="Observação">Observação</option>
              <option value="Aplicação">Aplicação (Fertilizante, Água)</option>
              <option value="Praga">Praga / Doença</option>
              <option value="Colheita">Colheita</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="journal-description">História (Descrição):</label>
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