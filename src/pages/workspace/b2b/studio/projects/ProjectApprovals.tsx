import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Clock, XCircle, AlertCircle, 
  Lock, Unlock, ArrowRight, UserCheck, 
  FileCheck, ShieldAlert, MessageSquare, Plus
} from 'lucide-react';
import { useStudio } from '../StudioContext';
import { cn } from '../../../../../lib/utils';
import { MOCK_APPROVALS_BY_PROJECT, ProjectApproval } from '../data/mockStudioData';

export function ProjectApprovals({ projectId }: { projectId: string }) {
  const { activeProject } = useStudio();
  const [approvals, setApprovals] = useState<ProjectApproval[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<ProjectApproval | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(`mock_approvals_${projectId}`);
    if (saved && saved !== 'undefined' && saved !== 'null') {
      try {
        const parsed = JSON.parse(saved);
        setApprovals(Array.isArray(parsed) ? parsed : (MOCK_APPROVALS_BY_PROJECT[projectId] || []));
      } catch {
        setApprovals(MOCK_APPROVALS_BY_PROJECT[projectId] || []);
      }
    } else {
      const defaultApprovals = MOCK_APPROVALS_BY_PROJECT[projectId] || [
        {
          id: `appr-${projectId}-1`,
          projectId,
          title: 'Initial Concept & Design Scope Sign-off',
          category: 'Concept Design' as const,
          status: 'Approved' as const,
          submittedBy: 'Project Lead',
          submittedAt: '2026-06-01',
          reviewedBy: activeProject?.clientName || 'Client Committee',
          reviewedAt: '2026-06-03',
          feedback: 'Concept direction aligns with target requirements.',
          unlocksCostModule: false,
          version: 'v1.0'
        },
        {
          id: `appr-${projectId}-2`,
          projectId,
          title: 'Final Architectural Design Sign-off & BOQ Baseline',
          category: 'BOQ & Final Signoff' as const,
          status: 'Approved' as const,
          submittedBy: 'Project Lead',
          submittedAt: '2026-06-10',
          reviewedBy: activeProject?.clientName || 'Client Committee',
          reviewedAt: '2026-06-12',
          feedback: 'Approved. Authorization to proceed to Costing and Procurement.',
          unlocksCostModule: true,
          version: 'v2.0'
        }
      ];
      setApprovals(defaultApprovals);
      localStorage.setItem(`mock_approvals_${projectId}`, JSON.stringify(defaultApprovals));
    }
  }, [projectId, activeProject]);

  const saveApprovals = (newApprovals: ProjectApproval[]) => {
    setApprovals(newApprovals);
    localStorage.setItem(`mock_approvals_${projectId}`, JSON.stringify(newApprovals));
  };

  const handleUpdateStatus = (id: string, newStatus: ProjectApproval['status']) => {
    const updated = approvals.map(appr => {
      if (appr.id === id) {
        return {
          ...appr,
          status: newStatus,
          reviewedBy: 'You (Lead Signoff)',
          reviewedAt: new Date().toISOString().split('T')[0],
          feedback: feedbackText || appr.feedback
        };
      }
      return appr;
    });
    saveApprovals(updated);
    setActionSuccessMsg(`Milestone updated to ${newStatus}`);
    setSelectedApproval(null);
    setFeedbackText('');
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  const isCostModuleUnlocked = approvals.some(a => a.unlocksCostModule && a.status === 'Approved');

  const getStatusBadge = (status: ProjectApproval['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
      case 'Revision Requested':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
            <AlertCircle className="w-3.5 h-3.5" /> Revision Needed
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 min-h-0">
      {/* Header */}
      <div className="p-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md">
                Gatekeeper Workflow
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {approvals.length} Stages
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Design Milestone Approvals
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Client & Lead Designer formal sign-offs. Studio approval unlocks downstream Cost & Vendor modules.
            </p>
          </div>

          {/* Cost Gate Status Banner */}
          <div className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all",
            isCostModuleUnlocked 
              ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
              : "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center font-bold",
              isCostModuleUnlocked ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
            )}>
              {isCostModuleUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider">
                Cost & Vendor Engine Gate
              </div>
              <div className="text-xs font-black">
                {isCostModuleUnlocked ? 'UNLOCKED & AUTHORIZED' : 'LOCKED (Requires Final Signoff)'}
              </div>
            </div>
          </div>
        </div>

        {actionSuccessMsg && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {actionSuccessMsg}
          </div>
        )}
      </div>

      {/* Approvals List */}
      <div className="flex-1 overflow-y-auto p-8 space-y-4 min-h-0">
        <div className="grid grid-cols-1 gap-4">
          {approvals.map((approval) => (
            <div 
              key={approval.id}
              className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {approval.category}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-[10px] font-bold text-orange-500">
                      {approval.version}
                    </span>
                    {approval.unlocksCostModule && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                        Cost Module Gate
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {approval.title}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-medium pt-1">
                    <span>Submitted by <strong className="text-slate-700 dark:text-slate-300">{approval.submittedBy}</strong> on {approval.submittedAt}</span>
                    {approval.reviewedBy && (
                      <span>• Reviewed by <strong className="text-slate-700 dark:text-slate-300">{approval.reviewedBy}</strong> on {approval.reviewedAt}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(approval.status)}
                  <button
                    onClick={() => setSelectedApproval(approval)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    Action
                  </button>
                </div>
              </div>

              {approval.feedback && (
                <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                  <MessageSquare className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-200">Review Note: </span>
                    {approval.feedback}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Review & Action Modal */}
      {selectedApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase text-orange-500">{selectedApproval.category}</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{selectedApproval.title}</h3>
              <p className="text-xs text-slate-500 font-medium">Record formal client sign-off decision and feedback notes.</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Feedback / Directive</label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Enter feedback or approval condition..."
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedApproval(null)}
                className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedApproval.id, 'Revision Requested')}
                className="px-3 py-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold hover:bg-purple-500/20"
              >
                Request Revision
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedApproval.id, 'Approved')}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm"
              >
                Sign & Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
