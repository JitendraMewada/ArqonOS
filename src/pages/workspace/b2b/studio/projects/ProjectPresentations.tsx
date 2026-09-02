import React, { useState, useEffect } from 'react';
import { 
  Presentation, Play, Plus, ChevronLeft, 
  ChevronRight, Maximize2, Share2, Download, 
  FileText, Sparkles, CheckCircle2, Layers,
  Eye, Edit3, Trash2
} from 'lucide-react';
import { useStudio } from '../StudioContext';
import { cn } from '../../../../../lib/utils';
import { MOCK_PRESENTATIONS_BY_PROJECT, ProjectPresentation } from '../data/mockStudioData';

export function ProjectPresentations({ projectId }: { projectId: string }) {
  const { activeProject } = useStudio();
  const [presentations, setPresentations] = useState<ProjectPresentation[]>([]);
  const [activeDeck, setActiveDeck] = useState<ProjectPresentation | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`mock_presentations_${projectId}`);
    if (saved && saved !== 'undefined' && saved !== 'null') {
      try {
        const parsed = JSON.parse(saved);
        setPresentations(Array.isArray(parsed) ? parsed : (MOCK_PRESENTATIONS_BY_PROJECT[projectId] || []));
      } catch {
        setPresentations(MOCK_PRESENTATIONS_BY_PROJECT[projectId] || []);
      }
    } else {
      const defaultDecks = MOCK_PRESENTATIONS_BY_PROJECT[projectId] || [
        {
          id: `pres-${projectId}-1`,
          projectId,
          title: `${activeProject?.name || 'Project'} — Architectural Design Scheme`,
          clientName: activeProject?.clientName || 'Valued Client',
          status: 'Ready' as const,
          version: 'v1.0 Deck',
          updatedAt: '2026-06-01',
          slides: [
            {
              id: 'sl-1',
              title: activeProject?.name || 'Project Concept',
              type: 'cover' as const,
              subtitle: 'Comprehensive Interior Architecture & Design Presentation',
              description: 'Prepared for client spatial review, material signoff, and execution clearance.',
              imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6199f7a096?auto=format&fit=crop&q=80&w=1200'
            },
            {
              id: 'sl-2',
              title: 'Design Philosophy & Materiality',
              type: 'materials' as const,
              subtitle: 'Curated Textures, Honed Stone & Acoustic Warmth',
              description: 'Balancing architectural rigor with tactile natural finishes to elevate human wellbeing.',
              imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1200',
              keyPoints: [
                'Natural Honed Marble & Textured Limewash',
                'Custom Low-Slung Bespoke Joinery',
                'Perimeter Warm Indirect LED Lighting (3000K)',
                'Acoustic Ceiling & Wall Attenuation'
              ]
            }
          ]
        }
      ];
      setPresentations(defaultDecks);
      localStorage.setItem(`mock_presentations_${projectId}`, JSON.stringify(defaultDecks));
    }
  }, [projectId, activeProject]);

  const currentDeck = activeDeck || presentations[0];
  const currentSlide = currentDeck?.slides[activeSlideIndex] || currentDeck?.slides[0];

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextSlide = () => {
    if (currentDeck && activeSlideIndex < currentDeck.slides.length - 1) {
      setActiveSlideIndex((prev) => prev + 1);
    }
  };

  if (!currentDeck) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <Presentation className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
        <p className="text-slate-500 font-bold">No presentation decks generated yet.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 min-h-0">
      {/* Deck Header */}
      <div className="h-16 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-500">
            <Presentation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              {currentDeck.title}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                {currentDeck.status}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Client: {currentDeck.clientName} • Version {currentDeck.version}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            {copiedLink ? 'Link Copied!' : 'Share Deck'}
          </button>

          <button 
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-xs font-bold text-white transition-all shadow-sm active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Present Deck
          </button>
        </div>
      </div>

      {/* Main Presentation Stage */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Slide Thumbnails Sidebar */}
        <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 overflow-y-auto space-y-3 shrink-0">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            SLIDES ({currentDeck.slides.length})
          </div>

          {currentDeck.slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setActiveSlideIndex(idx)}
              className={cn(
                "w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 group",
                activeSlideIndex === idx
                  ? "bg-orange-50/50 dark:bg-orange-500/10 border-orange-300 dark:border-orange-500/30 shadow-sm"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600"
              )}
            >
              <div className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-700 dark:text-slate-300 shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {slide.title}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  {slide.type}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Active Slide Canvas View */}
        <div className="flex-1 flex flex-col bg-slate-900 p-8 overflow-y-auto items-center justify-center min-h-0">
          {currentSlide && (
            <div className="w-full max-w-4xl aspect-[16/10] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
              {currentSlide.imageUrl && (
                <div className="absolute inset-0 z-0 opacity-40">
                  <img 
                    src={currentSlide.imageUrl} 
                    alt={currentSlide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                </div>
              )}

              <div className="relative z-10 p-10 flex flex-col justify-between flex-1">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest border border-orange-500/30 mb-4">
                    {currentSlide.type}
                  </div>
                  <h1 className="text-3xl font-black text-white tracking-tight max-w-xl">
                    {currentSlide.title}
                  </h1>
                  {currentSlide.subtitle && (
                    <p className="text-base text-slate-300 mt-2 font-medium max-w-lg">
                      {currentSlide.subtitle}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  {currentSlide.description && (
                    <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                      {currentSlide.description}
                    </p>
                  )}

                  {currentSlide.keyPoints && currentSlide.keyPoints.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-800/80">
                      {currentSlide.keyPoints.map((point, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                          {point}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-6 border-t border-slate-900">
                  <span>{activeProject?.name} • Design Deck</span>
                  <span>Slide {activeSlideIndex + 1} of {currentDeck.slides.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handlePrevSlide}
              disabled={activeSlideIndex === 0}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-slate-400">
              {activeSlideIndex + 1} / {currentDeck.slides.length}
            </span>
            <button
              onClick={handleNextSlide}
              disabled={activeSlideIndex === currentDeck.slides.length - 1}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Mode Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col p-8 items-center justify-center">
          <button 
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 border border-slate-700"
          >
            Exit Fullscreen (Esc)
          </button>

          <div className="w-full max-w-6xl aspect-[16/9] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col p-12 justify-between">
            {currentSlide?.imageUrl && (
              <div className="absolute inset-0 z-0 opacity-40">
                <img 
                  src={currentSlide.imageUrl} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
              </div>
            )}
            <div className="relative z-10">
              <span className="text-orange-500 font-bold text-xs uppercase tracking-widest">{currentSlide?.type}</span>
              <h1 className="text-4xl font-black text-white mt-2">{currentSlide?.title}</h1>
              <p className="text-xl text-slate-300 mt-2">{currentSlide?.subtitle}</p>
            </div>
            <div className="relative z-10 flex items-center justify-between text-slate-400 text-sm">
              <button onClick={handlePrevSlide} disabled={activeSlideIndex === 0} className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-30">Previous</button>
              <span>{activeSlideIndex + 1} / {currentDeck.slides.length}</span>
              <button onClick={handleNextSlide} disabled={activeSlideIndex === currentDeck.slides.length - 1} className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-30">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
