import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Clock, Plus, 
  MoreHorizontal, User, Tag, Trash2, X, ChevronLeft, ChevronRight, Edit2, CheckCircle2, Circle, LayoutGrid, Search, Menu, Filter, UserPlus
} from 'lucide-react';
import { useQuest, type QuestEvent } from './QuestContext';
import { cn } from '../../../../lib/utils';
import { ActionModal } from './QuestModals';

// CALENDAR
// -------------------------------------------------------------
export function EventDetailModal({ ev, onClose }: { ev: QuestEvent | null, onClose: () => void }) {
  const { team } = useQuest();
  if (!ev) return null;

  const invitedMembers = team.filter(m => ev.attendeeIds?.includes(m.id));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 text-left overflow-hidden flex flex-col max-h-[85vh]">
        <div className="relative px-5 py-4 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between flex-shrink-0">
           <div className="flex items-center gap-2">
              <div className="bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] uppercase tracking-widest font-black px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm border border-orange-500/20">
                 <CalendarIcon className="w-3.5 h-3.5" /> <span>EVENT DETAILS</span>
              </div>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors shadow-sm">
             <X className="w-4 h-4" />
           </button>
        </div>

        <div className="p-6 relative flex-grow overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col gap-6 w-full">
           <div className="min-w-0 w-full overflow-hidden">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-3 break-words break-all">
                {ev.title}
              </h1>
              <div className="flex gap-2 flex-wrap min-w-0 w-full">
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider text-white px-2.5 py-1 rounded-md max-w-full truncate block flex-shrink-0", ev.color)}>{ev.type}</span>
              </div>
           </div>

           <div className="h-px w-full bg-slate-100 dark:bg-slate-800 flex-shrink-0"></div>

           <div className="grid grid-cols-2 gap-4 flex-shrink-0">
              <div className="col-span-2 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 shadow-sm overflow-hidden min-w-0">
                 <Clock className="w-8 h-8 text-slate-400 flex-shrink-0 bg-slate-200 dark:bg-slate-800 p-1.5 rounded-xl" />
                 <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest min-w-0">Date & Time</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate w-full">{ev.date}</span>
                    <span className="text-xs font-bold text-slate-500 truncate w-full">{ev.time}</span>
                 </div>
              </div>
              
              <div className="col-span-2 flex flex-col gap-3">
                 <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                    <UserPlus className="w-3.5 h-3.5" /> Invited Participants ({ev.attendeeIds?.length || 0})
                 </span>
                 <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    {invitedMembers.length > 0 ? (
                       <div className="flex flex-col gap-3">
                          {invitedMembers.map(member => (
                             <div key={member.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                   <div className={cn("w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900", member.color)}>
                                      {member.initial}
                                   </div>
                                   <div className="flex flex-col">
                                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{member.name}</span>
                                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{member.role}</span>
                                   </div>
                                </div>
                                <div className="text-[9px] font-bold text-[#3b82f6] bg-blue-50 dark:bg-[#3b82f6]/10 px-2 py-0.5 rounded uppercase tracking-widest">Invited</div>
                             </div>
                          ))}
                       </div>
                    ) : (
                       <div className="py-4 text-center">
                          <p className="text-xs font-bold text-slate-400 italic">No guests invited yet.</p>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export function QuestCalendar() {
  const { events, addEvent, deleteEvent } = useQuest();
  const [activeTab, setActiveTab] = useState('Month');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');
  const [selectedEvent, setSelectedEvent] = useState<QuestEvent | null>(null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const eventTypes = ['Meeting', 'Focus Time', 'Holiday', 'Deadline'];
  
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9)); // October 2026 Default

  const filteredEvents = events.filter(e => {
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (eventTypeFilter && e.type !== eventTypeFilter) return false;
    return true;
  });

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const currentYear = currentDate.getFullYear();
  const currentMonthIdx = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonthIdx);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonthIdx);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[currentMonthIdx];

  const realToday = new Date();
  
  // Dynamic grid generator
  const days = Array.from({ length: 35 }, (_, i) => {
    const dayNum = i - firstDay + 1;
    const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth;
    const isToday = isCurrentMonth && dayNum === realToday.getDate() && currentMonthIdx === realToday.getMonth() && currentYear === realToday.getFullYear();
    
    // Tab Scoping filtering directly on grid events
    // Mocking 3rd week for October 2026 just to keep events looking good ONLY if we are in Oct 2026
    let isVisible = true;
    if (activeTab === 'Week') {
        const isMockTarget = currentMonthIdx === 9 && currentYear === 2026;
        if (isMockTarget) {
            if (i < 14 || i > 20) isVisible = false;
        } else {
            // Find week of the month containing today or 1st day to show something reasonable
            const todayIdx = realToday.getDate() + firstDay - 1;
            const weekStartIdx = Math.floor(todayIdx / 7) * 7;
            if (i < weekStartIdx || i > weekStartIdx + 6) isVisible = false;
        }
    }
    
    if (activeTab === 'Day') {
        const renderDayTarget = (currentMonthIdx === realToday.getMonth() && currentYear === realToday.getFullYear()) 
            ? realToday.getDate() 
            : 15; // default to 15th if looking at other months
        if (dayNum !== renderDayTarget) isVisible = false;
    }

    // only show mock events on correct month
    const dayEvents = isVisible && isCurrentMonth && currentMonthIdx === 9 && currentYear === 2026 ? filteredEvents.filter(e => e.dayNum === dayNum) : [];

    return { dayNum, isCurrentMonth, isToday, events: dayEvents };
  });

  const displayedDays = activeTab === 'Month' ? days : activeTab === 'Week' ? days.filter((_, i) => {
      const isMockTarget = currentMonthIdx === 9 && currentYear === 2026;
      if (isMockTarget) return i >= 14 && i <= 20;
      const todayIdx = realToday.getDate() + firstDay - 1;
      const weekStartIdx = Math.floor(todayIdx / 7) * 7;
      return i >= weekStartIdx && i <= weekStartIdx + 6;
  }) : days.filter(d => {
      const renderDayTarget = (currentMonthIdx === realToday.getMonth() && currentYear === realToday.getFullYear()) 
            ? realToday.getDate() 
            : 15; 
      return d.dayNum === renderDayTarget && d.isCurrentMonth;
  }).slice(0, 1);
  
  if (displayedDays.length === 0 && activeTab === 'Day') {
    // Failsafe for Day view on other months
    const renderDayTarget = (currentMonthIdx === realToday.getMonth() && currentYear === realToday.getFullYear()) ? realToday.getDate() : 15;
    displayedDays.push({ dayNum: renderDayTarget, isCurrentMonth: true, isToday: false, events: [] });
  }

  const listEvents = filteredEvents.filter(e => {
    if (currentMonthIdx !== 9 || currentYear !== 2026) return false;
    if (activeTab === 'Week' && (e.dayNum < 12 || e.dayNum > 18)) return false;
    
    if (activeTab === 'Day') {
       const renderDayTarget = (currentMonthIdx === realToday.getMonth() && currentYear === realToday.getFullYear()) ? realToday.getDate() : 15;
       if (e.dayNum !== renderDayTarget) return false;
    }
    return true;
  });

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonthIdx - 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonthIdx + 1));
  const prevYear = () => setCurrentDate(new Date(currentYear - 1, currentMonthIdx));
  const nextYear = () => setCurrentDate(new Date(currentYear + 1, currentMonthIdx));
  const goToToday = () => setCurrentDate(new Date()); // Go to real today

  return (
    <div className="flex flex-col animate-in fade-in duration-300">
       {isModalOpen && <ActionModal isOpen={isModalOpen} type="event" onClose={() => setIsModalOpen(false)} />}
       {selectedEvent && <EventDetailModal ev={selectedEvent} onClose={() => setSelectedEvent(null)} />}
       
       {/* Top Header Bar */}
       <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm z-10 text-left bg-white dark:bg-slate-900 sticky top-0">
          <div className="flex items-center gap-4 flex-wrap">
             <button 
               onClick={() => setIsModalOpen(true)}
               className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-orange-600 transition-colors shadow-sm whitespace-nowrap"
             >
               <Plus className="w-4 h-4" /> Add Event
             </button>
             <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
             
             <button onClick={goToToday} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-md transition-colors flex items-center gap-2 shadow-sm">
               <CalendarIcon className="w-3.5 h-3.5" /> Today
             </button>

             <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
             
             <div className="flex items-center gap-1">
               <button onClick={prevMonth} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
               </button>
               <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center justify-center min-w-[80px]">
                 {currentMonthName}
               </h2>
               <button onClick={nextMonth} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <ChevronRight className="w-4 h-4" />
               </button>
             </div>

             <div className="flex items-center gap-1">
               <button onClick={prevYear} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
               </button>
               <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center justify-center min-w-[45px]">
                 {currentYear}
               </h2>
               <button onClick={nextYear} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <ChevronRight className="w-4 h-4" />
               </button>
             </div>

             <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
             
             <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                {['Month', 'Week', 'Day'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2",
                      activeTab === tab 
                        ? "bg-white dark:bg-slate-900 text-orange-500 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                  >
                    {tab}
                  </button>
                ))}
             </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <div className="relative flex-grow sm:flex-grow-0">
               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
               <input 
                 type="text" 
                 placeholder="Search events..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="pl-9 pr-4 py-1.5 w-full sm:w-48 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white transition-colors"
               />
             </div>
             
             {/* View Toggles */}
             <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                   onClick={() => setViewMode('list')}
                   className={cn("p-1.5 rounded-md transition-colors", viewMode === 'list' ? "bg-white dark:bg-slate-900 text-orange-500 shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200")}
                   title="List View"
                >
                   <Menu className="w-3.5 h-3.5" />
                </button>
                <button
                   onClick={() => setViewMode('grid')}
                   className={cn("p-1.5 rounded-md transition-colors", viewMode === 'grid' ? "bg-white dark:bg-slate-900 text-orange-500 shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200")}
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
                   showFilterDropdown || eventTypeFilter ? "bg-slate-100 dark:bg-slate-800 border-orange-500 text-orange-500" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700"
                 )}
               >
                 <Filter className="w-4 h-4" />
                 {eventTypeFilter && (
                   <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                 )}
               </button>

               {showFilterDropdown && (
                 <>
                   <div className="fixed inset-0 z-40" onClick={() => setShowFilterDropdown(false)}></div>
                   <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="mb-2">
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Event Type</p>
                         <div className="flex flex-col gap-1">
                           {eventTypes.map(t => (
                             <button
                               key={t}
                               onClick={() => setEventTypeFilter(eventTypeFilter === t ? '' : t)}
                               className={cn(
                                 "text-[10px] font-bold px-2 py-1.5 rounded-md text-left transition-colors",
                                 eventTypeFilter === t ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                               )}
                             >
                               {t}
                             </button>
                           ))}
                         </div>
                      </div>
                      {eventTypeFilter && (
                        <button 
                          onClick={() => { setEventTypeFilter(''); setShowFilterDropdown(false); }}
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

       {/* Main Event Display */}
       <div className="flex-grow flex flex-col min-w-0 bg-slate-50/30 dark:bg-transparent">
          <div className="flex-grow p-4 sm:p-6 text-left flex flex-col items-center">
             
             {viewMode === 'list' && listEvents.length === 0 && (
                <div className="w-full text-center py-10 text-slate-400 text-sm flex flex-col items-center gap-2">
                   <CalendarIcon className="w-8 h-8 opacity-20" />
                   No events found for this timeframe.
                </div>
             )}

             {viewMode === 'list' && listEvents.length > 0 ? (
                /* CARD VIEW (Previously List) */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                   {listEvents.map((ev) => (
                     <div 
                       key={ev.id} 
                       onClick={() => setSelectedEvent(ev)}
                       className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:border-orange-500/50 dark:hover:border-orange-500/50 rounded-xl p-4 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                     >
                        <div className="flex justify-between items-start gap-2">
                           <div className="flex items-center justify-center p-1.5 rounded bg-orange-50 dark:bg-orange-900/20 text-orange-600 mt-0.5">
                              <CalendarIcon className="w-4 h-4" />
                           </div>
                           <h3 className="text-sm font-bold leading-snug text-slate-900 dark:text-white flex-grow min-w-0 break-words break-all">
                             {ev.title}
                           </h3>
                           <button 
                             onClick={(e) => { e.stopPropagation(); deleteEvent(ev.id); }} 
                             className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity flex-shrink-0"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>

                        <div className="mt-auto pt-4 flex flex-col gap-3 border-t border-slate-100 dark:border-slate-800">
                           <div className="flex flex-col gap-1.5 text-[11px] font-bold text-slate-500">
                              <div className="flex flex-wrap gap-1">
                                 <span className={cn("px-1.5 py-0.5 rounded text-white tracking-wider uppercase text-[9px]", ev.color)}>
                                    {ev.type}
                                 </span>
                              </div>
                              <span className="text-slate-700 dark:text-slate-300 mt-1">{ev.date}</span>
                              <span className="text-[10px]"><Clock className="w-3 h-3 inline mr-1" />{ev.time}</span>
                           </div>
                           <div className="flex items-center justify-end mt-1 text-[11px] font-bold text-slate-500">
                              <User className="w-3 h-3 mr-1" /> {ev.attendeeIds?.length || 0} Attendees
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             ) : viewMode === 'grid' ? (
                activeTab === 'Day' ? (
                   /* DAY TIMELINE VIEW (24-Hour Side-by-Side) */
                   <div className="w-full flex flex-col gap-4 flex-grow max-w-7xl min-h-0">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900 text-center border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm shrink-0">
                         <h3 className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center justify-center gap-2">
                             {daysOfWeek[currentDate.getDay()]}, {currentMonthName} {displayedDays[0]?.dayNum || currentDate.getDate()} 
                             {displayedDays[0]?.isToday && (
                               <span className="px-2 py-0.5 bg-orange-500/10 rounded-md lowercase">today</span>
                             )}
                         </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow items-stretch overflow-hidden pb-4 pr-1 min-h-0">
                         {/* AM Column */}
                         <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                            <div className="bg-slate-100 dark:bg-slate-900 px-3 py-2 text-[10px] font-black uppercase text-slate-500 border-b border-slate-200 dark:border-slate-800 flex justify-between shrink-0">
                               <span>AM Hours</span>
                               <span>Midnight to 11:59 AM</span>
                            </div>
                            <div className="flex flex-col flex-grow min-h-0">
                               {['12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'].map(hour => {
                                  const [hMatch, ampm] = hour.split(' ');
                                  const evs = displayedDays[0]?.events.filter(e => e.time.startsWith(hMatch) && e.time.includes(ampm)) || [];
                                  
                                  return (
                                     <div key={hour} onClick={() => setIsModalOpen(true)} className="flex flex-1 min-h-0 border-b border-slate-100 dark:border-slate-800/60 last:border-0 group hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors relative cursor-pointer">
                                        <div className="w-20 sm:w-24 flex-shrink-0 p-2 text-right text-[10px] font-bold text-slate-400 group-hover:text-orange-500 border-r border-slate-100 dark:border-slate-800/60 transition-colors flex items-center justify-end">
                                           {hour}
                                        </div>
                                        <div className="flex-grow p-1.5 flex flex-wrap gap-1.5 relative z-10 w-full overflow-hidden items-center">
                                           <div className="absolute left-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold">
                                              <Plus className="w-3 h-3" /> Add Event
                                           </div>
                                           <div className="flex flex-wrap gap-1.5 relative z-20 group-hover:pl-[84px] transition-all duration-200 h-full items-center">
                                              {evs.map(ev => (
                                                 <div key={ev.id} onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); }} className={cn("px-2 py-0.5 rounded text-white shadow-sm flex items-center justify-between text-[11px] font-bold cursor-pointer hover:shadow-md transition-all", ev.color)}>
                                                    <span className="truncate mr-2 max-w-[140px] hidden xl:block">{ev.title}</span>
                                                    <span className="text-[9px] opacity-90 shrink-0"><User className="w-3 h-3 inline mr-0.5" />{ev.attendeeIds?.length || 0}</span>
                                                 </div>
                                              ))}
                                           </div>
                                        </div>
                                     </div>
                                  );
                               })}
                            </div>
                         </div>

                         {/* PM Column */}
                         <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                            <div className="bg-slate-100 dark:bg-slate-900 px-3 py-2 text-[10px] font-black uppercase text-slate-500 border-b border-slate-200 dark:border-slate-800 flex justify-between shrink-0">
                               <span>PM Hours</span>
                               <span>Noon to 11:59 PM</span>
                            </div>
                            <div className="flex flex-col flex-grow min-h-0">
                               {['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'].map(hour => {
                                  const [hMatch, ampm] = hour.split(' ');
                                  const evs = displayedDays[0]?.events.filter(e => e.time.startsWith(hMatch) && e.time.includes(ampm)) || [];
                                  
                                  return (
                                     <div key={hour} onClick={() => setIsModalOpen(true)} className="flex flex-1 min-h-0 border-b border-slate-100 dark:border-slate-800/60 last:border-0 group hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors relative cursor-pointer">
                                        <div className="w-20 sm:w-24 flex-shrink-0 p-2 text-right text-[10px] font-bold text-slate-400 group-hover:text-orange-500 border-r border-slate-100 dark:border-slate-800/60 transition-colors flex items-center justify-end">
                                           {hour}
                                        </div>
                                        <div className="flex-grow p-1.5 flex flex-wrap gap-1.5 relative z-10 w-full overflow-hidden items-center">
                                           <div className="absolute left-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold">
                                              <Plus className="w-3 h-3" /> Add Event
                                           </div>
                                           <div className="flex flex-wrap gap-1.5 relative z-20 group-hover:pl-[84px] transition-all duration-200 h-full items-center">
                                              {evs.map(ev => (
                                                 <div key={ev.id} onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); }} className={cn("px-2 py-0.5 rounded text-white shadow-sm flex items-center justify-between text-[11px] font-bold cursor-pointer hover:shadow-md transition-all", ev.color)}>
                                                    <span className="truncate mr-2 max-w-[140px] hidden xl:block">{ev.title}</span>
                                                    <span className="text-[9px] opacity-90 shrink-0"><User className="w-3 h-3 inline mr-0.5" />{ev.attendeeIds?.length || 0}</span>
                                                 </div>
                                              ))}
                                           </div>
                                        </div>
                                     </div>
                                  );
                               })}
                            </div>
                         </div>
                      </div>
                   </div>
                ) : (
                   /* MONTH / WEEK GRID VIEW */
                   <div className={cn(
                     "w-full grid grid-cols-7 gap-px rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm flex-grow max-w-7xl min-h-[500px]",
                     activeTab === 'Month' ? "grid-rows-[auto_repeat(5,minmax(0,1fr))]" : "grid-rows-[auto_1fr]"
                   )}>
                      {daysOfWeek.map(day => (
                        <div key={day} className="bg-slate-50 dark:bg-slate-900 p-2 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest hidden sm:block">
                          {day}
                        </div>
                      ))}
                      {daysOfWeek.map(day => (
                        <div key={day + '-mobile'} className="bg-slate-50 dark:bg-slate-900 p-2 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest sm:hidden">
                          {day.substring(0, 1)}
                        </div>
                      ))}
                      
                      {displayedDays.map((day, i) => (
                        <div key={i} onClick={() => setIsModalOpen(true)} className={cn(
                          "bg-white dark:bg-slate-950 p-1 sm:p-2 flex flex-col transition-colors hover:bg-orange-50 dark:hover:bg-orange-900/10 overflow-hidden min-h-0 relative group cursor-pointer",
                          !day.isCurrentMonth && "opacity-40"
                        )}>
                           <div className="flex justify-between items-start mb-1 sm:mb-2 flex-shrink-0 relative z-10">
                              <span className={cn(
                                "text-xs sm:text-sm font-bold w-4 h-4 flex items-center justify-center rounded-md leading-none shrink-0",
                                day.isToday ? "bg-orange-500 text-white" : "text-slate-700 dark:text-slate-300"
                              )}>
                                {day.dayNum > 0 && day.dayNum <= 31 ? day.dayNum : (day.dayNum <= 0 ? 30 + day.dayNum : day.dayNum - 31)}
                              </span>
                              <div className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] font-bold mt-1">
                                 <Plus className="w-3 h-3" /> <span className="hidden sm:inline">Add</span>
                              </div>
                           </div>
                           {(day.isCurrentMonth || activeTab === 'Week') && <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-grow relative z-20">
                             {day.events.map(ev => (
                               <div key={ev.id} onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); }} className={cn("text-[9px] sm:text-[10px] font-bold text-white px-1.5 py-0.5 rounded truncate shadow-sm cursor-pointer hover:opacity-90 transition-opacity", ev.color)}>
                                 {ev.title}
                               </div>
                             ))}
                           </div>}
                        </div>
                      ))}
                   </div>
                )
             ) : null}
          </div>
       </div>
    </div>
  );
}

// -------------------------------------------------------------
