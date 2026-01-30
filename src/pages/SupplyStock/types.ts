// ARQUIVO: src/pages/SupplyStock/types.ts

export interface Category {
  id: number;
  name: string;
}

export interface Unit {
  id: number;
  name: string;
  symbol: string;
  organizationId?: number; 
}

export interface SupplyItem {
  id: number;
  name: string;
  quantity: number;
  minStock: number | null;    
  unitPrice?: number | null;  
  categoryId: number;
  unitId: number;
  category: {
    id: number;
    name: string;
  };
  unit: {
    id: number;
    name: string;
    symbol: string;
  };
}