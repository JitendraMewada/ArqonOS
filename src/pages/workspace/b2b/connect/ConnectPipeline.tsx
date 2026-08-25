import React, { useState } from "react";
import { useConnect, LeadStatus } from "./ConnectContext";
import { Plus, MoreHorizontal, Mail, Phone, CalendarDays, User } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { NewLeadModal } from "./NewLeadModal";
import { LeadDetailPanel } from "./LeadDetailPanel";

export function ConnectPipeline() {
  const { leads, updateLeadStatus } = useConnect();
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<{ id: string, x: number, y: number } | null>(null);

  const STAGES: { id: LeadStatus; label: string }[] = [
    { id: "new", label: "New Leads" },
    { id: "contacted", label: "Contacted" },
    { id: "meeting_scheduled", label: "Meeting" },
    { id: "proposal_sent", label: "Proposal" },
    { id: "negotiation", label: "Negotiation" },
    { id: "won", label: "Won" },
    { id: "lost", label: "Lost" }
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggedLeadId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) {
      updateLeadStatus(id, status);
    }
    setDraggedLeadId(null);
  };

  return (
    <>
      <div className="p-8 h-full flex flex-col gap-6 overflow-hidden animate-in fade-in duration-300">
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Pipeline
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Track and manage your deals across stages.
            </p>
          </div>
          <button
            onClick={() => setShowNewLeadModal(true)}
            className="h-9 px-4 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Lead
          </button>
        </div>

        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageLeads = leads.filter((l) => l.status === stage.id);
            const stageValue = stageLeads.reduce(
              (acc, curr) => acc + (curr.estimatedValue || (curr as any).value || 0),
              0,
            );

            return (
              <div
                key={stage.id}
                className="min-w-[300px] w-[300px] flex flex-col bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/50 flex-shrink-0"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {stage.label}
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">
                      {stageLeads.length} Deals · ₹
                      {(stageValue / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <button className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-3 flex-1 overflow-y-auto space-y-3">
                  {stageLeads.length === 0 ? (
                    <div className="h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 text-sm font-bold">
                      No leads here
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        onClick={() => setSelectedLeadId(lead.id)}
                        className={cn(
                          "bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border transition-all cursor-grab active:cursor-grabbing",
                          draggedLeadId === lead.id 
                            ? "opacity-50 border-[#3b82f6]" 
                            : "border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800",
                          activeDropdown?.id === lead.id ? "relative z-50" : "relative z-0"
                        )}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex flex-col min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 pr-2 uppercase h-[20px]">
                              {lead.projectName || 'Unnamed Project'}
                            </h4>
                            <p className="text-[10px] font-bold text-blue-500 dark:text-blue-400 mt-0.5 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {lead.clientName}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 relative flex-shrink-0">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md flex-shrink-0">
                              ₹{((lead.estimatedValue || (lead as any).value || 0) / 1000).toFixed(1)}k
                            </span>
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                if (activeDropdown?.id === lead.id) {
                                  setActiveDropdown(null); 
                                } else {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setActiveDropdown({ id: lead.id, x: rect.right, y: rect.bottom });
                                }
                              }}
                              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                            >
                              <MoreHorizontal className="w-4 h-4 cursor-pointer" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">
                            {lead.projectType || 'Standard'}
                          </span>
                          
                          {lead.bantStatus && (
                            <div className="flex gap-0.5">
                              {['B', 'A', 'N', 'T'].map((key) => {
                                const field = key === 'B' ? 'budget' : key === 'A' ? 'authority' : key === 'N' ? 'need' : 'timeline';
                                const active = (lead.bantStatus as any)[field];
                                return (
                                  <div 
                                    key={key} 
                                    className={cn(
                                      "w-3.5 h-3.5 rounded-[2px] flex items-center justify-center text-[7px] font-black",
                                      active ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                                    )}
                                  >
                                    {key}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-3">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              {lead.lastContactedAt}
                            </span>
                          </div>
                          
                          {lead.assignedTo && (
                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-[#3b82f6] dark:text-blue-400 flex items-center justify-center text-xs font-bold" title={lead.assignedTo}>
                              {lead.assignedTo.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showNewLeadModal && (
        <NewLeadModal onClose={() => setShowNewLeadModal(false)} />
      )}
      {selectedLeadId && (
        <LeadDetailPanel leadId={selectedLeadId} onClose={() => setSelectedLeadId(null)} />
      )}
      
      {activeDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
          <div 
            className="fixed bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 py-1 w-36"
            style={{ 
              top: `${activeDropdown.y + 4}px`, 
              left: `${activeDropdown.x - 144}px` 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => { setSelectedLeadId(activeDropdown.id); setActiveDropdown(null); }}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              View Details
            </button>
            <button 
              onClick={() => { updateLeadStatus(activeDropdown.id, 'won'); setActiveDropdown(null); }}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 transition-colors"
            >
              Mark as Won
            </button>
            <button 
              onClick={() => { updateLeadStatus(activeDropdown.id, 'lost'); setActiveDropdown(null); }}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 transition-colors"
            >
              Mark as Lost
            </button>
          </div>
        </>
      )}
    </>
  );
}
