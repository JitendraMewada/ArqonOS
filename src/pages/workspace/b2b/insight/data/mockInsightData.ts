import React from 'react';

export interface ProjectInsight {
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
  
  // Cross-Engine Ingested Metrics:
  // From Connect (CRM & Client)
  clientSatisfaction: number; // 1-5
  contractValue: number;
  invoicedAmount: number;
  collectedAmount: number;
  receivables: number;
  dealConversionDays: number;
  
  // From Cost (Finance)
  allocatedBudget: number;
  actualCostToDate: number;
  committedPOCost: number;
  projectedCostAtCompletion: number;
  currentMarginPercent: number;
  projectedMarginPercent: number;
  budgetVariance: number; // allocatedBudget - projectedCostAtCompletion
  costPerformanceIndex: number; // CPI = EV / AC (Earned Value / Actual Cost)
  
  // From Flow & Quest (Workflows & Tasks)
  schedulePerformanceIndex: number; // SPI = EV / PV
  totalMilestones: number;
  completedMilestones: number;
  activeBottlenecks: number;
  openTasks: number;
  overdueTasks: number;
  velocityScore: number; // Tasks completed per week avg
  criticalPathRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  
  // From Studio (Design)
  spacesCount: number;
  totalSpacesSqFt: number;
  revisionCycles: number;
  approvedDrawingsPercent: number;
  pendingDesignApprovals: number;
  materialBoardsApproved: number;
  
  // From People (Team & Resources)
  allocatedTeamSize: number;
  loggedHours: number;
  budgetedHours: number;
  utilizationRate: number; // %
  leadDesigner: string;
  projectManager: string;
  
  // From Vendor (Procurement & Supply Chain)
  activeVendorsCount: number;
  totalPOsIssued: number;
  materialDeliveryOnTimeRate: number; // %
  qualityDefectRate: number; // %
  vendorSLAComplianceRate: number; // %
  
  // From AI Engine (Predictions)
  aiRiskFactor: 'Minimal' | 'Moderate' | 'Elevated' | 'Severe';
  aiPredictedDelayDays: number;
  aiSuggestedSavingsOpportunity: number;
  confidenceScore: number; // %
}

export interface EngineCrossStream {
  engineId: 'connect' | 'flow' | 'quest' | 'studio' | 'cost' | 'vendor' | 'people' | 'ai';
  engineName: string;
  iconName: string;
  colorHex: string;
  activeDataStreams: number;
  lastSynced: string;
  status: 'Live Sync' | 'Optimal' | 'Syncing' | 'Warning';
  primaryMetric: {
    label: string;
    value: string;
    trend: string;
    isPositive: boolean;
  };
}

export interface MonthlyFinancialTrend {
  month: string;
  revenue: number;
  budgetedCost: number;
  actualCost: number;
  grossProfit: number;
  marginPercent: number;
  cashFlow: number;
}

export interface DepartmentProductivity {
  department: string;
  headcount: number;
  capacityHours: number;
  billableHours: number;
  nonBillableHours: number;
  utilizationPercent: number;
  hourlyEfficiencyIndex: number; // 0-100
  costPerBillableHour: number;
}

export interface AIAnomalyAlert {
  id: string;
  timestamp: string;
  projectId: string;
  projectName: string;
  engineSource: 'Cost' | 'Flow' | 'Vendor' | 'Studio' | 'People';
  severity: 'Critical' | 'Warning' | 'Opportunity' | 'Info';
  title: string;
  description: string;
  impactMetric: string;
  recommendedAction: string;
  isResolved: boolean;
}

export interface WhatIfScenarioInput {
  laborCostMultiplier: number; // 1.0 = 100%
  materialInflationPercent: number; // e.g. 5%
  vendorDelayWeeks: number; // e.g. 2 weeks
  scopeAdditionValue: number; // e.g. 500000
  accelerationOvertimeHours: number; // e.g. 50 hours
}

export interface InsightReportTemplate {
  id: string;
  code: string;
  name: string;
  category: 'Financial' | 'Operations' | 'Design & Space' | 'Supply Chain' | 'Executive Audit';
  description: string;
  frequency: 'Real-time' | 'Weekly' | 'Monthly' | 'Quarterly';
  lastGenerated: string;
  fileFormat: 'PDF' | 'XLSX' | 'CSV';
  recipients: string[];
}

// ----------------------------------------------------
// INITIAL SEED DATA
// ----------------------------------------------------

export const INITIAL_PROJECT_INSIGHTS: ProjectInsight[] = [
  {
    id: 'proj-goldmine',
    code: 'demo-arq-001',
    name: 'Demo Project',
    clientName: 'Demo Client',
    type: 'Luxury Residential',
    areaSqFt: 1794,
    startDate: '2024-05-01',
    targetEndDate: '2024-11-30',
    forecastedEndDate: '2024-11-20',
    status: 'Site Execution',
    completionPercentage: 65,
    healthScore: 94,
    
    // Connect
    clientSatisfaction: 4.9,
    contractValue: 9785823,
    invoicedAmount: 6500000,
    collectedAmount: 6000000,
    receivables: 500000,
    dealConversionDays: 14,
    
    // Cost
    allocatedBudget: 9785823,
    actualCostToDate: 4892911,
    committedPOCost: 2800000,
    projectedCostAtCompletion: 9250000,
    currentMarginPercent: 32.5,
    projectedMarginPercent: 30.5,
    budgetVariance: 535823, // Under budget due to Trade-wise rate card optimization
    costPerformanceIndex: 1.05,
    
    // Flow & Quest
    schedulePerformanceIndex: 1.02,
    totalMilestones: 10,
    completedMilestones: 6,
    activeBottlenecks: 0,
    openTasks: 18,
    overdueTasks: 0,
    velocityScore: 28.5,
    criticalPathRisk: 'Low',
    
    // Studio
    spacesCount: 8,
    totalSpacesSqFt: 6200,
    revisionCycles: 1.2,
    approvedDrawingsPercent: 96,
    pendingDesignApprovals: 1,
    materialBoardsApproved: 8,
    
    // People
    allocatedTeamSize: 8,
    loggedHours: 1420,
    budgetedHours: 2200,
    utilizationRate: 92,
    leadDesigner: 'Jitendra Mewada (Lead Estimator & Designer)',
    projectManager: 'Vikram Mehta',
    
    // Vendor
    activeVendorsCount: 6,
    totalPOsIssued: 18,
    materialDeliveryOnTimeRate: 96.5,
    qualityDefectRate: 0.8,
    vendorSLAComplianceRate: 97.2,
    
    // AI Engine
    aiRiskFactor: 'Minimal',
    aiPredictedDelayDays: -10, // Ahead of schedule
    aiSuggestedSavingsOpportunity: 345000,
    confidenceScore: 95
  }
];

export const CROSS_ENGINE_STREAMS: EngineCrossStream[] = [
  {
    engineId: 'cost',
    engineName: 'Cost Engine',
    iconName: 'Database',
    colorHex: '#94a3b8',
    activeDataStreams: 5,
    lastSynced: 'Just now',
    status: 'Live Sync',
    primaryMetric: {
      label: 'Portfolio Gross Margin',
      value: '27.4%',
      trend: '+1.8% vs Q1',
      isPositive: true
    }
  },
  {
    engineId: 'studio',
    engineName: 'Studio Engine',
    iconName: 'Layers',
    colorHex: '#f97316',
    activeDataStreams: 8,
    lastSynced: '2 mins ago',
    status: 'Live Sync',
    primaryMetric: {
      label: 'Drawing Approval Rate',
      value: '91.2%',
      trend: '+4.5% velocity',
      isPositive: true
    }
  },
  {
    engineId: 'flow',
    engineName: 'Flow & Quest',
    iconName: 'Workflow',
    colorHex: '#3b82f6',
    activeDataStreams: 12,
    lastSynced: '1 min ago',
    status: 'Live Sync',
    primaryMetric: {
      label: 'Schedule SPI Index',
      value: '0.96',
      trend: '3 Bottlenecks active',
      isPositive: false
    }
  },
  {
    engineId: 'vendor',
    engineName: 'Vendor Engine',
    iconName: 'Truck',
    colorHex: '#07B9CE',
    activeDataStreams: 6,
    lastSynced: '4 mins ago',
    status: 'Live Sync',
    primaryMetric: {
      label: 'Supplier SLA Compliance',
      value: '94.8%',
      trend: '98% on-time delivery',
      isPositive: true
    }
  },
  {
    engineId: 'people',
    engineName: 'People Engine',
    iconName: 'Users',
    colorHex: '#a855f7',
    activeDataStreams: 4,
    lastSynced: '5 mins ago',
    status: 'Live Sync',
    primaryMetric: {
      label: 'Studio Resource Utilization',
      value: '89.2%',
      trend: 'Optimal bandwidth',
      isPositive: true
    }
  },
  {
    engineId: 'connect',
    engineName: 'Connect Engine',
    iconName: 'Globe',
    colorHex: '#3b82f6',
    activeDataStreams: 7,
    lastSynced: '3 mins ago',
    status: 'Live Sync',
    primaryMetric: {
      label: 'Active Pipeline Backlog',
      value: '₹9.32 Cr',
      trend: '₹3.76 Cr Collections',
      isPositive: true
    }
  },
  {
    engineId: 'ai',
    engineName: 'AI Engine',
    iconName: 'Brain',
    colorHex: '#A0D6B4',
    activeDataStreams: 10,
    lastSynced: 'Real-time',
    status: 'Optimal',
    primaryMetric: {
      label: 'Identified Savings',
      value: '₹11.45 Lakhs',
      trend: '89% Forecast Confidence',
      isPositive: true
    }
  }
];

export const MONTHLY_FINANCIAL_TRENDS: MonthlyFinancialTrend[] = [
  { month: 'Jan 2024', revenue: 4800000, budgetedCost: 3500000, actualCost: 3420000, grossProfit: 1380000, marginPercent: 28.7, cashFlow: 1120000 },
  { month: 'Feb 2024', revenue: 6200000, budgetedCost: 4500000, actualCost: 4380000, grossProfit: 1820000, marginPercent: 29.3, cashFlow: 1450000 },
  { month: 'Mar 2024', revenue: 7800000, budgetedCost: 5600000, actualCost: 5720000, grossProfit: 2080000, marginPercent: 26.6, cashFlow: 1620000 },
  { month: 'Apr 2024', revenue: 8900000, budgetedCost: 6400000, actualCost: 6290000, grossProfit: 2610000, marginPercent: 29.3, cashFlow: 2100000 },
  { month: 'May 2024', revenue: 10500000, budgetedCost: 7700000, actualCost: 7890000, grossProfit: 2610000, marginPercent: 24.8, cashFlow: 1980000 },
  { month: 'Jun 2024', revenue: 12200000, budgetedCost: 8900000, actualCost: 8750000, grossProfit: 3450000, marginPercent: 28.2, cashFlow: 2750000 },
  { month: 'Jul 2024 (FC)', revenue: 13800000, budgetedCost: 9900000, actualCost: 9820000, grossProfit: 3980000, marginPercent: 28.8, cashFlow: 3100000 },
  { month: 'Aug 2024 (FC)', revenue: 15100000, budgetedCost: 10800000, actualCost: 10650000, grossProfit: 4450000, marginPercent: 29.4, cashFlow: 3520000 }
];

export const DEPARTMENT_PRODUCTIVITY_DATA: DepartmentProductivity[] = [
  {
    department: 'Architectural & Space Planning',
    headcount: 6,
    capacityHours: 960,
    billableHours: 874,
    nonBillableHours: 86,
    utilizationPercent: 91.0,
    hourlyEfficiencyIndex: 94,
    costPerBillableHour: 1850
  },
  {
    department: 'Interior & 3D Visualization',
    headcount: 8,
    capacityHours: 1280,
    billableHours: 1190,
    nonBillableHours: 90,
    utilizationPercent: 93.0,
    hourlyEfficiencyIndex: 96,
    costPerBillableHour: 1600
  },
  {
    department: 'MEP & Technical Drafting',
    headcount: 4,
    capacityHours: 640,
    billableHours: 544,
    nonBillableHours: 96,
    utilizationPercent: 85.0,
    hourlyEfficiencyIndex: 88,
    costPerBillableHour: 1450
  },
  {
    department: 'Site Execution & Project Management',
    headcount: 7,
    capacityHours: 1120,
    billableHours: 996,
    nonBillableHours: 124,
    utilizationPercent: 88.9,
    hourlyEfficiencyIndex: 91,
    costPerBillableHour: 1750
  },
  {
    department: 'Procurement & Vendor Coordination',
    headcount: 3,
    capacityHours: 480,
    billableHours: 418,
    nonBillableHours: 62,
    utilizationPercent: 87.1,
    hourlyEfficiencyIndex: 92,
    costPerBillableHour: 1350
  }
];

export const INITIAL_AI_ANOMALIES: AIAnomalyAlert[] = [
  {
    id: 'ALR-001',
    timestamp: 'Today, 10:45 AM',
    projectId: 'PRJ-2024-001',
    projectName: 'Villa Serene Penthouse',
    engineSource: 'Cost',
    severity: 'Warning',
    title: 'Custom Millwork Package Expense Spike',
    description: 'Actual millwork finishes exceed the Studio initial budget by ₹2,80,000 (+8.4%) due to Italian fluted walnut veneer rate revisions.',
    impactMetric: '-1.4% projected project margin',
    recommendedAction: 'Apply renegotiated framework discount with Royal Millwork Studio or value-engineer master wardrobe internal partitions.',
    isResolved: false
  },
  {
    id: 'ALR-002',
    timestamp: 'Yesterday, 04:15 PM',
    projectId: 'PRJ-2024-003',
    projectName: 'Azure Bay Waterfront Villa',
    engineSource: 'Flow',
    severity: 'Critical',
    title: 'Façade Glazing Delivery Critical Path Bottleneck',
    description: 'Custom acoustic sea-facing double glazed panels delayed in marine port transit by 14 days, risking subsequent false ceiling and wooden flooring dates.',
    impactMetric: '+20 days potential handover slippage',
    recommendedAction: 'Re-sequence MEP ceiling 2nd fix and dry-lining ahead of glazing installation to maintain subcontractor site velocity.',
    isResolved: false
  },
  {
    id: 'ALR-003',
    timestamp: 'Aug 29, 02:30 PM',
    projectId: 'PRJ-2024-002',
    projectName: 'The Grand Heritage Estate',
    engineSource: 'Vendor',
    severity: 'Opportunity',
    title: 'Bulk Italian Statuario Marble Procurement Rebate',
    description: 'Vendor StoneCraft India has offered an additional 4% volume rebate if the remaining 3 bathroom slabs are certified within 7 business days.',
    impactMetric: '₹3,20,000 direct cost reduction',
    recommendedAction: 'Instruct Site Supervisor Aditya Sen to certify space measurement drawings in Studio Spaces module.',
    isResolved: false
  },
  {
    id: 'ALR-004',
    timestamp: 'Aug 28, 11:10 AM',
    projectId: 'PRJ-2024-004',
    projectName: 'Apex Sky Corporate HQ',
    engineSource: 'People',
    severity: 'Info',
    title: 'Handover Phase Resource Optimization',
    description: '3D Visualization and Drafting workload on Apex Sky HQ is completed. 2 Senior Draftsmen are available for reallocation to Azure Bay Villa.',
    impactMetric: '+15 hrs/week capacity unlock',
    recommendedAction: 'Reassign Draftsmen in People module to resolve Azure Bay technical drawing backlog.',
    isResolved: true
  }
];

export const INSIGHT_REPORT_TEMPLATES: InsightReportTemplate[] = [
  {
    id: 'REP-001',
    code: 'EXEC-PL-01',
    name: 'Executive Project P&L & Cashflow Statement',
    category: 'Executive Audit',
    description: 'Comprehensive financial health report detailing contract billing, cash collected, committed POs, actual costs, and gross profit margins across all projects.',
    frequency: 'Monthly',
    lastGenerated: 'Aug 30, 2024',
    fileFormat: 'PDF',
    recipients: ['Managing Director', 'Finance Lead', 'Partners']
  },
  {
    id: 'REP-002',
    code: 'OPS-VEL-02',
    name: 'Workflow Milestone Velocity & Critical Path Audit',
    category: 'Operations',
    description: 'Ingests Flow and Quest data to map milestone burndowns, active site bottlenecks, schedule performance indexes (SPI), and overdue work-packages.',
    frequency: 'Weekly',
    lastGenerated: 'Aug 31, 2024',
    fileFormat: 'PDF',
    recipients: ['Project Managers', 'Head of Operations']
  },
  {
    id: 'REP-003',
    code: 'DES-VAR-03',
    name: 'Space-Wise Material Cost Variance & Studio BOQ',
    category: 'Design & Space',
    description: 'Direct comparison between Studio proposed design specifications and Cost module actual procurement prices per room/space.',
    frequency: 'Monthly',
    lastGenerated: 'Aug 28, 2024',
    fileFormat: 'XLSX',
    recipients: ['Lead Designers', 'Estimators', 'Design Directors']
  },
  {
    id: 'REP-004',
    code: 'SCM-VND-04',
    name: 'Vendor Performance, Quality & SLA Scorecard',
    category: 'Supply Chain',
    description: 'Evaluates supplier on-time delivery rates, material QA rejection ratios, contract warranty compliance, and payment settlement aging.',
    frequency: 'Monthly',
    lastGenerated: 'Aug 25, 2024',
    fileFormat: 'PDF',
    recipients: ['Procurement Officers', 'Vendor Managers']
  },
  {
    id: 'REP-005',
    code: 'HR-UTIL-05',
    name: 'Team Bandwidth, Billability & Utilization Ledger',
    category: 'Operations',
    description: 'Departmental breakdown of billable vs non-billable hours, project-level designer allocation, and hourly productivity coefficients.',
    frequency: 'Weekly',
    lastGenerated: 'Aug 29, 2024',
    fileFormat: 'CSV',
    recipients: ['Studio Operations', 'HR Manager']
  }
];
