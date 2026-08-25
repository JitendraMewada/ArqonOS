import React, { useState } from 'react';
import { 
  CheckSquare, Calendar as CalendarIcon, MessageSquare, Clock, Plus, 
  ArrowUpRight, CheckCircle2, Circle, UserPlus, X 
} from 'lucide-react';
import { useQuest } from './QuestContext';
import { cn } from '../../../../lib/utils';
import { ActionModal } from './QuestModals';


export function QuestOverview() {
  const { tasks, events, messages, toggleTask, goToPage } = useQuest();
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [actionModal, setActionModal] = useState<{ isOpen: boolean, type: 'task' | 'event' | 'message' }>({ isOpen: false, type: 'task' });

  // Derived stats
  const pendingTasks = tasks.filter(t => !t.done).length;
  const meetingsToday = events.filter(e => e.dayNum === 15).length; // using mock today 15th
  const unreadMessages = messages.filter(m => m.unread).length;
  const overdueItems = tasks.filter(t => !t.done && t.due === 'Yesterday').length || 0;

  const todaysTasks = tasks.filter(t => t.due === 'Today').slice(0, 5);
  const upcomingEvents = events.filter(e => e.dayNum && e.dayNum >= 15).sort((a,b) => (a.dayNum || 0) - (b.dayNum || 0)).slice(0, 4);
  
  // get unique recent messages by chatId
  const recentMessagesMap = new Map();
  [...messages].reverse().forEach(m => {
     if (!recentMessagesMap.has(m.chatId)) recentMessagesMap.set(m.chatId, m);
  });
  const recentMessages = Array.from(recentMessagesMap.values()).slice(0, 5);

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-300 w-full">
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-10">
        <ActionModal isOpen={actionModal.isOpen} type={actionModal.type} onClose={() => setActionModal({ ...actionModal, isOpen: false })} />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-left w-full">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Hello, <span className="text-[#3b82f6]">Admin.</span>
          </h2>
          <p className="text-lg font-medium text-slate-500 mt-2">
            You have <span className="text-[#3b82f6] font-bold">{pendingTasks} critical tasks</span> and {meetingsToday} meetings scheduled for today.
          </p>
        </div>
        
        <div className="relative shrink-0 w-full md:w-auto">
          <button 
            onClick={() => setShowActionDropdown(!showActionDropdown)}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#3b82f6] text-white px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4" /> New Action
          </button>
          
          {showActionDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
               <button 
                 onClick={() => { setShowActionDropdown(false); setActionModal({ isOpen: true, type: 'task' }); }} 
                 className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
               >
                 <CheckSquare className="w-4 h-4 text-blue-500" /> New Task
               </button>
               <button 
                 onClick={() => { setShowActionDropdown(false); setActionModal({ isOpen: true, type: 'event' }); }} 
                 className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
               >
                 <CalendarIcon className="w-4 h-4 text-orange-500" /> Schedule Event
               </button>
               <button 
                 onClick={() => { setShowActionDropdown(false); setActionModal({ isOpen: true, type: 'message' }); }} 
                 className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
               >
                 <MessageSquare className="w-4 h-4 text-green-500" /> Send Message
               </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Pending Tasks', value: pendingTasks, icon: CheckSquare, color: 'text-blue-500', bg: 'bg-blue-50/50 dark:bg-blue-500/10' },
          { label: 'Meetings Today', value: meetingsToday, icon: CalendarIcon, color: 'text-orange-500', bg: 'bg-orange-50/50 dark:bg-orange-500/10' },
          { label: 'Unread Messages', value: unreadMessages, icon: MessageSquare, color: 'text-green-500', bg: 'bg-green-50/50 dark:bg-green-500/10' },
          { label: 'Overdue Items', value: overdueItems, icon: Clock, color: 'text-red-500', bg: 'bg-red-50/50 dark:bg-red-500/10' },
        ].map((stat, i) => (
            <div key={i} className="p-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-start gap-4 shadow-sm hover:shadow-md transition-all hover:border-slate-200 dark:hover:border-slate-700">
             <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shadow-inner", stat.bg, stat.color)}>
               <stat.icon className="w-4 h-4" />
             </div>
             <div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{stat.label}</div>
               <div className="text-4xl font-black text-slate-900 dark:text-white leading-none">{stat.value}</div>
             </div>
           </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Today's Tasks */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wider">
              <CheckSquare className="w-4 h-4 text-blue-500" /> My Focus Today
            </h3>
            <button onClick={() => goToPage('Tasks')} className="text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-600 flex items-center gap-1">
               View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="p-5 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
            {todaysTasks.length === 0 && <p className="text-xs text-slate-400 text-center py-4 italic">No tasks today.</p>}
            {todaysTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors group">
                <button onClick={() => toggleTask(task.id)} className="mt-0.5 text-slate-300 dark:text-slate-600 hover:text-blue-500 transition-colors">
                  {task.done ? <CheckCircle2 className="w-4 h-4 text-blue-500" /> : <Circle className="w-4 h-4" />}
                </button>
                <div className="flex-1 min-w-0 text-left">
                  <p className={cn("text-sm font-bold transition-all truncate", task.done ? "text-slate-400 line-through" : "text-slate-800 dark:text-slate-200")}>{task.title}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">{task.project || task.tags[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wider">
              <CalendarIcon className="w-4 h-4 text-orange-500" /> Upcoming
            </h3>
            <button onClick={() => goToPage('Calendar')} className="text-[10px] font-bold text-orange-500 uppercase tracking-widest hover:text-orange-600 flex items-center gap-1">
               Full Calendar <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="p-5 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
            {upcomingEvents.length === 0 && <p className="text-xs text-slate-400 text-center py-4 italic">No upcoming events.</p>}
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
                <div className={cn("absolute left-0 top-0 bottom-0 w-1", event.color)}></div>
                <div className="w-16 flex-shrink-0 text-right">
                  <div className="text-[12px] font-black text-slate-900 dark:text-white leading-tight">{event.time.split(' ')[0]}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase leading-none">{event.time.split(' ')[1]}</div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1 leading-tight">{event.title}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{event.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wider">
              <MessageSquare className="w-4 h-4 text-green-500" /> Recent Chat
            </h3>
            <button onClick={() => goToPage('Messenger')} className="text-[10px] font-bold text-green-500 uppercase tracking-widest hover:text-green-600 flex items-center gap-1">
               Go to Messenger <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="p-5 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
            {recentMessages.length === 0 && <p className="text-xs text-slate-400 text-center py-4 italic">No recent messages.</p>}
            {recentMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors group relative">
                {msg.unread && <div className="absolute top-3 right-3 w-2 h-2 bg-green-500 rounded-full shadow-sm shadow-green-500/50"></div>}
                <div className="w-8 h-8 rounded-lg bg-[#3b82f6] text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-sm">
                   {msg.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-[11px] font-black text-slate-900 dark:text-white truncate">{msg.chatId}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{msg.time}</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{msg.name}:</span> {msg.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
