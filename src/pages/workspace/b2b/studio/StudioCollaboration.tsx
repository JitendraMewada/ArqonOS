import React, { useState } from 'react';
import { 
  Users, MessageSquare, CheckCircle2, Clock, 
  AlertCircle, Filter, Search, Tag, AtSign, 
  Layers, ChevronRight, Check, Sparkles 
} from 'lucide-react';
import { useStudio } from './StudioContext';
import { cn } from '../../../../lib/utils';

interface DesignReview {
  id: string;
  projectId: string;
  projectName: string;
  author: string;
  role: string;
  avatar: string;
  targetSpace: string;
  comment: string;
  mentionedRole: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'needs_revision';
}

const INITIAL_REVIEWS: DesignReview[] = [
  {
    id: 'rev-1',
    projectId: 'proj-1',
    projectName: 'Penthouse Lumina Suite',
    author: 'Sarah Chen',
    role: 'Lead Designer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    targetSpace: 'Master Bedroom & Walk-in Closet',
    comment: 'False ceiling drop level needs to be synced with the AC ducting elevation. @Draftsman please verify the beam clearances in section B-B.',
    mentionedRole: '@Draftsman',
    timestamp: '2 hours ago',
    status: 'needs_revision'
  },
  {
    id: 'rev-2',
    projectId: 'proj-1',
    projectName: 'Penthouse Lumina Suite',
    author: 'David Lee',
    role: 'Draftsman',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    targetSpace: 'Living & Dining Area',
    comment: 'Updated dimension matrix reflects the revised 250mm beam depth. Revised technical sketch uploaded to drawing ledger v2.1.',
    mentionedRole: '@Lead Designer',
    timestamp: '5 hours ago',
    status: 'resolved'
  },
  {
    id: 'rev-3',
    projectId: 'proj-2',
    projectName: 'Nexa Skyline Corporate HQ',
    author: 'Elena Rostova',
    role: '3D Designer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    targetSpace: 'Reception & Waiting Lounge',
    comment: 'Acoustic fluted timber panel moodboard and lighting schedule ready for client walkthrough deck.',
    mentionedRole: '@Creative Director',
    timestamp: 'Yesterday',
    status: 'pending'
  }
];

export function StudioCollaboration() {
  const { projects } = useStudio();
  const [reviews, setReviews] = useState<DesignReview[]>(INITIAL_REVIEWS);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  
  // New review state
  const [newComment, setNewComment] = useState('');
  const [targetSpace, setTargetSpace] = useState('');
  const [targetProject, setTargetProject] = useState(projects[0]?.id || 'proj-1');
  const [mentionedRole, setMentionedRole] = useState('@Draftsman');

  const filteredReviews = reviews.filter(rev => {
    const matchStatus = selectedStatus === 'all' || rev.status === selectedStatus;
    const matchProj = selectedProjectId === 'all' || rev.projectId === selectedProjectId;
    const matchSearch = !searchQuery || 
      rev.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.targetSpace.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchProj && matchSearch;
  });

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !targetSpace.trim()) return;

    const proj = projects.find(p => p.id === targetProject) || { name: 'Active Project', id: targetProject };

    const newRev: DesignReview = {
      id: `rev-${Date.now()}`,
      projectId: proj.id,
      projectName: proj.name,
      author: 'Workspace Admin',
      role: 'Project Lead',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      targetSpace: targetSpace.trim(),
      comment: newComment.trim(),
      mentionedRole,
      timestamp: 'Just now',
      status: 'pending'
    };

    setReviews([newRev, ...reviews]);
    setNewComment('');
    setTargetSpace('');
  };

  const handleToggleStatus = (id: string, nextStatus: 'pending' | 'resolved' | 'needs_revision') => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: nextStatus } : r));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="px-8 py-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-500 uppercase tracking-widest mb-1.5">
            <Users className="w-4 h-4" />
            <span>Design Reviews & Cross-Discipline Coordination</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Studio Collaboration</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Lightweight design feedback ledger, dimensional sign-offs, and role-directed spatial commentary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{reviews.filter(r => r.status === 'pending').length} Active Reviews</span>
          </div>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Review Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Controls Bar */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search reviews, spaces, or authors..."
                className="w-full bg-transparent border-none text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="needs_revision">Needs Revision</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={selectedProjectId}
                onChange={e => setSelectedProjectId(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">All Projects</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Feed List */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="p-12 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No design reviews found</h3>
                <p className="text-xs text-slate-500 mt-1">Submit spatial commentary or adjust your active filters.</p>
              </div>
            ) : (
              filteredReviews.map(rev => (
                <div 
                  key={rev.id}
                  className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-orange-500/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={rev.avatar} alt={rev.author} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rev.author}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            {rev.role}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {rev.projectName} • <span className="text-orange-500 font-medium">{rev.targetSpace}</span> • {rev.timestamp}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border",
                        rev.status === 'resolved' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                        rev.status === 'needs_revision' && "bg-rose-500/10 text-rose-500 border-rose-500/20",
                        rev.status === 'pending' && "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      )}>
                        {rev.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800/80 font-medium">
                    {rev.comment}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                    <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-bold text-[11px]">
                      <AtSign className="w-3.5 h-3.5" />
                      <span>Notified: {rev.mentionedRole}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {rev.status !== 'resolved' && (
                        <button
                          onClick={() => handleToggleStatus(rev.id, 'resolved')}
                          className="px-2.5 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Mark Resolved
                        </button>
                      )}
                      {rev.status !== 'needs_revision' && (
                        <button
                          onClick={() => handleToggleStatus(rev.id, 'needs_revision')}
                          className="px-2.5 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] font-bold transition-colors flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" /> Request Revision
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Post Review Form */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 sticky top-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-500">
              <MessageSquare className="w-4 h-4" />
              <span>Log Design Review</span>
            </div>

            <form onSubmit={handlePostReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Project</label>
                <select
                  value={targetProject}
                  onChange={e => setTargetProject(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Space / Drawing</label>
                <input
                  type="text"
                  value={targetSpace}
                  onChange={e => setTargetSpace(e.target.value)}
                  placeholder="e.g. Master Bedroom Ceiling Section"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Notify Role</label>
                <select
                  value={mentionedRole}
                  onChange={e => setMentionedRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="@Lead Designer">@Lead Designer</option>
                  <option value="@Draftsman">@Draftsman</option>
                  <option value="@3D Designer">@3D Designer</option>
                  <option value="@Site Supervisor">@Site Supervisor</option>
                  <option value="@Creative Director">@Creative Director</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Review Feedback & Directives</label>
                <textarea
                  rows={4}
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Add specific spatial, dimensional, or material feedback..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20 active:scale-98"
              >
                Post Design Directive
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
