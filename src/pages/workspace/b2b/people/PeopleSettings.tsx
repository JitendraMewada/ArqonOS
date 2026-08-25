import React from 'react';
import { Settings, Save, ShieldCheck, FileText, LayoutGrid } from 'lucide-react';

export function PeopleSettings() {
  return (
    <div className="flex flex-col gap-8">
      <div className="mb-0">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">People Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure organization details, default roles, and permission presets.</p>
      </div>

      <div className="max-w-4xl space-y-8">
        {/* Organization Information */}
        <section className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-6">
            <LayoutGrid className="w-4 h-4 text-purple-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Organization Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Organization Name</label>
               <input 
                 type="text" 
                 defaultValue="ArqonOS Master" 
                 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
               />
            </div>
            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Primary Domain</label>
               <input 
                 type="text" 
                 defaultValue="arqon.os" 
                 readOnly
                 className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-500 cursor-not-allowed outline-none"
               />
            </div>
          </div>
        </section>

        {/* Defaults & Presets */}
        <section className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-4 h-4 text-purple-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Defaults & Presets</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Default Onboarding Role</label>
               <select 
                 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                 defaultValue="Client"
               >
                 <option value="Client">Client</option>
                 <option value="Designer">Designer</option>
                 <option value="Vendor">Vendor</option>
                 <option value="Custom">Custom Role</option>
               </select>
            </div>
            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Base Security Policy</label>
               <select 
                 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
               >
                 <option value="strict">Strict (Explicit Allow Only)</option>
                 <option value="standard">Standard</option>
               </select>
            </div>
          </div>
        </section>

        {/* Global Compliance */}
        <section className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-4 h-4 text-purple-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Global Compliance Options</h2>
          </div>
          
          <div className="space-y-4">
             <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-indigo-500/50 transition-colors">
               <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
               <div className="flex-1">
                 <div className="text-sm font-bold text-slate-900 dark:text-white">Require 2FA for Management Roles</div>
                 <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Enforces two-factor auth for GM and Admins</div>
               </div>
             </label>
             <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-indigo-500/50 transition-colors">
               <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
               <div className="flex-1">
                 <div className="text-sm font-bold text-slate-900 dark:text-white">Strict Role Hierarchy Enforced</div>
                 <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Prevents lower roles from modifying upper roles</div>
               </div>
             </label>
             <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-indigo-500/50 transition-colors">
               <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
               <div className="flex-1">
                 <div className="text-sm font-bold text-slate-900 dark:text-white">Automatic Audit Logging</div>
                 <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Retain system logs for 365 days</div>
               </div>
             </label>
          </div>
        </section>

        <div className="flex justify-end pt-4">
           <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2">
             <Save className="w-4 h-4" /> Save Configuration
           </button>
        </div>
      </div>
    </div>
  );
}
