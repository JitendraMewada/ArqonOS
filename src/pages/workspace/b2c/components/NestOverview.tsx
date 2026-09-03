import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target, 
  Receipt, 
  Users, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronRight,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Bell,
  Clock,
  CheckSquare,
  Check,
  PiggyBank,
  AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import { 
  NestGroup, 
  NestMember, 
  NestTransaction, 
  NestBudget, 
  NestSavingsGoal,
  NestReminderItem,
  NestReconciliationRecord,
  NestMemberNudge
} from '../types';
import { cn } from '../../../../lib/utils';
import { Scale, CheckCheck, RefreshCw, Send, ShieldAlert, Sparkle } from 'lucide-react';

interface NestOverviewProps {
  group: NestGroup;
  members: NestMember[];
  transactions: NestTransaction[];
  budgets: NestBudget[];
  savings: NestSavingsGoal[];
  reminders?: NestReminderItem[];
  reconciliationHistory?: NestReconciliationRecord[];
  nudges?: NestMemberNudge[];
  onToggleCompleteReminder?: (id: string) => void;
  onAddTransaction: () => void;
  onNavigateTab: (tabId: string) => void;
  onOpenReconciliation?: () => void;
  onOpenNudgeCenter?: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Groceries': '#22c55e',
  'Rent & Utilities': '#3b82f6',
  'Dining & Food': '#f59e0b',
  'Entertainment': '#ec4899',
  'Healthcare': '#06b6d4',
  'Education': '#8b5cf6',
  'Shared Vaults': '#10b981',
  'Shopping': '#6366f1',
  'Travel': '#14b8a6',
  'Other': '#94a3b8'
};

export function NestOverview({
  group,
  members,
  transactions,
  budgets,
  savings,
  reminders = [],
  reconciliationHistory = [],
  nudges = [],
  onToggleCompleteReminder,
  onAddTransaction,
  onNavigateTab,
  onOpenReconciliation,
  onOpenNudgeCenter
}: NestOverviewProps) {
  const [chartView, setChartView] = useState<'cashflow' | 'budget_compare'>('cashflow');

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Compute unacknowledged nudges
  const pendingNudgesCount = useMemo(() => {
    return nudges.filter(n => !n.isAcknowledged).length;
  }, [nudges]);

  // Last reconciliation summary
  const latestReconciliation = useMemo(() => {
    if (!reconciliationHistory || reconciliationHistory.length === 0) return null;
    return reconciliationHistory[0];
  }, [reconciliationHistory]);

  // Upcoming Checklist & Reminders processing
  const topUpcomingReminders = useMemo(() => {
    return reminders
      .filter(r => r.status !== 'completed')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 4);
  }, [reminders]);

  const urgentCount = useMemo(() => {
    return reminders.filter(r => {
      if (r.status === 'completed') return false;
      const today = new Date(todayStr);
      const target = new Date(r.dueDate);
      const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 0 || r.priority === 'urgent';
    }).length;
  }, [reminders, todayStr]);

  const getRelativeDayBadge = (dueDateStr: string) => {
    const today = new Date(todayStr);
    const target = new Date(dueDateStr);
    const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue ${Math.abs(diffDays)}d`, cls: 'bg-rose-500/10 text-rose-500 border-rose-500/20' };
    } else if (diffDays === 0) {
      return { text: 'Due Today', cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20 font-black animate-pulse' };
    } else if (diffDays === 1) {
      return { text: 'Tomorrow', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
    } else {
      return { text: `In ${diffDays}d`, cls: 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700' };
    }
  };

  // Financial computations
  const totalIncomeThisMonth = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalExpenseThisMonth = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netSavingsRate = totalIncomeThisMonth > 0 
    ? Math.round(((totalIncomeThisMonth - totalExpenseThisMonth) / totalIncomeThisMonth) * 100) 
    : 0;

  const totalMonthlyBudgetLimit = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  const totalSpentInBudgets = budgets.reduce((sum, b) => sum + b.currentSpent, 0);
  const budgetUtilizationPercent = Math.min(100, Math.round((totalSpentInBudgets / (totalMonthlyBudgetLimit || 1)) * 100));

  const totalSavedSoFar = savings.reduce((sum, s) => sum + s.currentAmount, 0);
  const totalSavingsTarget = savings.reduce((sum, s) => sum + s.targetAmount, 0);

  const recentTransactions = transactions.slice(0, 5);

  // Category expense aggregation for Donut Chart
  const categoryChartData = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
      });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || '#94a3b8'
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Daily / Weekly Timeline Data for Area Chart
  const timelineCashflowData = useMemo(() => {
    // Generate dates from transactions or past 7 milestones
    const dailyMap: Record<string, { date: string; income: number; expense: number; net: number }> = {};
    
    // Seed standard days
    const days = ['Aug 03', 'Aug 08', 'Aug 10', 'Aug 15', 'Aug 18', 'Aug 22', 'Aug 25', 'Aug 28', 'Aug 30'];
    days.forEach(d => {
      dailyMap[d] = { date: d, income: 0, expense: 0, net: 0 };
    });

    transactions.forEach(t => {
      // Map date format YYYY-MM-DD to MMM DD
      const parts = t.date.split('-');
      if (parts.length === 3) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const mIndex = parseInt(parts[1], 10) - 1;
        const key = `${monthNames[mIndex]} ${parts[2]}`;
        
        if (!dailyMap[key]) {
          dailyMap[key] = { date: key, income: 0, expense: 0, net: 0 };
        }

        if (t.type === 'income') {
          dailyMap[key].income += Math.abs(t.amount);
        } else if (t.type === 'expense') {
          dailyMap[key].expense += Math.abs(t.amount);
        }
      }
    });

    return Object.values(dailyMap)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(item => ({
        ...item,
        net: item.income - item.expense
      }));
  }, [transactions]);

  // Budget vs Spent Bar Chart Data
  const budgetBarData = useMemo(() => {
    return budgets.map(b => ({
      category: b.category,
      Limit: b.monthlyLimit,
      Spent: b.currentSpent,
      Remaining: Math.max(0, b.monthlyLimit - b.currentSpent),
      color: b.color
    }));
  }, [budgets]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 dark:from-slate-900 dark:to-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#22c55e]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#22c55e]/20 text-[#22c55e] text-[10px] font-black uppercase tracking-widest mb-3 border border-[#22c55e]/30">
              <Sparkles className="w-3.5 h-3.5" />
              {group.type} Workspace Active
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {group.name}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-xl font-medium">
              Real-time collaborative financial ledger. {members.length} members sharing budgets, group savings, and instant bill splits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenReconciliation?.()}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs uppercase tracking-wider border border-slate-700 hover:border-emerald-500/40 transition-colors flex items-center gap-2 shadow-sm"
              title="Audit & Match Ledger with Bank Statement"
            >
              <Scale className="w-4 h-4 text-[#22c55e]" />
              Audit / Bank Match
            </button>
            <button
              onClick={() => onAddTransaction()}
              className="px-5 py-3 rounded-xl bg-[#22c55e] hover:bg-[#1ea34d] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#22c55e]/20 hover:-translate-y-0.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Log Expense
            </button>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700 hover:border-slate-600 transition-colors"
            >
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Monthly Income */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Group Inflow</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {group.currency}{totalIncomeThisMonth.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Across {members.length} members
            </div>
          </div>
        </div>

        {/* Total Monthly Expenses */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Group Outflow</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {group.currency}{totalExpenseThisMonth.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Net balance: <strong className="text-slate-700 dark:text-slate-300">+{group.currency}{(totalIncomeThisMonth - totalExpenseThisMonth).toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Monthly Budget Consumption */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Budget Pacing</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {budgetUtilizationPercent}%
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all duration-500", budgetUtilizationPercent > 90 ? "bg-rose-500" : "bg-[#22c55e]")}
                style={{ width: `${budgetUtilizationPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-1.5 flex justify-between">
              <span>{group.currency}{totalSpentInBudgets.toLocaleString()} spent</span>
              <span>Limit: {group.currency}{totalMonthlyBudgetLimit.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Group Savings Achieved */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Savings Vaults</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {group.currency}{totalSavedSoFar.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#22c55e] font-semibold mt-1">
              {Math.round((totalSavedSoFar / (totalSavingsTarget || 1)) * 100)}% of goal targets funded
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Visualizer Row: Cashflow Trends & Expense Breakdown Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Cash Flow / Budget Chart (8 cols) */}
        <div className="lg:col-span-8 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#22c55e]" />
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Cash Flow Velocity & Dynamics
                </h2>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Group inflows, outflows, and net liquidity progression
              </p>
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setChartView('cashflow')}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-bold transition-all",
                  chartView === 'cashflow'
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                Inflow vs Outflow
              </button>
              <button
                onClick={() => setChartView('budget_compare')}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-bold transition-all",
                  chartView === 'budget_compare'
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                Budget Utilization
              </button>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="w-full h-72 min-h-[288px] min-w-0">
            {chartView === 'cashflow' ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineCashflowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11, fill: '#94a3b8' }} 
                    axisLine={{ stroke: '#334155', opacity: 0.3 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#94a3b8' }} 
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs space-y-1.5">
                            <p className="font-bold text-slate-300">{label}</p>
                            {payload.map((entry: any, index: number) => (
                              <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                                <span className="flex items-center gap-1.5 capitalize text-slate-400">
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                  {entry.name}:
                                </span>
                                <span className="font-black text-white">
                                  {group.currency}{Math.abs(entry.value).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    name="Inflow"
                    stroke="#22c55e" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorIncome)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expense" 
                    name="Outflow"
                    stroke="#f43f5e" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorExpense)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 10, fill: '#94a3b8' }} 
                    axisLine={{ stroke: '#334155', opacity: 0.3 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#94a3b8' }} 
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs space-y-1.5">
                            <p className="font-bold text-slate-300">{label}</p>
                            {payload.map((entry: any, index: number) => (
                              <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                                <span className="flex items-center gap-1.5 text-slate-400">
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                  {entry.name}:
                                </span>
                                <span className="font-black text-white">
                                  {group.currency}{Number(entry.value).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="Spent" name="Current Spent" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Limit" name="Budget Cap" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.3} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Expense Category Donut Breakdown (4 cols) */}
        <div className="lg:col-span-4 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-purple-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Spending Allocation
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              By Category
            </span>
          </div>

          <div className="w-full h-44 min-h-[176px] relative min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-xs shadow-lg border border-slate-800 font-bold">
                          {data.name}: {group.currency}{Number(data.value).toLocaleString()}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Spent</span>
              <span className="text-xs font-black text-slate-900 dark:text-white">
                {group.currency}{(totalExpenseThisMonth / 1000).toFixed(1)}k
              </span>
            </div>
          </div>

          {/* Category Mini Legend List */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 max-h-36 overflow-y-auto custom-scrollbar">
            {categoryChartData.slice(0, 4).map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="truncate">{cat.name}</span>
                </span>
                <span className="font-mono text-slate-900 dark:text-white shrink-0">
                  {group.currency}{cat.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Safety Net: Audit, Bank Reconciliation & Missed Entries Protection */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 dark:from-slate-900 dark:to-slate-950 p-5 rounded-2xl border border-emerald-500/20 shadow-md text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#22c55e]/20 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e] shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-black uppercase tracking-wider text-white">
                  Balance Audit & Safety Net
                </h2>
                {latestReconciliation ? (
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border",
                    latestReconciliation.status === 'matched' 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  )}>
                    {latestReconciliation.status === 'matched' ? '✓ 100% Balanced' : '⚠️ Adjusted with Discrepancy Cushion'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    Ready for First Audit
                  </span>
                )}
                {pendingNudgesCount > 0 && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse flex items-center gap-1">
                    <Send className="w-2.5 h-2.5" />
                    {pendingNudgesCount} Member Nudge Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {latestReconciliation 
                  ? `Last verified on ${new Date(latestReconciliation.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} by ${latestReconciliation.reconciledByMemberName.split(' ')[0]}. Prevents unlogged cash receipts from skewing your family budget.`
                  : 'Compare your real bank account or UPI balance against the Arqon Nest ledger to automatically catch missed expenses, unlogged incomes, and forgotten deposits.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto shrink-0">
            {onOpenNudgeCenter && (
              <button
                onClick={() => onOpenNudgeCenter()}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5 text-purple-400" />
                <span>Nudge Members</span>
              </button>
            )}
            {onOpenReconciliation && (
              <button
                onClick={() => onOpenReconciliation()}
                className="px-4 py-2 rounded-xl bg-[#22c55e] hover:bg-[#1ea34d] text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#22c55e]/20 hover:-translate-y-0.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Run Reconciliation Audit</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Financial Checklist & Active Dues Alert Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 text-[#22c55e] flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Upcoming Financial Checklist & Dues
                </h2>
                {urgentCount > 0 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse">
                    {urgentCount} Action Needed
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Synchronized schedule for pending bills, expected paydays, and savings transfers.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => onNavigateTab('reminders')}
            className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5 text-[#22c55e]" />
            <span>Open Reminders & Tasks</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Responsive Checklist Items Grid */}
        {topUpcomingReminders.length === 0 ? (
          <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <CheckCircle2 className="w-8 h-8 text-[#22c55e] mx-auto mb-1.5 opacity-80" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">All caught up!</p>
            <p className="text-[11px] text-slate-400">No pending expenses, incomes, or savings tasks in your immediate queue.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {topUpcomingReminders.map((item) => {
              const badge = getRelativeDayBadge(item.dueDate);
              return (
                <div 
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/80 transition-all flex flex-col justify-between group shadow-sm hover:shadow"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() => onToggleCompleteReminder?.(item.id)}
                        className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 hover:border-[#22c55e] hover:bg-[#22c55e]/10 flex items-center justify-center transition-colors shrink-0 mt-0.5 text-transparent hover:text-[#22c55e]"
                        title="Mark as completed"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>

                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border tracking-tight shrink-0",
                        badge.cls
                      )}>
                        {badge.text}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#22c55e] transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <span className={cn(
                          "font-semibold",
                          item.type === 'expense_bill' ? 'text-amber-500' :
                          item.type === 'income_due' ? 'text-emerald-500' :
                          (item.type === 'savings_deposit' || item.type === 'vault_allocation') ? 'text-purple-500' : 'text-slate-400'
                        )}>
                          {item.type === 'expense_bill' ? 'EXPENSE' :
                           item.type === 'income_due' ? 'INFLOW' :
                           (item.type === 'savings_deposit' || item.type === 'vault_allocation') ? 'SAVING' : 'TASK'}
                        </span>
                        <span>•</span>
                        <span className="truncate">{item.category || 'General'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 mt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium truncate max-w-[80px]">
                      {item.assignedMemberName?.split(' ')[0] || 'Group'}
                    </span>
                    <span className="text-xs font-black font-mono text-slate-900 dark:text-white">
                      {item.amount ? `${group.currency}${item.amount.toLocaleString()}` : '—'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two Column Grid: Recent Feed & Budget Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 cols): Recent Transactions Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#22c55e]" />
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Live Transaction Activity
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigateTab('timeline')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
              >
                Timeline View
              </button>
              <button
                onClick={() => onNavigateTab('expenses')}
                className="text-xs font-bold text-[#22c55e] hover:underline flex items-center gap-1"
              >
                Full Ledger <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={cn(
                    "w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold border",
                    tx.type === 'income' 
                      ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border-emerald-200 dark:border-emerald-900"
                      : tx.type === 'transfer'
                      ? "bg-purple-50 dark:bg-purple-950/50 text-purple-600 border-purple-200 dark:border-purple-900"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                  )}>
                    {tx.type === 'income' ? <ArrowDownRight className="w-5 h-5" /> : <Receipt className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {tx.title}
                    </h3>
                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-2 mt-0.5">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">{tx.category}</span>
                      <span>•</span>
                      <span>Paid by {tx.paidByMemberName.split(' ')[0]}</span>
                      <span>•</span>
                      <span>{tx.date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={cn(
                    "text-sm font-black tracking-tight",
                    tx.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"
                  )}>
                    {tx.amount > 0 ? `+${group.currency}${Math.abs(tx.amount).toLocaleString()}` : `-${group.currency}${Math.abs(tx.amount).toLocaleString()}`}
                  </div>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 mt-0.5">
                    {tx.splitType} split
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols): Active Budgets Status & Member Circles */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Category Budget Bars */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-sky-500" />
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Top Category Budgets
                </h2>
              </div>
              <button
                onClick={() => onNavigateTab('budgets')}
                className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
              {budgets.slice(0, 4).map((b) => {
                const percent = Math.min(100, Math.round((b.currentSpent / b.monthlyLimit) * 100));
                const isNearCap = percent >= b.alertThreshold;

                return (
                  <div key={b.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
                        {b.category}
                      </span>
                      <span className="text-slate-500">
                        {group.currency}{b.currentSpent.toLocaleString()} / {group.currency}{b.monthlyLimit.toLocaleString()}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-300", isNearCap ? "bg-amber-500" : "bg-[#22c55e]")}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Group Members Quick Roster */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Active Group Circle ({members.length}/3 Included)
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('family')}
                className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {members.map((m) => (
                <div key={m.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                  <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{m.name.split(' ')[0]}</div>
                    <div className="text-[9px] text-slate-400 font-semibold uppercase">{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
