import React, { useEffect, useState } from "react";
import api from '../../service/api';
import { toast } from 'react-toastify';
import { Trash2 } from 'lucide-react'; // Importa SÓ o ícone de deletar

import "./RegisteredGardens.css";
// Remove as importações dos modais individuais
// import EditGardenModal from "./EditGardenModal";
// import FieldJournalModal from "./FieldJournalModal"; 
import DeleteGardenModal from "./DeleteGardenModal";
import GardenDetailModal from "./GardenDetailModal"; // Importa o novo "Super Modal"

import { Garden } from "./types";

const FAKE_USER_ID = 1;

const RegisteredGardens = () => {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de controle dos modais
  const [deletingGardenId, setDeletingGardenId] = useState<number | null>(null);
  const [viewingGarden, setViewingGarden] = useState<Garden | null>(null); // Estado para o novo modal

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

  // Esta função é passada para o GardenDetailModal
  const handleUpdateGarden = (updatedGarden: Garden) => {
    setGardens(prevGardens =>
      prevGardens.map(garden =>
        garden.id === updatedGarden.id ? updatedGarden : garden
      )
    );
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

  // Esta função não é mais necessária aqui
  // const handleJournalSave = () => { ... };

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
        </div>
      </div>

      {gardens.length === 0 ? (
        <p className="no-gardens-message">Nenhum canteiro cadastrado ainda.</p>
      ) : (
        <div className="gardens-grid">
          {gardens.map((garden) => (
            <div 
              key={garden.id} 
              className="garden-card clickable" // Card clicável
              onClick={() => setViewingGarden(garden)} // Abre o super-modal
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
                    e.stopPropagation(); // Impede o card de ser clicado junto
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
    </div>
  );
};

export default RegisteredGardens;