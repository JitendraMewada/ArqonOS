import React, { useState } from 'react';
import {
  Layers,
  Ruler,
  Maximize2,
  FileText,
  Palette,
  CheckCircle2,
  Lock,
  Unlock,
  GitCompare,
  Box,
  Image,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Search,
  ArrowRight,
  Database
} from 'lucide-react';
import { cn } from '../../../../lib/utils';

export function StudioHelp() {
  const [activeTab, setActiveTab] = useState<'dimensions' | 'spaces' | 'approvals' | 'assets' | 'faq'>('dimensions');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const dimensionFormulas = [
    { label: 'Room Area', formula: 'Length × Width', desc: 'Net floor area computed automatically from physical room boundaries.' },
    { label: 'Ceiling Area', formula: 'Length × Width', desc: 'Total raw ceiling surface area before drop false ceiling subtractions.' },
    { label: 'Door Area', formula: 'Door Count × Door Width × Door Height', desc: 'Aggregated door cutout area deducted from perimeter wall plaster.' },
    { label: 'Window Area', formula: 'Window Count × Window Width × Window Height', desc: 'Fenestration openings deducted from wall surface calculations.' },
    { label: 'Net Wall Area', formula: '2 × (Length + Width) × Height − (Door Area + Window Area)', desc: 'Precise paintable / cladding wall area for accurate material quantity take-offs.' }
  ];

  const comparisonParameters = [
    { param: 'Room Dimensions', impact: 'Evaluates structural extensions, wall shifting, or partition additions.' },
    { param: 'Net Floor Area', impact: 'Determines carpet area changes, flooring tile counts, and skirting perimeter.' },
    { param: 'False Ceiling Drop', impact: 'Calculates cove lighting recesses, gypsum board sheets, and MEP drop depths.' },
    { param: 'Wall Finish Area', impact: 'Drives paint volume, wallpaper rolls, laminate sheets, and acoustic panelling.' },
    { param: 'Structural Openings', impact: 'Audits door & window frame modifications, lintel alterations, and sill heights.' }
  ];

  const faqs = [
    {
      q: 'Why is Studio Approval required to unlock the Cost module?',
      a: 'This is a core ArqonOS business rule: Cost budgeting and procurement cannot begin until the client and lead designer have formally approved the proposed space planning, materials, and dimensional specifications. This prevents costly scope revisions and inaccurate BOQs.'
    },
    {
      q: 'How does the Existing vs Proposed Comparison Engine work?',
      a: 'The engine compares the baseline physical room survey (Dimension Matrix) against the newly architected design (Spaces Module). It calculates the mathematical difference (area deltas, wall modifications, ceiling drops) and flags the cost impact.'
    },
    {
      q: 'What is stored in the Assets Module Drawing Ledger?',
      a: 'The Drawing Ledger maintains version-controlled CAD plans, elevations, section drawings, MEP layouts, and 3D visual renderings. Each revision is tagged with author, approval status, and timestamp.'
    },
    {
      q: 'How do Client Sandboxed permissions work in Studio?',
      a: 'Clients are restricted strictly to viewing interactive Presentation decks and submitting formal sign-offs or revision requests in the Approvals module. They cannot modify raw dimensions or technical drawings.'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto text-left">
      <div className="p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest mb-4 border border-orange-100 dark:border-orange-900/60">
              <Layers className="w-3.5 h-3.5" />
              Interior Design Execution System Guide
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Studio: The <span className="text-orange-500">Creation & Spatial Engine</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm lg:text-base mt-3 max-w-3xl leading-relaxed font-medium">
              Studio is the engineering and creative core of ArqonOS for interior designers. It translates physical site surveys into proposed space designs, automated dimension take-offs, client presentations, and gated approval workflows.
            </p>

            {/* Quick Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              {[
                { id: 'dimensions', label: '1. Dimension Matrix (Existing)', icon: Ruler },
                { id: 'spaces', label: '2. Spaces & Comparison', icon: GitCompare },
                { id: 'approvals', label: '3. Approvals ➔ Cost Bridge', icon: Unlock },
                { id: 'assets', label: '4. Assets & Drawing Ledger', icon: Box },
                { id: 'faq', label: 'Studio FAQs', icon: HelpCircle }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2',
                      activeTab === tab.id
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          <Palette className="absolute -right-16 -top-16 w-80 h-80 text-orange-500/5 pointer-events-none" />
        </div>

        {/* Tab 1: Dimension Matrix */}
        {activeTab === 'dimensions' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Ruler className="w-5 h-5 text-orange-500" />
                Existing Site Survey & Auto-Calculation Matrix
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Raw site measurements taken during physical site survey with automatic surface area formulas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dimensionFormulas.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{item.label}</h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400">
                      Auto-Calc
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 font-mono text-xs font-bold text-orange-600 dark:text-orange-400 border border-slate-100 dark:border-slate-700">
                    {item.formula}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 flex items-start gap-4">
              <Database className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Survey Attachments & Proofs</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  The Dimension Matrix stores on-site 360° photos, tape measurement snapshots, architectural PDFs, and structural notes (beams, sill/lintel heights) directly linked to each room record.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Spaces & Comparison */}
        {activeTab === 'spaces' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-blue-500" />
                Proposed Spaces & Existing vs Proposed Comparison Engine
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                How proposed design alterations (walls added/removed, false ceiling drops, finishes) are audited against existing measurements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {comparisonParameters.map((param, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{param.param}</h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {param.impact}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-xl bg-slate-900 text-white space-y-3">
              <h4 className="text-sm font-black uppercase text-orange-400 tracking-wider">Comparison Status Classifications</h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                {[
                  { status: 'Unchanged', color: 'text-slate-400 bg-slate-800' },
                  { status: 'Increased', color: 'text-emerald-400 bg-emerald-950/60' },
                  { status: 'Reduced', color: 'text-amber-400 bg-amber-950/60' },
                  { status: 'Added', color: 'text-blue-400 bg-blue-950/60' },
                  { status: 'Removed', color: 'text-rose-400 bg-rose-950/60' }
                ].map((s, i) => (
                  <div key={i} className={cn('p-2.5 rounded-lg text-center font-bold text-xs border border-slate-700', s.color)}>
                    {s.status}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Approvals -> Cost Bridge */}
        {activeTab === 'approvals' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Unlock className="w-5 h-5 text-emerald-500" />
                The Studio-to-Cost Gated Bridge
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                The critical governance rule linking client sign-off with financial budgeting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950 flex items-center justify-center">
                  <Palette className="w-4 h-4 text-orange-500" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">1. Design Sign-Off</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Client and Lead Designer approve presentations, moodboards, space layouts, and material palettes.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
                  <Unlock className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">2. Cost Engine Unlocked</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Approval triggers an automated event unlocking the Cost engine, creating initial BOQ line items mapped to room areas.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950 flex items-center justify-center">
                  <Box className="w-4 h-4 text-cyan-500" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">3. Procurement Triggered</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Vendor Purchase Orders (POs) are generated against approved material specifications with zero ambiguity.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Assets & Drawing Ledger */}
        {activeTab === 'assets' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Box className="w-5 h-5 text-purple-500" />
                Design Asset Management & Version Control
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Organization of technical drawings, CAD files, 3D renderings, and FF&E specifications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Drawing Ledger', sub: 'Version-Controlled CAD, Floor Plans, Section Drawings, and MEP schemas.' },
                { title: '3D Visualizations', sub: 'Photorealistic photometrics, VR panoramas, and room render walkthroughs.' },
                { title: 'FF&E Catalogue', sub: 'Furniture, Fixtures & Equipment specifications tagged with vendor codes.' },
                { title: 'Material Library', sub: 'Tiles, wood veneers, fabrics, hardware finishes, and paint swatches.' },
                { title: 'Moodboards Engine', sub: 'Style concepts, tactile inspiration boards, and lighting temperature schemes.' },
                { title: 'Client Presentations', sub: 'Interactive slide decks with instant PDF export and sandboxed client review links.' }
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: FAQs */}
        {activeTab === 'faq' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                Studio Execution FAQs
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Frequently asked questions on dimensions, comparisons, and approval rules.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{faq.q}</span>
                    {expandedFaq === idx ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {expandedFaq === idx && (
                    <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Card */}
        <div className="p-6 rounded-xl bg-slate-900 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-orange-500/20 text-orange-400">
              Studio Architecture Principle
            </span>
            <h3 className="text-lg font-black">Mathematical Design Precision</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Every aesthetic choice is tied directly to physical measurements, material quantities, and financial budgets.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center shrink-0 w-full md:w-auto">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Primary Color</span>
            <span className="text-sm font-black text-orange-400 block mt-0.5">Studio Orange #f97316</span>
            <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">Cost Approval Bridge Active</span>
          </div>
        </div>

      </div>
    </div>
  );
}
