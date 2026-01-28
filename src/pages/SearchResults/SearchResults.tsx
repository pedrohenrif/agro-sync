// ARQUIVO: src/pages/SearchResults.tsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; 
import api from '../../service/api';
import { Garden } from '../Gardens/types'; 
// import { SupplyItem } from './SupplyStock/types'; // Importar quando buscar insumos

import './SearchResults.css'; 

interface SearchResultsData {
  gardens: Garden[];
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || ''; 

  const [results, setResults] = useState<SearchResultsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.length < 2) {
        setError("Termo de busca inválido.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        // Chama a API de busca
        const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
        if (response.data.success) {
          setResults(response.data.results);
        } else {
          setError(response.data.message || "Erro ao realizar a busca.");
        }
      } catch (err: any) {
        console.error("Erro ao buscar:", err);
        setError(err.response?.data?.message || "Erro de conexão ao buscar.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]); // Re-executa a busca se a query na URL mudar

  return (
    <div className="search-results-container">
      <h1>Resultados da Busca por: "{query}"</h1>

      {isLoading && <p className="loading-message">Buscando...</p>}
      {error && <p className="error-message">{error}</p>}

      {!isLoading && !error && !results && <p>Nenhum resultado encontrado.</p>}

      {!isLoading && !error && results && (
        <div className="results-section">
          {/* Resultados de Canteiros */}
          {results.gardens && results.gardens.length > 0 && (
            <div className="result-category">
              <h2>Canteiros Encontrados ({results.gardens.length})</h2>
              <ul className="result-list">
                {results.gardens.map(garden => (
                  <li key={`garden-${garden.id}`} className="result-item">
                    {/* Crie um link para a página de detalhes do canteiro, se existir */}
                    <Link to={`/hortas/${garden.id}`}> 
                      <strong>{garden.name}</strong> ({garden.crop})
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* --- Futuro: Resultados de Insumos --- */}
          {/* {results.supplies && results.supplies.length > 0 && ( ... ) } */}

          {/* Mensagem se nenhuma categoria teve resultados */}
          {(!results.gardens || results.gardens.length === 0) /* && (!results.supplies || results.supplies.length === 0) */ && (
             <p>Nenhum resultado encontrado para esta busca.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;