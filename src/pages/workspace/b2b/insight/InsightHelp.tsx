import React from 'react';
import { HelpCircle, LineChart, LayoutDashboard, Activity, BarChart, TrendingUp, Target, Search, Info, ShieldCheck, Zap } from 'lucide-react';

export function InsightHelp() {
  const categories = [
    {
      title: "Performance Dashboards",
      icon: <LayoutDashboard className="w-4 h-4 text-slate-500" />,
      topics: [
        "Real-time Pulse: View the live operational status of all projects across Flow and Quest.",
        "Team Efficiency: Analyze task completion rates and personnel workload distribution.",
        "Operational Health: Systemic red-flag detection for blocked stages or late tasks."
      ]
    },
    {
      title: "Data Analytics",
      icon: <LineChart className="w-4 h-4 text-blue-500" />,
      topics: [
        "Historical Trends: Compare current project timelines against company benchmarks.",
        "Profitability Drill-down: Detailed ROI analysis on a per-project or per-vendor basis.",
        "Bottleneck Detection: Identify recurring friction points in your systemic workflows."
      ]
    },
    {
      title: "Systemic Forecasts",
      icon: <Activity className="w-4 h-4 text-emerald-500" />,
      topics: [
        "Predictive Roadmap: Model future project timelines based on current resource burn.",
        "Revenue Projection: Integrated pipeline probability linked to Connect deal stages.",
        "Capacity Planning: Automated suggestions for team scaling based on workload trends."
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 overflow-y-auto animate-in fade-in duration-500 text-left">
      <div className="p-8 max-w-5xl mx-auto w-full">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-slate-100 dark:border-slate-800">
            <LineChart className="w-3.5 h-3.5" />
            Strategic Documentation
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
            Insight: The <span className="text-slate-500">Analytics Engine</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed font-semibold max-w-3xl">
            Insight is the intelligence layer of ArqonOS. It transforms the raw data generated in Quest, Flow, and Cost into actionable strategic decisions for your business.
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

        <div className="p-10 rounded-xl bg-indigo-600 text-white shadow-2xl relative overflow-hidden text-center md:text-left">
           <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="w-24 h-24 bg-white/20 rounded-xl flex items-center justify-center shrink-0 border border-white/20 backdrop-blur-xl">
                 <Target className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-2">
                 <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Systems beat Skill</h2>
                 <p className="text-indigo-100 text-sm leading-relaxed max-w-2xl font-medium">
                    The Insight module proves the Arqon core thesis. By aggregating data across the entire ecosystem, we eliminate the need for guesswork, allowing you to manage your business with scientific precision.
                 </p>
              </div>
           </div>
           <LineChart className="absolute -right-20 -bottom-20 w-[30rem] h-[30rem] text-white/5 rotate-12 pointer-events-none" />
           <Zap className="absolute top-10 right-10 w-12 h-12 text-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
