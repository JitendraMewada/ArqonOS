import React from 'react';
import { InsightHelp } from './InsightHelp';
import { InsightOverview } from './InsightOverview';
import { cn } from '../../../../lib/utils';
import { LineChart, BarChart3, Activity, PieChart, TrendingUp } from 'lucide-react';

interface InsightAppProps {
  activePage: string;
  onNavigate: (page: string) => void;
  navigateToApp?: (appId: string, pageName: string) => void;
}

export function InsightApp({ activePage, onNavigate, navigateToApp }: InsightAppProps) {
  const pages = ['Overview', 'Dashboard Page', 'Reports Page', 'Forecast Page', 'Help'];
  
  if (activePage === 'Help') return <InsightHelp />;

  if (activePage === 'Overview') return <InsightOverview />;

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex-grow flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 bg-slate-500/10 rounded-xl flex items-center justify-center mx-auto mb-8 border border-slate-500/20 shadow-lg shadow-slate-500/5">
            <LineChart className="w-10 h-10 text-slate-600" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Insight: <span className="text-slate-500">{activePage}</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed font-semibold">
            Data intelligence and predictive analytics are being prepared. ArqonOS strategic dashboards are being designed.
          </p>
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm inline-flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" />
             <span className="text-xs font-black uppercase tracking-widest text-slate-400">Processing Analytics Core...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
