// ARQUIVO: src/pages/SupplyStock/DeleteConfirmationModal.tsx

import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { deleteSupply } from '../../service/supplyService'; // Ajuste o caminho
import { SupplyItem } from './types'; // Importando tipos

import './DeleteConfirmationModal.css'; // CSS específico

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToDelete: SupplyItem | null;
  onConfirm: (id: number) => void; // Callback para atualizar a lista principal
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  itemToDelete,
  onConfirm
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsLoading(true);

    try {
      await deleteSupply(itemToDelete.id);
      onConfirm(itemToDelete.id); // Avisa o componente pai para remover da lista
      toast.success('Insumo excluído com sucesso!');
      onClose(); // Fecha o modal
    } catch (error: any) {
      console.error("Erro ao excluir insumo:", error);
      const errorMsg = error.response?.data?.message || 'Erro ao excluir insumo!';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !itemToDelete) return null;

  return (
    <div className="delete-modal-backdrop">
      <div className="delete-modal-content">
        <div className="modal-header">
          <h2><AlertTriangle size={20} style={{ marginRight: '8px', color: 'var(--danger-color, #f44336)' }}/> Confirmar Exclusão</h2>
          <button type="button" className="modal-close-button" onClick={onClose} disabled={isLoading}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          <p>Você tem certeza que deseja excluir o insumo <strong>{itemToDelete.name}</strong>?</p>
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
            className="modal-button delete" // Classe específica para o botão delete
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;