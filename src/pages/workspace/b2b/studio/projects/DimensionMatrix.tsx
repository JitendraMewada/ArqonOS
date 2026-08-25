import React, { useState, useEffect } from 'react';
import { 
  Ruler, Plus, Trash2, Camera, 
  ChevronDown, Maximize2, FileText,
  Calculator,
  ArrowRight,
  Info
} from 'lucide-react';
import { useStudio, type Dimension } from '../StudioContext';
import { cn } from '../../../../../lib/utils';

export function DimensionMatrix({ projectId }: { projectId: string }) {
  const { fetchProjectDimensions, addProjectDimension } = useStudio();
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Dimension>>({
    doorCount: 0, doorWidth: 0, doorHeight: 0, windowCount: 0, windowWidth: 0, windowHeight: 0,
    sillHeight: 0, lintelHeight: 0, floorCount: 1, ceilingCount: 1, ceilingHeight: 0,
    wallCount: 4, beamCount: 0, beamHeight: 0, beamWidth: 0, notes: "", attachments: []
  });

  useEffect(() => {
    loadDimensions();
  }, [projectId]);

  const loadDimensions = async () => {
    try {
      const data = await fetchProjectDimensions(projectId);
      setDimensions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roomName || !formData.length || !formData.width || !formData.height) {
      alert("Please fill all required dimensions and room name.");
      return;
    }
    try {
      setIsAdding(true);
      await addProjectDimension(projectId, formData as Dimension);
      setShowAddModal(false);
      setFormData({
        doorCount: 0, doorWidth: 0, doorHeight: 0, windowCount: 0, windowWidth: 0, windowHeight: 0,
        sillHeight: 0, lintelHeight: 0, floorCount: 1, ceilingCount: 1, ceilingHeight: 0,
        wallCount: 4, beamCount: 0, beamHeight: 0, beamWidth: 0, notes: "", attachments: []
      });
      await loadDimensions();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add room");
      console.error("Failed to add room", err);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-pulse text-orange-500 font-bold uppercase tracking-widest text-[10px]">Syncing Matrix...</div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Dimension Matrix</h3>
          <p className="text-xs text-slate-500 font-medium">Capture actual site measurements. Areas are auto-calculated.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Add Room Measurement
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {dimensions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Ruler className="w-16 h-16 mb-4 text-slate-400" />
            <p className="font-bold text-slate-500 text-center max-w-xs">No site measurements captured yet. Start by adding a room.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {dimensions.map((dim) => (
              <DimensionItem key={dim.id} dimension={dim} />
            ))}
          </div>
        )}
      </div>

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Add Room Measurement</h2>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleAddRoom} className="flex flex-col overflow-hidden max-h-full">
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Room Name</label>
                    <input autoFocus required type="text" value={formData.roomName || ''} onChange={(e) => setFormData({...formData, roomName: e.target.value})} placeholder="e.g. Master Bedroom, Kitchen..." className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Length (ft)</label>
                      <input required type="number" step="0.01" value={formData.length || ''} onChange={(e) => setFormData({...formData, length: parseFloat(e.target.value)})} placeholder="0.00" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white pointer-events-auto" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Width (ft)</label>
                      <input required type="number" step="0.01" value={formData.width || ''} onChange={(e) => setFormData({...formData, width: parseFloat(e.target.value)})} placeholder="0.00" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Height (ft)</label>
                      <input required type="number" step="0.01" value={formData.height || ''} onChange={(e) => setFormData({...formData, height: parseFloat(e.target.value)})} placeholder="0.00" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white mb-4">Openings</h4>
                  <div className="grid grid-cols-3 gap-x-4 gap-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Door Count</label>
                      <input type="number" min="0" value={formData.doorCount || 0} onChange={(e) => setFormData({...formData, doorCount: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Door Width (ft)</label>
                      <input type="number" step="0.01" min="0" value={formData.doorWidth || 0} onChange={(e) => setFormData({...formData, doorWidth: parseFloat(e.target.value) || 0})} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Door Height (ft)</label>
                      <input type="number" step="0.01" min="0" value={formData.doorHeight || 0} onChange={(e) => setFormData({...formData, doorHeight: parseFloat(e.target.value) || 0})} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm" />
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Window Count</label>
                      <input type="number" min="0" value={formData.windowCount || 0} onChange={(e) => setFormData({...formData, windowCount: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Window Width (ft)</label>
                      <input type="number" step="0.01" min="0" value={formData.windowWidth || 0} onChange={(e) => setFormData({...formData, windowWidth: parseFloat(e.target.value) || 0})} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Window Height (ft)</label>
                      <input type="number" step="0.01" min="0" value={formData.windowHeight || 0} onChange={(e) => setFormData({...formData, windowHeight: parseFloat(e.target.value) || 0})} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-end gap-3 flex-shrink-0">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                <button type="submit" disabled={isAdding} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2">
                   {isAdding ? "Saving..." : "Save Measurement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

interface DimensionItemProps {
  dimension: Dimension;
  key?: React.Key;
}

function DimensionItem({ dimension }: DimensionItemProps) {
  const [expanded, setExpanded] = useState(false);

  // Auto Calculations
  const roomArea = dimension.length * dimension.width;
  const ceilingArea = dimension.length * dimension.width;
  const doorArea = dimension.doorCount * dimension.doorWidth * dimension.doorHeight;
  const windowArea = dimension.windowCount * dimension.windowWidth * dimension.windowHeight;
  const wallArea = 2 * (dimension.length + dimension.width) * dimension.height - doorArea - windowArea;

  return (
    <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all shadow-sm">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 flex items-center justify-center text-orange-500">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 dark:text-white text-lg">{dimension.roomName}</h4>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              <span>{dimension.length} x {dimension.width} x {dimension.height} ft</span>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <span className="text-emerald-600 dark:text-emerald-500">{roomArea} sq. ft.</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
          >
            {expanded ? <ChevronDown className="w-5 h-5 rotate-180" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-6 pb-6 border-t border-slate-200 dark:border-slate-800/50 pt-6 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-4 gap-8">
            {/* Dimensions Column */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Primary Dimensions</p>
              <div className="grid grid-cols-2 gap-4">
                <InputView label="Length" value={dimension.length} unit="ft" />
                <InputView label="Width" value={dimension.width} unit="ft" />
                <InputView label="Height" value={dimension.height} unit="ft" />
              </div>
            </div>

            {/* Openings Column */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Openings</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Doors</span>
                  <span className="text-slate-900 dark:text-white">{dimension.doorCount} ({dimension.doorWidth}x{dimension.doorHeight}ft)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Windows</span>
                  <span className="text-slate-900 dark:text-white">{dimension.windowCount} ({dimension.windowWidth}x{dimension.windowHeight}ft)</span>
                </div>
              </div>
            </div>

            {/* Calculations Column */}
            <div className="space-y-4 col-span-2">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Calculated Areas</p>
              <div className="grid grid-cols-2 gap-4">
                <CalcCard label="Floor Area" value={roomArea} />
                <CalcCard label="Ceiling Area" value={ceilingArea} />
                <CalcCard label="Net Wall Area" value={wallArea} primary />
                <CalcCard label="Openings Area" value={doorArea + windowArea} />
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-200 dark:border-slate-800/50 pt-6">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer">
                <Camera className="w-4 h-4" /> 
                <span>Add Photos</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) alert(`${e.target.files.length} photos selected. Upload feature coming soon.`);
                }} />
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer">
                <FileText className="w-4 h-4" /> 
                <span>Add PDF</span>
                <input type="file" accept="application/pdf" className="hidden" onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) alert(`${e.target.files[0].name} selected. Upload feature coming soon.`);
                }} />
              </label>
            </div>
            <div className="flex items-center gap-2">
               <button onClick={() => window.dispatchEvent(new CustomEvent('changeStudioTab', { detail: 'Spaces' }))} className="text-[10px] font-black text-orange-600 dark:text-orange-500 hover:underline px-3 py-1 uppercase tracking-widest flex items-center gap-2">
                 Map to Space <ArrowRight className="w-3 h-3" />
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InputView({ label, value, unit }: { label: string, value: number, unit: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest mb-1">{label}</p>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-1.5 text-sm font-black text-slate-900 dark:text-slate-300 shadow-sm">
        {value} <span className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-1">{unit}</span>
      </div>
    </div>
  );
}

function CalcCard({ label, value, primary }: { label: string, value: number, primary?: boolean }) {
  return (
    <div className={cn(
      "p-3 rounded-xl border flex flex-col gap-1 shadow-sm",
      primary ? "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
    )}>
      <span className={cn("text-[10px] font-black uppercase tracking-widest", primary ? "text-orange-600 dark:text-orange-500" : "text-slate-500 dark:text-slate-400")}>{label}</span>
      <span className={cn("text-sm font-black tabular-nums", primary ? "text-orange-600 dark:text-orange-400" : "text-slate-900 dark:text-white")}>{value.toLocaleString()} <span className="text-[10px] font-bold opacity-50">SQ FT</span></span>
    </div>
  );
}
