import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { PlusCircle, Sprout } from 'lucide-react'; 
import { Garden } from "./types";
import * as gardenService from '../../service/gardenService';

import "./GardenManager.css";
import DeleteGardenModal from "./DeleteGardenModal";
import GardenDetailModal from "./components";
import AddGardenModal from "./AddGardenModal";
import GardenCard from "./GardenCard"; // Importando o novo card

import StartPlantingModal from "./components/StartPlantingModal"; 

const GardenManager = () => {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deletingGarden, setDeletingGarden] = useState<{id: number, name: string} | null>(null);
  const [viewingGarden, setViewingGarden] = useState<Garden | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [plantingGarden, setPlantingGarden] = useState<Garden | null>(null);

  useEffect(() => {
    fetchGardens();
  }, []);

  const fetchGardens = async () => {
    setIsLoading(true);
    try {
      const data = await gardenService.getGardens();
      setGardens(data);
    } catch (err) {
      toast.error("Não foi possível carregar os canteiros.");
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
    if (!deletingGarden) return;
    try {
      await gardenService.deleteGarden(deletingGarden.id);
      setGardens(prev => prev.filter(g => g.id !== deletingGarden.id));
      setDeletingGarden(null);
      toast.success("Canteiro excluído!");
    } catch (error) {
      toast.error("Falha ao excluir.");
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
            <GardenCard 
              key={garden.id}
              garden={garden}
              onView={setViewingGarden}
              onDelete={(id, name) => setDeletingGarden({id, name})}
              onStartPlanting={(g) => setPlantingGarden(g)} // Abre o fluxo de plantio
            />
          ))}
        </div>
      )}

      {/* MODALS */}
      {deletingGarden && (
        <DeleteGardenModal
          gardenName={deletingGarden.name}
          onClose={() => setDeletingGarden(null)}
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

      {plantingGarden && (
        <StartPlantingModal 
          garden={plantingGarden} // Agora o TS sabe que aqui o garden não é null
          onClose={() => setPlantingGarden(null)}
          onConfirm={fetchGardens} 
        />
      )}
    </div>
  );
};

export default GardenManager;