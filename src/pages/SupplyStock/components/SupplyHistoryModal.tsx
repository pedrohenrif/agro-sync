import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight, ArrowDownLeft, Clock, User, MessageSquare, Loader2 } from 'lucide-react';
import { getSupplyTransactions } from '../../../service/supplyService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Transaction {
  id: number;
  type: 'ENTRY' | 'EXIT';
  quantity: number;
  reason: string;
  createdAt: string;
  user: { name: string };
}

interface SupplyHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplyId: number | null;
  supplyName: string;
}

const SupplyHistoryModal: React.FC<SupplyHistoryModalProps> = ({ isOpen, onClose, supplyId, supplyName }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && supplyId) {
      setIsLoading(true);
      getSupplyTransactions(supplyId)
        .then(setTransactions)
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, supplyId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-lg animate-slide-up flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-emerald-500" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Extrato de Movimentação</h3>
              <p className="text-xs text-slate-500">{supplyName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32 gap-3 text-emerald-600 font-semibold">
              <Loader2 size={18} className="animate-spin" /> Carregando histórico...
            </div>
          ) : transactions.length > 0 ? (
            <div className="flex flex-col gap-3">
              {transactions.map(t => (
                <div key={t.id} className={`flex gap-3 p-3 rounded-xl border ${t.type === 'ENTRY' ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${t.type === 'ENTRY' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {t.type === 'ENTRY' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.type === 'ENTRY' ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'}`}>
                        {t.type === 'ENTRY' ? 'Entrada' : 'Saída'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {format(new Date(t.createdAt), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    <p className={`text-lg font-extrabold ${t.type === 'ENTRY' ? 'text-emerald-700' : 'text-red-700'}`}>
                      {t.type === 'ENTRY' ? '+' : '-'}{t.quantity}
                    </p>
                    {t.reason && (
                      <p className="flex items-center gap-1 text-xs text-slate-600 mt-1">
                        <MessageSquare size={11} /> {t.reason}
                      </p>
                    )}
                    <p className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                      <User size={11} /> <strong>{t.user.name}</strong>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-sm text-slate-400">
              Nenhuma movimentação registrada para este insumo.
            </div>
          )}
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplyHistoryModal;
