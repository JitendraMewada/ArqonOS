import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  PlusCircle,
  Building2,
  Star,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  X,
  Edit2,
  Trash2,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useVendor } from './VendorContext';
import { Vendor } from './data/mockVendorData';
import { cn } from '../../../../lib/utils';

export function VendorDirectoryPage() {
  const {
    vendors,
    filteredVendors,
    selectedProjectId,
    setSelectedProjectId,
    projects,
    addVendor,
    updateVendor,
    deleteVendor,
    purchaseOrders
  } = useVendor();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [selectedVendorForDetail, setSelectedVendorForDetail] = useState<Vendor | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Vendor Form State
  const [formData, setFormData] = useState({
    name: '',
    companyCode: '',
    category: 'Millwork & Custom Joinery' as Vendor['category'],
    rating: 4.8,
    tier: 'Tier 1 Preferred' as Vendor['tier'],
    contactPerson: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    taxId: '',
    paymentTerms: 'Net 30' as Vendor['paymentTerms'],
    bankDetails: {
      accountName: '',
      bankName: '',
      accountNumber: '',
      ifscSwift: ''
    },
    complianceStatus: 'Verified' as Vendor['complianceStatus'],
    onTimeDeliveryRate: 95.0,
    qualityScore: 96.0,
    activeProjects: ['PRJ-2024-001'],
    catalogsCount: 4,
    leadTimeWeeks: 2,
    notes: ''
  });

  const categories = [
    'All',
    'Millwork & Custom Joinery',
    'Civil & Structural Materials',
    'Electrical, MEP & Lighting',
    'FF&E & Luxury Furniture',
    'Stone, Marble & Tiles',
    'Glass, Glazing & Metal Works',
    'Paint, Textures & Wall Finishes',
    'HVAC, Automation & Smart Home'
  ];

  const filteredList = filteredVendors.filter(v => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.companyCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesTier = selectedTier === 'All' || v.tier === selectedTier;

    return matchesSearch && matchesCategory && matchesTier;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contactPerson || !formData.email) return;

    addVendor(formData);
    setIsAddModalOpen(false);
    // Reset form
    setFormData({
      name: '',
      companyCode: '',
      category: 'Millwork & Custom Joinery',
      rating: 4.8,
      tier: 'Tier 1 Preferred',
      contactPerson: '',
      email: '',
      phone: '',
      city: '',
      address: '',
      taxId: '',
      paymentTerms: 'Net 30',
      bankDetails: { accountName: '', bankName: '', accountNumber: '', ifscSwift: '' },
      complianceStatus: 'Verified',
      onTimeDeliveryRate: 95.0,
      qualityScore: 96.0,
      activeProjects: ['PRJ-2024-001'],
      catalogsCount: 4,
      leadTimeWeeks: 2,
      notes: ''
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-300 overflow-y-auto pr-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#07B9CE1a] text-[#07B9CE] border border-[#07B9CE33] text-xs font-black uppercase tracking-wider">
              Supplier Directory
            </span>
            <span className="text-xs text-slate-400 font-semibold">• {filteredList.length} Verified Suppliers</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            Vendor Directory & Trade Partners
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Centralized master repository of qualified subcontractors, suppliers, and artisan guilds.
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
            <PlusCircle className="w-4 h-4" /> Add New Vendor
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by vendor, contact, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#07B9CE] text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 outline-none"
          >
            {categories.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>

          {/* Tier Filter */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="All">All Tiers</option>
            <option value="Tier 1 Preferred">Tier 1 Preferred</option>
            <option value="Tier 2 Approved">Tier 2 Approved</option>
            <option value="Tier 3 Provisional">Tier 3 Provisional</option>
          </select>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredList.map((vendor) => {
          const vendorPOs = purchaseOrders.filter(po => po.vendorId === vendor.id);
          const activeOrders = vendorPOs.filter(po => po.deliveryStatus !== 'Inspected & Accepted').length;

          return (
            <div
              key={vendor.id}
              onClick={() => setSelectedVendorForDetail(vendor)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:border-[#07B9CE] cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={cn(
                    "text-[10px] font-extrabold px-2 py-0.5 rounded-md",
                    vendor.tier === 'Tier 1 Preferred' ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  )}>
                    {vendor.tier}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{vendor.rating}</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-[#07B9CE] transition-colors">
                  {vendor.name}
                </h3>
                <p className="text-xs font-semibold text-[#07B9CE] mt-0.5">{vendor.category}</p>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {vendor.notes}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Contact Person:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{vendor.contactPerson}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>City / Region:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{vendor.city}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Payment Terms:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{vendor.paymentTerms}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Spend</span>
                  <strong className="text-slate-900 dark:text-white font-black">{formatCurrency(vendor.totalSpend)}</strong>
                </div>
                <div className="flex items-center gap-1.5 text-[#07B9CE] font-bold text-xs">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vendor Profile & PO History Modal/Drawer */}
      {selectedVendorForDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedVendorForDetail(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#07B9CE1a] text-[#07B9CE] flex items-center justify-center font-black text-xl">
                {selectedVendorForDetail.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {selectedVendorForDetail.name}
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-extrabold bg-[#07B9CE1a] text-[#07B9CE]">
                    {selectedVendorForDetail.companyCode}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500">{selectedVendorForDetail.category}</p>
              </div>
            </div>

            {/* Performance Bar */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Quality Score</span>
                <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{selectedVendorForDetail.qualityScore}%</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">On-Time Delivery</span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{selectedVendorForDetail.onTimeDeliveryRate}%</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead Time</span>
                <span className="text-base font-black text-slate-900 dark:text-white">{selectedVendorForDetail.leadTimeWeeks} Weeks</span>
              </div>
            </div>

            {/* Detail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">
              <div className="space-y-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="font-extrabold text-slate-900 dark:text-white block border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  Contact & Location
                </span>
                <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Users className="w-3.5 h-3.5 text-slate-400" /> {selectedVendorForDetail.contactPerson}
                </p>
                <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedVendorForDetail.email}
                </p>
                <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedVendorForDetail.phone}
                </p>
                <p className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" /> {selectedVendorForDetail.address}
                </p>
              </div>

              <div className="space-y-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="font-extrabold text-slate-900 dark:text-white block border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  Tax & Banking Details
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  <strong>Tax ID / GST:</strong> {selectedVendorForDetail.taxId}
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  <strong>Bank:</strong> {selectedVendorForDetail.bankDetails.bankName}
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  <strong>Account:</strong> {selectedVendorForDetail.bankDetails.accountNumber}
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  <strong>IFSC / Swift:</strong> {selectedVendorForDetail.bankDetails.ifscSwift}
                </p>
              </div>
            </div>

            {/* Historical POs for this Vendor */}
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2">
                Active Purchase Orders Ledger
              </h4>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {purchaseOrders.filter(po => po.vendorId === selectedVendorForDetail.id).length === 0 ? (
                  <p className="p-4 text-xs text-slate-400 italic text-center">No orders currently associated with this supplier.</p>
                ) : (
                  purchaseOrders
                    .filter(po => po.vendorId === selectedVendorForDetail.id)
                    .map(po => (
                      <div key={po.id} className="p-3 text-xs flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                        <div>
                          <span className="font-extrabold text-slate-900 dark:text-white">{po.poNumber}</span>
                          <span className="text-[10px] text-slate-400 ml-2">({po.projectName})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-slate-900 dark:text-white">{formatCurrency(po.totalAmount)}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#07B9CE1a] text-[#07B9CE]">
                            {po.deliveryStatus}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Vendor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">
              Onboard New Vendor / Supplier
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Enter supplier business details, trade category, and compliance data.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Vendor / Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Teak Mills"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#07B9CE]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Company Code</label>
                  <input
                    type="text"
                    placeholder="e.g. RTM-IND"
                    value={formData.companyCode}
                    onChange={(e) => setFormData({ ...formData, companyCode: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#07B9CE]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Trade Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  >
                    {categories.filter(c => c !== 'All').map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tier Level</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  >
                    <option value="Tier 1 Preferred">Tier 1 Preferred</option>
                    <option value="Tier 2 Approved">Tier 2 Approved</option>
                    <option value="Tier 3 Provisional">Tier 3 Provisional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="orders@vendor.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98450..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">City / Region</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tax ID / GST Number</label>
                  <input
                    type="text"
                    placeholder="29AAACA1234F1Z8"
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Specialties & Notes</label>
                <textarea
                  rows={2}
                  placeholder="Material specs, certifications, craftsmanship strengths..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                />
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
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
