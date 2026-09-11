import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Lock,
  CheckCircle2,
  Calendar,
  CreditCard,
  Users,
  ShieldCheck,
  AlertCircle,
  Receipt,
  Sparkles,
  ArrowRight,
  Check,
  Smartphone,
  ChevronRight,
  Building,
  Home,
  Plus,
  Minus
} from 'lucide-react';
import { PRICING_CONFIG } from '../constants/pricing';
import { calculateNestBilling, getSubscriptionValidationDates } from '../utils/billing';
import type { UserProfile } from '../context/AuthContext';
import type { NestGroup, NestPlanId } from '../pages/workspace/b2c/types';

interface NestCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (
    updatedPlanId: NestPlanId,
    updatedMaxUsers: number,
    newDates: { validUntil: string; cycleStart: string }
  ) => void;
  profile?: UserProfile | null;
  group: NestGroup;
  initialSelectedPlan?: NestPlanId;
  membersCount?: number;
}

export function NestCheckoutModal({
  isOpen,
  onClose,
  onSuccess,
  profile,
  group,
  initialSelectedPlan,
  membersCount = 3
}: NestCheckoutModalProps) {
  // Plan selection
  const [selectedPlanId, setSelectedPlanId] = useState<NestPlanId>(
    initialSelectedPlan || group.plan || 'nest_plus'
  );

  // Group members quota adjustment
  const [totalUsers, setTotalUsers] = useState<number>(
    Math.max(3, profile?.maxUsers || membersCount || group.totalMembersCount || 3)
  );

  // Calculate live billing
  const billing = calculateNestBilling(selectedPlanId, totalUsers);

  // Compute validation dates
  const validationDates = getSubscriptionValidationDates(
    profile?.createdAt,
    profile?.subscriptionValidUntil,
    profile?.billingCycleStart
  );

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('mewada.family@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 9912');
  const [cardExpiry, setCardExpiry] = useState('11/29');
  const [cardCvv, setCardCvv] = useState('•••');
  const [billingName, setBillingName] = useState(
    profile?.displayName || 'Jitendra Mewada'
  );
  const [groupDisplayName, setGroupDisplayName] = useState(
    group.name || profile?.companyName || 'Mewada Family Circle'
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [processingStep, setProcessingStep] = useState(0);

  // Authority check: Admin, Family Organizer, General Manager can authorize upgrades
  const userRole = profile?.role || 'Admin';
  const isAuthorizedToPurchase = ['Admin', 'General Manager', 'Organizer', 'Family Head', 'System Admin'].includes(
    userRole
  );

  if (!isOpen) return null;

  const handlePayAndActivate = () => {
    if (!isAuthorizedToPurchase) return;
    setIsProcessing(true);
    setProcessingStep(1);

    setTimeout(() => {
      setProcessingStep(2);
    }, 600);

    setTimeout(() => {
      setProcessingStep(3);
    }, 1200);

    // Complete transaction
    setTimeout(() => {
      const generatedTxn = `TXN-NEST-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      setTransactionId(generatedTxn);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1800);
  };

  const handleFinish = () => {
    onSuccess(selectedPlanId, totalUsers, {
      cycleStart: validationDates.startDate.toISOString(),
      validUntil: validationDates.endDate.toISOString()
    });
    onClose();
  };

  const currentPlanObj = PRICING_CONFIG.NEST_PLANS.find(p => p.id === selectedPlanId) || PRICING_CONFIG.NEST_PLANS[1];

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="nest-checkout-modal-container"
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#22c55e] flex items-center justify-center text-white font-bold shadow-md shadow-[#22c55e]/20">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {isSuccess ? 'Payment Authorization Complete' : 'Manage Nest Group Subscription'}
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20">
                  B2C Workspace
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Group subscription checkout & monthly billing authorization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-6">
          {isSuccess ? (
            /* Success Receipt View */
            <div className="py-6 px-4 flex flex-col items-center text-center space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Payment Confirmed • Group Subscription Provisioned
                </span>
                <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {currentPlanObj.name} is now Active!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                  Your family & group billing schedule has been updated. Member quota of {totalUsers} seats has been immediately provisioned for {groupDisplayName}.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Receipt className="w-4 h-4 text-[#22c55e]" />
                    <span>Nest Group Subscription Receipt</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {transactionId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Group</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                      <Home className="w-3.5 h-3.5 text-[#22c55e]" />
                      <span>{groupDisplayName}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Plan & Quota</span>
                    <span className="font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                      {currentPlanObj.name} ({totalUsers} Members)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Amount Authorized</span>
                    <span className="font-extrabold text-[#22c55e] mt-0.5 block">₹{billing.totalMonthlyPrice} / month</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Authorized By</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 mt-0.5 block">{billingName} ({userRole})</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billing Start</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 mt-0.5 block">{validationDates.startFormatted}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Monthly Validity End</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">{validationDates.endFormatted}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Next Auto-Renewal</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {validationDates.endFormatted} (30 days cycle)
                  </span>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-3.5 bg-[#22c55e] hover:bg-[#1ea34d] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-[#22c55e]/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Return to {groupDisplayName}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Checkout Form View */
            <>
              {/* Monthly Validation Dates Banner with Registered Group */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                        Monthly Subscription Validity
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 flex items-center gap-1">
                        <Users className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>{groupDisplayName}</span>
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                      {validationDates.daysRemaining} Days in Current Cycle
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {validationDates.startFormatted} – {validationDates.endFormatted}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Plan upgrades take effect immediately with pro-rated group workspace access.
                  </div>
                </div>
              </div>

              {/* Step 1: Select Plan (Locked Pricing Engine) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Select Group Tier
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    1 subscription = 1 group workspace
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PRICING_CONFIG.NEST_PLANS.map(p => {
                    const isSelected = selectedPlanId === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPlanId(p.id as NestPlanId)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#22c55e] bg-[#22c55e]/5 shadow-sm dark:bg-[#22c55e]/10'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {p.name}
                            </span>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-[#22c55e] text-white flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
                            ₹{p.price}
                            <span className="text-[10px] font-normal text-slate-400"> /mo</span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                            {p.positioning}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                          {p.includes.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[9.5px] text-slate-600 dark:text-slate-400">
                              <Check className="w-3 h-3 text-[#22c55e] shrink-0" />
                              <span className="truncate">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Member Quota Counter (₹99 per extra user) */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Group Member Capacity
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      3 Members included in plan • ₹99/user for extra members
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1">
                    <button
                      type="button"
                      disabled={totalUsers <= 3}
                      onClick={() => setTotalUsers(Math.max(3, totalUsers - 1))}
                      className="w-7 h-7 rounded flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white min-w-[36px] text-center">
                      {totalUsers}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTotalUsers(totalUsers + 1)}
                      className="w-7 h-7 rounded flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {billing.extraUsers > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Extra Member Additions ({billing.extraUsers} × ₹99)
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      +₹{billing.extraUsersTotal} / month
                    </span>
                  </div>
                )}
              </div>

              {/* Dynamic Price Breakdown Summary */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Base {billing.planName} Plan (3 Members)</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">₹{billing.basePrice}</span>
                </div>
                {billing.extraUsers > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{billing.extraUsers} Extra Members (at ₹99/user)</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">+₹{billing.extraUsersTotal}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Total Monthly Cost</span>
                    <span className="text-[10px] text-slate-400">Auto-renews monthly • Cancel anytime</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-[#22c55e]">
                      ₹{billing.totalMonthlyPrice}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-normal">per month</span>
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Payment Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-[#22c55e] bg-[#22c55e]/10 text-[#22c55e]'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Instant UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#22c55e] bg-[#22c55e]/10 text-[#22c55e]'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Debit / Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'border-[#22c55e] bg-[#22c55e]/10 text-[#22c55e]'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>Net Banking</span>
                  </button>
                </div>

                {/* Method Specific Inputs */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-medium text-slate-500">Enter UPI ID / VPA</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. name@okhdfcbank"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                    />
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="col-span-3 space-y-1">
                      <label className="text-[11px] font-medium text-slate-500">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[11px] font-medium text-slate-500">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-500">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Popular Direct Gateways
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak'].map((b) => (
                        <span key={b} className="px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Group Workspace Info */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-500">Registered Group Name</label>
                  <input
                    type="text"
                    value={groupDisplayName}
                    onChange={(e) => setGroupDisplayName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-500">Authorized Organizer Name</label>
                  <input
                    type="text"
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              {/* Authority Notice */}
              {!isAuthorizedToPurchase ? (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-xs text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>
                    Your current role ({userRole}) does not have billing authority. Only Group Admins and Organizers can authorize subscription upgrades.
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-[#22c55e] shrink-0" />
                  <span>Authorized by {billingName} ({userRole}) • 256-bit encrypted merchant checkout</span>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                disabled={isProcessing || !isAuthorizedToPurchase}
                onClick={handlePayAndActivate}
                className="w-full py-3.5 bg-[#22c55e] hover:bg-[#1ea34d] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-[#22c55e]/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>
                      {processingStep === 1 && 'Verifying with Bank Switch...'}
                      {processingStep === 2 && 'Registering Group Quota...'}
                      {processingStep === 3 && 'Generating Official Receipt...'}
                    </span>
                  </div>
                ) : (
                  <>
                    <span>Authorize & Upgrade to {currentPlanObj.name} (₹{billing.totalMonthlyPrice}/mo)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const portalRoot = document.getElementById('modal-portal-root') || document.body;
  return createPortal(modalContent, portalRoot);
}
