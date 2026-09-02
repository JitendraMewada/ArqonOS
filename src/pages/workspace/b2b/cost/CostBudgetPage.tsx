import React, { useState } from 'react';
import {
  Wallet,
  Building2,
  Sliders,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Download,
  Plus,
  ArrowRight,
  ShieldCheck,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { useCost } from './CostContext';
import { cn } from '../../../../lib/utils';

export function CostBudgetPage() {
  const {
    projectsFinancials,
    selectedProjectId,
    setSelectedProjectId,
    portfolioSummary,
    activeProject,
    updateProjectBudget,
    exportFinancialSummary
  } = useCost();

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [editingTargetId, setEditingTargetId] = useState<string>(selectedProjectId === 'ALL' ? projectsFinancials[0]?.projectId : selectedProjectId);
  const [editApprovedBudget, setEditApprovedBudget] = useState<number>(0);
  const [editContractValue, setEditContractValue] = useState<number>(0);

  const startEdit = (projId: string) => {
    const proj = projectsFinancials.find(p => p.projectId === projId);
    if (!proj) return;
    setEditingTargetId(projId);
    setEditApprovedBudget(proj.approvedBudget);
    setEditContractValue(proj.contractValue);
    setIsEditingBudget(true);
  };

  const saveEdit = async () => {
    if (!editingTargetId) return;
    await updateProjectBudget(editingTargetId, {
      approvedBudget: Number(editApprovedBudget),
      contractValue: Number(editContractValue)
    });
    setIsEditingBudget(false);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto animate-in fade-in duration-300 text-left">
      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[11px] font-black uppercase tracking-wider mb-2 border border-slate-300/50 dark:border-slate-700/50">
              <Wallet className="w-3.5 h-3.5" />
              Budget Planning & Capital Allocation
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Project BOQ Budget Engine
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Structure approved budgets, contingency buffers, and space allocations derived from Studio design signoffs.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => exportFinancialSummary()}
              className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export Budget Ledger
            </button>
          </div>
        </div>

        {/* Project Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setSelectedProjectId('ALL')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 border",
              selectedProjectId === 'ALL'
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            )}
          >
            All Projects Summary
          </button>
          {projectsFinancials.map(p => (
            <button
              key={p.projectId}
              onClick={() => setSelectedProjectId(p.projectId)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border",
                selectedProjectId === p.projectId
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60"
              )}
            >
              <span>{p.projectName}</span>
              <span className="text-[10px] opacity-70">({p.projectCode})</span>
            </button>
          ))}
        </div>

        {/* Detailed Budget Allocations Table & Cards */}
        <div className="space-y-6">
          {projectsFinancials
            .filter(p => selectedProjectId === 'ALL' || p.projectId === selectedProjectId)
            .map((proj) => (
              <div
                key={proj.projectId}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                        {proj.projectCode} • {proj.projectType}
                      </span>
                      <span className={cn(
                        "px-2 py-0.2 rounded text-[10px] font-bold",
                        proj.approvalGateStatus === 'Unlocked & Approved' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                      )}>
                        {proj.approvalGateStatus}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                      {proj.projectName} — {proj.clientName}
                    </h3>
                    <p className="text-xs font-medium text-slate-500">
                      Location: {proj.location} • Area: {proj.totalAreaSqFt.toLocaleString()} sq ft • Studio Milestone: {proj.studioApprovalMilestone}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => startEdit(proj.projectId)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Adjust Budget Line
                    </button>
                  </div>
                </div>

                {/* KPI numbers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Contract Value</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">
                      ₹{proj.contractValue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Approved BOQ Budget</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">
                      ₹{proj.approvedBudget.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Forecast at Completion</p>
                    <p className="text-lg font-black text-slate-700 dark:text-slate-300">
                      ₹{proj.forecastAtCompletion.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Projected Net Margin</p>
                    <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      ₹{proj.grossMargin.toLocaleString()} ({proj.marginPercentage}%)
                    </p>
                  </div>
                </div>

                {/* Work Breakdown Category Allocation Table */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Work Breakdown Structure (WBS) Allocations
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    {Object.entries(proj.categoryBreakdown).map(([key, data]) => {
                      const label = key === 'materials' ? 'Materials & Finishes'
                        : key === 'millwork' ? 'Custom Millwork'
                        : key === 'ffe' ? 'FF&E & Loose Furniture'
                        : key === 'mep' ? 'MEP, HVAC & Lighting'
                        : key === 'labor' ? 'Labor & Supervision'
                        : key === 'civil' ? 'Civil & Prep'
                        : 'Logistics & Misc';

                      const remaining = data.allocated - data.actual - data.committed;
                      return (
                        <div key={key} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                          <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                            <span>{label}</span>
                            <span>₹{data.allocated.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-[11px] text-slate-500">
                            <span>Spent: ₹{data.actual.toLocaleString()}</span>
                            <span>Comm: ₹{data.committed.toLocaleString()}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-slate-900 dark:bg-white"
                              style={{ width: `${Math.min(100, ((data.actual + data.committed) / (data.allocated || 1)) * 100)}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-right font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{remaining.toLocaleString()} remaining
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Edit Budget Modal */}
      {isEditingBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Adjust Baseline Budget</h3>
              <button onClick={() => setIsEditingBudget(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Approved BOQ Budget (₹)</label>
                <input
                  type="number"
                  value={editApprovedBudget}
                  onChange={(e) => setEditApprovedBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Contract Signed Value (₹)</label>
                <input
                  type="number"
                  value={editContractValue}
                  onChange={(e) => setEditContractValue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setIsEditingBudget(false)} className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                Cancel
              </button>
              <button onClick={saveEdit} className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-extrabold">
                Save Adjustments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
