import React from 'react';
import { Users, ShoppingCart, Truck, Activity, ArrowUpRight } from 'lucide-react';
import { cn } from '../../../../lib/utils';

export function VendorOverview() {
  return (
    <div className="p-6 h-full flex flex-col gap-6 animate-in fade-in duration-300 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Overview</h2>
          <p className="text-sm font-medium text-slate-500">Your supply chain, procurement, and active vendors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-500">
               <Users className="w-4 h-4" />
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Vendors</p>
           </div>
           <p className="text-3xl font-black text-slate-900 dark:text-white">45</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500">
               <ShoppingCart className="w-4 h-4" />
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pending POs</p>
           </div>
           <p className="text-3xl font-black text-slate-900 dark:text-white">12</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-500">
               <Truck className="w-4 h-4" />
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">In Transit</p>
           </div>
           <p className="text-3xl font-black text-slate-900 dark:text-white">8</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-500">
               <Activity className="w-4 h-4" />
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Action Required</p>
           </div>
           <p className="text-3xl font-black text-slate-900 dark:text-white">2</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
             <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <ShoppingCart className="w-4 h-4 text-cyan-500" /> Recent Purchase Orders
             </h3>
          </div>
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
             <p className="text-xs text-slate-500 italic mb-4">Ongoing procurement operations will be listed here.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
             <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <Truck className="w-4 h-4 text-amber-500" /> Real-time Deliveries
             </h3>
             <button className="text-[10px] font-bold text-sky-500 uppercase tracking-widest hover:text-sky-600 flex items-center gap-1">
                View All <ArrowUpRight className="w-3 h-3" />
             </button>
          </div>
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
             <p className="text-xs text-slate-500 italic mb-4">Live tracking of active shipments and delays.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
