import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  PiggyBank, 
  Users, 
  Wallet, 
  Sparkles, 
  Filter, 
  Search, 
  ChevronRight, 
  Trash2, 
  Edit2, 
  Check, 
  MoreVertical, 
  ShieldAlert, 
  RefreshCw, 
  Tag, 
  X, 
  CheckSquare, 
  Receipt,
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';
import { 
  NestGroup, 
  NestMember, 
  NestReminderItem, 
  NestReminderType, 
  NestReminderPriority, 
  NestReminderStatus,
  ExpenseCategory, 
  NestTransaction, 
  NestBudget, 
  NestSavingsGoal, 
  NestVault,
  RecurringFrequency 
} from '../types';
import { cn } from '../../../../lib/utils';

interface NestRemindersProps {
  group: NestGroup;
  members: NestMember[];
  reminders: NestReminderItem[];
  budgets?: NestBudget[];
  savings?: NestSavingsGoal[];
  vaults?: NestVault[];
  onAddReminder: (reminder: NestReminderItem) => void;
  onUpdateReminder: (reminder: NestReminderItem) => void;
  onDeleteReminder: (id: string) => void;
  onToggleCompleteReminder: (id: string) => void;
  onSnoozeReminder: (id: string, days: number) => void;
  onQuickExecuteReminder?: (reminder: NestReminderItem) => void;
  onNavigateTab?: (tabId: string) => void;
}

const CATEGORIES: ExpenseCategory[] = [
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

export function NestReminders({
  group,
  members,
  reminders,
  budgets,
  savings,
  vaults,
  onAddReminder,
  onUpdateReminder,
  onDeleteReminder,
  onToggleCompleteReminder,
  onSnoozeReminder,
  onQuickExecuteReminder,
  onNavigateTab
}: NestRemindersProps) {
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('all');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<NestReminderItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<NestReminderType>('expense_bill');
  const [category, setCategory] = useState<ExpenseCategory>('Rent & Utilities');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<NestReminderPriority>('medium');
  const [assignedMemberId, setAssignedMemberId] = useState(members[0]?.id || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>('monthly');

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Helper for computing relative days
  const getRelativeDayInfo = (dueDateStr: string) => {
    if (!dueDateStr) return { text: 'No date', color: 'text-slate-400', isOverdue: false, isToday: false };
    
    const today = new Date(todayStr);
    const target = new Date(dueDateStr);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: `Overdue by ${Math.abs(diffDays)}d`,
        badgeClass: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        isOverdue: true,
        isToday: false,
        days: diffDays
      };
    } else if (diffDays === 0) {
      return {
        text: 'Due Today',
        badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20 font-black animate-pulse',
        isOverdue: false,
        isToday: true,
        days: 0
      };
    } else if (diffDays === 1) {
      return {
        text: 'Due Tomorrow',
        badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold',
        isOverdue: false,
        isToday: false,
        days: 1
      };
    } else if (diffDays <= 7) {
      return {
        text: `In ${diffDays} days`,
        badgeClass: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
        isOverdue: false,
        isToday: false,
        days: diffDays
      };
    } else {
      return {
        text: `In ${diffDays} days`,
        badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700',
        isOverdue: false,
        isToday: false,
        days: diffDays
      };
    }
  };

  // KPI Calculations
  const stats = useMemo(() => {
    let overdueCount = 0;
    let dueTodayCount = 0;
    let upcomingBillsAmount = 0;
    let expectedInflowAmount = 0;
    let plannedSavingsAmount = 0;
    let completedCount = 0;
    let pendingCount = 0;

    reminders.forEach(r => {
      if (r.status === 'completed') {
        completedCount++;
      } else {
        pendingCount++;
        const rel = getRelativeDayInfo(r.dueDate);
        if (rel.isOverdue) overdueCount++;
        if (rel.isToday) dueTodayCount++;

        const amt = r.amount || 0;
        if (r.type === 'expense_bill') upcomingBillsAmount += amt;
        if (r.type === 'income_due') expectedInflowAmount += amt;
        if (r.type === 'savings_deposit' || r.type === 'vault_allocation') plannedSavingsAmount += amt;
      }
    });

    const totalTasks = reminders.length;
    const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    return {
      overdueCount,
      dueTodayCount,
      urgentTotal: overdueCount + dueTodayCount,
      upcomingBillsAmount,
      expectedInflowAmount,
      plannedSavingsAmount,
      completedCount,
      pendingCount,
      totalTasks,
      completionRate
    };
  }, [reminders, todayStr]);

  // Filtered List
  const filteredReminders = useMemo(() => {
    return reminders.filter(item => {
      // Status filter
      if (activeStatusFilter === 'pending' && item.status !== 'pending') return false;
      if (activeStatusFilter === 'completed' && item.status !== 'completed') return false;

      // Type filter
      if (activeTypeFilter === 'urgent') {
        const rel = getRelativeDayInfo(item.dueDate);
        if (!rel.isOverdue && !rel.isToday && item.priority !== 'urgent') return false;
      } else if (activeTypeFilter === 'bills') {
        if (item.type !== 'expense_bill') return false;
      } else if (activeTypeFilter === 'income') {
        if (item.type !== 'income_due') return false;
      } else if (activeTypeFilter === 'savings') {
        if (item.type !== 'savings_deposit' && item.type !== 'vault_allocation') return false;
      } else if (activeTypeFilter === 'allowances') {
        if (item.type !== 'allowance_disbursement') return false;
      } else if (activeTypeFilter === 'alerts') {
        if (item.type !== 'budget_alert') return false;
      } else if (activeTypeFilter === 'checklist') {
        if (item.type !== 'custom_task') return false;
      }

      // Member filter
      if (selectedMemberFilter !== 'all') {
        if (item.assignedMemberId !== selectedMemberFilter) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        const matchesCat = item.category?.toLowerCase().includes(q);
        const matchesMember = item.assignedMemberName?.toLowerCase().includes(q);
        const matchesTag = item.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesMember && !matchesTag) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Completed items go to bottom
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      // Sort by due date ascending
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [reminders, activeTypeFilter, activeStatusFilter, selectedMemberFilter, searchQuery]);

  const openCreateModal = () => {
    setEditingReminder(null);
    setTitle('');
    setDescription('');
    setAmount('');
    setType('expense_bill');
    setCategory('Rent & Utilities');
    setDueDate(todayStr);
    setPriority('medium');
    setAssignedMemberId(members[0]?.id || '');
    setTags([]);
    setIsRecurring(false);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (rem: NestReminderItem) => {
    setEditingReminder(rem);
    setTitle(rem.title);
    setDescription(rem.description || '');
    setAmount(rem.amount ? rem.amount.toString() : '');
    setType(rem.type);
    setCategory(rem.category || 'Rent & Utilities');
    setDueDate(rem.dueDate);
    setPriority(rem.priority);
    setAssignedMemberId(rem.assignedMemberId || members[0]?.id || '');
    setTags(rem.tags || []);
    setIsRecurring(!!rem.recurringFrequency);
    setRecurringFrequency(rem.recurringFrequency || 'monthly');
    setIsCreateModalOpen(true);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    const assignedMem = members.find(m => m.id === assignedMemberId);

    const reminderPayload: NestReminderItem = {
      id: editingReminder ? editingReminder.id : `rem_${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      amount: amount ? Math.abs(parseFloat(amount)) : undefined,
      type,
      category,
      dueDate,
      status: editingReminder ? editingReminder.status : 'pending',
      priority,
      assignedMemberId: assignedMem?.id,
      assignedMemberName: assignedMem?.name,
      tags: tags.length > 0 ? tags : undefined,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
      isAutoGenerated: editingReminder ? editingReminder.isAutoGenerated : false
    };

    if (editingReminder) {
      onUpdateReminder(reminderPayload);
    } else {
      onAddReminder(reminderPayload);
    }

    setIsCreateModalOpen(false);
  };

  const handleApplyPreset = (presetTitle: string, presetType: NestReminderType, presetCat: ExpenseCategory, presetAmount: number, presetPriority: NestReminderPriority) => {
    const assignedMem = members[0];
    const newRem: NestReminderItem = {
      id: `rem_preset_${Date.now()}`,
      title: presetTitle,
      amount: presetAmount,
      type: presetType,
      category: presetCat,
      dueDate: todayStr,
      status: 'pending',
      priority: presetPriority,
      assignedMemberId: assignedMem?.id,
      assignedMemberName: assignedMem?.name,
      tags: ['Quick Preset']
    };
    onAddReminder(newRem);
  };

  const getTypeIcon = (type: NestReminderType) => {
    switch (type) {
      case 'expense_bill':
        return <ArrowDownRight className="w-4 h-4 text-rose-500" />;
      case 'income_due':
        return <ArrowUpRight className="w-4 h-4 text-[#22c55e]" />;
      case 'savings_deposit':
        return <PiggyBank className="w-4 h-4 text-amber-500" />;
      case 'vault_allocation':
        return <Wallet className="w-4 h-4 text-purple-500" />;
      case 'allowance_disbursement':
        return <Users className="w-4 h-4 text-sky-500" />;
      case 'budget_alert':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      default:
        return <CheckSquare className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTypeLabel = (type: NestReminderType) => {
    switch (type) {
      case 'expense_bill': return 'Bill Outflow';
      case 'income_due': return 'Expected Income';
      case 'savings_deposit': return 'Savings Goal';
      case 'vault_allocation': return 'Vault Transfer';
      case 'allowance_disbursement': return 'Allowance';
      case 'budget_alert': return 'Budget Warning';
      default: return 'Checklist Task';
    }
  };

  const getPriorityBadge = (priority: NestReminderPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-rose-500 text-white tracking-wider">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">Low</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#22c55e]/10 text-[#22c55e] text-xs font-black uppercase tracking-wider border border-[#22c55e]/20 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" /> Upcoming & Reminders
            </span>
            {stats.urgentTotal > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-bounce">
                {stats.urgentTotal} Urgent
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Financial Checklist & Schedules
          </h1>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Real-time tracking of upcoming bills, anticipated incomes, goal deposits, allowances & alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#22c55e] text-white text-xs font-bold shadow-md shadow-[#22c55e]/20 hover:bg-[#1ea34d] transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Add Reminder / Task
          </button>
        </div>
      </div>

      {/* Proactive Urgent Alert Banner */}
      {stats.urgentTotal > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                {stats.urgentTotal} High-Priority Items Require Immediate Attention
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {stats.overdueCount > 0 ? `${stats.overdueCount} overdue items and ` : ''}{stats.dueTodayCount} tasks scheduled for today.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTypeFilter('urgent')}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 transition-colors shrink-0"
          >
            View Urgent ({stats.urgentTotal})
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Urgent & Due Today */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Due Today & Overdue</span>
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              stats.urgentTotal > 0 ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
            )}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{stats.urgentTotal}</span>
            <span className="text-xs font-semibold text-slate-400">items</span>
          </div>
          <div className="mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> {stats.overdueCount} Overdue &bull; {stats.dueTodayCount} Today
          </div>
        </div>

        {/* Card 2: Upcoming Outflow (Bills) */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scheduled Outflows</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {group.currency}{stats.upcomingBillsAmount.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Pending utility, society & subscription bills
          </div>
        </div>

        {/* Card 3: Expected Inflow */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Anticipated Inflows</span>
            <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 text-[#22c55e] flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {group.currency}{stats.expectedInflowAmount.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Salary retainers & consultancy credits
          </div>
        </div>

        {/* Card 4: Monthly Progress Meter */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Checklist Cleared</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{stats.completionRate}%</span>
            <span className="text-xs font-bold text-slate-400">{stats.completedCount} of {stats.totalTasks} cleared</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#22c55e] h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Financial Checklist Preset Templates */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#22c55e]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Smart 1-Click Checklist Presets
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Add</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => handleApplyPreset('Pay Monthly Electricity & Water Utility Bill', 'expense_bill', 'Rent & Utilities', 4500, 'high')}
            className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-[#22c55e] bg-slate-50 dark:bg-slate-950/50 text-left transition-all group flex items-start justify-between"
          >
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#22c55e] transition-colors">
                ⚡ Electricity & Water Bill
              </p>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{group.currency}4,500 &bull; Rent & Utilities</p>
            </div>
            <PlusCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#22c55e] shrink-0 ml-2" />
          </button>

          <button
            onClick={() => handleApplyPreset('Transfer ₹5,000 to Emergency Reserve Vault', 'vault_allocation', 'Shared Vaults', 5000, 'medium')}
            className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-purple-500 bg-slate-50 dark:bg-slate-950/50 text-left transition-all group flex items-start justify-between"
          >
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">
                🛡️ Top-Up Emergency Vault
              </p>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{group.currency}5,000 &bull; Shared Vaults</p>
            </div>
            <PlusCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-500 shrink-0 ml-2" />
          </button>

          <button
            onClick={() => handleApplyPreset('Cross-Check Credit Card Statement for Anomalies', 'custom_task', 'Rent & Utilities', 0, 'medium')}
            className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-500 bg-slate-50 dark:bg-slate-950/50 text-left transition-all group flex items-start justify-between"
          >
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">
                💳 Audit Credit Card Statement
              </p>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Verification & Reconciliation</p>
            </div>
            <PlusCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500 shrink-0 ml-2" />
          </button>

          <button
            onClick={() => handleApplyPreset('Disburse Kids School Sports & Tuition Fees', 'expense_bill', 'Education', 8500, 'high')}
            className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-amber-500 bg-slate-50 dark:bg-slate-950/50 text-left transition-all group flex items-start justify-between"
          >
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                🎓 Kids School & Tuition Fees
              </p>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{group.currency}8,500 &bull; Education</p>
            </div>
            <PlusCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 shrink-0 ml-2" />
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {[
            { id: 'all', label: 'All Items', count: reminders.length },
            { id: 'urgent', label: '⚡ Urgent / Due', count: stats.urgentTotal },
            { id: 'bills', label: '💳 Expenses & Bills', count: reminders.filter(r => r.type === 'expense_bill').length },
            { id: 'income', label: '💰 Incomes', count: reminders.filter(r => r.type === 'income_due').length },
            { id: 'savings', label: '🎯 Savings & Vaults', count: reminders.filter(r => r.type === 'savings_deposit' || r.type === 'vault_allocation').length },
            { id: 'allowances', label: '👥 Allowances', count: reminders.filter(r => r.type === 'allowance_disbursement').length },
            { id: 'alerts', label: '⚠️ Budget Warnings', count: reminders.filter(r => r.type === 'budget_alert').length },
            { id: 'checklist', label: '📝 Custom Tasks', count: reminders.filter(r => r.type === 'custom_task').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTypeFilter(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border",
                activeTypeFilter === tab.id
                  ? "bg-[#22c55e] text-white border-[#22c55e] shadow-sm shadow-[#22c55e]/20"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              )}
            >
              <span>{tab.label}</span>
              <span className={cn(
                "px-1.5 py-0.2 rounded text-[10px] font-black",
                activeTypeFilter === tab.id ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search, Status & Member Controls */}
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reminders, bills, incomes, assignees or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#22c55e]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            {/* Status Segment */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0">
              <button
                onClick={() => setActiveStatusFilter('all')}
                className={cn(
                  "px-2.5 py-1 rounded text-[11px] font-bold transition-all",
                  activeStatusFilter === 'all' ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs" : "text-slate-500"
                )}
              >
                All
              </button>
              <button
                onClick={() => setActiveStatusFilter('pending')}
                className={cn(
                  "px-2.5 py-1 rounded text-[11px] font-bold transition-all",
                  activeStatusFilter === 'pending' ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs" : "text-slate-500"
                )}
              >
                Pending ({stats.pendingCount})
              </button>
              <button
                onClick={() => setActiveStatusFilter('completed')}
                className={cn(
                  "px-2.5 py-1 rounded text-[11px] font-bold transition-all",
                  activeStatusFilter === 'completed' ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs" : "text-slate-500"
                )}
              >
                Completed ({stats.completedCount})
              </button>
            </div>

            {/* Member Assignee Dropdown */}
            <select
              value={selectedMemberFilter}
              onChange={(e) => setSelectedMemberFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
            >
              <option value="all">All Members</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Checklist / Reminders List */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="p-12 rounded-xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#22c55e] mx-auto opacity-40" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Reminders Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All tasks for this filter have been completed or no matching schedules exist. Click &quot;Add Reminder / Task&quot; to schedule a new one.
            </p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-lg bg-[#22c55e] text-white text-xs font-bold"
            >
              Add New Reminder
            </button>
          </div>
        ) : (
          filteredReminders.map(rem => {
            const rel = getRelativeDayInfo(rem.dueDate);
            const isCompleted = rem.status === 'completed';

            return (
              <div
                key={rem.id}
                className={cn(
                  "p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border transition-all shadow-xs group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
                  isCompleted 
                    ? "opacity-60 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40" 
                    : rel.isOverdue 
                      ? "border-rose-300 dark:border-rose-900/50 hover:border-rose-500" 
                      : rel.isToday 
                        ? "border-amber-300 dark:border-amber-900/50 hover:border-amber-500" 
                        : "border-slate-200 dark:border-slate-800 hover:border-[#22c55e]/50"
                )}
              >
                {/* Left: Checkbox & Details */}
                <div className="flex items-start gap-3.5 flex-grow min-w-0">
                  {/* Interactive Toggle Button */}
                  <button
                    onClick={() => onToggleCompleteReminder(rem.id)}
                    className={cn(
                      "w-6 h-6 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all",
                      isCompleted 
                        ? "bg-[#22c55e] border-[#22c55e] text-white" 
                        : "border-slate-300 dark:border-slate-700 hover:border-[#22c55e] hover:bg-[#22c55e]/10 text-transparent hover:text-[#22c55e]"
                    )}
                    title={isCompleted ? "Mark as Pending" : "Mark as Completed"}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <div className="space-y-1 min-w-0 flex-grow">
                    {/* Header line: Type icon, Category, Priority, Due Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        {getTypeIcon(rem.type)}
                        <span>{getTypeLabel(rem.type)}</span>
                      </div>

                      {rem.category && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-500">
                          {rem.category}
                        </span>
                      )}

                      {getPriorityBadge(rem.priority)}

                      {/* Relative Countdown Badge */}
                      <span className={cn("px-2 py-0.5 rounded border text-[10px]", rel.badgeClass)}>
                        {rel.text}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className={cn(
                      "text-sm font-bold text-slate-900 dark:text-white transition-all",
                      isCompleted && "line-through text-slate-400 dark:text-slate-500"
                    )}>
                      {rem.title}
                    </h4>

                    {/* Description */}
                    {rem.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {rem.description}
                      </p>
                    )}

                    {/* Meta info: Date, Assignee, Tags */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-semibold text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Due: {rem.dueDate}
                      </span>

                      {rem.assignedMemberName && (
                        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                          <Users className="w-3.5 h-3.5 text-[#22c55e]" /> {rem.assignedMemberName}
                        </span>
                      )}

                      {rem.tags && rem.tags.map(tag => (
                        <span key={tag} className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-500">
                          #{tag}
                        </span>
                      ))}

                      {rem.recurringFrequency && (
                        <span className="flex items-center gap-1 text-sky-500 text-[10px] font-bold">
                          <RefreshCw className="w-3 h-3 animate-spin-slow" /> {rem.recurringFrequency}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Action Buttons */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  {rem.amount !== undefined && rem.amount > 0 && (
                    <div className="text-right">
                      <span className={cn(
                        "text-base font-black tracking-tight",
                        rem.type === 'income_due' 
                          ? "text-[#22c55e]" 
                          : rem.type === 'expense_bill' 
                            ? "text-rose-500" 
                            : "text-slate-900 dark:text-white"
                      )}>
                        {rem.type === 'income_due' ? '+' : rem.type === 'expense_bill' ? '-' : ''}
                        {group.currency}{rem.amount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Actions Strip */}
                  <div className="flex items-center gap-1.5">
                    {/* Quick Pay / Settle / Execute Button if actionable */}
                    {!isCompleted && rem.amount !== undefined && onQuickExecuteReminder && (
                      <button
                        onClick={() => onQuickExecuteReminder(rem)}
                        className="px-2.5 py-1 rounded bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e] hover:text-white border border-[#22c55e]/30 text-[11px] font-bold transition-all flex items-center gap-1"
                        title="Log this bill/income directly to ledger"
                      >
                        <Receipt className="w-3 h-3" /> Quick Settle
                      </button>
                    )}

                    {/* Snooze 3 Days */}
                    {!isCompleted && (
                      <button
                        onClick={() => onSnoozeReminder(rem.id, 3)}
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title="Snooze for 3 days"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(rem)}
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title="Edit Reminder"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDeleteReminder(rem.id)}
                      className="p-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Delete Reminder"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Reminder Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-5 transition-all">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 text-[#22c55e] flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {editingReminder ? 'Edit Financial Reminder' : 'Create Financial Reminder / Task'}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-400">
                    Schedule automated alerts for expenses, incomes, or milestones.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReminder} className="space-y-4 text-xs font-semibold">
              {/* Type Picker */}
              <div>
                <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-bold mb-1">
                  Reminder Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'expense_bill', label: '💳 Bill Outflow' },
                    { id: 'income_due', label: '💰 Income Due' },
                    { id: 'savings_deposit', label: '🎯 Savings Goal' },
                    { id: 'vault_allocation', label: '🛡️ Vault Transfer' },
                    { id: 'allowance_disbursement', label: '👥 Allowance' },
                    { id: 'custom_task', label: '📝 Custom Task' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id as NestReminderType)}
                      className={cn(
                        "p-2 rounded-lg border text-left text-[11px] font-bold transition-all",
                        type === t.id
                          ? "bg-[#22c55e]/10 border-[#22c55e] text-[#22c55e]"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-bold mb-1">
                  Title / Task Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Airtel Broadband Bill / Monthly Consultant Salary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              {/* Amount & Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-bold mb-1">
                    Amount ({group.currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g., 2999 (optional for tasks)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-bold mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-bold mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-bold mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as NestReminderPriority)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  >
                    <option value="urgent">⚡ Urgent (Immediate Action)</option>
                    <option value="high">🔴 High Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="low">⚪ Low Priority</option>
                  </select>
                </div>
              </div>

              {/* Assigned Member */}
              <div>
                <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-bold mb-1">
                  Assigned Member
                </label>
                <select
                  value={assignedMemberId}
                  onChange={(e) => setAssignedMemberId(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                  ))}
                </select>
              </div>

              {/* Description / Notes */}
              <div>
                <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-bold mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Reference invoice link, policy details or reminder context..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              {/* Recurring Switch */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Repeat Schedule</p>
                  <p className="text-[10px] text-slate-400 font-semibold">Auto-generate new checklist item upon due date</p>
                </div>
                <div className="flex items-center gap-2">
                  {isRecurring && (
                    <select
                      value={recurringFrequency}
                      onChange={(e) => setRecurringFrequency(e.target.value as any)}
                      className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  )}
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-4 h-4 accent-[#22c55e]"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-bold mb-1">
                  Tags & Labels
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add tag (e.g. Utility, Tax, Kids)..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                    className="flex-grow p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    Add
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 text-[10px] font-bold flex items-center gap-1">
                        #{tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-rose-500">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#22c55e] text-white font-bold hover:bg-[#1ea34d] shadow-md shadow-[#22c55e]/20"
                >
                  {editingReminder ? 'Update Reminder' : 'Save Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
