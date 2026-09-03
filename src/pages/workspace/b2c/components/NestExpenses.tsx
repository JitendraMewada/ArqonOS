import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  PlusCircle, 
  Search, 
  Filter, 
  ArrowDownRight, 
  ArrowUpRight, 
  Trash2, 
  Edit2,
  Split, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Users,
  Layers,
  ChevronDown,
  Download,
  Repeat,
  Zap,
  Play,
  Pause,
  AlertCircle,
  Sparkles,
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  Scale,
  RefreshCw
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
  Legend 
} from 'recharts';
import { NestGroup, NestMember, NestTransaction, ExpenseCategory, NestRecurringRule } from '../types';
import { cn } from '../../../../lib/utils';

const MEMBER_CHART_COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ec4899', '#06b6d4', '#14b8a6'];

interface NestExpensesProps {
  group: NestGroup;
  members: NestMember[];
  transactions: NestTransaction[];
  recurringRules: NestRecurringRule[];
  onAddTransaction: () => void;
  onEditTransaction: (transaction: NestTransaction) => void;
  onDeleteTransaction: (id: string) => void;
  onAddRecurringRule: () => void;
  onEditRecurringRule: (rule: NestRecurringRule) => void;
  onDeleteRecurringRule: (id: string) => void;
  onToggleRecurringActive: (id: string) => void;
  onExecuteRecurringRule: (rule: NestRecurringRule) => void;
  onExecuteAllDueRecurring: () => void;
  onOpenReconciliation?: () => void;
}

export function NestExpenses({
  group,
  members,
  transactions,
  recurringRules,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onAddRecurringRule,
  onEditRecurringRule,
  onDeleteRecurringRule,
  onToggleRecurringActive,
  onExecuteRecurringRule,
  onExecuteAllDueRecurring,
  onOpenReconciliation
}: NestExpensesProps) {
  const [activeSubTab, setActiveSubTab] = useState<'ledger' | 'recurring'>('ledger');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<string>('all');

  // Split bill settlement matrix calculation
  // Computes who owes whom across all transactions
  const settlements = useMemo(() => {
    const balances: Record<string, number> = {};
    members.forEach(m => { balances[m.id] = 0; });

    transactions.filter(t => t.type === 'expense').forEach(t => {
      const paidBy = t.paidByMemberId;
      const splitWith = t.splitWithMemberIds && t.splitWithMemberIds.length > 0 ? t.splitWithMemberIds : members.map(m => m.id);
      const splitAmount = Math.abs(t.amount) / splitWith.length;

      // Paid by gets positive credit for what others owe
      if (balances[paidBy] !== undefined) {
        balances[paidBy] += Math.abs(t.amount);
      }

      // Each split member owes their share
      splitWith.forEach(mId => {
        if (balances[mId] !== undefined) {
          balances[mId] -= splitAmount;
        }
      });
    });

    return members.map(m => ({
      member: m,
      netBalance: Math.round(balances[m.id] || 0)
    }));
  }, [transactions, members]);

  // Recurring Financial Computations
  const totalMonthlyRecurringExpense = useMemo(() => {
    return recurringRules
      .filter(r => r.isActive && r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);
  }, [recurringRules]);

  const totalMonthlyRecurringIncome = useMemo(() => {
    return recurringRules
      .filter(r => r.isActive && r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);
  }, [recurringRules]);

  // Chart memoizations for interactive analytics
  const timelineData = useMemo(() => {
    const dateMap: Record<string, { date: string; displayDate: string; expense: number; income: number }> = {};
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sorted.forEach(t => {
      const dateKey = t.date;
      if (!dateMap[dateKey]) {
        const d = new Date(t.date);
        const display = isNaN(d.getTime()) ? t.date : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dateMap[dateKey] = { date: dateKey, displayDate: display, expense: 0, income: 0 };
      }
      if (t.type === 'expense') {
        dateMap[dateKey].expense += Math.abs(t.amount);
      } else if (t.type === 'income') {
        dateMap[dateKey].income += Math.abs(t.amount);
      }
    });

    const result = Object.values(dateMap);
    return result.length > 0 ? result : [
      { date: '2026-08-01', displayDate: 'Aug 1', expense: 12000, income: 50000 },
      { date: '2026-08-15', displayDate: 'Aug 15', expense: 18500, income: 0 },
      { date: '2026-08-30', displayDate: 'Aug 30', expense: 9400, income: 15000 }
    ];
  }, [transactions]);

  const payerSpendData = useMemo(() => {
    const map: Record<string, number> = {};
    members.forEach(m => { map[m.name] = 0; });
    
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const name = t.paidByMemberName || 'Group';
      map[name] = (map[name] || 0) + Math.abs(t.amount);
    });

    const totalExpense = Object.values(map).reduce((sum, v) => sum + v, 0);

    return Object.entries(map)
      .map(([name, amount], index) => ({
        name: name.split(' ')[0],
        fullName: name,
        amount,
        percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
        color: MEMBER_CHART_COLORS[index % MEMBER_CHART_COLORS.length]
      }))
      .filter(item => item.amount > 0);
  }, [transactions, members]);

  const recurringCalendarData = useMemo(() => {
    const buckets = [
      { period: 'Days 1-7 (Week 1)', expense: 0, income: 0, count: 0 },
      { period: 'Days 8-14 (Week 2)', expense: 0, income: 0, count: 0 },
      { period: 'Days 15-21 (Week 3)', expense: 0, income: 0, count: 0 },
      { period: 'Days 22-31 (Month-End)', expense: 0, income: 0, count: 0 },
    ];

    recurringRules.filter(r => r.isActive).forEach(r => {
      const day = r.dayOfMonth || 1;
      let bucketIdx = 0;
      if (day > 21) bucketIdx = 3;
      else if (day > 14) bucketIdx = 2;
      else if (day > 7) bucketIdx = 1;

      if (r.type === 'income') {
        buckets[bucketIdx].income += r.amount;
      } else {
        buckets[bucketIdx].expense += r.amount;
      }
      buckets[bucketIdx].count += 1;
    });

    return buckets;
  }, [recurringRules]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.paidByMemberName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCat = selectedCategory === 'all' || t.category === selectedCategory;
      const matchType = selectedType === 'all' || t.type === selectedType;
      const matchMember = selectedMember === 'all' || t.paidByMemberId === selectedMember;

      return matchSearch && matchCat && matchType && matchMember;
    });
  }, [transactions, searchQuery, selectedCategory, selectedType, selectedMember]);

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
      
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-[#22c55e]" />
            Expenses & Transaction Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Multi-payer expense tracking, automated bill splits, and recurring standing orders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Sub-tab navigation */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveSubTab('ledger')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                activeSubTab === 'ledger'
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Receipt className="w-3.5 h-3.5" />
              All Transactions ({transactions.length})
            </button>
            <button
              onClick={() => setActiveSubTab('recurring')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                activeSubTab === 'recurring'
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Repeat className="w-3.5 h-3.5 text-[#22c55e]" />
              Recurring Schedules ({recurringRules.length})
            </button>
          </div>

          {activeSubTab === 'ledger' ? (
            <div className="flex items-center gap-2">
              {onOpenReconciliation && (
                <button
                  onClick={() => onOpenReconciliation()}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
                  title="Audit and match ledger against real bank/UPI balance"
                >
                  <Scale className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span>Audit / Reconcile</span>
                </button>
              )}
              <button
                onClick={() => onAddTransaction()}
                className="px-4 py-2 rounded-xl bg-[#22c55e] hover:bg-[#1ea34d] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#22c55e]/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Add Transaction
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onExecuteAllDueRecurring?.()}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-slate-700 transition-all shadow-sm"
                title="Post all active recurring items due today into ledger"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Process Due Today
              </button>
              <button
                onClick={() => onAddRecurringRule?.()}
                className="px-4 py-2 rounded-xl bg-[#22c55e] hover:bg-[#1ea34d] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#22c55e]/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                New Schedule
              </button>
            </div>
          )}
        </div>
      </div>

      {activeSubTab === 'ledger' ? (
        <>
          {/* Bill Settlement Summary Cards */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Split className="w-4 h-4 text-[#22c55e]" />
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Group Balance & Debt Settlement Calculator
                </h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Real-time Equal Split
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {settlements.map(({ member, netBalance }) => (
                <div
                  key={member.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{member.name.split(' ')[0]}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">{member.role}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={cn(
                      "text-xs font-black",
                      netBalance > 0 ? "text-emerald-600 dark:text-emerald-400" : netBalance < 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-400"
                    )}>
                      {netBalance > 0 ? `+${group.currency}${netBalance.toLocaleString()}` : netBalance < 0 ? `-${group.currency}${Math.abs(netBalance).toLocaleString()}` : 'Settled'}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                      {netBalance > 0 ? 'Gets back' : netBalance < 0 ? 'Owes group' : 'All clear'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Responsive Charts Section: Expense Flow & Payer Contribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart 1: Cashflow & Outflow Timeline */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#22c55e]" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Cash Flow & Daily Spending Trajectory
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-bold">
                  <span className="flex items-center gap-1.5 text-rose-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Outflow (Expense)
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" /> Inflow (Income)
                  </span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} vertical={false} />
                    <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${group.currency}${val >= 1000 ? `${Math.round(val/1000)}k` : val}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                      formatter={(val: any) => [`${group.currency}${Number(val).toLocaleString()}`, '']}
                    />
                    <Area type="monotone" dataKey="expense" name="Outflow" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#expenseGrad)" />
                    <Area type="monotone" dataKey="income" name="Inflow" stroke="#22c55e" strokeWidth={2.5} fillOpacity={1} fill="url(#incomeGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Payer Contribution Split */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-[#22c55e]" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Payer Share of Outflow
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Group</span>
              </div>

              <div className="h-44 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={payerSpendData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="amount"
                    >
                      {payerSpendData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                      formatter={(val: any) => [`${group.currency}${Number(val).toLocaleString()}`, 'Paid']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <Users className="w-5 h-5 text-slate-400 mb-0.5" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Payers</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                {payerSpendData.map((item) => (
                  <div key={item.fullName} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">{group.currency}{item.amount.toLocaleString()}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions, tags, payer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#22c55e]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="expense">Expenses Only</option>
                <option value="income">Income Only</option>
                <option value="transfer">Transfers</option>
              </select>

              {/* Member Filter */}
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">All Payers</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>

          {/* Transaction List Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Transaction / Purpose</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Paid By</th>
                    <th className="py-3 px-4">Split Mode</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                        No transactions match your search filters.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs",
                              tx.type === 'income' ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                            )}>
                              {tx.type === 'income' ? <ArrowDownRight className="w-4 h-4" /> : <Receipt className="w-4 h-4" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="truncate max-w-xs">{tx.title}</span>
                                {tx.isRecurringGenerated && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-[#22c55e] text-[9px] font-black uppercase tracking-wider border border-[#22c55e]/30">
                                    <Repeat className="w-2.5 h-2.5" />
                                    Recurring
                                  </span>
                                )}
                              </div>
                              {tx.notes && <div className="text-[10px] text-slate-400 font-normal">{tx.notes}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {tx.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                          {tx.paidByMemberName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-medium capitalize">
                          {tx.splitType} ({tx.splitWithMemberIds?.length || members.length} members)
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {tx.date}
                        </td>
                        <td className="py-3.5 px-4 text-right font-black">
                          <span className={tx.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"}>
                            {tx.amount > 0 ? `+${group.currency}${Math.abs(tx.amount).toLocaleString()}` : `-${group.currency}${Math.abs(tx.amount).toLocaleString()}`}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => onEditTransaction(tx)}
                              className="p-1.5 text-slate-400 hover:text-[#22c55e] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
                              title="Edit transaction"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteTransaction(tx.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                              title="Delete transaction"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Recurring Schedules & Standing Orders View */
        <div className="space-y-6">
          
          {/* Recurring Top Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Fixed Obligations</span>
              <div className="text-2xl font-black text-rose-500">
                {group.currency}{totalMonthlyRecurringExpense.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Subscriptions, utilities, & allowances</p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Recurring Inflow</span>
              <div className="text-2xl font-black text-emerald-500">
                {group.currency}{totalMonthlyRecurringIncome.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Salaries, rentals, & retainers</p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Schedules</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {recurringRules.filter(r => r.isActive).length} / {recurringRules.length} Active
              </div>
              <p className="text-[11px] text-[#22c55e] font-medium">Auto-posted on due date</p>
            </div>
          </div>

          {/* Recurring Cash Flow Distribution Chart */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#22c55e]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Monthly Standing Obligations & Recurring Cash Outflow Distribution
                </h3>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-bold">
                <span className="flex items-center gap-1.5 text-rose-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Recurring Debit
                </span>
                <span className="flex items-center gap-1.5 text-emerald-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" /> Recurring Credit
                </span>
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recurringCalendarData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} vertical={false} />
                  <XAxis dataKey="period" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${group.currency}${val >= 1000 ? `${Math.round(val/1000)}k` : val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                    formatter={(val: any, name: any) => [`${group.currency}${Number(val).toLocaleString()}`, name === 'expense' ? 'Scheduled Outflow' : 'Scheduled Inflow']}
                  />
                  <Bar dataKey="expense" name="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={48} />
                  <Bar dataKey="income" name="income" fill="#22c55e" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recurring Rules List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-[#22c55e]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Active Standing Rules & Scheduled Debits/Credits
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {recurringRules.length} Registered
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recurringRules.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs font-medium">
                  No recurring rules created yet. Click "New Schedule" to configure subscriptions, bills, or allowances.
                </div>
              ) : (
                recurringRules.map((rule) => (
                  <div key={rule.id} className="p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={cn(
                        "w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold border",
                        rule.type === 'income' 
                          ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border-emerald-200 dark:border-emerald-900"
                          : rule.type === 'savings_goal'
                          ? "bg-purple-50 dark:bg-purple-950/50 text-purple-600 border-purple-200 dark:border-purple-900"
                          : rule.type === 'vault_transfer'
                          ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 border-amber-200 dark:border-amber-900"
                          : rule.type === 'allowance'
                          ? "bg-sky-50 dark:bg-sky-950/50 text-sky-600 border-sky-200 dark:border-sky-900"
                          : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 border-rose-200 dark:border-rose-900"
                      )}>
                        <Repeat className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {rule.title}
                          </h4>
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[9px] font-black uppercase",
                            rule.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          )}>
                            {rule.isActive ? 'Active' : 'Paused'}
                          </span>
                          {rule.targetName && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-600 border border-purple-200 dark:border-purple-800">
                              → {rule.targetName}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-400 font-medium flex flex-wrap items-center gap-2 mt-1">
                          <span className="font-semibold text-slate-600 dark:text-slate-300 capitalize">{rule.frequency}</span>
                          <span>•</span>
                          <span>Due Day: {rule.dayOfMonth}th of month</span>
                          <span>•</span>
                          <span>Next: <strong className="text-slate-700 dark:text-slate-200">{rule.nextDueDate}</strong></span>
                          <span>•</span>
                          <span>By {rule.paidByMemberName.split(' ')[0]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                      <div className="text-right">
                        <div className={cn(
                          "text-base font-black",
                          rule.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"
                        )}>
                          {rule.type === 'income' ? `+${group.currency}${rule.amount.toLocaleString()}` : `-${group.currency}${rule.amount.toLocaleString()}`}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {rule.autoProcess ? '⚡ Auto-post enabled' : 'Manual trigger'}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onExecuteRecurringRule(rule)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#22c55e] hover:bg-[#22c55e] hover:text-white font-bold text-xs transition-all border border-[#22c55e]/30 flex items-center gap-1"
                          title="Post this recurring entry into the ledger immediately"
                        >
                          <Zap className="w-3 h-3" />
                          Post Now
                        </button>
                        <button
                          onClick={() => onToggleRecurringActive(rule.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title={rule.isActive ? "Pause schedule" : "Activate schedule"}
                        >
                          {rule.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => onEditRecurringRule(rule)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#22c55e] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                          title="Edit schedule"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteRecurringRule(rule.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete schedule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

