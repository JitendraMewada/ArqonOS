import React, { useState, useEffect } from 'react';
import { 
  Repeat, 
  PlusCircle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Edit3,
  Layers,
  Sparkles,
  Zap,
  Target,
  Lock,
  UserCheck
} from 'lucide-react';
import { 
  NestGroup, 
  NestMember, 
  NestRecurringRule, 
  NestSavingsGoal, 
  NestVault, 
  ExpenseCategory, 
  RecurringFrequency 
} from '../types';

interface NestRecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: NestGroup;
  members: NestMember[];
  savings: NestSavingsGoal[];
  vaults: NestVault[];
  onSaveRule: (rule: NestRecurringRule) => void;
  rule?: NestRecurringRule | null;
}

export function NestRecurringModal({
  isOpen,
  onClose,
  group,
  members,
  savings,
  vaults,
  onSaveRule,
  rule
}: NestRecurringModalProps) {
  const isEditing = !!rule;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income' | 'savings_goal' | 'vault_transfer' | 'allowance'>('expense');
  const [category, setCategory] = useState<ExpenseCategory>('Rent & Utilities');
  const [frequency, setFrequency] = useState<RecurringFrequency>('monthly');
  const [dayOfMonth, setDayOfMonth] = useState<number>(1);
  const [paidByMemberId, setPaidByMemberId] = useState(members[0]?.id || 'mem_1');
  const [targetId, setTargetId] = useState<string>('');
  const [splitWithIds, setSplitWithIds] = useState<string[]>(members.map(m => m.id));
  const [autoProcess, setAutoProcess] = useState(true);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (rule) {
      setTitle(rule.title);
      setAmount(rule.amount.toString());
      setType(rule.type);
      setCategory(rule.category);
      setFrequency(rule.frequency);
      setDayOfMonth(rule.dayOfMonth || 1);
      setPaidByMemberId(rule.paidByMemberId);
      setTargetId(rule.targetId || '');
      setSplitWithIds(rule.splitWithMemberIds && rule.splitWithMemberIds.length > 0 ? rule.splitWithMemberIds : members.map(m => m.id));
      setAutoProcess(rule.autoProcess);
      setNotes(rule.notes || '');
    } else {
      setTitle('');
      setAmount('');
      setType('expense');
      setCategory('Rent & Utilities');
      setFrequency('monthly');
      setDayOfMonth(1);
      setPaidByMemberId(members[0]?.id || 'mem_1');
      setTargetId('');
      setSplitWithIds(members.map(m => m.id));
      setAutoProcess(true);
      setNotes('');
    }
  }, [rule, isOpen, members]);

  if (!isOpen) return null;

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

    const payer = members.find(m => m.id === paidByMemberId);

    let calculatedTargetName: string | undefined = undefined;
    if (type === 'savings_goal') {
      const goal = savings.find(s => s.id === targetId);
      calculatedTargetName = goal?.title;
    } else if (type === 'vault_transfer') {
      const vault = vaults.find(v => v.id === targetId);
      calculatedTargetName = vault?.name;
    } else if (type === 'allowance') {
      const member = members.find(m => m.id === targetId);
      calculatedTargetName = member?.name;
    }

    // Next due date calculation
    const today = new Date();
    const nextDue = new Date(today.getFullYear(), today.getMonth(), Math.min(28, dayOfMonth));
    if (nextDue < today) {
      nextDue.setMonth(nextDue.getMonth() + 1);
    }
    const nextDueDateStr = nextDue.toISOString().split('T')[0];

    const savedRule: NestRecurringRule = {
      id: rule ? rule.id : `rec_${Date.now()}`,
      title,
      amount: Math.abs(numAmount),
      type,
      category: type === 'savings_goal' ? 'Shared Vaults' : type === 'vault_transfer' ? 'Shared Vaults' : type === 'allowance' ? 'Income & Allowance' : category,
      frequency,
      dayOfMonth,
      nextDueDate: rule?.nextDueDate || nextDueDateStr,
      paidByMemberId,
      paidByMemberName: payer?.name || 'Group Organizer',
      targetId: targetId || undefined,
      targetName: calculatedTargetName,
      splitWithMemberIds: type === 'expense' ? splitWithIds : undefined,
      splitType: 'equal',
      isActive: rule ? rule.isActive : true,
      autoProcess,
      lastExecutedDate: rule?.lastExecutedDate,
      notes: notes || undefined
    };

    onSaveRule(savedRule);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Repeat className="w-5 h-5 text-[#22c55e]" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {isEditing ? 'Edit Recurring Schedule' : 'Create Recurring Rule'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Rule Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Rule Purpose & Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`p-2.5 rounded-xl text-xs font-bold border text-left transition-all ${
                  type === 'expense'
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-600 dark:text-rose-400 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                💸 Fixed Expense
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`p-2.5 rounded-xl text-xs font-bold border text-left transition-all ${
                  type === 'income'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-[#22c55e] text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                💰 Regular Income
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('savings_goal');
                  if (savings.length > 0 && !targetId) setTargetId(savings[0].id);
                }}
                className={`p-2.5 rounded-xl text-xs font-bold border text-left transition-all ${
                  type === 'savings_goal'
                    ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                🎯 Goal Auto-Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('vault_transfer');
                  if (vaults.length > 0 && !targetId) setTargetId(vaults[0].id);
                }}
                className={`p-2.5 rounded-xl text-xs font-bold border text-left transition-all ${
                  type === 'vault_transfer'
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                🔒 Vault Allocation
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('allowance');
                  if (members.length > 0 && !targetId) setTargetId(members[0].id);
                }}
                className={`p-2.5 rounded-xl text-xs font-bold border text-left transition-all sm:col-span-2 ${
                  type === 'allowance'
                    ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                👥 Member Allowance
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Title / Schedule Description</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Monthly High-Speed Fiber Wifi"
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
                placeholder="e.g. 2999"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
              >
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Day of Month (1 - 31)</label>
              <input
                type="number"
                min="1"
                max="31"
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Payer / Source</label>
              <select
                value={paidByMemberId}
                onChange={(e) => setPaidByMemberId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
              >
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>

          {/* Conditional Target selection */}
          {type === 'savings_goal' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Savings Goal</label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                required
              >
                {savings.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
            </div>
          )}

          {type === 'vault_transfer' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Ring-Fenced Vault</label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                required
              >
                {vaults.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
          )}

          {type === 'allowance' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Allowance Recipient Member</label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                required
              >
                {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
              </select>
            </div>
          )}

          {type === 'expense' && (
            <>
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
            </>
          )}

          {/* Auto Process Toggle */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Auto-Post into Ledger</div>
                <div className="text-[10px] text-slate-500">Automatically post transaction on due date without manual confirmation</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={autoProcess} 
                onChange={(e) => setAutoProcess(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-[#22c55e]"></div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Notes / Memo (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Account Number or Mandate Reference"
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
            />
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
              {isEditing ? 'Save Schedule' : 'Create Rule'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
