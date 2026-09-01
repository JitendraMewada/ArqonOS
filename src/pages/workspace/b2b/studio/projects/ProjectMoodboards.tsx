import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Palette, Layout, Trash2, Save, Box,
  Image as ImageIcon, Type, Grid3X3, Layers, 
  ChevronRight, Download, PlusCircle, Sparkles,
  X, Search, Filter, Loader2, Maximize2, MousePointer2
} from 'lucide-react';
import { useStudio, type Moodboard, type MoodboardElement } from '../StudioContext';
import { cn } from '../../../../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { MoodboardArtisticCanvas } from '../components/MoodboardArtisticCanvas';
import { MoodboardEditorialCanvas } from '../components/MoodboardEditorialCanvas';
import { MoodboardTemplateModal } from '../components/MoodboardTemplateModal';
import { MoodboardTemplatePreset } from '../data/moodboardTemplates';

export function ProjectMoodboards({ projectId }: { projectId: string }) {
  const { 
    fetchProjectMoodboards, 
    createProjectMoodboard, 
    updateProjectMoodboard, 
    deleteProjectMoodboard,
    fetchProjectAssets
  } = useStudio();

  const [moodboards, setMoodboards] = useState<Moodboard[]>([]);
  const [activeBoard, setActiveBoard] = useState<Moodboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [activeSlot, setActiveSlot] = useState<{ section: string, index?: number, elementId?: string } | null>(null);
  const [projectAssets, setProjectAssets] = useState<any[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadMoodboards();
    loadAssets();
  }, [projectId]);

  const loadMoodboards = async () => {
    setLoading(true);
    try {
      const boards = await fetchProjectMoodboards(projectId);
      setMoodboards(boards);
      if (boards.length > 0 && !activeBoard) {
        setActiveBoard(boards[0]);
      }
    } catch (err) {
      console.error('Failed to load moodboards:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAssets = async () => {
    try {
      const assets = await fetchProjectAssets(projectId);
      setProjectAssets(assets);
    } catch (err) {
      console.error('Failed to load assets:', err);
    }
  };

  const handleSelectTemplate = async (template: MoodboardTemplatePreset | null, fallbackLayout: 'editorial' | 'artistic' | 'grid' = 'editorial') => {
    const layout = template ? template.layoutType : fallbackLayout;
    const name = template ? template.name : (
      layout === 'editorial' ? `Editorial Concept ${moodboards.length + 1}` :
      layout === 'artistic' ? `Artistic Concept ${moodboards.length + 1}` : `Technical A3 Grid ${moodboards.length + 1}`
    );

    const newBoard: Partial<Moodboard> = {
      name,
      layoutType: layout,
      editorialTheme: template?.editorialTheme || 'bohemian',
      eyebrow: template?.eyebrow,
      tagline: template?.tagline,
      clientName: template?.clientName,
      roomName: template?.roomName,
      conceptDate: template?.conceptDate,
      editorialConcept: template?.editorialConcept,
      swatches: template?.swatches,
      tiles: template?.tiles,
      materials: template?.materials,
      elements: template?.elements ? (template.elements as any) : [],
      heroSlot: template?.heroSlot || '',
      narrative: template?.narrative || '',
      technicalGrid: template?.technicalGrid || ['', '', '', ''],
      materialPalette: template?.materialPalette || ['', '', '', ''],
      colorPalette: template?.colorPalette || ['#f97316', '#0f172a', '#1e293b', '#334155', '#475569'],
    };

    try {
      const id = await createProjectMoodboard(projectId, newBoard);
      const boards = await fetchProjectMoodboards(projectId);
      setMoodboards(boards);
      const created = boards.find(b => b.id === id);
      if (created) setActiveBoard(created);
    } catch (err) {
      console.error('Failed to create board:', err);
    }
  };

  const handleCreateBoard = async () => {
    setShowTemplateModal(true);
  };

  const handleUpdateBoard = async (data: Partial<Moodboard>) => {
    if (!activeBoard) return;
    setIsSaving(true);
    try {
      await updateProjectMoodboard(projectId, activeBoard.id, data);
      const updatedBoard = { ...activeBoard, ...data };
      setActiveBoard(updatedBoard);
      setMoodboards(prev => prev.map(b => b.id === activeBoard.id ? updatedBoard : b));
    } catch (err) {
      console.error('Failed to update board:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBoard = async (id: string) => {
    // Avoid window.confirm as it might be blocked in iframes
    try {
      await deleteProjectMoodboard(projectId, id);
      
      setMoodboards(prev => {
        const remaining = prev.filter(b => b.id !== id);
        // If we deleted the active board, switch to another one
        if (activeBoard?.id === id) {
          setActiveBoard(remaining[0] || null);
        }
        return remaining;
      });
    } catch (err) {
      console.error('Failed to delete board:', err);
    }
  };

  const handleSelectAsset = (url: string) => {
    if (!activeSlot || !activeBoard) return;

    const { section, index, elementId } = activeSlot;
    
    if (section === 'artistic' && elementId) {
      if (elementId === 'new') {
        const newElement: MoodboardElement = {
          id: `img-${Date.now()}`,
          type: 'image',
          content: url,
          x: 40,
          y: 40,
          width: 300,
          height: 200,
          rotation: Math.random() * 6 - 3,
          zIndex: (activeBoard.elements?.length || 0) + 1
        };
        handleUpdateBoard({ 
          elements: [...(activeBoard.elements || []), newElement] 
        });
      } else {
        const newElements = (activeBoard.elements || []).map(el => 
          el.id === elementId ? { ...el, content: url } : el
        );
        handleUpdateBoard({ elements: newElements });
      }
    } else if (section === 'editorial' && index !== undefined) {
      const currentTiles = [...(activeBoard.tiles || [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80'
      ])];
      currentTiles[index] = url;
      handleUpdateBoard({ tiles: currentTiles });
    } else {
      const updates: Partial<Moodboard> = {};
      if (section === 'hero') {
        updates.heroSlot = url;
      } else if (section === 'technical' && index !== undefined) {
        const newGrid = [...(activeBoard.technicalGrid || ['', '', '', ''])];
        newGrid[index] = url;
        updates.technicalGrid = newGrid;
      } else if (section === 'material' && index !== undefined) {
        const newPalette = [...(activeBoard.materialPalette || ['', '', '', ''])];
        newPalette[index] = url;
        updates.materialPalette = newPalette;
      }
      handleUpdateBoard(updates);
    }

    setShowAssetLibrary(false);
    setActiveSlot(null);
  };

  const handleColorChange = (index: number, color: string) => {
    if (!activeBoard) return;
    const newPalette = [...activeBoard.colorPalette];
    newPalette[index] = color;
    handleUpdateBoard({ colorPalette: newPalette });
  };

  const handleExportPDF = async () => {
    if (!canvasRef.current || !activeBoard) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(canvasRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: activeBoard.layoutType === 'artistic' ? '#f5f2ed' : '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          // html2canvas 1.4.1 does not support oklch() or oklab() color functions used in Tailwind 4
          // We need to traverse elements and replace any modern colors with HEX fallbacks
          const elements = clonedDoc.querySelectorAll('*');
          elements.forEach((el: any) => {
            const style = window.getComputedStyle(el);
            const props = ['backgroundColor', 'color', 'borderColor', 'outlineColor', 'fill', 'stroke'];
            
            props.forEach(prop => {
              const value = style[prop as any];
              if (value && typeof value === 'string' && (value.includes('oklch') || value.includes('oklab'))) {
                // Fallback to safe colors
                if (prop === 'color') el.style.color = '#f8fafc';
                else if (prop === 'backgroundColor') el.style.backgroundColor = '#1e293b';
                else el.style[prop] = '#334155';
              }
            });
          });
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a3'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Arqon_Studio_${activeBoard.name.replace(/\s+/g, '_')}_A3.pdf`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">Initializing Concept Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505] overflow-hidden font-sans">
      {/* Module Sub-Header: Board Selection */}
      <div className="px-8 py-4 border-b border-slate-800 bg-[#0a0a0a] flex items-center justify-between">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-2 pr-4 border-r border-slate-800">
            <Layout className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Concept Boards</span>
          </div>
          
          <div className="flex items-center gap-2">
            {moodboards.map(board => (
              <div key={board.id} className="group relative">
                <button
                  onClick={() => setActiveBoard(board)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap flex items-center gap-2 pr-8",
                    activeBoard?.id === board.id 
                      ? "bg-orange-500/10 border-orange-500/20 text-orange-500" 
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                  )}
                >
                  {board.name}
                </button>
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBoard(board.id);
                  }}
                  title="Delete Board"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button 
              onClick={handleCreateBoard}
              className="px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:text-white hover:bg-orange-500 transition-all active:scale-95 flex items-center gap-2"
              title="Add New Board or Template"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">New Board / Template</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 ml-8 pl-4 border-l border-slate-800">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Board Integrity</span>
              <span className="text-[9px] font-mono text-orange-500">85%</span>
            </div>
            <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full w-[85%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace: A3 Canvas */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#050505] p-8 overflow-y-auto no-scrollbar relative">
        <AnimatePresence mode="wait">
          {activeBoard ? (
            <motion.div 
              key={activeBoard.id}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              className="mx-auto w-full max-w-[1200px]"
            >
              {/* Board Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <Palette className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      value={activeBoard.name}
                      onChange={(e) => handleUpdateBoard({ name: e.target.value })}
                      className="bg-transparent border-none p-0 text-xl font-black text-white focus:ring-0 w-full tracking-tight"
                    />
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <Maximize2 className="w-3 h-3" /> ISO A3 Landscape
                      </span>
                      {isSaving && <span className="text-[10px] font-mono text-orange-500 animate-pulse">SAVING...</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 pr-4 border-r border-slate-800">
                    <button 
                      onClick={() => handleUpdateBoard({ layoutType: 'editorial' })}
                      className={cn(
                        "px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold",
                        activeBoard.layoutType === 'editorial' ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-slate-900 text-slate-400 hover:text-white"
                      )}
                      title="Editorial Presentation Layout"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Editorial</span>
                    </button>
                    <button 
                      onClick={() => handleUpdateBoard({ layoutType: 'grid' })}
                      className={cn(
                        "px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold",
                        activeBoard.layoutType === 'grid' ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-slate-900 text-slate-400 hover:text-white"
                      )}
                      title="ISO A3 Technical Grid"
                    >
                      <Grid3X3 className="w-3.5 h-3.5" />
                      <span>A3 Grid</span>
                    </button>
                    <button 
                      onClick={() => handleUpdateBoard({ layoutType: 'artistic' })}
                      className={cn(
                        "px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold",
                        activeBoard.layoutType === 'artistic' ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-slate-900 text-slate-400 hover:text-white"
                      )}
                      title="Artistic Canvas Layout"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Canvas</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleDeleteBoard(activeBoard.id)}
                      className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      title="Delete Board"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <button 
                      onClick={handleExportPDF}
                      disabled={isExporting}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-800 bg-orange-500 text-xs font-bold text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isExporting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {isExporting ? 'Exporting...' : 'Export PDF'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Conditional Layout Rendering */}
              {activeBoard.layoutType === 'editorial' ? (
                <div ref={canvasRef} className="w-full">
                  <MoodboardEditorialCanvas
                    moodboard={activeBoard}
                    onUpdate={handleUpdateBoard}
                    onSelectSlot={(tileIndex) => {
                      setActiveSlot({ section: 'editorial', index: tileIndex });
                      setShowAssetLibrary(true);
                    }}
                  />
                </div>
              ) : activeBoard.layoutType === 'artistic' ? (
                <div ref={canvasRef} className="w-full">
                  <MoodboardArtisticCanvas 
                    moodboard={activeBoard} 
                    onUpdate={handleUpdateBoard}
                    onSelectSlot={(elementId) => {
                      setActiveSlot({ section: 'artistic', elementId });
                      setShowAssetLibrary(true);
                    }}
                  />
                </div>
              ) : (
                /* The ISO A3 Canvas (1.414:1) */
                <div 
                  ref={canvasRef}
                  style={{ backgroundColor: '#ffffff' }}
                  className="relative w-full aspect-[1.414/1] dark:!bg-[#0f172a] rounded-lg shadow-2xl overflow-hidden border border-slate-800 p-8 grid grid-cols-12 grid-rows-12 gap-6"
                >
                  {/* Sector 01: Focal Hero Slot */}
                  <div className="col-span-8 row-span-8 relative min-h-0">
                    <SlotContainer 
                      label="01 / FOCAL POINT" 
                      url={activeBoard.heroSlot} 
                      onClick={() => {
                        setActiveSlot({ section: 'hero' });
                        setShowAssetLibrary(true);
                      }}
                    />
                  </div>

                  {/* Sector 02: Storyboard / Narrative */}
                  <div 
                    style={{ backgroundColor: '#f8fafc' }}
                    className="col-span-4 row-span-4 dark:!bg-[#1e293b]/50 rounded-xl border border-slate-100 dark:border-slate-700/50 p-6 flex flex-col gap-3 min-h-0 overflow-hidden"
                  >
                    <div className="flex items-center justify-between shrink-0">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 font-mono tracking-[0.2em] uppercase flex items-center gap-2">
                        <Type className="w-3 h-3" /> 02 / STORYBOARD
                      </span>
                    </div>
                    <textarea 
                      value={activeBoard.narrative}
                      onChange={(e) => handleUpdateBoard({ narrative: e.target.value })}
                      placeholder="Enter design concept narrative..."
                      className="flex-1 bg-transparent border-none p-0 text-sm font-medium text-slate-600 dark:text-slate-300 resize-none focus:ring-0 leading-relaxed scrollbar-thin overflow-y-auto"
                    />
                  </div>

                  {/* Sector 03: Technical Grid (2x2) */}
                  <div className="col-span-4 row-span-4 grid grid-cols-2 grid-rows-2 gap-4 min-h-0">
                    <div className="col-span-2 flex items-center shrink-0">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 font-mono tracking-[0.2em] uppercase flex items-center gap-2">
                        <Grid3X3 className="w-3 h-3" /> 03 / TECHNICAL GRID
                      </span>
                    </div>
                    {(activeBoard.technicalGrid || ['', '', '', '']).map((url, i) => (
                      <div key={i} className="min-h-0">
                        <SlotContainer 
                          url={url} 
                          mini
                          onClick={() => {
                            setActiveSlot({ section: 'technical', index: i });
                            setShowAssetLibrary(true);
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Sector 04: Material Palette (2x2) */}
                  <div className="col-span-12 row-span-3 grid grid-cols-4 gap-6 min-h-0">
                     <div className="col-span-4 flex items-center gap-4 shrink-0 border-t border-slate-100 dark:border-slate-800 pt-2">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 font-mono tracking-[0.2em] uppercase flex items-center gap-2">
                        <Layers className="w-3 h-3" /> 04 / MATERIAL PALETTE
                      </span>
                      <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                    </div>
                    {(activeBoard.materialPalette || ['', '', '', '']).map((url, i) => (
                      <div key={i} className="min-h-0">
                        <SlotContainer 
                          url={url} 
                          onClick={() => {
                            setActiveSlot({ section: 'material', index: i });
                            setShowAssetLibrary(true);
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Sector 05: Color Palette Swatches */}
                  <div className="col-span-12 row-span-1 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 min-h-0 pt-2">
                    <div className="flex items-center gap-6">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 font-mono tracking-[0.2em] uppercase flex items-center gap-2">
                        <Palette className="w-3 h-3" /> 05 / COLOR PALETTE
                      </span>
                      <div className="flex items-center gap-3">
                        {(activeBoard.colorPalette || []).map((color, i) => (
                          <div key={i} className="group relative">
                            <input 
                              type="color" 
                              value={color}
                              onChange={(e) => handleColorChange(i, e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div 
                              className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 shadow-md transition-transform group-hover:scale-110"
                              style={{ backgroundColor: color }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-[9px] font-black text-slate-300 dark:text-slate-700 font-mono tracking-[0.3em] uppercase">
                      ARQON MASTER CONCEPT ENGINE / MOD 04 / ISO A3 LANDSCAPE
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-40">
              <Palette className="w-16 h-16 text-slate-600 mb-6" />
              <h2 className="text-2xl font-black text-white tracking-tighter mb-2 uppercase">Concept Engine Offline</h2>
              <p className="text-slate-500 font-medium mb-8">Select or create a new A3 concept board to begin.</p>
              <button 
                onClick={handleCreateBoard}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-sm font-black text-white hover:bg-orange-600 transition-all active:scale-95"
              >
                <PlusCircle className="w-5 h-5" /> Initialize New Board
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Asset Library Floating Drawer */}
      <AnimatePresence>
        {showAssetLibrary && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowAssetLibrary(false);
                setActiveSlot(null);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-[480px] bg-[#0a0a0a] border-l border-slate-800 z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Box className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-black text-white tracking-tight uppercase">Studio Assets</h3>
                </div>
                <button 
                  onClick={() => {
                    setShowAssetLibrary(false);
                    setActiveSlot(null);
                  }}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 border-b border-slate-800 flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search assets..."
                    className="w-full bg-slate-900 border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-600 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
                  <Filter className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-4 no-scrollbar">
                {projectAssets.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => handleSelectAsset(asset.url)}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-orange-500 transition-all"
                  >
                    <img 
                      src={asset.url} 
                      alt={asset.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-3">
                      <span className="text-[10px] font-bold text-white truncate">{asset.name}</span>
                      <span className="text-[8px] font-mono text-slate-400 uppercase">{asset.folder}</span>
                    </div>
                  </button>
                ))}
                {projectAssets.length === 0 && (
                  <div className="col-span-2 py-20 text-center">
                    <ImageIcon className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No assets found for this project.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <MoodboardTemplateModal 
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}

function SlotContainer({ 
  label, 
  url, 
  onClick, 
  mini = false 
}: { 
  label?: string, 
  url?: string, 
  onClick?: () => void,
  mini?: boolean
}) {
  return (
    <div className="relative w-full h-full group flex flex-col gap-2">
      {label && (
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 font-mono tracking-[0.2em] uppercase flex items-center gap-2">
          {label}
        </span>
      )}
      <button 
        onClick={onClick}
        style={{ backgroundColor: url ? '#f1f5f9' : '#f8fafc' }}
        className={cn(
          "flex-1 w-full rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center relative overflow-hidden",
          url 
            ? "border-transparent dark:!bg-[#1e293b]" 
            : "border-slate-200 dark:border-slate-700 dark:!bg-[#1e293b]/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:border-orange-500/50"
        )}
      >
        {url ? (
          <>
            <img src={url} alt="Slot" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
              <PlusCircle className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Plus className={cn("text-slate-300 dark:text-slate-600 transition-colors group-hover:text-orange-500", mini ? "w-4 h-4" : "w-6 h-6")} />
            {!mini && <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Select Image</span>}
          </div>
        )}
      </button>
    </div>
  );
}
