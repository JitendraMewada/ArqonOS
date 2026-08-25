import React from 'react';
import { StudioHelp } from './StudioHelp';
import { StudioProvider, useStudio } from './StudioContext';
import { StudioDashboard } from './StudioDashboard';
import { ProjectLayout } from './projects/ProjectLayout';
import { cn } from '../../../../lib/utils';

interface StudioAppProps {
  activePage: string;
  onNavigate?: (page: string) => void;
  navigateToApp?: (appId: string, pageName: string) => void;
}

function StudioContent({ activePage, onNavigate }: Omit<StudioAppProps, 'navigateToApp'>) {
  const { activeProject } = useStudio();

  // If a project is active, it takes over the main view
  if (activeProject) {
    return <ProjectLayout />;
  }

  // Handle standard navigation pages
  switch (activePage) {
    case 'Help': return <StudioHelp />;
    case 'Dashboard': return <StudioDashboard />;
    case 'Templates': return <div className="flex-1 flex items-center justify-center text-slate-500">Templates module coming soon...</div>;
    case 'Collaboration': return <div className="flex-1 flex items-center justify-center text-slate-500">Collaboration module coming soon...</div>;
    case 'Settings': return <div className="flex-1 flex items-center justify-center text-slate-500">Settings module coming soon...</div>;
    default: return <StudioDashboard />;
  }
}

export function StudioApp(props: StudioAppProps) {
  return (
    <StudioProvider>
      <div className="w-full flex-1 flex flex-col">
        <StudioContent {...props} />
      </div>
    </StudioProvider>
  );
}
