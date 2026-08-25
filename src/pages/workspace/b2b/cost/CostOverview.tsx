import React from 'react';
import { Wallet, Receipt, TrendingUp, PieChart, ArrowUpRight } from 'lucide-react';
import { cn } from '../../../../lib/utils';

export function CostOverview() {
  return (
    <div className="p-6 h-full flex flex-col gap-6 animate-in fade-in duration-300 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Overview</h2>
          <p className="text-sm font-medium text-slate-500">Your high-level view of budgets, expenditures, and financial health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500">
               <Wallet className="w-4 h-4" />
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Budget</p>
           </div>
           <p className="text-3xl font-black text-slate-900 dark:text-white">₹8.5M</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-500">
               <Receipt className="w-4 h-4" />
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Expenses</p>
           </div>
           <p className="text-3xl font-black text-slate-900 dark:text-white">₹3.2M</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-500">
               <TrendingUp className="w-4 h-4" />
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Remaining</p>
           </div>
           <p className="text-3xl font-black text-slate-900 dark:text-white">₹5.3M</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500">
               <PieChart className="w-4 h-4" />
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Budgets</p>
           </div>
           <p className="text-3xl font-black text-slate-900 dark:text-white">5</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
             <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <Wallet className="w-4 h-4 text-emerald-500" /> Recent Budgets
             </h3>
          </div>
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
             <p className="text-xs text-slate-500 italic mb-4">Current budget allocations and their burn rates will appear here.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
             <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <Receipt className="w-4 h-4 text-rose-500" /> Latest Expenses
             </h3>
             <button className="text-[10px] font-bold text-sky-500 uppercase tracking-widest hover:text-sky-600 flex items-center gap-1">
                View All <ArrowUpRight className="w-3 h-3" />
             </button>
          </div>
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
             <p className="text-xs text-slate-500 italic mb-4">Recently logged expenditures and categorizations will be listed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
