import React, { useState } from 'react';
import { Activity, User, Shield, LogIn, Database, Search } from 'lucide-react';
import { cn } from '../../../../lib/utils';

type Log = {
  id: string;
  action: string;
  type: 'auth' | 'role' | 'user' | 'system';
  user: string;
  timestamp: string;
  details: string;
};

const DUMMY_LOGS: Log[] = [
  { id: '1', action: 'User Login', type: 'auth', user: 'Marcus Aurelius', timestamp: '2 mins ago', details: 'Successful login from IP 192.168.1.4' },
  { id: '2', action: 'Role Updated', type: 'role', user: 'System Admin', timestamp: '15 mins ago', details: 'Promoted Elena to Lead Designer' },
  { id: '3', action: 'Profile Created', type: 'user', user: 'HR System', timestamp: '1 hour ago', details: 'Added new member: Julian Assange' },
  { id: '4', action: 'Settings Changed', type: 'system', user: 'General Manager', timestamp: '2 hours ago', details: 'Updated system default timezone to UTC+5:30' },
  { id: '5', action: 'Failed Login', type: 'auth', user: 'Unknown', timestamp: '3 hours ago', details: 'Failed attempt for user elena@arqon.os' },
  { id: '6', action: 'Role Created', type: 'role', user: 'System Admin', timestamp: '1 day ago', details: 'Created custom role: External Auditor' },
];

export function ActivityLogs() {
  const [filter, setFilter] = useState<'all' | 'auth' | 'role' | 'user' | 'system'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = DUMMY_LOGS.filter(log => {
    const matchesFilter = filter === 'all' || log.type === filter;
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'auth': return <LogIn className="w-4 h-4 text-blue-500" />;
      case 'role': return <Shield className="w-4 h-4 text-purple-500" />;
      case 'user': return <User className="w-4 h-4 text-green-500" />;
      case 'system': return <Database className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-slate-500" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'auth': return 'bg-blue-50 dark:bg-blue-900/20';
      case 'role': return 'bg-purple-50 dark:bg-purple-900/20';
      case 'user': return 'bg-green-50 dark:bg-green-900/20';
      case 'system': return 'bg-orange-50 dark:bg-orange-900/20';
      default: return 'bg-slate-50 dark:bg-slate-800';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 transition-colors p-6 overflow-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Activity Logs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">System audit trail of logins, role changes, and actions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors font-bold" />
             <input 
               type="text" 
               placeholder="Search logs..." 
               className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg text-sm w-full md:w-64 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none text-slate-900 dark:text-white font-medium"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <select 
             className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 outline-none"
             value={filter}
             onChange={(e) => setFilter(e.target.value as any)}
           >
             <option value="all">All Events</option>
             <option value="auth">Authentication</option>
             <option value="role">Role Changes</option>
             <option value="user">User Actions</option>
             <option value="system">System Logs</option>
           </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex-1">
        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {filteredLogs.length > 0 ? (
            filteredLogs.map(log => (
              <div key={log.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-start gap-4">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", getColor(log.type))}>
                  {getIcon(log.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{log.action}</h4>
                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap">{log.timestamp}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">By: {log.user}</span>
                    <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-slate-500 truncate">{log.details}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 text-sm">No activity logs found matching the current criteria.</div>
          )}
        </div>
      </div>
    </div>
  );
}
