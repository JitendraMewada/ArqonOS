import React from 'react';
import { HelpCircle, Truck, Briefcase, ShoppingCart, FileText, Package, Globe, Info, ShieldCheck, Box } from 'lucide-react';

export function VendorHelp() {
  const categories = [
    {
      title: "Supplier Directory",
      icon: <Briefcase className="w-4 h-4 text-cyan-500" />,
      topics: [
        "Vendor Mapping: Centralize contacts for contractors, material suppliers, and fabricators.",
        "Performance Ratings: Systemic quality scores based on past project delivery.",
        "Compliance: Store and track vendor licenses, insurance, and certifications."
      ]
    },
    {
      title: "Procurement Workflow",
      icon: <ShoppingCart className="w-4 h-4 text-blue-500" />,
      topics: [
        "Purchase Orders: Generate and track POs linked directly to project budget items.",
        "Order Tracking: Real-time status updates from 'Ordered' to 'On-Site Delivery'.",
        "Inventory Sync: Automatically update your Material Library as supplies arrive."
      ]
    },
    {
      title: "Contract Management",
      icon: <FileText className="w-4 h-4 text-emerald-500" />,
      topics: [
        "SLA Tracking: Digital management of Service Level Agreements and technical specs.",
        "Payment Milestones: Schedule vendor payments linked to Quest task completion.",
        "Dispute Resolution: Document history of material defects or delivery delays."
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 overflow-y-auto animate-in fade-in duration-500 text-left">
      <div className="p-8 max-w-5xl mx-auto w-full">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-cyan-100 dark:border-cyan-800">
            <Truck className="w-3.5 h-3.5" />
            Supply Loop Documentation
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
            Vendor: The <span className="text-cyan-500">Procurement Engine</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed font-semibold max-w-3xl">
            Vendor manages the external side of your ecosystem. It ensures that the creative vision of Studio is supported by a reliable, systemic network of suppliers and contractors.
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
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
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

        <div className="p-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 relative overflow-hidden group">
           <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="grid grid-cols-2 gap-3 w-28 shrink-0">
                 <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center"><Package className="w-4 h-4 text-cyan-500" /></div>
                 <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center"><Box className="w-4 h-4 text-blue-500" /></div>
                 <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center"><Truck className="w-4 h-4 text-orange-500" /></div>
                 <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center"><Globe className="w-4 h-4 text-emerald-500" /></div>
              </div>
              <div className="space-y-4">
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white">The Supply Chain Loop</h2>
                 <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Vendor bridges high-level vision with on-site reality. By integrating procurement with **Cost** (budgeting) and **Quest** (execution schedules), ArqonOS eliminates the fragmentation that causes project delays.
                 </p>
              </div>
           </div>
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-orange-500 opacity-50" />
        </div>
      </div>
    </div>
  );
}
