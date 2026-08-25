import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useConnect } from './ConnectContext';
import { cn } from '../../../../lib/utils';

interface NewLeadModalProps {
  onClose: () => void;
  initialClientName?: string;
}

export function NewLeadModal({ onClose, initialClientName = "" }: NewLeadModalProps) {
  const { addLead, leads } = useConnect();
  
  // Extract unique clients (last known contact info)
  const existingClients = leads.reduce((acc, lead) => {
    if (!acc[lead.clientName]) {
      acc[lead.clientName] = {
        email: lead.clientEmail || '',
        phone: lead.clientPhone || ''
      };
    }
    return acc;
  }, {} as Record<string, { email: string; phone: string }>);

  const clientNames = Object.keys(existingClients);

  const [clientName, setClientName] = useState(initialClientName);
  const [clientEmail, setClientEmail] = useState(existingClients[initialClientName]?.email || '');
  const [clientPhone, setClientPhone] = useState(existingClients[initialClientName]?.phone || '');
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [projectTimeline, setProjectTimeline] = useState('');
  const [projectArea, setProjectArea] = useState('');
  const [projectHealth, setProjectHealth] = useState('');
  const [bantStatus, setBantStatus] = useState({
    budget: false,
    authority: false,
    need: false,
    timeline: false
  });
  const [estimatedValue, setEstimatedValue] = useState('');
  const [source, setSource] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) return;

    addLead({
      clientName,
      clientEmail,
      clientPhone,
      projectName,
      projectType,
      projectTimeline,
      projectArea,
      projectHealth,
      bantStatus,
      estimatedValue: parseInt(estimatedValue) || 0,
      source,
      assignedTo,
      notes,
      status: 'new',
      lastContactedAt: 'Just now',
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
      <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 shrink-0">
          <h3 className="font-bold text-[#3b82f6] text-xl">New Lead</h3>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:rotate-90 duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
          <form id="new-lead-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>Client Name *</span>
                  {clientNames.length > 0 && (
                    <span className="text-[9px] text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">
                      {clientNames.length} Existing Clients Found
                    </span>
                  )}
                </label>
                <div className="relative group">
                  <input 
                    required
                    type="text" 
                    list="existing-clients"
                    value={clientName}
                    onChange={e => {
                      const name = e.target.value;
                      setClientName(name);
                      // Check for exact match to auto-fill
                      const existing = existingClients[name];
                      if (existing) {
                        setClientEmail(existing.email);
                        setClientPhone(existing.phone);
                      }
                    }}
                    className={cn(
                      "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none transition-all",
                      clientNames.includes(clientName) 
                        ? "focus:border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 border-blue-200" 
                        : "focus:border-[#3b82f6]"
                    )}
                    placeholder="Type to search or add new client..."
                  />
                  <datalist id="existing-clients">
                    {clientNames.map(name => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                  {clientNames.includes(clientName) && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-black text-blue-500 uppercase tracking-widest pointer-events-none">
                      Linked
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input 
                  type="email" 
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-[#3b82f6] transition-colors"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                <input 
                  type="tel" 
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-[#3b82f6] transition-colors"
                  placeholder="555-0100"
                />
              </div>

              <div className="col-span-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Project Details</h4>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Project Name</label>
                <input 
                  type="text" 
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-[#3b82f6] transition-colors"
                  placeholder="e.g. 3BHK Villa Interior"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Project Type</label>
                <select
                  value={projectType}
                  onChange={e => setProjectType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-[#3b82f6] transition-colors cursor-pointer"
                >
                  <option value="">Select Type</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Retail">Retail</option>
                  <option value="Hospitality">Hospitality</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Project Area (sq ft)</label>
                <input 
                  type="text" 
                  value={projectArea}
                  onChange={e => setProjectArea(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-[#3b82f6] transition-colors"
                  placeholder="e.g. 1500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Project Timeline</label>
                <select
                  value={projectTimeline}
                  onChange={e => setProjectTimeline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-[#3b82f6] transition-colors cursor-pointer"
                >
                  <option value="">Select Timeline</option>
                  <option value="Immediately">Immediately</option>
                  <option value="1-3 Months">1-3 Months</option>
                  <option value="3-6 Months">3-6 Months</option>
                  <option value="6+ Months">6+ Months</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Lead Qualification (BANT Criteria)</label>
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={bantStatus.budget}
                      onChange={e => setBantStatus({...bantStatus, budget: e.target.checked})}
                      className="w-4 h-4 rounded border-slate-300 text-[#3b82f6] focus:ring-[#3b82f6]"
                    />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Budget Confirmed</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={bantStatus.authority}
                      onChange={e => setBantStatus({...bantStatus, authority: e.target.checked})}
                      className="w-4 h-4 rounded border-slate-300 text-[#3b82f6] focus:ring-[#3b82f6]"
                    />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Decision Maker</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={bantStatus.need}
                      onChange={e => setBantStatus({...bantStatus, need: e.target.checked})}
                      className="w-4 h-4 rounded border-slate-300 text-[#3b82f6] focus:ring-[#3b82f6]"
                    />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Defined Need</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={bantStatus.timeline}
                      onChange={e => setBantStatus({...bantStatus, timeline: e.target.checked})}
                      className="w-4 h-4 rounded border-slate-300 text-[#3b82f6] focus:ring-[#3b82f6]"
                    />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Agreed Timeline</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Project Health Rating</label>
                <select
                  value={projectHealth}
                  onChange={e => setProjectHealth(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-[#3b82f6] transition-colors cursor-pointer"
                >
                  <option value="">Select Rating</option>
                  <option value="High (BANT Met)">High (Qualified)</option>
                  <option value="Warm (Nurturing)">Warm (Nurturing)</option>
                  <option value="Cold (Research)">Cold (Research)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Estimated Budget (₹)</label>
                <input 
                  type="number" 
                  value={estimatedValue}
                  onChange={e => setEstimatedValue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-[#3b82f6] transition-colors"
                  placeholder="500000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Source</label>
                <select
                  value={source}
                  onChange={e => setSource(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-[#3b82f6] transition-colors cursor-pointer"
                >
                  <option value="">Select Source</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Instagram">Instagram</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Assign To</label>
                <select
                  value={assignedTo}
                  onChange={e => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-[#3b82f6] transition-colors cursor-pointer"
                >
                  <option value="">Select User</option>
                  <option value="John Doe">John Doe</option>
                  <option value="Sarah Connor">Sarah Connor</option>
                </select>
              </div>
              
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Initial Notes</label>
                <textarea 
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-[#3b82f6] transition-colors resize-none h-20"
                  placeholder="Details or specific requirements..."
                />
              </div>
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
            form="new-lead-form"
            className="px-6 py-2.5 bg-[#3b82f6] hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            Convert Lead
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-portal-root') || document.body
  );
}
