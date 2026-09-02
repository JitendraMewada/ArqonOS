export interface CostExpense {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  category: 'Materials & Finishes' | 'Millwork & Joinery' | 'FF&E & Furniture' | 'MEP & Lighting' | 'Labor & Supervision' | 'Civil & Demolition' | 'Logistics & Misc';
  spaceName?: string;
  vendorName: string;
  amount: number;
  paymentMethod: 'Bank Transfer' | 'Credit Card' | 'Cheque' | 'Petty Cash' | 'Wire / ACH';
  status: 'Paid' | 'Approved' | 'Pending' | 'Rejected';
  invoiceRef: string;
  notes: string;
  receiptUrl?: string;
}

export interface SpaceCostBreakdown {
  spaceId: string;
  spaceName: string;
  spaceType: string;
  areaSqFt: number;
  allocatedBudget: number;
  actualCost: number;
  committedCost: number;
  variance: number;
  status: 'On Track' | 'Under Budget' | 'Over Budget';
  finishes: {
    flooring: { name: string; cost: number };
    ceiling: { name: string; cost: number };
    walls: { name: string; cost: number };
    millwork: { name: string; cost: number };
    fixtures: { name: string; cost: number };
  };
}

export interface LaborCostItem {
  id: string;
  roleName: string;
  assignedMember: string;
  hourlyRate: number;
  hoursLogged: number;
  totalCost: number;
  department: string;
}

export interface ClientInvoiceMilestone {
  id: string;
  milestoneName: string;
  percentage: number;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  paidDate?: string;
  invoiceNumber: string;
}

export interface VendorPOItem {
  id: string;
  poNumber: string;
  vendorName: string;
  category: string;
  orderDate: string;
  deliveryDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'Fulfilled' | 'Partially Paid' | 'Issued' | 'Draft';
  itemsCount: number;
}

export interface ProjectFinancials {
  projectId: string;
  projectName: string;
  projectCode: string;
  clientName: string;
  projectType: string;
  status: 'Active' | 'On Hold' | 'Completed' | 'Draft';
  location: string;
  totalAreaSqFt: number;
  startDate: string;
  endDate: string;
  
  // Gatekeeper integration with Studio
  approvalGateStatus: 'Unlocked & Approved' | 'Pending Studio Signoff' | 'Revision In Progress';
  studioApprovalMilestone: string;

  // Key Financial Figures
  contractValue: number;
  estimatedBudget: number;
  approvedBudget: number;
  committedCost: number;
  actualIncurredCost: number;
  forecastAtCompletion: number; // EAC
  variance: number; // approvedBudget - forecastAtCompletion
  grossMargin: number; // contractValue - forecastAtCompletion
  marginPercentage: number; // (grossMargin / contractValue) * 100

  // Cash flow
  cashflowInvoiced: number;
  cashflowReceived: number;
  cashflowOutstanding: number;

  // Financial Health Indicator
  budgetHealth: 'Healthy' | 'Caution' | 'Critical Overrun';

  // Detailed breakdowns
  categoryBreakdown: {
    materials: { allocated: number; actual: number; committed: number };
    millwork: { allocated: number; actual: number; committed: number };
    ffe: { allocated: number; actual: number; committed: number };
    mep: { allocated: number; actual: number; committed: number };
    labor: { allocated: number; actual: number; committed: number };
    civil: { allocated: number; actual: number; committed: number };
    logistics: { allocated: number; actual: number; committed: number };
  };

  spaces: SpaceCostBreakdown[];
  laborTeam: LaborCostItem[];
  invoices: ClientInvoiceMilestone[];
  vendorPOs: VendorPOItem[];
}

export interface PortfolioSummary {
  totalPortfolioContractValue: number;
  totalPortfolioApprovedBudget: number;
  totalPortfolioIncurredCost: number;
  totalPortfolioCommittedCost: number;
  totalPortfolioRemainingBudget: number;
  totalPortfolioForecastCost: number;
  portfolioGrossMargin: number;
  portfolioGrossMarginPercentage: number;
  totalInvoiced: number;
  totalCollected: number;
  totalReceivables: number;
  totalActiveProjects: number;
  healthyProjectsCount: number;
  cautionProjectsCount: number;
  overrunProjectsCount: number;
  burnRatePerDay: number;
  cashRunwayMonths: number;
}

// -------------------------------------------------------------
// INITIAL MASTER MOCK FINANCIALS BY PROJECT
// -------------------------------------------------------------

export const MOCK_PROJECT_FINANCIALS: ProjectFinancials[] = [
  {
    projectId: 'proj-alpha',
    projectName: 'Project Alpha',
    projectCode: 'PA-001',
    clientName: 'Alpha Corp',
    projectType: 'Commercial',
    status: 'Active',
    location: 'New York, NY (Times Square)',
    totalAreaSqFt: 5000,
    startDate: '2026-05-01',
    endDate: '2026-11-01',
    approvalGateStatus: 'Unlocked & Approved',
    studioApprovalMilestone: 'BOQ & Final Signoff Signed by Arthur Pendelton',
    
    contractValue: 650000,
    estimatedBudget: 500000,
    approvedBudget: 450000,
    committedCost: 120000,
    actualIncurredCost: 150000,
    forecastAtCompletion: 440000,
    variance: 10000, // Positive variance = savings
    grossMargin: 210000,
    marginPercentage: 32.3,

    cashflowInvoiced: 300000,
    cashflowReceived: 250000,
    cashflowOutstanding: 50000,
    budgetHealth: 'Healthy',

    categoryBreakdown: {
      materials: { allocated: 160000, actual: 55000, committed: 45000 },
      millwork: { allocated: 95000, actual: 30000, committed: 30000 },
      ffe: { allocated: 85000, actual: 28000, committed: 25000 },
      mep: { allocated: 55000, actual: 18000, committed: 12000 },
      labor: { allocated: 40000, actual: 14000, committed: 6000 },
      civil: { allocated: 10000, actual: 4000, committed: 1500 },
      logistics: { allocated: 5000, actual: 1000, committed: 500 }
    },

    spaces: [
      {
        spaceId: 'sp-pa-1',
        spaceName: 'Executive Boardroom',
        spaceType: 'Executive Office & Studio',
        areaSqFt: 504,
        allocatedBudget: 140000,
        actualCost: 52000,
        committedCost: 40000,
        variance: 48000,
        status: 'Healthy' as any,
        finishes: {
          flooring: { name: 'Listone Giordano Herringbone Oak', cost: 42000 },
          ceiling: { name: 'Acoustic Slat Wood Suspended Ceiling', cost: 38000 },
          walls: { name: 'Bauwerk Mineral Limewash & Fluted Panels', cost: 32000 },
          millwork: { name: 'Integrated 16-Seat Walnut Boardroom Table & Credenza', cost: 20000 },
          fixtures: { name: 'Flos Architectural Linear Magnetic Downlights', cost: 8000 }
        }
      },
      {
        spaceId: 'sp-pa-2',
        spaceName: 'Open Creative Workspace',
        spaceType: 'Workstations',
        areaSqFt: 1850,
        allocatedBudget: 125000,
        actualCost: 41000,
        committedCost: 35000,
        variance: 49000,
        status: 'Healthy' as any,
        finishes: {
          flooring: { name: 'Acoustic Interface Carpet Tiles', cost: 35000 },
          ceiling: { name: 'Exposed Industrial Matte Black with Baffles', cost: 22000 },
          walls: { name: 'Magnetic Glass Whiteboards & Limewash', cost: 26000 },
          millwork: { name: 'Modular Power-Ducted Benching Desks', cost: 32000 },
          fixtures: { name: 'Indirect Continuous LED Profiles', cost: 10000 }
        }
      },
      {
        spaceId: 'sp-pa-3',
        spaceName: 'Client Reception & Lounge',
        spaceType: 'Lounge',
        areaSqFt: 920,
        allocatedBudget: 95000,
        actualCost: 32000,
        committedCost: 28000,
        variance: 35000,
        status: 'Healthy' as any,
        finishes: {
          flooring: { name: 'Seamless Terrazzo Microtopping', cost: 28000 },
          ceiling: { name: 'Curved Cove Lighting Detail', cost: 18000 },
          walls: { name: 'Bookmatched Calacatta Viola Feature Slabs', cost: 30000 },
          millwork: { name: 'Curved Fluted Oak Concierge Desk', cost: 12000 },
          fixtures: { name: 'Bespoke Brass Pendant Lighting', cost: 7000 }
        }
      },
      {
        spaceId: 'sp-pa-4',
        spaceName: 'Breakout Cafe & Pantry',
        spaceType: 'Cafeteria',
        areaSqFt: 680,
        allocatedBudget: 60000,
        actualCost: 18000,
        committedCost: 12000,
        variance: 30000,
        status: 'Healthy' as any,
        finishes: {
          flooring: { name: 'Anti-skid Porcelain Slabs', cost: 14000 },
          ceiling: { name: 'Drop Gypsum with Linear Slots', cost: 11000 },
          walls: { name: 'Handmade Zellige Glazed Tiles', cost: 16000 },
          millwork: { name: 'Solid Surface Island & Cabinetry', cost: 14000 },
          fixtures: { name: 'Low Glare Pendant Spots', cost: 5000 }
        }
      },
      {
        spaceId: 'sp-pa-5',
        spaceName: 'Executive Restrooms & Core',
        spaceType: 'Restrooms',
        areaSqFt: 450,
        allocatedBudget: 30000,
        actualCost: 7000,
        committedCost: 5000,
        variance: 18000,
        status: 'Healthy' as any,
        finishes: {
          flooring: { name: 'Continuous Pietra Grey Marble', cost: 9000 },
          ceiling: { name: 'Moisture-Resistant Acoustic Ceiling', cost: 5000 },
          walls: { name: 'Full Height Large Format Porcelain', cost: 10000 },
          millwork: { name: 'Vanity Mirror Cabinets with LED Edge', cost: 4000 },
          fixtures: { name: 'Sensor Faucets & Concealed Cisterns', cost: 2000 }
        }
      }
    ],

    laborTeam: [
      { id: 'l-1', roleName: 'Project Lead', assignedMember: 'Alara Vance', hourlyRate: 1800, hoursLogged: 34, totalCost: 61200, department: 'Management' },
      { id: 'l-2', roleName: 'Lead Designer', assignedMember: 'Marcus Sterling', hourlyRate: 1500, hoursLogged: 42, totalCost: 63000, department: 'Design' },
      { id: 'l-3', roleName: '3D Designer', assignedMember: 'Elena Rostova', hourlyRate: 1200, hoursLogged: 28, totalCost: 33600, department: 'Design' },
      { id: 'l-4', roleName: 'Draftsman', assignedMember: 'Kenji Takahashi', hourlyRate: 800, hoursLogged: 36, totalCost: 28800, department: 'Execution' },
      { id: 'l-5', roleName: 'Site Supervisor', assignedMember: 'Vikram Mehta', hourlyRate: 1000, hoursLogged: 50, totalCost: 50000, department: 'Execution' }
    ],

    invoices: [
      { id: 'inv-pa-1', milestoneName: 'Mobilization & Space Planning Signoff (40%)', percentage: 40, amount: 260000, dueDate: '2026-05-15', status: 'Paid', paidDate: '2026-05-14', invoiceNumber: 'INV-2026-0041' },
      { id: 'inv-pa-2', milestoneName: 'MEP Rough-in & Millwork Framework (25%)', percentage: 25, amount: 162500, dueDate: '2026-07-01', status: 'Paid', paidDate: '2026-06-28', invoiceNumber: 'INV-2026-0089' },
      { id: 'inv-pa-3', milestoneName: 'Flooring, Finishes & FF&E Delivery (20%)', percentage: 20, amount: 130000, dueDate: '2026-09-15', status: 'Pending', invoiceNumber: 'INV-2026-0134' },
      { id: 'inv-pa-4', milestoneName: 'Final Handover & Snagging Clearance (15%)', percentage: 15, amount: 97500, dueDate: '2026-11-01', status: 'Pending', invoiceNumber: 'INV-2026-0182' }
    ],

    vendorPOs: [
      { id: 'po-1', poNumber: 'PO-2026-0104', vendorName: 'Listone Giordano Timber Ltd', category: 'Flooring', orderDate: '2026-05-18', deliveryDate: '2026-06-10', totalAmount: 42000, paidAmount: 42000, status: 'Fulfilled', itemsCount: 480 },
      { id: 'po-2', poNumber: 'PO-2026-0118', vendorName: 'Bauwerk Mineral Coatings', category: 'Paint & Finishes', orderDate: '2026-05-22', deliveryDate: '2026-06-05', totalAmount: 18500, paidAmount: 18500, status: 'Fulfilled', itemsCount: 35 },
      { id: 'po-3', poNumber: 'PO-2026-0142', vendorName: 'Flos Architectural Lighting', category: 'Lighting & MEP', orderDate: '2026-06-02', deliveryDate: '2026-07-15', totalAmount: 28000, paidAmount: 14000, status: 'Partially Paid', itemsCount: 64 },
      { id: 'po-4', poNumber: 'PO-2026-0160', vendorName: 'Poltrona Frau Commercial', category: 'FF&E', orderDate: '2026-06-15', deliveryDate: '2026-08-20', totalAmount: 38000, paidAmount: 19000, status: 'Partially Paid', itemsCount: 12 }
    ]
  },
  {
    projectId: 'proj-nexa',
    projectName: 'Nexa Skyline',
    projectCode: 'NS-003',
    clientName: 'Nexa Real Estate / Sophia Nexa',
    projectType: 'Residential Penthouse',
    status: 'Active',
    location: 'San Francisco, CA (Bay Bridge Skyline)',
    totalAreaSqFt: 12000,
    startDate: '2026-06-01',
    endDate: '2027-06-01',
    approvalGateStatus: 'Unlocked & Approved',
    studioApprovalMilestone: 'Space Planning & Presentation Approved by Sophia Nexa',

    contractValue: 1650000,
    estimatedBudget: 1200000,
    approvedBudget: 1200000,
    committedCost: 450000,
    actualIncurredCost: 300000,
    forecastAtCompletion: 1180000,
    variance: 20000,
    grossMargin: 470000,
    marginPercentage: 28.5,

    cashflowInvoiced: 600000,
    cashflowReceived: 550000,
    cashflowOutstanding: 50000,
    budgetHealth: 'Healthy',

    categoryBreakdown: {
      materials: { allocated: 420000, actual: 110000, committed: 160000 },
      millwork: { allocated: 280000, actual: 75000, committed: 110000 },
      ffe: { allocated: 240000, actual: 60000, committed: 95000 },
      mep: { allocated: 120000, actual: 30000, committed: 45000 },
      labor: { allocated: 100000, actual: 20000, committed: 30000 },
      civil: { allocated: 30000, actual: 4000, committed: 8000 },
      logistics: { allocated: 10000, actual: 1000, committed: 2000 }
    },

    spaces: [
      {
        spaceId: 'sp-ns-1',
        spaceName: 'Master Bedroom Suite & Spa Ensuite',
        spaceType: 'Master Suite',
        areaSqFt: 1450,
        allocatedBudget: 340000,
        actualCost: 88000,
        committedCost: 130000,
        variance: 122000,
        status: 'Healthy' as any,
        finishes: {
          flooring: { name: 'Smoked French Chevron Oak Flooring', cost: 95000 },
          ceiling: { name: 'Bespoke Curved Plaster & Concealed Linear LED', cost: 58000 },
          walls: { name: 'Silk Upholstered Panels & Calacatta Viola Slabs', cost: 115000 },
          millwork: { name: 'Full Height Tinted Glass Walk-in Wardrobes', cost: 52000 },
          fixtures: { name: 'Antoniolupi Freestanding Flumood Bathtub & Brassware', cost: 20000 }
        }
      },
      {
        spaceId: 'sp-ns-2',
        spaceName: 'Grand Living Pavilion & Double-Height Gallery',
        spaceType: 'Living Area',
        areaSqFt: 3200,
        allocatedBudget: 420000,
        actualCost: 105000,
        committedCost: 165000,
        variance: 150000,
        status: 'Healthy' as any,
        finishes: {
          flooring: { name: 'Honed Grigio Carnico Italian Marble', cost: 145000 },
          ceiling: { name: '24ft Acoustic Micro-Perforated Timber Ceiling', cost: 95000 },
          walls: { name: 'Natural Travertine Cladding with Bronze Inlays', cost: 110000 },
          millwork: { name: 'Integrated Floating Marble Fireplace Hearth', cost: 42000 },
          fixtures: { name: 'Ochre Seed Cloud Chandelier Array', cost: 28000 }
        }
      },
      {
        spaceId: 'sp-ns-3',
        spaceName: 'Chef Kitchen & Temperature Controlled Wine Vault',
        spaceType: 'Kitchen',
        areaSqFt: 1100,
        allocatedBudget: 260000,
        actualCost: 68000,
        committedCost: 95000,
        variance: 97000,
        status: 'Healthy' as any,
        finishes: {
          flooring: { name: 'Monolithic Terrazzo with Brass Matrix', cost: 48000 },
          ceiling: { name: 'Seamless Flush Gypsum with Magnetic Track Channels', cost: 28000 },
          walls: { name: 'Fumed Eucalyptus Wood Panels & Stainless Steel Backsplash', cost: 68000 },
          millwork: { name: 'Boffi Handleless Kitchen with Calacatta Gold Island', cost: 92000 },
          fixtures: { name: 'Gaggenau 400 Series Full Culinary Suite', cost: 24000 }
        }
      },
      {
        spaceId: 'sp-ns-4',
        spaceName: 'Private Skyline Terrace & Heated Infinity Plunge Pool',
        spaceType: 'Outdoor Terrace',
        areaSqFt: 2200,
        allocatedBudget: 180000,
        actualCost: 39000,
        committedCost: 60000,
        variance: 81000,
        status: 'Healthy' as any,
        finishes: {
          flooring: { name: 'FSC-Certified Burmese Teak Outdoor Decking', cost: 62000 },
          ceiling: { name: 'Motorized Architectural Louvered Pergola', cost: 45000 },
          walls: { name: 'Living Green Wall with Automated Irrigation', cost: 38000 },
          millwork: { name: 'Outdoor Stainless Steel BBQ Kitchenette & Firepit', cost: 25000 },
          fixtures: { name: 'IP67 Submersible & Landscape Accent Spotlights', cost: 10000 }
        }
      }
    ],

    laborTeam: [
      { id: 'l-ns-1', roleName: 'Project Lead', assignedMember: 'Alara Vance', hourlyRate: 1800, hoursLogged: 55, totalCost: 99000, department: 'Management' },
      { id: 'l-ns-2', roleName: 'Lead Designer', assignedMember: 'Chloe Dubois', hourlyRate: 1600, hoursLogged: 68, totalCost: 108800, department: 'Design' },
      { id: 'l-ns-3', roleName: '3D Visualizer', assignedMember: 'Elena Rostova', hourlyRate: 1200, hoursLogged: 45, totalCost: 54000, department: 'Design' },
      { id: 'l-ns-4', roleName: 'Site Supervisor', assignedMember: 'Vikram Mehta', hourlyRate: 1000, hoursLogged: 80, totalCost: 80000, department: 'Execution' }
    ],

    invoices: [
      { id: 'inv-ns-1', milestoneName: 'Contract Sign-off & Concept Design Milestone (30%)', percentage: 30, amount: 495000, dueDate: '2026-06-15', status: 'Paid', paidDate: '2026-06-12', invoiceNumber: 'INV-2026-0062' },
      { id: 'inv-ns-2', milestoneName: 'Space Planning & Material Procurement Deposit (25%)', percentage: 25, amount: 412500, dueDate: '2026-09-01', status: 'Paid', paidDate: '2026-08-28', invoiceNumber: 'INV-2026-0112' },
      { id: 'inv-ns-3', milestoneName: 'Civil, MEP & Structural Completion (25%)', percentage: 25, amount: 412500, dueDate: '2026-12-15', status: 'Pending', invoiceNumber: 'INV-2026-0158' },
      { id: 'inv-ns-4', milestoneName: 'Final FF&E Styling & Project Handover (20%)', percentage: 20, amount: 330000, dueDate: '2027-06-01', status: 'Pending', invoiceNumber: 'INV-2027-0021' }
    ],

    vendorPOs: [
      { id: 'po-ns-1', poNumber: 'PO-2026-0210', vendorName: 'Antolini Italy Stone Consortium', category: 'Marble & Stone', orderDate: '2026-06-18', deliveryDate: '2026-08-10', totalAmount: 185000, paidAmount: 92500, status: 'Partially Paid', itemsCount: 42 },
      { id: 'po-ns-2', poNumber: 'PO-2026-0235', vendorName: 'Boffi Kitchens & Bath', category: 'Custom Millwork', orderDate: '2026-06-25', deliveryDate: '2026-09-15', totalAmount: 140000, paidAmount: 70000, status: 'Partially Paid', itemsCount: 18 },
      { id: 'po-ns-3', poNumber: 'PO-2026-0280', vendorName: 'B&B Italia Contract Furniture', category: 'FF&E', orderDate: '2026-07-10', deliveryDate: '2026-10-30', totalAmount: 95000, paidAmount: 47500, status: 'Partially Paid', itemsCount: 26 }
    ]
  },
  {
    projectId: 'proj-comp',
    projectName: 'Company Workspace',
    projectCode: 'CW-002',
    clientName: 'Internal / Company HQ',
    projectType: 'Commercial HQ',
    status: 'Active',
    location: 'San Francisco, CA',
    totalAreaSqFt: 12000,
    startDate: '2026-06-01',
    endDate: '2027-06-01',
    approvalGateStatus: 'Unlocked & Approved',
    studioApprovalMilestone: 'Space Planning Approved by Internal Board',

    contractValue: 1400000,
    estimatedBudget: 1200000,
    approvedBudget: 1200000,
    committedCost: 280000,
    actualIncurredCost: 300000,
    forecastAtCompletion: 1220000,
    variance: -20000, // Slight overrun
    grossMargin: 180000,
    marginPercentage: 12.8,

    cashflowInvoiced: 600000,
    cashflowReceived: 600000,
    cashflowOutstanding: 0,
    budgetHealth: 'Caution',

    categoryBreakdown: {
      materials: { allocated: 450000, actual: 120000, committed: 110000 },
      millwork: { allocated: 300000, actual: 80000, committed: 70000 },
      ffe: { allocated: 250000, actual: 60000, committed: 60000 },
      mep: { allocated: 100000, actual: 25000, committed: 25000 },
      labor: { allocated: 75000, actual: 12000, committed: 12000 },
      civil: { allocated: 20000, actual: 2500, committed: 2500 },
      logistics: { allocated: 5000, actual: 500, committed: 500 }
    },

    spaces: [
      {
        spaceId: 'sp-cw-1',
        spaceName: 'Engineering Town Hall & Amphitheatre',
        spaceType: 'Auditorium',
        areaSqFt: 4500,
        allocatedBudget: 480000,
        actualCost: 130000,
        committedCost: 115000,
        variance: 235000,
        status: 'Caution' as any,
        finishes: {
          flooring: { name: 'Tiered Oak Stepped Bleachers', cost: 160000 },
          ceiling: { name: 'Acoustic Baffle Array with Rigging', cost: 120000 },
          walls: { name: 'Acoustic Felt & LED Wall Display Screen', cost: 140000 },
          millwork: { name: 'Presenter Podium & Audio Control Desk', cost: 35000 },
          fixtures: { name: 'DMX Studio Stage & Overhead Lighting', cost: 25000 }
        }
      },
      {
        spaceId: 'sp-cw-2',
        spaceName: 'Collaborative Open Pods',
        spaceType: 'Workstations',
        areaSqFt: 5500,
        allocatedBudget: 520000,
        actualCost: 120000,
        committedCost: 115000,
        variance: 285000,
        status: 'Healthy' as any,
        finishes: {
          flooring: { name: 'Cushioned Acoustic Carpet Planks', cost: 150000 },
          ceiling: { name: 'Floating Hexagonal Cloud Panels', cost: 110000 },
          walls: { name: 'Writeable Magnetic Glass Wall Systems', cost: 120000 },
          millwork: { name: 'Electric Height-Adjustable Bench Desking', cost: 105000 },
          fixtures: { name: 'Glared-Controlled Human Centric LED', cost: 35000 }
        }
      }
    ],

    laborTeam: [
      { id: 'l-cw-1', roleName: 'Project Lead', assignedMember: 'Marcus Sterling', hourlyRate: 1500, hoursLogged: 40, totalCost: 60000, department: 'Management' },
      { id: 'l-cw-2', roleName: 'Lead Designer', assignedMember: 'Chloe Dubois', hourlyRate: 1600, hoursLogged: 35, totalCost: 56000, department: 'Design' },
      { id: 'l-cw-3', roleName: 'Draftsman', assignedMember: 'Kenji Takahashi', hourlyRate: 800, hoursLogged: 45, totalCost: 36000, department: 'Execution' }
    ],

    invoices: [
      { id: 'inv-cw-1', milestoneName: 'Internal Capital Allocation Phase 1', percentage: 50, amount: 600000, dueDate: '2026-06-01', status: 'Paid', paidDate: '2026-06-01', invoiceNumber: 'INT-CW-01' },
      { id: 'inv-cw-2', milestoneName: 'Internal Capital Allocation Phase 2', percentage: 50, amount: 600000, dueDate: '2026-12-01', status: 'Pending', invoiceNumber: 'INT-CW-02' }
    ],

    vendorPOs: [
      { id: 'po-cw-1', poNumber: 'PO-2026-0301', vendorName: 'Steelcase Worksystems', category: 'FF&E', orderDate: '2026-06-10', deliveryDate: '2026-08-01', totalAmount: 160000, paidAmount: 160000, status: 'Fulfilled', itemsCount: 85 }
    ]
  },
  {
    projectId: 'proj-acme',
    projectName: 'Acme Corp Office',
    projectCode: 'ACQ-005',
    clientName: 'Acme Corporation',
    projectType: 'Commercial',
    status: 'On Hold',
    location: 'Austin, TX',
    totalAreaSqFt: 8000,
    startDate: '2026-08-01',
    endDate: '2027-02-01',
    approvalGateStatus: 'Pending Studio Signoff',
    studioApprovalMilestone: 'Concept Design Review in Progress',

    contractValue: 1050000,
    estimatedBudget: 800000,
    approvedBudget: 750000,
    committedCost: 50000,
    actualIncurredCost: 95000,
    forecastAtCompletion: 765000,
    variance: -15000,
    grossMargin: 285000,
    marginPercentage: 27.1,

    cashflowInvoiced: 200000,
    cashflowReceived: 100000,
    cashflowOutstanding: 100000,
    budgetHealth: 'Caution',

    categoryBreakdown: {
      materials: { allocated: 280000, actual: 35000, committed: 20000 },
      millwork: { allocated: 180000, actual: 20000, committed: 15000 },
      ffe: { allocated: 150000, actual: 15000, committed: 10000 },
      mep: { allocated: 80000, actual: 15000, committed: 5000 },
      labor: { allocated: 50000, actual: 8000, committed: 0 },
      civil: { allocated: 8000, actual: 1500, committed: 0 },
      logistics: { allocated: 2000, actual: 500, committed: 0 }
    },

    spaces: [
      {
        spaceId: 'sp-ac-1',
        spaceName: 'Regional Innovation Lab',
        spaceType: 'R&D',
        areaSqFt: 3800,
        allocatedBudget: 360000,
        actualCost: 45000,
        committedCost: 25000,
        variance: 290000,
        status: 'Caution' as any,
        finishes: {
          flooring: { name: 'ESD Anti-Static Seamless Vinyl', cost: 85000 },
          ceiling: { name: 'Open Grid Modular Aluminium Trusses', cost: 75000 },
          walls: { name: 'Acoustic Felt & Whiteboard Cladding', cost: 95000 },
          millwork: { name: 'Heavy Duty Testing Benches', cost: 65000 },
          fixtures: { name: 'High-CRI Lab Lighting', cost: 40000 }
        }
      }
    ],

    laborTeam: [
      { id: 'l-ac-1', roleName: 'Project Lead', assignedMember: 'Marcus Sterling', hourlyRate: 1500, hoursLogged: 15, totalCost: 22500, department: 'Management' }
    ],

    invoices: [
      { id: 'inv-ac-1', milestoneName: 'Project Initiation Advance (20%)', percentage: 20, amount: 210000, dueDate: '2026-08-15', status: 'Pending', invoiceNumber: 'INV-2026-0145' }
    ],

    vendorPOs: []
  },
  {
    projectId: 'proj-team-b',
    projectName: 'Team Building Lab',
    projectCode: 'TB-004',
    clientName: 'Internal Team',
    projectType: 'Commercial',
    status: 'Active',
    location: 'New York, NY',
    totalAreaSqFt: 2000,
    startDate: '2026-07-01',
    endDate: '2026-08-01',
    approvalGateStatus: 'Unlocked & Approved',
    studioApprovalMilestone: 'Full Project Signoff Complete',

    contractValue: 65000,
    estimatedBudget: 50000,
    approvedBudget: 50000,
    committedCost: 8000,
    actualIncurredCost: 12000,
    forecastAtCompletion: 48000,
    variance: 2000,
    grossMargin: 17000,
    marginPercentage: 26.1,

    cashflowInvoiced: 50000,
    cashflowReceived: 50000,
    cashflowOutstanding: 0,
    budgetHealth: 'Healthy',

    categoryBreakdown: {
      materials: { allocated: 18000, actual: 4500, committed: 3000 },
      millwork: { allocated: 12000, actual: 3000, committed: 2500 },
      ffe: { allocated: 10000, actual: 2500, committed: 1500 },
      mep: { allocated: 6000, actual: 1200, committed: 500 },
      labor: { allocated: 3000, actual: 600, committed: 500 },
      civil: { allocated: 800, actual: 150, committed: 0 },
      logistics: { allocated: 200, actual: 50, committed: 0 }
    },

    spaces: [],
    laborTeam: [],
    invoices: [],
    vendorPOs: []
  }
];

// -------------------------------------------------------------
// INITIAL MASTER EXPENSE LEDGER (CROSS-PROJECT)
// -------------------------------------------------------------

export const MOCK_EXPENSES_LIST: CostExpense[] = [
  {
    id: 'exp-101',
    projectId: 'proj-alpha',
    projectName: 'Project Alpha',
    date: '2026-06-12',
    category: 'Materials & Finishes',
    spaceName: 'Executive Boardroom',
    vendorName: 'Listone Giordano Timber Ltd',
    amount: 42000,
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    invoiceRef: 'LG-INV-8891',
    notes: 'Natural Herringbone Oak Flooring delivery for 504 sq ft boardroom.',
    receiptUrl: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'exp-102',
    projectId: 'proj-alpha',
    projectName: 'Project Alpha',
    date: '2026-06-18',
    category: 'Materials & Finishes',
    spaceName: 'Executive Boardroom',
    vendorName: 'Bauwerk Mineral Coatings',
    amount: 18500,
    paymentMethod: 'Wire / ACH',
    status: 'Paid',
    invoiceRef: 'BW-2026-042',
    notes: 'Limewash mineral paint for acoustic wall surfaces.',
    receiptUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'exp-103',
    projectId: 'proj-nexa',
    projectName: 'Nexa Skyline',
    date: '2026-06-22',
    category: 'Materials & Finishes',
    spaceName: 'Master Bedroom Suite & Spa Ensuite',
    vendorName: 'Antolini Italy Stone Consortium',
    amount: 92500,
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    invoiceRef: 'ANT-IT-4490',
    notes: 'Advance deposit for Calacatta Viola bookmatched marble slabs.',
    receiptUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'exp-104',
    projectId: 'proj-nexa',
    projectName: 'Nexa Skyline',
    date: '2026-07-04',
    category: 'Millwork & Joinery',
    spaceName: 'Grand Living Pavilion & Double-Height Gallery',
    vendorName: 'Boffi Kitchens & Bath',
    amount: 70000,
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    invoiceRef: 'BOF-SF-019',
    notes: 'Custom millwork cabinetry framework mobilization.',
    receiptUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'exp-105',
    projectId: 'proj-alpha',
    projectName: 'Project Alpha',
    date: '2026-07-15',
    category: 'MEP & Lighting',
    spaceName: 'Executive Boardroom',
    vendorName: 'Flos Architectural Lighting',
    amount: 14000,
    paymentMethod: 'Credit Card',
    status: 'Paid',
    invoiceRef: 'FLOS-US-8910',
    notes: 'Recessed magnetic track lighting downlights batch 1.',
    receiptUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'exp-106',
    projectId: 'proj-comp',
    projectName: 'Company Workspace',
    date: '2026-07-20',
    category: 'FF&E & Furniture',
    spaceName: 'Collaborative Open Pods',
    vendorName: 'Steelcase Worksystems',
    amount: 160000,
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    invoiceRef: 'SC-HQ-2026',
    notes: 'Sit-stand height adjustable bencher desks and ergonomic armchairs.',
    receiptUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'exp-107',
    projectId: 'proj-alpha',
    projectName: 'Project Alpha',
    date: '2026-08-01',
    category: 'Labor & Supervision',
    spaceName: 'All Spaces',
    vendorName: 'Internal Studio Design Payroll',
    amount: 14000,
    paymentMethod: 'Bank Transfer',
    status: 'Approved',
    invoiceRef: 'PAYROLL-PA-JUL26',
    notes: 'Project Lead and 3D visualizer hours billing for July milestone.'
  },
  {
    id: 'exp-108',
    projectId: 'proj-nexa',
    projectName: 'Nexa Skyline',
    date: '2026-08-10',
    category: 'FF&E & Furniture',
    spaceName: 'Grand Living Pavilion & Double-Height Gallery',
    vendorName: 'B&B Italia Contract Furniture',
    amount: 47500,
    paymentMethod: 'Wire / ACH',
    status: 'Pending',
    invoiceRef: 'BBI-2026-781',
    notes: 'Camaleonda modular sofa in cognac boucle fabric deposit.'
  },
  {
    id: 'exp-109',
    projectId: 'proj-acme',
    projectName: 'Acme Corp Office',
    date: '2026-08-18',
    category: 'Materials & Finishes',
    spaceName: 'Regional Innovation Lab',
    vendorName: 'Forbo Flooring Systems',
    amount: 35000,
    paymentMethod: 'Cheque',
    status: 'Paid',
    invoiceRef: 'FORBO-ATX-101',
    notes: 'Anti-static ESD vinyl rolls for lab space.'
  }
];

export function calculatePortfolioSummary(projects: ProjectFinancials[]): PortfolioSummary {
  const summary: PortfolioSummary = {
    totalPortfolioContractValue: 0,
    totalPortfolioApprovedBudget: 0,
    totalPortfolioIncurredCost: 0,
    totalPortfolioCommittedCost: 0,
    totalPortfolioRemainingBudget: 0,
    totalPortfolioForecastCost: 0,
    portfolioGrossMargin: 0,
    portfolioGrossMarginPercentage: 0,
    totalInvoiced: 0,
    totalCollected: 0,
    totalReceivables: 0,
    totalActiveProjects: 0,
    healthyProjectsCount: 0,
    cautionProjectsCount: 0,
    overrunProjectsCount: 0,
    burnRatePerDay: 4850,
    cashRunwayMonths: 14.2
  };

  projects.forEach((proj) => {
    summary.totalPortfolioContractValue += proj.contractValue || 0;
    summary.totalPortfolioApprovedBudget += proj.approvedBudget || 0;
    summary.totalPortfolioIncurredCost += proj.actualIncurredCost || 0;
    summary.totalPortfolioCommittedCost += proj.committedCost || 0;
    summary.totalPortfolioForecastCost += proj.forecastAtCompletion || 0;
    summary.totalInvoiced += proj.cashflowInvoiced || 0;
    summary.totalCollected += proj.cashflowReceived || 0;
    summary.totalReceivables += proj.cashflowOutstanding || 0;

    if (proj.status === 'Active') {
      summary.totalActiveProjects += 1;
    }

    if (proj.budgetHealth === 'Healthy') {
      summary.healthyProjectsCount += 1;
    } else if (proj.budgetHealth === 'Caution') {
      summary.cautionProjectsCount += 1;
    } else if (proj.budgetHealth === 'Critical Overrun') {
      summary.overrunProjectsCount += 1;
    }
  });

  summary.totalPortfolioRemainingBudget = Math.max(
    0,
    summary.totalPortfolioApprovedBudget - summary.totalPortfolioIncurredCost
  );

  summary.portfolioGrossMargin =
    summary.totalPortfolioContractValue - summary.totalPortfolioForecastCost;

  summary.portfolioGrossMarginPercentage =
    summary.totalPortfolioContractValue > 0
      ? Number(
          ((summary.portfolioGrossMargin / summary.totalPortfolioContractValue) * 100).toFixed(1)
        )
      : 0;

  return summary;
}
