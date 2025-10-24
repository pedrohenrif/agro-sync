import React, { useState, useEffect } from 'react';
import './supplyStock.css';
import { PlusCircle, Pencil, X, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  createSupply,
  deleteSupply,
  updateSupply,
  getSupplys,
  getCategories
} from '../../service/supplyService';

interface Category {
  id: number;
  name: string;
}

interface Unit {
  id: number;
  name: string;
}

interface SupplyItem {
  id: number;
  name: string;
  category: Category;
  quantity: number;
  unit: Unit;
}

// A interface 'User' foi removida daqui por não estar em uso

export default function SupplyStock() {
  const [supplyList, setSupplyList] = useState<SupplyItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SupplyItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SupplyItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: 0,
    quantity: '',
    unitId: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // NOTA: Você ainda está simulando (mocking) as unidades.
        // Lembre-se de criar e chamar 'getUnits()' do seu serviço.
        const mockUnits: Unit[] = [
          { id: 1, name: 'g' },
          { id: 2, name: 'kg' },
          { id: 3, name: 'un' }
        ];

        const [suppliesData, categoriesData] = await Promise.all([
          getSupplys(),
          getCategories()
          // getUnits() // Você chamaria sua função real aqui
        ]);

        setSupplyList(suppliesData);
        setCategories(categoriesData);
        setUnits(mockUnits); // Lembre-se de trocar por 'unitsData'

        if (categoriesData.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: categoriesData[0].id }));
        }
        if (mockUnits.length > 0) {
          setFormData(prev => ({ ...prev, unitId: mockUnits[0].id }));
        }

      } catch (error) {
        console.error("Erro ao buscar dados iniciais:", error);
        toast.error('Falha ao carregar dados. Tente recarregar a página.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (item?: SupplyItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        categoryId: item.category.id,
        quantity: item.quantity.toString(),
        unitId: item.unit.id
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        categoryId: categories.length > 0 ? categories[0].id : 0,
        quantity: '',
        unitId: units.length > 0 ? units[0].id : 0
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      try {
        const dataToUpdate = {
          name: formData.name,
          quantity: parseFloat(formData.quantity),
          unitId: formData.unitId,
          categoryId: formData.categoryId
        };

        const updatedItem: SupplyItem = await updateSupply(editingItem.id, dataToUpdate);

        setSupplyList(prev =>
          prev.map(item =>
            item.id === editingItem.id ? updatedItem : item
          )
        );
        toast.success('Insumo atualizado com sucesso!');
        closeModal();

      } catch (error) {
        toast.error('Erro ao atualizar insumo!');
      }
      return;
    }

    try {
      const dataToCreate = {
        name: formData.name,
        quantity: parseFloat(formData.quantity),
        unitId: formData.unitId,
        categoryId: formData.categoryId,
        userId: 1, // ATENÇÃO: 'userId' ainda está fixo (hard-coded)
        isActive: true
      };

      const newItem: SupplyItem = await createSupply(dataToCreate);

      setSupplyList(prev => [...prev, newItem]);
      toast.success('Insumo criado com sucesso!');
      closeModal();

    } catch (error) {
      console.error('Erro ao criar insumo:', error);
      toast.error('Erro ao criar insumo!');
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteSupply(itemToDelete.id);
      setSupplyList(prev => prev.filter(item => item.id !== itemToDelete.id));
      toast.success('Insumo excluído com sucesso!');
      setItemToDelete(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error('Erro ao excluir insumo!');
    }
  };

  const confirmDelete = (item: SupplyItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const filteredSupplies = selectedCategory === 'Todos'
    ? supplyList
    : supplyList.filter(item => item.category.name === selectedCategory);

  return (
    <div className="supply-container">
      <div className="supply-header">
        <h2>Estoque de Insumos</h2>
        <div className="supply-actions">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="Todos">Todos</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <button type="button" className="new-supply-button" onClick={() => openModal()}>
            <PlusCircle size={18} />
            Novo Insumo
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-message">Carregando insumos...</div>
      ) : (
        <div className="supply-grid">
          {filteredSupplies.map((item) => (
            <div key={item.id} className="supply-card">
              <div className="card-header">
                <h3>{item.name}</h3>
                {/* As tags <button> aqui estão corretas 
                  e resolvem o erro 'jsx-a11y/anchor-is-valid'
                */}
                <button type="button" className="edit-button" onClick={() => openModal(item)} title="Editar">
                  <Pencil size={18} />
                </button>
                <button type="button" className="delete-button" onClick={() => confirmDelete(item)} title="Excluir">
                  <Trash2 size={18} />
                </button>
              </div>
              <p><strong>Categoria:</strong> {item.category.name}</p>
              <p><strong>Quantidade:</strong> {item.quantity} {item.unit.name}</p>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingItem ? 'Editar Insumo' : 'Novo Insumo'}</h3>
              <button type="button" className="close-modal" onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <label>Nome</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <label>Categoria</label>
              <select
                value={formData.categoryId}
                required
                onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
              >
                <option value={0} disabled>Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <label>Quantidade</label>
              <input
                type="number"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />

              <label>Unidade</label>
              <select
                value={formData.unitId}
                required
                onChange={(e) => setFormData({ ...formData, unitId: Number(e.target.value) })}
              >
                <option value={0} disabled>Selecione uma unidade</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>{unit.name}</option>
                ))}
              </select>

              <button type="submit" className="submit-button">
                {editingItem ? 'Salvar Alterações' : 'Adicionar Insumo'}
              </button>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && itemToDelete && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirmar Exclusão</h3>
              <button type="button" className="close-modal" onClick={() => setIsDeleteModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <p>Você tem certeza que deseja excluir <strong>{itemToDelete.name}</strong>?</p>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
                <button type="button" className="delete-confirm-button" onClick={handleDelete}>Excluir</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}