export const PRICING_CONFIG = {
  BASE_PLAN: {
    name: 'Base Plan',
    price: 699,
    includedUsers: 5,
    extraUserPrice: 59,
    includes: ['People (Team, Roles, Permissions)', 'Quest (Tasks, Chat, Calendar)', 'Flow (Lite Workflows)'],
    limits: {
      workflows: 5,
      automation: 'Limited',
      analytics: 'No advanced'
    }
  },
  ADD_ONS: [
    {
      id: 'connect',
      name: 'Connect',
      layer: 'CRM Layer',
      price: 599,
      extraUserTier: 79,
      color: '#3b82f6',
      icon: 'MessageSquare'
    },
    {
      id: 'studio',
      name: 'Studio',
      layer: 'Design Layer',
      price: 899,
      extraUserTier: 99,
      color: '#f97316',
      icon: 'Palette'
    },
    {
      id: 'cost_vendor',
      name: 'Cost + Vendor',
      layer: 'Operations Layer',
      price: 1099,
      extraUserTier: 129,
      color: '#94a3b8',
      icon: 'CreditCard'
    },
    {
      id: 'insight',
      name: 'Insight',
      layer: 'Analytics Layer',
      price: 899,
      extraUserTier: 159,
      color: '#94a3b8',
      icon: 'BarChart3'
    },
    {
      id: 'ai',
      name: 'AI',
      layer: 'Automation Layer',
      price: 1199,
      extraUserTier: 199,
      color: '#A0D6B4',
      icon: 'Zap'
    }
  ],
  NEST_PLANS: [
    { 
      id: 'nest_starter', 
      name: 'Starter', 
      price: 99, 
      includes: ['Shared group workspace', 'Income & expense tracking', 'Basic dashboard', 'Roles (Admin + Member)'], 
      limits: ['Basic insights only', 'Limited history', 'No advanced analytics'], 
      positioning: 'Start tracking expenses with your group.' 
    },
    { 
      id: 'nest_plus', 
      name: 'Plus ⭐', 
      price: 249, 
      includes: ['Everything in Starter', 'Advanced tracking', 'Categories & insights', 'Charts & trends'], 
      positioning: 'Understand and manage your group spending.' 
    },
    { 
      id: 'nest_pro', 
      name: 'Pro', 
      price: 449, 
      includes: ['Everything in Plus', 'Advanced analytics', 'Export & backup'], 
      positioning: 'Complete control over your group finances.' 
    }
  ]
};
