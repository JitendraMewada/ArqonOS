import { EditorialSwatch, EditorialMaterial } from '../StudioContext';

export interface MoodboardTemplatePreset {
  id: string;
  name: string;
  category: 'Interior Design' | 'Architectural' | 'Hospitality' | 'Residential' | 'Commercial';
  style: string;
  description: string;
  layoutType: 'editorial' | 'artistic' | 'grid';
  thumbnailUrl: string;
  tags: string[];
  colorPalette: string[];
  
  // Editorial options
  editorialTheme?: 'bohemian' | 'japandi' | 'minimalist';
  eyebrow?: string;
  tagline?: string;
  clientName?: string;
  roomName?: string;
  conceptDate?: string;
  editorialConcept?: string;
  swatches?: EditorialSwatch[];
  tiles?: string[];
  materials?: EditorialMaterial[];

  // Grid options
  narrative?: string;
  heroSlot?: string;
  technicalGrid?: string[];
  materialPalette?: string[];

  // Artistic canvas options
  elements?: Array<{
    id: string;
    type: 'image' | 'text' | 'color' | 'vellum_note' | 'material_swatch';
    content: string;
    label?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    zIndex: number;
    opacity: number;
    backgroundColor?: string;
  }>;
}

export const MOODBOARD_TEMPLATES: MoodboardTemplatePreset[] = [
  {
    id: 'bohemian-eclectic-editorial',
    name: 'Bohemian Eclectic Editorial',
    category: 'Residential',
    style: 'Bohemian Eclectic',
    description: 'Layered, well-travelled, gently maximalist room concept featuring saturated earth tones, vintage brass, patterned textiles, and layered greenery.',
    layoutType: 'editorial',
    editorialTheme: 'bohemian',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
    tags: ['Terracotta', 'Kilim Rugs', 'Aged Brass', 'Eclectic', 'Warm Oat'],
    colorPalette: ['#B5583A', '#C99A3D', '#2F4F4A', '#7A3B4E', '#E8D5B5', '#2B2420'],
    eyebrow: 'Concept 03 of 03',
    tagline: 'Layered, well-travelled, gently maximal — a room built by hand, not by set.',
    clientName: 'The Moroccan Villa',
    roomName: 'Living & Lounge Area',
    conceptDate: 'Autumn 2026',
    editorialConcept: 'A rich tapestry of saturated earth tones, vintage brass, patterned textiles, and layered greenery. This space embraces eclectic curation where every object carries a story. Textures range from nubby handwoven wool to aged velvet and warm terracotta.',
    swatches: [
      { id: 's-1', hex: '#B5583A', label: 'Terracotta' },
      { id: 's-2', hex: '#C99A3D', label: 'Ochre' },
      { id: 's-3', hex: '#2F4F4A', label: 'Deep Forest' },
      { id: 's-4', hex: '#7A3B4E', label: 'Plum' },
      { id: 's-5', hex: '#E8D5B5', label: 'Warm Oat' },
      { id: 's-6', hex: '#2B2420', label: 'Dark Wood' }
    ],
    tiles: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80'
    ],
    materials: [
      { id: 'm-1', hex: '#B5583A', name: 'Kilim wool', note: 'rug & cushions' },
      { id: 'm-2', hex: '#C99A3D', name: 'Aged brass', note: 'hardware & lighting' },
      { id: 'm-3', hex: '#D4A373', name: 'Rattan & cane', note: 'accent chairs' },
      { id: 'm-4', hex: '#7A3B4E', name: 'Washed velvet', note: 'drapery' },
      { id: 'm-5', hex: '#E8D5B5', name: 'Raw linen', note: 'sofa slipcover' },
      { id: 'm-6', hex: '#2F4F4A', name: 'Glazed zellige', note: 'tile backsplash' }
    ]
  },
  {
    id: 'japandi-warm-neutral-editorial',
    name: 'Japandi Warm Neutral Editorial',
    category: 'Residential',
    style: 'Japandi Warm Neutral',
    description: 'Scandinavian restraint meets wabi-sabi warmth — low furniture, soft asymmetry, natural imperfection, and tactile minimalism.',
    layoutType: 'editorial',
    editorialTheme: 'japandi',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&auto=format&fit=crop&q=80',
    tags: ['Wabi-Sabi', 'Light Ash', 'Washi Paper', 'Limewash', 'Tatami'],
    colorPalette: ['#FAF5EA', '#E8DEC8', '#C99A6C', '#74805F', '#9E8B75', '#2E2A25'],
    eyebrow: 'CONCEPT 02 OF 03',
    tagline: 'Scandinavian restraint meets wabi-sabi warmth — low furniture, soft asymmetry, natural imperfection.',
    clientName: 'Kyoto House Kyoto',
    roomName: 'Master Sanctuary',
    conceptDate: 'Winter 2026',
    editorialConcept: 'A harmonious study in tactile restraint. Light ash wood, unbleached linen, and lime-wash plaster combine to create a space that breathes. Nothing is purely decorative; everything has purpose, texture, and quiet presence.',
    swatches: [
      { id: 's-1', hex: '#FAF5EA', label: 'Rice Paper' },
      { id: 's-2', hex: '#E8DEC8', label: 'Limewash' },
      { id: 's-3', hex: '#C99A6C', label: 'Raw Clay' },
      { id: 's-4', hex: '#74805F', label: 'Moss' },
      { id: 's-5', hex: '#9E8B75', label: 'Warm Oak' },
      { id: 's-6', hex: '#2E2A25', label: 'Sumi Ink' }
    ],
    tiles: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80'
    ],
    materials: [
      { id: 'm-1', hex: '#D9C5A0', name: 'Light Ash Wood', note: 'joinery & tables' },
      { id: 'm-2', hex: '#FAF5EA', name: 'Washi Paper', note: 'pendant lamps' },
      { id: 'm-3', hex: '#E8DEC8', name: 'Limewash Plaster', note: 'walls & ceiling' },
      { id: 'm-4', hex: '#9E8B75', name: 'Belgian Linen', note: 'curtains & bedding' },
      { id: 'm-5', hex: '#C99A6C', name: 'Unglazed Clay', note: 'vessels & lamps' },
      { id: 'm-6', hex: '#74805F', name: 'Tatami Weave', note: 'floor mats' }
    ]
  },
  {
    id: 'modern-minimalist-editorial',
    name: 'Modern Minimalist Editorial',
    category: 'Commercial',
    style: 'Modern Minimalist',
    description: 'Quiet, uncluttered, sculptural — a space that edits itself down to what matters with honed stone, microcement, and clean lines.',
    layoutType: 'editorial',
    editorialTheme: 'minimalist',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    tags: ['Honed Stone', 'Microcement', 'Smoked Oak', 'Bouclé', 'Sculptural'],
    colorPalette: ['#FFFFFF', '#EBE7DF', '#B8B3A8', '#6B705C', '#3D3A35', '#1A1918'],
    eyebrow: 'CONCEPT 01 OF 03',
    tagline: 'Quiet, uncluttered, sculptural — a space that edits itself down to what matters.',
    clientName: 'Tribeca Penthouse',
    roomName: 'Main Living & Gallery',
    conceptDate: 'Spring 2026',
    editorialConcept: 'An intentional composition of pure geometry, micro-cement, honed stone, and warm architectural lighting. Every line is considered, every material authentic. Negative space is treated as an active design element rather than an empty void.',
    swatches: [
      { id: 's-1', hex: '#FFFFFF', label: 'Pure White' },
      { id: 's-2', hex: '#EBE7DF', label: 'Warm Grey' },
      { id: 's-3', hex: '#B8B3A8', label: 'Taupe' },
      { id: 's-4', hex: '#6B705C', label: 'Olive' },
      { id: 's-5', hex: '#3D3A35', label: 'Charcoal' },
      { id: 's-6', hex: '#1A1918', label: 'Absolute Black' }
    ],
    tiles: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80'
    ],
    materials: [
      { id: 'm-1', hex: '#EBE7DF', name: 'Honed Limestone', note: 'flooring & hearth' },
      { id: 'm-2', hex: '#8A857C', name: 'Brushed Stainless', note: 'hardware & taps' },
      { id: 'm-3', hex: '#FFFFFF', name: 'Bouclé Wool', note: 'lounge seating' },
      { id: 'm-4', hex: '#3D3A35', name: 'Smoked Oak', note: 'custom millwork' },
      { id: 'm-5', hex: '#B8B3A8', name: 'Microcement', note: 'island & baths' },
      { id: 'm-6', hex: '#6B705C', name: 'Sheer Linen', note: 'floor-to-ceiling' }
    ]
  },
  {
    id: 'japandi-minimalism',
    name: 'Japandi Organic Minimalism (Canvas)',
    category: 'Residential',
    style: 'Japandi',
    description: 'A seamless blend of Scandinavian functionality and Japanese wabi-sabi rustic simplicity featuring raw oak, textured linen, and neutral earth tones.',
    layoutType: 'artistic',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&auto=format&fit=crop&q=80',
    tags: ['Wabi-Sabi', 'Light Oak', 'Natural Linen', 'Earthy'],
    colorPalette: ['#E6DFD5', '#C4B5A5', '#8C7D70', '#4A3E3D', '#D9822B'],
    narrative: 'Harmonious spatial flow celebrating authentic tactile imperfections, unvarnished natural timbers, diffused rice paper illumination, and serene negative space.',
    heroSlot: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=900&auto=format&fit=crop&q=80',
    technicalGrid: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&auto=format&fit=crop&q=80'
    ],
    materialPalette: [
      'https://images.unsplash.com/photo-1546484475-7f7bd55792da?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80'
    ],
    elements: [
      {
        id: 'el-jap-1',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=900&auto=format&fit=crop&q=80',
        x: 40,
        y: 40,
        width: 380,
        height: 260,
        rotation: -2,
        zIndex: 1,
        opacity: 1
      },
      {
        id: 'el-jap-2',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
        x: 360,
        y: 80,
        width: 320,
        height: 230,
        rotation: 3,
        zIndex: 2,
        opacity: 0.95
      },
      {
        id: 'el-jap-3',
        type: 'vellum_note',
        content: 'SPECIFICATION:\n• Natural bleached white oak\n• 100% Belgian unbleached linen upholstery\n• Honed Ivory Travertine fireplace mantle\n• Concealed warm ambient 2700K LED coves',
        label: 'AESTHETIC DIRECTIVE',
        x: 60,
        y: 330,
        width: 320,
        height: 180,
        rotation: 1,
        zIndex: 4,
        opacity: 0.92,
        backgroundColor: '#fef3c7'
      },
      {
        id: 'el-jap-4',
        type: 'material_swatch',
        content: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80',
        label: 'Navona Travertine (Honed)',
        x: 420,
        y: 320,
        width: 220,
        height: 190,
        rotation: -4,
        zIndex: 3,
        opacity: 1
      }
    ]
  },
  {
    id: 'warm-modern-brutalism',
    name: 'Warm Architectural Brutalism (ISO A3 Grid)',
    category: 'Commercial',
    style: 'Modern Brutalism',
    description: 'Sculptural cast-in-place board-marked concrete paired with rich oiled walnut, brushed fluted brass, and sculptural velvet upholstery.',
    layoutType: 'grid',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    tags: ['Board-Formed Concrete', 'Oiled Walnut', 'Brushed Brass', 'Sculptural'],
    colorPalette: ['#1C1917', '#44403C', '#78716C', '#D6D3D1', '#CA8A04'],
    narrative: 'Monumental architectural expression balancing raw tactile monolithic concrete masses against warm, refined acoustic timber paneling and brushed brass accents.',
    heroSlot: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80',
    technicalGrid: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=600&auto=format&fit=crop&q=80'
    ],
    materialPalette: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546484475-7f7bd55792da?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'mediterranean-coastal-luxe',
    name: 'Mediterranean Modern Sanctuary',
    category: 'Residential',
    style: 'Mediterranean Luxe',
    description: 'Sun-drenched limewash plaster walls, microcement continuous flooring, curved arched transitions, terracotta tile, and olive branch greenery.',
    layoutType: 'artistic',
    thumbnailUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop&q=80',
    tags: ['Limewash', 'Microcement', 'Terracotta', 'Coastal Luxe'],
    colorPalette: ['#F5F5F0', '#E2D9C8', '#C27D56', '#6B705C', '#3A5A40'],
    narrative: 'Sunlight-infused organic sanctuary utilizing breathable mineral paints, hand-thrown terracotta ceramics, sculptural microcement island counters, and custom bouclé sofas.',
    heroSlot: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&auto=format&fit=crop&q=80',
    technicalGrid: [
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&auto=format&fit=crop&q=80'
    ],
    materialPalette: [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546484475-7f7bd55792da?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80'
    ],
    elements: [
      {
        id: 'el-med-1',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&auto=format&fit=crop&q=80',
        x: 50,
        y: 40,
        width: 360,
        height: 250,
        rotation: 2,
        zIndex: 1,
        opacity: 1
      },
      {
        id: 'el-med-2',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&auto=format&fit=crop&q=80',
        x: 380,
        y: 70,
        width: 300,
        height: 220,
        rotation: -3,
        zIndex: 2,
        opacity: 0.95
      },
      {
        id: 'el-med-3',
        type: 'vellum_note',
        content: 'MATERIAL PALETTE:\n• Roman limewash plaster in Chalk Warm\n• Calacatta Viola honed marble slab\n• Hand-cut terracotta tiles (herringbone layout)\n• Natural raw linen sheer drapery',
        label: 'FINISH DIRECTIVES',
        x: 70,
        y: 320,
        width: 320,
        height: 180,
        rotation: -1,
        zIndex: 4,
        opacity: 0.92,
        backgroundColor: '#fffbeb'
      }
    ]
  }
];
