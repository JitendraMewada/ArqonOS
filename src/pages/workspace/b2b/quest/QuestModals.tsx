import React, { useState } from 'react';
import { 
  CheckSquare, Calendar as CalendarIcon, MessageSquare, X, UserPlus
} from 'lucide-react';
import { useQuest } from './QuestContext';
import { cn } from '../../../../lib/utils';

export function ActionModal({ isOpen, type, onClose }: { isOpen: boolean, type: 'task' | 'event' | 'message', onClose: () => void }) {
  const { addTask, addEvent, sendMessage, team } = useQuest();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  
  // Specific for task
  const [dueDate, setDueDate] = useState('Today');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('To Do');
  const [assigneeId, setAssigneeId] = useState('');
  const [tag, setTag] = useState('');
  const [note, setNote] = useState('');

  // Specific for event
  const [eventDate, setEventDate] = useState('2026-10-15');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [allDay, setAllDay] = useState(false);
  const [repeat, setRepeat] = useState('Never');
  const [location, setLocation] = useState('');
  const [selectedGuestIds, setSelectedGuestIds] = useState<string[]>([]);
  const [eventPurpose, setEventPurpose] = useState('Meeting');

  if (!isOpen) return null;

  const toggleGuest = (id: string) => {
    setSelectedGuestIds(prev => 
      prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && type !== 'message') return;

    if (type === 'task') {
      const selectedMember = team.find(m => m.id === assigneeId);
      addTask({ 
        title: title.trim(), 
        due: dueDate, 
        priority: priority, 
        status: status, 
        tags: tag ? [tag] : ['New'], 
        listId: 'Inbox', 
        done: false, 
        project: desc.trim(),
        assigneeId: assigneeId,
        assignTo: selectedMember?.name || '',
        note: note.trim(),
        createdBy: { name: 'Workspace Admin', avatar: 10 }
      });
    } else if (type === 'event') {
      let colorClass = 'bg-[#3b82f6]'; // default Meeting blue
      if (eventPurpose === 'Focus Time') colorClass = 'bg-purple-500';
      if (eventPurpose === 'Deadline') colorClass = 'bg-red-500';
      if (eventPurpose === 'Social') colorClass = 'bg-green-500';
      if (eventPurpose === 'Out of Office') colorClass = 'bg-orange-500';
      
      const formatTime = (timeStr: string) => {
         if (!timeStr) return '';
         const [h, m] = timeStr.split(':');
         let hour = parseInt(h);
         const ampm = hour >= 12 ? 'PM' : 'AM';
         hour = hour % 12 || 12;
         return `${hour}:${m} ${ampm}`;
      }

      const timeDisplay = allDay ? 'All Day' : `${formatTime(startTime)} - ${formatTime(endTime)}`;
      
      addEvent({ 
        title: title.trim(), 
        date: eventDate, 
        time: timeDisplay, 
        attendeeIds: selectedGuestIds, 
        type: eventPurpose, 
        color: colorClass, 
        dayNum: parseInt(eventDate.split('-')[2]) 
      });
    } else if (type === 'message') {
      sendMessage('# general', title.trim() || 'Hello!');
    }
    
    setTitle('');
    setDesc('');
    setDueDate('Today');
    setPriority('Medium');
    setStatus('To Do');
    setAssigneeId('');
    setTag('');
    setNote('');
    setEventDate('2026-10-15');
    setStartTime('09:00');
    setEndTime('10:00');
    setAllDay(false);
    setRepeat('Never');
    setLocation('');
    setSelectedGuestIds([]);
    setEventPurpose('Meeting');
    onClose();
  };

  const config = {
    task: { title: 'Create Task', icon: CheckSquare, color: 'text-blue-500', descLabel: 'Purpose / Project' },
    event: { title: 'Schedule Event', icon: CalendarIcon, color: 'text-orange-500', descLabel: 'Time (e.g. 2:00 PM)' },
    message: { title: 'Send Message', icon: MessageSquare, color: 'text-green-500', descLabel: 'Channel (default #general)' }
  }[type];

  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 text-left">
        <form onSubmit={handleSubmit} className="flex flex-col">
           <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Icon className={cn("w-4 h-4", config.color)} /> {config.title}
              </h2>
              <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                <X className="w-4 h-4" />
              </button>
           </div>
           
           <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  {type === 'message' ? 'Message Body' : 'Title'}
                </label>
                <input 
                  type="text" 
                  autoFocus
                  required={type !== 'message'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={type === 'message' ? "Type your message..." : "e.g. Review Q3 Reports"}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
              
              {type === 'task' && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    {config.descLabel}
                  </label>
                  <input 
                    type="text" 
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Optional details..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>
              )}

              {type === 'task' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Due Date</label>
                      <input 
                        type="text" 
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        placeholder="e.g. Today, Tomorrow"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#3b82f6]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Tag / Label</label>
                      <input 
                        type="text" 
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        placeholder="#tag"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#3b82f6]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Assign To Team Member</label>
                    <div className="grid grid-cols-1 gap-2">
                       <select 
                         value={assigneeId}
                         onChange={(e) => setAssigneeId(e.target.value)}
                         className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#3b82f6]"
                       >
                         <option value="">Unassigned</option>
                         {team.map(member => (
                           <option key={member.id} value={member.id}>{member.name} — {member.role}</option>
                         ))}
                       </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Priority</label>
                      <select 
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#3b82f6]"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Status</label>
                      <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#3b82f6]"
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Review">Review</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Note</label>
                    <textarea 
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Add any extra notes..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#3b82f6] resize-none h-20"
                    />
                  </div>
                </>
              )}

              {type === 'event' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Date</label>
                      <input 
                        type="date" 
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex items-center justify-start mt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={allDay}
                          onChange={(e) => setAllDay(e.target.checked)}
                          className="w-4 h-4 text-orange-500 focus:ring-orange-500 rounded border-slate-300"
                        />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">All Day Event</span>
                      </label>
                    </div>
                  </div>

                  {!allDay && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Start Time</label>
                        <input 
                          type="time" 
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">End Time</label>
                        <input 
                          type="time" 
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Purpose</label>
                      <select 
                        value={eventPurpose}
                        onChange={(e) => setEventPurpose(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                      >
                        <option value="Meeting">Meeting</option>
                        <option value="Focus Time">Focus Time</option>
                        <option value="Deadline">Deadline</option>
                        <option value="Social">Social</option>
                        <option value="Out of Office">Out of Office</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Repeat</label>
                      <select 
                        value={repeat}
                        onChange={(e) => setRepeat(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                      >
                        <option value="Never">Never</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Location</label>
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Room, Link, or Address..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 block flex items-center justify-between">
                      <span>Invite Guests</span>
                      <span className="text-[10px] text-orange-500 font-extrabold tracking-widest">{selectedGuestIds.length} Selected</span>
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl min-h-[50px]">
                       {team.map(member => {
                         const isSelected = selectedGuestIds.includes(member.id);
                         return (
                           <button
                             key={member.id}
                             type="button"
                             onClick={() => toggleGuest(member.id)}
                             className={cn(
                               "flex items-center gap-2 px-2 py-1.5 rounded-lg border transition-all group relative",
                               isSelected 
                                 ? "bg-white dark:bg-slate-900 border-orange-500/50 shadow-sm ring-1 ring-orange-500/20" 
                                 : "border-transparent bg-transparent hover:bg-white/50 dark:hover:bg-slate-900/50"
                             )}
                           >
                             <div className={cn(
                               "w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-bold text-white transition-transform group-hover:scale-105 shadow-sm",
                               member.color
                             )}>
                               {member.initial}
                             </div>
                             <div className="flex flex-col items-start leading-tight">
                                <span className={cn("text-[10px] font-bold transition-colors", isSelected ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400")}>{member.name.split(' ')[0]}</span>
                                <span className="text-[8px] font-medium text-slate-400 group-hover:text-slate-500 uppercase tracking-tighter">{member.role.split(' ')[0]}</span>
                             </div>
                             {isSelected && (
                               <div className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-md p-0.5 shadow-sm border border-white dark:border-slate-900">
                                  <UserPlus className="w-2 h-2" />
                               </div>
                             )}
                           </button>
                         );
                       })}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Note</label>
                    <textarea 
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Add meeting agenda or extra notes..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 resize-none h-20"
                    />
                  </div>
                </>
              )}

           </div>
           
           <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-xl">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider bg-[#3b82f6] text-white hover:bg-blue-600 transition-colors shadow-sm"
              >
                Create
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}
