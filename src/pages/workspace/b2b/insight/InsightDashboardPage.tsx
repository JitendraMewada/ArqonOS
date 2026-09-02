import React, { useState } from 'react';
import {
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  TrendingUp,
  TrendingDown,
  Building2,
  Calendar,
  Layers,
  Users,
  Truck,
  Database,
  ArrowUpRight,
  Filter,
  Download,
  DollarSign,
  Clock,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useInsight } from './InsightContext';
import { cn } from '../../../../lib/utils';

export function InsightDashboardPage() {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    dateRange,
    setDateRange,
    monthlyTrends,
    departmentProductivity,
    portfolioTotals,
    triggerExport
  } = useInsight();

  const [activeTab, setActiveTab] = useState<'financial' | 'operations' | 'studio' | 'supply_chain' | 'team'>('financial');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const targetProjects = selectedProject ? [selectedProject] : projects;

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-300 overflow-y-auto pr-1">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#94a3b81a] text-[#94a3b8] border border-[#94a3b833] text-xs font-black uppercase tracking-wider">
              Telemetry & Visual Dashboards
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Multi-Dimensional Data Visualization</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            Analytics & Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time visual drill-down across financials, schedule milestones, studio space output, and supply chain.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Project Filter */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl text-xs shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-[#94a3b8]" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="text-xs font-bold text-slate-800 dark:text-slate-100 bg-transparent border-none outline-none cursor-pointer"
            >
              <option value="all">Portfolio View (All Projects)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => triggerExport('Visual Analytics Dashboard', 'pdf')}
            className="px-3.5 py-2 rounded-lg bg-[#94a3b8] hover:bg-[#94a3b8]/90 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Dashboard</span>
          </button>
        </div>
      </div>

      {/* Dashboard Sub-Category Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          onClick={() => setActiveTab('financial')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-black transition-all',
            activeTab === 'financial'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          <DollarSign className="w-3.5 h-3.5 text-[#94a3b8]" />
          <span>Financial & Cashflow</span>
        </button>

        <button
          onClick={() => setActiveTab('operations')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-black transition-all',
            activeTab === 'operations'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          <Activity className="w-3.5 h-3.5 text-[#3b82f6]" />
          <span>Flow & Velocity (EVM)</span>
        </button>

        <button
          onClick={() => setActiveTab('studio')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-black transition-all',
            activeTab === 'studio'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          <Layers className="w-3.5 h-3.5 text-[#f97316]" />
          <span>Studio & Space Density</span>
        </button>

        <button
          onClick={() => setActiveTab('supply_chain')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-black transition-all',
            activeTab === 'supply_chain'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          <Truck className="w-3.5 h-3.5 text-[#07B9CE]" />
          <span>Supply Chain & Vendors</span>
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-black transition-all',
            activeTab === 'team'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          <Users className="w-3.5 h-3.5 text-[#a855f7]" />
          <span>People & Utilization</span>
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TAB 1: FINANCIAL & CASHFLOW INTELLIGENCE */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'financial' && (
        <div className="flex flex-col gap-6">
          {/* Financial KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase">Total Contract Value</span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {formatCurrency(portfolioTotals.totalContractValue)}
              </h4>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                {formatCurrency(portfolioTotals.totalInvoiced)} Invoiced ({((portfolioTotals.totalInvoiced / portfolioTotals.totalContractValue) * 100).toFixed(0)}%)
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase">Actual Spend to Date</span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {formatCurrency(portfolioTotals.totalActualCost)}
              </h4>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">
                + {formatCurrency(portfolioTotals.totalCommittedPO)} Committed POs
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase">Cash Collected</span>
              <h4 className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {formatCurrency(portfolioTotals.totalCollected)}
              </h4>
              <p className="text-[11px] text-amber-500 font-semibold mt-1">
                {formatCurrency(portfolioTotals.totalReceivables)} Pending Receivables
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase">Projected Net Margin</span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {portfolioTotals.portfolioGrossMarginPercent.toFixed(1)}%
              </h4>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">
                Yield: {formatCurrency(portfolioTotals.portfolioGrossMargin)}
              </p>
            </div>
          </div>

          {/* Monthly Revenue vs Expense Waterfall Chart Bar Visualizer */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Monthly Revenue Realization vs Actual Site Burn Rate
                </h3>
                <p className="text-xs text-slate-500">
                  Visual comparison between client milestones collected and subcontractor procurement disbursements.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Revenue Realized
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-400" /> Actual Site Cost
                </span>
                <span className="flex items-center gap-1.5 text-indigo-500">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /> Net Cash Flow
                </span>
              </div>
            </div>

            {/* Custom Bar Visualization */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-4">
              {monthlyTrends.map((t) => {
                const maxVal = 16000000;
                const revHeight = Math.round((t.revenue / maxVal) * 120);
                const costHeight = Math.round((t.actualCost / maxVal) * 120);

                return (
                  <div key={t.month} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center justify-end h-56 text-center">
                    <div className="w-full flex items-end justify-center gap-2 h-32 mb-2">
                      {/* Revenue Bar */}
                      <div
                        className="w-4 bg-emerald-500 rounded-t-sm transition-all hover:opacity-80"
                        style={{ height: `${revHeight}px` }}
                        title={`Revenue: ${formatCurrency(t.revenue)}`}
                      />
                      {/* Cost Bar */}
                      <div
                        className="w-4 bg-slate-400 dark:bg-slate-500 rounded-t-sm transition-all hover:opacity-80"
                        style={{ height: `${costHeight}px` }}
                        title={`Actual Cost: ${formatCurrency(t.actualCost)}`}
                      />
                    </div>
                    <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 block truncate w-full">
                      {t.month}
                    </span>
                    <span className="text-[9px] font-extrabold text-emerald-600 mt-0.5">
                      +{t.marginPercent}% Mgn
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 2: WORKFLOW VELOCITY & EVM (FLOW + QUEST) */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'operations' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase">Avg Schedule Performance (SPI)</span>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {portfolioTotals.averageSPI}
              </h4>
              <p className="text-xs text-slate-500 mt-1">Formula: Earned Value (EV) / Planned Value (PV)</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase">Active Critical Path Bottlenecks</span>
              <h4 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {portfolioTotals.criticalPathRisksCount} Projects
              </h4>
              <p className="text-xs text-slate-500 mt-1">Sea freight customs & MEP approval dependencies</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase">Avg Task Completion Velocity</span>
              <h4 className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                21.8 tasks/wk
              </h4>
              <p className="text-xs text-slate-500 mt-1">Quest synchronization rate across execution teams</p>
            </div>
          </div>

          {/* Project Milestones Progress Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              Project Milestones Burndown & Critical Path Index
            </h3>

            <div className="space-y-4">
              {targetProjects.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 dark:text-white text-sm">{p.name}</span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {p.code}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-semibold">
                        PM: {p.projectManager} • Target End: {p.targetEndDate} (FC: {p.forecastedEndDate})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-xs font-black px-2.5 py-1 rounded-md",
                        p.criticalPathRisk === 'Low' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                        p.criticalPathRisk === 'Medium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                        'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                      )}>
                        Risk: {p.criticalPathRisk}
                      </span>
                      <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                        {p.completedMilestones} of {p.totalMilestones} Milestones
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden mb-2">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        p.schedulePerformanceIndex >= 1.0 ? "bg-emerald-500" :
                        p.schedulePerformanceIndex >= 0.9 ? "bg-blue-500" : "bg-amber-500"
                      )}
                      style={{ width: `${(p.completedMilestones / p.totalMilestones) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <span>Active Bottlenecks: <strong>{p.activeBottlenecks}</strong></span>
                    <span>Open Tasks: <strong>{p.openTasks}</strong> ({p.overdueTasks} Overdue)</span>
                    <span>Velocity: <strong>{p.velocityScore} tasks/wk</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 3: STUDIO & SPACE DENSITY */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'studio' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase">Total Space Inventory</span>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {portfolioTotals.totalActiveSpaces} Spaces
              </h4>
              <p className="text-xs text-slate-500 mt-1">{portfolioTotals.totalSqFtManaged.toLocaleString()} sq.ft across projects</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase">Drawing Approval Velocity</span>
              <h4 className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-1">
                91.4%
              </h4>
              <p className="text-xs text-slate-500 mt-1">Studio GFC drawing sign-offs without rejection</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase">Avg Design Revision Cycles</span>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                2.1 Revisions
              </h4>
              <p className="text-xs text-slate-500 mt-1">Benchmark: &lt; 2.5 cycles per approved room</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {targetProjects.map((p) => (
              <div key={p.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">{p.name}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                      Studio Sync
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mb-3">Lead: {p.leadDesigner}</p>

                  <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Planned Spaces</span>
                      <strong className="text-slate-900 dark:text-white font-extrabold">{p.spacesCount} Rooms ({p.totalSpacesSqFt} sq.ft)</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Approved Drawings</span>
                      <strong className="text-emerald-600 font-extrabold">{p.approvedDrawingsPercent}% Sign-off</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Revision Cycles: <strong>{p.revisionCycles}</strong></span>
                  <span>Pending Approvals: <strong>{p.pendingDesignApprovals}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 4: SUPPLY CHAIN & VENDOR RELIABILITY */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'supply_chain' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase">On-Time Delivery Rate</span>
              <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {portfolioTotals.avgDeliveryOnTimeRate}%
              </h4>
              <p className="text-xs text-slate-500 mt-1">Material site freight arrival SLA compliance</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase">QA Defect Rejection Rate</span>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                1.9%
              </h4>
              <p className="text-xs text-slate-500 mt-1">Subcontractor site inspection quality rejection</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase">Active Subcontractor Network</span>
              <h4 className="text-2xl font-black text-[#07B9CE] mt-1">
                {portfolioTotals.totalActiveVendors} Suppliers
              </h4>
              <p className="text-xs text-slate-500 mt-1">Direct integration with Vendor & Cost PO engine</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              Procurement & Vendor Performance Scorecard by Project Scope
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-extrabold uppercase text-[10px]">
                    <th className="pb-2.5">Project</th>
                    <th className="pb-2.5">Suppliers</th>
                    <th className="pb-2.5">POs Issued</th>
                    <th className="pb-2.5">Committed PO Cost</th>
                    <th className="pb-2.5">On-Time SLA</th>
                    <th className="pb-2.5">Quality Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {targetProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 font-bold text-slate-900 dark:text-white">{p.name}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">{p.activeVendorsCount} Vendors</td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">{p.totalPOsIssued} Orders</td>
                      <td className="py-3 font-black text-slate-900 dark:text-white">{formatCurrency(p.committedPOCost)}</td>
                      <td className="py-3">
                        <span className={cn(
                          "font-bold",
                          p.materialDeliveryOnTimeRate >= 95 ? 'text-emerald-600' :
                          p.materialDeliveryOnTimeRate >= 90 ? 'text-sky-600' : 'text-amber-500'
                        )}>
                          {p.materialDeliveryOnTimeRate}%
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="font-extrabold text-emerald-600">
                          {(100 - p.qualityDefectRate).toFixed(1)}% Acceptance
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 5: PEOPLE & TEAM UTILIZATION */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'team' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase">Active Studio Staff</span>
              <h4 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                28 Specialists
              </h4>
              <p className="text-xs text-slate-500 mt-1">5 core operational departments</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase">Avg Billable Utilization</span>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                89.2%
              </h4>
              <p className="text-xs text-slate-500 mt-1">Target healthy corridor: 85% to 92%</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase">Total Billable Hours Logged</span>
              <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                4,022 hrs
              </h4>
              <p className="text-xs text-slate-500 mt-1">YTD timesheet audit verified in People module</p>
            </div>
          </div>

          {/* Departmental Productivity Ledger */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              Departmental Capacity, Billability & Efficiency Indices
            </h3>

            <div className="space-y-4">
              {departmentProductivity.map((dept) => (
                <div key={dept.department} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{dept.department}</h4>
                      <span className="text-xs text-slate-400 font-semibold">{dept.headcount} Team Members • {dept.capacityHours} Capacity Hours/mo</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold">
                      <span className="text-slate-600 dark:text-slate-300">
                        {dept.billableHours} hrs Billable ({dept.nonBillableHours} hrs Non-billable)
                      </span>
                      <span className={cn(
                        "px-2.5 py-0.5 rounded text-xs font-black",
                        dept.utilizationPercent >= 90 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      )}>
                        {dept.utilizationPercent}% Utilization
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-purple-600 h-full rounded-full"
                      style={{ width: `${dept.utilizationPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Cost per Billable Hour: <strong>{formatCurrency(dept.costPerBillableHour)}/hr</strong></span>
                    <span>Efficiency Rating: <strong className="text-emerald-600">{dept.hourlyEfficiencyIndex}/100</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
