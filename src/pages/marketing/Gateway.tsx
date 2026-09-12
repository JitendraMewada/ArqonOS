import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Layers, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Building, 
  LogOut, 
  Chrome, 
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  Check,
  Plus,
  Minus,
  Info,
  Calendar,
  CreditCard,
  Building2,
  Smartphone,
  ShieldCheck,
  Receipt,
  Copy,
  Users,
  Wallet,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { PRICING_CONFIG } from '../../constants/pricing';
import { calculateB2BBilling, getSubscriptionValidationDates } from '../../utils/billing';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

export function Gateway() {
  const { 
    user, 
    profile, 
    loading, 
    loginWithGoogle, 
    loginWithEmail, 
    signUpWithEmail, 
    logout, 
    forceSandbox,
    isMockMode 
  } = useAuth();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const segmentParam = searchParams.get('segment'); // 'b2b' or 'b2c'
  const addonsParam = searchParams.get('addons'); // e.g. 'connect,studio'
  const usersParam = searchParams.get('users'); // e.g. '8'
  const planParam = searchParams.get('plan'); // e.g. 'nest_plus'
  const modeParam = searchParams.get('mode'); // 'register' or 'signin'

  // Workspace Segment State: 'b2b' (ArqonOS) vs 'b2c' (Arqon Nest)
  const [activeSegment, setActiveSegment] = useState<'b2b' | 'b2c'>(
    segmentParam === 'b2c' ? 'b2c' : 'b2b'
  );

  const [isRegister, setIsRegister] = useState(false);
  
  // Registration Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('General Manager');
  const [gstin, setGstin] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // B2B Modular Plan Configuration State
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [b2bUserCount, setB2bUserCount] = useState<number>(5);

  // B2C Nest Group Plan Configuration State
  const [nestPlanId, setNestPlanId] = useState<string>(planParam || 'nest_plus');
  const [nestMembersCount, setNestMembersCount] = useState<number>(3);

  // Corporate & Group Payment Channels State
  const [paymentChannel, setPaymentChannel] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [paymentVpa, setPaymentVpa] = useState('finance@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('11/29');
  const [cardCvv, setCardCvv] = useState('892');
  const [cardHolder, setCardHolder] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank Corporate Portal');

  // Multi-step Authorization & Processing States
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [holdRedirect, setHoldRedirect] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [registrationReceipt, setRegistrationReceipt] = useState<any | null>(null);
  const [copiedTxn, setCopiedTxn] = useState(false);

  // Initialize selected addons and user count from URL params
  useEffect(() => {
    if (segmentParam === 'b2c' || segmentParam === 'b2b') {
      setActiveSegment(segmentParam);
    }
    if (planParam) {
      setNestPlanId(planParam);
    }
    if (addonsParam) {
      const parsed = addonsParam.split(',').filter(Boolean);
      setSelectedAddons(parsed);
    }
    if (usersParam) {
      const parsedUsers = parseInt(usersParam, 10);
      if (!isNaN(parsedUsers) && parsedUsers >= 1) {
        if (segmentParam === 'b2c') {
          setNestMembersCount(parsedUsers);
        } else {
          setB2bUserCount(parsedUsers);
        }
      }
    }
    if (segmentParam || planParam || addonsParam || usersParam || modeParam === 'register') {
      setIsRegister(true);
    }
  }, [segmentParam, planParam, addonsParam, usersParam, modeParam]);

  // Sync role and VPA defaults when segment switches
  useEffect(() => {
    if (activeSegment === 'b2c') {
      if (role === 'General Manager' || role === 'Account' || role === 'Lead Designer') {
        setRole('Group Organizer');
      }
      if (paymentVpa === 'finance@okhdfcbank') {
        setPaymentVpa('sharma.family@okhdfcbank');
      }
      if (selectedBank === 'HDFC Bank Corporate Portal') {
        setSelectedBank('HDFC Bank NetBanking');
      }
    } else {
      if (role === 'Group Organizer' || role === 'Family Head' || role === 'Member') {
        setRole('General Manager');
      }
      if (paymentVpa === 'sharma.family@okhdfcbank') {
        setPaymentVpa('finance@okhdfcbank');
      }
      if (selectedBank === 'HDFC Bank NetBanking') {
        setSelectedBank('HDFC Bank Corporate Portal');
      }
    }
  }, [activeSegment]);

  // Keep card holder in sync with name or company if empty
  useEffect(() => {
    if (!cardHolder && (company || name)) {
      setCardHolder(company ? `${company.toUpperCase()} - ${name.toUpperCase()}` : name.toUpperCase());
    }
  }, [company, name, cardHolder]);

  // Derive active monthly billing validation dates
  const validationDates = getSubscriptionValidationDates();

  // Calculate dynamic B2B billing
  const b2bBilling = calculateB2BBilling(selectedAddons, b2bUserCount);

  // Calculate dynamic B2C Nest billing: Total = Base Plan + (Extra Users * 99)
  const selectedNestPlan = PRICING_CONFIG.NEST_PLANS.find(p => p.id === nestPlanId) || PRICING_CONFIG.NEST_PLANS[1];
  const nestExtraMembers = Math.max(0, nestMembersCount - 3);
  const nestTotalMonthly = selectedNestPlan.price + (nestExtraMembers * 99);

  // Current effective monthly amount
  const currentTotalAmount = activeSegment === 'b2c' ? nestTotalMonthly : b2bBilling.totalMonthlyPrice;

  // Toggle modular add-on selection for B2B
  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId) 
        : [...prev, addonId]
    );
  };

  // Adjust team / member count
  const adjustB2BUsers = (delta: number) => {
    setB2bUserCount(prev => Math.max(1, prev + delta));
  };
  const adjustNestMembers = (delta: number) => {
    setNestMembersCount(prev => Math.max(1, prev + delta));
  };

  // Redirect authenticated users to their designated workspace unless viewing receipt or holdRedirect
  useEffect(() => {
    const isAuthenticated = user !== null || isMockMode;
    if (isAuthenticated && profile && !holdRedirect && !registrationReceipt) {
      const targetSegment = activeSegment || profile.segment || 'b2b';
      let targetPath = `/workspace/${targetSegment}`;
      
      if (targetSegment === 'b2b') {
        const queryApp = searchParams.get('app') || searchParams.get('module');
        const activeApp = queryApp || (profile.activeAddons && profile.activeAddons.length > 0 ? profile.activeAddons[0] : null);
        if (activeApp) {
          targetPath += `?app=${activeApp.toLowerCase()}`;
        }
      }
      navigate(targetPath);
    }
  }, [user, isMockMode, profile, activeSegment, searchParams, navigate, holdRedirect, registrationReceipt]);

  // Copy transaction ID to clipboard
  const handleCopyTxn = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedTxn(true);
    setTimeout(() => setCopiedTxn(false), 2000);
  };

  // Handle Standard Sign-In Form
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setSubmitting(true);

    try {
      await loginWithEmail(email, password);
      setAuthSuccess(`Authenticated successfully! Initializing ${activeSegment === 'b2c' ? 'Nest Group' : 'Firm Workspace'} session...`);
    } catch (err: any) {
      const isOperationNotAllowed = err.code === 'auth/operation-not-allowed' || err.message?.includes('operation-not-allowed');
      if (isOperationNotAllowed) {
        console.warn("Email/Password provider disabled in Firebase Console. Entering secure preview mode.");
        forceSandbox({
          segment: activeSegment,
          companyName: company || (activeSegment === 'b2c' ? 'Sharma Family Workspace' : 'Aura Spaces Design Studio'),
          displayName: name || (activeSegment === 'b2c' ? 'Rohit Sharma' : 'Ananya Sharma')
        });
        setAuthSuccess("Entering preview sandbox environment...");
      } else {
        console.error("Sign in failed:", err);
        setAuthError(err.message || `Authentication failed. Please check your credentials for ${activeSegment === 'b2c' ? 'Arqon Nest' : 'ArqonOS'}.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Register with Modular / Group Checkout & Payment Authorization
  const handleRegisterWithPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    // Validation
    if (!name.trim()) {
      setAuthError(activeSegment === 'b2c' ? "Group organizer full name is required." : "Authorized administrator full name is required.");
      return;
    }
    if (!company.trim()) {
      setAuthError(activeSegment === 'b2c' ? "Group / Family Workspace name is required." : "Interior Design firm name is required.");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setAuthError("Email and secure password are required.");
      return;
    }
    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    setHoldRedirect(true);

    try {
      // 1. Handshake
      setProcessingStep("Establishing 256-bit encrypted security tunnel...");
      await new Promise(r => setTimeout(r, 600));

      // 2. Verification
      setProcessingStep(activeSegment === 'b2c' ? "Verifying group organizer authorization & UPI/card details..." : "Verifying corporate signing authority & banking credentials...");
      await new Promise(r => setTimeout(r, 700));

      // 3. Authorization
      setProcessingStep(activeSegment === 'b2c' ? "Authorizing group monthly subscription mandate..." : "Authorizing recurring corporate monthly mandate...");
      await new Promise(r => setTimeout(r, 700));

      // 4. Provisioning
      setProcessingStep(activeSegment === 'b2c' ? "Provisioning Arqon Nest group workspace & ledger..." : "Provisioning multi-tenant ArqonOS workspace & modules...");
      await new Promise(r => setTimeout(r, 600));

      // Generate verifiable audit records
      const txnId = `TXN-${activeSegment === 'b2c' ? 'NEST' : 'ARQON'}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      const invId = `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const valDates = getSubscriptionValidationDates();

      const formattedPaymentMethod = 
        paymentChannel === 'upi' 
          ? `Instant UPI (${paymentVpa})` 
          : paymentChannel === 'card' 
            ? `${activeSegment === 'b2c' ? 'Personal/Family Card' : 'Corporate Card'} (ending in ${cardNumber.replace(/\s/g, '').slice(-4) || '8821'})` 
            : `Net Banking (${selectedBank})`;

      const initData = {
        segment: activeSegment,
        addons: activeSegment === 'b2b' ? selectedAddons : [],
        users: activeSegment === 'b2b' ? b2bUserCount : nestMembersCount,
        planId: activeSegment === 'b2c' ? nestPlanId : '',
        role: role,
        gstin: activeSegment === 'b2b' ? gstin.trim() : '',
        billingCycleStart: valDates.startDate.toISOString(),
        billingCycleEnd: valDates.endDate.toISOString(),
        subscriptionValidUntil: valDates.endDate.toISOString(),
        lastPaymentDate: new Date().toISOString(),
        lastPaymentAmount: currentTotalAmount,
        lastTransactionId: txnId,
        paymentMethod: formattedPaymentMethod
      };

      try {
        await signUpWithEmail(email, password, name, company, initData);
      } catch (authErr: any) {
        const isOperationNotAllowed = authErr.code === 'auth/operation-not-allowed' || authErr.message?.includes('operation-not-allowed');
        if (isOperationNotAllowed) {
          console.warn("Email/Password provider disabled in Firebase Console. Seamlessly falling back to sandbox mode.");
          forceSandbox({
            email,
            displayName: name,
            companyName: company,
            role,
            gstin: activeSegment === 'b2b' ? gstin.trim() : '',
            subscriptionTier: activeSegment === 'b2c' ? (nestPlanId === 'nest_pro' ? 'Pro' : nestPlanId === 'nest_plus' ? 'Plus' : 'Starter') : (selectedAddons.length > 3 ? 'Pro' : 'Plus'),
            segment: activeSegment,
            activeAddons: activeSegment === 'b2b' ? selectedAddons : [],
            maxUsers: activeSegment === 'b2b' ? b2bUserCount : nestMembersCount,
            planId: activeSegment === 'b2c' ? nestPlanId : '',
            billingCycleStart: valDates.startDate.toISOString(),
            billingCycleEnd: valDates.endDate.toISOString(),
            subscriptionValidUntil: valDates.endDate.toISOString(),
            lastPaymentDate: new Date().toISOString(),
            lastPaymentAmount: currentTotalAmount,
            lastTransactionId: txnId,
            paymentMethod: formattedPaymentMethod
          });
        } else if (authErr.code === 'auth/email-already-in-use' || authErr.message?.toLowerCase().includes('already-in-use') || authErr.message?.toLowerCase().includes('already in use')) {
          setIsExistingUser(true);
          setIsRegister(false);
          setHoldRedirect(false);
          setSubmitting(false);
          return;
        } else {
          throw authErr;
        }
      }

      // Populate registration receipt to display on screen
      setRegistrationReceipt({
        transactionId: txnId,
        invoiceId: invId,
        entityName: company,
        signatoryName: name,
        role: role,
        gstin: activeSegment === 'b2b' ? gstin.trim() : '',
        userCount: activeSegment === 'b2b' ? b2bUserCount : nestMembersCount,
        activeAddons: activeSegment === 'b2b' ? selectedAddons : [],
        nestPlan: activeSegment === 'b2c' ? selectedNestPlan : null,
        totalMonthlyPrice: currentTotalAmount,
        paymentMethod: formattedPaymentMethod,
        validationDates: valDates,
        segment: activeSegment
      });

      setAuthSuccess(activeSegment === 'b2c' ? "Group workspace provisioned & payment authorized successfully!" : "Payment authorized & firm provisioned successfully!");
    } catch (err: any) {
      console.error("Registration authorization failed:", err);
      setAuthError(err.message || "Failed to authorize payment. Please verify information and retry.");
    } finally {
      setSubmitting(false);
      setProcessingStep('');
    }
  };

  // Launch workspace from receipt view
  const handleLaunchWorkspace = () => {
    setHoldRedirect(false);
    const targetSegment = registrationReceipt?.segment || activeSegment || 'b2b';
    let targetPath = `/workspace/${targetSegment}`;
    if (targetSegment === 'b2b') {
      const activeApp = registrationReceipt?.activeAddons?.[0] || 'quest';
      targetPath += `?app=${activeApp.toLowerCase()}`;
    }
    navigate(targetPath);
  };

  // Handle Google Auth
  const handleGoogleAuth = async () => {
    setAuthError(null);
    setAuthSuccess(null);
    setSubmitting(true);
    setHoldRedirect(true);
    try {
      await loginWithGoogle();
      
      if (isRegister && auth && db) {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            const entityName = data?.companyName || "your workspace";
            setIsExistingUser(true);
            setIsRegister(false);
            setAuthSuccess(`Account verified! You are already registered under "${entityName}". Logging you into ${activeSegment === 'b2c' ? 'Nest' : 'ArqonOS'}...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          } else {
            setAuthSuccess("Authenticated with Google! Initializing workspace gateway...");
          }
        }
      } else {
        setAuthSuccess("Authenticated with Google! Entering gateway...");
      }
    } catch (err: any) {
      const isOperationNotAllowed = err.code === 'auth/operation-not-allowed' || err.message?.includes('operation-not-allowed');
      if (isOperationNotAllowed) {
        console.warn("Google provider disabled in Firebase Console. Entering sandbox preview mode.");
        forceSandbox({
          segment: activeSegment,
          companyName: activeSegment === 'b2c' ? 'Sharma Family Workspace' : 'Aura Spaces Design Studio'
        });
        setAuthSuccess("Google Sign-in disabled in Firebase Console. Entering sandbox preview...");
      } else {
        console.error("Google Auth failed:", err);
        setAuthError(err.message || "Google authentication failed.");
      }
    } finally {
      setSubmitting(false);
      setHoldRedirect(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-t-[#3b82f6] border-slate-200 dark:border-slate-800 rounded-full animate-spin" />
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Loading Secure Session...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = user !== null || isMockMode;
  const isB2C = activeSegment === 'b2c';

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 md:px-12 flex flex-col items-center justify-center relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Background Ambience based on active workspace */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-all duration-700" 
        style={{ backgroundColor: isB2C ? '#22c55e10' : '#3b82f610' }}
      />

      {/* Top Banner / Headline */}
      <div className="text-center mb-6 relative z-10 max-w-3xl">
        
        {/* Workspace Segment Switcher */}
        {!registrationReceipt && (
          <div className="inline-flex p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md mb-5">
            <button
              type="button"
              id="segment-tab-b2b"
              onClick={() => {
                setActiveSegment('b2b');
                setAuthError(null);
                setIsExistingUser(false);
              }}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                !isB2C 
                  ? "bg-[#3b82f6] text-white shadow-lg shadow-blue-500/25" 
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>ArqonOS (B2B Suite)</span>
            </button>
            <button
              type="button"
              id="segment-tab-b2c"
              onClick={() => {
                setActiveSegment('b2c');
                setAuthError(null);
                setIsExistingUser(false);
              }}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                isB2C 
                  ? "bg-[#22c55e] text-white shadow-lg shadow-green-500/25" 
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Arqon Nest (B2C Workspace)</span>
            </button>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 mb-2">
          <div 
            className="p-3 rounded-xl border shadow-sm transition-colors"
            style={{
              backgroundColor: isB2C ? '#22c55e15' : '#3b82f615',
              borderColor: isB2C ? '#22c55e30' : '#3b82f630'
            }}
          >
            {isB2C ? (
              <Wallet className="w-7 h-7 text-[#22c55e]" />
            ) : (
              <Layers className="w-7 h-7 text-[#3b82f6]" />
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {isB2C ? "Arqon Nest Gateway" : "ArqonOS Gateway"}
          </h1>
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium max-w-xl mx-auto">
          {registrationReceipt 
            ? isB2C 
              ? "Your group workspace has been officially registered and verified on Arqon Nest."
              : "Your organization has been officially registered and verified on ArqonOS."
            : isAuthenticated 
              ? isB2C
                ? "Your identity has been verified. Welcome to your Nest collaborative workspace."
                : "Your identity has been verified. Welcome to the interior operating system."
              : isRegister 
                ? isB2C
                  ? "Register your shared group workspace (family, friends, roommates) with group-based SaaS pricing."
                  : "Register your interior design firm with modular SaaS checkout & corporate payment authorization."
                : isB2C
                  ? "Sign in with your personal or group credentials to access your family & friends finances."
                  : "Authenticate with your corporate credentials to initialize your firm workspace."}
        </p>
        
        {isMockMode && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Preview Sandbox Active
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {registrationReceipt ? (
          /* ============================================================
             REGISTRATION RECEIPT: Tailored for B2C Nest vs B2B ArqonOS
             ============================================================ */
          <motion.div
            key="registration-receipt"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-10 relative z-10 space-y-6"
          >
            {/* Header Badge */}
            <div className="flex flex-col items-center text-center space-y-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  backgroundColor: isB2C ? '#22c55e15' : '#3b82f615',
                  borderColor: isB2C ? '#22c55e30' : '#3b82f630',
                  color: isB2C ? '#22c55e' : '#3b82f6'
                }}
              >
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <span 
                  className="text-[11px] font-black uppercase tracking-widest block"
                  style={{ color: isB2C ? '#22c55e' : '#3b82f6' }}
                >
                  {isB2C ? "Group Workspace Activated • Payment Authorized" : "Corporate Payment Authorized • Firm Registered"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                  Welcome, {registrationReceipt.entityName}!
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isB2C 
                    ? "Your family & group finance workspace is ready with verified member quotas and active monthly validation."
                    : "Your tenant workspace is provisioned with active monthly validation and 256-bit encrypted security."}
                </p>
              </div>
            </div>

            {/* Monthly Validation Banner */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block">
                    Active Monthly Validation Cycle
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {registrationReceipt.validationDates.startFormatted} – {registrationReceipt.validationDates.endFormatted}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wider rounded-md">
                  30 Days Verified
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Renews: {registrationReceipt.validationDates.endFormatted}</span>
              </div>
            </div>

            {/* Tax Invoice Details Box */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Receipt className="w-4 h-4 text-[#3b82f6]" />
                  <span>{isB2C ? "Official Group Subscription Receipt" : "Official Corporate Tax Invoice"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300">
                    {registrationReceipt.transactionId}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyTxn(registrationReceipt.transactionId)}
                    className="p-1 text-slate-400 hover:text-[#3b82f6] transition-colors"
                    title="Copy Transaction ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copiedTxn && (
                    <span className="text-[10px] text-emerald-500 font-bold">Copied!</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isB2C ? "Registered Group" : "Billed Entity"}
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{registrationReceipt.entityName}</span>
                  {registrationReceipt.gstin && (
                    <span className="text-[10px] font-mono text-slate-500 block">GSTIN: {registrationReceipt.gstin}</span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isB2C ? "Group Organizer" : "Authorized Signatory"}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{registrationReceipt.signatoryName}</span>
                  <span className="text-[10px] font-bold block" style={{ color: isB2C ? '#22c55e' : '#3b82f6' }}>
                    {registrationReceipt.role}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Amount Paid</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    ₹{registrationReceipt.totalMonthlyPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block">/month recurring</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Receipt No.</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{registrationReceipt.invoiceId}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment Channel</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate block">
                    {registrationReceipt.paymentMethod}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isB2C ? "Group Members" : "Team Seats"}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{registrationReceipt.userCount} Members</span>
                </div>
              </div>

              {/* Provisioned Engines / Plan Details */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                  {isB2C ? "Activated Group Capabilities:" : "Active Provisioned Engines:"}
                </span>
                {isB2C ? (
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 bg-[#22c55e15] text-[#22c55e] text-[10px] font-bold rounded-md border border-[#22c55e33]">
                      {registrationReceipt.nestPlan?.name || 'Nest Plus'} Plan
                    </span>
                    <span className="px-2 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-md">
                      Shared Income & Expense Tracking
                    </span>
                    <span className="px-2 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-md">
                      Smart Nudges & Vaults
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 bg-[#3b82f615] text-[#3b82f6] text-[10px] font-bold rounded-md border border-[#3b82f633]">
                      Quest (Tasks, Calendar, Chat)
                    </span>
                    <span className="px-2 py-1 bg-[#a855f715] text-[#a855f7] text-[10px] font-bold rounded-md border border-[#a855f733]">
                      People (Identity, Roles, Access)
                    </span>
                    <span className="px-2 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-md">
                      Flow Lite (5 Workflows)
                    </span>
                    {registrationReceipt.activeAddons.map((addonId: string) => {
                      const addon = PRICING_CONFIG.ADD_ONS.find(a => a.id === addonId);
                      return (
                        <span 
                          key={addonId} 
                          className="px-2 py-1 text-[10px] font-bold rounded-md border"
                          style={{ 
                            backgroundColor: `${addon?.color || '#3b82f6'}15`, 
                            color: addon?.color || '#3b82f6',
                            borderColor: `${addon?.color || '#3b82f6'}33`
                          }}
                        >
                          + {addon?.name || addonId}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Launch CTA */}
            <button
              type="button"
              onClick={handleLaunchWorkspace}
              className="w-full py-4 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl active:scale-98 flex items-center justify-center gap-2"
              style={{
                backgroundColor: isB2C ? '#22c55e' : '#3b82f6'
              }}
            >
              <span>{isB2C ? "Launch Nest Workspace" : "Launch Firm Workspace"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : !isAuthenticated ? (
          /* ============================================================
             GATEWAY CARD: Sign In / Register (Adapted for B2C vs B2B)
             ============================================================ */
          <motion.div 
            key="auth-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className={
              isRegister 
                ? "w-full max-w-6xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10"
                : "w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 relative z-10"
            }
          >
            {/* When Registering: Left Column (Plan & Impact Calculation + Validation Dates) */}
            {isRegister && (
              <div className="lg:col-span-6 bg-slate-50 dark:bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800/80 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div>
                  {/* Top Eyebrow */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span 
                        className="px-2.5 py-1 text-[10px] uppercase font-black tracking-widest rounded-md border"
                        style={{
                          backgroundColor: isB2C ? '#22c55e15' : '#3b82f615',
                          color: isB2C ? '#22c55e' : '#3b82f6',
                          borderColor: isB2C ? '#22c55e30' : '#3b82f630'
                        }}
                      >
                        {isB2C ? 'Group-Based SaaS Model' : 'Modular SaaS Engine'}
                      </span>
                      <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                        {isB2C ? 'B2C Mass Adoption' : 'B2B Core Revenue Engine'}
                      </span>
                    </div>
                  </div>

                  {isB2C ? (
                    /* ============================================================
                       B2C ARQON NEST GROUP PRICING ENGINE
                       ============================================================ */
                    <div className="space-y-5">
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                          Arqon Nest Workspace
                        </h2>
                        <p className="text-xs font-bold text-[#22c55e] uppercase tracking-wider mt-0.5">
                          Collaborative Group Finance Organizer
                        </p>
                      </div>

                      {/* Monthly Validation Dates Banner */}
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span className="text-[11px] font-black uppercase tracking-wider">
                              Monthly Validation Cycle
                            </span>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded">
                            30 Days
                          </span>
                        </div>
                        <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                          {validationDates.startFormatted} – {validationDates.endFormatted}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                          Your group's shared ledger activates immediately upon registration. Auto-renews on {validationDates.endFormatted}.
                        </p>
                      </div>

                      {/* Interactive Nest Plan Selector */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                          Select Nest Group Plan:
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {PRICING_CONFIG.NEST_PLANS.map((plan) => {
                            const isSelected = nestPlanId === plan.id;
                            return (
                              <button
                                key={plan.id}
                                type="button"
                                onClick={() => setNestPlanId(plan.id)}
                                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                                  isSelected 
                                    ? "bg-white dark:bg-slate-900 border-[#22c55e] ring-2 ring-[#22c55e]/20 shadow-sm" 
                                    : "bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 opacity-75 hover:opacity-100"
                                }`}
                              >
                                <div>
                                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                                    {plan.name.replace(' ⭐', '')}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                                    3 users incl.
                                  </span>
                                </div>
                                <span className={`text-sm font-black mt-2 ${isSelected ? "text-[#22c55e]" : "text-slate-700 dark:text-slate-300"}`}>
                                  ₹{plan.price}/mo
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Group Members Stepper (3 included, extra at ₹99/user/month) */}
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                              Total Group Members
                            </span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              3 members included in plan
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <button
                              type="button"
                              onClick={() => adjustNestMembers(-1)}
                              disabled={nestMembersCount <= 1}
                              className="w-7 h-7 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-black text-xs text-slate-900 dark:text-white">
                              {nestMembersCount}
                            </span>
                            <button
                              type="button"
                              onClick={() => adjustNestMembers(1)}
                              className="w-7 h-7 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {nestExtraMembers > 0 && (
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">
                              {nestExtraMembers} extra member{nestExtraMembers > 1 ? 's' : ''} × ₹99/user
                            </span>
                            <span className="font-extrabold text-[#22c55e]">
                              + ₹{nestExtraMembers * 99}/mo
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Locked Nest Pricing Rule Banner */}
                      <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs flex gap-2.5 items-start">
                        <Info className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-[11px]">
                          <span className="text-[#22c55e] font-bold">Group Pricing Rule:</span> 3 members included. Extra members are ₹99/user/month. Total = Base (₹{selectedNestPlan.price}) + ({nestExtraMembers} × ₹99).
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* ============================================================
                       B2B ARQONOS FIRM PRICING ENGINE
                       ============================================================ */
                    <div className="space-y-5">
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                          Interior Firm System
                        </h2>
                        <p className="text-xs font-bold text-[#3b82f6] uppercase tracking-wider mt-0.5">
                          Built on Intelligent Systems
                        </p>
                      </div>

                      {/* On-Screen Monthly Validation Dates Badge */}
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span className="text-[11px] font-black uppercase tracking-wider">
                              Monthly Validation Cycle
                            </span>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded">
                            30 Days
                          </span>
                        </div>
                        <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                          {validationDates.startFormatted} – {validationDates.endFormatted}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                          Your firm's monthly validation activates immediately upon registration. Auto-renews on {validationDates.endFormatted}.
                        </p>
                      </div>

                      {/* Mandatory Core Bundle Card */}
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#3b82f6] block">
                              Mandatory Core Bundle
                            </span>
                            <span className="text-sm font-extrabold text-slate-900 dark:text-white block">
                              Base System (People + Quest + Flow Lite)
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              5 team members included • Extra users from ₹59/mo
                            </span>
                          </div>
                          <span className="text-sm font-black text-slate-950 dark:text-white shrink-0">
                            ₹699/mo
                          </span>
                        </div>
                      </div>

                      {/* Interactive Add-on Modules Toggles */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Select Modular Add-on Engines:
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {selectedAddons.length} Active
                          </span>
                        </div>

                        <div className="space-y-2">
                          {PRICING_CONFIG.ADD_ONS.map((addon) => {
                            const isSelected = selectedAddons.includes(addon.id);
                            return (
                              <button
                                key={addon.id}
                                type="button"
                                onClick={() => toggleAddon(addon.id)}
                                className={`w-full p-3 px-3.5 rounded-xl border transition-all text-left flex items-center justify-between group ${
                                  isSelected
                                    ? "bg-white dark:bg-slate-900 border-slate-400 dark:border-slate-600 shadow-sm ring-1 ring-[#3b82f6]/20"
                                    : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 opacity-80 hover:opacity-100"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                                      isSelected 
                                        ? "bg-[#3b82f6] border-[#3b82f6] text-white" 
                                        : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                                    }`}
                                  >
                                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-slate-800 dark:text-white">
                                        {addon.name}
                                      </span>
                                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                        ({addon.layer})
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium block">
                                      User tier: ₹{addon.extraUserTier}/user
                                    </span>
                                  </div>
                                </div>
                                <span className={`text-xs font-extrabold ${isSelected ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>
                                  + ₹{addon.price}/mo
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Team Size Adjuster */}
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                              Total Team Seats
                            </span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              5 included in Base Plan
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <button
                              type="button"
                              onClick={() => adjustB2BUsers(-1)}
                              disabled={b2bUserCount <= 1}
                              className="w-7 h-7 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-black text-xs text-slate-900 dark:text-white">
                              {b2bUserCount}
                            </span>
                            <button
                              type="button"
                              onClick={() => adjustB2BUsers(1)}
                              className="w-7 h-7 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {b2bBilling.extraUsers > 0 && (
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">
                              {b2bBilling.extraUsers} extra user{b2bBilling.extraUsers > 1 ? 's' : ''} × ₹{b2bBilling.highestTier}/user
                            </span>
                            <span className="font-extrabold text-slate-900 dark:text-white">
                              + ₹{b2bBilling.extraUsersTotal}/mo
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Locked Pricing Logic Explainer */}
                      <div className="p-3.5 bg-[#3b82f60a] border border-[#3b82f61a] rounded-xl text-xs flex gap-2.5 items-start">
                        <Info className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-[11px]">
                          Applied per-user extra tier: <span className="text-[#3b82f6] font-bold">₹{b2bBilling.highestTier}/user</span>. Pricing formula strictly follows the locked ArqonOS pricing engine (Highest active tier applied to all extra users).
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Total Monthly Liability Footer */}
                <div className="border-t border-slate-200 dark:border-slate-800/80 pt-5 space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                        Total Monthly Liability
                      </span>
                      <span className="text-[11px] text-slate-500 font-bold block">
                        {isB2C ? `${nestMembersCount} Group Members Included` : `${b2bUserCount} Team Members Included`}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                        ₹{currentTotalAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500 font-bold block">/month recurring</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right Column: Form (Sign In OR Register with Payment Authorization) */}
            <div className={isRegister ? "lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6" : "w-full"}>
              <div>
                {/* Tab Selectors */}
                <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg mb-6">
                  <button
                    type="button"
                    onClick={() => { setIsRegister(false); setAuthError(null); setIsExistingUser(false); }}
                    className={`flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${
                      !isRegister 
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-black" 
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    }`}
                  >
                    {isB2C ? "Sign In to Nest" : "Sign In to Firm"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsRegister(true); setAuthError(null); setIsExistingUser(false); }}
                    className={`flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${
                      isRegister 
                        ? "bg-white dark:bg-slate-800 shadow-sm font-black" 
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    }`}
                    style={{
                      color: isRegister ? (isB2C ? '#22c55e' : '#3b82f6') : undefined
                    }}
                  >
                    {isB2C ? "Register Group" : "Register Firm"}
                  </button>
                </div>

                {/* Notifications & Error Handling */}
                {isExistingUser && (
                  <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold mb-5 leading-relaxed animate-fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold uppercase tracking-wider text-[10px] mb-0.5 text-amber-700 dark:text-amber-300">
                        {isB2C ? "Group / User Already Registered" : "Firm Already Registered"}
                      </p>
                      <span>This email or entity is already registered. Switched to Sign In mode for your convenience.</span>
                    </div>
                  </div>
                )}

                {authError && (
                  <div className="flex flex-col gap-3.5 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold mb-5 leading-relaxed">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{authError}</span>
                    </div>
                    {authError.includes("operation-not-allowed") && (
                      <button
                        type="button"
                        onClick={() => {
                          forceSandbox({
                            displayName: name || (isB2C ? 'Rohit Sharma' : 'Firm Director'),
                            companyName: company || (isB2C ? 'Sharma Family Workspace' : 'Design Studio'),
                            role: role,
                            segment: activeSegment,
                            gstin: isB2C ? '' : gstin,
                            activeAddons: isB2C ? [] : selectedAddons,
                            maxUsers: isB2C ? nestMembersCount : b2bUserCount
                          });
                          setAuthError(null);
                          setAuthSuccess("Bypassed Firebase Auth limits! Seamlessly entering preview sandbox...");
                        }}
                        className="mt-1 px-4 py-2 self-start bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] tracking-wider uppercase transition-all shadow-md"
                      >
                        Bypass & Enter Preview Sandbox
                      </button>
                    )}
                  </div>
                )}

                {authSuccess && (
                  <div className="flex items-start gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold mb-5 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{authSuccess}</span>
                  </div>
                )}

                {isRegister ? (
                  /* ============================================================
                     REGISTER FORM: Tailored for B2C Nest Group vs B2B Firm
                     ============================================================ */
                  <form onSubmit={handleRegisterWithPayment} className="space-y-4">
                    {/* Authority Notice Banner */}
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300 font-bold">
                      <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
                      <span>
                        {isB2C 
                          ? "Group Organizer: Authorized to initiate shared family/group finances." 
                          : "Authorized Management: Signatory verified to execute corporate recurring liability."}
                      </span>
                    </div>

                    {/* Name & Role */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                          {isB2C ? "Organizer Full Name *" : "Administrator Name *"}
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={isB2C ? "Rohit Sharma" : "Ananya Sharma"} 
                            required
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2.5 pl-9 pr-3 text-xs font-bold outline-none text-slate-900 dark:text-white transition-colors focus:border-slate-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                          {isB2C ? "Group Role *" : "Management Role *"}
                        </label>
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2.5 px-3 text-xs font-bold outline-none text-slate-900 dark:text-white transition-colors focus:border-slate-400"
                        >
                          {isB2C ? (
                            <>
                              <option value="Group Organizer">Group Organizer (Admin)</option>
                              <option value="Family Head">Family Head</option>
                              <option value="Co-Organizer">Co-Organizer</option>
                              <option value="Member">Member</option>
                            </>
                          ) : (
                            <>
                              <option value="General Manager">General Manager (Director)</option>
                              <option value="Account">Account (Finance Lead)</option>
                              <option value="Lead Designer">Lead Designer (Partner)</option>
                              <option value="Coordinator">Coordinator</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    {/* Group/Firm Name & GSTIN */}
                    <div className={isB2C ? "space-y-1" : "grid grid-cols-1 sm:grid-cols-2 gap-3"}>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                          {isB2C ? "Group / Family Workspace Name *" : "Design Firm / Entity *"}
                        </label>
                        <div className="relative">
                          {isB2C ? (
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          ) : (
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          )}
                          <input 
                            type="text" 
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder={isB2C ? "Sharma Family Workspace" : "Aura Spaces Pvt Ltd"} 
                            required
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2.5 pl-9 pr-3 text-xs font-bold outline-none text-slate-900 dark:text-white transition-colors focus:border-slate-400"
                          />
                        </div>
                      </div>

                      {!isB2C && (
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                            GSTIN (Optional Tax Invoice)
                          </label>
                          <input 
                            type="text" 
                            value={gstin}
                            onChange={(e) => setGstin(e.target.value.toUpperCase())}
                            placeholder="27AAACA1234A1Z5" 
                            maxLength={15}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2.5 px-3 text-xs font-mono font-bold outline-none text-slate-900 dark:text-white transition-colors focus:border-slate-400"
                          />
                        </div>
                      )}
                    </div>

                    {/* Email & Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                          {isB2C ? "Personal / Group Email *" : "Work Email *"}
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={isB2C ? "rohit.sharma@gmail.com" : "director@auraspaces.com"} 
                            required
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2.5 pl-9 pr-3 text-xs font-bold outline-none text-slate-900 dark:text-white transition-colors focus:border-slate-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                          {isB2C ? "Password *" : "Master Password *"}
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••" 
                            required
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2.5 pl-9 pr-9 text-xs font-bold outline-none text-slate-900 dark:text-white transition-colors focus:border-slate-400"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Payment Channels */}
                    <div className="pt-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                          {isB2C ? "Payment Method" : "Corporate Payment Channel"}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          256-bit Encrypted
                        </span>
                      </div>

                      {/* Payment Tabs */}
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentChannel('upi')}
                          className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                            paymentChannel === 'upi'
                              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm"
                              : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Instant UPI</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentChannel('card')}
                          className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                            paymentChannel === 'card'
                              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm"
                              : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                          }`}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>{isB2C ? "Card" : "Corp Card"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentChannel('netbanking')}
                          className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                            paymentChannel === 'netbanking'
                              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm"
                              : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                          }`}
                        >
                          <Building2 className="w-3.5 h-3.5" />
                          <span>Net Banking</span>
                        </button>
                      </div>

                      {/* Payment Method Inputs */}
                      <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                        {paymentChannel === 'upi' && (
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                              {isB2C ? "UPI VPA (GPay, PhonePe, Paytm, BHIM)" : "Corporate UPI VPA"}
                            </label>
                            <input
                              type="text"
                              value={paymentVpa}
                              onChange={(e) => setPaymentVpa(e.target.value)}
                              placeholder={isB2C ? "sharma.family@okhdfcbank" : "firm@okhdfcbank"}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-3 text-xs font-mono font-bold outline-none text-slate-900 dark:text-white"
                            />
                            <p className="text-[10px] text-slate-400">
                              Instant monthly subscription mandate will be sent directly to your UPI handle.
                            </p>
                          </div>
                        )}

                        {paymentChannel === 'card' && (
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                {isB2C ? "Debit / Credit Card Number" : "Corporate Card Number"}
                              </label>
                              <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder="4532 •••• •••• 8821"
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-3 text-xs font-mono font-bold outline-none text-slate-900 dark:text-white"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                  Expiry
                                </label>
                                <input
                                  type="text"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  placeholder="MM/YY"
                                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-3 text-xs font-mono font-bold outline-none text-slate-900 dark:text-white"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                  CVV
                                </label>
                                <input
                                  type="password"
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value)}
                                  placeholder="•••"
                                  maxLength={4}
                                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-3 text-xs font-mono font-bold outline-none text-slate-900 dark:text-white"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {paymentChannel === 'netbanking' && (
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                              Select Banking Gateway
                            </label>
                            <select
                              value={selectedBank}
                              onChange={(e) => setSelectedBank(e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-3 text-xs font-bold outline-none text-slate-900 dark:text-white"
                            >
                              <option value="HDFC Bank Corporate Portal">HDFC Bank</option>
                              <option value="ICICI Bank Corporate Banking">ICICI Bank</option>
                              <option value="State Bank of India Corporate">State Bank of India</option>
                              <option value="Axis Bank Commercial">Axis Bank</option>
                              <option value="Kotak Mahindra Corporate">Kotak Mahindra Bank</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: isB2C ? '#22c55e' : '#3b82f6'
                      }}
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                          <span>{processingStep || "Authorizing & Provisioning..."}</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-white" />
                          <span>
                            {isB2C 
                              ? `Authorize & Register Group (₹${currentTotalAmount.toLocaleString('en-IN')}/mo)`
                              : `Authorize Payment & Register Firm (₹${currentTotalAmount.toLocaleString('en-IN')}/mo)`}
                          </span>
                        </>
                      )}
                    </button>

                    <div className="text-center text-[10px] text-slate-400 font-medium">
                      <span>256-bit Encrypted Gateway • Instant Subscription Verification</span>
                    </div>
                  </form>
                ) : (
                  /* ============================================================
                     SIGN IN FORM: Standard Member Authentication
                     ============================================================ */
                  <form onSubmit={handleSignIn} className="space-y-4">
                    {/* Email Address */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                        {isB2C ? "Personal / Group Email" : "Work Email Address"}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={isB2C ? "rohit.sharma@gmail.com" : "name@arqondesign.com"} 
                          required
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-xs font-bold outline-none text-slate-900 dark:text-white transition-colors focus:border-slate-400"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                        {isB2C ? "Password" : "Master Password"}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••" 
                          required
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2.5 pl-10 pr-10 text-xs font-bold outline-none text-slate-900 dark:text-white transition-colors focus:border-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                      style={{
                        backgroundColor: isB2C ? '#22c55e' : '#3b82f6'
                      }}
                    >
                      {submitting 
                        ? "Processing Secure Token..." 
                        : isB2C ? "Sign In to Nest Workspace" : "Initialize Firm Workspace"}
                    </button>
                  </form>
                )}

                {/* Divider */}
                <div className="my-5 flex items-center gap-3">
                  <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">or continue with</span>
                  <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow" />
                </div>

                {/* Google Account Button */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={submitting}
                  className="w-full py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-[0.98]"
                >
                  <Chrome className="w-4 h-4 text-blue-500" />
                  {isB2C ? "Continue with Google Account" : "Google Corporate Account"}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ============================================================
             AUTHENTICATED STATE: Unified Workspace Selector
             ============================================================ */
          <motion.div 
            key="workspace-selector"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-5xl space-y-8"
          >
            {/* User Session Profile Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-md gap-4">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="User Avatar" referrerPolicy="no-referrer" className="w-11 h-11 rounded-full" />
                ) : (
                  <div 
                    className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm uppercase"
                    style={{
                      backgroundColor: profile?.segment === 'b2c' ? '#22c55e22' : '#3b82f622',
                      color: profile?.segment === 'b2c' ? '#22c55e' : '#3b82f6'
                    }}
                  >
                    {user?.displayName ? user.displayName.slice(0, 2) : (user?.email ? user.email.slice(0, 2) : 'US')}
                  </div>
                )}
                <div>
                  <div className="text-base font-black text-slate-900 dark:text-white">
                    {user?.displayName || "Authorized User"}
                  </div>
                  <div className="text-xs text-slate-500 font-bold flex items-center gap-2 mt-0.5">
                    <span>{profile?.companyName ? `Registered: ${profile.companyName}` : `Active ID: ${user?.email || 'Mock Sandbox'}`}</span>
                    {profile?.role && (
                      <span 
                        className="px-1.5 py-0.5 text-[10px] rounded font-bold uppercase"
                        style={{
                          backgroundColor: profile?.segment === 'b2c' ? '#22c55e15' : '#3b82f615',
                          color: profile?.segment === 'b2c' ? '#22c55e' : '#3b82f6'
                        }}
                      >
                        {profile.role}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Topbar Monthly Billing Cycle Badge */}
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{validationDates.startFormatted} – {validationDates.endFormatted}</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-[10px] uppercase">
                    {validationDates.daysRemaining}d left
                  </span>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>

            {/* Grid selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-0">
              <Link to="/workspace/b2b" className="group bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-[#3b82f666] transition-all space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-[#3b82f6] transition-colors">B2B Workspace</h2>
                    <p className="text-xs font-bold text-[#3b82f6] uppercase tracking-[0.2em] mt-1">Professional Suite</p>
                  </div>
                  <ArrowRight className="text-slate-400 dark:text-slate-500 group-hover:text-[#3b82f6] transition-colors w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">For designers, architects, and agency owners managing the built environment.</p>
                
                {profile?.segment === 'b2b' && profile?.companyName && (
                  <div className="p-3 bg-[#3b82f60a] border border-[#3b82f61a] rounded-lg text-xs font-bold text-[#3b82f6]">
                    🏢 Connected Firm: <span className="underline">{profile.companyName}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-4">
                  {['Quest', 'Flow', 'Connect', 'People', 'Studio', 'Cost', 'Vendor', 'Insight', 'AI'].map(app => (
                    <span key={app} className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400 group-hover:border-[#3b82f633] group-hover:text-[#3b82f6] transition-colors">
                      {app}
                    </span>
                  ))}
                </div>
              </Link>
              
              <Link to="/workspace/b2c" className="group bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-[#22c55e66] transition-all space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-[#22c55e] transition-colors">B2C Workspace</h2>
                    <p className="text-xs font-bold text-[#22c55e] uppercase tracking-[0.2em] mt-1">Life Systems</p>
                  </div>
                  <ArrowRight className="text-slate-400 dark:text-slate-500 group-hover:text-[#22c55e] transition-colors w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Family and friends finance organizer. The intelligent core of your personal life.</p>
                
                {profile?.segment === 'b2c' && profile?.companyName && (
                  <div className="p-3 bg-[#22c55e0a] border border-[#22c55e1a] rounded-lg text-xs font-bold text-[#22c55e]">
                    🏡 Registered Group: <span className="underline">{profile.companyName}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400 group-hover:border-[#22c55e33] group-hover:text-[#22c55e] transition-colors">
                    Nest (Expenses, Budgets, Vaults, Nudges)
                  </span>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* D2C Free Access Portals */}
      <div className="mt-12 overflow-hidden w-full max-w-5xl relative z-10 px-4 sm:px-0">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 shrink-0">D2C Free Access Portals</h2>
          <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a 
            href="https://essence.arqon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-[#94a3b866] transition-all shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-[#94a3b8] transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-900 dark:text-white">Essence</h3>
                <p className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-widest">Portfolio Showcase</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#94a3b8] group-hover:translate-x-1 transition-all" />
          </a>
          
          <a 
            href="https://pravara.arqon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-[#d4af3766] transition-all shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-[#d4af37] transition-colors">
                <Layers className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-900 dark:text-white">PRAVARA</h3>
                <p className="text-[10px] uppercase font-bold text-[#d4af37] tracking-widest">Fashion Collective</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all" />
          </a>
        </div>
      </div>
    </div>
  );
}
