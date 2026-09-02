import React, { useState } from 'react';
import {
  Brain,
  Cpu,
  Network,
  Sparkles,
  Command,
  Zap,
  ArrowUpRight,
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Play,
  Layers,
  DollarSign,
  Activity,
  ShieldCheck,
  RefreshCw,
  Sliders,
  ChevronRight,
  FolderSync,
  Bot
} from 'lucide-react';
import { useAi } from './AiContext';
import { cn } from '../../../../lib/utils';

interface AiOverviewProps {
  onNavigatePage?: (page: string) => void;
  navigateToApp?: (appId: string, pageName: string) => void;
}

export function AiOverview({ onNavigatePage, navigateToApp }: AiOverviewProps) {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    automations,
    runAutomationNow,
    predictions,
    optimizations,
    applyOptimization,
    neuralMetrics,
    notificationMessage,
    dismissNotification,
    portfolioRollup
  } = useAi();

  const [isRefreshingTelemetry, setIsRefreshingTelemetry] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleRefresh = () => {
    setIsRefreshingTelemetry(true);
    setTimeout(() => {
      setIsRefreshingTelemetry(false);
    }, 600);
  };

  // Filtered data based on project selection
  const relevantPredictions = selectedProject
    ? predictions.filter((p) => p.projectId === selectedProject.id || p.projectId === 'all')
    : predictions;

  const relevantOptimizations = selectedProject
    ? optimizations.filter((o) => o.projectId === selectedProject.id || o.projectId === 'all')
    : optimizations;

  const activeAutomationsList = automations.filter((a) => a.status === 'Active');

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-300 overflow-y-auto pr-1 text-left">
      {/* Toast Notification */}
      {notificationMessage && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white border border-[#A0D6B4]/30 shadow-lg flex items-center justify-between text-xs animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#A0D6B4] shrink-0" />
            <span className="font-semibold">{notificationMessage}</span>
          </div>
          <button
            onClick={dismissNotification}
            className="text-slate-400 hover:text-white text-xs font-bold ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Header & Scope Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#A0D6B422] text-slate-800 dark:text-[#A0D6B4] border border-[#A0D6B444] text-xs font-black uppercase tracking-wider">
              Arqon Neural Operating Core
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Cross-Engine Cognitive Fabric</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            AI Engine: Intelligent Orchestration
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Continuous multi-engine data ingestion, autonomous task automation, predictive risk synthesis, and value-engineering optimization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Project Scope Filter */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl text-xs shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-[#A0D6B4]" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="text-xs font-bold text-slate-800 dark:text-slate-100 bg-transparent border-none outline-none cursor-pointer"
            >
              <option value="all">Portfolio Scope (All 5 Projects)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center gap-1.5 text-xs font-bold"
            title="Refresh Ingested Telemetry"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 text-[#A0D6B4]", isRefreshingTelemetry && "animate-spin")} />
            <span>Sync Neural Feeds</span>
          </button>
        </div>
      </div>

      {/* Top Neural KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
              Active Neural Models
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#A0D6B422] flex items-center justify-center text-[#A0D6B4]">
              <Cpu className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {neuralMetrics.activeModels} Multi-Modal
            </span>
          </div>
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-[#A0D6B4] mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Latency: {neuralMetrics.averageInferenceLatencyMs}ms • 99.8% Uptime
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
              Autonomous Automations
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#3b82f61a] flex items-center justify-center text-[#3b82f6]">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {portfolioRollup.totalAutomationsActive} Active Rules
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
            {neuralMetrics.totalAutomationsRan24h} executions in last 24h
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
              Value Engineering Unlocked
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-[#A0D6B4]">
              {formatCurrency(portfolioRollup.totalValueEngineeringINR)}
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Across materials, labor & bulk freight
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
              Schedule Compression
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              +{portfolioRollup.preventedDelayDays} Days Recovered
            </span>
          </div>
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            Critical path resequencing & trade concurrency
          </p>
        </div>
      </div>

      {/* Synchronized Cross-Engine Federation Status Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Cross-Engine Live Data Ingestion Pipeline
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedProject
                ? `Active neural telemetry filtered for: ${selectedProject.name} (${selectedProject.code})`
                : 'Aggregating real-time telemetry across all 7 Arqon operating modules'}
            </p>
          </div>
          <span className="text-[10px] font-black px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-start sm:self-auto">
            Rate: {neuralMetrics.crossEngineDataIngestionRatePerSec} events/sec
          </span>
        </div>

        {/* 7 Engines Ingestion Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
          {/* Engine 1: Studio */}
          <div
            onClick={() => navigateToApp && navigateToApp('studio', 'Dashboard')}
            className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-[#f97316] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black text-[#f97316] uppercase">Studio</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="font-bold text-slate-900 dark:text-white">
              {selectedProject ? `${selectedProject.engineFeeds.studio.spacesCount} Spaces` : `${portfolioRollup.totalSpaces} Spaces`}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {selectedProject ? `${selectedProject.engineFeeds.studio.approvedDrawings} Approved CAD` : 'BOQs Locked'}
            </span>
          </div>

          {/* Engine 2: Cost */}
          <div
            onClick={() => navigateToApp && navigateToApp('cost', 'Budget Page')}
            className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-[#94a3b8] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black text-[#94a3b8] uppercase">Cost</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="font-bold text-slate-900 dark:text-white truncate">
              {selectedProject
                ? formatCurrency(selectedProject.engineFeeds.cost.actualSpend)
                : formatCurrency(portfolioRollup.totalActualSpend)}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {selectedProject ? `Budget: ${formatCurrency(selectedProject.engineFeeds.cost.budget)}` : '5 Budgets Tracked'}
            </span>
          </div>

          {/* Engine 3: Flow */}
          <div
            onClick={() => navigateToApp && navigateToApp('flow', 'Workflow Builder')}
            className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-[#3b82f6] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black text-[#3b82f6] uppercase">Flow</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="font-bold text-slate-900 dark:text-white">
              {selectedProject ? `SPI: ${selectedProject.engineFeeds.flow.spiIndex}` : `SPI: ${portfolioRollup.overallSpi}`}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {selectedProject ? `${selectedProject.engineFeeds.flow.activeWorkflows} Workflows` : '47 Active Stages'}
            </span>
          </div>

          {/* Engine 4: Quest */}
          <div
            onClick={() => navigateToApp && navigateToApp('quest', 'Tasks')}
            className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-[#3b82f6] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black text-[#3b82f6] uppercase">Quest</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="font-bold text-slate-900 dark:text-white">
              {selectedProject ? `${selectedProject.engineFeeds.quest.openTasks} Tasks` : `${portfolioRollup.totalOpenTasks} Tasks`}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {selectedProject ? `${selectedProject.engineFeeds.quest.overdueTasks} Overdue` : `${portfolioRollup.totalOverdueTasks} Overdue Total`}
            </span>
          </div>

          {/* Engine 5: Vendor */}
          <div
            onClick={() => navigateToApp && navigateToApp('vendor', 'Directory Page')}
            className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-[#07B9CE] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black text-[#07B9CE] uppercase">Vendor</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="font-bold text-slate-900 dark:text-white">
              {selectedProject ? `${selectedProject.engineFeeds.vendor.onTimeDeliveryRate}% SLA` : '93.6% Avg SLA'}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {selectedProject ? `${selectedProject.engineFeeds.vendor.activeVendors} Suppliers` : `${portfolioRollup.totalActiveVendors} Suppliers`}
            </span>
          </div>

          {/* Engine 6: People */}
          <div
            onClick={() => navigateToApp && navigateToApp('people', 'Directory')}
            className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-[#a855f7] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black text-[#a855f7] uppercase">People</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="font-bold text-slate-900 dark:text-white">
              {selectedProject ? `${selectedProject.engineFeeds.people.utilizationRate}% Load` : '87% Avg Load'}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {selectedProject ? selectedProject.engineFeeds.people.leadDesigner : `${portfolioRollup.totalStaffAllocated} Staff Ingested`}
            </span>
          </div>

          {/* Engine 7: Connect */}
          <div
            onClick={() => navigateToApp && navigateToApp('connect', 'CRM Dashboard')}
            className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-[#3b82f6] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black text-[#3b82f6] uppercase">Connect</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="font-bold text-slate-900 dark:text-white">
              {selectedProject ? `${selectedProject.engineFeeds.connect.clientSentimentScore}/100 CSAT` : '92/100 CSAT'}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {selectedProject ? `${selectedProject.engineFeeds.connect.approvalTurnaroundHours}h Sign-off` : 'Fast Client SLA'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Automations & Optimizations) + Right Column (Predictions & Neural Stream) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Automation Studio Hub */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#A0D6B422] flex items-center justify-center text-[#A0D6B4]">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Active Autonomous Automations
                </h3>
              </div>

              {onNavigatePage && (
                <button
                  onClick={() => onNavigatePage('Automation Page')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Configure Rules ({automations.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              {activeAutomationsList.slice(0, 3).map((rule) => (
                <div
                  key={rule.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white">{rule.name}</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-[#A0D6B4]">
                        {rule.category}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed line-clamp-1">
                      {rule.description}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold pt-1">
                      <span>Source: <strong className="text-slate-700 dark:text-slate-300">{rule.sourceEngine}</strong> → Target: <strong className="text-slate-700 dark:text-slate-300">{rule.targetEngine}</strong></span>
                      <span>•</span>
                      <span>{rule.executionCount} Runs</span>
                      <span>•</span>
                      <span>{rule.avgLatencyMs}ms</span>
                    </div>
                  </div>

                  <button
                    onClick={() => runAutomationNow(rule.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-[11px] flex items-center gap-1.5 shrink-0 shadow-sm hover:opacity-90 transition-all self-start sm:self-center"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run Now</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* High-Impact Value Engineering Optimizations */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  High-Impact Optimization Recommendations
                </h3>
              </div>

              {onNavigatePage && (
                <button
                  onClick={() => onNavigatePage('Optimization Page')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Explore All ({optimizations.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              {relevantOptimizations.slice(0, 3).map((opt) => (
                <div
                  key={opt.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white">{opt.title}</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {opt.engine}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                      {opt.description}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 pt-1">
                      {opt.impactSavingINR > 0 && (
                        <span className="text-emerald-600 dark:text-[#A0D6B4]">
                          Save {formatCurrency(opt.impactSavingINR)}
                        </span>
                      )}
                      {opt.impactTimeDays > 0 && (
                        <span className="text-purple-600 dark:text-purple-400">
                          +{opt.impactTimeDays} Days Schedule Recovery
                        </span>
                      )}
                      <span>•</span>
                      <span>Confidence: {opt.confidenceScore}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    {opt.status === 'Applied' ? (
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-[#A0D6B4] font-black text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Applied</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => applyOptimization(opt.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-[11px] shadow-sm hover:opacity-90 transition-all"
                      >
                        Apply AI Fix
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Predictive Risk & Outcome Radar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <Brain className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Predictive Outcome Radar
                </h3>
              </div>

              {onNavigatePage && (
                <button
                  onClick={() => onNavigatePage('Prediction Page')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Forecast Models</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-3 text-xs">
              {relevantPredictions.slice(0, 3).map((pred) => (
                <div
                  key={pred.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-white">{pred.title}</span>
                    <span
                      className={cn(
                        'text-[10px] font-black uppercase px-2 py-0.5 rounded',
                        pred.riskLevel === 'Low' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
                        pred.riskLevel === 'Moderate' && 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                        pred.riskLevel === 'High' && 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      )}
                    >
                      {pred.riskLevel} Risk
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {pred.summary}
                  </p>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-[10px] space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-400">Forecasted Value:</span>
                      <strong className="text-slate-900 dark:text-white">{pred.forecastValue}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Variance vs Baseline:</span>
                      <strong className="text-amber-500 font-bold">{pred.variance}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Confidence Interval:</span>
                      <strong className="text-emerald-600 dark:text-[#A0D6B4] font-bold">{pred.confidenceInterval}%</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-Time Neural Background Inference Telemetry Terminal */}
          <div className="bg-slate-950 text-white rounded-xl p-5 shadow-sm font-mono text-[11px] space-y-3 border border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#A0D6B4] animate-pulse" />
                <span className="text-xs font-bold text-slate-300">Neural Core Live Stream</span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">arqon-ai-v4</span>
            </div>

            <div className="space-y-2 text-slate-400">
              <p className="text-emerald-400">
                [00:00:12] Ingested 18 Studio spaces from CAD ledger PRJ-GHE-02... OK
              </p>
              <p className="text-slate-300">
                [00:00:28] Cost CPI 1.08 synchronized with purchase order commitments.
              </p>
              <p className="text-amber-400">
                [00:00:44] Flow critical path dependency check: 0 blockers detected in Villa Serene.
              </p>
              <p className="text-[#A0D6B4]">
                [00:01:05] Auto-optimization rule triggered: Value engineering recommendation posted.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>Model: Gemini 2.5 Pro Neural</span>
              <span className="text-emerald-400 font-bold">100% Ingestion Integrity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
