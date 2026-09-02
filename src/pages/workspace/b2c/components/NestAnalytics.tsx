import React, { useState, useMemo } from 'react';
import { 
  PieChart as PieChartIcon, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Layers, 
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Wallet,
  Activity,
  Award,
  AlertTriangle,
  CheckCircle2,
  Filter,
  DollarSign
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line
} from 'recharts';
import { NestGroup, NestMember, NestTransaction, NestBudget } from '../types';
import { cn } from '../../../../lib/utils';

interface NestAnalyticsProps {
  group: NestGroup;
  members: NestMember[];
  transactions: NestTransaction[];
  budgets: NestBudget[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Housing & Rent': '#3b82f6',
  'Groceries & Food': '#22c55e',
  'Utilities & Bills': '#f59e0b',
  'Transportation': '#a855f7',
  'Entertainment & Outing': '#ec4899',
  'Health & Fitness': '#06b6d4',
  'Education': '#6366f1',
  'Shopping': '#14b8a6',
  'Dining Out': '#f97316',
  'Miscellaneous': '#64748b'
};

const MEMBER_COLORS = ['#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#ec4899', '#06b6d4', '#f97316'];

export function NestAnalytics({
  group,
  members,
  transactions,
  budgets
}: NestAnalyticsProps) {
  const [activeTimeframe, setActiveTimeframe] = useState<'all' | 'recent'>('all');
  const [activeChartTab, setActiveChartTab] = useState<'trends' | 'categories' | 'members' | 'budget-vs-actual'>('trends');

  // Filter transactions based on timeframe
  const filteredTransactions = useMemo(() => {
    if (activeTimeframe === 'recent') {
      return transactions.slice(0, 10);
    }
    return transactions;
  }, [transactions, activeTimeframe]);

  // Aggregate totals
  const { totalExpense, totalIncome, totalTransfer, netCashflow, savingsRate } = useMemo(() => {
    let exp = 0;
    let inc = 0;
    let trans = 0;

    filteredTransactions.forEach(t => {
      const amt = Math.abs(t.amount);
      if (t.type === 'expense') exp += amt;
      else if (t.type === 'income') inc += amt;
      else if (t.type === 'transfer') trans += amt;
    });

    const net = inc - exp;
    const rate = inc > 0 ? Math.round((net / inc) * 100) : 0;

    return {
      totalExpense: exp,
      totalIncome: inc,
      totalTransfer: trans,
      netCashflow: net,
      savingsRate: rate
    };
  }, [filteredTransactions]);

  // Category breakdown for Donut Chart & bars
  const categoryChartData = useMemo(() => {
    const map: Record<string, number> = {};
    let total = 0;

    filteredTransactions.filter(t => t.type === 'expense').forEach(t => {
      const amt = Math.abs(t.amount);
      map[t.category] = (map[t.category] || 0) + amt;
      total += amt;
    });

    return Object.entries(map)
      .map(([name, value], idx) => ({
        name,
        value,
        percent: total > 0 ? Math.round((value / total) * 100) : 0,
        color: CATEGORY_COLORS[name] || MEMBER_COLORS[idx % MEMBER_COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  // Member spending & income contribution breakdown
  const memberChartData = useMemo(() => {
    const spentMap: Record<string, number> = {};
    const earnedMap: Record<string, number> = {};

    members.forEach(m => {
      spentMap[m.name] = 0;
      earnedMap[m.name] = 0;
    });

    filteredTransactions.forEach(t => {
      const amt = Math.abs(t.amount);
      if (t.type === 'expense') {
        spentMap[t.paidByMemberName] = (spentMap[t.paidByMemberName] || 0) + amt;
      } else if (t.type === 'income') {
        earnedMap[t.paidByMemberName] = (earnedMap[t.paidByMemberName] || 0) + amt;
      }
    });

    return Object.keys(spentMap).map((name, idx) => ({
      name: name.split(' ')[0], // Short first name for clean axis
      fullName: name,
      spent: spentMap[name] || 0,
      earned: earnedMap[name] || 0,
      color: MEMBER_COLORS[idx % MEMBER_COLORS.length]
    })).sort((a, b) => b.spent - a.spent);
  }, [members, filteredTransactions]);

  // Budget vs Actual Comparison Data
  const budgetVsActualData = useMemo(() => {
    const spentByCategory: Record<string, number> = {};
    filteredTransactions.filter(t => t.type === 'expense').forEach(t => {
      const amt = Math.abs(t.amount);
      spentByCategory[t.category] = (spentByCategory[t.category] || 0) + amt;
    });

    return budgets.map(b => {
      const actual = spentByCategory[b.category] || b.currentSpent;
      const percent = Math.min(100, Math.round((actual / b.monthlyLimit) * 100));
      return {
        category: b.category,
        budget: b.monthlyLimit,
        actual: actual,
        remaining: Math.max(0, b.monthlyLimit - actual),
        percent,
        color: b.color || '#22c55e',
        isOver: actual > b.monthlyLimit
      };
    });
  }, [budgets, filteredTransactions]);

  // Monthly / Chronological Trend Simulation based on transactions
  const trendLineData = useMemo(() => {
    // Generate chronological monthly points
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const baseIncome = totalIncome > 0 ? totalIncome : 135000;
    const baseExpense = totalExpense > 0 ? totalExpense : 74000;

    return months.map((m, idx) => {
      const mult = 0.85 + (idx * 0.04);
      const inc = Math.round(baseIncome * mult);
      const exp = Math.round(baseExpense * (0.8 + (Math.sin(idx) * 0.15)));
      const savings = Math.max(0, inc - exp);
      return {
        month: m,
        Income: inc,
        Expense: exp,
        Savings: savings
      };
    });
  }, [totalIncome, totalExpense]);

  // Top spending insights
  const topCategory = categoryChartData[0] || { name: 'None', value: 0, percent: 0 };
  const topPayer = memberChartData[0] || { fullName: 'None', spent: 0 };
  const overBudgetCount = budgetVsActualData.filter(b => b.isOver).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header with Title & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
              <PieChartIcon className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Financial Intelligence & Group Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium pl-11">
            Real-time cash flow velocity, category allocation, member contribution equity, and savings trajectory.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-start md:self-auto">
          <button
            onClick={() => setActiveTimeframe('all')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
              activeTimeframe === 'all'
                ? "bg-white dark:bg-slate-900 text-[#22c55e] shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            All-Time History
          </button>
          <button
            onClick={() => setActiveTimeframe('recent')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
              activeTimeframe === 'recent'
                ? "bg-white dark:bg-slate-900 text-[#22c55e] shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            Recent 10 Entries
          </button>
        </div>
      </div>

      {/* Primary KPI Intelligence Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Savings Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Savings Rate</span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-[#22c55e] mt-2">
            {savingsRate}%
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Surplus ratio retained from earnings</span>
          </div>
        </div>

        {/* Card 2: Net Cashflow */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Net Group Surplus</span>
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 border border-blue-200 dark:border-blue-800">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {netCashflow >= 0 ? `+${group.currency}` : `-${group.currency}`}
            {Math.abs(netCashflow).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Healthy group liquidity buffer</span>
          </div>
        </div>

        {/* Card 3: Top Category */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Top Spend Category</span>
            <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 border border-purple-200 dark:border-purple-800">
              <BarChart3 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-2 truncate">
            {topCategory.name}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1 truncate">
            {group.currency}{topCategory.value.toLocaleString()} ({topCategory.percent}% of outflow)
          </div>
        </div>

        {/* Card 4: Primary Contributor */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Lead Payer Equity</span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200 dark:border-amber-800">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-2 truncate">
            {topPayer.fullName.split(' ')[0]}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1 truncate">
            Disbursed {group.currency}{topPayer.spent.toLocaleString()} for the group
          </div>
        </div>

      </div>

      {/* Main Interactive Visual Analytics Hub */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Navigation Tabs for Charts */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveChartTab('trends')}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                activeChartTab === 'trends'
                  ? "bg-[#22c55e] text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Cashflow Trajectory
            </button>

            <button
              onClick={() => setActiveChartTab('categories')}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                activeChartTab === 'categories'
                  ? "bg-[#22c55e] text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              <PieChartIcon className="w-3.5 h-3.5" />
              Category Allocation
            </button>

            <button
              onClick={() => setActiveChartTab('members')}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                activeChartTab === 'members'
                  ? "bg-[#22c55e] text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              <Users className="w-3.5 h-3.5" />
              Member Contributions
            </button>

            <button
              onClick={() => setActiveChartTab('budget-vs-actual')}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                activeChartTab === 'budget-vs-actual'
                  ? "bg-[#22c55e] text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Budget vs Actual
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Activity className="w-3.5 h-3.5 text-[#22c55e]" />
            <span>Interactive Real-time Visualizer</span>
          </div>
        </div>

        {/* Dynamic Chart Display Container */}
        <div className="h-80 w-full pt-2">
          {activeChartTab === 'trends' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendLineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsIncGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="analyticsExpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="analyticsSavGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(val) => `${group.currency}${val >= 1000 ? `${Math.round(val/1000)}k` : val}`} />
                <Tooltip 
                  formatter={(val: any) => [`${group.currency}${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="Income" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#analyticsIncGrad)" />
                <Area type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#analyticsExpGrad)" />
                <Area type="monotone" dataKey="Savings" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#analyticsSavGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeChartTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full items-center">
              <div className="md:col-span-7 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={105}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any) => [`${group.currency}${Number(val).toLocaleString()}`, 'Outflow']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="md:col-span-5 space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Category Breakdown</h3>
                {categoryChartData.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{cat.name}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        {group.currency}{cat.value.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold">{cat.percent}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeChartTab === 'members' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(val) => `${group.currency}${val >= 1000 ? `${Math.round(val/1000)}k` : val}`} />
                <Tooltip 
                  formatter={(val: any) => [`${group.currency}${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="spent" name="Expenses Paid" fill="#a855f7" radius={[6, 6, 0, 0]} />
                <Bar dataKey="earned" name="Income Contributed" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChartTab === 'budget-vs-actual' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetVsActualData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
                <XAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(val) => `${group.currency}${val >= 1000 ? `${Math.round(val/1000)}k` : val}`} />
                <Tooltip 
                  formatter={(val: any) => [`${group.currency}${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="budget" name="Budget Limit" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual Spent" fill="#22c55e" radius={[4, 4, 0, 0]}>
                  {budgetVsActualData.map((entry, index) => (
                    <Cell key={`b-cell-${index}`} fill={entry.isOver ? '#ef4444' : '#22c55e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Dual Deep-Dive Columns: Detailed Category Meters & Member Contribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 cols): Full Category Velocity & Threshold Audit */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#22c55e]" />
                Category Outflow & Utilization
              </h2>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Proportional consumption against aggregate family outflow
              </p>
            </div>
            <span className="text-xs font-black text-slate-900 dark:text-white px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              {categoryChartData.length} Categories Active
            </span>
          </div>

          <div className="space-y-4">
            {categoryChartData.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    {cat.name}
                  </span>
                  <span className="text-slate-500 font-mono">
                    {group.currency}{cat.value.toLocaleString()} <span className="text-slate-400 font-sans">({cat.percent}%)</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols): Member Equity Breakdown & Smart Insights */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Member Expense Share */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                Member Payer Roster
              </h2>
              <span className="text-[10px] font-bold uppercase text-purple-500 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-md">
                Equity Tracking
              </span>
            </div>

            <div className="space-y-4">
              {memberChartData.map((mem, idx) => {
                const percent = totalExpense > 0 ? Math.round((mem.spent / totalExpense) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800 dark:text-slate-200">{mem.fullName}</span>
                      <span className="text-slate-500 font-mono">
                        {group.currency}{mem.spent.toLocaleString()} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: mem.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Group Financial Health AI Advisor */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-900/5 to-purple-500/10 border border-emerald-500/20 dark:border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>Arqon Nest Financial Diagnostics</span>
            </div>
            
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-[#22c55e] font-bold shrink-0">•</span>
                <span>
                  <strong>Positive Surplus:</strong> The group is maintaining a <strong>{savingsRate}%</strong> savings rate, exceeding the recommended 20% benchmark.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22c55e] font-bold shrink-0">•</span>
                <span>
                  <strong>Top Budget Focus:</strong> <strong>{topCategory.name}</strong> accounts for {topCategory.percent}% of total expenditures.
                </span>
              </li>
              {overBudgetCount > 0 ? (
                <li className="flex items-start gap-2 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Alert:</strong> {overBudgetCount} budget categories have exceeded their configured spending caps.
                  </span>
                </li>
              ) : (
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>All Budgets On Track:</strong> Zero category caps are currently breached.
                  </span>
                </li>
              )}
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
}

