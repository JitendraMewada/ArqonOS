import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  Lock,
  Users,
  Key,
  Briefcase,
  Info,
  Plus,
  X,
  Check,
} from "lucide-react";
import { cn } from "../../../../lib/utils";
import { usePeople } from "./PeopleContext";

const PERMISSION_OPTIONS = [
  "Quest: Full",
  "Flow: Full",
  "Flow: Limited",
  "Connect: Full",
  "Connect: Limited",
  "Studio: Full",
  "Studio: View",
  "Cost: Full",
  "Cost: Limited",
  "Cost: Own",
  "Vendor: Full",
  "Vendor: Limited",
  "Vendor: View",
  "Vendor: Own",
  "Insight: Full",
  "Insight: Limited",
  "AI: Full",
  "AI: Limited",
  "All",
];

const ICON_OPTIONS = [
  {
    name: "Shield",
    icon: Shield,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  { name: "Lock", icon: Lock, color: "text-slate-500", bg: "bg-slate-50" },
  { name: "Users", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
  { name: "Key", icon: Key, color: "text-orange-500", bg: "bg-orange-50" },
  {
    name: "Briefcase",
    icon: Briefcase,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    name: "ShieldCheck",
    icon: ShieldCheck,
    color: "text-green-500",
    bg: "bg-green-50",
  },
];

export function PeopleRoles() {
  const { roles, addRole, updateRole, departments, members } = usePeople();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [isCustomDept, setIsCustomDept] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    department: "",
    description: "",
    permissions: [] as string[],
    iconIndex: 0,
  });

  const getRoleUserCount = (roleName: string) => {
    return members.filter((m) => m.role === roleName).length;
  };

  const rolesByDepartment = departments.reduce(
    (acc, dept) => {
      acc[dept] = roles.filter((r) => r.department === dept);
      return acc;
    },
    {} as Record<string, typeof roles>,
  );

  const handleEdit = (role: any) => {
    setEditingRole(role);
    const iconIndex = ICON_OPTIONS.findIndex((i) => i.icon === role.icon);
    setNewRole({
      name: role.name,
      department: role.department,
      description: role.description,
      permissions: role.permissions,
      iconIndex: iconIndex === -1 ? 0 : iconIndex,
    });
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedIcon = ICON_OPTIONS[newRole.iconIndex];

    let finalPermissions = [...newRole.permissions];
    if (
      newRole.department !== "External" &&
      !finalPermissions.includes("Quest: Full")
    ) {
      finalPermissions.push("Quest: Full");
    }

    const roleData = {
      name: newRole.name,
      department: newRole.department,
      description: newRole.description,
      permissions: finalPermissions,
      icon: selectedIcon.icon,
      color: selectedIcon.color,
      bg: selectedIcon.bg,
    };
    if (editingRole) {
      updateRole(editingRole.id, roleData);
    } else {
      addRole(roleData);
    }
    setShowAddModal(false);
    setEditingRole(null);
    setNewRole({
      name: "",
      department: "",
      description: "",
      permissions: [],
      iconIndex: 0,
    });
    setIsCustomDept(false);
  };

  const togglePermission = (perm: string) => {
    setNewRole((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 transition-colors relative">
      {/* Create Custom Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-500" />{" "}
                {editingRole ? "Edit Custom Role" : "Define Custom Role"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-6 overflow-y-auto"
            >
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">
                  Visual Identity (Icon & Color)
                </label>
                <div className="flex flex-wrap gap-3">
                  {ICON_OPTIONS.map((opt, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setNewRole({ ...newRole, iconIndex: idx })}
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all border-2",
                        newRole.iconIndex === idx
                          ? "border-purple-500 scale-110 shadow-lg shadow-purple-500/20"
                          : "border-transparent bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700",
                      )}
                    >
                      <opt.icon className={cn("w-4 h-4", opt.color)} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">
                  Role Title
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Senior Project Architect"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">
                  Assign to Department
                </label>
                {isCustomDept ? (
                  <div className="flex gap-2">
                    <input
                      required
                      type="text"
                      placeholder="Enter department name"
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      value={newRole.department}
                      onChange={(e) =>
                        setNewRole({ ...newRole, department: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomDept(false);
                        setNewRole({ ...newRole, department: "" });
                      }}
                      className="px-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <select
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 outline-none transition-all appearance-none cursor-pointer"
                    value={newRole.department}
                    onChange={(e) => {
                      if (e.target.value === "custom") {
                        setIsCustomDept(true);
                        setNewRole({ ...newRole, department: "" });
                      } else {
                        setNewRole({ ...newRole, department: e.target.value });
                      }
                    }}
                  >
                    <option value="" disabled>
                      Select a department...
                    </option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                    <option value="custom">
                      + Create Custom Department...
                    </option>
                  </select>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">
                  Role Objective (Description)
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the operational scope of this role..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">
                  Capability Spectrum (Permissions)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PERMISSION_OPTIONS.map((perm) => (
                    <button
                      type="button"
                      key={perm}
                      onClick={() => togglePermission(perm)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold border transition-all text-left",
                        newRole.permissions.includes(perm)
                          ? "bg-purple-500 border-purple-500 text-white shadow-md shadow-purple-500/20"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-purple-500/50",
                      )}
                    >
                      <div
                        className={cn(
                          "w-3.5 h-3.5 rounded-sm flex items-center justify-center transition-colors",
                          newRole.permissions.includes(perm)
                            ? "bg-white/20"
                            : "bg-slate-200 dark:bg-slate-700",
                        )}
                      >
                        {newRole.permissions.includes(perm) && (
                          <Check className="w-2.5 h-2.5 text-white" />
                        )}
                      </div>
                      {perm}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3 sticky bottom-0 bg-white dark:bg-slate-900 pb-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-purple-500/20 transition-all active:scale-95"
                >
                  {editingRole ? "Save Changes" : "Establish Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Roles & Permissions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Define responsibilities and access control across ArqonOS.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingRole(null);
            setShowAddModal(true);
          }}
          className="h-10 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" /> Create Custom Role
        </button>
      </div>

      <div className="p-6 overflow-auto">
        <div className="space-y-12">
          {departments.map((dept) => {
            const deptRoles = rolesByDepartment[dept];
            if (!deptRoles || deptRoles.length === 0) return null;

            return (
              <div key={dept} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {dept}
                  </h2>
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded text-[10px] font-black">
                    {deptRoles.length} Roles
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {deptRoles.map((role) => (
                    <div
                      key={role.id}
                      className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all group flex flex-col h-full relative"
                    >
                      {role.department === "System" && (
                        <div
                          className="absolute top-0 right-0 m-4 w-2 h-2 rounded-full bg-purple-500 animate-pulse"
                          title="System Role"
                        />
                      )}
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-xl shadow-sm",
                            role.bg,
                            "dark:bg-slate-700/50",
                          )}
                        >
                          <role.icon className={cn("w-4 h-4", role.color)} />
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700">
                          {getRoleUserCount(role.name)} Users
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-500 transition-colors">
                        {role.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-grow">
                        {role.description}
                      </p>

                      <div className="space-y-3 pt-6 border-t border-slate-50 dark:border-slate-700/50">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                          <Shield className="w-3 h-3" /> Module Access Levels
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {role.permissions.map((perm, idx) => {
                            const [mod, level] = perm.split(": ");
                            const levelColor =
                              level === "Full"
                                ? "text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20"
                                : level === "Limited"
                                  ? "text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-900/20"
                                  : level === "Own"
                                    ? "text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-900/20"
                                    : "text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20";

                            return (
                              <span
                                key={idx}
                                className={cn(
                                  "px-2 py-1 border rounded text-[9px] font-bold",
                                  levelColor,
                                )}
                              >
                                {perm}
                              </span>
                            );
                          })}
                          {role.permissions.length === 0 && (
                            <span className="text-[9px] font-bold text-slate-400 italic">
                              No Access Configured
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleEdit(role)}
                        className="mt-6 w-full py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-purple-500 hover:text-white dark:hover:bg-purple-600 transition-all focus:ring-2 focus:ring-purple-500/50 outline-none"
                      >
                        Manage Settings
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20 rounded-xl flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Advanced Access Logic
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
              Roles in ArqonOS are hierarchical. Permissions inherited from a
              higher role cannot be overridden at a local level without
              system-wide escalation. Use the <strong>Roles App</strong> to
              define custom RBAC (Role Based Access Control) strategies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
