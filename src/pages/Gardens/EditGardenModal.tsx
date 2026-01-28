import React, { useState } from "react";
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Garden } from "./types"; 
import * as gardenService from '../../service/gardenService';

import './editGardenModal.css';

interface EditGardenModalProps {
  garden: Garden;      
  onClose: () => void;  
  onSave: (updatedGarden: Garden) => void; 
}

const formatDateForInput = (dateString: string) => {
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (error) {
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        sizeInM2: parseFloat(formData.sizeInM2) || 0,
      };
      
      const updatedGarden = await gardenService.updateGarden(garden.id, payload);

      toast.success("Canteiro atualizado com sucesso!");
      onSave(updatedGarden);
      onClose();
    } catch (error: any) {
      toast.error("Falha ao atualizar o canteiro.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="edit-modal-backdrop">
      <div className="edit-modal-content">
        <form onSubmit={handleSubmit} className="edit-modal-form">
          <div className="modal-header">
            <h2 className="modal-title">Editar Canteiro</h2>
            <button type="button" className="modal-close-button" onClick={onClose} disabled={isLoading}>
              <X size={24} />
            </button>
          </div>

          <div className="form-group">
            <label>Nome do Canteiro:</label>
            <input name="name" value={formData.name} onChange={handleChange} required disabled={isLoading} className="form-input" />
          </div>

          <div className="form-group">
            <label>Cultura:</label>
            <input name="crop" value={formData.crop} onChange={handleChange} required disabled={isLoading} className="form-input" />
          </div>

          <div className="form-group">
            <label>Data de Plantio:</label>
            <input type="date" name="plantingDate" value={formData.plantingDate} onChange={handleChange} required disabled={isLoading} className="form-input" />
          </div>

          <div className="form-group">
            <label>Tamanho (m²):</label>
            <input type="number" name="sizeInM2" value={formData.sizeInM2} onChange={handleChange} required step="0.1" disabled={isLoading} className="form-input" />
          </div>

          <div className="form-group">
            <label>Localização:</label>
            <input name="location" value={formData.location} onChange={handleChange} disabled={isLoading} className="form-input" />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-button cancel" onClick={onClose} disabled={isLoading}>Cancelar</button>
            <button type="submit" className="modal-button submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGardenModal;