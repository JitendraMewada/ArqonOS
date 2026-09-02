import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  PlusCircle, 
  AlertTriangle, 
  CheckCircle2, 
  PieChart as PieChartIcon, 
  TrendingUp,
  Edit2,
  Trash2,
  Lock,
  Edit3,
  BarChart3,
  Sliders,
  ShieldAlert
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { NestGroup, NestBudget, ExpenseCategory } from '../types';
import { cn } from '../../../../lib/utils';

const BUDGET_PIE_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ec4899', '#06b6d4', '#14b8a6', '#f97316'];

interface NestBudgetsProps {
  group: NestGroup;
  budgets: NestBudget[];
  onUpdateBudget: (budgets: NestBudget[]) => void;
}

export function NestBudgets({
  group,
  budgets,
  onUpdateBudget
}: NestBudgetsProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<NestBudget | null>(null);

  // Form states
  const [category, setCategory] = useState<ExpenseCategory>('Dining & Food');
  const [limit, setLimit] = useState('10000');
  const [threshold, setThreshold] = useState('80');

  const totalMonthlyBudget = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  const totalMonthlySpent = budgets.reduce((sum, b) => sum + b.currentSpent, 0);
  const overallBurnPercent = Math.round((totalMonthlySpent / (totalMonthlyBudget || 1)) * 100);

  const budgetComparisonData = useMemo(() => {
    return budgets.map(b => ({
      category: b.category.length > 14 ? `${b.category.slice(0, 12)}...` : b.category,
      fullCategory: b.category,
      allocated: b.monthlyLimit,
      spent: b.currentSpent,
      burnRate: Math.round((b.currentSpent / (b.monthlyLimit || 1)) * 100),
      isOver: b.currentSpent > b.monthlyLimit
    }));
  }, [budgets]);

  const budgetAllocationData = useMemo(() => {
    const total = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
    return budgets.map((b, idx) => ({
      name: b.category,
      value: b.monthlyLimit,
      percentage: total > 0 ? Math.round((b.monthlyLimit / total) * 100) : 0,
      color: b.color || BUDGET_PIE_COLORS[idx % BUDGET_PIE_COLORS.length]
    }));
  }, [budgets]);

  const openAddModal = () => {
    setCategory('Dining & Food');
    setLimit('10000');
    setThreshold('80');
    setShowAddModal(true);
  };

  const openEditModal = (b: NestBudget) => {
    setEditingBudget(b);
    setCategory(b.category);
    setLimit(b.monthlyLimit.toString());
    setThreshold(b.alertThreshold.toString());
  };

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!limit || isNaN(Number(limit))) return;

    const newBudgetItem: NestBudget = {
      id: `b_${Date.now()}`,
      category,
      monthlyLimit: Number(limit),
      currentSpent: 0,
      color: '#22c55e',
      iconName: 'Wallet',
      alertThreshold: Number(threshold)
    };

    onUpdateBudget([...budgets, newBudgetItem]);
    setShowAddModal(false);
  };

  const handleSaveEditedBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBudget || !limit || isNaN(Number(limit))) return;

    const updatedBudgets = budgets.map(b => {
      if (b.id === editingBudget.id) {
        return {
          ...b,
          category,
          monthlyLimit: Number(limit),
          alertThreshold: Number(threshold)
        };
      }
      return b;
    });

    onUpdateBudget(updatedBudgets);
    setEditingBudget(null);
  };

  const handleDeleteBudget = (id: string) => {
    onUpdateBudget(budgets.filter(b => b.id !== id));
  };

  const categories: ExpenseCategory[] = [
    'Groceries',
    'Rent & Utilities',
    'Dining & Food',
    'Transport',
    'Entertainment',
    'Healthcare',
    'Vacation & Travel',
    'Education',
    'Shopping',
    'Shared Vaults',
    'Income & Allowance'
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Wallet className="w-6 h-6 text-[#22c55e]" />
            Monthly Category Budgets & Limit Caps
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Proactive spending guardrails with automated pacing alerts to prevent group overspending.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#1ea34d] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto shadow-md shadow-[#22c55e]/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Create Budget Cap
        </button>
      </div>

      {/* Overview Stat Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Allocated Budget</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{group.currency}{totalMonthlyBudget.toLocaleString()}</div>
          <p className="text-xs text-slate-500 font-medium">Across {budgets.length} active expense categories</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Group Outflow (Month)</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{group.currency}{totalMonthlySpent.toLocaleString()}</div>
          <p className="text-xs text-[#22c55e] font-semibold">{group.currency}{(totalMonthlyBudget - totalMonthlySpent).toLocaleString()} available buffer</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Burn Utilization</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{overallBurnPercent}%</div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
            <div 
              className={cn("h-full rounded-full transition-all duration-300", overallBurnPercent > 90 ? "bg-rose-500" : "bg-[#22c55e]")}
              style={{ width: `${Math.min(100, overallBurnPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Budget Cap vs Actual Spent Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#22c55e]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Category Spending vs Monthly Budget Cap
              </h3>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" /> Budget Cap
              </span>
              <span className="flex items-center gap-1.5 text-[#22c55e]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" /> Actual Spent
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetComparisonData} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} vertical={false} />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-20} textAnchor="end" />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${group.currency}${val >= 1000 ? `${Math.round(val/1000)}k` : val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  formatter={(val: any, name: any) => [`${group.currency}${Number(val).toLocaleString()}`, name === 'allocated' ? 'Monthly Cap' : 'Actual Spent']}
                />
                <Bar dataKey="allocated" name="allocated" fill="#64748b" opacity={0.4} radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="spent" name="spent" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={32}>
                  {budgetComparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isOver ? '#f43f5e' : entry.burnRate >= 80 ? '#f59e0b' : '#22c55e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Allocation Share */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-[#22c55e]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Budget Allocation Share
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Proportions</span>
          </div>

          <div className="h-44 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetAllocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {budgetAllocationData.map((entry, index) => (
                    <Cell key={`budget-pie-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  formatter={(val: any) => [`${group.currency}${Number(val).toLocaleString()}`, 'Cap']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <Wallet className="w-5 h-5 text-slate-400 mb-0.5" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Caps</span>
            </div>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {budgetAllocationData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs py-0.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">{group.currency}{item.value.toLocaleString()}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const percent = Math.min(100, Math.round((budget.currentSpent / (budget.monthlyLimit || 1)) * 100));
          const isNearThreshold = percent >= budget.alertThreshold;
          const isOverBudget = budget.currentSpent > budget.monthlyLimit;

          return (
            <div
              key={budget.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative overflow-hidden group hover:border-[#22c55e]/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: budget.color }} />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{budget.category}</h3>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(budget)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-[#22c55e] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-all"
                    title="Edit budget cap"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBudget(budget.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-all"
                    title="Remove budget cap"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {group.currency}{budget.currentSpent.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    of {group.currency}{budget.monthlyLimit.toLocaleString()}
                  </span>
                </div>

                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      isOverBudget ? "bg-rose-500" : isNearThreshold ? "bg-amber-500" : "bg-[#22c55e]"
                    )}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className={cn(
                  "font-bold flex items-center gap-1",
                  isOverBudget ? "text-rose-500" : isNearThreshold ? "text-amber-500" : "text-emerald-500"
                )}>
                  {isOverBudget ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" /> Over limit ({group.currency}{(budget.currentSpent - budget.monthlyLimit).toLocaleString()})
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> {100 - percent}% left
                    </>
                  )}
                </span>
                <span className="text-slate-400 font-medium">Alerts at {budget.alertThreshold}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Budget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Create Category Budget</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Expense Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Monthly Spending Cap ({group.currency})</label>
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Alert Trigger Threshold (%)</label>
                <input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  placeholder="e.g. 80"
                  min="50"
                  max="100"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#22c55e] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1ea34d] transition-all"
                >
                  Save Budget Cap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Budget Modal */}
      {editingBudget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#22c55e]" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Edit Budget Cap</h2>
              </div>
              <button
                onClick={() => setEditingBudget(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditedBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Expense Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Monthly Spending Cap ({group.currency})</label>
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Alert Trigger Threshold (%)</label>
                <input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  placeholder="e.g. 80"
                  min="50"
                  max="100"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingBudget(null)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#22c55e] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1ea34d] transition-all shadow-md shadow-[#22c55e]/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
