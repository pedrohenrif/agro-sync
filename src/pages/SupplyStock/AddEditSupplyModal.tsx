import React, { useState, useEffect } from 'react';
import { X, Archive, Save, AlertCircle } from 'lucide-react';
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
    categoryId: 0, 
    quantity: '',
    unitId: 0, 
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sincronização do estado com os dados recebidos
  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setFormData({
          name: editingItem.name,
          categoryId: Number(editingItem.categoryId || editingItem.category?.id || 0),
          quantity: editingItem.quantity.toString(),
          unitId: Number(editingItem.unitId || editingItem.unit?.id || 0),
        });
      } else {
        setFormData({
          name: '',
          categoryId: categories.length > 0 ? Number(categories[0].id) : 0,
          quantity: '',
          unitId: units.length > 0 ? Number(units[0].id) : 0,
        });
      }
    }
  }, [isOpen, editingItem, categories, units]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // IMPORTANTE: Se o campo for um ID, convertemos para número imediatamente
    const finalValue = (name === 'unitId' || name === 'categoryId') ? Number(value) : value;
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.categoryId || !formData.unitId) {
        toast.error("Selecione uma categoria e uma unidade válidas.");
        return;
    }

    setIsLoading(true);
    const quantityValue = parseFloat(formData.quantity);

    if (isNaN(quantityValue) || quantityValue < 0) {
        toast.error("Quantidade inválida.");
        setIsLoading(false);
        return;
    }

    try {
      const dataPayload = {
        name: formData.name,
        quantity: quantityValue,
        unitId: formData.unitId,
        categoryId: formData.categoryId,
        userId: userId, 
        isActive: true, 
      };

      if (editingItem) {
        const updatedItem = await updateSupply(editingItem.id, dataPayload);
        onSave(updatedItem); 
        toast.success('Insumo atualizado!');
      } else {
        const newItem = await createSupply(dataPayload);
        onSave(newItem); 
        toast.success('Insumo criado!');
      }
      onClose(); 
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      toast.error(error.response?.data?.message || 'Erro ao processar requisição');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null; 

  return (
    <div className="gdm-modal-overlay">
      <div className="gdm-modal-container">
        <div className="gdm-modal-header">
          <h3 className="flex items-center gap-2">
            <Archive size={20} className="text-emerald-500" />
            {editingItem ? 'Editar Insumo' : 'Novo Insumo'}
          </h3>
          <button onClick={onClose} className="close-btn" disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="gdm-modal-body">
            {/* NOME DO INSUMO */}
            <div className="gdm-form-group">
              <label>Nome do Produto</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Ex: Semente de Tomate Cereja"
                disabled={isLoading}
              />
            </div>

            <div className="grid-2-col">
              {/* CATEGORIA */}
              <div className="gdm-form-group">
                <label>Categoria</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                >
                  <option value={0} disabled>Selecione...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* QUANTIDADE */}
              <div className="gdm-form-group">
                <label>Qtd. em Estoque</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  step="any"
                  placeholder="0.00"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* UNIDADE DE MEDIDA */}
            <div className="gdm-form-group">
              <label>Unidade de Medida</label>
              <select
                name="unitId"
                value={formData.unitId}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              >
                <option value={0} disabled>Selecione uma unidade</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
              {units.length === 0 && (
                <span className="input-tip error">
                   <AlertCircle size={12} /> Nenhuma unidade cadastrada.
                </span>
              )}
            </div>
          </div>

          <div className="gdm-modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Processando...' : <><Save size={18} /> Salvar Insumo</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditSupplyModal;