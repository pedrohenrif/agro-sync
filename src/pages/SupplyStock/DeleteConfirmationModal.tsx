import React, { useState } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { deleteSupply } from '../../service/supplyService';
import { SupplyItem } from './types';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToDelete: SupplyItem | null;
  onConfirm: (id: number) => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen, onClose, itemToDelete, onConfirm
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsLoading(true);
    try {
      await deleteSupply(itemToDelete.id);
      onConfirm(itemToDelete.id);
      toast.success('Insumo excluído com sucesso!');
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao excluir insumo!');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !itemToDelete) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-sm animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="flex items-center gap-2 text-lg font-bold text-red-600">
            <AlertTriangle size={20} /> Confirmar Exclusão
          </h2>
          <button onClick={onClose} disabled={isLoading} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-slate-700 mb-2">
            Tem certeza que deseja excluir o insumo <strong className="text-slate-900">"{itemToDelete.name}"</strong>?
          </p>
          <p className="text-xs text-red-500 font-medium">Esta ação não pode ser desfeita.</p>
        </div>
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button onClick={onClose} disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
            Cancelar
          </button>
          <button onClick={handleDelete} disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition shadow-sm disabled:opacity-60">
            <Trash2 size={15} /> {isLoading ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
