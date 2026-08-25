import React, { useState } from 'react';
import { PeopleDirectory } from './PeopleDirectory';
import { PeopleRoles } from './PeopleRoles';
import { PeopleCollaboration } from './PeopleCollaboration';
import { PeopleHelp } from './PeopleHelp';
import { TeamsDepartments } from './TeamsDepartments';
import { AccessControl } from './AccessControl';
import { ActivityLogs } from './ActivityLogs';
import { Invitations } from './Invitations';
import { PeopleSettings } from './PeopleSettings';
import { PeopleOverview } from './PeopleOverview';
import { UserProfile } from './UserProfile';
import { cn } from '../../../../lib/utils';
import { TEAM_MEMBERS, type TeamMember } from '../../../../data/team';
import { ShieldCheck, Users, Lock, Key, Shield, Briefcase } from 'lucide-react';
import { PeopleContext, type Role } from './PeopleContext';

export { usePeople } from './PeopleContext';
export type { Role };
export type PeopleTab = 'Overview' | 'Directory' | 'Roles & Permissions' | 'Teams & Departments' | 'Access Control' | 'Activity Logs' | 'Invitations' | 'Settings' | 'Collaboration' | 'Help' | 'User Profile';

export const DEPARTMENTS = ['Management', 'Sales', 'Design', 'Execution', 'Finance', 'HR', 'External', 'System'];

export const ROLES = [
  { id: '1', name: 'General Manager', department: 'Management', description: 'Full system access', permissions: ['Quest: Full', 'Flow: Full', 'Connect: Full', 'Studio: Full', 'Cost: Full', 'Vendor: Full', 'Insight: Full', 'AI: Full'], icon: Shield, color: 'text-indigo-500', bg: 'bg-indigo-50', userCount: 1 },
  { id: '2', name: 'Sales', department: 'Sales', description: 'Sales and lead management', permissions: ['Quest: Full', 'Flow: Limited', 'Connect: Full', 'Insight: Limited', 'AI: Limited'], icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', userCount: 3 },
  { id: '3', name: 'Front Desk', department: 'Sales', description: 'Reception and basic coordination', permissions: ['Quest: Full', 'Connect: Limited'], icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', userCount: 2 },
  { id: '4', name: 'Lead Designer', department: 'Design', description: 'Design leadership', permissions: ['Quest: Full', 'Flow: Full', 'Studio: Full', 'Cost: Limited', 'Insight: Limited', 'AI: Limited'], icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50', userCount: 2 },
  { id: '5', name: 'Designer', department: 'Design', description: 'Standard design tasks', permissions: ['Quest: Full', 'Flow: Limited', 'Studio: Full'], icon: Users, color: 'text-purple-500', bg: 'bg-purple-50', userCount: 5 },
  { id: '6', name: 'Draftsman', department: 'Design', description: 'Drafting and technical drawings', permissions: ['Quest: Full', 'Flow: Limited', 'Studio: Full'], icon: Users, color: 'text-purple-500', bg: 'bg-purple-50', userCount: 3 },
  { id: '7', name: '3D Designer', department: 'Design', description: '3D modeling and rendering', permissions: ['Quest: Full', 'Flow: Limited', 'Studio: Full'], icon: Users, color: 'text-purple-500', bg: 'bg-purple-50', userCount: 2 },
  { id: '8', name: 'Coordinator', department: 'Execution', description: 'On-site and dispatch coordination', permissions: ['Quest: Full', 'Flow: Full', 'Studio: View', 'Cost: Limited', 'Vendor: View', 'AI: Limited'], icon: ShieldCheck, color: 'text-orange-500', bg: 'bg-orange-50', userCount: 4 },
  { id: '9', name: 'Site Manager', department: 'Execution', description: 'Site operations management', permissions: ['Quest: Full', 'Flow: Full', 'Studio: View', 'Cost: Limited', 'Vendor: View', 'AI: Limited'], icon: ShieldCheck, color: 'text-orange-500', bg: 'bg-orange-50', userCount: 3 },
  { id: '10', name: 'Site Supervisor', department: 'Execution', description: 'On-site task execution', permissions: ['Quest: Full', 'Flow: Limited', 'Studio: View', 'Vendor: View'], icon: Users, color: 'text-orange-500', bg: 'bg-orange-50', userCount: 8 },
  { id: '11', name: 'Estimator', department: 'Finance', description: 'Cost estimations', permissions: ['Quest: Full', 'Cost: Full', 'Vendor: Limited', 'Insight: Full', 'AI: Limited'], icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50', userCount: 2 },
  { id: '12', name: 'Purchase', department: 'Finance', description: 'Procurement and purchasing', permissions: ['Quest: Full', 'Cost: Full', 'Vendor: Full'], icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50', userCount: 3 },
  { id: '13', name: 'Account', department: 'Finance', description: 'Accounting and billing', permissions: ['Quest: Full', 'Cost: Full', 'Vendor: Limited', 'Insight: Full', 'AI: Limited'], icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50', userCount: 2 },
  { id: '14', name: 'HR', department: 'HR', description: 'Human resources', permissions: ['Quest: Full', 'Insight: Limited'], icon: ShieldCheck, color: 'text-pink-500', bg: 'bg-pink-50', userCount: 2 },
  { id: '15', name: 'Vendor', department: 'External', description: 'External suppliers', permissions: ['Cost: Own', 'Vendor: Own'], icon: Lock, color: 'text-slate-500', bg: 'bg-slate-50', userCount: 15 },
  { id: '16', name: 'Client', department: 'External', description: 'Customers', permissions: ['Connect: Limited', 'Studio: View'], icon: Lock, color: 'text-slate-500', bg: 'bg-slate-50', userCount: 25 },
  { id: '17', name: 'Custom Role', department: 'System', description: 'Configurable across all modules', permissions: [], icon: Key, color: 'text-indigo-500', bg: 'bg-indigo-50', userCount: 0 }
];


interface PeopleAppProps {
  activePage: string;
  onNavigate: (page: string) => void;
  navigateToApp?: (appId: string, pageName: string) => void;
}

export function PeopleApp({ activePage, onNavigate, navigateToApp }: PeopleAppProps) {
  const [members, setMembers] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [roles, setRoles] = useState<Role[]>(ROLES);
  const [departments, setDepartments] = useState<string[]>(DEPARTMENTS);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const syncDepartments = (dept: string) => {
    if (dept && !departments.includes(dept)) {
      setDepartments(prev => [...prev, dept]);
    }
  };

  const addMember = (member: Omit<TeamMember, 'id' | 'initial' | 'color'>) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newMember: TeamMember = {
      ...member,
      id: `m-${Date.now()}`,
      initial: member.name.charAt(0).toUpperCase(),
      color: randomColor,
      status: member.status || 'Active'
    };
    syncDepartments(member.department);
    setMembers(prev => [newMember, ...prev]);
  };

  const updateMember = (id: string, member: Partial<TeamMember>) => {
    if (member.department) syncDepartments(member.department);
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...member } : m));
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const addRole = (role: Omit<Role, 'id' | 'userCount'>) => {
    const newRole: Role = {
      ...role,
      id: `r-${Date.now()}`,
      userCount: 0
    };
    syncDepartments(role.department);
    setRoles(prev => [newRole, ...prev]);
  };

  const updateRole = (id: string, role: Partial<Omit<Role, 'id' | 'userCount'>>) => {
    if (role.department) syncDepartments(role.department);
    setRoles(prev => prev.map(r => r.id === id ? { ...r, ...role } : r));
  };

  const addDepartment = (dept: string) => {
    syncDepartments(dept);
  };

  const handleNavigateToProfile = (userId: string) => {
    setSelectedUserId(userId);
    onNavigate('User Profile');
  };

  const page = activePage.toLowerCase();

  return (
    <PeopleContext.Provider value={{ members, roles, departments, addMember, updateMember, deleteMember, addRole, updateRole, addDepartment }}>
      <div className="w-full flex flex-col animate-in fade-in duration-500 h-full">
        {page === 'overview' && <PeopleOverview />}
        {page === 'directory' && <PeopleDirectory navigateToApp={navigateToApp} onNavigateToProfile={handleNavigateToProfile} />}
        {page === 'roles & permissions' && <PeopleRoles />}
        {page === 'teams & departments' && <TeamsDepartments onNavigate={onNavigate} />}
        {page === 'access control' && <AccessControl />}
        {page === 'activity logs' && <ActivityLogs />}
        {page === 'invitations' && <Invitations />}
        {page === 'settings' && <PeopleSettings />}
        {page === 'collaboration' && <PeopleCollaboration />}
        {page === 'help' && <PeopleHelp />}
        {page === 'user profile' && (
          <UserProfile 
            userId={selectedUserId} 
            onBack={() => onNavigate('Directory')} 
            navigateToApp={navigateToApp} 
          />
        )}
        
        {/* Fallback for unhandled pages */}
        {!['overview', 'directory', 'roles & permissions', 'teams & departments', 'access control', 'activity logs', 'invitations', 'settings', 'collaboration', 'help', 'user profile'].includes(page) && (
          <div className="flex-grow flex items-center justify-center p-8">
             <div className="text-center">
               <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Module Under Development</h3>
               <p className="text-slate-500 dark:text-slate-400">The "{activePage}" view is being integrated into the ArqonOS People engine.</p>
             </div>
          </div>
        )}
      </div>
    </PeopleContext.Provider>
  );
}
