import React from 'react';
import { createPortal } from 'react-dom';
import { X, Zap, ChevronRight, LayoutDashboard, Brain, LineChart, Shield, Activity, Users, Truck, ShoppingCart, Layers, Palette, Workflow, MessageSquare, ClipboardList, Database, Hexagon, TrendingUp, Search, ShieldCheck, Mail, Settings, Briefcase, FileText, PlayCircle, Clock } from 'lucide-react';
import { cn } from '../../../../lib/utils';

interface UpdateItem {
  id: string;
  title: string;
  status: 'In Progress' | 'Planned' | 'Coming Soon' | 'Released';
  description: string;
  date?: string;
  icon?: any;
}

const UPDATE_DATA: Record<string, UpdateItem[]> = {
  quest: [
    { id: 'q1', title: 'AI Task Categorization', status: 'In Progress', description: 'Automatically tag and categorize new tasks based on project context using Gemini models.', date: 'Q4 2026' },
    { id: 'q2', title: 'Collaborative Live-Notes', status: 'Planned', description: 'Enable real-time collaborative editing on task notes with @mentions and rich text formatting.', date: 'Q1 2027' },
    { id: 'q3', title: 'Voice-to-Task Sync', status: 'Coming Soon', description: 'Create tasks and set reminders using voice commands directly into the Quest messenger.', date: 'Dec 2026' },
  ],
  flow: [
    { id: 'f1', title: 'Visual Automation Builder', status: 'In Progress', description: 'A drag-and-drop interface for complex multi-step automations between different engines.', date: 'Q4 2026' },
    { id: 'f2', title: 'Template Library', status: 'Planned', description: 'Pre-built industry-specific workflows for interior design, procurement, and more.', date: 'Q1 2027' },
  ],
  people: [
    { id: 'p1', title: 'Skill Matching Engine', status: 'Planned', description: 'Automatically suggest team members for tasks based on their logged skills and availability.', date: 'Q2 2027' },
    { id: 'p2', title: 'Performance Insights', status: 'In Progress', description: 'Visualizing team throughput and project contribution metrics.', date: 'Jan 2027' },
  ],
  studio: [
    { id: 's1', title: 'Real-time Canvas Sync', status: 'Released', description: 'Collaborate live on design boards with visual cursor presence.', date: 'Q3 2026' },
    { id: 's2', title: 'VR Showcase Integration', status: 'Coming Soon', description: 'Export Studio designs directly to Arqon VR headsets for client walkthroughs.', date: 'Dec 2026' },
  ]
};

const DEFAULT_UPDATES: UpdateItem[] = [
  { id: 'd1', title: 'ArqonOS V2.0 Engine', status: 'In Progress', description: 'Total refactor of the underlying data synchronization layer for 10x faster performance.', date: 'Q4 2026' },
  { id: 'd2', title: 'Cross-Engine Search', status: 'Planned', description: 'Search across all modules (Quest, Connect, Studio, Cost) from a single global command bar.', date: 'Q1 2027' },
];

export function UpdatesModal({ isOpen, activeApp, onClose }: { isOpen: boolean, activeApp: string, onClose: () => void }) {
  if (!isOpen) return null;

  const appUpdates = UPDATE_DATA[activeApp.toLowerCase()] || [];
  const allUpdates = [...appUpdates, ...DEFAULT_UPDATES];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Released': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Coming Soon': return 'bg-purple-500';
      case 'Planned': return 'bg-slate-300 dark:bg-slate-700';
      default: return 'bg-slate-400';
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[1000000] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-500" 
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg border border-slate-100 dark:border-slate-800 flex flex-col h-[75vh] max-h-[700px] overflow-hidden animate-in zoom-in-95 duration-200 text-left">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/30 dark:bg-slate-800/30">
          <div>
            <h3 className="text-xl font-extrabold text-[#3b82f6] flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-500 fill-purple-500" /> Future Updates
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Active roadmap for <span className="text-purple-600 dark:text-purple-400 uppercase tracking-widest font-black">{activeApp}</span> and ArqonOS Ecosystem.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {allUpdates.map((update, idx) => (
            <div key={update.id} className="relative pl-8 animate-in slide-in-from-left-4 duration-300 fill-mode-backwards" style={{ animationDelay: `${idx * 100}ms` }}>
              {/* Timeline line */}
              {idx !== allUpdates.length - 1 && (
                <div className="absolute left-3 top-3 bottom-0 w-px bg-slate-100 dark:bg-slate-800 -mb-8"></div>
              )}
              
              {/* Timeline Dot */}
              <div className={cn(
                "absolute left-1 top-2.5 w-4 h-4 rounded-md border-4 border-white dark:border-slate-900 shadow-sm z-10",
                getStatusColor(update.status)
              )} />

              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                    {update.title}
                  </h4>
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-[4px] text-white",
                    getStatusColor(update.status)
                  )}>
                    {update.status}
                  </span>
                </div>
                
                {update.date && (
                  <div className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-tighter mb-2">
                    Target Release: {update.date}
                  </div>
                )}
                
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {update.description}
                </p>

                <div className="mt-4 flex items-center gap-2">
                   <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></div>
                   <button className="text-[9px] font-bold text-slate-400 hover:text-purple-500 transition-colors uppercase tracking-widest flex items-center gap-1 group">
                      Notify Me <ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                   </button>
                </div>
              </div>
            </div>
          ))}

          {/* Integration Note */}
          <div className="p-4 bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-xl mt-4">
             <div className="flex gap-3">
                <Brain className="w-4 h-4 text-purple-500 shrink-0" />
                <div>
                   <h5 className="text-[10px] font-black text-purple-700 dark:text-purple-400 uppercase tracking-widest leading-none mb-1.5">Intelligent Ecosystem Note</h5>
                   <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-normal">
                      All updates are automatically synchronized across ArqonOS. No manual installs required. 256-bit encryption active during background streaming.
                   </p>
                </div>
             </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            Close Roadmap
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-portal-root') || document.body
  );
}
