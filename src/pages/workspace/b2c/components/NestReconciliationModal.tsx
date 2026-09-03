import React, { useState, useMemo } from 'react';
import { 
  X, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  History, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Sparkles, 
  FileSpreadsheet, 
  ShieldCheck, 
  TrendingDown, 
  TrendingUp, 
  Coins, 
  Receipt,
  HelpCircle,
  Clock,
  UserCheck
} from 'lucide-react';
import { 
  NestGroup, 
  NestMember, 
  NestTransaction, 
  NestReconciliationRecord,
  ExpenseCategory 
} from '../types';
import { cn } from '../../../../lib/utils';

interface NestReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: NestGroup;
  members: NestMember[];
  transactions: NestTransaction[];
  reconciliationHistory: NestReconciliationRecord[];
  onApplyAdjustmentTransaction: (transaction: NestTransaction) => void;
  onSaveAuditRecord: (record: NestReconciliationRecord) => void;
}

interface ItemizedMissingEntry {
  id: string;
  title: string;
  amount: number;
  type: 'expense' | 'income';
  category: ExpenseCategory;
  paidByMemberId: string;
}

export const NestReconciliationModal: React.FC<NestReconciliationModalProps> = ({
  isOpen,
  onClose,
  group,
  members,
  transactions,
  reconciliationHistory,
  onApplyAdjustmentTransaction,
  onSaveAuditRecord
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'history' | 'guide'>('audit');

  // Compute Current Ledger Net Balance
  const computedLedgerBalance = useMemo(() => {
    return transactions.reduce((acc, tx) => acc + tx.amount, 0);
  }, [transactions]);

  // Input for Actual Bank/Cash Balance
  const [actualBalanceInput, setActualBalanceInput] = useState<string>(computedLedgerBalance.toString());
  const [auditNotes, setAuditNotes] = useState<string>('');
  const [selectedResolver, setSelectedResolver] = useState<'auto' | 'itemized' | 'investigate'>('auto');

  // Itemized missing entries state
  const [itemizedEntries, setItemizedEntries] = useState<ItemizedMissingEntry[]>([]);
  const [itemTitle, setItemTitle] = useState('');
  const [itemAmount, setItemAmount] = useState('');
  const [itemType, setItemType] = useState<'expense' | 'income'>('expense');
  const [itemCategory, setItemCategory] = useState<ExpenseCategory>('Groceries');
  const [itemPaidBy, setItemPaidBy] = useState<string>(members[0]?.id || 'mem_1');

  if (!isOpen) return null;

  const numericActualBalance = parseFloat(actualBalanceInput) || 0;
  const initialDiscrepancy = numericActualBalance - computedLedgerBalance;

  // Calculate sum of added itemized entries
  const itemizedTotalNetImpact = itemizedEntries.reduce((sum, item) => {
    return item.type === 'income' ? sum + item.amount : sum - item.amount;
  }, 0);

  // Remaining discrepancy after factoring in itemized additions
  const remainingDiscrepancy = initialDiscrepancy - itemizedTotalNetImpact;

  const isExactMatch = Math.abs(initialDiscrepancy) < 0.01;
  const isResolved = Math.abs(remainingDiscrepancy) < 0.01;

  const handleAddItemizedEntry = () => {
    const amt = parseFloat(itemAmount);
    if (!itemTitle.trim() || isNaN(amt) || amt <= 0) return;

    const newEntry: ItemizedMissingEntry = {
      id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title: itemTitle.trim(),
      amount: amt,
      type: itemType,
      category: itemCategory,
      paidByMemberId: itemPaidBy
    };

    setItemizedEntries(prev => [...prev, newEntry]);
    setItemTitle('');
    setItemAmount('');
  };

  const handleRemoveItemizedEntry = (id: string) => {
    setItemizedEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleCompleteAudit = () => {
    const todayISO = new Date().toISOString();
    const todayDate = todayISO.split('T')[0];
    const currentAdmin = members.find(m => m.isCurrentUser) || members[0] || {
      id: 'mem_1',
      name: 'Group Admin'
    };

    if (isExactMatch) {
      // Perfect match audit record
      const record: NestReconciliationRecord = {
        id: `audit_${Date.now()}`,
        date: todayISO,
        ledgerBalance: computedLedgerBalance,
        actualBankBalance: numericActualBalance,
        discrepancy: 0,
        reconciledByMemberId: currentAdmin.id,
        reconciledByMemberName: currentAdmin.name,
        status: 'matched',
        notes: auditNotes || '100% matched with actual bank and cash balance.'
      };
      onSaveAuditRecord(record);
      onClose();
      return;
    }

    if (selectedResolver === 'auto') {
      // 1-Click Auto Adjustment
      const isUnrecordedExpense = initialDiscrepancy < 0;
      const adjustmentAmount = Math.abs(initialDiscrepancy);
      const adjTxId = `tx_adj_${Date.now()}`;

      const adjTx: NestTransaction = {
        id: adjTxId,
        title: `[Reconciliation Adjustment] ${isUnrecordedExpense ? 'Unrecorded Outflow / Expense Correction' : 'Unrecorded Inflow / Deposit Correction'}`,
        amount: isUnrecordedExpense ? -adjustmentAmount : adjustmentAmount,
        type: isUnrecordedExpense ? 'expense' : 'income',
        category: isUnrecordedExpense ? 'Rent & Utilities' : 'Income & Allowance',
        date: todayDate,
        paidByMemberId: currentAdmin.id,
        paidByMemberName: currentAdmin.name,
        splitWithMemberIds: members.map(m => m.id),
        splitType: 'equal',
        status: 'settled',
        notes: `Auto-generated balance reconciliation correction signed off by ${currentAdmin.name}. ${auditNotes}`.trim()
      };

      onApplyAdjustmentTransaction(adjTx);

      const record: NestReconciliationRecord = {
        id: `audit_${Date.now()}`,
        date: todayISO,
        ledgerBalance: computedLedgerBalance,
        actualBankBalance: numericActualBalance,
        discrepancy: initialDiscrepancy,
        reconciledByMemberId: currentAdmin.id,
        reconciledByMemberName: currentAdmin.name,
        status: 'adjusted',
        notes: auditNotes || `Auto-adjusted with 1-click ledger correction of ${group.currency}${adjustmentAmount.toLocaleString()}.`,
        adjustmentTransactionId: adjTxId
      };
      onSaveAuditRecord(record);
      onClose();
      return;
    }

    if (selectedResolver === 'itemized') {
      // Post all itemized entries
      itemizedEntries.forEach(item => {
        const member = members.find(m => m.id === item.paidByMemberId) || currentAdmin;
        const tx: NestTransaction = {
          id: `tx_rec_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          title: `[Reconciled Catch-up] ${item.title}`,
          amount: item.type === 'income' ? item.amount : -item.amount,
          type: item.type,
          category: item.category,
          date: todayDate,
          paidByMemberId: member.id,
          paidByMemberName: member.name,
          splitWithMemberIds: members.map(m => m.id),
          splitType: 'equal',
          status: 'settled',
          notes: `Added during ledger reconciliation audit by ${currentAdmin.name}.`
        };
        onApplyAdjustmentTransaction(tx);
      });

      // If there's still any remaining discrepancy, post a minor adjustment
      if (Math.abs(remainingDiscrepancy) >= 1) {
        const isRemainingExpense = remainingDiscrepancy < 0;
        const remainingAmt = Math.abs(remainingDiscrepancy);
        const minorAdjTx: NestTransaction = {
          id: `tx_adj_rem_${Date.now()}`,
          title: `[Reconciliation] Residual Balance Correction`,
          amount: isRemainingExpense ? -remainingAmt : remainingAmt,
          type: isRemainingExpense ? 'expense' : 'income',
          category: 'Shared Vaults',
          date: todayDate,
          paidByMemberId: currentAdmin.id,
          paidByMemberName: currentAdmin.name,
          splitWithMemberIds: members.map(m => m.id),
          splitType: 'equal',
          status: 'settled',
          notes: `Residual gap adjustment after itemized catch-up.`
        };
        onApplyAdjustmentTransaction(minorAdjTx);
      }

      const record: NestReconciliationRecord = {
        id: `audit_${Date.now()}`,
        date: todayISO,
        ledgerBalance: computedLedgerBalance,
        actualBankBalance: numericActualBalance,
        discrepancy: initialDiscrepancy,
        reconciledByMemberId: currentAdmin.id,
        reconciledByMemberName: currentAdmin.name,
        status: 'adjusted',
        notes: auditNotes || `Reconciled via ${itemizedEntries.length} itemized catch-up entries.`
      };
      onSaveAuditRecord(record);
      onClose();
      return;
    }

    if (selectedResolver === 'investigate') {
      // Mark for investigation without adding transactions
      const record: NestReconciliationRecord = {
        id: `audit_${Date.now()}`,
        date: todayISO,
        ledgerBalance: computedLedgerBalance,
        actualBankBalance: numericActualBalance,
        discrepancy: initialDiscrepancy,
        reconciledByMemberId: currentAdmin.id,
        reconciledByMemberName: currentAdmin.name,
        status: 'pending_investigation',
        notes: auditNotes || 'Flagged for investigation. Receipts and statements being gathered.'
      };
      onSaveAuditRecord(record);
      onClose();
    }
  };

  const categories: ExpenseCategory[] = [
    'Groceries',
    'Rent & Utilities',
    'Dining & Food',
    'Transport',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Education',
    'Vacation & Travel',
    'Shared Vaults',
    'Income & Allowance'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/5 via-slate-50 to-transparent dark:from-emerald-500/10 dark:via-slate-900 dark:to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Bank & Ledger Reconciliation Assistant
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20">
                  Audit Safe
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Detect, catch up, and balance missed expenses, income, or savings against your actual bank account.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('audit')}
            className={cn(
              "py-3.5 border-b-2 flex items-center gap-2 transition-colors",
              activeTab === 'audit'
                ? "border-[#22c55e] text-[#22c55e]"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            )}
          >
            <Scale className="w-4 h-4" />
            <span>Audit & Balance Comparison</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              "py-3.5 border-b-2 flex items-center gap-2 transition-colors",
              activeTab === 'history'
                ? "border-[#22c55e] text-[#22c55e]"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            )}
          >
            <History className="w-4 h-4" />
            <span>Audit History & Sign-Offs</span>
            {reconciliationHistory.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {reconciliationHistory.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={cn(
              "py-3.5 border-b-2 flex items-center gap-2 transition-colors",
              activeTab === 'guide'
                ? "border-[#22c55e] text-[#22c55e]"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            )}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Audit Best Practices</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {activeTab === 'audit' && (
            <>
              {/* Balance Comparison Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. App Ledger Balance */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    1. Nest Recorded Ledger
                  </span>
                  <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {group.currency}{computedLedgerBalance.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Calculated from {transactions.length} total logged transactions
                  </p>
                </div>

                {/* 2. Actual Bank / Cash Pool Balance Input */}
                <div className="p-4 rounded-xl bg-[#22c55e]/5 dark:bg-[#22c55e]/10 border border-[#22c55e]/30">
                  <span className="text-[11px] font-bold text-[#22c55e] uppercase tracking-wider block mb-1">
                    2. Actual Bank / Cash Balance
                  </span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400">
                      {group.currency}
                    </span>
                    <input
                      type="number"
                      step="any"
                      value={actualBalanceInput}
                      onChange={(e) => setActualBalanceInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-[#22c55e]/40 text-lg font-black font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                      placeholder="Enter actual bank balance"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Current balance shown on your net banking app / cashbox
                  </p>
                </div>

                {/* 3. Discrepancy Status */}
                <div className={cn(
                  "p-4 rounded-xl border flex flex-col justify-between",
                  isExactMatch 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : initialDiscrepancy < 0
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                      : "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
                )}>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider block mb-1 opacity-90">
                      3. Calculated Discrepancy
                    </span>
                    <div className="text-2xl font-black font-mono">
                      {initialDiscrepancy > 0 ? '+' : ''}{group.currency}{initialDiscrepancy.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-[11px] font-medium mt-1 flex items-center gap-1.5">
                    {isExactMatch ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>100% Balanced & Reconciled</span>
                      </>
                    ) : initialDiscrepancy < 0 ? (
                      <>
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>Unlogged Outflow / Missing Expense</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Unlogged Inflow / Missing Income</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Diagnosis Alert Box */}
              {!isExactMatch && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3.5">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                      {initialDiscrepancy < 0 
                        ? `Ledger Overstated by ${group.currency}${Math.abs(initialDiscrepancy).toLocaleString()}` 
                        : `Ledger Understated by ${group.currency}${initialDiscrepancy.toLocaleString()}`}
                    </h4>
                    <p className="text-xs text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                      {initialDiscrepancy < 0
                        ? `Your actual bank balance is lower than your Nest ledger. This usually means a member paid for groceries, bills, fuel, or dining out in cash/UPI without recording it.`
                        : `Your actual bank balance is higher than your Nest ledger. This happens when an income inflow (cash gift, dividend, salary revision, or reimbursement) was deposited but not logged.`}
                    </p>
                  </div>
                </div>
              )}

              {/* Resolution Options (Only visible when discrepancy exists) */}
              {!isExactMatch && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#22c55e]" />
                      Choose Resolution Strategy
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    
                    {/* Option 1: 1-Click Auto Adjustment */}
                    <button
                      type="button"
                      onClick={() => setSelectedResolver('auto')}
                      className={cn(
                        "p-4 rounded-xl border text-left transition-all relative",
                        selectedResolver === 'auto'
                          ? "bg-[#22c55e]/10 border-[#22c55e] ring-2 ring-[#22c55e]/30 shadow-md"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                      )}
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#22c55e]/20 text-[#22c55e] flex items-center justify-center mb-2">
                        <Coins className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        1-Click Balance Adjustment
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Instantly posts a balancing entry of {group.currency}{Math.abs(initialDiscrepancy).toLocaleString()} to make the ledger 100% accurate.
                      </p>
                    </button>

                    {/* Option 2: Itemized Catch-Up Entry */}
                    <button
                      type="button"
                      onClick={() => setSelectedResolver('itemized')}
                      className={cn(
                        "p-4 rounded-xl border text-left transition-all relative",
                        selectedResolver === 'itemized'
                          ? "bg-[#22c55e]/10 border-[#22c55e] ring-2 ring-[#22c55e]/30 shadow-md"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                      )}
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center mb-2">
                        <Receipt className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Itemized Catch-Up Entry
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Add individual missing expenses or bills to identify exactly where the money went.
                      </p>
                    </button>

                    {/* Option 3: Investigate Later */}
                    <button
                      type="button"
                      onClick={() => setSelectedResolver('investigate')}
                      className={cn(
                        "p-4 rounded-xl border text-left transition-all relative",
                        selectedResolver === 'investigate'
                          ? "bg-[#22c55e]/10 border-[#22c55e] ring-2 ring-[#22c55e]/30 shadow-md"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                      )}
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center mb-2">
                        <Clock className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Flag for Review
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Save audit note without mutating ledger while members check credit card / UPI receipts.
                      </p>
                    </button>
                  </div>

                  {/* Itemized Builder Area */}
                  {selectedResolver === 'itemized' && (
                    <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Add Missing Item Details
                        </span>
                        <span className={cn(
                          "text-xs font-mono font-bold px-2 py-0.5 rounded-md",
                          isResolved 
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        )}>
                          Remaining Gap: {group.currency}{Math.abs(remainingDiscrepancy).toLocaleString()}
                        </span>
                      </div>

                      {/* Add Item Form */}
                      <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                        <input
                          type="text"
                          value={itemTitle}
                          onChange={(e) => setItemTitle(e.target.value)}
                          placeholder="e.g. Cash Vegetable Market"
                          className="sm:col-span-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-[#22c55e]"
                        />

                        <input
                          type="number"
                          value={itemAmount}
                          onChange={(e) => setItemAmount(e.target.value)}
                          placeholder={`Amount (${group.currency})`}
                          className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:ring-1 focus:ring-[#22c55e]"
                        />

                        <select
                          value={itemType}
                          onChange={(e) => setItemType(e.target.value as 'expense' | 'income')}
                          className="px-2 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-[#22c55e]"
                        >
                          <option value="expense">Expense (-)</option>
                          <option value="income">Income (+)</option>
                        </select>

                        <select
                          value={itemCategory}
                          onChange={(e) => setItemCategory(e.target.value as ExpenseCategory)}
                          className="px-2 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-[#22c55e]"
                        >
                          {categories.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={handleAddItemizedEntry}
                          className="px-3 py-2 rounded-lg bg-[#22c55e] text-white font-bold text-xs hover:bg-[#22c55e]/90 flex items-center justify-center gap-1 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add
                        </button>
                      </div>

                      {/* Itemized List */}
                      {itemizedEntries.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                          {itemizedEntries.map(item => (
                            <div 
                              key={item.id}
                              className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "w-2 h-2 rounded-full",
                                  item.type === 'income' ? "bg-emerald-500" : "bg-rose-500"
                                )} />
                                <span className="font-semibold text-slate-900 dark:text-white">
                                  {item.title}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  ({item.category})
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className={cn(
                                  "font-mono font-bold",
                                  item.type === 'income' ? "text-emerald-500" : "text-rose-500"
                                )}>
                                  {item.type === 'income' ? '+' : '-'}{group.currency}{item.amount.toLocaleString()}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItemizedEntry(item.id)}
                                  className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Audit Sign-Off Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Audit Notes & Sign-Off Remarks
                </label>
                <textarea
                  rows={2}
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  placeholder="e.g., Verified against HDFC savings account and Google Pay UPI transaction logs for late August."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                />
              </div>
            </>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Reconciliation Audit History
                </h3>
                <span className="text-xs text-slate-500">
                  {reconciliationHistory.length} Recorded Audits
                </span>
              </div>

              {reconciliationHistory.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800">
                  <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-500">No audits recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reconciliationHistory.map(record => (
                    <div 
                      key={record.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                            record.status === 'matched' 
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : record.status === 'adjusted'
                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          )}>
                            {record.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {record.notes}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Audited by {record.reconciledByMemberName}</span>
                        </div>
                      </div>

                      <div className="text-right space-y-0.5 shrink-0">
                        <div className="text-[11px] text-slate-400 font-medium">Bank Balance</div>
                        <div className="text-sm font-mono font-black text-slate-900 dark:text-white">
                          {group.currency}{record.actualBankBalance.toLocaleString()}
                        </div>
                        {record.discrepancy !== 0 && (
                          <div className="text-[10px] font-mono text-amber-500 font-bold">
                            Diff: {record.discrepancy > 0 ? '+' : ''}{group.currency}{record.discrepancy.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
                  How to Keep Your Family & Group Ledger 100% Accurate
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      1. Weekly 3-Minute Audit
                    </span>
                    <p className="text-slate-500 leading-relaxed">
                      Pick a fixed day (e.g. Sunday evening) to compare your main bank account balance against Nest.
                    </p>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      2. Cash & UPI Pocket Money
                    </span>
                    <p className="text-slate-500 leading-relaxed">
                      Cash withdrawals for vegetables, domestic help, or small errands are the #1 source of unlogged drift.
                    </p>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      3. Use Member Nudges
                    </span>
                    <p className="text-slate-500 leading-relaxed">
                      If an allowance or grocery run is unaccounted for, send a friendly in-app nudge to the assignee.
                    </p>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      4. Recurring Automation
                    </span>
                    <p className="text-slate-500 leading-relaxed">
                      Ensure fixed expenses like Rent, SIPs, and Allowances are set to Auto-Execute so you never miss them.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="text-xs text-slate-500">
            {isExactMatch ? (
              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Ready to sign off audit
              </span>
            ) : (
              <span>
                Resolving discrepancy via <strong className="text-slate-900 dark:text-white">{selectedResolver}</strong> mode
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCompleteAudit}
              className="px-5 py-2 rounded-lg bg-[#22c55e] text-white text-xs font-bold hover:bg-[#22c55e]/90 shadow-md shadow-[#22c55e]/20 flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {isExactMatch 
                  ? 'Confirm & Sign Off Audit' 
                  : selectedResolver === 'auto'
                    ? 'Apply 1-Click Adjustment'
                    : selectedResolver === 'itemized'
                      ? 'Post Itemized Catch-Up & Reconcile'
                      : 'Flag for Review'}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
