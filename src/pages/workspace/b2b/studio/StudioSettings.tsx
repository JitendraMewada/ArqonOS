import React, { useState } from 'react';
import { 
  Settings, Sliders, Ruler, FileSpreadsheet, 
  Layers, Check, Sparkles, Database, Save, RefreshCw
} from 'lucide-react';
import { cn } from '../../../../lib/utils';

export function StudioSettings() {
  const [measurementUnit, setMeasurementUnit] = useState<'mm' | 'cm' | 'feet_inches'>('mm');
  const [defaultCeilingHeight, setDefaultCeilingHeight] = useState('3000');
  const [exportDpi, setExportDpi] = useState<'72' | '150' | '300'>('300');
  const [autoCalculateAreas, setAutoCalculateAreas] = useState(true);
  const [cadLayerStandard, setCadLayerStandard] = useState<'AIA' | 'ISO_13567' | 'BS_1192'>('AIA');
  const [presentationWatermark, setPresentationWatermark] = useState(true);
  const [approvalLockOnCost, setApprovalLockOnCost] = useState(true);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage('Studio preferences updated successfully!');
    setTimeout(() => setSavedMessage(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="px-8 py-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-500 uppercase tracking-widest mb-1.5">
            <Settings className="w-4 h-4" />
            <span>Studio Engine & Spatial Presets</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Studio Configuration</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Configure default measurement matrices, presentation rendering DPI, CAD export layers, and Cost module approval gates.
          </p>
        </div>

        {savedMessage && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>{savedMessage}</span>
          </div>
        )}
      </div>

      <div className="p-8 max-w-4xl space-y-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Spatial & Dimension Units */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-500 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Ruler className="w-4 h-4" />
              <span>Spatial Measurement & Dimension Engine</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Default Dimension Unit
                </label>
                <select
                  value={measurementUnit}
                  onChange={e => setMeasurementUnit(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="mm">Millimeters (mm) - Precision Architecture</option>
                  <option value="cm">Centimeters (cm) - Interior Planning</option>
                  <option value="feet_inches">Feet & Inches (ft/in) - Imperial Standard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Default False Ceiling Slab Clearance (mm)
                </label>
                <input
                  type="number"
                  value={defaultCeilingHeight}
                  onChange={e => setDefaultCeilingHeight(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Auto-Calculate Wall & Net Carpet Areas
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Automatically subtract door & window aperture areas from perimeter wall area equations.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoCalculateAreas}
                onChange={e => setAutoCalculateAreas(e.target.checked)}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Presentation & Exports */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-500 border-b border-slate-100 dark:border-slate-800 pb-3">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Presentation & Client Export Resolution</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Client Presentation Export DPI
                </label>
                <select
                  value={exportDpi}
                  onChange={e => setExportDpi(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="72">72 DPI - Fast Web Preview</option>
                  <option value="150">150 DPI - Standard Client Deck</option>
                  <option value="300">300 DPI - High-Resolution Print Specification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  CAD Drawing Ledger Layer Standard
                </label>
                <select
                  value={cadLayerStandard}
                  onChange={e => setCadLayerStandard(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="AIA">AIA (American Institute of Architects)</option>
                  <option value="ISO_13567">ISO 13567 (International Metric Standard)</option>
                  <option value="BS_1192">BS 1192 (British Architectural Standard)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Studio Branding Watermark
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Attach studio monogram and client confidential badge on exported walkthrough slides.
                </span>
              </div>
              <input
                type="checkbox"
                checked={presentationWatermark}
                onChange={e => setPresentationWatermark(e.target.checked)}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Workflow Governance & Cost Interlock */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-500 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Layers className="w-4 h-4" />
              <span>Ecosystem Workflow Interlocks</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Enforce Studio Approval Before Cost Module Estimation
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Strict business logic: Cost and procurement estimations remain locked until client gives final sign-off.
                </span>
              </div>
              <input
                type="checkbox"
                checked={approvalLockOnCost}
                onChange={e => setApprovalLockOnCost(e.target.checked)}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20 active:scale-98 flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" /> Save Studio Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
