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
  status: 'Draft' | 'In Review' | 'Approved' | 'Rejected';
  createdAt: string;
}

// MOCK DATA GENERATOR BY PROJECT ID (Unified under Demo Project)
export const MOCK_TEAM_BY_PROJECT: Record<string, TeamMember[]> = {
  'proj-goldmine': [
    { id: 'tm-gm-1', projectId: 'proj-goldmine', userId: 'u-101', name: 'Jitendra Mewada', email: 'jitendra@demoproject.com', role: 'Project Lead', assignedAt: '2026-05-01' },
    { id: 'tm-gm-2', projectId: 'proj-goldmine', userId: 'u-102', name: 'Marcus Sterling', email: 'marcus.s@demoproject.com', role: 'Lead Designer', assignedAt: '2026-05-02' },
    { id: 'tm-gm-3', projectId: 'proj-goldmine', userId: 'u-103', name: 'Elena Rostova', email: 'elena.r@demoproject.com', role: '3D Designer', assignedAt: '2026-05-05' },
    { id: 'tm-gm-4', projectId: 'proj-goldmine', userId: 'u-104', name: 'Kenji Takahashi', email: 'kenji.t@demoproject.com', role: 'Draftsman', assignedAt: '2026-05-06' },
    { id: 'tm-gm-5', projectId: 'proj-goldmine', userId: 'u-105', name: 'Vikram Mehta', email: 'vikram.m@demoproject.com', role: 'Site Supervisor', assignedAt: '2026-05-10' },
    { id: 'tm-gm-6', projectId: 'proj-goldmine', userId: 'u-106', name: 'Demo Client', email: 'client@demoproject.com', role: 'Client', assignedAt: '2026-05-01' }
  ]
};

export const MOCK_DIMENSIONS_BY_PROJECT: Record<string, Dimension[]> = {
  'proj-goldmine': [
    {
      id: 'dim-gm-1',
      projectId: 'proj-goldmine',
      roomName: 'Living / Dining Area',
      length: 30.25,
      width: 30.83,
      height: 9.83,
      doorCount: 2,
      doorWidth: 3.75,
      doorHeight: 7.0,
      windowCount: 2,
      windowWidth: 10.25,
      windowHeight: 6.5,
      sillHeight: 0.5,
      lintelHeight: 7.0,
      floorCount: 1,
      ceilingCount: 1,
      ceilingHeight: 8.83,
      wallCount: 4,
      beamCount: 2,
      beamHeight: 1.08,
      beamWidth: 1.0,
      notes: 'Carpet Area: 718 Sq.Ft., Perimeter: 165 R.Ft. Clear Height: 8\'-10". High quality Italian Marble flooring & POP false ceiling specified.',
      attachments: []
    },
    {
      id: 'dim-gm-2',
      projectId: 'proj-goldmine',
      roomName: 'Master Bedroom',
      length: 22.0,
      width: 17.5,
      height: 9.83,
      doorCount: 2,
      doorWidth: 3.25,
      doorHeight: 7.0,
      windowCount: 2,
      windowWidth: 6.5,
      windowHeight: 6.0,
      sillHeight: 1.5,
      lintelHeight: 7.0,
      floorCount: 1,
      ceilingCount: 1,
      ceilingHeight: 8.83,
      wallCount: 4,
      beamCount: 2,
      beamHeight: 1.08,
      beamWidth: 1.0,
      notes: 'Carpet Area: 385 Sq.Ft. Luxury master suite with full height custom wardrobe joinery and indirect cove LED.',
      attachments: []
    },
    {
      id: 'dim-gm-3',
      projectId: 'proj-goldmine',
      roomName: "Children's Bedroom",
      length: 18.5,
      width: 16.0,
      height: 9.83,
      doorCount: 1,
      doorWidth: 3.25,
      doorHeight: 7.0,
      windowCount: 1,
      windowWidth: 7.0,
      windowHeight: 6.0,
      sillHeight: 1.5,
      lintelHeight: 7.0,
      floorCount: 1,
      ceilingCount: 1,
      ceilingHeight: 8.83,
      wallCount: 4,
      beamCount: 1,
      beamHeight: 1.08,
      beamWidth: 1.0,
      notes: 'Carpet Area: 296 Sq.Ft. Integrated study desks, loft storage, and acoustic panelling.',
      attachments: []
    },
    {
      id: 'dim-gm-4',
      projectId: 'proj-goldmine',
      roomName: 'Guest Bedroom & Study',
      length: 20.0,
      width: 19.75,
      height: 9.83,
      doorCount: 1,
      doorWidth: 3.25,
      doorHeight: 7.0,
      windowCount: 2,
      windowWidth: 5.5,
      windowHeight: 6.0,
      sillHeight: 1.5,
      lintelHeight: 7.0,
      floorCount: 1,
      ceilingCount: 1,
      ceilingHeight: 8.83,
      wallCount: 4,
      beamCount: 1,
      beamHeight: 1.08,
      beamWidth: 1.0,
      notes: 'Carpet Area: 395 Sq.Ft. Flexible multipurpose suite with sofa-cum-bed and modular storage.',
      attachments: []
    }
  ]
};

export const MOCK_SPACES_BY_PROJECT: Record<string, Space[]> = {
  'proj-goldmine': [
    {
      id: 'sp-gm-1',
      projectId: 'proj-goldmine',
      dimensionRoomId: 'dim-gm-1',
      spaceName: 'Living / Dining Area',
      spaceType: 'Living & Dining Salon',
      status: 'Approved',
      proposedLength: 30.25,
      proposedWidth: 30.83,
      proposedHeight: 9.83,
      doorCount: 2,
      doorWidth: 3.75,
      doorHeight: 7.0,
      windowCount: 2,
      windowWidth: 10.25,
      windowHeight: 6.5,
      wallAddedCount: 1,
      wallRemovedCount: 0,
      falseCeilingRequired: true,
      ceilingType: 'Saint-Gobain Gyproc False Ceiling with Peripheral Indirect Pelmets',
      floorFinishType: 'Bespoke Italian Botticino / Dyna Marble with Mirror Diamond Polish',
      paintFinish: 'Royale Luxury Breathable Emulsion with PU Metallic Accent Trims',
      notes: 'Total Room Estimate: ₹29,58,252.25 (₹4,120.13/sq.ft). Complete Trade Annexures A through J linked to Vendor Rate Cards.'
    },
    {
      id: 'sp-gm-2',
      projectId: 'proj-goldmine',
      dimensionRoomId: 'dim-gm-2',
      spaceName: 'Master Bedroom Suite',
      spaceType: 'Master Suite',
      status: 'Approved',
      proposedLength: 22.0,
      proposedWidth: 17.5,
      proposedHeight: 9.83,
      doorCount: 2,
      doorWidth: 3.25,
      doorHeight: 7.0,
      windowCount: 2,
      windowWidth: 6.5,
      windowHeight: 6.0,
      wallAddedCount: 1,
      wallRemovedCount: 0,
      falseCeilingRequired: true,
      ceilingType: 'Recessed Tray Ceiling with Ambient Indirect Lighting',
      floorFinishType: 'Herringbone Smoked European White Oak Flooring',
      paintFinish: 'Textured Fluted Wall Panelling & Velvet Bed-Back Upholstery',
      notes: 'Total Room Estimate: ₹28,45,190.50 (₹7,390.10/sq.ft). MasterCraft Custom Joinery & Voltech Smart Lighting.'
    },
    {
      id: 'sp-gm-3',
      projectId: 'proj-goldmine',
      dimensionRoomId: 'dim-gm-3',
      spaceName: "Children's Bedroom Space",
      spaceType: "Children's Room",
      status: 'Approved',
      proposedLength: 18.5,
      proposedWidth: 16.0,
      proposedHeight: 9.83,
      doorCount: 1,
      doorWidth: 3.25,
      doorHeight: 7.0,
      windowCount: 1,
      windowWidth: 7.0,
      windowHeight: 6.0,
      wallAddedCount: 0,
      wallRemovedCount: 0,
      falseCeilingRequired: true,
      ceilingType: 'Minimalist Continuous POP Ceiling with Magnetic Track Lights',
      floorFinishType: 'Italian Marble with Epoxy Grout',
      paintFinish: 'Washable Silk Sheen Emulsion',
      notes: 'Total Room Estimate: ₹21,80,680.50 (₹7,367.16/sq.ft). Integrated study desk & hydraulic beds.'
    },
    {
      id: 'sp-gm-4',
      projectId: 'proj-goldmine',
      dimensionRoomId: 'dim-gm-4',
      spaceName: 'Guest Bedroom & Study Suite',
      spaceType: 'Guest Room',
      status: 'Approved',
      proposedLength: 20.0,
      proposedWidth: 19.75,
      proposedHeight: 9.83,
      doorCount: 1,
      doorWidth: 3.25,
      doorHeight: 7.0,
      windowCount: 2,
      windowWidth: 5.5,
      windowHeight: 6.0,
      wallAddedCount: 0,
      wallRemovedCount: 0,
      falseCeilingRequired: true,
      ceilingType: 'Cove Pelmet with Perimeter Dim-to-Warm Strip Lighting',
      floorFinishType: 'Italian Marble Floor with Matching Skirting',
      paintFinish: 'Warm Taupe Royale Velvet Emulsion',
      notes: 'Total Room Estimate: ₹18,01,700.00 (₹4,561.27/sq.ft). High flexibility guest room and work studio.'
    }
  ]
};

export const MOCK_SKETCHES_BY_PROJECT: Record<string, any[]> = {
  'proj-goldmine': [
    {
      id: 'sk-gm-1',
      projectId: 'proj-goldmine',
      title: 'Master Architectural General Arrangement & Space Layout (1:50)',
      type: 'Upload',
      version: 2,
      category: 'Plan',
      url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200',
      uploadedBy: 'Kenji Takahashi',
      updatedAt: '2026-05-18'
    },
    {
      id: 'sk-gm-2',
      projectId: 'proj-goldmine',
      title: 'Reflected Ceiling Plan (RCP) & Electrical Conduit Routing',
      type: 'Upload',
      version: 2,
      category: 'Technical drawings',
      url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=1200',
      uploadedBy: 'Kenji Takahashi',
      updatedAt: '2026-05-20'
    },
    {
      id: 'sk-gm-3',
      projectId: 'proj-goldmine',
      title: 'Living Salon & Master Suite Custom Joinery Elevations',
      type: 'Studio',
      version: 3,
      category: 'Elevation',
      url: 'https://images.unsplash.com/photo-1600585154340-be6199f7a096?auto=format&fit=crop&q=80&w=1200',
      uploadedBy: 'Marcus Sterling',
      updatedAt: '2026-05-24'
    }
  ]
};

export const MOCK_ASSETS_BY_PROJECT: Record<string, Asset[]> = {
  'proj-goldmine': [
    {
      id: 'ast-gm-1',
      projectId: 'proj-goldmine',
      name: 'Artefact Luxury Custom 10-Seat Dining Table & Credenza',
      folder: 'FF&E',
      subCategory: 'Furniture',
      type: 'image/jpeg',
      url: 'https://images.unsplash.com/photo-1580481077195-738af74d47d4?auto=format&fit=crop&q=80&w=800',
      size: 2450000,
      version: 'v1.0',
      notes: 'Smoked oak top with solid brass chamfered base by Artefact Luxury.',
      createdAt: '2026-05-15',
      updatedAt: '2026-05-15'
    },
    {
      id: 'ast-gm-2',
      projectId: 'proj-goldmine',
      name: 'Lumina Architectural Magnetic Linear Suspended Profile System',
      folder: 'Library',
      subCategory: 'Lighting',
      type: 'image/jpeg',
      url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800',
      size: 1850000,
      version: 'v2.1',
      notes: 'DALI-2 dimmable 3000K warm architectural lighting extrusions.',
      createdAt: '2026-05-18',
      updatedAt: '2026-05-18'
    },
    {
      id: 'ast-gm-3',
      projectId: 'proj-goldmine',
      name: 'Honed Italian Botticino / Dyna Marble Slabs (Avg 75mm bedding)',
      folder: 'Library',
      subCategory: 'Material',
      type: 'image/jpeg',
      url: 'https://images.unsplash.com/photo-1581421046129-078553ec162c?auto=format&fit=crop&q=80&w=800',
      size: 3200000,
      version: 'v1.0',
      notes: 'Premium slab selection from Apex Civil & Stone division.',
      createdAt: '2026-05-20',
      updatedAt: '2026-05-20'
    },
    {
      id: 'ast-gm-4',
      projectId: 'proj-goldmine',
      name: 'Demo Project Master Residence 3D Raytraced Photorealistic Visualization',
      folder: '3D View',
      subCategory: '3D View',
      type: 'image/jpeg',
      url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
      size: 5800000,
      version: 'v3.0 Final',
      notes: 'Final client signoff render showing evening lighting state and interior finishes.',
      createdAt: '2026-05-25',
      updatedAt: '2026-05-25'
    }
  ]
};

export const MOCK_PRESENTATIONS_BY_PROJECT: Record<string, ProjectPresentation[]> = {
  'proj-goldmine': [
    {
      id: 'pres-gm-1',
      projectId: 'proj-goldmine',
      title: 'Demo Project — Comprehensive Architectural & Interior Scheme',
      clientName: 'Demo Client',
      status: 'Approved',
      version: 'v2.0 Master Client Deck',
      updatedAt: '2026-05-28',
      slides: [
        {
          id: 'sl-1',
          title: 'The Intelligent Luxury Built Environment',
          type: 'cover',
          subtitle: 'Architectural & Interior Design Concept Presentation',
          description: 'A benchmark residence and executive suite combining bespoke craftsmanship, trade-wise precision engineering, and systemic execution.',
          imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200'
        },
        {
          id: 'sl-2',
          title: 'Design Philosophy & Materiality Spectrum',
          type: 'materials',
          subtitle: 'Acoustic Comfort, Honed Italian Marble, and Tactile Joinery',
          description: 'Combining natural acoustic smoked walnut slats with textured Royale breathable mineral finishes and bookmatched Italian marble flooring.',
          imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1200',
          keyPoints: [
            'Honed Italian Botticino / Dyna Marble with 3-Coat Diamond Polish',
            'Gyprock Saint-Gobain False Ceiling with Continuous Cove Profiles',
            'Voltech Smart DALI-2 Dimmable Lighting System',
            'MasterCraft Marine Grade Commercial Plywood & Natural Teak Joinery'
          ]
        },
        {
          id: 'sl-3',
          title: 'Spatial Zoning & Trade BOQ Synthesis',
          type: 'spaces',
          subtitle: 'From Living / Dining to Master and Multipurpose Suites',
          description: 'Total Carpet Area: 1,794 Sq.Ft. Total Project Estimate: ₹97,85,823.25 (₹5,454.75/sq.ft).',
          imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6199f7a096?auto=format&fit=crop&q=80&w=1200',
          keyPoints: [
            'Living / Dining Salon (718 sq.ft, ₹29,58,252.25 estimate)',
            'Master Bedroom Suite (385 sq.ft, ₹28,45,190.50 estimate)',
            "Children's Bedroom Space (296 sq.ft, ₹21,80,680.50 estimate)",
            'Guest Bedroom & Study (395 sq.ft, ₹18,01,700.00 estimate)'
          ]
        }
      ]
    }
  ]
};

export const MOCK_APPROVALS_BY_PROJECT: Record<string, ProjectApproval[]> = {
  'proj-goldmine': [
    {
      id: 'appr-gm-1',
      projectId: 'proj-goldmine',
      title: 'Initial Concept & Aesthetic Material Direction',
      category: 'Concept Design',
      status: 'Approved',
      submittedBy: 'Jitendra Mewada (Lead Estimator & Project Lead)',
      submittedAt: '2026-05-12',
      reviewedBy: 'Demo Client',
      reviewedAt: '2026-05-14',
      feedback: 'Excellent aesthetic direction. The combination of Italian marble, warm woodwork, and clean false ceiling lines meets all expectations.',
      unlocksCostModule: false,
      version: 'v1.0'
    },
    {
      id: 'appr-gm-2',
      projectId: 'proj-goldmine',
      title: 'Existing Site Dimension Survey & Space Allocations',
      category: 'Space Planning',
      status: 'Approved',
      submittedBy: 'Kenji Takahashi (Draftsman)',
      submittedAt: '2026-05-20',
      reviewedBy: 'Jitendra Mewada (Project Lead)',
      reviewedAt: '2026-05-21',
      feedback: 'Dimension matrix verified against structural civil drawings. 1,794 sq.ft total carpet area confirmed.',
      unlocksCostModule: false,
      version: 'v1.2'
    },
    {
      id: 'appr-gm-3',
      projectId: 'proj-goldmine',
      title: 'Technical Drawing Package & Reflected Ceiling Plan (RCP)',
      category: 'Technical Drawings',
      status: 'Approved',
      submittedBy: 'Marcus Sterling (Lead Designer)',
      submittedAt: '2026-05-25',
      reviewedBy: 'Demo Client',
      reviewedAt: '2026-05-26',
      feedback: 'All MEP conduits, HVAC drops, and switch placements approved.',
      unlocksCostModule: false,
      version: 'v2.0'
    },
    {
      id: 'appr-gm-4',
      projectId: 'proj-goldmine',
      title: 'Master Trade-wise BOQ & Final Commercial Signoff (Annexures A to J)',
      category: 'BOQ & Final Signoff',
      status: 'Approved',
      submittedBy: 'Jitendra Mewada (Lead Estimator)',
      submittedAt: '2026-05-28',
      reviewedBy: 'Demo Client',
      reviewedAt: '2026-05-28',
      feedback: 'Comprehensive BOQ approved for ₹97,85,823.25. Unlocking Cost and Vendor procurement modules.',
      unlocksCostModule: true,
      version: 'v2.1 Final'
    }
  ]
};

export const MOCK_REVISIONS_BY_PROJECT: Record<string, ProjectRevision[]> = {
  'proj-goldmine': [
    {
      id: 'rev-gm-1',
      projectId: 'proj-goldmine',
      revisionCode: 'REV-01',
      title: 'Living Salon Italian Marble Selection & Mirror Polish Upgrade',
      description: 'Upgraded to premium Italian marble with 3-coat diamond silicate polish for high durability.',
      author: 'Jitendra Mewada',
      affectedModule: 'Material Spec',
      changeSummary: [
        'Added chemical joint epoxy filling across 718 sq.ft',
        'Specified pencil edge 3-inch marble skirting (165 R.Ft)',
        'Linked Trade A Annexure with Apex Civil Infra rate card'
      ],
      status: 'Approved',
      createdAt: '2026-05-18'
    },
    {
      id: 'rev-gm-2',
      projectId: 'proj-goldmine',
      revisionCode: 'REV-02',
      title: 'Master Bedroom Cove Lighting & DALI-2 Smart Switching',
      description: 'Integrated Voltech Smart MEP dimmable lighting profiles with Schneider modular plates.',
      author: 'Marcus Sterling',
      affectedModule: 'Spaces',
      changeSummary: [
        'Updated Electrical Trade C & D itemizations',
        'Added indirect LED cove troughs in Gyprock false ceiling'
      ],
      status: 'Approved',
      createdAt: '2026-05-24'
    }
  ]
};
