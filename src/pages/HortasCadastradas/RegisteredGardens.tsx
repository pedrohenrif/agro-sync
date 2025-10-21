import React, { useEffect, useState } from "react";
// O 'axios' não estava sendo usado, então removi. O 'api' é o correto.
import api from '../../service/api';

import "./RegisteredGardens.css";
import EditGardenModal from "./EditGardenModal";
import DeleteGardenModal from "./DeleteGardenModal";

import { Garden } from "./types";

// ==================================================================
// NOVO COMPONENTE: MODAL DO DIÁRIO DE CAMPO
// ==================================================================
// Criamos os tipos para o formulário do diário
type EntryType = "Observação" | "Aplicação" | "Praga" | "Colheita";

interface FieldJournalModalProps {
  garden: Garden;
  onClose: () => void;
}

const FieldJournalModal: React.FC<FieldJournalModalProps> = ({ garden, onClose }) => {
  // Estado interno do formulário do modal
  const [title, setTitle] = useState("");
  // Define a data de hoje como padrão
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [entryType, setEntryType] = useState<EntryType>("Observação");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento da página
    setIsLoading(true);

    const newEntry = {
      gardenId: garden.id,
      title,
      date,
      entryType,
      description,
    };

    try {
      // ATENÇÃO: Este é um endpoint de API que você precisará criar no seu backend!
      await api.post('/manager-garden/add-journal-entry', newEntry);

      alert("Entrada do diário salva com sucesso!");
      setIsLoading(false);
      onClose(); // Fecha o modal após o sucesso
    } catch (error) {
      console.error("Erro ao salvar entrada do diário:", error);
      alert("Falha ao salvar a entrada. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <form onSubmit={handleSubmit} className="modal-form">
          <h2>Novo Diário de Campo: {garden.name}</h2>
          
          <label htmlFor="title">Título da Entrada:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="date">Data:</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          {/* Minha sugestão: um campo de tipo para organizar as entradas */}
          <label htmlFor="entryType">Tipo de Entrada:</label>
          <select
            id="entryType"
            value={entryType}
            onChange={(e) => setEntryType(e.target.value as EntryType)}
          >
            <option value="Observação">Observação</option>
            <option value="Aplicação">Aplicação (Fertilizante, Água)</option>
            <option value="Praga">Praga / Doença</option>
            <option value="Colheita">Colheita</option>
          </select>

          <label htmlFor="description">História (Descrição):</label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o que aconteceu, o que foi aplicado, etc."
          />

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="submit-button"
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

// ==================================================================
// SEU COMPONENTE PRINCIPAL (COM AS ALTERAÇÕES)
// ==================================================================

const RegisteredGardens = () => {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [selectedGarden, setSelectedGarden] = useState<Garden | null>(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [gardenToDelete, setGardenToDelete] = useState<number | null>(null);

  // NOVO ESTADO: para controlar o modal do diário
  const [journalModalGarden, setJournalModalGarden] = useState<Garden | null>(null);

  useEffect(() => {
    // Busca inicial dos canteiros
    api
      .get(`/manager-garden/get-gardens?userId=${1}`) // Assumindo userId=1 por enquanto
      .then((response) => {
        setGardens(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch gardens:", error);
      });
  }, []);

  const handleSave = (updatedGarden: Garden) => {
    const updatedList = gardens.map((garden) =>
      garden.id === updatedGarden.id ? updatedGarden : garden
    );
    setGardens(updatedList);
  };

  const handleDeleteClick = (id: number) => {
    setGardenToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (gardenToDelete) {
      try {
        await api.delete(`/manager-garden/delete-garden/${gardenToDelete}`);
        setGardens(gardens.filter(garden => garden.id !== gardenToDelete));
        setDeleteModalOpen(false);
      } catch (error) {
        console.error("Erro ao deletar a horta:", error);
      }
    }
  };

  return (
    <div className="gardens-container">
      <h1>🌿 Canteiros Cadastrados</h1>
      <div className="gardens-grid">
        {gardens.map((garden) => (
          <div key={garden.id} className="garden-card">
            <div className="garden-info">
              <h2>{garden.name}</h2>
              <p><strong>Cultura:</strong> {garden.crop}</p>
              <p><strong>Data de plantação:</strong> {new Date(garden.plantingDate).toLocaleDateString()}</p>
              <p><strong>Tamanho:</strong> {garden.sizeInM2}m²</p>
              <p><strong>Localização:</strong> {garden.location}</p>
              
              {/* ÁREA DE AÇÕES ATUALIZADA */}
              <div className="garden-actions">
                <button className="edit-button" onClick={() => setSelectedGarden(garden)}>✏️ Editar</button>
                
                {/* NOVO BOTÃO DO DIÁRIO */}
                <button 
                  className="journal-button" 
                  onClick={() => setJournalModalGarden(garden)}
                >
                  📖 Diário
                </button>

                <button className="delete-button" onClick={() => handleDeleteClick(garden.id)}>🗑️ Deletar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edição (existente) */}
      {selectedGarden && (
        <EditGardenModal
          garden={selectedGarden}
          onClose={() => setSelectedGarden(null)}
          onSave={handleSave}
        />
      )}

      {/* Modal de Deleção (existente) */}
      {isDeleteModalOpen && (
        <DeleteGardenModal
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}

      {/* NOVO MODAL: Renderização do Diário de Campo */}
      {journalModalGarden && (
        <FieldJournalModal
          garden={journalModalGarden}
          onClose={() => setJournalModalGarden(null)}
        />
      )}
    </div>
  );
};

export default RegisteredGardens;