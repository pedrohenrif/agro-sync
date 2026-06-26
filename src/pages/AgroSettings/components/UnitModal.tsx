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

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-sm animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{initialData ? 'Editar Unidade' : 'Nova Unidade'}</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nome da Unidade</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Ex: Quilograma, Litro..." className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Símbolo</label>
            <input type="text" value={symbol} onChange={e => setSymbol(e.target.value)}
              placeholder="Ex: kg, L, un..." className={inputCls} />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
            Cancelar
          </button>
          <button onClick={() => onSave({ name, symbol })}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition shadow-sm">
            <Save size={16} /> Salvar Unidade
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnitModal;
