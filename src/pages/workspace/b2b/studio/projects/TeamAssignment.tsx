import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Trash2, Search, 
  Mail, UserCircle, Star, ShieldCheck,
  ChevronDown, X, Building2
} from 'lucide-react';
import { useStudio, type TeamMember } from '../StudioContext';
import { cn } from '../../../../../lib/utils';
import { TEAM_MEMBERS } from '../../../../../data/team';

const PROJECT_ROLES = [
  "Project Lead",
  "Lead Designer",
  "Designer",
  "Draftsman",
  "3D Designer",
  "Site Supervisor",
  "Coordinator",
  "Creative Director",
  "Client"
];

export function TeamAssignment({ projectId }: { projectId: string }) {
  const { fetchProjectMembers, addProjectMember, removeProjectMember } = useStudio();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState(PROJECT_ROLES[0]);
  const [searchPeople, setSearchPeople] = useState('');

  useEffect(() => {
    loadMembers();
  }, [projectId]);

  const loadMembers = async () => {
    try {
      const data = await fetchProjectMembers(projectId);
      setMembers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      setIsAdding(true);
      await addProjectMember(projectId, {
        userId: selectedUser.id,
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedRole
      });
      setShowAddModal(false);
      setSelectedUser(null);
      setSelectedRole(PROJECT_ROLES[0]);
      await loadMembers();
    } catch (error) {
      console.error("Failed to add member", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      setLoading(true);
      await removeProjectMember(projectId, memberId);
      await loadMembers();
    } catch (error) {
      console.error("Failed to remove member", error);
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(m => 
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availablePeople = TEAM_MEMBERS.filter(p => 
    !members.some(m => m.userId === p.id) &&
    (p.name?.toLowerCase().includes(searchPeople.toLowerCase()) || 
     p.role?.toLowerCase().includes(searchPeople.toLowerCase()))
  );

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-pulse text-orange-500 font-bold uppercase tracking-widest text-[10px]">Loading Team...</div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Project Team</h3>
          <p className="text-xs text-slate-500 font-medium">Assign designers, draftsmen, and site supervisors to this project.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {/* Toolbar */}
      <div className="px-8 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
        <div className="relative max-w-sm flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-600" />
          <input 
            type="text" 
            placeholder="Search by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-orange-500 shadow-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {members.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Users className="w-16 h-16 mb-4 text-slate-400" />
            <p className="font-bold text-slate-500">No team members assigned</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Team Member</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Assigned Role</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Access Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 flex items-center justify-center text-orange-500 overflow-hidden shadow-sm">
                          <UserCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white">{member.name || 'Unknown User'}</p>
                          <p className="text-[10px] text-slate-500 font-bold tracking-tight">{member.email || 'no-email@arqon.com'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                          {member.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Active Access</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Add Team Member</h2>
                <p className="text-xs font-medium text-slate-500 mt-1">Select a member from the People directory.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddMember} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 flex flex-col gap-6 overflow-y-auto">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search member to add..." 
                      value={searchPeople}
                      onChange={(e) => setSearchPeople(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col max-h-60">
                    <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Available Members ({availablePeople.length})
                    </div>
                    <div className="overflow-y-auto">
                      {availablePeople.length > 0 ? availablePeople.map(person => (
                        <div 
                          key={person.id}
                          onClick={() => setSelectedUser(person)}
                          className={cn(
                            "px-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 flex items-center gap-3 cursor-pointer transition-colors",
                            selectedUser?.id === person.id 
                              ? "bg-orange-50 dark:bg-orange-500/10" 
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold",
                            person.color
                          )}>
                            {person.initial}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-bold truncate",
                              selectedUser?.id === person.id ? "text-orange-600 dark:text-orange-500" : "text-slate-900 dark:text-white"
                            )}>{person.name}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500 truncate">{person.role}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                              <span className="text-xs text-slate-500 truncate">{person.department}</span>
                            </div>
                          </div>
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                            selectedUser?.id === person.id ? "border-orange-500 bg-orange-500" : "border-slate-300 dark:border-slate-600"
                          )}>
                            {selectedUser?.id === person.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                        </div>
                      )) : (
                        <div className="py-8 text-center text-sm font-medium text-slate-500">
                          {searchPeople ? "No members found matching your search." : "All members have been added to the project."}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assign Project Role</label>
                  <div className="relative">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white appearance-none"
                    >
                      {PROJECT_ROLES.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedUser || isAdding}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAdding ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span> : <Plus className="w-4 h-4" />}
                  {isAdding ? 'Adding...' : 'Add Required Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
