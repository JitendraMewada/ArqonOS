# ArqonOS — Built on Intelligent Systems
> **The Operating System for the Built Environment**  
> *Unifying architecture, interior design, project execution, financial control, and living spaces into one intelligent ecosystem.*

---

## 🌟 Overview

**ArqonOS** is an enterprise-grade cloud operating system engineered specifically for the AEC (Architecture, Engineering, and Construction) and interior design industries, while bridging the gap to residential living spaces.

Built around the core architectural philosophy **"Systems Beat Skill"**, ArqonOS unifies creative spatial planning, technical drafting, workflow execution, procurement pipelines, financial governance, and client collaboration into a cohesive, high-performance platform.

---

## 🏗️ Dual-Ecosystem Architecture

ArqonOS is divided into two deeply integrated operational domains:

```
                               ┌─────────────────────────┐
                               │   ArqonOS Core Platform │
                               │  (React 19 + TypeScript)│
                               └────────────┬────────────┘
                                            │
                     ┌──────────────────────┴──────────────────────┐
                     │                                             │
      ┌──────────────▼──────────────┐               ┌──────────────▼──────────────┐
      │   ArqonOS B2B Workspace     │               │   Arqon Nest (B2C Living)   │
      │  (AEC / Interior / Build)   │               │   (Homeowners & Residents)  │
      └──────────────┬──────────────┘               └──────────────┬──────────────┘
                     │                                             │
     ┌───────────────┴───────────────┐              ┌──────────────┴──────────────┐
     │ • Studio (Design & Canvas)    │              │ • Daily Feed & Overview     │
     │ • Quest (Tasks & Snagging)    │              │ • Expenses & Splitter       │
     │ • Flow (Gantt & Automation)   │              │ • Monthly Renovation Budget │
     │ • Cost (BOQ & Accounting)     │              │ • Savings & Vaults          │
     │ • Vendor (Procurement & POs)  │              │ • Family Shared Spaces      │
     │ • Connect (CRM & Client Feed) │              │ • Asset Wealth Roadmap      │
     │ • People (RBAC & Teams)       │              └─────────────────────────────┘
     │ • Insight (BI & Analytics)    │
     │ • AI Hub (Gemini Copilot)     │
     │ • Updates (Live Audit Stream) │
     └───────────────────────────────┘
```

---

## 🚀 Key Modules & Capabilities

### 🏢 B2B Workspace Modules
1. **🎨 Studio — Creative & Spatial Planning**
   - **Artistic Moodboard Canvas**: Multi-layered interactive canvas supporting 360° rotation, opacity controls, semi-transparent vellum notes, hex color extraction, and one-click pixel-perfect PDF export via `html2canvas` and `jsPDF`.
   - **Dimension Matrix**: As-built room measurements (length, width, height, lintel/sill heights, doors, windows, false ceilings) with real-time existing vs. proposed deltas.
   - **Drawing Vault**: Version-controlled architectural CAD/PDF blueprints categorized by discipline (Electrical, Plumbing, Elevation, Floor Plan).

2. **✅ Quest — Operations & Field Snagging**
   - Sprint and Kanban task boards filtered by priority and construction trade.
   - Defect and snagging punchlists with photo uploads, geolocation tagging, and status verification.
   - Real-time field messenger and scheduling calendar.

3. **🔄 Flow — Workflow Engine & Automation**
   - Visual node-based workflow designer for project milestones.
   - Automated trigger-action rules (e.g., *Approval of Moodboard $\to$ Trigger BOQ Generation $\to$ Notify Procurement*).
   - Bottleneck detection and critical-path progress tracking.

4. **💰 Cost — Financial Governance & BOQ**
   - Bill of Quantities (BOQ) with granular material, labor unit, contractor rate, tax, and margin calculations.
   - Estimated vs. Approved vs. Actual spend variance tracking.
   - Multi-tier contractor invoice approval workflows.

5. **📦 Vendor — Procurement & Supply Chain**
   - Supplier database with compliance ratings, trade categories, and credit terms.
   - Purchase Order (PO) dispatch linked directly to design spaces and BOQs.
   - Contract lifecycle management and milestone retention tracking.

6. **🤝 Connect — CRM & Client Portals**
   - Visual sales funnel and lead management.
   - Dedicated client portal for moodboard reviews, 3D render feedback, and digital approvals.

7. **👥 People — RBAC & Identity Control**
   - Department and role assignment (Lead Designer, Draftsman, 3D Artist, Site Supervisor, Project Lead, Client).
   - Granular module-level permission enforcement.
   - Immutable security and activity audit logging.

8. **📊 Insight — Business Intelligence**
   - Schedule Variance (SV), Cost Variance (CV), and Project Health Scorecards.
   - Team workload heatmaps and resource utilization charts.

9. **🧠 AI Hub — Intelligent Copilot**
   - Powered by Google Gemini (`@google/genai`).
   - Architectural concept generation, specification narratives, and automated space estimation.

---

### 🏡 B2C Arqon Nest
- **Expense Tracking & Splitter**: Split interior renovation and maintenance costs between household members or co-owners.
- **Budget Gauges**: Visual spending limits for decor, utilities, landscaping, and maintenance.
- **Savings Vaults**: Dedicated target accounts for future home renovations and improvements.
- **Document & Warranty Vault**: Secure cloud storage for appliance warranties, property deeds, and contractor agreements.

---

## 🛠️ Technology Stack

| Domain | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript (Strict Mode) |
| **Build & Tooling** | Vite 6, Tailwind CSS v4 |
| **Animation & Physics** | Framer Motion (`motion/react`) |
| **Canvas & Drafting** | Konva, React-Konva |
| **Document Generation** | jsPDF, html2canvas |
| **Cloud & Database** | Google Cloud Firestore (Firebase v12), Firebase Auth, Firebase Storage |
| **AI & LLM Integration** | Google Gen AI SDK (`@google/genai` - Gemini 2.5 / 3.0 series) |
| **Icons & Design** | Lucide React |

---

## 📂 Repository & Directory Structure

```text
ArqonOS/
├── public/                     # Static assets & PWA manifest
├── src/
│   ├── components/             # Reusable UI components (Modals, Buttons, Badges)
│   ├── context/                # Global React Contexts (Theme, Auth, Navigation)
│   ├── hooks/                  # Custom hooks (Firestore, Dimensions, Responsive)
│   ├── lib/                    # SDK initializations (Firebase, Gemini AI)
│   ├── pages/
│   │   ├── marketing/          # Public Landing, Gateway, Module Showcase, Pricing
│   │   └── workspace/
│   │       ├── b2b/            # B2B Enterprise Apps (Studio, Quest, Flow, Cost, etc.)
│   │       │   └── studio/     # Studio sub-modules (Canvas, Spaces, Drawings, Assets)
│   │       └── b2c/            # Arqon Nest B2C Portal (Expenses, Budget, Vaults)
│   ├── types/                  # Global TypeScript Interfaces & Data Models
│   ├── App.tsx                 # Root application router
│   ├── index.css               # Tailwind CSS v4 root stylesheet
│   └── main.tsx                # Client entrypoint & Error Boundary
├── firebase-blueprint.json     # Firestore collection schema definition
├── firestore.rules             # Production security rules
├── metadata.json               # Application platform metadata
├── vite.config.ts              # Vite configuration with alias & deduplication rules
└── package.json                # Project dependencies and build scripts
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm** or **bun** / **pnpm**
- A **Firebase Project** with Firestore and Authentication enabled

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/arqonos.git
   cd arqonos
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Provide your configuration keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Firebase Configuration**:
   Ensure `firebase-applet-config.json` contains your Firebase project credentials:
   ```json
   {
     "projectId": "your-firebase-project-id",
     "appId": "your-app-id",
     "apiKey": "your-api-key",
     "authDomain": "your-project.firebaseapp.com",
     "storageBucket": "your-project.appspot.com",
     "messagingSenderId": "your-sender-id"
   }
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## 🔒 Security & RBAC Rules

Firestore data access is governed by granular rules in `firestore.rules`:
- **Role-Based Scoping**: Read and write operations are strictly validated against project team memberships (`/projects/{projectId}/team/{userId}`).
- **Sandboxed Client Access**: Clients are isolated to presentation decks and approval submissions.
- **Financial Isolation**: Cost and BOQ collections require authorized finance roles.

To deploy security rules:
```bash
firebase deploy --only firestore:rules
```

---

## 🤝 Contributing

We welcome contributions to ArqonOS! Please check our guidelines:
1. Fork the repository.
2. Create a descriptive feature branch: `git checkout -b feature/studio-vellum-export`.
3. Commit changes with clear messages adhering to Conventional Commits.
4. Open a Pull Request for review.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built by <b>ArqonOS Pvt Ltd</b>. The Operating System for the Built Environment.</sub>
</div>
