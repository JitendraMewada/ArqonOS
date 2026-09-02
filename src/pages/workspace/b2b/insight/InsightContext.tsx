import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  ProjectInsight,
  EngineCrossStream,
  MonthlyFinancialTrend,
  DepartmentProductivity,
  AIAnomalyAlert,
  WhatIfScenarioInput,
  InsightReportTemplate,
  INITIAL_PROJECT_INSIGHTS,
  CROSS_ENGINE_STREAMS,
  MONTHLY_FINANCIAL_TRENDS,
  DEPARTMENT_PRODUCTIVITY_DATA,
  INITIAL_AI_ANOMALIES,
  INSIGHT_REPORT_TEMPLATES
} from './data/mockInsightData';

export interface PortfolioTotals {
  totalContractValue: number;
  totalInvoiced: number;
  totalCollected: number;
  totalReceivables: number;
  totalAllocatedBudget: number;
  totalActualCost: number;
  totalCommittedPO: number;
  totalProjectedCost: number;
  portfolioGrossMargin: number;
  portfolioGrossMarginPercent: number;
  averageCPI: number;
  averageSPI: number;
  totalActiveProjects: number;
  totalActiveSpaces: number;
  totalSqFtManaged: number;
  totalActiveVendors: number;
  avgDeliveryOnTimeRate: number;
  avgClientSatisfaction: number;
  totalTeamMembers: number;
  avgStudioUtilization: number;
  criticalPathRisksCount: number;
  aiTotalIdentifiedSavings: number;
}

interface InsightContextType {
  projects: ProjectInsight[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  selectedProject: ProjectInsight | null;
  dateRange: 'Last 30 Days' | 'This Quarter' | 'YTD' | 'All Time';
  setDateRange: (range: 'Last 30 Days' | 'This Quarter' | 'YTD' | 'All Time') => void;
  engineStreams: EngineCrossStream[];
  monthlyTrends: MonthlyFinancialTrend[];
  departmentProductivity: DepartmentProductivity[];
  anomalies: AIAnomalyAlert[];
  resolveAnomaly: (id: string) => void;
  reportTemplates: InsightReportTemplate[];
  activeGeneratedReport: { report: InsightReportTemplate; format: string } | null;
  setActiveGeneratedReport: (val: { report: InsightReportTemplate; format: string } | null) => void;
  whatIfScenario: WhatIfScenarioInput;
  setWhatIfScenario: React.Dispatch<React.SetStateAction<WhatIfScenarioInput>>;
  resetScenario: () => void;
  simulatedMetrics: {
    adjustedGrossMarginPercent: number;
    adjustedProjectedCost: number;
    adjustedDelayDays: number;
    adjustedGrossProfit: number;
    marginDelta: number;
  };
  portfolioTotals: PortfolioTotals;
  exportNotification: string | null;
  triggerExport: (name: string, format: string) => void;
}

const InsightContext = createContext<InsightContextType | undefined>(undefined);

export const InsightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects] = useState<ProjectInsight[]>(INITIAL_PROJECT_INSIGHTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'Last 30 Days' | 'This Quarter' | 'YTD' | 'All Time'>('YTD');
  const [engineStreams] = useState<EngineCrossStream[]>(CROSS_ENGINE_STREAMS);
  const [monthlyTrends] = useState<MonthlyFinancialTrend[]>(MONTHLY_FINANCIAL_TRENDS);
  const [departmentProductivity] = useState<DepartmentProductivity[]>(DEPARTMENT_PRODUCTIVITY_DATA);
  const [anomalies, setAnomalies] = useState<AIAnomalyAlert[]>(INITIAL_AI_ANOMALIES);
  const [reportTemplates] = useState<InsightReportTemplate[]>(INSIGHT_REPORT_TEMPLATES);
  const [activeGeneratedReport, setActiveGeneratedReport] = useState<{ report: InsightReportTemplate; format: string } | null>(null);
  const [exportNotification, setExportNotification] = useState<string | null>(null);

  const [whatIfScenario, setWhatIfScenario] = useState<WhatIfScenarioInput>({
    laborCostMultiplier: 1.0,
    materialInflationPercent: 0,
    vendorDelayWeeks: 0,
    scopeAdditionValue: 0,
    accelerationOvertimeHours: 0
  });

  const resetScenario = () => {
    setWhatIfScenario({
      laborCostMultiplier: 1.0,
      materialInflationPercent: 0,
      vendorDelayWeeks: 0,
      scopeAdditionValue: 0,
      accelerationOvertimeHours: 0
    });
  };

  const selectedProject = useMemo(() => {
    if (selectedProjectId === 'all') return null;
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  // Aggregate Portfolio Totals
  const portfolioTotals = useMemo<PortfolioTotals>(() => {
    const targetProjects = selectedProject ? [selectedProject] : projects;

    const totalContractValue = targetProjects.reduce((acc, p) => acc + p.contractValue, 0);
    const totalInvoiced = targetProjects.reduce((acc, p) => acc + p.invoicedAmount, 0);
    const totalCollected = targetProjects.reduce((acc, p) => acc + p.collectedAmount, 0);
    const totalReceivables = targetProjects.reduce((acc, p) => acc + p.receivables, 0);
    const totalAllocatedBudget = targetProjects.reduce((acc, p) => acc + p.allocatedBudget, 0);
    const totalActualCost = targetProjects.reduce((acc, p) => acc + p.actualCostToDate, 0);
    const totalCommittedPO = targetProjects.reduce((acc, p) => acc + p.committedPOCost, 0);
    const totalProjectedCost = targetProjects.reduce((acc, p) => acc + p.projectedCostAtCompletion, 0);

    const portfolioGrossMargin = totalContractValue - totalProjectedCost;
    const portfolioGrossMarginPercent = totalContractValue > 0 ? (portfolioGrossMargin / totalContractValue) * 100 : 0;

    const averageCPI = targetProjects.reduce((acc, p) => acc + p.costPerformanceIndex, 0) / targetProjects.length;
    const averageSPI = targetProjects.reduce((acc, p) => acc + p.schedulePerformanceIndex, 0) / targetProjects.length;

    const totalActiveProjects = targetProjects.length;
    const totalActiveSpaces = targetProjects.reduce((acc, p) => acc + p.spacesCount, 0);
    const totalSqFtManaged = targetProjects.reduce((acc, p) => acc + p.areaSqFt, 0);
    const totalActiveVendors = targetProjects.reduce((acc, p) => acc + p.activeVendorsCount, 0);
    const avgDeliveryOnTimeRate = targetProjects.reduce((acc, p) => acc + p.materialDeliveryOnTimeRate, 0) / targetProjects.length;
    const avgClientSatisfaction = targetProjects.reduce((acc, p) => acc + p.clientSatisfaction, 0) / targetProjects.length;
    const totalTeamMembers = targetProjects.reduce((acc, p) => acc + p.allocatedTeamSize, 0);
    const avgStudioUtilization = targetProjects.reduce((acc, p) => acc + p.utilizationRate, 0) / targetProjects.length;
    const criticalPathRisksCount = targetProjects.filter((p) => p.criticalPathRisk === 'High' || p.criticalPathRisk === 'Critical').length;
    const aiTotalIdentifiedSavings = targetProjects.reduce((acc, p) => acc + p.aiSuggestedSavingsOpportunity, 0);

    return {
      totalContractValue,
      totalInvoiced,
      totalCollected,
      totalReceivables,
      totalAllocatedBudget,
      totalActualCost,
      totalCommittedPO,
      totalProjectedCost,
      portfolioGrossMargin,
      portfolioGrossMarginPercent,
      averageCPI: Number(averageCPI.toFixed(2)),
      averageSPI: Number(averageSPI.toFixed(2)),
      totalActiveProjects,
      totalActiveSpaces,
      totalSqFtManaged,
      totalActiveVendors,
      avgDeliveryOnTimeRate: Number(avgDeliveryOnTimeRate.toFixed(1)),
      avgClientSatisfaction: Number(avgClientSatisfaction.toFixed(1)),
      totalTeamMembers,
      avgStudioUtilization: Number(avgStudioUtilization.toFixed(1)),
      criticalPathRisksCount,
      aiTotalIdentifiedSavings
    };
  }, [projects, selectedProject]);

  // Scenario Simulator Calculation
  const simulatedMetrics = useMemo(() => {
    const baseRevenue = portfolioTotals.totalContractValue + whatIfScenario.scopeAdditionValue;
    const laborImpact = (portfolioTotals.totalActualCost * 0.35) * (whatIfScenario.laborCostMultiplier - 1.0);
    const materialImpact = (portfolioTotals.totalCommittedPO * 0.65) * (whatIfScenario.materialInflationPercent / 100);
    const overtimeCost = whatIfScenario.accelerationOvertimeHours * 2400; // ₹2400 per blended overtime hr

    const adjustedProjectedCost = portfolioTotals.totalProjectedCost + laborImpact + materialImpact + overtimeCost + (whatIfScenario.scopeAdditionValue * 0.7);
    const adjustedGrossProfit = baseRevenue - adjustedProjectedCost;
    const adjustedGrossMarginPercent = baseRevenue > 0 ? (adjustedGrossProfit / baseRevenue) * 100 : 0;
    const marginDelta = adjustedGrossMarginPercent - portfolioTotals.portfolioGrossMarginPercent;

    // Delay Days Calculation
    const baselineDelay = selectedProject ? selectedProject.aiPredictedDelayDays : 8;
    const delayFromVendors = whatIfScenario.vendorDelayWeeks * 7;
    const delayMitigatedByAcceleration = Math.floor(whatIfScenario.accelerationOvertimeHours / 8);
    const adjustedDelayDays = Math.max(0, baselineDelay + delayFromVendors - delayMitigatedByAcceleration);

    return {
      adjustedGrossMarginPercent: Number(adjustedGrossMarginPercent.toFixed(2)),
      adjustedProjectedCost: Math.round(adjustedProjectedCost),
      adjustedDelayDays,
      adjustedGrossProfit: Math.round(adjustedGrossProfit),
      marginDelta: Number(marginDelta.toFixed(2))
    };
  }, [portfolioTotals, selectedProject, whatIfScenario]);

  const resolveAnomaly = (id: string) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isResolved: true } : a))
    );
  };

  const triggerExport = (name: string, format: string) => {
    setExportNotification(`Generating & compiling "${name}" in ${format.toUpperCase()} format with live engine sync...`);
    setTimeout(() => {
      setExportNotification(null);
    }, 4000);
  };

  return (
    <InsightContext.Provider
      value={{
        projects,
        selectedProjectId,
        setSelectedProjectId,
        selectedProject,
        dateRange,
        setDateRange,
        engineStreams,
        monthlyTrends,
        departmentProductivity,
        anomalies,
        resolveAnomaly,
        reportTemplates,
        activeGeneratedReport,
        setActiveGeneratedReport,
        whatIfScenario,
        setWhatIfScenario,
        resetScenario,
        simulatedMetrics,
        portfolioTotals,
        exportNotification,
        triggerExport
      }}
    >
      {children}
    </InsightContext.Provider>
  );
};

export const useInsight = () => {
  const context = useContext(InsightContext);
  if (!context) {
    throw new Error('useInsight must be used within an InsightProvider');
  }
  return context;
};
