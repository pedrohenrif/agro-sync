// ARQUIVO: src/pages/CropPlans/types.ts

// Tipo para um Insumo dentro de um Plano
export interface PlanSupply {
  id: string; // ID temporário (uuid)
  name: string; // Nome (ex: Adubo NPK)
  quantity: number;
  unit: string; // (ex: 'kg', 'g', 'un')
}

// Tipo para uma Tarefa dentro de um Plano
export interface PlanTask {
  id: string; // ID temporário (uuid)
  title: string; // Ex: "Regar"
  dayToExecute: number; // Ex: 15 (significa 15 dias após o plantio)
  instructions: string; // Ex: "Aplicar 500ml de água"
}

// O Plano de Cultivo completo
export interface CropPlan {
  id: string; // ID do plano
  name: string; // Ex: "Plano Tomate Cereja - Verão"
  description: string;
  culture: string; // Ex: "Tomate"
  durationDays: number; // Ex: 90 (dias)
  supplies: PlanSupply[];
  tasks: PlanTask[];
}