import React, { useState } from "react";
import { useConnect } from "./ConnectContext";
import {
  Users,
  TrendingUp,
  Presentation,
  PhoneCall,
  ArrowUpRight,
  Plus,
  Mail,
} from "lucide-react";
import { cn } from "../../../../lib/utils";
import { NewLeadModal } from "./NewLeadModal";

export function ConnectDashboard() {
  const { leads, communications, goToPage } = useConnect();
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);

  const totalValue = leads
    .filter((l) => l.status !== "lost")
    .reduce((acc, curr) => acc + (curr.estimatedValue || (curr as any).value || 0), 0);
  const activeLeads = leads.filter(
    (l) => l.status !== "won" && l.status !== "lost",
  ).length;
  const recentComms = communications.slice(0, 5);

  return (
    <>
      <div className="p-8 h-full flex flex-col gap-6 overflow-y-auto animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              CRM Dashboard
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Pipeline overview and recent activities.
            </p>
          </div>
          <button
            onClick={() => setShowNewLeadModal(true)}
            className="h-9 px-4 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Lead
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                <Users className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Active Leads
              </p>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {activeLeads}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500">
                <TrendingUp className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Pipeline Value
              </p>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              ₹{(totalValue / 1000).toFixed(1)}k
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500">
                <Presentation className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Won Deals
              </p>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {leads.filter((l) => l.status === "won").length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-500">
                <PhoneCall className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Total Comms
              </p>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {communications.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" /> Recent Leads
              </h3>
            </div>
            <div className="p-0 flex-1 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase tracking-widest text-slate-400 font-black">
                    <th className="p-4 font-bold">Client Name</th>
                    <th className="p-4 font-bold">Project Name</th>
                    <th className="p-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(0, 5).map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="p-4">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {lead.clientName}
                        </p>
                      </td>
                      <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                        {lead.projectName}
                      </td>
                      <td className="p-4">
                        <span
                          className={cn(
                            "text-[10px] uppercase tracking-widest font-black px-2 py-1 rounded-md",
                            lead.status === "won"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : lead.status === "lost"
                                ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                          )}
                        >
                          {lead.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-indigo-500" /> Recent
                Communications
              </h3>
              <button 
                onClick={() => goToPage('Communication Page')}
                className="text-[10px] font-bold text-sky-500 uppercase tracking-widest hover:text-sky-600 flex items-center gap-1"
              >
                View All <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="p-0 flex-1 overflow-y-auto">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentComms.map((comm) => {
                  const lead = leads.find((l) => l.id === comm.leadId);
                  return (
                    <div
                      key={comm.id}
                      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                        {comm.type === "Email" ? (
                          <Mail className="w-4 h-4 text-slate-500" />
                        ) : comm.type === "Call" ? (
                          <PhoneCall className="w-4 h-4 text-slate-500" />
                        ) : (
                          <Presentation className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {comm.type} with {lead?.clientName || "Unknown"}
                          </span>
                          <span className="text-xs text-slate-400">
                            {comm.date}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                          {comm.summary}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showNewLeadModal && (
        <NewLeadModal onClose={() => setShowNewLeadModal(false)} />
      )}
    </>
  );
}
