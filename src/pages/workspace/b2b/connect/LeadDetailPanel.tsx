import React from 'react';
import { createPortal } from 'react-dom';
import { useConnect, LeadStatus, Lead } from './ConnectContext';
import { X, Mail, Phone, CalendarDays, MoreHorizontal, User, FileText, CheckCircle2, XCircle, Trash2, Presentation } from 'lucide-react';
import { cn } from '../../../../lib/utils';

interface LeadDetailPanelProps {
  leadId: string;
  onClose: () => void;
}

export function LeadDetailPanel({ leadId, onClose }: LeadDetailPanelProps) {
  const { leads, communications, updateLeadStatus, setLeads } = useConnect();
  
  const lead = leads.find(l => l.id === leadId);

  if (!lead) return null;

  const leadCommunications = communications.filter(comm => comm.leadId === leadId).reverse();

  const handleDelete = () => {
    setLeads(leads.filter(l => l.id !== leadId));
    onClose();
  };

  const handleConvertToProject = () => {
    // In a real app, this would send data to the Flow backend
    updateLeadStatus(leadId, 'won');
    alert(`Project '${lead.projectName}' created successfully and added to Flow.`);
  };

  return createPortal(
    <div className="fixed inset-x-0 top-0 bottom-0 z-[1000000] flex bg-slate-900/40 backdrop-blur-sm justify-end animate-in fade-in duration-300">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className="bg-white dark:bg-slate-900 w-full max-w-[600px] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 border-l border-slate-100 dark:border-slate-800 relative z-[1000001]">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-[#3b82f6]">Lead Details</h3>
          </div>
          <div className="flex items-center gap-2">
            {lead.status === 'won' ? (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Converted
              </span>
            ) : (
              <button 
                onClick={handleConvertToProject}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Convert to Project
              </button>
            )}
            
            <button 
              onClick={() => updateLeadStatus(leadId, 'lost')}
              className="px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" /> Mark Lost
            </button>
            
            <button onClick={handleDelete} className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{lead.clientName}</h2>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={cn(
                  "text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded-md",
                  lead.status === 'won' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                  lead.status === 'lost' ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" :
                  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                )}>
                  {lead.status.replace('_', ' ')}
                </span>
                <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">
                  {lead.projectType}
                </span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  from {lead.source}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Deal Value</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">₹{(lead.estimatedValue / 1000).toFixed(1)}k</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Contact Info
              </p>
              <div className="space-y-3">
                {lead.clientEmail && (
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{lead.clientEmail}</span>
                  </div>
                )}
                {lead.clientPhone && (
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{lead.clientPhone}</span>
                  </div>
                )}
                {!lead.clientEmail && !lead.clientPhone && (
                    <span className="text-slate-400 italic text-sm">No contact info</span>
                )}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Assignment
              </p>
              <div className="flex items-center gap-3">
                {lead.assignedTo ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#3b82f6] dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                      {lead.assignedTo.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{lead.assignedTo}</span>
                  </>
                ) : (
                  <span className="text-sm text-slate-500 italic">Unassigned</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Project Details</p>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">{lead.projectName || 'Untitled Project'}</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                {lead.projectArea && (
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Area</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{lead.projectArea} sq ft</span>
                  </div>
                )}
                {lead.projectTimeline && (
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Timeline</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{lead.projectTimeline}</span>
                  </div>
                )}
                {lead.projectHealth && (
                  <div className="col-span-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Health Criteria</span>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                        {lead.projectHealth}
                      </span>
                    </div>
                    
                    {lead.bantStatus && (
                      <div className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col items-center gap-1">
                          <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black", lead.bantStatus.budget ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400")}>B</div>
                          <span className="text-[8px] font-bold uppercase text-slate-400">Budget</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black", lead.bantStatus.authority ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400")}>A</div>
                          <span className="text-[8px] font-bold uppercase text-slate-400">Auth</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black", lead.bantStatus.need ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400")}>N</div>
                          <span className="text-[8px] font-bold uppercase text-slate-400">Need</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black", lead.bantStatus.timeline ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400")}>T</div>
                          <span className="text-[8px] font-bold uppercase text-slate-400">Time</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap pt-4 border-t border-slate-50 dark:border-slate-800/50">
                {lead.notes || 'No project notes available.'}
              </p>
            </div>
          </div>
          
          <div className="text-xs font-medium text-slate-400 flex items-center gap-4 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg">
            <span>Created on {new Date(lead.createdAt).toLocaleDateString()}</span>
            <span>·</span>
            <span>Last contacted {lead.lastContactedAt}</span>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Activity Timeline</p>
            <div className="space-y-4">
              {leadCommunications.length === 0 ? (
                <div className="text-sm text-slate-500 italic text-center p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                  No activity logged yet.
                </div>
              ) : (
                <div className="relative pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-6">
                  {leadCommunications.map(comm => (
                    <div key={comm.id} className="relative">
                      <div className={cn(
                        "absolute -left-[23px] w-5 h-5 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900",
                        comm.type === 'Email' ? 'bg-blue-500' :
                        comm.type === 'Call' ? 'bg-emerald-500' : 'bg-indigo-500'
                      )}>
                        {comm.type === 'Email' ? <Mail className="w-2 h-2 text-white" /> :
                         comm.type === 'Call' ? <Phone className="w-2 h-2 text-white" /> :
                         <Presentation className="w-2 h-2 text-white" />}
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                            {comm.type} logged by {comm.author}
                          </h5>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            {comm.date}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {comm.summary}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('modal-portal-root') || document.body
  );
}
