import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { db, auth } from '../../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Types
export interface Project {
  id: string;
  name: string;
  code: string;
  clientName: string;
  clientContact: string;
  clientEmail: string;
  type: string;
  status: 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  mapLocation: string;
  landmark: string;
  estimatedBudget: number;
  approvedBudget: number;
  currentCost: number;
  startDate: string;
  endDate: string;
  totalArea: number;
  builtUpArea: number;
  carpetArea: number;
  unitType: string;
  roomsCount: number;
  notes: string;
  createdAt: any;
  updatedAt: any;
  ownerId: string;
}

export interface TeamMember {
  id: string;
  projectId: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  assignedAt: any;
}

export interface Dimension {
  id: string;
  projectId: string;
  roomName: string;
  length: number;
  width: number;
  height: number;
  doorCount: number;
  doorWidth: number;
  doorHeight: number;
  windowCount: number;
  windowWidth: number;
  windowHeight: number;
  sillHeight: number;
  lintelHeight: number;
  floorCount: number;
  ceilingCount: number;
  ceilingHeight: number;
  wallCount: number;
  beamCount: number;
  beamHeight: number;
  beamWidth: number;
  notes: string;
  attachments: string[];
}

export interface Space {
  id: string;
  projectId: string;
  dimensionRoomId?: string;
  spaceName: string;
  spaceType: string;
  status: string;
  proposedLength: number;
  proposedWidth: number;
  proposedHeight: number;
  doorCount: number;
  doorWidth: number;
  doorHeight: number;
  windowCount: number;
  windowWidth: number;
  windowHeight: number;
  wallAddedCount: number;
  wallRemovedCount: number;
  falseCeilingRequired: boolean;
  ceilingType: string;
  floorFinishType: string;
  paintFinish: string;
  notes: string;
}

export interface Asset {
  id: string;
  projectId: string;
  name: string;
  folder: 'Drawing Ledger' | 'Library' | 'FF&E' | '3D View';
  subCategory?: string;
  type: string;
  url: string;
  size: number;
  version?: string;
  notes?: string;
  createdAt: any;
  updatedAt: any;
}

export interface MoodboardElement {
  id: string;
  type: 'image' | 'text' | 'pointer' | 'color';
  content: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  zIndex?: number;
  label?: string;
  pointerTo?: { x: number, y: number };
  dropShadow?: boolean;
  isVellum?: boolean;
}

export interface Moodboard {
  id: string;
  projectId: string;
  name: string;
  layoutType: 'grid' | 'artistic';
  // Legacy fields for grid
  heroSlot?: string;
  narrative?: string;
  technicalGrid?: string[];
  materialPalette?: string[];
  colorPalette?: string[];
  // New fields for artistic
  elements?: MoodboardElement[];
  createdAt: any;
  updatedAt: any;
}

interface StudioContextType {
  projects: Project[];
  activeProject: Project | null;
  loading: boolean;
  setActiveProject: (project: Project | null) => void;
  createProject: (data: Partial<Project>) => Promise<string>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  seedMockProjects: () => Promise<void>;
  // Project specific data fetches simplified for the draft
  fetchProjectMembers: (projectId: string) => Promise<TeamMember[]>;
  addProjectMember: (projectId: string, memberData: Partial<TeamMember>) => Promise<void>;
  removeProjectMember: (projectId: string, memberId: string) => Promise<void>;
  fetchProjectDimensions: (projectId: string) => Promise<Dimension[]>;
  addProjectDimension: (projectId: string, dimensionData: Partial<Dimension>) => Promise<void>;
  fetchProjectSpaces: (projectId: string) => Promise<Space[]>;
  addProjectSpace: (projectId: string, spaceData: Partial<Space>) => Promise<void>;
  // Sketches
  fetchProjectSketches: (projectId: string) => Promise<any[]>;
  createProjectSketch: (projectId: string, sketchData: any) => Promise<string>;
  updateProjectSketch: (projectId: string, sketchId: string, data: any) => Promise<void>;
  deleteProjectSketch: (projectId: string, sketchId: string) => Promise<void>;
  // Assets
  fetchProjectAssets: (projectId: string) => Promise<Asset[]>;
  createProjectAsset: (projectId: string, assetData: any) => Promise<string>;
  updateProjectAsset: (projectId: string, assetId: string, data: any) => Promise<void>;
  deleteProjectAsset: (projectId: string, assetId: string) => Promise<void>;
  // Moodboards
  fetchProjectMoodboards: (projectId: string) => Promise<Moodboard[]>;
  createProjectMoodboard: (projectId: string, moodboardData: any) => Promise<string>;
  updateProjectMoodboard: (projectId: string, moodboardId: string, data: any) => Promise<void>;
  deleteProjectMoodboard: (projectId: string, moodboardId: string) => Promise<void>;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-alpha",
    name: "Project Alpha",
    code: "PA-001",
    clientName: "Alpha Corp",
    clientContact: "+1 (555) 123-4567",
    clientEmail: "contact@alphacorp.com",
    type: "Commercial",
    status: "Active",
    priority: "High",
    address: "123 Alpha Way",
    city: "New York",
    state: "NY",
    country: "USA",
    pincode: "10001",
    mapLocation: "",
    landmark: "Times Square",
    estimatedBudget: 500000,
    approvedBudget: 450000,
    currentCost: 150000,
    startDate: "2026-05-01",
    endDate: "2026-11-01",
    totalArea: 5000,
    builtUpArea: 4800,
    carpetArea: 4500,
    unitType: "Office",
    roomsCount: 15,
    notes: "High priority commercial project derived from Quest.",
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: "mock-dev-user-id"
  },
  {
    id: "proj-comp",
    name: "Company Workspace",
    code: "CW-002",
    clientName: "Internal",
    clientContact: "",
    clientEmail: "hello@company.com",
    type: "Commercial",
    status: "Active",
    priority: "Medium",
    address: "456 Skyline Drive",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    pincode: "94105",
    mapLocation: "",
    landmark: "Bay Bridge",
    estimatedBudget: 1200000,
    approvedBudget: 1200000,
    currentCost: 300000,
    startDate: "2026-06-01",
    endDate: "2027-06-01",
    totalArea: 12000,
    builtUpArea: 10000,
    carpetArea: 9500,
    unitType: "HQ",
    roomsCount: 40,
    notes: "Internal workspace optimization.",
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: "mock-dev-user-id"
  },
  {
    id: "proj-nexa",
    name: "Nexa Skyline",
    code: "NS-003",
    clientName: "Nexa Real Estate",
    clientContact: "+1 (555) 987-6543",
    clientEmail: "hello@nexa.com",
    type: "Residential",
    status: "Active",
    priority: "High",
    address: "456 Skyline Drive",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    pincode: "94105",
    mapLocation: "",
    landmark: "Bay Bridge",
    estimatedBudget: 1200000,
    approvedBudget: 1200000,
    currentCost: 300000,
    startDate: "2026-06-01",
    endDate: "2027-06-01",
    totalArea: 12000,
    builtUpArea: 10000,
    carpetArea: 9500,
    unitType: "Apartment Building",
    roomsCount: 40,
    notes: "Luxury residential complex.",
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: "mock-dev-user-id"
  },
  {
    id: "proj-team-b",
    name: "Team Building",
    code: "TB-004",
    clientName: "Internal",
    clientContact: "",
    clientEmail: "hello@company.com",
    type: "Commercial",
    status: "Active",
    priority: "Low",
    address: "123 Alpha Way",
    city: "New York",
    state: "NY",
    country: "USA",
    pincode: "10001",
    mapLocation: "",
    landmark: "",
    estimatedBudget: 50000,
    approvedBudget: 50000,
    currentCost: 0,
    startDate: "2026-07-01",
    endDate: "2026-08-01",
    totalArea: 2000,
    builtUpArea: 2000,
    carpetArea: 2000,
    unitType: "Office",
    roomsCount: 5,
    notes: "Team building project.",
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: "mock-dev-user-id"
  },
  {
    id: "proj-acme",
    name: "Acme Corp",
    code: "ACQ-005",
    clientName: "Acme Corporation",
    clientContact: "+1 (555) 234-5678",
    clientEmail: "facilities@acme.com",
    type: "Commercial",
    status: "On Hold",
    priority: "Medium",
    address: "789 Acme Blvd",
    city: "Austin",
    state: "TX",
    country: "USA",
    pincode: "73301",
    mapLocation: "",
    landmark: "Domain",
    estimatedBudget: 850000,
    approvedBudget: 800000,
    currentCost: 50000,
    startDate: "2026-08-01",
    endDate: "2027-02-01",
    totalArea: 8000,
    builtUpArea: 7500,
    carpetArea: 7000,
    unitType: "Office HQ",
    roomsCount: 25,
    notes: "Awaiting final approval for structural changes.",
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: "mock-dev-user-id"
  },
  {
    id: "proj-int-ops",
    name: "Internal Ops",
    code: "IO-006",
    clientName: "Internal",
    clientContact: "",
    clientEmail: "ops@company.com",
    type: "Commercial",
    status: "Active",
    priority: "High",
    address: "123 Alpha Way",
    city: "New York",
    state: "NY",
    country: "USA",
    pincode: "10001",
    mapLocation: "",
    landmark: "",
    estimatedBudget: 150000,
    approvedBudget: 150000,
    currentCost: 20000,
    startDate: "2026-05-01",
    endDate: "2026-12-01",
    totalArea: 5000,
    builtUpArea: 4800,
    carpetArea: 4800,
    unitType: "Office",
    roomsCount: 15,
    notes: "Internal operations optimizations.",
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: "mock-dev-user-id"
  }
];

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.warn("Auth is not initialized, using mock mode");
      setUser({ uid: 'mock-dev-user-id', email: 'preview@arqonos.com' });
      return;
    }
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        // Provide a mock user for the preview environment when not authenticated
        setUser({ uid: 'mock-dev-user-id', email: 'preview@arqonos.com' });
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    if (user.uid === 'mock-dev-user-id') {
      // Use local state for mock user
      setProjects(MOCK_PROJECTS);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'projects'),
      where('ownerId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(projs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching projects:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createProject = async (data: Partial<Project>) => {
    if (!user) throw new Error("User not authenticated");
    
    const projectData = {
      ...data,
      ownerId: user.uid,
      status: 'Active',
      priority: 'Medium',
      estimatedBudget: 0,
      currentCost: 0,
      approvedBudget: 0
    };

    if (user.uid === 'mock-dev-user-id') {
      const id = "mock-" + Date.now().toString();
      const newProj = {
        ...projectData,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Project;
      setProjects(prev => [...prev, newProj]);
      return id;
    }

    const docRef = await addDoc(collection(db, 'projects'), {
      ...projectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    if (user?.uid === 'mock-dev-user-id') {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data, updatedAt: new Date() } as Project : p));
      return;
    }
    const docRef = doc(db, 'projects', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  };

  const deleteProject = async (id: string) => {
    if (user?.uid === 'mock-dev-user-id') {
      setProjects(prev => prev.filter(p => p.id !== id));
      return;
    }
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
    }
  };

  const fetchProjectMembers = async (projectId: string) => {
    if (user?.uid === 'mock-dev-user-id') {
      const stored = localStorage.getItem(`mock_team_${projectId}`);
      if (stored) return JSON.parse(stored);
      return [];
    }
    const q = collection(db, 'projects', projectId, 'team');
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
  };

  const addProjectMember = async (projectId: string, memberData: Partial<TeamMember>) => {
    if (user?.uid === 'mock-dev-user-id') {
      const stored = localStorage.getItem(`mock_team_${projectId}`);
      const members = stored ? JSON.parse(stored) : [];
      const newMember = { ...memberData, id: `mock-member-${Date.now()}`, projectId } as TeamMember;
      localStorage.setItem(`mock_team_${projectId}`, JSON.stringify([...members, newMember]));
      return;
    }
    await addDoc(collection(db, 'projects', projectId, 'team'), {
      ...memberData,
      projectId,
      assignedAt: serverTimestamp()
    });
  };

  const removeProjectMember = async (projectId: string, memberId: string) => {
    if (user?.uid === 'mock-dev-user-id') {
       const stored = localStorage.getItem(`mock_team_${projectId}`);
       if (stored) {
         const members = JSON.parse(stored).filter((m: any) => m.id !== memberId);
         localStorage.setItem(`mock_team_${projectId}`, JSON.stringify(members));
       }
       return;
    }
    await deleteDoc(doc(db, 'projects', projectId, 'team', memberId));
  };

  const fetchProjectDimensions = async (projectId: string) => {
    if (user?.uid === 'mock-dev-user-id') {
      const stored = localStorage.getItem(`mock_dim_${projectId}`);
      if (stored) return JSON.parse(stored);
      return [];
    }
    const q = collection(db, 'projects', projectId, 'dimensions');
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dimension));
  };

  const addProjectDimension = async (projectId: string, dimensionData: Partial<Dimension>) => {
    if (user?.uid === 'mock-dev-user-id') {
      const stored = localStorage.getItem(`mock_dim_${projectId}`);
      const dims = stored ? JSON.parse(stored) : [];
      const newDim = { ...dimensionData, id: `mock-dim-${Date.now()}`, projectId } as Dimension;
      localStorage.setItem(`mock_dim_${projectId}`, JSON.stringify([...dims, newDim]));
      return;
    }
    await addDoc(collection(db, 'projects', projectId, 'dimensions'), {
      ...dimensionData,
      projectId,
      createdAt: serverTimestamp()
    });
  };

  const fetchProjectSpaces = async (projectId: string) => {
    if (user?.uid === 'mock-dev-user-id') {
      const stored = localStorage.getItem(`mock_space_${projectId}`);
      if (stored) return JSON.parse(stored);
      return [];
    }
    const q = collection(db, 'projects', projectId, 'spaces');
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Space));
  };

  const addProjectSpace = async (projectId: string, spaceData: Partial<Space>) => {
    if (user?.uid === 'mock-dev-user-id') {
      const stored = localStorage.getItem(`mock_space_${projectId}`);
      const spaces = stored ? JSON.parse(stored) : [];
      const newSpace = { ...spaceData, id: `mock-space-${Date.now()}`, projectId } as Space;
      localStorage.setItem(`mock_space_${projectId}`, JSON.stringify([...spaces, newSpace]));
      return;
    }
    await addDoc(collection(db, 'projects', projectId, 'spaces'), {
      ...spaceData,
      projectId,
      createdAt: serverTimestamp()
    });
  };

  const fetchProjectSketches = async (projectId: string) => {
    if (user?.uid === 'mock-dev-user-id') {
      const stored = localStorage.getItem(`mock_sketches_${projectId}`);
      if (stored) return JSON.parse(stored);
      return [];
    }
    const colRef = collection(db, 'projects', projectId, 'sketches');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const createProjectSketch = async (projectId: string, sketchData: any) => {
    if (user?.uid === 'mock-dev-user-id') {
      const stored = localStorage.getItem(`mock_sketches_${projectId}`);
      const sketches = stored ? JSON.parse(stored) : [];
      const id = `mock-sketch-${Date.now()}`;
      const newSketch = { ...sketchData, id, projectId, createdAt: new Date(), updatedAt: new Date() };
      localStorage.setItem(`mock_sketches_${projectId}`, JSON.stringify([...sketches, newSketch]));
      return id;
    }
    const docRef = await addDoc(collection(db, 'projects', projectId, 'sketches'), {
      ...sketchData,
      projectId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  };

  const updateProjectSketch = async (projectId: string, sketchId: string, data: any) => {
    if (user?.uid === 'mock-dev-user-id') {
      const stored = localStorage.getItem(`mock_sketches_${projectId}`);
      if (stored) {
        const sketches = JSON.parse(stored).map((d: any) => 
          d.id === sketchId ? { ...d, ...data, updatedAt: new Date() } : d
        );
        localStorage.setItem(`mock_sketches_${projectId}`, JSON.stringify(sketches));
      }
      return;
    }
    await updateDoc(doc(db, 'projects', projectId, 'sketches', sketchId), {
      ...data,
      updatedAt: serverTimestamp()
    });
  };

  const deleteProjectSketch = async (projectId: string, sketchId: string) => {
    if (user?.uid === 'mock-dev-user-id') {
      const stored = localStorage.getItem(`mock_sketches_${projectId}`);
      if (stored) {
        const sketches = JSON.parse(stored).filter((d: any) => d.id !== sketchId);
        localStorage.setItem(`mock_sketches_${projectId}`, JSON.stringify(sketches));
      }
      return;
    }
    await deleteDoc(doc(db, 'projects', projectId, 'sketches', sketchId));
  };

  const fetchProjectAssets = async (projectId: string) => {
    if (user?.uid === 'mock-dev-user-id') {
      const stored = localStorage.getItem(`mock_assets_${projectId}`);
      if (stored) return JSON.parse(stored);
      return [];
    }
    const colRef = collection(db, 'projects', projectId, 'assets');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Asset[];
  };

  const createProjectAsset = async (projectId: string, assetData: any) => {
    if (user?.uid === 'mock-dev-user-id') {
      const stored = localStorage.getItem(`mock_assets_${projectId}`);
      const assets = stored ? JSON.parse(stored) : [];
      const id = `mock-asset-${Date.now()}`;
      const newAsset = { ...assetData, id, projectId, createdAt: new Date(), updatedAt: new Date() };
      localStorage.setItem(`mock_assets_${projectId}`, JSON.stringify([...assets, newAsset]));
      return id;
    }
    const docRef = await addDoc(collection(db, 'projects', projectId, 'assets'), {
      ...assetData,
      projectId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  };

  const updateProjectAsset = async (projectId: string, assetId: string, data: any) => {
    if (user?.uid === 'mock-dev-user-id') {
      const stored = localStorage.getItem(`mock_assets_${projectId}`);
      if (stored) {
        const assets = JSON.parse(stored).map((a: any) => 
          a.id === assetId ? { ...a, ...data, updatedAt: new Date() } : a
        );
        localStorage.setItem(`mock_assets_${projectId}`, JSON.stringify(assets));
      }
      return;
    }
    await updateDoc(doc(db, 'projects', projectId, 'assets', assetId), {
      ...data,
      updatedAt: serverTimestamp()
    });
  };

  const deleteProjectAsset = async (projectId: string, assetId: string) => {
    if (user?.uid === 'mock-dev-user-id') {
      const stored = localStorage.getItem(`mock_assets_${projectId}`);
      if (stored) {
        const assets = JSON.parse(stored).filter((a: any) => a.id !== assetId);
        localStorage.setItem(`mock_assets_${projectId}`, JSON.stringify(assets));
      }
      return;
    }
    await deleteDoc(doc(db, 'projects', projectId, 'assets', assetId));
  };

  const isProjectMember = (projectId: string) => {
    // Basic check for now
    return !!user;
  };

  const seedMockProjects = async () => {
    if (!user || user.uid === 'mock-dev-user-id') return;
    
    try {
      for (const proj of MOCK_PROJECTS) {
        // Strip the id from MOCK_PROJECTS and set owner to current user
        const { id, ...data } = proj;
        await addDoc(collection(db, 'projects'), {
          ...data,
          ownerId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.error('Failed to seed mock projects:', err);
      alert('Error seeding mock projects. Please contact admin.');
    }
  };

  return (
    <StudioContext.Provider value={{ 
      projects, 
      activeProject, 
      loading, 
      setActiveProject,
      createProject,
      updateProject,
      deleteProject,
      seedMockProjects,
      fetchProjectMembers,
      addProjectMember,
      removeProjectMember,
      fetchProjectDimensions,
      addProjectDimension,
      fetchProjectSpaces,
      addProjectSpace,
      fetchProjectSketches,
      createProjectSketch,
      updateProjectSketch,
      deleteProjectSketch,
      fetchProjectAssets,
      createProjectAsset,
      updateProjectAsset,
      deleteProjectAsset,
      fetchProjectMoodboards: async (projectId: string) => {
        if (user?.uid === 'mock-dev-user-id') {
          const stored = localStorage.getItem(`mock_moodboards_${projectId}`);
          if (stored) return JSON.parse(stored);
          
          // Seed initial placeholder moodboards
          const seedBoards: Moodboard[] = [
            {
              id: 'seed-1',
              projectId,
              name: 'Minimalist Zen',
              layoutType: 'grid',
              heroSlot: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
              narrative: 'A serene sanctuary focusing on natural light, organic materials, and the beauty of imperfection. The space utilizes a "Less is More" philosophy to promote mental clarity and peace.',
              technicalGrid: [
                'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=400',
                'https://images.unsplash.com/photo-1551029506-0807d4a21f68?auto=format&fit=crop&q=80&w=400',
                'https://images.unsplash.com/photo-1518005020480-cf68f76632c0?auto=format&fit=crop&q=80&w=400',
                'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=400'
              ],
              materialPalette: [
                'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400',
                'https://images.unsplash.com/photo-1581421046129-078553ec162c?auto=format&fit=crop&q=80&w=400',
                'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400',
                'https://images.unsplash.com/photo-1505691722718-2503978a0502?auto=format&fit=crop&q=80&w=400'
              ],
              colorPalette: ['#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd'],
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              id: 'seed-2',
              projectId,
              name: 'Kitchen Artistic',
              layoutType: 'artistic',
              elements: [
                {
                  id: 'el-1',
                  type: 'image',
                  content: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
                  x: 35,
                  y: 30,
                  width: 350,
                  height: 250,
                  rotation: -2,
                  zIndex: 10
                },
                {
                  id: 'el-2',
                  type: 'image',
                  content: 'https://images.unsplash.com/photo-1600585154340-be6199f7a096?auto=format&fit=crop&q=80&w=400',
                  x: 10,
                  y: 10,
                  width: 150,
                  height: 200,
                  rotation: 3,
                  zIndex: 5
                },
                {
                  id: 'el-3',
                  type: 'pointer',
                  content: 'linear pendant',
                  x: 45,
                  y: 20,
                  pointerTo: { x: 42, y: 35 },
                  zIndex: 20
                }
              ],
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ];
          localStorage.setItem(`mock_moodboards_${projectId}`, JSON.stringify(seedBoards));
          return seedBoards;
        }
        const colRef = collection(db, 'projects', projectId, 'moodboards');
        const snapshot = await getDocs(colRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Moodboard[];
      },
      createProjectMoodboard: async (projectId: string, moodboardData: any) => {
        if (user?.uid === 'mock-dev-user-id') {
          const stored = localStorage.getItem(`mock_moodboards_${projectId}`);
          const moodboards = stored ? JSON.parse(stored) : [];
          const id = `mock-moodboard-${Date.now()}`;
          const newMoodboard = { ...moodboardData, id, projectId, createdAt: new Date(), updatedAt: new Date() };
          localStorage.setItem(`mock_moodboards_${projectId}`, JSON.stringify([...moodboards, newMoodboard]));
          return id;
        }
        const docRef = await addDoc(collection(db, 'projects', projectId, 'moodboards'), {
          ...moodboardData,
          projectId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        return docRef.id;
      },
      updateProjectMoodboard: async (projectId: string, moodboardId: string, data: any) => {
        if (user?.uid === 'mock-dev-user-id') {
          const stored = localStorage.getItem(`mock_moodboards_${projectId}`);
          if (stored) {
            const moodboards = JSON.parse(stored).map((m: any) => 
              m.id === moodboardId ? { ...m, ...data, updatedAt: new Date() } : m
            );
            localStorage.setItem(`mock_moodboards_${projectId}`, JSON.stringify(moodboards));
          }
          return;
        }
        await updateDoc(doc(db, 'projects', projectId, 'moodboards', moodboardId), {
          ...data,
          updatedAt: serverTimestamp()
        });
      },
      deleteProjectMoodboard: async (projectId: string, moodboardId: string) => {
        if (user?.uid === 'mock-dev-user-id') {
          const stored = localStorage.getItem(`mock_moodboards_${projectId}`);
          if (stored) {
            const moodboards = JSON.parse(stored).filter((m: any) => m.id !== moodboardId);
            localStorage.setItem(`mock_moodboards_${projectId}`, JSON.stringify(moodboards));
          }
          return;
        }
        await deleteDoc(doc(db, 'projects', projectId, 'moodboards', moodboardId));
      }
    }}>
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (context === undefined) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
}
