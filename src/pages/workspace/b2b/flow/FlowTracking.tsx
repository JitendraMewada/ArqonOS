import React, { useState } from 'react';
import { useFlow } from './FlowContext';
import { Kanban, Clock, AlertCircle, PlayCircle, MoreHorizontal, Plus, ArrowRight, ArrowLeft, X, Check } from 'lucide-react';
import { cn } from '../../../../lib/utils'; // Optional fallback mapping

export function FlowTracking() {
  const { workflows, activeProjects, updateProjectStage, addProject } = useFlow();
  const workflow = workflows[0];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjClient, setNewProjClient] = useState('');
  
  const handleMoveForward = (projectId: string, currentStageIdx: number) => {
    if (currentStageIdx < workflow.stages.length - 1) {
      updateProjectStage(projectId, workflow.stages[currentStageIdx + 1].id);
    }
  };

  const handleMoveBackward = (projectId: string, currentStageIdx: number) => {
    if (currentStageIdx > 0) {
      updateProjectStage(projectId, workflow.stages[currentStageIdx - 1].id);
    }
  };

  const handleCreateProject = () => {
    if (!newProjName.trim() || !newProjClient.trim()) return;
    addProject({
      name: newProjName,
      client: newProjClient,
      workflowId: workflow.id,
      currentStageId: workflow.stages[0].id, // Start at first stage
      status: 'On Track',
      startDate: new Date().toISOString().split('T')[0]
    });
    setNewProjName('');
    setNewProjClient('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col animate-in fade-in duration-300 relative">
       {/* MODAL */}
       {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
           <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-sm border border-slate-200 dark:border-slate-800 p-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white">Start New Project</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <X className="w-4 h-4" />
                 </button>
              </div>
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Project Name</label>
                    <input 
                      type="text" 
                      value={newProjName}
                      onChange={(e) => setNewProjName(e.target.value)}
                      placeholder="e.g., Website Redesign"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                      autoFocus
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Client Name</label>
                    <input 
                      type="text" 
                      value={newProjClient}
                      onChange={(e) => setNewProjClient(e.target.value)}
                      placeholder="e.g., Acme Corp"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    />
                 </div>
                 
                 <button 
                   onClick={handleCreateProject}
                   disabled={!newProjName.trim() || !newProjClient.trim()}
                   className="w-full bg-[#0ea5e9] text-white font-bold rounded-lg py-2 mt-4 hover:bg-[#0ea5e9]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                   Launch Project
                 </button>
              </div>
           </div>
         </div>
       )}

       <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-10 shadow-sm flex-shrink-0">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0ea5e9]/10 text-[#0ea5e9] rounded-lg">
               <PlayCircle className="w-4 h-4" />
            </div>
            <div>
               <h1 className="text-xl font-black text-slate-900 dark:text-white leading-tight">Active Tracking</h1>
               <p className="text-xs text-slate-500 font-medium">Monitor active project workflows</p>
            </div>
         </div>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="bg-[#0ea5e9] text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-[#0ea5e9]/90 transition-colors shadow-sm flex items-center gap-2"
         >
           <Plus className="w-4 h-4" /> Start Project
         </button>
       </div>

       <div className="p-6 bg-slate-50 dark:bg-slate-950/50 flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex gap-6 flex-1 min-h-0 overflow-x-auto pb-4 items-stretch">
             {workflow.stages.map((stage, stageIdx) => {
               const stageProjects = activeProjects.filter(p => p.currentStageId === stage.id);
               return (
                 <div key={stage.id} className="flex-shrink-0 w-80 flex flex-col h-full bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    {/* Stage Header */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center flex-shrink-0">
                       <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${stage.color.split(' ')[0]}`}></div>
                          <span className="font-bold text-slate-700 dark:text-slate-200">{stage.name}</span>
                       </div>
                       <div className="text-xs font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                         {stageProjects.length}
                       </div>
                    </div>

                    {/* Stage Board */}
                    <div className="p-4 flex flex-col gap-3 flex-grow overflow-y-auto custom-scrollbar">
                       {stageProjects.map(project => (
                         <div key={project.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                               <h4 className="font-bold text-slate-900 dark:text-white text-sm">{project.name}</h4>
                               <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                 <MoreHorizontal className="w-4 h-4" />
                               </button>
                            </div>
                            <div className="text-xs text-slate-500 mb-3">{project.client}</div>
                            
                            <div className="flex items-center justify-between mt-auto pt-4 relative">
                               <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1 ${
                                 project.status === 'On Track' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                 project.status === 'Delayed' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                               }`}>
                                 {project.status === 'Blocked' && <AlertCircle className="w-3 h-3" />}
                                 {project.status}
                               </span>
                               
                               <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium group-hover:opacity-0 transition-opacity">
                                  <Clock className="w-3 h-3" /> {project.startDate}
                               </div>

                               {/* Quick Move Actions (Hover State) */}
                               <div className="absolute right-0 bottom-0 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                  {stageIdx > 0 && (
                                     <button 
                                       onClick={() => handleMoveBackward(project.id, stageIdx)}
                                       className="p-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 rounded-md transition-colors"
                                       title="Move backward"
                                     >
                                        <ArrowLeft className="w-3 h-3" />
                                     </button>
                                  )}
                                  {stageIdx < workflow.stages.length - 1 && (
                                     <button 
                                       onClick={() => handleMoveForward(project.id, stageIdx)}
                                       className="p-1.5 bg-[#0ea5e9]/10 hover:bg-[#0ea5e9]/20 text-[#0ea5e9] rounded-md transition-colors"
                                       title="Move forward"
                                     >
                                        <ArrowRight className="w-3 h-3" />
                                     </button>
                                  )}
                               </div>
                            </div>
                         </div>
                       ))}
                       {stageProjects.length === 0 && (
                          <div className="h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Empty
                          </div>
                       )}
                    </div>
                 </div>
               );
             })}
          </div>
       </div>
    </div>
  );
}
