import { TeamMember, Dimension, Space, Asset, Moodboard } from '../StudioContext';

export interface ProjectPresentation {
  id: string;
  projectId: string;
  title: string;
  clientName: string;
  status: 'Draft' | 'Ready' | 'Shared' | 'Approved';
  version: string;
  updatedAt: string;
  slides: {
    id: string;
    title: string;
    type: 'cover' | 'concept' | 'spaces' | 'materials' | 'drawings' | 'renders' | 'closing';
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    keyPoints?: string[];
  }[];
}

export interface ProjectApproval {
  id: string;
  projectId: string;
  title: string;
  category: 'Concept Design' | 'Space Planning' | 'Material Schedule' | 'Technical Drawings' | 'BOQ & Final Signoff';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Revision Requested';
  submittedBy: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  feedback?: string;
  unlocksCostModule?: boolean;
  version: string;
}

export interface ProjectRevision {
  id: string;
  projectId: string;
  revisionCode: string;
  title: string;
  description: string;
  author: string;
  affectedModule: 'Dimension Matrix' | 'Spaces' | 'Sketches' | 'Moodboard' | 'Material Spec' | 'Budget';
  changeSummary: string[];
  status: 'Draft' | 'In Review' | 'Approved' | 'Superceded';
  createdAt: string;
}

// MOCK DATA GENERATOR BY PROJECT ID
export const MOCK_TEAM_BY_PROJECT: Record<string, TeamMember[]> = {
  'proj-alpha': [
    { id: 'tm-pa-1', projectId: 'proj-alpha', userId: 'u-101', name: 'Alara Vance', email: 'alara.vance@arqonos.com', role: 'Project Lead', assignedAt: '2026-05-01' },
    { id: 'tm-pa-2', projectId: 'proj-alpha', userId: 'u-102', name: 'Marcus Sterling', email: 'marcus.s@arqonos.com', role: 'Lead Designer', assignedAt: '2026-05-02' },
    { id: 'tm-pa-3', projectId: 'proj-alpha', userId: 'u-103', name: 'Elena Rostova', email: 'elena.r@arqonos.com', role: '3D Designer', assignedAt: '2026-05-05' },
    { id: 'tm-pa-4', projectId: 'proj-alpha', userId: 'u-104', name: 'Kenji Takahashi', email: 'kenji.t@arqonos.com', role: 'Draftsman', assignedAt: '2026-05-06' },
    { id: 'tm-pa-5', projectId: 'proj-alpha', userId: 'u-105', name: 'Vikram Mehta', email: 'vikram.m@arqonos.com', role: 'Site Supervisor', assignedAt: '2026-05-10' },
    { id: 'tm-pa-6', projectId: 'proj-alpha', userId: 'u-106', name: 'Arthur Pendelton (Alpha Corp)', email: 'arthur@alphacorp.com', role: 'Client', assignedAt: '2026-05-01' }
  ],
  'proj-comp': [
    { id: 'tm-cw-1', projectId: 'proj-comp', userId: 'u-102', name: 'Marcus Sterling', email: 'marcus.s@arqonos.com', role: 'Project Lead', assignedAt: '2026-06-01' },
    { id: 'tm-cw-2', projectId: 'proj-comp', userId: 'u-107', name: 'Chloe Dubois', email: 'chloe.d@arqonos.com', role: 'Lead Designer', assignedAt: '2026-06-02' },
    { id: 'tm-cw-3', projectId: 'proj-comp', userId: 'u-104', name: 'Kenji Takahashi', email: 'kenji.t@arqonos.com', role: 'Draftsman', assignedAt: '2026-06-05' },
    { id: 'tm-cw-4', projectId: 'proj-comp', userId: 'u-105', name: 'Vikram Mehta', email: 'vikram.m@arqonos.com', role: 'Site Supervisor', assignedAt: '2026-06-10' }
  ],
  'proj-nexa': [
    { id: 'tm-ns-1', projectId: 'proj-nexa', userId: 'u-101', name: 'Alara Vance', email: 'alara.vance@arqonos.com', role: 'Project Lead', assignedAt: '2026-06-01' },
    { id: 'tm-ns-2', projectId: 'proj-nexa', userId: 'u-107', name: 'Chloe Dubois', email: 'chloe.d@arqonos.com', role: 'Lead Designer', assignedAt: '2026-06-03' },
    { id: 'tm-ns-3', projectId: 'proj-nexa', userId: 'u-103', name: 'Elena Rostova', email: 'elena.r@arqonos.com', role: '3D Designer', assignedAt: '2026-06-04' },
    { id: 'tm-ns-4', projectId: 'proj-nexa', userId: 'u-108', name: 'Sophia Nexa', email: 'sophia@nexa.com', role: 'Client', assignedAt: '2026-06-01' }
  ],
  'proj-acme': [
    { id: 'tm-ac-1', projectId: 'proj-acme', userId: 'u-102', name: 'Marcus Sterling', email: 'marcus.s@arqonos.com', role: 'Project Lead', assignedAt: '2026-08-01' },
    { id: 'tm-ac-2', projectId: 'proj-acme', userId: 'u-104', name: 'Kenji Takahashi', email: 'kenji.t@arqonos.com', role: 'Draftsman', assignedAt: '2026-08-02' },
    { id: 'tm-ac-3', projectId: 'proj-acme', userId: 'u-109', name: 'David Acme', email: 'david@acme.com', role: 'Client', assignedAt: '2026-08-01' }
  ]
};

export const MOCK_DIMENSIONS_BY_PROJECT: Record<string, Dimension[]> = {
  'proj-alpha': [
    {
      id: 'dim-pa-1',
      projectId: 'proj-alpha',
      roomName: 'Executive Boardroom',
      length: 28,
      width: 18,
      height: 12,
      doorCount: 2,
      doorWidth: 3.5,
      doorHeight: 8.5,
      windowCount: 4,
      windowWidth: 5,
      windowHeight: 7.5,
      sillHeight: 2.5,
      lintelHeight: 10,
      floorCount: 1,
      ceilingCount: 1,
      ceilingHeight: 12,
      wallCount: 4,
      beamCount: 2,
      beamHeight: 1.5,
      beamWidth: 1.2,
      notes: 'Curved curtain wall on East side. Acoustic insulation required on dividing partition.',
      attachments: []
    },
    {
      id: 'dim-pa-2',
      projectId: 'proj-alpha',
      roomName: 'Open Collaborative Workspace',
      length: 54,
      width: 32,
      height: 14,
      doorCount: 4,
      doorWidth: 4,
      doorHeight: 9,
      windowCount: 8,
      windowWidth: 6,
      windowHeight: 9,
      sillHeight: 1.5,
      lintelHeight: 10.5,
      floorCount: 1,
      ceilingCount: 1,
      ceilingHeight: 14,
      wallCount: 4,
      beamCount: 4,
      beamHeight: 2,
      beamWidth: 1.5,
      notes: 'Exposed concrete ceiling with industrial structural pillars every 18ft grid.',
      attachments: []
    },
    {
      id: 'dim-pa-3',
      projectId: 'proj-alpha',
      roomName: 'Reception & Welcome Gallery',
      length: 22,
      width: 16,
      height: 12,
      doorCount: 1,
      doorWidth: 6,
      doorHeight: 9,
      windowCount: 2,
      windowWidth: 4.5,
      windowHeight: 7,
      sillHeight: 2,
      lintelHeight: 9,
      floorCount: 1,
      ceilingCount: 1,
      ceilingHeight: 12,
      wallCount: 4,
      beamCount: 1,
      beamHeight: 1,
      beamWidth: 1,
      notes: 'Main security turnstile ingress and marble cladding mounting load test approved.',
      attachments: []
    },
    {
      id: 'dim-pa-4',
      projectId: 'proj-alpha',
      roomName: 'Town Hall & Cafe Lounge',
      length: 36,
      width: 24,
      height: 13,
      doorCount: 2,
      doorWidth: 4,
      doorHeight: 8.5,
      windowCount: 6,
      windowWidth: 5,
      windowHeight: 8,
      sillHeight: 2,
      lintelHeight: 10,
      floorCount: 1,
      ceilingCount: 1,
      ceilingHeight: 13,
      wallCount: 4,
      beamCount: 3,
      beamHeight: 1.5,
      beamWidth: 1.2,
      notes: 'Plumbing inlet connection along South wall for barista espresso bar & island sink.',
      attachments: []
    }
  ],
  'proj-nexa': [
    {
      id: 'dim-ns-1',
      projectId: 'proj-nexa',
      roomName: 'Grand Living & Dining Salon',
      length: 34,
      width: 22,
      height: 14.5,
      doorCount: 2,
      doorWidth: 4,
      doorHeight: 9.5,
      windowCount: 5,
      windowWidth: 6,
      windowHeight: 10,
      sillHeight: 1,
      lintelHeight: 11,
      floorCount: 1,
      ceilingCount: 1,
      ceilingHeight: 14.5,
      wallCount: 4,
      beamCount: 2,
      beamHeight: 1.5,
      beamWidth: 1.5,
      notes: 'Panoramic skyline floor-to-ceiling glazing. Reinforced subfloor for grand piano.',
      attachments: []
    },
    {
      id: 'dim-ns-2',
      projectId: 'proj-nexa',
      roomName: 'Primary Master Suite',
      length: 24,
      width: 18,
      height: 11.5,
      doorCount: 2,
      doorWidth: 3.5,
      doorHeight: 8.5,
      windowCount: 3,
      windowWidth: 5,
      windowHeight: 7.5,
      sillHeight: 2,
      lintelHeight: 9.5,
      floorCount: 1,
      ceilingCount: 1,
      ceilingHeight: 11.5,
      wallCount: 4,
      beamCount: 0,
      beamHeight: 0,
      beamWidth: 0,
      notes: 'Direct connection to walk-in dressing room and ensuite spa bath.',
      attachments: []
    },
    {
      id: 'dim-ns-3',
      projectId: 'proj-nexa',
      roomName: 'Gourmet Show Kitchen',
      length: 20,
      width: 16,
      height: 11,
      doorCount: 1,
      doorWidth: 3.5,
      doorHeight: 8.5,
      windowCount: 2,
      windowWidth: 4,
      windowHeight: 6,
      sillHeight: 3,
      lintelHeight: 9,
      floorCount: 1,
      ceilingCount: 1,
      ceilingHeight: 11,
      wallCount: 4,
      beamCount: 1,
      beamHeight: 1,
      beamWidth: 1,
      notes: 'Dedicated 3-phase electrical circuit for Wolf induction ranges and Sub-Zero column coolers.',
      attachments: []
    }
  ]
};

export const MOCK_SPACES_BY_PROJECT: Record<string, Space[]> = {
  'proj-alpha': [
    {
      id: 'sp-pa-1',
      projectId: 'proj-alpha',
      dimensionRoomId: 'dim-pa-1',
      spaceName: 'Executive High-Tech Boardroom',
      spaceType: 'Meeting & Conference',
      status: 'Approved',
      proposedLength: 28,
      proposedWidth: 18,
      proposedHeight: 11,
      doorCount: 2,
      doorWidth: 3.5,
      doorHeight: 8.5,
      windowCount: 4,
      windowWidth: 5,
      windowHeight: 7.5,
      wallAddedCount: 1,
      wallRemovedCount: 0,
      falseCeilingRequired: true,
      ceilingType: 'Acoustic Micro-perforated Walnut & Shadow Cove',
      floorFinishType: 'Custom Wool Carpet Tile (Shaw Contract)',
      paintFinish: 'Bauwerk Mineral Limewash - Slate Taupe',
      notes: 'Integrated 16-seat conference table with motorized pop-up microphones and Zoom Rooms audio array.'
    },
    {
      id: 'sp-pa-2',
      projectId: 'proj-alpha',
      dimensionRoomId: 'dim-pa-2',
      spaceName: 'Agile Innovation Studio',
      spaceType: 'Open Office & Collaboration',
      status: 'Approved',
      proposedLength: 54,
      proposedWidth: 32,
      proposedHeight: 13,
      doorCount: 4,
      doorWidth: 4,
      doorHeight: 9,
      windowCount: 8,
      windowWidth: 6,
      windowHeight: 9,
      wallAddedCount: 3,
      wallRemovedCount: 1,
      falseCeilingRequired: true,
      ceilingType: 'Felt Acoustic Baffles with Integrated Linear LED Extrusions',
      floorFinishType: 'Polished Terrazzo Microtopping',
      paintFinish: 'Benjamin Moore Super White & Accent Charcoal',
      notes: 'Divided into 3 pods: Deep Work Zone, Standup Whiteboard Alcove, and Soft Lounge Pod.'
    },
    {
      id: 'sp-pa-3',
      projectId: 'proj-alpha',
      dimensionRoomId: 'dim-pa-3',
      spaceName: 'Branded Hospitality Foyer',
      spaceType: 'Reception',
      status: 'In Progress',
      proposedLength: 22,
      proposedWidth: 16,
      proposedHeight: 11.5,
      doorCount: 1,
      doorWidth: 6,
      doorHeight: 9,
      windowCount: 2,
      windowWidth: 4.5,
      windowHeight: 7,
      wallAddedCount: 1,
      wallRemovedCount: 0,
      falseCeilingRequired: true,
      ceilingType: 'Backlit Stretch Fabric Ceiling (Barrisol)',
      floorFinishType: 'Bookmatched Calacatta Viola Marble Slab',
      paintFinish: 'Venetian Plaster - Warm Bone',
      notes: 'Curved reception monolithic desk in fluted bronze metal and honed marble.'
    }
  ],
  'proj-nexa': [
    {
      id: 'sp-ns-1',
      projectId: 'proj-nexa',
      dimensionRoomId: 'dim-ns-1',
      spaceName: 'Double-Height Living Salon',
      spaceType: 'Residential Living',
      status: 'Approved',
      proposedLength: 34,
      proposedWidth: 22,
      proposedHeight: 14,
      doorCount: 2,
      doorWidth: 4,
      doorHeight: 9.5,
      windowCount: 5,
      windowWidth: 6,
      windowHeight: 10,
      wallAddedCount: 0,
      wallRemovedCount: 1,
      falseCeilingRequired: true,
      ceilingType: 'Warm White Gypsum with Recessed Perimeter Lighting',
      floorFinishType: 'Herringbone Smoked European White Oak (Listone Giordano)',
      paintFinish: 'Bauwerk Limewash - Raw Earth',
      notes: 'Suspended minimalist fluted fireplace and custom low-slung Italian modular seating.'
    },
    {
      id: 'sp-ns-2',
      projectId: 'proj-nexa',
      dimensionRoomId: 'dim-ns-2',
      spaceName: 'Sanctuary Master Suite',
      spaceType: 'Master Bedroom',
      status: 'Approved',
      proposedLength: 24,
      proposedWidth: 18,
      proposedHeight: 11,
      doorCount: 2,
      doorWidth: 3.5,
      doorHeight: 8.5,
      windowCount: 3,
      windowWidth: 5,
      windowHeight: 7.5,
      wallAddedCount: 1,
      wallRemovedCount: 0,
      falseCeilingRequired: true,
      ceilingType: 'Recessed Tray Ceiling with Ambient Indirect Lighting',
      floorFinishType: '100% Organic Silk & Wool Broadloom',
      paintFinish: 'Cashmere Textured Wallcovering (Phillip Jeffries)',
      notes: 'Custom upholstered velvet headboard wall with integrated bronze reading sconces.'
    }
  ]
};

export const MOCK_SKETCHES_BY_PROJECT: Record<string, any[]> = {
  'proj-alpha': [
    {
      id: 'sk-pa-1',
      projectId: 'proj-alpha',
      title: 'Level 14 General Arrangement & Furniture Layout Plan',
      type: 'Upload',
      version: 2,
      category: 'Plan',
      url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200',
      uploadedBy: 'Kenji Takahashi',
      updatedAt: '2026-05-18'
    },
    {
      id: 'sk-pa-2',
      projectId: 'proj-alpha',
      title: 'Reflected Ceiling Plan (RCP) & Lighting Zoning',
      type: 'Upload',
      version: 1,
      category: 'Technical drawings',
      url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=1200',
      uploadedBy: 'Kenji Takahashi',
      updatedAt: '2026-05-20'
    },
    {
      id: 'sk-pa-3',
      projectId: 'proj-alpha',
      title: 'Boardroom Acoustic Wall Elevation & Millwork Detail',
      type: 'Studio',
      version: 3,
      category: 'Elevation',
      url: 'https://images.unsplash.com/photo-1600585154340-be6199f7a096?auto=format&fit=crop&q=80&w=1200',
      uploadedBy: 'Marcus Sterling',
      updatedAt: '2026-05-24'
    }
  ],
  'proj-nexa': [
    {
      id: 'sk-ns-1',
      projectId: 'proj-nexa',
      title: 'Duplex Penthouse Master Spatial Plan (1:50)',
      type: 'Upload',
      version: 1,
      category: 'Plan',
      url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200',
      uploadedBy: 'Alara Vance',
      updatedAt: '2026-06-12'
    },
    {
      id: 'sk-ns-2',
      projectId: 'proj-nexa',
      title: 'Living Salon Fireplace & Marble Feature Wall Elevation',
      type: 'Studio',
      version: 2,
      category: 'Elevation',
      url: 'https://images.unsplash.com/photo-1600585154340-be6199f7a096?auto=format&fit=crop&q=80&w=1200',
      uploadedBy: 'Chloe Dubois',
      updatedAt: '2026-06-15'
    }
  ]
};

export const MOCK_ASSETS_BY_PROJECT: Record<string, Asset[]> = {
  'proj-alpha': [
    {
      id: 'ast-pa-1',
      projectId: 'proj-alpha',
      name: 'Poltrona Frau Chancellor Conference Chair',
      folder: 'FF&E',
      subCategory: 'Furniture',
      type: 'image/jpeg',
      url: 'https://images.unsplash.com/photo-1580481077195-738af74d47d4?auto=format&fit=crop&q=80&w=800',
      size: 2450000,
      version: 'v1.0',
      notes: 'Pelle Frau saddle leather in charcoal with brushed aluminium 5-star swivel base.',
      createdAt: '2026-05-15',
      updatedAt: '2026-05-15'
    },
    {
      id: 'ast-pa-2',
      projectId: 'proj-alpha',
      name: 'Flos Arrangement Circular Pendant System',
      folder: 'Library',
      subCategory: 'Lighting',
      type: 'image/jpeg',
      url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800',
      size: 1850000,
      version: 'v2.1',
      notes: 'Modular geometric LED chandelier suspended over main executive boardroom table.',
      createdAt: '2026-05-18',
      updatedAt: '2026-05-18'
    },
    {
      id: 'ast-pa-3',
      projectId: 'proj-alpha',
      name: 'Acoustic Micro-Perforated Smoked Walnut Cladding',
      folder: 'Library',
      subCategory: 'Material',
      type: 'image/jpeg',
      url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800',
      size: 3200000,
      version: 'v1.0',
      notes: 'NRC 0.85 sound absorption rating with fire-retardant Class A core.',
      createdAt: '2026-05-19',
      updatedAt: '2026-05-19'
    },
    {
      id: 'ast-pa-4',
      projectId: 'proj-alpha',
      name: 'Executive Boardroom 3D Photorealistic Render',
      folder: '3D View',
      subCategory: '3D View',
      type: 'image/jpeg',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
      size: 5800000,
      version: 'v3.0 Final',
      notes: 'Final client signoff render showing evening lighting state and Manhattan skyline view.',
      createdAt: '2026-05-25',
      updatedAt: '2026-05-25'
    }
  ],
  'proj-nexa': [
    {
      id: 'ast-ns-1',
      projectId: 'proj-nexa',
      name: 'B&B Italia Camaleonda Modular Velvet Sofa',
      folder: 'FF&E',
      subCategory: 'Furniture',
      type: 'image/jpeg',
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
      size: 3100000,
      version: 'v1.0',
      notes: 'Custom configuration in Dedar Milano bouclé cotton velvet, sand tone.',
      createdAt: '2026-06-08',
      updatedAt: '2026-06-08'
    },
    {
      id: 'ast-ns-2',
      projectId: 'proj-nexa',
      name: 'Calacatta Viola Marble Fireplace Hearth',
      folder: 'Library',
      subCategory: 'Material',
      type: 'image/jpeg',
      url: 'https://images.unsplash.com/photo-1581421046129-078553ec162c?auto=format&fit=crop&q=80&w=800',
      size: 4200000,
      version: 'v2.0',
      notes: 'Honed Italian natural marble slab with deep burgundy veining.',
      createdAt: '2026-06-10',
      updatedAt: '2026-06-10'
    },
    {
      id: 'ast-ns-3',
      projectId: 'proj-nexa',
      name: 'Duplex Living Salon 3D Architectural Visualization',
      folder: '3D View',
      subCategory: '3D View',
      type: 'image/jpeg',
      url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
      size: 6400000,
      version: 'v2.4',
      notes: 'High-res raytraced render depicting golden hour sunlight through 14ft windows.',
      createdAt: '2026-06-18',
      updatedAt: '2026-06-18'
    }
  ]
};

export const MOCK_PRESENTATIONS_BY_PROJECT: Record<string, ProjectPresentation[]> = {
  'proj-alpha': [
    {
      id: 'pres-pa-1',
      projectId: 'proj-alpha',
      title: 'Alpha Corp Global HQ — Comprehensive Design Scheme',
      clientName: 'Alpha Corporation Executive Committee',
      status: 'Approved',
      version: 'v2.0 Client Deck',
      updatedAt: '2026-05-28',
      slides: [
        {
          id: 'sl-1',
          title: 'The Modern Intelligent Workspace',
          type: 'cover',
          subtitle: 'Architectural & Interior Design Concept Presentation',
          description: 'A forward-thinking corporate headquarters designed to foster deep focus, organic cross-functional collaboration, and executive hospitality.',
          imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'
        },
        {
          id: 'sl-2',
          title: 'Design Philosophy & Materiality Spectrum',
          type: 'materials',
          subtitle: 'Acoustic Comfort, Honed Stone, and Tactile Warmth',
          description: 'Combining natural acoustic smoked walnut slats with textured Bauwerk mineral limewash and monolithic Calacatta Viola focal moments.',
          imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1200',
          keyPoints: [
            'Smoked European Walnut Acoustic Slats (NRC 0.85)',
            'Bauwerk Slate Taupe Mineral Breathable Limewash',
            'Flos Custom Modular LED Extrusions (3000K Warm White)',
            'Poltrona Frau Saddle Leather Executive Seating'
          ]
        },
        {
          id: 'sl-3',
          title: 'Spatial Zoning & High-Density Flow',
          type: 'spaces',
          subtitle: 'From Public Reception to Confidential Boardroom Suites',
          description: 'Optimized acoustic thresholds separating dynamic open town hall gathering spaces from high-security executive suites.',
          imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1200',
          keyPoints: [
            'Executive Boardroom (28ft × 18ft, 16-person motorized conferencing)',
            'Agile Innovation Studio (54ft × 32ft, 3 modular teamwork pods)',
            'Hospitality Welcome Gallery (22ft × 16ft, monolithic reception)',
            'Town Hall & Cafe Lounge (36ft × 24ft, integrated barista bar)'
          ]
        },
        {
          id: 'sl-4',
          title: 'Photorealistic Architectural Visualizations',
          type: 'renders',
          subtitle: 'Final Rendered Key Views',
          description: 'Daylight and evening scenarios calibrated to San Francisco daylight angles.',
          imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'
        }
      ]
    }
  ],
  'proj-nexa': [
    {
      id: 'pres-ns-1',
      projectId: 'proj-nexa',
      title: 'Nexa Skyline Duplex Penthouse Presentation',
      clientName: 'Nexa Real Estate / Penthouse Owner',
      status: 'Approved',
      version: 'v3.1 Final',
      updatedAt: '2026-06-20',
      slides: [
        {
          id: 'sl-ns-1',
          title: 'Skyline Sanctuary Penthouse',
          type: 'cover',
          subtitle: 'Luxury High-Rise Interior Concept & Spatial Vision',
          description: 'Curated blend of Italian minimalism, organic warm textures, and floor-to-ceiling panoramic skyline connection.',
          imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200'
        },
        {
          id: 'sl-ns-2',
          title: 'Grand Living Salon & Dining Experience',
          type: 'spaces',
          subtitle: '34ft × 22ft Double-Height Panoramic Living',
          description: 'Framing 270-degree city views with low-profile Italian modular seating, bespoke Calacatta fireplace, and herringbone oak.',
          imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6199f7a096?auto=format&fit=crop&q=80&w=1200'
        }
      ]
    }
  ]
};

export const MOCK_APPROVALS_BY_PROJECT: Record<string, ProjectApproval[]> = {
  'proj-alpha': [
    {
      id: 'appr-pa-1',
      projectId: 'proj-alpha',
      title: 'Initial Concept & Moodboard Direction',
      category: 'Concept Design',
      status: 'Approved',
      submittedBy: 'Alara Vance (Project Lead)',
      submittedAt: '2026-05-12',
      reviewedBy: 'Arthur Pendelton (Alpha Corp VP)',
      reviewedAt: '2026-05-14',
      feedback: 'Excellent aesthetic direction. The combination of smoked walnut and subtle bronze metal accents fits our corporate identity perfectly.',
      unlocksCostModule: false,
      version: 'v1.0'
    },
    {
      id: 'appr-pa-2',
      projectId: 'proj-alpha',
      title: 'Existing Site Dimension Survey & Space Allocations',
      category: 'Space Planning',
      status: 'Approved',
      submittedBy: 'Kenji Takahashi (Draftsman)',
      submittedAt: '2026-05-20',
      reviewedBy: 'Alara Vance (Project Lead)',
      reviewedAt: '2026-05-21',
      feedback: 'Dimension matrix verified against structural civil drawings. Floor load tests cleared for heavy stone reception desk.',
      unlocksCostModule: false,
      version: 'v1.2'
    },
    {
      id: 'appr-pa-3',
      projectId: 'proj-alpha',
      title: 'Technical Drawing Package & Reflected Ceiling Plan (RCP)',
      category: 'Technical Drawings',
      status: 'Approved',
      submittedBy: 'Marcus Sterling (Lead Designer)',
      submittedAt: '2026-05-26',
      reviewedBy: 'Vikram Mehta (Site Supervisor)',
      reviewedAt: '2026-05-27',
      feedback: 'HVAC diffuser locations harmonized with Flos circular lighting grid. Construction set ready.',
      unlocksCostModule: false,
      version: 'v2.0'
    },
    {
      id: 'appr-pa-4',
      projectId: 'proj-alpha',
      title: 'Final Architectural Design Sign-off & BOQ Baseline',
      category: 'BOQ & Final Signoff',
      status: 'Approved',
      submittedBy: 'Alara Vance (Project Lead)',
      submittedAt: '2026-05-28',
      reviewedBy: 'Arthur Pendelton (Alpha Corp Client)',
      reviewedAt: '2026-05-29',
      feedback: 'Approved by executive committee. Studio design phase locked. Costing and vendor procurement authorization granted.',
      unlocksCostModule: true,
      version: 'v2.1 Final'
    }
  ],
  'proj-nexa': [
    {
      id: 'appr-ns-1',
      projectId: 'proj-nexa',
      title: 'Duplex Penthouse Concept Presentation',
      category: 'Concept Design',
      status: 'Approved',
      submittedBy: 'Alara Vance',
      submittedAt: '2026-06-10',
      reviewedBy: 'Sophia Nexa',
      reviewedAt: '2026-06-12',
      feedback: 'Love the minimalist Japandi and Italian luxury warmth. Please proceed with space planning.',
      unlocksCostModule: false,
      version: 'v1.0'
    },
    {
      id: 'appr-ns-2',
      projectId: 'proj-nexa',
      title: 'Material Schedule & FF&E Selection Sign-off',
      category: 'Material Schedule',
      status: 'Approved',
      submittedBy: 'Chloe Dubois',
      submittedAt: '2026-06-22',
      reviewedBy: 'Sophia Nexa',
      reviewedAt: '2026-06-24',
      feedback: 'Calacatta Viola and Listone Giordano wood floor approved. Unlocking Cost and Vendor procurement.',
      unlocksCostModule: true,
      version: 'v2.0'
    }
  ]
};

export const MOCK_REVISIONS_BY_PROJECT: Record<string, ProjectRevision[]> = {
  'proj-alpha': [
    {
      id: 'rev-pa-1',
      projectId: 'proj-alpha',
      revisionCode: 'REV-01',
      title: 'Boardroom AV & Video Conferencing Expansion',
      description: 'Upgraded table wireway raceways and added dual 85-inch display recess niches on North acoustic partition.',
      author: 'Marcus Sterling',
      affectedModule: 'Spaces',
      changeSummary: [
        'Added 2 recess niches (6.5ft × 4ft) on North Wall',
        'Updated false ceiling drop to 12 inches for acoustic insulation',
        'Specified concealed 3-phase floor box conduits'
      ],
      status: 'Approved',
      createdAt: '2026-05-18'
    },
    {
      id: 'rev-pa-2',
      projectId: 'proj-alpha',
      revisionCode: 'REV-02',
      title: 'Foyer Marble Cladding & Lighting Refinement',
      description: 'Switched from standard white Carrara to bookmatched Calacatta Viola for greater brand prestige.',
      author: 'Chloe Dubois',
      affectedModule: 'Material Spec',
      changeSummary: [
        'Updated reception flooring to Calacatta Viola honed slab',
        'Integrated perimeter Barrisol stretch fabric lighting',
        'Adjusted structural wall mounting bracket tolerance'
      ],
      status: 'Approved',
      createdAt: '2026-05-24'
    },
    {
      id: 'rev-pa-3',
      projectId: 'proj-alpha',
      revisionCode: 'REV-03',
      title: 'Town Hall Acoustic Baffle Layout Optimization',
      description: 'Modified ceiling felt baffle spacing from 8 inches to 6 inches on center to reduce reverberation.',
      author: 'Kenji Takahashi',
      affectedModule: 'Sketches',
      changeSummary: [
        'Reflected Ceiling Plan v2.0 issued',
        'Acoustic reverberation time reduced to 0.42 seconds'
      ],
      status: 'Approved',
      createdAt: '2026-05-27'
    }
  ],
  'proj-nexa': [
    {
      id: 'rev-ns-1',
      projectId: 'proj-nexa',
      revisionCode: 'REV-01',
      title: 'Living Salon Floor Finish Upgrade',
      description: 'Upgraded flooring to herringbone smoked European white oak with 150mm border perimeter framing.',
      author: 'Chloe Dubois',
      affectedModule: 'Spaces',
      changeSummary: [
        'Specified Listone Giordano 90×600mm herringbone planks',
        'Adjusted door undercut clearance to 18mm'
      ],
      status: 'Approved',
      createdAt: '2026-06-16'
    }
  ]
};
