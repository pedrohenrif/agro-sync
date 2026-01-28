import React, { useState } from "react";
import { X, AlertTriangle } from 'lucide-react';

import "./DeleteGardenModal.css";

interface DeleteGardenModalProps {
  gardenName: string; 
  onClose: () => void;
  onConfirm: () => Promise<void>; 
}

const DeleteGardenModal: React.FC<DeleteGardenModalProps> = ({ gardenName, onClose, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmClick = async () => {
    setIsLoading(true);
    try {
      await onConfirm(); 
    } catch (error) {
      console.error("Error confirming deletion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="delete-modal-backdrop">
      <div className="delete-modal-content">
        
        <div className="modal-header">
          <h2 className="modal-title">
            <AlertTriangle size={20} color="#ef4444" /> Confirmar Exclusão
          </h2>
          <button type="button" className="modal-close-button" onClick={onClose} disabled={isLoading}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <p>Tem certeza que deseja excluir o canteiro <strong>{gardenName}</strong>?</p>
          <p className="warning-text">Esta ação não pode ser desfeita.</p>
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
            type="button"
            className="modal-button delete"
            onClick={handleConfirmClick}
            disabled={isLoading}
          >
            {isLoading ? "Excluindo..." : "Excluir Canteiro"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteGardenModal;