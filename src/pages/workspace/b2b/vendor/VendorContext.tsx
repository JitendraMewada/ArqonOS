import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  Vendor,
  PurchaseOrder,
  RFQ,
  VendorContract,
  DeliveryShipment,
  initialVendors,
  initialPurchaseOrders,
  initialRFQs,
  initialVendorContracts,
  initialShipments,
  projectReferences,
  POLineItem
} from './data/mockVendorData';

interface VendorContextType {
  // Data lists
  vendors: Vendor[];
  purchaseOrders: PurchaseOrder[];
  rfqs: RFQ[];
  contracts: VendorContract[];
  shipments: DeliveryShipment[];
  projects: typeof projectReferences;

  // Project Filtering
  selectedProjectId: string; // 'all' or project ID (e.g. 'PRJ-2024-001')
  setSelectedProjectId: (id: string) => void;
  filteredProjects: typeof projectReferences;
  filteredVendors: Vendor[];
  filteredPurchaseOrders: PurchaseOrder[];
  filteredRFQs: RFQ[];
  filteredContracts: VendorContract[];
  filteredShipments: DeliveryShipment[];

  // Computed KPIs & Aggregates
  totalProcurementSpend: number;
  totalCommittedPOValue: number;
  totalPaidAmount: number;
  totalPendingPayment: number;
  activeVendorsCount: number;
  pendingPOsCount: number;
  inTransitShipmentsCount: number;
  expiringContractsCount: number;
  averageQualityScore: number;
  averageOnTimeDeliveryRate: number;
  categorySpendBreakdown: { category: string; spend: number; percentage: number; count: number }[];
  projectSpendBreakdown: { projectId: string; projectCode: string; projectName: string; spend: number; poCount: number }[];

  // Actions
  addVendor: (vendor: Omit<Vendor, 'id' | 'totalSpend' | 'activeOrdersCount'>) => void;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;

  createPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'costSynced'>) => void;
  updatePurchaseOrderStatus: (poId: string, deliveryStatus: PurchaseOrder['deliveryStatus'], paymentStatus?: PurchaseOrder['paymentStatus']) => void;
  recordPOPayment: (poId: string, amount: number) => void;

  createRFQ: (rfq: Omit<RFQ, 'id' | 'rfqNumber' | 'bids'>) => void;
  submitRFQBid: (rfqId: string, bid: { vendorId: string; vendorName: string; bidAmount: number; leadTimeDays: number; remarks: string }) => void;
  awardRFQ: (rfqId: string, vendorId: string) => void;

  addContract: (contract: Omit<VendorContract, 'id' | 'contractNumber'>) => void;
  updateContractStatus: (contractId: string, status: VendorContract['status']) => void;

  updateShipmentStatus: (shipmentId: string, status: DeliveryShipment['status'], location: string, note?: string) => void;
  
  // Cross-engine sync status
  isCostEngineSynced: boolean;
  isStudioEngineSynced: boolean;
  syncAllEngines: () => void;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export const VendorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [rfqs, setRfqs] = useState<RFQ[]>(initialRFQs);
  const [contracts, setContracts] = useState<VendorContract[]>(initialVendorContracts);
  const [shipments, setShipments] = useState<DeliveryShipment[]>(initialShipments);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [isCostEngineSynced, setIsCostEngineSynced] = useState<boolean>(true);
  const [isStudioEngineSynced, setIsStudioEngineSynced] = useState<boolean>(true);

  // Filtered lists based on selected project
  const filteredProjects = useMemo(() => {
    if (selectedProjectId === 'all') return projectReferences;
    return projectReferences.filter(p => p.id === selectedProjectId);
  }, [selectedProjectId]);

  const filteredPurchaseOrders = useMemo(() => {
    if (selectedProjectId === 'all') return purchaseOrders;
    return purchaseOrders.filter(po => po.projectId === selectedProjectId);
  }, [purchaseOrders, selectedProjectId]);

  const filteredRFQs = useMemo(() => {
    if (selectedProjectId === 'all') return rfqs;
    return rfqs.filter(r => r.projectId === selectedProjectId);
  }, [rfqs, selectedProjectId]);

  const filteredContracts = useMemo(() => {
    if (selectedProjectId === 'all') return contracts;
    return contracts.filter(c => !c.projectId || c.projectId === selectedProjectId);
  }, [contracts, selectedProjectId]);

  const filteredShipments = useMemo(() => {
    if (selectedProjectId === 'all') return shipments;
    const targetProject = projectReferences.find(p => p.id === selectedProjectId);
    if (!targetProject) return shipments;
    return shipments.filter(s => s.projectCode === targetProject.code);
  }, [shipments, selectedProjectId]);

  const filteredVendors = useMemo(() => {
    if (selectedProjectId === 'all') return vendors;
    const targetProject = projectReferences.find(p => p.id === selectedProjectId);
    if (!targetProject) return vendors;
    // Return vendors active in this project or have POs in this project
    const projectPOVendorIds = new Set(filteredPurchaseOrders.map(po => po.vendorId));
    return vendors.filter(v => v.activeProjects.includes(targetProject.id) || projectPOVendorIds.has(v.id));
  }, [vendors, selectedProjectId, filteredPurchaseOrders]);

  // Aggregated KPIs
  const totalCommittedPOValue = useMemo(() => {
    return filteredPurchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);
  }, [filteredPurchaseOrders]);

  const totalPaidAmount = useMemo(() => {
    return filteredPurchaseOrders.reduce((sum, po) => sum + po.paidAmount, 0);
  }, [filteredPurchaseOrders]);

  const totalPendingPayment = useMemo(() => {
    return totalCommittedPOValue - totalPaidAmount;
  }, [totalCommittedPOValue, totalPaidAmount]);

  const totalProcurementSpend = useMemo(() => {
    if (selectedProjectId === 'all') {
      return vendors.reduce((sum, v) => sum + v.totalSpend, 0);
    }
    return totalCommittedPOValue;
  }, [vendors, selectedProjectId, totalCommittedPOValue]);

  const activeVendorsCount = useMemo(() => {
    return filteredVendors.length;
  }, [filteredVendors]);

  const pendingPOsCount = useMemo(() => {
    return filteredPurchaseOrders.filter(po => 
      po.deliveryStatus !== 'Inspected & Accepted' && po.deliveryStatus !== 'Draft'
    ).length;
  }, [filteredPurchaseOrders]);

  const inTransitShipmentsCount = useMemo(() => {
    return filteredShipments.filter(s => s.status === 'In Transit' || s.status === 'Out for Site Delivery').length;
  }, [filteredShipments]);

  const expiringContractsCount = useMemo(() => {
    return filteredContracts.filter(c => c.status === 'Expiring Soon').length;
  }, [filteredContracts]);

  const averageQualityScore = useMemo(() => {
    if (filteredVendors.length === 0) return 0;
    const total = filteredVendors.reduce((sum, v) => sum + v.qualityScore, 0);
    return Math.round((total / filteredVendors.length) * 10) / 10;
  }, [filteredVendors]);

  const averageOnTimeDeliveryRate = useMemo(() => {
    if (filteredVendors.length === 0) return 0;
    const total = filteredVendors.reduce((sum, v) => sum + v.onTimeDeliveryRate, 0);
    return Math.round((total / filteredVendors.length) * 10) / 10;
  }, [filteredVendors]);

  const categorySpendBreakdown = useMemo(() => {
    const map = new Map<string, { spend: number; count: number }>();
    filteredPurchaseOrders.forEach(po => {
      const cat = po.vendorCategory || 'General Supply';
      const existing = map.get(cat) || { spend: 0, count: 0 };
      map.set(cat, {
        spend: existing.spend + po.totalAmount,
        count: existing.count + 1
      });
    });

    const total = Array.from(map.values()).reduce((sum, item) => sum + item.spend, 0) || 1;
    return Array.from(map.entries()).map(([category, data]) => ({
      category,
      spend: data.spend,
      percentage: Math.round((data.spend / total) * 100),
      count: data.count
    })).sort((a, b) => b.spend - a.spend);
  }, [filteredPurchaseOrders]);

  const projectSpendBreakdown = useMemo(() => {
    return projectReferences.map(proj => {
      const projPOs = purchaseOrders.filter(po => po.projectId === proj.id);
      const spend = projPOs.reduce((sum, po) => sum + po.totalAmount, 0);
      return {
        projectId: proj.id,
        projectCode: proj.code,
        projectName: proj.name,
        spend,
        poCount: projPOs.length
      };
    });
  }, [purchaseOrders]);

  // Actions
  const addVendor = (vendorData: Omit<Vendor, 'id' | 'totalSpend' | 'activeOrdersCount'>) => {
    const newId = `VND-${String(vendors.length + 1).padStart(3, '0')}`;
    const newVendor: Vendor = {
      ...vendorData,
      id: newId,
      totalSpend: 0,
      activeOrdersCount: 0
    };
    setVendors(prev => [newVendor, ...prev]);
  };

  const updateVendor = (id: string, updates: Partial<Vendor>) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const deleteVendor = (id: string) => {
    setVendors(prev => prev.filter(v => v.id !== id));
  };

  const createPurchaseOrder = (poData: Omit<PurchaseOrder, 'id' | 'poNumber' | 'costSynced'>) => {
    const newCount = purchaseOrders.length + 1;
    const poNum = `PO-2024-${String(80 + newCount).padStart(3, '0')}`;
    const newPO: PurchaseOrder = {
      ...poData,
      id: poNum,
      poNumber: poNum,
      costSynced: true
    };
    setPurchaseOrders(prev => [newPO, ...prev]);

    // Update vendor spend & active orders count
    setVendors(prev => prev.map(v => {
      if (v.id === poData.vendorId) {
        return {
          ...v,
          totalSpend: v.totalSpend + poData.totalAmount,
          activeOrdersCount: v.activeOrdersCount + 1
        };
      }
      return v;
    }));
  };

  const updatePurchaseOrderStatus = (
    poId: string,
    deliveryStatus: PurchaseOrder['deliveryStatus'],
    paymentStatus?: PurchaseOrder['paymentStatus']
  ) => {
    setPurchaseOrders(prev => prev.map(po => {
      if (po.id === poId) {
        return {
          ...po,
          deliveryStatus,
          paymentStatus: paymentStatus || po.paymentStatus,
          actualDeliveryDate: deliveryStatus === 'Delivered' || deliveryStatus === 'Inspected & Accepted' 
            ? new Date().toISOString().split('T')[0] 
            : po.actualDeliveryDate
        };
      }
      return po;
    }));
  };

  const recordPOPayment = (poId: string, amount: number) => {
    setPurchaseOrders(prev => prev.map(po => {
      if (po.id === poId) {
        const newPaid = Math.min(po.totalAmount, po.paidAmount + amount);
        const newStatus: PurchaseOrder['paymentStatus'] = 
          newPaid >= po.totalAmount ? 'Paid' : newPaid > 0 ? 'Partially Paid' : 'Unpaid';
        return {
          ...po,
          paidAmount: newPaid,
          paymentStatus: newStatus
        };
      }
      return po;
    }));
  };

  const createRFQ = (rfqData: Omit<RFQ, 'id' | 'rfqNumber' | 'bids'>) => {
    const newCount = rfqs.length + 1;
    const rfqNum = `RFQ-2024-${String(20 + newCount).padStart(3, '0')}`;
    const newRFQ: RFQ = {
      ...rfqData,
      id: rfqNum,
      rfqNumber: rfqNum,
      bids: []
    };
    setRfqs(prev => [newRFQ, ...prev]);
  };

  const submitRFQBid = (
    rfqId: string,
    bid: { vendorId: string; vendorName: string; bidAmount: number; leadTimeDays: number; remarks: string }
  ) => {
    setRfqs(prev => prev.map(r => {
      if (r.id === rfqId) {
        const newBid = {
          ...bid,
          submittedDate: new Date().toISOString().split('T')[0],
          status: 'Submitted' as const
        };
        const existingFiltered = r.bids.filter(b => b.vendorId !== bid.vendorId);
        return {
          ...r,
          status: 'Evaluation Phase',
          bids: [...existingFiltered, newBid]
        };
      }
      return r;
    }));
  };

  const awardRFQ = (rfqId: string, vendorId: string) => {
    const rfq = rfqs.find(r => r.id === rfqId);
    if (!rfq) return;
    const winningBid = rfq.bids.find(b => b.vendorId === vendorId);
    const vendor = vendors.find(v => v.id === vendorId);
    if (!winningBid || !vendor) return;

    // Convert RFQ to PO
    const lineItems: POLineItem[] = rfq.items.map((item, idx) => ({
      id: `LI-RFQ-${idx + 1}`,
      itemDescription: item.description,
      specification: item.targetSpec,
      quantity: item.quantity,
      unit: (item.unit as any) || 'Sets',
      unitRate: Math.round(winningBid.bidAmount / (item.quantity || 1)),
      totalAmount: winningBid.bidAmount,
      inspectionStatus: 'Pending Inspection'
    }));

    const subtotal = winningBid.bidAmount;
    const taxAmount = Math.round(subtotal * 0.18);
    const totalAmount = subtotal + taxAmount;

    createPurchaseOrder({
      projectId: rfq.projectId,
      projectName: rfq.projectName,
      projectCode: rfq.projectCode,
      vendorId: vendor.id,
      vendorName: vendor.name,
      vendorCategory: vendor.category,
      issueDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: rfq.targetDeliveryDate,
      lineItems,
      subtotal,
      taxRatePercentage: 18,
      taxAmount,
      totalAmount,
      paidAmount: 0,
      paymentStatus: 'Unpaid',
      deliveryStatus: 'Issued',
      shippingAddress: 'Project Site Delivery Desk',
      siteSupervisorContact: 'Site Supervisor Assigned',
      procurementOfficer: 'Rohit Deshmukh',
      terms: 'Awarded through RFQ bidding protocol. Net 30 payment terms.',
      notes: `Converted directly from ${rfq.rfqNumber} (${rfq.title})`
    });

    setRfqs(prev => prev.map(r => {
      if (r.id === rfqId) {
        return {
          ...r,
          status: 'Awarded & Converted to PO',
          awardedVendorId: vendorId,
          bids: r.bids.map(b => ({
            ...b,
            status: b.vendorId === vendorId ? 'Awarded' : 'Declined'
          }))
        };
      }
      return r;
    }));
  };

  const addContract = (contractData: Omit<VendorContract, 'id' | 'contractNumber'>) => {
    const newCount = contracts.length + 1;
    const contractNum = `CTR-2024-${String(newCount).padStart(3, '0')}`;
    const newContract: VendorContract = {
      ...contractData,
      id: contractNum,
      contractNumber: contractNum
    };
    setContracts(prev => [newContract, ...prev]);
  };

  const updateContractStatus = (contractId: string, status: VendorContract['status']) => {
    setContracts(prev => prev.map(c => c.id === contractId ? { ...c, status } : c));
  };

  const updateShipmentStatus = (
    shipmentId: string,
    status: DeliveryShipment['status'],
    location: string,
    note?: string
  ) => {
    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        const newCheckpoint = {
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          location,
          statusNote: note || `Shipment status updated to ${status}`
        };
        return {
          ...s,
          status,
          currentLocation: location,
          checkpoints: [...s.checkpoints, newCheckpoint]
        };
      }
      return s;
    }));
  };

  const syncAllEngines = () => {
    setIsCostEngineSynced(true);
    setIsStudioEngineSynced(true);
  };

  return (
    <VendorContext.Provider
      value={{
        vendors,
        purchaseOrders,
        rfqs,
        contracts,
        shipments,
        projects: projectReferences,
        selectedProjectId,
        setSelectedProjectId,
        filteredProjects,
        filteredVendors,
        filteredPurchaseOrders,
        filteredRFQs,
        filteredContracts,
        filteredShipments,
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
        addVendor,
        updateVendor,
        deleteVendor,
        createPurchaseOrder,
        updatePurchaseOrderStatus,
        recordPOPayment,
        createRFQ,
        submitRFQBid,
        awardRFQ,
        addContract,
        updateContractStatus,
        updateShipmentStatus,
        isCostEngineSynced,
        isStudioEngineSynced,
        syncAllEngines
      }}
    >
      {children}
    </VendorContext.Provider>
  );
};

export const useVendor = () => {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error('useVendor must be used within a VendorProvider');
  }
  return context;
};
