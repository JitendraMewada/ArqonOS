import React from 'react';
import { PlayCircle, GitBranch, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';
import { useFlow } from './FlowContext';
import { cn } from '../../../../lib/utils';

export function FlowOverview() {
  const { workflows, activeProjects, goToPage } = useFlow();

  const onTrackCount = activeProjects.filter(p => p.status === 'On Track').length;
  const delayedCount = activeProjects.filter(p => p.status === 'Delayed').length;
  const blockedCount = activeProjects.filter(p => p.status === 'Blocked').length;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Overview</h2>
          <p className="text-sm font-medium text-slate-500">Your high-level view of active workflows and process health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-500">
               <GitBranch className="w-4 h-4" />
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Workflows</p>
           </div>
           <p className="text-3xl font-black text-slate-900 dark:text-white">{workflows.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500">
               <ShieldCheck className="w-4 h-4" />
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">On Track Projects</p>
           </div>
           <p className="text-3xl font-black text-slate-900 dark:text-white">{onTrackCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-500">
               <PlayCircle className="w-4 h-4" />
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Delayed / Blocked</p>
           </div>
           <p className="text-3xl font-black text-slate-900 dark:text-white">{delayedCount + blockedCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500">
               <Zap className="w-4 h-4" />
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Automations Run</p>
           </div>
           <p className="text-3xl font-black text-slate-900 dark:text-white">142</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
             <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <PlayCircle className="w-4 h-4 text-sky-500" /> Recent Active Projects
             </h3>
          </div>
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
             {activeProjects.map(project => (
               <div key={project.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                 <div>
                   <h4 className="text-sm font-bold text-slate-900 dark:text-white">{project.name}</h4>
                   <p className="text-xs text-slate-500">{project.client} • Started {project.startDate}</p>
                 </div>
                 <span className={cn(
                   "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                   project.status === 'On Track' && "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
                   project.status === 'Delayed' && "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
                   project.status === 'Blocked' && "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                 )}>
                   {project.status}
                 </span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
             <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <GitBranch className="w-4 h-4 text-indigo-500" /> Top Workflows
             </h3>
             <button 
               onClick={() => goToPage('workflow builder')}
               className="text-[10px] font-bold text-sky-500 uppercase tracking-widest hover:text-sky-600 flex items-center gap-1"
             >
                View All <ArrowUpRight className="w-3 h-3" />
             </button>
          </div>
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
             {workflows.map(wf => {
               const activeWfProjects = activeProjects.filter(p => p.workflowId === wf.id).length;
               return (
                 <div key={wf.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                   <div className="flex items-center justify-between mb-2">
                     <h4 className="text-sm font-bold text-slate-900 dark:text-white">{wf.name}</h4>
                     <span className="text-xs font-bold text-slate-500 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm">
                       {activeWfProjects} active
                     </span>
                   </div>
                   <p className="text-xs text-slate-500 line-clamp-1">{wf.description}</p>
                 </div>
               );
             })}
          </div>
        </div>
      </div>
    </div>
  );
}
