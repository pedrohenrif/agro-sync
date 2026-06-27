import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, CircleMarker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'react-toastify';
import { Search, PenTool, Check, X, MapPin, Layers, Info, Trash2, Loader2 } from 'lucide-react';
import * as gardenService from '../../service/gardenService';
import { Garden } from '../Gardens/types';
import GardenDetailModal from '../Gardens/components';

// ─── Helpers ────────────────────────────────────────────────────────────────

function centroid(pts: [number, number][]): [number, number] {
  return [
    pts.reduce((s, p) => s + p[0], 0) / pts.length,
    pts.reduce((s, p) => s + p[1], 0) / pts.length,
  ];
}

function gardenColor(g: Garden): string {
  if (g.mapColor) return g.mapColor;
  return g.isActive === false ? '#94a3b8' : '#16a34a';
}

// ─── Controlador de voo (pan/zoom) ─────────────────────────────────────────

function FlyTo({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 17, { duration: 1 });
  }, [center, map]);
  return null;
}

// ─── Captura de cliques no mapa para desenho ────────────────────────────────

function DrawHandler({ active, onPoint }: { active: boolean; onPoint: (p: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      if (active) onPoint([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

// ─── COMPONENTE PRINCIPAL ───────────────────────────────────────────────────

const DEFAULT_CENTER: [number, number] = [-15.78, -47.93]; // Brasília

const FarmMap: React.FC = () => {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [highlighted, setHighlighted] = useState<Garden | null>(null);
  const [modalGarden, setModalGarden] = useState<Garden | null>(null);

  const [drawingFor, setDrawingFor] = useState<Garden | null>(null);
  const [drawnPoints, setDrawnPoints] = useState<[number, number][]>([]);
  const [savingDraw, setSavingDraw] = useState(false);

  const fetchGardens = useCallback(async () => {
    setLoading(true);
    try { setGardens(await gardenService.getGardens()); }
    catch { toast.error('Erro ao carregar canteiros.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchGardens(); }, [fetchGardens]);

  const handleSelectGarden = (g: Garden) => {
    setHighlighted(g);
    if (g.geometry && g.geometry.length >= 3) {
      setFlyTo(centroid(g.geometry));
    }
  };

  const handleStartDraw = (g: Garden) => {
    setDrawingFor(g);
    setDrawnPoints([]);
    setHighlighted(g);
    if (g.geometry && g.geometry.length >= 3) {
      setFlyTo(centroid(g.geometry));
    } else {
      toast.info('Clique no mapa para adicionar os vértices do canteiro.');
    }
  };

  const handleClearDraw = (g: Garden) => {
    if (!window.confirm(`Remover o polígono de "${g.name}"?`)) return;
    gardenService.updateGarden(g.id, { geometry: null } as any)
      .then(updated => {
        setGardens(prev => prev.map(x => x.id === updated.id ? updated : x));
        toast.success('Polígono removido.');
      })
      .catch(() => toast.error('Erro ao remover polígono.'));
  };

  const handleFinishDraw = async () => {
    if (!drawingFor || drawnPoints.length < 3) {
      toast.warning('Adicione ao menos 3 pontos para fechar o polígono.');
      return;
    }
    setSavingDraw(true);
    try {
      const updated = await gardenService.updateGarden(drawingFor.id, { geometry: drawnPoints } as any);
      setGardens(prev => prev.map(x => x.id === updated.id ? updated : x));
      setFlyTo(centroid(drawnPoints));
      toast.success(`Mapa de "${drawingFor.name}" salvo!`);
    } catch { toast.error('Erro ao salvar polígono.'); }
    finally {
      setSavingDraw(false);
      setDrawingFor(null);
      setDrawnPoints([]);
    }
  };

  const handleCancelDraw = () => {
    setDrawingFor(null);
    setDrawnPoints([]);
  };

  const handleUpdateGarden = (g: Garden) => {
    setGardens(prev => prev.map(x => x.id === g.id ? g : x));
    setModalGarden(g);
  };

  const filtered = gardens.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.crop.toLowerCase().includes(search.toLowerCase()) ||
    g.lotCode.toLowerCase().includes(search.toLowerCase())
  );

  const withMap = gardens.filter(g => g.geometry && g.geometry.length >= 3);
  const withoutMap = filtered.filter(g => !g.geometry || g.geometry.length < 3);
  const withMapFiltered = filtered.filter(g => g.geometry && g.geometry.length >= 3);

  return (
    <div
      className="-mx-8 -mt-8 max-sm:-mx-4 max-sm:-mt-4 flex"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      {/* ── Sidebar ── */}
      <aside className="w-72 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden z-10">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Layers size={18} className="text-emerald-600" />
            <h1 className="text-sm font-bold text-slate-900">Mapa da Fazenda</h1>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar canteiro..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>
        </div>

        {/* Stats strip */}
        <div className="px-4 py-2 border-b border-slate-100 flex gap-4 text-xs text-slate-500">
          <span><strong className="text-slate-700">{gardens.length}</strong> canteiros</span>
          <span><strong className="text-emerald-600">{withMap.length}</strong> no mapa</span>
          <span><strong className="text-amber-500">{gardens.length - withMap.length}</strong> sem mapa</span>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center flex-1 gap-2 text-emerald-600 text-sm font-semibold">
            <Loader2 size={16} className="animate-spin" /> Carregando...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-2 px-2 space-y-px">
            {/* Com mapa */}
            {withMapFiltered.length > 0 && (
              <>
                <p className="px-2 pt-1 pb-1 text-[0.6rem] font-bold uppercase tracking-widest text-slate-400">Com mapa</p>
                {withMapFiltered.map(g => (
                  <GardenListItem
                    key={g.id}
                    garden={g}
                    isHighlighted={highlighted?.id === g.id}
                    drawingFor={drawingFor}
                    onSelect={() => handleSelectGarden(g)}
                    onDraw={() => handleStartDraw(g)}
                    onClear={() => handleClearDraw(g)}
                    onDetail={() => setModalGarden(g)}
                  />
                ))}
              </>
            )}

            {/* Sem mapa */}
            {withoutMap.length > 0 && (
              <>
                <p className="px-2 pt-3 pb-1 text-[0.6rem] font-bold uppercase tracking-widest text-slate-400">Sem mapa</p>
                {withoutMap.map(g => (
                  <GardenListItem
                    key={g.id}
                    garden={g}
                    isHighlighted={highlighted?.id === g.id}
                    drawingFor={drawingFor}
                    onSelect={() => handleSelectGarden(g)}
                    onDraw={() => handleStartDraw(g)}
                    onClear={() => {}}
                    onDetail={() => setModalGarden(g)}
                  />
                ))}
              </>
            )}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                <MapPin size={24} className="text-slate-300" />
                <p className="text-xs">Nenhum canteiro encontrado.</p>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* ── Mapa ── */}
      <div className="flex-1 relative">
        {/* Drawing toolbar */}
        {drawingFor && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-xl shadow-lg border border-slate-200 px-4 py-2.5 flex items-center gap-3 text-sm max-w-sm">
            <PenTool size={16} className="text-emerald-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 truncate">{drawingFor.name}</p>
              <p className="text-xs text-slate-500">{drawnPoints.length} ponto{drawnPoints.length !== 1 ? 's' : ''} — mínimo 3 para fechar</p>
            </div>
            <button
              onClick={handleFinishDraw}
              disabled={drawnPoints.length < 3 || savingDraw}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              {savingDraw ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              Concluir
            </button>
            <button
              onClick={handleCancelDraw}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-6 right-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 shadow-lg p-3 text-xs space-y-1.5">
          <p className="font-bold text-slate-700 mb-2">Legenda</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="text-slate-600">Ativo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-400 flex-shrink-0" />
            <span className="text-slate-600">Inativo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-slate-600">Selecionado</span>
          </div>
        </div>

        <MapContainer
          center={DEFAULT_CENTER}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FlyTo center={flyTo} />
          <DrawHandler active={!!drawingFor} onPoint={p => setDrawnPoints(prev => [...prev, p])} />

          {/* Polígonos dos canteiros */}
          {gardens.map(g => {
            if (!g.geometry || g.geometry.length < 3) return null;
            const isHighlighted = highlighted?.id === g.id;
            const color = isHighlighted ? '#3b82f6' : gardenColor(g);
            return (
              <Polygon
                key={g.id}
                positions={g.geometry}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: isHighlighted ? 0.4 : 0.25,
                  weight: isHighlighted ? 3 : 2,
                }}
                eventHandlers={{
                  click: () => {
                    setHighlighted(g);
                    setModalGarden(g);
                  },
                  mouseover: (e) => e.target.setStyle({ fillOpacity: 0.45 }),
                  mouseout: (e) => e.target.setStyle({ fillOpacity: isHighlighted ? 0.4 : 0.25 }),
                }}
              />
            );
          })}

          {/* Preview do polígono sendo desenhado */}
          {drawingFor && drawnPoints.length > 0 && (
            <>
              {drawnPoints.map((p, i) => (
                <CircleMarker
                  key={i}
                  center={p}
                  radius={5}
                  pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 1, weight: 2 }}
                />
              ))}
              {drawnPoints.length >= 2 && (
                <Polyline
                  positions={drawnPoints}
                  pathOptions={{ color: '#f59e0b', dashArray: '6 4', weight: 2 }}
                />
              )}
              {drawnPoints.length >= 3 && (
                <Polygon
                  positions={drawnPoints}
                  pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.2, weight: 2, dashArray: '6 4' }}
                />
              )}
            </>
          )}
        </MapContainer>
      </div>

      {/* Modal de detalhe */}
      {modalGarden && (
        <GardenDetailModal
          garden={modalGarden}
          onClose={() => setModalGarden(null)}
          onUpdate={handleUpdateGarden}
        />
      )}
    </div>
  );
};

// ─── Item da lista lateral ─────────────────────────────────────────────────

interface GardenListItemProps {
  garden: Garden;
  isHighlighted: boolean;
  drawingFor: Garden | null;
  onSelect: () => void;
  onDraw: () => void;
  onClear: () => void;
  onDetail: () => void;
}

const GardenListItem: React.FC<GardenListItemProps> = ({
  garden: g, isHighlighted, drawingFor, onSelect, onDraw, onClear, onDetail,
}) => {
  const hasMap = !!(g.geometry && g.geometry.length >= 3);
  const isDrawing = drawingFor?.id === g.id;
  const color = gardenColor(g);

  return (
    <div
      className={`rounded-lg px-3 py-2.5 cursor-pointer transition group ${
        isHighlighted ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50 border border-transparent'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-2.5">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5"
          style={{ background: color }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-900 truncate">{g.name}</p>
          <p className="text-[0.65rem] text-slate-500 truncate">{g.crop} · {g.lotCode}</p>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
          <button
            title="Ver detalhes"
            onClick={e => { e.stopPropagation(); onDetail(); }}
            className="p-1 rounded hover:bg-blue-100 text-slate-400 hover:text-blue-600"
          >
            <Info size={12} />
          </button>
          <button
            title={hasMap ? 'Redesenhar polígono' : 'Desenhar no mapa'}
            onClick={e => { e.stopPropagation(); onDraw(); }}
            disabled={!!drawingFor && !isDrawing}
            className="p-1 rounded hover:bg-amber-100 text-slate-400 hover:text-amber-600 disabled:opacity-30"
          >
            <PenTool size={12} />
          </button>
          {hasMap && (
            <button
              title="Remover polígono"
              onClick={e => { e.stopPropagation(); onClear(); }}
              className="p-1 rounded hover:bg-red-100 text-slate-400 hover:text-red-500"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
      {isDrawing && (
        <p className="text-[0.6rem] text-amber-600 font-semibold mt-1 ml-5">Desenhando...</p>
      )}
    </div>
  );
};

export default FarmMap;
