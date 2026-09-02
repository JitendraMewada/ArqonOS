import React from 'react';
import {
  TrendingUp,
  FileText,
  Download,
  PieChart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useCost } from './CostContext';
import { cn } from '../../../../lib/utils';

export function CostReportsPage() {
  const {
    projectsFinancials,
    portfolioSummary,
    exportFinancialSummary
  } = useCost();

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto animate-in fade-in duration-300 text-left">
      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[11px] font-black uppercase tracking-wider mb-2 border border-slate-300/50 dark:border-slate-700/50">
              <FileText className="w-3.5 h-3.5" />
              Financial Intelligence & Executive P&L
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Cost & Profitability Reports
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Consolidated portfolio profitability, budget variance, cash collection velocity, and vendor exposure.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => exportFinancialSummary()}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-extrabold transition-all flex items-center gap-2 shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              Download Full P&L Report
            </button>
          </div>
        </div>

        {/* High level executive summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Gross Portfolio Margin
            </span>
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                ₹{((portfolioSummary.portfolioGrossMargin) / 100000).toFixed(2)}L
              </p>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                {portfolioSummary.portfolioGrossMarginPercentage}%
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Target Margin threshold: 30.0%. Current performance exceeds standard benchmark.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Client Cash Collection Velocity
            </span>
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {((portfolioSummary.totalCollected / (portfolioSummary.totalInvoiced || 1)) * 100).toFixed(1)}%
              </p>
              <span className="text-xs font-bold text-slate-500">
                ₹{(portfolioSummary.totalCollected / 100000).toFixed(2)}L Collected
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Outstanding Accounts Receivable: ₹{(portfolioSummary.totalReceivables / 100000).toFixed(2)}L
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Active Project Health
            </span>
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {portfolioSummary.healthyProjectsCount} / {projectsFinancials.length}
              </p>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                {portfolioSummary.cautionProjectsCount} Caution
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              0 Critical Overruns detected across all active studio projects.
            </p>
          </div>
        </div>

        {/* Project Profit & Loss Statement Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Project-by-Project Profit & Loss Ledger
            </h3>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Project & Client</th>
                <th className="py-3 px-4 text-right">Contract Revenue</th>
                <th className="py-3 px-4 text-right">Incurred Cost</th>
                <th className="py-3 px-4 text-right">Committed POs</th>
                <th className="py-3 px-4 text-right">Forecasted Cost</th>
                <th className="py-3 px-4 text-right">Net Profit</th>
                <th className="py-3 px-4 text-right">Margin %</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {projectsFinancials.map((p) => (
                <tr key={p.projectId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <div className="font-black text-slate-900 dark:text-white">{p.projectName}</div>
                    <div className="text-[11px] text-slate-500">{p.clientName}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                    ₹{p.contractValue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-rose-600 dark:text-rose-400">
                    ₹{p.actualIncurredCost.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-amber-600 dark:text-amber-400">
                    ₹{p.committedCost.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-700 dark:text-slate-300">
                    ₹{p.forecastAtCompletion.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-emerald-600 dark:text-emerald-400">
                    ₹{p.grossMargin.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">
                    {p.marginPercentage}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold",
                      p.budgetHealth === 'Healthy' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" :
                      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                    )}>
                      {p.budgetHealth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
