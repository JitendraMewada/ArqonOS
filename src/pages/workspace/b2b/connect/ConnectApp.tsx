import React, { useState } from 'react';
import { ConnectHelp } from './ConnectHelp';
import { ConnectOverview } from './ConnectOverview';
import { ConnectDashboard } from './ConnectDashboard';
import { ConnectClientManagement } from './ConnectClientManagement';
import { ConnectPipeline } from './ConnectPipeline';
import { ConnectCommunication } from './ConnectCommunication';
import { ConnectContext, Lead, Communication, LeadStatus } from './ConnectContext';

interface ConnectAppProps {
  activePage: string;
  onNavigate?: (page: string) => void;
  navigateToApp?: (appId: string, pageName: string) => void;
}

const INITIAL_LEADS: Lead[] = [
  { id: '1', clientName: 'Demo Client', projectName: 'Demo Project', projectType: 'Residence', clientEmail: 'client@demoproject.com', clientPhone: '+91 00000 00000', estimatedValue: 9785823, status: 'won', source: 'Direct Referral', notes: 'Master turnkey interior fitout with Trade-wise BOQ Engine signoff', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), lastContactedAt: '1 hour ago', assignedTo: 'Jitendra Mewada' }
];

const INITIAL_COMMS: Communication[] = [
  { id: '1', leadId: '2', type: 'Meeting', date: 'Today, 10:00 AM', summary: 'Discussed Q3 deliverables. They are interested in the enterprise tier. Need to send a revised proposal by Friday.', author: 'Sarah Connor' },
  { id: '2', leadId: '4', type: 'Call', date: 'Yesterday', summary: 'Initial outreach. Bruce is looking for a comprehensive suite to replace their current fragmented tools. Scheduled a demo.', author: 'John Doe' },
  { id: '3', leadId: '1', type: 'Email', date: '2 days ago', summary: 'Sent pricing details and case studies. Awaiting their review.', author: 'Sarah Connor' },
];

export function ConnectApp({ activePage, onNavigate, navigateToApp }: ConnectAppProps) {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [communications, setCommunications] = useState<Communication[]>(INITIAL_COMMS);

  const addLead = (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLeads([{ 
      ...lead, 
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, ...leads]);
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
  };

  const addCommunication = (comm: Omit<Communication, 'id'>) => {
    setCommunications([{ ...comm, id: Math.random().toString(36).substr(2, 9) }, ...communications]);
  };

  const goToPage = (page: string) => {
    if (onNavigate) onNavigate(page);
  };

  const contextValue = {
    leads, setLeads,
    communications, setCommunications,
    addLead, updateLeadStatus, addCommunication, goToPage
  };

  const renderPage = () => {
    switch (activePage) {
      case 'CRM Dashboard': return <ConnectDashboard />;
      case 'Client Management': return <ConnectClientManagement />;
      case 'Pipeline Page': return <ConnectPipeline />;
      case 'Communication Page': return <ConnectCommunication />;
      case 'Overview': return <ConnectOverview />;
      case 'Help': return <ConnectHelp />;
      default: return <ConnectOverview />;
    }
  };

  return (
    <ConnectContext.Provider value={contextValue}>
      <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-900/50">
        {renderPage()}
      </div>
    </ConnectContext.Provider>
  );
}
