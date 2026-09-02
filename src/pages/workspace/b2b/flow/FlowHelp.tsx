import React, { useState } from 'react';
import {
  Workflow,
  Zap,
  Settings,
  Users,
  CheckCircle2,
  GitBranch,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search,
  Sliders,
  PlayCircle,
  Clock,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '../../../../lib/utils';

export function FlowHelp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'architecture' | 'automations' | 'matrix' | 'faq'>('architecture');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const workflowStages = [
    { name: '1. Lead & Intake', desc: 'Capture from Connect CRM with initial requirements & project scope.', engine: 'Connect ➔ Flow' },
    { name: '2. Site Survey & Measurements', desc: 'Team captures raw site dimensions and survey photos.', engine: 'Studio (Dimension Matrix)' },
    { name: '3. Space Planning & Design', desc: 'Designers build proposed spaces, materials, and sketches.', engine: 'Studio (Spaces & Assets)' },
    { name: '4. Client Presentation & Approval', desc: 'Client signs off on design boards and space layouts.', engine: 'Studio (Approvals)' },
    { name: '5. BOQ, Costing & Procurement', desc: 'Unlock Cost module to prepare budgets and issue Vendor POs.', engine: 'Cost + Vendor' },
    { name: '6. Site Execution & Fit-out', desc: 'Site supervisors and contractors execute tasks on the ground.', engine: 'Quest + Vendor' },
    { name: '7. Final Handover & Audit', desc: 'Snag list resolution, final client sign-off, and financial closeout.', engine: 'Insight + Cost' }
  ];

  const automationExamples = [
    {
      trigger: 'Stage advances to "Site Survey"',
      action: 'Auto-generates dimension checklist tasks in Quest for Draftsman and Site Supervisor.',
      impact: 'Eliminates manual task creation; ensures site surveys are conducted systematically.'
    },
    {
      trigger: 'Client approves Studio Design',
      action: 'Automatically unlocks the Cost engine, notifies Estimator, and initiates BOQ preparation.',
      impact: 'Enforces the core business rule: No budgeting begins before design sign-off.'
    },
    {
      trigger: 'Vendor PO marked "Delivered"',
      action: 'Triggers on-site material verification task in Quest for the Site Manager.',
      impact: 'Guarantees physical material verification before releasing vendor milestone payments.'
    },
    {
      trigger: 'Milestone delay exceeds 3 days',
      action: 'Flags critical path alert in Insight engine and logs potential schedule variance (SPI).',
      impact: 'Proactively alerts project leads before schedule slippages compound.'
    }
  ];

  const faqs = [
    {
      q: 'How does Flow differ from Quest?',
      a: 'Flow defines the macro "Where" of the project (lifecycle stages, process logic, cross-department gates), while Quest defines the micro "What" (individual atomic to-dos, deadlines, and real-time messenger threads). Flow automations generate Quest tasks at each stage.'
    },
    {
      q: 'Can custom workflow stages be defined for different project types?',
      a: 'Yes. In the Workflow Builder page, Project Managers can customize stage names, required milestones, checklist gates, and stage-specific lead times tailored to residential, commercial, or retail projects.'
    },
    {
      q: 'How does Flow integrate with the People module?',
      a: 'Flow maps departmental responsibilities to specific stages. For example, Design stages are assigned to Lead Designers & 3D Visualizers, whereas Execution stages are assigned to Site Supervisors and Coordinators.'
    },
    {
      q: 'What triggers automated stage progressions?',
      a: 'Stages can advance manually by authorized Project Leads or automatically when all mandatory gate conditions (e.g., Studio approval, Quest milestone tasks completed, or Vendor PO delivered) are satisfied.'
    }
  ];

  const filteredStages = workflowStages.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.engine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto text-left">
      <div className="p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-[10px] font-black uppercase tracking-widest mb-4 border border-sky-100 dark:border-sky-800">
              <Settings className="w-3.5 h-3.5" />
              Process & Workflow Architecture Guide
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Flow: The <span className="text-sky-500">Intelligent Project Roadmap</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm lg:text-base mt-3 max-w-3xl leading-relaxed font-medium">
              Flow is the systemic backbone of ArqonOS. It governs end-to-end project lifecycles, choreographs cross-module transitions, and automates task delegations from initial lead intake to final handover.
            </p>

            {/* Quick Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              {[
                { id: 'architecture', label: 'Lifecycle Stages', icon: GitBranch },
                { id: 'automations', label: 'Automation Rules', icon: Zap },
                { id: 'matrix', label: 'Ecosystem Matrix', icon: Layers },
                { id: 'faq', label: 'Flow FAQs', icon: HelpCircle }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2',
                      activeTab === tab.id
                        ? 'bg-sky-500 text-white shadow-sm'
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
          <Workflow className="absolute -right-16 -top-16 w-80 h-80 text-sky-500/5 pointer-events-none" />
        </div>

        {/* Tab 1: Architecture & Stages */}
        {activeTab === 'architecture' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-sky-500" />
                  Standard Project Lifecycle Pipeline
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Step-by-step gate progression across all connected Arqon engines.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter stages or modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStages.map((stage, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between hover:border-sky-300 dark:hover:border-sky-700 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900">
                        {stage.engine}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-sky-500 transition-colors" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-1">{stage.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-medium">
                      {stage.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1">
                    Next Gate <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Automations */}
        {activeTab === 'automations' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-500" />
                Cross-Engine Automation Engine
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                How stage advancements trigger actions in Quest, Connect, Cost, and Vendor automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {automationExamples.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
                      Trigger Event
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.trigger}</h4>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs">
                    <strong className="text-slate-800 dark:text-slate-200 block mb-1">System Action:</strong>
                    <span className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.action}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span><strong>Impact:</strong> {item.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Ecosystem Connection Matrix */}
        {activeTab === 'matrix' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-500" />
                Flow Ecosystem Interconnection Matrix
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Data exchange loop linking Flow with all 8 other Arqon B2B modules.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Connect (CRM)', role: 'Receives signed contracts to automatically instantiate new project workflows.' },
                { name: 'Quest (Tasks)', role: 'Receives automated task sets, checklists, and assignees at each stage shift.' },
                { name: 'Studio (Design)', role: 'Enforces design gate approvals before unlocking subsequent procurement.' },
                { name: 'Cost (Finance)', role: 'Locks/unlocks budgeting and tracks stage-by-stage planned vs actual spend.' },
                { name: 'Vendor (Procurement)', role: 'Coordinates PO delivery dates with site execution milestone schedules.' },
                { name: 'People (Roles)', role: 'Maps stage access and accountability to role matrix permissions.' },
                { name: 'Insight (Analytics)', role: 'Calculates Schedule Performance Index (SPI) and critical path slippage.' },
                { name: 'AI (Optimization)', role: 'Identifies stage bottlenecks and suggests duration optimizations.' }
              ].map((mod, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white mb-2">{mod.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{mod.role}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ Two-way Data Stream
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: FAQs */}
        {activeTab === 'faq' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                Frequently Asked Operational Questions
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Common questions about workflow configurations, stage rules, and team roles.
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

        {/* Bottom Philosophy Card */}
        <div className="p-6 rounded-xl bg-slate-900 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-400">
              Core Design Thesis
            </span>
            <h3 className="text-lg font-black">Systems Beat Skill</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Projects succeed not by individual heroics, but when repeatable workflows guide every handoff with absolute precision.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center shrink-0 w-full md:w-auto">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Workflow Rule</span>
            <span className="text-sm font-black text-white block mt-0.5">Automated Gate Control</span>
            <span className="text-[11px] text-sky-400 font-semibold block mt-0.5">Continuous Synchronization</span>
          </div>
        </div>

      </div>
    </div>
  );
}
