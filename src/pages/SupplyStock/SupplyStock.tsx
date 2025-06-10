import React, { useState } from 'react';
import './supplyStock.css';
import { PlusCircle, Filter, Pencil, X, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { createSupply, deleteSupply, updateSupply } from '../../service/supplyService';

interface SupplyItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
}

interface Category {
  id: number;
  name: string;
}

interface Unit {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
}

const categories = ['Sementes', 'Adubos', 'Ferramentas'];

export default function SupplyStock() {
  const [supplyList, setSupplyList] = useState<SupplyItem[]>([
    { id: 1, name: 'Semente de Alface', category: 'Sementes', quantity: 200, unit: 'g' },
    { id: 2, name: 'Adubo Orgânico', category: 'Adubos', quantity: 15, unit: 'kg' },
    { id: 3, name: 'Enxada', category: 'Ferramentas', quantity: 5, unit: 'un' }
  ]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SupplyItem | null>(null);

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SupplyItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: categories[0],
    quantity: '',
    unit: ''
  });

  const openModal = (item?: SupplyItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        quantity: item.quantity.toString(),
        unit: item.unit
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        category: categories[0],
        quantity: '',
        unit: ''
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
      // Atualiza a lista local primeiro
      setSupplyList(prev =>
        prev.map(item =>
          item.id === editingItem.id
            ? { ...editingItem, ...formData, quantity: parseFloat(formData.quantity) }
            : item
        )
      );
      
      // Atualiza o backend
      try {
        await updateSupply(editingItem.id, {
          name: formData.name,
          quantity: parseFloat(formData.quantity),
          unitId: 1, // Exemplo, deve ser adaptado ao seu backend
        });
        toast.success('Insumo atualizado com sucesso!');
        closeModal();
      } catch (error) {
        toast.error('Erro ao atualizar insumo!');
      }
      return;
    }
  
    try {
      const response = await createSupply({
        name: formData.name,
        quantity: parseFloat(formData.quantity),
        unitId: 1,
        userId: 1,
        isActive: true,
        categoryId: 1,
      });
  
      const newItem: SupplyItem = {
        id: response.id,
        name: response.name,
        category: formData.category,
        quantity: response.quantity,
        unit: formData.unit,
      };
  
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
    : supplyList.filter(item => item.category === selectedCategory);

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
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
          <button className="new-supply-button" onClick={() => openModal()}>
            <PlusCircle size={18} />
            Novo Insumo
          </button>
        </div>
      </div>

      <div className="supply-grid">
        {filteredSupplies.map((item) => (
          <div key={item.id} className="supply-card">
            <div className="card-header">
              <h3>{item.name}</h3>
              <button className="edit-button" onClick={() => openModal(item)} title="Editar">
                <Pencil size={18} />
              </button>
              <button className="delete-button" onClick={() => confirmDelete(item)} title="Excluir">
                <Trash2 size={18} />
              </button>
            </div>
            <p><strong>Categoria:</strong> {item.category}</p>
            <p><strong>Quantidade:</strong> {item.quantity} {item.unit}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingItem ? 'Editar Insumo' : 'Novo Insumo'}</h3>
              <button className="close-modal" onClick={closeModal}><X size={20} /></button>
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
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
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
              <input
                type="text"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />

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
                <button className="close-modal" onClick={() => setIsDeleteModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
                <p>Você tem certeza que deseja excluir <strong>{itemToDelete.name}</strong>?</p>
                <div className="modal-actions">
                <button className="cancel-button" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
                <button className="delete-confirm-button" onClick={handleDelete}>Excluir</button>
                </div>
            </div>
            </div>
        </div>
        )}
    </div>
  );
}