import React from 'react';
import {
  Activity,
  Sliders,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Brain,
  CheckCircle2,
  Calendar,
  Building2,
  DollarSign,
  Clock,
  Sparkles,
  RefreshCw,
  Zap,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useInsight } from './InsightContext';
import { cn } from '../../../../lib/utils';

export function InsightForecastPage() {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    whatIfScenario,
    setWhatIfScenario,
    resetScenario,
    simulatedMetrics,
    portfolioTotals,
    triggerExport
  } = useInsight();

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
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#A0D6B422] text-slate-800 dark:text-[#A0D6B4] border border-[#A0D6B444] text-xs font-black uppercase tracking-wider">
              Predictive AI & Scenario Modeling
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Monte Carlo & EVM Projections</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            Predictive Forecast & What-If Simulator
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            AI-driven margin trajectory, completion date confidence intervals, and dynamic sensitivity simulation.
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

          <button
            onClick={() => triggerExport('AI Forecast & Simulation Model', 'pdf')}
            className="px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-extrabold flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A0D6B4]" />
            <span>Export Forecast Model</span>
          </button>
        </div>
      </div>

      {/* Top AI Predictive Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase">AI Projected Final Margin</span>
          <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {portfolioTotals.portfolioGrossMarginPercent.toFixed(1)}%
          </h4>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            Confidence Interval: 91.4%
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase">Avg Schedule Variance</span>
          <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            +6.4 Days
          </h4>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Historical buffer absorption: 84%
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase">Procurement Price Risk</span>
          <h4 className="text-2xl font-black text-amber-500 mt-1">
            Low (1.2%)
          </h4>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Protected by locked MSAs & Rate Cards
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase">AI Savings Unlock</span>
          <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(portfolioTotals.aiTotalIdentifiedSavings)}
          </h4>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Value engineering & trade rebate recommendations
          </p>
        </div>
      </div>

      {/* Interactive What-If Scenario Modeler */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#94a3b81a] text-[#94a3b8] text-[10px] font-black uppercase">
                Interactive Sandbox
              </span>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                "What-If" Sensitivity Simulator
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate the impact of labor rate shifts, material price inflation, vendor delay, or scope additions in real time.
            </p>
          </div>

          <button
            onClick={resetScenario}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Baseline</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Slider 1: Material Inflation */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-200">Material Cost Inflation Rate</span>
                <span className="font-black text-[#94a3b8] text-sm">+{whatIfScenario.materialInflationPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={whatIfScenario.materialInflationPercent}
                onChange={(e) =>
                  setWhatIfScenario((prev) => ({ ...prev, materialInflationPercent: Number(e.target.value) }))
                }
                className="w-full accent-[#94a3b8] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                <span>0% (Baseline)</span>
                <span>+10% (Moderate Spike)</span>
                <span>+20% (Severe Spike)</span>
              </div>
            </div>

            {/* Slider 2: Vendor Delivery Delay */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-200">Subcontractor / Supply Chain Delay</span>
                <span className="font-black text-amber-500 text-sm">+{whatIfScenario.vendorDelayWeeks} Weeks</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                step="1"
                value={whatIfScenario.vendorDelayWeeks}
                onChange={(e) =>
                  setWhatIfScenario((prev) => ({ ...prev, vendorDelayWeeks: Number(e.target.value) }))
                }
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                <span>0 Wks (On Schedule)</span>
                <span>+3 Wks</span>
                <span>+6 Wks (Port Transit Delay)</span>
              </div>
            </div>

            {/* Slider 3: Labor Cost Multiplier */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-200">Site Labor & Subcontractor Wage Adjustment</span>
                <span className="font-black text-purple-500 text-sm">{(whatIfScenario.laborCostMultiplier * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.9"
                max="1.3"
                step="0.05"
                value={whatIfScenario.laborCostMultiplier}
                onChange={(e) =>
                  setWhatIfScenario((prev) => ({ ...prev, laborCostMultiplier: Number(e.target.value) }))
                }
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                <span>-10% Efficiency</span>
                <span>100% (Standard Rates)</span>
                <span>+30% Premium Overtime</span>
              </div>
            </div>

            {/* Input 4: Client Scope Addition Value */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-200">Approved Change Order / Scope Addition (₹)</span>
                <span className="font-black text-emerald-600 text-sm">{formatCurrency(whatIfScenario.scopeAdditionValue)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="3000000"
                step="250000"
                value={whatIfScenario.scopeAdditionValue}
                onChange={(e) =>
                  setWhatIfScenario((prev) => ({ ...prev, scopeAdditionValue: Number(e.target.value) }))
                }
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                <span>₹0 (Fixed Scope)</span>
                <span>+ ₹15 Lakhs</span>
                <span>+ ₹30 Lakhs (Add-on Terrace/Spa)</span>
              </div>
            </div>
          </div>

          {/* Results Summary Column (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-xl p-5 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Simulated Impact Analysis
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#94a3b833] text-[#94a3b8]">
                  Live Calculation
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] text-slate-400 font-bold block uppercase">Adjusted Gross Profit Margin</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-white">
                      {simulatedMetrics.adjustedGrossMarginPercent}%
                    </span>
                    <span className={cn(
                      "text-xs font-black",
                      simulatedMetrics.marginDelta >= 0 ? "text-emerald-400" : "text-rose-400"
                    )}>
                      {simulatedMetrics.marginDelta >= 0 ? `+${simulatedMetrics.marginDelta}%` : `${simulatedMetrics.marginDelta}%`} vs Base
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 font-bold block uppercase">Adjusted Projected Site Cost</span>
                  <span className="text-xl font-black text-slate-200 mt-1 block">
                    {formatCurrency(simulatedMetrics.adjustedProjectedCost)}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 font-bold block uppercase">Net Projected Handover Slippage</span>
                  <span className={cn(
                    "text-lg font-black mt-0.5 block",
                    simulatedMetrics.adjustedDelayDays <= 5 ? "text-emerald-400" :
                    simulatedMetrics.adjustedDelayDays <= 15 ? "text-amber-400" : "text-rose-400"
                  )}>
                    +{simulatedMetrics.adjustedDelayDays} Calendar Days
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 font-bold block uppercase">Net Gross Profit Realization</span>
                  <span className="text-xl font-black text-emerald-400 mt-1 block">
                    {formatCurrency(simulatedMetrics.adjustedGrossProfit)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Model: Stochastic Sensitivity</span>
              <button
                onClick={() => triggerExport('What-If Scenario Simulation', 'pdf')}
                className="px-3.5 py-1.5 rounded-lg bg-white text-slate-900 font-black hover:bg-slate-100 transition-colors"
              >
                Save Simulation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Completion Predictor Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          AI Target vs Forecasted Handover Timeline by Project
        </h3>

        <div className="space-y-3">
          {targetProjects.map((p) => (
            <div key={p.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">{p.name}</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {p.code}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>Contract Target: <strong>{p.targetEndDate}</strong></span>
                  <span>•</span>
                  <span>AI Forecast: <strong className={p.aiPredictedDelayDays > 0 ? 'text-amber-500' : 'text-emerald-600'}>{p.forecastedEndDate}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <span className={cn(
                  "px-2.5 py-1 rounded",
                  p.aiPredictedDelayDays <= 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" :
                  p.aiPredictedDelayDays <= 14 ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" :
                  "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                )}>
                  {p.aiPredictedDelayDays <= 0 ? 'Ahead of Schedule' : `+${p.aiPredictedDelayDays} Days Variance`}
                </span>
                <span className="text-slate-500">
                  {p.confidenceScore}% Confidence
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
