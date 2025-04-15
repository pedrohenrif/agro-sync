import React, { useEffect, useState } from "react";
import axios from "axios";

import "./RegisteredGardens.css";
import EditGardenModal from "./EditGardenModal";
import DeleteGardenModal from "./DeleteGardenModal";

import { Garden } from "./types";


const RegisteredGardens = () => {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [selectedGarden, setSelectedGarden] = useState(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [gardenToDelete, setGardenToDelete] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/AgroSync/manager-garden/get-gardens?userId=${1}`)
      .then((response) => {
        setGardens(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch gardens:", error);
      });
  }, []);

  const handleSave = (updatedGarden: any) => {
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
        await axios.delete(`http://localhost:3000/AgroSync/manager-garden/delete-garden/${gardenToDelete}`);

        setGardens(gardens.filter(garden => garden.id !== gardenToDelete));
        setDeleteModalOpen(false);

      } catch (error) {
        console.error("Erro ao deletar a horta:", error);
      }
    }
  };

  return (
    <div className="gardens-container">
      <h1>🌿 Canteiros Cadastradas</h1>
      <div className="gardens-grid">
        {gardens.map((garden: any) => (
          <div key={garden.id} className="garden-card">
            <div className="garden-info">
              <h2>{garden.name}</h2>
              <p><strong>Cultura:</strong> {garden.crop}</p>
              <p><strong>Data de plantação:</strong> {new Date(garden.plantingDate).toLocaleDateString()}</p>
              <p><strong>Tamanho:</strong> {garden.sizeInM2}m²</p>
              <p><strong>Localização:</strong> {garden.location}</p>
              <div className="garden-actions">
                <button className="edit-button" onClick={() => setSelectedGarden(garden)}>✏️ Editar</button>
                <button className="delete-button" onClick={() => handleDeleteClick(garden.id)}>🗑️ Deletar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedGarden && (
        <EditGardenModal
          garden={selectedGarden}
          onClose={() => setSelectedGarden(null)}
          onSave={handleSave}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteGardenModal
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default RegisteredGardens;
