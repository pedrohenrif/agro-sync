import React, { useState, useEffect } from 'react';
import { X, Archive, Save, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { createSupply, updateSupply } from '../../service/supplyService';
import { SupplyItem, Category, Unit } from './types';

interface AddEditSupplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  units: Unit[];
  editingItem: SupplyItem | null;
  onSave: (item: SupplyItem) => void;
  userId: number;
}

const AddEditSupplyModal: React.FC<AddEditSupplyModalProps> = ({
  isOpen, onClose, categories, units, editingItem, onSave, userId
}) => {
  const [formData, setFormData] = useState({ name: '', categoryId: 0, quantity: '', unitId: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setFormData({
          name: editingItem.name,
          categoryId: Number(editingItem.categoryId || editingItem.category?.id || 0),
          quantity: editingItem.quantity.toString(),
          unitId: Number(editingItem.unitId || editingItem.unit?.id || 0),
        });
      } else {
        setFormData({
          name: '',
          categoryId: categories.length > 0 ? Number(categories[0].id) : 0,
          quantity: '',
          unitId: units.length > 0 ? Number(units[0].id) : 0,
        });
      }
    }
  }, [isOpen, editingItem, categories, units]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: (name === 'unitId' || name === 'categoryId') ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.unitId) {
      toast.error("Selecione uma categoria e uma unidade válidas.");
      return;
    }
    const qty = parseFloat(formData.quantity);
    if (isNaN(qty) || qty < 0) { toast.error("Quantidade inválida."); return; }
    setIsLoading(true);
    try {
      const payload = { name: formData.name, quantity: qty, unitId: formData.unitId, categoryId: formData.categoryId, userId, isActive: true };
      if (editingItem) {
        const updated = await updateSupply(editingItem.id, payload);
        onSave(updated); toast.success('Insumo atualizado!');
      } else {
        const created = await createSupply(payload);
        onSave(created); toast.success('Insumo criado!');
      }
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao processar requisição');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition disabled:bg-slate-50";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Archive size={20} className="text-emerald-500" />
            {editingItem ? 'Editar Insumo' : 'Novo Insumo'}
          </h3>
          <button onClick={onClose} disabled={isLoading} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className={labelCls}>Nome do Produto</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required
              placeholder="Ex: Semente de Tomate Cereja" disabled={isLoading} className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Categoria</label>
              <select name="categoryId" value={formData.categoryId} onChange={handleChange} required disabled={isLoading} className={inputCls}>
                <option value={0} disabled>Selecione...</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Qtd. em Estoque</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange}
                required step="any" placeholder="0.00" disabled={isLoading} className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Unidade de Medida</label>
            <select name="unitId" value={formData.unitId} onChange={handleChange} required disabled={isLoading} className={inputCls}>
              <option value={0} disabled>Selecione uma unidade</option>
              {units.map(unit => <option key={unit.id} value={unit.id}>{unit.name} ({unit.symbol})</option>)}
            </select>
            {units.length === 0 && (
              <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                <AlertCircle size={12} /> Nenhuma unidade cadastrada.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition shadow-sm disabled:opacity-60">
              {isLoading ? 'Processando...' : <><Save size={16} /> Salvar Insumo</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditSupplyModal;
