import React, { useState } from 'react';
import {
  FileText,
  PlusCircle,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  X,
  CheckCircle2
} from 'lucide-react';
import { useVendor } from './VendorContext';
import { VendorContract } from './data/mockVendorData';
import { cn } from '../../../../lib/utils';

export function VendorContractsPage() {
  const {
    contracts,
    filteredContracts,
    vendors,
    projects,
    selectedProjectId,
    setSelectedProjectId,
    addContract,
    updateContractStatus
  } = useVendor();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedContractForDetail, setSelectedContractForDetail] = useState<VendorContract | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Contract Form State
  const [contractTitle, setContractTitle] = useState('');
  const [contractVendorId, setContractVendorId] = useState(vendors[0]?.id || 'VND-001');
  const [contractType, setContractType] = useState<VendorContract['contractType']>('Master Services Agreement (MSA)');
  const [contractProjectId, setContractProjectId] = useState('PRJ-2024-001');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [renewalAlertDate, setRenewalAlertDate] = useState('2024-11-15');
  const [totalValue, setTotalValue] = useState(5000000);
  const [warrantyMonths, setWarrantyMonths] = useState(24);
  const [insuranceNumber, setInsuranceNumber] = useState('INS-POL-2024-9912');
  const [penaltyClauses, setPenaltyClauses] = useState('1% per week of unexcused project delay up to 8% ceiling.');
  const [signedByVendor, setSignedByVendor] = useState('Authorized Representative');
  const [signedByArqon, setSignedByArqon] = useState('Aarav Mehta (Head of Operations)');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = vendors.find(v => v.id === contractVendorId);
    const proj = projects.find(p => p.id === contractProjectId);
    if (!vendor || !contractTitle) return;

    addContract({
      title: contractTitle,
      vendorId: vendor.id,
      vendorName: vendor.name,
      projectId: contractType === 'Project Turnkey Subcontract' ? proj?.id : undefined,
      projectName: contractType === 'Project Turnkey Subcontract' ? proj?.name : undefined,
      projectCode: contractType === 'Project Turnkey Subcontract' ? proj?.code : undefined,
      contractType,
      startDate,
      endDate,
      renewalAlertDate,
      totalContractValue: totalValue,
      paymentMilestones: ['30% Advance', '40% Mid-execution', '30% Post QA Handover'],
      penaltyClauses,
      warrantyPeriodMonths: warrantyMonths,
      insurancePolicyNumber: insuranceNumber,
      status: 'Active',
      signedByVendor,
      signedByArqon,
      governingLaw: 'Jurisdiction of Bengaluru, Karnataka, India'
    });

    setIsAddModalOpen(false);
  };

  const filteredList = filteredContracts.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contractNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'All' || c.contractType === typeFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-300 overflow-y-auto pr-1">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#07B9CE1a] text-[#07B9CE] border border-[#07B9CE33] text-xs font-black uppercase tracking-wider">
              Legal & Compliance Engine
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Master Service Agreements & SLAs</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            Vendor Contracts & Agreements
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Manage subcontractor agreements, annual material rate cards, SLA warranties, and renewal alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Project Scope Filter */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl text-xs">
            <Building2 className="w-3.5 h-3.5 text-[#07B9CE]" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="text-xs font-bold text-slate-800 dark:text-slate-100 bg-transparent border-none outline-none cursor-pointer"
            >
              <option value="all">All Projects Scope</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#07B9CE] hover:bg-[#07B9CE]/90 text-white text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Add New Contract
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search agreement, vendor, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#07B9CE] text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="All">All Contract Types</option>
            <option value="Master Services Agreement (MSA)">Master Services Agreement (MSA)</option>
            <option value="Project Turnkey Subcontract">Project Turnkey Subcontract</option>
            <option value="Material Supply Agreement">Material Supply Agreement</option>
            <option value="Annual Rate Card Contract">Annual Rate Card Contract</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>
      </div>

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map((contract) => (
          <div
            key={contract.id}
            onClick={() => setSelectedContractForDetail(contract)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:border-[#07B9CE] cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#07B9CE1a] text-[#07B9CE]">
                  {contract.contractNumber}
                </span>
                <span className={cn(
                  "text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1",
                  contract.status === 'Active' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                  contract.status === 'Expiring Soon' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 animate-pulse' :
                  'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                )}>
                  {contract.status === 'Expiring Soon' && <AlertTriangle className="w-2.5 h-2.5" />}
                  {contract.status}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-[#07B9CE] transition-colors">
                {contract.title}
              </h3>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                Vendor: <span className="text-[#07B9CE]">{contract.vendorName}</span>
              </p>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                Type: {contract.contractType} {contract.projectName && `• ${contract.projectName}`}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Validity:</span>
                  <strong className="text-slate-800 dark:text-slate-200 font-semibold">{contract.startDate} to {contract.endDate}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Warranty:</span>
                  <strong className="text-slate-800 dark:text-slate-200 font-semibold">{contract.warrantyPeriodMonths} Months Comprehensive</strong>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Insurance Policy:</span>
                  <strong className="text-slate-800 dark:text-slate-200 font-semibold">{contract.insurancePolicyNumber}</strong>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Contract Value</span>
                <strong className="text-slate-900 dark:text-white font-black text-sm">{formatCurrency(contract.totalContractValue)}</strong>
              </div>
              <div className="flex items-center gap-1.5 text-[#07B9CE] font-bold text-xs">
                <span>View Terms</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contract Detail Modal */}
      {selectedContractForDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedContractForDetail(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black px-2 py-0.5 rounded bg-[#07B9CE1a] text-[#07B9CE]">
                {selectedContractForDetail.contractNumber}
              </span>
              <span className="text-xs font-bold text-emerald-600">✓ Executed Legal Instrument</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              {selectedContractForDetail.title}
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Party: <strong>{selectedContractForDetail.vendorName}</strong> • Type: {selectedContractForDetail.contractType}
            </p>

            <div className="space-y-3 text-xs mb-6">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5">
                <span className="font-extrabold text-slate-900 dark:text-white block">Payment Schedule & Milestones</span>
                {selectedContractForDetail.paymentMilestones.map((m, i) => (
                  <p key={i} className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#07B9CE]" /> {m}
                  </p>
                ))}
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <span className="font-extrabold text-slate-900 dark:text-white block">Penalty & Liquidated Damages</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedContractForDetail.penaltyClauses}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <span className="font-extrabold text-slate-900 dark:text-white block">Signatories</span>
                <p className="text-slate-600 dark:text-slate-300"><strong>ArqonOS:</strong> {selectedContractForDetail.signedByArqon}</p>
                <p className="text-slate-600 dark:text-slate-300"><strong>Supplier:</strong> {selectedContractForDetail.signedByVendor}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedContractForDetail(null)}
                className="px-5 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow-sm"
              >
                Close Agreement View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Contract Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">
              Add New Vendor Agreement / Subcontract
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Record Master Service Agreements, material supply contracts, and warranty terms.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Agreement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Millwork & Cabinetry Framework Agreement"
                  value={contractTitle}
                  onChange={(e) => setContractTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Contract Type</label>
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-bold"
                  >
                    <option value="Master Services Agreement (MSA)">Master Services Agreement (MSA)</option>
                    <option value="Project Turnkey Subcontract">Project Turnkey Subcontract</option>
                    <option value="Material Supply Agreement">Material Supply Agreement</option>
                    <option value="Annual Rate Card Contract">Annual Rate Card Contract</option>
                    <option value="Warranty & Maintenance SLA">Warranty & Maintenance SLA</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Vendor *</label>
                  <select
                    value={contractVendorId}
                    onChange={(e) => setContractVendorId(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-bold"
                  >
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Renewal Alert Date</label>
                  <input
                    type="date"
                    value={renewalAlertDate}
                    onChange={(e) => setRenewalAlertDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Contract Ceiling Value (₹)</label>
                  <input
                    type="number"
                    value={totalValue}
                    onChange={(e) => setTotalValue(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Warranty Period (Months)</label>
                  <input
                    type="number"
                    value={warrantyMonths}
                    onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#07B9CE] hover:bg-[#07B9CE]/90 font-extrabold text-white shadow-sm"
                >
                  Register Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
