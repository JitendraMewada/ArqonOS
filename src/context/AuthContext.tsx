import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  companyName?: string;
  role?: string;
  gstin?: string;
  subscriptionTier?: 'Starter' | 'Plus' | 'Pro' | 'Enterprise';
  createdAt?: string;
  segment?: 'b2b' | 'b2c';
  activeAddons?: string[];
  maxUsers?: number;
  planId?: string;
  billingCycleStart?: string;
  billingCycleEnd?: string;
  subscriptionValidUntil?: string;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  lastTransactionId?: string;
  paymentMethod?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (
    email: string, 
    pass: string, 
    name: string, 
    company?: string,
    initData?: {
      segment?: 'b2b' | 'b2c';
      addons?: string[];
      users?: number;
      planId?: string;
      role?: string;
      gstin?: string;
      billingCycleStart?: string;
      billingCycleEnd?: string;
      subscriptionValidUntil?: string;
      lastPaymentDate?: string;
      lastPaymentAmount?: number;
      lastTransactionId?: string;
      paymentMethod?: string;
    }
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  forceSandbox: (customProfile?: Partial<UserProfile>) => void;
  isMockMode: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth not initialized. Running in Mock Mode.");
      setIsMockMode(true);
      // Fallback to a mock-dev user for local preview environment
      const mockProfile: UserProfile = {
        uid: 'mock-dev-user-id',
        email: 'preview@arqonos.com',
        displayName: 'Arqon Preview User',
        photoURL: null,
        companyName: 'ArqonOS Labs',
        role: 'General Manager',
        subscriptionTier: 'Pro',
        createdAt: new Date().toISOString()
      };
      setProfile(mockProfile);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Attempt to retrieve profile from Firestore
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Build and persist a initial user profile
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              subscriptionTier: 'Starter',
              createdAt: new Date().toISOString()
            };
            await setDoc(docRef, newProfile);
            setProfile(newProfile);
          }
        } catch (err) {
          console.error("Error reading/writing Firestore user profile:", err);
          // Graceful fallback to client profile state
          setProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            subscriptionTier: 'Starter'
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    if (isMockMode) {
      console.log("Mock Mode Google Auth Succeeded");
      return;
    }
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (isMockMode) {
      console.log("Mock Mode Email Login Succeeded for:", email);
      return;
    }
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (
    email: string, 
    pass: string, 
    name: string, 
    company?: string,
    initData?: {
      segment?: 'b2b' | 'b2c';
      addons?: string[];
      users?: number;
      planId?: string;
      role?: string;
      gstin?: string;
      billingCycleStart?: string;
      billingCycleEnd?: string;
      subscriptionValidUntil?: string;
      lastPaymentDate?: string;
      lastPaymentAmount?: number;
      lastTransactionId?: string;
      paymentMethod?: string;
    }
  ) => {
    if (isMockMode) {
      console.log("Mock Mode Email Signup Succeeded for:", email);
      return;
    }
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: name });
      
      let initialTier: 'Starter' | 'Plus' | 'Pro' | 'Enterprise' = 'Starter';
      if (initData?.segment === 'b2c') {
        if (initData.planId === 'starter') initialTier = 'Starter';
        else if (initData.planId === 'plus') initialTier = 'Plus';
        else if (initData.planId === 'pro') initialTier = 'Pro';
      } else if (initData?.segment === 'b2b') {
        if (initData?.addons && initData.addons.length > 3) {
          initialTier = 'Pro';
        } else {
          initialTier = 'Plus';
        }
      }

      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: name,
        photoURL: null,
        companyName: company || 'My Firm',
        role: initData?.role || 'General Manager',
        gstin: initData?.gstin || '',
        subscriptionTier: initialTier,
        segment: initData?.segment || 'b2b',
        activeAddons: initData?.addons || [],
        maxUsers: initData?.users || 5,
        planId: initData?.planId || '',
        billingCycleStart: initData?.billingCycleStart,
        billingCycleEnd: initData?.billingCycleEnd,
        subscriptionValidUntil: initData?.subscriptionValidUntil,
        lastPaymentDate: initData?.lastPaymentDate || new Date().toISOString(),
        lastPaymentAmount: initData?.lastPaymentAmount,
        lastTransactionId: initData?.lastTransactionId,
        paymentMethod: initData?.paymentMethod,
        createdAt: new Date().toISOString()
      };
      
      try {
        await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      } catch (err) {
        console.error("Firestore user profile save failed:", err);
      }
      setProfile(newProfile);
    }
  };

  const logout = async () => {
    if (isMockMode) {
      console.log("Mock Mode Sign Out Succeeded");
      setUser(null);
      setProfile(null);
      setIsMockMode(false);
      return;
    }
    await signOut(auth);
  };

  const forceSandbox = (customProfile?: Partial<UserProfile>) => {
    setIsMockMode(true);
    const mockProfile: UserProfile = {
      uid: 'mock-dev-user-id',
      email: customProfile?.email || 'preview@arqonos.com',
      displayName: customProfile?.displayName || 'Arqon Preview User',
      photoURL: null,
      companyName: customProfile?.companyName || 'ArqonOS Labs',
      role: customProfile?.role || 'General Manager',
      gstin: customProfile?.gstin || '27AAACA1234A1Z5',
      subscriptionTier: customProfile?.subscriptionTier || 'Pro',
      segment: customProfile?.segment || 'b2b',
      activeAddons: customProfile?.activeAddons || ['connect', 'studio'],
      maxUsers: customProfile?.maxUsers || 5,
      billingCycleStart: customProfile?.billingCycleStart,
      billingCycleEnd: customProfile?.billingCycleEnd,
      subscriptionValidUntil: customProfile?.subscriptionValidUntil,
      lastPaymentDate: customProfile?.lastPaymentDate || new Date().toISOString(),
      lastPaymentAmount: customProfile?.lastPaymentAmount || 699,
      lastTransactionId: customProfile?.lastTransactionId || `TXN-ARQON-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      paymentMethod: customProfile?.paymentMethod || 'Instant UPI',
      createdAt: new Date().toISOString(),
      ...customProfile
    };
    setProfile(mockProfile);
    setUser({ uid: mockProfile.uid, email: mockProfile.email } as any);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user && !isMockMode) return;
    const updated = { ...profile, ...data } as UserProfile;
    setProfile(updated);
    
    if (user && db) {
      try {
        await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
      } catch (err) {
        console.error("Error updating Firestore profile:", err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      loginWithGoogle,
      loginWithEmail,
      signUpWithEmail,
      logout,
      updateUserProfile,
      forceSandbox,
      isMockMode
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
