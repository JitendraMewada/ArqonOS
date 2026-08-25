import React, { createContext, useContext, useState } from 'react';

export type LeadStatus = 'new' | 'contacted' | 'meeting_scheduled' | 'proposal_sent' | 'negotiation' | 'won' | 'lost';

export interface Lead {
  id: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  projectName?: string;
  projectType: string;
  projectTimeline?: string;
  projectArea?: string;
  projectHealth?: string;
  bantStatus?: {
    budget: boolean;
    authority: boolean;
    need: boolean;
    timeline: boolean;
  };
  estimatedValue: number;
  status: LeadStatus;
  source: string;
  assignedTo?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
}

export interface Communication {
  id: string;
  leadId: string;
  type: 'Email' | 'Call' | 'Meeting';
  date: string;
  summary: string;
  author: string;
}

export interface ConnectContextType {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  communications: Communication[];
  setCommunications: React.Dispatch<React.SetStateAction<Communication[]>>;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  addCommunication: (comm: Omit<Communication, 'id'>) => void;
  goToPage: (page: string) => void;
}

export const ConnectContext = createContext<ConnectContextType | undefined>(undefined);

export function useConnect() {
  const context = useContext(ConnectContext);
  if (!context) throw new Error('useConnect must be used within a ConnectApp');
  return context;
}
