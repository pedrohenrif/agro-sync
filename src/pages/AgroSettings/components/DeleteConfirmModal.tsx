import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="gdm-modal-overlay">
      <div className="gdm-modal-container alert">
        <div className="gdm-modal-body text-center">
          <div className="delete-icon-wrapper">
            <AlertTriangle size={48} color="#ef4444" />
          </div>
          <h3>{title}</h3>
          <p>Você tem certeza que deseja excluir <strong>{itemName}</strong>? Esta ação não pode ser desfeita.</p>
        </div>
        <div className="gdm-modal-footer centered">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={onConfirm} className="btn-danger">Sim, Excluir</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;