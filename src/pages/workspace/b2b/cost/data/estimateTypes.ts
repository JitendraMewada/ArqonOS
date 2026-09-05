export interface EstimateLineItem {
  id: string;
  itemNo: number | string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  category?: 'Civil' | 'POP' | 'Electric Wiring' | 'Electric Switches' | 'Electric Fixtures' | 'Carpentry' | 'Paint & Polish' | 'Miscellaneous' | 'Loose Furniture' | 'Aluminium Windows' | string;
  subCategory?: string;
  vendorId?: string;
  vendorName?: string;
  isCustomRate?: boolean;
  studioDrawingRef?: string;
  progressPercentage?: number; // 0-100 execution progress on site
}

export interface TradeAnnexure {
  id: string;
  tradeCode: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
  tradeName: string;
  tradeCategory: 'Civil' | 'POP' | 'Electric Wiring' | 'Electric Switches' | 'Electric Fixtures' | 'Carpentry' | 'Paint & Polish' | 'Miscellaneous' | 'Loose Furniture' | 'Aluminium Windows';
  assignedVendorId: string;
  assignedVendorName: string;
  vendorRating: number;
  items: EstimateLineItem[];
  totalAmount: number;
}

export interface RoomDimensionSpec {
  lengthFeet: number;
  lengthInches: number;
  widthFeet: number;
  widthInches: number;
  carpetAreaSqFt: number;
  perimeterRFt: number;
  lintelHeight: string; // e.g. "7'-0\""
  doorSize: string; // e.g. "3'-9\""
  windowCill: string; // e.g. "0'-6\""
  windowHeight: string; // e.g. "6'-6\""
  windowAbove: string; // e.g. "1'-10\""
  windowLength: string; // e.g. "20'-6\""
  beamHeight: string; // e.g. "1'-1\""
  clearHeight: string; // e.g. "8'-10\""
}

export interface RoomEstimateSheet {
  roomId: string;
  roomName: string;
  roomType: string;
  dimensionSpec: RoomDimensionSpec;
  annexures: Record<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J', TradeAnnexure>;
  totalRoomAmount: number;
  ratePerSqFt: number;
  percentageOfProject: number;
}

export interface ProjectVendorAssignment {
  tradeCode: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
  tradeName: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  rateCardTier: string;
  rating: number;
  contactPerson: string;
  phone: string;
  status: 'Assigned' | 'Negotiated' | 'Pending Confirmation';
}

export interface ProjectMasterEstimate {
  estimateNo: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  consultantName: string;
  date: string;
  totalCarpetAreaSqFt: number;
  totalProjectCost: number;
  overallRatePerSqFt: number;
  assignedVendors: ProjectVendorAssignment[];
  rooms: RoomEstimateSheet[];
  approvalInfo: {
    checkedBy: string;
    approvedBy: string;
    dateApproved: string;
    clientConfirmedDate?: string;
    status: 'Draft' | 'Checked' | 'Approved' | 'Client Confirmed';
  };
}

export interface VendorTradeRateCard {
  vendorId: string;
  vendorName: string;
  tradeCategory: string;
  tradeCode: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
  rates: {
    itemKey: string;
    description: string;
    unit: 'Sq.ft.' | 'R.ft.' | 'No.' | 'Nos' | 'L/S' | 'Set' | 'Mtrs' | 'Kg' | string;
    standardRate: number;
    preferredRate: number;
    specRemarks?: string;
  }[];
}
