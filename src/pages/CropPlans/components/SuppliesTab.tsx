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
        id: uuidv4(), 
        supplyId: item.id, 
        name: item.name, 
        quantity, 
        unit: item.unit?.abbreviation || 'un' 
      }]
    });
    setSelectedSupplyId(''); setQuantity(1);
  };

  return (
    <div className="tab-panel-container">
      <div className="input-row-container">
        <div className="input-field-flex">
          <label className="field-label">Insumo do Estoque</label>
          <select 
            className="form-select" 
            value={selectedSupplyId} 
            onChange={e => setSelectedSupplyId(e.target.value)}
          >
            <option value="">Selecione...</option>
            {stock.map((s: any) => <option key={s.id} value={s.id}>{s.name} ({s.quantity})</option>)}
          </select>
        </div>
        <div className="input-field-fixed">
          <label className="field-label">Qtd</label>
          <input 
            type="number" 
            value={quantity} 
            onChange={e => setQuantity(Number(e.target.value))} 
            className="form-input" 
          />
        </div>
        <button type="button" onClick={handleAdd} className="btn-primary-circle">
          <Plus size={20} />
        </button>
      </div>

      <div className="items-list-wrapper">
        <h4 className="list-title">Insumos Vinculados</h4>
        {formData.planSupplies.map((s: any, i: number) => (
          <div key={s.id || i} className="item-row-card">
            <div className="item-info">
              <Package size={18} className="icon-green" />
              <span className="item-name">{s.name}</span>
              <span className="item-badge">{s.quantity} {s.unit}</span>
            </div>
            <button 
              type="button" 
              onClick={() => setFormData({...formData, planSupplies: formData.planSupplies.filter((_: any, idx: number) => idx !== i)})} 
              className="btn-delete-ghost"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuppliesTab;