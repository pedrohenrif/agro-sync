import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string }) => void;
  initialData?: any;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');

  if (!isOpen) return null;

  return (
    <div className="gdm-modal-overlay">
      <div className="gdm-modal-container">
        <div className="gdm-modal-header">
          <h3>{initialData ? 'Editar Categoria' : 'Nova Categoria'}</h3>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>
        <div className="gdm-modal-body">
          <div className="gdm-form-group">
            <label>Nome da Categoria</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Ex: Fertilizantes, Sementes..."
            />
          </div>
          <div className="gdm-form-group">
            <label>Descrição (Opcional)</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Para que serve esta categoria?"
            />
          </div>
        </div>
        <div className="gdm-modal-footer">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={() => onSave({ name, description })} className="btn-primary">
            <Save size={18} /> Salvar Categoria
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;