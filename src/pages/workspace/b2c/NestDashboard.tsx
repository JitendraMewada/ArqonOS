import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Wallet, 
  Receipt, 
  PiggyBank, 
  PieChart, 
  HelpCircle, 
  PlusCircle, 
  Sparkles, 
  ChevronRight, 
  PanelLeftClose, 
  PanelLeft, 
  Sun, 
  Moon, 
  ArrowLeft, 
  LogOut, 
  Layers,
  Search,
  Menu,
  Coins,
  Bell,
  CheckSquare,
  Scale,
  Send,
  History
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { cn } from '../../../lib/utils';
import { 
  NestGroup, 
  NestMember, 
  NestTransaction, 
  NestBudget, 
  NestSavingsGoal, 
  NestVault,
  NestRecurringRule,
  NestReminderItem,
  NestReconciliationRecord,
  NestMemberNudge 
} from './types';
import { 
  INITIAL_NEST_GROUP, 
  INITIAL_NEST_MEMBERS, 
  INITIAL_NEST_TRANSACTIONS, 
  INITIAL_NEST_BUDGETS, 
  INITIAL_NEST_SAVINGS, 
  INITIAL_NEST_VAULTS,
  INITIAL_NEST_RECURRING_RULES,
  INITIAL_NEST_REMINDERS,
  INITIAL_RECONCILIATION_HISTORY,
  INITIAL_MEMBER_NUDGES
} from './mockNestData';

// Subcomponents
import { NestOverview } from './components/NestOverview';
import { NestExpenses } from './components/NestExpenses';
import { NestBudgets } from './components/NestBudgets';
import { NestSavings } from './components/NestSavings';
import { NestFamily } from './components/NestFamily';
import { NestAnalytics } from './components/NestAnalytics';
import { NestTimelineHistory } from './components/NestTimelineHistory';
import { NestReminders } from './components/NestReminders';
import { NestHelp } from './components/NestHelp';
import { AddTransactionModal } from './components/AddTransactionModal';
import { NestRecurringModal } from './components/NestRecurringModal';
import { NestReconciliationModal } from './components/NestReconciliationModal';
import { NestMemberNudgeModal } from './components/NestMemberNudgeModal';

export function NestDashboard() {
  const [activeApp, setActiveApp] = useState<string>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // State Management
  const [group, setGroup] = useState<NestGroup>(INITIAL_NEST_GROUP);
  const [members, setMembers] = useState<NestMember[]>(INITIAL_NEST_MEMBERS);
  const [transactions, setTransactions] = useState<NestTransaction[]>(INITIAL_NEST_TRANSACTIONS);
  const [budgets, setBudgets] = useState<NestBudget[]>(INITIAL_NEST_BUDGETS);
  const [savings, setSavings] = useState<NestSavingsGoal[]>(INITIAL_NEST_SAVINGS);
  const [vaults, setVaults] = useState<NestVault[]>(INITIAL_NEST_VAULTS);
  const [recurringRules, setRecurringRules] = useState<NestRecurringRule[]>(INITIAL_NEST_RECURRING_RULES);
  const [reminders, setReminders] = useState<NestReminderItem[]>(INITIAL_NEST_REMINDERS);

  // Proactive Safety Net State (Reconciliation & Nudges)
  const [reconciliationHistory, setReconciliationHistory] = useState<NestReconciliationRecord[]>(INITIAL_RECONCILIATION_HISTORY);
  const [isReconciliationOpen, setIsReconciliationOpen] = useState(false);
  const [nudges, setNudges] = useState<NestMemberNudge[]>(INITIAL_MEMBER_NUDGES);
  const [isNudgeModalOpen, setIsNudgeModalOpen] = useState(false);
  const [nudgePreselectedMemberId, setNudgePreselectedMemberId] = useState<string | undefined>(undefined);

  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<NestTransaction | null>(null);

  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [editingRecurringRule, setEditingRecurringRule] = useState<NestRecurringRule | null>(null);
  const hasAutoProcessedRef = useRef(false);

  // Auto-execution check for due recurring items
  useEffect(() => {
    if (hasAutoProcessedRef.current) return;
    hasAutoProcessedRef.current = true;

    const todayStr = new Date().toISOString().split('T')[0];
    const newGeneratedTransactions: NestTransaction[] = [];
    let updatedRules = false;

    const nextRules = recurringRules.map(rule => {
      if (rule.isActive && rule.autoProcess && rule.nextDueDate && rule.nextDueDate <= todayStr) {
        if (rule.lastExecutedDate !== todayStr) {
          updatedRules = true;
          const isIncome = rule.type === 'income';
          const newTx: NestTransaction = {
            id: `rec_tx_${rule.id}_${todayStr}_${Math.random().toString(36).slice(2, 8)}`,
            title: `[Auto-Recurring] ${rule.title}`,
            amount: isIncome ? Math.abs(rule.amount) : -Math.abs(rule.amount),
            type: isIncome ? 'income' : 'expense',
            category: rule.category,
            date: todayStr,
            paidByMemberId: rule.paidByMemberId,
            paidByMemberName: rule.paidByMemberName,
            splitWithMemberIds: rule.splitWithMemberIds,
            splitType: rule.splitType,
            status: 'settled',
            recurringRuleId: rule.id,
            isRecurringGenerated: true
          };
          newGeneratedTransactions.push(newTx);

          // Calculate next due date (approx 1 month ahead)
          const nextDateObj = new Date(rule.nextDueDate);
          nextDateObj.setMonth(nextDateObj.getMonth() + 1);
          const nextDue = nextDateObj.toISOString().split('T')[0];

          return {
            ...rule,
            lastExecutedDate: todayStr,
            nextDueDate: nextDue
          };
        }
      }
      return rule;
    });

    if (newGeneratedTransactions.length > 0) {
      setTransactions(prev => {
        // Prevent duplicate auto-generated transactions for the same rule and date
        const existingRuleDateKeys = new Set(
          prev.filter(t => t.recurringRuleId && t.date).map(t => `${t.recurringRuleId}_${t.date}`)
        );
        const filteredNew = newGeneratedTransactions.filter(
          t => !existingRuleDateKeys.has(`${t.recurringRuleId}_${t.date}`)
        );
        return [...filteredNew, ...prev];
      });
      if (updatedRules) {
        setRecurringRules(nextRules);
      }
    }
  }, []);

  const handleOpenAddTransaction = () => {
    setEditingTransaction(null);
    setIsAddTxOpen(true);
  };

  const handleOpenEditTransaction = (tx: NestTransaction) => {
    setEditingTransaction(tx);
    setIsAddTxOpen(true);
  };

  const handleSaveTransaction = (savedTx: NestTransaction, recurringRule?: Partial<NestRecurringRule>) => {
    const existingIndex = transactions.findIndex(t => t.id === savedTx.id);

    if (existingIndex >= 0) {
      // Editing existing transaction
      const oldTx = transactions[existingIndex];
      const updatedTransactions = [...transactions];
      updatedTransactions[existingIndex] = savedTx;
      setTransactions(updatedTransactions);

      // Re-calculate budget spent
      setBudgets(budgets.map(b => {
        let spent = b.currentSpent;
        if (oldTx.type === 'expense' && b.category === oldTx.category) {
          spent -= Math.abs(oldTx.amount);
        }
        if (savedTx.type === 'expense' && b.category === savedTx.category) {
          spent += Math.abs(savedTx.amount);
        }
        return { ...b, currentSpent: Math.max(0, spent) };
      }));
    } else {
      // New transaction
      setTransactions([savedTx, ...transactions]);

      // If it's an expense, update matching category budget spent
      if (savedTx.type === 'expense') {
        setBudgets(budgets.map(b => {
          if (b.category === savedTx.category) {
            return { ...b, currentSpent: b.currentSpent + Math.abs(savedTx.amount) };
          }
          return b;
        }));
      }

      // If recurring rule was created alongside
      if (recurringRule && recurringRule.title) {
        const newRule: NestRecurringRule = {
          id: `rec_${Date.now()}`,
          title: recurringRule.title,
          amount: recurringRule.amount || Math.abs(savedTx.amount),
          type: (recurringRule.type || savedTx.type) as any,
          category: (recurringRule.category || savedTx.category) as any,
          frequency: recurringRule.frequency || 'monthly',
          dayOfMonth: recurringRule.dayOfMonth || 1,
          paidByMemberId: recurringRule.paidByMemberId || savedTx.paidByMemberId,
          paidByMemberName: recurringRule.paidByMemberName || savedTx.paidByMemberName,
          splitWithMemberIds: recurringRule.splitWithMemberIds || savedTx.splitWithMemberIds,
          splitType: recurringRule.splitType || savedTx.splitType,
          isActive: true,
          nextDueDate: recurringRule.nextDueDate || new Date().toISOString().split('T')[0],
          autoProcess: true
        };
        setRecurringRules(prev => [...prev, newRule]);
      }
    }
  };

  const handleDeleteTransaction = (id: string) => {
    const txToDelete = transactions.find(t => t.id === id);
    if (txToDelete && txToDelete.type === 'expense') {
      setBudgets(budgets.map(b => {
        if (b.category === txToDelete.category) {
          return { ...b, currentSpent: Math.max(0, b.currentSpent - Math.abs(txToDelete.amount)) };
        }
        return b;
      }));
    }
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Recurring Rule handlers
  const handleOpenAddRecurringRule = () => {
    setEditingRecurringRule(null);
    setIsRecurringModalOpen(true);
  };

  const handleOpenEditRecurringRule = (rule: NestRecurringRule) => {
    setEditingRecurringRule(rule);
    setIsRecurringModalOpen(true);
  };

  const handleDeleteRecurringRule = (id: string) => {
    setRecurringRules(recurringRules.filter(r => r.id !== id));
  };

  const handleToggleRecurringRule = (id: string) => {
    setRecurringRules(recurringRules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  const handleSaveRecurringRule = (rule: NestRecurringRule) => {
    const idx = recurringRules.findIndex(r => r.id === rule.id);
    if (idx >= 0) {
      const updated = [...recurringRules];
      updated[idx] = rule;
      setRecurringRules(updated);
    } else {
      setRecurringRules([...recurringRules, rule]);
    }
    setIsRecurringModalOpen(false);
  };

  const handleExecuteRecurringRule = (rule: NestRecurringRule) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const isIncome = rule.type === 'income';
    const newTx: NestTransaction = {
      id: `rec_manual_${Date.now()}_${rule.id}`,
      title: rule.title,
      amount: isIncome ? Math.abs(rule.amount) : -Math.abs(rule.amount),
      type: isIncome ? 'income' : 'expense',
      category: rule.category,
      date: todayStr,
      paidByMemberId: rule.paidByMemberId,
      paidByMemberName: rule.paidByMemberName,
      splitWithMemberIds: rule.splitWithMemberIds,
      splitType: rule.splitType,
      status: 'settled',
      recurringRuleId: rule.id,
      isRecurringGenerated: true
    };

    setTransactions(prev => [newTx, ...prev]);

    // Update rule last executed date
    setRecurringRules(prev => prev.map(r => {
      if (r.id === rule.id) {
        const nextDateObj = new Date(rule.nextDueDate || todayStr);
        nextDateObj.setMonth(nextDateObj.getMonth() + 1);
        return {
          ...r,
          lastExecutedDate: todayStr,
          nextDueDate: nextDateObj.toISOString().split('T')[0]
        };
      }
      return r;
    }));
  };

  const handleExecuteAllDueRecurring = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newTxs: NestTransaction[] = [];

    const updatedRules = recurringRules.map(rule => {
      if (rule.isActive && rule.nextDueDate && rule.nextDueDate <= todayStr) {
        const isIncome = rule.type === 'income';
        newTxs.push({
          id: `rec_bulk_${Date.now()}_${rule.id}`,
          title: rule.title,
          amount: isIncome ? Math.abs(rule.amount) : -Math.abs(rule.amount),
          type: isIncome ? 'income' : 'expense',
          category: rule.category,
          date: todayStr,
          paidByMemberId: rule.paidByMemberId,
          paidByMemberName: rule.paidByMemberName,
          splitWithMemberIds: rule.splitWithMemberIds,
          splitType: rule.splitType,
          status: 'settled',
          recurringRuleId: rule.id,
          isRecurringGenerated: true
        });

        const nextDateObj = new Date(rule.nextDueDate);
        nextDateObj.setMonth(nextDateObj.getMonth() + 1);
        return {
          ...rule,
          lastExecutedDate: todayStr,
          nextDueDate: nextDateObj.toISOString().split('T')[0]
        };
      }
      return rule;
    });

    if (newTxs.length > 0) {
      setTransactions(prev => [...newTxs, ...prev]);
      setRecurringRules(updatedRules);
    }
  };

  // Batch Family Allowance Disbursement
  const handleDisburseAllowances = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newAllowanceTransactions: NestTransaction[] = [];

    members.forEach(member => {
      if ((member.monthlyAllowance || 0) > 0) {
        newAllowanceTransactions.push({
          id: `allowance_${Date.now()}_${member.id}`,
          title: `Monthly Discretionary Allowance (${member.name.split(' ')[0]})`,
          amount: -Math.abs(member.monthlyAllowance || 0),
          type: 'expense',
          category: 'Income & Allowance',
          date: todayStr,
          paidByMemberId: member.id,
          paidByMemberName: member.name,
          splitWithMemberIds: [member.id],
          splitType: 'exact',
          status: 'settled',
          notes: `Automated allowance allocation for ${member.name}`
        });
      }
    });

    if (newAllowanceTransactions.length > 0) {
      setTransactions(prev => [...newAllowanceTransactions, ...prev]);
    }
  };

  // Proactive Safety Net Handlers (Reconciliation & Nudges)
  const handleApplyAdjustmentTransaction = (tx: NestTransaction) => {
    setTransactions(prev => [tx, ...prev]);
    if (tx.type === 'expense') {
      setBudgets(prevBudgets => prevBudgets.map(b => {
        if (b.category === tx.category) {
          return { ...b, currentSpent: b.currentSpent + Math.abs(tx.amount) };
        }
        return b;
      }));
    }
  };

  const handleSaveAuditRecord = (record: NestReconciliationRecord) => {
    setReconciliationHistory(prev => [record, ...prev]);
  };

  const handleSendNudge = (nudge: NestMemberNudge) => {
    setNudges(prev => [nudge, ...prev]);
  };

  const handleAcknowledgeNudge = (nudgeId: string) => {
    setNudges(prev => prev.map(n => n.id === nudgeId ? { ...n, isAcknowledged: true } : n));
  };

  const handleDeleteNudge = (nudgeId: string) => {
    setNudges(prev => prev.filter(n => n.id !== nudgeId));
  };

  const handleOpenNudgeCenterWithMember = (memberId?: unknown) => {
    if (typeof memberId === 'string') {
      setNudgePreselectedMemberId(memberId);
    } else {
      setNudgePreselectedMemberId(undefined);
    }
    setIsNudgeModalOpen(true);
  };

  // Reminder & Checklist Handlers
  const handleAddReminder = (reminder: NestReminderItem) => {
    setReminders(prev => [reminder, ...prev]);
  };

  const handleUpdateReminder = (updatedItem: NestReminderItem) => {
    setReminders(prev => prev.map(r => r.id === updatedItem.id ? updatedItem : r));
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const handleToggleCompleteReminder = (id: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const isCompleted = r.status === 'completed';
        return {
          ...r,
          status: isCompleted ? 'pending' : 'completed',
          completedAt: isCompleted ? undefined : todayStr
        };
      }
      return r;
    }));
  };

  const handleSnoozeReminder = (id: string, days: number) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const currentDue = new Date(r.dueDate);
        currentDue.setDate(currentDue.getDate() + days);
        return {
          ...r,
          dueDate: currentDue.toISOString().split('T')[0],
          status: 'pending'
        };
      }
      return r;
    }));
  };

  // Urgent pending count for badges
  const urgentRemindersCount = reminders.filter(r => {
    if (r.status === 'completed') return false;
    const today = new Date(new Date().toISOString().split('T')[0]);
    const target = new Date(r.dueDate);
    const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 0 || r.priority === 'urgent';
  }).length;

  const nestApps = [
    { id: 'overview', name: 'Dashboard Overview', icon: Layers },
    { id: 'expenses', name: 'Expenses & Ledger', icon: Receipt },
    { id: 'timeline', name: 'Timeline & History', icon: History },
    { id: 'reminders', name: 'Reminders & Tasks', icon: Bell, badge: urgentRemindersCount > 0 ? urgentRemindersCount : undefined },
    { id: 'budgets', name: 'Category Budgets', icon: Wallet },
    { id: 'savings', name: 'Savings & Vaults', icon: PiggyBank },
    { id: 'family', name: 'Family & Allowances', icon: Users },
    { id: 'analytics', name: 'Financial Insights', icon: PieChart },
    { id: 'help', name: 'Help & Quick Guide', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col lg:flex-row p-4 gap-4 font-sans lg:h-screen lg:overflow-hidden relative transition-colors duration-300">
       
       {/* Mobile Overlay */}
       <div 
         className={cn(
           "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
           isSidebarMobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
         )}
         onClick={() => setIsSidebarMobileOpen(false)}
       />

       {/* Sidebar */}
       <aside className={cn(
         "lg:flex flex-shrink-0 flex flex-col gap-4 transition-all duration-300 fixed lg:relative inset-y-0 left-0 bg-slate-50 dark:bg-slate-950 lg:bg-transparent z-50 p-4 lg:p-0",
         isSidebarMobileOpen ? "translate-x-0 w-80 shadow-2xl" : "-translate-x-full lg:translate-x-0",
         isSidebarCollapsed ? "lg:w-[100px]" : "lg:w-80"
       )}>
          {/* Logo Card */}
          <div className={cn("bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl flex items-center transition-all duration-300", isSidebarCollapsed ? "lg:p-4 lg:justify-center h-[88px]" : "p-6 gap-3 h-[88px]")}>
             <div className="w-10 h-10 shrink-0 flex items-center justify-center">
               <div className="grid grid-cols-2 gap-1 w-8 h-8">
                 <div className="bg-[#22c55e] rounded-[2px]"></div>
                 <div className="bg-[#22c55e] rounded-[2px] opacity-80"></div>
                 <div className="bg-[#22c55e] rounded-[2px] opacity-60"></div>
                 <div className="bg-[#22c55e] rounded-[2px] opacity-40"></div>
               </div>
             </div>
             {(!isSidebarCollapsed || isSidebarMobileOpen) && (
               <div className="animate-in fade-in duration-300 overflow-hidden whitespace-nowrap">
                 <h2 className="font-bold tracking-tight text-lg text-slate-900 dark:text-white leading-tight">Arqon Nest</h2>
                 <p className="text-xs font-semibold uppercase tracking-wider text-[#22c55e]">B2C Workspace</p>
               </div>
             )}
          </div>

          {/* Nav Pills Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4 rounded-xl flex-grow overflow-y-auto custom-scrollbar space-y-2 transition-colors">
             <div className={cn("flex items-center mb-4 mt-2 px-2 transition-all duration-300", (isSidebarCollapsed && !isSidebarMobileOpen) ? "justify-center" : "justify-between")}>
                {(!isSidebarCollapsed || isSidebarMobileOpen) && <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Space</div>}
             </div>
             {nestApps.map(app => (
               <button 
                 key={app.id} 
                 onClick={() => { setActiveApp(app.id); if(isSidebarMobileOpen) setIsSidebarMobileOpen(false); }}
                 className={cn(
                   "w-full flex items-center p-3 rounded-lg transition-all border",
                   activeApp === app.id ? "bg-[#22c55e]/10 border-[#22c55e]/30 text-[#22c55e]" : "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400",
                   (isSidebarCollapsed && !isSidebarMobileOpen) ? "justify-center" : "justify-between"
                 )}
                 title={isSidebarCollapsed ? app.name : undefined}
               >
                 <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg shrink-0 flex items-center justify-center transition-colors relative", activeApp === app.id ? "bg-[#22c55e] text-white shadow-md shadow-[#22c55e]/20" : "bg-slate-100 dark:bg-slate-800")}>
                      <app.icon className="w-4 h-4" />
                      {isSidebarCollapsed && !isSidebarMobileOpen && app.badge && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                      )}
                    </div>
                    {(!isSidebarCollapsed || isSidebarMobileOpen) && <span className="font-semibold text-sm whitespace-nowrap">{app.name}</span>}
                 </div>
                 {(!isSidebarCollapsed || isSidebarMobileOpen) && (
                   <div className="flex items-center gap-2">
                     {app.badge && (
                       <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-500 text-white animate-pulse">
                         {app.badge}
                       </span>
                     )}
                     <ChevronRight className={cn("w-4 h-4 text-slate-400 transition-transform", activeApp === app.id && "rotate-90")} />
                   </div>
                 )}
               </button>
             ))}
          </div>

          {/* Quick Action Card (Nest Expense Log) */}
          <div 
            onClick={handleOpenAddTransaction}
            className={cn("bg-[#22c55e] rounded-xl text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-[#22c55e]/20 transition-all duration-300 hover:bg-[#1ea34d]", isSidebarCollapsed ? "p-4 flex items-center justify-center" : "p-5")}
          >
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-md blur-2xl group-hover:scale-125 transition-transform" />
             <div className={cn("relative z-10 flex", isSidebarCollapsed ? "flex-col items-center" : "items-start gap-4")}>
                <PlusCircle className={cn("shrink-0", isSidebarCollapsed ? "w-6 h-6" : "w-8 h-8 mb-3")} />
                {(!isSidebarCollapsed || isSidebarMobileOpen) && (
                  <div>
                    <h4 className="font-bold text-sm">Add Transaction</h4>
                    <p className="text-[10px] text-white/80 font-medium">Quickly log an expense</p>
                  </div>
                )}
             </div>
          </div>
       </aside>

       {/* Main Content Area */}
       <main className="flex-grow flex flex-col gap-4 min-w-0">
          {/* Topbar Card */}
          <header className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4 h-[88px] rounded-xl flex items-center justify-between shrink-0 transition-colors">
             <div className="flex items-center gap-2 sm:gap-4 px-1 sm:px-2">
                <button 
                  onClick={() => setIsSidebarMobileOpen(true)}
                  className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <button 
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="hidden lg:flex w-10 h-10 rounded-lg items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 flex-shrink-0"
                >
                   {isSidebarCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                </button>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

                <div className="hidden sm:flex items-center bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-lg border border-slate-100 dark:border-slate-800 shadow-inner">
                  <div className="flex items-center gap-3">
                    <div className="px-2 py-0.5 bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-[9px] font-black uppercase tracking-tight rounded-md">
                      Nest Plus
                    </div>
                    <div className="h-3 w-px bg-slate-200 dark:bg-slate-800"></div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Users className="w-3 h-3 text-[#22c55e]" /> {group.name} ({members.length} Members)
                    </div>
                  </div>
                </div>
             </div>

             <div className="flex items-center gap-3">
                {/* Reminders / Notifications Alert Button */}
                <button
                  onClick={() => setActiveApp('reminders')}
                  className={cn(
                    "relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors border",
                    activeApp === 'reminders'
                      ? "bg-[#22c55e]/10 border-[#22c55e]/30 text-[#22c55e]"
                      : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  )}
                  title="Upcoming Reminders & Checklist"
                >
                  <Bell className="w-5 h-5" />
                  {urgentRemindersCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-ping" />
                  )}
                  {urgentRemindersCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </button>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

                <button
                  onClick={toggleTheme}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                   {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
                <Link to="/" className="px-3 py-1.5 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hidden sm:flex">
                  <ArrowLeft className="w-3 h-3 mr-1.5" /> Marketing
                </Link>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 cursor-pointer group hover:bg-white dark:hover:bg-slate-900 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-[#2c3e50] flex items-center justify-center text-white overflow-hidden shadow-sm">
                     <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                     <span className="text-xs font-bold text-slate-900 dark:text-white transition-colors group-hover:text-[#22c55e]">Jitendra Mewada</span>
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Family Organizer</span>
                  </div>
                </div>
                <Link to="/gateway" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <LogOut className="w-5 h-5" />
                </Link>
             </div>
          </header>

          {/* Dynamic Module Canvas */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 rounded-xl flex-grow overflow-y-auto custom-scrollbar relative transition-colors">
              <div className="max-w-6xl mx-auto">
                 {activeApp === 'overview' && (
                   <NestOverview
                     group={group}
                     members={members}
                     transactions={transactions}
                     budgets={budgets}
                     savings={savings}
                     reminders={reminders}
                     reconciliationHistory={reconciliationHistory}
                     nudges={nudges}
                     onToggleCompleteReminder={handleToggleCompleteReminder}
                     onAddTransaction={handleOpenAddTransaction}
                     onOpenReconciliation={() => setIsReconciliationOpen(true)}
                     onOpenNudgeCenter={handleOpenNudgeCenterWithMember}
                     onNavigateTab={(tab) => setActiveApp(tab)}
                   />
                 )}

                 {activeApp === 'expenses' && (
                   <NestExpenses
                     group={group}
                     members={members}
                     transactions={transactions}
                     recurringRules={recurringRules}
                     onAddTransaction={handleOpenAddTransaction}
                     onEditTransaction={handleOpenEditTransaction}
                     onDeleteTransaction={handleDeleteTransaction}
                     onAddRecurringRule={handleOpenAddRecurringRule}
                     onEditRecurringRule={handleOpenEditRecurringRule}
                     onDeleteRecurringRule={handleDeleteRecurringRule}
                     onToggleRecurringActive={handleToggleRecurringRule}
                     onExecuteRecurringRule={handleExecuteRecurringRule}
                     onExecuteAllDueRecurring={handleExecuteAllDueRecurring}
                     onOpenReconciliation={() => setIsReconciliationOpen(true)}
                   />
                 )}

                 {activeApp === 'reminders' && (
                   <NestReminders
                     group={group}
                     members={members}
                     reminders={reminders}
                     budgets={budgets}
                     savings={savings}
                     vaults={vaults}
                     onAddReminder={handleAddReminder}
                     onUpdateReminder={handleUpdateReminder}
                     onDeleteReminder={handleDeleteReminder}
                     onToggleCompleteReminder={handleToggleCompleteReminder}
                     onSnoozeReminder={handleSnoozeReminder}
                     onNavigateTab={(tab) => setActiveApp(tab)}
                   />
                 )}

                 {activeApp === 'budgets' && (
                   <NestBudgets
                     group={group}
                     budgets={budgets}
                     onUpdateBudget={setBudgets}
                   />
                 )}

                 {activeApp === 'savings' && (
                   <NestSavings
                     group={group}
                     members={members}
                     savings={savings}
                     vaults={vaults}
                     onUpdateSavings={setSavings}
                     onUpdateVaults={setVaults}
                   />
                 )}

                 {activeApp === 'family' && (
                   <NestFamily
                     group={group}
                     members={members}
                     nudges={nudges}
                     onUpdateMembers={setMembers}
                     onUpdateGroup={setGroup}
                     onDisburseAllowances={handleDisburseAllowances}
                     onOpenNudgeCenter={handleOpenNudgeCenterWithMember}
                   />
                 )}

                 {activeApp === 'analytics' && (
                   <NestAnalytics
                     group={group}
                     members={members}
                     transactions={transactions}
                     budgets={budgets}
                   />
                 )}

                 {activeApp === 'help' && (
                   <NestHelp />
                  )}

                  {activeApp === 'timeline' && (
                    <NestTimelineHistory
                      group={group}
                      members={members}
                      transactions={transactions}
                      budgets={budgets}
                      savings={savings}
                      vaults={vaults}
                      recurringRules={recurringRules}
                      onAddTransaction={() => handleOpenAddTransaction()}
                      onOpenReconciliation={() => setIsReconciliationOpen(true)}
                    />
                 )}
              </div>
          </div>
       </main>

       {/* Add / Edit Transaction Modal */}
       <AddTransactionModal
         isOpen={isAddTxOpen}
         onClose={() => {
           setIsAddTxOpen(false);
           setEditingTransaction(null);
         }}
         group={group}
         members={members}
         transaction={editingTransaction}
         onSave={handleSaveTransaction}
       />

       {/* Add / Edit Recurring Rule Modal */}
       <NestRecurringModal
         isOpen={isRecurringModalOpen}
         onClose={() => {
           setIsRecurringModalOpen(false);
           setEditingRecurringRule(null);
         }}
         group={group}
         members={members}
         savings={savings}
         vaults={vaults}
         rule={editingRecurringRule}
         onSaveRule={handleSaveRecurringRule}
       />

       {/* Proactive Safety Net: Bank & Balance Reconciliation Modal */}
       <NestReconciliationModal
         isOpen={isReconciliationOpen}
         onClose={() => setIsReconciliationOpen(false)}
         group={group}
         members={members}
         transactions={transactions}
         reconciliationHistory={reconciliationHistory}
         onApplyAdjustmentTransaction={handleApplyAdjustmentTransaction}
         onSaveAuditRecord={handleSaveAuditRecord}
       />

       {/* Proactive Safety Net: Member Nudge Center Modal */}
       <NestMemberNudgeModal
         isOpen={isNudgeModalOpen}
         onClose={() => {
           setIsNudgeModalOpen(false);
           setNudgePreselectedMemberId(undefined);
         }}
         group={group}
         members={members}
         transactions={transactions}
         nudges={nudges}
         preselectedMemberId={nudgePreselectedMemberId}
         onSendNudge={handleSendNudge}
         onAcknowledgeNudge={handleAcknowledgeNudge}
         onDeleteNudge={handleDeleteNudge}
       />

    </div>
  );
}
