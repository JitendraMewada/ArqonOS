import React, { useState } from 'react';
import { FlowBuilder } from './FlowBuilder';
import { FlowTracking } from './FlowTracking';
import { FlowAutomation } from './FlowAutomation';
import { FlowHelp } from './FlowHelp';
import { FlowOverview } from './FlowOverview';
import { FlowContext, type Workflow, type ActiveProject, type Automation, type Stage } from './FlowContext';

interface FlowAppProps {
  activePage: string;
  onNavigate?: (page: string) => void;
  navigateToApp?: (appId: string, pageName: string) => void;
}

// -------------------------------------------------------------
// MAIN APP COMPONENT
// -------------------------------------------------------------
export function FlowApp({ activePage, onNavigate, navigateToApp }: FlowAppProps) {
  // Mock Data
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: 'wf-1',
      name: 'Standard Design Handover',
      description: 'The standard flow from intake through deployment.',
      stages: [
        { id: 'st-1', name: 'Intake', color: 'bg-slate-500 text-slate-100', order: 1 },
        { id: 'st-2', name: 'Design', color: 'bg-indigo-500 text-white', order: 2 },
        { id: 'st-3', name: 'Approval', color: 'bg-amber-500 text-white', order: 3 },
        { id: 'st-4', name: 'Handover', color: 'bg-emerald-500 text-white', order: 4 },
      ]
    }
  ]);

  const [activeProjects, setActiveProjects] = useState<ActiveProject[]>([
    { id: 'p-1', name: 'Project Alpha', client: 'Acme Corp', workflowId: 'wf-1', currentStageId: 'st-2', status: 'On Track', startDate: '2026-10-15' },
    { id: 'p-2', name: 'Project Beta', client: 'Globex', workflowId: 'wf-1', currentStageId: 'st-1', status: 'Delayed', startDate: '2026-10-20' },
    { id: 'p-3', name: 'Project Gamma', client: 'Initech', workflowId: 'wf-1', currentStageId: 'st-3', status: 'Blocked', startDate: '2026-09-05' },
  ]);

  const [automations, setAutomations] = useState<Automation[]>([
    { id: 'a-1', triggerStageId: 'st-2', action: 'Create Task: Assign Designer', enabled: true },
    { id: 'a-2', triggerStageId: 'st-3', action: 'Send Email to Client', enabled: false },
    { id: 'a-3', triggerStageId: 'st-4', action: 'Notify Billing', enabled: true },
  ]);

  const goToPage = (page: string) => {
    if (onNavigate) onNavigate(page);
  };

  const addStage = (workflowId: string, stage: Omit<Stage, 'id'>) => {
    setWorkflows(prev => prev.map(wf => {
      if (wf.id !== workflowId) return wf;
      return {
        ...wf,
        stages: [...wf.stages, { ...stage, id: `st-${Date.now()}` }]
      };
    }));
  };

  const addProject = (project: Omit<ActiveProject, 'id'>) => {
    setActiveProjects(prev => [...prev, { ...project, id: `p-${Date.now()}` }]);
  };

  const updateProjectStage = (projectId: string, newStageId: string) => {
    setActiveProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, currentStageId: newStageId } : p
    ));
  };

  const addAutomation = (automation: Omit<Automation, 'id'>) => {
    setAutomations(prev => [...prev, { ...automation, id: `a-${Date.now()}` }]);
  };

  const contextValue = { 
    workflows, 
    setWorkflows,
    activeProjects, 
    setActiveProjects,
    automations, 
    setAutomations, 
    goToPage,
    addStage,
    addProject,
    updateProjectStage,
    addAutomation
  };

  const renderContent = () => {
    switch (activePage.toLowerCase()) {
      case 'overview':
        return <FlowOverview />;
      case 'workflow builder':
        return <FlowBuilder />;
      case 'automation page':
        return <FlowAutomation />;
      case 'tracking page':
        return <FlowTracking />;
      case 'help':
        return <FlowHelp />;
      default:
        // Default to Builder
        return <FlowBuilder />;
    }
  };

  return (
    <FlowContext.Provider value={contextValue}>
      <div className="flex flex-col flex-1 w-full h-full min-h-0 transition-colors relative text-left">
         {renderContent()}
      </div>
    </FlowContext.Provider>
  );
}
