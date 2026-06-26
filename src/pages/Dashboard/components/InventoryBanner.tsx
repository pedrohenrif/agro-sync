import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InventoryBanner: React.FC<{ count: number }> = ({ count }) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center bg-red-50 border border-red-200 px-6 py-4 rounded-xl mt-6 gap-4 max-sm:flex-col max-sm:items-start animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="bg-red-500 text-white p-2 rounded-full flex flex-shrink-0">
          <AlertTriangle size={20} />
        </div>
        <p className="text-sm text-red-800 font-medium">
          <strong>Atenção ao Estoque:</strong> Existem {count} insumos abaixo do nível de segurança.
        </p>
      </div>
      <button
        onClick={() => navigate('/supply-stock')}
        className="flex items-center gap-2 bg-red-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:bg-red-900 hover:translate-x-0.5 whitespace-nowrap flex-shrink-0"
      >
        Verificar Agora <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default InventoryBanner;
