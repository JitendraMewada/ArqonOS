import { PRICING_CONFIG } from '../constants/pricing';

export interface SubscriptionValidationDates {
  startDate: Date;
  endDate: Date;
  startFormatted: string;
  endFormatted: string;
  cycleFormatted: string;
  daysRemaining: number;
  status: 'active' | 'expiring_soon' | 'expired';
}

/**
 * Calculates current monthly billing validation dates for an account.
 * Follows a standard 30-day/1-month recurring billing cycle.
 */
export function getSubscriptionValidationDates(
  createdAt?: string,
  storedValidUntil?: string,
  storedCycleStart?: string
): SubscriptionValidationDates {
  const now = new Date();
  
  let startDate: Date;
  let endDate: Date;

  if (storedValidUntil) {
    endDate = new Date(storedValidUntil);
    startDate = storedCycleStart ? new Date(storedCycleStart) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else if (createdAt) {
    const created = new Date(createdAt);
    // Find current month's cycle anchor
    const monthsDiff = (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth());
    startDate = new Date(created);
    startDate.setMonth(created.getMonth() + monthsDiff);
    
    // If startDate is in future relative to now, shift back 1 month
    if (startDate > now) {
      startDate.setMonth(startDate.getMonth() - 1);
    }
    
    endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
  } else {
    // Default to current date -> +30 days
    startDate = new Date(now);
    endDate = new Date(now);
    endDate.setDate(now.getDate() + 30);
  }

  const diffMs = endDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  const startFormatted = startDate.toLocaleDateString('en-IN', options);
  const endFormatted = endDate.toLocaleDateString('en-IN', options);
  const cycleFormatted = `${startDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} – ${endFormatted}`;

  let status: 'active' | 'expiring_soon' | 'expired' = 'active';
  if (daysRemaining <= 0) {
    status = 'expired';
  } else if (daysRemaining <= 5) {
    status = 'expiring_soon';
  }

  return {
    startDate,
    endDate,
    startFormatted,
    endFormatted,
    cycleFormatted,
    daysRemaining,
    status
  };
}

export interface B2BBillingCalculation {
  basePrice: number;
  includedUsers: number;
  activeAddons: {
    id: string;
    name: string;
    price: number;
    extraUserTier: number;
    color: string;
  }[];
  addonsTotal: number;
  highestTier: number;
  totalUsers: number;
  extraUsers: number;
  extraUsersTotal: number;
  totalMonthlyPrice: number;
}

/**
 * Calculates strict ArqonOS B2B pricing according to AGENTS.md:
 * Total Monthly Price = Base Price (₹699) + Sum(All Active Add-ons) + (Extra Users × Highest Active Tier Price)
 */
export function calculateB2BBilling(
  activeAddonIds: string[] = [],
  totalUsers: number = 5
): B2BBillingCalculation {
  const basePrice = PRICING_CONFIG.BASE_PLAN.price;
  const includedUsers = PRICING_CONFIG.BASE_PLAN.includedUsers;
  const baseExtraUserRate = PRICING_CONFIG.BASE_PLAN.extraUserPrice;

  // Normalize cost and vendor if stored separately or together
  const normalizedIds = new Set<string>();
  for (const id of activeAddonIds) {
    if (id === 'cost' || id === 'vendor' || id === 'cost_vendor') {
      normalizedIds.add('cost_vendor');
    } else {
      normalizedIds.add(id);
    }
  }

  const activeAddons = PRICING_CONFIG.ADD_ONS.filter(addon => normalizedIds.has(addon.id));
  const addonsTotal = activeAddons.reduce((sum, a) => sum + a.price, 0);

  const activeTiers = activeAddons.map(a => a.extraUserTier);
  const highestTier = Math.max(baseExtraUserRate, ...activeTiers);

  const extraUsers = Math.max(0, totalUsers - includedUsers);
  const extraUsersTotal = extraUsers * highestTier;

  const totalMonthlyPrice = basePrice + addonsTotal + extraUsersTotal;

  return {
    basePrice,
    includedUsers,
    activeAddons,
    addonsTotal,
    highestTier,
    totalUsers,
    extraUsers,
    extraUsersTotal,
    totalMonthlyPrice
  };
}

export interface NestBillingCalculation {
  planId: string;
  planName: string;
  basePrice: number;
  includedUsers: number;
  extraUserRate: number;
  totalUsers: number;
  extraUsers: number;
  extraUsersTotal: number;
  totalMonthlyPrice: number;
}

/**
 * Calculates strict Arqon Nest B2C pricing according to AGENTS.md:
 * Base plan (Starter ₹99, Plus ₹249, Pro ₹449) with 3 users included.
 * Extra users: ₹99 per user/month.
 * Total Monthly Cost = Base Plan Price + (Extra Users × ₹99)
 */
export function calculateNestBilling(
  planId: string = 'nest_plus',
  totalUsers: number = 3
): NestBillingCalculation {
  const plan = PRICING_CONFIG.NEST_PLANS.find(p => p.id === planId) || PRICING_CONFIG.NEST_PLANS[1];
  const includedUsers = 3;
  const extraUserRate = 99;
  const extraUsers = Math.max(0, totalUsers - includedUsers);
  const extraUsersTotal = extraUsers * extraUserRate;
  const totalMonthlyPrice = plan.price + extraUsersTotal;

  return {
    planId: plan.id,
    planName: plan.name,
    basePrice: plan.price,
    includedUsers,
    extraUserRate,
    totalUsers,
    extraUsers,
    extraUsersTotal,
    totalMonthlyPrice
  };
}
