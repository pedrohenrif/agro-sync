import React from "react";
import { Trash2, PlayCircle, Sprout } from 'lucide-react';
import { Garden } from "./types";

interface GardenCardProps {
  garden: Garden;
  onView: (garden: Garden) => void;
  onDelete: (id: number, name: string) => void;
  onStartPlanting: (garden: Garden) => void;
}

const GardenCard: React.FC<GardenCardProps> = ({ garden, onView, onDelete, onStartPlanting }) => {
  const isVacant = !garden.crop || garden.crop === "Vazio";

  return (
    <div
      onClick={() => onView(garden)}
      className={`relative bg-white rounded-xl border transition-all cursor-pointer group shadow-card hover:shadow-card-hover hover:-translate-y-0.5
        ${isVacant ? 'border-slate-200' : 'border-emerald-200'}`}
    >
      {/* Status strip */}
      <div className={`h-1 rounded-t-xl ${isVacant ? 'bg-slate-300' : 'bg-emerald-500'}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-base font-bold text-slate-900 leading-tight">{garden.name}</h3>
          <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
            ${isVacant ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700'}`}>
            {isVacant ? 'Disponível' : 'Em Cultivo'}
          </span>
        </div>

        <p className={`text-sm mb-4 ${isVacant ? 'text-slate-400 italic' : 'text-emerald-700 font-medium'}`}>
          {isVacant ? 'Sem cultura definida' : garden.crop}
        </p>

        <div className="flex flex-col gap-1.5 text-sm text-slate-600">
          <span><strong className="text-slate-700">Tamanho:</strong> {garden.sizeInM2} m²</span>
          {!isVacant && garden.plantingDate && (
            <span><strong className="text-slate-700">Plantado em:</strong> {new Date(garden.plantingDate).toLocaleDateString('pt-BR')}</span>
          )}
          {garden.location && (
            <span><strong className="text-slate-700">Local:</strong> {garden.location}</span>
          )}
        </div>

        {isVacant && (
          <button
            onClick={e => { e.stopPropagation(); onStartPlanting(garden); }}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-700 font-semibold text-sm rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-all"
          >
            <PlayCircle size={16} /> Iniciar Plantio
          </button>
        )}
      </div>

      {/* Delete button (visible on hover) */}
      <button
        onClick={e => { e.stopPropagation(); onDelete(garden.id, garden.name); }}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        title="Excluir canteiro"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
};

export default GardenCard;
