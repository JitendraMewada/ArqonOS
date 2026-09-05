import { ProjectMasterEstimate, EstimateLineItem } from '../../cost/data/estimateTypes';
import { MOCK_MASTER_ESTIMATE_ABIZAR } from '../../cost/data/mockEstimateData';

export interface PhaseTimeline {
  id: 'phase-1-connect' | 'phase-2-studio' | 'phase-3-cost';
  phaseNumber: 1 | 2 | 3;
  name: string;
  engine: 'Connect' | 'Studio' | 'Cost';
  engineLabel: string;
  badgeColor: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  elapsedDays: number;
  status: 'Completed' | 'In Progress' | 'Pending';
  progressPercentage: number;
  headlineMetric: string;
  summary: string;
  deliverables: {
    name: string;
    status: 'Completed' | 'In Progress' | 'Pending';
    progressPercentage: number;
    weight: number;
  }[];
}

export interface ProjectMasterTimelineData {
  projectCode: string;
  projectName: string;
  overallProgressPercentage: number;
  overallDaysTotal: number;
  overallDaysElapsed: number;
  phases: {
    acquisition: PhaseTimeline;
    design: PhaseTimeline;
    execution: PhaseTimeline;
  };
  siteExecutionMetrics: {
    totalItems: number;
    completedItems: number;
    inProgressItems: number;
    pendingItems: number;
    averageItemProgress: number;
    weightedBoqProgress: number;
    tradeWiseProgress: {
      tradeCode: string;
      tradeName: string;
      totalItems: number;
      averageProgress: number;
      subtotalAmount: number;
    }[];
  };
}

export const TIMELINE_STORAGE_KEY = 'arqon_studio_cost_timeline_v1';
export const ESTIMATE_STORAGE_KEY = 'arqon_master_estimate_abizar_v2';

// Trade baseline progress defaults for initial unedited items
export const DEFAULT_TRADE_PROGRESS: Record<string, number> = {
  A: 100, // Civil Work (Completed)
  B: 85,  // POP & False Ceiling
  C: 75,  // Electric Wiring
  D: 30,  // Electric Switches
  E: 15,  // Electric Fixtures
  F: 50,  // Carpentry & Joinery
  G: 20,  // Paint & Polish
  H: 35,  // Miscellaneous
  I: 10,  // Loose Furniture
  J: 85   // Aluminium Windows
};

// Calculate days between two ISO date strings
export function calculateDaysBetween(startDateStr: string, endDateStr: string): number {
  try {
    const start = new Date(startDateStr).getTime();
    const end = new Date(endDateStr).getTime();
    const diffTime = Math.abs(end - start);
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  } catch {
    return 30;
  }
}

// Calculate elapsed days from start date to current reference date
export function calculateElapsedDays(startDateStr: string, endDateStr: string): number {
  try {
    const start = new Date(startDateStr).getTime();
    const end = new Date(endDateStr).getTime();
    const now = new Date().getTime();

    if (now <= start) return 0;
    if (now >= end) return calculateDaysBetween(startDateStr, endDateStr);

    const diff = now - start;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

// Get saved master estimate from localStorage or fallback to mock
export function getStoredMasterEstimate(): ProjectMasterEstimate {
  try {
    const raw = localStorage.getItem(ESTIMATE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.rooms && parsed.rooms.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored estimate, using default mock:', e);
  }
  return MOCK_MASTER_ESTIMATE_ABIZAR;
}

// Save master estimate to localStorage and broadcast event
export function saveStoredMasterEstimate(estimate: ProjectMasterEstimate): void {
  try {
    localStorage.setItem(ESTIMATE_STORAGE_KEY, JSON.stringify(estimate));
    window.dispatchEvent(new CustomEvent('arqon_estimate_progress_updated', { detail: estimate }));
  } catch (e) {
    console.error('Failed to save master estimate to localStorage:', e);
  }
}

// Compute comprehensive 3-phase timeline and progress
export function computeProjectTimeline(
  customEstimate?: ProjectMasterEstimate,
  customDates?: {
    leadCreatedDate?: string;
    leadWonDate?: string;
    designStartDate?: string;
    designEndDate?: string;
    siteStartDate?: string;
    siteEndDate?: string;
  }
): ProjectMasterTimelineData {
  const estimate = customEstimate || getStoredMasterEstimate();

  // Phase 1 Dates (Connect Engine)
  const leadCreated = customDates?.leadCreatedDate || '2026-03-15';
  const leadWon = customDates?.leadWonDate || '2026-04-28';
  const acqTotalDays = calculateDaysBetween(leadCreated, leadWon);
  const acqElapsed = acqTotalDays; // Lead is fully Won (100%)

  // Phase 2 Dates (Studio Engine)
  const designStart = customDates?.designStartDate || '2026-05-01';
  const designEnd = customDates?.designEndDate || '2026-06-30';
  const designTotalDays = calculateDaysBetween(designStart, designEnd);
  const designElapsed = designTotalDays; // Design GFC approved & frozen (100%)

  // Phase 3 Dates (Cost Engine - Site Execution)
  const siteStart = customDates?.siteStartDate || '2026-07-01';
  const siteEnd = customDates?.siteEndDate || '2026-11-30';
  const siteTotalDays = calculateDaysBetween(siteStart, siteEnd);
  const siteElapsed = calculateElapsedDays(siteStart, siteEnd);

  // Extract all line items across all rooms and annexures
  const allItems: (EstimateLineItem & { roomName: string; tradeCode: string })[] = [];
  const tradeMap: Record<string, { totalItems: number; sumProgress: number; subtotal: number; tradeName: string }> = {};

  estimate.rooms.forEach(room => {
    Object.entries(room.annexures).forEach(([tradeCode, annexure]) => {
      if (!tradeMap[tradeCode]) {
        tradeMap[tradeCode] = {
          totalItems: 0,
          sumProgress: 0,
          subtotal: 0,
          tradeName: annexure.tradeName
        };
      }

      tradeMap[tradeCode].subtotal += annexure.totalAmount || 0;

      (annexure.items || []).forEach(item => {
        // Use item's assigned progress or fallback to default baseline
        const itemProg = typeof item.progressPercentage === 'number'
          ? Math.min(100, Math.max(0, item.progressPercentage))
          : (DEFAULT_TRADE_PROGRESS[tradeCode] ?? 25);

        allItems.push({
          ...item,
          progressPercentage: itemProg,
          roomName: room.roomName,
          tradeCode
        });

        tradeMap[tradeCode].totalItems += 1;
        tradeMap[tradeCode].sumProgress += itemProg;
      });
    });
  });

  // Calculate Site Execution Progress
  let completedItemsCount = 0;
  let inProgressItemsCount = 0;
  let pendingItemsCount = 0;
  let totalItemProgressSum = 0;
  let weightedProgressSum = 0;
  const totalBoqAmount = allItems.reduce((acc, it) => acc + (it.amount || 0), 0) || estimate.totalProjectCost || 1;

  allItems.forEach(it => {
    const p = it.progressPercentage || 0;
    totalItemProgressSum += p;
    weightedProgressSum += (it.amount || 0) * (p / 100);

    if (p >= 100) {
      completedItemsCount += 1;
    } else if (p > 0) {
      inProgressItemsCount += 1;
    } else {
      pendingItemsCount += 1;
    }
  });

  const averageItemProgress = allItems.length > 0
    ? Math.round(totalItemProgressSum / allItems.length)
    : 52;

  const weightedBoqProgress = totalBoqAmount > 0
    ? Math.round((weightedProgressSum / totalBoqAmount) * 100)
    : averageItemProgress;

  // Compile trade-wise progress
  const tradeWiseProgress = Object.entries(tradeMap).map(([tradeCode, data]) => ({
    tradeCode,
    tradeName: data.tradeName,
    totalItems: data.totalItems,
    averageProgress: data.totalItems > 0 ? Math.round(data.sumProgress / data.totalItems) : (DEFAULT_TRADE_PROGRESS[tradeCode] ?? 0),
    subtotalAmount: data.subtotal
  })).sort((a, b) => a.tradeCode.localeCompare(b.tradeCode));

  // Phase 1 Object
  const acquisitionPhase: PhaseTimeline = {
    id: 'phase-1-connect',
    phaseNumber: 1,
    name: 'Phase 1: Client Acquisition',
    engine: 'Connect',
    engineLabel: 'Connect Engine',
    badgeColor: '#3b82f6',
    startDate: leadCreated,
    endDate: leadWon,
    totalDays: acqTotalDays,
    elapsedDays: acqElapsed,
    status: 'Completed',
    progressPercentage: 100,
    headlineMetric: 'Deal Won & Contract Signed',
    summary: 'Lead qualification, design briefing, initial scope pitch, and retainer agreement signoff.',
    deliverables: [
      { name: 'Initial Client Brief & Site Visit', status: 'Completed', progressPercentage: 100, weight: 25 },
      { name: 'Commercial Pitch & Rough Order of Magnitude', status: 'Completed', progressPercentage: 100, weight: 25 },
      { name: 'Fee Structure & Contract Negotiation', status: 'Completed', progressPercentage: 100, weight: 25 },
      { name: 'Retainer Token Advance Received (Won)', status: 'Completed', progressPercentage: 100, weight: 25 }
    ]
  };

  // Phase 2 Object
  const designPhase: PhaseTimeline = {
    id: 'phase-2-studio',
    phaseNumber: 2,
    name: 'Phase 2: Design & Engineering',
    engine: 'Studio',
    engineLabel: 'Studio Engine',
    badgeColor: '#f97316',
    startDate: designStart,
    endDate: designEnd,
    totalDays: designTotalDays,
    elapsedDays: designElapsed,
    status: 'Completed',
    progressPercentage: 100,
    headlineMetric: 'Good-For-Construction (GFC) Released',
    summary: 'Physical site survey, dimension matrix, proposed space planning, 3D renders, and technical drawing signoff.',
    deliverables: [
      { name: 'Physical Site Measurement & Dimension Matrix', status: 'Completed', progressPercentage: 100, weight: 20 },
      { name: 'Proposed Space Planning & Furniture Layout', status: 'Completed', progressPercentage: 100, weight: 20 },
      { name: 'Concept Moodboards & Material Specs', status: 'Completed', progressPercentage: 100, weight: 20 },
      { name: '3D Raytraced Photorealistic Visualizations', status: 'Completed', progressPercentage: 100, weight: 20 },
      { name: 'GFC Working Drawings & Client BOQ Signoff', status: 'Completed', progressPercentage: 100, weight: 20 }
    ]
  };

  // Phase 3 Object
  const executionPhase: PhaseTimeline = {
    id: 'phase-3-cost',
    phaseNumber: 3,
    name: 'Phase 3: Site Execution & Handover',
    engine: 'Cost',
    engineLabel: 'Cost Engine',
    badgeColor: '#10b981',
    startDate: siteStart,
    endDate: siteEnd,
    totalDays: siteTotalDays,
    elapsedDays: siteElapsed,
    status: weightedBoqProgress >= 100 ? 'Completed' : 'In Progress',
    progressPercentage: weightedBoqProgress,
    headlineMetric: `${weightedBoqProgress}% Physical Execution`,
    summary: `Active on-site civil, MEP, joinery, and architectural finishes across ${allItems.length} itemized BOQ line items.`,
    deliverables: tradeWiseProgress.map(t => ({
      name: `Annexure ${t.tradeCode}: ${t.tradeName}`,
      status: t.averageProgress >= 100 ? 'Completed' : t.averageProgress > 0 ? 'In Progress' : 'Pending',
      progressPercentage: t.averageProgress,
      weight: 10
    }))
  };

  // Master Overall Progress (Composite weighted)
  // Phase 1: 15% weight
  // Phase 2: 25% weight
  // Phase 3: 60% weight
  const overallProgressPercentage = Math.round(
    (acquisitionPhase.progressPercentage * 0.15) +
    (designPhase.progressPercentage * 0.25) +
    (executionPhase.progressPercentage * 0.60)
  );

  const overallDaysTotal = acqTotalDays + designTotalDays + siteTotalDays;
  const overallDaysElapsed = acqTotalDays + designTotalDays + siteElapsed;

  return {
    projectCode: estimate.projectCode || 'demo-arq-001',
    projectName: estimate.projectName || 'Demo Project',
    overallProgressPercentage,
    overallDaysTotal,
    overallDaysElapsed,
    phases: {
      acquisition: acquisitionPhase,
      design: designPhase,
      execution: executionPhase
    },
    siteExecutionMetrics: {
      totalItems: allItems.length,
      completedItems: completedItemsCount,
      inProgressItems: inProgressItemsCount,
      pendingItems: pendingItemsCount,
      averageItemProgress,
      weightedBoqProgress,
      tradeWiseProgress
    }
  };
}
