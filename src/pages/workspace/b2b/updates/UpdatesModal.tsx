import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Zap, ChevronRight, Brain, Sparkles, CheckCircle2, 
  Clock, Rocket, Layers, ArrowUpRight, Compass, ShieldCheck,
  Check, Calendar, Activity, Cpu, Filter, Milestone, RefreshCw,
  Search, SlidersHorizontal, CheckCheck
} from 'lucide-react';
import { cn } from '../../../../lib/utils';

export type RoadmapCategory = 'all' | 'ecosystem' | 'engines' | 'b2b' | 'b2c_d2c' | 'infrastructure';
export type RoadmapStatus = 'All' | 'Released' | 'In Progress' | 'Q4 2026' | 'Q1 2027' | 'Q2 2027';

export interface EngineRoadmapItem {
  id: string;
  engineId: string;
  engineName: string;
  category: 'b2b' | 'ecosystem' | 'infrastructure' | 'b2c_d2c';
  brandColor: string;
  title: string;
  version: string;
  quarter: string;
  status: 'Released' | 'In Progress' | 'Planned' | 'Upcoming';
  progress: number;
  highlight: string;
  description: string;
  capabilities: string[];
  crossEngineDependencies: string[];
}

export const WORKSPACE_ROADMAP: EngineRoadmapItem[] = [
  // ArqonOS Ecosystem
  {
    id: 'eco-1',
    engineId: 'arqonos',
    engineName: 'ArqonOS Core',
    category: 'ecosystem',
    brandColor: '#3b82f6',
    title: 'Cross-Engine Unified Global Command & Omnisearch',
    version: 'v2.4.0',
    quarter: 'Q4 2026',
    status: 'In Progress',
    progress: 75,
    highlight: 'Global ⌘K omnibar querying across projects, files, invoices, CRM leads, and contacts',
    description: 'Instant contextual search indexing all 10 B2B modules in sub-10ms with fuzzy keyword vectorization.',
    capabilities: [
      'Universal ⌘K Omnibar shortcut',
      'Entity previews for leads, spaces, tasks & purchase orders',
      'One-click deep navigation with state retention'
    ],
    crossEngineDependencies: ['Quest', 'Connect', 'Studio', 'Cost', 'Vendor', 'People']
  },
  {
    id: 'eco-2',
    engineId: 'arqonos',
    engineName: 'ArqonOS Core',
    category: 'ecosystem',
    brandColor: '#3b82f6',
    title: 'Live Cross-Engine Event Streaming Bus (Reactor)',
    version: 'v2.5.0',
    quarter: 'Q1 2027',
    status: 'Planned',
    progress: 30,
    highlight: 'Instant pub/sub reactive pipeline keeping Studio, Cost, and Flow in lockstep',
    description: 'Zero-latency WebSocket events ensuring design dimension changes instantly trigger cost recalculations and vendor alerts.',
    capabilities: [
      'Bidirectional synchronization pipeline',
      'Offline queue with conflict resolution',
      'Multi-tenant isolated telemetry streams'
    ],
    crossEngineDependencies: ['Studio', 'Cost', 'Vendor', 'Flow']
  },

  // Quest
  {
    id: 'qst-1',
    engineId: 'quest',
    engineName: 'Quest Engine',
    category: 'b2b',
    brandColor: '#3b82f6',
    title: 'Voice-to-Task & Intelligent Meeting Transcriptions',
    version: 'v1.8.0',
    quarter: 'Q4 2026',
    status: 'In Progress',
    progress: 80,
    highlight: 'Convert audio memos and site calls into structured task checklists with assignees',
    description: 'On-device and cloud transcription extracting action items, deadlines, and urgency directly into the Quest Task board.',
    capabilities: [
      'Audio recording with automatic noise cancellation',
      'Entity extraction (dates, priorities, designers)',
      'Direct sync with Quest Messenger threads'
    ],
    crossEngineDependencies: ['People', 'Flow']
  },
  {
    id: 'qst-2',
    engineId: 'quest',
    engineName: 'Quest Engine',
    category: 'b2b',
    brandColor: '#3b82f6',
    title: 'Shared Client Real-Time Portal Threads',
    version: 'v2.0.0',
    quarter: 'Q1 2027',
    status: 'Planned',
    progress: 20,
    highlight: 'Secure sandboxed communication channels for client approvals without internal chatter',
    description: 'Isolated messaging threads linking client queries to specific site dimensions or design presentation boards.',
    capabilities: [
      'Role-governed visibility filters',
      'Media attachments with visual annotation pins',
      'SMS & WhatsApp notifications bridging'
    ],
    crossEngineDependencies: ['Studio', 'Connect']
  },

  // Flow
  {
    id: 'flw-1',
    engineId: 'flow',
    engineName: 'Flow Engine',
    category: 'b2b',
    brandColor: '#3b82f6',
    title: 'Visual Multi-Branch Workflow Automation Builder',
    version: 'v1.6.0',
    quarter: 'Q4 2026',
    status: 'In Progress',
    progress: 65,
    highlight: 'Drag-and-drop node graph configuring automated stage gates from CRM to Delivery',
    description: 'Automate project milestone progressions: when Studio approves a drawing, automatically create PO in Vendor and trigger Cost allocation.',
    capabilities: [
      'Node-based canvas with visual branch conditions',
      'Trigger & Webhook connectors for third-party tools',
      'Pre-built interior execution pipeline templates'
    ],
    crossEngineDependencies: ['Connect', 'Studio', 'Cost', 'Vendor']
  },
  {
    id: 'flw-2',
    engineId: 'flow',
    engineName: 'Flow Engine',
    category: 'b2b',
    brandColor: '#3b82f6',
    title: 'SLA Breach Prediction & Dynamic Re-Routing',
    version: 'v2.0.0',
    quarter: 'Q2 2027',
    status: 'Planned',
    progress: 15,
    highlight: 'AI-driven bottleneck identification alerting managers 5 days before project delay',
    description: 'Analyzes historical stage durations and vendor lead times to flag delayed procurement tasks early.',
    capabilities: [
      'Critical path velocity scoring',
      'Automated reassignment & priority escalation',
      'Gantt milestone timeline recalculation'
    ],
    crossEngineDependencies: ['AI', 'Insight', 'Vendor']
  },

  // Connect
  {
    id: 'cnt-1',
    engineId: 'connect',
    engineName: 'Connect Engine',
    category: 'b2b',
    brandColor: '#3b82f6',
    title: 'Interactive Client Proposal & Estimate Generator',
    version: 'v1.7.0',
    quarter: 'Q4 2026',
    status: 'In Progress',
    progress: 85,
    highlight: 'Generate branded high-converting interactive PDF & Web proposals in 60 seconds',
    description: 'Pulls budget calculations directly from Cost and portfolio samples from Studio into interactive signable proposals.',
    capabilities: [
      'One-click digital signature (e-Sign compliant)',
      'Custom theme templates with firm branding',
      'Real-time proposal viewing analytics'
    ],
    crossEngineDependencies: ['Cost', 'Studio']
  },

  // Studio
  {
    id: 'std-1',
    engineId: 'studio',
    engineName: 'Studio Engine',
    category: 'b2b',
    brandColor: '#f97316',
    title: '3D WebGL Spatial Viewer & Real-Time Material Shader',
    version: 'v2.2.0',
    quarter: 'Q4 2026',
    status: 'In Progress',
    progress: 90,
    highlight: 'In-browser realistic room rendering with instant PBR texture swapping and daylight simulation',
    description: 'Inspect floor plans in interactive 3D, apply vendor laminates/tiles, and test lighting conditions in real-time.',
    capabilities: [
      'Hardware-accelerated Three.js/WebGL render engine',
      'Sync with Dimension Matrix wall and ceiling coordinates',
      'High-resolution client snapshot exporter'
    ],
    crossEngineDependencies: ['Vendor', 'Assets']
  },
  {
    id: 'std-2',
    engineId: 'studio',
    engineName: 'Studio Engine',
    category: 'b2b',
    brandColor: '#f97316',
    title: 'AR Site Survey Mobile Companion',
    version: 'v2.5.0',
    quarter: 'Q1 2027',
    status: 'Planned',
    progress: 40,
    highlight: 'Scan physical rooms using LiDAR/camera to auto-populate the Dimension Matrix',
    description: 'Eliminates tape measurement human error by generating precise bounding boxes for walls, doors, windows, and ceiling drops directly into Studio.',
    capabilities: [
      'LiDAR mesh extraction to millimeters',
      'Automatic room polygon geometry generation',
      'Instant upload to Project Dimensions repository'
    ],
    crossEngineDependencies: ['Cost', 'Flow']
  },

  // Cost & Vendor
  {
    id: 'cst-1',
    engineId: 'cost',
    engineName: 'Cost + Vendor Engine',
    category: 'b2b',
    brandColor: '#07B9CE',
    title: 'Automated BOQ Sync & Multi-Vendor RFQ Bidding Portal',
    version: 'v1.9.0',
    quarter: 'Q4 2026',
    status: 'In Progress',
    progress: 70,
    highlight: 'Broadcast Bill of Quantities to registered vendors for instant competitive bids',
    description: 'Compare itemized line items across carpenters, electricians, and fabricators with auto-negotiated price benchmarking.',
    capabilities: [
      'Automated RFQ dispatch via link & WhatsApp',
      'Comparative pricing matrix with margin analyzer',
      'One-click PO generation with milestone payment schedules'
    ],
    crossEngineDependencies: ['Studio', 'Cost', 'Vendor']
  },

  // Insight
  {
    id: 'ins-1',
    engineId: 'insight',
    engineName: 'Insight Engine',
    category: 'b2b',
    brandColor: '#94a3b8',
    title: 'Profit Margin Leakage Detection & Cash Flow Simulator',
    version: 'v2.1.0',
    quarter: 'Q1 2027',
    status: 'Planned',
    progress: 45,
    highlight: 'Predict firm cash burn and project profitability across 30/60/90 day horizons',
    description: 'Correlates material inflation with site labor throughput to pinpoint margin decay before project handover.',
    capabilities: [
      'Monte Carlo cash flow risk simulations',
      'Vendor cost variance benchmarking',
      'Custom KPI export to CSV, PDF & Executive Dashboard'
    ],
    crossEngineDependencies: ['Cost', 'Vendor', 'Flow']
  },

  // AI Automation
  {
    id: 'ai-1',
    engineId: 'ai',
    engineName: 'AI Intelligence Layer',
    category: 'b2b',
    brandColor: '#A0D6B4',
    title: 'Autonomous Design Space Optimization & Material Suggester',
    version: 'v2.0.0',
    quarter: 'Q4 2026',
    status: 'In Progress',
    progress: 85,
    highlight: 'Suggest space layouts adhering to ergonomics, Vastu, and strict budget ceilings',
    description: 'Gemini-powered spatial synthesis analyzing proposed dimensions to recommend optimal partition placements and compliant finishes.',
    capabilities: [
      'Ergonomic clearance calculations',
      'Color & material harmony matching',
      'Automated alternative cost-saving substitutions'
    ],
    crossEngineDependencies: ['Studio', 'Cost', 'Vendor']
  },

  // B2C Nest & D2C
  {
    id: 'nst-1',
    engineId: 'nest',
    engineName: 'Arqon Nest (B2C)',
    category: 'b2c_d2c',
    brandColor: '#22c55e',
    title: 'Smart Receipt Scanner & Group Expense Split Engine',
    version: 'v1.4.0',
    quarter: 'Q4 2026',
    status: 'Released',
    progress: 100,
    highlight: 'OCR camera scan splitting house rent, utilities, and grocery bills among roommates',
    description: 'Instant settlement calculation with UPI deep links and monthly expense forecasts for families.',
    capabilities: [
      'Multi-currency itemized receipt parsing',
      'Settlement debt minimization algorithm',
      'Monthly recurring allowance tracking'
    ],
    crossEngineDependencies: []
  },
  {
    id: 'prv-1',
    engineId: 'pravara',
    engineName: 'PRAVARA & Essence (D2C)',
    category: 'b2c_d2c',
    brandColor: '#d4af37',
    title: 'Virtual Fitting Room & Luxury Material Customizer',
    version: 'v2.0.0',
    quarter: 'Q1 2027',
    status: 'Planned',
    progress: 35,
    highlight: 'Photorealistic fabric drape simulation on custom client avatars',
    description: 'Interactive luxury apparel and interior showcase engine delivering bespoke couture customization.',
    capabilities: [
      'High-fidelity cloth physics simulation',
      'Bespoke measurement profile vault',
      'Concierge stylist video integration'
    ],
    crossEngineDependencies: ['Studio']
  }
];

export function UpdatesModal({ 
  isOpen, 
  activeApp, 
  onClose,
  onNavigateToEngine 
}: { 
  isOpen: boolean; 
  activeApp: string; 
  onClose: () => void;
  onNavigateToEngine?: (engineId: string) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<RoadmapCategory>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'roadmap' | 'milestones' | 'releases'>('roadmap');

  if (!isOpen) return null;

  const filteredItems = WORKSPACE_ROADMAP.filter(item => {
    // Filter by active category
    if (selectedCategory === 'engines' && item.engineId !== activeApp.toLowerCase()) return false;
    if (selectedCategory === 'b2b' && item.category !== 'b2b') return false;
    if (selectedCategory === 'ecosystem' && item.category !== 'ecosystem') return false;
    if (selectedCategory === 'b2c_d2c' && item.category !== 'b2c_d2c') return false;
    if (selectedCategory === 'infrastructure' && item.category !== 'infrastructure') return false;

    // Filter by status/quarter
    if (selectedStatus !== 'All') {
      if (selectedStatus === 'Released' && item.status !== 'Released') return false;
      if (selectedStatus === 'In Progress' && item.status !== 'In Progress') return false;
      if (selectedStatus === 'Q4 2026' && item.quarter !== 'Q4 2026') return false;
      if (selectedStatus === 'Q1 2027' && item.quarter !== 'Q1 2027') return false;
      if (selectedStatus === 'Q2 2027' && item.quarter !== 'Q2 2027') return false;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.engineName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.highlight.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Released':
        return {
          bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-500'
        };
      case 'In Progress':
        return {
          bg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
          dot: 'bg-blue-500 animate-pulse'
        };
      case 'Planned':
        return {
          bg: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
          dot: 'bg-purple-500'
        };
      default:
        return {
          bg: 'bg-slate-500/10 dark:bg-slate-500/20 text-slate-600 dark:text-slate-400 border-slate-500/30',
          dot: 'bg-slate-400'
        };
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[1000000] flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl border border-slate-200/80 dark:border-slate-800 flex flex-col h-[90vh] max-h-[850px] overflow-hidden animate-in zoom-in-95 duration-200 text-left">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 bg-slate-50/70 dark:bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  ArqonOS Future Updates & Engine Roadmap
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest hidden sm:inline-block">
                  2026 - 2027 Vision
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Strategic capabilities, engine enhancements, and cross-module synchronization pipelines.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* View Switcher Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs font-bold">
              <button
                onClick={() => setActiveTab('roadmap')}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all",
                  activeTab === 'roadmap' 
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-black" 
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                Roadmap Matrix
              </button>
              <button
                onClick={() => setActiveTab('milestones')}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all",
                  activeTab === 'milestones' 
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-black" 
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                Ecosystem Engines
              </button>
              <button
                onClick={() => setActiveTab('releases')}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all",
                  activeTab === 'releases' 
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-black" 
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                Changelog Log
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="p-4 sm:px-6 bg-slate-50/40 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                "px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap",
                selectedCategory === 'all'
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                  : "bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100"
              )}
            >
              All Roadmap Items ({WORKSPACE_ROADMAP.length})
            </button>

            <button
              onClick={() => setSelectedCategory('engines')}
              className={cn(
                "px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1.5",
                selectedCategory === 'engines'
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100"
              )}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Current Engine ({activeApp})
            </button>

            <button
              onClick={() => setSelectedCategory('b2b')}
              className={cn(
                "px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap",
                selectedCategory === 'b2b'
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100"
              )}
            >
              B2B Suite Modules
            </button>

            <button
              onClick={() => setSelectedCategory('ecosystem')}
              className={cn(
                "px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap",
                selectedCategory === 'ecosystem'
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100"
              )}
            >
              ArqonOS Architecture
            </button>

            <button
              onClick={() => setSelectedCategory('b2c_d2c')}
              className={cn(
                "px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap",
                selectedCategory === 'b2c_d2c'
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100"
              )}
            >
              Nest & D2C Brands
            </button>
          </div>

          {/* Search and Time Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search updates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white placeholder:text-slate-400"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Quarters</option>
              <option value="In Progress">In Progress</option>
              <option value="Released">Released</option>
              <option value="Q4 2026">Q4 2026</option>
              <option value="Q1 2027">Q1 2027</option>
              <option value="Q2 2027">Q2 2027</option>
            </select>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-slate-50/20 dark:bg-slate-900/40">
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              {filteredItems.length === 0 ? (
                <div className="py-16 text-center">
                  <Clock className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No roadmap items matched your filters</h4>
                  <p className="text-xs text-slate-400 mt-1">Try resetting the category filter or search keywords.</p>
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const badge = getStatusBadge(item.status);
                  return (
                    <div 
                      key={item.id}
                      className="p-5 bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 rounded-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all shadow-sm group text-left"
                    >
                      {/* Top Header of Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span 
                            className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider text-white shadow-xs"
                            style={{ backgroundColor: item.brandColor }}
                          >
                            {item.engineName}
                          </span>
                          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                            {item.version}
                          </span>
                          <div className="h-3 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" /> {item.quarter}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5",
                            badge.bg
                          )}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", badge.dot)} />
                            {item.status} ({item.progress}%)
                          </span>
                        </div>
                      </div>

                      {/* Title & Highlight */}
                      <h4 className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        {item.highlight}
                      </p>

                      {/* Description */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed mt-2">
                        {item.description}
                      </p>

                      {/* Capability checklist */}
                      <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {item.capabilities.map((cap, cIdx) => (
                          <div 
                            key={cIdx}
                            className="flex items-start gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-medium"
                          >
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{cap}</span>
                          </div>
                        ))}
                      </div>

                      {/* Dependencies & Footer Info */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Interconnected Engines:
                          </span>
                          {item.crossEngineDependencies.length > 0 ? (
                            item.crossEngineDependencies.map((dep, dIdx) => (
                              <span 
                                key={dIdx}
                                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 font-semibold text-[10px]"
                              >
                                {dep}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Self-contained</span>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div className="flex items-center gap-3 min-w-[140px]">
                          <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400">
                            {item.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {/* Studio Engine Box */}
              <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#f97316]"></div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">Studio Creation Engine</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-50 dark:bg-orange-950/40 text-[#f97316] rounded border border-orange-200 dark:border-orange-900">
                    2 Major In Flight
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Targeted at complete spatial accuracy: WebGL shader texture viewer and LiDAR AR measurement pipelines.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">3D WebGL Spatial Shader</span>
                    <span className="text-[10px] font-bold text-blue-500">90% (Q4 2026)</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">AR LiDAR Mobile Survey</span>
                    <span className="text-[10px] font-bold text-purple-500">40% (Q1 2027)</span>
                  </div>
                </div>
              </div>

              {/* Cost & Vendor Box */}
              <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#07B9CE]"></div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">Cost + Vendor Engine</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-cyan-50 dark:bg-cyan-950/40 text-[#07B9CE] rounded border border-cyan-200 dark:border-cyan-900">
                    Active Pipeline
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Direct connection between Studio approved designs and competitive multi-vendor bidding portals.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Automated BOQ Sync & RFQ</span>
                    <span className="text-[10px] font-bold text-blue-500">70% (Q4 2026)</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Milestone Escrow Billing</span>
                    <span className="text-[10px] font-bold text-purple-500">Planned (Q2 2027)</span>
                  </div>
                </div>
              </div>

              {/* Flow Engine Box */}
              <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">Flow Workflow Engine</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-[#3b82f6] rounded border border-blue-200 dark:border-blue-900">
                    Execution Hub
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Node-based multi-step process orchestration with automated SLA risk detection.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Visual Automation Graph</span>
                    <span className="text-[10px] font-bold text-blue-500">65% (Q4 2026)</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">SLA Breach Predictor</span>
                    <span className="text-[10px] font-bold text-purple-500">15% (Q2 2027)</span>
                  </div>
                </div>
              </div>

              {/* AI Layer Box */}
              <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#A0D6B4]"></div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">AI Autonomous Layer</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-900">
                    Intelligent Core
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Deep generative space planning, compliance validation, and automated material substitution.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Design Space Optimizer</span>
                    <span className="text-[10px] font-bold text-blue-500">85% (Q4 2026)</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Autonomous Tender Analysis</span>
                    <span className="text-[10px] font-bold text-purple-500">Planned (Q1 2027)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'releases' && (
            <div className="space-y-4 text-left">
              {/* Release Card 1 */}
              <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-black text-[10px]">
                      v2.3.0 PRODUCTION
                    </span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      B2B Suite Interconnection & Studio Approval Engine
                    </h4>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">August 2026</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Unified all 10 B2B modules under the ArqonOS Workspace shell, introduced mathematical Dimension Matrix existing-to-proposed calculations, and deployed strict role-based sandbox barriers.
                </p>
              </div>

              {/* Release Card 2 */}
              <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-500 text-white font-black text-[10px]">
                      v2.2.0 STABLE
                    </span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      Cross-Engine Live Ingestion Pipeline & Insight Stream
                    </h4>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">July 2026</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Integrated real-time live telemetry cards in Insight and AI modules with automatic navigation routing into respective task, budget, and design pages.
                </p>
              </div>
            </div>
          )}

          {/* Guarantee Note */}
          <div className="p-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl mt-6">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-black text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-1">
                  Intelligent Ecosystem Architecture Guarantee
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
                  All roadmap upgrades are deployed continuously without project downtime or manual migrations. Core schemas in Studio, Cost, and Flow maintain complete backward compatibility.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Next Scheduled Major Release: <strong className="text-slate-900 dark:text-white">Q4 2026 (v2.4.0)</strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm"
            >
              Back to Workspace
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('modal-portal-root') || document.body
  );
}
