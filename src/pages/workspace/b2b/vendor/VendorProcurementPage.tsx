import React, { useState } from 'react';
import {
  ShoppingCart,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
  Building2,
  DollarSign,
  FileText,
  Layers,
  Sparkles,
  Eye,
  X,
  Plus,
  Trash2,
  ArrowRight,
  ExternalLink,
  ClipboardCheck,
  Award
} from 'lucide-react';
import { useVendor } from './VendorContext';
import { PurchaseOrder, POLineItem, RFQ } from './data/mockVendorData';
import { cn } from '../../../../lib/utils';

export function VendorProcurementPage() {
  const {
    purchaseOrders,
    filteredPurchaseOrders,
    vendors,
    rfqs,
    filteredRFQs,
    selectedProjectId,
    setSelectedProjectId,
    projects,
    createPurchaseOrder,
    updatePurchaseOrderStatus,
    recordPOPayment,
    createRFQ,
    submitRFQBid,
    awardRFQ
  } = useVendor();

  const [activeTab, setActiveTab] = useState<'pos' | 'rfqs' | 'qa'>('pos');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPOForDetail, setSelectedPOForDetail] = useState<PurchaseOrder | null>(null);

  // New PO Modal State
  const [isNewPOModalOpen, setIsNewPOModalOpen] = useState(false);
  const [poFormProjectId, setPoFormProjectId] = useState(projects[0]?.id || 'PRJ-2024-001');
  const [poFormVendorId, setPoFormVendorId] = useState(vendors[0]?.id || 'VND-001');
  const [poExpectedDate, setPoExpectedDate] = useState('2024-03-20');
  const [poShippingAddress, setPoShippingAddress] = useState('Project Site Delivery Desk, Whitefield, Bengaluru');
  const [poLineItems, setPoLineItems] = useState<POLineItem[]>([
    {
      id: 'LI-TEMP-1',
      itemDescription: 'Custom Fluted Paneling & Concealed Hardware',
      specification: 'Grade A Natural Teak / Walnut veneer with PU seal',
      quantity: 120,
      unit: 'Sq.Ft',
      unitRate: 1100,
      totalAmount: 132000,
      studioSpaceRef: 'Master Bedroom',
      studioDrawingRef: 'DWG-MBR-014',
      inspectionStatus: 'Pending Inspection'
    }
  ]);

  // Payment Recording Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentTargetPO, setPaymentTargetPO] = useState<PurchaseOrder | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // New RFQ Modal State
  const [isNewRFQModalOpen, setIsNewRFQModalOpen] = useState(false);
  const [rfqTitle, setRfqTitle] = useState('');
  const [rfqCategory, setRfqCategory] = useState('FF&E & Luxury Furniture');
  const [rfqDeadline, setRfqDeadline] = useState('2024-03-15');
  const [rfqBudget, setRfqBudget] = useState(500000);
  const [rfqSpecs, setRfqSpecs] = useState('');
  const [rfqSelectedProjectId, setRfqSelectedProjectId] = useState(projects[0]?.id || 'PRJ-2024-001');

  // Currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Add line item to draft PO
  const handleAddLineItem = () => {
    const newItem: POLineItem = {
      id: `LI-TEMP-${poLineItems.length + 1}`,
      itemDescription: '',
      specification: '',
      quantity: 1,
      unit: 'Sq.Ft',
      unitRate: 0,
      totalAmount: 0,
      studioSpaceRef: 'Living Room',
      studioDrawingRef: 'DWG-GEN-001',
      inspectionStatus: 'Pending Inspection'
    };
    setPoLineItems([...poLineItems, newItem]);
  };

  const handleUpdateLineItem = (index: number, field: keyof POLineItem, value: any) => {
    const updated = [...poLineItems];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitRate') {
      const q = field === 'quantity' ? Number(value) : updated[index].quantity;
      const r = field === 'unitRate' ? Number(value) : updated[index].unitRate;
      updated[index].totalAmount = (q || 0) * (r || 0);
    }
    setPoLineItems(updated);
  };

  const handleRemoveLineItem = (index: number) => {
    if (poLineItems.length <= 1) return;
    setPoLineItems(poLineItems.filter((_, i) => i !== index));
  };

  const handleCreatePOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProj = projects.find(p => p.id === poFormProjectId);
    const targetVendor = vendors.find(v => v.id === poFormVendorId);
    if (!targetProj || !targetVendor) return;

    const subtotal = poLineItems.reduce((sum, item) => sum + item.totalAmount, 0);
    const taxAmount = Math.round(subtotal * 0.18);
    const totalAmount = subtotal + taxAmount;

    createPurchaseOrder({
      projectId: targetProj.id,
      projectName: targetProj.name,
      projectCode: targetProj.code,
      vendorId: targetVendor.id,
      vendorName: targetVendor.name,
      vendorCategory: targetVendor.category,
      issueDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: poExpectedDate,
      lineItems: poLineItems,
      subtotal,
      taxRatePercentage: 18,
      taxAmount,
      totalAmount,
      paidAmount: 0,
      paymentStatus: 'Unpaid',
      deliveryStatus: 'Issued',
      shippingAddress: poShippingAddress,
      siteSupervisorContact: 'Assigned Site Lead (+91 98450 77123)',
      procurementOfficer: 'Rohit Deshmukh',
      terms: 'Standard Studio QA validation upon arrival. Net 30 payment release.',
      notes: 'Generated via ArqonOS Procurement Engine.'
    });

    setIsNewPOModalOpen(false);
  };

  const handleCreateRFQSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProj = projects.find(p => p.id === rfqSelectedProjectId);
    if (!targetProj || !rfqTitle) return;

    createRFQ({
      projectId: targetProj.id,
      projectName: targetProj.name,
      projectCode: targetProj.code,
      title: rfqTitle,
      category: rfqCategory,
      createdDate: new Date().toISOString().split('T')[0],
      deadlineDate: rfqDeadline,
      status: 'Open for Bids',
      targetDeliveryDate: '2024-03-30',
      specifications: rfqSpecs || 'Must comply strictly with Studio finishes.',
      estimatedBudget: rfqBudget,
      items: [
        {
          description: rfqTitle,
          quantity: 1,
          unit: 'Sets',
          targetSpec: rfqSpecs || 'Architectural grade'
        }
      ],
      invitedVendors: vendors.slice(0, 3).map(v => v.id)
    });

    setIsNewRFQModalOpen(false);
    setRfqTitle('');
    setRfqSpecs('');
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentTargetPO || paymentAmount <= 0) return;
    recordPOPayment(paymentTargetPO.id, paymentAmount);
    setIsPaymentModalOpen(false);
    setPaymentTargetPO(null);
    setPaymentAmount(0);
  };

  // Filtered PO list
  const filteredPOList = filteredPurchaseOrders.filter(po => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.projectName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || po.deliveryStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-300 overflow-y-auto pr-1">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#07B9CE1a] text-[#07B9CE] border border-[#07B9CE33] text-xs font-black uppercase tracking-wider">
              Procurement & Purchase Orders
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Direct Studio & Cost Sync</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            Procurement Management
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Issue purchase orders, evaluate competitive RFQ bids, and inspect site deliveries.
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

          {activeTab === 'pos' ? (
            <button
              onClick={() => setIsNewPOModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-[#07B9CE] hover:bg-[#07B9CE]/90 text-white text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Create Purchase Order
            </button>
          ) : activeTab === 'rfqs' ? (
            <button
              onClick={() => setIsNewRFQModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-[#07B9CE] hover:bg-[#07B9CE]/90 text-white text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Issue New RFQ
            </button>
          ) : null}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('pos')}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
            activeTab === 'pos'
              ? 'bg-[#07B9CE] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Purchase Orders ({filteredPurchaseOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('rfqs')}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
            activeTab === 'rfqs'
              ? 'bg-[#07B9CE] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          <Award className="w-3.5 h-3.5" />
          RFQ Bidding Engine ({filteredRFQs.length})
        </button>

        <button
          onClick={() => setActiveTab('qa')}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
            activeTab === 'qa'
              ? 'bg-[#07B9CE] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          <ClipboardCheck className="w-3.5 h-3.5" />
          Goods Receipt & QA Inspections
        </button>
      </div>

      {/* TAB 1: PURCHASE ORDERS */}
      {activeTab === 'pos' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search PO #, vendor, project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#07B9CE] text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Issued">Issued</option>
                <option value="In Production">In Production</option>
                <option value="In Transit">In Transit</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Inspected & Accepted">Inspected & Accepted</option>
              </select>
            </div>
          </div>

          {/* PO Table / Cards */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="p-3.5">PO Number</th>
                    <th className="p-3.5">Project</th>
                    <th className="p-3.5">Vendor</th>
                    <th className="p-3.5">Expected Delivery</th>
                    <th className="p-3.5">Delivery Status</th>
                    <th className="p-3.5">Total Amount</th>
                    <th className="p-3.5">Payment</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPOList.map((po) => (
                    <tr
                      key={po.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-3.5 font-extrabold text-slate-900 dark:text-white">
                        {po.poNumber}
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{po.projectCode}</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[140px] block">{po.projectName}</span>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">
                        {po.vendorName}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400 font-medium">
                        {po.expectedDeliveryDate}
                      </td>
                      <td className="p-3.5">
                        <select
                          value={po.deliveryStatus}
                          onChange={(e) => updatePurchaseOrderStatus(po.id, e.target.value as any)}
                          className={cn(
                            "text-[10px] font-extrabold px-2 py-1 rounded-md border-none outline-none cursor-pointer",
                            po.deliveryStatus === 'Inspected & Accepted' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                            po.deliveryStatus === 'In Transit' || po.deliveryStatus === 'Dispatched' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                            'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300'
                          )}
                        >
                          <option value="Draft">Draft</option>
                          <option value="Issued">Issued</option>
                          <option value="In Production">In Production</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Inspected & Accepted">Inspected & Accepted</option>
                          <option value="Disputed / Damaged">Disputed / Damaged</option>
                        </select>
                      </td>
                      <td className="p-3.5 font-black text-slate-900 dark:text-white">
                        {formatCurrency(po.totalAmount)}
                      </td>
                      <td className="p-3.5">
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-md inline-block",
                          po.paymentStatus === 'Paid' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' :
                          po.paymentStatus === 'Partially Paid' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        )}>
                          {po.paymentStatus} ({Math.round((po.paidAmount / (po.totalAmount || 1)) * 100)}%)
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setPaymentTargetPO(po);
                            setPaymentAmount(po.totalAmount - po.paidAmount);
                            setIsPaymentModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-[#07B9CE] hover:text-white font-bold text-[11px] transition-colors"
                        >
                          Record Pay
                        </button>
                        <button
                          onClick={() => setSelectedPOForDetail(po)}
                          className="px-2.5 py-1 rounded bg-[#07B9CE1a] text-[#07B9CE] font-bold text-[11px] hover:bg-[#07B9CE] hover:text-white transition-colors"
                        >
                          View Items
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

      {/* TAB 2: RFQ BIDDING MATRIX */}
      {activeTab === 'rfqs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRFQs.map((rfq) => (
              <div
                key={rfq.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#07B9CE1a] text-[#07B9CE]">
                      {rfq.rfqNumber}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                      {rfq.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">{rfq.projectName} • {rfq.category}</p>
                  </div>
                  <span className={cn(
                    "text-[10px] font-extrabold px-2.5 py-1 rounded-md",
                    rfq.status === 'Awarded & Converted to PO' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                    'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  )}>
                    {rfq.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-1">
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Specifications:</strong> {rfq.specifications}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Target Budget:</strong> {formatCurrency(rfq.estimatedBudget)} • <strong>Deadline:</strong> {rfq.deadlineDate}
                  </p>
                </div>

                {/* Bids Comparison Matrix */}
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2">
                    Received Vendor Quotes ({rfq.bids.length})
                  </h4>
                  {rfq.bids.length === 0 ? (
                    <div className="p-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-center text-xs text-slate-400">
                      Bidding in progress. Awaiting vendor submissions.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {rfq.bids.map((bid, bIdx) => (
                        <div
                          key={bIdx}
                          className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs bg-white dark:bg-slate-900"
                        >
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{bid.vendorName}</span>
                            <span className="text-[11px] text-slate-400">Lead time: {bid.leadTimeDays} days • {bid.remarks}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-black text-slate-900 dark:text-white text-sm">{formatCurrency(bid.bidAmount)}</span>
                            {rfq.status !== 'Awarded & Converted to PO' ? (
                              <button
                                onClick={() => awardRFQ(rfq.id, bid.vendorId)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                              >
                                Award & PO <ArrowRight className="w-3 h-3" />
                              </button>
                            ) : bid.status === 'Awarded' ? (
                              <span className="text-xs font-black text-emerald-600">✓ Awarded</span>
                            ) : (
                              <span className="text-xs font-semibold text-slate-400">Declined</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GOODS RECEIPT & QA INSPECTIONS */}
      {activeTab === 'qa' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-[#07B9CE]" /> Site Quality Assurance & Material Verification Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Site Supervisors verify delivered items against Studio drawing specifications before certifying payment release.
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredPurchaseOrders.flatMap(po => po.lineItems.map(item => ({ ...item, poNumber: po.poNumber, vendorName: po.vendorName, projectName: po.projectName }))).map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white">{item.itemDescription}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#07B9CE1a] text-[#07B9CE] rounded">
                      {item.studioSpaceRef} ({item.studioDrawingRef})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Vendor: {item.vendorName} • Project: {item.projectName} • Spec: {item.specification}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {item.quantity} {item.unit} ({formatCurrency(item.totalAmount)})
                  </span>
                  <span className={cn(
                    "text-[10px] font-extrabold px-2.5 py-1 rounded-md",
                    item.inspectionStatus === 'Passed QC' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  )}>
                    {item.inspectionStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PO Detail Modal (Line Items View) */}
      {selectedPOForDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedPOForDetail(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black px-2 py-0.5 rounded bg-[#07B9CE1a] text-[#07B9CE]">
                {selectedPOForDetail.poNumber}
              </span>
              <span className="text-xs font-semibold text-slate-400">({selectedPOForDetail.projectCode})</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Purchase Order Specification Ledger
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Vendor: <strong>{selectedPOForDetail.vendorName}</strong> • Delivery: {selectedPOForDetail.shippingAddress}
            </p>

            <div className="space-y-3 mb-6">
              <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Line Items (BOQ Matched)</h4>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {selectedPOForDetail.lineItems.map((li, i) => (
                  <div key={i} className="p-3.5 text-xs bg-slate-50/50 dark:bg-slate-800/30 flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white">{li.itemDescription}</span>
                        {li.studioSpaceRef && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-bold rounded">
                            {li.studioSpaceRef}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{li.specification}</p>
                      <p className="text-[10px] text-slate-400">Drawing Ref: {li.studioDrawingRef || 'Standard Spec'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-slate-900 dark:text-white text-xs block">
                        {formatCurrency(li.totalAmount)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {li.quantity} {li.unit} @ {formatCurrency(li.unitRate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl text-xs space-y-1.5 mb-6">
              <div className="flex items-center justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>{formatCurrency(selectedPOForDetail.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>GST / Taxes (18%):</span>
                <span>{formatCurrency(selectedPOForDetail.taxAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-900 dark:text-white font-extrabold text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Total Contracted Amount:</span>
                <span className="text-[#07B9CE]">{formatCurrency(selectedPOForDetail.totalAmount)}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedPOForDetail(null)}
                className="px-5 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow-sm"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isPaymentModalOpen && paymentTargetPO && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">
              Record Supplier Payment
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              PO: <strong>{paymentTargetPO.poNumber}</strong> ({paymentTargetPO.vendorName})
            </p>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Total Amount:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(paymentTargetPO.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Already Paid:</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(paymentTargetPO.paidAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Balance Due:</span>
                  <span className="font-bold text-amber-600">{formatCurrency(paymentTargetPO.totalAmount - paymentTargetPO.paidAmount)}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Payment Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={paymentTargetPO.totalAmount - paymentTargetPO.paidAmount}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#07B9CE] font-bold text-sm"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-extrabold text-white shadow-sm"
                >
                  Confirm & Sync with Cost
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Purchase Order Modal */}
      {isNewPOModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsNewPOModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">
              Create New Purchase Order
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Issue binding material purchase order mapped directly to Studio space designs.
            </p>

            <form onSubmit={handleCreatePOSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Project *</label>
                  <select
                    value={poFormProjectId}
                    onChange={(e) => setPoFormProjectId(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-bold"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Supplier *</label>
                  <select
                    value={poFormVendorId}
                    onChange={(e) => setPoFormVendorId(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-bold"
                  >
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.category})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Expected Site Arrival Date</label>
                  <input
                    type="date"
                    value={poExpectedDate}
                    onChange={(e) => setPoExpectedDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Site Delivery Address</label>
                  <input
                    type="text"
                    value={poShippingAddress}
                    onChange={(e) => setPoShippingAddress(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* Line Items Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Purchase Order Line Items</label>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="text-xs font-bold text-[#07B9CE] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {poLineItems.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Item Description *"
                          value={item.itemDescription}
                          onChange={(e) => handleUpdateLineItem(idx, 'itemDescription', e.target.value)}
                          className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded outline-none font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Specification / Finish"
                          value={item.specification}
                          onChange={(e) => handleUpdateLineItem(idx, 'specification', e.target.value)}
                          className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-4 gap-2 items-center">
                        <input
                          type="number"
                          placeholder="Qty"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => handleUpdateLineItem(idx, 'quantity', e.target.value)}
                          className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded outline-none"
                        />
                        <select
                          value={item.unit}
                          onChange={(e) => handleUpdateLineItem(idx, 'unit', e.target.value)}
                          className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded outline-none"
                        >
                          <option value="Sq.Ft">Sq.Ft</option>
                          <option value="R.Ft">R.Ft</option>
                          <option value="Pcs">Pcs</option>
                          <option value="Sets">Sets</option>
                          <option value="Mtrs">Mtrs</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Rate (₹)"
                          min={0}
                          value={item.unitRate}
                          onChange={(e) => handleUpdateLineItem(idx, 'unitRate', e.target.value)}
                          className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded outline-none"
                        />
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900 dark:text-white">
                            {formatCurrency(item.totalAmount)}
                          </span>
                          {poLineItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveLineItem(idx)}
                              className="text-rose-500 hover:text-rose-700 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewPOModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#07B9CE] hover:bg-[#07B9CE]/90 font-extrabold text-white shadow-sm"
                >
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create RFQ Modal */}
      {isNewRFQModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsNewRFQModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">
              Issue Request for Quotation (RFQ)
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Collect competitive pricing quotes from invited suppliers.
            </p>

            <form onSubmit={handleCreateRFQSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Project Scope</label>
                <select
                  value={rfqSelectedProjectId}
                  onChange={(e) => setRfqSelectedProjectId(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-bold"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">RFQ Title / Scope *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bespoke Velvet Curtains & Motorized Tracks"
                  value={rfqTitle}
                  onChange={(e) => setRfqTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Estimated Budget (₹)</label>
                  <input
                    type="number"
                    value={rfqBudget}
                    onChange={(e) => setRfqBudget(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Bid Deadline</label>
                  <input
                    type="date"
                    value={rfqDeadline}
                    onChange={(e) => setRfqDeadline(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Specifications</label>
                <textarea
                  rows={2}
                  placeholder="Material specs, tolerances, fabric codes..."
                  value={rfqSpecs}
                  onChange={(e) => setRfqSpecs(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewRFQModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#07B9CE] hover:bg-[#07B9CE]/90 font-extrabold text-white shadow-sm"
                >
                  Issue to Suppliers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
