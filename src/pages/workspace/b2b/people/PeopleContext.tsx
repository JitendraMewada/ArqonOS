import React, { createContext, useContext } from 'react';
import type { TeamMember } from '../../../../data/team';

export type Role = {
  id: string;
  name: string;
  department: string;
  description: string;
  permissions: string[];
  userCount: number;
  icon: any;
  color: string;
  bg: string;
};

export interface PeopleContextType {
  members: TeamMember[];
  roles: Role[];
  departments: string[];
  addMember: (member: Omit<TeamMember, 'id' | 'initial' | 'color'>) => void;
  updateMember: (id: string, member: Partial<TeamMember>) => void;
  deleteMember: (id: string) => void;
  addRole: (role: Omit<Role, 'id' | 'userCount'>) => void;
  updateRole: (id: string, role: Partial<Omit<Role, 'id' | 'userCount'>>) => void;
  addDepartment: (department: string) => void;
}

export const PeopleContext = createContext<PeopleContextType | undefined>(undefined);

export function usePeople() {
  const context = useContext(PeopleContext);
  if (!context) throw new Error('usePeople must be used within a PeopleApp');
  return context;
}
