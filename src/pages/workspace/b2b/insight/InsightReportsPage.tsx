import React, { useState } from 'react';
import {
  FileText,
  Download,
  Filter,
  Search,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  FileSpreadsheet,
  Layers,
  Sparkles,
  X,
  ChevronRight,
  TrendingUp,
  Sliders,
  DollarSign
} from 'lucide-react';
import { useInsight } from './InsightContext';
import { InsightReportTemplate } from './data/mockInsightData';
import { cn } from '../../../../lib/utils';

export function InsightReportsPage() {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    reportTemplates,
    portfolioTotals,
    triggerExport
  } = useInsight();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReportForPreview, setSelectedReportForPreview] = useState<InsightReportTemplate | null>(null);
  const [isCustomBuilderOpen, setIsCustomBuilderOpen] = useState(false);

  // Custom Report Builder Form State
  const [customReportName, setCustomReportName] = useState('Custom Multi-Engine Executive Audit');
  const [customCategory, setCustomCategory] = useState<'Financial' | 'Operations' | 'Design & Space' | 'Supply Chain' | 'Executive Audit'>('Executive Audit');
  const [customEngines, setCustomEngines] = useState<string[]>(['Cost', 'Flow', 'Vendor']);
  const [customFormat, setCustomFormat] = useState<'PDF' | 'XLSX' | 'CSV'>('PDF');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const filteredTemplates = reportTemplates.filter((rep) => {
    const matchesCategory = categoryFilter === 'All' || rep.category === categoryFilter;
    const matchesSearch =
      rep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleEngineCheckbox = (engine: string) => {
    setCustomEngines((prev) =>
      prev.includes(engine) ? prev.filter((e) => e !== engine) : [...prev, engine]
    );
  };

  const handleCustomGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    triggerExport(customReportName, customFormat);
    setIsCustomBuilderOpen(false);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-300 overflow-y-auto pr-1">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#94a3b81a] text-[#94a3b8] border border-[#94a3b833] text-xs font-black uppercase tracking-wider">
              Audit & Reporting Studio
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Automated Multi-Source Intelligence</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            Comprehensive Executive Reports
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Audit-grade financial statements, workflow velocity reports, space cost variances, and SLA compliance ledgers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Project Scope Filter */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl text-xs shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-[#94a3b8]" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="text-xs font-bold text-slate-800 dark:text-slate-100 bg-transparent border-none outline-none cursor-pointer"
            >
              <option value="all">All Projects Scope</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsCustomBuilderOpen(true)}
            className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-extrabold flex items-center gap-2 shadow-sm hover:opacity-90 transition-all"
          >
            <Sliders className="w-3.5 h-3.5 text-[#94a3b8]" />
            <span>Create Custom Report</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search report templates, metrics, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#94a3b8] text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Executive Audit', 'Financial', 'Operations', 'Design & Space', 'Supply Chain'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                categoryFilter === cat
                  ? 'bg-[#94a3b8] text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Report Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelectedReportForPreview(template)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:border-[#94a3b8] cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#94a3b81a] text-[#94a3b8]">
                  {template.code}
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {template.frequency}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-[#94a3b8] transition-colors">
                {template.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">
                {template.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Last Run:</span>
                  <strong className="text-slate-700 dark:text-slate-300 font-semibold">{template.lastGenerated}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Format:</span>
                  <strong className="text-slate-700 dark:text-slate-300 font-semibold">{template.fileFormat} Document</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Audience:</span>
                  <strong className="text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[150px]">
                    {template.recipients.join(', ')}
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerExport(template.name, template.fileFormat);
                }}
                className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>Export {template.fileFormat}</span>
              </button>

              <div className="flex items-center gap-1 text-[#94a3b8] text-xs font-extrabold">
                <span>Inspect Report</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Preview Modal */}
      {selectedReportForPreview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedReportForPreview(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black px-2 py-0.5 rounded bg-[#94a3b81a] text-[#94a3b8]">
                {selectedReportForPreview.code}
              </span>
              <span className="text-xs font-bold text-emerald-600">✓ Audit-Verified Synthesis</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              {selectedReportForPreview.name}
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Category: <strong>{selectedReportForPreview.category}</strong> • Recipient List: {selectedReportForPreview.recipients.join(', ')}
            </p>

            {/* Simulated Live Table Ingestion inside Report */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-4 mb-6">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900 dark:text-white">Active Data Scope: All Active Projects</span>
                <span className="text-slate-400">Generated: Live Timestamp</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-extrabold uppercase text-[10px]">
                      <th className="pb-2">Scope</th>
                      <th className="pb-2">Contract Value</th>
                      <th className="pb-2">Actual Cost</th>
                      <th className="pb-2">Net Margin %</th>
                      <th className="pb-2">SPI Index</th>
                      <th className="pb-2">Quality SLA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/60">
                    {projects.map((p) => (
                      <tr key={p.id}>
                        <td className="py-2.5 font-bold text-slate-900 dark:text-white">{p.name}</td>
                        <td className="py-2.5">{formatCurrency(p.contractValue)}</td>
                        <td className="py-2.5">{formatCurrency(p.actualCostToDate)}</td>
                        <td className="py-2.5 font-extrabold text-emerald-600">{p.projectedMarginPercent}%</td>
                        <td className="py-2.5">{p.schedulePerformanceIndex}</td>
                        <td className="py-2.5">{p.materialDeliveryOnTimeRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">Export formats available: PDF, Excel, CSV</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => triggerExport(selectedReportForPreview.name, 'pdf')}
                  className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Complete Statement</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Report Builder Modal */}
      {isCustomBuilderOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsCustomBuilderOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">
              Custom Multi-Engine Report Builder
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Select target data streams, aggregations, and export formats.
            </p>

            <form onSubmit={handleCustomGenerate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Report Title *</label>
                <input
                  type="text"
                  required
                  value={customReportName}
                  onChange={(e) => setCustomReportName(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category Classification</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-bold"
                >
                  <option value="Executive Audit">Executive Audit</option>
                  <option value="Financial">Financial</option>
                  <option value="Operations">Operations</option>
                  <option value="Design & Space">Design & Space</option>
                  <option value="Supply Chain">Supply Chain</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-2">Ingest Data Streams</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Cost', 'Flow', 'Quest', 'Studio', 'Vendor', 'People', 'Connect', 'AI Engine'].map((eng) => (
                    <label
                      key={eng}
                      onClick={() => toggleEngineCheckbox(eng)}
                      className={cn(
                        'p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-all',
                        customEngines.includes(eng)
                          ? 'bg-[#94a3b81a] border-[#94a3b8] text-slate-900 dark:text-white font-bold'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={customEngines.includes(eng)}
                        onChange={() => {}}
                        className="rounded text-[#94a3b8]"
                      />
                      <span>{eng}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Export Format</label>
                <div className="flex items-center gap-3">
                  {(['PDF', 'XLSX', 'CSV'] as const).map((fmt) => (
                    <label key={fmt} className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input
                        type="radio"
                        name="format"
                        checked={customFormat === fmt}
                        onChange={() => setCustomFormat(fmt)}
                        className="text-[#94a3b8]"
                      />
                      <span>{fmt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCustomBuilderOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#94a3b8] hover:bg-[#94a3b8]/90 font-extrabold text-white shadow-sm"
                >
                  Compile & Export Custom Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
