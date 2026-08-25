import React, { useState } from 'react';
import { 
  CheckCircle2, Clock, Calendar as CalendarIcon, MessageSquare, 
  HelpCircle, Search, Bell, Plus, Filter, MoreVertical, LayoutGrid, List,
  CheckSquare, MoreHorizontal, User, Tag, ArrowRight, Circle, LayoutDashboard, 
  Send, Star, Hash, Trash2, Edit2, X, Menu, ChevronLeft, ChevronRight, UserPlus
} from 'lucide-react';
import { QuestContext, type Task, type QuestEvent, type Message, type Channel } from './QuestContext';
import { QuestTasks } from './QuestTasks';
import { QuestCalendar } from './QuestCalendar';
import { QuestMessenger } from './QuestMessenger';
import { QuestHelp } from './QuestHelp';
import { QuestOverview } from './QuestOverview';
import { TEAM_MEMBERS, type TeamMember } from '../../../../data/team';
import { cn } from '../../../../lib/utils';

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Approve vendor contract for Alpha', due: 'Today', priority: 'High', status: 'To Do', tags: ['Legal'], listId: 'My Tasks', done: false, project: 'Project Alpha', createdBy: { name: 'Sarah Connor', avatar: 44 } },
  { id: '2', title: 'Update Q3 roadmap', due: 'Tomorrow', priority: 'Medium', status: 'In Progress', tags: ['Strategy', 'Planning'], listId: 'My Tasks', done: false, project: 'Company Workspace', createdBy: { name: 'David Lee', avatar: 12 } },
  { id: '3', title: 'Onboard new UI designer', due: 'Next Week', priority: 'Low', status: 'To Do', tags: ['HR'], listId: 'My Tasks', done: false, project: 'Team Building', createdBy: { name: 'You' } },
  { id: '4', title: 'Review structural calculations', due: 'Today', priority: 'High', status: 'Review', tags: ['Engineering'], listId: 'Urgent', done: false, project: 'Nexa Skyline', createdBy: { name: 'David Lee', avatar: 12 } },
  { id: '5', title: 'Prepare board deck', due: 'Friday', priority: 'High', status: 'In Progress', tags: ['Leadership'], listId: 'My Tasks', done: false, project: 'Acme Corp', createdBy: { name: 'Sarah Connor', avatar: 44 } },
  { id: '6', title: 'Weekly sync with remote team', due: 'Today', priority: 'Medium', status: 'To Do', tags: ['Internal'], listId: 'Urgent', done: true, project: 'Internal Ops', createdBy: { name: 'You' } },
];

const INITIAL_EVENTS: QuestEvent[] = [
  { id: 'e1', title: 'Site Visit: Horizon', date: '2026-10-10', time: '10:00 AM', attendeeIds: ['m1', 'm2', 'm3'], type: 'Meeting', color: 'bg-orange-500', dayNum: 10 },
  { id: 'e2', title: 'Design Sync: UI/UX', date: '2026-10-15', time: '1:30 PM', attendeeIds: ['m2', 'm4'], type: 'Call', color: 'bg-blue-500', dayNum: 15 },
  { id: 'e3', title: 'Product Launch V2', date: '2026-10-22', time: '4:00 PM', attendeeIds: ['m1', 'm2', 'm3', 'm4', 'm5'], type: 'Launch', color: 'bg-green-500', dayNum: 22 },
];

const INITIAL_MESSAGES: Message[] = [
  { id: 'm1', chatId: '# design-system', name: 'Alex Rivera', time: '10:42 AM', body: 'Has anyone seen the updated structural drawings for the lobby?', avatar: 12 },
  { id: 'm2', chatId: '# design-system', name: 'Sarah Chen', time: '10:45 AM', body: 'Yes, they were uploaded to Studio yesterday. Let me fetch the link.', avatar: 44, unread: true },
  { id: 'm3', chatId: '# design-system', name: 'You', time: '10:48 AM', body: 'Awesome, thanks Sarah. Also ping me when the glass components are reviewed.', isMe: true },
  { id: 'm4', chatId: '# design-system', name: 'Sarah Chen', time: '10:50 AM', body: 'They look good to me! Merging now. 🚀', avatar: 44, unread: true },
  { id: 'm5', chatId: 'Sarah Chen', name: 'Sarah Chen', time: '9:00 AM', body: 'The updated blueprints are attached.', avatar: 44, unread: true },
];

const INITIAL_CHANNELS: Channel[] = [
  { id: 'c1', name: '# general', members: ['1', '2', '3', '4', '5'] },
  { id: 'c2', name: '# engineering', members: ['1', '5'] },
  { id: 'c3', name: '# design-system', members: ['1', '2'] },
  { id: 'c4', name: '# marketing', members: ['4'] },
];

interface QuestAppProps {
  activePage: string;
  onNavigate?: (page: string) => void;
  navigateToApp?: (appId: string, pageName: string) => void;
}

// -------------------------------------------------------------
// MAIN APP COMPONENT
// -------------------------------------------------------------
export function QuestApp({ activePage, onNavigate, navigateToApp }: QuestAppProps) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [events, setEvents] = useState<QuestEvent[]>(INITIAL_EVENTS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [team] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);

  const addTask = (task: Omit<Task, 'id'>) => setTasks(prev => [...prev, { ...task, id: Math.random().toString(36).substr(2, 9) }]);
  const toggleTask = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));
  
  const sendMessage = (chatId: string, text: string) => {
    const newMsg: Message = { id: Math.random().toString(36).substr(2, 9), chatId, name: 'You', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), body: text, isMe: true };
    setMessages(prev => [...prev, newMsg]);
  };

  const deleteMessage = (id: string) => setMessages(prev => prev.filter(m => m.id !== id));
  const toggleStarMessage = (id: string) => setMessages(prev => prev.map(m => m.id === id ? { ...m, isStarred: !m.isStarred } : m));
  
  const addEvent = (event: Omit<QuestEvent, 'id'>) => setEvents(prev => [...prev, { ...event, id: Math.random().toString(36).substr(2, 9) }]);
  const deleteEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));

  const addChannel = (name: string) => {
    const safeName = name.startsWith('#') ? name : `# ${name}`;
    setChannels(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), name: safeName, members: ['1'] }]); // Admin (1) joined by default
  };

  const renameChannel = (id: string, newName: string) => {
    const safeName = newName.startsWith('#') ? newName : `# ${newName}`;
    setChannels(prev => prev.map(c => c.id === id ? { ...c, name: safeName } : c));
  };

  const addMemberToChannel = (channelId: string, memberId: string) => {
    setChannels(prev => prev.map(c => {
      if (c.id === channelId && !c.members.includes(memberId)) {
        return { ...c, members: [...c.members, memberId] };
      }
      return c;
    }));
  };

  const goToPage = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const contextValue = { 
    tasks, setTasks, events, setEvents, messages, setMessages, team, channels, setChannels,
    addTask, toggleTask, deleteTask, sendMessage, deleteMessage, toggleStarMessage, addEvent, deleteEvent, addChannel, renameChannel, addMemberToChannel, goToPage 
  };

  const renderContent = () => {
    switch (activePage.toLowerCase()) {
      case 'tasks':
      case 'task page':
        return <QuestTasks />;
      case 'calendar':
      case 'calendar page':
        return <QuestCalendar />;
      case 'messenger':
      case 'messenger page':
        return <QuestMessenger />;
      case 'help':
        return <QuestHelp />;
      case 'overview':
      default:
        return <QuestOverview />;
    }
  };

  return (
    <QuestContext.Provider value={contextValue}>
      <div className="flex flex-col w-full transition-colors relative text-left">
         {renderContent()}
      </div>
    </QuestContext.Provider>
  );
}
