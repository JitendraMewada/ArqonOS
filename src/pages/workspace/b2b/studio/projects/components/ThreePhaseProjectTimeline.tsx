import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ExternalLink, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Sparkles, 
  SlidersHorizontal,
  Calendar,
  Hammer,
  Palette,
  Users
} from 'lucide-react';
import { 
  computeProjectTimeline, 
  ProjectMasterTimelineData, 
  saveStoredMasterEstimate, 
  getStoredMasterEstimate 
} from '../../utils/projectTimelineEngine';
import { cn } from '../../../../../../lib/utils';

interface ThreePhaseProjectTimelineProps {
  projectCode?: string;
  isEditing?: boolean;
  onNavigateToCost?: () => void;
}

export function ThreePhaseProjectTimeline({ 
  projectCode,
  isEditing = false,
  onNavigateToCost 
}: ThreePhaseProjectTimelineProps) {
  const [timelineData, setTimelineData] = useState<ProjectMasterTimelineData>(() => computeProjectTimeline());
  const [expandedPhase, setExpandedPhase] = useState<number | null>(3); // Default expand Phase 3 (Active execution)
  const [showQuickEditor, setShowQuickEditor] = useState(false);

  // Sync listener when cost line items update
  useEffect(() => {
    const handleUpdate = () => {
      setTimelineData(computeProjectTimeline());
    };

    window.addEventListener('arqon_estimate_progress_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('arqon_estimate_progress_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Quick trade progress update directly from Studio
  const handleQuickUpdateTradeProgress = (tradeCode: string, newProgress: number) => {
    const currentEstimate = getStoredMasterEstimate();
    const safeProgress = Math.min(100, Math.max(0, newProgress));

    const updatedRooms = currentEstimate.rooms.map(room => {
      const ann = room.annexures[tradeCode];
      if (!ann || !ann.items) return room;

      const updatedItems = ann.items.map(it => ({
        ...it,
        progressPercentage: safeProgress
      }));

      return {
        ...room,
        annexures: {
          ...room.annexures,
          [tradeCode]: {
            ...ann,
            items: updatedItems
          }
        }
      };
    });

    const updatedEstimate = {
      ...currentEstimate,
      rooms: updatedRooms
    };

    saveStoredMasterEstimate(updatedEstimate);
    setTimelineData(computeProjectTimeline(updatedEstimate));
  };

  const { phases, siteExecutionMetrics, overallProgressPercentage, overallDaysElapsed, overallDaysTotal } = timelineData;

  return (
    <div className="space-y-6">
      {/* =========================================================================
          MASTER TIMELINE OVERVIEW BANNER
          ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 3-Engine Lifecycle Matrix
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Connect → Studio → Cost
              </span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              Lifecycle Progress: <span className="text-orange-400">{overallProgressPercentage}%</span>
            </h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Consolidated lifecycle tracking spanning client acquisition in Connect, architectural design deliverables in Studio, and physical trade line-item progress in Cost.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/60 rounded-xl p-3 px-4 text-center min-w-[110px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Elapsed</span>
              <span className="text-lg font-black text-white">{overallDaysElapsed} <span className="text-xs text-slate-400 font-normal">days</span></span>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/60 rounded-xl p-3 px-4 text-center min-w-[110px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Duration</span>
              <span className="text-lg font-black text-white">{overallDaysTotal} <span className="text-xs text-slate-400 font-normal">days</span></span>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/60 rounded-xl p-3 px-4 text-center min-w-[120px]">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Site Execution</span>
              <span className="text-lg font-black text-emerald-400">{phases.execution.progressPercentage}% <span className="text-xs text-slate-400 font-normal">physical</span></span>
            </div>
          </div>
        </div>

        {/* Multi-Engine Progress Ribbon */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Phase 1: Connect Acquisition (100%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>Phase 2: Studio Design (100%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Phase 3: Cost Site Execution ({phases.execution.progressPercentage}%)</span>
            </div>
          </div>

          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-slate-700/50">
            {/* Phase 1 Segment (15% weight) */}
            <div 
              className="h-full bg-blue-500 rounded-l-full transition-all duration-700" 
              style={{ width: `${15 * (phases.acquisition.progressPercentage / 100)}%` }}
              title="Phase 1: Client Acquisition (100% complete)"
            />
            {/* Phase 2 Segment (25% weight) */}
            <div 
              className="h-full bg-orange-500 transition-all duration-700" 
              style={{ width: `${25 * (phases.design.progressPercentage / 100)}%` }}
              title="Phase 2: Design & Engineering (100% complete)"
            />
            {/* Phase 3 Segment (60% weight) */}
            <div 
              className="h-full bg-emerald-500 rounded-r-full transition-all duration-700" 
              style={{ width: `${60 * (phases.execution.progressPercentage / 100)}%` }}
              title={`Phase 3: Site Execution (${phases.execution.progressPercentage}% complete)`}
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          THE 3 PHASE CARDS
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PHASE 1: CONNECT CRM */}
        <div className={cn(
          "bg-white dark:bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-sm",
          expandedPhase === 1 
            ? "border-blue-500/60 ring-2 ring-blue-500/10 dark:border-blue-500/50" 
            : "border-slate-200 dark:border-slate-800 hover:border-blue-500/30"
        )}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
                <Users className="w-3 h-3" /> Phase 1 • Connect Engine
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Won
              </span>
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white">Client Acquisition</h4>
              <p className="text-xs text-slate-500 mt-0.5">{phases.acquisition.headlineMetric}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Acquisition Timeline</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono">100%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-full" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                <span>{phases.acquisition.startDate}</span>
                <span>{phases.acquisition.totalDays} Days</span>
                <span>{phases.acquisition.endDate}</span>
              </div>
            </div>

            {/* Deliverables Accordion */}
            {expandedPhase === 1 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Milestone Checklist</span>
                {phases.acquisition.deliverables.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      {d.name}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">100%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setExpandedPhase(expandedPhase === 1 ? null : 1)}
            className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 hover:text-blue-500 flex items-center justify-between w-full"
          >
            <span>{expandedPhase === 1 ? 'Hide Milestones' : 'View Milestones (4/4)'}</span>
            {expandedPhase === 1 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* PHASE 2: STUDIO ENGINE */}
        <div className={cn(
          "bg-white dark:bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-sm",
          expandedPhase === 2 
            ? "border-orange-500/60 ring-2 ring-orange-500/10 dark:border-orange-500/50" 
            : "border-slate-200 dark:border-slate-800 hover:border-orange-500/30"
        )}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center gap-1.5">
                <Palette className="w-3 h-3" /> Phase 2 • Studio Engine
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white">Design & Engineering</h4>
              <p className="text-xs text-slate-500 mt-0.5">{phases.design.headlineMetric}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Design Deliverables</span>
                <span className="text-orange-600 dark:text-orange-400 font-mono">100%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-full" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                <span>{phases.design.startDate}</span>
                <span>{phases.design.totalDays} Days</span>
                <span>{phases.design.endDate}</span>
              </div>
            </div>

            {/* Deliverables Accordion */}
            {expandedPhase === 2 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Deliverables Matrix</span>
                {phases.design.deliverables.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      {d.name}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">100%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setExpandedPhase(expandedPhase === 2 ? null : 2)}
            className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 hover:text-orange-500 flex items-center justify-between w-full"
          >
            <span>{expandedPhase === 2 ? 'Hide Deliverables' : 'View Deliverables (5/5)'}</span>
            {expandedPhase === 2 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* PHASE 3: COST ENGINE (SITE EXECUTION) */}
        <div className={cn(
          "bg-white dark:bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-sm",
          expandedPhase === 3 
            ? "border-emerald-500/60 ring-2 ring-emerald-500/10 dark:border-emerald-500/50" 
            : "border-slate-200 dark:border-slate-800 hover:border-emerald-500/30"
        )}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <Hammer className="w-3 h-3" /> Phase 3 • Cost Engine
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Active
              </span>
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white">Site Execution & Handover</h4>
              <p className="text-xs text-slate-500 mt-0.5">{phases.execution.headlineMetric}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">On-Site Completion</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-black">{phases.execution.progressPercentage}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-700" 
                  style={{ width: `${phases.execution.progressPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                <span>{phases.execution.startDate}</span>
                <span>{phases.execution.elapsedDays} / {phases.execution.totalDays} Days</span>
                <span>{phases.execution.endDate}</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Total Items</span>
                <span className="text-xs font-black font-mono text-slate-800 dark:text-slate-200">{siteExecutionMetrics.totalItems}</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">Done</span>
                <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">{siteExecutionMetrics.completedItems}</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10">
                <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase block">Active</span>
                <span className="text-xs font-black font-mono text-amber-600 dark:text-amber-400">{siteExecutionMetrics.inProgressItems}</span>
              </div>
            </div>

            {/* Trade breakdown accordion */}
            {expandedPhase === 3 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trade Annexures (10 Trades)</span>
                  <button 
                    onClick={() => setShowQuickEditor(!showQuickEditor)}
                    className="text-[10px] font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1"
                  >
                    <SlidersHorizontal className="w-3 h-3" /> {showQuickEditor ? 'Done Editing' : 'Quick Adjust'}
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto pr-1 space-y-2">
                  {siteExecutionMetrics.tradeWiseProgress.map(t => (
                    <div key={t.tradeCode} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          <span className="font-mono text-orange-500 mr-1">[{t.tradeCode}]</span> {t.tradeName}
                        </span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                          {t.averageProgress}%
                        </span>
                      </div>

                      {showQuickEditor ? (
                        <div className="flex items-center gap-3">
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={t.averageProgress}
                            onChange={(e) => handleQuickUpdateTradeProgress(t.tradeCode, parseInt(e.target.value) || 0)}
                            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                          />
                          <span className="text-[10px] font-mono text-slate-400 w-8 text-right">{t.averageProgress}%</span>
                        </div>
                      ) : (
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                            style={{ width: `${t.averageProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setExpandedPhase(expandedPhase === 3 ? null : 3)}
              className="text-xs font-bold text-slate-500 hover:text-emerald-500 flex items-center gap-1"
            >
              <span>{expandedPhase === 3 ? 'Hide Trades' : 'View Trades (10)'}</span>
              {expandedPhase === 3 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {onNavigateToCost && (
              <button
                onClick={onNavigateToCost}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold flex items-center gap-1 transition-all"
              >
                Cost BOQ <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
