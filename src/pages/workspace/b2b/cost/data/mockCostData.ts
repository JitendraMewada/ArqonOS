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
// INITIAL MASTER MOCK FINANCIALS (Demo Project)
// -------------------------------------------------------------

export const MOCK_PROJECT_FINANCIALS: ProjectFinancials[] = [
  {
    projectId: 'proj-goldmine',
    projectName: 'Demo Project',
    projectCode: 'demo-arq-001',
    clientName: 'Demo Client',
    projectType: 'Residence',
    status: 'Active',
    location: 'Demo Tower, Demo City, Demo State - 000000',
    totalAreaSqFt: 1794,
    startDate: '2026-05-01',
    endDate: '2026-12-31',
    approvalGateStatus: 'Unlocked & Approved',
    studioApprovalMilestone: 'Trade-wise Master BOQ Approved by Client',
    
    contractValue: 12500000,
    estimatedBudget: 9785823.25,
    approvedBudget: 9785823.25,
    committedCost: 2850000,
    actualIncurredCost: 3250000,
    forecastAtCompletion: 9650000,
    variance: 135823.25, // Positive variance = savings
    grossMargin: 2850000,
    marginPercentage: 22.8,

    cashflowInvoiced: 6250000,
    cashflowReceived: 5000000,
    cashflowOutstanding: 1250000,
    budgetHealth: 'Healthy',

    categoryBreakdown: {
      materials: { allocated: 2849150.50, actual: 1120000, committed: 950000 },
      millwork: { allocated: 3385910.75, actual: 980000, committed: 850000 },
      ffe: { allocated: 874750.00, actual: 280000, committed: 320000 },
      mep: { allocated: 635026.00, actual: 260000, committed: 210000 },
      labor: { allocated: 316816.00, actual: 180000, committed: 120000 },
      civil: { allocated: 196548.00, actual: 110000, committed: 80000 },
      logistics: { allocated: 1527622.00, actual: 320000, committed: 320000 }
    },

    spaces: [
      {
        spaceId: 'sp-gm-1',
        spaceName: 'Living / Dining Area',
        spaceType: 'Living Area',
        areaSqFt: 718,
        allocatedBudget: 2958252.25,
        actualCost: 1120000,
        committedCost: 950000,
        variance: 888252.25,
        status: 'On Track',
        finishes: {
          flooring: { name: 'Italian Marble with 3-Coat Diamond Polish', cost: 425000 },
          ceiling: { name: 'Gyprock Saint-Gobain False Ceiling with Cove Pelmets', cost: 185000 },
          walls: { name: 'Royale Luxury Breathable Emulsion with PU Metallic Accent Trims', cost: 240000 },
          millwork: { name: 'Custom Dining Table, Credenza & Panelling', cost: 680000 },
          fixtures: { name: 'Voltech Smart MEP & DALI-2 Dimmable Lighting System', cost: 190000 }
        }
      },
      {
        spaceId: 'sp-gm-2',
        spaceName: 'Master Bedroom',
        spaceType: 'Master Bedroom',
        areaSqFt: 318,
        allocatedBudget: 1305548.00,
        actualCost: 520000,
        committedCost: 480000,
        variance: 305548.00,
        status: 'On Track',
        finishes: {
          flooring: { name: 'Herringbone Smoked European White Oak Flooring', cost: 240000 },
          ceiling: { name: 'Recessed Tray Ceiling with Ambient Indirect Lighting', cost: 85000 },
          walls: { name: 'Textured Fluted Wall Panelling & Velvet Bed-Back Upholstery', cost: 180000 },
          millwork: { name: 'Full Height Custom Wardrobe Joinery & Dresser', cost: 420000 },
          fixtures: { name: 'Schneider Modular Plates & Warm White Linear Profiles', cost: 95000 }
        }
      },
      {
        spaceId: 'sp-gm-3',
        spaceName: 'Master Bathroom',
        spaceType: 'Master Bathroom',
        areaSqFt: 70,
        allocatedBudget: 672462.25,
        actualCost: 260000,
        committedCost: 220000,
        variance: 192462.25,
        status: 'On Track',
        finishes: {
          flooring: { name: 'Anti-skid Fluted Italian Marble & Concealed Drains', cost: 180000 },
          ceiling: { name: 'Moisture-resistant Calcium Silicate Ceiling', cost: 35000 },
          walls: { name: 'Book-matched Full-height Marble Cladding', cost: 220000 },
          millwork: { name: 'Marine Ply Floating Vanity with Quartz Top', cost: 140000 },
          fixtures: { name: 'Thermostatic Diverter & Dimmable Backlit Vanity Mirror', cost: 95000 }
        }
      },
      {
        spaceId: 'sp-gm-4',
        spaceName: 'Bedroom 1',
        spaceType: 'Bedroom',
        areaSqFt: 290,
        allocatedBudget: 1236625.25,
        actualCost: 410000,
        committedCost: 380000,
        variance: 446625.25,
        status: 'On Track',
        finishes: {
          flooring: { name: 'Vitrified Glazed Tile with Epoxy Grouting', cost: 120000 },
          ceiling: { name: 'Perimeter Cove False Ceiling with Magnetic Track Light', cost: 72000 },
          walls: { name: 'Royale Emulsion with Fluted Charcoal Accent Panel', cost: 145000 },
          millwork: { name: 'Custom Wardrobe, Integrated Desk & Bed Base', cost: 380000 },
          fixtures: { name: 'Recessed Anti-Glare Spotlights & Bedside Sconces', cost: 68000 }
        }
      },
      {
        spaceId: 'sp-gm-5',
        spaceName: 'Bedroom 1 Bathroom',
        spaceType: 'Bathroom',
        areaSqFt: 46,
        allocatedBudget: 555265.75,
        actualCost: 210000,
        committedCost: 190000,
        variance: 155265.75,
        status: 'On Track',
        finishes: {
          flooring: { name: 'Matte Anti-skid Porcelain Slab Flooring', cost: 95000 },
          ceiling: { name: 'Grid Aluminum Louver Ceiling with Exhaust Trough', cost: 28000 },
          walls: { name: 'Full Height Terrazzo Tile Cladding', cost: 165000 },
          millwork: { name: 'Concealed Cistern Ledge & Floating Under-Counter Unit', cost: 85000 },
          fixtures: { name: 'Concealed Rain Shower & Single Lever Basin Mixer', cost: 72000 }
        }
      },
      {
        spaceId: 'sp-gm-6',
        spaceName: 'Children Bedroom',
        spaceType: 'Bedroom',
        areaSqFt: 164,
        allocatedBudget: 692550.00,
        actualCost: 250000,
        committedCost: 220000,
        variance: 222550.00,
        status: 'On Track',
        finishes: {
          flooring: { name: 'Acoustic Cork / Wooden Floor Laminate', cost: 88000 },
          ceiling: { name: 'Minimalist POP Ceiling with Starry Light Points', cost: 42000 },
          walls: { name: 'Washable Silk Sheen Emulsion with Magnetic Wall Area', cost: 95000 },
          millwork: { name: 'Bunk Bed Unit, Study Station & Bookshelves', cost: 240000 },
          fixtures: { name: 'High CRI Eye-Safety Study Luminaire & Fun Pendant', cost: 45000 }
        }
      },
      {
        spaceId: 'sp-gm-7',
        spaceName: 'Powder Room',
        spaceType: 'Bathroom',
        areaSqFt: 42,
        allocatedBudget: 507038.00,
        actualCost: 180000,
        committedCost: 150000,
        variance: 177038.00,
        status: 'On Track',
        finishes: {
          flooring: { name: 'Dark Marquina Marble Tile with Brass Inlay', cost: 75000 },
          ceiling: { name: 'Deep Charcoal Moisture-proof POP Ceiling', cost: 22000 },
          walls: { name: 'Metallic Textured Wallcovering & Fluted Stone Backsplash', cost: 120000 },
          millwork: { name: 'Curved Teak Vanity Console with Stone Basin', cost: 95000 },
          fixtures: { name: 'Brushed Brass Wall-Mount Faucet & Pendant Accent Light', cost: 68000 }
        }
      },
      {
        spaceId: 'sp-gm-8',
        spaceName: 'Kitchen',
        spaceType: 'Kitchen',
        areaSqFt: 109,
        allocatedBudget: 517032.25,
        actualCost: 190000,
        committedCost: 160000,
        variance: 167032.25,
        status: 'On Track',
        finishes: {
          flooring: { name: 'Heavy-duty Large Format Anti-skid Tiles', cost: 65000 },
          ceiling: { name: 'Saint-Gobain Moisture Shield Ceiling with Task Lights', cost: 35000 },
          walls: { name: 'Quartz Slab Backsplash with Epoxy Grouting', cost: 110000 },
          millwork: { name: 'Acrylic Marine-Ply Modular Kitchen Cabinets & Soft-close Tandem', cost: 220000 },
          fixtures: { name: 'Under-Cabinet High-Lumen Linear LED & Pull-Out Faucet', cost: 58000 }
        }
      },
      {
        spaceId: 'sp-gm-9',
        spaceName: 'Utility Area',
        spaceType: 'Utility',
        areaSqFt: 37,
        allocatedBudget: 444049.50,
        actualCost: 130000,
        committedCost: 100000,
        variance: 214049.50,
        status: 'On Track',
        finishes: {
          flooring: { name: 'Rustic Non-slip Ceramic Tiles', cost: 35000 },
          ceiling: { name: 'POP Surface Coat with Waterproof Primer', cost: 18000 },
          walls: { name: 'Full Height Ceramic Dado Tiles with Waterproof Mortar', cost: 75000 },
          millwork: { name: 'Louvered Shutter Cabinet for Washing Equipment', cost: 65000 },
          fixtures: { name: 'Utility Bib Cock & Weatherproof Modular Points', cost: 32000 }
        }
      }
    ],

    laborTeam: [
      { id: 'l-gm-1', roleName: 'Project Lead', assignedMember: 'Jitendra Mewada', hourlyRate: 2000, hoursLogged: 45, totalCost: 90000, department: 'Management' },
      { id: 'l-gm-2', roleName: 'Lead Designer', assignedMember: 'Marcus Sterling', hourlyRate: 1800, hoursLogged: 40, totalCost: 72000, department: 'Design' },
      { id: 'l-gm-3', roleName: 'Site Supervisor', assignedMember: 'Vikram Mehta', hourlyRate: 1000, hoursLogged: 48, totalCost: 48000, department: 'Execution' }
    ],

    invoices: [
      { id: 'inv-gm-1', milestoneName: 'Mobilization Advance (25%)', percentage: 25, amount: 3125000, dueDate: '2026-05-05', status: 'Paid', paidDate: '2026-05-06', invoiceNumber: 'INV-2026-GM01' },
      { id: 'inv-gm-2', milestoneName: 'Studio Design & Space Approval (25%)', percentage: 25, amount: 3125000, dueDate: '2026-05-30', status: 'Paid', paidDate: '2026-05-29', invoiceNumber: 'INV-2026-GM02' },
      { id: 'inv-gm-3', milestoneName: 'Mid-Stage Civil & Millwork Execution (25%)', percentage: 25, amount: 3125000, dueDate: '2026-08-15', status: 'Pending', invoiceNumber: 'INV-2026-GM03' },
      { id: 'inv-gm-4', milestoneName: 'Final Handover & Snag Rectification (25%)', percentage: 25, amount: 3125000, dueDate: '2026-12-15', status: 'Pending', invoiceNumber: 'INV-2026-GM04' }
    ],

    vendorPOs: [
      { id: 'po-gm-1', poNumber: 'PO-2026-GM-01', vendorName: 'Apex Civil Infra & Masonry', category: 'Civil & Italian Marble', orderDate: '2026-05-15', deliveryDate: '2026-06-15', totalAmount: 1450000, paidAmount: 1000000, status: 'Partially Paid', itemsCount: 42 },
      { id: 'po-gm-2', poNumber: 'PO-2026-GM-02', vendorName: 'Gyprock & Elite False Ceilings', category: 'POP & Ceilings', orderDate: '2026-05-20', deliveryDate: '2026-06-30', totalAmount: 580000, paidAmount: 400000, status: 'Partially Paid', itemsCount: 28 },
      { id: 'po-gm-3', poNumber: 'PO-2026-GM-03', vendorName: 'Voltech Smart MEP & Power Systems', category: 'Electrical & Automation', orderDate: '2026-05-22', deliveryDate: '2026-07-15', totalAmount: 920000, paidAmount: 500000, status: 'Partially Paid', itemsCount: 65 },
      { id: 'po-gm-4', poNumber: 'PO-2026-GM-04', vendorName: 'MasterCraft Architectural Joinery', category: 'Carpentry & Joinery', orderDate: '2026-05-28', deliveryDate: '2026-08-30', totalAmount: 3850000, paidAmount: 1350000, status: 'Partially Paid', itemsCount: 120 }
    ]
  }
];

// -------------------------------------------------------------
// INITIAL MASTER EXPENSE LEDGER (Demo Project)
// -------------------------------------------------------------

export const MOCK_EXPENSES_LIST: CostExpense[] = [
  {
    id: 'exp-gm-101',
    projectId: 'proj-goldmine',
    projectName: 'Demo Project',
    date: '2026-05-18',
    category: 'Materials & Finishes',
    spaceName: 'Living / Dining Area',
    vendorName: 'Apex Civil Infra & Masonry',
    amount: 650000,
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    invoiceRef: 'APEX-MUM-2026-112',
    notes: 'Italian Marble Dyna/Botticino 718 sq.ft procurement advance and surface preparation.',
    receiptUrl: 'https://images.unsplash.com/photo-1581421046129-078553ec162c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'exp-gm-102',
    projectId: 'proj-goldmine',
    projectName: 'Demo Project',
    date: '2026-05-25',
    category: 'Materials & Finishes',
    spaceName: 'Living / Dining Area',
    vendorName: 'Gyprock & Elite False Ceilings',
    amount: 185000,
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    invoiceRef: 'GYP-2026-089',
    notes: 'GI channel framing and Gyproc 12mm boards for living room ceiling.',
    receiptUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'exp-gm-103',
    projectId: 'proj-goldmine',
    projectName: 'Demo Project',
    date: '2026-06-02',
    category: 'MEP & Lighting',
    spaceName: 'Living / Dining Area',
    vendorName: 'Voltech Smart MEP & Power Systems',
    amount: 320000,
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    invoiceRef: 'VOL-2026-441',
    notes: 'FRLS Copper wire spools, PVC conduits, and Schneider switch plate batch 1.',
    receiptUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'exp-gm-104',
    projectId: 'proj-goldmine',
    projectName: 'Demo Project',
    date: '2026-06-15',
    category: 'Millwork & Joinery',
    spaceName: 'Master Bedroom',
    vendorName: 'MasterCraft Architectural Joinery',
    amount: 850000,
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    invoiceRef: 'MCJ-2026-802',
    notes: 'Marine-grade commercial ply delivery and natural teak veneer pressing for master wardrobes.',
    receiptUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'exp-gm-105',
    projectId: 'proj-goldmine',
    projectName: 'Demo Project',
    date: '2026-06-20',
    category: 'Materials & Finishes',
    spaceName: 'Master Bathroom',
    vendorName: 'Apex Civil Infra & Masonry',
    amount: 260000,
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    invoiceRef: 'APEX-MUM-2026-154',
    notes: 'Full height Italian marble wall cladding and anti-skid floor stone in Master Bathroom.',
    receiptUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'exp-gm-106',
    projectId: 'proj-goldmine',
    projectName: 'Demo Project',
    date: '2026-06-25',
    category: 'Labor & Supervision',
    spaceName: 'All Spaces',
    vendorName: 'Internal Studio Design Payroll',
    amount: 210000,
    paymentMethod: 'Bank Transfer',
    status: 'Approved',
    invoiceRef: 'PAYROLL-DEMO-JUN26',
    notes: 'Project Lead, Site Supervisor, and Lead Designer site supervision charges for June milestone.'
  },
  {
    id: 'exp-gm-107',
    projectId: 'proj-goldmine',
    projectName: 'Demo Project',
    date: '2026-07-02',
    category: 'Millwork & Joinery',
    spaceName: 'Kitchen',
    vendorName: 'MasterCraft Architectural Joinery',
    amount: 190000,
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    invoiceRef: 'MCJ-2026-890',
    notes: 'BWP Marine-Ply Modular Kitchen carcasses and Blum tandem soft-close hardware.',
    receiptUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'exp-gm-108',
    projectId: 'proj-goldmine',
    projectName: 'Demo Project',
    date: '2026-07-10',
    category: 'FF&E & Furniture',
    spaceName: 'Living / Dining Area',
    vendorName: 'Artefact Luxury Loose Furniture',
    amount: 280000,
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    invoiceRef: 'ART-2026-552',
    notes: 'Italian Statuario 8-seater dining table & upholstered chairs batch 1 delivery.',
    receiptUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'exp-gm-109',
    projectId: 'proj-goldmine',
    projectName: 'Demo Project',
    date: '2026-07-15',
    category: 'MEP & Lighting',
    spaceName: 'Bedroom 1',
    vendorName: 'Lumina Architectural Illumination',
    amount: 115000,
    paymentMethod: 'Credit Card',
    status: 'Paid',
    invoiceRef: 'LUM-2026-118',
    notes: 'High CRI 24V LED Cove Strips, MeanWell Drivers, and anti-glare downlights.',
    receiptUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'exp-gm-110',
    projectId: 'proj-goldmine',
    projectName: 'Demo Project',
    date: '2026-07-22',
    category: 'Civil & Demolition',
    spaceName: 'Powder Room',
    vendorName: 'Apex Civil Infra & Masonry',
    amount: 190000,
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    invoiceRef: 'APEX-MUM-2026-201',
    notes: 'Plumbing line modifications, concealed wall-hung WC cistern bracket, and marble base.',
    receiptUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
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
    burnRatePerDay: 18500,
    cashRunwayMonths: 18.5
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
