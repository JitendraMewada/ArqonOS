import React, { createContext, useContext, useState } from 'react';
import { TEAM_MEMBERS, type TeamMember } from '../../../../data/team';

export type Task = { 
  id: string; 
  title: string; 
  due: string; 
  priority: string; 
  status: string; 
  tags: string[]; 
  listId: string; 
  done: boolean; 
  project?: string; 
  assignTo?: string; 
  assigneeId?: string;
  note?: string; 
  createdBy?: { name: string; avatar?: number };
};
export type QuestEvent = { id: string; title: string; date: string; time: string; attendeeIds: string[]; type: string; color: string; dayNum?: number; };
export type Message = { id: string; name: string; time: string; body: string; avatar?: number; isMe?: boolean; unread?: boolean; chatId: string; isStarred?: boolean; };

export type Channel = {
  id: string;
  name: string;
  members: string[]; // member IDs
};

export interface QuestContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  events: QuestEvent[];
  setEvents: React.Dispatch<React.SetStateAction<QuestEvent[]>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  team: TeamMember[];
  channels: Channel[];
  setChannels: React.Dispatch<React.SetStateAction<Channel[]>>;
  
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  sendMessage: (chatId: string, text: string) => void;
  deleteMessage: (id: string) => void;
  toggleStarMessage: (id: string) => void;
  addEvent: (event: Omit<QuestEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;
  addChannel: (name: string) => void;
  renameChannel: (id: string, newName: string) => void;
  addMemberToChannel: (channelId: string, memberId: string) => void;
  goToPage: (page: string) => void;
}

export const QuestContext = createContext<QuestContextType | null>(null);

export const useQuest = () => {
  const ctx = useContext(QuestContext);
  if (!ctx) throw new Error("useQuest must be used within QuestApp Context");
  return ctx;
};
