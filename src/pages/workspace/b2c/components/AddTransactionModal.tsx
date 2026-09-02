import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Receipt, 
  Users, 
  ArrowDownRight, 
  ArrowUpRight, 
  Split, 
  Calendar,
  Layers,
  FileText,
  Edit3,
  Repeat
} from 'lucide-react';
import { NestGroup, NestMember, NestTransaction, ExpenseCategory, NestRecurringRule, RecurringFrequency } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: NestGroup;
  members: NestMember[];
  onSave: (transaction: NestTransaction, recurringRule?: NestRecurringRule) => void;
  transaction?: NestTransaction | null;
}

export function AddTransactionModal({
  isOpen,
  onClose,
  group,
  members,
  onSave,
  transaction
}: AddTransactionModalProps) {
  const isEditing = !!transaction;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income' | 'transfer'>('expense');
  const [category, setCategory] = useState<ExpenseCategory>('Groceries');
  const [paidByMemberId, setPaidByMemberId] = useState(members[0]?.id || 'mem_1');
  const [splitWithIds, setSplitWithIds] = useState<string[]>(members.map(m => m.id));
  const [splitType, setSplitType] = useState<'equal' | 'exact' | 'percentage'>('equal');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Recurring options
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>('monthly');
  const [recurringDayOfMonth, setRecurringDayOfMonth] = useState<number>(1);
  const [recurringAutoProcess, setRecurringAutoProcess] = useState(true);

  // Reset or populate fields when modal opens or transaction changes
  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title);
      setAmount(Math.abs(transaction.amount).toString());
      setType(transaction.type);
      setCategory(transaction.category);
      setPaidByMemberId(transaction.paidByMemberId);
      setSplitWithIds(transaction.splitWithMemberIds && transaction.splitWithMemberIds.length > 0 ? transaction.splitWithMemberIds : members.map(m => m.id));
      setSplitType(transaction.splitType || 'equal');
      setDate(transaction.date);
      setNotes(transaction.notes || '');
      setIsRecurring(!!transaction.recurringRuleId || !!transaction.isRecurringGenerated);
    } else {
      setTitle('');
      setAmount('');
      setType('expense');
      setCategory('Groceries');
      setPaidByMemberId(members[0]?.id || 'mem_1');
      setSplitWithIds(members.map(m => m.id));
      setSplitType('equal');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setIsRecurring(false);
      setRecurringFrequency('monthly');
      setRecurringDayOfMonth(new Date().getDate());
      setRecurringAutoProcess(true);
    }
  }, [transaction, isOpen, members]);

  if (!isOpen) return null;

  const toggleMemberSplit = (mId: string) => {
    if (splitWithIds.includes(mId)) {
      if (splitWithIds.length > 1) {
        setSplitWithIds(splitWithIds.filter(id => id !== mId));
      }
    } else {
      setSplitWithIds([...splitWithIds, mId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!title || !numAmount) return;

    const paidMember = members.find(m => m.id === paidByMemberId);
    const newTxId = transaction ? transaction.id : `tx_${Date.now()}`;
    const newRuleId = isRecurring ? (transaction?.recurringRuleId || `rec_${Date.now()}`) : undefined;

    const savedTx: NestTransaction = {
      id: newTxId,
      title,
      amount: type === 'expense' ? -Math.abs(numAmount) : Math.abs(numAmount),
      type,
      category,
      date,
      paidByMemberId,
      paidByMemberName: paidMember?.name || 'Group Member',
      splitWithMemberIds: splitWithIds,
      splitType,
      notes: notes || undefined,
      status: transaction?.status || 'settled',
      vaultId: transaction?.vaultId,
      recurringRuleId: newRuleId,
      isRecurringGenerated: isRecurring
    };

    let generatedRule: NestRecurringRule | undefined = undefined;
    if (isRecurring) {
      // Calculate next due date
      const today = new Date();
      const nextDue = new Date(today.getFullYear(), today.getMonth() + 1, Math.min(28, recurringDayOfMonth));
      const nextDueDateStr = nextDue.toISOString().split('T')[0];

      generatedRule = {
        id: newRuleId!,
        title,
        amount: Math.abs(numAmount),
        type: type === 'expense' ? 'expense' : type === 'income' ? 'income' : 'vault_transfer',
        category,
        frequency: recurringFrequency,
        dayOfMonth: recurringDayOfMonth,
        nextDueDate: nextDueDateStr,
        paidByMemberId,
        paidByMemberName: paidMember?.name || 'Group Member',
        splitWithMemberIds: type === 'expense' ? splitWithIds : undefined,
        splitType: 'equal',
        isActive: true,
        autoProcess: recurringAutoProcess,
        lastExecutedDate: date,
        notes: notes || undefined
      };
    }

    onSave(savedTx, generatedRule);
    onClose();
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Edit3 className="w-5 h-5 text-[#22c55e]" />
            ) : (
              <Receipt className="w-5 h-5 text-[#22c55e]" />
            )}
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {isEditing ? 'Edit Transaction Details' : 'Record New Transaction'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Type Selector */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'expense' ? 'bg-white dark:bg-slate-900 text-rose-500 shadow-sm' : 'text-slate-500'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'income' ? 'bg-white dark:bg-slate-900 text-emerald-500 shadow-sm' : 'text-slate-500'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setType('transfer')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'transfer' ? 'bg-white dark:bg-slate-900 text-purple-500 shadow-sm' : 'text-slate-500'
              }`}
            >
              Vault Transfer
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Title / Description</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekly Supermarket Groceries"
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Amount ({group.currency})</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 3500"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Paid By</label>
              <select
                value={paidByMemberId}
                onChange={(e) => setPaidByMemberId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
              >
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Transaction Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
              />
            </div>
          </div>

          {type === 'expense' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Split With Members ({splitWithIds.length} selected)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {members.map(m => {
                  const isSelected = splitWithIds.includes(m.id);
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => toggleMemberSplit(m.id)}
                      className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-2 transition-all ${
                        isSelected 
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-[#22c55e] text-emerald-700 dark:text-emerald-300' 
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                      }`}
                    >
                      <img src={m.avatar} alt={m.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="truncate">{m.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Notes / Memo (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Paid via UPI or Bank Card"
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
            />
          </div>

          {/* Recurring Schedule Card Toggle */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-[#22c55e]" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Repeat / Recurring Schedule</div>
                  <div className="text-[10px] text-slate-400">Save as an automated recurring ledger rule</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isRecurring} 
                  onChange={(e) => setIsRecurring(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-[#22c55e]"></div>
              </label>
            </div>

            {isRecurring && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 grid grid-cols-2 gap-2.5 animate-in fade-in duration-200">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">Frequency</label>
                  <select
                    value={recurringFrequency}
                    onChange={(e) => setRecurringFrequency(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">Due Day of Month (1-31)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={recurringDayOfMonth}
                    onChange={(e) => setRecurringDayOfMonth(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#22c55e] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1ea34d] transition-all shadow-md shadow-[#22c55e]/20"
            >
              {isEditing ? 'Save Changes' : 'Record Transaction'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
