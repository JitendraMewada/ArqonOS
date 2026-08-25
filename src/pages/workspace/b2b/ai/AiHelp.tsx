import React from 'react';
import { HelpCircle, Brain, Zap, Sparkles, MessageSquare, Target, Settings, Info, ShieldCheck, LineChart } from 'lucide-react';

export function AiHelp() {
  const categories = [
    {
      title: "Smart Automation",
      icon: <Zap className="w-4 h-4 text-emerald-500" />,
      topics: [
        "Predictive Actions: Automate task creation in Quest based on historical project patterns.",
        "Resource Optimization: Dynamic team allocation based on real-time expertise and workload.",
        "Systemic Triggers: Advanced logic flows that cross-pollinate data between B2B and B2C modules."
      ]
    },
    {
      title: "Outcome Prediction",
      icon: <Brain className="w-4 h-4 text-purple-500" />,
      topics: [
        "Risk Modeling: Identify projects likely to exceed budget or timeline before it happens.",
        "Vibe Analysis: Sentiment tracking for client communication to proactively manage relationships.",
        "Revenue Forecasting: AI-driven pipeline scoring linked directly to Connect CRM data."
      ]
    },
    {
      title: "Process Optimization",
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      topics: [
        "Bottleneck Insights: AI-generated suggestions for improving Flow stage transitions.",
        "Systemic Efficiency: Continuous learning from project completion data to refine baseline templates.",
        "Creative Assistance: Generative suggestions for Studio assets and presentation narratives."
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 overflow-y-auto animate-in fade-in duration-500 text-left">
      <div className="p-8 max-w-5xl mx-auto w-full">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100 dark:border-emerald-800">
            <Brain className="w-3.5 h-3.5" />
            Intelligence Documentation
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
            AI: The <span className="text-emerald-500">Intelligent Core</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed font-semibold max-w-3xl">
            The AI module is the super-processor of ArqonOS. It sits above all other engines, identifying patterns and generating efficiencies that standard dashboards might miss.
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
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
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

        <div className="p-12 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-3xl relative overflow-hidden group">
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="relative shrink-0">
                 <div className="w-24 h-24 bg-emerald-500 rounded-md blur-2xl opacity-20 absolute top-0 left-0" />
                 <div className="w-24 h-24 bg-purple-500 rounded-md blur-2xl opacity-20 absolute bottom-0 right-0" />
                 <Brain className="w-20 h-20 text-white relative z-10 group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="space-y-4">
                 <h2 className="text-3xl font-black tracking-tight leading-none uppercase italic border-b-2 border-emerald-500 w-fit pb-2">Built on Intelligent Systems</h2>
                 <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
                    ArqonOS isn't just "software with AI." It is an AI-first operating system. The AI module continuously monitors your **Flow** stage speeds and **Cost** fluctuations to suggest precise, systemic improvements that compound over time.
                 </p>
              </div>
           </div>
           <Sparkles className="absolute top-10 left-10 w-4 h-4 text-emerald-500 opacity-20" />
           <Target className="absolute bottom-10 right-10 w-8 h-8 text-purple-500 opacity-20" />
        </div>
      </div>
    </div>
  );
}
