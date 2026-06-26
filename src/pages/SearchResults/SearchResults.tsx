import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Loader2, AlertCircle, Sprout } from 'lucide-react';
import api from '../../service/api';
import { Garden } from '../Gardens/types';

interface SearchResultsData { gardens: Garden[] }

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResultsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) { setError("Termo de busca inválido."); setIsLoading(false); return; }
    setIsLoading(true); setError(null);
    api.get(`/search?q=${encodeURIComponent(query)}`)
      .then(res => {
        if (res.data.success) setResults(res.data.results);
        else setError(res.data.message || "Erro ao realizar a busca.");
      })
      .catch((err: any) => setError(err.response?.data?.message || "Erro de conexão ao buscar."))
      .finally(() => setIsLoading(false));
  }, [query]);

  const totalResults = (results?.gardens?.length || 0);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Search size={28} className="text-emerald-600" />
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Resultados da Busca</h1>
          <p className="text-sm text-slate-500">Pesquisando por: <strong>"{query}"</strong></p>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-3 text-emerald-600 font-semibold">
          <Loader2 size={18} className="animate-spin" /> Buscando...
        </div>
      )}

      {error && !isLoading && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {!isLoading && !error && totalResults === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 gap-3">
          <Search size={32} className="text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-700">Nenhum resultado encontrado</h3>
          <p className="text-sm">Tente buscar por outro termo.</p>
        </div>
      )}

      {!isLoading && !error && results && results.gardens && results.gardens.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Sprout size={16} className="text-emerald-500" /> Canteiros Encontrados ({results.gardens.length})
          </h2>
          <div className="flex flex-col gap-2">
            {results.gardens.map(garden => (
              <Link key={`garden-${garden.id}`} to={`/hortas/${garden.id}`}
                className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition group">
                <div>
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700">{garden.name}</p>
                  {garden.crop && <p className="text-xs text-slate-500">{garden.crop}</p>}
                </div>
                <Sprout size={16} className="text-slate-400 group-hover:text-emerald-500 transition" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
