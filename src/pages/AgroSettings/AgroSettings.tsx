import React, { useState, useEffect } from 'react';
import { Tag, Ruler, Plus, Pencil, Trash2, Loader2, Settings2 } from 'lucide-react';
import api from '../../service/api';
import CategoryModal from './components/CategoryModal';
import UnitModal from './components/UnitModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

const AgroSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'units'>('categories');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<'create' | 'edit' | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'categories' ? '/supplies/categories' : '/supplies/units';
      const res = await api.get(endpoint);
      setData(res.data);
    } catch { } finally { setLoading(false); }
  };

  const handleSave = async (payload: any) => {
    try {
      const endpoint = activeTab === 'categories' ? '/supplies/categories' : '/supplies/units';
      if (modalType === 'edit' && selectedItem) { await api.put(`${endpoint}/${selectedItem.id}`, payload); }
      else { await api.post(endpoint, payload); }
      closeModals(); fetchData();
    } catch { alert("Erro ao processar solicitação."); }
  };

  const confirmDelete = async () => {
    try {
      const endpoint = activeTab === 'categories' ? '/supplies/categories' : '/supplies/units';
      await api.delete(`${endpoint}/${selectedItem.id}`);
      setIsDeleteModalOpen(false); fetchData();
    } catch { alert("Erro ao deletar."); }
  };

  const closeModals = () => { setModalType(null); setSelectedItem(null); };

  const tabCls = (tab: string) => `flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition
    ${activeTab === tab ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mb-1">
            <Settings2 size={13} /> Configurações de Ativos
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Cadastros Gerais</h1>
        </div>
        <button onClick={() => setModalType('create')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition shadow-sm hover:-translate-y-px">
          <Plus size={18} /> Novo Registro
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button className={tabCls('categories')} onClick={() => setActiveTab('categories')}>
          <Tag size={16} /> Categorias
        </button>
        <button className={tabCls('units')} onClick={() => setActiveTab('units')}>
          <Ruler size={16} /> Unidades
        </button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 gap-3 text-emerald-600 font-semibold">
            <Loader2 size={20} className="animate-spin" /> Sincronizando...
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-sm text-slate-400">
            Nenhum registro cadastrado.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Nome</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {activeTab === 'categories' ? 'Descrição' : 'Símbolo'}
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Gerenciar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3 text-sm font-semibold text-slate-900">{item.name}</td>
                  <td className="px-5 py-3 text-sm text-slate-500">
                    {activeTab === 'categories'
                      ? (item.description || <span className="text-slate-300">—</span>)
                      : <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-xs rounded border border-slate-200">{item.symbol}</span>
                    }
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => { setSelectedItem(item); setModalType('edit'); }}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => { setSelectedItem(item); setIsDeleteModalOpen(true); }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {activeTab === 'categories'
        ? <CategoryModal isOpen={!!modalType} onClose={closeModals} onSave={handleSave} initialData={selectedItem} />
        : <UnitModal isOpen={!!modalType} onClose={closeModals} onSave={handleSave} initialData={selectedItem} />
      }
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={`Excluir ${activeTab === 'categories' ? 'Categoria' : 'Unidade'}`}
        itemName={selectedItem?.name}
      />
    </div>
  );
};

export default AgroSettings;
