import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

// Importações dos seus serviços Reais
import { getSupplys, getCategories } from '../../service/supplyService'; 
import api from '../../service/api'; 

import './supplyStock.css'; // Usando seu CSS original
import AddEditSupplyModal from './AddEditSupplyModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
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

  const handleSaveSuccess = () => {
    fetchData(); // Recarrega tudo para garantir a atualização
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
      {/* Cabeçalho - Usando suas classes originais */}
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

      {/* Grid e Cards - Usando suas classes originais */}
      {!isLoading && !error && filteredSupplies.length > 0 && (
        <div className="supply-grid">
          {filteredSupplies.map((item) => (
            <div key={item.id} className="supply-card">
              <div className="card-content">
                <h3>{item.name}</h3>
                <p className="category-tag">{item.category?.name || 'Geral'}</p>
                <p className="quantity-info">
                  <strong>{item.quantity}</strong> {item.unit?.symbol || item.unit?.name}
                </p>
                {/* Opcional: Mostra quem atualizou se quiser usar os dados do currentUser */}
                <p style={{fontSize: '0.7rem', color: '#999', marginTop: '10px'}}>
                  Ref: {currentUser?.name || 'Sistema'}
                </p>
              </div>

              <div className="card-actions">
                <button type="button" className="action-button edit" onClick={() => handleOpenEditModal(item)} title="Editar">
                  <Pencil size={16} /> 
                </button>
                <button type="button" className="action-button delete" onClick={() => handleOpenDeleteModal(item)} title="Excluir">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modais Reais */}
      <AddEditSupplyModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        categories={categories}
        units={units}
        editingItem={editingItem}
        onSave={handleSaveSuccess}
        userId={currentUser?.id} // ID Real do usuário
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        itemToDelete={itemToDelete}
        onConfirm={handleDeleteSupply}
      />
    </div>
  );
}