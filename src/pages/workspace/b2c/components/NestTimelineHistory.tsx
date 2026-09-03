import React, { useState, useMemo } from 'react';
import { 
  History, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Wallet, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Filter, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Tag, 
  CreditCard, 
  Sparkles, 
  ShieldCheck, 
  BarChart3, 
  CalendarDays,
  CircleDollarSign,
  ArrowRightLeft,
  PlusCircle,
  Eye,
  RefreshCw,
  FileSpreadsheet,
  FolderTree,
  PackageCheck,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Store,
  Receipt,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  NestGroup, 
  NestMember, 
  NestTransaction, 
  NestBudget, 
  NestSavingsGoal, 
  NestVault,
  NestRecurringRule,
  ExpenseCategory
} from '../types';
import { cn } from '../../../../lib/utils';

interface NestTimelineHistoryProps {
  group: NestGroup;
  members: NestMember[];
  transactions: NestTransaction[];
  budgets: NestBudget[];
  savings: NestSavingsGoal[];
  vaults: NestVault[];
  recurringRules?: NestRecurringRule[];
  onAddTransaction: () => void;
  onOpenReconciliation?: () => void;
}

type PeriodType = 'day' | 'month' | 'year';
type MemberScope = 'all' | 'admins' | string; // 'all', 'admins', or memberId
type FilterType = 'all' | 'income' | 'expense' | 'savings';
type TimelineOrganization = 'feed' | 'category' | 'item';

const CATEGORY_COLORS: Record<string, string> = {
  'Groceries': '#22c55e',
  'Rent & Utilities': '#3b82f6',
  'Dining & Food': '#f59e0b',
  'Transport': '#a855f7',
  'Entertainment': '#ec4899',
  'Healthcare': '#06b6d4',
  'Vacation & Travel': '#14b8a6',
  'Education': '#6366f1',
  'Shopping': '#f97316',
  'Shared Vaults': '#8b5cf6',
  'Income & Allowance': '#10b981',
  'Salary & Bonus': '#059669',
  'Investments': '#3b82f6',
  'Other': '#64748b'
};

export function NestTimelineHistory({
  group,
  members,
  transactions,
  budgets,
  savings,
  vaults,
  recurringRules = [],
  onAddTransaction,
  onOpenReconciliation
}: NestTimelineHistoryProps) {
  // Filters & State
  const [periodType, setPeriodType] = useState<PeriodType>('month');
  const [memberScope, setMemberScope] = useState<MemberScope>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timelineOrg, setTimelineOrg] = useState<TimelineOrganization>('feed');
  const [activeChartMode, setActiveChartMode] = useState<'cashflow' | 'breakdown' | 'savings_growth'>('cashflow');
  
  // Collapsible accordion states for category-wise & item-wise views
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Date navigation offsets
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(8); // 8 = September (0-indexed: 0-Jan to 11-Dec)
  const [selectedDayDate, setSelectedDayDate] = useState<string>('2026-08-28');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Map member quick lookup
  const memberMap = useMemo(() => {
    const map = new Map<string, NestMember>();
    members.forEach(m => map.set(m.id, m));
    return map;
  }, [members]);

  const adminMemberIds = useMemo(() => {
    return new Set(members.filter(m => m.role === 'Admin').map(m => m.id));
  }, [members]);

  // Filter transactions based on member scope
  const scopeFilteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (memberScope === 'all') return true;
      if (memberScope === 'admins') {
        const isPaidByAdmin = adminMemberIds.has(t.paidByMemberId);
        const isSplitWithAdmin = t.splitWithMemberIds?.some(id => adminMemberIds.has(id));
        return isPaidByAdmin || isSplitWithAdmin;
      }
      // Specific member
      const isPayer = t.paidByMemberId === memberScope;
      const isSplitInvolved = t.splitWithMemberIds?.includes(memberScope);
      return isPayer || isSplitInvolved;
    });
  }, [transactions, memberScope, adminMemberIds]);

  // Filter transactions based on time resolution and search/category filters
  const displayedTransactions = useMemo(() => {
    return scopeFilteredTransactions.filter(t => {
      // Type Filter
      if (filterType === 'income' && t.type !== 'income') return false;
      if (filterType === 'expense' && t.type !== 'expense') return false;
      if (filterType === 'savings' && t.type !== 'transfer' && t.category !== 'Shared Vaults') return false;

      // Category filter
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(query);
        const matchCategory = t.category.toLowerCase().includes(query);
        const matchPayer = t.paidByMemberName.toLowerCase().includes(query);
        const matchNotes = t.notes?.toLowerCase().includes(query);
        if (!matchTitle && !matchCategory && !matchPayer && !matchNotes) return false;
      }

      // Period Filter
      if (!t.date) return true;
      const [tYearStr, tMonthStr, tDayStr] = t.date.split('-');
      const tYear = parseInt(tYearStr, 10);
      const tMonth = parseInt(tMonthStr, 10) - 1; // 0-indexed

      if (periodType === 'year') {
        return tYear === selectedYear;
      } else if (periodType === 'month') {
        return tYear === selectedYear && tMonth === selectedMonthIndex;
      } else if (periodType === 'day') {
        return t.date === selectedDayDate;
      }

      return true;
    });
  }, [
    scopeFilteredTransactions, 
    filterType, 
    selectedCategory, 
    searchQuery, 
    periodType, 
    selectedYear, 
    selectedMonthIndex, 
    selectedDayDate
  ]);

  // Compute Period Metrics (Income, Expense, Savings, Net Cashflow)
  const metrics = useMemo(() => {
    let income = 0;
    let expense = 0;
    let savingsAllocated = 0;

    displayedTransactions.forEach(t => {
      const amt = Math.abs(t.amount);
      if (t.type === 'income') {
        if (memberScope === 'all' || memberScope === 'admins' || t.paidByMemberId === memberScope) {
          income += amt;
        }
      } else if (t.type === 'expense') {
        // If specific member selected, calculate their personalized share
        if (memberScope !== 'all' && memberScope !== 'admins') {
          if (t.splitWithMemberIds && t.splitWithMemberIds.includes(memberScope)) {
            const share = amt / (t.splitWithMemberIds.length || 1);
            expense += share;
          } else if (t.paidByMemberId === memberScope) {
            expense += amt;
          }
        } else {
          expense += amt;
        }
      } else if (t.type === 'transfer' || t.category === 'Shared Vaults') {
        savingsAllocated += amt;
      }
    });

    const netCashflow = income - expense;
    const savingsRate = income > 0 ? Math.max(0, Math.round(((income - expense) / income) * 100)) : 0;

    return {
      income,
      expense,
      savingsAllocated,
      netCashflow,
      savingsRate,
      txCount: displayedTransactions.length
    };
  }, [displayedTransactions, memberScope]);

  // Group transactions by Category for Category-wise view
  const categoryWiseData = useMemo(() => {
    const map = new Map<string, {
      category: string;
      income: number;
      expense: number;
      savings: number;
      total: number;
      transactions: NestTransaction[];
      color: string;
    }>();

    displayedTransactions.forEach(t => {
      const cat = t.category || 'Other';
      if (!map.has(cat)) {
        map.set(cat, {
          category: cat,
          income: 0,
          expense: 0,
          savings: 0,
          total: 0,
          transactions: [],
          color: CATEGORY_COLORS[cat] || '#94a3b8'
        });
      }

      const entry = map.get(cat)!;
      const amt = Math.abs(t.amount);
      entry.transactions.push(t);

      if (t.type === 'income') {
        entry.income += amt;
        entry.total += amt;
      } else if (t.type === 'expense') {
        entry.expense += amt;
        entry.total += amt;
      } else if (t.type === 'transfer' || t.category === 'Shared Vaults') {
        entry.savings += amt;
        entry.total += amt;
      }
    });

    // Sort categories by total volume descending
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [displayedTransactions]);

  // Group transactions by Item Title / Merchant for Item-wise view
  const itemWiseData = useMemo(() => {
    const map = new Map<string, {
      title: string;
      category: string;
      type: 'income' | 'expense' | 'transfer';
      totalAmount: number;
      txCount: number;
      minAmount: number;
      maxAmount: number;
      avgAmount: number;
      transactions: NestTransaction[];
      payers: Map<string, number>;
      latestDate: string;
    }>();

    displayedTransactions.forEach(t => {
      const normalizedTitle = t.title.trim();
      const amt = Math.abs(t.amount);

      if (!map.has(normalizedTitle)) {
        map.set(normalizedTitle, {
          title: normalizedTitle,
          category: t.category,
          type: t.type as any,
          totalAmount: 0,
          txCount: 0,
          minAmount: amt,
          maxAmount: amt,
          avgAmount: 0,
          transactions: [],
          payers: new Map(),
          latestDate: t.date || ''
        });
      }

      const item = map.get(normalizedTitle)!;
      item.transactions.push(t);
      item.totalAmount += amt;
      item.txCount += 1;
      item.minAmount = Math.min(item.minAmount, amt);
      item.maxAmount = Math.max(item.maxAmount, amt);
      item.payers.set(t.paidByMemberName, (item.payers.get(t.paidByMemberName) || 0) + 1);

      if (t.date && t.date > item.latestDate) {
        item.latestDate = t.date;
      }
    });

    // Calculate averages & sort by total spend/inflow descending
    return Array.from(map.values()).map(item => ({
      ...item,
      avgAmount: Math.round(item.totalAmount / item.txCount),
      topPayer: Array.from(item.payers.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Member'
    })).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [displayedTransactions]);

  // Generate Relative Chart Data based on current Period View
  const chartData = useMemo(() => {
    if (periodType === 'year') {
      // 12 months for the selected year
      return monthNames.map((mName, idx) => {
        const monthNumStr = String(idx + 1).padStart(2, '0');
        const prefix = `${selectedYear}-${monthNumStr}`;
        
        let mIncome = 0;
        let mExpense = 0;
        let mSavings = 0;

        scopeFilteredTransactions.forEach(t => {
          if (t.date && t.date.startsWith(prefix)) {
            const amt = Math.abs(t.amount);
            if (t.type === 'income') mIncome += amt;
            else if (t.type === 'expense') mExpense += amt;
            else if (t.type === 'transfer' || t.category === 'Shared Vaults') mSavings += amt;
          }
        });

        // Add standard monthly baseline if no historical transactions to simulate complete yearly curve
        if (mIncome === 0 && mExpense === 0) {
          if (idx <= 8) { // past months
            mIncome = group.monthlyIncome || 185000;
            mExpense = Math.round((group.monthlyBudget || 95000) * (0.85 + (idx % 3) * 0.08));
            mSavings = 15000 + (idx * 2000);
          }
        }

        return {
          label: mName.slice(0, 3),
          fullName: mName,
          Income: mIncome,
          Expenses: mExpense,
          Savings: mSavings,
          Net: mIncome - mExpense,
          Rate: mIncome > 0 ? Math.round(((mIncome - mExpense) / mIncome) * 100) : 0
        };
      });
    } else if (periodType === 'month') {
      // Group by weeks or 4-day blocks of selected month
      const daysInMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
      const intervals = [
        { label: 'Day 1-7', start: 1, end: 7 },
        { label: 'Day 8-14', start: 8, end: 14 },
        { label: 'Day 15-21', start: 15, end: 21 },
        { label: 'Day 22-28', start: 22, end: 28 },
        { label: `Day 29-${daysInMonth}`, start: 29, end: daysInMonth }
      ];

      return intervals.map(inter => {
        let blockIncome = 0;
        let blockExpense = 0;
        let blockSavings = 0;

        scopeFilteredTransactions.forEach(t => {
          if (!t.date) return;
          const [yr, mo, dy] = t.date.split('-').map(Number);
          if (yr === selectedYear && mo - 1 === selectedMonthIndex && dy >= inter.start && dy <= inter.end) {
            const amt = Math.abs(t.amount);
            if (t.type === 'income') blockIncome += amt;
            else if (t.type === 'expense') blockExpense += amt;
            else if (t.type === 'transfer' || t.category === 'Shared Vaults') blockSavings += amt;
          }
        });

        return {
          label: inter.label,
          Income: blockIncome,
          Expenses: blockExpense,
          Savings: blockSavings,
          Net: blockIncome - blockExpense,
          Rate: blockIncome > 0 ? Math.round(((blockIncome - blockExpense) / blockIncome) * 100) : 0
        };
      });
    } else {
      // Day view: Show hourly / transaction sequence on that day + nearby 5 days
      const targetDate = new Date(selectedDayDate);
      const daysSequence = [];
      for (let i = -3; i <= 3; i++) {
        const d = new Date(targetDate);
        d.setDate(d.getDate() + i);
        const dStr = d.toISOString().split('T')[0];
        
        let dIncome = 0;
        let dExpense = 0;
        let dSavings = 0;

        scopeFilteredTransactions.forEach(t => {
          if (t.date === dStr) {
            const amt = Math.abs(t.amount);
            if (t.type === 'income') dIncome += amt;
            else if (t.type === 'expense') dExpense += amt;
            else if (t.type === 'transfer' || t.category === 'Shared Vaults') dSavings += amt;
          }
        });

        const dayName = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
        daysSequence.push({
          label: dayName,
          date: dStr,
          isCurrent: dStr === selectedDayDate,
          Income: dIncome,
          Expenses: dExpense,
          Savings: dSavings,
          Net: dIncome - dExpense
        });
      }
      return daysSequence;
    }
  }, [
    periodType, 
    selectedYear, 
    selectedMonthIndex, 
    selectedDayDate, 
    scopeFilteredTransactions, 
    group, 
    monthNames
  ]);

  // Category distribution for pie / progress chart
  const categoryDistribution = useMemo(() => {
    const map = new Map<string, number>();
    displayedTransactions.forEach(t => {
      if (t.type === 'expense') {
        const cat = t.category || 'Other';
        map.set(cat, (map.get(cat) || 0) + Math.abs(t.amount));
      }
    });

    return Array.from(map.entries())
      .map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_COLORS[name] || '#94a3b8'
      }))
      .sort((a, b) => b.value - a.value);
  }, [displayedTransactions]);

  // Member contribution breakdown
  const memberContributionBreakdown = useMemo(() => {
    const map = new Map<string, { income: number; expense: number; savings: number; name: string; avatar: string; role: string }>();
    
    members.forEach(m => {
      map.set(m.id, {
        income: 0,
        expense: 0,
        savings: 0,
        name: m.name,
        avatar: m.avatar,
        role: m.role
      });
    });

    displayedTransactions.forEach(t => {
      const amt = Math.abs(t.amount);
      const payerEntry = map.get(t.paidByMemberId);
      if (payerEntry) {
        if (t.type === 'income') payerEntry.income += amt;
        else if (t.type === 'expense') payerEntry.expense += amt;
        else if (t.type === 'transfer' || t.category === 'Shared Vaults') payerEntry.savings += amt;
      }
    });

    return Array.from(map.entries()).map(([memberId, data]) => ({
      memberId,
      ...data,
      totalNet: data.income - data.expense
    }));
  }, [members, displayedTransactions]);

  // Toggle category accordion
  const toggleCategoryExpand = (cat: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  // Toggle item accordion
  const toggleItemExpand = (title: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Expand / Collapse all toggles
  const handleToggleAllCategories = (expand: boolean) => {
    const state: Record<string, boolean> = {};
    categoryWiseData.forEach(c => {
      state[c.category] = expand;
    });
    setExpandedCategories(state);
  };

  const handleToggleAllItems = (expand: boolean) => {
    const state: Record<string, boolean> = {};
    itemWiseData.forEach(i => {
      state[i.title] = expand;
    });
    setExpandedItems(state);
  };

  // Quick export function
  const handleExportCSV = () => {
    const headers = ['Date', 'Title', 'Type', 'Category', 'Amount (INR)', 'Paid By', 'Status', 'Notes'];
    const rows = displayedTransactions.map(t => [
      `"${t.date || ''}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.type}"`,
      `"${t.category}"`,
      t.amount,
      `"${t.paidByMemberName || ''}"`,
      `"${t.status}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nest_Financial_Timeline_${timelineOrg}_${periodType}_${selectedYear}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Banner & Scope Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 transition-colors">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Timeline & Financial History
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30 text-[10px] font-black uppercase tracking-wider">
                  Multi-Dimensional Audit
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track and compare income, expenses, and savings trajectory across chronological, category-wise, and item-wise dimensions.
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
          {onOpenReconciliation && (
            <button
              onClick={() => onOpenReconciliation()}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-sm"
              title="Verify Bank Statement Balance"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
              Reconcile Bank
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-sm"
            title="Download CSV Statement"
          >
            <Download className="w-3.5 h-3.5 text-[#22c55e]" />
            Export Statement
          </button>

          <button
            onClick={onAddTransaction}
            className="px-4 py-2 rounded-xl bg-[#22c55e] hover:bg-[#1ea34d] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#22c55e]/20 transition-all hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" />
            Add Entry
          </button>
        </div>
      </div>

      {/* 2. Multi-Tier Control Bar (Member Scope + Granularity + Dimension Mode) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 transition-colors">
        {/* Tier A: Member & Circle Filter */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Users className="w-4 h-4 text-[#22c55e]" />
            <span>Member Scope:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* All Family Circle */}
            <button
              onClick={() => setMemberScope('all')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border",
                memberScope === 'all'
                  ? "bg-[#22c55e] text-white border-[#22c55e] shadow-sm shadow-[#22c55e]/20"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              )}
            >
              <span>🏡 Entire Family Circle</span>
            </button>

            {/* Admins Only */}
            <button
              onClick={() => setMemberScope('admins')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border",
                memberScope === 'admins'
                  ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              )}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Admins Only</span>
            </button>

            {/* Individual Members */}
            {members.map(member => (
              <button
                key={member.id}
                onClick={() => setMemberScope(member.id)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border",
                  memberScope === member.id
                    ? "bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e] font-bold"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                )}
              >
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className="w-4 h-4 rounded-full object-cover" 
                />
                <span>{member.name.split(' ')[0]}</span>
                {member.role === 'Admin' && (
                  <span className="text-[9px] px-1 py-0.2 bg-amber-500/10 text-amber-500 font-bold rounded">Admin</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tier B: Granularity (Day / Month / Year) & Dimension Mode Selector */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Organization Dimension Selector (Feed vs Category-Wise vs Item-Wise) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
            <button
              onClick={() => setTimelineOrg('feed')}
              className={cn(
                "px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                timelineOrg === 'feed'
                  ? "bg-white dark:bg-slate-900 text-[#22c55e] shadow-sm border border-slate-200/50 dark:border-slate-700"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Chronological Feed</span>
            </button>
            <button
              onClick={() => setTimelineOrg('category')}
              className={cn(
                "px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                timelineOrg === 'category'
                  ? "bg-white dark:bg-slate-900 text-[#22c55e] shadow-sm border border-slate-200/50 dark:border-slate-700"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <FolderTree className="w-3.5 h-3.5 text-blue-500" />
              <span>Category-Wise</span>
            </button>
            <button
              onClick={() => setTimelineOrg('item')}
              className={cn(
                "px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                timelineOrg === 'item'
                  ? "bg-white dark:bg-slate-900 text-[#22c55e] shadow-sm border border-slate-200/50 dark:border-slate-700"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <PackageCheck className="w-3.5 h-3.5 text-purple-500" />
              <span>Item / Merchant-Wise</span>
            </button>
          </div>

          {/* Timeframe Navigation Controls & Period Selector */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Period Selector Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setPeriodType('day')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1",
                  periodType === 'day'
                    ? "bg-white dark:bg-slate-900 text-[#22c55e] shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Calendar className="w-3 h-3" />
                Day
              </button>
              <button
                onClick={() => setPeriodType('month')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1",
                  periodType === 'month'
                    ? "bg-white dark:bg-slate-900 text-[#22c55e] shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <CalendarDays className="w-3 h-3" />
                Month
              </button>
              <button
                onClick={() => setPeriodType('year')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1",
                  periodType === 'year'
                    ? "bg-white dark:bg-slate-900 text-[#22c55e] shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <BarChart3 className="w-3 h-3" />
                Year
              </button>
            </div>

            {/* Date Navigators */}
            {periodType === 'year' && (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setSelectedYear(prev => prev - 1)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-slate-900"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-xs text-slate-900 dark:text-white px-1">
                  FY {selectedYear}
                </span>
                <button
                  onClick={() => setSelectedYear(prev => prev + 1)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-slate-900"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {periodType === 'month' && (
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    if (selectedMonthIndex === 0) {
                      setSelectedMonthIndex(11);
                      setSelectedYear(y => y - 1);
                    } else {
                      setSelectedMonthIndex(m => m - 1);
                    }
                  }}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-xs text-slate-900 dark:text-white px-2">
                  {monthNames[selectedMonthIndex]} {selectedYear}
                </span>
                <button
                  onClick={() => {
                    if (selectedMonthIndex === 11) {
                      setSelectedMonthIndex(0);
                      setSelectedYear(y => y + 1);
                    } else {
                      setSelectedMonthIndex(m => m + 1);
                    }
                  }}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {periodType === 'day' && (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <Calendar className="w-4 h-4 text-[#22c55e]" />
                <input
                  type="date"
                  value={selectedDayDate}
                  onChange={(e) => setSelectedDayDate(e.target.value)}
                  className="bg-transparent border-none text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                />
              </div>
            )}

            {/* Quick Flow Filter Type Chips */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setFilterType('all')}
                className={cn(
                  "px-2.5 py-1 rounded text-[11px] font-bold transition-all",
                  filterType === 'all'
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                All Flows
              </button>
              <button
                onClick={() => setFilterType('income')}
                className={cn(
                  "px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1",
                  filterType === 'income'
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                )}
              >
                Income
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={cn(
                  "px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1",
                  filterType === 'expense'
                    ? "bg-rose-500 text-white shadow-sm"
                    : "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                )}
              >
                Expenses
              </button>
              <button
                onClick={() => setFilterType('savings')}
                className={cn(
                  "px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1",
                  filterType === 'savings'
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                )}
              >
                Vaults
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Financial Health Metric Cards (Inflow, Outflow, Saved, Net Margin) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Income */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3 transition-colors relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Inflow (Income)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              ₹{metrics.income.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>
                {memberScope === 'all' ? 'All Circle Inflows' : `${memberMap.get(memberScope)?.name || 'Admin'} Share`}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Expenses */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3 transition-colors relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Outflow (Expenses)</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              ₹{metrics.expense.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-rose-500 font-bold mt-1">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>{metrics.txCount} Line-Item Operations</span>
            </div>
          </div>
        </div>

        {/* Card 3: Savings Allocated */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3 transition-colors relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vaults & Goals Saved</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              ₹{metrics.savingsAllocated.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-purple-500 font-bold mt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{savings.length} Active Goals & Vaults</span>
            </div>
          </div>
        </div>

        {/* Card 4: Net Cash Flow & Savings Rate */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3 transition-colors relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Retained Cashflow</span>
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              metrics.netCashflow >= 0 ? "bg-[#22c55e]/10 text-[#22c55e]" : "bg-rose-500/10 text-rose-500"
            )}>
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className={cn(
              "text-2xl font-black tracking-tight",
              metrics.netCashflow >= 0 ? "text-[#22c55e]" : "text-rose-500"
            )}>
              {metrics.netCashflow >= 0 ? '+' : ''}₹{metrics.netCashflow.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
              <span className="px-1.5 py-0.5 rounded bg-[#22c55e]/10 text-[#22c55e] font-black">
                {metrics.savingsRate}% Rate
              </span>
              <span>Reserve velocity</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Responsive Interactive Chart Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Relative Cashflow & Trajectory Engine
              </h3>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase text-slate-500">
                {periodType.toUpperCase()} RESOLUTION
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Comparative visualization of Inflows vs Outflows vs Savings Reserve across {periodType === 'year' ? selectedYear : `${monthNames[selectedMonthIndex]} ${selectedYear}`}
            </p>
          </div>

          {/* Chart View Modes */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveChartMode('cashflow')}
              className={cn(
                "px-3 py-1 rounded text-xs font-bold transition-all",
                activeChartMode === 'cashflow'
                  ? "bg-[#22c55e] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              Cashflow Trends
            </button>
            <button
              onClick={() => setActiveChartMode('breakdown')}
              className={cn(
                "px-3 py-1 rounded text-xs font-bold transition-all",
                activeChartMode === 'breakdown'
                  ? "bg-[#22c55e] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              Category Distribution
            </button>
            <button
              onClick={() => setActiveChartMode('savings_growth')}
              className={cn(
                "px-3 py-1 rounded text-xs font-bold transition-all",
                activeChartMode === 'savings_growth'
                  ? "bg-[#22c55e] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              Member Contributions
            </button>
          </div>
        </div>

        {/* Responsive Chart Canvas */}
        <div className="w-full h-80 pt-2">
          {activeChartMode === 'cashflow' && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                <XAxis 
                  dataKey="label" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: '10px', 
                    fontSize: '12px', 
                    color: '#fff',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                  }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle" 
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="Income" 
                  stroke="#22c55e" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#incomeGrad)" 
                />
                <Bar 
                  dataKey="Expenses" 
                  fill="#f43f5e" 
                  radius={[4, 4, 0, 0]} 
                  barSize={periodType === 'year' ? 18 : 26} 
                />
                <Bar 
                  dataKey="Savings" 
                  fill="#8b5cf6" 
                  radius={[4, 4, 0, 0]} 
                  barSize={periodType === 'year' ? 14 : 20} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Net" 
                  stroke="#38bdf8" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: '#38bdf8' }} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {activeChartMode === 'breakdown' && (
            <div className="grid grid-cols-1 md:grid-cols-2 h-full items-center gap-6">
              <div className="w-full h-full min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={3}
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Spent']}
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderColor: '#334155', 
                        borderRadius: '10px', 
                        color: '#fff' 
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Ranking List */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Category Expense Allocations
                </div>
                {categoryDistribution.length === 0 ? (
                  <div className="text-xs text-slate-400 py-8 text-center">
                    No expense records found for this selected filter.
                  </div>
                ) : (
                  categoryDistribution.map((cat) => {
                    const pct = metrics.expense > 0 ? Math.round((cat.value / metrics.expense) * 100) : 0;
                    return (
                      <div key={cat.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span className="text-slate-700 dark:text-slate-200">{cat.name}</span>
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            ₹{cat.value.toLocaleString('en-IN')} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ width: `${pct}%`, backgroundColor: cat.color }} 
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeChartMode === 'savings_growth' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full items-center">
              {memberContributionBreakdown.map((item) => (
                <div 
                  key={item.memberId} 
                  className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={item.avatar} 
                      alt={item.name} 
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-[#22c55e]/20" 
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.name}
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">{item.role}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1 text-xs border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Earned (Income):</span>
                      <span className="font-bold text-emerald-500">₹{item.income.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Spent (Expenses):</span>
                      <span className="font-bold text-rose-500">₹{item.expense.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Saved in Vaults:</span>
                      <span className="font-bold text-purple-400">₹{item.savings.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-dashed border-slate-200 dark:border-slate-700 font-bold">
                      <span className="text-slate-500 dark:text-slate-300">Net Balance:</span>
                      <span className={item.totalNet >= 0 ? "text-[#22c55e]" : "text-rose-500"}>
                        {item.totalNet >= 0 ? '+' : ''}₹{item.totalNet.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. MULTI-DIMENSIONAL TIMELINE PRESENTATION LAYER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-5 transition-colors">
        {/* Stream Search & Organization Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              {timelineOrg === 'feed' && <CalendarDays className="w-4 h-4 text-[#22c55e]" />}
              {timelineOrg === 'category' && <FolderTree className="w-4 h-4 text-blue-500" />}
              {timelineOrg === 'item' && <PackageCheck className="w-4 h-4 text-purple-500" />}
              
              {timelineOrg === 'feed' && 'Itemized Chronological Stream'}
              {timelineOrg === 'category' && 'Category-Wise Timeline & Allocation'}
              {timelineOrg === 'item' && 'Line-Item & Merchant Spend Timeline'}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500">
              {timelineOrg === 'feed' && `${displayedTransactions.length} ENTRIES`}
              {timelineOrg === 'category' && `${categoryWiseData.length} CATEGORIES`}
              {timelineOrg === 'item' && `${itemWiseData.length} LINE ITEMS`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Expand / Collapse All Helpers for Category & Item views */}
            {timelineOrg !== 'feed' && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <button
                  onClick={() => timelineOrg === 'category' ? handleToggleAllCategories(true) : handleToggleAllItems(true)}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Expand All
                </button>
                <button
                  onClick={() => timelineOrg === 'category' ? handleToggleAllCategories(false) : handleToggleAllItems(false)}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Collapse All
                </button>
              </div>
            )}

            {/* Search Input */}
            <div className="relative flex-grow md:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={
                  timelineOrg === 'item'
                    ? "Search item, store, service..."
                    : "Search transactions, notes, payer..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#22c55e] transition-colors"
              />
            </div>

            {/* Category Filter Dropdown */}
            {timelineOrg !== 'category' && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {Object.keys(CATEGORY_COLORS).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW MODE 1: CHRONOLOGICAL STREAM (Feed) */}
        {/* ========================================================================= */}
        {timelineOrg === 'feed' && (
          <div className="space-y-3">
            {displayedTransactions.length === 0 ? (
              <div className="py-12 text-center space-y-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">No Transaction Records Found</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    There are no recorded transactions matching your selected timeframe and member filters.
                  </p>
                </div>
                <button
                  onClick={onAddTransaction}
                  className="px-4 py-2 rounded-lg bg-[#22c55e] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 hover:bg-[#1ea34d] transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Log First Transaction
                </button>
              </div>
            ) : (
              displayedTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                const isTransfer = tx.type === 'transfer' || tx.category === 'Shared Vaults';
                const catColor = CATEGORY_COLORS[tx.category] || '#94a3b8';
                const payer = memberMap.get(tx.paidByMemberId);

                return (
                  <div
                    key={tx.id}
                    className="group bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 transition-all duration-200 hover:shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Left info: Icon, Title, Category, Split info */}
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div className={cn(
                        "w-10 h-10 rounded-lg shrink-0 flex items-center justify-center transition-colors",
                        isIncome 
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : isTransfer
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                      )}>
                        {isIncome ? (
                          <ArrowUpRight className="w-5 h-5" />
                        ) : isTransfer ? (
                          <PiggyBank className="w-5 h-5" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {tx.title}
                          </h4>
                          {tx.isRecurringGenerated && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                              Auto-Recurring
                            </span>
                          )}
                          <span 
                            className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-xs"
                            style={{ backgroundColor: catColor }}
                          >
                            {tx.category}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {tx.date}
                          </span>

                          <span className="flex items-center gap-1.5">
                            {payer && (
                              <img 
                                src={payer.avatar} 
                                alt={payer.name} 
                                className="w-3.5 h-3.5 rounded-full object-cover" 
                              />
                            )}
                            <span className="text-slate-600 dark:text-slate-300 font-semibold">
                              {tx.paidByMemberName || 'Primary Admin'}
                            </span>
                          </span>

                          {tx.splitWithMemberIds && tx.splitWithMemberIds.length > 1 && (
                            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold">
                              Split ({tx.splitWithMemberIds.length} Members)
                            </span>
                          )}

                          {tx.notes && (
                            <span className="text-slate-400 italic truncate max-w-xs">
                              "{tx.notes}"
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right side: Amount and Status */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 gap-1 pl-13 sm:pl-0">
                      <div className={cn(
                        "text-base font-black tracking-tight",
                        isIncome 
                          ? "text-emerald-500" 
                          : isTransfer 
                          ? "text-purple-400" 
                          : "text-rose-500"
                      )}>
                        {isIncome ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{tx.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 2: CATEGORY-WISE TIMELINE & HISTORY ACCORDION */}
        {/* ========================================================================= */}
        {timelineOrg === 'category' && (
          <div className="space-y-4">
            {categoryWiseData.length === 0 ? (
              <div className="py-12 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                No categories found matching your filters.
              </div>
            ) : (
              categoryWiseData.map((catGroup) => {
                const isExpanded = !!expandedCategories[catGroup.category];
                const totalPeriodVolume = (metrics.income + metrics.expense + metrics.savingsAllocated) || 1;
                const percentage = Math.round((catGroup.total / totalPeriodVolume) * 100);
                const avgPerTx = catGroup.transactions.length > 0 ? Math.round(catGroup.total / catGroup.transactions.length) : 0;

                return (
                  <div
                    key={catGroup.category}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/40 overflow-hidden transition-all duration-200"
                  >
                    {/* Category Header Card (Click to expand) */}
                    <div
                      onClick={() => toggleCategoryExpand(catGroup.category)}
                      className="p-4 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm font-black text-sm shrink-0"
                          style={{ backgroundColor: catGroup.color }}
                        >
                          {catGroup.category.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                              {catGroup.category}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {catGroup.transactions.length} transactions
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span>Avg. ₹{avgPerTx.toLocaleString('en-IN')} / entry</span>
                            <span>•</span>
                            <span>{percentage}% of total flows</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Subtotals & Chevron */}
                      <div className="flex items-center justify-between w-full md:w-auto gap-6 pl-13 md:pl-0">
                        <div className="flex items-center gap-4 text-xs font-bold">
                          {catGroup.income > 0 && (
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block font-normal">Inflow</span>
                              <span className="text-emerald-500">+₹{catGroup.income.toLocaleString('en-IN')}</span>
                            </div>
                          )}
                          {catGroup.expense > 0 && (
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block font-normal">Outflow</span>
                              <span className="text-rose-500">-₹{catGroup.expense.toLocaleString('en-IN')}</span>
                            </div>
                          )}
                          {catGroup.savings > 0 && (
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block font-normal">Vault Saved</span>
                              <span className="text-purple-400">₹{catGroup.savings.toLocaleString('en-IN')}</span>
                            </div>
                          )}
                        </div>

                        <button 
                          className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-200 transition-transform"
                          title="Toggle details"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Progress visual bar */}
                    <div className="w-full h-1 bg-slate-200 dark:bg-slate-700/60">
                      <div 
                        className="h-full transition-all duration-500"
                        style={{ width: `${Math.min(percentage * 2, 100)}%`, backgroundColor: catGroup.color }}
                      />
                    </div>

                    {/* Expanded Historical Timeline List inside Category */}
                    {isExpanded && (
                      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Chronological Record for {catGroup.category} ({catGroup.transactions.length} items)
                        </div>

                        {catGroup.transactions.map((tx) => {
                          const isIncome = tx.type === 'income';
                          const isTransfer = tx.type === 'transfer' || tx.category === 'Shared Vaults';
                          const payer = memberMap.get(tx.paidByMemberId);

                          return (
                            <div
                              key={tx.id}
                              className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/70 flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={cn(
                                  "w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs shrink-0",
                                  isIncome ? "bg-emerald-500/10 text-emerald-500" : isTransfer ? "bg-purple-500/10 text-purple-400" : "bg-rose-500/10 text-rose-500"
                                )}>
                                  {isIncome ? <ArrowUpRight className="w-3.5 h-3.5" /> : isTransfer ? <PiggyBank className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-900 dark:text-white truncate">
                                    {tx.title}
                                  </div>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                                    <span>{tx.date}</span>
                                    <span>•</span>
                                    <span>{tx.paidByMemberName}</span>
                                    {tx.notes && <span>• "{tx.notes}"</span>}
                                  </div>
                                </div>
                              </div>

                              <div className={cn(
                                "font-black text-sm shrink-0",
                                isIncome ? "text-emerald-500" : isTransfer ? "text-purple-400" : "text-rose-500"
                              )}>
                                {isIncome ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 3: ITEM & MERCHANT-WISE TIMELINE & HISTORY ACCORDION */}
        {/* ========================================================================= */}
        {timelineOrg === 'item' && (
          <div className="space-y-4">
            {itemWiseData.length === 0 ? (
              <div className="py-12 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                No items or merchants found matching your search.
              </div>
            ) : (
              itemWiseData.map((item) => {
                const isExpanded = !!expandedItems[item.title];
                const isIncome = item.type === 'income';
                const isTransfer = item.type === 'transfer' || item.category === 'Shared Vaults';
                const catColor = CATEGORY_COLORS[item.category] || '#94a3b8';

                return (
                  <div
                    key={item.title}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/40 overflow-hidden transition-all duration-200"
                  >
                    {/* Item Header Card (Click to expand) */}
                    <div
                      onClick={() => toggleItemExpand(item.title)}
                      className="p-4 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border",
                          isIncome 
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                            : isTransfer
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        )}>
                          <ShoppingBag className="w-5 h-5" />
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                              {item.title}
                            </h4>
                            <span 
                              className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-xs"
                              style={{ backgroundColor: catColor }}
                            >
                              {item.category}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                              {item.txCount}x Occurrences
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span>Top Payer: <strong className="text-slate-700 dark:text-slate-200">{item.topPayer}</strong></span>
                            <span>•</span>
                            <span>Avg: ₹{item.avgAmount.toLocaleString('en-IN')}</span>
                            {item.txCount > 1 && (
                              <>
                                <span>•</span>
                                <span>Range: ₹{item.minAmount.toLocaleString('en-IN')} - ₹{item.maxAmount.toLocaleString('en-IN')}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>Latest: {item.latestDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Amount & Toggle Button */}
                      <div className="flex items-center justify-between w-full md:w-auto gap-6 pl-13 md:pl-0">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-normal">Cumulative Total</span>
                          <span className={cn(
                            "text-base font-black tracking-tight",
                            isIncome ? "text-emerald-500" : isTransfer ? "text-purple-400" : "text-rose-500"
                          )}>
                            {isIncome ? '+' : '-'}₹{item.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button 
                          className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-200 transition-transform"
                          title="Toggle item history"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Occurrences Stream for this specific item */}
                    {isExpanded && (
                      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Price & Purchase History for "{item.title}" ({item.transactions.length} logs)
                        </div>

                        {item.transactions.map((tx, idx) => {
                          const payer = memberMap.get(tx.paidByMemberId);
                          return (
                            <div
                              key={tx.id || idx}
                              className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/70 flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                  #{idx + 1}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                    <span>{tx.date}</span>
                                    {tx.isRecurringGenerated && (
                                      <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/10 text-amber-500 rounded font-bold">
                                        Auto-Sub
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                                    {payer && (
                                      <img src={payer.avatar} alt={payer.name} className="w-3 h-3 rounded-full object-cover" />
                                    )}
                                    <span>Paid by {tx.paidByMemberName}</span>
                                    {tx.notes && <span>• Note: {tx.notes}</span>}
                                  </div>
                                </div>
                              </div>

                              <div className={cn(
                                "font-black text-sm",
                                isIncome ? "text-emerald-500" : isTransfer ? "text-purple-400" : "text-rose-500"
                              )}>
                                {isIncome ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
