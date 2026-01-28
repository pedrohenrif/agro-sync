import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InventoryBannerProps {
  count: number;
}

const InventoryBanner: React.FC<InventoryBannerProps> = ({ count }) => {
  const navigate = useNavigate();

  return (
    <div className="inventory-banner-alert">
      <div className="banner-content">
        <div className="banner-icon">
          <AlertTriangle size={20} />
        </div>
        <div className="banner-text">
          <strong>Atenção ao Estoque:</strong> Existem {count} insumos abaixo do nível de segurança.
        </div>
      </div>
      <button className="banner-button" onClick={() => navigate('/estoque')}>
        Verificar Agora <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default InventoryBanner;