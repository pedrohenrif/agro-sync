import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircle, Pencil, Trash2, Clock, Package, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { getSupplys, getCategories } from '../../service/supplyService';
import api from '../../service/api';
import AddEditSupplyModal from './AddEditSupplyModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import SupplyHistoryModal from './components/SupplyHistoryModal';
import { SupplyItem, Category, Unit } from './types';

export default function SupplyStock() {
  const [supplyList, setSupplyList] = useState<SupplyItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SupplyItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SupplyItem | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedSupplyForHistory, setSelectedSupplyForHistory] = useState<{id: number, name: string} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [userRes, suppliesData, categoriesData, unitsResponse] = await Promise.all([
        api.get('/auth/me'),
        getSupplys(),
        getCategories(),
        api.get('/supplies/units')
      ]);
      setCurrentUser(userRes.data.user);
      setSupplyList(suppliesData);
      setCategories(categoriesData);
      setUnits(unitsResponse.data);
    } catch {
      setError('Falha ao carregar dados. Tente recarregar a página.');
      toast.error('Erro de conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredSupplies = useMemo(() => {
    if (selectedCategory === 'Todos') return supplyList;
    return supplyList.filter(item => item.category?.name === selectedCategory);
  }, [supplyList, selectedCategory]);

  const handleOpenEditModal = (item: SupplyItem) => { setEditingItem(item); setIsAddEditModalOpen(true); };
  const handleOpenDeleteModal = (item: SupplyItem) => { setItemToDelete(item); setIsDeleteModalOpen(true); };
  const handleOpenHistory = (item: SupplyItem) => {
    setSelectedSupplyForHistory({ id: item.id, name: item.name });
    setIsHistoryModalOpen(true);
  };
  const handleDeleteSupply = (deletedId: number) => setSupplyList(prev => prev.filter(i => i.id !== deletedId));

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Package size={28} className="text-emerald-600" />
          <h1 className="text-2xl font-extrabold text-slate-900">Estoque de Insumos</h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500">Filtrar:</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              disabled={isLoading || categories.length === 0}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            >
              <option value="Todos">Todas as Categorias</option>
              {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
            </select>
          </div>
          <button
            onClick={() => { setEditingItem(null); setIsAddEditModalOpen(true); }}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-all hover:-translate-y-px shadow-sm disabled:opacity-60"
          >
            <PlusCircle size={18} /> Novo Insumo
          </button>
        </div>
      </div>

      {/* States */}
      {isLoading && supplyList.length === 0 && (
        <div className="flex items-center justify-center h-[300px] gap-3 text-emerald-600 font-semibold">
          <Loader2 size={20} className="animate-spin" /> Sincronizando com o servidor...
        </div>
      )}

      {error && !isLoading && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {!isLoading && !error && filteredSupplies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 gap-3">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <Package size={28} />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">Nenhum insumo encontrado</h3>
          {selectedCategory !== 'Todos' && (
            <button onClick={() => setSelectedCategory('Todos')}
              className="text-sm text-emerald-600 hover:underline font-medium">
              Limpar filtro
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {!isLoading && !error && filteredSupplies.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
          {filteredSupplies.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-card-hover transition-all flex flex-col">
              <div className="h-1 rounded-t-xl bg-emerald-400" />
              <div className="p-4 flex-1">
                <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 mb-2">
                  {item.category?.name || 'Geral'}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-1">{item.name}</h3>
                <p className="text-sm text-slate-600">
                  <span className="text-xl font-extrabold text-slate-900">{item.quantity}</span>{' '}
                  {item.unit?.symbol || item.unit?.name}
                </p>
                <p className="mt-3 text-[11px] text-slate-400">
                  Última alteração por: <strong className="text-slate-500">{currentUser?.name || 'Sistema'}</strong>
                </p>
              </div>
              <div className="flex items-center justify-end gap-1 px-3 pb-3">
                <button onClick={() => handleOpenHistory(item)} title="Ver Extrato"
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <Clock size={16} />
                </button>
                <button onClick={() => handleOpenEditModal(item)} title="Editar"
                  className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleOpenDeleteModal(item)} title="Excluir"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddEditSupplyModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        categories={categories}
        units={units}
        editingItem={editingItem}
        onSave={fetchData}
        userId={currentUser?.id}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        itemToDelete={itemToDelete}
        onConfirm={handleDeleteSupply}
      />
      <SupplyHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        supplyId={selectedSupplyForHistory?.id || null}
        supplyName={selectedSupplyForHistory?.name || ''}
      />
    </div>
  );
}
