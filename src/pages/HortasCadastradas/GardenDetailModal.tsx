import React, { useState } from 'react';
import { X, BookOpen, Edit2, LayoutGrid, ListChecks, Package, Leaf } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../service/api';
import { Garden } from './types';

import './GardenDetailModal.css';

interface GardenDetailModalProps {
  garden: Garden;
  onClose: () => void;
  onUpdate: (updatedGarden: Garden) => void;
}

type ActiveTab = 'overview' | 'journal' | 'supplies' | 'tasks' | 'edit';

const GardenDetailModal: React.FC<GardenDetailModalProps> = ({ garden, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="garden-detail-backdrop" onClick={onClose}>
      
      <div className="garden-detail-modal" onClick={handleModalClick}>
        
        <header className="gdm-header">
          <div className="gdm-header-title">
            <span className="gdm-header-icon">
              <Leaf size={24} />
            </span>
            <div className="gdm-title-text">
              <h2>{garden.name}</h2>
              <p className="category-tag">{garden.crop}</p>
            </div>
          </div>
          <button className="gdm-close-btn" onClick={onClose} title="Fechar">
            <X size={24} />
          </button>
        </header>

        <nav className="gdm-tab-nav">
          <button
            className={`gdm-tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutGrid size={16} /> Visão Geral
          </button>
          <button
            className={`gdm-tab-button ${activeTab === 'journal' ? 'active' : ''}`}
            onClick={() => setActiveTab('journal')}
          >
            <BookOpen size={16} /> Diário de Campo
          </button>
          <button
            className={`gdm-tab-button ${activeTab === 'supplies' ? 'active' : ''}`}
            onClick={() => setActiveTab('supplies')}
          >
            <Package size={16} /> Insumos
          </button>
          <button
            className={`gdm-tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <ListChecks size={16} /> Tarefas
          </button>
          <button
            className={`gdm-tab-button ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            <Edit2 size={16} /> Editar Canteiro
          </button>
        </nav>

        <main className="gdm-tab-content">
          {activeTab === 'overview' && <TabOverview garden={garden} />}
          {activeTab === 'journal' && <TabJournal garden={garden} />}
          {activeTab === 'supplies' && <TabSupplies garden={garden} />}
          {activeTab === 'tasks' && <TabTasks garden={garden} />}
          {activeTab === 'edit' && <TabEdit garden={garden} onClose={onClose} onSave={onUpdate} />}
        </main>

      </div>
    </div>
  );
};

export default GardenDetailModal;

// ==================================================================
// Componentes Internos das Abas
// ==================================================================

const TabOverview: React.FC<{ garden: Garden }> = ({ garden }) => (
  <div className="tab-content-container">
    <h3>Visão Geral do Canteiro</h3>
    <div className="info-grid">
      <div className="info-item">
        <span className="info-label">Cultura</span>
        <span className="info-value">{garden.crop}</span>
      </div>
      <div className="info-item">
        <span className="info-label">Data de Plantação</span>
        <span className="info-value">{new Date(garden.plantingDate).toLocaleDateString()}</span>
      </div>
      <div className="info-item">
        <span className="info-label">Tamanho</span>
        <span className="info-value">{garden.sizeInM2}m²</span>
      </div>
      <div className="info-item">
        <span className="info-label">Localização</span>
        <span className="info-value">{garden.location || "Não definida"}</span>
      </div>
    </div>
    <div className="tab-divider"></div>
    <h3>Alertas e Próximas Tarefas</h3>
    <p><i>(Esta seção mostrará alertas de pragas ou próximas regas.)</i></p>
  </div>
);

const TabJournal: React.FC<{ garden: Garden }> = ({ garden }) => {
  type EntryType = "Observação" | "Aplicação" | "Praga" | "Colheita";
  
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [entryType, setEntryType] = useState<EntryType>("Observação");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const newEntry = { gardenId: garden.id, title, date, entryType, description };
    try {
      await api.post('/manager-garden/add-journal-entry', newEntry);
      toast.success("Entrada salva com sucesso!");
      setTitle("");
      setDescription("");
      setEntryType("Observação");
      setDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      toast.error("Falha ao salvar a entrada.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="tab-content-container">
      <h3>Adicionar Entrada no Diário</h3>
      <form onSubmit={handleSubmit} className="modal-form-reused">
        <div className="form-group">
          <label htmlFor="journal-title">Título:</label>
          <input id="journal-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="form-input" />
        </div>
        <div className="form-group">
          <label htmlFor="journal-date">Data:</label>
          <input id="journal-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="form-input" />
        </div>
        <div className="form-group">
          <label htmlFor="journal-entryType">Tipo:</label>
          <select id="journal-entryType" value={entryType} onChange={(e) => setEntryType(e.target.value as EntryType)} className="form-select">
            <option value="Observação">Observação</option>
            <option value="Aplicação">Aplicação</option>
            <option value="Praga">Praga / Doença</option>
            <option value="Colheita">Colheita</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="journal-description">Descrição:</label>
          <textarea id="journal-description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="form-textarea" />
        </div>
        <div className="modal-actions-reused">
          <button type="submit" className="modal-button submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Entrada"}
          </button>
        </div>
      </form>
      <div className="tab-divider"></div>
      <h3>Histórico do Diário</h3>
      <p><i>(A lista de entradas anteriores do diário aparecerá aqui.)</i></p>
    </div>
  );
};

const TabSupplies: React.FC<{ garden: Garden }> = ({ garden }) => (
  <div className="tab-content-container">
    <h3>Insumos Associados ao Canteiro</h3>
    <p>Aqui você poderá ver e gerenciar os insumos (sementes, fertilizantes, etc.) usados ou alocados para o <strong>{garden.name}</strong>.</p>
  </div>
);

const TabTasks: React.FC<{ garden: Garden }> = ({ garden }) => (
  <div className="tab-content-container">
    <h3>Tarefas do Canteiro</h3>
    <p>Aqui você poderá criar e gerenciar tarefas (ex: "Regar", "Verificar Pragas") específicas para o <strong>{garden.name}</strong>.</p>
  </div>
);

const TabEdit: React.FC<{ garden: Garden, onClose: () => void, onSave: (updatedGarden: Garden) => void }> = ({ garden, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: garden.name,
    crop: garden.crop,
    plantingDate: new Date(garden.plantingDate).toISOString().split('T')[0],
    sizeInM2: garden.sizeInM2.toString(),
    location: garden.location || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = { ...formData, sizeInM2: parseFloat(formData.sizeInM2) || 0 };
    try {
      const response = await api.put(`/manager-garden/update-garden/${garden.id}`, payload);
      const updatedGarden: Garden = response.data;
      toast.success("Canteiro atualizado com sucesso!");
      onSave(updatedGarden);
      onClose(); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Falha ao atualizar o canteiro.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tab-content-container">
      <h3>Editar Informações do Canteiro</h3>
      <form onSubmit={handleSubmit} className="modal-form-reused">
        <div className="form-group">
          <label htmlFor="edit-name">Nome:</label>
          <input id="edit-name" type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" />
        </div>
        <div className="form-group">
          <label htmlFor="edit-crop">Cultura:</label>
          <input id="edit-crop" type="text" name="crop" value={formData.crop} onChange={handleChange} required className="form-input" />
        </div>
        <div className="form-group">
          <label htmlFor="edit-plantingDate">Data de Plantação:</label>
          <input id="edit-plantingDate" type="date" name="plantingDate" value={formData.plantingDate} onChange={handleChange} required className="form-input" />
        </div>
        <div className="form-group">
          <label htmlFor="edit-sizeInM2">Tamanho (m²):</label>
          <input id="edit-sizeInM2" type="number" name="sizeInM2" value={formData.sizeInM2} onChange={handleChange} required min="0" step="0.1" className="form-input" />
        </div>
        <div className="form-group">
          <label htmlFor="edit-location">Localização:</label>
          <input id="edit-location" type="text" name="location" value={formData.location} onChange={handleChange} className="form-input" />
        </div>
        <div className="modal-actions-reused">
          <button type="button" className="modal-button cancel" onClick={onClose} disabled={isLoading}>
            Cancelar
          </button>
          <button type="submit" className="modal-button submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
};