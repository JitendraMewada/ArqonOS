# ArqonOS — The Operating System for the Built Environment
## Comprehensive System Knowledge Base & Technical Architecture Guide
*Optimized for ingestion into Google Gemini, NotebookLM, Claude, and Enterprise LLM Knowledge Retrieval Systems.*

---

## 1. Executive Summary & Product Vision

**ArqonOS** (built by Arqon Systems) is the comprehensive, intelligent Operating System for the Built Environment. It bridges the critical divide between architectural design, spatial planning, project execution, financial tracking, vendor procurement, workforce management, and residential living into a unified, high-performance platform.

### Core Value Proposition
- **Dual-Ecosystem Architecture**:
  1. **ArqonOS B2B Enterprise Workspace**: Built for architecture firms, interior design studios, general contractors, developers, project managers, and quantity surveyors.
  2. **Arqon Nest B2C Living Space Portal**: Built for homeowners, residential tenants, and clients to track renovations, manage household budgets, warranty vaults, and collaborate directly with design teams.
- **Real-Time Synergy**: Connects spatial creative tools (artistic moodboards, CAD drawings, dimension trackers) with hard engineering/financial controls (Bill of Quantities / BOQ, Gantt workflows, vendor contracts, snag punchlists).
- **Embedded AI Capabilities**: Powered by Google Gemini models for architectural design suggestions, automated scheduling, risk prediction, cost forecasting, and intelligent workflow optimization.

---

## 2. Technical Stack & Runtime Environment

| Layer | Technology | Key Capabilities & Libraries |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript (strict mode) | Functional components, custom hooks, context providers |
| **Build & Bundler** | Vite 6 | High-speed ESM compilation, zero-latency module resolution |
| **Styling & Design System** | Tailwind CSS v4 + Custom Theme System | Dark / Light theme support, fluid responsive grids, micro-interactions |
| **Animations & Transitions** | Framer Motion (`motion/react`) | Smooth gesture physics, floating palettes, canvas transitions |
| **Canvas & Interactive Graphics** | Konva + React-Konva (`react-konva`) | 2D technical drafting, geometric snapping, spatial layering |
| **Document Exporting** | html2canvas + jsPDF (`jspdf`, `html2canvas`) | Client-side pixel-perfect vector/raster PDF generation |
| **Database & Cloud Storage** | Google Cloud Firestore (Firebase v12) | Real-time listeners, offline persistence, granular RBAC rules |
| **Authentication & Security** | Firebase Auth + Security Rules | Multi-role user access control, token-based verification |
| **AI / LLM Engine** | Google Gen AI SDK (`@google/genai`) | Gemini models for generative insights, design advice, cost logic |
| **Icons & Visual Language** | Lucide React (`lucide-react`) | Consistent iconography across all 11+ product sub-apps |

---

## 3. System Architecture & Dual Portals

```
                             +-----------------------------+
                             |      ArqonOS Platform       |
                             |   (React 19 + TypeScript)   |
                             +--------------+--------------+
                                            |
                    +-----------------------+-----------------------+
                    |                                               |
     +--------------v--------------+                 +--------------v--------------+
     |   ArqonOS B2B Workspace     |                 |    Arqon Nest (B2C Portal)  |
     |   (AEC / Design / Build)    |                 |   (Homeowners / Residents)  |
     +--------------+--------------+                 +--------------+--------------+
                    |                                               |
    +---------------+---------------+               +---------------+---------------+
    | • Quest (Tasks & Site Punch)  |               | • Overview (Daily Feed)       |
    | • Flow (Gantt & Automation)   |               | • Expenses (Split & Invoices) |
    | • Studio (Design & Canvas)    |               | • Budgets (Monthly Limits)    |
    | • Cost (BOQ & Accounting)     |               | • Savings (Goals & Vaults)    |
    | • Vendor (Procurement & RFP)  |               | • Family (Shared Spaces)      |
    | • Connect (CRM & Client Feed) |               | • Analytics (Wealth Roadmap)  |
    | • People (RBAC & Teams)       |               +-------------------------------+
    | • Insight (BI & Forecasts)    |
    | • AI (Gemini Copilot)         |
    | • Updates (Live Audit Stream) |
    +-------------------------------+
```

---

## 4. In-Depth Module Breakdown (B2B Workspace)

### 4.1. Studio Module (`/workspace/b2b` -> Studio)
**Purpose**: The creative and technical epicenter of architectural and interior design projects.
- **Artistic Moodboard Canvas (`MoodboardArtisticCanvas.tsx`)**:
  - **Dynamic Elements**: Images, text annotations, semi-transparent vellum narrative layers, color swatches, and directional pointers.
  - **Interactive Controls**: Full 360-degree pointer-drag element rotation, drag-and-drop repositioning, depth z-indexing (Bring Forward / Send Backward), opacity control, and duplication.
  - **Color Extraction Swatches**: Extract and display precise hex palettes from reference assets.
  - **Export Engine**: Instant high-resolution client presentation PDF generation via `html2canvas` and `jsPDF`.
  - **Multi-Board Management**: Create, switch, rename, and delete moodboards per project with seamless real-time Firebase syncing and local storage fallback.
- **Space Planning & Dimensions**:
  - Room measurement entry (Length, Width, Height, lintel/sill heights, doors, windows, false ceiling requirements).
  - Proposed versus existing dimension delta calculations.
- **Technical Drawings & CAD Viewer**:
  - Drawing vault supporting architectural revisions, categories (Electrical, Plumbing, Elevation, Floor Plan), and approval state tracking.

---

### 4.2. Quest Module (`/workspace/b2b` -> Quest)
**Purpose**: Operational task management, site inspection checklists, and defect/snag resolution.
- **Task & Sprint Board**: Kanban and list views categorized by priority (Low, Medium, High, Critical) and trade (Civil, Electrical, Joinery, Finishing).
- **Calendar Schedule**: Synchronized milestone and deadline view with task assignment details.
- **Site Snagging & Punch Lists**: Real-time logging of site defects with photo attachments, assignee accountability, and status tracking (Open, In Progress, Verified, Closed).
- **Messenger & Field Notes**: Fast real-time messaging between field supervisors and office project leads.

---

### 4.3. Flow Module (`/workspace/b2b` -> Flow)
**Purpose**: Visual workflow automation, critical path scheduling, and milestone execution.
- **Workflow Builder**: Node-based graphical process designer to map design phases, client sign-offs, drawing releases, procurement orders, and site execution stages.
- **Automation Engine**: Trigger-action rules (e.g., *When Moodboard is Approved -> Trigger BOQ Generation & Notify Procurement Lead*).
- **Live Progress Tracking**: Percentage completion monitors, overdue stage alerts, and bottleneck detection.

---

### 4.4. Cost Module (`/workspace/b2b` -> Cost)
**Purpose**: Financial governance, Bill of Quantities (BOQ), expense auditing, and cashflow modeling.
- **Budgeting & Variance Engine**: Baseline estimated budget versus approved budget versus actual spend.
- **Bill of Quantities (BOQ)**: Granular itemization of materials, labor units, contractor rates, taxes, and margins.
- **Expense Claim & Invoice Management**: Multi-tier approval workflows for contractor invoices and vendor disbursements.
- **Financial Reports**: Cash burn projections, profitability margin analysis, and currency breakdown.

---

### 4.5. Vendor Module (`/workspace/b2b` -> Vendor)
**Purpose**: Supply chain management, contractor directories, tenders, and compliance.
- **Vendor Directory**: Categorized database of suppliers (Flooring, Lighting, HVAC, Millwork, Glazing) with compliance ratings, credit terms, and contact logs.
- **Procurement & Purchase Orders (PO)**: PO generation linked directly to project spaces and BOQ specifications.
- **Contract & SLA Vault**: Contract lifecycle management, milestone-based retention amounts, and expiration reminders.

---

### 4.6. Connect Module (`/workspace/b2b` -> Connect)
**Purpose**: Client Relationship Management (CRM), client presentation portals, and communication feeds.
- **CRM Dashboard & Sales Pipeline**: Lead tracking from initial inquiry, site survey, concept pitch, negotiation to contract sign-off.
- **Client Presentation Portal**: Dedicated view for clients to review moodboards, 3D renderings, material samples, and submit approval/revision requests.
- **Communication Hub**: Centralized email and message logs with time-stamped client feedback.

---

### 4.7. People Module (`/workspace/b2b` -> People)
**Purpose**: Organizational workforce directory, Role-Based Access Control (RBAC), and team collaboration.
- **Team Directory**: Profiles with roles (Project Lead, Lead Designer, Draftsman, 3D Artist, Site Supervisor, Coordinator, Creative Director, Client).
- **Granular Permissions**: Fine-grained read/write/approve rules across financial, technical drawing, and client-facing modules.
- **Activity & Security Audit**: Real-time timestamped audit logs of all user actions across projects.

---

### 4.8. Insight Module (`/workspace/b2b` -> Insight)
**Purpose**: Executive Business Intelligence, productivity analytics, and predictive forecasting.
- **Project Health Scorecards**: Multidimensional KPIs assessing Schedule Variance (SV), Cost Variance (CV), and Quality Index.
- **Resource Utilization**: Team capacity heatmaps and billable hour distributions.
- **Predictive Risk Analytics**: Early warning indicators for material delays and cost overruns.

---

### 4.9. AI Intelligence Hub (`/workspace/b2b` -> AI)
**Purpose**: Generative AI co-pilot powered by Gemini models.
- **Design Intelligence**: Generates moodboard concepts, color harmonies, and interior design style palettes based on natural language prompts.
- **Specification Copilot**: Automatically writes material descriptions, finishes specifications, and design narratives.
- **Smart Estimation**: Analyzes room dimensions and automatically computes preliminary item quantities and cost estimates.

---

### 4.10. Updates & Notification Feed (`/workspace/b2b` -> Updates)
**Purpose**: Global real-time audit stream and project timeline tracker.
- Chronological feed of drawing uploads, budget revisions, client approvals, snag completions, and team assignments.

---

## 5. In-Depth Module Breakdown (Arqon Nest B2C Portal)

**Arqon Nest** (`/workspace/b2c`) provides homeowners and residential clients with a frictionless interface to manage their property ecosystem:

1. **Daily Feed & Overview**: Summary of ongoing home renovations, energy metrics, upcoming maintenance, and account balances.
2. **Expenses & Splitter**: Tracking personal interior upgrade expenses, splitting renovation costs with family/co-owners, and storing supplier invoices.
3. **Monthly Budgets**: Customizable category limits (Decor, Maintenance, Utilities, Landscaping) with visual progress gauges.
4. **Savings & Goal Vaults**: Dedicated target savings funds (e.g., "Kitchen Remodel 2027", "Solar Roof Installation").
5. **Family & Shared Vaults**: Multi-member household access management and shared document repositories.
6. **Wealth & Analytics Roadmap**: Long-term asset appreciation and home improvement ROI tracking.

---

## 6. Marketing, Gateway & Enterprise Commercials

- **Landing Page (`/`)**: Dynamic interactive showcase highlighting ArqonOS's unified capabilities, fluid animations, feature highlights, and interactive previews.
- **Module Showcase (`/modules/:moduleId`)**: Deep-dive interactive tour into each module's capabilities.
- **Gateway (`/gateway`)**: Dual-entry portal allowing users to choose between the B2B Studio Workspace and the B2C Nest Home Portal.
- **Pricing Matrix (`/pricing`)**: Tiered SaaS subscription models (Starter Studio, Professional Enterprise, Custom Infrastructure).

---

## 7. Complete Firestore Database Schema & Data Models

The system implements a structured Firestore database schema defined in `firebase-blueprint.json` and secured by `firestore.rules`:

```
/projects/{projectId}                             (Project Entity)
  ├── /team/{teamId}                              (ProjectTeam: User roles & permissions)
  ├── /dimensions/{dimensionId}                   (ProjectDimension: As-built site dimensions)
  ├── /spaces/{spaceId}                           (ProjectSpace: Proposed interior zones)
  ├── /drawings/{drawingId}                       (ProjectDrawing: CAD/PDF blueprints & revisions)
  ├── /moodboards/{moodboardId}                   (ProjectMoodboard: Canvas elements, palettes)
  ├── /assets/{assetId}                           (ProjectAsset: 3D models, textures, swatches)
  ├── /presentations/{presentationId}             (ProjectPresentation: Client decks)
  ├── /approvals/{approvalId}                     (ProjectApproval: Sign-offs & status states)
  ├── /revisions/{revisionId}                     (ProjectRevision: Version changelogs)
  └── /comments/{commentId}                       (Comment: Collaborative annotations)

/activity_logs/{logId}                            (ActivityLog: Immutable system audit records)
```

### Key Data Interfaces (TypeScript)

#### `Project`
```typescript
interface Project {
  id: string;
  name: string;
  code: string;
  clientName: string;
  clientContact: string;
  clientEmail: string;
  type: string; // 'Residential' | 'Commercial' | 'Hospitality' | 'Retail'
  status: 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  estimatedBudget: number;
  approvedBudget: number;
  currentCost: number;
  startDate: string;
  endDate: string;
  totalArea: number;
  carpetArea: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
```

#### `Moodboard & Elements`
```typescript
interface MoodboardElement {
  id: string;
  type: 'image' | 'text' | 'pointer' | 'swatch';
  content?: string;
  src?: string;
  x: number;          // Percentage of canvas width (0-100)
  y: number;          // Percentage of canvas height (0-100)
  width?: number;
  height?: number;
  rotation?: number;  // 0 - 360 degrees
  zIndex?: number;
  opacity?: number;
  isVellum?: boolean; // Semi-transparent narrative paper style
  pointerTo?: { x: number; y: number };
  color?: string;     // Hex code for swatch
}

interface Moodboard {
  id: string;
  projectId: string;
  name: string;
  elements: MoodboardElement[];
  colorPalette: string[];
  createdAt: string;
  updatedAt: string;
}
```

---

## 8. Key User Journeys & End-to-End Workflows

### Journey 1: Concept to Client Sign-off
1. **Lead Qualification**: Client details and project scope logged in **Connect CRM**.
2. **Site Surveying**: Physical room dimensions, sill heights, and site photos entered in **Studio Space Planning**.
3. **Artistic Exploration**: Lead designer uses **Studio Moodboard Canvas** to layer textures, extract color swatches, write vellum narrative notes, and rotate visual annotations.
4. **Client Review & PDF**: Presentation deck generated via one-click **PDF Export** and shared through the **Connect Client Portal** for digital approval.

### Journey 2: Procurement to Site Execution
1. **BOQ Generation**: Approved space plans converted to itemized bill of quantities in **Cost**.
2. **RFP & Purchase Orders**: Procurement orders dispatched to verified contractors in **Vendor**.
3. **Critical Path Tracking**: Milestone schedules and dependency rules enforced in **Flow**.
4. **Site Snagging**: Site supervisors inspect construction quality, logging punch items and photo logs in **Quest**.

---

## 9. NotebookLM / Gemini Prompting Guide

When querying NotebookLM using this knowledge base, try asking:
1. *"Explain the complete workflow from creating a project in ArqonOS to exporting a client-ready moodboard PDF."*
2. *"How does ArqonOS handle the separation between B2B studio operations and B2C homeowner management?"*
3. *"What are the exact data models and Firestore collection structures used for project drawings, dimensions, and moodboards?"*
4. *"Detail the interactive capabilities of the Moodboard Artistic Canvas, including element rotation, vellum notes, and swatches."*
5. *"How do the Flow, Cost, and Vendor modules integrate to prevent construction budget overruns and delays?"*

---
*Document compiled for ArqonOS Knowledge Base ingestion.*
