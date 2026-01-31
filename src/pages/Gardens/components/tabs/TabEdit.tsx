import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Garden } from '../../types';
import * as gardenService from '../../../../service/gardenService';

import './TabEdit.css';

const TabEdit: React.FC<{ 
  garden: Garden, 
  onClose: () => void, 
  onSave: (updatedGarden: Garden) => void 
}> = ({ garden, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: garden.name,
    crop: garden.crop,
    plantingDate: new Date(garden.plantingDate).toISOString().split('T')[0],
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
      const payload = { ...formData, sizeInM2: parseFloat(formData.sizeInM2) || 0 };
      const updatedGarden = await gardenService.updateGarden(garden.id, payload);
      toast.success("Informações atualizadas!");
      onSave(updatedGarden);
      onClose(); 
    } catch (error) {
      toast.error("Falha ao atualizar o canteiro.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* Adicionada a classe gdm-edit-wrapper para isolamento */
    <div className="tab-content-container gdm-edit-wrapper">
      <div className="edit-header">
        <h3>Atualizar Dados do Canteiro</h3>
        <p>Modifique as informações básicas de registro deste lote.</p>
      </div>

      <form onSubmit={handleSubmit} className="modal-form-reused">
        <div className="form-grid">
          <div className="form-group">
            <label>Nome do Canteiro</label>
            <input name="name" value={formData.name} onChange={handleChange} required className="form-input" placeholder="Ex: Canteiro Norte 01" />
          </div>

          <div className="form-group">
            <label>Cultura / Variedade</label>
            <input name="crop" value={formData.crop} onChange={handleChange} required className="form-input" placeholder="Ex: Alface Crespa" />
          </div>

          <div className="form-group">
            <label>Data de Plantio</label>
            <input type="date" name="plantingDate" value={formData.plantingDate} onChange={handleChange} required className="form-input" />
          </div>

          <div className="form-group">
            <label>Tamanho da Área (m²)</label>
            <input type="number" name="sizeInM2" value={formData.sizeInM2} onChange={handleChange} required step="0.1" className="form-input" />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Localização / Referência</label>
          <input name="location" value={formData.location} onChange={handleChange} className="form-input" placeholder="Ex: Setor A - Próximo à caixa d'água" />
        </div>

        <div className="modal-actions-reused">
          <button type="submit" className="modal-button submit" disabled={isLoading}>
            {isLoading ? "Atualizando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TabEdit;