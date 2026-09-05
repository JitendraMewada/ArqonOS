import React, { useState, useEffect } from 'react';
import { 
  Shapes, Plus, Box, ArrowRight, 
  ArrowLeftRight, Info, AlertTriangle,
  CheckCircle2, Pencil, Trash2
} from 'lucide-react';
import { useStudio, type Space, type Dimension } from '../StudioContext';
import { cn } from '../../../../../lib/utils';

export function SpacesList({ projectId }: { projectId: string }) {
  const { fetchProjectSpaces, fetchProjectDimensions, addProjectSpace } = useStudio();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Space>>({
    spaceName: "", spaceType: "Living", status: "Draft",
    proposedLength: 0, proposedWidth: 0, proposedHeight: 0,
    doorCount: 0, doorWidth: 0, doorHeight: 0,
    windowCount: 0, windowWidth: 0, windowHeight: 0,
    wallAddedCount: 0, wallRemovedCount: 0,
    falseCeilingRequired: false, ceilingType: "",
    floorFinishType: "", paintFinish: "", notes: "",
    dimensionRoomId: ""
  });

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      const [s, d] = await Promise.all([
        fetchProjectSpaces(projectId),
        fetchProjectDimensions(projectId)
      ]);
      setSpaces(s);
      setDimensions(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.spaceName || !formData.proposedLength || !formData.proposedWidth || !formData.proposedHeight) {
      alert("Please fill all required dimensions and space name.");
      return;
    }
    try {
      setIsAdding(true);
      await addProjectSpace(projectId, formData as Space);
      setShowAddModal(false);
      setFormData({
        spaceName: "", spaceType: "Living", status: "Draft",
        proposedLength: 0, proposedWidth: 0, proposedHeight: 0,
        doorCount: 0, doorWidth: 0, doorHeight: 0,
        windowCount: 0, windowWidth: 0, windowHeight: 0,
        wallAddedCount: 0, wallRemovedCount: 0,
        falseCeilingRequired: false, ceilingType: "",
        floorFinishType: "", paintFinish: "", notes: "",
        dimensionRoomId: ""
      });
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add space");
      console.error("Failed to add space", err);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-pulse text-orange-500 font-bold uppercase tracking-widest text-[10px]">Syncing Spaces...</div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Project Spaces</h3>
          <p className="text-xs text-slate-500 font-medium">Define proposed design spaces based on site measurements.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Add Space
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 pt-6">
        {spaces.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Shapes className="w-16 h-16 mb-4 text-slate-400" />
            <p className="font-bold text-slate-500">No proposed spaces defined yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => {
              const matchedDimension = dimensions.find(d => d.id === space.dimensionRoomId);
              return (
                <SpaceCard key={space.id} space={space} dimension={matchedDimension} />
              );
            })}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Add Proposed Space</h2>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleAddSpace} className="flex flex-col overflow-hidden max-h-full">
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Space Name</label>
                      <input autoFocus required type="text" value={formData.spaceName || ''} onChange={(e) => setFormData({...formData, spaceName: e.target.value})} placeholder="e.g. Master Bedroom" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Base Existing Room</label>
                      <select value={formData.dimensionRoomId || ''} onChange={(e) => setFormData({...formData, dimensionRoomId: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white">
                        <option value="">-- No Base Room --</option>
                        {dimensions.map(dim => (
                          <option key={dim.id} value={dim.id}>{dim.roomName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Proposed Length (ft)</label>
                      <input required type="number" step="0.01" value={formData.proposedLength || ''} onChange={(e) => setFormData({...formData, proposedLength: parseFloat(e.target.value)})} placeholder="0.00" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white pointer-events-auto" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Proposed Width (ft)</label>
                      <input required type="number" step="0.01" value={formData.proposedWidth || ''} onChange={(e) => setFormData({...formData, proposedWidth: parseFloat(e.target.value)})} placeholder="0.00" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Proposed Height (ft)</label>
                      <input required type="number" step="0.01" value={formData.proposedHeight || ''} onChange={(e) => setFormData({...formData, proposedHeight: parseFloat(e.target.value)})} placeholder="0.00" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white mb-4">Structural Modifications</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Walls Added</label>
                      <input type="number" min="0" value={formData.wallAddedCount || 0} onChange={(e) => setFormData({...formData, wallAddedCount: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Walls Removed</label>
                      <input type="number" min="0" value={formData.wallRemovedCount || 0} onChange={(e) => setFormData({...formData, wallRemovedCount: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm" />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <input type="checkbox" id="falseCeiling" checked={formData.falseCeilingRequired || false} onChange={(e) => setFormData({...formData, falseCeilingRequired: e.target.checked})} className="rounded text-orange-500 focus:ring-orange-500 cursor-pointer" />
                    <label htmlFor="falseCeiling" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer text-[10px] uppercase tracking-widest">False Ceiling Required</label>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-end gap-3 flex-shrink-0">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                <button type="submit" disabled={isAdding} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2">
                   {isAdding ? "Saving..." : "Save Space"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

interface SpaceCardProps {
  space: Space;
  dimension?: Dimension;
  key?: React.Key;
}

function SpaceCard({ space, dimension }: SpaceCardProps) {
  const [showComparison, setShowComparison] = useState(false);

  // Proposed Calculations
  const proposedArea = space.proposedLength * space.proposedWidth;
  const existingArea = dimension ? dimension.length * dimension.width : 0;
  const areaDiff = proposedArea - existingArea;

  return (
    <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all flex flex-col shadow-sm">
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 dark:text-white line-clamp-1">{space.spaceName}</h4>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{space.spaceType}</p>
            </div>
          </div>
          <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded shadow-sm">
            {space.status || 'Draft'}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest">Planned Area</span>
            <span className="text-sm font-black text-slate-900 dark:text-slate-300">{proposedArea} sq. ft.</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest">Base Room</span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-500">{dimension?.roomName || 'Unmapped'}</span>
          </div>
        </div>

        {dimension && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800/50 flex items-center justify-between">
            <div className={cn(
              "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest",
              areaDiff > 0 ? "text-emerald-600 dark:text-emerald-500" : areaDiff < 0 ? "text-red-600 dark:text-red-500" : "text-slate-500"
            )}>
              <ArrowLeftRight className="w-3 h-3" />
              {areaDiff === 0 ? 'No change in area' : `${Math.abs(areaDiff)} sq. ft. ${areaDiff > 0 ? 'extended' : 'reduced'}`}
            </div>
            <button 
              onClick={() => setShowComparison(!showComparison)}
              className="text-[10px] font-black text-orange-600 dark:text-orange-500 hover:underline uppercase tracking-widest"
            >
              Compare
            </button>
          </div>
        )}
      </div>

      <div className="mt-auto bg-slate-100 dark:bg-slate-900/60 p-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-900">
        <div className="flex items-center gap-1">
          <button onClick={() => console.log('Edit space', space.id)} className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm">
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
        <button onClick={() => console.log('View detail', space.id)} className="text-[10px] font-black text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-500 uppercase tracking-widest flex items-center gap-2">
          View Detail <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {showComparison && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Existing vs Proposed Comparison</h2>
                <p className="text-xs text-slate-500 font-medium">{space.spaceName} | {dimension?.roomName}</p>
              </div>
              <button 
                onClick={() => setShowComparison(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <div className="p-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">Parameter</th>
                    <th className="py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono text-center">Existing</th>
                    <th className="py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono text-center">Proposed</th>
                    <th className="py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30">
                  <ComparisonRow label="Length (ft)" ex={dimension?.length || 0} pr={space.proposedLength} />
                  <ComparisonRow label="Width (ft)" ex={dimension?.width || 0} pr={space.proposedWidth} />
                  <ComparisonRow label="Height (ft)" ex={dimension?.height || 0} pr={space.proposedHeight} />
                  <ComparisonRow label="Area (sq ft)" ex={existingArea} pr={proposedArea} />
                  <ComparisonRow label="Doors" ex={dimension?.doorCount || 0} pr={space.doorCount} />
                  <ComparisonRow label="Windows" ex={dimension?.windowCount || 0} pr={space.windowCount} />
                </tbody>
              </table>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Structural Changes</p>
                  <div className="flex flex-wrap gap-2">
                    {space.wallAddedCount > 0 && <span className="text-[10px] px-2 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 font-bold rounded">+{space.wallAddedCount} Walls Added</span>}
                    {space.wallRemovedCount > 0 && <span className="text-[10px] px-2 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 font-bold rounded">-{space.wallRemovedCount} Walls Removed</span>}
                    {space.falseCeilingRequired && <span className="text-[10px] px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 font-bold rounded">Ceiling Redesign</span>}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-500/20 flex flex-col items-center justify-center text-center">
                   <p className="text-[10px] font-black text-orange-600 dark:text-orange-500 uppercase tracking-widest mb-1">Execution & BOQ Impact</p>
                   <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">Quantities Linked to Cost Matrix</p>
                   <button 
                     onClick={() => window.dispatchEvent(new CustomEvent('navigateToApp', { detail: { appId: 'cost', page: 'CostEstimates' } }))}
                     className="text-[10px] font-black bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                   >
                     View BOQ Itemization <ArrowRight className="w-3 h-3" />
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ComparisonRow({ label, ex, pr }: { label: string, ex: number, pr: number }) {
  const diff = pr - ex;
  const status = diff === 0 ? 'Unchanged' : diff > 0 ? 'Increased' : 'Reduced';

  return (
    <tr className="text-xs font-bold">
      <td className="py-4 text-slate-600 dark:text-slate-500">{label}</td>
      <td className="py-4 text-center text-slate-900 dark:text-slate-300">{ex}</td>
      <td className="py-4 text-center text-slate-900 dark:text-white">{pr}</td>
      <td className="py-4 text-right">
        <span className={cn(
          "text-[9px] px-1.5 py-0.5 rounded uppercase font-black tracking-widest",
          status === 'Unchanged' ? "text-slate-500 dark:text-slate-600 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50" : 
          status === 'Increased' ? "text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20" : "text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20"
        )}>
          {status}
        </span>
      </td>
    </tr>
  );
}
