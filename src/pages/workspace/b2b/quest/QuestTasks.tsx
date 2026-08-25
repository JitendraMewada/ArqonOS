import React, { useState } from 'react';
import { 
  CheckSquare, MessageSquare, Clock, Plus, 
  MoreHorizontal, User, Tag, Filter, Search, ArrowRight, CheckCircle2, 
  Circle, LayoutDashboard, Send, Bell, Star, Hash, Trash2, Edit2, X, Menu, LayoutGrid, UserCheck
} from 'lucide-react';
import { useQuest, type Task } from './QuestContext';
import { cn } from '../../../../lib/utils';
import { ActionModal } from './QuestModals';

export function TaskDetailModal({ task, onClose }: { task: Task | null, onClose: () => void }) {
  const { team } = useQuest();
  if (!task) return null;

  const assignee = team.find(m => m.id === task.assigneeId);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 text-left overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Sleek Ecosystem Header & Action Bar */}
        <div className="relative px-5 py-4 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between flex-shrink-0">
           <div className="flex items-center gap-2">
              <div className="bg-[#3b82f6]/10 text-[#3b82f6] text-[10px] uppercase tracking-widest font-black px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm border border-[#3b82f6]/20">
                 <CheckSquare className="w-4 h-4" /> <span>TASK: {task.id}</span>
              </div>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors shadow-sm">
             <X className="w-4 h-4" />
           </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 relative flex-grow overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col gap-6 w-full">
           
           {/* Profile Section: Creator & Assignee */}
           <div className="grid grid-cols-1 gap-3 w-full">
              {/* Creator */}
              <div className="flex items-center gap-4 min-w-0 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 w-full flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg flex-shrink-0 bg-white dark:bg-slate-900 p-1 shadow-sm border border-slate-200 dark:border-slate-700">
                       <div className="w-full h-full rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                         {task.createdBy?.avatar ? (
                            <img src={`https://i.pravatar.cc/150?img=${task.createdBy.avatar}`} alt="Creator" className="w-full h-full object-cover" />
                         ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 text-[#3b82f6]">
                              <User className="w-4 h-4" />
                            </div>
                         )}
                       </div>
                    </div>
                    <div className="min-w-0 flex flex-col justify-center text-left">
                       <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Created By</p>
                       <p className="text-sm font-extrabold text-slate-900 dark:text-white leading-none truncate">{task.createdBy?.name || 'Workspace Admin'}</p>
                    </div>
              </div>

              {/* Assignee Integration */}
              {assignee && (
                <div className="flex items-center gap-4 min-w-0 bg-purple-50/50 dark:bg-purple-900/10 p-3 rounded-xl border border-purple-100 dark:border-purple-900/20 w-full flex-shrink-0 animate-in slide-in-from-right-2">
                    <div className="w-8 h-8 rounded-lg flex-shrink-0 bg-white dark:bg-slate-900 p-1 shadow-sm border border-purple-200 dark:border-purple-800/50">
                       <div className="w-full h-full rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                         {assignee.avatar ? (
                            <img src={assignee.avatar} alt={assignee.name} className="w-full h-full object-cover" />
                         ) : (
                            <div className={cn("w-full h-full flex items-center justify-center text-white text-[10px] font-bold shadow-inner", assignee.color)}>
                               {assignee.initial}
                            </div>
                         )}
                       </div>
                    </div>
                    <div className="min-w-0 flex flex-col justify-center text-left">
                       <div className="flex items-center gap-1.5 mb-0.5">
                          <UserCheck className="w-3 h-3 text-purple-500" />
                          <p className="text-[9px] font-black uppercase tracking-widest text-purple-500">Assigned To</p>
                       </div>
                       <p className="text-sm font-extrabold text-slate-900 dark:text-white leading-none truncate">{assignee.name}</p>
                    </div>
                </div>
              )}
           </div>

           {/* Core Title */}
           <div className="min-w-0 w-full overflow-hidden">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-3 break-words">
                {task.title}
              </h1>
              <div className="flex gap-2 flex-wrap min-w-0 w-full">
                {(task.project ? [task.project] : task.tags).map((tag, idx) => (
                  <span key={idx} className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md max-w-full truncate block flex-shrink-0">{tag}</span>
                ))}
              </div>
           </div>

           <div className="h-px w-full bg-slate-100 dark:bg-slate-800 flex-shrink-0"></div>

           {/* Metrics Grid */}
           <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center text-center gap-1 shadow-sm overflow-hidden">
                 <Clock className="w-4 h-4 text-slate-400 mb-1 flex-shrink-0" />
                 <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest truncate w-full">Due Date</span>
                 <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate w-full">{task.due}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center text-center gap-1 shadow-sm overflow-hidden">
                 <Tag className={cn("w-4 h-4 mb-1 flex-shrink-0", task.priority === 'High' ? "text-red-500" : task.priority === 'Medium' ? "text-orange-500" : "text-slate-400")} />
                 <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest truncate w-full">Priority</span>
                 <span className={cn(
                   "text-sm font-bold truncate w-full",
                   task.priority === 'High' ? "text-red-500" : 
                   task.priority === 'Medium' ? "text-orange-500" : "text-slate-600 dark:text-slate-300"
                 )}>{task.priority}</span>
              </div>
              
              <div className="col-span-2 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm overflow-hidden">
                 <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      task.done ? "bg-green-100 dark:bg-green-500/20 text-green-500" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                    )}>
                       <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block truncate">Milestone Status</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate block">{task.done ? 'Completed' : task.status}</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Notes Module */}
           {task.note && (
             <div className="flex flex-col gap-2 min-w-0 w-full flex-shrink-0">
               <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MoreHorizontal className="w-3.5 h-3.5" /> Notes & Directives</span>
               <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap italic break-words w-full overflow-hidden">
                 "{task.note}"
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}



export function QuestTasks() {
  const { tasks, toggleTask, addTask, deleteTask, team } = useQuest();
  const [activeList, setActiveList] = useState('My Tasks');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [viewMode, setViewMode] = useState<'list'|'grid'>('list');

  const lists = ['Inbox', 'My Tasks', 'Urgent'];
  
  const filteredTasks = tasks.filter(t => {
    if (activeList !== 'Inbox' && t.listId !== activeList) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    if (priorityFilter && t.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col animate-in fade-in duration-300">
       <ActionModal isOpen={isModalOpen} type="task" onClose={() => setIsModalOpen(false)} />
       <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
       
       {/* Top Header Bar */}
       <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm z-10 text-left bg-white dark:bg-slate-900 sticky top-0">
          <div className="flex items-center gap-4 flex-wrap">
             <button 
               onClick={() => setIsModalOpen(true)}
               className="flex items-center gap-2 bg-[#3b82f6] text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-blue-600 transition-colors shadow-sm whitespace-nowrap"
             >
               <Plus className="w-4 h-4" /> Add Task
             </button>
             <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
             <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                {lists.map(list => (
                  <button 
                    key={list}
                    onClick={() => setActiveList(list)}
                    className={cn(
                      "px-4 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2",
                      activeList === list 
                        ? "bg-white dark:bg-slate-900 text-[#3b82f6] shadow-sm" 
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                  >
                    {list}
                    {list === 'Inbox' && (
                      <span className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded-md",
                        activeList === list ? "bg-blue-50 dark:bg-blue-500/10 text-[#3b82f6]" : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                      )}>
                        {tasks.length}
                      </span>
                    )}
                  </button>
                ))}
             </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <div className="relative flex-grow sm:flex-grow-0">
               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
               <input 
                 type="text" 
                 placeholder="Search tasks..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="pl-9 pr-4 py-1.5 w-full sm:w-48 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-[#3b82f6] text-slate-900 dark:text-white transition-colors"
               />
             </div>
             
             {/* View Toggles */}
             <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                   onClick={() => setViewMode('list')}
                   className={cn("p-1.5 rounded-md transition-colors", viewMode === 'list' ? "bg-white dark:bg-slate-900 text-[#3b82f6] shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200")}
                   title="List View"
                >
                   <Menu className="w-3.5 h-3.5" />
                </button>
                <button
                   onClick={() => setViewMode('grid')}
                   className={cn("p-1.5 rounded-md transition-colors", viewMode === 'grid' ? "bg-white dark:bg-slate-900 text-[#3b82f6] shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200")}
                   title="Grid View"
                >
                   <LayoutGrid className="w-3.5 h-3.5" />
                </button>
             </div>

             <div className="relative">
               <button 
                 onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                 className={cn(
                   "p-1.5 border rounded-lg transition-colors flex-shrink-0 relative",
                   showFilterDropdown || statusFilter || priorityFilter ? "bg-slate-100 dark:bg-slate-800 border-[#3b82f6] text-[#3b82f6]" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700"
                 )}
               >
                 <Filter className="w-4 h-4" />
                 {(statusFilter || priorityFilter) && (
                   <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#3b82f6] rounded-full border-2 border-white dark:border-slate-900"></span>
                 )}
               </button>

               {showFilterDropdown && (
                 <>
                   <div className="fixed inset-0 z-40" onClick={() => setShowFilterDropdown(false)}></div>
                   <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="mb-3">
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Priority</p>
                         <div className="flex gap-1.5">
                           {['Low', 'Medium', 'High'].map(p => (
                             <button
                               key={p}
                               onClick={() => setPriorityFilter(priorityFilter === p ? '' : p)}
                               className={cn(
                                 "text-[10px] font-bold px-2 py-1 rounded-md border transition-colors",
                                 priorityFilter === p ? "bg-[#3b82f6] text-white border-[#3b82f6]" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                               )}
                             >
                               {p}
                             </button>
                           ))}
                         </div>
                      </div>
                      <div className="mb-3">
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Status</p>
                         <div className="flex flex-col gap-1">
                           {['To Do', 'In Progress', 'Review', 'Done'].map(s => (
                             <button
                               key={s}
                               onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
                               className={cn(
                                 "text-[10px] font-bold px-2 py-1.5 rounded-md text-left transition-colors",
                                 statusFilter === s ? "bg-[#3b82f6]/10 text-[#3b82f6]" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                               )}
                             >
                               {s}
                             </button>
                           ))}
                         </div>
                      </div>
                      {(statusFilter || priorityFilter) && (
                        <button 
                          onClick={() => { setStatusFilter(''); setPriorityFilter(''); setShowFilterDropdown(false); }}
                          className="w-full mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-1 border-t border-slate-100 dark:border-slate-700 pt-2"
                        >
                           Clear All Filters
                        </button>
                      )}
                   </div>
                 </>
               )}
             </div>
          </div>
       </div>
       
       {/* Main Task Display */}
       <div className="flex-grow flex flex-col min-w-0 bg-slate-50/30 dark:bg-transparent">
          <div className="flex-grow p-4 sm:p-6 text-left">
             
             {filteredTasks.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-sm">No tasks found.</div>
             )}

             {viewMode === 'list' ? (
                /* LIST VIEW */
                <div className="w-full flex flex-col gap-1.5 max-w-6xl mx-auto">
                   <div className="flex items-center gap-4 px-4 py-2 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 dark:border-slate-800 mb-2">
                      <div className="w-6"></div>
                      <div className="flex-grow">Task Name</div>
                      <div className="w-24 hidden sm:block">Due Date</div>
                      <div className="w-24 hidden md:block">Priority</div>
                      <div className="w-24 hidden lg:block">Status</div>
                      <div className="w-8 text-right hidden lg:block">Action</div>
                   </div>
                   
                   {filteredTasks.map((task) => {
                     const assignee = team.find(m => m.id === task.assigneeId);
                     return (
                       <div 
                         key={task.id} 
                         onClick={() => setSelectedTask(task)}
                         className="flex items-center gap-4 p-3 sm:px-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-md rounded-xl transition-all group cursor-pointer"
                       >
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }} 
                            className="text-slate-300 dark:text-slate-600 hover:text-[#3b82f6] flex-shrink-0 transition-colors"
                          >
                            {task.done ? <CheckCircle2 className="w-4 h-4 text-[#3b82f6]" /> : <Circle className="w-4 h-4" />}
                          </button>
                          <div className="flex-grow min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                             <span className={cn("text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate transition-all", task.done && "line-through text-slate-400")}>
                               {task.title}
                             </span>
                             <div className="flex gap-1">
                               {(task.project ? [task.project] : task.tags).map((tag, idx) => (
                                 <span key={idx} className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{tag}</span>
                               ))}
                             </div>
                          </div>

                          <div className="flex items-center gap-4 flex-shrink-0">
                             {assignee && (
                               <div className="hidden sm:flex items-center gap-2">
                                  <div className={cn("w-4 h-4 rounded-md flex items-center justify-center text-[8px] font-bold text-white shadow-sm", assignee.color)}>
                                     {assignee.initial}
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">{assignee.name}</span>
                               </div>
                             )}
                             <div className="w-24 hidden sm:block text-[11px] font-bold text-slate-500">
                                {task.due}
                             </div>
                             <div className="w-8 flex justify-end">
                               <button 
                                 onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} 
                                 className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-1"
                               >
                                 <Trash2 className="w-4 h-4" />
                               </button>
                             </div>
                          </div>
                       </div>
                     );
                   })}
                </div>
             ) : (
                /* GRID VIEW */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
                   {filteredTasks.map((task) => {
                     const assignee = team.find(m => m.id === task.assigneeId);
                     return (
                       <div 
                         key={task.id} 
                         onClick={() => setSelectedTask(task)}
                         className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:border-[#3b82f6]/50 dark:hover:border-[#3b82f6]/50 rounded-xl p-4 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                       >
                         <div className="flex justify-between items-start gap-2">
                            <button 
                               onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }} 
                               className="text-slate-300 dark:text-slate-600 hover:text-[#3b82f6] flex-shrink-0 transition-colors mt-0.5"
                             >
                               {task.done ? <CheckCircle2 className="w-4 h-4 text-[#3b82f6]" /> : <Circle className="w-4 h-4" />}
                             </button>
                             <h3 className={cn(
                               "text-sm font-bold leading-snug text-slate-900 dark:text-white flex-grow min-w-0 break-words break-all", 
                               task.done && "line-through text-slate-400"
                             )}>
                               {task.title}
                             </h3>
                             <button 
                               onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} 
                               className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity flex-shrink-0"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                         </div>
                         
                         {task.note && (
                           <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic">"{task.note}"</p>
                         )}

                         <div className="mt-auto pt-4 flex flex-col gap-3 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                  {assignee ? (
                                    <div className="flex items-center gap-1.5 text-left">
                                       <div className={cn("w-4 h-4 rounded-md flex items-center justify-center text-[7px] font-bold text-white shadow-sm", assignee.color)}>
                                          {assignee.initial}
                                       </div>
                                       <span className="text-[9px] font-bold text-slate-400 truncate max-w-[60px]">{assignee.name.split(' ')[0]}</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5 opacity-30 text-left">
                                       <User className="w-3.5 h-3.5 text-slate-400" />
                                       <span className="text-[9px] font-bold text-slate-400">Unassigned</span>
                                    </div>
                                  )}
                               </div>
                               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                 <Clock className="w-3.5 h-3.5" /> {task.due}
                               </div>
                            </div>
                         </div>
                       </div>
                     );
                   })}
                </div>
             )}
          </div>
       </div>
    </div>
  );
}

// -------------------------------------------------------------
