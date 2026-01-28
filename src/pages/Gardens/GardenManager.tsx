import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { Trash2, PlusCircle, Sprout } from 'lucide-react'; 
import { Garden } from "./types";
import * as gardenService from '../../service/gardenService';

import "./GardenManager.css";
import DeleteGardenModal from "./DeleteGardenModal";
import GardenDetailModal from "./components/GardenDetailModal";
import AddGardenModal from "./AddGardenModal";

const GardenManager = () => {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [deletingGardenId, setDeletingGardenId] = useState<number | null>(null);
  const [viewingGarden, setViewingGarden] = useState<Garden | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchGardens();
  }, []);

  const fetchGardens = async () => {
    setIsLoading(true);
    try {
      const data = await gardenService.getGardens();
      setGardens(data);
    } catch (err) {
      setError("Não foi possível carregar os canteiros.");
      toast.error("Erro ao buscar canteiros!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateGarden = (updatedGarden: Garden) => {
    setGardens(prev => prev.map(g => g.id === updatedGarden.id ? updatedGarden : g));
  };
  
  const handleAddSave = (newGarden: Garden) => {
    setGardens(prev => [newGarden, ...prev]);
    setIsAddModalOpen(false);
    toast.success("Canteiro criado com sucesso!");
  };

  const handleDeleteConfirm = async () => {
    if (!deletingGardenId) return;
    try {
      await gardenService.deleteGarden(deletingGardenId);
      setGardens(prev => prev.filter(g => g.id !== deletingGardenId));
      setDeletingGardenId(null);
      toast.success("Canteiro excluído com sucesso!");
    } catch (error) {
      toast.error("Falha ao excluir o canteiro.");
    }
  };

  if (isLoading) return <div className="gardens-container loading">Carregando canteiros...</div>;

  return (
    <div className="gardens-container">
      <div className="gardens-header">
        <h2><Sprout size={28} color="#2e7d32" /> Canteiros Cadastrados</h2>
        <div className="garden-page-actions">
          <button
            type="button"
            className="new-item-button"
            onClick={() => setIsAddModalOpen(true)}
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
                  <p><strong>Plantado em:</strong> {new Date(garden.plantingDate).toLocaleDateString()}</p>
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
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
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
      
      <AddGardenModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSave}
      />
    </div>
  );
};

export default GardenManager;