// ARQUIVO: src/pages/SupplyStock/SupplyStock.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { getSupplys, getCategories /*, getUnits */ } from '../../service/supplyService'; // Ajuste o caminho

import './supplyStock.css'; // CSS Principal
import AddEditSupplyModal from './AddEditSupplyModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { SupplyItem, Category, Unit } from './types'; // Importando tipos

// Simulação: ID do usuário logado (substitua pela lógica real)
const FAKE_USER_ID = 1;

export default function SupplyStock() {
  // --- Estados ---
  const [supplyList, setSupplyList] = useState<SupplyItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]); // Ainda usando mock abaixo
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de controle dos modais
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SupplyItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SupplyItem | null>(null);

  // Estado do filtro
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // --- Carregamento Inicial ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // !! IMPORTANTE: Substitua isso pela chamada real à sua API de unidades !!
        const mockUnits: Unit[] = [
          { id: 1, name: 'g' }, { id: 2, name: 'kg' }, { id: 3, name: 'un' },
          { id: 4, name: 'L' }, { id: 5, name: 'mL' } // Adicionei mais exemplos
        ];
        // const unitsData = await getUnits(); // Sua chamada real iria aqui

        const [suppliesData, categoriesData] = await Promise.all([
          getSupplys(), // Idealmente, passe o userId aqui se a API filtrar por usuário
          getCategories()
        ]);

        setSupplyList(suppliesData);
        setCategories(categoriesData);
        setUnits(mockUnits); // Substitua por unitsData quando tiver a API

      } catch (err) {
        console.error("Erro ao buscar dados iniciais:", err);
        setError('Falha ao carregar dados. Tente recarregar a página.');
        toast.error('Falha ao carregar dados. Tente recarregar a página.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Roda apenas na montagem

  // --- Funções de Abertura dos Modais ---
  const handleOpenAddModal = () => {
    setEditingItem(null); // Garante que está no modo "adicionar"
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

  // --- Callbacks dos Modais ---
  const handleSaveSupply = (savedItem: SupplyItem) => {
    if (editingItem) {
      // Atualiza item existente na lista
      setSupplyList(prev => prev.map(item => item.id === savedItem.id ? savedItem : item));
    } else {
      // Adiciona novo item à lista
      setSupplyList(prev => [...prev, savedItem]);
    }
    // O modal já fecha sozinho e mostra o toast
  };

  const handleDeleteSupply = (deletedId: number) => {
    setSupplyList(prev => prev.filter(item => item.id !== deletedId));
    // O modal já fecha sozinho e mostra o toast
  };

  // --- Filtragem ---
  // useMemo otimiza a filtragem para não rodar a cada renderização, só quando a lista ou o filtro mudam
  const filteredSupplies = useMemo(() => {
    if (selectedCategory === 'Todos') {
      return supplyList;
    }
    return supplyList.filter(item => item.category.name === selectedCategory);
  }, [supplyList, selectedCategory]);

  // --- Renderização ---
  return (
    <div className="supply-container">
      {/* Cabeçalho com título, filtro e botão de adicionar */}
      <div className="supply-header">
        <h2><span role="img" aria-label="package">📦</span> Estoque de Insumos</h2>
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
            disabled={isLoading} // Desabilita se estiver carregando
          >
            <PlusCircle size={18} />
            Novo Insumo
          </button>
        </div>
      </div>

      {/* Conteúdo Principal: Loading, Erro, Vazio ou Grid */}
      {isLoading && <div className="loading-message">Carregando insumos...</div>}
      
      {error && !isLoading && <div className="error-message">{error}</div>}

      {!isLoading && !error && filteredSupplies.length === 0 && (
          <div className="empty-state">
              <p>Nenhum insumo encontrado.</p>
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
              <div className="card-content"> {/* Div extra para melhor controle do layout */}
                <h3>{item.name}</h3>
                <p className="category-tag">{item.category.name}</p>
                <p className="quantity-info">
                  {item.quantity} {item.unit.name}
                </p>
              </div>
              <div className="card-actions">
                <button type="button" className="action-button edit" onClick={() => handleOpenEditModal(item)} title="Editar">
                  <Pencil size={16} /> {/* Tamanho um pouco menor */}
                </button>
                <button type="button" className="action-button delete" onClick={() => handleOpenDeleteModal(item)} title="Excluir">
                  <Trash2 size={16} /> {/* Tamanho um pouco menor */}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Renderização dos Modais */}
      <AddEditSupplyModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        categories={categories}
        units={units}
        editingItem={editingItem}
        onSave={handleSaveSupply}
        userId={FAKE_USER_ID} // Passando o ID (ainda fixo)
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