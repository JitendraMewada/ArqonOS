import React from 'react';
import {
  LineChart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  PieChart,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Calendar,
  Layers,
  Users,
  Truck,
  Database,
  Globe,
  Brain,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet,
  Zap,
  Sliders,
  DollarSign
} from 'lucide-react';
import { useInsight } from './InsightContext';
import { cn } from '../../../../lib/utils';

interface InsightOverviewProps {
  onNavigatePage?: (page: string) => void;
  navigateToApp?: (appId: string, pageName: string) => void;
}

export function InsightOverview({ onNavigatePage, navigateToApp }: InsightOverviewProps) {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    dateRange,
    setDateRange,
    engineStreams,
    anomalies,
    resolveAnomaly,
    portfolioTotals,
    exportNotification,
    triggerExport
  } = useInsight();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const activeAnomalies = anomalies.filter((a) => !a.isResolved);

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-300 overflow-y-auto pr-1">
      {/* Export Notification Toast */}
      {exportNotification && (
        <div className="p-3 bg-[#94a3b81a] border border-[#94a3b844] rounded-xl flex items-center justify-between text-xs animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
            <Sparkles className="w-4 h-4 text-[#94a3b8] animate-spin" />
            <span>{exportNotification}</span>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase">Compiled</span>
        </div>
      )}

      {/* Top Header & Context Control */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#94a3b81a] text-[#94a3b8] border border-[#94a3b833] text-xs font-black uppercase tracking-wider">
              Cross-Engine Intelligence Hub
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Live Multi-Engine Telemetry</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            Insight & Business Analytics
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time executive synthesis ingesting project data across Studio, Cost, Flow, Vendor, People, and Connect.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Project Scope Filter */}
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

          {/* Date Range Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl text-xs">
            {(['Last 30 Days', 'This Quarter', 'YTD', 'All Time'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all',
                  dateRange === range
                    ? 'bg-[#94a3b8] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                )}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={() => triggerExport('Portfolio Executive Summary', 'pdf')}
            className="px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-extrabold flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#94a3b8]" />
            <span>Export Snapshot</span>
          </button>
        </div>
      </div>

      {/* Selected Scope Banner (if single project) */}
      {selectedProject && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 border border-slate-700 text-white p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#94a3b822] border border-[#94a3b844] flex items-center justify-center text-[#94a3b8]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#94a3b8] text-white">
                  {selectedProject.code}
                </span>
                <span className="text-xs text-slate-300 font-semibold">{selectedProject.type}</span>
                <span className="text-xs text-slate-400">• {selectedProject.areaSqFt.toLocaleString()} sq.ft</span>
              </div>
              <h2 className="text-lg font-black text-white mt-0.5">{selectedProject.name}</h2>
              <p className="text-xs text-slate-400">Client: {selectedProject.clientName}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
              <span className="font-bold text-emerald-400">{selectedProject.status}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Progress</span>
              <span className="font-extrabold text-white">{selectedProject.completionPercentage}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Health Score</span>
              <span className={cn(
                "font-black text-sm",
                selectedProject.healthScore >= 90 ? "text-emerald-400" :
                selectedProject.healthScore >= 80 ? "text-sky-400" : "text-amber-400"
              )}>
                {selectedProject.healthScore}/100
              </span>
            </div>
            <button
              onClick={() => setSelectedProjectId('all')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-600"
            >
              Reset to Portfolio View
            </button>
          </div>
        </div>
      )}

      {/* Top Telemetry KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Financial Margin Health */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Gross Profit Margin</span>
            <div className="w-7 h-7 rounded-lg bg-[#94a3b81a] flex items-center justify-center text-[#94a3b8]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">
              {portfolioTotals.portfolioGrossMarginPercent.toFixed(1)}%
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              +1.6% YoY
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Profit: {formatCurrency(portfolioTotals.portfolioGrossMargin)} on {formatCurrency(portfolioTotals.totalContractValue)}
          </p>
        </div>

        {/* Metric 2: Earned Value & SPI */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Schedule Velocity (SPI)</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-500">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">
              {portfolioTotals.averageSPI}
            </h3>
            <span className={cn(
              "text-xs font-bold",
              portfolioTotals.averageSPI >= 1.0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500"
            )}>
              {portfolioTotals.averageSPI >= 1.0 ? 'Ahead of Plan' : 'Minor Lead Risk'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Cost Perf. Index (CPI): <strong className="text-slate-800 dark:text-slate-200">{portfolioTotals.averageCPI}</strong>
          </p>
        </div>

        {/* Metric 3: Resource & Studio Bandwidth */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Studio Utilization</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">
              {portfolioTotals.avgStudioUtilization}%
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Optimal (85-92%)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            {portfolioTotals.totalTeamMembers} Assigned Staff across {portfolioTotals.totalActiveSpaces} Spaces
          </p>
        </div>

        {/* Metric 4: AI Identified Optimization */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">AI Optimization Value</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-500">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">
              {formatCurrency(portfolioTotals.aiTotalIdentifiedSavings)}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            {activeAnomalies.length} actionable optimization opportunities detected
          </p>
        </div>
      </div>

      {/* Cross-Engine Synchronization Streams */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#94a3b8]" />
              Multi-Engine Real-Time Telemetry & Data Ingestion
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Data pipelines automatically aggregate from respective B2B engines without manual duplicate entry.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              All 7 Engines Synchronized
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {engineStreams.map((stream) => (
            <div
              key={stream.engineId}
              onClick={() => navigateToApp && navigateToApp(stream.engineId, 'Overview')}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${stream.colorHex}22`, color: stream.colorHex }}
                  >
                    {stream.engineName}
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors" />
                </div>
                <p className="text-[11px] text-slate-400 font-semibold">{stream.primaryMetric.label}</p>
                <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                  {stream.primaryMetric.value}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">{stream.lastSynced}</span>
                <span className="text-emerald-600 font-bold">✓ Sync</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Projects Portfolio Matrix & AI Anomaly Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Project Health Matrix */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#94a3b8]" />
                  Project Health & Performance Matrix
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Earned value metrics, budget variance, and schedule indexes across all active scopes.
                </p>
              </div>
              <button
                onClick={() => onNavigatePage && onNavigatePage('Reports Page')}
                className="text-xs font-bold text-[#94a3b8] hover:underline flex items-center gap-1"
              >
                <span>Full Audit Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-extrabold uppercase text-[10px]">
                    <th className="pb-2.5">Project</th>
                    <th className="pb-2.5">Contract Value</th>
                    <th className="pb-2.5">Cost to Date</th>
                    <th className="pb-2.5">Margin %</th>
                    <th className="pb-2.5">Progress</th>
                    <th className="pb-2.5">SPI</th>
                    <th className="pb-2.5">Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {projects.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedProjectId(p.id)}
                      className={cn(
                        'hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors',
                        selectedProjectId === p.id && 'bg-slate-100/80 dark:bg-slate-800 font-bold'
                      )}
                    >
                      <td className="py-3">
                        <div className="font-black text-slate-900 dark:text-white">{p.name}</div>
                        <div className="text-[11px] text-slate-400 font-semibold">{p.code} • {p.clientName}</div>
                      </td>
                      <td className="py-3 font-bold text-slate-800 dark:text-slate-200">
                        {formatCurrency(p.contractValue)}
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">
                        {formatCurrency(p.actualCostToDate)}
                      </td>
                      <td className="py-3 font-extrabold text-slate-900 dark:text-white">
                        <span className={cn(
                          p.projectedMarginPercent >= 28 ? 'text-emerald-600' :
                          p.projectedMarginPercent >= 24 ? 'text-slate-800 dark:text-slate-200' : 'text-amber-500'
                        )}>
                          {p.projectedMarginPercent}%
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#94a3b8] h-full rounded-full"
                              style={{ width: `${p.completionPercentage}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                            {p.completionPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-black",
                          p.schedulePerformanceIndex >= 1.0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" :
                          p.schedulePerformanceIndex >= 0.92 ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" :
                          "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        )}>
                          {p.schedulePerformanceIndex}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={cn(
                          "font-black text-xs",
                          p.healthScore >= 90 ? "text-emerald-600 dark:text-emerald-400" :
                          p.healthScore >= 80 ? "text-sky-600 dark:text-sky-400" : "text-amber-500"
                        )}>
                          {p.healthScore}/100
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Click any project row above to focus telemetry and scenario forecast.</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{projects.length} Total Projects Managed</span>
          </div>
        </div>

        {/* Right 1 Col: AI Anomaly & Executive Recommendations */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#A0D6B4]" />
                AI Anomaly & Risk Radar
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#A0D6B422] text-slate-700 dark:text-[#A0D6B4]">
                {activeAnomalies.length} Active
              </span>
            </div>

            <div className="space-y-3">
              {anomalies.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    'p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between gap-2',
                    alert.isResolved
                      ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 opacity-60'
                      : alert.severity === 'Critical'
                      ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                      : alert.severity === 'Warning'
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                      : alert.severity === 'Opportunity'
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn(
                        "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                        alert.severity === 'Critical' ? "bg-rose-600 text-white" :
                        alert.severity === 'Warning' ? "bg-amber-500 text-white" :
                        alert.severity === 'Opportunity' ? "bg-emerald-600 text-white" :
                        "bg-slate-500 text-white"
                      )}>
                        {alert.severity} • {alert.engineSource}
                      </span>
                      <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 dark:text-white text-xs mt-1">
                      {alert.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {alert.description}
                    </p>
                    <div className="mt-2 p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                      <strong>AI Action:</strong> {alert.recommendedAction}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500">{alert.impactMetric}</span>
                    {!alert.isResolved ? (
                      <button
                        onClick={() => resolveAnomaly(alert.id)}
                        className="px-2.5 py-1 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-extrabold hover:opacity-90 transition-opacity"
                      >
                        Acknowledge & Resolve
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Resolved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigatePage && onNavigatePage('Forecast Page')}
              className="w-full py-2 rounded-lg bg-[#94a3b81a] hover:bg-[#94a3b833] text-[#94a3b8] text-xs font-black flex items-center justify-center gap-1.5 transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Launch What-If Scenario Modeler</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
