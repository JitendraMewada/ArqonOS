import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useConnect, Communication } from './ConnectContext';

interface LogActivityModalProps {
  onClose: () => void;
}

export function LogActivityModal({ onClose }: LogActivityModalProps) {
  const { leads, addCommunication } = useConnect();
  
  const [leadId, setLeadId] = useState(leads[0]?.id || '');
  const [type, setType] = useState<Communication['type']>('Email');
  const [summary, setSummary] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadId || !summary) return;

    addCommunication({
      leadId,
      type,
      date: 'Just now', // Could be real date/time picker
      summary,
      author: 'Current User', // Just mock for now, could get from auth later
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[1000000] flex items-center justify-center p-4">
      {/* Absolute backdrop covers entire viewport regardless of nesting */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-500" 
        onClick={onClose}
      />
      
      {/* Modal Container with internal scroll and fixed parts */}
      <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 shrink-0">
          <h3 className="font-bold text-[#3b82f6] text-xl">Log Activity</h3>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:rotate-90 duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
          <form id="log-activity-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Lead</label>
              <select
                required
                value={leadId}
                onChange={e => setLeadId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-[#3b82f6] transition-colors cursor-pointer"
              >
                <option value="" disabled>Select a lead</option>
                {leads.map(lead => (
                  <option key={lead.id} value={lead.id}>{lead.clientName} {lead.projectName ? `(${lead.projectName})` : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Activity Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as Communication['type'])}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-[#3b82f6] transition-colors cursor-pointer"
              >
                <option value="Email">Email</option>
                <option value="Call">Call</option>
                <option value="Meeting">Meeting</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Summary</label>
              <textarea 
                required
                value={summary}
                onChange={e => setSummary(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-[#3b82f6] transition-colors resize-none h-24"
                placeholder="e.g. Discussed pricing details..."
              />
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="log-activity-form"
            className="px-6 py-2.5 bg-[#3b82f6] hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            Save Activity
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-portal-root') || document.body
  );
}
