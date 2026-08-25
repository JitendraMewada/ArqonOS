import React from 'react';
import { HelpCircle, Database, ClipboardList, PieChart, Coins, DollarSign, ArrowUpRight, TrendingDown, Info, ShieldCheck } from 'lucide-react';

export function CostHelp() {
  const categories = [
    {
      title: "Budget Planning",
      icon: <ClipboardList className="w-4 h-4 text-slate-500" />,
      topics: [
        "Systemic Estimation: Build detailed project budgets using historical cost data.",
        "Buffer Logic: Automatically include contingency margins for risk mitigation.",
        "Approval Workflows: Send budgets to upper management for systemic sign-off."
      ]
    },
    {
      title: "Expense Tracking",
      icon: <Database className="w-4 h-4 text-blue-500" />,
      topics: [
        "Real-time Burn: View actual spend vs. projected budget as vendor invoices arrive.",
        "Categorization: Automatically map expenses to project phases (e.g. #Civil, #Finishes).",
        "Multi-currency: Handle global projects with integrated exchange rate logic."
      ]
    },
    {
      title: "Financial Reporting",
      icon: <PieChart className="w-4 h-4 text-emerald-500" />,
      topics: [
        "Profitability Insights: View project margins and ROI through automated reports.",
        "Audit Trails: Complete ledger of every financial movement within a project.",
        "Stakeholder Updates: Export clean, brand-standard financial summaries for clients."
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 overflow-y-auto animate-in fade-in duration-500 text-left">
      <div className="p-8 max-w-5xl mx-auto w-full">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-slate-100 dark:border-slate-800">
            <Database className="w-3.5 h-3.5" />
            Control Documentation
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
            Cost: The <span className="text-slate-500">Financial Control Engine</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed font-semibold max-w-3xl">
            Cost is the mathematical backbone of your projects. It ensures that every creative decision in Studio and every milestone in Flow remains financially viable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {categories.map((cat, i) => (
            <div key={i} className="p-8 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
              <div className="mb-4 w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{cat.title}</h3>
              <ul className="space-y-4">
                {cat.topics.map((topic, j) => {
                  const [bold, rest] = topic.split(': ');
                  return (
                    <li key={j} className="text-sm text-slate-500 dark:text-slate-400 flex items-start gap-3 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 flex-shrink-0" />
                      <div>
                        <strong className="text-slate-700 dark:text-slate-200 block mb-0.5">{bold}</strong>
                        {rest}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-8 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-emerald-500 italic font-black uppercase text-xs tracking-tighter">
                 <ArrowUpRight className="w-4 h-4" /> Revenue Loop
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Systemic Billing</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Connect your Cost module to **Quest** milestones to trigger automated client invoices once a task is marked "Completed" and verified.
              </p>
           </div>
           <div className="p-8 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-rose-500 italic font-black uppercase text-xs tracking-tighter">
                 <TrendingDown className="w-4 h-4" /> Cost Loop
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Leakage Prevention</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Real-time alerts trigger when actual material costs in **Vendor** exceed the original budget baseline defined here in Cost.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
