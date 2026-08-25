import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, AlertCircle } from 'lucide-react';
import { type Project, useStudio } from '../StudioContext';

interface ProjectSettingsModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectSettingsModal({ project, onClose }: ProjectSettingsModalProps) {
  const { deleteProject, setActiveProject } = useStudio();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const verifyString = project.code?.trim() || project.name.trim();

  const handleDelete = async () => {
    if (confirmText.trim() !== verifyString) {
      setError(`Please type ${verifyString} to confirm.`);
      return;
    }
    
    try {
      setIsDeleting(true);
      await deleteProject(project.id);
      setActiveProject(null);
    } catch (err: any) {
      console.error("Failed to delete project:", err);
      // Attempt to parse FirestoreErrorInfo
      try {
        const errInfo = JSON.parse(err.message);
        setError(`Error: ${errInfo.error}`);
      } catch {
        setError(err.message || "Failed to delete project. Please try again.");
      }
      setIsDeleting(false);
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Project Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20">
            <AlertCircle className="w-6 h-6 text-orange-500 shrink-0" />
            <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
              Basic project details can be edited in the Overview tab. Use this menu to perform structural project actions.
            </p>
          </div>

          <div className="border border-red-200 dark:border-red-900/50 rounded-xl overflow-hidden">
            <div className="p-4 bg-red-50 dark:bg-red-500/10 border-b border-red-200 dark:border-red-900/50">
              <h3 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Danger Zone
              </h3>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 space-y-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Deleting this project will permanently remove all associated data, including spaces, dimensions, team assignments, and documents.
              </p>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Type "{verifyString}" to verify
                </label>
                <input 
                  type="text" 
                  value={confirmText}
                  onChange={(e) => {
                    setConfirmText(e.target.value);
                    setError(null);
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border flex items-center h-10 px-3 rounded-lg text-sm border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                  placeholder={verifyString}
                />
              </div>

              {error && (
                <p className="text-sm font-bold text-red-500">{error}</p>
              )}

              <button 
                onClick={handleDelete}
                disabled={isDeleting || confirmText.trim() !== verifyString}
                className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold h-10 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {isDeleting ? "Deleting..." : "Delete Project permanently"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
