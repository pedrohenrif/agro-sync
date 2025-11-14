import React, { useEffect, useState } from "react";
import api from '../../service/api';
import { toast } from 'react-toastify';
import { Trash2, PlusCircle } from 'lucide-react'; // Trocamos ícones
import { Garden } from "./types";

import "./RegisteredGardens.css";
import DeleteGardenModal from "./DeleteGardenModal";
import GardenDetailModal from "./GardenDetailModal";
import AddGardenModal from "./AddGardenModal"; // <-- 1. Importar o novo modal

const FAKE_USER_ID = 1;

const RegisteredGardens = () => {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [deletingGardenId, setDeletingGardenId] = useState<number | null>(null);
  const [viewingGarden, setViewingGarden] = useState<Garden | null>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // <-- 2. Novo estado

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

  const handleUpdateGarden = (updatedGarden: Garden) => {
    setGardens(prevGardens =>
      prevGardens.map(garden =>
        garden.id === updatedGarden.id ? updatedGarden : garden
      )
    );
  };
  
  // 3. Nova função de callback para o modal de adicionar
  const handleAddSave = (newGarden: Garden) => {
    setGardens(prevGardens => [...prevGardens, newGarden]); // Adiciona o novo canteiro à lista
    setIsAddModalOpen(false); // Fecha o modal
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
          {/* 4. Adicionar o novo botão */}
          <button
            type="button"
            className="new-item-button"
            onClick={() => setIsAddModalOpen(true)}
            disabled={isLoading}
          >
            <PlusCircle size={18} />
            Novo Canteiro
          </button>
        </div>
      </div>

      {gardens.length === 0 ? (
        <p className="no-gardens-message">Nenhum canteiro cadastrado ainda.</p>
      ) : (
        <div className="gardens-grid">
          {gardens.map((garden) => (
            <div 
              key={garden.id} 
              className="garden-card clickable"
              onClick={() => setViewingGarden(garden)}
            >
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
                  className="action-button delete" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingGardenId(garden.id);
                  }} 
                  title="Deletar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- RENDERIZAÇÃO DOS MODAIS --- */}

      {deletingGardenId && (
        <DeleteGardenModal
          gardenName={gardens.find(g => g.id === deletingGardenId)?.name || 'este canteiro'}
          onClose={() => setDeletingGardenId(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {viewingGarden && (
        <GardenDetailModal
          garden={viewingGarden}
          onClose={() => setViewingGarden(null)}
          onUpdate={handleUpdateGarden}
        />
      )}
      
      {/* 5. Renderizar o novo modal */}
      <AddGardenModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSave}
      />
    </div>
  );
};

export default RegisteredGardens;