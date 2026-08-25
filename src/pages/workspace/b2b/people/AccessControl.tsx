import React, { useState } from 'react';
import { Target, Shield, Layout, Filter, Search } from 'lucide-react';
import { usePeople } from './PeopleContext';
import { cn } from '../../../../lib/utils';

export function AccessControl() {
  const { members, roles, departments } = usePeople();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || m.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const getRolePermissions = (roleName: string) => {
    const role = roles.find(r => r.name === roleName);
    return role ? role.permissions : [];
  };

  const getModuleAccessLevel = (permissions: string[], moduleName: string) => {
    if (permissions.includes('All')) return 'Full';
    const exactMatch = permissions.find(p => p.startsWith(`${moduleName}: `));
    return exactMatch ? exactMatch.split(': ')[1] : 'None';
  };

  const modules = ['Quest', 'Flow', 'Connect', 'Studio', 'Cost', 'Vendor', 'Insight', 'AI'];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 transition-colors p-6 overflow-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Access Control</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Read-only clarity layer for applied permissions and module visibility.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative group">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors font-bold" />
             <input 
               type="text" 
               placeholder="Search by name or role..." 
               className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg text-sm w-full md:w-64 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none text-slate-900 dark:text-white font-medium"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <select 
             className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 outline-none"
             value={selectedDept}
             onChange={(e) => setSelectedDept(e.target.value)}
           >
             <option value="All">All Departments</option>
             {departments.map(d => <option key={d} value={d}>{d}</option>)}
           </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden min-w-[max-content]">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-slate-50/50 dark:bg-slate-900/50">
            <tr>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700">Identity</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700">Role / Dept</th>
              {modules.map(mod => (
                <th key={mod} className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700 text-center">{mod}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredMembers.map(member => {
              const perms = getRolePermissions(member.role);
              return (
                <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white", member.color)}>
                        {member.avatar ? <img src={member.avatar} alt="avatar" className="w-full h-full rounded-lg object-cover"/> : member.initial}
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{member.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-indigo-500">{member.role}</span>
                      <span className="text-[10px] uppercase tracking-widest text-slate-400">{member.department}</span>
                    </div>
                  </td>
                  {modules.map(mod => {
                    const access = getModuleAccessLevel(perms, mod);
                    return (
                      <td key={mod} className="p-4 text-center">
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                          access === 'Full' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                          access === 'Limited' ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                          access === 'View' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                          access === 'Own' ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                          "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                        )}>
                          {access}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
