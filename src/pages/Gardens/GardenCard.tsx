import React from "react";
import { Trash2, PlayCircle, Leaf } from 'lucide-react';
import { Garden } from "./types";

interface GardenCardProps {
  garden: Garden;
  onView: (garden: Garden) => void;
  onDelete: (id: number, name: string) => void;
  onStartPlanting: (garden: Garden) => void;
}

const GardenCard: React.FC<GardenCardProps> = ({ garden, onView, onDelete, onStartPlanting }) => {
  // Verificamos se há um cultivo ativo (isso virá do seu backend no futuro)
  const isVacant = !garden.crop || garden.crop === "Vazio";

  return (
    <div className={`garden-card ${isVacant ? 'vacant' : 'active'}`} onClick={() => onView(garden)}>
      <div className="card-content">
        <div className="card-header-info">
          <h3>{garden.name}</h3>
          <span className={`status-badge ${isVacant ? 'status-vacant' : 'status-active'}`}>
            {isVacant ? 'Disponível' : 'Em Cultivo'}
          </span>
        </div>

        <p className="category-tag">{isVacant ? "Sem cultura definida" : garden.crop}</p>
        
        <div className="card-details">
          <p><strong>Tamanho:</strong> {garden.sizeInM2}m²</p>
          {!isVacant && (
            <p><strong>Plantado em:</strong> {new Date(garden.plantingDate).toLocaleDateString()}</p>
          )}
          {garden.location && <p><strong>Local:</strong> {garden.location}</p>}
        </div>

        {/* BOTÃO DE AÇÃO: SE ESTIVER VAZIO, MOSTRA INICIAR PLANTIO */}
        {isVacant && (
          <button 
            className="btn-start-planting"
            onClick={(e) => {
              e.stopPropagation();
              onStartPlanting(garden);
            }}
          >
            <PlayCircle size={16} /> Iniciar Plantio
          </button>
        )}
      </div>

      <div className="card-actions">
        <button 
          type="button" 
          className="action-button delete" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(garden.id, garden.name);
          }} 
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default GardenCard;