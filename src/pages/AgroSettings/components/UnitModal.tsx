import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

interface UnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; symbol: string }) => void;
  initialData?: any;
}

const UnitModal: React.FC<UnitModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [symbol, setSymbol] = useState(initialData?.symbol || '');

  if (!isOpen) return null;

  return (
    <div className="gdm-modal-overlay">
      <div className="gdm-modal-container small">
        <div className="gdm-modal-header">
          <h3>{initialData ? 'Editar Unidade' : 'Nova Unidade'}</h3>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>
        <div className="gdm-modal-body">
          <div className="gdm-form-group">
            <label>Nome da Unidade</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Ex: Quilograma, Litro..."
            />
          </div>
          <div className="gdm-form-group">
            <label>Símbolo</label>
            <input 
              type="text" 
              value={symbol} 
              onChange={(e) => setSymbol(e.target.value)} 
              placeholder="Ex: kg, L, un..."
            />
          </div>
        </div>
        <div className="gdm-modal-footer">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={() => onSave({ name, symbol })} className="btn-primary">
            <Save size={18} /> Salvar Unidade
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnitModal;