import React, { useState } from "react";

import './editGardenModal.css';

import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../service/api'; 
import { Garden } from "./types"; 


interface EditGardenModalProps {
  garden: Garden;      
  onClose: () => void;  
  onSave: (updatedGarden: Garden) => void; 
}

const formatDateForInput = (dateString: string) => {
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (error) {
    console.error("Data inválida:", dateString);
    return ''; 
  }
};

const EditGardenModal: React.FC<EditGardenModalProps> = ({ garden, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: garden.name,
    crop: garden.crop,
    plantingDate: formatDateForInput(garden.plantingDate),
    sizeInM2: garden.sizeInM2.toString(), 
    location: garden.location || '', 
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ...formData,
      sizeInM2: parseFloat(formData.sizeInM2) || 0, 
    };

    try {
      const response = await api.put(`/manager-garden/update-garden/${garden.id}`, payload);
      
      const updatedGarden: Garden = response.data; 

      toast.success("Canteiro atualizado com sucesso!");
      onSave(updatedGarden); // Envia o canteiro atualizado para o componente pai
      onClose(); // Fecha o modal
    } catch (error: any) {
      console.error("Erro ao atualizar canteiro:", error);
      const errorMsg = error.response?.data?.message || "Falha ao atualizar o canteiro.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="edit-modal-backdrop">
      <div className="edit-modal-content">
        <form onSubmit={handleSubmit} className="edit-modal-form">
          
          <div className="modal-header">
            <h2 className="modal-title">
              <span role="img" aria-label="pencil">✏️</span> Editar Canteiro
            </h2>
            <button type="button" className="modal-close-button" onClick={onClose} disabled={isLoading}>
              <X size={24} />
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="edit-name">Nome do Canteiro:</label>
            <input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-crop">Cultura:</label>
            <input
              type="text"
              id="edit-crop"
              name="crop"
              value={formData.crop}
              onChange={handleChange}
              className="form-input"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-plantingDate">Data de Plantação:</label>
            <input
              type="date"
              id="edit-plantingDate"
              name="plantingDate"
              value={formData.plantingDate}
              onChange={handleChange}
              className="form-input"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-sizeInM2">Tamanho (m²):</label>
            <input
              type="number"
              id="edit-sizeInM2"
              name="sizeInM2"
              value={formData.sizeInM2}
              onChange={handleChange}
              className="form-input"
              required
              min="0"
              step="0.1"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-location">Localização:</label>
            <input
              type="text"
              id="edit-location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
              disabled={isLoading}
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
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditGardenModal;