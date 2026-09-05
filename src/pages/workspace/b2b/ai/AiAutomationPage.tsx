import React, { useState } from 'react';
import {
  Zap,
  Plus,
  Search,
  Filter,
  Play,
  CheckCircle2,
  Pause,
  Layers,
  Building2,
  Clock,
  Sparkles,
  X,
  Sliders,
  ArrowRight,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Activity,
  Bot
} from 'lucide-react';
import { useAi } from './AiContext';
import { AiAutomationRule } from './data/mockAiData';
import { cn } from '../../../../lib/utils';

export function AiAutomationPage() {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    automations,
    toggleAutomation,
    runAutomationNow,
    addAutomation,
    portfolioRollup
  } = useAi();

  const [searchQuery, setSearchQuery] = useState('');
  const [engineFilter, setEngineFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Rule Form State
  const [ruleName, setRuleName] = useState('');
  const [ruleDescription, setRuleDescription] = useState('');
  const [sourceEngine, setSourceEngine] = useState<'Studio' | 'Cost' | 'Flow' | 'Quest' | 'Vendor' | 'People' | 'Connect'>('Studio');
  const [targetEngine, setTargetEngine] = useState<'Studio' | 'Cost' | 'Flow' | 'Quest' | 'Vendor' | 'People' | 'Connect'>('Cost');
  const [category, setCategory] = useState<'Quality Assurance' | 'Financial Control' | 'Workflow Acceleration' | 'Client Comm' | 'Resource Balancing'>('Financial Control');
  const [triggerEvent, setTriggerEvent] = useState('Studio.Drawing.SignedOff');
  const [actionTaken, setActionTaken] = useState('Lock line items into budget baseline and alert Estimator');

  const filteredAutomations = automations.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.triggerEvent.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEngine =
      engineFilter === 'All' ||
      rule.sourceEngine === engineFilter ||
      rule.targetEngine === engineFilter;

    const matchesCategory =
      categoryFilter === 'All' || rule.category === categoryFilter;

    const matchesProject =
      selectedProjectId === 'all' ||
      rule.applicableProjectIds.includes('all') ||
      rule.applicableProjectIds.includes(selectedProjectId);

    return matchesSearch && matchesEngine && matchesCategory && matchesProject;
  });

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    addAutomation({
      name: ruleName,
      description: ruleDescription || 'Custom autonomous trigger created by AI Specialist.',
      sourceEngine,
      targetEngine,
      category,
      triggerEvent,
      actionTaken,
      applicableProjectIds: selectedProjectId === 'all' ? ['all'] : ['all', selectedProjectId]
    });

    setIsCreateModalOpen(false);
    setRuleName('');
    setRuleDescription('');
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-300 overflow-y-auto pr-1 text-left">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#A0D6B422] text-slate-800 dark:text-[#A0D6B4] border border-[#A0D6B444] text-xs font-black uppercase tracking-wider">
              Autonomous Automation Studio
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Event-Driven Cross-Engine Triggers</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            Smart Automation Rules & Bot Orchestration
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Configure autonomous feedback loops linking Studio drawings, Cost budgets, Flow milestones, Quest tasks, and Vendor purchase orders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Project Scope Filter */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl text-xs shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-[#A0D6B4]" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="text-xs font-bold text-slate-800 dark:text-slate-100 bg-transparent border-none outline-none cursor-pointer"
            >
              <option value="all">Portfolio Scope (All Projects — {projects.length} Active Project{projects.length === 1 ? '' : 's'})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-extrabold flex items-center gap-2 shadow-sm hover:opacity-90 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#A0D6B4]" />
            <span>Create Smart Trigger</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase">Configured Automations</span>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {automations.length} Rules
            </h4>
            <p className="text-[11px] text-emerald-600 dark:text-[#A0D6B4] font-semibold mt-0.5">
              {automations.filter((a) => a.status === 'Active').length} Active & Monitoring
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#A0D6B422] flex items-center justify-center text-[#A0D6B4]">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase">24h Execution Volume</span>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              1,248 Runs
            </h4>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
              Average latency: 48ms
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#3b82f61a] flex items-center justify-center text-[#3b82f6]">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase">Accuracy & Safety Verification</span>
            <h4 className="text-2xl font-black text-emerald-600 dark:text-[#A0D6B4] mt-0.5">
              98.6%
            </h4>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
              0 False positive holdovers
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search triggers, events, engines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#A0D6B4] text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Engine Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-xs">
            <span className="text-slate-400 font-semibold">Engine:</span>
            <select
              value={engineFilter}
              onChange={(e) => setEngineFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="All">All Engines</option>
              <option value="Studio">Studio</option>
              <option value="Cost">Cost</option>
              <option value="Flow">Flow</option>
              <option value="Quest">Quest</option>
              <option value="Vendor">Vendor</option>
              <option value="People">People</option>
              <option value="Connect">Connect</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-xs">
            <span className="text-slate-400 font-semibold">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Financial Control">Financial Control</option>
              <option value="Workflow Acceleration">Workflow Acceleration</option>
              <option value="Quality Assurance">Quality Assurance</option>
              <option value="Client Comm">Client Comm</option>
              <option value="Resource Balancing">Resource Balancing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Automations List */}
      <div className="space-y-3">
        {filteredAutomations.map((rule) => (
          <div
            key={rule.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:border-[#A0D6B4]/60 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            {/* Left Info */}
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  {rule.name}
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {rule.category}
                </span>
                {rule.isSystemCore && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#A0D6B422] text-[#A0D6B4] border border-[#A0D6B433]">
                    Arqon Core
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {rule.description}
              </p>

              {/* Event Pipeline Tag */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                  <span className="text-[#A0D6B4] font-black">{rule.sourceEngine}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-[#3b82f6] font-black">{rule.targetEngine}</span>
                </div>

                <span className="text-[11px] text-slate-400">
                  Trigger: <code className="text-slate-600 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">{rule.triggerEvent}</code>
                </span>
              </div>
            </div>

            {/* Right Execution Controls & Metrics */}
            <div className="flex flex-wrap items-center gap-4 lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 dark:border-slate-800">
              <div className="text-right text-xs space-y-0.5 pr-2">
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-slate-400 text-[11px]">Executions:</span>
                  <strong className="text-slate-900 dark:text-white font-extrabold">{rule.executionCount}</strong>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-slate-400 text-[11px]">Accuracy:</span>
                  <strong className="text-emerald-600 dark:text-[#A0D6B4] font-extrabold">{rule.accuracyRate}%</strong>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Last ran: {rule.lastTriggered}
                </span>
              </div>

              {/* Toggle Active Switch */}
              <button
                onClick={() => toggleAutomation(rule.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all',
                  rule.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-[#A0D6B4]'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                )}
              >
                {rule.status === 'Active' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{rule.status}</span>
              </button>

              {/* Instant Test Run Button */}
              <button
                onClick={() => runAutomationNow(rule.id)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-all"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Test Trigger</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Smart Automation Trigger */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black px-2 py-0.5 rounded bg-[#A0D6B422] text-[#A0D6B4]">
                Neural Rule Creator
              </span>
              <span className="text-xs font-bold text-slate-400">• Cross-Engine Hook</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">
              Build Smart Automation Rule
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Define the source engine event, evaluation condition, and autonomous target action.
            </p>

            <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Rule Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Space Finish Change PO Synchronizer"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Operational Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe what this automation checks and which teams it helps..."
                  value={ruleDescription}
                  onChange={(e) => setRuleDescription(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Source Engine (Event Emitter)
                  </label>
                  <select
                    value={sourceEngine}
                    onChange={(e) => setSourceEngine(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-bold"
                  >
                    <option value="Studio">Studio (Design & Spaces)</option>
                    <option value="Cost">Cost (Budgets & POs)</option>
                    <option value="Flow">Flow (Workflows & Critical Path)</option>
                    <option value="Quest">Quest (Tasks & Chat)</option>
                    <option value="Vendor">Vendor (Suppliers & SLA)</option>
                    <option value="People">People (Team & Bandwidth)</option>
                    <option value="Connect">Connect (CRM & Client)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Engine (Action Receiver)
                  </label>
                  <select
                    value={targetEngine}
                    onChange={(e) => setTargetEngine(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-bold"
                  >
                    <option value="Cost">Cost (Budget Update)</option>
                    <option value="Quest">Quest (Task Creation)</option>
                    <option value="Flow">Flow (Stage Progression)</option>
                    <option value="Studio">Studio (Drawing Lock)</option>
                    <option value="Vendor">Vendor (Hold / PO Alert)</option>
                    <option value="People">People (Load Adjustment)</option>
                    <option value="Connect">Connect (Client Briefing)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Trigger Event Signature
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Studio.Drawing.SignedOff"
                  value={triggerEvent}
                  onChange={(e) => setTriggerEvent(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Autonomous Target Action
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lock line items into Cost baseline and alert Project Lead in Quest"
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-medium"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black shadow-sm"
                >
                  Save & Activate Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
