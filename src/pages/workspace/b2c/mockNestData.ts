import { 
  NestGroup, 
  NestMember, 
  NestTransaction, 
  NestBudget, 
  NestSavingsGoal, 
  NestVault, 
  NestRecurringRule,
  NestReminderItem,
  NestReconciliationRecord,
  NestMemberNudge
} from './types';

export const INITIAL_NEST_GROUP: NestGroup = {
  id: 'grp_mewada_family',
  name: 'Mewada Family Circle',
  type: 'Family',
  avatar: '🏡',
  plan: 'nest_plus',
  totalMembersCount: 4,
  currency: '₹',
  createdAt: '2025-01-15',
  monthlyIncome: 185000,
  monthlyBudget: 95000,
  currentMonthSpend: 58450
};

export const INITIAL_NEST_MEMBERS: NestMember[] = [
  {
    id: 'mem_1',
    name: 'Jitendra Mewada',
    email: 'jitendramewadaa@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Admin',
    joinedDate: 'Jan 2025',
    phone: '+91 98765 43210',
    contributionPercent: 55,
    monthlyAllowance: 25000,
    allowanceDisbursedThisMonth: 25000,
    allowanceScheduleDay: 1,
    isCurrentUser: true
  },
  {
    id: 'mem_2',
    name: 'Pooja Mewada',
    email: 'pooja.m@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    role: 'Admin',
    joinedDate: 'Jan 2025',
    phone: '+91 98765 43211',
    contributionPercent: 45,
    monthlyAllowance: 25000,
    allowanceDisbursedThisMonth: 25000,
    allowanceScheduleDay: 1
  },
  {
    id: 'mem_3',
    name: 'Aarav Mewada',
    email: 'aarav.m@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    joinedDate: 'Feb 2025',
    monthlyAllowance: 8000,
    allowanceDisbursedThisMonth: 8000,
    allowanceScheduleDay: 1
  },
  {
    id: 'mem_4',
    name: 'Ananya Mewada',
    email: 'ananya.m@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    joinedDate: 'Mar 2025',
    monthlyAllowance: 5000,
    allowanceDisbursedThisMonth: 5000,
    allowanceScheduleDay: 1
  }
];

export const INITIAL_NEST_RECURRING_RULES: NestRecurringRule[] = [
  {
    id: 'rec_1',
    title: 'Consulting Retainer & Salary Direct Deposit',
    amount: 110000,
    type: 'income',
    category: 'Income & Allowance',
    frequency: 'monthly',
    dayOfMonth: 1,
    nextDueDate: '2026-09-01',
    paidByMemberId: 'mem_1',
    paidByMemberName: 'Jitendra Mewada',
    isActive: true,
    autoProcess: true,
    lastExecutedDate: '2026-08-01',
    notes: 'Monthly corporate consulting fixed retainer'
  },
  {
    id: 'rec_2',
    title: 'Design Consultancy Retainer',
    amount: 75000,
    type: 'income',
    category: 'Income & Allowance',
    frequency: 'monthly',
    dayOfMonth: 5,
    nextDueDate: '2026-09-05',
    paidByMemberId: 'mem_2',
    paidByMemberName: 'Pooja Mewada',
    isActive: true,
    autoProcess: true,
    lastExecutedDate: '2026-08-05',
    notes: 'Monthly design client recurring fee'
  },
  {
    id: 'rec_3',
    title: 'Apartment Maintenance & Gated Society Dues',
    amount: 12500,
    type: 'expense',
    category: 'Rent & Utilities',
    frequency: 'monthly',
    dayOfMonth: 5,
    nextDueDate: '2026-09-05',
    paidByMemberId: 'mem_2',
    paidByMemberName: 'Pooja Mewada',
    splitWithMemberIds: ['mem_1', 'mem_2'],
    splitType: 'equal',
    isActive: true,
    autoProcess: true,
    lastExecutedDate: '2026-08-05',
    notes: 'Auto-debited society maintenance'
  },
  {
    id: 'rec_4',
    title: 'Airtel Gigabit Fiber & Cloud Subscriptions',
    amount: 2999,
    type: 'expense',
    category: 'Rent & Utilities',
    frequency: 'monthly',
    dayOfMonth: 10,
    nextDueDate: '2026-09-10',
    paidByMemberId: 'mem_1',
    paidByMemberName: 'Jitendra Mewada',
    splitWithMemberIds: ['mem_1', 'mem_2', 'mem_3', 'mem_4'],
    splitType: 'equal',
    isActive: true,
    autoProcess: true,
    lastExecutedDate: '2026-08-10',
    notes: 'High speed family wifi + OTT pack'
  },
  {
    id: 'rec_5',
    title: 'Auto-Deposit to Shimla Vacation Fund',
    amount: 10000,
    type: 'savings_goal',
    category: 'Vacation & Travel',
    frequency: 'monthly',
    dayOfMonth: 15,
    nextDueDate: '2026-09-15',
    paidByMemberId: 'mem_1',
    paidByMemberName: 'Jitendra Mewada',
    targetId: 's_1',
    targetName: 'Shimla & Manali Winter Vacation ❄️',
    isActive: true,
    autoProcess: true,
    lastExecutedDate: '2026-08-15',
    notes: 'Automated recurring vacation contribution'
  },
  {
    id: 'rec_6',
    title: 'Standing Allocation to Education Vault',
    amount: 5000,
    type: 'vault_transfer',
    category: 'Shared Vaults',
    frequency: 'monthly',
    dayOfMonth: 1,
    nextDueDate: '2026-09-01',
    paidByMemberId: 'mem_2',
    paidByMemberName: 'Pooja Mewada',
    targetId: 'v_3',
    targetName: 'Education & Courses Vault',
    isActive: true,
    autoProcess: true,
    lastExecutedDate: '2026-08-01',
    notes: 'Monthly allocation for kids enrichment'
  },
  {
    id: 'rec_7',
    title: 'Monthly Pocket Allowance (Aarav)',
    amount: 8000,
    type: 'allowance',
    category: 'Income & Allowance',
    frequency: 'monthly',
    dayOfMonth: 1,
    nextDueDate: '2026-09-01',
    paidByMemberId: 'mem_1',
    paidByMemberName: 'Jitendra Mewada',
    targetId: 'mem_3',
    targetName: 'Aarav Mewada',
    isActive: true,
    autoProcess: true,
    lastExecutedDate: '2026-08-01',
    notes: 'Monthly discretionary allowance'
  }
];

export const INITIAL_NEST_BUDGETS: NestBudget[] = [
  {
    id: 'b_1',
    category: 'Groceries',
    monthlyLimit: 22000,
    currentSpent: 16400,
    color: '#22c55e',
    iconName: 'ShoppingBag',
    alertThreshold: 85
  },
  {
    id: 'b_2',
    category: 'Rent & Utilities',
    monthlyLimit: 32000,
    currentSpent: 32000,
    color: '#3b82f6',
    iconName: 'Home',
    alertThreshold: 90
  },
  {
    id: 'b_3',
    category: 'Dining & Food',
    monthlyLimit: 12000,
    currentSpent: 8650,
    color: '#f59e0b',
    iconName: 'Utensils',
    alertThreshold: 80
  },
  {
    id: 'b_4',
    category: 'Entertainment',
    monthlyLimit: 6000,
    currentSpent: 4200,
    color: '#ec4899',
    iconName: 'Film',
    alertThreshold: 75
  },
  {
    id: 'b_5',
    category: 'Healthcare',
    monthlyLimit: 8000,
    currentSpent: 2100,
    color: '#06b6d4',
    iconName: 'HeartPulse',
    alertThreshold: 80
  },
  {
    id: 'b_6',
    category: 'Education',
    monthlyLimit: 15000,
    currentSpent: 15000,
    color: '#8b5cf6',
    iconName: 'GraduationCap',
    alertThreshold: 95
  }
];

export const INITIAL_NEST_TRANSACTIONS: NestTransaction[] = [
  {
    id: 'tx_1',
    title: 'Monthly Nature Basket Organic Grocery',
    amount: -4850,
    type: 'expense',
    category: 'Groceries',
    date: '2026-08-30',
    paidByMemberId: 'mem_1',
    paidByMemberName: 'Jitendra Mewada',
    splitWithMemberIds: ['mem_1', 'mem_2', 'mem_3', 'mem_4'],
    splitType: 'equal',
    status: 'settled',
    notes: 'Monthly staples and organic vegetables'
  },
  {
    id: 'tx_2',
    title: 'Apartment Maintenance & Electricity',
    amount: -12500,
    type: 'expense',
    category: 'Rent & Utilities',
    date: '2026-08-28',
    paidByMemberId: 'mem_2',
    paidByMemberName: 'Pooja Mewada',
    splitWithMemberIds: ['mem_1', 'mem_2'],
    splitType: 'equal',
    status: 'settled',
    recurringRuleId: 'rec_3',
    isRecurringGenerated: true
  },
  {
    id: 'tx_3',
    title: 'Consulting Retainer & Salary Credit',
    amount: 110000,
    type: 'income',
    category: 'Income & Allowance',
    date: '2026-08-27',
    paidByMemberId: 'mem_1',
    paidByMemberName: 'Jitendra Mewada',
    splitWithMemberIds: ['mem_1'],
    splitType: 'equal',
    status: 'settled',
    recurringRuleId: 'rec_1',
    isRecurringGenerated: true
  },
  {
    id: 'tx_4',
    title: 'Family Dinner at Olive Bistro',
    amount: -3650,
    type: 'expense',
    category: 'Dining & Food',
    date: '2026-08-25',
    paidByMemberId: 'mem_1',
    paidByMemberName: 'Jitendra Mewada',
    splitWithMemberIds: ['mem_1', 'mem_2', 'mem_3', 'mem_4'],
    splitType: 'equal',
    status: 'settled'
  },
  {
    id: 'tx_5',
    title: 'High-speed Fiber Broadband Quarterly',
    amount: -2999,
    type: 'expense',
    category: 'Rent & Utilities',
    date: '2026-08-22',
    paidByMemberId: 'mem_2',
    paidByMemberName: 'Pooja Mewada',
    splitWithMemberIds: ['mem_1', 'mem_2'],
    splitType: 'equal',
    status: 'settled',
    recurringRuleId: 'rec_4',
    isRecurringGenerated: true
  },
  {
    id: 'tx_6',
    title: 'Kids STEM Robotics Kit & Books',
    amount: -4500,
    type: 'expense',
    category: 'Education',
    date: '2026-08-18',
    paidByMemberId: 'mem_2',
    paidByMemberName: 'Pooja Mewada',
    splitWithMemberIds: ['mem_1', 'mem_2'],
    splitType: 'equal',
    status: 'settled'
  },
  {
    id: 'tx_7',
    title: 'Auto Contribution to Shimla Vacation Vault',
    amount: -10000,
    type: 'transfer',
    category: 'Shared Vaults',
    date: '2026-08-15',
    paidByMemberId: 'mem_1',
    paidByMemberName: 'Jitendra Mewada',
    splitWithMemberIds: ['mem_1', 'mem_2'],
    splitType: 'equal',
    vaultId: 'v_1',
    status: 'settled',
    recurringRuleId: 'rec_5',
    isRecurringGenerated: true
  },
  {
    id: 'tx_8',
    title: 'Design Consultancy Studio Income',
    amount: 75000,
    type: 'income',
    category: 'Income & Allowance',
    date: '2026-08-10',
    paidByMemberId: 'mem_2',
    paidByMemberName: 'Pooja Mewada',
    splitWithMemberIds: ['mem_2'],
    splitType: 'equal',
    status: 'settled',
    recurringRuleId: 'rec_2',
    isRecurringGenerated: true
  },
  {
    id: 'tx_9',
    title: 'Weekend Cinema IMAX Tickets & Snacks',
    amount: -2100,
    type: 'expense',
    category: 'Entertainment',
    date: '2026-08-08',
    paidByMemberId: 'mem_3',
    paidByMemberName: 'Aarav Mewada',
    splitWithMemberIds: ['mem_1', 'mem_2', 'mem_3', 'mem_4'],
    splitType: 'equal',
    status: 'settled'
  },
  {
    id: 'tx_10',
    title: 'Annual Family Health Checkup & Dental',
    amount: -5400,
    type: 'expense',
    category: 'Healthcare',
    date: '2026-08-03',
    paidByMemberId: 'mem_1',
    paidByMemberName: 'Jitendra Mewada',
    splitWithMemberIds: ['mem_1', 'mem_2', 'mem_3', 'mem_4'],
    splitType: 'equal',
    status: 'settled'
  }
];

export const INITIAL_NEST_SAVINGS: NestSavingsGoal[] = [
  {
    id: 's_1',
    title: 'Shimla & Manali Winter Vacation ❄️',
    targetAmount: 150000,
    currentAmount: 95000,
    deadline: 'Dec 2026',
    category: 'Vacation',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=500&auto=format&fit=crop&q=80',
    color: '#22c55e',
    monthlyAutoDeposit: 10000,
    recurringActive: true,
    contributors: [
      { memberId: 'mem_1', amount: 55000 },
      { memberId: 'mem_2', amount: 40000 }
    ]
  },
  {
    id: 's_2',
    title: 'Family Emergency Liquid Reserve 🛡️',
    targetAmount: 500000,
    currentAmount: 380000,
    deadline: 'Ongoing',
    category: 'Safety Net',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500&auto=format&fit=crop&q=80',
    color: '#3b82f6',
    monthlyAutoDeposit: 15000,
    recurringActive: true,
    contributors: [
      { memberId: 'mem_1', amount: 210000 },
      { memberId: 'mem_2', amount: 170000 }
    ]
  },
  {
    id: 's_3',
    title: 'Next-Gen EV Upgrade Fund 🚗',
    targetAmount: 800000,
    currentAmount: 325000,
    deadline: 'March 2027',
    category: 'Asset',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&auto=format&fit=crop&q=80',
    color: '#8b5cf6',
    monthlyAutoDeposit: 20000,
    recurringActive: false,
    contributors: [
      { memberId: 'mem_1', amount: 200000 },
      { memberId: 'mem_2', amount: 125000 }
    ]
  }
];

export const INITIAL_NEST_VAULTS: NestVault[] = [
  {
    id: 'v_1',
    name: 'Vacation & Travel Pot',
    balance: 95000,
    targetBalance: 150000,
    purpose: 'Locked fund for family holidays and travel tickets',
    color: '#22c55e',
    monthlyAutoDeposit: 10000,
    autoDepositActive: true,
    autoDepositScheduleDay: 5,
    monthlyAutoAllocation: 10000,
    recurringActive: true,
    members: ['mem_1', 'mem_2']
  },
  {
    id: 'v_2',
    name: 'Home Renovation & Decor',
    balance: 65000,
    targetBalance: 120000,
    purpose: 'Interior upgrades, seasonal decor and smart home gear',
    color: '#f59e0b',
    monthlyAutoDeposit: 5000,
    autoDepositActive: true,
    autoDepositScheduleDay: 10,
    monthlyAutoAllocation: 5000,
    recurringActive: true,
    members: ['mem_1', 'mem_2']
  },
  {
    id: 'v_3',
    name: 'Education & Courses Vault',
    balance: 42000,
    targetBalance: 100000,
    purpose: 'Tuition, technical workshops, books & kids extracurriculars',
    color: '#3b82f6',
    monthlyAutoDeposit: 5000,
    autoDepositActive: false,
    autoDepositScheduleDay: 1,
    monthlyAutoAllocation: 5000,
    recurringActive: true,
    members: ['mem_1', 'mem_2', 'mem_3', 'mem_4']
  }
];

export const INITIAL_NEST_REMINDERS: NestReminderItem[] = [
  {
    id: 'rem_1',
    title: 'Consulting Retainer & Salary Direct Deposit',
    description: 'Monthly corporate consulting fixed retainer direct credited to bank account.',
    amount: 110000,
    type: 'income_due',
    category: 'Income & Allowance',
    dueDate: '2026-09-01',
    status: 'pending',
    priority: 'urgent',
    assignedMemberId: 'mem_1',
    assignedMemberName: 'Jitendra Mewada',
    relatedRuleId: 'rec_1',
    isAutoGenerated: true,
    tags: ['Salary', 'Primary Inflow', 'Retainer']
  },
  {
    id: 'rem_2',
    title: 'Apartment Maintenance & Gated Society Dues',
    description: 'Monthly maintenance fee for 4BHK community clubhouse and security.',
    amount: 12500,
    type: 'expense_bill',
    category: 'Rent & Utilities',
    dueDate: '2026-09-05',
    status: 'pending',
    priority: 'high',
    assignedMemberId: 'mem_2',
    assignedMemberName: 'Pooja Mewada',
    relatedRuleId: 'rec_3',
    isAutoGenerated: true,
    tags: ['Society', 'Utilities', 'Maintenance']
  },
  {
    id: 'rem_3',
    title: 'Airtel Gigabit Fiber & Cloud Entertainment Pack',
    description: 'High-speed 1Gbps family broadband + OTT subscription bundle invoice.',
    amount: 2999,
    type: 'expense_bill',
    category: 'Rent & Utilities',
    dueDate: '2026-09-10',
    status: 'pending',
    priority: 'medium',
    assignedMemberId: 'mem_1',
    assignedMemberName: 'Jitendra Mewada',
    relatedRuleId: 'rec_4',
    isAutoGenerated: true,
    tags: ['Broadband', 'Wifi', 'Streaming']
  },
  {
    id: 'rem_4',
    title: 'Shimla & Manali Vacation Fund Milestone Contribution',
    description: 'Auto-transfer into winter vacation target pot to reach 50% milestone.',
    amount: 10000,
    type: 'savings_deposit',
    category: 'Vacation & Travel',
    dueDate: '2026-09-15',
    status: 'pending',
    priority: 'medium',
    assignedMemberId: 'mem_1',
    assignedMemberName: 'Jitendra Mewada',
    relatedGoalId: 's_1',
    relatedRuleId: 'rec_5',
    isAutoGenerated: true,
    tags: ['Travel Fund', 'Savings Goal', 'Milestone']
  },
  {
    id: 'rem_5',
    title: 'Family Education & Courses Vault Allocation',
    description: 'Standing monthly allocation for kids extracurricular and enrichment courses.',
    amount: 5000,
    type: 'vault_allocation',
    category: 'Shared Vaults',
    dueDate: '2026-09-01',
    status: 'pending',
    priority: 'medium',
    assignedMemberId: 'mem_2',
    assignedMemberName: 'Pooja Mewada',
    relatedVaultId: 'v_3',
    relatedRuleId: 'rec_6',
    isAutoGenerated: true,
    tags: ['Education', 'Vault', 'Kids']
  },
  {
    id: 'rem_6',
    title: 'Disburse Monthly Pocket Allowances (Aarav & Ananya)',
    description: 'Monthly discretionary pocket money transfer for Aarav (₹8,000) and Ananya (₹5,000).',
    amount: 13000,
    type: 'allowance_disbursement',
    category: 'Income & Allowance',
    dueDate: '2026-09-01',
    status: 'pending',
    priority: 'high',
    assignedMemberId: 'mem_1',
    assignedMemberName: 'Jitendra Mewada',
    isAutoGenerated: true,
    tags: ['Allowance', 'Kids', 'Monthly']
  },
  {
    id: 'rem_7',
    title: 'Budget Alert: Rent & Utilities at 100% of Monthly Cap',
    description: 'Rent & Utilities category has reached its ₹32,000 limit. Review upcoming bills.',
    amount: 32000,
    type: 'budget_alert',
    category: 'Rent & Utilities',
    dueDate: '2026-09-02',
    status: 'pending',
    priority: 'urgent',
    relatedBudgetId: 'b_2',
    isAutoGenerated: true,
    tags: ['Threshold', 'Over-Budget', 'Review']
  },
  {
    id: 'rem_8',
    title: 'Verify HDFC Credit Card Statement & Schedule Settlement',
    description: 'Cross-check monthly dining and utility transactions before due date on the 12th.',
    type: 'custom_task',
    dueDate: '2026-09-08',
    status: 'pending',
    priority: 'medium',
    assignedMemberId: 'mem_1',
    assignedMemberName: 'Jitendra Mewada',
    tags: ['Checklist', 'Credit Card', 'Verification']
  },
  {
    id: 'rem_9',
    title: 'Submit Medical Dental Health Insurance Claim Form',
    description: 'Upload receipt and prescription for dental checkup reimbursement to insurer portal.',
    type: 'custom_task',
    dueDate: '2026-09-06',
    status: 'pending',
    priority: 'low',
    assignedMemberId: 'mem_2',
    assignedMemberName: 'Pooja Mewada',
    tags: ['Insurance', 'Claim', 'Health']
  },
  {
    id: 'rem_10',
    title: 'Audited & Reconciled August Groceries Bill',
    description: 'Checked weekly receipts and updated split shares with family members.',
    type: 'custom_task',
    dueDate: '2026-08-31',
    status: 'completed',
    priority: 'low',
    assignedMemberId: 'mem_1',
    assignedMemberName: 'Jitendra Mewada',
    completedAt: '2026-08-31',
    tags: ['Completed', 'Reconciled']
  }
];

export const INITIAL_RECONCILIATION_HISTORY: NestReconciliationRecord[] = [
  {
    id: 'rec_audit_1',
    date: '2026-08-31T20:30:00Z',
    ledgerBalance: 124500,
    actualBankBalance: 124500,
    discrepancy: 0,
    reconciledByMemberId: 'mem_1',
    reconciledByMemberName: 'Jitendra Mewada',
    status: 'matched',
    notes: 'End of August monthly audit. All bank statements and UPI payments matched ledger 100%.'
  },
  {
    id: 'rec_audit_2',
    date: '2026-07-31T18:15:00Z',
    ledgerBalance: 118200,
    actualBankBalance: 114700,
    discrepancy: -3500,
    reconciledByMemberId: 'mem_1',
    reconciledByMemberName: 'Jitendra Mewada',
    status: 'adjusted',
    notes: 'Discrepancy of ₹3,500 identified for unlogged cash vegetable purchases and laundry service.',
    adjustmentTransactionId: 'tx_adj_july'
  }
];

export const INITIAL_MEMBER_NUDGES: NestMemberNudge[] = [
  {
    id: 'nudge_1',
    targetMemberId: 'mem_3',
    targetMemberName: 'Aarav Mewada',
    senderMemberName: 'Jitendra Mewada',
    message: 'Hey Aarav, please log your college book and stationery expenses before weekend reconciliation!',
    timestamp: '2026-09-01T14:30:00Z',
    type: 'reminder_to_log',
    isAcknowledged: false
  },
  {
    id: 'nudge_2',
    targetMemberId: 'mem_4',
    targetMemberName: 'Ananya Mewada',
    senderMemberName: 'Pooja Mewada',
    message: 'Hi Ananya, remember to log your dance academy dress purchase receipt in the app.',
    timestamp: '2026-08-30T10:00:00Z',
    type: 'reminder_to_log',
    isAcknowledged: true
  }
];

