// ARQUIVO: src/pages/CropPlans/types.ts

export interface PlanSupply {
  id?: number | string;
  name: string;
  quantity: number;
  unit: string;
}

export interface PlanTask {
  id?: number | string;
  title: string;
  dayToExecute: number;
  instructions?: string;
}

export interface CropPlan {
  id: number; 
  name: string;
  culture: string;
  durationDays: number;
  description?: string;
  planSupplies: PlanSupply[];
  planTasks: PlanTask[];
}