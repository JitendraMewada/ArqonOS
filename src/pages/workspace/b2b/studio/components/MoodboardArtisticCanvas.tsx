import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { 
  Move, RotateCcw, Maximize2, Layers, 
  Trash2, MousePointer2, Type, 
  Plus, GripHorizontal, Eye, Palette, 
  Box, Sun
} from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import type { Moodboard, MoodboardElement } from '../StudioContext';

interface Props {
  moodboard: Moodboard;
  onUpdate: (updates: Partial<Moodboard>) => void;
  onSelectSlot: (elementId: string) => void;
}

export function MoodboardArtisticCanvas({ moodboard, onUpdate, onSelectSlot }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const elements = moodboard.elements || [];

  const updateElement = (id: string, updates: Partial<MoodboardElement>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    onUpdate({ elements: newElements });
  };

  const removeElement = (id: string) => {
    onUpdate({ elements: elements.filter(el => el.id !== id) });
    setSelectedId(null);
  };

  const addTextElement = () => {
    const newElement: MoodboardElement = {
      id: `txt-${Date.now()}`,
      type: 'text',
      content: 'Handwritten thought...',
      x: 50,
      y: 50,
      zIndex: elements.length + 1,
      rotation: (Math.random() - 0.5) * 10
    };
    onUpdate({ elements: [...elements, newElement] });
  };

  const addPointerElement = () => {
    const newElement: MoodboardElement = {
      id: `ptr-${Date.now()}`,
      type: 'pointer',
      content: 'Detail',
      x: 40,
      y: 40,
      pointerTo: { x: 50, y: 50 },
      zIndex: elements.length + 1
    };
    onUpdate({ elements: [...elements, newElement] });
  };

  const addVellumElement = () => {
    const newElement: MoodboardElement = {
      id: `vel-${Date.now()}`,
      type: 'text',
      isVellum: true,
      content: 'A narrative layer exploring the intersection of light, material, and human experience within this architectural volume.',
      x: 65,
      y: 60,
      width: 350,
      zIndex: elements.length + 1,
      rotation: (Math.random() - 0.5) * 5
    };
    onUpdate({ elements: [...elements, newElement] });
  };

  const addColorSwatch = () => {
    const colors = moodboard.colorPalette || ['#f97316', '#0f172a', '#1e293b'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newElement: MoodboardElement = {
      id: `col-${Date.now()}`,
      type: 'color',
      content: randomColor,
      x: 80,
      y: 20,
      zIndex: elements.length + 1
    };
    onUpdate({ elements: [...elements, newElement] });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Redesigned Floating Artistic Toolbar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between bg-white/80 backdrop-blur-xl border border-white/40 p-2.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] mx-auto w-full max-w-3xl"
      >
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => onSelectSlot('new')}
            className="group flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-[11px] font-black hover:bg-orange-600 transition-all shadow-md hover:shadow-orange-200 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" /> IMAGE
          </button>
          
          <div className="w-px h-6 bg-slate-200/50 mx-1.5" />
          
          <button 
            onClick={addTextElement}
            className="flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 text-slate-600 rounded-xl text-[11px] font-bold transition-all active:scale-95"
          >
            <Type className="w-4 h-4 text-orange-400" /> ANNOTATION
          </button>
          
          <button 
            onClick={addVellumElement}
            className="flex items-center gap-2 px-3.5 py-2 hover:bg-orange-50 text-slate-700 rounded-xl text-[11px] font-bold transition-all border border-transparent hover:border-orange-100 active:scale-95"
          >
            <Layers className="w-4 h-4 text-orange-400" /> VELLUM
          </button>
          
          <button 
            onClick={addColorSwatch}
            className="flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 text-slate-600 rounded-xl text-[11px] font-bold transition-all active:scale-95"
          >
            <Palette className="w-4 h-4 text-orange-400" /> SWATCH
          </button>
          
          <button 
            onClick={addPointerElement}
            className="flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 text-slate-600 rounded-xl text-[11px] font-bold transition-all active:scale-95"
          >
            <MousePointer2 className="w-4 h-4 text-orange-400" /> POINTER
          </button>
        </div>

        <div className="flex flex-col items-end pr-4 pointer-events-none">
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">ARTISTIC</span>
          <span className="text-[10px] font-serif italic text-slate-400">Layered Composition</span>
        </div>
      </motion.div>

      {/* Main Canvas Area - Improved Aesthetics */}
      <div 
        ref={canvasRef}
        className="relative w-full aspect-[1.414/1] bg-[#faf8f5] rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.06)] overflow-visible border border-slate-100/50 p-12 transition-all"
        onClick={() => setSelectedId(null)}
        style={{
          backgroundImage: `
            radial-gradient(#e5e7eb 0.5px, transparent 0.5px),
            linear-gradient(to right, #f3f4f6 0.5px, transparent 0.5px),
            linear-gradient(to bottom, #f3f4f6 0.5px, transparent 0.5px)
          `,
          backgroundSize: '40px 40px, 100px 100px, 100px 100px',
          backgroundPosition: '20px 20px, center center, center center'
        }}
      >
        {/* Artistic Texture & Vignette */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] rounded-2xl" />
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.02)] rounded-2xl" />
        
        {elements.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)).map((el) => (
          <CanvasElement 
            key={el.id}
            element={el}
            canvasRef={canvasRef}
            isSelected={selectedId === el.id}
            onSelect={() => setSelectedId(el.id)}
            onUpdate={(updates) => updateElement(el.id, updates)}
            onRemove={() => removeElement(el.id)}
            onBringForward={() => {
              const maxZ = Math.max(...elements.map(e => e.zIndex || 0));
              updateElement(el.id, { zIndex: maxZ + 1 });
            }}
          />
        ))}

        {/* Empty State Hint */}
        {elements.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
            <Box className="w-16 h-16 text-slate-300 mb-4 stroke-[0.5]" />
            <p className="font-serif italic text-slate-400">Empty canvas. Start layering your vision.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CanvasElement({ 
  element, isSelected, canvasRef, onSelect, onUpdate, onRemove, onBringForward 
}: { 
  element: MoodboardElement; 
  isSelected: boolean;
  canvasRef: React.RefObject<HTMLDivElement>;
  onSelect: () => void;
  onUpdate: (updates: Partial<MoodboardElement>) => void;
  onRemove: () => void;
  onBringForward: () => void;
}) {
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    if (!isRotating) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!canvasRef.current) return;
      
      // Force cursor and disable selection during rotation
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      
      const rect = canvasRef.current.getBoundingClientRect();
      // Center of the element in pixel coordinates
      const centerX = rect.left + (element.x / 100) * rect.width;
      const centerY = rect.top + (element.y / 100) * rect.height;
      
      // Calculate angle from center to pointer position
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angle = Math.atan2(dy, dx);
      
      // Convert to degrees and subtract 90 since the handle is at the top
      const degrees = (angle * 180) / Math.PI + 90;
      
      onUpdate({ rotation: degrees });
    };

    const handlePointerUp = () => {
      setIsRotating(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isRotating, element.x, element.y, canvasRef, onUpdate]);

  // Use local state for immediate drag feedback to prevent jumping
  // and sync with parent on drag end
  const renderContent = () => {
    switch (element.type) {
      case 'image':
        return (
          <div className="relative group">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/40 backdrop-blur-sm border border-white/20 shadow-sm z-10 rotate-1 opacity-60" />
            <img 
              src={element.content} 
              alt=""
              className={cn(
                "w-full h-full object-cover rounded-[1px] transition-all duration-300",
                isSelected ? "ring-2 ring-orange-500/50" : "",
                element.dropShadow !== false ? "shadow-[25px_25px_50px_rgba(0,0,0,0.2)]" : "shadow-sm"
              )}
              style={{
                filter: 'sepia(0.05) contrast(1.05) brightness(1.02)',
              }}
            />
            {/* Fine paper edge */}
            <div className="absolute inset-0 border-[0.5px] border-black/5 rounded-[1px] pointer-events-none" />
          </div>
        );
      
      case 'text':
        if (element.isVellum) {
          return (
            <div className={cn(
              "p-8 rounded-[1px] backdrop-blur-[2px] shadow-2xl transition-all border border-white/30",
              isSelected ? "ring-2 ring-orange-500/30" : "",
              "bg-white/40"
            )}>
              <textarea
                value={element.content}
                onChange={(e) => onUpdate({ content: e.target.value })}
                className={cn(
                  "bg-transparent border-none p-0 resize-none focus:ring-0 w-full overflow-hidden leading-relaxed",
                  "font-['Playfair_Display'] text-xl italic text-slate-800 selection:bg-orange-200"
                )}
                style={{ height: 'auto' }}
              />
              <div className="mt-6 h-[1.5px] w-16 bg-orange-500/40" />
            </div>
          );
        }
        return (
          <div className={cn(
            "p-3 rounded cursor-text group transition-all",
            isSelected && "bg-white/30 backdrop-blur-sm ring-1 ring-orange-500/20"
          )}>
            <textarea
              value={element.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              className={cn(
                "bg-transparent border-none p-0 resize-none focus:ring-0 w-full overflow-hidden leading-tight",
                "font-['Caveat'] text-3xl text-slate-800 selection:bg-orange-200"
              )}
              style={{ height: 'auto' }}
            />
          </div>
        );

      case 'pointer':
        const dx = (element.pointerTo?.x || 0) - element.x;
        const dy = (element.pointerTo?.y || 0) - element.y;
        
        return (
          <div className="relative group p-6 -m-6">
            <div className="font-['Caveat'] text-xl text-orange-600 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-lg border border-orange-200/50 whitespace-nowrap select-none">
              {element.content}
            </div>
            <svg 
              className="absolute top-full left-1/2 -translate-x-1/2 overflow-visible pointer-events-none"
              width="100" height="100"
              style={{ 
                width: `${Math.max(30, Math.abs(dx) * 12)}px`, 
                height: `${Math.max(30, Math.abs(dy) * 12)}px`,
                transformOrigin: 'top center'
              }}
            >
              <path 
                d={`M 0 0 C ${dx * 3} ${dy * 1}, ${dx * 9} ${dy * 4}, ${dx * 12} ${dy * 12}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5 3"
                className="text-orange-400/80"
              />
              <circle cx={dx * 12} cy={dy * 12} r="3" fill="currentColor" className="text-orange-400" />
            </svg>
          </div>
        );

      case 'color':
        return (
          <div className={cn(
            "group relative transition-all p-6 -m-6",
            isSelected ? "z-50" : ""
          )}>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-white shadow-md rounded-full flex items-center justify-center border border-slate-100 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <Sun className="w-3 h-3 text-orange-500" />
            </div>
            <div 
              className={cn(
                "w-20 h-20 rounded-full shadow-2xl border-[6px] border-white transition-transform",
                isSelected ? "scale-110" : "hover:scale-105"
              )}
              style={{ backgroundColor: element.content }}
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md text-[11px] font-mono font-bold text-slate-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-slate-200">
              {element.content.toUpperCase()}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={canvasRef}
      onDragStart={() => onSelect()}
      onDragEnd={(_, info) => {
        if (canvasRef.current) {
          const rect = canvasRef.current.getBoundingClientRect();
          // Calculate the exact drop position relative to the container
          const x = ((info.point.x - rect.left) / rect.width) * 100;
          const y = ((info.point.y - rect.top) / rect.height) * 100;
          onUpdate({ x, y });
        }
      }}
      // Fixed position with style, animate only transforms
      style={{
        position: 'absolute',
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: element.width ? `${element.width}px` : 'auto',
        height: element.height ? `${element.height}px` : 'auto',
        minWidth: element.type === 'color' ? '80px' : '40px',
        minHeight: element.type === 'color' ? '80px' : '20px',
        zIndex: isSelected ? 100 : (element.zIndex || 1),
      }}
      animate={{
        x: "-50%",
        y: "-50%",
        rotate: element.rotation || 0,
        scale: isSelected ? 1.02 : 1,
      }}
      whileDrag={{ 
        scale: 1.05, 
        zIndex: 1000,
        transition: { duration: 0.1 } 
      }}
      className={cn(
        "touch-none select-none",
        isSelected ? "cursor-grabbing" : "cursor-grab"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {renderContent()}

      {/* Control Overlay */}
      {isSelected && (
        <div 
          onPointerDown={(e) => e.stopPropagation()}
          className={cn(
            "absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 backdrop-blur-md shadow-2xl border border-white/50 rounded-2xl p-1.5 animate-in fade-in zoom-in-95 duration-200 z-[101]",
            element.y < 15 ? "top-full mt-6" : "-top-16"
          )}
        >
          <div className="p-2 text-slate-400 cursor-grab active:cursor-grabbing border-r border-slate-100 mr-1">
            <GripHorizontal className="w-4 h-4" />
          </div>
          
          <button 
            onPointerDown={() => setIsRotating(true)}
            onPointerUp={() => setIsRotating(false)}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
            title="Rotate"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button 
            onClick={onBringForward}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
            title="Bring to Front"
          >
            <Layers className="w-4 h-4" />
          </button>

          {element.type === 'image' && (
            <button 
              onClick={() => onUpdate({ dropShadow: !element.dropShadow })}
              className={cn(
                "p-2 rounded-xl transition-all",
                element.dropShadow !== false ? "bg-orange-50 text-orange-600" : "hover:bg-slate-100 text-slate-600"
              )}
              title="Toggle Depth Shadow"
            >
              <Box className="w-4 h-4" />
            </button>
          )}

          {element.type === 'text' && (
            <button 
              onClick={() => onUpdate({ isVellum: !element.isVellum })}
              className={cn(
                "p-2 rounded-xl transition-all",
                element.isVellum ? "bg-orange-50 text-orange-600" : "hover:bg-slate-100 text-slate-600"
              )}
              title="Toggle Vellum Overlay"
            >
              <Sun className="w-4 h-4" />
            </button>
          )}

          {element.type === 'image' && (
            <button 
              onClick={() => onUpdate({ width: (element.width || 300) + 50 })}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
              title="Scale Up"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}

          <div className="w-px h-6 bg-slate-100 mx-1" />

          <button 
            onClick={onRemove}
            className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
