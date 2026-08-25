import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Search, MoreVertical, 
  Trash2, ExternalLink, Brush, UploadCloud,
  ArrowLeft
} from 'lucide-react';
import { auth } from '../../../../../lib/firebase';
import { useStudio } from '../StudioContext';
import { cn } from '../../../../../lib/utils';
import { StudioCanvas } from './StudioCanvas';

export function ProjectSketch({ projectId }: { projectId: string }) {
  const { fetchProjectSketches, createProjectSketch, deleteProjectSketch } = useStudio();
  const [sketches, setSketches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSketch, setActiveSketch] = useState<any | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadSketches = async () => {
    try {
      setLoading(true);
      const docs = await fetchProjectSketches(projectId);
      setSketches(docs);
    } catch (err) {
      console.error("Failed to fetch sketches:", err);
      setError("Failed to load sketches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSketches();
  }, [projectId]);

  const createSketch = async (type: 'Upload' | 'Studio') => {
    if (!newTitle.trim()) return;
    try {
      setError(null);
      const sketchData = {
        projectId,
        title: newTitle,
        type,
        version: 1,
        category: 'Interior',
        uploadedBy: auth?.currentUser?.uid || 'mock-dev-user-id',
        ...(type === 'Studio' ? { canvasData: JSON.stringify({ version: '1', elements: [] }) } : { url: '' })
      };
      
      const sketchId = await createProjectSketch(projectId, sketchData);
      
      setNewTitle('');
      setShowCreateModal(false);
      await loadSketches();
      
      if (type === 'Studio') {
        setActiveSketch({ id: sketchId, ...sketchData });
      }
    } catch (err) {
      console.error("Failed to create sketch:", err);
      setError("Failed to create sketch.");
    }
  };

  const deleteSketch = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteProjectSketch(projectId, id);
      await loadSketches();
    } catch (err) {
      console.error("Failed to delete sketch:", err);
    }
  };

  if (activeSketch && activeSketch.type === 'Studio') {
    return (
      <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950">
        <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveSketch(null)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-slate-200 dark:border-slate-800" />
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">{activeSketch.title}</h3>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-widest">Autosaved</span>
          </div>
        </div>
        <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
          <StudioCanvas sketchId={activeSketch.id} projectId={projectId} initialData={activeSketch.canvasData} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 h-full overflow-y-auto">
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold animate-in slide-in-from-top-2">
          <Trash2 className="w-4 h-4 rotate-45" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto hover:opacity-70">Close</button>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Sketches</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage interactive studio sketches and uploaded technical plans.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-black px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-orange-500/20 text-sm uppercase tracking-widest"
        >
          <Plus className="w-4 h-4" /> New Sketch
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-500 animate-pulse uppercase tracking-widest">Loading sketches...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sketches.map((sketch) => (
            <div 
              key={sketch.id}
              onClick={() => setActiveSketch(sketch)}
              className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/5 transition-all cursor-pointer flex flex-col aspect-[4/3]"
            >
              <div className="flex-1 bg-slate-50 dark:bg-slate-950 flex items-center justify-center relative overflow-hidden">
                 {sketch.type === 'Studio' ? (
                   <Brush className="w-12 h-12 text-slate-200 dark:text-slate-800 group-hover:text-orange-500/20 transition-colors" />
                 ) : (
                   <UploadCloud className="w-12 h-12 text-slate-200 dark:text-slate-800 group-hover:text-blue-500/20 transition-colors" />
                 )}
                 
                 <div className="absolute top-3 right-3 flex gap-2">
                   <button 
                    onClick={(e) => deleteSketch(sketch.id, e)}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                 </div>
              </div>
              
              <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                 <div className="flex items-center gap-2 mb-1">
                   <span className={cn(
                     "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                     sketch.type === 'Studio' ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"
                   )}>
                     {sketch.type}
                   </span>
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{sketch.category}</span>
                 </div>
                 <h4 className="font-black text-slate-900 dark:text-white line-clamp-1">{sketch.title}</h4>
                 <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-tight">Edited {new Date(sketch.updatedAt?.toDate?.() || sketch.updatedAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
  
          {sketches.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">No Sketches Yet</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">Start your design process by creating an interactive studio sketch or uploading technical plans.</p>
            </div>
          )}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200 p-8">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">New Sketch</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Living Room Floor Plan"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-12 px-4 text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => createSketch('Studio')}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border-2 border-transparent hover:border-emerald-500 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                    <Brush className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-emerald-900 dark:text-emerald-100 uppercase tracking-tight">Studio</p>
                    <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 uppercase tracking-widest">Interactive</p>
                  </div>
                </button>

                <button 
                  onClick={() => createSketch('Upload')}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border-2 border-transparent hover:border-blue-500 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-blue-900 dark:text-blue-100 uppercase tracking-tight">Upload</p>
                    <p className="text-[9px] font-bold text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-widest">PDF / JPG</p>
                  </div>
                </button>
              </div>

              <button 
                onClick={() => setShowCreateModal(false)}
                className="w-full py-3 font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all uppercase tracking-widest text-[10px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
