import React from 'react';

export interface ProjectAiData {
  id: string;
  code: string;
  name: string;
  clientName: string;
  type: 'Luxury Residential' | 'Commercial Office' | 'Hospitality' | 'Retail' | 'Heritage Villa';
  areaSqFt: number;
  startDate: string;
  targetEndDate: string;
  forecastedEndDate: string;
  status: 'In Progress' | 'Design Phase' | 'Site Execution' | 'Finishing & Handover' | 'On Hold';
  completionPercentage: number;
  healthScore: number; // 0-100

  // Ingested Cross-Engine Data Points:
  engineFeeds: {
    studio: {
      spacesCount: number;
      approvedDrawings: number;
      pendingRevisions: number;
      boqGenerated: boolean;
      materialPaletteStatus: 'Locked' | 'Review Required' | 'Draft';
      lastModelSync: string;
    };
    cost: {
      budget: number;
      actualSpend: number;
      committedPO: number;
      projectedVariance: number;
      marginHealth: number; // %
      unapprovedVariationClaims: number;
    };
    flow: {
      activeWorkflows: number;
      criticalPathTasks: number;
      stageDelayRisk: 'Low' | 'Medium' | 'High' | 'Severe';
      spiIndex: number;
      completedMilestones: number;
      totalMilestones: number;
    };
    quest: {
      openTasks: number;
      overdueTasks: number;
      blockersReported: number;
      dailyChatActivity: number;
      upcomingDeadlines7Days: number;
    };
    vendor: {
      activeVendors: number;
      onTimeDeliveryRate: number; // %
      flaggedRateDiscrepancies: number;
      openPurchaseOrders: number;
      portClearancePending: number;
    };
    people: {
      assignedStaff: number;
      utilizationRate: number; // %
      burnoutRiskTeam: string | null;
      leadDesigner: string;
      siteManager: string;
    };
    connect: {
      clientSentimentScore: number; // 1-100
      changeRequestsPending: number;
      approvalTurnaroundHours: number;
      paymentDueDays: number;
    };
  };

  // AI Predictive Synthesis for this Project:
  aiForecast: {
    predictedDelayDays: number;
    confidenceScore: number; // %
    predictedBudgetVariance: number;
    marginRiskFactor: 'Safe' | 'Moderate Risk' | 'High Risk' | 'Critical';
    topPredictedRisk: string;
    valueEngineeringPotential: number; // ₹ savings
  };
}

export interface AiAutomationRule {
  id: string;
  name: string;
  description: string;
  sourceEngine: 'Studio' | 'Cost' | 'Flow' | 'Quest' | 'Vendor' | 'People' | 'Connect';
  targetEngine: 'Studio' | 'Cost' | 'Flow' | 'Quest' | 'Vendor' | 'People' | 'Connect';
  triggerEvent: string;
  actionTaken: string;
  status: 'Active' | 'Paused' | 'Testing';
  category: 'Quality Assurance' | 'Financial Control' | 'Workflow Acceleration' | 'Client Comm' | 'Resource Balancing';
  executionCount: number;
  avgLatencyMs: number;
  accuracyRate: number; // %
  lastTriggered: string;
  applicableProjectIds: string[]; // 'all' or specific IDs
  isSystemCore: boolean;
}

export interface AiPredictionModel {
  id: string;
  title: string;
  category: 'Schedule & Handover' | 'Cost & Margins' | 'Supply Chain Risk' | 'Client Sentiment' | 'Space Feasibility';
  targetScope: string; // Project Name or 'Entire Portfolio'
  projectId: string; // 'all' or ID
  forecastValue: string;
  baselineValue: string;
  variance: string;
  confidenceInterval: number; // %
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  summary: string;
  rootCauses: string[];
  recommendedMitigation: string;
  lastUpdated: string;
}

export interface AiOptimizationSuggestion {
  id: string;
  title: string;
  engine: 'Studio' | 'Cost' | 'Flow' | 'Quest' | 'Vendor' | 'People' | 'Connect';
  category: 'Value Engineering' | 'Schedule Compression' | 'Procurement Synergy' | 'Resource Rebalancing';
  projectId: string;
  projectName: string;
  impactSavingINR: number;
  impactTimeDays: number;
  confidenceScore: number; // %
  description: string;
  actionSummary: string;
  status: 'Pending Review' | 'Applied' | 'Dismissed';
  priority: 'Urgent' | 'High' | 'Medium';
}

export interface AiNeuralCoreMetric {
  activeModels: number;
  totalAutomationsRan24h: number;
  averageInferenceLatencyMs: number;
  systemAccuracyScore: number; // %
  crossEngineDataIngestionRatePerSec: number;
  preventedCostOverrunsINR: number;
  savedMilestoneDaysTotal: number;
  neuralHealthStatus: 'Optimal' | 'Calibrating' | 'High Load';
}

// Mock Projects Data
export const initialAiProjects: ProjectAiData[] = [
  {
    id: 'proj-goldmine',
    code: 'demo-arq-001',
    name: 'Demo Project',
    clientName: 'Demo Client',
    type: 'Luxury Residential',
    areaSqFt: 1794,
    startDate: '2026-05-01',
    targetEndDate: '2026-11-30',
    forecastedEndDate: '2026-11-20',
    status: 'Site Execution',
    completionPercentage: 65,
    healthScore: 95,
    engineFeeds: {
      studio: {
        spacesCount: 8,
        approvedDrawings: 28,
        pendingRevisions: 0,
        boqGenerated: true,
        materialPaletteStatus: 'Locked',
        lastModelSync: '5 mins ago'
      },
      cost: {
        budget: 9785823,
        actualSpend: 4892911,
        committedPO: 2800000,
        projectedVariance: 535823,
        marginHealth: 32.5,
        unapprovedVariationClaims: 0
      },
      flow: {
        activeWorkflows: 4,
        criticalPathTasks: 8,
        stageDelayRisk: 'Low',
        spiIndex: 1.05,
        completedMilestones: 6,
        totalMilestones: 10
      },
      quest: {
        openTasks: 18,
        overdueTasks: 0,
        blockersReported: 0,
        dailyChatActivity: 36,
        upcomingDeadlines7Days: 4
      },
      vendor: {
        activeVendors: 6,
        onTimeDeliveryRate: 97.5,
        flaggedRateDiscrepancies: 0,
        openPurchaseOrders: 3,
        portClearancePending: 0
      },
      people: {
        assignedStaff: 8,
        utilizationRate: 91,
        burnoutRiskTeam: null,
        leadDesigner: 'Jitendra Mewada',
        siteManager: 'Vikram Mehta'
      },
      connect: {
        clientSentimentScore: 98,
        changeRequestsPending: 0,
        approvalTurnaroundHours: 2.5,
        paymentDueDays: 0
      }
    },
    aiForecast: {
      predictedDelayDays: -10, // 10 days ahead
      confidenceScore: 96.5,
      predictedBudgetVariance: 535823,
      marginRiskFactor: 'Safe',
      topPredictedRisk: 'Italian marble custom waterjet cutting layout verified and cleared with zero scrap loss.',
      valueEngineeringPotential: 345000
    }
  }
];

// Initial Smart Automation Rules
export const initialAiAutomations: AiAutomationRule[] = [
  {
    id: 'auto-01',
    name: 'Auto-BOQ Generation & Cost Locking',
    description: 'When Studio room dimensions and finishes are marked "Approved" by Lead Designer, automatically compile detailed BOQ line items and ingest into Cost module.',
    sourceEngine: 'Studio',
    targetEngine: 'Cost',
    triggerEvent: 'Studio.Space.DesignApproved',
    actionTaken: 'Compile BOQ line items, query locked vendor rate cards, and create initial Cost Budget Baseline.',
    status: 'Active',
    category: 'Financial Control',
    executionCount: 142,
    avgLatencyMs: 84,
    accuracyRate: 99.4,
    lastTriggered: '12 mins ago',
    applicableProjectIds: ['all'],
    isSystemCore: true
  },
  {
    id: 'auto-02',
    name: 'Critical Path Slip Auto-Escalation & Task Rebalance',
    description: 'When any Flow milestone on the Critical Path slips by ≥3 days, auto-generate high-priority mitigation tasks in Quest and notify the Project Lead.',
    sourceEngine: 'Flow',
    targetEngine: 'Quest',
    triggerEvent: 'Flow.CriticalPath.DelayDetected',
    actionTaken: 'Inject priority task in Quest, flag assignee, and re-calculate downstream milestone float.',
    status: 'Active',
    category: 'Workflow Acceleration',
    executionCount: 38,
    avgLatencyMs: 42,
    accuracyRate: 98.1,
    lastTriggered: '2 hours ago',
    applicableProjectIds: ['all'],
    isSystemCore: true
  },
  {
    id: 'auto-03',
    name: 'Subcontractor Rate Variance & PO Gatekeeper',
    description: 'Automatically intercepts any Vendor Purchase Order that deviates by >3% from the approved Master Rate Card and blocks approval pending Estimator sign-off.',
    sourceEngine: 'Vendor',
    targetEngine: 'Cost',
    triggerEvent: 'Vendor.PO.PriceDiscrepancy',
    actionTaken: 'Hold PO status at "AI Audit Hold", attach comparison ledger, notify Finance Lead in Quest.',
    status: 'Active',
    category: 'Financial Control',
    executionCount: 96,
    avgLatencyMs: 35,
    accuracyRate: 100.0,
    lastTriggered: '5 hours ago',
    applicableProjectIds: ['all'],
    isSystemCore: true
  },
  {
    id: 'auto-04',
    name: 'Space Finish Modification Material Alert',
    description: 'When a Studio wall or floor finish is edited in revision mode, cross-reference inventory in Vendor engine and update Cost variation reserve.',
    sourceEngine: 'Studio',
    targetEngine: 'Vendor',
    triggerEvent: 'Studio.Space.FinishUpdated',
    actionTaken: 'Check active PO inventory, calculate material difference, post variation note in Cost.',
    status: 'Active',
    category: 'Quality Assurance',
    executionCount: 64,
    avgLatencyMs: 110,
    accuracyRate: 97.8,
    lastTriggered: 'Yesterday, 18:30',
    applicableProjectIds: ['all'],
    isSystemCore: false
  },
  {
    id: 'auto-05',
    name: 'Client Milestone AI Executive Summary Generator',
    description: 'When Flow milestone status changes to "Completed", draft a plain-English, photo-linked progress briefing for Connect CRM client portal.',
    sourceEngine: 'Flow',
    targetEngine: 'Connect',
    triggerEvent: 'Flow.Milestone.Completed',
    actionTaken: 'Synthesize site photos, verified quality checks, and next-week lookahead into client email draft.',
    status: 'Active',
    category: 'Client Comm',
    executionCount: 52,
    avgLatencyMs: 320,
    accuracyRate: 99.0,
    lastTriggered: 'Today, 09:15',
    applicableProjectIds: ['all'],
    isSystemCore: false
  },
  {
    id: 'auto-06',
    name: 'Drafting Team Capacity Auto-Rebalancer',
    description: 'Monitors People workload: if 3D / Drafting team exceeds 95% utilization, routes new drawing requests to external vetted studio partners.',
    sourceEngine: 'People',
    targetEngine: 'Studio',
    triggerEvent: 'People.Workload.OverCapacity',
    actionTaken: 'Suggest partner drafting allocation in Quest and flag potential burnout in People dashboard.',
    status: 'Paused',
    category: 'Resource Balancing',
    executionCount: 19,
    avgLatencyMs: 65,
    accuracyRate: 94.2,
    lastTriggered: '3 days ago',
    applicableProjectIds: ['proj-02', 'proj-04'],
    isSystemCore: false
  }
];

// Initial Predictive Models
export const initialAiPredictions: AiPredictionModel[] = [
  {
    id: 'pred-01',
    title: 'Final Handover Date & Critical Path Burndown',
    category: 'Schedule & Handover',
    targetScope: 'Demo Project',
    projectId: 'proj-goldmine',
    forecastValue: '20 Nov 2026',
    baselineValue: '30 Nov 2026',
    variance: '-10 Days Ahead',
    confidenceInterval: 96.5,
    riskLevel: 'Low',
    summary: 'Master bedroom suite and living salon electrical runs are tracking 10 days ahead of schedule with zero quality defects.',
    rootCauses: [
      'Pre-negotiated vendor rate cards locked with Apex Civil Infra & MasterCraft Joinery',
      'Unified Studio dimension matrix eliminating on-site re-measurement delays'
    ],
    recommendedMitigation: 'Schedule early client walkthrough with Demo Client for Phase 1 handover inspection.',
    lastUpdated: '15 mins ago'
  },
  {
    id: 'pred-02',
    title: 'Trade-Wise Material Rate Card Savings Radar',
    category: 'Cost & Margins',
    targetScope: 'Demo Project',
    projectId: 'proj-goldmine',
    forecastValue: '32.5% Margin',
    baselineValue: '28.0% Contract Target',
    variance: '+4.5% Margin Gain',
    confidenceInterval: 97.2,
    riskLevel: 'Low',
    summary: 'Cross-module vendor rate integration saved ₹5.35L across Annexure A to G compared to original budget estimation.',
    rootCauses: [
      'Direct mill procurement from MasterCraft Architectural Joinery',
      'Standardized item codes across Studio BOQ and Cost module'
    ],
    recommendedMitigation: 'Lock in remaining Annexure H & I contingency reserves into fixed deposit escrow.',
    lastUpdated: '30 mins ago'
  }
];

// Initial Optimization Suggestions
export const initialAiOptimizations: AiOptimizationSuggestion[] = [
  {
    id: 'opt-01',
    title: 'Value Engineering: Premium Laminate vs Veneer on Storage Partitions',
    engine: 'Studio',
    category: 'Value Engineering',
    projectId: 'proj-goldmine',
    projectName: 'Demo Project',
    impactSavingINR: 145000,
    impactTimeDays: 2,
    confidenceScore: 98,
    description: 'Switch internal wardrobe carcasses from natural veneer to 1mm matte anti-scratch laminate while keeping outer facing in natural teak veneer.',
    actionSummary: 'Saves ₹1.45L in material & polish labor without altering client-facing design language.',
    status: 'Pending Review',
    priority: 'High'
  },
  {
    id: 'opt-02',
    title: 'Procurement Synergy: Bulk Purchase Order for Modular Kitchen & Wardrobe Carcass',
    engine: 'Vendor',
    category: 'Procurement Synergy',
    projectId: 'proj-goldmine',
    projectName: 'Demo Project',
    impactSavingINR: 200000,
    impactTimeDays: 4,
    confidenceScore: 96,
    description: 'Combine Annexure C (Electrical) wire raceways and Annexure A (Civil/Carpentry) floor ducting under a single PO with Voltech MEP Solutions.',
    actionSummary: 'Secures an additional 7% vendor discount and aligns site installation milestones.',
    status: 'Pending Review',
    priority: 'High'
  }
];

export const initialNeuralMetrics: AiNeuralCoreMetric = {
  activeModels: 4,
  totalAutomationsRan24h: 1248,
  averageInferenceLatencyMs: 48,
  systemAccuracyScore: 98.6,
  crossEngineDataIngestionRatePerSec: 142,
  preventedCostOverrunsINR: 3840000,
  savedMilestoneDaysTotal: 34,
  neuralHealthStatus: 'Optimal'
};
