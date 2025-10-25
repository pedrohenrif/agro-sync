// ARQUIVO: src/pages/SupplyStock/AddEditSupplyModal.tsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { createSupply, updateSupply } from '../../service/supplyService'; 
import { SupplyItem, Category, Unit } from './types'; 

import './AddEditSupplyModal.css';

interface AddEditSupplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  units: Unit[];
  editingItem: SupplyItem | null; 
  onSave: (item: SupplyItem) => void; 
  userId: number; 
}

const AddEditSupplyModal: React.FC<AddEditSupplyModalProps> = ({
  isOpen,
  onClose,
  categories,
  units,
  editingItem,
  onSave,
  userId
}) => {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: categories[0]?.id || 0, 
    quantity: '',
    unitId: units[0]?.id || 0, 
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        categoryId: editingItem.category.id,
        quantity: editingItem.quantity.toString(),
        unitId: editingItem.unit.id,
      });
    } else {
      setFormData({
        name: '',
        categoryId: categories[0]?.id || 0,
        quantity: '',
        unitId: units[0]?.id || 0,
      });
    }
  }, [editingItem, categories, units, isOpen]); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const quantityValue = parseFloat(formData.quantity);
    if (isNaN(quantityValue) || quantityValue < 0) {
        toast.error("Quantidade inválida. Use um número não negativo.");
        setIsLoading(false);
        return;
    }

    try {
      if (editingItem) {
        const dataToUpdate = {
          name: formData.name,
          quantity: quantityValue,
          unitId: Number(formData.unitId),
          categoryId: Number(formData.categoryId),
        };
        const updatedItem = await updateSupply(editingItem.id, dataToUpdate);
        onSave(updatedItem); 
        toast.success('Insumo atualizado com sucesso!');
      } else {
        const dataToCreate = {
          name: formData.name,
          quantity: quantityValue,
          unitId: Number(formData.unitId),
          categoryId: Number(formData.categoryId),
          userId: userId, 
          isActive: true, 
        };
        const newItem = await createSupply(dataToCreate);
        onSave(newItem); 
        toast.success('Insumo criado com sucesso!');
      }
      onClose(); 
    } catch (error: any) {
      console.error("Erro ao salvar insumo:", error);
      const errorMsg = error.response?.data?.message || (editingItem ? 'Erro ao atualizar insumo!' : 'Erro ao criar insumo!');
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null; 

  return (
    <div className="add-edit-modal-backdrop">
      <div className="add-edit-modal-content">
        <div className="modal-header">
          <h2>{editingItem ? 'Editar Insumo' : 'Adicionar Novo Insumo'}</h2>
          <button type="button" className="modal-close-button" onClick={onClose} disabled={isLoading}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="add-edit-modal-form">
          {/* Campo Nome */}
          <div className="form-group">
            <label htmlFor="supply-name">Nome do Insumo:</label>
            <input
              id="supply-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="form-input"
              placeholder="Ex: Semente de Alface Crespa"
            />
          </div>

          {/* Campo Categoria */}
          <div className="form-group">
            <label htmlFor="supply-category">Categoria:</label>
            <select
              id="supply-category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="form-select"
            >
              {categories.length === 0 && <option value={0} disabled>Carregando...</option>}
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Campo Quantidade */}
          <div className="form-group">
            <label htmlFor="supply-quantity">Quantidade:</label>
            <input
              id="supply-quantity"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              min="0"
              step="any" // Permite qualquer decimal
              disabled={isLoading}
              className="form-input"
              placeholder="Ex: 100"
            />
          </div>

          {/* Campo Unidade */}
          <div className="form-group">
            <label htmlFor="supply-unit">Unidade:</label>
            <select
              id="supply-unit"
              name="unitId"
              value={formData.unitId}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="form-select"
            >
              {units.length === 0 && <option value={0} disabled>Carregando...</option>}
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>{unit.name}</option>
              ))}
            </select>
          </div>

          {/* Botões de Ação */}
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
              {isLoading ? (editingItem ? 'Salvando...' : 'Adicionando...') : (editingItem ? 'Salvar Alterações' : 'Adicionar Insumo')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditSupplyModal;