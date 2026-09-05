import React, { useState, useMemo, useEffect } from 'react';
import {
  FileSpreadsheet,
  Building2,
  Users,
  Ruler,
  Layers,
  Sparkles,
  Download,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Percent,
  Calculator,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  Tag,
  ArrowRight,
  Filter,
  DollarSign,
  Printer,
  Copy,
  Bookmark,
  Zap,
  BookOpen,
  Check,
  Info
} from 'lucide-react';
import {
  ProjectMasterEstimate,
  RoomEstimateSheet,
  TradeAnnexure,
  EstimateLineItem,
  ProjectVendorAssignment,
  VendorTradeRateCard
} from './data/estimateTypes';
import {
  MOCK_MASTER_ESTIMATE_ABIZAR,
  MOCK_VENDOR_RATE_CARDS,
  MOCK_ASSIGNED_PROJECT_VENDORS
} from './data/mockEstimateData';
import {
  PreAutoFillBOQItem,
  getAllAvailableBoqLibrary,
  saveCustomBoqItemToLibrary
} from './data/standardBoqLibrary';
import {
  getStoredVendorRateCards,
  addRateCardItemToVendor,
  updateRateCardItem,
  deleteRateCardItem,
  RateCardItem
} from '../vendor/data/vendorRateCardStore';
import { PrintEstimateModal } from './components/PrintEstimateModal';
import { cn } from '../../../../lib/utils';
import {
  getStoredMasterEstimate,
  saveStoredMasterEstimate,
  DEFAULT_TRADE_PROGRESS,
  computeProjectTimeline
} from '../studio/utils/projectTimelineEngine';

export function CostEstimatesPage() {
  const [masterEstimate, setMasterEstimate] = useState<ProjectMasterEstimate>(() => getStoredMasterEstimate());
  const [activeTab, setActiveTab] = useState<'master_summary' | 'room_estimates' | 'vendor_rate_cards' | 'vendor_roster'>('master_summary');
  const [selectedRoomId, setSelectedRoomId] = useState<string>(masterEstimate.rooms[0]?.roomId || 'room-1');
  const [selectedTradeCode, setSelectedTradeCode] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J'>('A');
  const [searchItem, setSearchItem] = useState('');
  const [showAddLineModal, setShowAddLineModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Listen for progress updates made from Studio timeline sliders
  useEffect(() => {
    const handleProgressUpdate = () => {
      const latest = getStoredMasterEstimate();
      setMasterEstimate(latest);
    };
    window.addEventListener('arqon_estimate_progress_updated', handleProgressUpdate);
    return () => window.removeEventListener('arqon_estimate_progress_updated', handleProgressUpdate);
  }, []);

  const timelineData = useMemo(() => computeProjectTimeline(masterEstimate), [masterEstimate]);

  // Print & Export Presentation Modal
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printModalMode, setPrintModalMode] = useState<'master_boq' | 'space_summary' | 'trade_summary' | 'client_quote'>('master_boq');

  // Modal Mode & Library State
  const [modalMode, setModalMode] = useState<'autofill' | 'vendor_rate_card' | 'custom'>('autofill');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryTradeFilter, setLibraryTradeFilter] = useState<string>('ALL');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [saveToLibraryCheckbox, setSaveToLibraryCheckbox] = useState(true);

  // New / Edited Line Item State
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemQty, setNewItemQty] = useState<number>(1);
  const [newItemUnit, setNewItemUnit] = useState<string>('Sq.ft.');
  const [newItemRate, setNewItemRate] = useState<number>(100);
  const [newItemDrawingRef, setNewItemDrawingRef] = useState('');
  const [customItemTitle, setCustomItemTitle] = useState('');
  const [customItemSubCategory, setCustomItemSubCategory] = useState('');
  const [customItemTradeCode, setCustomItemTradeCode] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J'>('A');
  const [newItemProgress, setNewItemProgress] = useState<number>(0);

  // Master auto-fill library (Standard + Custom Saved)
  const [boqLibrary, setBoqLibrary] = useState<PreAutoFillBOQItem[]>(() => getAllAvailableBoqLibrary());

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeRoom = useMemo(() => {
    return masterEstimate.rooms.find(r => r.roomId === selectedRoomId) || masterEstimate.rooms[0];
  }, [masterEstimate, selectedRoomId]);

  const activeAnnexure = useMemo(() => {
    return activeRoom.annexures[selectedTradeCode];
  }, [activeRoom, selectedTradeCode]);

  const activeVendorForTrade = useMemo(() => {
    return masterEstimate.assignedVendors.find(v => v.tradeCode === selectedTradeCode);
  }, [masterEstimate, selectedTradeCode]);

  // Reactive Vendor Rate Cards synchronized with Vendor Directory
  const [vendorRateCards, setVendorRateCards] = useState<VendorTradeRateCard[]>(() => getStoredVendorRateCards());

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setVendorRateCards(e.detail);
      } else {
        setVendorRateCards(getStoredVendorRateCards());
      }
    };
    window.addEventListener('arqon_rate_cards_updated', handleUpdate);
    return () => window.removeEventListener('arqon_rate_cards_updated', handleUpdate);
  }, []);

  const activeRateCard = useMemo(() => {
    return (
      vendorRateCards.find(rc => rc.tradeCode === selectedTradeCode || rc.vendorId === activeVendorForTrade?.vendorId) ||
      vendorRateCards.find(rc => rc.tradeCode === selectedTradeCode) ||
      null
    );
  }, [vendorRateCards, selectedTradeCode, activeVendorForTrade]);

  // Rate card item management state (Cost module <-> Vendor module live sync)
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [editingRateKey, setEditingRateKey] = useState<string | null>(null);
  const [rateFormDesc, setRateFormDesc] = useState('');
  const [rateFormKey, setRateFormKey] = useState('');
  const [rateFormUnit, setRateFormUnit] = useState<string>('Sq.ft.');
  const [rateFormStd, setRateFormStd] = useState<number>(150);
  const [rateFormPref, setRateFormPref] = useState<number>(135);
  const [rateFormRemarks, setRateFormRemarks] = useState('');
  const [showInlineVendorAdd, setShowInlineVendorAdd] = useState(false);
  const [selectedRateKey, setSelectedRateKey] = useState<string | null>(null);

  const handleOpenAddRateModal = (itemToEdit?: any) => {
    if (itemToEdit) {
      setEditingRateKey(itemToEdit.itemKey);
      setRateFormKey(itemToEdit.itemKey);
      setRateFormDesc(itemToEdit.description);
      setRateFormUnit(itemToEdit.unit || 'Sq.ft.');
      setRateFormStd(itemToEdit.standardRate || 0);
      setRateFormPref(itemToEdit.preferredRate || 0);
      setRateFormRemarks(itemToEdit.specRemarks || '');
    } else {
      setEditingRateKey(null);
      setRateFormKey(`${selectedTradeCode}-${Date.now().toString().slice(-4)}`);
      setRateFormDesc('');
      setRateFormUnit('Sq.ft.');
      setRateFormStd(180);
      setRateFormPref(160);
      setRateFormRemarks('');
    }
    setIsRateModalOpen(true);
  };

  const handleSaveRateItemFromCost = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!rateFormDesc.trim()) {
      showToast('Please enter an item description');
      return;
    }

    const targetVendorId = activeRateCard?.vendorId || activeVendorForTrade?.vendorId || `ven-${selectedTradeCode.toLowerCase()}-1`;
    const targetVendorName = activeRateCard?.vendorName || activeVendorForTrade?.vendorName || 'Assigned Trade Contractor';
    const targetTradeCategory = activeRateCard?.tradeCategory || activeVendorForTrade?.vendorCategory || 'Specialized Trade Work';

    const newItem: RateCardItem = {
      itemKey: rateFormKey || `${selectedTradeCode}-${Date.now().toString().slice(-4)}`,
      description: rateFormDesc.trim(),
      unit: rateFormUnit,
      standardRate: Number(rateFormStd) || 0,
      preferredRate: Number(rateFormPref) || Number(rateFormStd) || 0,
      specRemarks: rateFormRemarks.trim() || undefined
    };

    if (editingRateKey) {
      const updated = updateRateCardItem(targetVendorId, editingRateKey, newItem);
      setVendorRateCards(updated);
      showToast(`✓ Updated rate card item in ${targetVendorName} (synced with Vendor Directory)`);
    } else {
      const updated = addRateCardItemToVendor(targetVendorId, newItem, {
        vendorName: targetVendorName,
        tradeCategory: targetTradeCategory,
        tradeCode: selectedTradeCode
      });
      setVendorRateCards(updated);
      showToast(`✓ Added item to ${targetVendorName} rate card (live synced to Vendor Directory)`);
    }

    // If adding inside the BOQ Line Item builder modal, auto-fill it!
    if (showAddLineModal) {
      setNewItemDesc(newItem.description);
      setNewItemRate(newItem.preferredRate);
      setNewItemUnit(newItem.unit);
      setSelectedRateKey(newItem.itemKey);
      setShowInlineVendorAdd(false);
    }

    setIsRateModalOpen(false);
  };

  const handleDeleteRateItemFromCost = (vendorId: string, itemKey: string) => {
    if (confirm(`Remove item "${itemKey}" from rate card? This will also remove it in Vendor Directory.`)) {
      const updated = deleteRateCardItem(vendorId, itemKey);
      setVendorRateCards(updated);
      showToast('✓ Rate item removed (synced with Vendor Directory)');
    }
  };

  const handleInsertRateToCurrentBOQ = (item: any) => {
    setNewItemDesc(item.description);
    setNewItemRate(item.preferredRate);
    setNewItemUnit(item.unit);
    setNewItemQty(1);
    setEditingItemId(null);
    setModalMode('vendor_rate_card');
    setSelectedRateKey(item.itemKey);
    setShowAddLineModal(true);
  };

  // Filtered auto-fill library items
  const filteredLibraryItems = useMemo(() => {
    return boqLibrary.filter(item => {
      const matchesSearch =
        librarySearch === '' ||
        item.title.toLowerCase().includes(librarySearch.toLowerCase()) ||
        item.description.toLowerCase().includes(librarySearch.toLowerCase()) ||
        item.tradeCategory.toLowerCase().includes(librarySearch.toLowerCase()) ||
        item.subCategory.toLowerCase().includes(librarySearch.toLowerCase()) ||
        (item.studioDrawingRef && item.studioDrawingRef.toLowerCase().includes(librarySearch.toLowerCase())) ||
        item.tags.some(t => t.toLowerCase().includes(librarySearch.toLowerCase()));

      const matchesTrade =
        libraryTradeFilter === 'ALL' ||
        (libraryTradeFilter === 'CUSTOM' ? item.isCustomUserItem : item.tradeCode === libraryTradeFilter);

      return matchesSearch && matchesTrade;
    });
  }, [boqLibrary, librarySearch, libraryTradeFilter]);

  // Recalculate room and project totals
  const recalculateEstimate = (updatedRooms: RoomEstimateSheet[]) => {
    const recalculatedRooms = updatedRooms.map(room => {
      let roomTotal = 0;
      const updatedAnnexures = { ...room.annexures };

      (Object.keys(updatedAnnexures) as (keyof typeof updatedAnnexures)[]).forEach(code => {
        const ann = updatedAnnexures[code];
        const annTotal = ann.items && ann.items.length > 0
          ? ann.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.rate)), 0)
          : ann.totalAmount;
        
        updatedAnnexures[code] = {
          ...ann,
          totalAmount: annTotal
        };
        roomTotal += annTotal;
      });

      const ratePerSqFt = room.dimensionSpec.carpetAreaSqFt > 0
        ? roomTotal / room.dimensionSpec.carpetAreaSqFt
        : 0;

      return {
        ...room,
        annexures: updatedAnnexures,
        totalRoomAmount: roomTotal,
        ratePerSqFt: Number(ratePerSqFt.toFixed(2))
      };
    });

    const grandTotal = recalculatedRooms.reduce((sum, r) => sum + r.totalRoomAmount, 0);
    const overallRate = masterEstimate.totalCarpetAreaSqFt > 0
      ? grandTotal / masterEstimate.totalCarpetAreaSqFt
      : 0;

    const finalRooms = recalculatedRooms.map(r => ({
      ...r,
      percentageOfProject: Number(((r.totalRoomAmount / grandTotal) * 100).toFixed(2))
    }));

    const updatedMasterEstimate: ProjectMasterEstimate = {
      ...masterEstimate,
      rooms: finalRooms,
      totalProjectCost: Number(grandTotal.toFixed(2)),
      overallRatePerSqFt: Number(overallRate.toFixed(2))
    };

    setMasterEstimate(updatedMasterEstimate);
    saveStoredMasterEstimate(updatedMasterEstimate);
  };

  // Update specific line item execution progress
  const handleUpdateLineItemProgress = (roomId: string, annexureCode: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J', itemId: string, newProgress: number) => {
    const clampedProgress = Math.max(0, Math.min(100, Math.round(newProgress)));
    const updatedRooms = masterEstimate.rooms.map(room => {
      if (room.roomId === roomId) {
        const currAnn = room.annexures[annexureCode];
        const updatedItems = currAnn.items.map(it => {
          if (it.id === itemId) {
            return {
              ...it,
              progressPercentage: clampedProgress
            };
          }
          return it;
        });
        return {
          ...room,
          annexures: {
            ...room.annexures,
            [annexureCode]: {
              ...currAnn,
              items: updatedItems
            }
          }
        };
      }
      return room;
    });

    recalculateEstimate(updatedRooms);
    showToast(`Line item progress set to ${clampedProgress}% — synced with Studio!`);
  };

  // Batch update entire trade progress across all rooms
  const handleUpdateTradeProgress = (tradeCode: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J', newProgress: number) => {
    const clampedProgress = Math.max(0, Math.min(100, Math.round(newProgress)));
    const updatedRooms = masterEstimate.rooms.map(room => {
      const currAnn = room.annexures[tradeCode];
      if (!currAnn || !currAnn.items) return room;
      const updatedItems = currAnn.items.map(it => ({
        ...it,
        progressPercentage: clampedProgress
      }));
      return {
        ...room,
        annexures: {
          ...room.annexures,
          [tradeCode]: {
            ...currAnn,
            items: updatedItems
          }
        }
      };
    });

    recalculateEstimate(updatedRooms);
    showToast(`Trade Annexure [${tradeCode}] set to ${clampedProgress}% across all rooms!`);
  };

  // Open Add Modal
  const handleOpenAddModal = (defaultTradeCode?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J') => {
    const tradeToUse = defaultTradeCode || selectedTradeCode;
    setSelectedTradeCode(tradeToUse);
    setCustomItemTradeCode(tradeToUse);
    setEditingItemId(null);
    setSelectedTemplateId(null);
    setModalMode('autofill');
    setLibraryTradeFilter(tradeToUse);
    setLibrarySearch('');
    setNewItemDesc('');
    setNewItemQty(1);
    setNewItemUnit('Sq.ft.');
    setNewItemRate(100);
    setNewItemDrawingRef('');
    setCustomItemTitle('');
    setCustomItemSubCategory('');
    setNewItemProgress(DEFAULT_TRADE_PROGRESS[tradeToUse] ?? 0);
    setSaveToLibraryCheckbox(true);
    setShowAddLineModal(true);
  };

  // Open Edit Modal for an existing Line Item
  const handleOpenEditModal = (item: EstimateLineItem, tradeCode: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J') => {
    setSelectedTradeCode(tradeCode);
    setCustomItemTradeCode(tradeCode);
    setEditingItemId(item.id);
    setSelectedTemplateId(null);
    setModalMode('custom');
    setNewItemDesc(item.description);
    setNewItemQty(item.quantity);
    setNewItemUnit(item.unit);
    setNewItemRate(item.rate);
    setNewItemDrawingRef(item.studioDrawingRef || '');
    setCustomItemTitle(item.description.split('.')[0] || item.description.slice(0, 30));
    setCustomItemSubCategory(item.subCategory || '');
    setNewItemProgress(item.progressPercentage ?? (DEFAULT_TRADE_PROGRESS[tradeCode] ?? 0));
    setSaveToLibraryCheckbox(false);
    setShowAddLineModal(true);
  };

  // Select auto-fill template from Master Library
  const handleSelectAutoFillTemplate = (template: PreAutoFillBOQItem) => {
    setSelectedTemplateId(template.id);
    setNewItemDesc(template.description);
    setNewItemUnit(template.unit);
    setNewItemRate(template.defaultRate);
    setNewItemDrawingRef(template.studioDrawingRef || '');
    setCustomItemTitle(template.title);
    setCustomItemSubCategory(template.subCategory);
    setCustomItemTradeCode(template.tradeCode);
    setSelectedTradeCode(template.tradeCode);
    setNewItemProgress(DEFAULT_TRADE_PROGRESS[template.tradeCode] ?? 0);

    // Auto-suggest logical quantity based on room dimensions & unit
    if (template.unit === 'Sq.ft.') {
      if (template.tradeCode === 'A' || template.tradeCode === 'B' || template.tradeCode === 'G') {
        setNewItemQty(activeRoom.dimensionSpec.carpetAreaSqFt || 100);
      } else {
        setNewItemQty(100);
      }
    } else if (template.unit === 'R.ft.') {
      setNewItemQty(activeRoom.dimensionSpec.perimeterRFt || 30);
    } else if (template.unit === 'No.' || template.unit === 'Nos' || template.unit === 'Set' || template.unit === 'L/S') {
      setNewItemQty(1);
    }
  };

  // Quick rate selection from vendor rate card
  const handleSelectVendorRate = (itemKey: string, desc: string, rate: number, unit: string) => {
    setNewItemDesc(desc);
    setNewItemRate(rate);
    setNewItemUnit(unit);
    setCustomItemTitle(desc.slice(0, 35));
  };

  // Save / Update Line Item
  const handleSaveLineItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemDesc.trim()) return;

    const targetTrade = modalMode === 'custom' ? customItemTradeCode : selectedTradeCode;
    const currentAnnexure = activeRoom.annexures[targetTrade];
    const vendorForTarget = masterEstimate.assignedVendors.find(v => v.tradeCode === targetTrade);

    // If user created a custom item and wants to persist it to the reusable library
    if (modalMode === 'custom' && saveToLibraryCheckbox && !editingItemId) {
      const savedCustom = saveCustomBoqItemToLibrary({
        itemKey: `CUST-${Date.now()}`,
        tradeCode: targetTrade,
        tradeCategory: currentAnnexure.tradeCategory,
        subCategory: customItemSubCategory.trim() || 'Custom Architectural Spec',
        title: customItemTitle.trim() || newItemDesc.slice(0, 35),
        description: newItemDesc.trim(),
        unit: newItemUnit as any,
        defaultRate: Number(newItemRate),
        studioDrawingRef: newItemDrawingRef.trim() || undefined,
        tags: ['custom', currentAnnexure.tradeCategory.toLowerCase(), customItemSubCategory.toLowerCase()]
      });

      setBoqLibrary(getAllAvailableBoqLibrary());
    }

    if (editingItemId) {
      // UPDATE EXISTING
      const updatedRooms = masterEstimate.rooms.map(room => {
        if (room.roomId === activeRoom.roomId) {
          const currAnn = room.annexures[selectedTradeCode];
          const updatedItems = currAnn.items.map(it => {
            if (it.id === editingItemId) {
              return {
                ...it,
                description: newItemDesc.trim(),
                quantity: Number(newItemQty),
                unit: newItemUnit,
                rate: Number(newItemRate),
                amount: Number(newItemQty) * Number(newItemRate),
                studioDrawingRef: newItemDrawingRef.trim() || it.studioDrawingRef,
                subCategory: customItemSubCategory.trim() || it.subCategory,
                progressPercentage: newItemProgress
              };
            }
            return it;
          });

          return {
            ...room,
            annexures: {
              ...room.annexures,
              [selectedTradeCode]: {
                ...currAnn,
                items: updatedItems,
                totalAmount: updatedItems.reduce((sum, it) => sum + it.amount, 0)
              }
            }
          };
        }
        return room;
      });

      recalculateEstimate(updatedRooms);
      showToast('BOQ Line item updated successfully!');
    } else {
      // INSERT NEW ITEM
      const newItem: EstimateLineItem = {
        id: `item-${Date.now()}`,
        itemNo: (currentAnnexure.items?.length || 0) + 1,
        description: newItemDesc.trim(),
        quantity: Number(newItemQty),
        unit: newItemUnit,
        rate: Number(newItemRate),
        amount: Number(newItemQty) * Number(newItemRate),
        category: currentAnnexure.tradeCategory,
        subCategory: customItemSubCategory.trim() || undefined,
        vendorId: vendorForTarget?.vendorId,
        vendorName: vendorForTarget?.vendorName,
        studioDrawingRef: newItemDrawingRef.trim() || undefined,
        isCustomRate: modalMode === 'custom',
        progressPercentage: newItemProgress
      };

      const updatedRooms = masterEstimate.rooms.map(room => {
        if (room.roomId === activeRoom.roomId) {
          const currAnn = room.annexures[targetTrade];
          const updatedItems = [...(currAnn.items || []), newItem];
          return {
            ...room,
            annexures: {
              ...room.annexures,
              [targetTrade]: {
                ...currAnn,
                items: updatedItems,
                totalAmount: updatedItems.reduce((sum, it) => sum + it.amount, 0)
              }
            }
          };
        }
        return room;
      });

      recalculateEstimate(updatedRooms);
      showToast(modalMode === 'custom' && saveToLibraryCheckbox
        ? 'Custom BOQ item saved to library & added to estimate!'
        : 'BOQ item inserted successfully!');
    }

    setShowAddLineModal(false);
  };

  // Delete line item
  const handleDeleteLineItem = (itemId: string) => {
    const updatedRooms = masterEstimate.rooms.map(room => {
      if (room.roomId === activeRoom.roomId) {
        const currAnn = room.annexures[selectedTradeCode];
        const updatedItems = currAnn.items.filter(it => it.id !== itemId);
        return {
          ...room,
          annexures: {
            ...room.annexures,
            [selectedTradeCode]: {
              ...currAnn,
              items: updatedItems,
              totalAmount: updatedItems.reduce((sum, it) => sum + it.amount, 0)
            }
          }
        };
      }
      return room;
    });
    recalculateEstimate(updatedRooms);
    showToast('Item removed from BOQ annexure.');
  };

  // Duplicate line item
  const handleDuplicateLineItem = (item: EstimateLineItem) => {
    const duplicated: EstimateLineItem = {
      ...item,
      id: `item-${Date.now()}`,
      itemNo: (activeAnnexure.items?.length || 0) + 1,
      description: `${item.description} (Copy)`,
      amount: item.quantity * item.rate
    };

    const updatedRooms = masterEstimate.rooms.map(room => {
      if (room.roomId === activeRoom.roomId) {
        const currAnn = room.annexures[selectedTradeCode];
        const updatedItems = [...(currAnn.items || []), duplicated];
        return {
          ...room,
          annexures: {
            ...room.annexures,
            [selectedTradeCode]: {
              ...currAnn,
              items: updatedItems,
              totalAmount: updatedItems.reduce((sum, it) => sum + it.amount, 0)
            }
          }
        };
      }
      return room;
    });

    recalculateEstimate(updatedRooms);
    showToast('Item duplicated.');
  };

  // Assign vendor to trade
  const handleAssignVendor = (tradeCode: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J', newVendor: ProjectVendorAssignment) => {
    const updatedVendors = masterEstimate.assignedVendors.map(v => v.tradeCode === tradeCode ? newVendor : v);
    
    // update all annexures with new vendor name
    const updatedRooms = masterEstimate.rooms.map(room => ({
      ...room,
      annexures: {
        ...room.annexures,
        [tradeCode]: {
          ...room.annexures[tradeCode],
          assignedVendorId: newVendor.vendorId,
          assignedVendorName: newVendor.vendorName,
          vendorRating: newVendor.rating
        }
      }
    }));

    setMasterEstimate(prev => ({
      ...prev,
      assignedVendors: updatedVendors
    }));
    recalculateEstimate(updatedRooms);
    setShowVendorModal(false);
    showToast(`Assigned ${newVendor.vendorName} to Annexure ${tradeCode}`);
  };

  // Trigger sync simulation with Studio dimensions
  const handleSyncWithStudio = () => {
    setSyncStatusMessage('Synchronizing room dimensions & architectural apertures with Studio Dimension Matrix...');
    setTimeout(() => {
      setSyncStatusMessage('Synced successfully! 9 rooms and 10 trade annexures verified against approved studio plan.');
      setTimeout(() => setSyncStatusMessage(null), 4000);
    }, 1000);
  };

  // Format currency
  const fmt = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val);
  };

  // Trade definitions for table matrix
  const TRADE_LIST: { code: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J'; name: string }[] = [
    { code: 'A', name: '1. Civil Work' },
    { code: 'B', name: '2. Plaster of Paris (POP)' },
    { code: 'C', name: '3. Electric Wiring' },
    { code: 'D', name: '4. Electric Switches' },
    { code: 'E', name: '5. Electric Fixtures' },
    { code: 'F', name: '6. Carpentry Work' },
    { code: 'G', name: '7. Paint & Polish' },
    { code: 'H', name: '8. Miscellaneous Work' },
    { code: 'I', name: '9. Loose Furniture' },
    { code: 'J', name: '10. Aluminium Windows' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-y-auto custom-scrollbar">
      {/* Top Banner & Header */}
      <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" />
              {masterEstimate.consultantName}
            </span>
            <span>•</span>
            <span className="font-semibold">{masterEstimate.estimateNo}</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {masterEstimate.approvalInfo.status}
            </span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            {masterEstimate.projectName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Live auto-calculated turnkey BOQ engine linked directly to Studio Dimension Matrix, active trade vendor rate cards, and multi-tier summary sheets.
          </p>
        </div>

        {/* Global Estimate Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSyncWithStudio}
            className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700"
            title="Sync dimensions and space types directly from Studio"
          >
            <RefreshCw className="w-3.5 h-3.5 text-orange-500" />
            <span>Sync Studio Dimensions</span>
          </button>

          <button
            onClick={() => {
              setPrintModalMode('master_boq');
              setIsPrintModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow-sm"
            title="Open comprehensive Print & PDF Estimate generator"
          >
            <Printer className="w-3.5 h-3.5 text-orange-500" />
            <span>Print Estimate</span>
          </button>

          <button
            onClick={() => {
              setPrintModalMode('client_quote');
              setIsPrintModalOpen(true);
            }}
            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center gap-2"
            title="Export official client BOQ quotation & financial summary"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Client BOQ</span>
          </button>
        </div>
      </div>

      {syncStatusMessage && (
        <div className="px-8 py-2.5 bg-orange-500/10 border-b border-orange-500/20 text-orange-700 dark:text-orange-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 animate-pulse text-orange-500" />
          <span>{syncStatusMessage}</span>
        </div>
      )}

      {/* Main KPI Stats Strip (Grand Totals from Page 1 & 2 + 3-Phase Execution Rollup) */}
      <div className="px-8 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-slate-100/50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span>Total Project Cost</span>
            <Building2 className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white">
            {fmt(masterEstimate.totalProjectCost)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Auto-aggregated across 7 residential spaces</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span>Total Carpet Area</span>
            <Ruler className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white">
            {masterEstimate.totalCarpetAreaSqFt.toLocaleString('en-IN')} <span className="text-sm font-semibold text-slate-400">Sq.Ft.</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Includes Living, Bed, Baths & Utilities</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span>Overall Rate / Sq.Ft.</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white">
            {fmt(masterEstimate.overallRatePerSqFt)} <span className="text-sm font-semibold text-slate-400">/ sq.ft.</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 block">Blended turnkey delivery rate</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span>Assigned Trade Vendors</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white">
            10 / 10 <span className="text-sm font-semibold text-slate-400">Trades Bound</span>
          </div>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold mt-1 block">Live rate cards linked to all annexures</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1.5">
              <span>Site Execution</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">Phase 3</span>
            </span>
            <Percent className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl lg:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {timelineData.siteExecutionMetrics.weightedBoqProgress}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${timelineData.siteExecutionMetrics.weightedBoqProgress}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block truncate">
            {timelineData.siteExecutionMetrics.completedItems} of {timelineData.siteExecutionMetrics.totalItems} items completed • Studio Synced
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('master_summary')}
          className={cn(
            "py-3.5 px-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
            activeTab === 'master_summary'
              ? "border-orange-500 text-orange-600 dark:text-orange-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          )}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>1. Master Residence Summary (Pages 1 & 2)</span>
        </button>

        <button
          onClick={() => setActiveTab('room_estimates')}
          className={cn(
            "py-3.5 px-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
            activeTab === 'room_estimates'
              ? "border-orange-500 text-orange-600 dark:text-orange-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          )}
        >
          <Layers className="w-4 h-4" />
          <span>2. Room-Wise Detail & Annexures A–J (Pages 3–40)</span>
        </button>

        <button
          onClick={() => setActiveTab('vendor_roster')}
          className={cn(
            "py-3.5 px-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
            activeTab === 'vendor_roster'
              ? "border-orange-500 text-orange-600 dark:text-orange-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          )}
        >
          <Users className="w-4 h-4" />
          <span>3. Project Vendor Distribution Roster</span>
        </button>

        <button
          onClick={() => setActiveTab('vendor_rate_cards')}
          className={cn(
            "py-3.5 px-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
            activeTab === 'vendor_rate_cards'
              ? "border-orange-500 text-orange-600 dark:text-orange-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          )}
        >
          <Tag className="w-4 h-4" />
          <span>4. Live Vendor Rate Cards & Price Schedules</span>
        </button>
      </div>

      {/* Tab Body */}
      <div className="p-8 flex-1 space-y-8">
        {/* =========================================================================
            TAB 1: MASTER RESIDENCE SUMMARY (Matrix Cross-Tab from Manual PDF Page 1 & 2)
            ========================================================================= */}
        {activeTab === 'master_summary' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Grand Project Summary Matrix</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-normal">
                    Turnkey Residential BOQ
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Complete room-wise and trade-wise aggregation with auto-calculating area metrics and percentage contributions.
                </p>
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-4">
                <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Checked: {masterEstimate.approvalInfo.checkedBy}
                </div>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden overflow-x-auto custom-scrollbar">
              <table className="w-full text-xs text-left border-collapse min-w-[1100px]">
                <thead>
                  {/* Top Header Row: Room Names & Dimensions */}
                  <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3.5 font-black text-slate-800 dark:text-slate-200 w-48 border-r border-slate-200 dark:border-slate-700 sticky left-0 bg-slate-100 dark:bg-slate-800 z-10">
                      NATURE OF WORK
                    </th>
                    {masterEstimate.rooms.map(room => (
                      <th key={room.roomId} className="p-3.5 font-bold text-slate-800 dark:text-slate-200 text-center border-r border-slate-200 dark:border-slate-700 min-w-[120px]">
                        <div className="font-black text-slate-900 dark:text-white">{room.roomName}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {room.dimensionSpec.lengthFeet}'{room.dimensionSpec.lengthInches}" × {room.dimensionSpec.widthFeet}'{room.dimensionSpec.widthInches}"
                        </div>
                        <div className="text-[10px] font-bold text-orange-600 dark:text-orange-400 mt-0.5">
                          {room.dimensionSpec.carpetAreaSqFt} SQ.FT.
                        </div>
                      </th>
                    ))}
                    <th className="p-3.5 font-black text-slate-900 dark:text-white text-right w-36 border-r border-slate-200 dark:border-slate-700 bg-slate-200/50 dark:bg-slate-800/90">
                      APPROX AMOUNT
                    </th>
                    <th className="p-3.5 font-black text-slate-900 dark:text-white text-right w-28 border-r border-slate-200 dark:border-slate-700 bg-slate-200/50 dark:bg-slate-800/90">
                      RATE / SQ.FT.
                    </th>
                    <th className="p-3.5 font-black text-slate-900 dark:text-white text-right w-24 bg-slate-200/50 dark:bg-slate-800/90">
                      WORK %
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {TRADE_LIST.map((trade) => {
                    // Sum trade total across all rooms
                    const tradeTotal = masterEstimate.rooms.reduce((sum, r) => sum + (r.annexures[trade.code]?.totalAmount || 0), 0);
                    const tradePerSqFt = masterEstimate.totalCarpetAreaSqFt > 0 ? tradeTotal / masterEstimate.totalCarpetAreaSqFt : 0;
                    const tradePercentage = masterEstimate.totalProjectCost > 0 ? (tradeTotal / masterEstimate.totalProjectCost) * 100 : 0;

                    return (
                      <tr key={trade.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-bold text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-700 sticky left-0 bg-white dark:bg-slate-900 z-10">
                          {trade.name}
                        </td>
                        {masterEstimate.rooms.map(room => {
                          const val = room.annexures[trade.code]?.totalAmount || 0;
                          return (
                            <td key={room.roomId} className="p-3 text-right font-mono text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                              {val > 0 ? val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                            </td>
                          );
                        })}
                        <td className="p-3 text-right font-bold text-slate-900 dark:text-white font-mono bg-slate-50 dark:bg-slate-800/40 border-r border-slate-200 dark:border-slate-700">
                          {tradeTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-right font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border-r border-slate-200 dark:border-slate-700">
                          {tradePerSqFt.toFixed(2)}
                        </td>
                        <td className="p-3 text-right font-bold text-orange-600 dark:text-orange-400 font-mono bg-slate-50 dark:bg-slate-800/40">
                          {tradePercentage.toFixed(2)}%
                        </td>
                      </tr>
                    );
                  })}

                  {/* Room Total Row */}
                  <tr className="bg-slate-100 dark:bg-slate-800 font-black text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-slate-600">
                    <td className="p-3.5 uppercase tracking-wider sticky left-0 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-10">
                      TOTAL ROOM AMOUNT
                    </td>
                    {masterEstimate.rooms.map(room => (
                      <td key={room.roomId} className="p-3.5 text-right font-mono text-orange-600 dark:text-orange-400 border-r border-slate-200 dark:border-slate-700">
                        {room.totalRoomAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    ))}
                    <td className="p-3.5 text-right font-mono text-orange-600 dark:text-orange-400 bg-slate-200/60 dark:bg-slate-700/60 border-r border-slate-200 dark:border-slate-700">
                      {masterEstimate.totalProjectCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5 text-right font-mono text-slate-800 dark:text-slate-200 bg-slate-200/60 dark:bg-slate-700/60 border-r border-slate-200 dark:border-slate-700">
                      {masterEstimate.overallRatePerSqFt.toFixed(2)}
                    </td>
                    <td className="p-3.5 text-right font-mono text-slate-800 dark:text-slate-200 bg-slate-200/60 dark:bg-slate-700/60">
                      100.00%
                    </td>
                  </tr>

                  {/* Rate Per Sq.Ft. Row */}
                  <tr className="bg-white dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-200">
                    <td className="p-3 uppercase text-[11px] sticky left-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-10">
                      RATE PER SQ.FT.
                    </td>
                    {masterEstimate.rooms.map(room => (
                      <td key={room.roomId} className="p-3 text-right font-mono text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700">
                        {room.ratePerSqFt.toFixed(2)}
                      </td>
                    ))}
                    <td className="p-3 text-right font-mono font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/40 border-r border-slate-200 dark:border-slate-700">
                      {masterEstimate.overallRatePerSqFt.toFixed(2)}
                    </td>
                    <td colSpan={2} className="p-3 text-center text-slate-400 text-[10px] bg-slate-50 dark:bg-slate-800/40 font-mono">
                      (Blended Project Rate)
                    </td>
                  </tr>

                  {/* Room Work % Share Row */}
                  <tr className="bg-white dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-200">
                    <td className="p-3 uppercase text-[11px] sticky left-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-10">
                      ROOM WORK IN PERCENTAGE
                    </td>
                    {masterEstimate.rooms.map(room => (
                      <td key={room.roomId} className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-400 border-r border-slate-200 dark:border-slate-700">
                        {room.percentageOfProject.toFixed(2)}%
                      </td>
                    ))}
                    <td colSpan={3} className="p-3 text-center text-emerald-600 dark:text-emerald-400 font-black bg-slate-50 dark:bg-slate-800/40 font-mono">
                      100.00%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Phase 3 Site Execution Rollup Card */}
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <Percent className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Phase 3: Site Execution Progress by Trade Annexure</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                        Studio Synced
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Calculated from individual BOQ line items across all 7 spaces. Aggregates to {timelineData.siteExecutionMetrics.weightedBoqProgress}% overall site completion.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('arqon_navigate_app', { detail: { appId: 'studio' } }));
                    }}
                    className="px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold transition-all border border-orange-500/20 flex items-center gap-1.5"
                  >
                    <span>View in Studio Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Grid of Trades with Execution Progress Bars & Steppers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {timelineData.siteExecutionMetrics.tradeWiseProgress.map((tp) => (
                  <div
                    key={tp.tradeCode}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500/40 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        [{tp.tradeCode}] {tp.tradeName.split(' ')[0]}
                      </span>
                      <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400">
                        {tp.averageProgress}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          tp.averageProgress === 100
                            ? "bg-emerald-500"
                            : tp.averageProgress >= 50
                            ? "bg-blue-500"
                            : tp.averageProgress > 0
                            ? "bg-amber-500"
                            : "bg-transparent"
                        )}
                        style={{ width: `${tp.averageProgress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                      <span>{tp.totalItems} items</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleUpdateTradeProgress(tp.tradeCode as any, 0)}
                          className="px-1 py-0.2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 font-bold"
                          title="Set 0%"
                        >
                          0%
                        </button>
                        <button
                          onClick={() => handleUpdateTradeProgress(tp.tradeCode as any, 50)}
                          className="px-1 py-0.2 rounded hover:bg-blue-500/20 text-blue-500 font-bold"
                          title="Set 50%"
                        >
                          50%
                        </button>
                        <button
                          onClick={() => handleUpdateTradeProgress(tp.tradeCode as any, 100)}
                          className="px-1 py-0.2 rounded hover:bg-emerald-500/20 text-emerald-500 font-bold"
                          title="Set 100%"
                        >
                          100%
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Approval Footer Box */}
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Signoff Governance</span>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Checked & Approved By: <span className="text-orange-500">{masterEstimate.approvalInfo.checkedBy}</span>
                </div>
                <div className="text-xs text-slate-500">
                  Confirmed by Client on {masterEstimate.approvalInfo.clientConfirmedDate || masterEstimate.date}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Locked & Ready for Procurement</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: ROOM-WISE DETAIL & DETAILED ANNEXURES A-J (Pages 3–40)
            ========================================================================= */}
        {activeTab === 'room_estimates' && (
          <div className="space-y-6">
            {/* Room Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800">
              {masterEstimate.rooms.map(room => {
                const isSelected = room.roomId === selectedRoomId;
                return (
                  <button
                    key={room.roomId}
                    onClick={() => setSelectedRoomId(room.roomId)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border shadow-sm",
                      isSelected
                        ? "bg-orange-500 text-white border-orange-500 shadow-orange-500/20"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <span>{room.roomName}</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded",
                      isSelected ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    )}>
                      {room.dimensionSpec.carpetAreaSqFt} sq.ft.
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Room Dimension Specification Card (from Manual Sheet Pages 4 & 23) */}
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-500 uppercase tracking-wider">
                  <Ruler className="w-4 h-4" />
                  <span>Area & Aperture Specifications — {activeRoom.roomName}</span>
                </div>
                <div className="text-xs font-bold text-slate-500">
                  Carpet Area: <span className="text-slate-900 dark:text-white font-mono">{activeRoom.dimensionSpec.carpetAreaSqFt} Sq.Ft.</span> ({activeRoom.dimensionSpec.lengthFeet}'-{activeRoom.dimensionSpec.lengthInches}" × {activeRoom.dimensionSpec.widthFeet}'-{activeRoom.dimensionSpec.widthInches}")
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Perimeter</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5 block">{activeRoom.dimensionSpec.perimeterRFt} R.ft.</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Clear Height</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5 block">{activeRoom.dimensionSpec.clearHeight}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Lintel Height</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5 block">{activeRoom.dimensionSpec.lintelHeight}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Beam Depth</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5 block">{activeRoom.dimensionSpec.beamHeight}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Door Opening</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5 block">{activeRoom.dimensionSpec.doorSize}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Window Cill</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5 block">{activeRoom.dimensionSpec.windowCill}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Window Length</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5 block">{activeRoom.dimensionSpec.windowLength}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Window Height</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5 block">{activeRoom.dimensionSpec.windowHeight}</span>
                </div>
              </div>
            </div>

            {/* Trade Annexures Tabs (A through J) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {TRADE_LIST.map(t => {
                    const isSelected = selectedTradeCode === t.code;
                    const tradeAmt = activeRoom.annexures[t.code]?.totalAmount || 0;
                    return (
                      <button
                        key={t.code}
                        onClick={() => setSelectedTradeCode(t.code)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border",
                          isSelected
                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                      >
                        <span>{t.name}</span>
                        <span className="text-[10px] opacity-75">
                          {tradeAmt > 0 ? `(₹${(tradeAmt / 1000).toFixed(1)}k)` : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Annexure Line-Item Table */}
              <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                {/* Annexure Header & Assigned Vendor Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-orange-500 font-bold uppercase tracking-wider">
                        Annexure {selectedTradeCode} • {activeAnnexure.tradeName}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                        {boqLibrary.filter(i => i.tradeCode === selectedTradeCode).length} Auto-Fill Specs Available
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        <span>
                          {(() => {
                            const items = activeAnnexure.items || [];
                            if (items.length === 0) return DEFAULT_TRADE_PROGRESS[selectedTradeCode] ?? 0;
                            const sum = items.reduce((acc, it) => acc + (it.progressPercentage ?? (DEFAULT_TRADE_PROGRESS[selectedTradeCode] ?? 0)), 0);
                            return Math.round(sum / items.length);
                          })()}% Trade Progress
                        </span>
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {activeRoom.roomName} — {activeAnnexure.tradeName}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Batch Trade Progress Quick Controls */}
                    <div className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold">Set All {selectedTradeCode}:</span>
                      <button
                        onClick={() => handleUpdateTradeProgress(selectedTradeCode, 0)}
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
                        title="Set entire trade to 0%"
                      >
                        0%
                      </button>
                      <button
                        onClick={() => handleUpdateTradeProgress(selectedTradeCode, 50)}
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors"
                        title="Set entire trade to 50%"
                      >
                        50%
                      </button>
                      <button
                        onClick={() => handleUpdateTradeProgress(selectedTradeCode, 100)}
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                        title="Set entire trade to 100% (Completed)"
                      >
                        100%
                      </button>
                    </div>

                    {/* Assigned Vendor Chip */}
                    <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-orange-500" />
                      <div>
                        <span className="text-[10px] text-slate-400 block leading-tight">Assigned Contractor</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{activeVendorForTrade?.vendorName}</span>
                      </div>
                      <button
                        onClick={() => setShowVendorModal(true)}
                        className="ml-2 text-orange-500 hover:text-orange-600 text-[11px] font-bold underline"
                      >
                        Change
                      </button>
                    </div>

                    <button
                      onClick={() => handleOpenAddModal(selectedTradeCode)}
                      className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add BOQ Item / Auto-Fill</span>
                    </button>
                  </div>
                </div>

                {/* Search & Filter within current Annexure */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder={`Search items in ${activeAnnexure.tradeName}...`}
                      value={searchItem}
                      onChange={e => setSearchItem(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>Space Total:</span>
                    <span className="font-bold font-mono text-orange-600 dark:text-orange-400 text-sm">
                      {fmt(activeAnnexure.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Line Items List */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                        <th className="p-3 w-12 text-center">SR.</th>
                        <th className="p-3">Architectural Item Description & Technical Specs</th>
                        <th className="p-3 w-24 text-right">Quantity</th>
                        <th className="p-3 w-16 text-center">Unit</th>
                        <th className="p-3 w-24 text-right">Unit Rate (₹)</th>
                        <th className="p-3 w-28 text-right">Amount (₹)</th>
                        <th className="p-3 w-36 text-center">
                          <span className="flex items-center justify-center gap-1">
                            <span>Execution Progress</span>
                            <Percent className="w-3 h-3 text-emerald-500" />
                          </span>
                        </th>
                        <th className="p-3 w-20 text-center">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {(!activeAnnexure.items || activeAnnexure.items.length === 0) ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-400">
                            <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">No BOQ line items in Annexure {selectedTradeCode} for this space</p>
                            <p className="text-[11px] text-slate-400 mt-1">Subtotal of ₹{activeAnnexure.totalAmount.toLocaleString('en-IN')} is aggregated from summary sheet.</p>
                            <button
                              onClick={() => handleOpenAddModal(selectedTradeCode)}
                              className="mt-3 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-500/20 hover:bg-orange-500/20 transition-all inline-flex items-center gap-1.5"
                            >
                              <Plus className="w-3 h-3" /> Auto-Fill or Add Custom Item
                            </button>
                          </td>
                        </tr>
                      ) : (
                        activeAnnexure.items
                          .filter(item => searchItem === '' || item.description.toLowerCase().includes(searchItem.toLowerCase()) || (item.studioDrawingRef && item.studioDrawingRef.toLowerCase().includes(searchItem.toLowerCase())))
                          .map((item, idx) => {
                            const currentProgress = item.progressPercentage ?? (DEFAULT_TRADE_PROGRESS[selectedTradeCode] ?? 0);
                            return (
                              <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                <td className="p-3 text-center font-mono text-slate-400 font-bold">{idx + 1}</td>
                                <td className="p-3 font-medium text-slate-800 dark:text-slate-200">
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    {item.studioDrawingRef && (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                        {item.studioDrawingRef}
                                      </span>
                                    )}
                                    {item.isCustomRate && (
                                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                        CUSTOM
                                      </span>
                                    )}
                                    {item.subCategory && (
                                      <span className="text-[10px] text-slate-400 font-semibold">
                                        {item.subCategory}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">{item.description}</div>
                                  {item.vendorName && (
                                    <div className="text-[10px] text-slate-400 mt-0.5">Rate Card: {item.vendorName}</div>
                                  )}
                                </td>
                                <td className="p-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                                  {item.quantity.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="p-3 text-center font-mono text-slate-500">{item.unit}</td>
                                <td className="p-3 text-right font-mono text-slate-700 dark:text-slate-300">
                                  {item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="p-3 text-right font-mono font-bold text-orange-600 dark:text-orange-400">
                                  {item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>

                                {/* Site Execution Progress Control per Line Item */}
                                <td className="p-3 text-center">
                                  <div className="flex flex-col items-center gap-1 min-w-[130px]">
                                    <div className="flex items-center gap-1.5 w-full justify-center">
                                      <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        step={5}
                                        value={currentProgress}
                                        onChange={(e) => {
                                          const val = parseFloat(e.target.value);
                                          handleUpdateLineItemProgress(activeRoom.roomId, selectedTradeCode, item.id, isNaN(val) ? 0 : val);
                                        }}
                                        className={cn(
                                          "w-14 px-1.5 py-0.5 text-xs font-mono font-bold text-center rounded border focus:outline-none transition-all",
                                          currentProgress === 100
                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                            : currentProgress > 0
                                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                                        )}
                                      />
                                      <span className="text-[11px] font-bold text-slate-400">%</span>
                                    </div>
                                    {/* Progress track */}
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                      <div
                                        className={cn(
                                          "h-full rounded-full transition-all duration-300",
                                          currentProgress === 100
                                            ? "bg-emerald-500"
                                            : currentProgress >= 50
                                            ? "bg-blue-500"
                                            : currentProgress > 0
                                            ? "bg-amber-500"
                                            : "bg-transparent"
                                        )}
                                        style={{ width: `${currentProgress}%` }}
                                      />
                                    </div>
                                    {/* Quick action buttons */}
                                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => handleUpdateLineItemProgress(activeRoom.roomId, selectedTradeCode, item.id, 0)}
                                        className="px-1 py-0.2 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                                        title="Mark 0%"
                                      >
                                        0%
                                      </button>
                                      <button
                                        onClick={() => handleUpdateLineItemProgress(activeRoom.roomId, selectedTradeCode, item.id, 50)}
                                        className="px-1 py-0.2 rounded text-[9px] font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                        title="Mark 50%"
                                      >
                                        50%
                                      </button>
                                      <button
                                        onClick={() => handleUpdateLineItemProgress(activeRoom.roomId, selectedTradeCode, item.id, 100)}
                                        className="px-1 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                        title="Mark 100% (Done)"
                                      >
                                        100%
                                      </button>
                                    </div>
                                  </div>
                                </td>

                                <td className="p-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      onClick={() => handleOpenEditModal(item, selectedTradeCode)}
                                      className="p-1.5 rounded-lg hover:bg-orange-500/10 text-slate-400 hover:text-orange-500 transition-colors"
                                      title="Edit line item & auto-fill"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDuplicateLineItem(item)}
                                      className="p-1.5 rounded-lg hover:bg-blue-500/10 text-slate-400 hover:text-blue-500 transition-colors"
                                      title="Duplicate item"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteLineItem(item.id)}
                                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors"
                                      title="Remove item"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>

                    {/* Subtotal Row */}
                    <tfoot>
                      <tr className="bg-slate-100/70 dark:bg-slate-800/80 font-bold border-t-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                        <td colSpan={5} className="p-3 text-right uppercase text-xs">
                          Total Annexure {selectedTradeCode} ({activeAnnexure.tradeName}) Subtotal:
                        </td>
                        <td className="p-3 text-right font-mono text-sm text-orange-600 dark:text-orange-400">
                          {activeAnnexure.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-center">
                          <div className="text-[11px] font-bold font-mono text-emerald-600 dark:text-emerald-400">
                            {(() => {
                              const items = activeAnnexure.items || [];
                              if (items.length === 0) return `${DEFAULT_TRADE_PROGRESS[selectedTradeCode] ?? 0}% Avg`;
                              const sum = items.reduce((acc, it) => acc + (it.progressPercentage ?? (DEFAULT_TRADE_PROGRESS[selectedTradeCode] ?? 0)), 0);
                              return `${Math.round(sum / items.length)}% Avg`;
                            })()}
                          </div>
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: PROJECT VENDOR DISTRIBUTION ROSTER
            ========================================================================= */}
        {activeTab === 'vendor_roster' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  <span>Assigned Project Vendors Roster</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Contractors and trade suppliers assigned at project creation. Their verified rate cards dynamically populate all BOQ estimates.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {masterEstimate.assignedVendors.map(vendor => (
                <div
                  key={vendor.tradeCode}
                  className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-orange-500/40 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-black flex items-center justify-center">
                        {vendor.tradeCode}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{vendor.tradeName}</h4>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{vendor.vendorName}</div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {vendor.rateCardTier}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{vendor.vendorCategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contact Lead:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{vendor.contactPerson}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phone:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">{vendor.phone}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                      ★ {vendor.rating.toFixed(1)} Performance Score
                    </span>
                    <button
                      onClick={() => {
                        setSelectedTradeCode(vendor.tradeCode);
                        setActiveTab('vendor_rate_cards');
                      }}
                      className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1"
                    >
                      View Rate Card <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: LIVE VENDOR RATE CARDS
            ========================================================================= */}
        {activeTab === 'vendor_rate_cards' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-orange-500" />
                  <span>Master Vendor Rate Cards</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Verified unit rate schedules by trade category used for automatic rate population across all BOQ annexures.
                </p>
              </div>

              {/* Trade Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {TRADE_LIST.map(t => (
                  <button
                    key={t.code}
                    onClick={() => setSelectedTradeCode(t.code)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                      selectedTradeCode === t.code
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                    )}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Rate Card Table */}
            {activeRateCard ? (
              <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-orange-500 font-bold uppercase">Annexure {activeRateCard.tradeCode} Rate Schedule</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Live Synced with Vendor Directory
                      </span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">{activeRateCard.vendorName}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Category: <strong className="text-slate-700 dark:text-slate-300">{activeRateCard.tradeCategory}</strong> • Rates automatically populate in Room BOQs
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenAddRateModal()}
                      className="px-3.5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Rate Item to {activeRateCard.vendorName.split(' ')[0]}
                    </button>
                  </div>
                </div>

                {activeRateCard.rates.length === 0 ? (
                  <div className="text-center py-10 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <Tag className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">No Rate Items Configured for this Contractor</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Add standard trade specs to calculate BOQ lines with contractor-preferred rates.
                    </p>
                    <button
                      onClick={() => handleOpenAddRateModal()}
                      className="mt-3 px-4 py-2 rounded-lg bg-orange-500 text-white text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add First Rate Item
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                          <th className="p-3">Item Key</th>
                          <th className="p-3">Standard Architectural Specification</th>
                          <th className="p-3 w-20 text-center">Unit</th>
                          <th className="p-3 w-28 text-right">Standard Rate (₹)</th>
                          <th className="p-3 w-28 text-right">Preferred Tier Rate (₹)</th>
                          <th className="p-3 w-36">Remarks / Inclusions</th>
                          <th className="p-3 w-28 text-center">Actions</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {activeRateCard.rates.map(r => (
                          <tr key={r.itemKey} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="p-3 font-mono text-slate-400 font-bold">{r.itemKey}</td>
                            <td className="p-3">
                              <div className="font-medium text-slate-800 dark:text-slate-200">{r.description}</div>
                              <span className="text-[10px] text-orange-500/80 font-mono">Synced Vendor Rate</span>
                            </td>
                            <td className="p-3 text-center font-mono text-slate-500">
                              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                                {r.unit}
                              </span>
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                              ₹{r.standardRate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              ₹{r.preferredRate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="p-3 text-slate-400 text-[11px]">{r.specRemarks || '-'}</td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleInsertRateToCurrentBOQ(r)}
                                  className="px-2 py-1 rounded bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-[11px] font-bold"
                                  title="Insert into current room BOQ"
                                >
                                  + BOQ
                                </button>
                                <button
                                  onClick={() => handleOpenAddRateModal(r)}
                                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                  title="Edit rate item"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRateItemFromCost(activeRateCard.vendorId, r.itemKey)}
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
                )}
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <Tag className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Assigned Rate Card for Annexure {selectedTradeCode}</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Create a new rate card schedule or assign a contractor to this trade.
                </p>
                <button
                  onClick={() => handleOpenAddRateModal()}
                  className="mt-4 px-4 py-2 rounded-lg bg-orange-500 text-white text-xs font-bold inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create Rate Card for Annexure {selectedTradeCode}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl border border-slate-700 dark:border-slate-300 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: ADVANCED BOQ ITEM BUILDER WITH PRE-AUTO-FILL LIBRARY
          ========================================================================= */}
      {showAddLineModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                  {editingItemId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {editingItemId ? 'Edit BOQ Line Item' : 'Add / Auto-Fill BOQ Item'} — Annexure {selectedTradeCode} ({activeAnnexure.tradeName})
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>Space: <strong className="text-slate-700 dark:text-slate-300">{activeRoom.roomName}</strong></span>
                    <span>•</span>
                    <span>Carpet Area: <strong className="text-slate-700 dark:text-slate-300">{activeRoom.dimensionSpec.carpetAreaSqFt} Sq.ft.</strong></span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowAddLineModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            {/* Mode Switching Tabs */}
            <div className="px-6 pt-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setModalMode('autofill')}
                className={cn(
                  "pb-2.5 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all",
                  modalMode === 'autofill'
                    ? "border-orange-500 text-orange-600 dark:text-orange-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>⚡ Pre-Auto-Fill Library ({filteredLibraryItems.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setModalMode('vendor_rate_card')}
                className={cn(
                  "pb-2.5 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all",
                  modalMode === 'vendor_rate_card'
                    ? "border-orange-500 text-orange-600 dark:text-orange-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>📋 Assigned Contractor Rate Card</span>
              </button>

              <button
                type="button"
                onClick={() => setModalMode('custom')}
                className={cn(
                  "pb-2.5 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all",
                  modalMode === 'custom'
                    ? "border-orange-500 text-orange-600 dark:text-orange-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>✏️ Custom BOQ Item Builder</span>
              </button>
            </div>

            {/* Modal Content Scrollable Area */}
            <form onSubmit={handleSaveLineItem} className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
              {/* MODE 1: AUTO-FILL LIBRARY */}
              {modalMode === 'autofill' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search standard specs (e.g. Veneer, POP, CP, Italian marble)..."
                        value={librarySearch}
                        onChange={e => setLibrarySearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    {/* Trade Category Filter Pills */}
                    <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
                      <button
                        type="button"
                        onClick={() => setLibraryTradeFilter('ALL')}
                        className={cn(
                          "px-2.5 py-1 rounded text-[11px] font-bold whitespace-nowrap transition-all border",
                          libraryTradeFilter === 'ALL'
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent"
                        )}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={() => setLibraryTradeFilter('CUSTOM')}
                        className={cn(
                          "px-2.5 py-1 rounded text-[11px] font-bold whitespace-nowrap transition-all border",
                          libraryTradeFilter === 'CUSTOM'
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                        )}
                      >
                        ⭐ Saved Custom
                      </button>
                      {TRADE_LIST.map(t => (
                        <button
                          key={t.code}
                          type="button"
                          onClick={() => setLibraryTradeFilter(t.code)}
                          className={cn(
                            "px-2.5 py-1 rounded text-[11px] font-bold whitespace-nowrap transition-all border",
                            libraryTradeFilter === t.code
                              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200"
                          )}
                        >
                          {t.code}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Library Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1 scrollbar-none">
                    {filteredLibraryItems.length === 0 ? (
                      <div className="col-span-2 p-6 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                        <BookOpen className="w-6 h-6 mx-auto mb-1 opacity-40" />
                        <p className="text-xs font-semibold">No specifications found matching "{librarySearch}"</p>
                        <button
                          type="button"
                          onClick={() => setModalMode('custom')}
                          className="mt-2 text-xs font-bold text-orange-500 hover:underline"
                        >
                          + Create as New Custom Item
                        </button>
                      </div>
                    ) : (
                      filteredLibraryItems.map(item => {
                        const isSelected = selectedTemplateId === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelectAutoFillTemplate(item)}
                            className={cn(
                              "p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-2 group",
                              isSelected
                                ? "border-orange-500 bg-orange-500/5 dark:bg-orange-500/10 ring-1 ring-orange-500"
                                : "border-slate-200 dark:border-slate-800 hover:border-orange-500/50 bg-slate-50/50 dark:bg-slate-800/30"
                            )}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400">
                                  {item.title}
                                </span>
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400">
                                  ₹{item.defaultRate} / {item.unit}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                              <span className="font-semibold text-slate-600 dark:text-slate-300">
                                {item.tradeCategory} • {item.subCategory}
                              </span>
                              {item.studioDrawingRef && (
                                <span className="font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.2 rounded">
                                  {item.studioDrawingRef}
                                </span>
                              )}
                              {isSelected && (
                                <span className="text-orange-600 dark:text-orange-400 font-bold flex items-center gap-0.5">
                                  <Check className="w-3 h-3" /> Auto-Filled
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* MODE 2: VENDOR RATE CARD QUICK-PILLS & ADD CAPABILITY */}
              {modalMode === 'vendor_rate_card' && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Standard Unit Rates from Assigned Contractor ({activeRateCard?.vendorName || 'Assigned Contractor'})
                      </label>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                        Tier: {activeVendorForTrade?.rateCardTier || 'Verified Tier 1'} • Live Synced with Vendor Directory
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowInlineVendorAdd(!showInlineVendorAdd);
                        if (!showInlineVendorAdd) {
                          setRateFormDesc('');
                          setRateFormKey(`${selectedTradeCode}-${Date.now().toString().slice(-4)}`);
                          setRateFormStd(150);
                          setRateFormPref(135);
                          setRateFormUnit('Sq.ft.');
                          setRateFormRemarks('');
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-black flex items-center gap-1 transition-all self-start sm:self-auto shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {showInlineVendorAdd ? 'Close Add Form' : '+ Add Item to Vendor Rate Card'}
                    </button>
                  </div>

                  {/* Inline Add Rate Item Builder */}
                  {showInlineVendorAdd && (
                    <div className="p-3.5 rounded-xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/30 space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" />
                          Add New Rate Item to {activeRateCard?.vendorName || 'Vendor'}
                        </span>
                        <span className="text-[10px] text-slate-400">Saves directly to Vendor Directory</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                            Specification / Item Description *
                          </label>
                          <input
                            type="text"
                            value={rateFormDesc}
                            onChange={(e) => setRateFormDesc(e.target.value)}
                            placeholder="e.g., Gypsum false ceiling with GI framing & shadow groove"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:border-orange-500 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                            Unit
                          </label>
                          <select
                            value={rateFormUnit}
                            onChange={(e) => setRateFormUnit(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:border-orange-500 focus:outline-hidden"
                          >
                            <option value="Sq.ft.">Sq.ft.</option>
                            <option value="R.ft.">R.ft.</option>
                            <option value="Nos">Nos</option>
                            <option value="Sq.m.">Sq.m.</option>
                            <option value="Lump Sum">Lump Sum</option>
                            <option value="Set">Set</option>
                            <option value="Points">Points</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                            Standard Rate (₹)
                          </label>
                          <input
                            type="number"
                            value={rateFormStd}
                            onChange={(e) => setRateFormStd(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:border-orange-500 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                            Preferred Tier Rate (₹) *
                          </label>
                          <input
                            type="number"
                            value={rateFormPref}
                            onChange={(e) => setRateFormPref(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold focus:border-orange-500 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                            Remarks / Inclusions
                          </label>
                          <input
                            type="text"
                            value={rateFormRemarks}
                            onChange={(e) => setRateFormRemarks(e.target.value)}
                            placeholder="e.g., Inclusive of primer & GI hardware"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:border-orange-500 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-orange-500/20">
                        <button
                          type="button"
                          onClick={() => setShowInlineVendorAdd(false)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveRateItemFromCost()}
                          className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold shadow-sm"
                        >
                          Save to Vendor Rate Card & Select
                        </button>
                      </div>
                    </div>
                  )}

                  {activeRateCard && activeRateCard.rates.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 scrollbar-none">
                      {activeRateCard.rates.map(rcItem => {
                        const isSelected = selectedRateKey === rcItem.itemKey;
                        return (
                          <button
                            key={rcItem.itemKey}
                            type="button"
                            onClick={() => {
                              handleSelectVendorRate(rcItem.itemKey, rcItem.description, rcItem.preferredRate, rcItem.unit);
                              setSelectedRateKey(rcItem.itemKey);
                            }}
                            className={cn(
                              "p-3 rounded-xl text-left border transition-all flex flex-col justify-between gap-1 group",
                              isSelected
                                ? "bg-orange-500/10 border-orange-500 ring-1 ring-orange-500"
                                : "bg-slate-50 dark:bg-slate-800/50 hover:bg-orange-500/10 hover:border-orange-500/40 border-slate-200 dark:border-slate-700"
                            )}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-mono text-[10px] text-slate-400 font-bold">{rcItem.itemKey}</span>
                              <span className="font-bold text-xs text-orange-500 font-mono">
                                ₹{rcItem.preferredRate.toLocaleString('en-IN')} / {rcItem.unit}
                              </span>
                            </div>
                            <div className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-orange-600">
                              {rcItem.description}
                            </div>
                            {rcItem.specRemarks && (
                              <div className="text-[10px] text-slate-400 italic mt-0.5">{rcItem.specRemarks}</div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      <p>No rate items configured for Annexure {selectedTradeCode}.</p>
                      <button
                        type="button"
                        onClick={() => setShowInlineVendorAdd(true)}
                        className="mt-2 px-3 py-1.5 rounded-lg bg-orange-500 text-white text-[11px] font-bold inline-flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add First Item to Rate Card
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* MODE 3: CUSTOM BOQ ITEM FORM FIELDS */}
              {modalMode === 'custom' && (
                <div className="space-y-4 p-4 rounded-xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
                    <Bookmark className="w-4 h-4" />
                    <span>Create Custom Architectural Specification</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Short Title / Item Name
                      </label>
                      <input
                        type="text"
                        value={customItemTitle}
                        onChange={e => setCustomItemTitle(e.target.value)}
                        placeholder="e.g. Custom Fluted Acoustic Wall"
                        className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Sub-Category
                      </label>
                      <input
                        type="text"
                        value={customItemSubCategory}
                        onChange={e => setCustomItemSubCategory(e.target.value)}
                        placeholder="e.g. Acoustic Paneling"
                        className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Studio Drawing Reference (Optional)
                      </label>
                      <input
                        type="text"
                        value={newItemDrawingRef}
                        onChange={e => setNewItemDrawingRef(e.target.value)}
                        placeholder="e.g. DWG-WD-WR-09"
                        className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {!editingItemId && (
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={saveToLibraryCheckbox}
                        onChange={e => setSaveToLibraryCheckbox(e.target.checked)}
                        className="rounded text-orange-500 focus:ring-orange-500 w-4 h-4"
                      />
                      <span>Save this item to reusable BOQ library for future projects and auto-fill</span>
                    </label>
                  )}
                </div>
              )}

              {/* SHARED FIELDS: DESCRIPTION, QUANTITY & RATE */}
              <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Architectural Item Description & Scope of Work
                    </label>
                    <span className="text-[10px] text-slate-400">Include exact material, brand, thickness, and finish</span>
                  </div>
                  <textarea
                    rows={3}
                    value={newItemDesc}
                    onChange={e => setNewItemDesc(e.target.value)}
                    placeholder="e.g. Providing and fixing 19mm Marine ply paneling with veneer finish, PU matte coating, including teak wood edge bidding and installation hardware..."
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 leading-relaxed"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Quantity with quick room dimension presets */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Quantity
                      </label>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setNewItemQty(activeRoom.dimensionSpec.carpetAreaSqFt)}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-orange-500/10 text-slate-600 dark:text-slate-400 font-mono"
                          title="Set to Room Carpet Area"
                        >
                          Floor: {activeRoom.dimensionSpec.carpetAreaSqFt}
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewItemQty(activeRoom.dimensionSpec.perimeterRFt)}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-orange-500/10 text-slate-600 dark:text-slate-400 font-mono"
                          title="Set to Room Perimeter"
                        >
                          Perim: {activeRoom.dimensionSpec.perimeterRFt}
                        </button>
                      </div>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      value={newItemQty}
                      onChange={e => setNewItemQty(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Unit
                    </label>
                    <select
                      value={newItemUnit}
                      onChange={e => setNewItemUnit(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="Sq.ft.">Sq.ft. (Square Feet)</option>
                      <option value="R.ft.">R.ft. (Running Feet)</option>
                      <option value="No.">No. (Number)</option>
                      <option value="Nos">Nos (Numbers)</option>
                      <option value="L/S">L/S (Lump Sum)</option>
                      <option value="Set">Set</option>
                      <option value="Meter">Meter</option>
                      <option value="Kg">Kg</option>
                      <option value="Point">Point (Electrical)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Unit Rate (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newItemRate}
                      onChange={e => setNewItemRate(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono font-bold text-orange-600 dark:text-orange-400"
                      required
                    />
                  </div>
                </div>

                {/* Calculation Summary Bar */}
                <div className="p-3.5 rounded-xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-orange-500" />
                    <span className="text-slate-600 dark:text-slate-400">
                      Line Total = {newItemQty} {newItemUnit} × ₹{newItemRate} :
                    </span>
                  </div>
                  <span className="text-orange-600 dark:text-orange-400 font-mono text-base font-black">
                    {fmt((Number(newItemQty) || 0) * (Number(newItemRate) || 0))}
                  </span>
                </div>

                {/* Site Execution & Handover Progress (Phase 3 Engine) */}
                <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Phase 3 Site Execution Progress</span>
                    </label>
                    <span className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400">
                      {newItemProgress}% Completed
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={newItemProgress}
                      onChange={e => setNewItemProgress(parseInt(e.target.value) || 0)}
                      className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={newItemProgress}
                        onChange={e => setNewItemProgress(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                        className="w-16 px-2 py-1 text-xs font-mono font-bold text-center rounded-lg bg-white dark:bg-slate-800 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 focus:outline-none"
                      />
                      <span className="text-xs font-bold text-slate-400">%</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                    <span className="text-[10px] text-slate-400">
                      Syncs automatically with Studio Project Overview & Timeline Engine
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setNewItemProgress(0)}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-600 dark:text-slate-300 transition-colors"
                      >
                        Not Started (0%)
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewItemProgress(50)}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors"
                      >
                        In Progress (50%)
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewItemProgress(100)}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                      >
                        Handover Ready (100%)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddLineModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingItemId ? 'Update Line Item' : 'Insert into BOQ Annexure'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ASSIGN / SWITCH VENDOR FOR TRADE
          ========================================================================= */}
      {showVendorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Assign Contractor for Annexure {selectedTradeCode} ({activeAnnexure.tradeName})
                </h3>
                <span className="text-xs text-slate-500">Select verified vendor from vendor directory</span>
              </div>
              <button
                onClick={() => setShowVendorModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                {MOCK_ASSIGNED_PROJECT_VENDORS.map(v => (
                  <div
                    key={v.vendorId}
                    onClick={() => handleAssignVendor(selectedTradeCode, v)}
                    className={cn(
                      "p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between",
                      activeVendorForTrade?.vendorId === v.vendorId
                        ? "border-orange-500 bg-orange-500/5 dark:bg-orange-500/10"
                        : "border-slate-200 dark:border-slate-800 hover:border-orange-500/40"
                    )}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{v.vendorName}</div>
                      <div className="text-[11px] text-slate-500">{v.vendorCategory} • Lead: {v.contactPerson}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {v.rateCardTier}
                      </span>
                      <div className="text-[11px] font-bold text-amber-500 mt-1">★ {v.rating}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: ADD / EDIT RATE CARD ITEM (COST <-> VENDOR LIVE INTEGRATION)
          ========================================================================= */}
      {isRateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {editingRateKey ? 'Edit Rate Card Specification' : 'Add Rate Item to Vendor Rate Card'}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Annexure {selectedTradeCode} • {activeRateCard?.vendorName || activeVendorForTrade?.vendorName || 'Assigned Contractor'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsRateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRateItemFromCost} className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 text-xs text-orange-700 dark:text-orange-300 flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Bi-Directional Synchronization:</strong> Adding or updating this rate card item updates both the <strong>Cost Estimates Live Rate Cards</strong> and the <strong>Vendor Directory Rate Card Hub</strong> simultaneously.
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Item Key
                  </label>
                  <input
                    type="text"
                    value={rateFormKey}
                    onChange={(e) => setRateFormKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:border-orange-500 focus:outline-hidden"
                    placeholder="e.g., A-105"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Measurement Unit *
                  </label>
                  <select
                    value={rateFormUnit}
                    onChange={(e) => setRateFormUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:border-orange-500 focus:outline-hidden"
                  >
                    <option value="Sq.ft.">Sq.ft. (Square Feet)</option>
                    <option value="R.ft.">R.ft. (Running Feet)</option>
                    <option value="Nos">Nos (Count / Units)</option>
                    <option value="Sq.m.">Sq.m. (Square Metres)</option>
                    <option value="Lump Sum">Lump Sum</option>
                    <option value="Set">Set</option>
                    <option value="Points">Electrical / Plumbing Points</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Standard Architectural Specification / Description *
                </label>
                <textarea
                  rows={2}
                  value={rateFormDesc}
                  onChange={(e) => setRateFormDesc(e.target.value)}
                  placeholder="e.g., Saint Gobain 12.5mm Gyproc false ceiling with GI perimeter channels & cove lighting detail"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:border-orange-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Standard Market Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={rateFormStd}
                    onChange={(e) => setRateFormStd(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:border-orange-500 focus:outline-hidden"
                    min={0}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Tier Rate (₹) *
                  </label>
                  <input
                    type="number"
                    value={rateFormPref}
                    onChange={(e) => setRateFormPref(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold focus:border-orange-500 focus:outline-hidden"
                    min={0}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Scope Remarks / Hardware Inclusions
                </label>
                <input
                  type="text"
                  value={rateFormRemarks}
                  onChange={(e) => setRateFormRemarks(e.target.value)}
                  placeholder="e.g., Includes scaffolding, primer application & fastener hardware"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:border-orange-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRateModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingRateKey ? 'Update & Sync Rate Item' : 'Add to Vendor Rate Card'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formal Print Estimate & Client Presentation Modal */}
      <PrintEstimateModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        masterEstimate={masterEstimate}
        initialMode={printModalMode}
      />
    </div>
  );
}
