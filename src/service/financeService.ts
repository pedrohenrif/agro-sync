import api from './api';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface OrgSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  margin: number;
  manualExpenseTotal: number;
  inputCostTotal: number;
  byCategory: { name: string; color: string; total: number }[];
  cashflow: { month: string; revenue: number; expenses: number }[];
}

export interface GardenSummary {
  gardenId: number;
  gardenName: string;
  lotCode: string;
  crop: string;
  isActive: boolean;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  margin: number;
  totalKgSold: number;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: string;
  notes?: string;
  category: { id: number; name: string; color: string };
  garden?: { id: number; name: string; lotCode: string } | null;
}

export interface HarvestSale {
  id: number;
  quantityKg: number;
  pricePerKg: number;
  totalAmount: number;
  buyer?: string;
  saleDate: string;
  notes?: string;
  garden: { id: number; name: string; lotCode: string; crop: string };
}

export interface ExpenseCategory {
  id: number;
  name: string;
  color: string;
}

// ─── Summary ─────────────────────────────────────────────────────────────────

export const getOrgSummary = (params?: { from?: string; to?: string }) =>
  api.get('/finance/summary', { params }).then(r => r.data as OrgSummary);

export const getGardensSummary = () =>
  api.get('/finance/summary/gardens').then(r => r.data as GardenSummary[]);

// ─── Expenses ────────────────────────────────────────────────────────────────

export const getExpenses = (params?: { gardenId?: number; type?: string; from?: string; to?: string }) =>
  api.get('/finance/expenses', { params }).then(r => r.data as Expense[]);

export const createExpense = (data: Partial<Expense> & { categoryId: number; date: string; amount: number; description: string }) =>
  api.post('/finance/expenses', data).then(r => r.data as Expense);

export const updateExpense = (id: number, data: Partial<Expense> & { categoryId?: number }) =>
  api.put(`/finance/expenses/${id}`, data).then(r => r.data as Expense);

export const deleteExpense = (id: number) =>
  api.delete(`/finance/expenses/${id}`);

// ─── Categories ───────────────────────────────────────────────────────────────

export const getExpenseCategories = () =>
  api.get('/finance/expense-categories').then(r => r.data as ExpenseCategory[]);

export const createExpenseCategory = (data: { name: string; color?: string }) =>
  api.post('/finance/expense-categories', data).then(r => r.data as ExpenseCategory);

export const deleteExpenseCategory = (id: number) =>
  api.delete(`/finance/expense-categories/${id}`);

// ─── Sales ───────────────────────────────────────────────────────────────────

export const getSales = (params?: { gardenId?: number; from?: string; to?: string }) =>
  api.get('/finance/sales', { params }).then(r => r.data as HarvestSale[]);

export const createSale = (data: { gardenId: number; quantityKg: number; pricePerKg: number; buyer?: string; saleDate: string; notes?: string }) =>
  api.post('/finance/sales', data).then(r => r.data as HarvestSale);

export const updateSale = (id: number, data: Partial<HarvestSale>) =>
  api.put(`/finance/sales/${id}`, data).then(r => r.data as HarvestSale);

export const deleteSale = (id: number) =>
  api.delete(`/finance/sales/${id}`);
