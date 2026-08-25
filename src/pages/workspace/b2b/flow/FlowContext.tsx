import React, { createContext, useContext } from 'react';

export type Stage = {
  id: string;
  name: string;
  color: string;
  order: number;
};

export type Workflow = {
  id: string;
  name: string;
  description: string;
  stages: Stage[];
};

export type ActiveProject = {
  id: string;
  name: string;
  client: string;
  workflowId: string;
  currentStageId: string;
  status: 'On Track' | 'Delayed' | 'Blocked';
  startDate: string;
};

export type Automation = {
  id: string;
  triggerStageId: string;
  action: string;
  enabled: boolean;
};

export interface FlowContextType {
  workflows: Workflow[];
  setWorkflows: React.Dispatch<React.SetStateAction<Workflow[]>>;
  activeProjects: ActiveProject[];
  setActiveProjects: React.Dispatch<React.SetStateAction<ActiveProject[]>>;
  automations: Automation[];
  setAutomations: React.Dispatch<React.SetStateAction<Automation[]>>;
  goToPage: (page: string) => void;
  // Mutators
  addStage: (workflowId: string, stage: Omit<Stage, 'id'>) => void;
  addProject: (project: Omit<ActiveProject, 'id'>) => void;
  updateProjectStage: (projectId: string, newStageId: string) => void;
  addAutomation: (automation: Omit<Automation, 'id'>) => void;
}

export const FlowContext = createContext<FlowContextType | undefined>(undefined);

export function useFlow() {
  const context = useContext(FlowContext);
  if (!context) throw new Error('useFlow must be used within a FlowApp');
  return context;
}
