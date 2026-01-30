import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight, ArrowDownLeft, Clock, User, MessageSquare } from 'lucide-react';
import { getSupplyTransactions } from '../../../service/supplyService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import './SupplyHistoryModal.css';

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
      loadHistory();
    }
  }, [isOpen, supplyId]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getSupplyTransactions(supplyId!);
      setTransactions(data);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="gdm-modal-overlay">
      <div className="gdm-modal-container history-modal">
        <header className="gdm-modal-header">
          <div className="header-content">
            <Clock size={20} className="text-emerald-500" />
            <div>
              <h3>Extrato de Movimentação</h3>
              <p className="subtitle">{supplyName}</p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </header>

        <div className="gdm-modal-body history-body">
          {isLoading ? (
            <div className="history-loading">
              <div className="spinner"></div>
              <p>Carregando histórico...</p>
            </div>
          ) : transactions.length > 0 ? (
            <div className="timeline">
              {transactions.map((t) => (
                <div key={t.id} className={`timeline-item ${t.type.toLowerCase()}`}>
                  <div className="timeline-icon">
                    {t.type === 'ENTRY' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className={`badge-${t.type.toLowerCase()}`}>
                        {t.type === 'ENTRY' ? 'Entrada' : 'Saída'}
                      </span>
                      <span className="timeline-date">
                        {format(new Date(t.createdAt), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="timeline-main">
                      <span className="timeline-qty">
                        {t.type === 'ENTRY' ? '+' : '-'} {t.quantity}
                      </span>
                      <p className="timeline-reason">
                        <MessageSquare size={12} /> {t.reason || 'Ajuste manual'}
                      </p>
                    </div>
                    <div className="timeline-footer">
                      <User size={12} /> Realizado por: <strong>{t.user.name}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-history">
              <p>Nenhuma movimentação registrada para este insumo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplyHistoryModal;