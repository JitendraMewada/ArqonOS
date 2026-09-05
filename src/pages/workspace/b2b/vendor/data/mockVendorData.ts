export interface Vendor {
  id: string;
  name: string;
  companyCode: string;
  category: 
    | 'Millwork & Custom Joinery'
    | 'Civil & Structural Materials'
    | 'Electrical, MEP & Lighting'
    | 'FF&E & Luxury Furniture'
    | 'Stone, Marble & Tiles'
    | 'Glass, Glazing & Metal Works'
    | 'Paint, Textures & Wall Finishes'
    | 'HVAC, Automation & Smart Home'
    | 'Plumbing & Sanitaryware'
    | 'Soft Furnishings & Drapes';
  rating: number; // 1 to 5
  tier: 'Tier 1 Preferred' | 'Tier 2 Approved' | 'Tier 3 Provisional' | 'Under Review';
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  taxId: string; // GST / VAT / Tax ID
  paymentTerms: 'Net 15' | 'Net 30' | 'Net 45' | '50% Advance / 50% on Delivery' | '100% Advance' | 'Immediate';
  bankDetails: {
    accountName: string;
    bankName: string;
    accountNumber: string;
    ifscSwift: string;
  };
  complianceStatus: 'Verified' | 'Pending Audit' | 'Expiring Documents' | 'Non-Compliant';
  onTimeDeliveryRate: number; // percentage
  qualityScore: number; // percentage
  activeProjects: string[]; // project codes
  totalSpend: number;
  activeOrdersCount: number;
  catalogsCount: number;
  leadTimeWeeks: number;
  notes: string;
}

export interface POLineItem {
  id: string;
  itemDescription: string;
  specification: string;
  quantity: number;
  unit: 'Sq.Ft' | 'R.Ft' | 'Pcs' | 'Sets' | 'Bags' | 'Mtrs' | 'Kg' | 'Lumpsum';
  unitRate: number;
  totalAmount: number;
  studioSpaceRef?: string; // e.g. "Master Bedroom", "Formal Living"
  studioDrawingRef?: string; // e.g. "DWG-MLW-004"
  inspectionStatus: 'Pending Inspection' | 'Passed QC' | 'Defective / Rejected';
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  projectId: string;
  projectName: string;
  projectCode: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  issueDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  lineItems: POLineItem[];
  subtotal: number;
  taxRatePercentage: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'Paid' | 'Partially Paid' | 'Unpaid';
  deliveryStatus: 
    | 'Draft'
    | 'Issued'
    | 'In Production'
    | 'Dispatched'
    | 'In Transit'
    | 'Delivered'
    | 'Inspected & Accepted'
    | 'Disputed / Damaged';
  shippingAddress: string;
  siteSupervisorContact: string;
  procurementOfficer: string;
  terms: string;
  costSynced: boolean;
  notes: string;
}

export interface RFQVendorBid {
  vendorId: string;
  vendorName: string;
  bidAmount: number;
  leadTimeDays: number;
  submittedDate: string;
  status: 'Submitted' | 'Under Evaluation' | 'Awarded' | 'Declined';
  remarks: string;
}

export interface RFQ {
  id: string;
  rfqNumber: string;
  projectId: string;
  projectName: string;
  projectCode: string;
  title: string;
  category: string;
  createdDate: string;
  deadlineDate: string;
  status: 'Open for Bids' | 'Evaluation Phase' | 'Awarded & Converted to PO' | 'Closed';
  targetDeliveryDate: string;
  specifications: string;
  estimatedBudget: number;
  items: {
    description: string;
    quantity: number;
    unit: string;
    targetSpec: string;
  }[];
  invitedVendors: string[]; // vendor IDs
  bids: RFQVendorBid[];
  awardedVendorId?: string;
}

export interface VendorContract {
  id: string;
  contractNumber: string;
  title: string;
  vendorId: string;
  vendorName: string;
  projectId?: string;
  projectName?: string;
  projectCode?: string;
  contractType: 
    | 'Master Services Agreement (MSA)'
    | 'Project Turnkey Subcontract'
    | 'Material Supply Agreement'
    | 'Annual Rate Card Contract'
    | 'Warranty & Maintenance SLA';
  startDate: string;
  endDate: string;
  renewalAlertDate: string;
  totalContractValue: number;
  paymentMilestones: string[];
  penaltyClauses: string;
  warrantyPeriodMonths: number;
  insurancePolicyNumber: string;
  status: 'Active' | 'Expiring Soon' | 'Under Review' | 'Expired' | 'Renewed';
  signedByVendor: string;
  signedByArqon: string;
  governingLaw: string;
}

export interface DeliveryShipment {
  id: string;
  trackingNumber: string;
  poNumber: string;
  vendorName: string;
  projectName: string;
  projectCode: string;
  carrier: string;
  driverContact?: string;
  vehicleNumber?: string;
  originCity: string;
  destinationSite: string;
  dispatchDate: string;
  estimatedArrival: string;
  status: 'Pickup Scheduled' | 'In Transit' | 'Out for Site Delivery' | 'Delivered to Site' | 'Delayed / Alert';
  currentLocation: string;
  checkpoints: {
    timestamp: string;
    location: string;
    statusNote: string;
  }[];
}

// Initial Mock Vendors
export const initialVendors: Vendor[] = [
  {
    id: 'VND-001',
    name: 'Artisan Woodcraft & Millwork Guild',
    companyCode: 'AWMG-IND',
    category: 'Millwork & Custom Joinery',
    rating: 4.9,
    tier: 'Tier 1 Preferred',
    contactPerson: 'Vikramaditya Solanki',
    email: 'orders@artisanwoodcraft.com',
    phone: '+91 98450 12891',
    city: 'Bengaluru',
    address: 'Plot 48, Peenya Industrial Area, Phase 3, Bengaluru - 560058',
    taxId: '29AAACA1234F1Z8',
    paymentTerms: 'Net 30',
    bankDetails: {
      accountName: 'Artisan Woodcraft Guild Pvt Ltd',
      bankName: 'HDFC Bank Ltd',
      accountNumber: '50200084920194',
      ifscSwift: 'HDFC0000240'
    },
    complianceStatus: 'Verified',
    onTimeDeliveryRate: 97.4,
    qualityScore: 98.5,
    activeProjects: ['PRJ-2024-001', 'PRJ-2024-002'],
    totalSpend: 1685000,
    activeOrdersCount: 3,
    catalogsCount: 8,
    leadTimeWeeks: 3,
    notes: 'Premium teak, walnut, and fluted veneer specialists. Consistently delivers defect-free millwork to Studio specs.'
  },
  {
    id: 'VND-002',
    name: 'Lumina Architectural & Smart Lighting',
    companyCode: 'LUM-SPEC',
    category: 'Electrical, MEP & Lighting',
    rating: 4.8,
    tier: 'Tier 1 Preferred',
    contactPerson: 'Meera Nambiar',
    email: 'projects@luminaarch.com',
    phone: '+91 97312 44520',
    city: 'Mumbai',
    address: '102 Solaris Tech Park, Andheri East, Mumbai - 400072',
    taxId: '27AABCL8892D1Z3',
    paymentTerms: 'Net 15',
    bankDetails: {
      accountName: 'Lumina Lighting Solutions LLP',
      bankName: 'ICICI Bank',
      accountNumber: '001105029384',
      ifscSwift: 'ICIC0000011'
    },
    complianceStatus: 'Verified',
    onTimeDeliveryRate: 94.2,
    qualityScore: 99.0,
    activeProjects: ['PRJ-2024-001', 'PRJ-2024-003'],
    totalSpend: 840000,
    activeOrdersCount: 2,
    catalogsCount: 14,
    leadTimeWeeks: 2,
    notes: 'DALI-2 certified architectural COB track fixtures, recessed linear profiles, and Casambi mesh automation.'
  },
  {
    id: 'VND-003',
    name: 'Carrara & Makrana Stone Importers',
    companyCode: 'CMSI-STONE',
    category: 'Stone, Marble & Tiles',
    rating: 4.7,
    tier: 'Tier 1 Preferred',
    contactPerson: 'Rajeshwar Jain',
    email: 'sales@carraramakrana.co.in',
    phone: '+91 94140 33819',
    city: 'Kishangarh',
    address: 'Marble City Expressway, Sector 4, Kishangarh, Rajasthan - 305802',
    taxId: '08AAFCJ4928E1Z9',
    paymentTerms: '50% Advance / 50% on Delivery',
    bankDetails: {
      accountName: 'Carrara Makrana Stone Industries',
      bankName: 'State Bank of India',
      accountNumber: '38291048291',
      ifscSwift: 'SBIN0001290'
    },
    complianceStatus: 'Verified',
    onTimeDeliveryRate: 91.8,
    qualityScore: 97.2,
    activeProjects: ['PRJ-2024-001', 'PRJ-2024-002', 'PRJ-2024-003'],
    totalSpend: 2450000,
    activeOrdersCount: 4,
    catalogsCount: 12,
    leadTimeWeeks: 4,
    notes: 'Direct quarry stock for Statuario, Botticino, and premium book-matched composite marble slabs.'
  },
  {
    id: 'VND-004',
    name: 'Vanguard Structural & Civil Supplies',
    companyCode: 'VSCS-CIV',
    category: 'Civil & Structural Materials',
    rating: 4.5,
    tier: 'Tier 2 Approved',
    contactPerson: 'Gautam Reddy',
    email: 'gautam@vanguardmaterials.com',
    phone: '+91 99801 88392',
    city: 'Bengaluru',
    address: '89 Bannerghatta Main Road, Bengaluru - 560076',
    taxId: '29AAACV5501B1Z2',
    paymentTerms: 'Net 30',
    bankDetails: {
      accountName: 'Vanguard Civil Supplies Corp',
      bankName: 'Axis Bank',
      accountNumber: '91802004928192',
      ifscSwift: 'UTIB0000045'
    },
    complianceStatus: 'Verified',
    onTimeDeliveryRate: 96.0,
    qualityScore: 92.5,
    activeProjects: ['PRJ-2024-001', 'PRJ-2024-002'],
    totalSpend: 1120000,
    activeOrdersCount: 2,
    catalogsCount: 5,
    leadTimeWeeks: 1,
    notes: 'Gyproc boards, perimeter channels, Birla Super cement, aerated autoclaved concrete (AAC) blocks.'
  },
  {
    id: 'VND-005',
    name: 'Modus Luxury Furniture & Curated FF&E',
    companyCode: 'MOD-FFE',
    category: 'FF&E & Luxury Furniture',
    rating: 4.9,
    tier: 'Tier 1 Preferred',
    contactPerson: 'Anya Sen-Gupta',
    email: 'anya@modusluxury.design',
    phone: '+91 98200 91823',
    city: 'New Delhi',
    address: 'The Design Gallery, MG Road, Sultanpur, New Delhi - 110030',
    taxId: '07AABCM3092A1Z1',
    paymentTerms: '50% Advance / 50% on Delivery',
    bankDetails: {
      accountName: 'Modus Living Spaces LLP',
      bankName: 'Kotak Mahindra Bank',
      accountNumber: '4819204928',
      ifscSwift: 'KKBK0000192'
    },
    complianceStatus: 'Verified',
    onTimeDeliveryRate: 93.5,
    qualityScore: 99.4,
    activeProjects: ['PRJ-2024-001'],
    totalSpend: 1450000,
    activeOrdersCount: 2,
    catalogsCount: 19,
    leadTimeWeeks: 6,
    notes: 'Custom upholstered loungers, bouclé sectional sofas, bespoke brass-accented credenzas, and marble coffee tables.'
  },
  {
    id: 'VND-006',
    name: 'Apex Architectural Glass & Facades',
    companyCode: 'APEX-GLS',
    category: 'Glass, Glazing & Metal Works',
    rating: 4.6,
    tier: 'Tier 2 Approved',
    contactPerson: 'Farhan Sheikh',
    email: 'commercial@apexglazing.com',
    phone: '+91 98112 09483',
    city: 'Gurugram',
    address: 'Udyog Vihar Phase 4, Gurugram, Haryana - 122016',
    taxId: '06AAACA9012L1Z5',
    paymentTerms: 'Net 30',
    bankDetails: {
      accountName: 'Apex Glassworks Pvt Ltd',
      bankName: 'Yes Bank',
      accountNumber: '028193829104',
      ifscSwift: 'YESB0000028'
    },
    complianceStatus: 'Verified',
    onTimeDeliveryRate: 95.0,
    qualityScore: 96.0,
    activeProjects: ['PRJ-2024-002', 'PRJ-2024-003'],
    totalSpend: 780000,
    activeOrdersCount: 1,
    catalogsCount: 7,
    leadTimeWeeks: 2,
    notes: 'Fluted Saint-Gobain glass partitions, toughened shower enclosures, PVD brass metal screens.'
  },
  {
    id: 'VND-007',
    name: 'Chroma Surface Coatings & Textures',
    companyCode: 'CHRO-COAT',
    category: 'Paint, Textures & Wall Finishes',
    rating: 4.4,
    tier: 'Tier 2 Approved',
    contactPerson: 'Suresh Menon',
    email: 'trade@chromacoatings.in',
    phone: '+91 97410 82910',
    city: 'Chennai',
    address: 'Guindy Industrial Estate, Chennai - 600032',
    taxId: '33AAACC3920H1ZX',
    paymentTerms: 'Net 15',
    bankDetails: {
      accountName: 'Chroma Surface Solutions',
      bankName: 'Canara Bank',
      accountNumber: '19283920194',
      ifscSwift: 'CNRB0001928'
    },
    complianceStatus: 'Verified',
    onTimeDeliveryRate: 98.0,
    qualityScore: 94.0,
    activeProjects: ['PRJ-2024-001', 'PRJ-2024-002'],
    totalSpend: 420000,
    activeOrdersCount: 1,
    catalogsCount: 11,
    leadTimeWeeks: 1,
    notes: 'Limewash, micro-cement, Venetian plaster finishes, and low-VOC ultra-matte architectural emulsions.'
  },
  {
    id: 'VND-008',
    name: 'Klima & Sens Intelligent HVAC & IoT',
    companyCode: 'KLM-IOT',
    category: 'HVAC, Automation & Smart Home',
    rating: 4.8,
    tier: 'Tier 1 Preferred',
    contactPerson: 'Tushar Khandelwal',
    email: 'enterprise@klimasens.io',
    phone: '+91 98920 19382',
    city: 'Pune',
    address: 'Baner Tech Hub, High Street, Pune - 411045',
    taxId: '27AACCK4921M1Z4',
    paymentTerms: 'Net 30',
    bankDetails: {
      accountName: 'Klima Sens Controls Pvt Ltd',
      bankName: 'HDFC Bank Ltd',
      accountNumber: '50200091823901',
      ifscSwift: 'HDFC0000492'
    },
    complianceStatus: 'Verified',
    onTimeDeliveryRate: 96.5,
    qualityScore: 98.0,
    activeProjects: ['PRJ-2024-001', 'PRJ-2024-003'],
    totalSpend: 1350000,
    activeOrdersCount: 2,
    catalogsCount: 6,
    leadTimeWeeks: 3,
    notes: 'Daikin VRV-X centralized climate units, motorized linear slot diffusers, and Crestron Home smart hub integration.'
  }
];

// Initial Purchase Orders with deep cross-engine links to Studio & Cost
export const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-2024-081',
    poNumber: 'PO-2024-081',
    projectId: 'proj-goldmine',
    projectName: 'Demo Project',
    projectCode: 'demo-arq-001',
    vendorId: 'VND-001',
    vendorName: 'Artisan Woodcraft & Millwork Guild',
    vendorCategory: 'Millwork & Custom Joinery',
    issueDate: '2024-02-15',
    expectedDeliveryDate: '2024-03-10',
    actualDeliveryDate: undefined,
    lineItems: [
      {
        id: 'LI-01',
        itemDescription: 'MD Cabin & Conference Room Acoustic Fluted Walnut Wall Paneling',
        specification: 'Grade A Natural American Walnut with micro-bevel flutes, PU matte seal, BWP marine ply backing',
        quantity: 240,
        unit: 'Sq.Ft',
        unitRate: 1250,
        totalAmount: 300000,
        studioSpaceRef: 'MD Cabin (Executive)',
        studioDrawingRef: 'DWG-MD-001',
        inspectionStatus: 'Passed QC'
      },
      {
        id: 'LI-02',
        itemDescription: 'Full Height Storage Credenzas & Smoked Glass Display Shutters',
        specification: 'Marine ply BWP 710 grade, Hafele soft-close concealed hinges with internal LED strips',
        quantity: 1,
        unit: 'Sets',
        unitRate: 450000,
        totalAmount: 450000,
        studioSpaceRef: 'Main Reception & Lounge',
        studioDrawingRef: 'DWG-REC-002',
        inspectionStatus: 'Pending Inspection'
      }
    ],
    subtotal: 750000,
    taxRatePercentage: 18,
    taxAmount: 135000,
    totalAmount: 885000,
    paidAmount: 442500,
    paymentStatus: 'Partially Paid',
    deliveryStatus: 'In Production',
    shippingAddress: 'Demo Project Site, Demo Tower, Demo City, Demo State - 000000',
    siteSupervisorContact: 'Vikram Mehta (+91 98201 44552)',
    procurementOfficer: 'Jitendra Mewada',
    terms: '50% advance released on drawing freeze; balance 50% within 15 days of site delivery and QA signoff.',
    costSynced: true,
    notes: 'Drawings approved by Lead Designer; carpenter site mock-up verified.'
  },
  {
    id: 'PO-2024-082',
    poNumber: 'PO-2024-082',
    projectId: 'proj-goldmine',
    projectName: 'Demo Project',
    projectCode: 'demo-arq-001',
    vendorId: 'VND-003',
    vendorName: 'Carrara & Makrana Stone Importers',
    vendorCategory: 'Stone, Marble & Tiles',
    issueDate: '2024-02-10',
    expectedDeliveryDate: '2024-02-28',
    actualDeliveryDate: '2024-02-27',
    lineItems: [
      {
        id: 'LI-03',
        itemDescription: 'Book-Matched Statuario Extra White Marble Slabs',
        specification: '20mm slab thickness, mirror-polished finish, high density epoxy resin treated',
        quantity: 850,
        unit: 'Sq.Ft',
        unitRate: 1100,
        totalAmount: 935000,
        studioSpaceRef: 'Main Reception & Lounge',
        studioDrawingRef: 'DWG-REC-001',
        inspectionStatus: 'Passed QC'
      }
    ],
    subtotal: 935000,
    taxRatePercentage: 18,
    taxAmount: 168300,
    totalAmount: 1103300,
    paidAmount: 1103300,
    paymentStatus: 'Paid',
    deliveryStatus: 'Inspected & Accepted',
    shippingAddress: 'Demo Project Site, Demo Tower, Demo City, Demo State - 000000',
    siteSupervisorContact: 'Vikram Mehta (+91 98201 44552)',
    procurementOfficer: 'Jitendra Mewada',
    terms: 'Full payment cleared against final QC slab inspection report.',
    costSynced: true,
    notes: 'Zero cracks recorded. Dry lay completed on site.'
  },
  {
    id: 'PO-2024-083',
    poNumber: 'PO-2024-083',
    projectId: 'proj-goldmine',
    projectName: 'Demo Project',
    projectCode: 'demo-arq-001',
    vendorId: 'VND-002',
    vendorName: 'Lumina Architectural & Smart Lighting',
    vendorCategory: 'Electrical, MEP & Lighting',
    issueDate: '2024-02-20',
    expectedDeliveryDate: '2024-03-05',
    actualDeliveryDate: undefined,
    lineItems: [
      {
        id: 'LI-04',
        itemDescription: 'Magnetic Recessed Track Lights with 2700K Warm DALI Spotlights',
        specification: 'CRI 97+, 48V low voltage slim tracks with honeycomb louvers',
        quantity: 36,
        unit: 'Pcs',
        unitRate: 6500,
        totalAmount: 234000,
        studioSpaceRef: 'Conference & Board Room',
        studioDrawingRef: 'DWG-CONF-003',
        inspectionStatus: 'Pending Inspection'
      },
      {
        id: 'LI-05',
        itemDescription: 'COB Deep Anti-Glare Downlights 12W 3000K',
        specification: 'IP44 rated, black baffle, high power factor driver',
        quantity: 48,
        unit: 'Pcs',
        unitRate: 1850,
        totalAmount: 88800,
        studioSpaceRef: 'Open Workstation Floor',
        studioDrawingRef: 'DWG-WORK-004',
        inspectionStatus: 'Pending Inspection'
      }
    ],
    subtotal: 322800,
    taxRatePercentage: 18,
    taxAmount: 58104,
    totalAmount: 380904,
    paidAmount: 0,
    paymentStatus: 'Unpaid',
    deliveryStatus: 'In Transit',
    shippingAddress: 'Demo Project Site, Demo Tower, Demo City, Demo State - 000000',
    siteSupervisorContact: 'Vikram Mehta (+91 98201 44552)',
    procurementOfficer: 'Jitendra Mewada',
    terms: 'Net 15 upon site delivery verification.',
    costSynced: true,
    notes: 'Air freight dispatch from Mumbai warehouse. Tracking active.'
  }
];

// Initial RFQs (Requests for Quotation)
export const initialRFQs: RFQ[] = [
  {
    id: 'RFQ-2024-019',
    rfqNumber: 'RFQ-2024-019',
    projectId: 'proj-goldmine',
    projectName: 'Demo Project',
    projectCode: 'demo-arq-001',
    title: 'Custom Curved Bouclé Lounge Sectionals & Executive Chairs',
    category: 'FF&E & Luxury Furniture',
    createdDate: '2024-02-18',
    deadlineDate: '2024-03-02',
    status: 'Evaluation Phase',
    targetDeliveryDate: '2024-03-25',
    specifications: 'High density foam HR40, kiln-dried birch wood framework, Dedar Milano textured bouclé fabric with stain-resistant coating.',
    estimatedBudget: 850000,
    items: [
      {
        description: 'Curved Organic Sectional Sofa (L: 3800mm, D: 1100mm)',
        quantity: 1,
        unit: 'Sets',
        targetSpec: 'Custom modular 3-piece curved layout with recessed oak plinth'
      },
      {
        description: 'Sculptural Executive Leather Chairs with Brass Tapered Base',
        quantity: 10,
        unit: 'Pcs',
        targetSpec: 'Padded backrest, full-grain Italian leather finish'
      }
    ],
    invitedVendors: ['VND-005', 'VND-001'],
    bids: [
      {
        vendorId: 'VND-005',
        vendorName: 'Modus Luxury Furniture & Curated FF&E',
        bidAmount: 820000,
        leadTimeDays: 21,
        submittedDate: '2024-02-24',
        status: 'Under Evaluation',
        remarks: 'Sample swatches delivered to Studio lead. Fabric certified for heavy domestic traffic (50,000 Martindale rubs).'
      },
      {
        vendorId: 'VND-001',
        vendorName: 'Artisan Woodcraft & Millwork Guild',
        bidAmount: 890000,
        leadTimeDays: 25,
        submittedDate: '2024-02-25',
        status: 'Under Evaluation',
        remarks: 'Includes on-site white-glove placement and 3-year frame warranty.'
      }
    ]
  }
];

// Initial Vendor Contracts
export const initialVendorContracts: VendorContract[] = [
  {
    id: 'CTR-2024-001',
    contractNumber: 'CTR-2024-001',
    title: 'Master Joinery & Architectural Millwork Annual Agreement',
    vendorId: 'VND-001',
    vendorName: 'Artisan Woodcraft & Millwork Guild',
    contractType: 'Master Services Agreement (MSA)',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    renewalAlertDate: '2024-11-15',
    totalContractValue: 7500000,
    paymentMilestones: [
      '30% Advance with Purchase Order',
      '40% Upon Factory Inspection / CNC Cutting Completion',
      '30% Net 30 days post on-site installation and QA signoff'
    ],
    penaltyClauses: '1% per week of unexcused project delay up to a ceiling of 8% contract sum.',
    warrantyPeriodMonths: 36,
    insurancePolicyNumber: 'HDFC-ERGO-IND-2024-91823',
    status: 'Active',
    signedByVendor: 'Vikramaditya Solanki (Managing Director)',
    signedByArqon: 'Jitendra Mewada (Lead Estimator & Procurement)',
    governingLaw: 'Jurisdiction of Mumbai, Maharashtra, India'
  },
  {
    id: 'CTR-2024-002',
    contractNumber: 'CTR-2024-002',
    title: 'Natural Italian & Exotic Stone Annual Supply Rate Card',
    vendorId: 'VND-003',
    vendorName: 'Carrara & Makrana Stone Importers',
    contractType: 'Annual Rate Card Contract',
    startDate: '2023-09-01',
    endDate: '2024-08-31',
    renewalAlertDate: '2024-07-15',
    totalContractValue: 12000000,
    paymentMilestones: [
      '50% Advance at Block Selection in Kishangarh Quarry',
      '50% On Dispatch following dry-lay approval by Arqon Studio'
    ],
    penaltyClauses: 'Replacement of any chipped/cracked slab within 7 business days at vendor expense.',
    warrantyPeriodMonths: 12,
    insurancePolicyNumber: 'BAJAJ-ALLIANZ-TRAN-88291',
    status: 'Active',
    signedByVendor: 'Rajeshwar Jain (Partner)',
    signedByArqon: 'Jitendra Mewada (Lead Estimator & Procurement)',
    governingLaw: 'Jurisdiction of Mumbai & Kishangarh'
  }
];

// Initial Delivery Shipments
export const initialShipments: DeliveryShipment[] = [
  {
    id: 'SHP-2024-101',
    trackingNumber: 'MUM-EXP-902194',
    poNumber: 'PO-2024-083',
    vendorName: 'Lumina Architectural & Smart Lighting',
    projectName: 'Demo Project',
    projectCode: 'demo-arq-001',
    carrier: 'Blue Dart Air Express Priority',
    driverContact: '+91 99201 44810',
    vehicleNumber: 'MH-04-GD-4910',
    originCity: 'Mumbai Warehouse Hub',
    destinationSite: 'Demo Project Site, Demo Tower, Demo City',
    dispatchDate: '2024-02-26 14:30',
    estimatedArrival: '2024-03-01 11:00',
    status: 'In Transit',
    currentLocation: 'Mumbai Cargo Logistics Hub - Cleared Inward Inspection',
    checkpoints: [
      { timestamp: '2024-02-26 14:30', location: 'Mumbai Andheri DC', statusNote: 'Packed in anti-static crates & dispatched' },
      { timestamp: '2024-02-27 06:15', location: 'Mumbai Central Hub', statusNote: 'Sorting completed, scheduled for delivery' },
      { timestamp: '2024-02-28 10:00', location: 'Andheri East Dispatch', statusNote: 'Out for final delivery to site' }
    ]
  }
];

// Project reference dataset for unified multi-engine integration
export const projectReferences = [
  {
    id: 'proj-goldmine',
    code: 'demo-arq-001',
    name: 'Demo Project',
    client: 'Demo Client',
    location: 'Demo Tower, Demo City, Demo State - 000000',
    totalBudget: 9785823,
    committedVendorSpend: 6800000,
    status: 'In Execution'
  }
];
