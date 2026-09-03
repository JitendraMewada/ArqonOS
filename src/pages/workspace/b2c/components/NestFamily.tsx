import React, { useState, useMemo } from 'react';
import { 
  Users, 
  PlusCircle, 
  ShieldCheck, 
  UserPlus, 
  Crown, 
  Mail, 
  Phone, 
  Wallet, 
  Trash2, 
  CheckCircle2, 
  Lock, 
  Info, 
  Edit2, 
  Edit3, 
  Settings, 
  ShieldAlert, 
  Sliders, 
  Zap, 
  Calendar, 
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
  Send,
  BellRing
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
import { NestGroup, NestMember, MemberRole, GroupCategory, NestMemberNudge } from '../types';
import { PRICING_CONFIG } from '../../../../constants/pricing';
import { cn } from '../../../../lib/utils';

const FAMILY_CHART_COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ec4899', '#06b6d4', '#14b8a6'];

interface NestFamilyProps {
  group: NestGroup;
  members: NestMember[];
  nudges?: NestMemberNudge[];
  onUpdateMembers: (members: NestMember[]) => void;
  onUpdateGroup?: (group: NestGroup) => void;
  onDisburseAllowances?: () => void;
  onOpenNudgeCenter?: (preselectedMemberId?: string) => void;
}

export function NestFamily({
  group,
  members,
  nudges = [],
  onUpdateMembers,
  onUpdateGroup,
  onDisburseAllowances,
  onOpenNudgeCenter
}: NestFamilyProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [showDisburseModal, setShowDisburseModal] = useState(false);
  const [editingMember, setEditingMember] = useState<NestMember | null>(null);

  // Invite states
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRole, setInviteRole] = useState<MemberRole>('Member');
  const [inviteAllowance, setInviteAllowance] = useState('10000');
  const [inviteAllowanceDay, setInviteAllowanceDay] = useState(1);

  // Member Edit states
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<MemberRole>('Member');
  const [editAllowance, setEditAllowance] = useState('10000');
  const [editAllowanceDay, setEditAllowanceDay] = useState(1);

  // Group Edit states
  const [groupName, setGroupName] = useState(group.name);
  const [groupType, setGroupType] = useState<GroupCategory>(group.type);
  const [groupBudget, setGroupBudget] = useState(group.monthlyBudget.toString());

  // Find active plan details
  const activePlan = PRICING_CONFIG.NEST_PLANS.find(p => p.id === group.plan) || PRICING_CONFIG.NEST_PLANS[1];
  const includedUsersCount = 3;
  const extraUsersCount = Math.max(0, members.length - includedUsersCount);
  const extraUsersCost = extraUsersCount * 99;
  const totalMonthlyPlanCost = activePlan.price + extraUsersCost;

  const totalMonthlyAllowances = members.reduce((sum, m) => sum + (m.monthlyAllowance || 0), 0);

  const allowanceData = useMemo(() => {
    return members.map(m => ({
      name: m.name.split(' ')[0],
      fullName: m.name,
      allowance: m.monthlyAllowance || 0,
      scheduleDay: m.allowanceScheduleDay || 1,
      role: m.role
    }));
  }, [members]);

  const memberRoleDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    members.forEach(m => {
      counts[m.role] = (counts[m.role] || 0) + 1;
    });

    const total = members.length;

    return Object.entries(counts).map(([role, count], index) => ({
      name: role,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      color: FAMILY_CHART_COLORS[index % FAMILY_CHART_COLORS.length]
    }));
  }, [members]);

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    const newMember: NestMember = {
      id: `mem_${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      phone: invitePhone || undefined,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(inviteName)}&background=22c55e&color=fff`,
      role: inviteRole,
      joinedDate: 'Sep 2026',
      monthlyAllowance: Number(inviteAllowance) || 0,
      allowanceScheduleDay: Number(inviteAllowanceDay) || 1
    };

    onUpdateMembers([...members, newMember]);
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
    setInvitePhone('');
    setInviteAllowanceDay(1);
  };

  const openEditMemberModal = (m: NestMember) => {
    setEditingMember(m);
    setEditName(m.name);
    setEditEmail(m.email);
    setEditPhone(m.phone || '');
    setEditRole(m.role);
    setEditAllowance(m.monthlyAllowance ? m.monthlyAllowance.toString() : '0');
    setEditAllowanceDay(m.allowanceScheduleDay || 1);
  };

  const handleSaveEditedMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editName) return;

    const updatedMembers = members.map(m => {
      if (m.id === editingMember.id) {
        return {
          ...m,
          name: editName,
          email: editEmail,
          phone: editPhone || undefined,
          role: editRole,
          monthlyAllowance: Number(editAllowance) || 0,
          allowanceScheduleDay: Number(editAllowanceDay) || 1
        };
      }
      return m;
    });

    onUpdateMembers(updatedMembers);
    setEditingMember(null);
  };

  const handleSaveGroupInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName) return;

    if (onUpdateGroup) {
      onUpdateGroup({
        ...group,
        name: groupName,
        type: groupType,
        monthlyBudget: Number(groupBudget) || group.monthlyBudget
      });
    }
    setShowEditGroupModal(false);
  };

  const handleRemoveMember = (id: string) => {
    if (members.length <= 1) return;
    onUpdateMembers(members.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#22c55e]" />
            Group Members, Roles & Shared Allowances
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Manage family organizers, roommates, discretionary allowances, and access controls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {onOpenNudgeCenter && (
            <button
              onClick={() => onOpenNudgeCenter()}
              className="px-4 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-purple-300 dark:border-purple-800 transition-all shadow-sm"
              title="Open Member Logging Nudges & Accountability Hub"
            >
              <Send className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Nudge Center {nudges.filter(n => !n.isAcknowledged).length > 0 && `(${nudges.filter(n => !n.isAcknowledged).length})`}
            </button>
          )}

          {onDisburseAllowances && totalMonthlyAllowances > 0 && (
            <button
              onClick={() => setShowDisburseModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-sky-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-sky-500/30 transition-all shadow-sm"
              title="Disburse monthly family allowances"
            >
              <Zap className="w-4 h-4 text-sky-400" />
              Disburse Allowances
            </button>
          )}

          <button
            onClick={() => {
              setGroupName(group.name);
              setGroupType(group.type);
              setGroupBudget(group.monthlyBudget.toString());
              setShowEditGroupModal(true);
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
          >
            <Sliders className="w-4 h-4 text-slate-400" />
            Edit Group Details
          </button>

          <button
            onClick={() => setShowInviteModal(true)}
            className="px-5 py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#1ea34d] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#22c55e]/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        </div>
      </div>

      {/* Subscription & User Quota Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Nest Subscription</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            {activePlan.name}
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              Active
            </span>
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Base: {group.currency}{activePlan.price}/group/month (3 included)
          </div>
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Roster Size</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {members.length} Members Active
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            {extraUsersCount > 0 ? (
              <span className="text-amber-500 font-bold">{extraUsersCount} extra (+₹{extraUsersCost}/mo)</span>
            ) : (
              <span className="text-emerald-500 font-bold">Within 3 included seats</span>
            )}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Plan Billing</span>
          <div className="text-2xl font-black text-[#22c55e] mt-1">
            {group.currency}{totalMonthlyPlanCost} / mo
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">
            ₹{activePlan.price} + ({extraUsersCount} × ₹99)
          </div>
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Monthly Allowances</span>
          <div className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">
            {group.currency}{totalMonthlyAllowances.toLocaleString()} / mo
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">
            Across {members.filter(m => (m.monthlyAllowance || 0) > 0).length} members
          </div>
        </div>
      </div>

      {/* Family Allowance & Seat Allocation Responsive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Member Discretionary Allowance Allocation */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#22c55e]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Member Monthly Discretionary Allowances
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-sky-600 dark:text-sky-400">
              <Calendar className="w-3.5 h-3.5" /> Auto-disbursed on assigned day of month
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={allowanceData} margin={{ top: 10, right: 10, left: -15, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${group.currency}${val >= 1000 ? `${Math.round(val/1000)}k` : val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  formatter={(val: any, name: any, item: any) => [
                    `${group.currency}${Number(val).toLocaleString()} / month (Day ${item.payload.scheduleDay})`,
                    `${item.payload.fullName} (${item.payload.role})`
                  ]}
                />
                <Bar dataKey="allowance" name="Allowance" fill="#0284c7" radius={[6, 6, 0, 0]} maxBarSize={44}>
                  {allowanceData.map((entry, index) => (
                    <Cell key={`cell-allowance-${index}`} fill={FAMILY_CHART_COLORS[index % FAMILY_CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Member Role Distribution & Access Mix */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-[#22c55e]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Workspace Role Distribution
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Governance</span>
          </div>

          <div className="h-40 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={memberRoleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {memberRoleDistribution.map((entry, index) => (
                    <Cell key={`role-pie-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  formatter={(val: any) => [`${val} Members`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <Users className="w-5 h-5 text-slate-400 mb-0.5" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Seats</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {memberRoleDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">{item.count} user{item.count > 1 ? 's' : ''}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Members Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative group hover:border-[#22c55e]/50 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">{member.name}</h3>
                    {member.role === 'Admin' && (
                      <span className="p-1 rounded bg-amber-50 dark:bg-amber-950 text-amber-500" title="Admin Organizer">
                        <Crown className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5" /> {member.email}
                  </div>
                  {member.phone && (
                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3 h-3" /> {member.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {onOpenNudgeCenter && (
                  <button
                    onClick={() => onOpenNudgeCenter(member.id)}
                    className="p-1.5 text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg transition-all"
                    title={`Send logging nudge to ${member.name}`}
                  >
                    <BellRing className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => openEditMemberModal(member)}
                  className="p-1.5 text-slate-400 hover:text-[#22c55e] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-all"
                  title="Edit member details and role"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {!member.isCurrentUser && members.length > 1 && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-all"
                    title="Remove member from group"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Role & Authority</span>
                <span className="font-bold text-slate-900 dark:text-white block mt-1">{member.role}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Monthly Allowance</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mt-1">
                  {member.monthlyAllowance ? `${group.currency}${member.monthlyAllowance.toLocaleString()}` : 'No Cap'}
                  {member.monthlyAllowance ? (
                    <span className="text-[10px] text-slate-400 font-normal ml-1">(Day {member.allowanceScheduleDay || 1})</span>
                  ) : null}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disburse Allowances Confirmation Modal */}
      {showDisburseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-sky-500" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Disburse Monthly Allowances</h2>
              </div>
              <button onClick={() => setShowDisburseModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold">✕</button>
            </div>

            <p className="text-xs text-slate-500">
              This will automatically post allowance disbursement transactions into the ledger for all members with configured allowances.
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              {members.filter(m => (m.monthlyAllowance || 0) > 0).map(m => (
                <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 text-xs border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="font-bold text-slate-900 dark:text-white">{m.name}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    +{group.currency}{m.monthlyAllowance?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-200 dark:border-sky-800/50 flex items-center justify-between text-xs font-bold">
              <span className="text-sky-700 dark:text-sky-300">Total Group Outflow:</span>
              <span className="text-sky-900 dark:text-sky-100 font-mono text-sm">{group.currency}{totalMonthlyAllowances.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDisburseModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onDisburseAllowances) onDisburseAllowances();
                  setShowDisburseModal(false);
                }}
                className="px-5 py-2 rounded-lg bg-sky-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-700 transition-all shadow-md shadow-sky-600/20"
              >
                Confirm Disbursement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Invite Group Member</h2>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold">✕</button>
            </div>

            <form onSubmit={handleInviteMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Role & Authority</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  >
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Monthly Allowance ({group.currency})</label>
                  <input
                    type="number"
                    value={inviteAllowance}
                    onChange={(e) => setInviteAllowance(e.target.value)}
                    placeholder="e.g. 10000"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Allowance Scheduled Day (1-31)</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={inviteAllowanceDay}
                  onChange={(e) => setInviteAllowanceDay(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-[10px] text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-2">
                <Info className="w-3.5 h-3.5 shrink-0" />
                Invites are instant. New members immediately gain access to group budgets and shared expense splitters.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#22c55e] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1ea34d] transition-all shadow-md shadow-[#22c55e]/20"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member & Role Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#22c55e]" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Edit Member & Permissions</h2>
              </div>
              <button onClick={() => setEditingMember(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveEditedMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Role & Authority</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  >
                    <option value="Admin">Admin (Full Control)</option>
                    <option value="Member">Member (Log & Split)</option>
                    <option value="Viewer">Viewer (Read-Only)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Monthly Allowance ({group.currency})</label>
                  <input
                    type="number"
                    value={editAllowance}
                    onChange={(e) => setEditAllowance(e.target.value)}
                    placeholder="e.g. 10000"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Allowance Scheduled Day (1-31)</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={editAllowanceDay}
                  onChange={(e) => setEditAllowanceDay(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#22c55e] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1ea34d] transition-all shadow-md shadow-[#22c55e]/20"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Group Details Modal */}
      {showEditGroupModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#22c55e]" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Edit Group Workspace</h2>
              </div>
              <button onClick={() => setShowEditGroupModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveGroupInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Group Workspace Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Mewada Family Hub"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Workspace Category</label>
                <select
                  value={groupType}
                  onChange={(e) => setGroupType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                >
                  <option value="Family">Family</option>
                  <option value="Roommates">Roommates</option>
                  <option value="Trip & Vacation">Trip & Vacation</option>
                  <option value="Friends Circle">Friends Circle</option>
                  <option value="Project Group">Project Group</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Total Monthly Budget Target ({group.currency})</label>
                <input
                  type="number"
                  value={groupBudget}
                  onChange={(e) => setGroupBudget(e.target.value)}
                  placeholder="e.g. 75000"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditGroupModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#22c55e] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1ea34d] transition-all shadow-md shadow-[#22c55e]/20"
                >
                  Save Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

