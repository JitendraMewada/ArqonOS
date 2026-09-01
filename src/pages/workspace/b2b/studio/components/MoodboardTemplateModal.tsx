import React, { useState } from 'react';
import { 
  X, Check, Layout, Sparkles, Filter, Search, 
  Layers, Grid3X3, ArrowRight, Palette, Eye, BookOpen
} from 'lucide-react';
import { MOODBOARD_TEMPLATES, MoodboardTemplatePreset } from '../data/moodboardTemplates';
import { cn } from '../../../../../lib/utils';

interface MoodboardTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: MoodboardTemplatePreset | null, layoutType?: 'editorial' | 'artistic' | 'grid') => void;
}

export function MoodboardTemplateModal({ isOpen, onClose, onSelectTemplate }: MoodboardTemplateModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLayout, setSelectedLayout] = useState<'all' | 'editorial' | 'artistic' | 'grid'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const categories = ['All', 'Residential', 'Commercial', 'Hospitality'];

  const filteredTemplates = MOODBOARD_TEMPLATES.filter(tpl => {
    const matchesCategory = selectedCategory === 'All' || tpl.category === selectedCategory;
    const matchesLayout = selectedLayout === 'all' || tpl.layoutType === selectedLayout;
    const matchesSearch = !searchQuery || 
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesLayout && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">Create Concept Board from Blueprint</h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Select an architectural editorial layout, organic layered canvas, or ISO A3 technical grid.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search styles, materials, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap",
                    selectedCategory === cat 
                      ? "bg-orange-500 text-white shadow-sm" 
                      : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Layout Filter */}
          <div className="flex items-center gap-1.5 border-l border-slate-800 pl-4">
            <span className="text-xs text-slate-500 mr-1 font-mono uppercase tracking-wider">Layout:</span>
            <button
              onClick={() => setSelectedLayout('all')}
              className={cn(
                "px-2.5 py-1 rounded text-xs transition",
                selectedLayout === 'all' ? "bg-slate-800 text-white font-semibold" : "text-slate-400 hover:text-slate-200"
              )}
            >
              All
            </button>
            <button
              onClick={() => setSelectedLayout('editorial')}
              className={cn(
                "px-2.5 py-1 rounded text-xs flex items-center gap-1 transition",
                selectedLayout === 'editorial' ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 font-semibold" : "text-slate-400 hover:text-slate-200"
              )}
            >
              <Sparkles className="w-3.5 h-3.5" /> Editorial
            </button>
            <button
              onClick={() => setSelectedLayout('artistic')}
              className={cn(
                "px-2.5 py-1 rounded text-xs flex items-center gap-1 transition",
                selectedLayout === 'artistic' ? "bg-purple-500/20 text-purple-400 border border-purple-500/40" : "text-slate-400 hover:text-slate-200"
              )}
            >
              <Layers className="w-3.5 h-3.5" /> Artistic
            </button>
            <button
              onClick={() => setSelectedLayout('grid')}
              className={cn(
                "px-2.5 py-1 rounded text-xs flex items-center gap-1 transition",
                selectedLayout === 'grid' ? "bg-blue-500/20 text-blue-400 border border-blue-500/40" : "text-slate-400 hover:text-slate-200"
              )}
            >
              <Grid3X3 className="w-3.5 h-3.5" /> Technical A3
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Quick Blank Options */}
          <div 
            onClick={() => { onSelectTemplate(null, 'editorial'); onClose(); }}
            className="group relative border-2 border-dashed border-amber-500/30 hover:border-amber-500 rounded-xl p-5 flex flex-col justify-between bg-amber-500/5 hover:bg-amber-500/10 transition cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white group-hover:text-amber-400 transition">Blank Editorial Presentation</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Architectural client-ready presentation with Bohemian, Japandi, and Modern Minimalist aesthetic presets.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-medium">
              <span>Start Blank Editorial</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          <div 
            onClick={() => { onSelectTemplate(null, 'artistic'); onClose(); }}
            className="group relative border-2 border-dashed border-slate-800 hover:border-purple-500/50 rounded-xl p-5 flex flex-col justify-between bg-slate-950/40 hover:bg-purple-500/5 transition cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white group-hover:text-purple-400 transition">Blank Artistic Canvas</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Freeform infinite moodboard with rotation, opacity, layering, and tactile sticky note specifications.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-purple-400 font-medium">
              <span>Start Blank Artistic</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          <div 
            onClick={() => { onSelectTemplate(null, 'grid'); onClose(); }}
            className="group relative border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-xl p-5 flex flex-col justify-between bg-slate-950/40 hover:bg-blue-500/5 transition cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Grid3X3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white group-hover:text-blue-400 transition">Blank Technical A3 Grid</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                ISO standardized presentation template with Hero focal point, 2x2 materials, narrative, and color spectrum.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 font-medium">
              <span>Start Blank ISO Grid</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Curated Preset Cards */}
          {filteredTemplates.map((preset) => (
            <div 
              key={preset.id}
              className="border border-slate-800 hover:border-orange-500/60 rounded-xl overflow-hidden bg-slate-950 flex flex-col group transition shadow-sm hover:shadow-xl hover:shadow-orange-500/5"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img 
                  src={preset.thumbnailUrl} 
                  alt={preset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
                
                {/* Badge tags */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                    preset.layoutType === 'editorial'
                      ? "bg-amber-500/90 text-white backdrop-blur-md"
                      : preset.layoutType === 'artistic' 
                      ? "bg-purple-500/80 text-white backdrop-blur-md" 
                      : "bg-blue-500/80 text-white backdrop-blur-md"
                  )}>
                    {preset.layoutType === 'editorial' ? 'Editorial' : preset.layoutType === 'artistic' ? 'Artistic' : 'ISO Grid'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/60 text-slate-300 text-[10px] font-medium backdrop-blur-md">
                    {preset.category}
                  </span>
                </div>

                {/* Color Swatch Bar */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center gap-1 p-1 bg-black/60 backdrop-blur-md rounded-md">
                  {preset.colorPalette.map((color, i) => (
                    <div 
                      key={i} 
                      className="h-3 flex-1 rounded-sm shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition line-clamp-1">
                    {preset.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {preset.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-end gap-2">
                  <button
                    onClick={() => { onSelectTemplate(preset); onClose(); }}
                    className="w-full py-2 px-3 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Use This Blueprint
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-500">
          <span>{filteredTemplates.length} architectural style blueprints available</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 transition"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
