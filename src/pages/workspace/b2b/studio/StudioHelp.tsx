import React from 'react';
import { HelpCircle, Layers, Box, FileText, Image, PenTool, Layout, Info, ShieldCheck, Palette } from 'lucide-react';

export function StudioHelp() {
  const categories = [
    {
      title: "Design Workspace",
      icon: <Layers className="w-4 h-4 text-orange-500" />,
      topics: [
        "Project Canvas: Create and edit holistic design concepts in a multi-layered workspace.",
        "Systemic Templates: Reuse brand-standard layouts for consistency across projects.",
        "Collaborative Edit: Multi-user design sessions with real-time cursor tracking."
      ]
    },
    {
      title: "Asset Management",
      icon: <Box className="w-4 h-4 text-blue-500" />,
      topics: [
        "Material Library: Store and categorize 3D models, textures, and fabric samples.",
        "System Labels: Tag assets by vendor, cost, and availability for systemic lookup.",
        "Cloud Sync: Centralized storage for all high-resolution design assets."
      ]
    },
    {
      title: "Client Presentation",
      icon: <FileText className="w-4 h-4 text-emerald-500" />,
      topics: [
        "Interactive Boards: Share lived design boards with clients via secure portals.",
        "Feedback Loop: Capture client comments directly on specific design elements.",
        "Export Engine: Professional-grade PDF and CAD exports for technical precision."
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 overflow-y-auto animate-in fade-in duration-500 text-left">
      <div className="p-8 max-w-5xl mx-auto w-full">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-orange-100 dark:border-orange-800">
            <Layers className="w-3.5 h-3.5" />
            Creative Documentation
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
            Studio: The <span className="text-orange-500">Creation Engine</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed font-semibold max-w-3xl">
            Studio is the creative heart of ArqonOS. It transforms abstract ideas into visual reality, using a systemic approach to materials, layouts, and storytelling.
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
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
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

        <div className="p-8 rounded-xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
               <Palette className="w-10 h-10 text-white" />
            </div>
            <div>
               <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">Systemic Aesthetics</h2>
               <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                 In ArqonOS, design isn't just about beauty—it's about integration. Every material used in Studio is linked to the **Cost** and **Vendor** modules, preventing design decisions from breaking project budgets.
               </p>
            </div>
          </div>
          <Layers className="absolute -right-16 -bottom-16 w-64 h-64 text-white/5 rotate-12" />
        </div>
      </div>
    </div>
  );
}
