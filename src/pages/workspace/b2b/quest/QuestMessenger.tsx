import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Plus, MoreHorizontal, User, Search, Send, Hash, Trash2, Edit2, X, Star, Bell, BellOff, Settings, UserPlus, Check, ChevronDown
} from 'lucide-react';
import { useQuest, type Message } from './QuestContext';
import { cn } from '../../../../lib/utils';

// Modal for adding members or renaming
function MessengerModal({ 
  isOpen, 
  title, 
  onClose, 
  children 
}: { 
  isOpen: boolean; 
  title: string; 
  onClose: () => void; 
  children: React.ReactNode 
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-sm border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 text-left">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// MESSENGER
// -------------------------------------------------------------
export function QuestMessenger() {
  const { messages, sendMessage, deleteMessage, toggleStarMessage, team, channels, addChannel, renameChannel, addMemberToChannel } = useQuest();
  const [activeChat, setActiveChat] = useState('# design-system');
  const [msgInput, setMsgInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Notification State
  const [mutedChats, setMutedChats] = useState<string[]>([]);
  
  // Modals Local State
  const [isAddChannelOpen, setIsAddChannelOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [showChannelActions, setShowChannelActions] = useState(false);
  
  const [newChannelName, setNewChannelName] = useState('');
  const [renameValue, setRenameValue] = useState('');

  // Auto-scroll logic (mocked by messages change)
  useEffect(() => {
    const el = document.getElementById('chat-scroll-container');
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, activeChat]);

  const activeChannel = channels.find(c => c.name === activeChat);
  const activeFriend = team.find(m => m.name === activeChat);
  
  const filteredMessages = messages
    .filter(m => m.chatId === activeChat)
    .filter(m => searchQuery ? m.body.toLowerCase().includes(searchQuery.toLowerCase()) || m.name.toLowerCase().includes(searchQuery.toLowerCase()) : true);

  const handleSend = () => {
    if (msgInput.trim()) {
      sendMessage(activeChat, msgInput.trim());
      setMsgInput('');
    }
  };

  const toggleMute = () => {
    setMutedChats(prev => prev.includes(activeChat) ? prev.filter(c => c !== activeChat) : [...prev, activeChat]);
  };

  const currentChannelObj = channels.find(c => c.name === activeChat);

  return (
    <div className="h-full flex divide-x divide-slate-100 dark:divide-slate-800 animate-in fade-in duration-300 text-left relative overflow-hidden">
       {/* Sidebar */}
       <div className="w-64 flex-shrink-0 flex flex-col bg-slate-50/50 dark:bg-slate-900/50 hidden md:flex h-full">
         <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between z-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
           <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
             <MessageSquare className="w-4 h-4 text-green-500" /> Chat
           </h2>
           <button 
             onClick={() => { setNewChannelName(''); setIsAddChannelOpen(true); }}
             className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-green-500 transition-all hover:shadow-sm"
           >
             <Plus className="w-4 h-4" />
           </button>
         </div>
         
         <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 mb-3">Channels</p>
              <div className="flex flex-col gap-1">
                {channels.map((ch) => (
                  <button 
                    key={ch.id}
                    onClick={() => setActiveChat(ch.name)}
                    className={cn(
                      "group flex items-center justify-between text-xs font-bold px-3 py-2.5 rounded-lg transition-all w-full text-left",
                      activeChat === ch.name ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 shadow-sm border border-green-500/10" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Hash className={cn("w-3.5 h-3.5", activeChat === ch.name ? "text-green-500" : "text-slate-400")} />
                      <span className="truncate">{ch.name.replace('# ', '').replace('#', '')}</span>
                    </div>
                    {mutedChats.includes(ch.name) && <BellOff className="w-3 h-3 text-slate-400" />}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 mb-3">Direct Messages</p>
              <div className="flex flex-col gap-1">
                {team.map((m) => (
                  <button 
                    key={m.id}
                    onClick={() => setActiveChat(m.name)}
                    className={cn(
                      "flex items-center gap-3 text-xs font-bold px-3 py-2.5 rounded-lg transition-all w-full text-left bg-transparent",
                      activeChat === m.name ? "bg-[#3b82f61a] text-[#3b82f6] shadow-sm border border-[#3b82f61a]" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      <div className={cn("w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center text-[10px] text-white font-bold shadow-sm transition-transform", m.color, activeChat === m.name && "scale-105")}>
                        {m.avatar ? (
                          <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          m.initial
                        )}
                      </div>
                      <div className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white dark:border-slate-950 rounded-full shadow-sm",
                        m.status === 'Active' ? "bg-green-500" : "bg-slate-300"
                      )}></div>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">{m.name}</span>
                      <span className="text-[8px] text-slate-400 truncate tracking-tight">{m.role}</span>
                    </div>
                    {mutedChats.includes(m.name) && <BellOff className="ml-auto w-3 h-3 text-slate-400" />}
                  </button>
                ))}
              </div>
            </div>
         </div>
       </div>

       {/* Main Chat Area */}
       <div className="flex-grow flex flex-col min-w-0 bg-white dark:bg-slate-900 relative h-full">
          {/* Header */}
          <div className="h-16 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)] z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {activeChat.startsWith('#') ? (
                <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/10">
                  <Hash className="w-4 h-4" />
                </div>
              ) : (
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white shadow-md transition-all active:scale-95", activeFriend?.color || 'bg-slate-400')}>
                  {activeFriend?.initial || activeChat.charAt(0)}
                </div>
              )}
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-white truncate text-base tracking-tight">{activeChat}</h3>
                  {activeChat.startsWith('#') && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[8px] font-black uppercase text-slate-500 tracking-widest border border-slate-200 dark:border-slate-700">
                      {currentChannelObj?.members.length || 1} Members
                    </span>
                  )}
                </div>
                {!activeChat.startsWith('#') ? (
                   <div className="flex items-center gap-1.5">
                     <div className={cn("w-1.5 h-1.5 rounded-full", activeFriend?.status === 'Active' ? 'bg-green-500' : 'bg-slate-400')} />
                     <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tightest">
                       {activeFriend?.status === 'Active' ? 'Active Now' : 'Offline'}
                     </span>
                   </div>
                ) : (
                  <span className="text-[10px] text-slate-400 font-medium truncate italic max-w-[200px]">Systemic collaborative room for ArqonOS team.</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 ml-4">
               {isSearching ? (
                 <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 animate-in slide-in-from-right-4 duration-200">
                   <Search className="w-3.5 h-3.5 text-slate-400 mx-1" />
                   <input 
                     autoFocus
                     type="text" 
                     placeholder="Filter messages..." 
                     className="bg-transparent border-none outline-none text-[11px] font-bold text-slate-900 dark:text-white w-24 sm:w-40 py-0.5"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                   />
                   <button onClick={() => { setIsSearching(false); setSearchQuery(''); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                     <X className="w-3.5 h-3.5" />
                   </button>
                 </div>
               ) : (
                 <button onClick={() => setIsSearching(true)} className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                   <Search className="w-4 h-4 font-bold" />
                 </button>
               )}
               
               <button 
                 onClick={toggleMute}
                 className={cn(
                   "w-9 h-9 flex items-center justify-center rounded-lg transition-all",
                   mutedChats.includes(activeChat) ? "text-orange-500 bg-orange-50 dark:bg-orange-500/10" : "text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                 )}
               >
                 {mutedChats.includes(activeChat) ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
               </button>

               <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>

               <div className="relative">
                 <button 
                   onClick={() => setShowChannelActions(!showChannelActions)}
                   className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                 >
                   <MoreHorizontal className="w-4 h-4" />
                 </button>
                 
                 {showChannelActions && (
                   <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Settings</p>
                      </div>
                      {activeChat.startsWith('#') && (
                        <>
                          <button 
                            onClick={() => { setShowChannelActions(false); setRenameValue(activeChat); setIsRenameOpen(true); }}
                            className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-[#3b82f6]" /> Rename Channel
                          </button>
                          <button 
                            onClick={() => { setShowChannelActions(false); setIsAddMemberOpen(true); }}
                            className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 transition-colors"
                          >
                            <UserPlus className="w-4 h-4 text-green-500" /> Add Members
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => { setShowChannelActions(false); toggleMute(); }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 transition-colors"
                      >
                        <Bell className="w-4 h-4 text-orange-500" /> {mutedChats.includes(activeChat) ? 'Unmute Chat' : 'Mute Notifications'}
                      </button>
                      <button className="w-full text-left px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-3 transition-colors mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <Trash2 className="w-4 h-4" /> Clear History
                      </button>
                   </div>
                 )}
               </div>
            </div>
          </div>
          
          <div 
            id="chat-scroll-container"
            className="flex-grow overflow-y-auto p-4 sm:p-6 flex flex-col gap-6 custom-scrollbar bg-white dark:bg-slate-900"
          >
             <div className="text-center my-6 relative">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-slate-50 dark:bg-slate-800 z-0"></div>
                <span className="relative z-10 text-[10px] font-black text-slate-400 uppercase tracking-tightest bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-4 py-1.5 rounded-md">
                  System Context: {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
             </div>
             
             {filteredMessages.length === 0 && (
               <div className="flex-grow flex flex-col items-center justify-center text-center p-12 animate-in fade-in duration-700">
                 <div className="w-20 h-20 rounded-[2rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 shadow-inner ring-4 ring-slate-100/50 dark:ring-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-600 animate-pulse" />
                 </div>
                 <h4 className="font-extrabold text-slate-900 dark:text-white text-lg mb-2 tracking-tight">The Origin</h4>
                 <p className="text-sm text-slate-400 max-w-[280px] leading-relaxed font-bold italic">
                   {searchQuery ? "No messages matching your search query were found in this systemic thread." : `Initialize systemic collaboration with ${activeChat}. Every byte shared here is secure.`}
                 </p>
               </div>
             )}
             
             {filteredMessages.map((msg, i) => {
                const sender = team.find(m => m.name === msg.name);
                return (
                  <div key={msg.id || i} className={cn("flex gap-3 sm:gap-4 max-w-[80%]", msg.isMe ? "self-end flex-row-reverse" : "self-start")}>
                    {!msg.isMe && (
                      <div className={cn("w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-[11px] font-black shadow-md transition-all hover:scale-110", sender?.color || 'bg-slate-400')}>
                          {sender?.avatar ? (
                            <img src={sender.avatar} alt={msg.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            sender?.initial || msg.name.charAt(0)
                          )}
                      </div>
                    )}
                    <div className={cn("flex flex-col gap-1.5", msg.isMe ? "items-end" : "items-start")}>
                        <div className="flex items-center gap-2.5 px-1.5">
                          {!msg.isMe && <span className="text-[11px] font-black uppercase text-slate-900 dark:text-white tracking-widest">{msg.name}</span>}
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter tabular-nums">{msg.time}</span>
                        </div>
                        <div className={cn(
                          "relative p-4 rounded-xl text-sm leading-relaxed shadow-sm transition-transform active:scale-[0.99] group",
                          msg.isMe 
                            ? "bg-[#3b82f6] text-white rounded-tr-sm border border-blue-400/50" 
                            : "bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/50 rounded-tl-sm backdrop-blur-sm"
                        )}>
                          {msg.body}
                          
                          {/* Message Actions - Subtle */}
                          <div className={cn(
                            "absolute -top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                            msg.isMe ? "right-2" : "left-2"
                          )}>
                             <button 
                               onClick={(e) => { e.stopPropagation(); toggleStarMessage(msg.id); }}
                               className={cn(
                                 "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-1 rounded-md shadow-sm transition-colors",
                                 msg.isStarred ? "text-yellow-500 hover:text-yellow-600" : "text-slate-400 hover:text-blue-500"
                               )}
                             >
                               <Star className="w-3 h-3" fill={msg.isStarred ? "currentColor" : "none"} />
                             </button>
                             <button 
                               onClick={(e) => { e.stopPropagation(); setMsgInput(`Replying to ${msg.name}: `); }}
                               className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-1 rounded-md text-slate-400 hover:text-green-500 shadow-sm transition-colors"
                             >
                               <MessageSquare className="w-3 h-3" />
                             </button>
                             <button 
                               onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }}
                               className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-1 rounded-md text-slate-400 hover:text-red-500 shadow-sm transition-colors"
                             >
                               <Trash2 className="w-3 h-3" />
                             </button>
                          </div>
                        </div>
                    </div>
                  </div>
                );
             })}
          </div>
          
          <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-30 flex-shrink-0">
             <div className="relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/50 rounded-xl px-2 focus-within:border-[#3b82f6/50] focus-within:ring-2 focus-within:ring-[#3b82f61a] transition-all shadow-inner">
                <button className="p-3 text-slate-400 hover:text-[#3b82f6] transition-colors flex-shrink-0">
                  <Plus className="w-4 h-4 font-black" />
                </button>
                <input 
                  type="text" 
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  placeholder={`Send systemic message to ${activeChat}...`}
                  className="flex-grow bg-transparent border-none focus:outline-none py-4 px-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 font-medium"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                />
                <button 
                  className={cn(
                    "w-8 h-8 rounded-lg transition-all flex-shrink-0 m-1 flex items-center justify-center shadow-lg",
                    msgInput.trim() ? "bg-[#3b82f6] text-white hover:bg-blue-600 hover:scale-105 active:scale-95" : "bg-slate-100 dark:bg-slate-800 text-slate-300 cursor-not-allowed"
                  )}
                  onClick={handleSend}
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
             </div>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center mt-3 opacity-50">Shift + Enter for new line • ArqonOS Encrypted Channel</p>
          </div>
       </div>

       {/* MODALS */}
       
       {/* Add Channel Modal */}
       <MessengerModal isOpen={isAddChannelOpen} title="Initialize New Channel" onClose={() => setIsAddChannelOpen(false)}>
          <div className="flex flex-col gap-4">
             <div>
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Channel Name</label>
               <input 
                 autoFocus
                 type="text" 
                 placeholder="e.g. # backend-sync"
                 className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white"
                 value={newChannelName}
                 onChange={(e) => setNewChannelName(e.target.value)}
               />
             </div>
             <button 
               onClick={() => {
                  if (newChannelName.trim()) {
                    addChannel(newChannelName.trim());
                    setIsAddChannelOpen(false);
                    setActiveChat(newChannelName.startsWith('#') ? newChannelName : `# ${newChannelName}`);
                  }
               }}
               className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-green-500/20 transition-all active:scale-[0.98]"
             >
               Create Channel
             </button>
          </div>
       </MessengerModal>

       {/* Rename Channel Modal */}
       <MessengerModal isOpen={isRenameOpen} title="Rename Collaborative Space" onClose={() => setIsRenameOpen(false)}>
          <div className="flex flex-col gap-4">
             <div>
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">New Identity</label>
               <input 
                 autoFocus
                 type="text" 
                 className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white"
                 value={renameValue}
                 onChange={(e) => setRenameValue(e.target.value)}
               />
             </div>
             <button 
               onClick={() => {
                  if (renameValue.trim() && activeChannel) {
                    renameChannel(activeChannel.id, renameValue.trim());
                    setActiveChat(renameValue.startsWith('#') ? renameValue : `# ${renameValue}`);
                    setIsRenameOpen(false);
                  }
               }}
               className="w-full py-3 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all"
             >
               Apply Changes
             </button>
          </div>
       </MessengerModal>

       {/* Add Member Modal */}
       <MessengerModal isOpen={isAddMemberOpen} title="Expand Collaboration" onClose={() => setIsAddMemberOpen(false)}>
          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Select Architect/Designer</p>
             {team.map(member => {
               const isMember = activeChannel?.members.includes(member.id);
               return (
                 <button 
                    key={member.id}
                    disabled={isMember}
                    onClick={() => {
                      if (activeChannel) addMemberToChannel(activeChannel.id, member.id);
                    }}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border transition-all",
                      isMember 
                        ? "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed" 
                        : "border-slate-100 dark:border-slate-700 hover:border-green-500/30 hover:bg-green-500/5 cursor-pointer"
                    )}
                 >
                   <div className="flex items-center gap-3">
                     <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black text-white shadow-sm", member.color)}>
                       {member.initial}
                     </div>
                     <div className="flex flex-col text-left">
                       <span className="text-xs font-bold text-slate-900 dark:text-white">{member.name}</span>
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{member.role}</span>
                     </div>
                   </div>
                   {isMember ? <Check className="w-4 h-4 text-green-500" /> : <Plus className="w-4 h-4 text-slate-300" />}
                 </button>
               );
             })}
          </div>
       </MessengerModal>
    </div>
  );
}

