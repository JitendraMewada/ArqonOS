import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Grid, List as ListIcon, 
  MoreVertical, Calendar, User, MapPin, 
  ArrowRight, PencilRuler, Clock, LayoutGrid
} from 'lucide-react';
import { useStudio, type Project } from './StudioContext';
import { cn } from '../../../../lib/utils';

export function StudioDashboard() {
  const { projects, loading, setActiveProject, createProject, seedMockProjects } = useStudio();
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    await seedMockProjects();
    setSeeding(false);
  };
  
  const [newProject, setNewProject] = useState({
    name: '',
    code: '',
    clientName: '',
    type: 'Residential'
  });

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    p.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = await createProject(newProject);
      setShowCreateModal(false);
      setNewProject({ name: '', code: '', clientName: '', type: 'Residential' });
    } catch (err) {
      console.error("Failed to create project", err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="animate-pulse text-orange-500 font-black tracking-widest uppercase text-xs">
          Syncing Projects...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col gap-8 animate-in fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Project Dashboard</h1>
          <p className="text-sm font-medium text-slate-500 mt-2">Manage and execute your interior design projects.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search projects by name, code or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
          />
        </div>
        
        <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 rounded-xl p-1 border border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setView('grid')}
            className={cn("p-2 rounded-lg transition-all", view === 'grid' ? "bg-white dark:bg-slate-700 text-orange-500 shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300")}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setView('list')}
            className={cn("p-2 rounded-lg transition-all", view === 'list' ? "bg-white dark:bg-slate-700 text-orange-500 shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300")}
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Project Grid */}
      <div className="flex-1">
        {filteredProjects.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center opacity-50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-700">
              <PencilRuler className="w-8 h-8 text-slate-400" />
            </div>
            <p className="font-bold text-slate-500">No projects found</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="mt-4 text-orange-500 hover:text-orange-600 text-sm font-bold"
            >
              Create your first project
            </button>
            <button 
              onClick={handleSeed}
              disabled={seeding}
              className="mt-2 text-slate-500 hover:text-slate-600 text-sm font-medium disabled:opacity-50"
            >
              {seeding ? "Loading..." : "Or click here to load 6 Demo Projects (Quest integrated)"}
            </button>
          </div>
        ) : (
          <div className={cn(
            "grid gap-6",
            view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                view={view}
                onClick={() => setActiveProject(project)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Create New Project</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Project Name</label>
                <input 
                  required
                  type="text" 
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  placeholder="e.g. Skyline Residence"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Project Code</label>
                  <input 
                    required
                    type="text" 
                    value={newProject.code}
                    onChange={(e) => setNewProject({...newProject, code: e.target.value})}
                    placeholder="ARQ-001"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Project Type</label>
                  <select 
                    value={newProject.type}
                    onChange={(e) => setNewProject({...newProject, type: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white appearance-none"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Retail">Retail</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Client Name</label>
                <input 
                  required
                  type="text" 
                  value={newProject.clientName}
                  onChange={(e) => setNewProject({...newProject, clientName: e.target.value})}
                  placeholder="e.g. John Wick"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
              >
                Create Project <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  view: 'grid' | 'list';
  onClick: () => void;
  key?: React.Key;
}

function ProjectCard({ project, view, onClick }: ProjectCardProps) {
  if (view === 'list') {
    return (
      <button 
        onClick={onClick}
        className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 p-4 rounded-xl flex items-center gap-6 transition-all text-left shadow-sm hover:shadow-md"
      >
        <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-lg flex items-center justify-center text-orange-500 shrink-0">
          <PencilRuler className="w-6 h-6" />
        </div>
        <div className="flex-grow grid grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{project.code}</p>
            <h3 className="font-black text-slate-900 dark:text-white line-clamp-1">{project.name}</h3>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Client</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{project.clientName}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Type</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{project.type}</p>
          </div>
          <div className="flex items-center justify-end">
            <span className={cn(
              "text-[10px] px-2 py-1 rounded-md font-black uppercase tracking-widest",
              project.status === 'Active' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
            )}>
              {project.status}
            </span>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-orange-500 transition-colors" />
      </button>
    );
  }

  return (
    <button 
      onClick={onClick}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 hover:ring-1 hover:ring-orange-500/50 p-6 rounded-2xl flex flex-col gap-6 transition-all text-left shadow-sm hover:shadow-xl hover:shadow-orange-500/5"
    >
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white rounded-xl flex items-center justify-center text-orange-500 transition-all">
          <PencilRuler className="w-6 h-6" />
        </div>
        <span className={cn(
          "text-[10px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest",
          project.status === 'Active' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
        )}>
          {project.status}
        </span>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black text-orange-600 dark:text-orange-500 bg-orange-100 dark:bg-orange-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest">{project.code}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{project.type}</span>
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors leading-tight">{project.name}</h3>
        <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-1.5">
          <User className="w-4 h-4 text-slate-400" /> {project.clientName}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Calendar className="w-3.5 h-3.5" /> Progress
          </div>
          <p className="text-sm font-black text-slate-700 dark:text-slate-300">0 / 0 Days</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5" /> Timeline
          </div>
          <p className="text-sm font-black text-slate-700 dark:text-slate-300">Not Started</p>
        </div>
      </div>
    </button>
  );
}
