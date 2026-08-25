import React, { useState, useEffect, useRef } from 'react';
import { useStudio, Asset } from '../StudioContext';
import { cn } from '../../../../../lib/utils';
import { 
  Folder, 
  FileBox, 
  Search, 
  Filter, 
  Plus, 
  UploadCloud,
  MoreVertical,
  Image as ImageIcon,
  FileText,
  File,
  X,
  Trash2,
  Download,
  ChevronDown,
  ChevronRight,
  History,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { serverTimestamp } from 'firebase/firestore';

const ASSET_CATEGORIES = {
  'Drawing Ledger': ['Plan', 'Elevation', 'Technical drawings', 'CAD files'],
  'Library': ['Furniture', 'Material', 'Lighting', 'Decor', 'Texture', 'Reference'],
  'FF&E': [],
  '3D View': []
};

type FolderType = keyof typeof ASSET_CATEGORIES;

export function ProjectAssets({ projectId }: { projectId: string }) {
  const { fetchProjectAssets, createProjectAsset, deleteProjectAsset } = useStudio();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFolder, setActiveFolder] = useState<FolderType | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [historyAssetKey, setHistoryAssetKey] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  
  // Notes states
  const [pendingAction, setPendingAction] = useState<{
    type: 'upload' | 'restore';
    file?: File;
    asset?: Asset;
    data?: any;
  } | null>(null);
  const [changeNotes, setChangeNotes] = useState('');
  
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  
  const toggleFolder = (folderName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const docs = await fetchProjectAssets(projectId);
      setAssets(docs);
    } catch (err) {
      console.error("Failed to fetch assets:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadAssets();
  }, [projectId]);

  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const processFileUpload = async (file: File) => {
    if (!activeFolder) {
      alert("Please select a folder first before uploading.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert("File size exceeds 50MB limit.");
      return;
    }

    setIsUploading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const fileType = file.type.startsWith('image/') ? 'image' : 
                      file.type.includes('pdf') ? 'document' : 'file';

      const mockUrl = fileType === 'image' ? URL.createObjectURL(file) : '';

      let nextVersion: string | undefined;
      const requiresVersion = ['Drawing Ledger', '3D View'].includes(activeFolder);
      
      if (requiresVersion) {
        const existingVersions = assets.filter(
          a => a.name === file.name && 
               a.folder === activeFolder && 
               a.subCategory === (activeSubcategory || undefined) &&
               a.version
        );
        
        if (existingVersions.length > 0) {
          const maxVersionNum = Math.max(
            0,
            ...existingVersions.map(a => parseInt(a.version?.replace('v', '') || '0', 10))
          );
          nextVersion = `v${maxVersionNum + 1}`;
        } else {
          nextVersion = 'v1';
        }
      }

      const newAssetData = {
        name: file.name,
        folder: activeFolder,
        subCategory: activeSubcategory || undefined,
        type: fileType,
        url: mockUrl,
        size: file.size,
        version: nextVersion
      };

      if (nextVersion && nextVersion !== 'v1') {
        setPendingAction({ type: 'upload', file, data: newAssetData });
        setChangeNotes('');
        setIsUploading(false);
        return;
      }

      await createProjectAsset(projectId, newAssetData);
      await loadAssets();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmUpload = async () => {
    if (!pendingAction || !pendingAction.data) return;
    
    setIsUploading(true);
    try {
      const finalData = {
        ...pendingAction.data,
        notes: changeNotes
      };
      await createProjectAsset(projectId, finalData);
      await loadAssets();
      setPendingAction(null);
    } catch (err) {
      console.error("Confirm upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFileUpload(file);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFileUpload(file);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteProjectAsset(projectId, id);
      await loadAssets();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-8 h-8 text-blue-500" />;
      case 'document': return <FileText className="w-8 h-8 text-orange-500" />;
      default: return <File className="w-8 h-8 text-slate-500" />;
    }
  };

  const handleRestoreVersion = async (oldAsset: Asset) => {
    if (!projectId) return;
    setPendingAction({ type: 'restore', asset: oldAsset });
    setChangeNotes(`Restored from version ${oldAsset.version}`);
  };

  const handleConfirmRestore = async () => {
    if (!pendingAction || !pendingAction.asset) return;
    const oldAsset = pendingAction.asset;
    setIsRestoring(true);
    try {
      const versions = assets.filter(
        a => a.name === oldAsset.name && 
             a.folder === oldAsset.folder && 
             a.subCategory === oldAsset.subCategory
      );
      const maxVersionNum = Math.max(
        0,
        ...versions.map(a => parseInt(a.version?.replace('v', '') || '0', 10))
      );
      
      const restoredAsset = {
        ...oldAsset,
        id: undefined, // Let Firestore generate new ID
        version: `v${maxVersionNum + 1}`,
        notes: changeNotes,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await createProjectAsset(projectId, restoredAsset);
      await loadAssets();
      setHistoryAssetKey(null);
      setPendingAction(null);
    } catch (err) {
      console.error("Restore failed:", err);
    } finally {
      setIsRestoring(false);
    }
  };

  const filteredAssets = assets.filter(asset => {
    if (activeFolder && asset.folder !== activeFolder) return false;
    if (activeSubcategory && asset.subCategory !== activeSubcategory) return false;
    if (search && !asset.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Group by name (if versioned) to only show latest
  const latestAssetsMap = new Map<string, Asset>();
  const historyAssetsMap = new Map<string, Asset[]>();

  filteredAssets.forEach(asset => {
    if (asset.version) {
      const key = `${asset.folder}-${asset.subCategory || ''}-${asset.name}`;
      const current = latestAssetsMap.get(key);
      
      if (!current) {
        latestAssetsMap.set(key, asset);
        historyAssetsMap.set(key, [asset]);
      } else {
        const currentVersionNum = parseInt(current.version?.replace('v', '') || '0', 10);
        const thisVersionNum = parseInt(asset.version?.replace('v', '') || '0', 10);
        
        const history = historyAssetsMap.get(key)!;
        history.push(asset);
        
        if (thisVersionNum > currentVersionNum) {
          latestAssetsMap.set(key, asset);
        }
      }
    } else {
      latestAssetsMap.set(asset.id, asset);
    }
  });

  const displayAssets = Array.from(latestAssetsMap.values()).sort((a, b) => {
    // Determine sort time
    const aTime = a.createdAt?.toMillis?.() || new Date(a.createdAt).getTime();
    const bTime = b.createdAt?.toMillis?.() || new Date(b.createdAt).getTime();
    return bTime - aTime;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505] overflow-hidden font-sans">
      {/* Module Sub-Header: Folder Selection */}
      <div className="px-8 py-4 border-b border-slate-800 bg-[#0a0a0a] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-2 pr-4 border-r border-slate-800">
            <FileBox className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Asset Registry</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveFolder(null); setActiveSubcategory(null); }}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap",
                activeFolder === null 
                  ? "bg-orange-500/10 border-orange-500/20 text-orange-500" 
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              )}
            >
              All Assets
            </button>
            {Object.keys(ASSET_CATEGORIES).map(folder => (
              <button
                key={folder}
                onClick={() => { setActiveFolder(folder as FolderType); setActiveSubcategory(null); }}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap",
                  activeFolder === folder && !activeSubcategory
                    ? "bg-orange-500/10 border-orange-500/20 text-orange-500" 
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                )}
              >
                {folder}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text"
              placeholder="Filter assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-48 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={!activeFolder || isUploading}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-tight flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {isUploading ? 'Uploading...' : 'Upload Asset'}
          </button>
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
        </div>
      </div>

      {/* Subcategory Bar (if folder active) */}
      <AnimatePresence>
        {activeFolder && ASSET_CATEGORIES[activeFolder].length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-8 py-3 bg-[#0a0a0a]/50 border-b border-slate-800 overflow-hidden shrink-0"
          >
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mr-2">Sub-Categories</span>
              {ASSET_CATEGORIES[activeFolder].map(sub => (
                <button
                  key={sub}
                  onClick={() => setActiveSubcategory(sub)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                    activeSubcategory === sub
                      ? "bg-orange-500 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  )}
                >
                  {sub}
                </button>
              ))}
              <button
                onClick={() => setActiveSubcategory(null)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  !activeSubcategory ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"
                )}
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex overflow-hidden">
        {/* Content Area */}
        <div 
          className={cn(
            "relative flex-1 overflow-y-auto p-8 transition-colors",
            isDragOver ? "bg-orange-500/5" : ""
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragOver && activeFolder && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none p-8">
              <div className="flex flex-col items-center p-12 bg-[#0a0a0a] border-2 border-orange-500 border-dashed rounded-2xl shadow-2xl">
                <UploadCloud className="w-12 h-12 text-orange-500 mb-4 animate-bounce" />
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Drop to synchronize</h3>
                <p className="text-xs font-bold text-slate-500 mt-2">Target: {activeFolder} {activeSubcategory ? `> ${activeSubcategory}` : ''}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
          ) : displayAssets.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-[#0a0a0a]">
               <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-6">
                 <FileBox className="w-8 h-8 text-slate-700" />
               </div>
               <h3 className="text-lg font-black text-white tracking-tight uppercase">Registry Empty</h3>
               <p className="text-xs font-bold text-slate-500 mt-2 max-w-xs leading-relaxed uppercase tracking-wider">
                 {activeFolder ? `Initialize upload to ${activeSubcategory ? `${activeFolder} / ${activeSubcategory}` : activeFolder}.` : 'Select a primary category to begin asset population.'}
               </p>
             </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {displayAssets.map(asset => (
                <div key={asset.id} className="group bg-[#0a0a0a] border border-slate-800 rounded-xl overflow-hidden hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/5 transition-all">
                  <div className="h-40 bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
                    {asset.type === 'image' && asset.url ? (
                      <img src={asset.url} alt={asset.name} className="w-full h-full object-cover rounded-lg transition-transform group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="p-6 bg-slate-900/50 rounded-2xl">
                        {getFileIcon(asset.type)}
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                      <a 
                        href={asset.url} 
                        download={asset.name}
                        className="w-10 h-10 rounded-xl bg-white text-slate-900 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                      <button 
                        onClick={(e) => handleDelete(asset.id, e)}
                        className="w-10 h-10 rounded-xl bg-white text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 delay-[50ms]"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {asset.version && (
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const key = `${asset.folder}-${asset.subCategory || ''}-${asset.name}`;
                            setHistoryAssetKey(key);
                          }}
                          className="bg-orange-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-orange-500/20"
                          title="View Version History"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                        <div className="bg-slate-900/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg border border-slate-800">
                          {asset.version}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-slate-800">
                    <h4 className="text-xs font-black text-white truncate uppercase tracking-tight" title={asset.name}>{asset.name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] font-mono text-slate-500">{formatFileSize(asset.size)}</span>
                      <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest px-2 py-0.5 bg-orange-500/10 rounded-md">
                        {asset.subCategory || 'Base'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Version History Modal */}
      {historyAssetKey && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-800 flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Version Registry</h2>
                  {(() => {
                    const latest = historyAssetsMap.get(historyAssetKey)?.[0];
                    return latest && <p className="text-xs font-bold text-slate-500 truncate max-w-md uppercase tracking-wider">{latest.name}</p>
                  })()}
                </div>
              </div>
              <button 
                onClick={() => setHistoryAssetKey(null)}
                className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-500 hover:text-white transition-colors border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-3">
                {[...(historyAssetsMap.get(historyAssetKey) || [])].sort((a, b) => {
                  const aVer = parseInt(a.version?.replace('v', '') || '0', 10);
                  const bVer = parseInt(b.version?.replace('v', '') || '0', 10);
                  return bVer - aVer;
                }).map((histAsset, index) => (
                  <div key={histAsset.id} className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all",
                    index === 0 ? "bg-orange-500/5 border-orange-500/20 shadow-lg shadow-orange-500/5" : "bg-[#050505] border-slate-800"
                  )}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-900 flex shrink-0 border border-slate-800">
                        {histAsset.type === 'image' && histAsset.url ? (
                          <img src={histAsset.url} alt={histAsset.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            {getFileIcon(histAsset.type)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-[0.2em]",
                            index === 0 ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-400"
                          )}>
                            {histAsset.version}
                          </span>
                          {index === 0 && <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Active Reference</span>}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                          <span className="font-mono">{formatFileSize(histAsset.size)}</span>
                          <span className="text-slate-800">•</span>
                          <span>{new Date(histAsset.createdAt?.toMillis?.() || histAsset.createdAt).toLocaleString()}</span>
                        </div>
                        {histAsset.notes && (
                          <div className="mt-2 p-2 bg-[#0a0a0a] border border-slate-800 rounded-lg">
                            <p className="text-[10px] font-medium text-slate-400 italic">"{histAsset.notes}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleRestoreVersion(histAsset)}
                        disabled={isRestoring || index === 0}
                        className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm border",
                          index === 0 
                            ? "bg-slate-900 text-slate-700 border-slate-800 cursor-not-allowed" 
                            : "bg-[#0a0a0a] text-orange-500 border-slate-800 hover:bg-orange-500 hover:text-white hover:border-orange-500"
                        )}
                        title="Restore this version"
                      >
                        {isRestoring ? <Loader2 className="w-4 h-4 animate-spin" /> : <History className="w-4 h-4" />}
                      </button>
                      <a 
                        href={histAsset.url} 
                        download={histAsset.name}
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 rounded-xl bg-[#0a0a0a] text-white flex items-center justify-center hover:bg-slate-800 transition-all border border-slate-800"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button 
                        onClick={(e) => handleDelete(histAsset.id, e)}
                        className="w-9 h-9 rounded-xl bg-[#0a0a0a] text-red-500 flex items-center justify-center hover:bg-red-500/10 transition-all border border-slate-800"
                        title="Delete this version"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {isRestoring && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-[110]">
                <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-slate-800 shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
                  <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                  <span className="text-xs font-black text-white uppercase tracking-[0.3em] text-center">Synchronizing Registry...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Notes / Confirmation Modal */}
      <AnimatePresence>
        {pendingAction && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a0a] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-800"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-orange-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">
                      {pendingAction.type === 'upload' ? 'Upload New Version' : 'Restore Version'}
                    </h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Version Documentation</p>
                  </div>
                </div>
                <button 
                  onClick={() => setPendingAction(null)}
                  className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-500 hover:text-white transition-colors border border-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset Details</span>
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded-md">
                      {pendingAction.type === 'upload' ? pendingAction.data?.version : `Restoring to v${(parseInt(assets.filter(a => a.name === pendingAction.asset?.name).length.toString()) + 1)}`}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white uppercase truncate">
                    {pendingAction.type === 'upload' ? pendingAction.file?.name : pendingAction.asset?.name}
                  </h4>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Change Log / Updates</label>
                  <textarea
                    value={changeNotes}
                    onChange={(e) => setChangeNotes(e.target.value)}
                    placeholder="Describe what changed in this version..."
                    className="w-full h-32 bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-bold text-white focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-slate-700 resize-none"
                    autoFocus
                  />
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={() => setPendingAction(null)}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={pendingAction.type === 'upload' ? handleConfirmUpload : handleConfirmRestore}
                  disabled={isUploading || isRestoring}
                  className="flex-1 px-4 py-3 rounded-xl bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                >
                  {(isUploading || isRestoring) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    pendingAction.type === 'upload' ? 'Upload Version' : 'Restore Version'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
