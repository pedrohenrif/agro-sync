import React, { useState } from 'react';
import './supplyStock.css';
import { PlusCircle, Filter, Pencil, X, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';


interface SupplyItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      // Editar insumo
      setSupplyList(prev =>
        prev.map(item =>
          item.id === editingItem.id
            ? { ...editingItem, ...formData, quantity: parseFloat(formData.quantity) }
            : item
        )
      );
    } else {
      // Criar novo insumo
      const newItem: SupplyItem = {
        id: Date.now(),
        name: formData.name,
        category: formData.category,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit
      };
      setSupplyList(prev => [...prev, newItem]);
    }
    closeModal();
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    setSupplyList(prev => prev.filter(item => item.id !== itemToDelete.id));
    toast.success("Insumo excluído com sucesso!");
    setItemToDelete(null);
    setIsDeleteModalOpen(false);
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
