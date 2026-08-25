import React from "react";
import {
  HelpCircle,
  Users,
  ShieldCheck,
  Heart,
  Zap,
  BookOpen,
  MessageSquare,
  Info,
} from "lucide-react";
import { cn } from "../../../../lib/utils";

export function PeopleHelp() {
  return (
    <div className="flex flex-col gap-12">
        {/* Header section */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
            <HelpCircle className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            People Engine: Systemic Human Capital
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            In ArqonOS, we believe that **Systems beat Skill**. The People
            module is designed to transform "talent management" into a
            high-performance engine where roles, responsibilities, and logic are
            clearly defined.
          </p>
        </div>

        {/* The Philosophy Section */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8 border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            <Heart className="w-40 h-40 text-purple-600" />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-600 rounded-md text-[10px] font-black uppercase tracking-widest">
              Core Philosophy
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              People vs. Systems
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Managing a team shouldn't rely on individual heroics or
              undocumented intuition. ArqonOS structures "The Human Element" by
              mapping users to precise **Roles** and providing a real-time
              **Pulse** of collaboration. When the system is clear, the people
              perform at their peak.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    Defined Accountability
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Roles are not just titles; they are sets of permissions and
                    expectations embedded in the code.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    Synchronized Effort
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Collaboration is a real-time activity stream, ensuring no
                    one works in a silo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Breakdown */}
        <div className="space-y-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-slate-400" /> Navigating the
            Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Directory */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                <Users className="w-4 h-4 text-purple-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                Team Directory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 font-medium">
                Central repository for internal staff, vendors, and clients.
                Edit profiles and assign roles.
              </p>
              <ul className="text-[10px] font-bold text-slate-400 space-y-2 uppercase tracking-wide">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-md bg-purple-500" />{" "}
                  Role/Dept Filters
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-md bg-purple-500" /> User
                  Profiles
                </li>
              </ul>
            </div>

            {/* Roles */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                Roles & Permissions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 font-medium">
                Manage RBAC strategies by department, tracking module-level
                access and system authority.
              </p>
              <ul className="text-[10px] font-bold text-slate-400 space-y-2 uppercase tracking-wide">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-md bg-blue-500" /> Module
                  Matrix
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-md bg-blue-500" /> Custom
                  Depts
                </li>
              </ul>
            </div>

            {/* Teams & Departments */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                <Zap className="w-4 h-4 text-orange-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                Teams & Departments
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 font-medium">
                Visualize your organizational structure, department heads, and
                quickly navigate to member management.
              </p>
            </div>

            {/* Collaboration */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                <HelpCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                Collaboration Visibility
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 font-medium">
                Lightweight visibility layer. Configure external isolation rules
                and generate secure sharing links. Real-time chat occurs in
                Quest.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6 pb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-slate-400" /> Frequently
            Asked
          </h2>

          <div className="space-y-4">
            <div className="p-5 border border-slate-100 dark:border-slate-800 rounded-xl transition-colors hover:border-purple-500/20">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2">
                How do I change a user's role?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Navigate to the <strong>Directory</strong>, open the ellipsis
                menu for the user, and select "Edit Profile / Role".
                Alternatively, you can manage the permission levels of the Roles
                themselves via the <strong>Roles & Permissions</strong> page.
              </p>
            </div>
            <div className="p-5 border border-slate-100 dark:border-slate-800 rounded-xl transition-colors hover:border-purple-500/20">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2">
                How does Quest access work?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Quest is the mandatory coordination layer (chat, tasks).{" "}
                <strong>All INTERNAL roles</strong> have full access to Quest.{" "}
                <strong>Vendors and Clients</strong> have absolutely NO access.
                This ensures secure sandbox isolation for external parties.
              </p>
            </div>
          </div>
        </div>

        {/* Admin Tip */}
        <div className="p-6 bg-purple-600 rounded-xl text-white flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0 border border-white/20">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div className="text-center md:text-left space-y-1 relative z-10">
            <h3 className="font-bold text-lg leading-tight uppercase tracking-wide italic">
              Strict Access Enforcement
            </h3>
            <p className="text-xs text-purple-100 leading-relaxed max-w-xl">
              In ArqonOS, we do not allow direct user-level overrides.{" "}
              <strong>All access</strong> must stem from the Role defined in the
              Permission Matrix. Use the <strong>Access Control</strong> viewer
              page to see exactly what any mapped user can access at any given
              time.
            </p>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck className="w-32 h-32" />
          </div>
        </div>
    </div>
  );
}
