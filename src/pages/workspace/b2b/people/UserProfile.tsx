import React from 'react';
import { Mail, Phone, MoreVertical, ShieldCheck, Briefcase, MapPin, Calendar, X, Key, MessageSquare, ArrowLeft } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { usePeople } from './PeopleContext';

interface UserProfileProps {
  userId: string | null;
  onBack: () => void;
  navigateToApp?: (appId: string, pageName: string) => void;
}

export function UserProfile({ userId, onBack, navigateToApp }: UserProfileProps) {
  const { members, roles } = usePeople();
  const selectedMember = members.find(m => m.id === userId);

  if (!selectedMember) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 text-center h-full">
         <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">User Not Found</h3>
         <p className="text-slate-500 dark:text-slate-400 mb-6">The profile you are looking for does not exist or has been removed.</p>
         <button onClick={onBack} className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
           <ArrowLeft className="w-4 h-4" /> Back to Directory
         </button>
      </div>
    );
  }

  const roleInfo = roles.find(r => r.name === selectedMember.role);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      {/* Header with Back Button */}
      <div className="p-4 flex items-center gap-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <button 
          onClick={onBack}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors group flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-sm font-bold uppercase tracking-widest">Back</span>
        </button>
      </div>

      <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full border border-slate-100 dark:border-slate-800 overflow-hidden">
          {/* Header/Cover */}
          <div className={cn("h-48 w-full bg-gradient-to-r relative", selectedMember.color.replace('bg-', 'from-').replace('500', '400') + " to-slate-100 dark:to-slate-800")} />

          <div className="px-8 pb-8 relative">
             {/* Avatar Overlay */}
             <div className="absolute -top-16 left-8">
               <div className={cn("w-32 h-32 rounded-xl p-1.5 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden", selectedMember.color)}>
                 <div className="w-full h-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                   {selectedMember.avatar ? (
                     <img src={selectedMember.avatar} alt={selectedMember.name} className="w-full h-full object-cover rounded-lg" />
                   ) : (
                     <span className="text-5xl text-white font-black">{selectedMember.initial}</span>
                   )}
                 </div>
               </div>
               {/* Status Indicator */}
               <div className={cn("absolute bottom-1 right-1 w-5 h-5 rounded-md border-4 border-white dark:border-slate-900 shadow-lg", 
                 selectedMember.status === 'Active' ? 'bg-green-500' : 
                 selectedMember.status === 'On Leave' ? 'bg-orange-400' : 'bg-red-500'
               )} />
             </div>

             {/* Profile Info */}
             <div className="pt-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
               <div>
                 <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{selectedMember.name}</h2>
                 <div className="flex items-center gap-3">
                   <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{selectedMember.role}</span>
                   <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                   <span className="text-sm font-bold text-purple-500 uppercase tracking-widest">{selectedMember.department}</span>
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <button 
                   onClick={() => {
                     if (navigateToApp) navigateToApp('quest', 'Messenger');
                   }}
                   className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-900/10"
                 >
                   Direct Message
                 </button>
                 <button className="p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all font-bold text-slate-600 dark:text-white">
                   <MoreVertical className="w-4 h-4" />
                 </button>
               </div>
             </div>

             {/* Detailed Stats / Bio (Placeholder Content) */}
             <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Active Projects</span>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">14</div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Tasks Resolved</span>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">432</div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Efficiency</span>
                  <div className="text-2xl font-bold text-green-500">98%</div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-widest">OS Experience</span>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">2.4y</div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
               {/* Role Profile Section */}
               <div className="p-6 bg-indigo-50/30 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-xl h-full">
                  <div className="flex items-start gap-4 mb-6">
                     <div className="w-10 h-10 rounded-lg bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-1">Functional Role Profile</h4>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedMember.role}</p>
                      </div>
                   </div>
                   
                   {roleInfo && (
                     <div className="space-y-6">
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
                          "{roleInfo.description}"
                        </p>
                        
                        <div>
                           <div className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-3 flex items-center gap-1.5">
                              <Key className="w-4 h-4" /> Capability Spectrum
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {roleInfo.permissions.map((perm, pidx) => (
                                <span key={pidx} className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/50 rounded-md text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                                   {perm}
                                </span>
                              ))}
                           </div>
                        </div>
                     </div>
                   )}
                </div>

               {/* Operational Details */}
               <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4" /> Functional Connectivity
                  </h4>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500"><Mail className="w-5 h-5" /></div>
                      <div>
                        <div className="text-xs font-black uppercase text-slate-400 mb-0.5 tracking-tighter">Systemic Email</div>
                        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedMember.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      <div className="p-3 rounded-lg bg-orange-500/10 text-orange-500"><Phone className="w-5 h-5" /></div>
                      <div>
                        <div className="text-xs font-black uppercase text-slate-400 mb-0.5 tracking-tighter">Direct Line</div>
                        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedMember.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500"><MapPin className="w-5 h-5" /></div>
                      <div>
                        <div className="text-xs font-black uppercase text-slate-400 mb-0.5 tracking-tighter">Work Hub</div>
                        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">Remote / Arqon HQ</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      <div className="p-3 rounded-lg bg-slate-500/10 text-slate-500"><Calendar className="w-5 h-5" /></div>
                      <div>
                        <div className="text-xs font-black uppercase text-slate-400 mb-0.5 tracking-tighter">Joined OS</div>
                        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">Oct 12, 2024</div>
                      </div>
                    </div>
                  </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
