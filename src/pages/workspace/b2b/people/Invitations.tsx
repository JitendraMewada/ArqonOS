import React, { useState } from 'react';
import { Mail, Link as LinkIcon, UserPlus, Clock, Check, X } from 'lucide-react';
import { usePeople } from './PeopleContext';
import { cn } from '../../../../lib/utils';

export function Invitations() {
  const { roles, departments } = usePeople();
  const [activeTab, setActiveTab] = useState<'email' | 'link'>('email');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  const [pendingInvites, setPendingInvites] = useState([
    { id: '1', email: 'alex@arqon.os', role: 'Designer', department: 'Design', status: 'Pending', timestamp: '2 days ago' },
    { id: '2', email: 'contractor@external.com', role: 'Vendor', department: 'External', status: 'Expired', timestamp: '1 week ago' },
    { id: '3', email: 'sarah@hq.arqon.os', role: 'HR', department: 'HR', status: 'Pending', timestamp: '5 hours ago' }
  ]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && selectedRole && selectedDept) {
      setPendingInvites(prev => [
        { id: Date.now().toString(), email, role: selectedRole, department: selectedDept, status: 'Pending', timestamp: 'Just now' },
        ...prev
      ]);
      setEmail('');
      setSelectedRole('');
      setSelectedDept('');
    }
  };

  const cancelInvite = (id: string) => {
    setPendingInvites(prev => prev.filter(inv => inv.id !== id));
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="mb-0">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Invitations</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Onboard new team members or external clients.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="flex h-12 border-b border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setActiveTab('email')}
                className={cn("flex-1 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors", activeTab === 'email' ? "text-purple-600 bg-purple-50/50 dark:bg-purple-900/10 border-b-2 border-purple-600" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50")}
              >
                <Mail className="w-4 h-4" /> By Email
              </button>
              <button 
                onClick={() => setActiveTab('link')}
                className={cn("flex-1 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors", activeTab === 'link' ? "text-purple-600 bg-purple-50/50 dark:bg-purple-900/10 border-b-2 border-purple-600" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50")}
              >
                <LinkIcon className="w-4 h-4" /> via Link
              </button>
            </div>

            <div className="p-5 p-6 animate-in fade-in duration-200">
              {activeTab === 'email' ? (
                <form onSubmit={handleInvite} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="name@arqon.os"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Assign Pre-Role</label>
                    <select 
                      required
                      value={selectedRole}
                      onChange={e => setSelectedRole(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    >
                      <option value="" disabled>Select Role...</option>
                      {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Assign Department</label>
                    <select 
                      required
                      value={selectedDept}
                      onChange={e => setSelectedDept(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    >
                      <option value="" disabled>Select Department...</option>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="w-full mt-2 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" /> Send Invite
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Assign Pre-Role for Link</label>
                    <select 
                      value={selectedRole}
                      onChange={e => setSelectedRole(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    >
                      <option value="" disabled>Select Role...</option>
                      {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                    </select>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400 break-all select-all">
                      https://arqon.os/join/t-{selectedRole.toLowerCase().replace(' ', '-') || 'role'}-8f2a
                    </div>
                  </div>
                  <button disabled={!selectedRole} className="w-full py-3 bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    Copy Magic Link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pending Invitations</h3>
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-bold rounded-lg text-nowrap">{pendingInvites.length} Pending</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
               {pendingInvites.length > 0 ? pendingInvites.map(invite => (
                 <div key={invite.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                   <div className="flex items-start gap-3 w-1/2">
                     <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                       <Mail className="w-4 h-4 text-slate-500" />
                     </div>
                     <div className="min-w-0">
                       <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{invite.email}</div>
                       <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{invite.role} <span className="text-slate-400">• {invite.department}</span></div>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-4">
                     <div className={cn("px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1", 
                       invite.status === 'Pending' ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" :
                       "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                     )}>
                       <Clock className="w-3 h-3" /> {invite.status}
                     </div>
                     <span className="text-xs text-slate-400 w-20 text-right">{invite.timestamp}</span>
                     
                     <button onClick={() => cancelInvite(invite.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Revoke Invite">
                       <X className="w-4 h-4" />
                     </button>
                   </div>
                 </div>
               )) : (
                 <div className="p-8 text-center text-slate-500 text-sm">No pending invitations.</div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
