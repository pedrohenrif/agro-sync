import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircle, Pencil, Trash2, Clock, Package } from 'lucide-react';
import { toast } from 'react-toastify';

// Importações dos seus serviços Reais
import { getSupplys, getCategories } from '../../service/supplyService'; 
import api from '../../service/api'; 

import './supplyStock.css'; 
import AddEditSupplyModal from './AddEditSupplyModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import SupplyHistoryModal from './components/SupplyHistoryModal'; // Novo Modal de Histórico
import { SupplyItem, Category, Unit } from './types'; 

export default function SupplyStock() {
  // --- Estados ---
  const [supplyList, setSupplyList] = useState<SupplyItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]); 
  const [currentUser, setCurrentUser] = useState<any>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Controle dos modais
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SupplyItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SupplyItem | null>(null);

  // Estado para o Histórico (Auditoria)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedSupplyForHistory, setSelectedSupplyForHistory] = useState<{id: number, name: string} | null>(null);

  // Filtro
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // --- Carregamento Real de Dados ---
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

    } catch (err) {
      console.error("Erro ao sincronizar:", err);
      setError('Falha ao carregar dados. Tente recarregar a página.');
      toast.error('Erro de conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Funções de Controle ---
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (item: SupplyItem) => {
    setEditingItem(item);
    setIsAddEditModalOpen(true);
  };

  const handleOpenDeleteModal = (item: SupplyItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleOpenHistory = (item: SupplyItem) => {
    setSelectedSupplyForHistory({ id: item.id, name: item.name });
    setIsHistoryModalOpen(true);
  };

  const handleSaveSuccess = () => {
    fetchData(); 
  };

  const handleDeleteSupply = (deletedId: number) => {
    setSupplyList(prev => prev.filter(item => item.id !== deletedId));
  };

  // --- Filtragem useMemo ---
  const filteredSupplies = useMemo(() => {
    if (selectedCategory === 'Todos') return supplyList;
    return supplyList.filter(item => item.category?.name === selectedCategory);
  }, [supplyList, selectedCategory]);

  return (
    <div className="supply-container">
      <div className="supply-header">
        <h2>
          <span role="img" aria-label="package">📦</span> 
          Estoque de Insumos
        </h2>
        <div className="supply-actions">
          <label htmlFor="category-filter" className="filter-label">Filtrar por:</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
            disabled={isLoading || categories.length === 0}
          >
            <option value="Todos">Todas as Categorias</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <button
            type="button"
            className="new-supply-button"
            onClick={handleOpenAddModal}
            disabled={isLoading}
          >
            <PlusCircle size={18} />
            Novo Insumo
          </button>
        </div>
      </div>

      {isLoading && supplyList.length === 0 && (
        <div className="loading-message">Sincronizando com o servidor...</div>
      )}
      
      {error && !isLoading && <div className="error-message">{error}</div>}

      {!isLoading && !error && filteredSupplies.length === 0 && (
          <div className="empty-state">
              <p>Nenhum insumo encontrado nesta categoria.</p>
              {selectedCategory !== 'Todos' && (
                  <button onClick={() => setSelectedCategory('Todos')} className="clear-filter-button">
                      Limpar filtro
                  </button>
              )}
          </div>
      )}

      {!isLoading && !error && filteredSupplies.length > 0 && (
        <div className="supply-grid">
          {filteredSupplies.map((item) => (
            <div key={item.id} className="supply-card">
              <div className="card-content">
                <div className="card-header-flex">
                  <p className="category-tag">{item.category?.name || 'Geral'}</p>
                </div>
                <h3>{item.name}</h3>
                <p className="quantity-info">
                  <strong>{item.quantity}</strong> {item.unit?.symbol || item.unit?.name}
                </p>
                <p style={{fontSize: '0.7rem', color: '#94a3b8', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px'}}>
                   Última alteração por: <strong>{currentUser?.name || 'Sistema'}</strong>
                </p>
              </div>

              <div className="card-actions">
                <button 
                  type="button" 
                  className="action-button history" 
                  onClick={() => handleOpenHistory(item)} 
                  title="Ver Extrato de Movimentação"
                >
                  <Clock size={16} /> 
                </button>
                
                <button 
                  type="button" 
                  className="action-button edit" 
                  onClick={() => handleOpenEditModal(item)} 
                  title="Editar Insumo"
                >
                  <Pencil size={16} /> 
                </button>
                
                <button 
                  type="button" 
                  className="action-button delete" 
                  onClick={() => handleOpenDeleteModal(item)} 
                  title="Excluir"
                >
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
        onSave={handleSaveSuccess}
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