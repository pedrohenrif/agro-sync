import React, { useState } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const SuppliesTab = ({ formData, setFormData, stock }: any) => {
  const [selectedSupplyId, setSelectedSupplyId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    const item = stock.find((s: any) => s.id === Number(selectedSupplyId));
    if (!item) return;
    setFormData({
      ...formData,
      planSupplies: [...formData.planSupplies, {
        id: uuidv4(), supplyId: item.id, name: item.name,
        quantity, unit: item.unit?.abbreviation || 'un'
      }]
    });
    setSelectedSupplyId(''); setQuantity(1);
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Insumo do Estoque</label>
          <select className={inputCls} value={selectedSupplyId} onChange={e => setSelectedSupplyId(e.target.value)}>
            <option value="">Selecione...</option>
            {stock.map((s: any) => <option key={s.id} value={s.id}>{s.name} ({s.quantity})</option>)}
          </select>
        </div>
        <div className="w-24">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Qtd</label>
          <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className={inputCls} />
        </div>
        <button type="button" onClick={handleAdd}
          className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition shadow-sm">
          <Plus size={18} />
        </button>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Insumos Vinculados</h4>
        {formData.planSupplies.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">Nenhum insumo adicionado.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {formData.planSupplies.map((s: any, i: number) => (
              <div key={s.id || i} className="flex items-center justify-between gap-3 px-3 py-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 min-w-0">
                  <Package size={15} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-800 truncate">{s.name}</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold flex-shrink-0">
                    {s.quantity} {s.unit}
                  </span>
                </div>
                <button type="button"
                  onClick={() => setFormData({...formData, planSupplies: formData.planSupplies.filter((_: any, idx: number) => idx !== i)})}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition flex-shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuppliesTab;
