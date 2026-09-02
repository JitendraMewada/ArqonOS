import React, { useState, useEffect } from 'react';
import { 
  History, GitCommit, Plus, CheckCircle2, 
  Clock, ArrowRight, Layers, FileText, 
  Sparkles, AlertCircle, Eye
} from 'lucide-react';
import { useStudio } from '../StudioContext';
import { cn } from '../../../../../lib/utils';
import { MOCK_REVISIONS_BY_PROJECT, ProjectRevision } from '../data/mockStudioData';

export function ProjectRevisions({ projectId }: { projectId: string }) {
  const { activeProject } = useStudio();
  const [revisions, setRevisions] = useState<ProjectRevision[]>([]);
  const [selectedRevision, setSelectedRevision] = useState<ProjectRevision | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newModule, setNewModule] = useState<ProjectRevision['affectedModule']>('Spaces');
  const [newChanges, setNewChanges] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(`mock_revisions_${projectId}`);
    if (saved && saved !== 'undefined' && saved !== 'null') {
      try {
        const parsed = JSON.parse(saved);
        setRevisions(Array.isArray(parsed) ? parsed : (MOCK_REVISIONS_BY_PROJECT[projectId] || []));
      } catch {
        setRevisions(MOCK_REVISIONS_BY_PROJECT[projectId] || []);
      }
    } else {
      const defaultRevisions = MOCK_REVISIONS_BY_PROJECT[projectId] || [
        {
          id: `rev-${projectId}-1`,
          projectId,
          revisionCode: 'REV-01',
          title: 'Initial Space Planning Refinements',
          description: 'Client spatial adjustments following initial concept review.',
          author: 'Lead Designer',
          affectedModule: 'Spaces' as const,
          changeSummary: [
            'Adjusted perimeter partition wall thickness to 150mm for acoustic lining',
            'Increased door width to 1000mm for wheelchair clearance'
          ],
          status: 'Approved' as const,
          createdAt: '2026-06-05'
        }
      ];
      setRevisions(defaultRevisions);
      localStorage.setItem(`mock_revisions_${projectId}`, JSON.stringify(defaultRevisions));
    }
  }, [projectId, activeProject]);

  const handleAddRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const nextNumber = revisions.length + 1;
    const revCode = `REV-0${nextNumber}`;

    const newRev: ProjectRevision = {
      id: `rev-${projectId}-${Date.now()}`,
      projectId,
      revisionCode: revCode,
      title: newTitle,
      description: newDesc,
      author: 'You (Project Lead)',
      affectedModule: newModule,
      changeSummary: newChanges ? newChanges.split('\n').filter(c => c.trim().length > 0) : ['General scope refinement'],
      status: 'Approved',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newRev, ...revisions];
    setRevisions(updated);
    localStorage.setItem(`mock_revisions_${projectId}`, JSON.stringify(updated));
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewChanges('');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 min-h-0">
      {/* Header */}
      <div className="p-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md">
                Audit Trail & History
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {revisions.length} Revisions Logged
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Design Revisions & Scope Changes
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Version-controlled delta logs tracking architectural modifications, material substitutions, and client directives.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Log Revision
          </button>
        </div>
      </div>

      {/* Timeline List */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 min-h-0">
        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {revisions.map((rev) => (
            <div key={rev.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-orange-500 border-4 border-white dark:border-slate-900 shadow-sm flex items-center justify-center" />

              <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black tracking-wider">
                      {rev.revisionCode}
                    </span>
                    <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {rev.affectedModule}
                    </span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      {rev.title}
                    </h4>
                  </div>

                  <span className="text-xs text-slate-400 font-medium">
                    {rev.createdAt} by {rev.author}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {rev.description}
                </p>

                {rev.changeSummary && rev.changeSummary.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Delta Modifications:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {rev.changeSummary.map((change, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{change}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Revision Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <form onSubmit={handleAddRevision} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Log Project Revision</h3>
              <p className="text-xs text-slate-500 font-medium">Document an architectural change or client-requested delta.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Revision Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Boardroom Wall Recess Niches & Conduit Upgrade"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Affected Module</label>
                <select
                  value={newModule}
                  onChange={(e) => setNewModule(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Spaces">Spaces</option>
                  <option value="Dimension Matrix">Dimension Matrix</option>
                  <option value="Sketches">Sketches & Drawings</option>
                  <option value="Moodboard">Moodboard</option>
                  <option value="Material Spec">Material Spec</option>
                  <option value="Budget">Budget</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Description / Directive</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Explain why this change occurred..."
                  rows={2}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Itemized Changes (One per line)</label>
                <textarea
                  value={newChanges}
                  onChange={(e) => setNewChanges(e.target.value)}
                  placeholder="Added 2 recess niches&#10;Updated ceiling drop to 12 inches"
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 shadow-sm"
              >
                Save Revision
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
