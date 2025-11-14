// ARQUIVO: src/pages/HortasCadastradas/AddGardenModal.tsx

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../service/api';
import { Garden } from './types'; // Importando o tipo Garden

import './AddGardenModal.css'; // Criaremos este CSS

interface AddGardenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newGarden: Garden) => void; // Callback para atualizar a lista
}

interface GardenFormData {
  name: string;
  crop: string;
  plantingDate: string;
  sizeInM2: string;
  location: string;
}

const AddGardenModal: React.FC<AddGardenModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<GardenFormData>({
    name: "",
    crop: "",
    plantingDate: "",
    sizeInM2: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const payload = {
      ...formData,
      sizeInM2: Number(formData.sizeInM2) || 0,
      userId: 1, // Substitua pelo ID do usuário logado
      isActive: true,
    };

    try {
      const response = await api.post("/manager-garden/created-garden", payload);
      const newGarden: Garden = response.data;
      
      toast.success("Canteiro criado com sucesso!");
      onSave(newGarden); // Envia o novo canteiro para a página pai
      onClose(); // Fecha o modal
    } catch (error: any) {
      console.error("Erro ao criar a horta:", error);
      const errorMessage = error.response?.data?.message || "Erro de rede ou servidor.";
      toast.error(`Falha ao criar a horta: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="add-garden-modal-backdrop">
      <div className="add-garden-modal-content">
        <form onSubmit={handleSubmit} className="add-garden-modal-form">
          
          <div className="modal-header">
            <h2 className="modal-title">
              <span role="img" aria-label="seedling">🌿</span> Adicionar Novo Canteiro
            </h2>
            <button type="button" className="modal-close-button" onClick={onClose} disabled={isLoading}>
              <X size={24} />
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="add-name">Nome do Canteiro:</label>
            <input
              type="text"
              id="add-name"
              name="name"
              placeholder="Ex: Canteiro Principal"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="add-crop">Cultura:</label>
            <input
              type="text"
              id="add-crop"
              name="crop"
              placeholder="Ex: Alface, Tomate Cereja"
              value={formData.crop}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="add-plantingDate">Data de Início do Plantio:</label>
            <input
              type="date"
              id="add-plantingDate"
              name="plantingDate"
              value={formData.plantingDate}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="add-sizeInM2">Tamanho (m²):</label>
            <input
              type="number"
              id="add-sizeInM2"
              name="sizeInM2"
              placeholder="Ex: 10.5"
              value={formData.sizeInM2}
              onChange={handleInputChange}
              required
              min="0"
              step="0.1"
              disabled={isLoading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="add-location">Localização (opcional):</label>
            <input
              type="text"
              id="add-location"
              name="location"
              placeholder="Ex: Fundo do quintal"
              value={formData.location}
              onChange={handleInputChange}
              disabled={isLoading}
              className="form-input"
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
              {isLoading ? "Salvando..." : "Adicionar Canteiro"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddGardenModal;