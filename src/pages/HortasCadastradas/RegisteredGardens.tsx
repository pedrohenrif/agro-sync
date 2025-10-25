import React, { useEffect, useState } from "react";
import api from '../../service/api';
import { toast } from 'react-toastify'; 

import "./RegisteredGardens.css"; 
import EditGardenModal from "./EditGardenModal";
import DeleteGardenModal from "./DeleteGardenModal";
import FieldJournalModal from "./FieldJournalModal"; 

import { Garden } from "./types";

const FAKE_USER_ID = 1; 

const RegisteredGardens = () => {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Estado de carregamento inicial
  const [error, setError] = useState<string | null>(null); // Estado para erros de fetch

  // Estados para controlar qual modal está aberto e com qual 'garden'
  const [editingGarden, setEditingGarden] = useState<Garden | null>(null);
  const [deletingGardenId, setDeletingGardenId] = useState<number | null>(null);
  const [journalGarden, setJournalGarden] = useState<Garden | null>(null);

  // --- Efeitos ---
  useEffect(() => {
    fetchGardens(); // Chama a função para buscar os dados na montagem
  }, []); // Array vazio garante que rode apenas uma vez

  // --- Funções ---
  const fetchGardens = async () => {
    setIsLoading(true);
    setError(null); // Limpa erros antigos
    try {
      const response = await api.get(`/manager-garden/get-gardens?userId=${FAKE_USER_ID}`);
      setGardens(response.data);
    } catch (err) {
      console.error("Falha ao buscar canteiros:", err);
      setError("Não foi possível carregar os canteiros. Tente novamente mais tarde.");
      toast.error("Erro ao carregar canteiros!"); // Feedback com Toastify
    } finally {
      setIsLoading(false); // Finaliza o carregamento (sucesso ou erro)
    }
  };

  // Função chamada pelo EditGardenModal quando um canteiro é salvo
  const handleEditSave = (updatedGarden: Garden) => {
    setGardens(prevGardens => 
      prevGardens.map(garden => 
        garden.id === updatedGarden.id ? updatedGarden : garden
      )
    );
    setEditingGarden(null); // Fecha o modal de edição
    toast.success("Canteiro atualizado com sucesso!");
  };

  // Função chamada pelo DeleteGardenModal quando a deleção é confirmada
  const handleDeleteConfirm = async () => {
    if (!deletingGardenId) return;

    try {
      await api.delete(`/manager-garden/delete-garden/${deletingGardenId}`);
      setGardens(prevGardens => 
        prevGardens.filter(garden => garden.id !== deletingGardenId)
      );
      setDeletingGardenId(null); // Fecha o modal de deleção
      toast.success("Canteiro deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar canteiro:", error);
      toast.error("Falha ao deletar o canteiro.");
    }
  };

  // Função chamada pelo FieldJournalModal quando uma entrada é salva
  const handleJournalSave = () => {
    // A lógica de salvar está dentro do FieldJournalModal, 
    // então aqui apenas fechamos o modal e damos feedback.
    setJournalGarden(null);
    toast.success("Entrada do diário salva!");
    // Opcional: Re-buscar os dados ou atualizar estado se necessário
  };

  // --- Renderização ---

  // Se estiver carregando, mostra uma mensagem
  if (isLoading) {
    return <div className="gardens-container loading">Carregando canteiros...</div>;
  }

  // Se ocorreu um erro, mostra a mensagem de erro
  if (error) {
    return <div className="gardens-container error">{error}</div>;
  }

  return (
    <div className="gardens-container">
      <h1><span role="img" aria-label="seedling">🌿</span> Canteiros Cadastrados</h1>
      
      {gardens.length === 0 ? (
        <p className="no-gardens-message">Nenhum canteiro cadastrado ainda.</p>
      ) : (
        <div className="gardens-grid">
          {gardens.map((garden) => (
            <div key={garden.id} className="garden-card">
              <div className="garden-info">
                <h2>{garden.name}</h2>
                <p><strong>Cultura:</strong> {garden.crop}</p>
                <p><strong>Plantação:</strong> {new Date(garden.plantingDate).toLocaleDateString()}</p>
                <p><strong>Tamanho:</strong> {garden.sizeInM2}m²</p>
                {garden.location && <p><strong>Localização:</strong> {garden.location}</p>} {/* Renderiza só se houver localização */}
              </div>
              <div className="garden-actions">
                <button className="edit-button" onClick={() => setEditingGarden(garden)}>
                  <span role="img" aria-label="edit">✏️</span> Editar
                </button>
                <button className="journal-button" onClick={() => setJournalGarden(garden)}>
                  <span role="img" aria-label="journal">📖</span> Diário
                </button>
                <button className="delete-button" onClick={() => setDeletingGardenId(garden.id)}>
                  <span role="img" aria-label="delete">🗑️</span> Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Renderização Condicional dos Modais */}
      {editingGarden && (
        <EditGardenModal
          garden={editingGarden}
          onClose={() => setEditingGarden(null)}
          onSave={handleEditSave} // Passa a função de callback
        />
      )}

      {deletingGardenId && (
        <DeleteGardenModal
          onClose={() => setDeletingGardenId(null)}
          onConfirm={handleDeleteConfirm} // Passa a função de callback
        />
      )}

      {journalGarden && (
        <FieldJournalModal
          garden={journalGarden}
          onClose={() => setJournalGarden(null)}
          // Adicionamos onSave aqui se quisermos que o modal avise quando salvar
          // onSave={handleJournalSave} // Descomente se implementar onSave no FieldJournalModal
        />
      )}
    </div>
  );
};

export default RegisteredGardens;