export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Deactive' | 'Invite Pending';
  email: string;
  phone: string;
  initial: string;
  color: string;
  avatar?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  { 
    id: '1', 
    name: 'Marcus Aurelius', 
    role: 'General Manager', 
    department: 'Management', 
    status: 'Active', 
    email: 'marcus@arqon.os', 
    phone: '+91 98765 43201', 
    initial: 'MA', 
    color: 'bg-indigo-500',
    avatar: 'https://i.pravatar.cc/150?u=marcus'
  },
  { 
    id: '2', 
    name: 'Elena Rostova', 
    role: 'Lead Designer', 
    department: 'Design', 
    status: 'Active', 
    email: 'elena@arqon.os', 
    phone: '+91 98765 43202', 
    initial: 'ER', 
    color: 'bg-purple-500',
    avatar: 'https://i.pravatar.cc/150?u=elena'
  },
  { 
    id: '3', 
    name: 'Julian Assange', 
    role: 'Sales', 
    department: 'Sales', 
    status: 'Active', 
    email: 'julian@arqon.os', 
    phone: '+91 98765 43203', 
    initial: 'JA', 
    color: 'bg-blue-500',
    avatar: 'https://i.pravatar.cc/150?u=julian'
  },
  { 
    id: '3_1', 
    name: 'Chloe Price', 
    role: 'Front Desk', 
    department: 'Sales', 
    status: 'Active', 
    email: 'chloe@arqon.os', 
    phone: '+91 98765 43209', 
    initial: 'CP', 
    color: 'bg-cyan-500',
    avatar: 'https://i.pravatar.cc/150?u=chloe'
  },
  { 
    id: '4', 
    name: 'Sarah Connor', 
    role: 'Site Manager', 
    department: 'Execution', 
    status: 'On Leave', 
    email: 'sarah@arqon.os', 
    phone: '+91 98765 43204', 
    initial: 'SC', 
    color: 'bg-orange-500',
    avatar: 'https://i.pravatar.cc/150?u=sarah'
  },
  { 
    id: '4_1', 
    name: 'John Smith', 
    role: 'Designer', 
    department: 'Design', 
    status: 'Active', 
    email: 'john@arqon.os', 
    phone: '+91 98765 43210', 
    initial: 'JS', 
    color: 'bg-purple-600',
    avatar: 'https://i.pravatar.cc/150?u=john'
  },
  { 
    id: '4_2', 
    name: 'Emily Wong', 
    role: 'Draftsman', 
    department: 'Design', 
    status: 'Active', 
    email: 'emily@arqon.os', 
    phone: '+91 98765 43211', 
    initial: 'EW', 
    color: 'bg-pink-600',
    avatar: 'https://i.pravatar.cc/150?u=emily'
  },
  { 
    id: '4_3', 
    name: 'Victor Vance', 
    role: '3D Designer', 
    department: 'Design', 
    status: 'Active', 
    email: 'victor@arqon.os', 
    phone: '+91 98765 43212', 
    initial: 'VV', 
    color: 'bg-violet-500',
    avatar: 'https://i.pravatar.cc/150?u=victor'
  },
  { 
    id: '5', 
    name: 'Michael Beck', 
    role: 'Estimator', 
    department: 'Finance', 
    status: 'Active', 
    email: 'michael@arqon.os', 
    phone: '+91 98765 43205', 
    initial: 'MB', 
    color: 'bg-emerald-500',
    avatar: 'https://i.pravatar.cc/150?u=mb'
  },
  { 
    id: '5_1', 
    name: 'Rachel Zane', 
    role: 'Purchase', 
    department: 'Finance', 
    status: 'Active', 
    email: 'rachel@arqon.os', 
    phone: '+91 98765 43214', 
    initial: 'RZ', 
    color: 'bg-teal-500',
    avatar: 'https://i.pravatar.cc/150?u=rachel'
  },
  { 
    id: '5_2', 
    name: 'Louis Litt', 
    role: 'Account', 
    department: 'Finance', 
    status: 'Active', 
    email: 'louis@arqon.os', 
    phone: '+91 98765 43215', 
    initial: 'LL', 
    color: 'bg-green-600',
    avatar: 'https://i.pravatar.cc/150?u=louis'
  },
  { 
    id: '6', 
    name: 'Priya Sharma', 
    role: 'HR', 
    department: 'HR', 
    status: 'Active', 
    email: 'priya@arqon.os', 
    phone: '+91 98765 43206', 
    initial: 'PS', 
    color: 'bg-pink-500',
    avatar: 'https://i.pravatar.cc/150?u=priya'
  },
  { 
    id: '7', 
    name: 'David Builder', 
    role: 'Vendor', 
    department: 'External', 
    status: 'Active', 
    email: 'david@buildmat.com', 
    phone: '+91 98765 43207', 
    initial: 'DB', 
    color: 'bg-slate-500',
  },
  { 
    id: '7_1', 
    name: 'Tony Stark', 
    role: 'Client', 
    department: 'External', 
    status: 'Active', 
    email: 'tony@stark.com', 
    phone: '+91 98765 43216', 
    initial: 'TS', 
    color: 'bg-slate-600',
  },
  { 
    id: '8', 
    name: 'James Wilson', 
    role: 'Coordinator', 
    department: 'Execution', 
    status: 'Active', 
    email: 'james@arqon.os', 
    phone: '+91 98765 43208', 
    initial: 'JW', 
    color: 'bg-orange-600',
    avatar: 'https://i.pravatar.cc/150?u=james'
  },
  { 
    id: '8_1', 
    name: 'Bob the Builder', 
    role: 'Site Supervisor', 
    department: 'Execution', 
    status: 'Active', 
    email: 'bob@arqon.os', 
    phone: '+91 98765 43217', 
    initial: 'BB', 
    color: 'bg-yellow-600',
    avatar: 'https://i.pravatar.cc/150?u=bob'
  },
  { 
    id: '17', 
    name: 'Neo Matrix', 
    role: 'Custom Role', 
    department: 'System', 
    status: 'Active', 
    email: 'neo@arqon.os', 
    phone: '+91 98765 00000', 
    initial: 'NM', 
    color: 'bg-black',
    avatar: 'https://i.pravatar.cc/150?u=neo'
  },
  { 
    id: '9_1', 
    name: 'Ada Lovelace', 
    role: 'Site Manager', 
    department: 'Execution', 
    status: 'Active', 
    email: 'ada@arqon.os', 
    phone: '+91 98765 43218', 
    initial: 'AL', 
    color: 'bg-orange-400',
    avatar: 'https://i.pravatar.cc/150?u=ada'
  }
];
