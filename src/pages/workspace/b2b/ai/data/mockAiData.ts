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
    id: 'proj-01',
    code: 'PRJ-VSP-01',
    name: 'Villa Serene Penthouse',
    clientName: 'Rahul & Meera Singhania',
    type: 'Luxury Residential',
    areaSqFt: 6200,
    startDate: '2026-01-15',
    targetEndDate: '2026-09-30',
    forecastedEndDate: '2026-09-24',
    status: 'Site Execution',
    completionPercentage: 68,
    healthScore: 94,
    engineFeeds: {
      studio: {
        spacesCount: 8,
        approvedDrawings: 24,
        pendingRevisions: 1,
        boqGenerated: true,
        materialPaletteStatus: 'Locked',
        lastModelSync: '10 mins ago'
      },
      cost: {
        budget: 18500000,
        actualSpend: 11800000,
        committedPO: 4200000,
        projectedVariance: 480000,
        marginHealth: 29.5,
        unapprovedVariationClaims: 0
      },
      flow: {
        activeWorkflows: 6,
        criticalPathTasks: 14,
        stageDelayRisk: 'Low',
        spiIndex: 1.08,
        completedMilestones: 12,
        totalMilestones: 16
      },
      quest: {
        openTasks: 18,
        overdueTasks: 0,
        blockersReported: 0,
        dailyChatActivity: 42,
        upcomingDeadlines7Days: 5
      },
      vendor: {
        activeVendors: 9,
        onTimeDeliveryRate: 98.2,
        flaggedRateDiscrepancies: 0,
        openPurchaseOrders: 4,
        portClearancePending: 0
      },
      people: {
        assignedStaff: 8,
        utilizationRate: 88,
        burnoutRiskTeam: null,
        leadDesigner: 'Ananya Roy',
        siteManager: 'Vikram Joshi'
      },
      connect: {
        clientSentimentScore: 96,
        changeRequestsPending: 0,
        approvalTurnaroundHours: 3.5,
        paymentDueDays: 0
      }
    },
    aiForecast: {
      predictedDelayDays: -6, // 6 days ahead
      confidenceScore: 96.2,
      predictedBudgetVariance: 480000,
      marginRiskFactor: 'Safe',
      topPredictedRisk: 'Custom Italian Statuario marble delivery port inspection buffer (12 days reserved).',
      valueEngineeringPotential: 340000
    }
  },
  {
    id: 'proj-02',
    code: 'PRJ-GHE-02',
    name: 'The Grand Heritage Estate',
    clientName: 'Dr. Vikramaditya Oberoi',
    type: 'Heritage Villa',
    areaSqFt: 14500,
    startDate: '2025-11-01',
    targetEndDate: '2026-11-15',
    forecastedEndDate: '2026-11-28',
    status: 'Site Execution',
    completionPercentage: 45,
    healthScore: 78,
    engineFeeds: {
      studio: {
        spacesCount: 18,
        approvedDrawings: 46,
        pendingRevisions: 4,
        boqGenerated: true,
        materialPaletteStatus: 'Review Required',
        lastModelSync: '3 mins ago'
      },
      cost: {
        budget: 42000000,
        actualSpend: 19800000,
        committedPO: 12500000,
        projectedVariance: -950000,
        marginHealth: 23.8,
        unapprovedVariationClaims: 2
      },
      flow: {
        activeWorkflows: 11,
        criticalPathTasks: 28,
        stageDelayRisk: 'Medium',
        spiIndex: 0.94,
        completedMilestones: 9,
        totalMilestones: 22
      },
      quest: {
        openTasks: 42,
        overdueTasks: 3,
        blockersReported: 2,
        dailyChatActivity: 85,
        upcomingDeadlines7Days: 12
      },
      vendor: {
        activeVendors: 16,
        onTimeDeliveryRate: 86.4,
        flaggedRateDiscrepancies: 3,
        openPurchaseOrders: 8,
        portClearancePending: 1
      },
      people: {
        assignedStaff: 14,
        utilizationRate: 94,
        burnoutRiskTeam: 'Drafting & 3D Team (98% load)',
        leadDesigner: 'Farhan Zaidi',
        siteManager: 'Gurpreet Singh'
      },
      connect: {
        clientSentimentScore: 84,
        changeRequestsPending: 2,
        approvalTurnaroundHours: 18.2,
        paymentDueDays: 4
      }
    },
    aiForecast: {
      predictedDelayDays: 13,
      confidenceScore: 89.4,
      predictedBudgetVariance: -950000,
      marginRiskFactor: 'Moderate Risk',
      topPredictedRisk: 'Handcrafted Burma Teak archway carving cycle lagging planned weekly burndown.',
      valueEngineeringPotential: 1250000
    }
  },
  {
    id: 'proj-03',
    code: 'PRJ-ABW-03',
    name: 'Azure Bay Waterfront Villa',
    clientName: 'Priya & Siddharth Varma',
    type: 'Luxury Residential',
    areaSqFt: 8800,
    startDate: '2026-02-10',
    targetEndDate: '2026-10-30',
    forecastedEndDate: '2026-10-25',
    status: 'Site Execution',
    completionPercentage: 54,
    healthScore: 91,
    engineFeeds: {
      studio: {
        spacesCount: 11,
        approvedDrawings: 32,
        pendingRevisions: 0,
        boqGenerated: true,
        materialPaletteStatus: 'Locked',
        lastModelSync: '25 mins ago'
      },
      cost: {
        budget: 27000000,
        actualSpend: 14200000,
        committedPO: 7800000,
        projectedVariance: 620000,
        marginHealth: 28.1,
        unapprovedVariationClaims: 0
      },
      flow: {
        activeWorkflows: 8,
        criticalPathTasks: 19,
        stageDelayRisk: 'Low',
        spiIndex: 1.04,
        completedMilestones: 10,
        totalMilestones: 18
      },
      quest: {
        openTasks: 24,
        overdueTasks: 1,
        blockersReported: 0,
        dailyChatActivity: 56,
        upcomingDeadlines7Days: 7
      },
      vendor: {
        activeVendors: 12,
        onTimeDeliveryRate: 94.8,
        flaggedRateDiscrepancies: 0,
        openPurchaseOrders: 5,
        portClearancePending: 0
      },
      people: {
        assignedStaff: 9,
        utilizationRate: 85,
        burnoutRiskTeam: null,
        leadDesigner: 'Mira Nair',
        siteManager: 'Pradeep Patel'
      },
      connect: {
        clientSentimentScore: 92,
        changeRequestsPending: 0,
        approvalTurnaroundHours: 6.0,
        paymentDueDays: 0
      }
    },
    aiForecast: {
      predictedDelayDays: -5,
      confidenceScore: 94.7,
      predictedBudgetVariance: 620000,
      marginRiskFactor: 'Safe',
      topPredictedRisk: 'Acoustic glass envelope installation synchronization during monsoon high humidity window.',
      valueEngineeringPotential: 480000
    }
  },
  {
    id: 'proj-04',
    code: 'PRJ-ASC-04',
    name: 'Apex Sky Corporate HQ',
    clientName: 'Nesta FinTech Corp',
    type: 'Commercial Office',
    areaSqFt: 28000,
    startDate: '2026-03-01',
    targetEndDate: '2026-08-30',
    forecastedEndDate: '2026-09-08',
    status: 'Site Execution',
    completionPercentage: 62,
    healthScore: 83,
    engineFeeds: {
      studio: {
        spacesCount: 26,
        approvedDrawings: 78,
        pendingRevisions: 2,
        boqGenerated: true,
        materialPaletteStatus: 'Locked',
        lastModelSync: '1 hour ago'
      },
      cost: {
        budget: 65000000,
        actualSpend: 39500000,
        committedPO: 18200000,
        projectedVariance: -1400000,
        marginHealth: 21.4,
        unapprovedVariationClaims: 3
      },
      flow: {
        activeWorkflows: 15,
        criticalPathTasks: 36,
        stageDelayRisk: 'Medium',
        spiIndex: 0.96,
        completedMilestones: 16,
        totalMilestones: 26
      },
      quest: {
        openTasks: 58,
        overdueTasks: 4,
        blockersReported: 1,
        dailyChatActivity: 110,
        upcomingDeadlines7Days: 16
      },
      vendor: {
        activeVendors: 22,
        onTimeDeliveryRate: 91.0,
        flaggedRateDiscrepancies: 2,
        openPurchaseOrders: 11,
        portClearancePending: 0
      },
      people: {
        assignedStaff: 18,
        utilizationRate: 92,
        burnoutRiskTeam: null,
        leadDesigner: 'Devendra Rao',
        siteManager: 'Manoj Kumar'
      },
      connect: {
        clientSentimentScore: 88,
        changeRequestsPending: 1,
        approvalTurnaroundHours: 12.0,
        paymentDueDays: 7
      }
    },
    aiForecast: {
      predictedDelayDays: 9,
      confidenceScore: 90.8,
      predictedBudgetVariance: -1400000,
      marginRiskFactor: 'Moderate Risk',
      topPredictedRisk: 'HVAC chilled-water line pressure testing delay blocking false ceiling 2nd fix on 5th floor.',
      valueEngineeringPotential: 2100000
    }
  },
  {
    id: 'proj-05',
    code: 'PRJ-AWS-05',
    name: 'Aura Wellness Sanctuary',
    clientName: 'Dr. Alisha Merchant',
    type: 'Hospitality',
    areaSqFt: 11200,
    startDate: '2026-04-15',
    targetEndDate: '2026-12-20',
    forecastedEndDate: '2026-12-15',
    status: 'Design Phase',
    completionPercentage: 28,
    healthScore: 96,
    engineFeeds: {
      studio: {
        spacesCount: 14,
        approvedDrawings: 18,
        pendingRevisions: 0,
        boqGenerated: true,
        materialPaletteStatus: 'Locked',
        lastModelSync: '5 mins ago'
      },
      cost: {
        budget: 34000000,
        actualSpend: 8200000,
        committedPO: 14500000,
        projectedVariance: 850000,
        marginHealth: 31.2,
        unapprovedVariationClaims: 0
      },
      flow: {
        activeWorkflows: 7,
        criticalPathTasks: 12,
        stageDelayRisk: 'Low',
        spiIndex: 1.12,
        completedMilestones: 5,
        totalMilestones: 20
      },
      quest: {
        openTasks: 16,
        overdueTasks: 0,
        blockersReported: 0,
        dailyChatActivity: 38,
        upcomingDeadlines7Days: 4
      },
      vendor: {
        activeVendors: 10,
        onTimeDeliveryRate: 97.5,
        flaggedRateDiscrepancies: 0,
        openPurchaseOrders: 6,
        portClearancePending: 0
      },
      people: {
        assignedStaff: 7,
        utilizationRate: 78,
        burnoutRiskTeam: null,
        leadDesigner: 'Tanvi Shah',
        siteManager: 'Rajesh Verma'
      },
      connect: {
        clientSentimentScore: 98,
        changeRequestsPending: 0,
        approvalTurnaroundHours: 2.5,
        paymentDueDays: 0
      }
    },
    aiForecast: {
      predictedDelayDays: -5,
      confidenceScore: 97.5,
      predictedBudgetVariance: 850000,
      marginRiskFactor: 'Safe',
      topPredictedRisk: 'Hydrotherapy custom copper fixture lead time requiring 8-week advance vendor booking.',
      valueEngineeringPotential: 620000
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
    targetScope: 'The Grand Heritage Estate',
    projectId: 'proj-02',
    forecastValue: '28 Nov 2026',
    baselineValue: '15 Nov 2026',
    variance: '+13 Days',
    confidenceInterval: 89.4,
    riskLevel: 'Moderate',
    summary: 'Handcrafted teak wood archway fabrication and heritage ceiling plastering are tracking 11% below planned velocity, creating a 13-day projected overrun.',
    rootCauses: [
      'Specialized artisan carpenters operating at 82% attendance due to festival travel',
      'Complex multifold vaulted ceiling structural framing taking 4 days longer than standard CAD baseline'
    ],
    recommendedMitigation: 'Authorize 2 additional master craftsmen from Moradabad guild; parallelize electrical conduits with woodwork scaffolding.',
    lastUpdated: '15 mins ago'
  },
  {
    id: 'pred-02',
    title: 'HVAC & False Ceiling Sequencing Overrun Risk',
    category: 'Schedule & Handover',
    targetScope: 'Apex Sky Corporate HQ',
    projectId: 'proj-04',
    forecastValue: '08 Sep 2026',
    baselineValue: '30 Aug 2026',
    variance: '+9 Days',
    confidenceInterval: 90.8,
    riskLevel: 'Moderate',
    summary: 'Chilled water pipe pressure test scheduling on 5th floor conflicts with acoustic gypsum tile 2nd fix.',
    rootCauses: [
      'MEP consultant delayed hydrostatic certification window by 5 days',
      'Dual trade site congestion on Core West corridor'
    ],
    recommendedMitigation: 'Split test zones into East and West wings; execute night testing shifts to clear daytime ceiling teams.',
    lastUpdated: '1 hour ago'
  },
  {
    id: 'pred-03',
    title: 'Imported Marble & Exotic Veneer Inflation Forecast',
    category: 'Cost & Margins',
    targetScope: 'Entire Portfolio',
    projectId: 'all',
    forecastValue: '+4.8% Price Hike',
    baselineValue: 'Locked Budget MSAs',
    variance: '₹18.4L Exposure',
    confidenceInterval: 93.5,
    riskLevel: 'Moderate',
    summary: 'Global maritime container freight rates from Livorno and Antwerp projected to increase 6% over next quarter, impacting stone & hardware batches.',
    rootCauses: [
      'Port congestion at Nhava Sheva adding 4-day demurrage exposure',
      'Currency exchange volatility (EUR/INR) shifting by +1.4%'
    ],
    recommendedMitigation: 'Pre-book container lots for Azure Bay and Aura Sanctuary immediately using consolidated volume discount.',
    lastUpdated: '30 mins ago'
  },
  {
    id: 'pred-04',
    title: 'Client Change Request Margin Erosion Radar',
    category: 'Cost & Margins',
    targetScope: 'The Grand Heritage Estate',
    projectId: 'proj-02',
    forecastValue: '23.8% Margin',
    baselineValue: '27.0% Contract Target',
    variance: '-3.2% Margin',
    confidenceInterval: 94.1,
    riskLevel: 'High',
    summary: 'Two unpriced client change orders (wine cellar chiller addition & pool terrace pergola) risk absorbing project contingency buffer if unbilled.',
    rootCauses: [
      'Client verbal requests executed on site without Connect digital signature approval',
      'Custom refrigeration engineering vendor quote not yet formalized into binding variation order'
    ],
    recommendedMitigation: 'Generate Connect instant digital variation agreement for ₹14.5L with milestone payment schedule.',
    lastUpdated: '2 hours ago'
  },
  {
    id: 'pred-05',
    title: 'Supply Chain Port Clearance & Delivery Reliability',
    category: 'Supply Chain Risk',
    targetScope: 'Villa Serene Penthouse',
    projectId: 'proj-01',
    forecastValue: '98.2% On-Time',
    baselineValue: '95.0% Standard SLA',
    variance: '+3.2% Buffer',
    confidenceInterval: 96.8,
    riskLevel: 'Low',
    summary: 'All high-lead items (Rimadesio custom wardrobe systems & Flos architectural lights) cleared customs and held in secure local staging warehouse.',
    rootCauses: [
      'Proactive 60-day advance PO issuance via Arqon Vendor automated trigger',
      'Direct factory inspection verified in Milan'
    ],
    recommendedMitigation: 'Maintain scheduled installation start date on 14th of next month as planned.',
    lastUpdated: '4 hours ago'
  }
];

// Initial Optimization Suggestions
export const initialAiOptimizations: AiOptimizationSuggestion[] = [
  {
    id: 'opt-01',
    title: 'Value Engineering: Italian Statuario vs Engineered Composite in Master Bath',
    engine: 'Studio',
    category: 'Value Engineering',
    projectId: 'proj-02',
    projectName: 'The Grand Heritage Estate',
    impactSavingINR: 420000,
    impactTimeDays: 0,
    confidenceScore: 96,
    description: 'Switch secondary guest bathroom vanity tops and shower ledges from imported Italian Statuario to Quartzite Composite slabs while preserving aesthetic fidelity.',
    actionSummary: 'Replaces 420 sq.ft of natural marble with ultra-durable stain-resistant composite; updates Studio material palette and reduces Cost variance.',
    status: 'Pending Review',
    priority: 'High'
  },
  {
    id: 'opt-02',
    title: 'Critical Path Compression: Parallelize False Ceiling & MEP 1st Fix',
    engine: 'Flow',
    category: 'Schedule Compression',
    projectId: 'proj-02',
    projectName: 'The Grand Heritage Estate',
    impactSavingINR: 180000,
    impactTimeDays: 11,
    confidenceScore: 91,
    description: 'Re-sequence Flow Gantt dependencies: execute MEP electrical conduits and GI grid ceiling suspension concurrently across Zone A and Zone B.',
    actionSummary: 'Eliminates 11 days of critical path delay, recovering target handover date to 17 Nov 2026.',
    status: 'Pending Review',
    priority: 'Urgent'
  },
  {
    id: 'opt-03',
    title: 'Cross-Project Procurement Synergy: Consolidate Teak Wood & Veneer POs',
    engine: 'Vendor',
    category: 'Procurement Synergy',
    projectId: 'all',
    projectName: 'Heritage Estate + Azure Bay',
    impactSavingINR: 850000,
    impactTimeDays: 4,
    confidenceScore: 98,
    description: 'Bundle timber requirements for The Grand Heritage Estate and Azure Bay Waterfront Villa into a single master procurement batch with TimberCraft Industries.',
    actionSummary: 'Secures an additional 8.5% volume rebate and guarantees matching grain consistency across both high-profile sites.',
    status: 'Pending Review',
    priority: 'High'
  },
  {
    id: 'opt-04',
    title: 'Drafting Team Workload Rebalancing: Shift 3D Assets to Aura Sanctuary Team',
    engine: 'People',
    category: 'Resource Rebalancing',
    projectId: 'proj-04',
    projectName: 'Apex Sky Corporate HQ',
    impactSavingINR: 95000,
    impactTimeDays: 6,
    confidenceScore: 94,
    description: 'Apex Sky drafting team is currently at 94% utilization while Aura Sanctuary team is at 78%. Reassign 6 architectural CAD detail packages.',
    actionSummary: 'Prevents drafting backlog on HVAC riser drawings without incurring external freelance drafting fees.',
    status: 'Pending Review',
    priority: 'Medium'
  },
  {
    id: 'opt-05',
    title: 'Automated Client Milestone Payment Reminder & Digital Waiver',
    engine: 'Connect',
    category: 'Value Engineering',
    projectId: 'proj-04',
    projectName: 'Apex Sky Corporate HQ',
    impactSavingINR: 0,
    impactTimeDays: 5,
    confidenceScore: 97,
    description: 'Issue auto-verification of Completed Milestone 16 (Flooring & Structural Glazing) to Nesta FinTech CFO with embedded Razorpay/NEFT payment link.',
    actionSummary: 'Accelerates accounts receivable collection cycle by 5 business days and maintains positive site cashflow.',
    status: 'Pending Review',
    priority: 'Medium'
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
