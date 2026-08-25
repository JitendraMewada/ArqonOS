import React from 'react';
import { Users, ShieldCheck, UserCheck, UserPlus } from 'lucide-react';
import { usePeople } from './PeopleContext';

export function PeopleOverview() {
  const { members, roles, departments } = usePeople();

  const activeMembersCount = members.filter(m => m.status === 'Active').length;
  const pendingMembersCount = members.filter(m => m.status === 'Invite Pending').length;

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-300 w-full">
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-left w-full">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Team <span className="text-[#a855f7]">Intelligence.</span>
          </h2>
          <p className="text-lg font-medium text-slate-500 mt-2">
            Managing <span className="text-[#a855f7] font-bold">{members.length} members</span> across {departments.length} departments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-8 shadow-sm flex flex-col gap-4">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 shadow-inner">
               <Users className="w-4 h-4" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Members</p>
           </div>
           <p className="text-4xl font-black text-slate-900 dark:text-white leading-none">{members.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-8 shadow-sm flex flex-col gap-4">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 shadow-inner">
               <UserCheck className="w-4 h-4" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Members</p>
           </div>
           <p className="text-4xl font-black text-slate-900 dark:text-white leading-none">{activeMembersCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-8 shadow-sm flex flex-col gap-4">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-500 shadow-inner">
               <UserPlus className="w-4 h-4" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Invites</p>
           </div>
           <p className="text-4xl font-black text-slate-900 dark:text-white leading-none">{pendingMembersCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-8 shadow-sm flex flex-col gap-4">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 shadow-inner">
               <ShieldCheck className="w-4 h-4" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Roles Defined</p>
           </div>
           <p className="text-4xl font-black text-slate-900 dark:text-white leading-none">{roles.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
             <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <ShieldCheck className="w-4 h-4 text-purple-500" /> Organization Departments
             </h3>
          </div>
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
             {departments.map(dept => {
               const deptMembers = members.filter(m => m.department === dept).length;
               return (
                 <div key={dept} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                   <div>
                     <h4 className="text-sm font-bold text-slate-900 dark:text-white">{dept}</h4>
                   </div>
                   <span className="text-xs font-bold text-slate-500 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm">
                     {deptMembers} members
                   </span>
                 </div>
               );
             })}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
             <Users className="w-4 h-4 text-indigo-500" /> Recent Activity
          </h3>
          <p className="text-xs text-slate-500 italic mb-4">Latest role assignments, new user invites, and status changes will be listed here.</p>
        </div>
        </div>
      </div>
    </div>
  );
}
