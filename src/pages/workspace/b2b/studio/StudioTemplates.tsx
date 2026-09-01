import React, { useState } from 'react';
import { 
  Sparkles, Layers, Grid3X3, Search, Filter, Palette, 
  ArrowRight, FolderPlus, Eye, BookOpen, Check, Layout
} from 'lucide-react';
import { MOODBOARD_TEMPLATES, MoodboardTemplatePreset } from './data/moodboardTemplates';
import { useStudio } from './StudioContext';
import { cn } from '../../../../lib/utils';
import { MoodboardTemplateModal } from './components/MoodboardTemplateModal';

export function StudioTemplates() {
  const { projects, createProjectMoodboard, activeProject, setActiveProject } = useStudio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLayout, setSelectedLayout] = useState<'all' | 'artistic' | 'grid'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [applyingPreset, setApplyingPreset] = useState<MoodboardTemplatePreset | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(activeProject?.id || (projects[0]?.id || ''));
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const categories = ['All', 'Residential', 'Commercial', 'Hospitality'];

  const filteredTemplates = MOODBOARD_TEMPLATES.filter(tpl => {
    const matchesCat = selectedCategory === 'All' || tpl.category === selectedCategory;
    const matchesLayout = selectedLayout === 'all' || tpl.layoutType === selectedLayout;
    const matchesSearch = !searchQuery || 
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCat && matchesLayout && matchesSearch;
  });

  const handleApplyToProject = async (preset: MoodboardTemplatePreset, targetProjectId: string) => {
    if (!targetProjectId) {
      setStatusMessage('Please select or create a project first.');
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

    try {
      await createProjectMoodboard(targetProjectId, {
        name: preset.name,
        layoutType: preset.layoutType,
        colorPalette: preset.colorPalette,
        heroSlot: preset.heroSlot || '',
        narrative: preset.narrative || '',
        technicalGrid: preset.technicalGrid || ['', '', '', ''],
        materialPalette: preset.materialPalette || ['', '', '', ''],
        elements: (preset.elements as any) || []
      });

      const targetProj = projects.find(p => p.id === targetProjectId);
      if (targetProj) {
        setActiveProject(targetProj);
      }

      setStatusMessage(`Template "${preset.name}" applied successfully!`);
      setApplyingPreset(null);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      console.error('Failed to apply template:', err);
      setStatusMessage('Failed to apply template. Check console.');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505] overflow-y-auto text-slate-200">
      
      {/* Header */}
      <div className="px-8 py-8 border-b border-slate-800/80 bg-slate-950/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-500 uppercase tracking-widest mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Architectural Blueprints & Style Library</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Studio Templates</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Pre-engineered design boards, tactile finish schedules, color spectrums, and spatial templates ready to inject directly into active projects.
          </p>
        </div>

        {statusMessage && (
          <div className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="px-8 py-4 border-b border-slate-800 bg-[#0a0a0a] flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by aesthetic, material, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap",
                  selectedCategory === cat 
                    ? "bg-orange-500 text-white shadow-sm" 
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Layout:</span>
          <button
            onClick={() => setSelectedLayout('all')}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-medium transition",
              selectedLayout === 'all' ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
            )}
          >
            All
          </button>
          <button
            onClick={() => setSelectedLayout('artistic')}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition",
              selectedLayout === 'artistic' ? "bg-purple-500/20 text-purple-400 border border-purple-500/40" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <Layers className="w-3.5 h-3.5" /> Artistic
          </button>
          <button
            onClick={() => setSelectedLayout('grid')}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition",
              selectedLayout === 'grid' ? "bg-blue-500/20 text-blue-400 border border-blue-500/40" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <Grid3X3 className="w-3.5 h-3.5" /> Technical A3
          </button>
        </div>

      </div>

      {/* Grid of Templates */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div 
            key={template.id}
            className="group border border-slate-800 hover:border-orange-500/60 rounded-2xl overflow-hidden bg-slate-950 flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/5"
          >
            {/* Image Banner */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
              <img 
                src={template.thumbnailUrl} 
                alt={template.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className={cn(
                  "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider",
                  template.layoutType === 'artistic' 
                    ? "bg-purple-500/80 text-white backdrop-blur-md" 
                    : "bg-blue-500/80 text-white backdrop-blur-md"
                )}>
                  {template.layoutType === 'artistic' ? 'Artistic Canvas' : 'Technical A3 Grid'}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-black/60 text-slate-300 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10">
                  {template.category}
                </span>
              </div>

              {/* Swatch Strip */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 p-1.5 bg-black/70 backdrop-blur-md rounded-lg border border-white/10">
                {template.colorPalette.map((hex, i) => (
                  <div 
                    key={i} 
                    className="h-3 flex-1 rounded-sm shadow-sm"
                    style={{ backgroundColor: hex }}
                    title={hex}
                  />
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-orange-500 uppercase tracking-widest">{template.style}</span>
                  <span className="text-[10px] font-mono text-slate-500">{template.tags[0]}</span>
                </div>
                <h3 className="text-base font-black text-white group-hover:text-orange-400 transition tracking-tight">
                  {template.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {template.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {template.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
                {applyingPreset?.id === template.id ? (
                  <div className="flex flex-col gap-2 p-3 bg-slate-900 rounded-xl border border-orange-500/30 animate-in fade-in">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Target Project:</label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full py-1.5 px-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => handleApplyToProject(template, selectedProjectId)}
                        className="flex-1 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition"
                      >
                        Confirm Import
                      </button>
                      <button
                        onClick={() => setApplyingPreset(null)}
                        className="px-3 py-1.5 bg-slate-800 text-slate-400 text-xs rounded-lg hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setApplyingPreset(template);
                      if (projects.length > 0 && !selectedProjectId) {
                        setSelectedProjectId(projects[0].id);
                      }
                    }}
                    className="w-full py-2.5 px-4 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/20 hover:border-orange-500 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition duration-200"
                  >
                    <FolderPlus className="w-4 h-4" />
                    <span>Apply to Project</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
