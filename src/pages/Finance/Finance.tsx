import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, Plus, Trash2, Receipt, ShoppingCart, BarChart3, Loader2, X, Edit2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import * as financeService from '../../service/financeService';
import * as gardenService from '../../service/gardenService';

// ─── KPI Card ──────────────────────────────────────────────────
const KpiCard = ({ label, value, icon: Icon, color, sub }: any) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-start gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon size={20} />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition";
const labelCls = "block text-xs font-semibold text-slate-600 mb-1";

// ─── TIPOS DE DESPESA ──────────────────────────────────────────
const EXPENSE_TYPES: Record<string, string> = {
  LABOR: 'Mão de Obra',
  EQUIPMENT: 'Equipamentos',
  INPUT: 'Insumos',
  INFRASTRUCTURE: 'Infraestrutura',
  OTHER: 'Outros',
};

// ─── MODAL DESPESA ─────────────────────────────────────────────
const ExpenseModal = ({ isOpen, onClose, onSaved, expense, gardens, categories }: any) => {
  const [form, setForm] = useState({ description: '', amount: '', date: new Date().toISOString().split('T')[0], type: 'OTHER', categoryId: '', gardenId: '', notes: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setForm({
        description: expense.description,
        amount: String(expense.amount),
        date: expense.date.split('T')[0],
        type: expense.type,
        categoryId: String(expense.category.id),
        gardenId: expense.garden ? String(expense.garden.id) : '',
        notes: expense.notes || '',
      });
    } else {
      setForm({ description: '', amount: '', date: new Date().toISOString().split('T')[0], type: 'OTHER', categoryId: categories[0]?.id ? String(categories[0].id) : '', gardenId: '', notes: '' });
    }
  }, [expense, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) { toast.error('Selecione uma categoria.'); return; }
    setLoading(true);
    try {
      const payload = { ...form, amount: Number(form.amount), categoryId: Number(form.categoryId), gardenId: form.gardenId ? Number(form.gardenId) : undefined };
      if (expense) await financeService.updateExpense(expense.id, payload);
      else await financeService.createExpense(payload as any);
      toast.success(expense ? 'Despesa atualizada!' : 'Despesa registrada!');
      onSaved();
    } catch { toast.error('Erro ao salvar despesa.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">{expense ? 'Editar Despesa' : 'Nova Despesa'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className={labelCls}>Descrição</label>
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required className={inputCls} placeholder="Ex: Diária de funcionário" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Valor (R$)</label>
              <input type="number" step="0.01" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Data</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Tipo</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inputCls}>
                {Object.entries(EXPENSE_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Categoria</label>
              <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} required className={inputCls}>
                <option value="">Selecione...</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Canteiro (opcional)</label>
            <select value={form.gardenId} onChange={e => setForm({ ...form, gardenId: e.target.value })} className={inputCls}>
              <option value="">Nenhum (despesa geral)</option>
              {gardens.map((g: any) => <option key={g.id} value={g.id}>{g.name} — {g.lotCode}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Observações</label>
            <textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={inputCls + ' resize-none'} />
          </div>
          <div className="flex gap-3 justify-end pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">Cancelar</button>
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition shadow-sm disabled:opacity-60">
              {loading ? <Loader2 size={14} className="animate-spin" /> : null}
              {expense ? 'Salvar' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── MODAL VENDA ───────────────────────────────────────────────
const SaleModal = ({ isOpen, onClose, onSaved, sale, gardens }: any) => {
  const [form, setForm] = useState({ gardenId: '', quantityKg: '', pricePerKg: '', buyer: '', saleDate: new Date().toISOString().split('T')[0], notes: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sale) {
      setForm({
        gardenId: String(sale.garden.id),
        quantityKg: String(sale.quantityKg),
        pricePerKg: String(sale.pricePerKg),
        buyer: sale.buyer || '',
        saleDate: sale.saleDate.split('T')[0],
        notes: sale.notes || '',
      });
    } else {
      setForm({ gardenId: '', quantityKg: '', pricePerKg: '', buyer: '', saleDate: new Date().toISOString().split('T')[0], notes: '' });
    }
  }, [sale, isOpen]);

  if (!isOpen) return null;

  const total = Number(form.quantityKg) * Number(form.pricePerKg);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, gardenId: Number(form.gardenId), quantityKg: Number(form.quantityKg), pricePerKg: Number(form.pricePerKg) };
      if (sale) await financeService.updateSale(sale.id, payload);
      else await financeService.createSale(payload as any);
      toast.success(sale ? 'Venda atualizada!' : 'Venda registrada!');
      onSaved();
    } catch { toast.error('Erro ao salvar venda.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">{sale ? 'Editar Venda' : 'Registrar Venda'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className={labelCls}>Canteiro</label>
            <select value={form.gardenId} onChange={e => setForm({ ...form, gardenId: e.target.value })} required className={inputCls}>
              <option value="">Selecione o canteiro...</option>
              {gardens.map((g: any) => <option key={g.id} value={g.id}>{g.name} — {g.crop}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Quantidade (kg)</label>
              <input type="number" step="0.1" min="0" value={form.quantityKg} onChange={e => setForm({ ...form, quantityKg: e.target.value })} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Preço por kg (R$)</label>
              <input type="number" step="0.01" min="0" value={form.pricePerKg} onChange={e => setForm({ ...form, pricePerKg: e.target.value })} required className={inputCls} />
            </div>
          </div>
          {total > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-sm font-bold text-emerald-700">
              Total: {fmt(total)}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Comprador (opcional)</label>
              <input value={form.buyer} onChange={e => setForm({ ...form, buyer: e.target.value })} className={inputCls} placeholder="Ex: Cooperativa XYZ" />
            </div>
            <div>
              <label className={labelCls}>Data da Venda</label>
              <input type="date" value={form.saleDate} onChange={e => setForm({ ...form, saleDate: e.target.value })} required className={inputCls} />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">Cancelar</button>
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition shadow-sm disabled:opacity-60">
              {loading ? <Loader2 size={14} className="animate-spin" /> : null}
              {sale ? 'Salvar' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
const Finance: React.FC = () => {
  const [tab, setTab] = useState<'dashboard'|'expenses'|'sales'|'gardens'>('dashboard');
  const [summary, setSummary] = useState<financeService.OrgSummary | null>(null);
  const [gardensSummary, setGardensSummary] = useState<financeService.GardenSummary[]>([]);
  const [expenses, setExpenses] = useState<financeService.Expense[]>([]);
  const [sales, setSales] = useState<financeService.HarvestSale[]>([]);
  const [categories, setCategories] = useState<financeService.ExpenseCategory[]>([]);
  const [gardens, setGardens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [expenseModal, setExpenseModal] = useState(false);
  const [saleModal, setSaleModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<financeService.Expense | null>(null);
  const [editingSale, setEditingSale] = useState<financeService.HarvestSale | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s, gs, exp, sal, cats, gards] = await Promise.all([
        financeService.getOrgSummary(),
        financeService.getGardensSummary(),
        financeService.getExpenses(),
        financeService.getSales(),
        financeService.getExpenseCategories(),
        gardenService.getGardens(),
      ]);
      setSummary(s); setGardensSummary(gs); setExpenses(exp); setSales(sal); setCategories(cats); setGardens(gards);
    } catch { toast.error('Erro ao carregar dados financeiros.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleDeleteExpense = async (id: number) => {
    if (!window.confirm('Remover esta despesa?')) return;
    try { await financeService.deleteExpense(id); toast.success('Removida.'); loadAll(); }
    catch { toast.error('Erro ao remover.'); }
  };

  const handleDeleteSale = async (id: number) => {
    if (!window.confirm('Remover esta venda?')) return;
    try { await financeService.deleteSale(id); toast.success('Removida.'); loadAll(); }
    catch { toast.error('Erro ao remover.'); }
  };

  const TABS = [
    { key: 'dashboard', label: 'Visão Geral', icon: BarChart3 },
    { key: 'expenses', label: 'Despesas', icon: TrendingDown },
    { key: 'sales', label: 'Receitas', icon: TrendingUp },
    { key: 'gardens', label: 'Por Canteiro', icon: PiggyBank },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3 text-emerald-600 font-semibold">
      <Loader2 size={20} className="animate-spin" /> Carregando dados financeiros...
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Módulo Financeiro</h1>
          <p className="text-sm text-slate-500 mt-1">Controle de receitas, despesas e lucratividade por canteiro.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setEditingExpense(null); setExpenseModal(true); }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition shadow-sm">
            <Plus size={16} /> Despesa
          </button>
          <button onClick={() => { setEditingSale(null); setSaleModal(true); }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition shadow-sm">
            <Plus size={16} /> Venda
          </button>
        </div>
      </div>

      {/* KPI Cards (sempre visíveis) */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard label="Receita Total" value={fmt(summary.totalRevenue)} icon={TrendingUp} color="bg-emerald-50 text-emerald-600" />
          <KpiCard label="Despesas Totais" value={fmt(summary.totalExpenses)} icon={TrendingDown} color="bg-red-50 text-red-500"
            sub={`Insumos: ${fmt(summary.inputCostTotal)}`} />
          <KpiCard label="Lucro Líquido" value={fmt(summary.netProfit)} icon={DollarSign}
            color={summary.netProfit >= 0 ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-500'} />
          <KpiCard label="Margem" value={`${summary.margin}%`} icon={PiggyBank}
            color={summary.margin >= 0 ? 'bg-violet-50 text-violet-600' : 'bg-orange-50 text-orange-500'} />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <t.icon size={15} />{t.label}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD ── */}
      {tab === 'dashboard' && summary && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fluxo de Caixa */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Fluxo de Caixa Mensal</h3>
            {summary.cashflow.length === 0
              ? <p className="text-sm text-slate-400 text-center py-8">Nenhum dado ainda.</p>
              : <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={summary.cashflow}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: any) => fmt(v)} />
                    <Bar dataKey="revenue" name="Receita" fill="#16a34a" radius={[4,4,0,0]} />
                    <Bar dataKey="expenses" name="Despesas" fill="#ef4444" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
            }
          </div>

          {/* Despesas por Categoria */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Despesas por Categoria</h3>
            {summary.byCategory.length === 0
              ? <p className="text-sm text-slate-400 text-center py-8">Nenhuma despesa registrada.</p>
              : <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={summary.byCategory} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                      {summary.byCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => fmt(v)} />
                  </PieChart>
                </ResponsiveContainer>
            }
          </div>
        </div>
      )}

      {/* ── DESPESAS ── */}
      {tab === 'expenses' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {expenses.length === 0
            ? <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                <Receipt size={32} className="text-slate-300" />
                <p className="text-sm">Nenhuma despesa registrada ainda.</p>
                <button onClick={() => { setEditingExpense(null); setExpenseModal(true); }} className="mt-2 text-sm font-semibold text-emerald-600 hover:underline">Registrar primeira despesa</button>
              </div>
            : <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase">Descrição</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase">Tipo</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase">Categoria</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase">Canteiro</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase">Data</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600 text-xs uppercase">Valor</th>
                    <th className="px-4 py-3"></th>
                  </tr></thead>
                  <tbody>
                    {expenses.map(e => (
                      <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{e.description}</td>
                        <td className="px-4 py-3 text-slate-500">{EXPENSE_TYPES[e.type] || e.type}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: e.category.color + '20', color: e.category.color }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: e.category.color }} />
                            {e.category.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{e.garden?.name || '—'}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{new Date(e.date).toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-3 text-right font-bold text-red-600">{fmt(e.amount)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => { setEditingExpense(e); setExpenseModal(true); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><Edit2 size={14} /></button>
                            <button onClick={() => handleDeleteExpense(e.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </div>
      )}

      {/* ── VENDAS ── */}
      {tab === 'sales' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {sales.length === 0
            ? <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                <ShoppingCart size={32} className="text-slate-300" />
                <p className="text-sm">Nenhuma venda registrada ainda.</p>
                <button onClick={() => { setEditingSale(null); setSaleModal(true); }} className="mt-2 text-sm font-semibold text-emerald-600 hover:underline">Registrar primeira venda</button>
              </div>
            : <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase">Canteiro / Cultura</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase">Comprador</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase">Qtd (kg)</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase">Preço/kg</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase">Data</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600 text-xs uppercase">Total</th>
                    <th className="px-4 py-3"></th>
                  </tr></thead>
                  <tbody>
                    {sales.map(s => (
                      <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-900">{s.garden.name}</p>
                          <p className="text-xs text-slate-400">{s.garden.crop}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{s.buyer || '—'}</td>
                        <td className="px-4 py-3 text-slate-700">{s.quantityKg.toLocaleString('pt-BR')} kg</td>
                        <td className="px-4 py-3 text-slate-700">{fmt(s.pricePerKg)}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{new Date(s.saleDate).toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-600">{fmt(s.totalAmount)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => { setEditingSale(s); setSaleModal(true); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><Edit2 size={14} /></button>
                            <button onClick={() => handleDeleteSale(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </div>
      )}

      {/* ── POR CANTEIRO ── */}
      {tab === 'gardens' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {gardensSummary.length === 0
            ? <p className="text-sm text-slate-400 text-center py-12">Nenhum canteiro encontrado.</p>
            : <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase">Canteiro</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase">Cultura</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600 text-xs uppercase">Receita</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600 text-xs uppercase">Despesas</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600 text-xs uppercase">Lucro</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600 text-xs uppercase">Margem</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600 text-xs uppercase">Kg vendidos</th>
                  </tr></thead>
                  <tbody>
                    {gardensSummary.map(g => (
                      <tr key={g.gardenId} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-900">{g.gardenName}</p>
                          <p className="text-xs text-slate-400">{g.lotCode}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{g.crop}</td>
                        <td className="px-4 py-3 text-right font-semibold text-emerald-600">{fmt(g.totalRevenue)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-red-500">{fmt(g.totalExpenses)}</td>
                        <td className={`px-4 py-3 text-right font-bold ${g.netProfit >= 0 ? 'text-blue-600' : 'text-orange-500'}`}>{fmt(g.netProfit)}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${g.margin >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                            {g.margin}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600 font-medium">{g.totalKgSold.toLocaleString('pt-BR')} kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </div>
      )}

      {/* Modais */}
      <ExpenseModal isOpen={expenseModal} onClose={() => { setExpenseModal(false); setEditingExpense(null); }}
        onSaved={() => { setExpenseModal(false); setEditingExpense(null); loadAll(); }}
        expense={editingExpense} gardens={gardens} categories={categories} />
      <SaleModal isOpen={saleModal} onClose={() => { setSaleModal(false); setEditingSale(null); }}
        onSaved={() => { setSaleModal(false); setEditingSale(null); loadAll(); }}
        sale={editingSale} gardens={gardens} />
    </div>
  );
};

export default Finance;
