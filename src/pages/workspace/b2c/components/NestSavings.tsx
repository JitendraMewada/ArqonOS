import React, { useState, useMemo } from 'react';
import { 
  Target, 
  PlusCircle, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  Plus,
  Minus,
  Edit2,
  Edit3,
  Trash2,
  Zap,
  Repeat,
  DollarSign,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  PieChart as PieChartIcon
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
import { NestGroup, NestMember, NestSavingsGoal, NestVault } from '../types';
import { cn } from '../../../../lib/utils';

const VAULT_CHART_COLORS = ['#a855f7', '#3b82f6', '#22c55e', '#f59e0b', '#ec4899', '#06b6d4', '#14b8a6'];

interface NestSavingsProps {
  group: NestGroup;
  members: NestMember[];
  savings: NestSavingsGoal[];
  vaults: NestVault[];
  onUpdateSavings: (savings: NestSavingsGoal[]) => void;
  onUpdateVaults: (vaults: NestVault[]) => void;
  onExecuteSavingsAirdrop?: (targetType: 'goal' | 'vault', targetId: string, amount: number) => void;
  onExecuteAllScheduledDeposits?: () => void;
}

export function NestSavings({
  group,
  members,
  savings,
  vaults,
  onUpdateSavings,
  onUpdateVaults,
  onExecuteSavingsAirdrop,
  onExecuteAllScheduledDeposits
}: NestSavingsProps) {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<NestSavingsGoal | null>(null);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [editingVault, setEditingVault] = useState<NestVault | null>(null);

  const [showContributeModal, setShowContributeModal] = useState<string | null>(null);
  const [contributeAmount, setContributeAmount] = useState('5000');

  const [showVaultTransferModal, setShowVaultTransferModal] = useState<{ vault: NestVault; mode: 'deposit' | 'withdraw' } | null>(null);
  const [vaultTransferAmount, setVaultTransferAmount] = useState('10000');

  // Goal Form States
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('100000');
  const [deadline, setDeadline] = useState('Dec 2026');
  const [category, setCategory] = useState('Vacation');
  const [autoDepositActive, setAutoDepositActive] = useState(true);
  const [monthlyAutoDeposit, setMonthlyAutoDeposit] = useState('5000');
  const [autoDepositScheduleDay, setAutoDepositScheduleDay] = useState(1);

  // Vault Form States
  const [vaultName, setVaultName] = useState('');
  const [vaultPurpose, setVaultPurpose] = useState('');
  const [vaultBalance, setVaultBalance] = useState('25000');
  const [vaultTarget, setVaultTarget] = useState('100000');
  const [vaultColor, setVaultColor] = useState('#22c55e');
  const [vaultAutoDepositActive, setVaultAutoDepositActive] = useState(true);
  const [vaultMonthlyAutoDeposit, setVaultMonthlyAutoDeposit] = useState('5000');
  const [vaultScheduleDay, setVaultScheduleDay] = useState(1);

  const totalSaved = savings.reduce((sum, s) => sum + s.currentAmount, 0);
  const totalTarget = savings.reduce((sum, s) => sum + s.targetAmount, 0);
  const totalVaultBalance = vaults.reduce((sum, v) => sum + v.balance, 0);

  const totalMonthlyScheduledDeposits = savings
    .filter(s => s.autoDepositActive && s.monthlyAutoDeposit)
    .reduce((sum, s) => sum + (s.monthlyAutoDeposit || 0), 0) +
    vaults
    .filter(v => v.autoDepositActive && v.monthlyAutoDeposit)
    .reduce((sum, v) => sum + (v.monthlyAutoDeposit || 0), 0);

  const goalProgressData = useMemo(() => {
    return savings.map(s => ({
      name: s.title.length > 15 ? `${s.title.slice(0, 13)}...` : s.title,
      fullName: s.title,
      current: s.currentAmount,
      target: s.targetAmount,
      progress: Math.min(100, Math.round((s.currentAmount / (s.targetAmount || 1)) * 100))
    }));
  }, [savings]);

  const reserveDistributionData = useMemo(() => {
    const items = [
      ...vaults.map((v, i) => ({
        name: `Vault: ${v.name}`,
        value: v.balance,
        type: 'Vault',
        color: v.color || VAULT_CHART_COLORS[i % VAULT_CHART_COLORS.length]
      })),
      ...savings.map((s, i) => ({
        name: `Goal: ${s.title}`,
        value: s.currentAmount,
        type: 'Goal',
        color: s.color || VAULT_CHART_COLORS[(vaults.length + i) % VAULT_CHART_COLORS.length]
      }))
    ].filter(item => item.value > 0);

    const total = items.reduce((sum, item) => sum + item.value, 0);
    return items.map(item => ({
      ...item,
      percentage: total > 0 ? Math.round((item.value / total) * 100) : 0
    }));
  }, [vaults, savings]);

  const openCreateGoalModal = () => {
    setTitle('');
    setTarget('100000');
    setDeadline('Dec 2026');
    setCategory('Vacation');
    setAutoDepositActive(true);
    setMonthlyAutoDeposit('5000');
    setAutoDepositScheduleDay(1);
    setShowGoalModal(true);
  };

  const openEditGoalModal = (goal: NestSavingsGoal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setTarget(goal.targetAmount.toString());
    setDeadline(goal.deadline);
    setCategory(goal.category);
    setAutoDepositActive(goal.autoDepositActive ?? true);
    setMonthlyAutoDeposit((goal.monthlyAutoDeposit ?? 5000).toString());
    setAutoDepositScheduleDay(goal.autoDepositScheduleDay ?? 1);
  };

  const openCreateVaultModal = () => {
    setVaultName('');
    setVaultPurpose('Ring-fenced emergency cash buffer and unexpected medical contingency.');
    setVaultBalance('25000');
    setVaultTarget('100000');
    setVaultColor('#22c55e');
    setVaultAutoDepositActive(true);
    setVaultMonthlyAutoDeposit('5000');
    setVaultScheduleDay(1);
    setShowVaultModal(true);
  };

  const openEditVaultModal = (vault: NestVault) => {
    setEditingVault(vault);
    setVaultName(vault.name);
    setVaultPurpose(vault.purpose);
    setVaultBalance(vault.balance.toString());
    setVaultTarget((vault.targetBalance || 100000).toString());
    setVaultColor(vault.color);
    setVaultAutoDepositActive(vault.autoDepositActive ?? true);
    setVaultMonthlyAutoDeposit((vault.monthlyAutoDeposit ?? 5000).toString());
    setVaultScheduleDay(vault.autoDepositScheduleDay ?? 1);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !target) return;

    const newGoal: NestSavingsGoal = {
      id: `s_${Date.now()}`,
      title,
      targetAmount: Number(target),
      currentAmount: 0,
      deadline,
      category,
      imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500&auto=format&fit=crop&q=80',
      color: '#22c55e',
      contributors: [],
      autoDepositActive,
      monthlyAutoDeposit: Number(monthlyAutoDeposit) || 0,
      autoDepositScheduleDay: Number(autoDepositScheduleDay) || 1
    };

    onUpdateSavings([...savings, newGoal]);
    setShowGoalModal(false);
  };

  const handleSaveEditedGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal || !title || !target) return;

    const updated = savings.map(s => {
      if (s.id === editingGoal.id) {
        return {
          ...s,
          title,
          targetAmount: Number(target),
          deadline,
          category,
          autoDepositActive,
          monthlyAutoDeposit: Number(monthlyAutoDeposit) || 0,
          autoDepositScheduleDay: Number(autoDepositScheduleDay) || 1
        };
      }
      return s;
    });

    onUpdateSavings(updated);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (id: string) => {
    onUpdateSavings(savings.filter(s => s.id !== id));
  };

  const handleCreateVault = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaultName) return;

    const newVault: NestVault = {
      id: `v_${Date.now()}`,
      name: vaultName,
      purpose: vaultPurpose,
      balance: Number(vaultBalance) || 0,
      targetBalance: Number(vaultTarget) || undefined,
      color: vaultColor,
      autoDepositActive: vaultAutoDepositActive,
      monthlyAutoDeposit: Number(vaultMonthlyAutoDeposit) || 0,
      autoDepositScheduleDay: Number(vaultScheduleDay) || 1,
      members: members.map(m => m.id)
    };

    onUpdateVaults([...vaults, newVault]);
    setShowVaultModal(false);
  };

  const handleSaveEditedVault = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVault || !vaultName) return;

    const updated = vaults.map(v => {
      if (v.id === editingVault.id) {
        return {
          ...v,
          name: vaultName,
          purpose: vaultPurpose,
          balance: Number(vaultBalance) || v.balance,
          targetBalance: Number(vaultTarget) || undefined,
          color: vaultColor,
          autoDepositActive: vaultAutoDepositActive,
          monthlyAutoDeposit: Number(vaultMonthlyAutoDeposit) || 0,
          autoDepositScheduleDay: Number(vaultScheduleDay) || 1
        };
      }
      return v;
    });

    onUpdateVaults(updated);
    setEditingVault(null);
  };

  const handleDeleteVault = (id: string) => {
    if (vaults.length <= 1) return;
    onUpdateVaults(vaults.filter(v => v.id !== id));
  };

  const handleContribute = (goalId: string) => {
    const amt = Number(contributeAmount);
    if (!amt || isNaN(amt)) return;

    if (onExecuteSavingsAirdrop) {
      onExecuteSavingsAirdrop('goal', goalId, amt);
    } else {
      const updated = savings.map(s => {
        if (s.id === goalId) {
          return {
            ...s,
            currentAmount: s.currentAmount + amt,
            contributors: [
              ...s.contributors,
              { memberId: members[0]?.id || 'mem_1', amount: amt }
            ]
          };
        }
        return s;
      });
      onUpdateSavings(updated);
    }

    setShowContributeModal(null);
    setContributeAmount('5000');
  };

  const handleVaultTransfer = () => {
    if (!showVaultTransferModal) return;
    const { vault, mode } = showVaultTransferModal;
    const amt = Number(vaultTransferAmount);
    if (!amt || isNaN(amt)) return;

    if (mode === 'deposit' && onExecuteSavingsAirdrop) {
      onExecuteSavingsAirdrop('vault', vault.id, amt);
    } else {
      const updated = vaults.map(v => {
        if (v.id === vault.id) {
          const newBal = mode === 'deposit' ? v.balance + amt : Math.max(0, v.balance - amt);
          return { ...v, balance: newBal };
        }
        return v;
      });
      onUpdateVaults(updated);
    }

    setShowVaultTransferModal(null);
    setVaultTransferAmount('10000');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header & Master Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Target className="w-6 h-6 text-[#22c55e]" />
            Shared Group Savings & Ring-Fenced Vaults
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Collective target funds, ring-fenced emergency vaults, and automated monthly standing deposits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {onExecuteAllScheduledDeposits && (
            <button
              onClick={onExecuteAllScheduledDeposits}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-amber-500/30 transition-all shadow-sm"
              title="Post all scheduled auto-deposits into goals and vaults"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Run Auto-Deposits
            </button>
          )}

          <button
            onClick={openCreateVaultModal}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
          >
            <Lock className="w-4 h-4 text-purple-500" />
            New Vault
          </button>

          <button
            onClick={openCreateGoalModal}
            className="px-5 py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#1ea34d] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#22c55e]/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Create Savings Goal
          </button>
        </div>
      </div>

      {/* Hero Overview */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Group Capital Saved</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {group.currency}{totalSaved.toLocaleString()}
          </div>
          <div className="text-xs text-[#22c55e] font-semibold mt-1">
            Across {savings.length} active target goals
          </div>
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Target Capital</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {group.currency}{totalTarget.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            {group.currency}{(Math.max(0, totalTarget - totalSaved)).toLocaleString()} remaining to fund
          </div>
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ring-Fenced In Vaults</span>
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {group.currency}{totalVaultBalance.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Across {vaults.length} protected vaults
          </div>
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Auto-Deposits</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {group.currency}{totalMonthlyScheduledDeposits.toLocaleString()}<span className="text-xs text-slate-400 font-normal">/mo</span>
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <Repeat className="w-3 h-3" /> Auto-funded from group
          </div>
        </div>
      </div>

      {/* Savings & Vaults Responsive Chart Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Savings Goal Progress vs Target */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#22c55e]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Goal Capital Funding vs Target
              </h3>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" /> Target Capital
              </span>
              <span className="flex items-center gap-1.5 text-[#22c55e]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" /> Current Saved
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={goalProgressData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${group.currency}${val >= 1000 ? `${Math.round(val/1000)}k` : val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  formatter={(val: any, name: any) => [`${group.currency}${Number(val).toLocaleString()}`, name === 'target' ? 'Target Goal' : 'Accumulated Capital']}
                />
                <Bar dataKey="target" name="target" fill="#64748b" opacity={0.35} radius={[4, 4, 0, 0]} maxBarSize={36} />
                <Bar dataKey="current" name="current" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Capital Reserve Distribution across Vaults & Goals */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-[#22c55e]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Reserve & Vault Distribution
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Capital Mix</span>
          </div>

          <div className="h-44 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reserveDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {reserveDistributionData.map((entry, index) => (
                    <Cell key={`res-pie-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  formatter={(val: any) => [`${group.currency}${Number(val).toLocaleString()}`, 'Balance']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <ShieldCheck className="w-5 h-5 text-purple-500 mb-0.5" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Reserves</span>
            </div>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {reserveDistributionData.map((item) => (
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

      {/* Shared Vaults Strip */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-500" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Ring-Fenced Shared Vaults ({vaults.length})
            </h2>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Protected & Dedicated Liquidity
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vaults.map((vault) => (
            <div
              key={vault.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative group hover:border-purple-500/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: vault.color }} />
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate">{vault.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditVaultModal(vault)}
                      className="p-1 rounded-lg text-slate-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                      title="Edit vault settings"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {vaults.length > 1 && (
                      <button
                        onClick={() => handleDeleteVault(vault.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete vault"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {group.currency}{vault.balance.toLocaleString()}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {vault.purpose}
                </p>

                {vault.autoDepositActive && vault.monthlyAutoDeposit ? (
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 text-[10px] text-purple-700 dark:text-purple-300 font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Repeat className="w-3 h-3 text-purple-500" />
                      Auto: +{group.currency}{vault.monthlyAutoDeposit.toLocaleString()}/mo
                    </span>
                    <span>Day {vault.autoDepositScheduleDay || 1}</span>
                  </div>
                ) : null}
              </div>

              {/* Vault Transfer Controls */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setShowVaultTransferModal({ vault, mode: 'deposit' });
                    setVaultTransferAmount('5000');
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#22c55e] hover:bg-[#22c55e] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1 border border-[#22c55e]/30"
                >
                  <Plus className="w-3 h-3" /> Deposit
                </button>
                <button
                  onClick={() => {
                    setShowVaultTransferModal({ vault, mode: 'withdraw' });
                    setVaultTransferAmount('5000');
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 text-xs font-bold transition-all flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700"
                >
                  <Minus className="w-3 h-3" /> Withdraw
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Savings Goals Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#22c55e]" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Target Savings Goals ({savings.length})
            </h2>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Goal Accumulation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {savings.map((goal) => {
            const percent = Math.min(100, Math.round((goal.currentAmount / (goal.targetAmount || 1)) * 100));

            return (
              <div
                key={goal.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col group hover:border-[#22c55e]/50 transition-all"
              >
                {goal.imageUrl && (
                  <div className="h-40 w-full overflow-hidden relative">
                    <img src={goal.imageUrl} alt={goal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                      <button
                        onClick={() => openEditGoalModal(goal)}
                        className="p-1.5 rounded-lg bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
                        title="Edit savings goal"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1.5 rounded-lg bg-black/50 hover:bg-rose-600 text-white backdrop-blur-md transition-colors"
                        title="Delete savings goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-black/40 backdrop-blur-md">
                        {goal.category}
                      </span>
                      <span className="text-xs font-bold flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {goal.deadline}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{goal.title}</h3>
                    <div className="flex items-baseline justify-between mt-3">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {group.currency}{goal.currentAmount.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        of {group.currency}{goal.targetAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
                      <div 
                        className="h-full bg-[#22c55e] rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 mt-1.5 text-right">
                      {percent}% Funded
                    </div>

                    {goal.autoDepositActive && goal.monthlyAutoDeposit ? (
                      <div className="mt-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Repeat className="w-3 h-3 text-[#22c55e]" />
                          Scheduled: +{group.currency}{goal.monthlyAutoDeposit.toLocaleString()}/mo
                        </span>
                        <span>Day {goal.autoDepositScheduleDay || 1}</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex -space-x-2">
                      {members.slice(0, 3).map((m) => (
                        <img key={m.id} src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover border-2 border-white dark:border-slate-900" />
                      ))}
                    </div>

                    <button
                      onClick={() => setShowContributeModal(goal.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#22c55e] hover:bg-[#1ea34d] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-md shadow-[#22c55e]/20"
                    >
                      <Plus className="w-3.5 h-3.5" /> Deposit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Goal Deposit Modal */}
      {showContributeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Deposit to Goal</h2>
              <button onClick={() => setShowContributeModal(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Deposit Amount ({group.currency})</label>
                <input
                  type="number"
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowContributeModal(null)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleContribute(showContributeModal)}
                  className="px-5 py-2 rounded-lg bg-[#22c55e] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1ea34d] transition-all shadow-md shadow-[#22c55e]/20"
                >
                  Confirm Deposit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vault Transfer / Withdraw Modal */}
      {showVaultTransferModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white capitalize">
                  {showVaultTransferModal.mode} - {showVaultTransferModal.vault.name}
                </h2>
              </div>
              <button onClick={() => setShowVaultTransferModal(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold">✕</button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Current Vault Balance:</span>
                <span className="text-slate-900 dark:text-white font-mono">{group.currency}{showVaultTransferModal.vault.balance.toLocaleString()}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Amount to {showVaultTransferModal.mode} ({group.currency})
                </label>
                <input
                  type="number"
                  value={vaultTransferAmount}
                  onChange={(e) => setVaultTransferAmount(e.target.value)}
                  placeholder="e.g. 10000"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowVaultTransferModal(null)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVaultTransfer}
                  className="px-5 py-2 rounded-lg bg-purple-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-purple-700 transition-all shadow-md shadow-purple-600/20"
                >
                  Confirm {showVaultTransferModal.mode}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Goal Modal */}
      {(showGoalModal || editingGoal) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {editingGoal ? 'Edit Savings Goal' : 'Create Savings Goal'}
              </h2>
              <button onClick={() => { setShowGoalModal(false); setEditingGoal(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold">✕</button>
            </div>

            <form onSubmit={editingGoal ? handleSaveEditedGoal : handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Goal Name</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Europe Summer Tour"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Amount ({group.currency})</label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g. 200000"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  >
                    <option value="Vacation">Vacation</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Gadgets">Gadgets</option>
                    <option value="Home Renovation">Home Renovation</option>
                    <option value="Education">Education</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Date</label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="e.g. Dec 2026"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>

              {/* Recurring Auto-Deposit Config */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Repeat className="w-4 h-4 text-[#22c55e]" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Recurring Auto-Deposit</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoDepositActive}
                    onChange={(e) => setAutoDepositActive(e.target.checked)}
                    className="w-4 h-4 accent-[#22c55e] rounded cursor-pointer"
                  />
                </div>

                {autoDepositActive && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">Monthly Deposit ({group.currency})</label>
                      <input
                        type="number"
                        value={monthlyAutoDeposit}
                        onChange={(e) => setMonthlyAutoDeposit(e.target.value)}
                        placeholder="5000"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">Day of Month (1-31)</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={autoDepositScheduleDay}
                        onChange={(e) => setAutoDepositScheduleDay(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => { setShowGoalModal(false); setEditingGoal(null); }}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#22c55e] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1ea34d] transition-all shadow-md shadow-[#22c55e]/20"
                >
                  {editingGoal ? 'Save Goal' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create / Edit Vault Modal */}
      {(showVaultModal || editingVault) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {editingVault ? 'Edit Protected Vault' : 'Create Ring-Fenced Vault'}
                </h2>
              </div>
              <button onClick={() => { setShowVaultModal(false); setEditingVault(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold">✕</button>
            </div>

            <form onSubmit={editingVault ? handleSaveEditedVault : handleCreateVault} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Vault Name</label>
                <input
                  type="text"
                  value={vaultName}
                  onChange={(e) => setVaultName(e.target.value)}
                  placeholder="e.g. Medical Contingency Fund"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Purpose / Ring-Fence Description</label>
                <textarea
                  value={vaultPurpose}
                  onChange={(e) => setVaultPurpose(e.target.value)}
                  placeholder="e.g. Dedicated emergency medical buffer reserved only for hospital contingencies."
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Current Balance ({group.currency})</label>
                  <input
                    type="number"
                    value={vaultBalance}
                    onChange={(e) => setVaultBalance(e.target.value)}
                    placeholder="25000"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Buffer ({group.currency})</label>
                  <input
                    type="number"
                    value={vaultTarget}
                    onChange={(e) => setVaultTarget(e.target.value)}
                    placeholder="100000"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Recurring Auto-Deposit into Vault */}
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Repeat className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Recurring Vault Top-Up</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={vaultAutoDepositActive}
                    onChange={(e) => setVaultAutoDepositActive(e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                </div>

                {vaultAutoDepositActive && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">Monthly Top-Up ({group.currency})</label>
                      <input
                        type="number"
                        value={vaultMonthlyAutoDeposit}
                        onChange={(e) => setVaultMonthlyAutoDeposit(e.target.value)}
                        placeholder="5000"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">Day of Month</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={vaultScheduleDay}
                        onChange={(e) => setVaultScheduleDay(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => { setShowVaultModal(false); setEditingVault(null); }}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-purple-700 transition-all shadow-md shadow-purple-600/20"
                >
                  {editingVault ? 'Save Vault' : 'Create Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

