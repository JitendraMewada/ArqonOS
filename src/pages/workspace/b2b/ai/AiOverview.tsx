import React from 'react';
import { Cpu, Command, Network, Sparkles, Brain, ArrowUpRight } from 'lucide-react';
import { cn } from '../../../../lib/utils';

export function AiOverview() {
  return (
    <div className="p-6 h-full flex flex-col gap-6 animate-in fade-in duration-300 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Overview</h2>
          <p className="text-sm font-medium text-slate-500">Your AI neural core status and active automations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500">
               <Cpu className="w-4 h-4" />
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Models</p>
           </div>
           <p className="text-3xl font-black text-slate-900 dark:text-white">3</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500">
               <Command className="w-4 h-4" />
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Automations</p>
           </div>
           <p className="text-3xl font-black text-slate-900 dark:text-white">1,204</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-500">
               <Network className="w-4 h-4" />
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Neural Connections</p>
           </div>
           <p className="text-3xl font-black text-slate-900 dark:text-white">84k</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-500">
               <Sparkles className="w-4 h-4" />
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Optimization Score</p>
           </div>
           <p className="text-3xl font-black text-slate-900 dark:text-white">96%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
             <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <Network className="w-4 h-4 text-emerald-500" /> Neural System Health
             </h3>
          </div>
          <div className="p-5 flex-1 flex flex-col items-center justify-center min-h-[200px]">
             <div className="w-32 h-32 rounded-md border-4 border-emerald-500 border-t-emerald-200 animate-spin flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-md flex items-center justify-center">
                  <Brain className="w-8 h-8 text-emerald-500" />
                </div>
             </div>
             <p className="text-center text-xs text-slate-500 font-semibold uppercase tracking-widest">System Optimal</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
             <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <Command className="w-4 h-4 text-indigo-500" /> Active AI Predictions
             </h3>
             <button className="text-[10px] font-bold text-sky-500 uppercase tracking-widest hover:text-sky-600 flex items-center gap-1">
                View All <ArrowUpRight className="w-3 h-3" />
             </button>
          </div>
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
             <p className="text-xs text-slate-500 italic mb-4">Live predictions from active workspace operations will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
