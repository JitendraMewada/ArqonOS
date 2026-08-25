import React, { useState } from 'react';
import { Layout, Users, ChevronRight, X, Settings2 } from 'lucide-react';
import { usePeople } from './PeopleContext';
import { cn } from '../../../../lib/utils';

export function TeamsDepartments({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { departments, members, addDepartment } = usePeople();
  const [showAddModal, setShowAddModal] = useState(false);
  const [managingDept, setManagingDept] = useState<string | null>(null);
  const [newDept, setNewDept] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDept.trim()) {
      addDepartment(newDept.trim());
      setNewDept('');
      setShowAddModal(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 transition-colors p-6 overflow-auto relative">
      {/* Add Department Modal */}
      {managingDept && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
               <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                 <Settings2 className="w-4 h-4 text-purple-500" /> Manage {managingDept}
               </h3>
               <button onClick={() => setManagingDept(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                 <X className="w-4 h-4" />
               </button>
            </div>
            <div className="p-6 space-y-6">
               <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Member Assignments</h4>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    Add or reassign members for this department in the central Directory. Member roles and permissions dictate their access level.
                  </p>
                  <button 
                    onClick={() => {
                      setManagingDept(null);
                      if (onNavigate) onNavigate('Directory');
                    }}
                    className="w-full py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest rounded-lg hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors flex items-center justify-center gap-2"
                  >
                    Open Directory <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-sm border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
               <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                 <Layout className="w-4 h-4 text-purple-500" /> Create Department
               </h3>
               <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
               </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Department Name</label>
                 <input 
                   required
                   autoFocus
                   type="text" 
                   placeholder="e.g. Marketing" 
                   className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                   value={newDept}
                   onChange={e => setNewDept(e.target.value)}
                 />
              </div>
              <div className="pt-4 flex gap-3">
                 <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                 <button type="submit" className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-purple-500/20 transition-all active:scale-95">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Teams & Departments</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Structure organization, create departments, and assign teams.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {departments.map(dept => {
          const deptMembers = members.filter(m => m.department === dept);
          return (
            <div key={dept} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex justify-center items-center">
                  <Layout className="w-4 h-4 text-purple-500" />
                </div>
                <div className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 text-[10px] font-black uppercase text-slate-400">
                  {deptMembers.length} Members
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{dept}</h3>
              
              <div className="flex-1">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Team Members</h4>
                <div className="flex -space-x-2 overflow-hidden mb-4">
                  {deptMembers.slice(0, 5).map(m => (
                    <div key={m.id} className={cn("inline-block h-8 w-8 rounded-md ring-2 ring-white dark:ring-slate-800 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden", m.color)}>
                      {m.avatar ? <img src={m.avatar} alt="" className="w-full h-full rounded-md object-cover" /> : m.initial}
                    </div>
                  ))}
                  {deptMembers.length > 5 && (
                    <div className="inline-block h-8 w-8 rounded-md ring-2 ring-white dark:ring-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500">
                      +{deptMembers.length - 5}
                    </div>
                  )}
                  {deptMembers.length === 0 && (
                     <div className="text-xs text-slate-500 italic">No members assigned</div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                 <button onClick={() => setManagingDept(dept)} className="text-xs font-bold text-purple-500 flex items-center hover:text-purple-600 transition-colors">
                   Manage Department <ChevronRight className="w-4 h-4 ml-1" />
                 </button>
              </div>
            </div>
          );
        })}
        
        {/* Add new department card */}
        <button onClick={() => setShowAddModal(true)} className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 group min-h-[200px]">
          <div className="w-12 h-12 rounded-md bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
             <div className="text-2xl font-light">+</div>
          </div>
          <span className="text-sm font-bold">Create Department</span>
        </button>
      </div>
    </div>
  );
}
