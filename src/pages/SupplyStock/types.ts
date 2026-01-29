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
  category: Category; 
  quantity: number;
  unit: Unit;     
  categoryId?: number; 
  unitId?: number;   
}