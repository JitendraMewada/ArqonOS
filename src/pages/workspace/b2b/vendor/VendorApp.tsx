import React from 'react';
import { VendorHelp } from './VendorHelp';
import { VendorOverview } from './VendorOverview';
import { cn } from '../../../../lib/utils';
import { Truck, Users, LayoutDashboard, ShoppingCart, Activity } from 'lucide-react';

interface VendorAppProps {
  activePage: string;
  onNavigate: (page: string) => void;
  navigateToApp?: (appId: string, pageName: string) => void;
}

export function VendorApp({ activePage, onNavigate, navigateToApp }: VendorAppProps) {
  if (activePage === 'Help') return <VendorHelp />;

  if (activePage === 'Overview') return <VendorOverview />;

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex-grow flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 bg-cyan-500/10 rounded-xl flex items-center justify-center mx-auto mb-8 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
            <Truck className="w-10 h-10 text-cyan-600" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Vendor: <span className="text-cyan-500">{activePage}</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed font-semibold">
            Supply chain systemization is under development. ArqonOS procurement logic is being architected.
          </p>
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm inline-flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
             <span className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing Supplier API...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
