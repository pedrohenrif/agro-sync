import React, { useEffect, useState } from "react";
import api from '../../service/api';
import { toast } from 'react-toastify';
import { Pencil, Trash2, BookOpen } from 'lucide-react';

import "./RegisteredGardens.css";
import EditGardenModal from "./EditGardenModal";
import DeleteGardenModal from "./DeleteGardenModal";
import FieldJournalModal from "./FieldJournalModal";

import { Garden } from "./types";

const FAKE_USER_ID = 1;

const RegisteredGardens = () => {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [editingGarden, setEditingGarden] = useState<Garden | null>(null);
  const [deletingGardenId, setDeletingGardenId] = useState<number | null>(null);
  const [journalGarden, setJournalGarden] = useState<Garden | null>(null);

  useEffect(() => {
    fetchGardens();
  }, []);

  const fetchGardens = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/manager-garden/get-gardens?userId=${FAKE_USER_ID}`);
      setGardens(response.data);
    } catch (err) {
      console.error("Falha ao buscar canteiros:", err);
      setError("Não foi possível carregar os canteiros. Tente novamente mais tarde.");
      toast.error("Erro ao carregar canteiros!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSave = (updatedGarden: Garden) => {
    setGardens(prevGardens =>
      prevGardens.map(garden =>
        garden.id === updatedGarden.id ? updatedGarden : garden
      )
    );
    setEditingGarden(null);
    toast.success("Canteiro atualizado com sucesso!");
  };

  const handleDeleteConfirm = async () => {
    if (!deletingGardenId) return;

    try {
      await api.delete(`/manager-garden/delete-garden/${deletingGardenId}`);
      setGardens(prevGardens =>
        prevGardens.filter(garden => garden.id !== deletingGardenId)
      );
      setDeletingGardenId(null);
      toast.success("Canteiro deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar canteiro:", error);
      toast.error("Falha ao deletar o canteiro.");
    }
  };

  const handleJournalSave = () => {
    setJournalGarden(null);
    toast.success("Entrada do diário salva!");
  };

  if (isLoading) {
    return <div className="gardens-container loading">Carregando canteiros...</div>;
  }

  if (error) {
    return <div className="gardens-container error">{error}</div>;
  }

  return (
    <div className="gardens-container">
      
      <div className="gardens-header">
        <h2><span role="img" aria-label="seedling">🌿</span> Canteiros Cadastrados</h2>
        <div className="garden-page-actions">
          {/* Espaço reservado para futuras ações, como filtros */}
        </div>
      </div>

      {gardens.length === 0 ? (
        <p className="no-gardens-message">Nenhum canteiro cadastrado ainda.</p>
      ) : (
        <div className="gardens-grid">
          {gardens.map((garden) => (
            <div key={garden.id} className="garden-card">
              <div className="card-content">
                <h3>{garden.name}</h3>
                <p className="category-tag">{garden.crop}</p>
                <div className="card-details">
                  <p><strong>Plantação:</strong> {new Date(garden.plantingDate).toLocaleDateString()}</p>
                  <p><strong>Tamanho:</strong> {garden.sizeInM2}m²</p>
                  {garden.location && <p><strong>Localização:</strong> {garden.location}</p>}
                </div>
              </div>
              <div className="card-actions">
                <button
                  type="button"
                  className="action-button edit"
                  onClick={() => setEditingGarden(garden)}
                  title="Editar"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  className="action-button journal"
                  onClick={() => setJournalGarden(garden)}
                  title="Diário de Campo"
                >
                  <BookOpen size={16} />
                </button>
                <button
                  type="button"
                  className="action-button delete"
                  onClick={() => setDeletingGardenId(garden.id)}
                  title="Deletar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingGarden && (
        <EditGardenModal
          garden={editingGarden}
          onClose={() => setEditingGarden(null)}
          onSave={handleEditSave}
        />
      )}

      {deletingGardenId && (
        <DeleteGardenModal
          // Encontra o nome do canteiro a ser deletado
          gardenName={gardens.find(g => g.id === deletingGardenId)?.name || 'este canteiro'}
          onClose={() => setDeletingGardenId(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {journalGarden && (
        <FieldJournalModal
          garden={journalGarden}
          onClose={() => setJournalGarden(null)}
          onSave={handleJournalSave}
        />
      )}
    </div>
  );
};

export default RegisteredGardens;