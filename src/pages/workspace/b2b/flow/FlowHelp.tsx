import React from 'react';
import { HelpCircle, Workflow, Zap, Settings, BarChart3, Users, MessageCircle } from 'lucide-react';

export function FlowHelp() {
  const guides = [
    {
      title: "Process Mapping",
      desc: "Architect your business logic. Define custom stages like 'Initial Consultation' ➔ 'Systemic Design' ➔ 'Implementation'.",
      icon: <Workflow className="w-4 h-4 text-sky-500" />
    },
    {
      title: "Flow Automation",
      desc: "Systemize execution. Moving a project to a new stage instantly triggers pre-defined task sets in Quest and notifications in Connect.",
      icon: <Zap className="w-4 h-4 text-emerald-500" />
    },
    {
      title: "People Attribution",
      desc: "Assign stage-specific accountability. Link roles from the People module to project phases for automated workload balancing.",
      icon: <Users className="w-4 h-4 text-purple-500" />
    }
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto animate-in slide-in-from-right-4 duration-500 text-left">
      <div className="p-8 max-w-6xl mx-auto w-full">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-10 lg:p-20 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-[10px] font-black uppercase tracking-widest mb-8 border border-sky-100 dark:border-sky-800">
              <Settings className="w-3.5 h-3.5" />
              Structural Architecture
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-none max-w-3xl">
              Flow: The <span className="text-sky-500">Intelligent Project Roadmap</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-3xl leading-relaxed font-semibold">
              Flow isn't just a tracker; it's the systemic skeleton of your projects. It defines the "Where" while Quest handles the "What", creating a synchronized loop of high-performance delivery.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {guides.map((guide, i) => (
                <div key={i} className="flex flex-col gap-6 p-8 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-sky-100 dark:hover:border-sky-700 transition-all cursor-pointer group shadow-sm hover:shadow-xl">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform border border-slate-100 dark:border-slate-800">
                    {guide.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{guide.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{guide.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          <Workflow className="absolute -right-32 -top-32 w-[32rem] h-[32rem] text-slate-100 dark:text-slate-800/10 -rotate-12 pointer-events-none" />
        </div>

        <div className="mt-8 p-8 rounded-xl bg-sky-600 text-white shadow-xl shadow-sky-500/20">
          <h2 className="text-2xl font-black mb-6">Integration Example</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white/10 rounded-xl border border-white/10">
              <div className="text-[10px] font-black uppercase mb-1 text-sky-200">Trigger</div>
              <div className="text-sm font-bold">Project moves to "Technical Drawing" stage in Flow.</div>
            </div>
            <div className="p-5 bg-white/10 rounded-xl border border-white/10">
              <div className="text-[10px] font-black uppercase mb-1 text-sky-200">Action</div>
              <div className="text-sm font-bold">Automation rule detects the movement and triggers Quest.</div>
            </div>
            <div className="p-5 bg-white/10 rounded-xl border border-white/10">
              <div className="text-[10px] font-black uppercase mb-1 text-sky-200">Result</div>
              <div className="text-sm font-bold">Five specific tasks (CAD, Verify, etc) are created in Quest.</div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 p-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-md bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900">
                 <Zap className="w-8 h-8" />
              </div>
              <div>
                 <h4 className="text-xl font-bold text-slate-900 dark:text-white">Quest & Flow Summary</h4>
                 <p className="text-slate-500 dark:text-slate-400 max-w-sm">Flow defines <strong>where</strong> the project is. Quest defines <strong>what</strong> needs to be done right now.</p>
              </div>
           </div>
           <button onClick={() => window.open('https://ais-dev-o6zu3pgjttmtkfnmonwcwl-701388359410.asia-southeast1.run.app')} className="whitespace-nowrap px-5 py-2.5 bg-[#0ea5e9] text-white rounded-xl font-bold text-sm tracking-wide hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/30 transition-all flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" /> Detailed Guide
           </button>
        </div>
      </div>
    </div>
  );
}
