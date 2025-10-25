// ARQUIVO: src/pages/HortasCadastradas/FieldJournalModal.tsx

import React, { useState } from "react";
import api from '../../service/api'; // Ajuste o caminho se necessário
import { toast } from 'react-toastify';
import { Garden } from "./types"; // Importando o tipo Garden

// Importando o CSS específico deste modal
import './FieldJournalModal.css'; 

// Tipos específicos para este modal
type EntryType = "Observação" | "Aplicação" | "Praga" | "Colheita";

interface FieldJournalModalProps {
  garden: Garden;       // O canteiro ao qual a entrada pertence
  onClose: () => void;  // Função para fechar o modal
  onSave?: () => void;  // Opcional: Função chamada após salvar com sucesso
}

const FieldJournalModal: React.FC<FieldJournalModalProps> = ({ garden, onClose, onSave }) => {
  // Estado interno do formulário
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Data atual como padrão
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
      // Endpoint da API para salvar a entrada (você precisa criar no backend)
      await api.post('/manager-garden/add-journal-entry', newEntry);

      toast.success("Entrada do diário salva com sucesso!"); 
      setIsLoading(false);
      onSave?.(); // Chama a função onSave, se ela foi passada
      onClose();   // Fecha o modal
    } catch (error) {
      console.error("Erro ao salvar entrada do diário:", error);
      toast.error("Falha ao salvar a entrada. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    // O backdrop que escurece o fundo
    <div className="field-journal-modal-backdrop"> 
      {/* O conteúdo do modal */}
      <div className="field-journal-modal-content"> 
        <form onSubmit={handleSubmit} className="field-journal-modal-form">
          {/* Título do Modal */}
          <h2 className="modal-title">
            <span role="img" aria-label="notebook">📓</span> Novo Diário de Campo: {garden.name}
          </h2>
          
          {/* Campo: Título */}
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

          {/* Campo: Data */}
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

          {/* Campo: Tipo de Entrada */}
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

          {/* Campo: Descrição */}
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

          {/* Botões de Ação */}
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