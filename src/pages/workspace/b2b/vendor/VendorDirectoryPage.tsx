import React, { useState, useEffect, useMemo } from 'react';
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
  ArrowUpRight,
  BadgePercent,
  Plus,
  Zap,
  Check,
  Sparkles,
  Tag
} from 'lucide-react';
import { useVendor } from './VendorContext';
import { Vendor } from './data/mockVendorData';
import {
  getStoredVendorRateCards,
  saveVendorRateCards,
  addRateCardItemToVendor,
  updateRateCardItem,
  deleteRateCardItem,
  RateCardItem
} from './data/vendorRateCardStore';
import { VendorTradeRateCard } from '../cost/data/estimateTypes';
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
  const [detailTab, setDetailTab] = useState<'overview' | 'rate_card' | 'po_ledger'>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Rate Card State
  const [rateCards, setRateCards] = useState<VendorTradeRateCard[]>(() => getStoredVendorRateCards());
  const [isRateCardsHubOpen, setIsRateCardsHubOpen] = useState(false);
  const [hubSearch, setHubSearch] = useState('');
  const [hubFilterTrade, setHubFilterTrade] = useState('ALL');
  const [isAddRateItemModalOpen, setIsAddRateItemModalOpen] = useState(false);
  const [editingRateItemKey, setEditingRateItemKey] = useState<string | null>(null);
  const [rateFormDesc, setRateFormDesc] = useState('');
  const [rateFormKey, setRateFormKey] = useState('');
  const [rateFormUnit, setRateFormUnit] = useState<string>('Sq.ft.');
  const [rateFormStd, setRateFormStd] = useState<number>(100);
  const [rateFormPref, setRateFormPref] = useState<number>(95);
  const [rateFormRemarks, setRateFormRemarks] = useState('');
  const [rateCardToast, setRateCardToast] = useState<string | null>(null);

  // Total rate items across all vendors
  const totalRateItemsCount = useMemo(() => {
    return rateCards.reduce((sum, rc) => sum + (rc.rates?.length || 0), 0);
  }, [rateCards]);

  // Listen for rate card updates across modules
  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setRateCards(e.detail);
      } else {
        setRateCards(getStoredVendorRateCards());
      }
    };
    window.addEventListener('arqon_rate_cards_updated', handleUpdate);
    return () => window.removeEventListener('arqon_rate_cards_updated', handleUpdate);
  }, []);

  const triggerToast = (msg: string) => {
    setRateCardToast(msg);
    setTimeout(() => setRateCardToast(null), 3000);
  };

  // Helper to get active vendor's rate card
  const getVendorRateCard = (vendor: Vendor | null) => {
    if (!vendor) return null;
    return (
      rateCards.find(rc => rc.vendorId === vendor.id) ||
      rateCards.find(rc => rc.vendorName.toLowerCase() === vendor.name.toLowerCase()) ||
      rateCards.find(rc => rc.tradeCategory.toLowerCase().includes(vendor.category.toLowerCase().split(' ')[0])) ||
      null
    );
  };

  const handleOpenAddRateItem = (targetVendor?: Vendor, itemToEdit?: any) => {
    if (targetVendor) {
      setSelectedVendorForDetail(targetVendor);
    } else if (!selectedVendorForDetail && vendors.length > 0) {
      setSelectedVendorForDetail(vendors[0]);
    }

    if (itemToEdit) {
      setEditingRateItemKey(itemToEdit.itemKey);
      setRateFormKey(itemToEdit.itemKey);
      setRateFormDesc(itemToEdit.description);
      setRateFormUnit(itemToEdit.unit || 'Sq.ft.');
      setRateFormStd(itemToEdit.standardRate || 0);
      setRateFormPref(itemToEdit.preferredRate || 0);
      setRateFormRemarks(itemToEdit.specRemarks || '');
    } else {
      setEditingRateItemKey(null);
      setRateFormKey(`item_${Date.now().toString().slice(-5)}`);
      setRateFormDesc('');
      setRateFormUnit('Sq.ft.');
      setRateFormStd(150);
      setRateFormPref(135);
      setRateFormRemarks('');
    }
    setIsAddRateItemModalOpen(true);
  };

  const handleSaveRateItem = (e: React.FormEvent) => {
    e.preventDefault();
    const activeVendor = selectedVendorForDetail || (vendors.length > 0 ? vendors[0] : null);
    if (!activeVendor || !rateFormDesc) return;

    const matchedCard = getVendorRateCard(activeVendor);
    const targetVendorId = matchedCard?.vendorId || activeVendor.id;

    // Map category to trade code
    const categoryToTradeCode: Record<string, any> = {
      'Civil & Structural Materials': 'A',
      'Paint, Textures & Wall Finishes': 'B',
      'Electrical, MEP & Lighting': 'C',
      'Millwork & Custom Joinery': 'F',
      'Soft Furnishings & Drapes': 'H',
      'FF&E & Luxury Furniture': 'I',
      'Glass, Glazing & Metal Works': 'J',
      'Stone, Marble & Tiles': 'A',
      'HVAC, Automation & Smart Home': 'C'
    };

    const targetTradeCode = matchedCard?.tradeCode || categoryToTradeCode[activeVendor.category] || 'F';

    const newItem: RateCardItem = {
      itemKey: rateFormKey || `item_${Date.now().toString().slice(-5)}`,
      description: rateFormDesc,
      unit: rateFormUnit,
      standardRate: Number(rateFormStd) || 0,
      preferredRate: Number(rateFormPref) || Number(rateFormStd) || 0,
      specRemarks: rateFormRemarks
    };

    if (editingRateItemKey) {
      const updated = updateRateCardItem(targetVendorId, editingRateItemKey, newItem);
      setRateCards(updated);
      triggerToast(`✓ Updated rate card item "${newItem.description.slice(0, 25)}..." (Live synced with Cost module)`);
    } else {
      const updated = addRateCardItemToVendor(targetVendorId, newItem, {
        vendorName: activeVendor.name,
        tradeCategory: activeVendor.category,
        tradeCode: targetTradeCode
      });
      setRateCards(updated);
      triggerToast(`✓ Added rate item to ${activeVendor.name} (Live synced with Cost module)`);
    }

    setIsAddRateItemModalOpen(false);
  };

  const handleDeleteRateItem = (vendorId: string, itemKey: string) => {
    if (confirm('Are you sure you want to remove this item from the vendor rate card?')) {
      const updated = deleteRateCardItem(vendorId, itemKey);
      setRateCards(updated);
      triggerToast('✓ Rate card item removed');
    }
  };

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
            onClick={() => setIsRateCardsHubOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-black flex items-center gap-2 shadow-sm transition-all"
            title="Open Master Rate Cards Hub to view and add trade specs across all vendors"
          >
            <Tag className="w-4 h-4" />
            <span>Rate Cards Hub ({totalRateItemsCount})</span>
          </button>

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
          const matchedCard = getVendorRateCard(vendor);
          const rateCount = matchedCard?.rates?.length || 0;

          return (
            <div
              key={vendor.id}
              onClick={() => {
                setSelectedVendorForDetail(vendor);
                setDetailTab('overview');
              }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:border-[#07B9CE] cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={cn(
                      "text-[10px] font-extrabold px-2 py-0.5 rounded-md",
                      vendor.tier === 'Tier 1 Preferred' ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    )}>
                      {vendor.tier}
                    </span>
                    {rateCount > 0 ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                        {rateCount} Rate Items
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400">
                        No Rate Card
                      </span>
                    )}
                  </div>
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
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVendorForDetail(vendor);
                      setDetailTab('rate_card');
                    }}
                    className="px-2 py-1 rounded-md bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-[11px] font-black transition-colors"
                    title="View Rate Card details"
                  >
                    Rates ({rateCount})
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenAddRateItem(vendor);
                    }}
                    className="px-2 py-1 rounded-md bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-black transition-colors flex items-center gap-1 shadow-xs"
                    title="Add Rate Item directly to this vendor"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Rate</span>
                  </button>
                  <div className="flex items-center gap-0.5 text-[#07B9CE] font-bold text-xs pl-1">
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast Notification */}
      {rateCardToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-bold animate-in slide-in-from-bottom duration-200">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>{rateCardToast}</span>
        </div>
      )}

      {/* Vendor Profile & PO History Modal/Drawer */}
      {selectedVendorForDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col">
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedVendorForDetail(null)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
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

              {/* Navigation Tabs Inside Modal */}
              <div className="flex items-center gap-2 mt-5 border-b border-slate-200 dark:border-slate-800 -mb-4">
                <button
                  onClick={() => setDetailTab('overview')}
                  className={cn(
                    "px-4 py-2.5 text-xs font-black transition-all border-b-2",
                    detailTab === 'overview'
                      ? "border-[#07B9CE] text-[#07B9CE]"
                      : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  )}
                >
                  Overview & Details
                </button>
                <button
                  onClick={() => setDetailTab('rate_card')}
                  className={cn(
                    "px-4 py-2.5 text-xs font-black transition-all border-b-2 flex items-center gap-1.5",
                    detailTab === 'rate_card'
                      ? "border-orange-500 text-orange-600 dark:text-orange-400"
                      : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  )}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Trade Rate Card</span>
                  <span className="ml-1 px-1.5 py-0.2 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px]">
                    {getVendorRateCard(selectedVendorForDetail)?.rates?.length || 0}
                  </span>
                </button>
                <button
                  onClick={() => setDetailTab('po_ledger')}
                  className={cn(
                    "px-4 py-2.5 text-xs font-black transition-all border-b-2",
                    detailTab === 'po_ledger'
                      ? "border-[#07B9CE] text-[#07B9CE]"
                      : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  )}
                >
                  Purchase Orders ({purchaseOrders.filter(po => po.vendorId === selectedVendorForDetail.id).length})
                </button>
              </div>
            </div>

            {/* Modal Body with Tab Switching */}
            <div className="p-6 overflow-y-auto flex-1">
              {detailTab === 'overview' && (
                <div className="space-y-6">
                  {/* Performance Bar */}
                  <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
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
                </div>
              )}

              {/* RATE CARD TAB - ADD / VIEW / EDIT RATE ITEMS */}
              {detailTab === 'rate_card' && (
                <div className="space-y-4">
                  {/* Top Rate Card Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          Trade Rate Card & Unit Prices
                        </h4>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Live Cost Engine Sync
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Unit rates added here auto-populate in Project Estimates & BOQs when this vendor is assigned.
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenAddRateItem()}
                      className="px-3.5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all shrink-0"
                    >
                      <Plus className="w-4 h-4" /> Add Rate Item
                    </button>
                  </div>

                  {/* Rate Items Table */}
                  {(() => {
                    const matched = getVendorRateCard(selectedVendorForDetail);
                    const rates = matched?.rates || [];

                    if (rates.length === 0) {
                      return (
                        <div className="text-center py-10 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                          <BadgePercent className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
                          <h5 className="text-xs font-black text-slate-800 dark:text-slate-200">No Rate Card Items Configured</h5>
                          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                            Add standard rate line items for this contractor so design & cost estimators can automatically calculate line item values.
                          </p>
                          <button
                            onClick={() => handleOpenAddRateItem()}
                            className="mt-3 px-4 py-2 rounded-lg bg-orange-500 text-white text-xs font-bold inline-flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add First Item to Rate Card
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                            <tr>
                              <th className="p-3">Item Description / Spec</th>
                              <th className="p-3 w-20 text-center">Unit</th>
                              <th className="p-3 w-28 text-right">Standard (₹)</th>
                              <th className="p-3 w-28 text-right">Preferred (₹)</th>
                              <th className="p-3 w-20 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {rates.map((item, idx) => (
                              <tr key={item.itemKey || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="p-3">
                                  <div className="font-bold text-slate-900 dark:text-white">{item.description}</div>
                                  {item.specRemarks && (
                                    <div className="text-[11px] text-slate-400 italic mt-0.5">{item.specRemarks}</div>
                                  )}
                                  <span className="text-[10px] text-slate-400 font-mono">key: {item.itemKey}</span>
                                </td>
                                <td className="p-3 text-center">
                                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                                    {item.unit}
                                  </span>
                                </td>
                                <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                                  ₹{item.standardRate.toLocaleString('en-IN')}
                                </td>
                                <td className="p-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                                  ₹{item.preferredRate.toLocaleString('en-IN')}
                                </td>
                                <td className="p-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      onClick={() => handleOpenAddRateItem(selectedVendorForDetail || undefined, item)}
                                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                      title="Edit item rate"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteRateItem(matched!.vendorId, item.itemKey)}
                                      className="p-1 text-rose-400 hover:text-rose-600 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                      title="Delete rate item"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* PURCHASE ORDERS TAB */}
              {detailTab === 'po_ledger' && (
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
                    Active Purchase Orders Ledger
                  </h4>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                    {purchaseOrders.filter(po => po.vendorId === selectedVendorForDetail.id).length === 0 ? (
                      <p className="p-6 text-xs text-slate-400 italic text-center">No orders currently associated with this supplier.</p>
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
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal to Add / Edit Rate Card Item */}
      {isAddRateItemModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsAddRateItemModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {editingRateItemKey ? 'Edit Rate Card Item' : 'Add Item to Vendor Rate Card'}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                    Live Synced with Cost Estimates BOQs
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveRateItem} className="space-y-3.5 mt-2 text-xs">
              {/* Vendor Selection */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Vendor / Trade Contractor *
                </label>
                <select
                  value={selectedVendorForDetail?.id || (vendors[0] ? vendors[0].id : '')}
                  onChange={(e) => {
                    const found = vendors.find(v => v.id === e.target.value);
                    if (found) setSelectedVendorForDetail(found);
                  }}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white font-bold"
                >
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.category}) — {v.tier}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Item Description / Work Specification *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Providing and applying 19mm thk Marine Ply with Natural Teak Veneer"
                  value={rateFormDesc}
                  onChange={(e) => setRateFormDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Item Code / Key</label>
                  <input
                    type="text"
                    placeholder="e.g. ply_veneer_19mm"
                    value={rateFormKey}
                    onChange={(e) => setRateFormKey(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Measurement Unit</label>
                  <select
                    value={rateFormUnit}
                    onChange={(e) => setRateFormUnit(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Sq.ft.">Sq.ft. (Square Feet)</option>
                    <option value="R.ft.">R.ft. (Running Feet)</option>
                    <option value="No.">No. / Pcs</option>
                    <option value="Nos">Nos</option>
                    <option value="L/S">L/S (Lump Sum)</option>
                    <option value="Set">Set</option>
                    <option value="Mtrs">Mtrs (Meters)</option>
                    <option value="Kg">Kg</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Standard Rate (₹) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={rateFormStd}
                    onChange={(e) => setRateFormStd(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white font-black"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Preferred / Tier Rate (₹)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={rateFormPref}
                    onChange={(e) => setRateFormPref(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-emerald-600 dark:text-emerald-400 font-black"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Spec Remarks / Brand Standard
                </label>
                <input
                  type="text"
                  placeholder="e.g. Includes Century marine ply + 4mm natural teak finish"
                  value={rateFormRemarks}
                  onChange={(e) => setRateFormRemarks(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddRateItemModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-black shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingRateItemKey ? 'Update Item Rate' : 'Save Item to Rate Card'}</span>
                </button>
              </div>
            </form>
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

      {/* Trade Rate Cards Hub Modal */}
      {isRateCardsHubOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      Trade Rate Cards Hub (Master Library)
                    </h2>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Live Cost Engine Sync
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Unified repository of negotiated trade rates across all subcontracting guilds and material vendors. Automatically linked with Cost Estimates & BOQs.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleOpenAddRateItem();
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Rate Item
                </button>
                <button
                  onClick={() => setIsRateCardsHubOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search item specs, codes, or vendors..."
                  value={hubSearch}
                  onChange={(e) => setHubSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
                {['ALL', 'A', 'B', 'C', 'F', 'H', 'I', 'J'].map((trade) => {
                  const labelMap: Record<string, string> = {
                    ALL: 'All Trades',
                    A: 'Civil (A)',
                    B: 'Finishes (B)',
                    C: 'MEP (C)',
                    F: 'Joinery (F)',
                    H: 'Drapes (H)',
                    I: 'FF&E (I)',
                    J: 'Glazing (J)'
                  };
                  const active = hubFilterTrade === trade;
                  return (
                    <button
                      key={trade}
                      onClick={() => setHubFilterTrade(trade)}
                      className={`px-2.5 py-1 rounded-md font-bold whitespace-nowrap text-[11px] transition-all ${
                        active
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {labelMap[trade] || trade}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hub Rate Cards List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/40 dark:bg-slate-950/40">
              {(() => {
                const filteredCards = rateCards.filter(card => {
                  if (hubFilterTrade !== 'ALL' && card.tradeCode !== hubFilterTrade) return false;
                  if (!hubSearch.trim()) return true;
                  const q = hubSearch.toLowerCase();
                  const vendorMatch = card.vendorName.toLowerCase().includes(q) || card.tradeCategory.toLowerCase().includes(q);
                  const rateMatch = card.rates.some(r =>
                    r.description.toLowerCase().includes(q) ||
                    r.itemKey.toLowerCase().includes(q) ||
                    (r.specRemarks && r.specRemarks.toLowerCase().includes(q))
                  );
                  return vendorMatch || rateMatch;
                });

                if (filteredCards.length === 0) {
                  return (
                    <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                      <Tag className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No matching rate cards found</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        Try adjusting your search query or trade filter, or add a new rate item directly.
                      </p>
                      <button
                        onClick={() => handleOpenAddRateItem()}
                        className="mt-4 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-black inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-4 h-4" /> Add New Rate Item
                      </button>
                    </div>
                  );
                }

                return filteredCards.map(card => {
                  const matchingRates = hubSearch.trim()
                    ? card.rates.filter(r =>
                        r.description.toLowerCase().includes(hubSearch.toLowerCase()) ||
                        r.itemKey.toLowerCase().includes(hubSearch.toLowerCase()) ||
                        (r.specRemarks && r.specRemarks.toLowerCase().includes(hubSearch.toLowerCase()))
                      )
                    : card.rates;

                  const vendorObj = vendors.find(v => v.id === card.vendorId) || null;

                  return (
                    <div
                      key={card.vendorId}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs"
                    >
                      {/* Vendor Header */}
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 font-black text-xs flex items-center justify-center">
                            {card.tradeCode}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">
                                {card.vendorName}
                              </h3>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                                {card.tradeCategory}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {card.rates.length} active rates • Trade Code: {card.tradeCode}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (vendorObj) {
                              handleOpenAddRateItem(vendorObj);
                            } else {
                              handleOpenAddRateItem();
                            }
                          }}
                          className="px-2.5 py-1 rounded-md bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-black flex items-center gap-1 shadow-xs transition-all"
                        >
                          <Plus className="w-3 h-3" /> Add Item to {card.vendorName}
                        </button>
                      </div>

                      {/* Items Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 text-[11px] uppercase font-bold border-b border-slate-100 dark:border-slate-800">
                            <tr>
                              <th className="p-3">Specification & Key</th>
                              <th className="p-3 w-20 text-center">Unit</th>
                              <th className="p-3 w-28 text-right">Standard Rate</th>
                              <th className="p-3 w-28 text-right">Preferred Rate</th>
                              <th className="p-3 w-24 text-right">Savings</th>
                              <th className="p-3 w-20 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {matchingRates.map((item) => {
                              const savings = Math.max(0, item.standardRate - item.preferredRate);
                              const savingsPct = item.standardRate > 0 ? Math.round((savings / item.standardRate) * 100) : 0;

                              return (
                                <tr key={item.itemKey} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                  <td className="p-3">
                                    <div className="font-bold text-slate-900 dark:text-white">
                                      {item.description}
                                    </div>
                                    {item.specRemarks && (
                                      <div className="text-[11px] text-slate-400 italic mt-0.5">
                                        {item.specRemarks}
                                      </div>
                                    )}
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      {item.itemKey}
                                    </span>
                                  </td>
                                  <td className="p-3 text-center">
                                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                                      {item.unit}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                                    ₹{item.standardRate.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                                    ₹{item.preferredRate.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3 text-right">
                                    {savings > 0 ? (
                                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                        -₹{savings} ({savingsPct}%)
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-slate-400">—</span>
                                    )}
                                  </td>
                                  <td className="p-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      <button
                                        onClick={() => {
                                          if (vendorObj) setSelectedVendorForDetail(vendorObj);
                                          handleOpenAddRateItem(vendorObj || undefined, item);
                                        }}
                                        className="p-1 rounded text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors"
                                        title="Edit item rate"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteRateItem(card.vendorId, item.itemKey)}
                                        className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                        title="Delete item rate"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Hub Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {totalRateItemsCount} Total Negotiated Line Items
                </span>
                <span>•</span>
                <span>Bidirectionally Synced with Cost Estimates</span>
              </div>
              <button
                onClick={() => setIsRateCardsHubOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
