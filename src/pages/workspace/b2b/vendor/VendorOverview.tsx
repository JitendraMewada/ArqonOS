import React, { useState } from 'react';
import {
  Users,
  ShoppingCart,
  Truck,
  Activity,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Database,
  Building2,
  Sparkles,
  Search,
  Filter,
  Eye,
  PlusCircle,
  FileText,
  Clock,
  MapPin,
  Phone,
  RefreshCw
} from 'lucide-react';
import { useVendor } from './VendorContext';
import { cn } from '../../../../lib/utils';

interface VendorOverviewProps {
  onNavigatePage?: (pageName: string) => void;
  navigateToApp?: (appId: string, pageName: string) => void;
}

export function VendorOverview({ onNavigatePage, navigateToApp }: VendorOverviewProps) {
  const {
    vendors,
    purchaseOrders,
    shipments,
    contracts,
    projects,
    selectedProjectId,
    setSelectedProjectId,
    filteredProjects,
    filteredVendors,
    filteredPurchaseOrders,
    filteredShipments,
    filteredContracts,
    totalProcurementSpend,
    totalCommittedPOValue,
    totalPaidAmount,
    totalPendingPayment,
    activeVendorsCount,
    pendingPOsCount,
    inTransitShipmentsCount,
    expiringContractsCount,
    averageQualityScore,
    averageOnTimeDeliveryRate,
    categorySpendBreakdown,
    projectSpendBreakdown,
    isCostEngineSynced,
    isStudioEngineSynced,
    syncAllEngines
  } = useVendor();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Format currency in Indian Rupees style (or clean comma format)
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const selectedProjectObj = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-300 overflow-y-auto pr-1">
      {/* Top Header & Project Selection Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-md bg-[#07B9CE1a] text-[#07B9CE] border border-[#07B9CE33] text-xs font-black uppercase tracking-wider">
              Procurement & Supply Chain Engine
            </span>
            {isCostEngineSynced && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Cost Engine Synced
              </span>
            )}
            {isStudioEngineSynced && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                Studio BOQ Active
              </span>
            )}
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1.5 tracking-tight">
            Vendor & Supply Chain Overview
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time material procurement, supplier governance, purchase orders, and site deliveries.
          </p>
        </div>

        {/* Project Scope Filter Switcher */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-2 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#07B9CE]" /> Project Scope:
          </span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#07B9CE] outline-none cursor-pointer"
          >
            <option value="all">★ All Projects (Portfolio Global View)</option>
            {projects.map(proj => (
              <option key={proj.id} value={proj.id}>
                {proj.code} — {proj.name}
              </option>
            ))}
          </select>
          <button
            onClick={syncAllEngines}
            title="Re-sync cross-engine data"
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-[#07B9CE] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cross-Engine Synchronization Alert Banner if project selected */}
      {selectedProjectId !== 'all' && selectedProjectObj && (
        <div className="bg-[#07B9CE0d] border border-[#07B9CE33] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#07B9CE1a] text-[#07B9CE] flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {selectedProjectObj.name} ({selectedProjectObj.code})
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold">
                  {selectedProjectObj.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Client: <strong className="text-slate-800 dark:text-slate-200">{selectedProjectObj.client}</strong> • Location: {selectedProjectObj.location}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Committed POs</span>
              <span className="font-black text-[#07B9CE] text-sm">{formatCurrency(totalCommittedPOValue)}</span>
            </div>
            <div className="text-right border-l border-slate-200 dark:border-slate-700 pl-4">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Paid to Vendors</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">{formatCurrency(totalPaidAmount)}</span>
            </div>
            {navigateToApp && (
              <button
                onClick={() => navigateToApp('cost', 'Budget Page')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm"
              >
                Open in Cost Engine <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Committed PO Value */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-[#07B9CE66] transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-[#07B9CE1a] flex items-center justify-center text-[#07B9CE]">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {filteredPurchaseOrders.length} Orders Issued
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {selectedProjectId === 'all' ? 'Total Active PO Commitments' : 'Project Committed POs'}
          </p>
          <h3 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            {formatCurrency(totalCommittedPOValue)}
          </h3>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500">Paid: <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(totalPaidAmount)}</strong></span>
            <span className="text-slate-500">Pending: <strong className="text-amber-600 dark:text-amber-400">{formatCurrency(totalPendingPayment)}</strong></span>
          </div>
        </div>

        {/* KPI 2: Active Vendors */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-[#07B9CE66] transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-500">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
              {filteredVendors.filter(v => v.tier === 'Tier 1 Preferred').length} Tier 1 Preferred
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Engaged Suppliers</p>
          <h3 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            {activeVendorsCount} <span className="text-sm font-semibold text-slate-400">Vendors</span>
          </h3>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500">Quality Score: <strong className="text-indigo-600 dark:text-indigo-400">{averageQualityScore}%</strong></span>
            <span className="text-slate-500">On-Time: <strong className="text-indigo-600 dark:text-indigo-400">{averageOnTimeDeliveryRate}%</strong></span>
          </div>
        </div>

        {/* KPI 3: Live In-Transit Cargo */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-amber-400/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500">
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 animate-pulse">
              Live GPS Escort
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Site Deliveries In Transit</p>
          <h3 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            {inTransitShipmentsCount} <span className="text-sm font-semibold text-slate-400">Shipments</span>
          </h3>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500">Pending Site Inspection: <strong className="text-amber-600 dark:text-amber-400">{pendingPOsCount}</strong></span>
          </div>
        </div>

        {/* KPI 4: Compliance & Contracts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-emerald-400/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-500">
              <ShieldCheck className="w-4 h-4" />
            </div>
            {expiringContractsCount > 0 ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-2.5 h-2.5" /> {expiringContractsCount} Renewals Due
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                100% Compliant
              </span>
            )}
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Vendor Contracts</p>
          <h3 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            {filteredContracts.length} <span className="text-sm font-semibold text-slate-400">Agreements</span>
          </h3>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500">Tax & GST: <strong className="text-emerald-600 dark:text-emerald-400">Verified</strong></span>
            <span className="text-slate-500">MSAs: <strong className="text-slate-800 dark:text-slate-200">{filteredContracts.filter(c => c.contractType === 'Master Services Agreement (MSA)').length}</strong></span>
          </div>
        </div>
      </div>

      {/* Middle Section: Procurement Spend by Category & Multi-Engine Integration Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Spend Distribution (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#07B9CE]" /> Procurement Spend Distribution
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown of material commitments and subcontract orders by trade category.
              </p>
            </div>
            {onNavigatePage && (
              <button
                onClick={() => onNavigatePage('Procurement Page')}
                className="text-xs font-bold text-[#07B9CE] hover:underline flex items-center gap-1"
              >
                View All POs <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-4 flex-1">
            {categorySpendBreakdown.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs italic">
                No purchase orders recorded for the selected scope.
              </div>
            ) : (
              categorySpendBreakdown.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{cat.category}</span>
                      <span className="text-[10px] font-semibold text-slate-400">({cat.count} orders)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-slate-900 dark:text-white">{formatCurrency(cat.spend)}</span>
                      <span className="font-bold text-slate-500 w-9 text-right">{cat.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(5, cat.percentage)}%`,
                        backgroundColor: idx === 0 ? '#07B9CE' : idx === 1 ? '#3b82f6' : idx === 2 ? '#a855f7' : idx === 3 ? '#f97316' : '#10b981'
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Project-Wise Aggregation Summary if 'all' is selected */}
          {selectedProjectId === 'all' && (
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Project-Wise Procurement Allocation
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {projectSpendBreakdown.map(p => (
                  <button
                    key={p.projectId}
                    onClick={() => setSelectedProjectId(p.projectId)}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-left hover:border-[#07B9CE] transition-all"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                      <span>{p.projectCode}</span>
                      <span className="text-[#07B9CE]">{p.poCount} POs</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{p.projectName}</p>
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-1">
                      {formatCurrency(p.spend)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Engine Integration Loop Card (1 col) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#07B9CE1a] flex items-center justify-center text-[#07B9CE]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Cross-Engine Data Loop
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">ArqonOS Unified Supply Architecture</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              The Vendor Engine continuously ingests structural finishes and BOQ specs from <strong>Studio</strong>, maps commitments to <strong>Cost</strong> budgets, assigns supervisors from <strong>People</strong>, and aligns timelines with <strong>Connect</strong> milestones.
            </p>

            <div className="space-y-3">
              {/* Studio Engine Node */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  S
                </div>
                <div className="text-xs flex-1">
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>Studio Design & BOQ</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Live Feed</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Drawings & specs (DWG-MBR-012, DWG-LIV-004) mapped to PO line items.
                  </p>
                </div>
              </div>

              {/* Cost Engine Node */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  C
                </div>
                <div className="text-xs flex-1">
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>Cost Budget Sync</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">100% Synced</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    PO commitments automatically reserve space budgets in real-time.
                  </p>
                </div>
              </div>

              {/* People Engine Node */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  P
                </div>
                <div className="text-xs flex-1">
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>People & Site QA</span>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">RBAC Active</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Assigned Site Supervisors perform digital goods receipt & QC signoff.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Single Source of Truth</span>
            {onNavigatePage && (
              <button
                onClick={() => onNavigatePage('Help')}
                className="text-xs font-bold text-[#07B9CE] hover:underline"
              >
                Read Architecture Doc →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Active Purchase Orders & Live Deliveries Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent & Critical Purchase Orders */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <ShoppingCart className="w-4 h-4 text-[#07B9CE]" /> Active Purchase Orders Pipeline
              </h3>
              <p className="text-[11px] text-slate-500">Real-time status of material releases and delivery commitments.</p>
            </div>
            {onNavigatePage && (
              <button
                onClick={() => onNavigatePage('Procurement Page')}
                className="text-xs font-bold text-[#07B9CE] hover:underline flex items-center gap-1"
              >
                Manage POs <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="p-5 flex-1 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-y-auto max-h-[380px]">
            {filteredPurchaseOrders.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">No purchase orders found for this filter.</p>
            ) : (
              filteredPurchaseOrders.map((po) => (
                <div key={po.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white text-xs">{po.poNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {po.projectCode}
                      </span>
                      {po.deliveryStatus === 'Inspected & Accepted' ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Delivered
                        </span>
                      ) : po.deliveryStatus === 'In Transit' || po.deliveryStatus === 'Dispatched' ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center gap-1">
                          <Truck className="w-2.5 h-2.5" /> {po.deliveryStatus}
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                          {po.deliveryStatus}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{po.vendorName}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-md">
                      {po.lineItems.map(l => l.itemDescription).join(', ')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block">
                      {formatCurrency(po.totalAmount)}
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-1 inline-block",
                      po.paymentStatus === 'Paid' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' :
                      po.paymentStatus === 'Partially Paid' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    )}>
                      {po.paymentStatus}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Deliveries & Transit Checkpoints */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-amber-500" /> Real-time Site Deliveries & GPS Escort
              </h3>
              <p className="text-[11px] text-slate-500">Active freight shipments, carrier logs, and arrival forecasts.</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-md">
              {filteredShipments.length} Tracking
            </span>
          </div>

          <div className="p-5 flex-1 space-y-4 overflow-y-auto max-h-[380px]">
            {filteredShipments.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">No active transit shipments for this project scope.</p>
            ) : (
              filteredShipments.map((shipment) => (
                <div key={shipment.id} className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">{shipment.trackingNumber}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#07B9CE1a] text-[#07B9CE] rounded">
                        {shipment.poNumber}
                      </span>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> ETA: {shipment.estimatedArrival}
                    </span>
                  </div>

                  <div className="text-xs">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{shipment.vendorName}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" /> Carrier: {shipment.carrier} • Site: {shipment.destinationSite}
                    </p>
                  </div>

                  {/* Checkpoints summary */}
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-md border border-slate-200/60 dark:border-slate-700/60 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-slate-400 font-semibold text-[10px]">
                      <span>CURRENT LOCATION</span>
                      <span>{shipment.checkpoints[shipment.checkpoints.length - 1]?.timestamp}</span>
                    </div>
                    <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      {shipment.currentLocation}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
