import React, { useState } from 'react';
import { X, BookOpen, Edit2, LayoutGrid, ListChecks, Package, Leaf } from 'lucide-react';
import { Garden } from '../types'; // Ajuste o caminho conforme seu projeto

// Importação das Abas
import TabOverview from './tabs/TabOverview';
import TabJournal from './tabs/TabJournal';
import TabSupplies from './tabs/TabSupplies';
import TabTasks from './tabs/TabTasks';
import TabEdit from './tabs/TabEdit';

import './GardenDetailModal.css';

interface GardenDetailModalProps {
  garden: Garden;
  onClose: () => void;
  onUpdate: (updatedGarden: Garden) => void;
}

type ActiveTab = 'overview' | 'journal' | 'supplies' | 'tasks' | 'edit';

const GardenDetailModal: React.FC<GardenDetailModalProps> = ({ garden, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  return (
    <div className="garden-detail-backdrop" onClick={onClose}>
      <div className="garden-detail-modal" onClick={e => e.stopPropagation()}>
        <header className="gdm-header">
          <div className="gdm-header-title">
            <span className="gdm-header-icon"><Leaf size={24} /></span>
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
          <button className={`gdm-tab-button ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <LayoutGrid size={16} /> Visão Geral
          </button>
          <button className={`gdm-tab-button ${activeTab === 'journal' ? 'active' : ''}`} onClick={() => setActiveTab('journal')}>
            <BookOpen size={16} /> Diário de Campo
          </button>
          <button className={`gdm-tab-button ${activeTab === 'supplies' ? 'active' : ''}`} onClick={() => setActiveTab('supplies')}>
            <Package size={16} /> Insumos
          </button>
          <button className={`gdm-tab-button ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
            <ListChecks size={16} /> Tarefas
          </button>
          <button className={`gdm-tab-button ${activeTab === 'edit' ? 'active' : ''}`} onClick={() => setActiveTab('edit')}>
            <Edit2 size={16} /> Editar
          </button>
        </nav>

        <main className="gdm-tab-content">
          {activeTab === 'overview' && <TabOverview garden={garden} onUpdate={onUpdate} onClose={onClose} />}
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