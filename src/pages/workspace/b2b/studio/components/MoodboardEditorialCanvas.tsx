import React, { useState } from 'react';
import { 
  Palette, 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  Layers, 
  RotateCcw,
  Maximize2
} from 'lucide-react';
import { Moodboard, EditorialSwatch, EditorialMaterial } from '../StudioContext';
import { cn } from '../../../../../lib/utils';

interface MoodboardEditorialCanvasProps {
  moodboard: Moodboard;
  onUpdate: (data: Partial<Moodboard>) => void;
  onSelectSlot?: (index: number) => void;
}

export const MoodboardEditorialCanvas: React.FC<MoodboardEditorialCanvasProps> = ({
  moodboard,
  onUpdate,
  onSelectSlot
}) => {
  const theme = moodboard.editorialTheme || 'bohemian';
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Defaults fallback
  const eyebrow = moodboard.eyebrow ?? (
    theme === 'bohemian' ? 'Concept 03 of 03' :
    theme === 'japandi' ? 'CONCEPT 02 OF 03' : 'CONCEPT 01 OF 03'
  );
  
  const title = moodboard.name || (
    theme === 'bohemian' ? 'Bohemian Eclectic' :
    theme === 'japandi' ? 'Japandi Warm Neutral' : 'Modern Minimalist'
  );

  const tagline = moodboard.tagline ?? (
    theme === 'bohemian' ? 'Layered, well-travelled, gently maximal — a room built by hand, not by set.' :
    theme === 'japandi' ? 'Scandinavian restraint meets wabi-sabi warmth — low furniture, soft asymmetry, natural imperfection.' :
    'Quiet, uncluttered, sculptural — a space that edits itself down to what matters.'
  );

  const clientName = moodboard.clientName ?? 'Private Residence';
  const roomName = moodboard.roomName ?? (
    theme === 'bohemian' ? 'Living Room' :
    theme === 'japandi' ? 'Master Bedroom' : 'Main Living & Dining'
  );
  const conceptDate = moodboard.conceptDate ?? 'Autumn 2026';

  const concept = moodboard.editorialConcept ?? (
    theme === 'bohemian' ? 'A rich tapestry of saturated earth tones, vintage brass, patterned textiles, and layered greenery. This space embraces eclectic curation where every object carries a story. Textures range from nubby handwoven wool to aged velvet and warm terracotta.' :
    theme === 'japandi' ? 'A harmonious study in tactile restraint. Light ash wood, unbleached linen, and lime-wash plaster combine to create a space that breathes. Nothing is purely decorative; everything has purpose, texture, and quiet presence.' :
    'An intentional composition of pure geometry, micro-cement, honed stone, and warm architectural lighting. Every line is considered, every material authentic. Negative space is treated as an active design element rather than an empty void.'
  );

  const swatches: EditorialSwatch[] = moodboard.swatches?.length ? moodboard.swatches : (
    theme === 'bohemian' ? [
      { id: 's-1', hex: '#B5583A', label: 'Terracotta' },
      { id: 's-2', hex: '#C99A3D', label: 'Ochre' },
      { id: 's-3', hex: '#2F4F4A', label: 'Deep Forest' },
      { id: 's-4', hex: '#7A3B4E', label: 'Plum' },
      { id: 's-5', hex: '#E8D5B5', label: 'Warm Oat' },
      { id: 's-6', hex: '#2B2420', label: 'Dark Wood' }
    ] :
    theme === 'japandi' ? [
      { id: 's-1', hex: '#FAF5EA', label: 'Rice Paper' },
      { id: 's-2', hex: '#E8DEC8', label: 'Limewash' },
      { id: 's-3', hex: '#C99A6C', label: 'Raw Clay' },
      { id: 's-4', hex: '#74805F', label: 'Moss' },
      { id: 's-5', hex: '#9E8B75', label: 'Warm Oak' },
      { id: 's-6', hex: '#2E2A25', label: 'Sumi Ink' }
    ] :
    [
      { id: 's-1', hex: '#FFFFFF', label: 'Pure White' },
      { id: 's-2', hex: '#EBE7DF', label: 'Warm Grey' },
      { id: 's-3', hex: '#B8B3A8', label: 'Taupe' },
      { id: 's-4', hex: '#6B705C', label: 'Olive' },
      { id: 's-5', hex: '#3D3A35', label: 'Charcoal' },
      { id: 's-6', hex: '#1A1918', label: 'Absolute Black' }
    ]
  );

  const tiles: string[] = moodboard.tiles?.length ? moodboard.tiles : (
    theme === 'bohemian' ? [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80'
    ] :
    theme === 'japandi' ? [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80'
    ] :
    [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80'
    ]
  );

  const materials: EditorialMaterial[] = moodboard.materials?.length ? moodboard.materials : (
    theme === 'bohemian' ? [
      { id: 'm-1', hex: '#B5583A', name: 'Kilim wool', note: 'rug & cushions' },
      { id: 'm-2', hex: '#C99A3D', name: 'Aged brass', note: 'hardware & lighting' },
      { id: 'm-3', hex: '#D4A373', name: 'Rattan & cane', note: 'accent chairs' },
      { id: 'm-4', hex: '#7A3B4E', name: 'Washed velvet', note: 'drapery' },
      { id: 'm-5', hex: '#E8D5B5', name: 'Raw linen', note: 'sofa slipcover' },
      { id: 'm-6', hex: '#2F4F4A', name: 'Glazed zellige', note: 'tile backsplash' }
    ] :
    theme === 'japandi' ? [
      { id: 'm-1', hex: '#D9C5A0', name: 'Light Ash Wood', note: 'joinery & tables' },
      { id: 'm-2', hex: '#FAF5EA', name: 'Washi Paper', note: 'pendant lamps' },
      { id: 'm-3', hex: '#E8DEC8', name: 'Limewash Plaster', note: 'walls & ceiling' },
      { id: 'm-4', hex: '#9E8B75', name: 'Belgian Linen', note: 'curtains & bedding' },
      { id: 'm-5', hex: '#C99A6C', name: 'Unglazed Clay', note: 'vessels & lamps' },
      { id: 'm-6', hex: '#74805F', name: 'Tatami Weave', note: 'floor mats' }
    ] :
    [
      { id: 'm-1', hex: '#EBE7DF', name: 'Honed Limestone', note: 'flooring & hearth' },
      { id: 'm-2', hex: '#8A857C', name: 'Brushed Stainless', note: 'hardware & taps' },
      { id: 'm-3', hex: '#FFFFFF', name: 'Bouclé Wool', note: 'lounge seating' },
      { id: 'm-4', hex: '#3D3A35', name: 'Smoked Oak', note: 'custom millwork' },
      { id: 'm-5', hex: '#B8B3A8', name: 'Microcement', note: 'island & baths' },
      { id: 'm-6', hex: '#6B705C', name: 'Sheer Linen', note: 'floor-to-ceiling' }
    ]
  );

  // Handlers
  const handleThemeChange = (newTheme: 'bohemian' | 'japandi' | 'minimalist') => {
    onUpdate({ editorialTheme: newTheme });
  };

  const handleUpdateSwatch = (id: string, field: 'hex' | 'label', val: string) => {
    const updated = swatches.map(s => s.id === id ? { ...s, [field]: val } : s);
    onUpdate({ swatches: updated });
  };

  const handleAddSwatch = () => {
    const newSwatch: EditorialSwatch = {
      id: `swatch-${Date.now()}`,
      hex: theme === 'bohemian' ? '#E07A5F' : theme === 'japandi' ? '#C2B8A3' : '#7D8597',
      label: 'New Color'
    };
    onUpdate({ swatches: [...swatches, newSwatch] });
  };

  const handleRemoveSwatch = (id: string) => {
    if (swatches.length <= 2) return;
    onUpdate({ swatches: swatches.filter(s => s.id !== id) });
  };

  const handleTileUpload = (index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const newTiles = [...tiles];
            newTiles[index] = event.target.result as string;
            onUpdate({ tiles: newTiles });
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleAddTile = () => {
    const sampleImages = [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
    ];
    const newTile = sampleImages[tiles.length % sampleImages.length];
    onUpdate({ tiles: [...tiles, newTile] });
  };

  const handleRemoveTile = (index: number) => {
    if (tiles.length <= 1) return;
    const newTiles = tiles.filter((_, i) => i !== index);
    onUpdate({ tiles: newTiles });
  };

  const handleUpdateMaterial = (id: string, field: 'name' | 'note' | 'hex', val: string) => {
    const updated = materials.map(m => m.id === id ? { ...m, [field]: val } : m);
    onUpdate({ materials: updated });
  };

  const handleAddMaterial = () => {
    const newMat: EditorialMaterial = {
      id: `mat-${Date.now()}`,
      hex: theme === 'bohemian' ? '#C99A3D' : theme === 'japandi' ? '#C99A6C' : '#8A857C',
      name: 'New Material',
      note: 'finish note'
    };
    onUpdate({ materials: [...materials, newMat] });
  };

  const handleRemoveMaterial = (id: string) => {
    if (materials.length <= 2) return;
    onUpdate({ materials: materials.filter(m => m.id !== id) });
  };

  // Archetype Theme Configs
  const isBohemian = theme === 'bohemian';
  const isJapandi = theme === 'japandi';
  const isMinimalist = theme === 'minimalist';

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      {/* Theme Switcher Bar */}
      <div className="flex items-center justify-between bg-[#111] p-3 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Editorial Style
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">Choose aesthetic blueprint template:</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleThemeChange('bohemian')}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2",
              isBohemian 
                ? "bg-[#B5583A] text-white shadow-lg shadow-[#B5583A]/30 border border-[#E2D3AE]/40" 
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-[#B5583A]" />
            Bohemian Eclectic
          </button>

          <button
            onClick={() => handleThemeChange('japandi')}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2",
              isJapandi 
                ? "bg-[#74805F] text-white shadow-lg shadow-[#74805F]/30 border border-[#C99A6C]/40" 
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-[#74805F]" />
            Japandi Warm Neutral
          </button>

          <button
            onClick={() => handleThemeChange('minimalist')}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2",
              isMinimalist 
                ? "bg-slate-800 text-white shadow-lg shadow-black/50 border border-slate-600" 
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Modern Minimalist
          </button>
        </div>
      </div>

      {/* Main Board Layout Container */}
      <div 
        id="moodboard-print-canvas"
        className={cn(
          "w-full rounded-2xl shadow-2xl transition-all duration-300 relative overflow-hidden",
          isBohemian && "bg-[#F7EEDD] text-[#2B2420] border-2 border-[#E2D3AE] font-serif",
          isJapandi && "bg-[#FAF5EA] text-[#2E2A25] border-2 border-[#DCD0B8]",
          isMinimalist && "bg-[#FFFFFF] text-[#232220] border-2 border-[#E3DFD6]"
        )}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Bohemian Decorative Top Color Bar */}
        {isBohemian && (
          <div className="h-3.5 w-full flex overflow-hidden">
            <div className="flex-1 bg-[#B5583A]" />
            <div className="flex-1 bg-[#C99A3D]" />
            <div className="flex-1 bg-[#2F4F4A]" />
            <div className="flex-1 bg-[#7A3B4E]" />
            <div className="flex-1 bg-[#E8D5B5]" />
            <div className="flex-1 bg-[#B5583A]" />
            <div className="flex-1 bg-[#C99A3D]" />
            <div className="flex-1 bg-[#2F4F4A]" />
          </div>
        )}

        {/* Japandi Watermark Circle Background */}
        {isJapandi && (
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full border-[18px] border-[#C99A6C]/10 pointer-events-none" />
        )}

        <div className="p-8 sm:p-12 flex flex-col gap-10">
          {/* Header Section */}
          <div className="flex flex-col gap-4 border-b pb-8" style={{
            borderColor: isBohemian ? '#E2D3AE' : isJapandi ? '#DCD0B8' : '#E3DFD6'
          }}>
            {/* Eyebrow */}
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={eyebrow}
                onChange={(e) => onUpdate({ eyebrow: e.target.value })}
                className={cn(
                  "bg-transparent border-none p-0 focus:ring-0",
                  isBohemian && "font-['Caveat',cursive] text-2xl text-[#B5583A]",
                  isJapandi && "text-xs font-bold tracking-[0.25em] text-[#74805F] uppercase",
                  isMinimalist && "text-xs font-mono font-bold tracking-[0.2em] text-[#6B705C] uppercase"
                )}
              />
              <span className="text-xs opacity-40 font-mono">ARQON STUDIO • EDITORIAL</span>
            </div>

            {/* Title & Tagline */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                value={title}
                onChange={(e) => onUpdate({ name: e.target.value })}
                className={cn(
                  "bg-transparent border-none p-0 focus:ring-0 w-full font-bold tracking-tight",
                  isBohemian && "font-['Cormorant_Garamond',serif] text-4xl sm:text-5xl text-[#2B2420]",
                  isJapandi && "font-['Shippori_Mincho',serif] text-3xl sm:text-4xl text-[#2E2A25] tracking-wide",
                  isMinimalist && "font-['Archivo',sans-serif] text-3xl sm:text-4xl text-[#232220] uppercase font-black tracking-tighter"
                )}
              />
              <input
                type="text"
                value={tagline}
                onChange={(e) => onUpdate({ tagline: e.target.value })}
                className={cn(
                  "bg-transparent border-none p-0 focus:ring-0 w-full italic text-sm sm:text-base opacity-75",
                  isMinimalist && "not-italic font-sans text-xs tracking-wider uppercase opacity-60 mt-1"
                )}
              />
            </div>

            {/* Metadata Bar (Client, Room, Date) */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-3 text-xs opacity-70">
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider opacity-60">Client:</span>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => onUpdate({ clientName: e.target.value })}
                  className="bg-transparent border-b border-dashed border-current p-0 text-xs focus:ring-0 w-32"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider opacity-60">Space:</span>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => onUpdate({ roomName: e.target.value })}
                  className="bg-transparent border-b border-dashed border-current p-0 text-xs focus:ring-0 w-32"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider opacity-60">Timeline:</span>
                <input
                  type="text"
                  value={conceptDate}
                  onChange={(e) => onUpdate({ conceptDate: e.target.value })}
                  className="bg-transparent border-b border-dashed border-current p-0 text-xs focus:ring-0 w-28"
                />
              </div>
            </div>

            {/* Editorial Concept Paragraph */}
            <div className="pt-2">
              <textarea
                value={concept}
                onChange={(e) => onUpdate({ editorialConcept: e.target.value })}
                rows={3}
                placeholder="Enter concept design narrative..."
                className={cn(
                  "w-full bg-transparent border-none p-0 focus:ring-0 resize-none text-sm sm:text-base leading-relaxed opacity-85",
                  isBohemian && "font-serif",
                  isJapandi && "font-['Shippori_Mincho',serif]",
                  isMinimalist && "font-sans leading-relaxed"
                )}
              />
            </div>
          </div>

          {/* Section 01: Palette */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 opacity-60" />
                <span className={cn(
                  "font-bold uppercase tracking-widest text-xs",
                  isBohemian && "font-['Caveat',cursive] text-lg text-[#B5583A] normal-case tracking-normal",
                  isJapandi && "text-xs tracking-[0.2em] text-[#74805F]",
                  isMinimalist && "font-mono text-xs tracking-[0.2em]"
                )}>
                  01 / COLOR SPECTRUM & PALETTE
                </span>
              </div>
              <button
                onClick={handleAddSwatch}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border border-current opacity-60 hover:opacity-100 transition-opacity"
              >
                <Plus className="w-3 h-3" /> Add Swatch
              </button>
            </div>

            {/* Swatch Displays according to theme */}
            {isMinimalist ? (
              /* Minimalist: Contiguous Bar with fine vertical dividers */
              <div className="flex w-full rounded-xl overflow-hidden border border-[#E3DFD6] shadow-sm">
                {swatches.map((swatch, idx) => (
                  <div 
                    key={swatch.id}
                    className="flex-1 min-w-[70px] h-28 flex flex-col justify-between p-3 relative group transition-all"
                    style={{ backgroundColor: swatch.hex }}
                  >
                    <div className="flex justify-between items-start">
                      <input
                        type="color"
                        value={swatch.hex}
                        onChange={(e) => handleUpdateSwatch(swatch.id, 'hex', e.target.value)}
                        className="w-5 h-5 opacity-0 cursor-pointer absolute top-2 left-2"
                      />
                      <button
                        onClick={() => handleRemoveSwatch(swatch.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded bg-black/50 text-white hover:bg-red-600 transition-all ml-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="backdrop-blur-sm bg-black/40 rounded p-1 text-[10px] text-white font-mono flex flex-col gap-0.5">
                      <input
                        type="text"
                        value={swatch.label}
                        onChange={(e) => handleUpdateSwatch(swatch.id, 'label', e.target.value)}
                        className="bg-transparent border-none p-0 text-[10px] font-bold text-white focus:ring-0 leading-none truncate"
                      />
                      <span className="opacity-75">{swatch.hex}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : isJapandi ? (
              /* Japandi: Arch-top / Half-round Swatches */
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {swatches.map((swatch) => (
                  <div key={swatch.id} className="flex flex-col items-center gap-2 group relative">
                    <div 
                      className="w-full h-24 rounded-t-full rounded-b-md shadow-sm border border-[#DCD0B8] relative overflow-hidden cursor-pointer"
                      style={{ backgroundColor: swatch.hex }}
                    >
                      <input
                        type="color"
                        value={swatch.hex}
                        onChange={(e) => handleUpdateSwatch(swatch.id, 'hex', e.target.value)}
                        className="w-full h-full opacity-0 cursor-pointer"
                      />
                      <button
                        onClick={() => handleRemoveSwatch(swatch.id)}
                        className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={swatch.label}
                      onChange={(e) => handleUpdateSwatch(swatch.id, 'label', e.target.value)}
                      className="bg-transparent border-none p-0 text-center font-['Shippori_Mincho',serif] text-xs font-semibold text-[#2E2A25] focus:ring-0 w-full truncate"
                    />
                    <span className="text-[10px] font-mono opacity-50">{swatch.hex}</span>
                  </div>
                ))}
              </div>
            ) : (
              /* Bohemian: Round playful circular swatches */
              <div className="flex flex-wrap items-center justify-around gap-6 py-2">
                {swatches.map((swatch) => (
                  <div key={swatch.id} className="flex flex-col items-center gap-2 group relative">
                    <div 
                      className="w-20 h-20 rounded-full shadow-md border-2 border-white/80 relative overflow-hidden transition-transform group-hover:scale-105"
                      style={{ backgroundColor: swatch.hex }}
                    >
                      <input
                        type="color"
                        value={swatch.hex}
                        onChange={(e) => handleUpdateSwatch(swatch.id, 'hex', e.target.value)}
                        className="w-full h-full opacity-0 cursor-pointer"
                      />
                      <button
                        onClick={() => handleRemoveSwatch(swatch.id)}
                        className="opacity-0 group-hover:opacity-100 absolute inset-0 m-auto w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={swatch.label}
                      onChange={(e) => handleUpdateSwatch(swatch.id, 'label', e.target.value)}
                      className="bg-transparent border-none p-0 text-center font-['Caveat',cursive] text-lg font-bold text-[#2B2420] focus:ring-0 w-24 truncate"
                    />
                    <span className="text-[10px] font-mono text-[#B5583A] font-bold">{swatch.hex}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 02: Inspiration Tile Grid */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className={cn(
                "font-bold uppercase tracking-widest text-xs",
                isBohemian && "font-['Caveat',cursive] text-lg text-[#B5583A] normal-case tracking-normal",
                isJapandi && "text-xs tracking-[0.2em] text-[#74805F]",
                isMinimalist && "font-mono text-xs tracking-[0.2em]"
              )}>
                02 / VISUAL INSPIRATION & KEYSHOTS
              </span>
              <button
                onClick={handleAddTile}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border border-current opacity-60 hover:opacity-100 transition-opacity"
              >
                <Plus className="w-3 h-3" /> Add Tile
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {tiles.map((imgUrl, idx) => {
                const rotationAngle = isBohemian ? (idx % 3 === 0 ? -2 : idx % 3 === 1 ? 1.5 : 0) : 0;
                return (
                  <div
                    key={idx}
                    className={cn(
                      "group relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg border transition-all duration-300",
                      isBohemian && "border-[#E2D3AE] hover:rotate-0",
                      isJapandi && "border-[#DCD0B8]",
                      isMinimalist && "border-[#E3DFD6] rounded-none aspect-square"
                    )}
                    style={{
                      transform: isBohemian ? `rotate(${rotationAngle}deg)` : undefined
                    }}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Inspiration ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          if (onSelectSlot) onSelectSlot(idx);
                          else handleTileUpload(idx);
                        }}
                        className="p-2.5 rounded-full bg-white text-black hover:bg-orange-500 hover:text-white transition-all shadow-md"
                        title="Upload / Change Image"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveTile(idx)}
                        className="p-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all shadow-md"
                        title="Remove Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white font-mono">
                      IMAGE 0{idx + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 03: Materials & Finishes */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className={cn(
                "font-bold uppercase tracking-widest text-xs",
                isBohemian && "font-['Caveat',cursive] text-lg text-[#B5583A] normal-case tracking-normal",
                isJapandi && "text-xs tracking-[0.2em] text-[#74805F]",
                isMinimalist && "font-mono text-xs tracking-[0.2em]"
              )}>
                03 / TACTILE MATERIALS & SPECIFICATIONS
              </span>
              <button
                onClick={handleAddMaterial}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border border-current opacity-60 hover:opacity-100 transition-opacity"
              >
                <Plus className="w-3 h-3" /> Add Material
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {materials.map((mat) => (
                <div 
                  key={mat.id}
                  className={cn(
                    "p-3 rounded-xl border flex items-center gap-3.5 group relative transition-all",
                    isBohemian && "bg-white/40 border-[#E2D3AE]/80",
                    isJapandi && "bg-[#FAF5EA]/80 border-[#DCD0B8]",
                    isMinimalist && "bg-[#F4F2ED]/60 border-[#E3DFD6] rounded-lg"
                  )}
                >
                  {/* Swatch chip */}
                  <div 
                    className={cn(
                      "w-10 h-10 shrink-0 shadow-sm border relative overflow-hidden cursor-pointer",
                      isBohemian && "rotate-3 rounded-md border-[#E2D3AE]",
                      isJapandi && "rounded-md border-[#DCD0B8]",
                      isMinimalist && "rounded-full border-[#E3DFD6]"
                    )}
                    style={{ backgroundColor: mat.hex || '#ccc' }}
                  >
                    <input
                      type="color"
                      value={mat.hex || '#cccccc'}
                      onChange={(e) => handleUpdateMaterial(mat.id, 'hex', e.target.value)}
                      className="w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>

                  {/* Label inputs */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <input
                      type="text"
                      value={mat.name}
                      onChange={(e) => handleUpdateMaterial(mat.id, 'name', e.target.value)}
                      className={cn(
                        "bg-transparent border-none p-0 text-xs font-bold focus:ring-0 w-full truncate",
                        isBohemian && "font-serif text-sm",
                        isJapandi && "font-['Shippori_Mincho',serif] text-xs font-bold",
                        isMinimalist && "font-sans uppercase text-[11px] tracking-wider"
                      )}
                    />
                    <input
                      type="text"
                      value={mat.note}
                      onChange={(e) => handleUpdateMaterial(mat.id, 'note', e.target.value)}
                      className="bg-transparent border-none p-0 text-[11px] opacity-60 italic focus:ring-0 w-full truncate"
                    />
                  </div>

                  <button
                    onClick={() => handleRemoveMaterial(mat.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-all shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer stamp */}
          <div className="pt-6 border-t flex flex-wrap items-center justify-between text-[11px] opacity-50 font-mono" style={{
            borderColor: isBohemian ? '#E2D3AE' : isJapandi ? '#DCD0B8' : '#E3DFD6'
          }}>
            <span>ARQON STUDIO CONCEPT BLUEPRINT • SPECIFICATION READY</span>
            <span>STATUS: APPROVED FOR COST & EXECUTION</span>
          </div>
        </div>
      </div>
    </div>
  );
};
