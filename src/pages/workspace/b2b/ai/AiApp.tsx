import React from 'react';
import { AiHelp } from './AiHelp';
import { AiOverview } from './AiOverview';
import { cn } from '../../../../lib/utils';
import { Brain, Cpu, Network, Sparkles, Command } from 'lucide-react';

interface AiAppProps {
  activePage: string;
  onNavigate: (page: string) => void;
  navigateToApp?: (appId: string, pageName: string) => void;
}

export function AiApp({ activePage, onNavigate, navigateToApp }: AiAppProps) {
  const pages = ['Overview', 'Automation Page', 'Prediction Page', 'Optimization Page', 'Help'];
  
  if (activePage === 'Help') return <AiHelp />;

  if (activePage === 'Overview') return <AiOverview />;

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex-grow flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
            <Brain className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            AI: <span className="text-emerald-500">{activePage}</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed font-semibold">
            The intelligent core of ArqonOS is learning. Advanced neural logic and predictive engines are being initialized.
          </p>
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm inline-flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-xs font-black uppercase tracking-widest text-slate-400">Initializing Neural Core...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
