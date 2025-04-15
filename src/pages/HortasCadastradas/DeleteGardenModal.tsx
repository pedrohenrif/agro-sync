import React from "react";
import "./DeleteGardenModal.css";

interface DeleteGardenModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteGardenModal = ({ onClose, onConfirm }: DeleteGardenModalProps) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Você tem certeza que deseja excluir esta horta?</h2>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm">Confirmar</button>
          <button onClick={onClose} className="cancel">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteGardenModal;
