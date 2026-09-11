import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Lock,
  CheckCircle2,
  Calendar,
  CreditCard,
  Building2,
  ShieldCheck,
  AlertCircle,
  Receipt,
  Sparkles,
  ArrowRight,
  Check,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { PRICING_CONFIG } from '../constants/pricing';
import { calculateB2BBilling, getSubscriptionValidationDates } from '../utils/billing';
import type { UserProfile } from '../context/AuthContext';

interface AddonCheckoutModalProps {
  appId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedAddons: string[], newDates: { validUntil: string; cycleStart: string }) => void;
  profile?: UserProfile | null;
}

export function AddonCheckoutModal({
  appId,
  isOpen,
  onClose,
  onSuccess,
  profile
}: AddonCheckoutModalProps) {

  // Normalize app ID
  const normalizedId = appId === 'cost' || appId === 'vendor' ? 'cost_vendor' : appId;
  const addonConfig = PRICING_CONFIG.ADD_ONS.find(a => a.id === normalizedId) || {
    id: appId,
    name: appId.toUpperCase(),
    layer: 'Engine Layer',
    price: 899,
    extraUserTier: 99,
    color: '#3b82f6',
    icon: 'Layers'
  };

  const currentAddons = profile?.activeAddons || [];
  const nextAddons = [...currentAddons];
  if (appId === 'cost' || appId === 'vendor') {
    if (!nextAddons.includes('cost')) nextAddons.push('cost');
    if (!nextAddons.includes('vendor')) nextAddons.push('vendor');
    if (!nextAddons.includes('cost_vendor')) nextAddons.push('cost_vendor');
  } else {
    if (!nextAddons.includes(appId)) nextAddons.push(appId);
  }

  const userCount = profile?.maxUsers || 5;
  const currentBilling = calculateB2BBilling(currentAddons, userCount);
  const nextBilling = calculateB2BBilling(nextAddons, userCount);

  // Compute dates
  const validationDates = getSubscriptionValidationDates(
    profile?.createdAt,
    profile?.subscriptionValidUntil,
    profile?.billingCycleStart
  );

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('accounts@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('•••');
  const [companyName, setCompanyName] = useState(profile?.companyName || 'ArqonOS Design Studio');
  const [gstin, setGstin] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // Authority check
  const userRole = profile?.role || 'General Manager';
  const isAuthorizedToPurchase = ['General Manager', 'Account', 'System Admin', 'Coordinator'].includes(userRole);

  if (!isOpen) return null;

  const handlePayAndActivate = async () => {
    if (!isAuthorizedToPurchase) return;
    setIsProcessing(true);

    // Simulate real-time merchant payment authorization (2s)
    setTimeout(() => {
      const generatedTxn = `TXN-ARQON-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      setTransactionId(generatedTxn);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1800);
  };

  const handleFinish = () => {
    onSuccess(nextAddons, {
      cycleStart: validationDates.startDate.toISOString(),
      validUntil: validationDates.endDate.toISOString()
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md"
              style={{ backgroundColor: addonConfig.color }}
            >
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  Activate {addonConfig.name}
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {addonConfig.layer}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Modular subscription checkout & monthly billing authorization
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
                  Payment Confirmed • Module Provisioned
                </span>
                <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {addonConfig.name} is now Active!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                  Your corporate billing schedule has been updated. Access to {addonConfig.name} has been immediately unlocked for your workspace.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Receipt className="w-4 h-4" />
                    <span>Payment Receipt</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {transactionId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billed To</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{companyName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Amount Paid</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">₹{addonConfig.price} / month</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billing Start</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{validationDates.startFormatted}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Monthly Validity End</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{validationDates.endFormatted}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Next Auto-Renewal</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{validationDates.endFormatted} (30 days cycle)</span>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Enter {addonConfig.name} Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Checkout Form View */
            <>
              {/* Monthly Validation Dates Banner with Registered Firm */}
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
                        <Building2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>{profile?.companyName || companyName || "Registered Firm"}</span>
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                      {validationDates.daysRemaining} Days in Current Cycle
                    </span>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mt-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Valid: {validationDates.startFormatted} – {validationDates.endFormatted}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      (Renews on {validationDates.endFormatted})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-normal">
                    Activating today immediately unlocks full capabilities for your firm through the end of the monthly validation period.
                  </p>
                </div>
              </div>

              {/* Price Calculation Card (Locked AGENTS.md Formula) */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Subscription Pricing Impact
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    ArqonOS Modular SaaS Model
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Base Plan (5 Users Included: People + Quest + Flow)</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">₹{currentBilling.basePrice}/mo</span>
                  </div>

                  {currentBilling.activeAddons.length > 0 && (
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Existing Active Add-ons ({currentBilling.activeAddons.map(a => a.name).join(', ')})</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">₹{currentBilling.addonsTotal}/mo</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="flex items-center gap-1.5" style={{ color: addonConfig.color }}>
                      <Sparkles className="w-3.5 h-3.5" />
                      Adding {addonConfig.name} ({addonConfig.layer})
                    </span>
                    <span>+₹{addonConfig.price}/mo</span>
                  </div>

                  {/* Tier notice */}
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-lg text-[11px] text-blue-700 dark:text-blue-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Tier Rule: </span>
                      Extra user pricing increases to <span className="font-extrabold">₹{nextBilling.highestTier}/user/month</span> based on the highest active add-on tier (applicable only for team members beyond 5).
                    </div>
                  </div>

                  {/* Final Total */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        New Monthly Total
                      </span>
                      <span className="text-xl font-black text-slate-900 dark:text-white">
                        ₹{nextBilling.totalMonthlyPrice}
                        <span className="text-xs font-semibold text-slate-400 ml-1">/month</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Due Today
                      </span>
                      <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                        ₹{addonConfig.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Select Corporate Payment Method
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'upi'
                        ? 'bg-[#3b82f61a] border-[#3b82f6] text-[#3b82f6]'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
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
                        ? 'bg-[#3b82f61a] border-[#3b82f6] text-[#3b82f6]'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Corporate Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'bg-[#3b82f61a] border-[#3b82f6] text-[#3b82f6]'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Net Banking</span>
                  </button>
                </div>

                {/* Form fields based on selected method */}
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  {paymentMethod === 'upi' ? (
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Firm / Corporate UPI ID
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="company@bank"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#3b82f6]"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Accepts GPay, PhonePe, Paytm, BHIM & Corporate UPI VPAs
                      </span>
                    </div>
                  ) : paymentMethod === 'card' ? (
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#3b82f6]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#3b82f6]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#3b82f6]"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Select Corporate Bank
                      </label>
                      <select className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#3b82f6]">
                        <option>HDFC Bank Corporate Portal</option>
                        <option>ICICI Bank Corporate Banking</option>
                        <option>State Bank of India (SBI)</option>
                        <option>Axis Bank Commercial Banking</option>
                        <option>Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}

                  {/* Billing Name & GSTIN */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Firm / Entity Name
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-800 dark:text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        GSTIN (Optional)
                      </label>
                      <input
                        type="text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                        placeholder="27AAACA1234A1Z5"
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Authority Notice if user has restricted role */}
              {!isAuthorizedToPurchase && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs flex items-center gap-2.5 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Purchasing authority required: Only General Manager or Account roles can authorize module activations.</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePayAndActivate}
                  disabled={isProcessing || !isAuthorizedToPurchase}
                  className="flex-2 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-white dark:border-t-slate-900 rounded-full animate-spin" />
                      <span>Verifying & Authorizing...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Pay ₹{addonConfig.price} & Activate Module</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 text-center font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>256-bit Encrypted Banking Gateway • Instant GST Tax Invoice Generated</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.getElementById('modal-portal-root') || document.body
  );
}
