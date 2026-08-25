import React from 'react';
import { HelpCircle, Calendar as CalendarIcon, MessageCircle, MoreHorizontal, Shield, Zap, Workflow, UserPlus, Info } from 'lucide-react';
import { cn } from '../../../../lib/utils';

export function QuestHelp() {
  const categories = [
    {
      title: "Task Execution & Delegation",
      icon: <Zap className="w-4 h-4 text-blue-500" />,
      topics: [
        "Dynamic Assignment: Assign tasks directly to team members from the People directory.",
        "Priority Management: Set High, Medium, or Low urgency to signal the system roadmap.",
        "Task Tagging: Categorize actions (e.g. #Design, #Technical) for filtered insights."
      ]
    },
    {
      title: "Intelligent Calendar",
      icon: <CalendarIcon className="w-4 h-4 text-orange-500" />,
      topics: [
        "Guest Invitations: Multi-select team guests for any scheduled event with visual avatars.",
        "Timeline Logic: 24-hour visual roadmap of your day with participant summaries.",
        "Stage Sync: Deadlines from Flow automatically populate your Quest calendar."
      ]
    },
    {
      title: "Collaboration & Sync",
      icon: <MessageCircle className="w-4 h-4 text-green-500" />,
      topics: [
        "Real-time Messenger: Direct and channel-based communication for quick block resolution.",
        "Unified Identity: Avatars and roles are consistent across Tasks, Calendar, and Chat.",
        "Mobile-Ready: Stay synchronized across all device breakpoints in the Arqon ecosystem."
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 overflow-y-auto animate-in fade-in duration-500 text-left">
      <div className="p-8 max-w-5xl mx-auto w-full">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100 dark:border-blue-800">
            <HelpCircle className="w-3.5 h-3.5" />
            Operational Guide
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
            Quest: The <span className="text-blue-500">Action Execution Engine</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed font-semibold max-w-3xl">
            Quest transforms abstract project goals into atomic, executable actions. Integrated with the People module, it ensures every task has a face, a deadline, and a purpose.
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
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
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

        <div className="p-8 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xl overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-4">Integration Summary</h2>
            <div className="space-y-4 max-w-xl">
               <div className="flex gap-4 p-4 rounded-xl bg-white/10 dark:bg-slate-900/10 border border-white/10">
                  <div className="font-black text-blue-400">QUEST</div>
                  <div className="text-sm">Defines <span className="underline italic">what needs to be done right now</span> to move to the next stage.</div>
               </div>
               <div className="flex gap-4 p-4 rounded-xl bg-white/10 dark:bg-slate-900/10 border border-white/10">
                  <div className="font-black text-emerald-400">FLOW</div>
                  <div className="text-sm">Defines <span className="underline italic">where the project is located</span> in its overall lifecycle.</div>
               </div>
            </div>
          </div>
          <Zap className="absolute -right-8 -bottom-8 w-64 h-64 text-white/5 dark:text-slate-900/5 rotate-12" />
        </div>
      </div>
    </div>
  );
}
