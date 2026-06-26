import React, { useState } from 'react';
import { X, BookOpen, Edit2, LayoutGrid, ListChecks, Package, Leaf } from 'lucide-react';
import { Garden } from '../types';
import TabOverview from './tabs/TabOverview';
import TabJournal from './tabs/TabJournal';
import TabSupplies from './tabs/TabSupplies';
import TabTasks from './tabs/TabTasks';
import TabEdit from './tabs/TabEdit';

interface GardenDetailModalProps {
  garden: Garden;
  onClose: () => void;
  onUpdate: (updatedGarden: Garden) => void;
}

type ActiveTab = 'overview' | 'journal' | 'supplies' | 'tasks' | 'edit';

const TABS: { key: ActiveTab; label: string; icon: React.ReactNode }[] = [
  { key: 'overview',  label: 'Visão Geral',     icon: <LayoutGrid size={15} /> },
  { key: 'journal',   label: 'Diário de Campo',  icon: <BookOpen size={15} /> },
  { key: 'supplies',  label: 'Insumos',           icon: <Package size={15} /> },
  { key: 'tasks',     label: 'Tarefas',           icon: <ListChecks size={15} /> },
  { key: 'edit',      label: 'Editar',            icon: <Edit2 size={15} /> },
];

const GardenDetailModal: React.FC<GardenDetailModalProps> = ({ garden, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-3xl max-h-[90vh] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <Leaf size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{garden.name}</h2>
              <p className="text-xs text-slate-500">{garden.crop}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 flex-shrink-0 px-4 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap
                ${activeTab === tab.key
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'overview'  && <TabOverview garden={garden} onUpdate={onUpdate} onClose={onClose} />}
          {activeTab === 'journal'   && <TabJournal garden={garden} />}
          {activeTab === 'supplies'  && <TabSupplies garden={garden} />}
          {activeTab === 'tasks'     && <TabTasks garden={garden} />}
          {activeTab === 'edit'      && <TabEdit garden={garden} onClose={onClose} onSave={onUpdate} />}
        </div>
      </div>
    </div>
  );
};

export default GardenDetailModal;
