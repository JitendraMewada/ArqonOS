import React, { useState } from 'react';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building2,
  DollarSign,
  Clock,
  Sparkles,
  RefreshCw,
  Zap,
  ShieldAlert,
  ArrowRight,
  Sliders,
  Filter,
  Search
} from 'lucide-react';
import { useAi } from './AiContext';
import { AiPredictionModel } from './data/mockAiData';
import { cn } from '../../../../lib/utils';

export function AiPredictionPage() {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    predictions,
    portfolioRollup
  } = useAi();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [laborVelocityFactor, setLaborVelocityFactor] = useState(1.0);
  const [supplyDelayWeeks, setSupplyDelayWeeks] = useState(0);
  const [mitigationMessage, setMitigationMessage] = useState<string | null>(null);

  const filteredPredictions = predictions.filter((pred) => {
    const matchesCategory = categoryFilter === 'All' || pred.category === categoryFilter;
    const matchesSearch =
      pred.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pred.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pred.targetScope.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject =
      selectedProjectId === 'all' ||
      pred.projectId === 'all' ||
      pred.projectId === selectedProjectId;

    return matchesCategory && matchesSearch && matchesProject;
  });

  const handleMitigate = (predTitle: string, mitigation: string) => {
    setMitigationMessage(`Mitigation action initiated for "${predTitle}": ${mitigation}`);
    setTimeout(() => {
      setMitigationMessage(null);
    }, 6000);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-300 overflow-y-auto pr-1 text-left">
      {/* Toast Notification */}
      {mitigationMessage && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white border border-[#A0D6B4]/30 shadow-lg flex items-center justify-between text-xs animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{mitigationMessage}</span>
          </div>
          <button
            onClick={() => setMitigationMessage(null)}
            className="text-slate-400 hover:text-white text-xs font-bold ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#A0D6B422] text-slate-800 dark:text-[#A0D6B4] border border-[#A0D6B444] text-xs font-black uppercase tracking-wider">
              Outcome Prediction Laboratory
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Stochastic Forecasting & Risk Radar</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            Predictive Models & Handover Forecasts
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Monte Carlo completion date estimates, trade velocity risks, material inflation trajectories, and variation order impacts.
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
              <option value="all">Portfolio View (All Projects — {projects.length} Active Project{projects.length === 1 ? '' : 's'})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Top Predictive Summary Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase">Avg Forecast Confidence</span>
          <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            93.8%
          </h4>
          <p className="text-xs text-emerald-600 dark:text-[#A0D6B4] font-semibold mt-1">
            Validated against historical 1998–2026 logs
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase">Schedule Trajectory</span>
          <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {selectedProject
              ? selectedProject.aiForecast.predictedDelayDays <= 0
                ? `${Math.abs(selectedProject.aiForecast.predictedDelayDays)} Days Early`
                : `+${selectedProject.aiForecast.predictedDelayDays} Days Variance`
              : '+2.4 Days Portfolio Avg'}
          </h4>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Buffer float absorption: 78%
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase">Supply Chain Price Risk</span>
          <h4 className="text-2xl font-black text-amber-500 mt-1">
            Low (1.4%)
          </h4>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Protected by locked MSAs & Rate Cards
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase">Client Sentiment Risk</span>
          <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            Minimal (94/100)
          </h4>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Proactive milestone reporting active
          </p>
        </div>
      </div>

      {/* Interactive Quick Simulation Sliders */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#A0D6B422] flex items-center justify-center text-[#A0D6B4]">
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Interactive Forecast Sensitivity Sandbox
            </h3>
          </div>
          <button
            onClick={() => {
              setLaborVelocityFactor(1.0);
              setSupplyDelayWeeks(0);
            }}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Factors</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Slider 1 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-1.5 font-bold">
              <span className="text-slate-700 dark:text-slate-200">Site Labor & Subcontractor Velocity Factor</span>
              <span className="text-[#A0D6B4] font-black text-sm">{(laborVelocityFactor * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.05"
              value={laborVelocityFactor}
              onChange={(e) => setLaborVelocityFactor(Number(e.target.value))}
              className="w-full accent-[#A0D6B4] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
              <span>70% (Site Slowdown)</span>
              <span>100% (Baseline Velocity)</span>
              <span>130% (Overtime Acceleration)</span>
            </div>
          </div>

          {/* Slider 2 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-1.5 font-bold">
              <span className="text-slate-700 dark:text-slate-200">Custom Import / Port Delay Buffer</span>
              <span className="text-amber-500 font-black text-sm">+{supplyDelayWeeks} Weeks</span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={supplyDelayWeeks}
              onChange={(e) => setSupplyDelayWeeks(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
              <span>0 Wks (Direct Warehouse)</span>
              <span>+3 Wks (Customs Inspection)</span>
              <span>+6 Wks (Ocean Freight Congestion)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search forecast models, risks, projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#A0D6B4] text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Schedule & Handover', 'Cost & Margins', 'Supply Chain Risk'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                categoryFilter === cat
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPredictions.map((pred) => (
          <div
            key={pred.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:border-[#A0D6B4]/60 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {pred.category}
                </span>
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

              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {pred.title}
              </h3>
              <span className="text-[11px] font-bold text-[#A0D6B4] block mt-0.5">
                Target Scope: {pred.targetScope}
              </span>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {pred.summary}
              </p>

              {/* Data Values Comparison */}
              <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Baseline Target</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 mt-0.5 block">{pred.baselineValue}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">AI Forecast</span>
                  <span className="font-black text-slate-900 dark:text-white mt-0.5 block">{pred.forecastValue}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Variance</span>
                  <span className="font-black text-amber-500 mt-0.5 block">{pred.variance}</span>
                </div>
              </div>

              {/* Root Causes */}
              <div className="mt-3 text-xs space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  Key Contributing Factors:
                </span>
                {pred.rootCauses.map((cause, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1 shrink-0" />
                    <span>{cause}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended AI Mitigation Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <div className="text-xs p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/40 dark:border-emerald-900/30 text-slate-700 dark:text-slate-300">
                <strong className="text-emerald-700 dark:text-[#A0D6B4] block text-[11px] mb-0.5">
                  AI Prescribed Mitigation:
                </strong>
                <span className="text-[11px] leading-relaxed">{pred.recommendedMitigation}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400 font-semibold">
                  Confidence: {pred.confidenceInterval}% • Refreshed {pred.lastUpdated}
                </span>

                <button
                  onClick={() => handleMitigate(pred.title, pred.recommendedMitigation)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-[11px] shadow-sm hover:opacity-90 transition-all flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#A0D6B4]" />
                  <span>Execute Mitigation</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
