import React, { useState, useRef } from 'react';
import {
  Printer,
  Download,
  FileSpreadsheet,
  X,
  Check,
  Building2,
  Layers,
  FileText,
  Sliders,
  Sparkles,
  Info,
  Copy,
  ExternalLink
} from 'lucide-react';
import { ProjectMasterEstimate } from '../data/estimateTypes';

interface PrintEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterEstimate: ProjectMasterEstimate;
  initialMode?: 'master_boq' | 'space_summary' | 'trade_summary' | 'client_quote';
}

export function PrintEstimateModal({
  isOpen,
  onClose,
  masterEstimate,
  initialMode = 'master_boq'
}: PrintEstimateModalProps) {
  const [viewMode, setViewMode] = useState<'master_boq' | 'space_summary' | 'trade_summary' | 'client_quote'>(initialMode);
  const [includeDimensions, setIncludeDimensions] = useState(true);
  const [includeVendors, setIncludeVendors] = useState(true);
  const [includeSignatures, setIncludeSignatures] = useState(true);
  const [includeTerms, setIncludeTerms] = useState(true);
  const [includeTaxes, setIncludeTaxes] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const printFrameRef = useRef<HTMLIFrameElement | null>(null);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Format currency helper
  const fmt = (num: number) => `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtNoDec = (num: number) => `₹${Math.round(num).toLocaleString('en-IN')}`;

  // Calculate totals
  const totalCarpetArea = masterEstimate.totalCarpetAreaSqFt || 1;
  const directWorksTotal = masterEstimate.totalProjectCost;
  const contingencyAmount = directWorksTotal * 0.05; // 5%
  const taxableSubtotal = directWorksTotal + contingencyAmount;
  const gstAmount = taxableSubtotal * 0.18; // 18% GST
  const grandTotal = includeTaxes ? (taxableSubtotal + gstAmount) : directWorksTotal;

  // Calculate total line items
  let totalLineItems = 0;
  masterEstimate.rooms.forEach(r => {
    Object.values(r.annexures).forEach(ann => {
      totalLineItems += (ann.items?.length || 0);
    });
  });

  // Calculate trade totals
  const tradesList = [
    { code: 'A', name: 'Civil Work', category: 'Civil' },
    { code: 'B', name: 'Plaster of Paris (POP)', category: 'POP' },
    { code: 'C', name: 'Electric Wiring', category: 'Electric Wiring' },
    { code: 'D', name: 'Electric Switches', category: 'Electric Switches' },
    { code: 'E', name: 'Electric Fixtures', category: 'Electric Fixtures' },
    { code: 'F', name: 'Carpentry & Millwork', category: 'Carpentry' },
    { code: 'G', name: 'Paint & Polish', category: 'Paint & Polish' },
    { code: 'H', name: 'Miscellaneous Works', category: 'Miscellaneous' },
    { code: 'I', name: 'Loose Furniture', category: 'Loose Furniture' },
    { code: 'J', name: 'Aluminium Windows', category: 'Aluminium Windows' }
  ];

  const tradeBreakdown = tradesList.map(t => {
    const total = masterEstimate.rooms.reduce((sum, r) => sum + (r.annexures[t.code as any]?.totalAmount || 0), 0);
    const vendor = masterEstimate.assignedVendors.find(v => v.tradeCode === t.code);
    return {
      ...t,
      total,
      ratePerSqFt: total / totalCarpetArea,
      percentage: (total / directWorksTotal) * 100,
      assignedVendorName: vendor?.vendorName || 'Unassigned',
      vendorTier: vendor?.rateCardTier || 'Approved'
    };
  });

  // Generate standalone full HTML string
  const generateStandaloneHtmlDocument = () => {
    const printTitle = `${masterEstimate.projectCode}_Estimate_${masterEstimate.estimateNo.replace(/\W+/g, '_')}`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${printTitle}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 11px;
      line-height: 1.4;
      padding: 16px;
    }
    .header-box {
      border-bottom: 2px solid #ea580c;
      padding-bottom: 12px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand-title {
      font-size: 18px;
      font-weight: 900;
      color: #ea580c;
      letter-spacing: -0.5px;
    }
    .brand-sub {
      font-size: 10px;
      color: #64748b;
      margin-top: 2px;
    }
    .doc-badge {
      display: inline-block;
      padding: 3px 8px;
      background: #fff7ed;
      color: #ea580c;
      border: 1px solid #fdba74;
      font-weight: 800;
      font-size: 10px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 10px 12px;
      border-radius: 6px;
      margin-bottom: 16px;
    }
    .meta-item {
      font-size: 10.5px;
    }
    .meta-label {
      color: #64748b;
      font-weight: 600;
      display: inline-block;
      width: 110px;
    }
    .meta-val {
      color: #0f172a;
      font-weight: 700;
    }
    .kpi-row {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    .kpi-card {
      flex: 1;
      padding: 8px 10px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
    }
    .kpi-title {
      font-size: 9px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 700;
    }
    .kpi-number {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      font-size: 10px;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-align: left;
      padding: 6px 8px;
      border: 1px solid #cbd5e1;
    }
    td {
      padding: 5px 8px;
      border: 1px solid #e2e8f0;
      vertical-align: top;
    }
    tr:nth-child(even) {
      background: #fafafa;
    }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .room-header {
      background: #ea580c !important;
      color: #ffffff !important;
      font-weight: 800;
      font-size: 11px;
      padding: 6px 8px;
    }
    .trade-header {
      background: #fff7ed;
      color: #c2410c;
      font-weight: 700;
      font-size: 10px;
    }
    .subtotal-row {
      font-weight: 700;
      background: #f8fafc;
    }
    .total-box {
      margin-top: 14px;
      margin-left: auto;
      width: 320px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 12px;
      font-size: 11px;
      border-bottom: 1px solid #f1f5f9;
    }
    .grand-total-row {
      background: #0f172a;
      color: #ffffff;
      font-weight: 800;
      font-size: 13px;
    }
    .terms-box {
      margin-top: 20px;
      padding: 10px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      background: #fafafa;
      font-size: 9.5px;
      color: #475569;
    }
    .terms-title {
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
      text-transform: uppercase;
    }
    .sig-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
      margin-top: 35px;
      page-break-inside: avoid;
    }
    .sig-box {
      border-top: 1px solid #94a3b8;
      padding-top: 6px;
      text-align: center;
      font-size: 9.5px;
    }
    .sig-name {
      font-weight: 700;
      color: #0f172a;
    }
    .sig-role {
      color: #64748b;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
      .page-break { page-break-after: always; break-after: page; }
      .avoid-break { page-break-inside: avoid; break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header-box">
    <div>
      <div class="brand-title">ArqonOS • Essence Interior Studio</div>
      <div class="brand-sub">Comprehensive Interior Design, Architecture & Cost Engineering Specification</div>
      <div class="brand-sub">License: CIN-U74140MH1998PTC115599 • GSTIN: 27AABCG1234F1Z8</div>
    </div>
    <div style="text-align: right;">
      <div class="doc-badge">Official Estimate & BOQ</div>
      <div style="font-size: 12px; font-weight: 800; margin-top: 4px;"># ${masterEstimate.estimateNo}</div>
      <div style="font-size: 9.5px; color: #64748b;">Date: ${masterEstimate.date} | Status: ${masterEstimate.approvalInfo.status}</div>
    </div>
  </div>

  <div class="meta-grid">
    <div>
      <div class="meta-item"><span class="meta-label">Project Name:</span> <span class="meta-val">${masterEstimate.projectName}</span></div>
      <div class="meta-item"><span class="meta-label">Project Code:</span> <span class="meta-val">${masterEstimate.projectCode}</span></div>
      <div class="meta-item"><span class="meta-label">Client Name:</span> <span class="meta-val">${masterEstimate.clientName}</span></div>
    </div>
    <div>
      <div class="meta-item"><span class="meta-label">Total Carpet Area:</span> <span class="meta-val">${masterEstimate.totalCarpetAreaSqFt.toLocaleString('en-IN')} Sq.Ft.</span></div>
      <div class="meta-item"><span class="meta-label">Prepared By:</span> <span class="meta-val">${masterEstimate.approvalInfo.checkedBy}</span></div>
      <div class="meta-item"><span class="meta-label">Approved By:</span> <span class="meta-val">${masterEstimate.approvalInfo.approvedBy}</span></div>
    </div>
  </div>

  <div class="kpi-row">
    <div class="kpi-card">
      <div class="kpi-title">Total Project Value</div>
      <div class="kpi-number" style="color: #ea580c;">${fmt(grandTotal)}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Average Rate</div>
      <div class="kpi-number">${fmt(grandTotal / totalCarpetArea)} / sq.ft.</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Total Spaces</div>
      <div class="kpi-number">${masterEstimate.rooms.length} Areas</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">BOQ Line Items</div>
      <div class="kpi-number">${totalLineItems} Specified</div>
    </div>
  </div>

  ${viewMode === 'trade_summary' || viewMode === 'client_quote' ? `
    <h3 style="font-size: 13px; font-weight: 800; margin-bottom: 8px; color: #0f172a;">Consolidated Trade Abstract & Contractor Allocation</h3>
    <table>
      <thead>
        <tr>
          <th style="width: 30px;" class="text-center">Code</th>
          <th>Trade Classification</th>
          ${includeVendors ? '<th>Allocated Trade Vendor</th>' : ''}
          <th style="width: 80px;" class="text-right">Rate / Sq.Ft.</th>
          <th style="width: 60px;" class="text-right">Share %</th>
          <th style="width: 110px;" class="text-right">Estimated Amount</th>
        </tr>
      </thead>
      <tbody>
        ${tradeBreakdown.map(tb => `
          <tr>
            <td class="text-center font-bold">${tb.code}</td>
            <td class="font-bold">${tb.name}</td>
            ${includeVendors ? `<td>${tb.assignedVendorName} <span style="font-size: 8.5px; color: #64748b;">(${tb.vendorTier})</span></td>` : ''}
            <td class="text-right font-mono">${fmtNoDec(tb.ratePerSqFt)}</td>
            <td class="text-right">${tb.percentage.toFixed(1)}%</td>
            <td class="text-right font-bold font-mono">${fmt(tb.total)}</td>
          </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr class="subtotal-row">
          <td colspan="${includeVendors ? 3 : 2}" class="text-right">Direct Works Subtotal:</td>
          <td class="text-right font-mono">${fmtNoDec(directWorksTotal / totalCarpetArea)}</td>
          <td class="text-right">100.0%</td>
          <td class="text-right font-mono" style="color: #ea580c;">${fmt(directWorksTotal)}</td>
        </tr>
      </tfoot>
    </table>
  ` : ''}

  ${viewMode === 'space_summary' ? `
    <h3 style="font-size: 13px; font-weight: 800; margin-bottom: 8px; color: #0f172a;">Space-by-Space Cost Breakdown</h3>
    <table>
      <thead>
        <tr>
          <th style="width: 30px;" class="text-center">#</th>
          <th>Space / Room Name</th>
          <th>Type</th>
          ${includeDimensions ? '<th class="text-center">Dimensions (L × W)</th>' : ''}
          <th style="width: 90px;" class="text-right">Carpet Area</th>
          <th style="width: 90px;" class="text-right">Rate / Sq.Ft.</th>
          <th style="width: 60px;" class="text-right">Share %</th>
          <th style="width: 120px;" class="text-right">Room Total</th>
        </tr>
      </thead>
      <tbody>
        ${masterEstimate.rooms.map((r, idx) => `
          <tr>
            <td class="text-center">${idx + 1}</td>
            <td class="font-bold">${r.roomName}</td>
            <td style="color: #64748b;">${r.roomType}</td>
            ${includeDimensions ? `<td class="text-center">${r.dimensionSpec.lengthFeet}'${r.dimensionSpec.lengthInches}" × ${r.dimensionSpec.widthFeet}'${r.dimensionSpec.widthInches}"</td>` : ''}
            <td class="text-right font-mono">${r.dimensionSpec.carpetAreaSqFt} sq.ft.</td>
            <td class="text-right font-mono">${fmtNoDec(r.ratePerSqFt)}</td>
            <td class="text-right">${r.percentageOfProject.toFixed(1)}%</td>
            <td class="text-right font-bold font-mono">${fmt(r.totalRoomAmount)}</td>
          </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr class="subtotal-row">
          <td colspan="${includeDimensions ? 4 : 3}" class="text-right font-bold">Total Project Spaces:</td>
          <td class="text-right font-mono font-bold">${totalCarpetArea} sq.ft.</td>
          <td class="text-right font-mono">${fmtNoDec(directWorksTotal / totalCarpetArea)}</td>
          <td class="text-right">100.0%</td>
          <td class="text-right font-mono font-bold" style="color: #ea580c;">${fmt(directWorksTotal)}</td>
        </tr>
      </tfoot>
    </table>
  ` : ''}

  ${viewMode === 'master_boq' ? `
    <h3 style="font-size: 13px; font-weight: 800; margin-bottom: 8px; color: #0f172a;">Itemized Bill of Quantities (BOQ) — All Spaces & Trade Annexures</h3>
    ${masterEstimate.rooms.map((room) => `
      <div class="avoid-break" style="margin-bottom: 16px;">
        <table>
          <thead>
            <tr>
              <th colspan="7" class="room-header">
                ${room.roomName} (${room.roomType}) • Carpet: ${room.dimensionSpec.carpetAreaSqFt} Sq.Ft. • Total: ${fmt(room.totalRoomAmount)}
                ${includeDimensions ? ` [${room.dimensionSpec.lengthFeet}'${room.dimensionSpec.lengthInches}" × ${room.dimensionSpec.widthFeet}'${room.dimensionSpec.widthInches}", Clear Ht: ${room.dimensionSpec.clearHeight}]` : ''}
              </th>
            </tr>
            <tr>
              <th style="width: 32px;" class="text-center">No.</th>
              <th>Description of Work / Material Specification</th>
              <th style="width: 55px;" class="text-center">Unit</th>
              <th style="width: 65px;" class="text-right">Qty</th>
              <th style="width: 75px;" class="text-right">Rate (₹)</th>
              <th style="width: 90px;" class="text-right">Amount (₹)</th>
              ${includeVendors ? '<th style="width: 90px;">Contractor</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${Object.values(room.annexures).map((ann) => {
              if (!ann.items || ann.items.length === 0) return '';
              return `
                <tr class="trade-header">
                  <td colspan="${includeVendors ? 7 : 6}" style="font-weight: 700; padding: 4px 8px;">
                    Annexure ${ann.tradeCode}: ${ann.tradeName} — Subtotal: ${fmt(ann.totalAmount)}
                  </td>
                </tr>
                ${ann.items.map((item, itemIdx) => `
                  <tr>
                    <td class="text-center">${itemIdx + 1}</td>
                    <td>
                      <div style="font-weight: 600;">${item.description}</div>
                      ${item.studioDrawingRef ? `<div style="font-size: 8.5px; color: #ea580c;">Ref: ${item.studioDrawingRef}</div>` : ''}
                    </td>
                    <td class="text-center">${item.unit}</td>
                    <td class="text-right font-mono">${item.quantity.toLocaleString('en-IN')}</td>
                    <td class="text-right font-mono">${item.rate.toLocaleString('en-IN')}</td>
                    <td class="text-right font-mono font-bold">${item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    ${includeVendors ? `<td style="font-size: 8.5px; color: #64748b;">${ann.assignedVendorName || 'Apex'}</td>` : ''}
                  </tr>
                `).join('')}
              `;
            }).join('')}
          </tbody>
          <tfoot>
            <tr class="subtotal-row">
              <td colspan="${includeVendors ? 5 : 4}" class="text-right">Total for ${room.roomName}:</td>
              <td class="text-right font-mono font-bold" style="color: #ea580c;">${fmt(room.totalRoomAmount)}</td>
              ${includeVendors ? '<td></td>' : ''}
            </tr>
          </tfoot>
        </table>
      </div>
    `).join('')}
  ` : ''}

  <!-- Final Recapitulation Box -->
  <div class="avoid-break" style="display: flex; justify-content: flex-end;">
    <div class="total-box">
      <div class="total-row">
        <span>Direct Works Subtotal:</span>
        <span class="font-mono font-bold">${fmt(directWorksTotal)}</span>
      </div>
      <div class="total-row">
        <span>Contingency & Supervision (5%):</span>
        <span class="font-mono">${fmt(contingencyAmount)}</span>
      </div>
      ${includeTaxes ? `
        <div class="total-row">
          <span>Applicable GST (18%):</span>
          <span class="font-mono">${fmt(gstAmount)}</span>
        </div>
      ` : ''}
      <div class="total-row grand-total-row">
        <span>Grand Total Payable:</span>
        <span class="font-mono">${fmt(grandTotal)}</span>
      </div>
    </div>
  </div>

  ${includeTerms ? `
    <div class="terms-box avoid-break">
      <div class="terms-title">Standard Terms & Commercial Conditions</div>
      <ol style="padding-left: 14px; line-height: 1.5;">
        <li>All rates are firm and valid for a period of thirty (30) calendar days from the date of issuance.</li>
        <li>Quantities are derived from latest architectural specifications and dimensions in Arqon Studio. Any deviation on site will be measured on actuals.</li>
        <li>Payment Milestones: 15% Booking Advance, 30% Civil & MEP Completion, 35% Millwork & Fixed Joinery, 15% Finishes & Fixtures, 5% Handover.</li>
        <li>Uninterrupted electricity, water supply, and building society permissions are to be facilitated by the client.</li>
      </ol>
    </div>
  ` : ''}

  ${includeSignatures ? `
    <div class="sig-grid avoid-break">
      <div class="sig-box">
        <div class="sig-name">${masterEstimate.approvalInfo.checkedBy}</div>
        <div class="sig-role">Lead Cost Estimator</div>
      </div>
      <div class="sig-box">
        <div class="sig-name">${masterEstimate.approvalInfo.approvedBy}</div>
        <div class="sig-role">Principal Consultant / Partner</div>
      </div>
      <div class="sig-box">
        <div class="sig-name">${masterEstimate.clientName}</div>
        <div class="sig-role">Client Acceptance & Signature</div>
      </div>
    </div>
  ` : ''}

  <script>
    // Auto-trigger print if requested via query or standalone open
    if (window.location.search.includes('autoprint=true')) {
      window.onload = function() {
        setTimeout(function() { window.print(); }, 400);
      };
    }
  </script>
</body>
</html>`;
  };

  // Print in New Tab (Bypasses iframe sandbox restrictions)
  const handleOpenInNewTab = () => {
    try {
      const htmlContent = generateStandaloneHtmlDocument();
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const newWin = window.open(url, '_blank');
      if (newWin) {
        showNotification('✓ Opened printable estimate in new tab.');
      } else {
        // Fallback to direct print if popup blocker intervened
        handlePrint();
      }
    } catch (err) {
      console.error('Open in new tab failed:', err);
      handlePrint();
    }
  };

  // Robust Print Handler
  const handlePrint = () => {
    setIsPrinting(true);
    try {
      // 1. Try off-screen iframe printing first (does not change parent page layout)
      let printFrame = printFrameRef.current;
      if (!printFrame) {
        printFrame = document.createElement('iframe');
        printFrame.id = 'estimate-print-frame';
        printFrame.style.position = 'fixed';
        printFrame.style.left = '-9999px';
        printFrame.style.top = '-9999px';
        printFrame.style.width = '1024px';
        printFrame.style.height = '1024px';
        printFrame.style.border = '0';
        printFrame.style.opacity = '0';
        printFrame.style.pointerEvents = 'none';
        document.body.appendChild(printFrame);
        printFrameRef.current = printFrame;
      }

      const doc = printFrame.contentDocument || printFrame.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(generateStandaloneHtmlDocument());
        doc.close();

        setTimeout(() => {
          try {
            printFrame?.contentWindow?.focus();
            printFrame?.contentWindow?.print();
            setIsPrinting(false);
            showNotification('✓ Print dialog invoked.');
          } catch (iframeErr) {
            console.warn('Iframe print restricted by sandbox. Falling back to window.print()...', iframeErr);
            // Fallback to window.print()
            try {
              window.print();
              setIsPrinting(false);
            } catch (winErr) {
              console.error('window.print also blocked:', winErr);
              setIsPrinting(false);
              // Fallback to opening in new window or downloading
              handleOpenInNewTab();
            }
          }
        }, 500);
      } else {
        window.print();
        setIsPrinting(false);
      }
    } catch (err) {
      console.error('Print execution failed:', err);
      setIsPrinting(false);
      handleOpenInNewTab();
    }
  };

  // Download Standalone HTML file
  const handleDownloadHtml = () => {
    try {
      const htmlContent = generateStandaloneHtmlDocument();
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Estimate_${masterEstimate.projectCode}_${masterEstimate.estimateNo.replace(/\W+/g, '_')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification('✓ Downloaded standalone print-ready HTML! Open in any browser to print to PDF.');
    } catch (err) {
      console.error('Download HTML failed:', err);
      showNotification('Failed to generate HTML file.');
    }
  };

  // Export Full BOQ as CSV
  const handleExportCsv = () => {
    try {
      const headers = ['Space / Room', 'Room Type', 'Trade Code', 'Trade Classification', 'Item No', 'Work Description', 'Unit', 'Quantity', 'Unit Rate (INR)', 'Amount (INR)', 'Drawing Ref', 'Contractor'];
      const rows: string[][] = [headers];

      masterEstimate.rooms.forEach(room => {
        Object.values(room.annexures).forEach(ann => {
          (ann.items || []).forEach((item, idx) => {
            rows.push([
              `"${room.roomName.replace(/"/g, '""')}"`,
              `"${room.roomType.replace(/"/g, '""')}"`,
              `"${ann.tradeCode}"`,
              `"${ann.tradeName.replace(/"/g, '""')}"`,
              `"${idx + 1}"`,
              `"${item.description.replace(/"/g, '""')}"`,
              `"${item.unit}"`,
              `${item.quantity}`,
              `${item.rate}`,
              `${item.amount}`,
              `"${item.studioDrawingRef || ''}"`,
              `"${ann.assignedVendorName || ''}"`
            ]);
          });
        });
      });

      const csvContent = rows.map(r => r.join(',')).join('\n');
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `BOQ_${masterEstimate.projectCode}_Master.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification('✓ Exported comprehensive BOQ spreadsheet (.csv)');
    } catch (err) {
      console.error('CSV export failed:', err);
      showNotification('Failed to export CSV.');
    }
  };

  // Copy Summary to Clipboard
  const handleCopySummary = () => {
    const summaryText = `OFFICIAL ESTIMATE SUMMARY
Project: ${masterEstimate.projectName} (${masterEstimate.projectCode})
Estimate No: ${masterEstimate.estimateNo}
Client: ${masterEstimate.clientName}
Date: ${masterEstimate.date}
Total Carpet Area: ${masterEstimate.totalCarpetAreaSqFt} Sq.Ft.

Direct Works: ${fmt(directWorksTotal)}
Contingency (5%): ${fmt(contingencyAmount)}
GST (18%): ${fmt(gstAmount)}
Grand Total: ${fmt(grandTotal)}
Rate / Sq.Ft.: ${fmt(grandTotal / totalCarpetArea)} / sq.ft.
Total Line Items: ${totalLineItems} across ${masterEstimate.rooms.length} spaces.`;

    navigator.clipboard.writeText(summaryText);
    showNotification('✓ Estimate summary copied to clipboard.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-in fade-in duration-150">
      {/* Off-screen iframe used for zero-bleed direct browser printing without display:none bugs */}
      <iframe
        ref={printFrameRef}
        id="estimate-print-frame"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '-9999px',
          width: '1024px',
          height: '1024px',
          border: '0',
          opacity: 0,
          pointerEvents: 'none'
        }}
        title="Print Estimate Frame"
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Control Bar (Hidden when printing via index.css .no-print) */}
        <div className="no-print p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Print & Export Estimate Specification
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {masterEstimate.approvalInfo.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {masterEstimate.projectName} • #{masterEstimate.estimateNo}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Copy executive figures to clipboard"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy Summary</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              title="Download itemized BOQ spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleDownloadHtml}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              title="Download standalone HTML for printing or saving to PDF in any browser"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save as PDF / HTML</span>
            </button>

            <button
              onClick={handleOpenInNewTab}
              className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Open full printable estimate in a new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-orange-500" />
              <span className="hidden sm:inline">Open in Tab</span>
            </button>

            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 active:scale-98 text-white text-xs font-black transition-all shadow-md shadow-orange-500/25 flex items-center gap-2"
              title="Open browser print dialog"
            >
              <Printer className="w-4 h-4" />
              <span>{isPrinting ? 'Preparing...' : 'Print Document'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Customization & View Toolbar (no-print) */}
        <div className="no-print px-4 sm:px-6 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* View Modes */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('master_boq')}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                viewMode === 'master_boq'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Master BOQ ({totalLineItems} Items)
            </button>
            <button
              onClick={() => setViewMode('space_summary')}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                viewMode === 'space_summary'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Space Abstract ({masterEstimate.rooms.length})
            </button>
            <button
              onClick={() => setViewMode('trade_summary')}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                viewMode === 'trade_summary'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Trade Abstract (10 Guilds)
            </button>
            <button
              onClick={() => setViewMode('client_quote')}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                viewMode === 'client_quote'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Client Quote
            </button>
          </div>

          {/* Document Toggles */}
          <div className="flex items-center flex-wrap gap-3 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeDimensions}
                onChange={e => setIncludeDimensions(e.target.checked)}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span>Dimensions</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeVendors}
                onChange={e => setIncludeVendors(e.target.checked)}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span>Contractors</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTaxes}
                onChange={e => setIncludeTaxes(e.target.checked)}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span>GST & Taxes (18%)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSignatures}
                onChange={e => setIncludeSignatures(e.target.checked)}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span>Sign-off Blocks</span>
            </label>
          </div>
        </div>

        {/* Toast alert */}
        {toastMsg && (
          <div className="no-print px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between">
            <span>{toastMsg}</span>
            <button onClick={() => setToastMsg(null)} className="text-emerald-500 hover:text-emerald-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Printable Document Preview Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 dark:bg-slate-950/60">
          <div
            id="printable-estimate-document"
            className="max-w-4xl mx-auto bg-white text-slate-900 p-6 sm:p-10 shadow-lg rounded-xl border border-slate-200 text-xs font-sans transition-all"
          >
            {/* Formal Letterhead */}
            <div className="border-b-2 border-orange-500 pb-4 mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-xl font-black text-orange-600 tracking-tight flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-orange-500 inline" />
                  <span>ArqonOS • Essence Interior Studio</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-1">
                  Architecture • Interior Planning • Project Management • Cost Engineering
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Reg: CIN-U74140MH1998PTC115599 • GSTIN: 27AABCG1234F1Z8 • Mumbai, MH, India
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-block px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-black rounded uppercase tracking-wider">
                  Estimate & BOQ
                </span>
                <div className="text-xs font-black text-slate-900 mt-1 font-mono">
                  #{masterEstimate.estimateNo}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Date: <strong>{masterEstimate.date}</strong> • Rev: <strong>R2.1</strong>
                </div>
              </div>
            </div>

            {/* Project & Client Metadata Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg mb-5 text-[11px]">
              <div className="space-y-1">
                <div><span className="text-slate-500 font-bold inline-block w-28">Project Name:</span> <strong className="text-slate-900">{masterEstimate.projectName}</strong></div>
                <div><span className="text-slate-500 font-bold inline-block w-28">Project Code:</span> <span className="font-mono font-bold text-slate-900">{masterEstimate.projectCode}</span></div>
                <div><span className="text-slate-500 font-bold inline-block w-28">Client Name:</span> <strong className="text-slate-900">{masterEstimate.clientName}</strong></div>
              </div>
              <div className="space-y-1">
                <div><span className="text-slate-500 font-bold inline-block w-32">Total Carpet Area:</span> <strong className="text-slate-900">{masterEstimate.totalCarpetAreaSqFt.toLocaleString('en-IN')} Sq.Ft.</strong></div>
                <div><span className="text-slate-500 font-bold inline-block w-32">Lead Estimator:</span> <span className="text-slate-800">{masterEstimate.approvalInfo.checkedBy}</span></div>
                <div><span className="text-slate-500 font-bold inline-block w-32">Approved By:</span> <span className="text-slate-800">{masterEstimate.approvalInfo.approvedBy}</span></div>
              </div>
            </div>

            {/* KPI Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Estimate Value</span>
                <strong className="text-sm sm:text-base font-black text-orange-600 font-mono mt-0.5 block">{fmt(grandTotal)}</strong>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Rate / Sq.Ft.</span>
                <strong className="text-sm font-black text-slate-900 font-mono mt-0.5 block">{fmt(grandTotal / totalCarpetArea)}</strong>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Design Spaces</span>
                <strong className="text-sm font-black text-slate-900 mt-0.5 block">{masterEstimate.rooms.length} Areas</strong>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Itemized BOQ Items</span>
                <strong className="text-sm font-black text-slate-900 mt-0.5 block">{totalLineItems} Lines</strong>
              </div>
            </div>

            {/* VIEW 1: MASTER DETAILED BOQ */}
            {viewMode === 'master_boq' && (
              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
                  Itemized Bill of Quantities (BOQ) — All Spaces & Trade Annexures
                </h3>

                {masterEstimate.rooms.map((room, roomIdx) => (
                  <div key={room.roomId} className="border border-slate-200 rounded-lg overflow-hidden page-break-inside-avoid">
                    {/* Room Header */}
                    <div className="bg-orange-500 text-white p-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[10px] font-black flex items-center justify-center">
                          {roomIdx + 1}
                        </span>
                        <span className="font-black text-xs sm:text-sm">{room.roomName}</span>
                        <span className="text-[10px] opacity-90">({room.roomType})</span>
                      </div>
                      <div className="text-right text-xs">
                        <span className="opacity-80 text-[10px] mr-2">Carpet: {room.dimensionSpec.carpetAreaSqFt} Sq.Ft.</span>
                        <strong className="font-mono font-black">{fmt(room.totalRoomAmount)}</strong>
                      </div>
                    </div>

                    {includeDimensions && (
                      <div className="bg-orange-50/70 border-b border-orange-200 px-3 py-1.5 text-[10px] text-orange-950 flex flex-wrap gap-4 font-medium">
                        <span><strong>Dimensions:</strong> {room.dimensionSpec.lengthFeet}'{room.dimensionSpec.lengthInches}" × {room.dimensionSpec.widthFeet}'{room.dimensionSpec.widthInches}"</span>
                        <span><strong>Perimeter:</strong> {room.dimensionSpec.perimeterRFt} R.ft.</span>
                        <span><strong>Clear Height:</strong> {room.dimensionSpec.clearHeight}</span>
                        <span><strong>Rate:</strong> {fmt(room.ratePerSqFt)} / sq.ft.</span>
                      </div>
                    )}

                    {/* Annexure Tables inside Room */}
                    <div className="divide-y divide-slate-200">
                      {Object.values(room.annexures).map((ann) => {
                        if (!ann.items || ann.items.length === 0) return null;
                        return (
                          <div key={ann.id || ann.tradeCode} className="p-3">
                            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-black text-[10px]">
                                  Annexure {ann.tradeCode}
                                </span>
                                <span className="font-bold text-slate-800 text-xs">{ann.tradeName}</span>
                                {includeVendors && ann.assignedVendorName && (
                                  <span className="text-[10px] text-slate-400">
                                    • {ann.assignedVendorName}
                                  </span>
                                )}
                              </div>
                              <strong className="text-slate-800 font-mono text-xs">{fmt(ann.totalAmount)}</strong>
                            </div>

                            <table className="w-full text-left text-[10.5px]">
                              <thead>
                                <tr className="text-slate-400 border-b border-slate-200 text-[9.5px] uppercase font-bold">
                                  <th className="py-1 w-8 text-center">#</th>
                                  <th className="py-1">Specification & Scope Description</th>
                                  <th className="py-1 w-12 text-center">Unit</th>
                                  <th className="py-1 w-16 text-right">Qty</th>
                                  <th className="py-1 w-18 text-right">Rate</th>
                                  <th className="py-1 w-24 text-right">Amount</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {ann.items.map((item, itemIdx) => (
                                  <tr key={item.id || itemIdx} className="hover:bg-slate-50">
                                    <td className="py-1.5 text-center text-slate-400 text-[10px]">{itemIdx + 1}</td>
                                    <td className="py-1.5 pr-2">
                                      <div className="font-semibold text-slate-800">{item.description}</div>
                                      {item.studioDrawingRef && (
                                        <div className="text-[9px] text-orange-600 font-medium">Ref: {item.studioDrawingRef}</div>
                                      )}
                                    </td>
                                    <td className="py-1.5 text-center text-slate-600">{item.unit}</td>
                                    <td className="py-1.5 text-right font-mono text-slate-800">{item.quantity.toLocaleString('en-IN')}</td>
                                    <td className="py-1.5 text-right font-mono text-slate-800">₹{item.rate.toLocaleString('en-IN')}</td>
                                    <td className="py-1.5 text-right font-mono font-bold text-slate-900">₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VIEW 2: SPACE ABSTRACT */}
            {viewMode === 'space_summary' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
                  Space-by-Space Cost Breakdown & Room Abstract
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5 w-10 text-center">#</th>
                        <th className="p-2.5">Space Name</th>
                        <th className="p-2.5">Type</th>
                        {includeDimensions && <th className="p-2.5 text-center">Dimensions</th>}
                        <th className="p-2.5 text-right w-24">Carpet Area</th>
                        <th className="p-2.5 text-right w-24">Rate / Sq.Ft.</th>
                        <th className="p-2.5 text-right w-20">Share %</th>
                        <th className="p-2.5 text-right w-32">Total Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {masterEstimate.rooms.map((room, idx) => (
                        <tr key={room.roomId} className="hover:bg-slate-50">
                          <td className="p-2.5 text-center text-slate-400 font-bold">{idx + 1}</td>
                          <td className="p-2.5 font-bold text-slate-900">{room.roomName}</td>
                          <td className="p-2.5 text-slate-500">{room.roomType}</td>
                          {includeDimensions && (
                            <td className="p-2.5 text-center text-slate-600 font-mono">
                              {room.dimensionSpec.lengthFeet}'{room.dimensionSpec.lengthInches}" × {room.dimensionSpec.widthFeet}'{room.dimensionSpec.widthInches}"
                            </td>
                          )}
                          <td className="p-2.5 text-right font-mono text-slate-700">{room.dimensionSpec.carpetAreaSqFt} sq.ft.</td>
                          <td className="p-2.5 text-right font-mono text-slate-700">{fmtNoDec(room.ratePerSqFt)}</td>
                          <td className="p-2.5 text-right font-bold text-slate-600">{room.percentageOfProject.toFixed(1)}%</td>
                          <td className="p-2.5 text-right font-mono font-black text-slate-900">{fmt(room.totalRoomAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
                      <tr>
                        <td colSpan={includeDimensions ? 4 : 3} className="p-2.5 text-right font-black">
                          Total Direct Works:
                        </td>
                        <td className="p-2.5 text-right font-mono font-black">{totalCarpetArea} sq.ft.</td>
                        <td className="p-2.5 text-right font-mono font-black">{fmtNoDec(directWorksTotal / totalCarpetArea)}</td>
                        <td className="p-2.5 text-right font-black">100.0%</td>
                        <td className="p-2.5 text-right font-mono font-black text-orange-600">{fmt(directWorksTotal)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 3: TRADE ABSTRACT */}
            {(viewMode === 'trade_summary' || viewMode === 'client_quote') && (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
                  Consolidated Trade Abstract & Contractor Allocation
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5 w-12 text-center">Code</th>
                        <th className="p-2.5">Trade Classification</th>
                        {includeVendors && <th className="p-2.5">Assigned Trade Contractor</th>}
                        <th className="p-2.5 text-right w-24">Rate / Sq.Ft.</th>
                        <th className="p-2.5 text-right w-20">Share %</th>
                        <th className="p-2.5 text-right w-32">Total Estimated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tradeBreakdown.map((tb) => (
                        <tr key={tb.code} className="hover:bg-slate-50">
                          <td className="p-2.5 text-center font-black text-orange-600">{tb.code}</td>
                          <td className="p-2.5 font-bold text-slate-900">{tb.name}</td>
                          {includeVendors && (
                            <td className="p-2.5 text-slate-600">
                              <span className="font-semibold">{tb.assignedVendorName}</span>
                              <span className="text-[10px] text-slate-400 block">{tb.vendorTier}</span>
                            </td>
                          )}
                          <td className="p-2.5 text-right font-mono text-slate-700">{fmtNoDec(tb.ratePerSqFt)}</td>
                          <td className="p-2.5 text-right font-bold text-slate-600">{tb.percentage.toFixed(1)}%</td>
                          <td className="p-2.5 text-right font-mono font-black text-slate-900">{fmt(tb.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
                      <tr>
                        <td colSpan={includeVendors ? 3 : 2} className="p-2.5 text-right font-black">
                          Direct Works Subtotal:
                        </td>
                        <td className="p-2.5 text-right font-mono font-black">{fmtNoDec(directWorksTotal / totalCarpetArea)}</td>
                        <td className="p-2.5 text-right font-black">100.0%</td>
                        <td className="p-2.5 text-right font-mono font-black text-orange-600">{fmt(directWorksTotal)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* Financial Recapitulation */}
            <div className="mt-6 flex justify-end page-break-inside-avoid">
              <div className="w-full sm:w-80 border border-slate-300 rounded-lg overflow-hidden shadow-xs">
                <div className="flex justify-between p-2.5 text-xs border-b border-slate-100">
                  <span className="text-slate-600 font-semibold">Direct Works Subtotal:</span>
                  <span className="font-mono font-bold text-slate-900">{fmt(directWorksTotal)}</span>
                </div>
                <div className="flex justify-between p-2.5 text-xs border-b border-slate-100">
                  <span className="text-slate-600 font-semibold">Contingency & Supervision (5%):</span>
                  <span className="font-mono text-slate-700">{fmt(contingencyAmount)}</span>
                </div>
                {includeTaxes && (
                  <div className="flex justify-between p-2.5 text-xs border-b border-slate-100">
                    <span className="text-slate-600 font-semibold">Applicable GST (18%):</span>
                    <span className="font-mono text-slate-700">{fmt(gstAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between p-3 bg-slate-900 text-white text-xs sm:text-sm font-black">
                  <span>Grand Total Payable:</span>
                  <span className="font-mono text-orange-400">{fmt(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Terms and Commercial Conditions */}
            {includeTerms && (
              <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg page-break-inside-avoid text-[10.5px] text-slate-600">
                <h4 className="font-black text-slate-900 uppercase tracking-wider mb-1.5 text-xs">
                  Standard Commercial Terms & Payment Milestones
                </h4>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Estimate validity is thirty (30) calendar days from issuance. Rates reflect approved trade vendor agreements.</li>
                  <li>Billing will be governed by physical site measurement against proposed Studio designs.</li>
                  <li>Payment Milestones: 15% Booking Advance, 30% Civil & MEP, 35% Millwork/Joinery, 15% Finishes, 5% Handover.</li>
                  <li>Structural modifications and civil demolition are subject to building society regulations and structural approvals.</li>
                </ol>
              </div>
            )}

            {/* Signatures & Authorizations */}
            {includeSignatures && (
              <div className="mt-12 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center page-break-inside-avoid">
                <div className="border-t border-slate-400 pt-2">
                  <div className="font-black text-slate-900 text-xs">{masterEstimate.approvalInfo.checkedBy}</div>
                  <div className="text-[10px] text-slate-500">Lead Cost Estimator & Project Lead</div>
                </div>
                <div className="border-t border-slate-400 pt-2">
                  <div className="font-black text-slate-900 text-xs">{masterEstimate.approvalInfo.approvedBy}</div>
                  <div className="text-[10px] text-slate-500">Director / Managing Partner, ArqonOS</div>
                </div>
                <div className="border-t border-slate-400 pt-2">
                  <div className="font-black text-slate-900 text-xs">{masterEstimate.clientName}</div>
                  <div className="text-[10px] text-slate-500">Client Acceptance Signature & Seal</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer (no-print) */}
        <div className="no-print p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Format complies with Arqon Studio & Indian Standard BOQ (IS 1200) conventions.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadHtml}
              className="px-3.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-all"
            >
              Save HTML / PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-black transition-all shadow-sm flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
