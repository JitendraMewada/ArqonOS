import React, { useState } from "react";
import { useConnect, Communication } from "./ConnectContext";
import {
  Mail,
  Phone,
  Presentation,
  Search,
  Filter,
  Plus,
  X,
} from "lucide-react";
import { cn } from "../../../../lib/utils";
import { LogActivityModal } from "./LogActivityModal";

export function ConnectCommunication() {
  const { communications, leads } = useConnect();
  const [showLogModal, setShowLogModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<Communication["type"] | "All">(
    "All",
  );

  const filteredComms = communications.filter((comm) => {
    const lead = leads.find((l) => l.id === comm.leadId);
    const searchLow = searchQuery?.toLowerCase() || '';
    const matchesSearch =
      (comm.summary || '').toLowerCase().includes(searchLow) ||
      (lead?.clientName || '').toLowerCase().includes(searchLow) ||
      (lead?.projectName || '').toLowerCase().includes(searchLow) ||
      ((lead as any)?.name || '').toLowerCase().includes(searchLow) ||
      ((lead as any)?.company || '').toLowerCase().includes(searchLow);
    const matchesType = filterType === "All" || comm.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <>
      <div className="p-8 h-full flex flex-col gap-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Communications
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Log and review client interactions.
            </p>
          </div>
          <button
            onClick={() => setShowLogModal(true)}
            className="h-9 px-4 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Log Activity
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 bg-slate-50/50 dark:bg-slate-800/50 flex-shrink-0 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search communications..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-[#3b82f6] transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              {(["All", "Email", "Call", "Meeting"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                    filterType === type
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50",
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredComms.map((comm) => {
                const lead = leads.find((l) => l.id === comm.leadId);
                return (
                  <div
                    key={comm.id}
                    className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors flex gap-6 items-start"
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                        comm.type === "Email"
                          ? "bg-blue-50 text-blue-500 dark:bg-blue-900/30"
                          : comm.type === "Call"
                            ? "bg-emerald-50 text-emerald-500 dark:bg-emerald-900/30"
                            : "bg-indigo-50 text-indigo-500 dark:bg-indigo-900/30",
                      )}
                    >
                      {comm.type === "Email" ? (
                        <Mail className="w-5 h-5" />
                      ) : comm.type === "Call" ? (
                        <Phone className="w-5 h-5" />
                      ) : (
                        <Presentation className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {comm.type} with {lead?.clientName || "Unknown"}
                          </h4>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">
                            {lead?.projectName}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                          {comm.date}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800/50 mt-3 leading-relaxed">
                        {comm.summary}
                      </p>
                      <div className="flex items-center gap-2 mt-4">
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                          {comm.author.charAt(0)}
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                          Logged by {comm.author}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredComms.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  No communications found matching your criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showLogModal && (
        <LogActivityModal onClose={() => setShowLogModal(false)} />
      )}
    </>
  );
}
