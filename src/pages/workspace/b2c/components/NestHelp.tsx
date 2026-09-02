import React, { useState } from 'react';
import { 
  HelpCircle, 
  Users, 
  Split, 
  Wallet, 
  Target, 
  ShieldCheck, 
  PlusCircle, 
  ChevronDown, 
  ChevronUp,
  Receipt,
  Sparkles,
  Info
} from 'lucide-react';
import { cn } from '../../../../lib/utils';

export function NestHelp() {
  const [activeTab, setActiveTab] = useState<'pricing' | 'splitting' | 'vaults' | 'faq'>('pricing');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Group-Based Pricing work in Arqon Nest?',
      a: 'Unlike B2B per-user pricing, Nest charges one flat subscription per group workspace (Starter at ₹99/mo, Plus at ₹249/mo, Pro at ₹449/mo). Each group includes 3 members by default, and extra members are ₹99 per user/month.'
    },
    {
      q: 'How does the Multi-Payer Bill Splitter resolve group debt?',
      a: 'Whenever any member pays an expense (e.g. groceries, electricity, dinner), Nest automatically divides the cost equally or by percentage among chosen members. The settlement engine calculates net balances so friends and family can settle debts with the minimum number of transfers.'
    },
    {
      q: 'What are Ring-Fenced Shared Vaults?',
      a: 'Vaults allow groups to lock away funds for specific purposes (such as holidays, house renovation, emergency reserves). Balances in vaults cannot be accidentally drawn down by routine monthly budget expenses.'
    },
    {
      q: 'Can members set individual discretionary monthly allowances?',
      a: 'Yes. In the Family module, organizers can assign individual spending allowances for kids, roommates, or students to ensure individual limits are respected within the broader group.'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-[#22c55e] text-[10px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-900">
          <HelpCircle className="w-3.5 h-3.5" />
          Nest B2C Knowledge Hub
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Arqon Nest: <span className="text-[#22c55e]">Collaborative Finance Guide</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl font-medium leading-relaxed">
          Comprehensive documentation on group-based pricing, multi-payer expense splits, budget pacing, and shared vault governance.
        </p>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          {[
            { id: 'pricing', label: '1. Group Pricing Model (₹99 Hook)', icon: Users },
            { id: 'splitting', label: '2. Bill Splitting & Settlements', icon: Split },
            { id: 'vaults', label: '3. Shared Vaults & Goals', icon: Target },
            { id: 'faq', label: '4. Nest FAQs', icon: HelpCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2',
                  activeTab === tab.id
                    ? 'bg-[#22c55e] text-white shadow-md shadow-[#22c55e]/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Group Pricing Model */}
      {activeTab === 'pricing' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#22c55e]">Starter Plan</span>
              <div className="text-3xl font-black text-slate-900 dark:text-white">₹99 <span className="text-xs font-bold text-slate-400">/ group / mo</span></div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Extremely low friction entry. Includes 3 users, shared workspace, and basic tracking.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-[#22c55e] shadow-lg shadow-[#22c55e]/10 space-y-3 relative">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#22c55e]">Plus Plan ⭐ (Recommended)</span>
              <div className="text-3xl font-black text-slate-900 dark:text-white">₹249 <span className="text-xs font-bold text-slate-400">/ group / mo</span></div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Advanced tracking, categories, spending insights, charts, and shared visibility.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pro Plan</span>
              <div className="text-3xl font-black text-slate-900 dark:text-white">₹449 <span className="text-xs font-bold text-slate-400">/ group / mo</span></div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Complete control, advanced analytics, audit exports, backup, and unlimited history.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-start gap-3">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>Per-Group Rule:</strong> Extra members are billed at <strong>₹99 per user/month</strong> beyond the 3 included seats. Total Cost = Base Plan + (Extra Users × ₹99).
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Splitting & Settlements */}
      {activeTab === 'splitting' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">How Bill Splitting Operates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">1. Single Member Pays</span>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">One member covers the upfront invoice (e.g. ₹6,000 grocery bill).</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">2. Automatic Split</span>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">The cost is divided across chosen group participants (₹1,500 each for 4 members).</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">3. Net Settlement</span>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Payer receives +₹4,500 credit; others register -₹1,500 debt until settled.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Vaults & Goals */}
      {activeTab === 'vaults' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Collective Goal Accumulation</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Family members can deposit into shared target pots with individual attribution and progress tracking.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: FAQ */}
      {activeTab === 'faq' && (
        <div className="space-y-3 animate-in fade-in duration-300">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span className="text-sm font-bold text-slate-900 dark:text-white">{faq.q}</span>
                {expandedFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {expandedFaq === idx && (
                <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
