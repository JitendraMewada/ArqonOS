import React from 'react';
import { HelpCircle, Hexagon, TrendingUp, MessageSquare, Target, Users, Search, Info, ShieldCheck } from 'lucide-react';

export function ConnectHelp() {
  const categories = [
    {
      title: "CRM & Relationship Logic",
      icon: <Users className="w-4 h-4 text-[#3b82f6]" />,
      topics: [
        "Lead Management: Capture and qualify potential projects with systemic attribution.",
        "Client History: View a unified timeline of every interaction, email, and meeting.",
        "Relationship Status: Map contacts to client roles within the Arqon ecosystem."
      ]
    },
    {
      title: "Sales Pipeline",
      icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
      topics: [
        "Stage Logic: Move deals through custom funnels synchronized with Flow stages.",
        "Win/Loss Analysis: Systemic tracking of why projects convert or stall.",
        "Resource Forecasting: View future workloads based on active pipeline probability."
      ]
    },
    {
      title: "Communication Hub",
      icon: <MessageSquare className="w-4 h-4 text-emerald-500" />,
      topics: [
        "Omni-channel: Sync emails and messages into a single project-viewing thread.",
        "Client Access: Manage what information is shared with external stakeholders.",
        "Follow-up Logic: Set automated reminders for critical client touchpoints."
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 overflow-y-auto animate-in fade-in duration-500 text-left">
      <div className="p-8 max-w-5xl mx-auto w-full">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-[#3b82f6] dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100 dark:border-blue-800">
            <Hexagon className="w-3.5 h-3.5" />
            Growth Documentation
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
            Connect: The <span className="text-[#3b82f6]">Relationship Engine</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed font-semibold max-w-3xl">
            Connect manages the gateway to your business. It bridges the gap between external leads and internal execution, ensuring every client relationship is data-driven and systemic.
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
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-2 flex-shrink-0" />
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

        <div className="p-8 rounded-xl bg-[#3b82f6] text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
               <ShieldCheck className="w-8 h-8 opacity-50" />
               Lead-to-Action Sync
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <h4 className="text-sm font-black uppercase tracking-widest text-blue-100">Step 1: Capture</h4>
                  <p className="text-sm text-blue-50">New lead enters Connect via integrated website formal or manual entry.</p>
               </div>
               <div className="space-y-2">
                  <h4 className="text-sm font-black uppercase tracking-widest text-blue-100">Step 2: Initialize</h4>
                  <p className="text-sm text-blue-50">Converting a lead automatically sets up a project folder in Studio and a roadmap in Flow.</p>
               </div>
            </div>
          </div>
          <Hexagon className="absolute -right-16 -bottom-16 w-64 h-64 text-white/10 rotate-12" />
        </div>
      </div>
    </div>
  );
}
