import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { PlusCircle, Sprout, Loader2 } from 'lucide-react';
import { Garden } from "./types";
import * as gardenService from '../../service/gardenService';
import DeleteGardenModal from "./DeleteGardenModal";
import GardenDetailModal from "./components";
import AddGardenModal from "./AddGardenModal";
import GardenCard from "./GardenCard";
import StartPlantingModal from "./components/StartPlantingModal";

const GardenManager = () => {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingGarden, setDeletingGarden] = useState<{id: number; name: string} | null>(null);
  const [viewingGarden, setViewingGarden] = useState<Garden | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [plantingGarden, setPlantingGarden] = useState<Garden | null>(null);

  useEffect(() => { fetchGardens(); }, []);

  const fetchGardens = async () => {
    setIsLoading(true);
    try { setGardens(await gardenService.getGardens()); }
    catch { toast.error("Não foi possível carregar os canteiros."); }
    finally { setIsLoading(false); }
  };

  const handleUpdateGarden = (g: Garden) => setGardens(prev => prev.map(x => x.id === g.id ? g : x));
  const handleAddSave = (g: Garden) => { setGardens(prev => [g, ...prev]); setIsAddModalOpen(false); toast.success("Canteiro criado!"); };
  const handleDeleteConfirm = async () => {
    if (!deletingGarden) return;
    try {
      await gardenService.deleteGarden(deletingGarden.id);
      setGardens(prev => prev.filter(g => g.id !== deletingGarden.id));
      setDeletingGarden(null);
      toast.success("Canteiro excluído!");
    } catch { toast.error("Falha ao excluir."); }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-[300px] gap-3 text-emerald-600 font-semibold">
      <Loader2 size={20} className="animate-spin" /> Carregando canteiros...
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Sprout size={28} className="text-emerald-600" />
          <h1 className="text-2xl font-extrabold text-slate-900">Canteiros Cadastrados</h1>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-all hover:-translate-y-px shadow-sm"
        >
          <PlusCircle size={18} /> Novo Canteiro
        </button>
      </div>

      {/* Grid or empty state */}
      {gardens.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center text-slate-500 gap-3">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <Sprout size={28} />
          </div>
          <h3 className="text-lg text-slate-700 font-semibold">Nenhum canteiro cadastrado</h3>
          <p className="text-sm max-w-[340px]">Clique em "Novo Canteiro" para começar a registrar seus cultivos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
          {gardens.map(garden => (
            <GardenCard
              key={garden.id}
              garden={garden}
              onView={setViewingGarden}
              onDelete={(id, name) => setDeletingGarden({id, name})}
              onStartPlanting={g => setPlantingGarden(g)}
            />
          ))}
        </div>
      )}

      {deletingGarden && (
        <DeleteGardenModal
          gardenName={deletingGarden.name}
          onClose={() => setDeletingGarden(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
      {viewingGarden && (
        <GardenDetailModal
          garden={viewingGarden}
          onClose={() => setViewingGarden(null)}
          onUpdate={handleUpdateGarden}
        />
      )}
      <AddGardenModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddSave} />
      {plantingGarden && (
        <StartPlantingModal garden={plantingGarden} onClose={() => setPlantingGarden(null)} onConfirm={fetchGardens} />
      )}
    </div>
  );
};

export default GardenManager;
