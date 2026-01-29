import React, { useState, useEffect } from 'react';
import { Tag, Ruler, Plus, Pencil, Trash2, Loader2, Settings2 } from 'lucide-react';
import api from '../../service/api';
import CategoryModal from './components/CategoryModal';
import UnitModal from './components/UnitModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import './AgroSettings.css';

const AgroSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'units'>('categories');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para Modais
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
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSave = async (payload: any) => {
    try {
      const endpoint = activeTab === 'categories' ? '/supplies/categories' : '/supplies/units';
      
      if (modalType === 'edit' && selectedItem) {
        await api.put(`${endpoint}/${selectedItem.id}`, payload);
      } else {
        await api.post(endpoint, payload);
      }

      closeModals(); 
      fetchData();  
    } catch (err) {
      alert("Erro ao processar solicitação.");
    }
  };

  const confirmDelete = async () => {
    try {
      const endpoint = activeTab === 'categories' ? '/supplies/categories' : '/supplies/units';
      await api.delete(`${endpoint}/${selectedItem.id}`);
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (err) { alert("Erro ao deletar."); }
  };

  const closeModals = () => {
    setModalType(null);
    setSelectedItem(null);
  };

  return (
    <div className="agro-settings-page">
      <header className="agro-page-header">
        <div className="title-area">
          <div className="badge-title"><Settings2 size={16}/> Configurações de Ativos</div>
          <h1>Cadastros Gerais</h1>
        </div>
        <button className="add-agro-btn" onClick={() => setModalType('create')}>
          <Plus size={20} /> Novo Registro
        </button>
      </header>

      <div className="agro-tabs-container">
        <button className={`agro-tab ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
          <Tag size={18} /> <span>Categorias</span>
        </button>
        <button className={`agro-tab ${activeTab === 'units' ? 'active' : ''}`} onClick={() => setActiveTab('units')}>
          <Ruler size={18} /> <span>Unidades</span>
        </button>
      </div>

      <div className="agro-main-card">
        {loading ? (
          <div className="agro-loading"><Loader2 className="animate-spin" /> Sincronizando...</div>
        ) : (
          <table className="agro-table-modern">
            <thead>
              <tr>
                <th>Nome</th>
                <th>{activeTab === 'categories' ? 'Descrição' : 'Símbolo'}</th>
                <th className="text-right">Gerenciar</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td><span className="name-cell">{item.name}</span></td>
                  <td>{activeTab === 'categories' ? <span className="desc-text">{item.description || '---'}</span> : <span className="symbol-badge">{item.symbol}</span>}</td>
                  <td className="text-right">
                    <button className="action-icon-btn edit" onClick={() => { setSelectedItem(item); setModalType('edit'); }}>
                      <Pencil size={16}/>
                    </button>
                    <button className="action-icon-btn delete" onClick={() => { setSelectedItem(item); setIsDeleteModalOpen(true); }}>
                      <Trash2 size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* RENDERIZAÇÃO CONDICIONAL DOS MODAIS */}
      {activeTab === 'categories' ? (
        <CategoryModal isOpen={!!modalType} onClose={closeModals} onSave={handleSave} initialData={selectedItem} />
      ) : (
        <UnitModal isOpen={!!modalType} onClose={closeModals} onSave={handleSave} initialData={selectedItem} />
      )}

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