import React, { useState } from 'react';
import { Search, Filter, Mail, Phone, MoreVertical, Shield, UserPlus, Globe, MessageSquare, X, Briefcase, LayoutGrid, List, ExternalLink, Calendar, MapPin, Hash, ShieldCheck, Key } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { usePeople } from './PeopleContext';
import type { TeamMember } from '../../../../data/team';

export function PeopleDirectory({ navigateToApp, onNavigateToProfile }: { navigateToApp?: (appId: string, pageName: string) => void, onNavigateToProfile: (id: string) => void }) {
  const { members, addMember, updateMember, deleteMember, roles, departments } = usePeople();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [newMember, setNewMember] = useState({ 
    name: '', 
    role: '', 
    department: '', 
    email: '', 
    phone: '', 
    avatar: '',
    status: 'Active' as 'Active' | 'On Leave' | 'Deactive' | 'Invite Pending'
  });

  const filteredMembers = members.filter(m => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = searchTermLower === '' || 
                          m.name.toLowerCase().includes(searchTermLower) || 
                          m.role.toLowerCase().includes(searchTermLower) ||
                          m.department.toLowerCase().includes(searchTermLower);
    const matchesRole = !selectedRoleFilter || m.role === selectedRoleFilter;
    const matchesDept = !selectedDeptFilter || m.department === selectedDeptFilter;
    const matchesStatus = !selectedStatusFilter || m.status === selectedStatusFilter;
    
    return matchesSearch && matchesRole && matchesDept && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      updateMember(editingMember.id, newMember);
      setEditingMember(null);
    } else {
      addMember(newMember);
    }
    setShowAddModal(false);
    setNewMember({ name: '', role: '', department: '', email: '', phone: '', avatar: '', status: 'Active' });
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setNewMember({
      name: member.name,
      role: member.role,
      department: member.department,
      email: member.email,
      phone: member.phone,
      avatar: member.avatar || '',
      status: member.status
    });
    setShowAddModal(true);
    setActiveActionId(null);
  };
  
  const handleOpenAdd = () => {
    setEditingMember(null);
    setNewMember({ name: '', role: '', department: '', email: '', phone: '', avatar: '', status: 'Active' });
    setShowAddModal(true);
  };

  const handleRoleChange = (roleName: string) => {
    const selectedRole = roles.find(r => r.name === roleName);
    setNewMember({
      ...newMember,
      role: roleName,
      department: selectedRole?.department || newMember.department
    });
  };

  const generateRandomAvatar = () => {
    const randomId = Math.floor(Math.random() * 1000);
    setNewMember({ ...newMember, avatar: `https://i.pravatar.cc/150?u=${randomId}` });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* OS Identity Audit Banner */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[200] pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
        <div className="bg-slate-900/80 backdrop-blur-md text-white text-[9px] px-3 py-1 rounded-md font-bold uppercase tracking-widest flex items-center gap-3 border border-white/10">
          <span>{members.length} Sources</span>
          <span className="w-px h-2 bg-white/20" />
          <span>{filteredMembers.length} Visible</span>
          <span className="w-px h-2 bg-white/20" />
          <span>Layout: {viewMode}</span>
        </div>
      </div>

      {/* Add Profile Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
               <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                 <UserPlus className="w-4 h-4 text-purple-500" /> {editingMember ? 'Edit Team Profile' : 'New Team Profile'}
               </h3>
               <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                 <X className="w-4 h-4" />
               </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
               <div className="flex flex-col items-center gap-4 mb-6">
                 <div className="relative group">
                   <div className="w-24 h-24 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                     {newMember.avatar ? (
                       <img src={newMember.avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                     ) : (
                       <UserPlus className="w-8 h-8 text-slate-300" />
                     )}
                   </div>
                   <button 
                     type="button"
                     onClick={generateRandomAvatar}
                     className="absolute -bottom-2 -right-2 p-2 bg-purple-600 text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all"
                     title="Generate Random Avatar"
                   >
                     <Globe className="w-3.5 h-3.5" />
                   </button>
                 </div>
                 <div className="w-full space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Avatar Image URL</label>
                    <input 
                      type="text" 
                      placeholder="https://image-url.com/photo.jpg" 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                      value={newMember.avatar}
                      onChange={e => setNewMember({...newMember, avatar: e.target.value})}
                    />
                 </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Full Identity Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Marcus Aurelius" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    value={newMember.name}
                    onChange={e => setNewMember({...newMember, name: e.target.value})}
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Functional Role</label>
                    <select 
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 outline-none transition-all appearance-none cursor-pointer"
                      value={newMember.role}
                      onChange={e => handleRoleChange(e.target.value)}
                    >
                      <option value="" disabled>Select Role...</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.name}>{role.name}</option>
                      ))}
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Department</label>
                    <select 
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 outline-none transition-all appearance-none cursor-pointer"
                      value={newMember.department}
                      onChange={e => setNewMember({...newMember, department: e.target.value})}
                    >
                      <option value="" disabled>Select Dept...</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                 </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Communication Channel (Email)</label>
                  <input 
                    required
                    type="email" 
                    placeholder="name@arqon.os" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    value={newMember.email}
                    onChange={e => setNewMember({...newMember, email: e.target.value})}
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Direct Line (Phone)</label>
                    <input 
                      required
                      type="text" 
                      placeholder="+91 98765 43210" 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                      value={newMember.phone}
                      onChange={e => setNewMember({...newMember, phone: e.target.value})}
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">System Status</label>
                    <select 
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 outline-none transition-all appearance-none cursor-pointer"
                      value={newMember.status}
                      onChange={e => setNewMember({...newMember, status: e.target.value as 'Active' | 'On Leave' | 'Deactive'})}
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Deactive">Deactive</option>
                    </select>
                 </div>
               </div>
               <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-purple-500/20 transition-all active:scale-95">{editingMember ? 'Update Profile' : 'Integrate Profile'}</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Header Area */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 z-10 sticky top-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Team Directory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Manage internal teams and client profiles across the ecosystem.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* View Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'list' ? "bg-white dark:bg-slate-700 shadow-sm text-purple-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'grid' ? "bg-white dark:bg-slate-700 shadow-sm text-purple-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors font-bold" />
            <input 
              type="text" 
              placeholder="Search directory..." 
              className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm w-full md:w-48 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none text-slate-900 dark:text-white font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 outline-none hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select 
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 outline-none hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
          </select>

          <select 
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 outline-none hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Deactive">Deactive</option>
          </select>

          <button 
            onClick={handleOpenAdd}
            className="h-10 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20"
          >
            <UserPlus className="w-4 h-4" /> Add Profile
          </button>
        </div>
      </div>

      {/* Grid/List Content */}
      <div className="flex-grow">
        {viewMode === 'list' ? (
          <div className="min-w-full lg:min-w-[900px]">
            {/* Table Header */}
            <div className="grid grid-cols-[1.2fr_1.5fr_1fr_0.8fr_1fr] px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 backdrop-blur-sm">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">Name & Role</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">Contact Details</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">Department</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">Status</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">System Actions</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMembers.map((member) => (
                <div 
                  key={member.id} 
                  onClick={() => onNavigateToProfile(member.id)}
                  className={cn(
                    "grid grid-cols-[1.2fr_1.5fr_1fr_0.8fr_1fr] px-6 py-5 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group relative",
                    activeActionId === member.id ? "z-30" : "z-0"
                  )}
                >
                  {/* Profile Cell */}
                  <div className="flex items-center gap-4">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-md transition-transform group-hover:scale-110 overflow-hidden", member.color)}>
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        member.initial
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors truncate">{member.name}</span>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight truncate border-l-2 border-slate-200 dark:border-slate-700 pl-2 mt-0.5">{member.role}</span>
                    </div>
                  </div>

                  {/* Contact Cell */}
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> <span className="truncate">{member.phone}</span>
                    </div>
                  </div>

                  {/* Dept Cell */}
                  <div>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {member.department}
                    </span>
                  </div>

                  {/* Status Cell */}
                  <div>
                    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-slate-50 dark:bg-slate-800 w-fit border border-slate-100 dark:border-slate-700">
                      <div className={cn("w-2 h-2 rounded-full shadow-sm", 
                        member.status === 'Active' ? 'bg-green-500 animate-pulse' : 
                        member.status === 'On Leave' ? 'bg-orange-400' : 'bg-red-500'
                      )} />
                      <span className="text-[10px] font-black uppercase tracking-tight text-slate-600 dark:text-slate-300">{member.status}</span>
                    </div>
                  </div>

                  {/* Actions Cell */}
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      title="Message in Quest"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (navigateToApp) navigateToApp('quest', 'Messenger');
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-green-500/20"
                    >
                      <MessageSquare className="w-4 h-4" /> Message
                    </button>
                    <div className="relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveActionId(activeActionId === member.id ? null : member.id); }}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {activeActionId === member.id && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 z-50 p-1">
                          <button onClick={(e) => { e.stopPropagation(); handleEdit(member); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-md">Edit Profile / Role</button>
                          <button onClick={(e) => { e.stopPropagation(); updateMember(member.id, { status: member.status === 'Deactive' ? 'Active' : 'Deactive' }); setActiveActionId(null); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-md">
                            {member.status === 'Deactive' ? 'Activate User' : 'Deactivate User'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 min-h-full flex flex-col">
            {filteredMembers.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center">
                <Search className="w-12 h-12 text-slate-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-400">No identity profiles found</h3>
                <p className="text-sm text-slate-400 mt-1 uppercase tracking-widest font-black">Adjust filters or search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMembers.map(member => (
                  <div 
                    key={member.id}
                    onClick={() => onNavigateToProfile(member.id)}
                    className={cn(
                      "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-2xl hover:border-purple-500 hover:-translate-y-1 transition-all cursor-pointer group relative",
                      activeActionId === member.id ? "z-30 overflow-visible" : "z-0 overflow-hidden"
                    )}
                  >
                    <div className="absolute top-4 right-4 z-10">
                   <div className="relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveActionId(activeActionId === member.id ? null : member.id); }}
                        className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {activeActionId === member.id && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 z-50 p-1 text-left">
                          <button onClick={(e) => { e.stopPropagation(); handleEdit(member); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-md">Edit Profile / Role</button>
                          <button onClick={(e) => { e.stopPropagation(); updateMember(member.id, { status: member.status === 'Deactive' ? 'Active' : 'Deactive' }); setActiveActionId(null); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-md">
                            {member.status === 'Deactive' ? 'Activate User' : 'Deactivate User'}
                          </button>
                        </div>
                      )}
                   </div>
                 </div>
                 <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 group-hover:opacity-20 transition-all", member.color)} />
                 
                 <div className="flex flex-col items-center text-center">
                    <div className={cn("w-20 h-20 rounded-lg flex items-center justify-center text-white font-black text-2xl shadow-xl transition-all group-hover:scale-110 overflow-hidden mb-4", member.color)}>
                      {member.avatar ? (
                        <img 
                          src={member.avatar} 
                          alt={member.name} 
                          className="w-full h-full object-cover rounded-lg" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        member.initial
                      )}
                    </div>
                    
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1 group-hover:text-purple-500 transition-colors">{member.name}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{member.role}</span>
                    </div>

                    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 mb-6">
                      <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm", 
                        member.status === 'Active' ? 'bg-green-500' : 
                        member.status === 'On Leave' ? 'bg-orange-400' : 'bg-red-500'
                      )} />
                      <span className="text-[9px] font-black uppercase tracking-tight text-slate-500 dark:text-slate-400">{member.status}</span>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-2 mt-auto">
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           if (navigateToApp) navigateToApp('quest', 'Messenger');
                         }}
                         className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-500/20 hover:bg-purple-700 active:scale-95"
                       >
                         Message
                       </button>
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           onNavigateToProfile(member.id);
                         }}
                         className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-600"
                       >
                         Profile
                       </button>
                    </div>
                 </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}
      </div>

      {/* Footer / Stats Bar */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-purple-500">{members.length}</span> Internal Users
          </div>
          <div className="flex items-center gap-2">
             <span className="text-blue-500">{members.length * 4 + 12}</span> Total Contacts
          </div>
        </div>
        <div className="flex items-center gap-4">
           Showing {filteredMembers.length} of {members.length} Profiles
        </div>
      </div>
    </div>
  );
}
