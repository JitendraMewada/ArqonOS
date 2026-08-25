import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

let app: any = null;
let db: any = null;
let auth: any = null;
let storage: any = null;

try {
  if (firebaseConfig && (firebaseConfig as any).projectId) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    
    // Initialize Firestore with specific databaseId if provided
    const databaseId = (firebaseConfig as any).firestoreDatabaseId;
    if (databaseId) {
      db = getFirestore(app, databaseId);
    } else {
      db = getFirestore(app);
    }
    
    auth = getAuth(app);
    
    try {
      storage = getStorage(app);
    } catch (storageErr) {
      console.warn("Firebase Storage optional init:", storageErr);
    }
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { app, db, auth, storage };
