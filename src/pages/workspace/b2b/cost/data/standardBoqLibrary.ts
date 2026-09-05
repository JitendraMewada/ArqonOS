import { EstimateLineItem } from './estimateTypes';

export interface PreAutoFillBOQItem {
  id: string;
  itemKey: string;
  tradeCode: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
  tradeCategory: 'Civil' | 'POP' | 'Electric Wiring' | 'Electric Switches' | 'Electric Fixtures' | 'Carpentry' | 'Paint & Polish' | 'Miscellaneous' | 'Loose Furniture' | 'Aluminium Windows';
  subCategory: string;
  title: string;
  description: string;
  unit: 'Sq.ft.' | 'R.ft.' | 'No.' | 'Nos' | 'L/S' | 'Set';
  defaultRate: number;
  studioDrawingRef?: string;
  isCustomUserItem?: boolean;
  tags: string[];
}

export const STANDARD_BOQ_LIBRARY: PreAutoFillBOQItem[] = [
  // ==========================================
  // TRADE A: CIVIL WORK
  // ==========================================
  {
    id: 'lib-civ-001',
    itemKey: 'CIV-DEMOLITION',
    tradeCode: 'A',
    tradeCategory: 'Civil',
    subCategory: 'Demolition & Site Prep',
    title: 'Wall Demolition & Debris Disposal',
    description: 'Demolition of existing 4" / 9" masonry brick wall / partition, chipping off old plaster and carting away debris to municipal dumping ground.',
    unit: 'Sq.ft.',
    defaultRate: 45,
    studioDrawingRef: 'DWG-CIV-DEMO',
    tags: ['demolition', 'chipping', 'civil', 'brick wall', 'debris']
  },
  {
    id: 'lib-civ-002',
    itemKey: 'CIV-VITRIFIED-TILE',
    tradeCode: 'A',
    tradeCategory: 'Civil',
    subCategory: 'Flooring',
    title: 'Vitrified Floor Tiling (800x1600 / 600x1200mm)',
    description: 'Providing and laying glazed vitrified tiles of approved make (Kajaria/Nitco/Simpolo) over 50mm average cement mortar screed bed (1:4) with epoxy tile adhesive and matching epoxy grout.',
    unit: 'Sq.ft.',
    defaultRate: 240,
    studioDrawingRef: 'DWG-CIV-FL-01',
    tags: ['vitrified', 'tiles', 'flooring', 'screed', 'kajaria']
  },
  {
    id: 'lib-civ-003',
    itemKey: 'CIV-ITALIAN-MARBLE',
    tradeCode: 'A',
    tradeCategory: 'Civil',
    subCategory: 'Flooring',
    title: 'Italian Marble Flooring with Diamond Polish',
    description: 'Providing and laying 18mm thick imported Italian marble (Dyna / Bottochino / Statuario) over cement mortar bedding, epoxy resin backing, paper joints and 7-stage mirror diamond polishing.',
    unit: 'Sq.ft.',
    defaultRate: 650,
    studioDrawingRef: 'DWG-CIV-MARBLE',
    tags: ['italian marble', 'flooring', 'diamond polish', 'luxury', 'stone']
  },
  {
    id: 'lib-civ-004',
    itemKey: 'CIV-BATH-DADO',
    tradeCode: 'A',
    tradeCategory: 'Civil',
    subCategory: 'Wall Tiling',
    title: 'Bathroom Wall Dado Tiling up to Lintel/Ceiling',
    description: 'Fixing wall tiles of size up to 600x1200mm on bathroom walls with polymer-modified adhesive (Laticrete/Pidilite), mitred corner edges, spacer joints and stain-resistant epoxy grouting.',
    unit: 'Sq.ft.',
    defaultRate: 195,
    studioDrawingRef: 'DWG-CIV-DADO-01',
    tags: ['dado', 'wall tiles', 'bathroom', 'epoxy', 'grout']
  },
  {
    id: 'lib-civ-005',
    itemKey: 'CIV-WATERPROOFING',
    tradeCode: 'A',
    tradeCategory: 'Civil',
    subCategory: 'Waterproofing',
    title: '2-Coat Polymer Waterproofing Membrane',
    description: 'Providing & applying 2 coats of elastomeric polymer modified cementitious waterproofing coating (Dr. Fixit Fastflex / Fosroc) on toilet/balcony sunken slab including 300mm coving on vertical walls.',
    unit: 'Sq.ft.',
    defaultRate: 110,
    studioDrawingRef: 'DWG-CIV-WP',
    tags: ['waterproofing', 'sunken', 'balcony', 'toilet', 'membrane']
  },
  {
    id: 'lib-civ-006',
    itemKey: 'CIV-GRANITE-SILL',
    tradeCode: 'A',
    tradeCategory: 'Civil',
    subCategory: 'Stone Work',
    title: 'Jet Black Granite Window Cill / Door Threshold',
    description: 'Providing and fixing 20mm thick machine-cut Black Granite for window cills / door jambs / thresholds with full bullnosing / chamfering and mirror edge polishing.',
    unit: 'R.ft.',
    defaultRate: 260,
    studioDrawingRef: 'DWG-CIV-GR-01',
    tags: ['granite', 'cill', 'sill', 'threshold', 'jamb', 'stone']
  },
  {
    id: 'lib-civ-007',
    itemKey: 'CIV-KITCHEN-COUNTER',
    tradeCode: 'A',
    tradeCategory: 'Civil',
    subCategory: 'Countertop',
    title: 'Quartz / Granite Kitchen Platform Countertop',
    description: 'Providing and installing 20mm Quartz / Granite kitchen countertop with 40mm sandwich fascia moulding, sink cutout, cooktop cutout, and silicon sealing.',
    unit: 'R.ft.',
    defaultRate: 850,
    studioDrawingRef: 'DWG-CIV-KT-02',
    tags: ['quartz', 'granite', 'countertop', 'kitchen platform', 'sink cutout']
  },

  // ==========================================
  // TRADE B: PLASTER OF PARIS (POP) & CEILING
  // ==========================================
  {
    id: 'lib-pop-001',
    itemKey: 'POP-GYPSUM-CEILING',
    tradeCode: 'B',
    tradeCategory: 'POP',
    subCategory: 'False Ceiling',
    title: 'Saint-Gobain Gyproc False Ceiling',
    description: 'Providing and fixing suspended false ceiling with 12.5mm Saint-Gobain Gyproc plasterboard on fully galvanized lightweight steel framework, perimeter channels, intermediate channels, jointing tape and finish.',
    unit: 'Sq.ft.',
    defaultRate: 145,
    studioDrawingRef: 'DWG-POP-FC-01',
    tags: ['false ceiling', 'gyproc', 'gypsum', 'saint-gobain', 'ceiling']
  },
  {
    id: 'lib-pop-002',
    itemKey: 'POP-COVE-STEP',
    tradeCode: 'B',
    tradeCategory: 'POP',
    subCategory: 'False Ceiling',
    title: 'Stepped Perimeter Light Cove / Curtain Drop',
    description: 'Making stepped light cove / pelmet pocket in false ceiling for indirect LED profile illumination and concealed curtain motorized track integration.',
    unit: 'R.ft.',
    defaultRate: 175,
    studioDrawingRef: 'DWG-POP-COVE-01',
    tags: ['cove', 'light cove', 'curtain pocket', 'pelmet', 'indirect light']
  },
  {
    id: 'lib-pop-003',
    itemKey: 'POP-WALL-PUNNING',
    tradeCode: 'B',
    tradeCategory: 'POP',
    subCategory: 'Wall Finish',
    title: 'POP Punning on Walls (12mm Thick)',
    description: 'Providing and applying 10-12mm thick Gypsum/POP punning (Gyproc Elite) in true line, level, plumb and right angles over brick/concrete surfaces to receive primer and paint.',
    unit: 'Sq.ft.',
    defaultRate: 48,
    studioDrawingRef: 'DWG-POP-PUNN-01',
    tags: ['punning', 'pop', 'gypsum plaster', 'wall finish', 'plumb']
  },
  {
    id: 'lib-pop-004',
    itemKey: 'POP-GRID-CEILING',
    tradeCode: 'B',
    tradeCategory: 'POP',
    subCategory: 'False Ceiling',
    title: 'Acoustic Armstrong Grid Ceiling (600x600mm)',
    description: 'Providing and fixing 600x600mm Mineral Fibre acoustic ceiling tiles on visible pre-painted white T-grid system for utility / commercial zones.',
    unit: 'Sq.ft.',
    defaultRate: 160,
    studioDrawingRef: 'DWG-POP-GRID',
    tags: ['armstrong', 'grid ceiling', 'acoustic', 'mineral fibre']
  },

  // ==========================================
  // TRADE C: ELECTRIC WIRING
  // ==========================================
  {
    id: 'lib-elec-001',
    itemKey: 'ELEC-LIGHT-POINT',
    tradeCode: 'C',
    tradeCategory: 'Electric Wiring',
    subCategory: 'Points',
    title: 'Primary / Secondary Light Point Wiring',
    description: 'Concealed wiring for light point using 1.5 sq.mm FRLS multi-strand copper wire (Polycab/Havells) in heavy-gauge PVC conduit with earthing.',
    unit: 'Nos',
    defaultRate: 950,
    studioDrawingRef: 'DWG-EL-LP-01',
    tags: ['light point', 'wiring', 'electrical', 'polycab', 'conduit']
  },
  {
    id: 'lib-elec-002',
    itemKey: 'ELEC-6A-SOCKET',
    tradeCode: 'C',
    tradeCategory: 'Electric Wiring',
    subCategory: 'Points',
    title: '6A Convenience Power Point Wiring',
    description: 'Wiring for 6A 3-pin socket point using 2.5 sq.mm FRLS copper wire in concealed PVC conduit with earth wire.',
    unit: 'Nos',
    defaultRate: 1100,
    studioDrawingRef: 'DWG-EL-6A',
    tags: ['6a socket', 'power point', 'charging point', 'electrical']
  },
  {
    id: 'lib-elec-003',
    itemKey: 'ELEC-16A-POWER',
    tradeCode: 'C',
    tradeCategory: 'Electric Wiring',
    subCategory: 'Points',
    title: '16A / 20A Heavy Power Point (AC / Geyser / Oven)',
    description: 'Dedicated circuit wiring for 16A/20A power point using 4.0 sq.mm FRLS copper wire directly to distribution board with 2.5 sq.mm earth wire.',
    unit: 'Nos',
    defaultRate: 1750,
    studioDrawingRef: 'DWG-EL-16A',
    tags: ['16a power', 'ac point', 'geyser', 'oven', 'heavy power']
  },
  {
    id: 'lib-elec-004',
    itemKey: 'ELEC-AC-PIPING',
    tradeCode: 'C',
    tradeCategory: 'Electric Wiring',
    subCategory: 'HVAC Piping',
    title: 'Split AC Copper Refrigerant Piping & Drain',
    description: 'Providing and running insulated copper refrigerant suction & discharge tubes (Mandev/Totaline) with nitrile rubber sleeve, communication cable, and rigid PVC drain pipe.',
    unit: 'R.ft.',
    defaultRate: 420,
    studioDrawingRef: 'DWG-EL-AC-01',
    tags: ['ac piping', 'copper pipe', 'drain pipe', 'hvac', 'refrigerant']
  },
  {
    id: 'lib-elec-005',
    itemKey: 'ELEC-DATA-CAT6',
    tradeCode: 'C',
    tradeCategory: 'Electric Wiring',
    subCategory: 'Low Voltage',
    title: 'CAT-6 High-Speed LAN / TV Coax Cabling',
    description: 'Concealed routing of CAT-6 4-pair UTP Ethernet cable (D-Link/Schneider) and RG-6 Coaxial TV cable in dedicated conduit.',
    unit: 'R.ft.',
    defaultRate: 120,
    studioDrawingRef: 'DWG-EL-DATA',
    tags: ['cat6', 'ethernet', 'lan', 'tv coax', 'data point']
  },

  // ==========================================
  // TRADE D: ELECTRIC SWITCHES & MODULAR PLATES
  // ==========================================
  {
    id: 'lib-sw-001',
    itemKey: 'SW-MODULAR-PLATE',
    tradeCode: 'D',
    tradeCategory: 'Electric Switches',
    subCategory: 'Plates',
    title: 'Modular Switch Plate Assembly (Legrand Arteor / Schneider)',
    description: 'Supply and fixing of Modular switch and socket plate assembly (6 to 12 modules) in matte finish with anti-microbial surface, including grid and frame.',
    unit: 'Set',
    defaultRate: 1450,
    studioDrawingRef: 'DWG-SW-MOD-01',
    tags: ['switch plate', 'modular', 'legrand', 'schneider', 'arteor']
  },
  {
    id: 'lib-sw-002',
    itemKey: 'SW-FAN-REGULATOR',
    tradeCode: 'D',
    tradeCategory: 'Electric Switches',
    subCategory: 'Accessories',
    title: 'Step-Type Electronic Fan Regulator (Modular)',
    description: 'Supply and installation of 360-degree rotary step fan regulator module matching aesthetic switch range.',
    unit: 'No.',
    defaultRate: 480,
    studioDrawingRef: 'DWG-SW-REG',
    tags: ['fan regulator', 'step regulator', 'modular switch']
  },
  {
    id: 'lib-sw-003',
    itemKey: 'SW-USB-SOCKET',
    tradeCode: 'D',
    tradeCategory: 'Electric Switches',
    subCategory: 'Sockets',
    title: 'Dual USB Fast Charging Module (Type-A + Type-C 3.1A)',
    description: 'Providing and fixing modular embedded USB fast charging port (2-module) with surge protection.',
    unit: 'No.',
    defaultRate: 1250,
    studioDrawingRef: 'DWG-SW-USB',
    tags: ['usb socket', 'type-c', 'fast charger', 'modular']
  },

  // ==========================================
  // TRADE E: ELECTRIC FIXTURES & ILLUMINATION
  // ==========================================
  {
    id: 'lib-fix-001',
    itemKey: 'FIX-COB-DOWNLIGHT',
    tradeCode: 'E',
    tradeCategory: 'Electric Fixtures',
    subCategory: 'Downlights',
    title: 'COB LED Architectural Downlight (7W / 12W CRI>90)',
    description: 'Supply & fixing of die-cast aluminium deep anti-glare COB LED recessed spot (3000K Warm White, 38° beam angle, Philips/Osram/Hybec) with external driver.',
    unit: 'Nos',
    defaultRate: 850,
    studioDrawingRef: 'DWG-LT-COB-01',
    tags: ['cob', 'downlight', 'spotlight', 'led', 'hybec', 'philips']
  },
  {
    id: 'lib-fix-002',
    itemKey: 'FIX-LED-STRIP-PROFILE',
    tradeCode: 'E',
    tradeCategory: 'Electric Fixtures',
    subCategory: 'Strip & Profile',
    title: '24V High-Density LED Strip in Aluminium Profile (Frosted Diffuser)',
    description: 'Providing & installing slim aluminium profile channel with PMMA opal diffuser, fitted with 240 LED/m 24V constant voltage LED strip and electronic driver.',
    unit: 'R.ft.',
    defaultRate: 280,
    studioDrawingRef: 'DWG-LT-STRIP-01',
    tags: ['led strip', 'profile light', 'cove light', 'diffuser', '24v']
  },
  {
    id: 'lib-fix-003',
    itemKey: 'FIX-MAG-TRACK',
    tradeCode: 'E',
    tradeCategory: 'Electric Fixtures',
    subCategory: 'Track Light',
    title: 'Magnetic Track Recessed Channel & 12W Spot Inserts',
    description: 'Supply and installation of 48V low voltage recessed magnetic track rail with magnetic linear diffusers and adjustable mini-spotlight inserts.',
    unit: 'R.ft.',
    defaultRate: 1450,
    studioDrawingRef: 'DWG-LT-TRK',
    tags: ['magnetic track', 'track light', 'linear light', 'accent light']
  },
  {
    id: 'lib-fix-004',
    itemKey: 'FIX-PENDANT-CHANDELIER',
    tradeCode: 'E',
    tradeCategory: 'Electric Fixtures',
    subCategory: 'Decorative',
    title: 'Designer Decorative Dining Chandelier / Bedside Pendant',
    description: 'Installation & testing of luxury decorative suspended pendant luminaire with custom drop height adjustment.',
    unit: 'Nos',
    defaultRate: 6500,
    studioDrawingRef: 'DWG-LT-PEND',
    tags: ['pendant', 'chandelier', 'hanging light', 'decorative light']
  },
  {
    id: 'lib-fix-005',
    itemKey: 'FIX-BACKLIT-MIRROR',
    tradeCode: 'E',
    tradeCategory: 'Electric Fixtures',
    subCategory: 'Vanity',
    title: 'Touch-Sensor Anti-Fog LED Backlit Vanity Mirror Light',
    description: 'Providing & fixing IP44 waterproof ambient LED backlight for bathroom vanity mirror with capacitive on/off touch switch.',
    unit: 'Nos',
    defaultRate: 3200,
    studioDrawingRef: 'DWG-LT-MIRROR',
    tags: ['backlit mirror', 'vanity light', 'touch sensor', 'bathroom light']
  },

  // ==========================================
  // TRADE F: CARPENTRY & MILLWORK
  // ==========================================
  {
    id: 'lib-carp-001',
    itemKey: 'CARP-WARDROBE-FULL',
    tradeCode: 'F',
    tradeCategory: 'Carpentry',
    subCategory: 'Storage',
    title: 'Full Height Wardrobe (19mm Marine Ply + Laminate/PU)',
    description: 'Providing and making full-height wardrobe using 19mm Boiling Water Proof (BWP IS 710) Marine Ply for carcass with 0.8mm internal off-white laminate, soft-close Blum/Hettich hinges, hanging rods, and 1mm external laminate / PU finish shutters.',
    unit: 'Sq.ft.',
    defaultRate: 1850,
    studioDrawingRef: 'DWG-WD-WR-01',
    tags: ['wardrobe', 'bwp ply', 'marine ply', 'hettich', 'storage', 'shutter']
  },
  {
    id: 'lib-carp-002',
    itemKey: 'CARP-HYDRAULIC-BED',
    tradeCode: 'F',
    tradeCategory: 'Carpentry',
    subCategory: 'Furniture',
    title: 'King Size Bed with Heavy Hydraulic Lift Storage',
    description: 'Making king size bed (6\'x6\'.5") in 19mm Marine Ply, reinforced base, heavy-duty gas hydraulic pump mechanism for storage access, edge banding, and support framing.',
    unit: 'No.',
    defaultRate: 48000,
    studioDrawingRef: 'DWG-WD-BED-01',
    tags: ['bed', 'hydraulic bed', 'king size', 'storage bed', 'marine ply']
  },
  {
    id: 'lib-carp-003',
    itemKey: 'CARP-HEADBOARD',
    tradeCode: 'F',
    tradeCategory: 'Carpentry',
    subCategory: 'Furniture',
    title: 'Cushioned Upholstered Bed Headboard',
    description: 'Making full-width decorative wall headboard with 32-density high-resilience foam cushioning, fluted / geometric pattern, and velvet / leatherette fabric upholstery.',
    unit: 'Sq.ft.',
    defaultRate: 650,
    studioDrawingRef: 'DWG-WD-HB-01',
    tags: ['headboard', 'upholstered', 'cushion', 'fabric', 'acoustic']
  },
  {
    id: 'lib-carp-004',
    itemKey: 'CARP-TV-PANELING',
    tradeCode: 'F',
    tradeCategory: 'Carpentry',
    subCategory: 'Panels',
    title: 'TV Unit Wall Paneling with Concealed Conduits',
    description: 'Fabricating feature wall paneling using 12mm/19mm ply with charcoal louvers / fluted panels / natural veneer with PU finish and concealed HDMI/power raceways.',
    unit: 'Sq.ft.',
    defaultRate: 850,
    studioDrawingRef: 'DWG-WD-TV-01',
    tags: ['tv paneling', 'tv unit', 'fluted panel', 'veneer', 'louvers']
  },
  {
    id: 'lib-carp-005',
    itemKey: 'CARP-STUDY-DESK',
    tradeCode: 'F',
    tradeCategory: 'Carpentry',
    subCategory: 'Workstation',
    title: 'Floating Study Desk with 3 Soft-Close Drawers',
    description: 'Making wall-hung study desk in 19mm BWP ply with 1.5mm acrylic / veneer top, chamfered edge band, 3 telescopic drawer channels and wire management cutout.',
    unit: 'R.ft.',
    defaultRate: 2400,
    studioDrawingRef: 'DWG-WD-DESK',
    tags: ['study desk', 'workstation', 'drawers', 'floating desk']
  },
  {
    id: 'lib-carp-006',
    itemKey: 'CARP-KITCHEN-BASE',
    tradeCode: 'F',
    tradeCategory: 'Carpentry',
    subCategory: 'Modular Kitchen',
    title: 'Modular Kitchen Base Cabinets with SS Tandem Drawers',
    description: 'Providing and fixing modular kitchen base carcass in 19mm Marine Ply with PVC edge banding, stainless steel tandem drawers (Hettich InnoTech/Blum), cutlery organiser and bottle pullout.',
    unit: 'R.ft.',
    defaultRate: 3800,
    studioDrawingRef: 'DWG-WD-KT-01',
    tags: ['kitchen', 'modular kitchen', 'tandem box', 'hettich', 'base cabinet']
  },
  {
    id: 'lib-carp-007',
    itemKey: 'CARP-KITCHEN-OVERHEAD',
    tradeCode: 'F',
    tradeCategory: 'Carpentry',
    subCategory: 'Modular Kitchen',
    title: 'Kitchen Overhead Cabinets with Hydraulic Bi-Fold Flaps',
    description: 'Making overhead wall storage cabinets in 19mm BWP ply with frosted glass / acrylic shutters and Blum Aventos HK-S lift mechanism.',
    unit: 'R.ft.',
    defaultRate: 2600,
    studioDrawingRef: 'DWG-WD-KT-02',
    tags: ['overhead cabinet', 'kitchen', 'blu-motion', 'bi-fold']
  },
  {
    id: 'lib-carp-008',
    itemKey: 'CARP-FLUSH-DOOR',
    tradeCode: 'F',
    tradeCategory: 'Carpentry',
    subCategory: 'Doors',
    title: 'Solid Core Flush Door (35mm) with Veneer Cladding',
    description: 'Providing and fixing 35mm solid core flush door shutter with teak wood frame/lip, cladded with natural veneer on both faces, PU polish, and heavy mortise lock.',
    unit: 'Sq.ft.',
    defaultRate: 750,
    studioDrawingRef: 'DWG-WD-DR-01',
    tags: ['flush door', 'veneer door', 'door', 'mortise lock', 'teak']
  },
  {
    id: 'lib-carp-009',
    itemKey: 'CARP-VANITY-COUNTER',
    tradeCode: 'F',
    tradeCategory: 'Carpentry',
    subCategory: 'Vanity',
    title: 'Under-Counter Bathroom Vanity Cabinet (HDHMR Waterproof)',
    description: 'Making waterproof under-counter vanity in HDHMR board with polyurethane (PU) waterproof paint finish, soft close shutters and bottom plumbing clearance.',
    unit: 'R.ft.',
    defaultRate: 2900,
    studioDrawingRef: 'DWG-WD-VAN-01',
    tags: ['vanity', 'hdhmr', 'bathroom cabinet', 'waterproof', 'pu finish']
  },

  // ==========================================
  // TRADE G: PAINT & POLISH
  // ==========================================
  {
    id: 'lib-pnt-001',
    itemKey: 'PNT-ROYALE-EMULSION',
    tradeCode: 'G',
    tradeCategory: 'Paint & Polish',
    subCategory: 'Wall Paint',
    title: 'Asian Paints Royale Luxury Emulsion (3-Coat Putty + Primer)',
    description: 'Providing and applying 1 coat of water-based primer, 2-3 coats of acrylic wall putty with fine 220-grit mechanical sanding, 1 coat sealer, and 2-3 coats of Asian Paints Royale Luxury Emulsion in approved shade.',
    unit: 'Sq.ft.',
    defaultRate: 48,
    studioDrawingRef: 'DWG-PNT-ROYALE',
    tags: ['royale paint', 'asian paints', 'luxury emulsion', 'wall putty', 'primer']
  },
  {
    id: 'lib-pnt-002',
    itemKey: 'PNT-LUSTER-FINISH',
    tradeCode: 'G',
    tradeCategory: 'Paint & Polish',
    subCategory: 'Wall Paint',
    title: 'Premium Luster Paint with Roller Stippling',
    description: 'Applying premium washable oil-based Luster finish paint on walls including lambi putty coat, fine surface flattening and uniform orange-peel stippling finish.',
    unit: 'Sq.ft.',
    defaultRate: 58,
    studioDrawingRef: 'DWG-PNT-LUSTER',
    tags: ['luster', 'washable', 'stippling', 'oil paint']
  },
  {
    id: 'lib-pnt-003',
    itemKey: 'PNT-VENEER-PU-POLISH',
    tradeCode: 'G',
    tradeCategory: 'Paint & Polish',
    subCategory: 'Wood Polish',
    title: 'PU Matt Polish on Natural Wood Veneer (Sirca / Asian Paints)',
    description: 'Providing and applying Polyurethane (PU) clear matt finish polish on veneer/teak wood surfaces including sealer coats, grain filling, wet sanding and spray finish.',
    unit: 'Sq.ft.',
    defaultRate: 145,
    studioDrawingRef: 'DWG-PNT-PU-01',
    tags: ['pu polish', 'veneer polish', 'matt polish', 'sirca', 'wood finish']
  },
  {
    id: 'lib-pnt-004',
    itemKey: 'PNT-MELAMINE-POLISH',
    tradeCode: 'G',
    tradeCategory: 'Paint & Polish',
    subCategory: 'Wood Polish',
    title: 'Melamine Polish on Teak Wood Moldings / Frames',
    description: 'Applying 2-pack Melamine clear wood polish with stain colour matching on solid wood beading and frames.',
    unit: 'Sq.ft.',
    defaultRate: 85,
    studioDrawingRef: 'DWG-PNT-MELAMINE',
    tags: ['melamine', 'wood polish', 'teak beading', 'stain']
  },
  {
    id: 'lib-pnt-005',
    itemKey: 'PNT-TEXTURE-STUCCO',
    tradeCode: 'G',
    tradeCategory: 'Paint & Polish',
    subCategory: 'Texture Paint',
    title: 'Designer Architectural Stucco / Concrete Texture on Accent Wall',
    description: 'Providing & creating bespoke Venetian Stucco / Travertine concrete texture with trowel application, metallic wax buffing and protective sealant.',
    unit: 'Sq.ft.',
    defaultRate: 185,
    studioDrawingRef: 'DWG-PNT-TXT-01',
    tags: ['texture paint', 'stucco', 'concrete finish', 'accent wall', 'venetian']
  },
  {
    id: 'lib-pnt-006',
    itemKey: 'PNT-CEILING-EMULSION',
    tradeCode: 'G',
    tradeCategory: 'Paint & Polish',
    subCategory: 'Ceiling Paint',
    title: 'Anti-Glare Pure White Ceiling Plastic Emulsion',
    description: 'Painting false ceiling with anti-glare dead-flat plastic emulsion (Asian Paints Tractor/Apcolite) including joint taping and seamless surface preparation.',
    unit: 'Sq.ft.',
    defaultRate: 36,
    studioDrawingRef: 'DWG-PNT-CL-01',
    tags: ['ceiling paint', 'white emulsion', 'dead flat', 'false ceiling paint']
  },

  // ==========================================
  // TRADE H: MISCELLANEOUS WORK
  // ==========================================
  {
    id: 'lib-misc-001',
    itemKey: 'MISC-DEEP-CLEANING',
    tradeCode: 'H',
    tradeCategory: 'Miscellaneous',
    subCategory: 'Site Maintenance',
    title: 'Post-Execution Deep Industrial Cleaning & Floor Buffing',
    description: 'Comprehensive mechanized chemical deep cleaning of the entire premises, floor single-disc buffing, tile stain removal, window glass cleaning, and sanitary sanitization prior to handover.',
    unit: 'Sq.ft.',
    defaultRate: 18,
    studioDrawingRef: 'DWG-MISC-CLN',
    tags: ['cleaning', 'deep cleaning', 'handover', 'buffing', 'stain removal']
  },
  {
    id: 'lib-misc-002',
    itemKey: 'MISC-FLOOR-PROTECTION',
    tradeCode: 'H',
    tradeCategory: 'Miscellaneous',
    subCategory: 'Site Protection',
    title: 'Heavy Floor Protection Sheet Covering (Floor Guard)',
    description: 'Providing and laying 3mm closed-cell foam / corrugated polypropylene sheet with taped seams to protect newly laid marble/tile floors throughout construction period.',
    unit: 'Sq.ft.',
    defaultRate: 15,
    studioDrawingRef: 'DWG-MISC-PROT',
    tags: ['floor protection', 'sheet', 'floor guard', 'damage prevention']
  },
  {
    id: 'lib-misc-003',
    itemKey: 'MISC-BRASS-INLAY',
    tradeCode: 'H',
    tradeCategory: 'Miscellaneous',
    subCategory: 'Metal Inlay',
    title: 'Solid Brass 6mm / 10mm T-Profile Inlay in Flooring',
    description: 'Providing & embedding solid gold-finish brass T-strip inlay in floor tiles / marble transitions with epoxy bonding and flush surface grinding.',
    unit: 'R.ft.',
    defaultRate: 220,
    studioDrawingRef: 'DWG-MISC-BRASS',
    tags: ['brass inlay', 't-profile', 'gold strip', 'floor transition']
  },
  {
    id: 'lib-misc-004',
    itemKey: 'MISC-BATH-ACCESSORIES',
    tradeCode: 'H',
    tradeCategory: 'Miscellaneous',
    subCategory: 'Hardware Fitting',
    title: 'Bathroom CP Accessories Installation (Set of 6)',
    description: 'Fixing stainless steel / brass chrome bathroom accessories (Towel rod, towel ring, robe hooks, tumbler holder, soap dish, health faucet bracket) with anchor fasteners.',
    unit: 'Set',
    defaultRate: 1800,
    studioDrawingRef: 'DWG-MISC-BA-01',
    tags: ['bathroom accessories', 'towel rod', 'robe hook', 'cp fittings']
  },

  // ==========================================
  // TRADE I: LOOSE FURNITURE
  // ==========================================
  {
    id: 'lib-furn-001',
    itemKey: 'FURN-3SEATER-SOFA',
    tradeCode: 'I',
    tradeCategory: 'Loose Furniture',
    subCategory: 'Living Seating',
    title: 'Custom 3-Seater Sofa in High-GSM Velvet Fabric',
    description: 'Manufacturing 3-seater living room sofa with seasoned teak internal wood frame, 40-density high-resilience foam, pocket spring base, and premium stain-resistant fabric upholstery.',
    unit: 'No.',
    defaultRate: 58000,
    studioDrawingRef: 'DWG-FRN-SF-01',
    tags: ['sofa', '3 seater', 'living room', 'upholstery', 'furniture']
  },
  {
    id: 'lib-furn-002',
    itemKey: 'FURN-LOUNGE-CHAIR',
    tradeCode: 'I',
    tradeCategory: 'Loose Furniture',
    subCategory: 'Living Seating',
    title: 'Accent Lounge Armchair with Brushed Brass Legs',
    description: 'Supplying designer accent occasional lounge chair with ergonomic barrel back, brass finish PVD metal base, and dual-tone boucle fabric.',
    unit: 'No.',
    defaultRate: 22500,
    studioDrawingRef: 'DWG-FRN-AC-01',
    tags: ['lounge chair', 'armchair', 'accent chair', 'brass legs']
  },
  {
    id: 'lib-furn-003',
    itemKey: 'FURN-COFFEE-TABLE',
    tradeCode: 'I',
    tradeCategory: 'Loose Furniture',
    subCategory: 'Tables',
    title: 'Centre Coffee Table with Italian Marble Top (36" Dia)',
    description: 'Providing circular coffee table with 20mm beveled Italian marble top and black matte / brass PVD stainless steel base.',
    unit: 'No.',
    defaultRate: 19500,
    studioDrawingRef: 'DWG-FRN-CT-01',
    tags: ['coffee table', 'centre table', 'marble top', 'living table']
  },
  {
    id: 'lib-furn-004',
    itemKey: 'FURN-DINING-SET-6',
    tradeCode: 'I',
    tradeCategory: 'Loose Furniture',
    subCategory: 'Dining',
    title: '6-Seater Solid Teak Wood Dining Table with Upholstered Chairs',
    description: 'Supplying 6-seater dining table (6\'x3\'.5") in seasoned solid teak wood with PU finish, including 6 matching cushioned ergonomic dining chairs.',
    unit: 'Set',
    defaultRate: 88000,
    studioDrawingRef: 'DWG-FRN-DT-01',
    tags: ['dining table', 'dining chairs', '6 seater', 'teak wood', 'dining set']
  },
  {
    id: 'lib-furn-005',
    itemKey: 'FURN-KING-MATTRESS',
    tradeCode: 'I',
    tradeCategory: 'Loose Furniture',
    subCategory: 'Bedding',
    title: '8-Inch Orthopaedic Memory Foam Pocket Spring King Mattress',
    description: 'Supply of premium 8-inch dual comfort king mattress with zero partner disturbance pocket springs and breathable knitted jacquard top quilting.',
    unit: 'No.',
    defaultRate: 34000,
    studioDrawingRef: 'DWG-FRN-MATT',
    tags: ['mattress', 'king mattress', 'pocket spring', 'orthopaedic']
  },

  // ==========================================
  // TRADE J: ALUMINIUM WINDOWS & GLAZING
  // ==========================================
  {
    id: 'lib-win-001',
    itemKey: 'WIN-DOMAL-SLIDING',
    tradeCode: 'J',
    tradeCategory: 'Aluminium Windows',
    subCategory: 'Windows',
    title: 'Heavy Domal 27mm 3-Track Aluminium Sliding Window (Toughened Glass)',
    description: 'Providing and fixing 3-track powder coated Domal 27mm series aluminium window frame with 5mm toughened Saint-Gobain clear glass, nylon rollers, EPDM weather gaskets, and SS mosquito mesh track.',
    unit: 'Sq.ft.',
    defaultRate: 520,
    studioDrawingRef: 'DWG-GL-WIN-01',
    tags: ['domal window', 'aluminium window', 'sliding window', 'toughened glass', 'mosquito mesh']
  },
  {
    id: 'lib-win-002',
    itemKey: 'WIN-SHOWER-PARTITION',
    tradeCode: 'J',
    tradeCategory: 'Aluminium Windows',
    subCategory: 'Glass Enclosure',
    title: '10mm Toughened Glass Frameless Shower Partition',
    description: 'Providing and fixing 10mm clear toughened glass shower partition with SS-304 hardware, floor brackets, header support bar, magnetic PVC water seal gaskets, and 8" towel-bar handle.',
    unit: 'Sq.ft.',
    defaultRate: 680,
    studioDrawingRef: 'DWG-GL-SHW-01',
    tags: ['shower partition', 'glass partition', 'toughened glass', 'ss-304', 'bathroom glass']
  },
  {
    id: 'lib-win-003',
    itemKey: 'WIN-BEVELED-MIRROR',
    tradeCode: 'J',
    tradeCategory: 'Aluminium Windows',
    subCategory: 'Mirrors',
    title: '5mm Saint-Gobain Distortion-Free Mirror with 25mm Beveling',
    description: 'Providing and installing 5mm high-reflectance distortion-free Saint-Gobain mirror with 25mm beveled edges mounted over 12mm ply backing with mirror adhesive.',
    unit: 'Sq.ft.',
    defaultRate: 240,
    studioDrawingRef: 'DWG-GL-MIRR-01',
    tags: ['mirror', 'beveled mirror', 'saint-gobain', 'vanity mirror', 'glass']
  },
  {
    id: 'lib-win-004',
    itemKey: 'WIN-FLUTED-PARTITION',
    tradeCode: 'J',
    tradeCategory: 'Aluminium Windows',
    subCategory: 'Decorative Glass',
    title: '8mm Fluted / Reeded Glass Partition in Slim Black Aluminium Frame',
    description: 'Providing and fixing bespoke room divider with 8mm tempered fluted glass in ultra-slim matte black anodized aluminium framing.',
    unit: 'Sq.ft.',
    defaultRate: 780,
    studioDrawingRef: 'DWG-GL-FLUTED',
    tags: ['fluted glass', 'reeded glass', 'glass partition', 'black frame', 'room divider']
  }
];

// Helper to get saved user custom items from localStorage
export function getSavedCustomBoqItems(): PreAutoFillBOQItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('arqon_custom_boq_library');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error loading custom BOQ library:', e);
  }
  return [];
}

// Helper to save a new custom BOQ item to user library
export function saveCustomBoqItemToLibrary(item: Omit<PreAutoFillBOQItem, 'id' | 'isCustomUserItem'>): PreAutoFillBOQItem {
  const customItem: PreAutoFillBOQItem = {
    ...item,
    id: `custom-lib-${Date.now()}`,
    isCustomUserItem: true
  };

  if (typeof window !== 'undefined') {
    try {
      const current = getSavedCustomBoqItems();
      const updated = [customItem, ...current.filter(i => i.itemKey !== customItem.itemKey)];
      localStorage.setItem('arqon_custom_boq_library', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving custom BOQ item:', e);
    }
  }

  return customItem;
}

// Get full combined library (Standard + User Saved Custom)
export function getAllAvailableBoqLibrary(): PreAutoFillBOQItem[] {
  const customItems = getSavedCustomBoqItems();
  return [...customItems, ...STANDARD_BOQ_LIBRARY];
}
