import React from 'react';
import {
  HelpCircle,
  LineChart,
  LayoutDashboard,
  Activity,
  BarChart,
  TrendingUp,
  Target,
  Search,
  Info,
  ShieldCheck,
  Zap,
  Layers,
  Users,
  Truck,
  Database,
  Globe,
  Brain,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { cn } from '../../../../lib/utils';

export function InsightHelp() {
  const documentationSections = [
    {
      title: '1. Executive Telemetry & Health Scoring',
      icon: <LayoutDashboard className="w-4 h-4 text-[#94a3b8]" />,
      summary: 'Aggregates multi-source KPIs into a single composite project health score (0-100).',
      points: [
        { label: 'Composite Health Score', desc: 'Weighted synthesis of Cost CPI (30%), Schedule SPI (30%), Drawing sign-off velocity (20%), and Vendor SLA on-time rate (20%).' },
        { label: 'Portfolio vs Project Scope', desc: 'Switch seamlessly between the global portfolio executive level and individual site deep dives without data re-entry.' },
        { label: 'Live Data Streams', desc: 'Real-time synchronization with Studio, Cost, Flow, Quest, Vendor, People, and Connect engines.' }
      ]
    },
    {
      title: '2. Earned Value Management (EVM) & SPI/CPI',
      icon: <Activity className="w-4 h-4 text-[#3b82f6]" />,
      summary: 'Rigorous engineering metrics to calculate cost and schedule efficiency before delays happen.',
      points: [
        { label: 'Schedule Performance Index (SPI)', desc: 'SPI = Earned Value (EV) / Planned Value (PV). An SPI > 1.0 indicates milestone progression ahead of contract target.' },
        { label: 'Cost Performance Index (CPI)', desc: 'CPI = Earned Value (EV) / Actual Cost (AC). A CPI > 1.0 indicates work is being delivered under estimated budget.' },
        { label: 'Critical Path Radar', desc: 'Tracks dependencies such as marine port glass delivery or MEP ceiling 1st fix to prevent cascading milestone slippage.' }
      ]
    },
    {
      title: '3. Audit & Reporting Studio',
      icon: <FileSpreadsheet className="w-4 h-4 text-emerald-500" />,
      summary: 'Audit-verified multi-engine statements ready for partner review and financial audits.',
      points: [
        { label: 'Executive P&L Statements', desc: 'Consolidates contract invoices, cash collected, actual subcontractor disbursements, and gross profit margins.' },
        { label: 'Space-Wise Cost Variance', desc: 'Direct comparative analysis linking Studio room dimensions with Cost committed purchase orders.' },
        { label: 'Multi-Format Export', desc: 'Instant generation of audit reports in PDF, XLSX spreadsheet, and CSV formats.' }
      ]
    },
    {
      title: '4. Predictive AI & What-If Sandbox',
      icon: <Brain className="w-4 h-4 text-[#A0D6B4]" />,
      summary: 'Stochastic sensitivity modeling to project future cashflow, margin erosion, and handover dates.',
      points: [
        { label: 'Sensitivity Sliders', desc: 'Dynamically test changes in material inflation, labor multipliers, subcontractor delays, or scope additions in real-time.' },
        { label: 'Completion Predictor', desc: 'AI forecasted handover dates with confidence percentages based on historical contractor velocity.' },
        { label: 'Proactive Savings Radar', desc: 'Identifies bulk procurement rebates and value-engineering opportunities to protect gross margins.' }
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 overflow-y-auto animate-in fade-in duration-300 text-left pr-1">
      <div className="p-6 max-w-5xl mx-auto w-full space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#94a3b81a] text-[#94a3b8] text-[10px] font-black uppercase tracking-wider mb-3 border border-[#94a3b833]">
            <LineChart className="w-3.5 h-3.5" />
            <span>Architecture & Operational Manual</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Insight: <span className="text-[#94a3b8]">Intelligence & Analytics Engine</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium max-w-3xl leading-relaxed">
            The Insight engine acts as the central cognitive layer of ArqonOS. It automatically digests the operational activity of Quest, Flow, Studio, Cost, Vendor, and People into actionable strategic intelligence.
          </p>
        </div>

        {/* Core Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documentationSections.map((sec, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {sec.icon}
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">{sec.title}</h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">{sec.summary}</p>

                <div className="space-y-3">
                  {sec.points.map((pt, j) => (
                    <div key={j} className="text-xs">
                      <strong className="text-slate-800 dark:text-slate-200 block">{pt.label}</strong>
                      <span className="text-slate-500 dark:text-slate-400 leading-relaxed">{pt.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Roles & Operational Matrix */}
        <div className="p-6 rounded-xl bg-slate-900 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#94a3b833] text-[#94a3b8]">
              Role Distribution
            </span>
            <h3 className="text-xl font-black">Analysts, Partners & Project Leads</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              <strong>Analyst / Finance Leads:</strong> Generate audit reports, track CPI/SPI indicators, and analyze subcontractor cost variances.<br />
              <strong>Managers & Directors:</strong> Utilize the What-If Sandbox to negotiate change orders, mitigate supply bottlenecks, and guarantee profit margins.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center shrink-0 w-full md:w-auto">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">ArqonOS Principle</span>
            <span className="text-base font-black text-white block mt-0.5">Systems Beat Skill</span>
            <span className="text-[11px] text-emerald-400 font-semibold block mt-1">100% Automated Synthesis</span>
          </div>
        </div>
      </div>
    </div>
  );
}
