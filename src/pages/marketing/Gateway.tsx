import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';

export function Gateway() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-12 flex flex-col items-center justify-center relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
       
       <div className="text-center mb-12 relative z-10">
         <div className="inline-flex items-center justify-center bg-[#3b82f61a] p-4 rounded-xl mb-6 shadow-sm border border-[#3b82f633] dark:border-[#3b82f64d]">
            <Layers className="w-10 h-10 text-[#3b82f6]" />
         </div>
         <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">Workspace Gateway</h1>
         <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">Select your environment to continue.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-5xl relative z-10 px-4 sm:px-0">
          <Link to="/workspace/b2b" className="group bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-[#3b82f666] transition-all space-y-6">
             <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-[#3b82f6] transition-colors">B2B Workspace</h3>
                  <p className="text-xs font-bold text-[#3b82f6] uppercase tracking-[0.2em] mt-1">Professional Suite</p>
               </div>
               <ArrowRight className="text-slate-400 dark:text-slate-500 group-hover:text-[#3b82f6] transition-colors w-6 h-6 sm:w-8 sm:h-8" />
             </div>
             <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">For designers, architects, and agency owners managing the built environment.</p>
             <div className="flex flex-wrap gap-2 pt-4">
               {['Quest', 'Flow', 'Connect', 'People', 'Studio', 'Cost', 'Vendor', 'Insight', 'AI'].map(app => (
                 <span key={app} className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400 group-hover:border-[#3b82f633] group-hover:text-[#3b82f6] transition-colors">
                   {app}
                 </span>
               ))}
             </div>
          </Link>
          
          <Link to="/workspace/b2c" className="group bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-[#22c55e66] transition-all space-y-6">
             <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-[#22c55e] transition-colors">B2C Workspace</h3>
                  <p className="text-xs font-bold text-[#22c55e] uppercase tracking-[0.2em] mt-1">Life Systems</p>
               </div>
               <ArrowRight className="text-slate-400 dark:text-slate-500 group-hover:text-[#22c55e] transition-colors w-6 h-6 sm:w-8 sm:h-8" />
             </div>
             <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Family and friends finance organizer. The intelligent core of your personal life.</p>
             <div className="flex flex-wrap gap-2 pt-4">
                <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400 group-hover:border-[#22c55e33] group-hover:text-[#22c55e] transition-colors">
                  Nest
                </span>
             </div>
          </Link>
       </div>

       <div className="mt-12 overflow-hidden w-full max-w-5xl relative z-10 px-4 sm:px-0">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 shrink-0">D2C Free Access Portals</h2>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button 
               onClick={() => window.open('https://essence.arqon.com', '_blank')}
               className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-[#94a3b866] transition-all shadow-sm"
             >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-[#94a3b8] transition-colors">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-900 dark:text-white">Essence</h4>
                    <p className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-widest">Portfolio Showcase</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#94a3b8] group-hover:translate-x-1 transition-all" />
             </button>
             
             <button 
               onClick={() => window.open('https://pravara.arqon.com', '_blank')}
               className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-[#d4af3766] transition-all shadow-sm"
             >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-[#d4af37] transition-colors">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-900 dark:text-white">PRAVARA</h4>
                    <p className="text-[10px] uppercase font-bold text-[#d4af37] tracking-widest">Fashion Collective</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all" />
             </button>
          </div>
       </div>
    </div>
  );
}
