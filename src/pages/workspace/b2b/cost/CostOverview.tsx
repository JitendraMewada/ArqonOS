import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Receipt,
  TrendingUp,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Layers,
  Users,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  ChevronRight,
  Sparkles,
  DollarSign,
  FileText,
  CreditCard,
  Briefcase,
  Sliders,
  ExternalLink,
  ChevronDown,
  X,
  Calendar
} from 'lucide-react';
import { useCost } from './CostContext';
import { ProjectFinancials, CostExpense, SpaceCostBreakdown } from './data/mockCostData';
import { cn } from '../../../../lib/utils';

export function CostOverview() {
  const {
    projectsFinancials,
    expenses,
    selectedProjectId,
    setSelectedProjectId,
    portfolioSummary,
    activeProject,
    syncEngineData,
    isSyncing,
    addExpense,
    exportFinancialSummary
  } = useCost();

  // Active view tabs
  const [activeTab, setActiveTab] = useState<'matrix' | 'spaces' | 'categories' | 'labor' | 'invoices' | 'expenses'>('matrix');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'On Hold' | 'Completed'>('ALL');
  const [healthFilter, setHealthFilter] = useState<'ALL' | 'Healthy' | 'Caution' | 'Critical Overrun'>('ALL');

  // Modal State
  const [isLogExpenseOpen, setIsLogExpenseOpen] = useState(false);
  const [newExpenseProject, setNewExpenseProject] = useState<string>(projectsFinancials[0]?.projectId || '');
  const [newExpenseCategory, setNewExpenseCategory] = useState<CostExpense['category']>('Materials & Finishes');
  const [newExpenseSpace, setNewExpenseSpace] = useState<string>('');
  const [newExpenseVendor, setNewExpenseVendor] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState<number>(0);
  const [newExpenseMethod, setNewExpenseMethod] = useState<CostExpense['paymentMethod']>('Bank Transfer');
  const [newExpenseStatus, setNewExpenseStatus] = useState<CostExpense['status']>('Paid');
  const [newExpenseInvoice, setNewExpenseInvoice] = useState('');
  const [newExpenseNotes, setNewExpenseNotes] = useState('');

  // Selected project for space dropdown
  const selectedModalProject = projectsFinancials.find(p => p.projectId === newExpenseProject);

  // Filtered projects list
  const filteredProjects = useMemo(() => {
    return projectsFinancials.filter(proj => {
      const matchesSearch =
        proj.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || proj.status === statusFilter;
      const matchesHealth = healthFilter === 'ALL' || proj.budgetHealth === healthFilter;

      return matchesSearch && matchesStatus && matchesHealth;
    });
  }, [projectsFinancials, searchQuery, statusFilter, healthFilter]);

  // Filtered expenses list
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      if (selectedProjectId !== 'ALL' && exp.projectId !== selectedProjectId) {
        return false;
      }
      if (!searchQuery) return true;
      return (
        exp.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.invoiceRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exp.spaceName && exp.spaceName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [expenses, selectedProjectId, searchQuery]);

  // Filtered spaces (across active project or all projects)
  const displayedSpaces = useMemo(() => {
    if (selectedProjectId !== 'ALL') {
      const proj = projectsFinancials.find(p => p.projectId === selectedProjectId);
      return proj ? proj.spaces.map(s => ({ ...s, projectName: proj.projectName, projectCode: proj.projectCode })) : [];
    }
    return projectsFinancials.flatMap(p => p.spaces.map(s => ({ ...s, projectName: p.projectName, projectCode: p.projectCode })));
  }, [projectsFinancials, selectedProjectId]);

  // Handle logging new expense
  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseProject || newExpenseAmount <= 0 || !newExpenseVendor) return;

    const targetProj = projectsFinancials.find(p => p.projectId === newExpenseProject);
    await addExpense({
      projectId: newExpenseProject,
      projectName: targetProj?.projectName || 'Project',
      date: new Date().toISOString().split('T')[0],
      category: newExpenseCategory,
      spaceName: newExpenseSpace || 'General / Unallocated',
      vendorName: newExpenseVendor,
      amount: Number(newExpenseAmount),
      paymentMethod: newExpenseMethod,
      status: newExpenseStatus,
      invoiceRef: newExpenseInvoice || `INV-${Date.now().toString().slice(-4)}`,
      notes: newExpenseNotes
    });

    // Reset & Close
    setIsLogExpenseOpen(false);
    setNewExpenseAmount(0);
    setNewExpenseVendor('');
    setNewExpenseInvoice('');
    setNewExpenseNotes('');
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto animate-in fade-in duration-300 text-left">
      {/* Top Header & Engine Intelligence Banner */}
      <div className="p-6 pb-2 max-w-7xl mx-auto w-full space-y-4">
        {/* Main Title Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[11px] font-black uppercase tracking-wider mb-2 border border-slate-300/50 dark:border-slate-700/50">
              <Building2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              ArqonOS Financial Control Engine
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              Cost & Budget Overview
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {selectedProjectId === 'ALL' ? 'All Projects Portfolio' : activeProject?.projectName}
              </span>
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Cross-engine budgeting, BOQ variance tracking, and real-time expense control synced with Studio, Connect & People.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => syncEngineData()}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
              title="Sync latest approved BOQs, Spaces from Studio and Deals from Connect"
            >
              <RefreshCw className={cn("w-3.5 h-3.5 text-slate-500", isSyncing && "animate-spin text-slate-700")} />
              {isSyncing ? 'Syncing Engines...' : 'Sync Engine Data'}
            </button>

            <button
              onClick={() => exportFinancialSummary(selectedProjectId === 'ALL' ? undefined : selectedProjectId)}
              className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export Financials
            </button>

            <button
              onClick={() => setIsLogExpenseOpen(true)}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-extrabold transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Log Expense
            </button>
          </div>
        </div>

        {/* Project Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800/80 pt-2">
          <button
            onClick={() => setSelectedProjectId('ALL')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 border",
              selectedProjectId === 'ALL'
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            )}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>All Projects Overview</span>
            <span className={cn(
              "text-[10px] px-1.5 py-0.2 rounded-md font-bold",
              selectedProjectId === 'ALL'
                ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500"
            )}>
              {projectsFinancials.length}
            </span>
          </button>

          {projectsFinancials.map(proj => {
            const isSelected = selectedProjectId === proj.projectId;
            return (
              <button
                key={proj.projectId}
                onClick={() => setSelectedProjectId(proj.projectId)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border",
                  isSelected
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                )}
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    proj.budgetHealth === 'Healthy' ? "bg-emerald-500" : proj.budgetHealth === 'Caution' ? "bg-amber-500" : "bg-rose-500"
                  )}
                />
                <span>{proj.projectName}</span>
                <span className="text-[10px] opacity-70">({proj.projectCode})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 pt-2 max-w-7xl mx-auto w-full space-y-6 flex-1">
        {/* KPI Financial Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Budget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {selectedProjectId === 'ALL' ? 'Total Approved BOQ' : 'Project Budget'}
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ₹{((selectedProjectId === 'ALL' ? portfolioSummary.totalPortfolioApprovedBudget : activeProject?.approvedBudget || 0) / 100000).toFixed(2)}L
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span>Contract Val: ₹{((selectedProjectId === 'ALL' ? portfolioSummary.totalPortfolioContractValue : activeProject?.contractValue || 0) / 100000).toFixed(2)}L</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {selectedProjectId === 'ALL' ? `${portfolioSummary.portfolioGrossMarginPercentage}% Margin` : `${activeProject?.marginPercentage}% Margin`}
              </span>
            </div>
          </div>

          {/* Card 2: Actual Incurred Expenses */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Receipt className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Actual Spent</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ₹{((selectedProjectId === 'ALL' ? portfolioSummary.totalPortfolioIncurredCost : activeProject?.actualIncurredCost || 0) / 100000).toFixed(2)}L
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span>
                {selectedProjectId === 'ALL'
                  ? `${((portfolioSummary.totalPortfolioIncurredCost / (portfolioSummary.totalPortfolioApprovedBudget || 1)) * 100).toFixed(1)}% of Budget`
                  : `${(((activeProject?.actualIncurredCost || 0) / (activeProject?.approvedBudget || 1)) * 100).toFixed(1)}% of Budget`}
              </span>
              <span className="text-slate-600 dark:text-slate-400 font-bold">Paid Out</span>
            </div>
          </div>

          {/* Card 3: Committed POs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Committed POs</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ₹{((selectedProjectId === 'ALL' ? portfolioSummary.totalPortfolioCommittedCost : activeProject?.committedCost || 0) / 100000).toFixed(2)}L
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span>Vendor Commitments</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">In Progress</span>
            </div>
          </div>

          {/* Card 4: Remaining Available Capital */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Remaining Runway</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ₹{((selectedProjectId === 'ALL' ? portfolioSummary.totalPortfolioRemainingBudget : Math.max(0, (activeProject?.approvedBudget || 0) - (activeProject?.actualIncurredCost || 0))) / 100000).toFixed(2)}L
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span>
                Variance: ₹{((selectedProjectId === 'ALL' ? portfolioSummary.totalPortfolioApprovedBudget - portfolioSummary.totalPortfolioForecastCost : activeProject?.variance || 0) / 100000).toFixed(2)}L
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Unallocated</span>
            </div>
          </div>

          {/* Card 5: Client Billing Collections */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Client Invoiced</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ₹{((selectedProjectId === 'ALL' ? portfolioSummary.totalInvoiced : activeProject?.cashflowInvoiced || 0) / 100000).toFixed(2)}L
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span>Collected: ₹{((selectedProjectId === 'ALL' ? portfolioSummary.totalCollected : activeProject?.cashflowReceived || 0) / 100000).toFixed(2)}L</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                Due: ₹{((selectedProjectId === 'ALL' ? portfolioSummary.totalReceivables : activeProject?.cashflowOutstanding || 0) / 100000).toFixed(2)}L
              </span>
            </div>
          </div>
        </div>

        {/* Engine Lineage & Studio Gatekeeper Status Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  Multi-Engine Data Synchronization
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Live Active Integration
                  </span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Financial figures are mathematically bound to <strong>Studio</strong> BOQ spaces & dimensions, <strong>Connect</strong> client contract milestones, <strong>People</strong> role rate cards, and <strong>Vendor</strong> purchase commitments.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center shrink-0 text-xs font-bold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {portfolioSummary.healthyProjectsCount} Healthy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {portfolioSummary.cautionProjectsCount} Caution
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                {portfolioSummary.overrunProjectsCount} Overrun
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs & Filters Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('matrix')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === 'matrix'
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              )}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>All Projects Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('spaces')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === 'spaces'
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Space BOQ Breakdown</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === 'categories'
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              )}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Category & FF&E</span>
            </button>

            <button
              onClick={() => setActiveTab('labor')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === 'labor'
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              )}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Labor & Roles</span>
            </button>

            <button
              onClick={() => setActiveTab('invoices')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === 'invoices'
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              )}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Client Invoicing</span>
            </button>

            <button
              onClick={() => setActiveTab('expenses')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === 'expenses'
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              )}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Expense Ledger</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                {filteredExpenses.length}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search financials, vendor, space..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-500 font-medium shadow-sm"
            />
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: ALL PROJECTS FINANCIAL MATRIX                          */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            {/* Project Financial Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((proj) => {
                const spentPct = proj.approvedBudget > 0 ? (proj.actualIncurredCost / proj.approvedBudget) * 100 : 0;
                const committedPct = proj.approvedBudget > 0 ? (proj.committedCost / proj.approvedBudget) * 100 : 0;
                const isSelected = selectedProjectId === proj.projectId;

                return (
                  <div
                    key={proj.projectId}
                    className={cn(
                      "bg-white dark:bg-slate-900 border rounded-xl p-5 shadow-sm transition-all flex flex-col justify-between group",
                      isSelected
                        ? "border-slate-900 dark:border-white ring-1 ring-slate-900 dark:ring-white"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md"
                    )}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                            {proj.projectCode} • {proj.projectType}
                          </span>
                          <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                            {proj.projectName}
                          </h3>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {proj.clientName}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide",
                              proj.budgetHealth === 'Healthy'
                                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                : proj.budgetHealth === 'Caution'
                                ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                                : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                            )}
                          >
                            {proj.budgetHealth}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {proj.approvalGateStatus}
                          </span>
                        </div>
                      </div>

                      {/* Location & Area Details */}
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <span>{proj.location}</span>
                        <span>•</span>
                        <span>{proj.totalAreaSqFt.toLocaleString()} sq ft</span>
                        <span>•</span>
                        <span>{proj.spaces.length} Spaces</span>
                      </div>

                      {/* Financial Key Numbers */}
                      <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg mb-4 text-left">
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Approved BOQ</p>
                          <p className="text-sm font-black text-slate-900 dark:text-white">
                            ₹{(proj.approvedBudget / 100000).toFixed(2)}L
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Actual Spent</p>
                          <p className="text-sm font-black text-rose-600 dark:text-rose-400">
                            ₹{(proj.actualIncurredCost / 100000).toFixed(2)}L
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Est. Margin</p>
                          <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                            {proj.marginPercentage}%
                          </p>
                        </div>
                      </div>

                      {/* Budget Burn Progress Bar */}
                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-slate-600 dark:text-slate-400">
                            Burn: {spentPct.toFixed(0)}% spent + {committedPct.toFixed(0)}% committed
                          </span>
                          <span className={cn(
                            proj.variance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                          )}>
                            {proj.variance >= 0 ? `+₹${(proj.variance / 1000).toFixed(0)}k savings` : `-₹${(Math.abs(proj.variance) / 1000).toFixed(0)}k overrun`}
                          </span>
                        </div>

                        <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                          <div
                            className="bg-slate-900 dark:bg-white h-full transition-all"
                            style={{ width: `${Math.min(100, spentPct)}%` }}
                            title={`Spent: ₹${proj.actualIncurredCost.toLocaleString()}`}
                          />
                          <div
                            className="bg-amber-500/80 h-full transition-all"
                            style={{ width: `${Math.min(100 - Math.min(100, spentPct), committedPct)}%` }}
                            title={`Committed: ₹${proj.committedCost.toLocaleString()}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedProjectId(proj.projectId)}
                        className="text-xs font-bold text-slate-900 dark:text-white hover:underline flex items-center gap-1"
                      >
                        {isSelected ? 'Currently Selected' : 'Filter Deep-Dive'}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setNewExpenseProject(proj.projectId);
                            setIsLogExpenseOpen(true);
                          }}
                          className="text-[11px] font-extrabold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                        >
                          + Expense
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Comprehensive Cross-Project Comparison Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Cross-Project Financial Ledger Matrix
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Direct comparison of contract value, approved BOQ allocations, and cash flows.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  Showing {filteredProjects.length} Projects
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Project & Client</th>
                      <th className="py-3 px-4">Studio BOQ Gate</th>
                      <th className="py-3 px-4 text-right">Contract Val</th>
                      <th className="py-3 px-4 text-right">Approved BOQ</th>
                      <th className="py-3 px-4 text-right">Actual Spent</th>
                      <th className="py-3 px-4 text-right">Committed POs</th>
                      <th className="py-3 px-4 text-right">Forecast (EAC)</th>
                      <th className="py-3 px-4 text-right">Variance</th>
                      <th className="py-3 px-4 text-right">Margin %</th>
                      <th className="py-3 px-4 text-center">Health</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {filteredProjects.map((p) => (
                      <tr key={p.projectId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-black text-slate-900 dark:text-white">{p.projectName}</div>
                          <div className="text-[11px] text-slate-500 font-semibold">{p.projectCode} • {p.clientName}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-extrabold",
                            p.approvalGateStatus === 'Unlocked & Approved'
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                          )}>
                            {p.approvalGateStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                          ₹{p.contractValue.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                          ₹{p.approvedBudget.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-rose-600 dark:text-rose-400">
                          ₹{p.actualIncurredCost.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-amber-600 dark:text-amber-400">
                          ₹{p.committedCost.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-700 dark:text-slate-300">
                          ₹{p.forecastAtCompletion.toLocaleString()}
                        </td>
                        <td className={cn(
                          "py-3 px-4 text-right font-extrabold",
                          p.variance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                        )}>
                          {p.variance >= 0 ? `+₹${p.variance.toLocaleString()}` : `-₹${Math.abs(p.variance).toLocaleString()}`}
                        </td>
                        <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">
                          {p.marginPercentage}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold",
                            p.budgetHealth === 'Healthy' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" :
                            p.budgetHealth === 'Caution' ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" :
                            "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                          )}>
                            {p.budgetHealth}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setSelectedProjectId(p.projectId)}
                            className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: SPACE-BY-SPACE BOQ BREAKDOWN                           */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'spaces' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Space-by-Space BOQ Financials ({selectedProjectId === 'ALL' ? 'All Projects' : activeProject?.projectName})
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Detailed cost breakdown mapped directly from Studio Spaces, dimensions, ceiling drops, and surface finishes.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {displayedSpaces.length} Spaces Mapped
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {displayedSpaces.map((space, idx) => (
                <div
                  key={`${space.spaceId}-${idx}`}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                        {space.projectName} • {space.spaceType}
                      </span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">
                        {space.spaceName}
                      </h4>
                      <p className="text-xs font-semibold text-slate-500">
                        Area: {space.areaSqFt} sq ft • ₹{Math.round(space.allocatedBudget / (space.areaSqFt || 1))} / sq ft
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-500 uppercase">Allocated BOQ</p>
                      <p className="text-base font-black text-slate-900 dark:text-white">
                        ₹{space.allocatedBudget.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Finishes Matrix for this space */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 space-y-2 text-xs">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                      Architectural Surface & Millwork Finishes
                    </p>
                    <div className="grid grid-cols-1 gap-1.5 font-medium">
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span className="truncate">Flooring: {space.finishes.flooring.name}</span>
                        <span className="font-bold shrink-0">₹{space.finishes.flooring.cost.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span className="truncate">Ceiling: {space.finishes.ceiling.name}</span>
                        <span className="font-bold shrink-0">₹{space.finishes.ceiling.cost.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span className="truncate">Walls: {space.finishes.walls.name}</span>
                        <span className="font-bold shrink-0">₹{space.finishes.walls.cost.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span className="truncate">Millwork: {space.finishes.millwork.name}</span>
                        <span className="font-bold shrink-0">₹{space.finishes.millwork.cost.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span className="truncate">Lighting & Fixtures: {space.finishes.fixtures.name}</span>
                        <span className="font-bold shrink-0">₹{space.finishes.fixtures.cost.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress & Variance */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-400">
                      Actual Spend: ₹{space.actualCost.toLocaleString()}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      Variance: ₹{space.variance.toLocaleString()} remaining
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: CATEGORY & FF&E PROCUREMENT                            */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Cost Breakdown by Category & Procurement Engine
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Aggregated expenditure across Materials, Millwork, FF&E, MEP, Labor, and Civil lines.
                </p>
              </div>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { name: 'Materials & Surface Finishes', desc: 'Marble, timber hardwood, limewash, porcelain tiles', icon: Layers, alloc: 850000, spent: 224500, comm: 218000 },
                { name: 'Custom Millwork & Joinery', desc: 'Bespoke boardroom tables, walk-in closets, kitchenettes', icon: Building2, alloc: 587000, spent: 188000, comm: 212500 },
                { name: 'FF&E & Loose Furniture', desc: 'Ergonomic seating, lounge sofas, bespoke styling decor', icon: Briefcase, alloc: 485000, spent: 150500, comm: 181500 },
                { name: 'MEP, HVAC & Lighting', desc: 'Architectural recessed magnetic tracks, DMX fixtures', icon: Sparkles, alloc: 281000, spent: 74200, comm: 82500 },
                { name: 'Labor & Studio Supervision', desc: 'Design lead hours, 3D visualizers, draftsman, supervisors', icon: Users, alloc: 218000, spent: 46600, comm: 48500 },
                { name: 'Civil, Demolition & Prep', desc: 'Subfloor prep, masonry partition drops, waste haulage', icon: FileText, alloc: 68800, spent: 12150, comm: 12000 }
              ].map((cat, i) => {
                const totalUsed = cat.spent + cat.comm;
                const pct = (totalUsed / cat.alloc) * 100;
                return (
                  <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                        <cat.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                          {cat.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">{cat.desc}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg text-xs">
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Allocated</p>
                        <p className="font-black text-slate-900 dark:text-white">₹{(cat.alloc / 1000).toFixed(0)}k</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Spent</p>
                        <p className="font-black text-rose-600 dark:text-rose-400">₹{(cat.spent / 1000).toFixed(0)}k</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Committed</p>
                        <p className="font-black text-amber-600 dark:text-amber-400">₹{(cat.comm / 1000).toFixed(0)}k</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        <span>Utilization</span>
                        <span>{pct.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full bg-slate-900 dark:bg-white transition-all" style={{ width: `${Math.min(100, pct)}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: LABOR & TEAM COSTING (PEOPLE INTEGRATION)               */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'labor' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Labor & Professional Services Costing ({selectedProjectId === 'ALL' ? 'All Active Projects' : activeProject?.projectName})
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Team member hours, hourly billing rate cards, and department cost centers linked with the People module.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Role & Assigned Team Member</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4 text-right">Hourly Rate</th>
                    <th className="py-3 px-4 text-right">Hours Logged</th>
                    <th className="py-3 px-4 text-right">Total Cost</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {(selectedProjectId === 'ALL' ? projectsFinancials.flatMap(p => p.laborTeam) : (activeProject?.laborTeam || [])).map((labor, i) => (
                    <tr key={`${labor.id}-${i}`} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <div className="font-black text-slate-900 dark:text-white">{labor.assignedMember}</div>
                        <div className="text-[11px] text-slate-500 font-semibold">{labor.roleName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {labor.department}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                        ₹{labor.hourlyRate.toLocaleString()} / hr
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                        {labor.hoursLogged} hrs
                      </td>
                      <td className="py-3 px-4 text-right font-black text-rose-600 dark:text-rose-400">
                        ₹{labor.totalCost.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                          Active Assigned
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: CLIENT INVOICING & MILESTONES (CONNECT INTEGRATION)    */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Client Milestone Invoicing & Cash Flow Velocity
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Tracks signed payment stages, advance collections, and pending accounts receivable.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(selectedProjectId === 'ALL' ? projectsFinancials.flatMap(p => p.invoices.map(inv => ({ ...inv, projectName: p.projectName }))) : (activeProject?.invoices.map(inv => ({ ...inv, projectName: activeProject.projectName })) || [])).map((inv, idx) => (
                <div key={`${inv.id}-${idx}`} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                        {inv.projectName} • {inv.invoiceNumber}
                      </span>
                      <h4 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                        {inv.milestoneName}
                      </h4>
                      <p className="text-xs font-semibold text-slate-500">
                        Milestone Due Date: {inv.dueDate}
                      </p>
                    </div>

                    <span className={cn(
                      "px-2.5 py-1 rounded text-xs font-black uppercase tracking-wide",
                      inv.status === 'Paid'
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                        : inv.status === 'Pending'
                        ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                        : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                    )}>
                      {inv.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-500">
                      Amount: {inv.percentage}% of Contract
                    </span>
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      ₹{inv.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: EXPENSE LEDGER (TRANSACTIONS)                          */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Multi-Project Expense Ledger ({filteredExpenses.length} Transactions)
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Itemized expenditures, vendor invoices, payment receipts, and category allocations.
                </p>
              </div>

              <button
                onClick={() => setIsLogExpenseOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Log Transaction
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Date & Invoice Ref</th>
                    <th className="py-3 px-4">Project & Space</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Vendor</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <div className="font-black text-slate-900 dark:text-white">{exp.date}</div>
                        <div className="text-[11px] text-slate-500 font-semibold">{exp.invoiceRef}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{exp.projectName}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{exp.spaceName || 'All Spaces'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {exp.vendorName}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {exp.paymentMethod}
                      </td>
                      <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">
                        ₹{exp.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold",
                          exp.status === 'Paid' ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400" :
                          exp.status === 'Approved' ? "bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400" :
                          "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                        )}>
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: LOG NEW EXPENSE TRANSACTION                            */}
      {/* ------------------------------------------------------------- */}
      {isLogExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Log Project Expense</h3>
                <p className="text-xs text-slate-500 font-medium">Record a payment or invoice against an approved BOQ budget line.</p>
              </div>
              <button
                onClick={() => setIsLogExpenseOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Project *</label>
                  <select
                    value={newExpenseProject}
                    onChange={(e) => {
                      setNewExpenseProject(e.target.value);
                      setNewExpenseSpace('');
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-500"
                    required
                  >
                    {projectsFinancials.map(p => (
                      <option key={p.projectId} value={p.projectId}>{p.projectName} ({p.projectCode})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Space BOQ *</label>
                  <select
                    value={newExpenseSpace}
                    onChange={(e) => setNewExpenseSpace(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-500"
                  >
                    <option value="">General / All Spaces</option>
                    {selectedModalProject?.spaces.map(s => (
                      <option key={s.spaceId} value={s.spaceName}>{s.spaceName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                  <select
                    value={newExpenseCategory}
                    onChange={(e) => setNewExpenseCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-500"
                  >
                    <option value="Materials & Finishes">Materials & Finishes</option>
                    <option value="Millwork & Joinery">Millwork & Joinery</option>
                    <option value="FF&E & Furniture">FF&E & Furniture</option>
                    <option value="MEP & Lighting">MEP & Lighting</option>
                    <option value="Labor & Supervision">Labor & Supervision</option>
                    <option value="Civil & Demolition">Civil & Demolition</option>
                    <option value="Logistics & Misc">Logistics & Misc</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    value={newExpenseAmount || ''}
                    onChange={(e) => setNewExpenseAmount(Number(e.target.value))}
                    placeholder="e.g. 45000"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Vendor / Contractor *</label>
                  <input
                    type="text"
                    value={newExpenseVendor}
                    onChange={(e) => setNewExpenseVendor(e.target.value)}
                    placeholder="e.g. Listone Giordano Timber"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Invoice / PO Reference</label>
                  <input
                    type="text"
                    value={newExpenseInvoice}
                    onChange={(e) => setNewExpenseInvoice(e.target.value)}
                    placeholder="e.g. INV-2026-881"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Method</label>
                  <select
                    value={newExpenseMethod}
                    onChange={(e) => setNewExpenseMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-500"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Wire / ACH">Wire / ACH</option>
                    <option value="Petty Cash">Petty Cash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Status</label>
                  <select
                    value={newExpenseStatus}
                    onChange={(e) => setNewExpenseStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-500"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Notes / Description</label>
                <textarea
                  value={newExpenseNotes}
                  onChange={(e) => setNewExpenseNotes(e.target.value)}
                  rows={2}
                  placeholder="Material delivery notes, specifications, or milestone reference..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogExpenseOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-extrabold shadow-md"
                >
                  Confirm & Post Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
