import React, { useState } from 'react';
import { useFlow } from './FlowContext';
import { Plus, ArrowRight, Settings, Grid, LayoutTemplate, X, Check } from 'lucide-react';
import { cn } from '../../../../lib/utils'; // Try to use global cn, or we'll define a local one if needed

export function FlowBuilder() {
  const { workflows, addStage } = useFlow();
  const workflow = workflows[0]; // For demo, we just use the first workflow
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [newStageColor, setNewStageColor] = useState('bg-slate-500 text-white');

  const handleCreateStage = () => {
    if (!newStageName.trim()) return;
    addStage(workflow.id, {
      name: newStageName,
      color: newStageColor,
      order: workflow.stages.length + 1
    });
    setNewStageName('');
    setIsModalOpen(false);
  };

  const colors = [
    { label: 'Slate', value: 'bg-slate-500 text-white' },
    { label: 'Indigo', value: 'bg-indigo-500 text-white' },
    { label: 'Amber', value: 'bg-amber-500 text-white' },
    { label: 'Emerald', value: 'bg-emerald-500 text-white' },
    { label: 'Rose', value: 'bg-rose-500 text-white' },
    { label: 'Cyan', value: 'bg-cyan-500 text-white' },
  ];

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300 relative">
       {/* MODAL */}
       {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
           <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-sm border border-slate-200 dark:border-slate-800 p-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Stage</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <X className="w-4 h-4" />
                 </button>
              </div>
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Stage Name</label>
                    <input 
                      type="text" 
                      value={newStageName}
                      onChange={(e) => setNewStageName(e.target.value)}
                      placeholder="e.g., Final Review"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                      autoFocus
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Color Theme</label>
                    <div className="flex flex-wrap gap-2">
                       {colors.map(c => (
                         <button 
                           key={c.value}
                           onClick={() => setNewStageColor(c.value)}
                           className={`w-8 h-8 rounded-md flex items-center justify-center border-2 transition-all ${c.value.split(' ')[0]} ${newStageColor === c.value ? 'border-white dark:border-slate-900 ring-2 ring-slate-400' : 'border-transparent'}`}
                         >
                            {newStageColor === c.value && <Check className="w-4 h-4 text-white" />}
                         </button>
                       ))}
                    </div>
                 </div>
                 <button 
                   onClick={handleCreateStage}
                   disabled={!newStageName.trim()}
                   className="w-full bg-[#0ea5e9] text-white font-bold rounded-lg py-2 mt-4 hover:bg-[#0ea5e9]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                   Create Stage
                 </button>
              </div>
           </div>
         </div>
       )}

       <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-10 shadow-sm">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0ea5e9]/10 text-[#0ea5e9] rounded-lg">
               <LayoutTemplate className="w-4 h-4" />
            </div>
            <div>
               <h1 className="text-xl font-black text-slate-900 dark:text-white leading-tight">Workflow Builder</h1>
               <p className="text-xs text-slate-500 font-medium">Design and structure your internal pipelines</p>
            </div>
         </div>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="bg-[#0ea5e9] text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-[#0ea5e9]/90 transition-colors shadow-sm flex items-center gap-2"
         >
           <Plus className="w-4 h-4" /> New Stage
         </button>
       </div>

       <div className="p-6 overflow-y-auto bg-slate-50 dark:bg-slate-950/50 flex-grow">
          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">
             <div className="mb-8">
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{workflow.name}</h2>
               <p className="text-slate-500 mt-1">{workflow.description}</p>
             </div>

             <div className="flex flex-col gap-4 relative">
                {/* Connecting Line behind stages */}
                <div className="absolute left-[23px] top-6 bottom-6 w-1 bg-slate-100 dark:bg-slate-800 rounded-md z-0"></div>

                {workflow.stages.map((stage, idx) => (
                  <div key={stage.id} className="relative z-10 flex gap-6 items-start group">
                     {/* Stage Number / Node */}
                     <div className={`w-12 h-12 rounded-md border-4 border-white dark:border-slate-900 flex items-center justify-center font-black text-sm shadow-sm ${stage.color} transition-transform group-hover:scale-110 flex-shrink-0`}>
                       {idx + 1}
                     </div>

                     {/* Stage Card */}
                     <div className="flex-grow bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm group-hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="text-lg font-bold text-slate-900 dark:text-white">{stage.name}</h3>
                           <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                             <Settings className="w-4 h-4" />
                           </button>
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                           {/* Placeholder for stage rules */}
                           Requires 1 approval • 2 Automation Rules active
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
}
