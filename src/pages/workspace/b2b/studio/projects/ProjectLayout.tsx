import React, { useState, useEffect, useRef } from 'react';
import { 
  Info, Users, Ruler, Shapes, FileText, 
  Palette, Box, Presentation, CheckCircle2, 
  History, ArrowLeft, MoreHorizontal, Settings2,
  ChevronRight, ExternalLink, ChevronDown, LayoutDashboard
} from 'lucide-react';
import { useStudio, type Project } from '../StudioContext';
import { cn } from '../../../../../lib/utils';

// Subcomponents (placeholder implementations to be moved to separate files)
import { ProjectOverview } from './ProjectOverview';
import { TeamAssignment } from './TeamAssignment';
import { DimensionMatrix } from './DimensionMatrix';
import { SpacesList } from './SpacesList';
import { ProjectSketch } from './ProjectSketch';
import { ProjectAssets } from './ProjectAssets';
import { ProjectMoodboards } from './ProjectMoodboards';
import { ProjectSettingsModal } from './ProjectSettingsModal';

export function ProjectLayout() {
  const { activeProject, setActiveProject } = useStudio();
  const [activeTab, setActiveTab] = useState('Overview');
  const [showSettings, setShowSettings] = useState(false);
  const [showTabDropdown, setShowTabDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setActiveTab(customEvent.detail);
    };
    window.addEventListener('changeStudioTab', handleTabChange);
    return () => window.removeEventListener('changeStudioTab', handleTabChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTabDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!activeProject) return null;

  const tabs = [
    { id: 'Overview', icon: Info, label: 'Overview' },
    { id: 'Team', icon: Users, label: 'Team Assignment' },
    { id: 'Dimensions', icon: Ruler, label: 'Dimension Matrix' },
    { id: 'Spaces', icon: Shapes, label: 'Spaces' },
    { id: 'Sketch', icon: FileText, label: 'Sketch' },
    { id: 'Moodboards', icon: Palette, label: 'Moodboards' },
    { id: 'Assets', icon: Box, label: 'Assets' },
    { id: 'Presentations', icon: Presentation, label: 'Presentations' },
    { id: 'Approvals', icon: CheckCircle2, label: 'Approvals' },
    { id: 'Revisions', icon: History, label: 'Revisions' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <ProjectOverview project={activeProject} />;
      case 'Team': return <TeamAssignment projectId={activeProject.id} />;
      case 'Dimensions': return <DimensionMatrix projectId={activeProject.id} />;
      case 'Spaces': return <SpacesList projectId={activeProject.id} />;
      case 'Sketch': return <ProjectSketch projectId={activeProject.id} />;
      case 'Assets': return <ProjectAssets projectId={activeProject.id} />;
      case 'Moodboards': return <ProjectMoodboards projectId={activeProject.id} />;
      default: return (
        <div className="flex-1 flex items-center justify-center text-slate-500 italic">
          {activeTab} module is coming soon...
        </div>
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0">
      <div className="flex-1 flex flex-col border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 animate-in fade-in duration-500 shadow-sm min-h-0">
        {/* Navbar */}
        <div className="h-16 border-b border-slate-100 dark:border-slate-800 flex flex-shrink-0 items-center justify-between px-6 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveProject(null)}
            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black text-orange-600 dark:text-orange-500 bg-orange-100 dark:bg-orange-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest">{activeProject.code}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{activeProject.type}</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              {activeProject.name}
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <span className="text-orange-500">{activeTab}</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowTabDropdown(!showTabDropdown)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold shadow-sm transition-all",
                showTabDropdown ? "text-slate-900 dark:text-white border-slate-300 dark:border-slate-600" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Modules <ChevronDown className={cn("w-3.5 h-3.5 opacity-50 transition-transform", showTabDropdown && "rotate-180")} />
            </button>
            
            {showTabDropdown && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="p-2 space-y-0.5 max-h-[60vh] overflow-y-auto no-scrollbar">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setShowTabDropdown(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-all",
                          isActive 
                            ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500" 
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={cn("w-4 h-4", isActive ? "text-orange-500" : "text-slate-400")} />
                          {tab.label}
                        </div>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                      </button>
                    );
                  })}
                </div>
                <div className="border-t border-slate-100 dark:border-slate-700 p-2 space-y-0.5 bg-slate-50 dark:bg-slate-900">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-orange-500 transition-all">
                    <ExternalLink className="w-3.5 h-3.5" /> Site Photos
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-orange-500 transition-all">
                    <ExternalLink className="w-3.5 h-3.5" /> Client BOQ
                  </button>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm transition-all"
          >
            <Settings2 className="w-3.5 h-3.5" /> Project Settings
          </button>
          <button className="w-8 h-8 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={cn(
        "flex-1 bg-white dark:bg-slate-900 flex flex-col min-h-0",
        (activeTab !== 'Sketch' && activeTab !== 'Assets') && "overflow-y-auto"
      )}>
        {renderContent()}
      </div>
     </div>

     {showSettings && (
       <ProjectSettingsModal 
         project={activeProject} 
         onClose={() => setShowSettings(false)} 
       />
     )}
    </div>
  );
}
