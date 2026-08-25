import React, { useState } from "react";
import {
  Users,
  Eye,
  Link as LinkIcon,
  AtSign,
  ArrowUpRight,
  ShieldAlert,
  X,
  Settings2,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { cn } from "../../../../lib/utils";

export function PeopleCollaboration() {
  const [configuringRule, setConfiguringRule] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleGenerateLink = () => {
    const uniqueId = Math.random().toString(36).substring(2, 10);
    const mockLink = `https://arqon.os/shared-access/${uniqueId}`;
    setGeneratedLink(mockLink);
    setLinkCopied(false);
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 transition-colors p-6 overflow-auto relative">
      {/* Rule Configuration Modal */}
      {configuringRule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-indigo-500" /> Configure:{" "}
                {configuringRule}
              </h3>
              <button
                onClick={() => setConfiguringRule(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  Detailed configuration for {configuringRule} is handled by the
                  RBAC Policy engine. Modifying visibility rules may affect
                  cross-module tag visibility.
                </p>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    defaultChecked
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Enable this visibility rule
                  </span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setConfiguringRule(null)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setConfiguringRule(null)}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                  Save Rule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Collaboration Visibility
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage mentions, shared access visibility, and linking. Note:
          Real-time chat is handled by Quest.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-8">
          {/* Mentions Module */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <AtSign className="w-3 h-3" /> System Mentions
            </h2>
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Cross-Module Tagging
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Configure how users can tag each other across Flow, Studio, and
                Cost modules to trigger notifications in Quest.
              </p>

              <div className="space-y-3">
                <label className="flex flex-col p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-lg cursor-pointer hover:border-purple-500/50 transition-colors">
                  <span className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Global Tagging
                    </span>
                    <input
                      type="radio"
                      name="mentions"
                      className="text-purple-600 focus:ring-purple-500"
                    />
                  </span>
                  <span className="text-xs text-slate-500">
                    Any user can mention any other user across the entire OS.
                  </span>
                </label>

                <label className="flex flex-col p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-lg cursor-pointer hover:border-purple-500/50 transition-colors border-purple-500/30 ring-1 ring-purple-500/20">
                  <span className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Department-Strict Tagging
                    </span>
                    <input
                      type="radio"
                      name="mentions"
                      defaultChecked
                      className="text-purple-600 focus:ring-purple-500"
                    />
                  </span>
                  <span className="text-xs text-slate-500">
                    Users can only tag members within their own department or
                    shared projects.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Visibility Rules */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Eye className="w-3 h-3" /> Visibility Rules
            </h2>
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl p-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700 flex flex-col items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                      External Isolation
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">
                      Vendors and Clients cannot see internal directories by
                      default.
                    </p>
                  </div>
                  <button
                    onClick={() => setConfiguringRule("External Isolation")}
                    className="mt-auto text-[10px] font-black uppercase tracking-widest text-purple-500 hover:text-purple-600 flex items-center gap-1 group"
                  >
                    Configure Rule{" "}
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700 flex flex-col items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                      Project-Based Directory
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">
                      Users only see profiles of people added to their active
                      workflows.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setConfiguringRule("Project-Based Directory")
                    }
                    className="mt-auto text-[10px] font-black uppercase tracking-widest text-purple-500 hover:text-purple-600 flex items-center gap-1 group"
                  >
                    Configure Rule{" "}
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key Contacts & Info */}
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-6 rounded-xl">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <LinkIcon className="w-3 h-3" /> Shared Access Linking
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-white truncate">
                    Cross-tenant Linking
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    Temporarily assign access via URL
                  </span>
                </div>
              </div>
            </div>
            {!generatedLink ? (
              <button
                onClick={handleGenerateLink}
                className="mt-6 w-full py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 rounded-lg text-[11px] font-black uppercase tracking-widest shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <LinkIcon className="w-4 h-4" /> Generate Secure Link
              </button>
            ) : (
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedLink}
                    className="flex-1 px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={cn(
                      "p-2 rounded-lg border flex items-center justify-center transition-all",
                      linkCopied
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
                    )}
                    title="Copy link"
                  >
                    {linkCopied ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-[9px] text-slate-400 text-center font-medium">
                  Link expires in 24 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
