import React, { useState } from 'react';
import { useFlow } from './FlowContext';
import { Zap, Plus, ArrowRight, Settings2, X } from 'lucide-react';

export function FlowAutomation() {
  const { workflows, automations, setAutomations, addAutomation } = useFlow();
  const workflow = workflows[0];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState(workflow.stages[0]?.id || '');
  const [actionText, setActionText] = useState('');

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const handleCreateAutomation = () => {
    if (!selectedStageId || !actionText.trim()) return;
    addAutomation({
      triggerStageId: selectedStageId,
      action: actionText,
      enabled: true
    });
    setActionText('');
    setIsModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300 relative">
       {/* MODAL */}
       {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
           <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-sm border border-slate-200 dark:border-slate-800 p-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Rule</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <X className="w-4 h-4" />
                 </button>
              </div>
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Trigger: When Entering...</label>
                    <select 
                      value={selectedStageId}
                      onChange={(e) => setSelectedStageId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] appearance-none"
                    >
                       {workflow.stages.map(stage => (
                         <option key={stage.id} value={stage.id}>{stage.name}</option>
                       ))}
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Action: Then Do...</label>
                    <input 
                      type="text" 
                      value={actionText}
                      onChange={(e) => setActionText(e.target.value)}
                      placeholder="e.g., Send email to the client"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                      autoFocus
                    />
                 </div>
                 <button 
                   onClick={handleCreateAutomation}
                   disabled={!selectedStageId || !actionText.trim()}
                   className="w-full bg-[#0ea5e9] text-white font-bold rounded-lg py-2 mt-4 hover:bg-[#0ea5e9]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                   Save Rule
                 </button>
              </div>
           </div>
         </div>
       )}

       <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-10 shadow-sm flex-shrink-0">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0ea5e9]/10 text-[#0ea5e9] rounded-lg">
               <Zap className="w-4 h-4" />
            </div>
            <div>
               <h1 className="text-xl font-black text-slate-900 dark:text-white leading-tight">Pipeline Automations</h1>
               <p className="text-xs text-slate-500 font-medium">Trigger actions structurally across stages</p>
            </div>
         </div>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-2"
         >
           <Plus className="w-4 h-4" /> Add Rule
         </button>
       </div>

       <div className="p-6 overflow-y-auto bg-slate-50 dark:bg-slate-950/50 flex-grow">
          <div className="max-w-4xl mx-auto space-y-4">
             {automations.map(auto => {
               const stage = workflow.stages.find(s => s.id === auto.triggerStageId);
               return (
                 <div key={auto.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex items-center justify-between group hover:border-[#0ea5e9]/50 transition-colors">
                    
                    {/* Rule Definition */}
                    <div className="flex items-center gap-4 flex-grow">
                       {/* IF */}
                       <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-lg border border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] font-black uppercase text-slate-400">When entering</span>
                          <span className={`text-xs font-bold px-2 py-1 rounded border border-slate-200 dark:border-slate-700 shadow-sm ${stage?.color || 'bg-slate-100 text-slate-900'}`}>
                            {stage?.name || 'Unknown Stage'}
                          </span>
                       </div>

                       <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />

                       {/* THEN */}
                       <div className="flex items-center gap-3 bg-[#0ea5e9]/5 dark:bg-[#0ea5e9]/10 px-4 py-3 rounded-lg border border-[#0ea5e9]/20 shadow-inner">
                          <span className="text-[10px] font-black uppercase text-[#0ea5e9]">Then do</span>
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                             {auto.action}
                          </span>
                       </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4 ml-6 pl-6 border-l border-slate-100 dark:border-slate-800">
                       <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                          <Settings2 className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => toggleAutomation(auto.id)}
                         className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-transparent focus:outline-none transition-colors duration-200 ease-in-out ${auto.enabled ? 'bg-[#0ea5e9]' : 'bg-slate-200 dark:bg-slate-700'}`}
                       >
                         <span className="sr-only">Toggle rule</span>
                         <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-md bg-white shadow ring-0 transition duration-200 ease-in-out ${auto.enabled ? 'translate-x-2' : '-translate-x-2'}`} />
                       </button>
                    </div>
                 </div>
               );
             })}
          </div>
       </div>
    </div>
  );
}
