import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  ProjectAiData,
  AiAutomationRule,
  AiPredictionModel,
  AiOptimizationSuggestion,
  AiNeuralCoreMetric,
  initialAiProjects,
  initialAiAutomations,
  initialAiPredictions,
  initialAiOptimizations,
  initialNeuralMetrics
} from './data/mockAiData';

interface AiContextType {
  projects: ProjectAiData[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  selectedProject: ProjectAiData | undefined;
  automations: AiAutomationRule[];
  toggleAutomation: (id: string) => void;
  runAutomationNow: (id: string) => void;
  addAutomation: (newRule: Partial<AiAutomationRule>) => void;
  predictions: AiPredictionModel[];
  optimizations: AiOptimizationSuggestion[];
  applyOptimization: (id: string) => void;
  dismissOptimization: (id: string) => void;
  neuralMetrics: AiNeuralCoreMetric;
  notificationMessage: string | null;
  dismissNotification: () => void;
  portfolioRollup: {
    totalBudget: number;
    totalActualSpend: number;
    totalCommittedPO: number;
    totalSpaces: number;
    totalOpenTasks: number;
    totalOverdueTasks: number;
    totalActiveVendors: number;
    totalStaffAllocated: number;
    portfolioHealthScore: number;
    totalValueEngineeringINR: number;
    preventedDelayDays: number;
    overallSpi: number;
    totalAutomationsActive: number;
  };
}

const AiContext = createContext<AiContextType | undefined>(undefined);

export function AiProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<ProjectAiData[]>(initialAiProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [automations, setAutomations] = useState<AiAutomationRule[]>(initialAiAutomations);
  const [predictions, setPredictions] = useState<AiPredictionModel[]>(initialAiPredictions);
  const [optimizations, setOptimizations] = useState<AiOptimizationSuggestion[]>(initialAiOptimizations);
  const [neuralMetrics, setNeuralMetrics] = useState<AiNeuralCoreMetric>(initialNeuralMetrics);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  const selectedProject = useMemo(() => {
    if (selectedProjectId === 'all') return undefined;
    return projects.find((p) => p.id === selectedProjectId);
  }, [projects, selectedProjectId]);

  // Toggle Automation Status
  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((auto) => {
        if (auto.id === id) {
          const newStatus = auto.status === 'Active' ? 'Paused' : 'Active';
          setNotificationMessage(`Automation "${auto.name}" is now ${newStatus}.`);
          return { ...auto, status: newStatus };
        }
        return auto;
      })
    );
  };

  // Run Automation Immediately
  const runAutomationNow = (id: string) => {
    setAutomations((prev) =>
      prev.map((auto) => {
        if (auto.id === id) {
          const updatedRuns = auto.executionCount + 1;
          setNotificationMessage(`Neural Execution Complete: "${auto.name}" executed successfully across target engine in ${auto.avgLatencyMs}ms.`);
          return {
            ...auto,
            executionCount: updatedRuns,
            lastTriggered: 'Just now'
          };
        }
        return auto;
      })
    );

    // Increment neural metrics
    setNeuralMetrics((prev) => ({
      ...prev,
      totalAutomationsRan24h: prev.totalAutomationsRan24h + 1
    }));
  };

  // Add Custom Automation
  const addAutomation = (newRule: Partial<AiAutomationRule>) => {
    const rule: AiAutomationRule = {
      id: `auto-${Date.now()}`,
      name: newRule.name || 'Custom Cross-Engine Smart Trigger',
      description: newRule.description || 'Custom neural trigger configured by AI Specialist.',
      sourceEngine: newRule.sourceEngine || 'Studio',
      targetEngine: newRule.targetEngine || 'Cost',
      triggerEvent: newRule.triggerEvent || 'Custom.Event.Triggered',
      actionTaken: newRule.actionTaken || 'Synthesize neural payload and execute target action.',
      status: 'Active',
      category: newRule.category || 'Workflow Acceleration',
      executionCount: 0,
      avgLatencyMs: 52,
      accuracyRate: 99.1,
      lastTriggered: 'Never',
      applicableProjectIds: newRule.applicableProjectIds || ['all'],
      isSystemCore: false
    };

    setAutomations((prev) => [rule, ...prev]);
    setNotificationMessage(`New Smart Automation Rule "${rule.name}" activated.`);
  };

  // Apply Optimization
  const applyOptimization = (id: string) => {
    setOptimizations((prev) =>
      prev.map((opt) => {
        if (opt.id === id) {
          setNotificationMessage(`Applied: "${opt.title}". Projected savings of ₹${opt.impactSavingINR.toLocaleString('en-IN')} and ${opt.impactTimeDays} days recovery locked.`);
          return { ...opt, status: 'Applied' };
        }
        return opt;
      })
    );

    // Update prevented cost overruns
    const target = optimizations.find((o) => o.id === id);
    if (target) {
      setNeuralMetrics((prev) => ({
        ...prev,
        preventedCostOverrunsINR: prev.preventedCostOverrunsINR + target.impactSavingINR,
        savedMilestoneDaysTotal: prev.savedMilestoneDaysTotal + target.impactTimeDays
      }));
    }
  };

  // Dismiss Optimization
  const dismissOptimization = (id: string) => {
    setOptimizations((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, status: 'Dismissed' } : opt))
    );
    setNotificationMessage('Optimization recommendation dismissed.');
  };

  const dismissNotification = () => setNotificationMessage(null);

  // Portfolio Rollup
  const portfolioRollup = useMemo(() => {
    const totalBudget = projects.reduce((acc, p) => acc + p.engineFeeds.cost.budget, 0);
    const totalActualSpend = projects.reduce((acc, p) => acc + p.engineFeeds.cost.actualSpend, 0);
    const totalCommittedPO = projects.reduce((acc, p) => acc + p.engineFeeds.cost.committedPO, 0);
    const totalSpaces = projects.reduce((acc, p) => acc + p.engineFeeds.studio.spacesCount, 0);
    const totalOpenTasks = projects.reduce((acc, p) => acc + p.engineFeeds.quest.openTasks, 0);
    const totalOverdueTasks = projects.reduce((acc, p) => acc + p.engineFeeds.quest.overdueTasks, 0);
    const totalActiveVendors = projects.reduce((acc, p) => acc + p.engineFeeds.vendor.activeVendors, 0);
    const totalStaffAllocated = projects.reduce((acc, p) => acc + p.engineFeeds.people.assignedStaff, 0);
    const portfolioHealthScore = Math.round(
      projects.reduce((acc, p) => acc + p.healthScore, 0) / (projects.length || 1)
    );
    const totalValueEngineeringINR = optimizations.reduce((acc, o) => acc + o.impactSavingINR, 0);
    const preventedDelayDays = optimizations.reduce((acc, o) => acc + o.impactTimeDays, 0);
    const overallSpi = Number(
      (projects.reduce((acc, p) => acc + p.engineFeeds.flow.spiIndex, 0) / (projects.length || 1)).toFixed(2)
    );
    const totalAutomationsActive = automations.filter((a) => a.status === 'Active').length;

    return {
      totalBudget,
      totalActualSpend,
      totalCommittedPO,
      totalSpaces,
      totalOpenTasks,
      totalOverdueTasks,
      totalActiveVendors,
      totalStaffAllocated,
      portfolioHealthScore,
      totalValueEngineeringINR,
      preventedDelayDays,
      overallSpi,
      totalAutomationsActive
    };
  }, [projects, optimizations, automations]);

  return (
    <AiContext.Provider
      value={{
        projects,
        selectedProjectId,
        setSelectedProjectId,
        selectedProject,
        automations,
        toggleAutomation,
        runAutomationNow,
        addAutomation,
        predictions,
        optimizations,
        applyOptimization,
        dismissOptimization,
        neuralMetrics,
        notificationMessage,
        dismissNotification,
        portfolioRollup
      }}
    >
      {children}
    </AiContext.Provider>
  );
}

export function useAi() {
  const context = useContext(AiContext);
  if (!context) {
    throw new Error('useAi must be used within an AiProvider');
  }
  return context;
}
