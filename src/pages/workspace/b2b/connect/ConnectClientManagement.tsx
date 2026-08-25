import React, { useState } from 'react';
import { useConnect } from './ConnectContext';
import { Search, Filter, Plus, Mail, Phone, MoreHorizontal, User, Building2 } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { NewLeadModal } from './NewLeadModal';
import { LeadDetailPanel } from './LeadDetailPanel';

export function ConnectClientManagement() {
  const { leads } = useConnect();
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Group leads by client for a true "Client Management" experience
  interface ClientGroup {
    name: string;
    email?: string;
    phone?: string;
    leads: typeof leads;
    totalValue: number;
    status: string;
    lastActivity: string;
  }

  const clientsMap = leads.reduce((acc, lead) => {
    const name = lead.clientName;
    if (!acc[name]) {
      acc[name] = {
        name,
        email: lead.clientEmail,
        phone: lead.clientPhone,
        leads: [],
        totalValue: 0,
        status: lead.status,
        lastActivity: lead.lastContactedAt || 'Just now',
      };
    }
    acc[name].leads.push(lead);
    acc[name].totalValue += (lead.estimatedValue || 0);
    // If any lead is active, client is active
    if (lead.status !== 'won' && lead.status !== 'lost') {
      acc[name].status = lead.status;
    }
    return acc;
  }, {} as Record<string, ClientGroup>);

  const clients = Object.values(clientsMap).filter((client: ClientGroup) => {
    const searchLow = searchQuery?.toLowerCase() || '';
    const matchesSearch = (
      client.name.toLowerCase().includes(searchLow) ||
      (client.email || '').toLowerCase().includes(searchLow) ||
      (client.phone || '').toLowerCase().includes(searchLow)
    );
    const matchesStatus = filterStatus === 'all' || client.leads.some(l => l.status === filterStatus);
    
    return matchesSearch && matchesStatus;
  });

  const [initialClientName, setInitialClientName] = useState<string | undefined>(undefined);

  const handleAddLeadForClient = (clientName: string) => {
    setInitialClientName(clientName);
    setShowNewLeadModal(true);
  };

  const handleCloseModal = () => {
    setShowNewLeadModal(false);
    setInitialClientName(undefined);
  };

  return (
    <>
      <div className="p-8 h-full flex flex-col gap-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Client Management</h2>
            <p className="text-sm font-medium text-slate-500">Manage your unique client relationships and their full deal history.</p>
          </div>
          <button 
            onClick={() => setShowNewLeadModal(true)}
            className="h-9 px-4 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Client
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 bg-slate-50/50 dark:bg-slate-800/50 flex-shrink-0 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search clients..." 
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-[#3b82f6] transition-colors"
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={cn(
                  "px-3 py-2 border rounded-lg text-sm font-medium transition flex items-center gap-2",
                  filterStatus !== 'all' 
                    ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400" 
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                )}
              >
                 <Filter className="w-4 h-4" /> 
                 {filterStatus === 'all' ? 'Filter' : filterStatus.replace('_', ' ')}
              </button>

              {showFilterDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-20 py-2">
                    <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">Filter by Lead Status</div>
                    <button 
                      onClick={() => { setFilterStatus('all'); setShowFilterDropdown(false); }}
                      className={cn("w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors", filterStatus === 'all' && "text-[#3b82f6] font-bold")}
                    >
                      All Clients
                    </button>
                    {['new', 'contacted', 'meeting_scheduled', 'proposal_sent', 'negotiation', 'won', 'lost'].map(status => (
                      <button 
                        key={status}
                        onClick={() => { setFilterStatus(status); setShowFilterDropdown(false); }}
                        className={cn("w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors capitalize", filterStatus === status && "text-[#3b82f6] font-bold")}
                      >
                        {status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-0">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase tracking-widest text-slate-400 font-black bg-slate-50 dark:bg-slate-800/30">
                  <th className="p-4 font-bold">Client Name</th>
                  <th className="p-4 font-bold">Contact Info</th>
                  <th className="p-4 font-bold">Leads</th>
                  <th className="p-4 font-bold">Total LTV</th>
                  <th className="p-4 font-bold">Engagement</th>
                  <th className="p-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {(clients as ClientGroup[]).map((client: ClientGroup) => (
                  <tr 
                    key={client.name} 
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#3b82f6] dark:text-blue-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {client.name}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5 text-xs font-medium text-slate-500">
                            <span className="truncate max-w-[200px]">{client.leads[0]?.projectName || 'Individual Client'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-sm">
                        {client.email && (
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate max-w-[150px]">{client.email}</span>
                          </div>
                        )}
                        {client.phone && (
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {client.leads.length}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Deals</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{(client.totalValue / 1000).toFixed(1)}k
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md w-fit">
                          {client.lastActivity}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            // Logic to show leads for this client
                            setSelectedLeadId(client.leads[0].id);
                          }}
                          className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-blue-50 text-[#3b82f6] border border-blue-100 hover:bg-blue-100 transition-colors"
                        >
                          View Deals
                        </button>
                        <button 
                          onClick={() => handleAddLeadForClient(client.name)}
                          className="w-8 h-8 rounded flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-500 hover:border-emerald-200 transition-all shadow-sm"
                          title="Add new lead for this client"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {clients.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Clients Found</h3>
                <p className="text-sm text-slate-500">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showNewLeadModal && <NewLeadModal onClose={handleCloseModal} initialClientName={initialClientName} />}
      {selectedLeadId && <LeadDetailPanel leadId={selectedLeadId} onClose={() => setSelectedLeadId(null)} />}
    </>
  );
}
