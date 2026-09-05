import React, { useState, useRef, useEffect } from "react";
import {
  Layers,
  Box,
  Hexagon,
  Database,
  CheckSquare,
  Zap,
  Settings,
  LogOut,
  ChevronRight,
  Workflow,
  Users,
  Truck,
  LineChart,
  Brain,
  ArrowLeft,
  PanelLeftClose,
  PanelLeft,
  Menu,
  Sun,
  Moon,
  LayoutDashboard,
  Calendar,
  MessageSquare,
  HelpCircle,
  PlayCircle,
  TrendingUp,
  ShieldCheck,
  Search,
  FileText,
  ClipboardList,
  Briefcase,
  ShoppingCart,
  PieChart,
  Activity,
  Mail,
  Shield,
  X,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { QuestApp } from "./quest/QuestApp";
import { FlowApp } from "./flow/FlowApp";
import { PeopleApp } from "./people/PeopleApp";
import { ConnectApp } from "./connect/ConnectApp";
import { StudioApp } from "./studio/StudioApp";
import { CostApp } from "./cost/CostApp";
import { VendorApp } from "./vendor/VendorApp";
import { InsightApp } from "./insight/InsightApp";
import { AiApp } from "./ai/AiApp";
import { UpdatesModal } from "./updates/UpdatesModal";

const cn = (...inputs: (string | undefined | null | false)[]) =>
  twMerge(clsx(inputs));

const apps = [
  {
    id: "quest",
    name: "Quest",
    icon: CheckSquare,
    colorClass: "text-[#3b82f6]",
    bgClass: "bg-[#3b82f61a]",
    activeBg: "bg-[#3b82f6]",
    activeText: "text-[#3b82f6]",
    borderClass: "border-[#3b82f633]",
    shade: "#3b82f6",
    pages: [
      { name: "Overview", icon: LayoutDashboard },
      { name: "Tasks", icon: CheckSquare },
      { name: "Calendar", icon: Calendar },
      { name: "Messenger", icon: MessageSquare },
      { name: "Help", icon: HelpCircle },
    ],
  },
  {
    id: "flow",
    name: "Flow",
    icon: Workflow,
    colorClass: "text-[#0ea5e9]",
    bgClass: "bg-[#0ea5e91a]",
    activeBg: "bg-[#0ea5e9]",
    activeText: "text-[#0ea5e9]",
    borderClass: "border-[#0ea5e933]",
    shade: "#0ea5e9",
    pages: [
      { name: "Overview", icon: LayoutDashboard },
      { name: "Workflow Builder", icon: Workflow },
      { name: "Automation Page", icon: Zap },
      { name: "Tracking Page", icon: PlayCircle },
      { name: "Help", icon: HelpCircle },
    ],
  },
  {
    id: "connect",
    name: "Connect",
    icon: Hexagon,
    colorClass: "text-[#f97316]",
    bgClass: "bg-[#f973161a]",
    activeBg: "bg-[#f97316]",
    activeText: "text-[#f97316]",
    borderClass: "border-[#f9731633]",
    shade: "#f97316",
    pages: [
      { name: "CRM Dashboard", icon: LayoutDashboard },
      { name: "Client Management", icon: Users },
      { name: "Pipeline Page", icon: TrendingUp },
      { name: "Communication Page", icon: MessageSquare },
      { name: "Help", icon: HelpCircle },
    ],
  },
  {
    id: "people",
    name: "People",
    icon: Users,
    colorClass: "text-[#a855f7]",
    bgClass: "bg-[#a855f71a]",
    activeBg: "bg-[#a855f7]",
    activeText: "text-[#a855f7]",
    borderClass: "border-[#a855f733]",
    shade: "#a855f7",
    pages: [
      { name: "Directory", icon: Search },
      { name: "Roles & Permissions", icon: ShieldCheck },
      { name: "Teams & Departments", icon: LayoutDashboard },
      { name: "Access Control", icon: Shield },
      { name: "Activity Logs", icon: Activity },
      { name: "Invitations", icon: Mail },
      { name: "Settings", icon: Settings },
      { name: "Collaboration", icon: Users },
      { name: "Help", icon: HelpCircle },
    ],
  },
  {
    id: "studio",
    name: "Studio",
    icon: Layers,
    colorClass: "text-[#f97316]",
    bgClass: "bg-[#f973161a]",
    activeBg: "bg-[#f97316]",
    activeText: "text-[#f97316]",
    borderClass: "border-[#f9731633]",
    shade: "#f97316",
    pages: [
      { name: "Dashboard", icon: LayoutDashboard },
      { name: "Templates", icon: Layers },
      { name: "Collaboration", icon: Users },
      { name: "Settings", icon: Settings },
      { name: "Help", icon: HelpCircle },
    ],
  },
  {
    id: "cost",
    name: "Cost",
    icon: Database,
    colorClass: "text-[#94a3b8]",
    bgClass: "bg-[#94a3b81a]",
    activeBg: "bg-[#94a3b8]",
    activeText: "text-[#94a3b8]",
    borderClass: "border-[#94a3b833]",
    shade: "#94a3b8",
    pages: [
      { name: "Overview", icon: LayoutDashboard },
      { name: "Budget Page", icon: ClipboardList },
      { name: "Expense Page", icon: Database },
      { name: "Reports Page", icon: PieChart },
      { name: "Help", icon: HelpCircle },
    ],
  },
  {
    id: "vendor",
    name: "Vendor",
    icon: Truck,
    colorClass: "text-[#07B9CE]",
    bgClass: "bg-[#07B9CE1a]",
    activeBg: "bg-[#07B9CE]",
    activeText: "text-[#07B9CE]",
    borderClass: "border-[#07B9CE33]",
    shade: "#07B9CE",
    pages: [
      { name: "Overview", icon: LayoutDashboard },
      { name: "Directory Page", icon: Briefcase },
      { name: "Procurement Page", icon: ShoppingCart },
      { name: "Contracts Page", icon: FileText },
      { name: "Help", icon: HelpCircle },
    ],
  },
  {
    id: "insight",
    name: "Insight",
    icon: LineChart,
    colorClass: "text-[#94a3b8]",
    bgClass: "bg-[#94a3b81a]",
    activeBg: "bg-[#94a3b8]",
    activeText: "text-[#94a3b8]",
    borderClass: "border-[#94a3b833]",
    shade: "#94a3b8",
    pages: [
      { name: "Overview", icon: LayoutDashboard },
      { name: "Dashboard Page", icon: LayoutDashboard },
      { name: "Reports Page", icon: LineChart },
      { name: "Forecast Page", icon: Activity },
      { name: "Help", icon: HelpCircle },
    ],
  },
  {
    id: "ai",
    name: "AI",
    icon: Brain,
    colorClass: "text-[#A0D6B4]",
    bgClass: "bg-[#A0D6B41a]",
    activeBg: "bg-[#A0D6B4]",
    activeText: "text-[#A0D6B4]",
    borderClass: "border-[#A0D6B433]",
    shade: "#A0D6B4",
    pages: [
      { name: "Overview", icon: LayoutDashboard },
      { name: "Automation Page", icon: Zap },
      { name: "Prediction Page", icon: Brain },
      { name: "Optimization Page", icon: Zap },
      { name: "Help", icon: HelpCircle },
    ],
  },
];

export function WorkspaceDashboard() {
  const [activeApp, setActiveApp] = useState<string>("quest");
  const [activeAppPage, setActiveAppPage] = useState<Record<string, string>>({
    quest: "Overview",
    people: "Directory",
    connect: "CRM Dashboard",
    studio: "Dashboard",
  });
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({
    quest: true,
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleApp = (id: string) => {
    setActiveApp(id);
    if (!isSidebarCollapsed) {
      setIsExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const navigateToApp = (appId: string, pageName: string) => {
    const normalizedAppId = appId.toLowerCase();
    setActiveApp(normalizedAppId);
    setActiveAppPage((prev) => ({ ...prev, [normalizedAppId]: pageName }));
    setIsSidebarMobileOpen(false);
  };

  useEffect(() => {
    const handleNav = (e: any) => {
      if (e.detail?.appId) {
        navigateToApp(e.detail.appId, e.detail.page || 'Overview');
      }
    };
    window.addEventListener('arqon_navigate_app', handleNav);
    return () => window.removeEventListener('arqon_navigate_app', handleNav);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col lg:flex-row p-4 gap-4 font-sans lg:h-screen lg:overflow-hidden relative transition-colors duration-300">
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isSidebarMobileOpen ? "opacity-100 visible" : "opacity-0 invisible",
        )}
        onClick={() => setIsSidebarMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "lg:flex flex-shrink-0 flex flex-col gap-4 transition-all duration-300 fixed lg:relative inset-y-0 left-0 bg-slate-50 dark:bg-slate-950 lg:bg-transparent z-50 p-4 lg:p-0",
          isSidebarMobileOpen
            ? "translate-x-0 w-80 shadow-2xl"
            : "-translate-x-full lg:translate-x-0",
          isSidebarCollapsed ? "lg:w-[100px]" : "lg:w-80",
        )}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsSidebarMobileOpen(false)}
          className="lg:hidden absolute top-6 right-6 w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Logo Card */}
        <div
          className={cn(
            "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl flex items-center relative transition-all duration-300",
            isSidebarCollapsed
              ? "lg:p-4 lg:justify-center h-[88px]"
              : "p-6 gap-3 h-[88px]",
          )}
        >
          <div className="w-8 h-8 shrink-0 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-1 w-4 h-4">
              <div className="bg-[#3b82f6] rounded-[2px]"></div>
              <div className="bg-[#3b82f6] rounded-[2px] opacity-80"></div>
              <div className="bg-[#3b82f6] rounded-[2px] opacity-60"></div>
              <div className="bg-[#3b82f6] rounded-[2px] opacity-40"></div>
            </div>
          </div>
          {(!isSidebarCollapsed || isSidebarMobileOpen) && (
            <div className="animate-in fade-in duration-300 overflow-hidden whitespace-nowrap">
              <h2 className="font-bold tracking-tight text-lg text-slate-900 dark:text-white leading-tight">
                ArqonOS
              </h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                B2B Workspace
              </p>
            </div>
          )}
        </div>

        {/* Nav Pills Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4 rounded-xl flex-grow overflow-y-auto custom-scrollbar space-y-2 transition-colors">
          <div
            className={cn(
              "flex items-center mb-4 mt-2 px-2 transition-all duration-300",
              isSidebarCollapsed && !isSidebarMobileOpen
                ? "justify-center"
                : "justify-between",
            )}
          >
            {(!isSidebarCollapsed || isSidebarMobileOpen) && (
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Engines
              </div>
            )}
          </div>
          {apps.map((app) => (
            <div key={app.id} className="flex flex-col gap-1">
              <button
                onClick={() => toggleApp(app.id)}
                className={cn(
                  "w-full flex items-center p-3 rounded-lg transition-all border",
                  activeApp === app.id
                    ? cn(app.bgClass, app.borderClass, app.activeText)
                    : "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400",
                  isSidebarCollapsed && !isSidebarMobileOpen
                    ? "justify-center"
                    : "justify-between",
                )}
                title={isSidebarCollapsed ? app.name : undefined}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center transition-colors",
                      activeApp === app.id
                        ? cn(
                            app.activeBg,
                            "text-white shadow-md shadow-current/20",
                          )
                        : cn("bg-slate-100 dark:bg-slate-800", app.colorClass),
                    )}
                  >
                    <app.icon className="w-4 h-4" />
                  </div>
                  {(!isSidebarCollapsed || isSidebarMobileOpen) && (
                    <span className="font-semibold text-sm whitespace-nowrap">
                      {app.name}
                    </span>
                  )}
                </div>
                {(!isSidebarCollapsed || isSidebarMobileOpen) && (
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 text-slate-400 transition-transform",
                      isExpanded[app.id] && "rotate-90",
                    )}
                  />
                )}
              </button>

              {(!isSidebarCollapsed || isSidebarMobileOpen) &&
                isExpanded[app.id] &&
                activeApp === app.id && (
                  <div
                    style={{ color: app.shade }}
                    className={cn(
                      "pl-14 pr-4 py-2 space-y-2 relative before:absolute before:left-7 before:top-0 before:bottom-0 before:w-px before:opacity-20 before:bg-current animate-in slide-in-from-top-2 fade-in duration-200",
                    )}
                  >
                    {app.pages &&
                      (app.pages as any).map((page: any, idx: number) => (
                        <div
                          key={idx}
                          className={cn(
                            "text-xs font-medium cursor-pointer py-1 transition-colors hover:font-bold",
                            activeAppPage[app.id] === page.name
                              ? "font-bold"
                              : "text-slate-600 dark:text-slate-400",
                          )}
                          style={
                            {
                              color:
                                activeAppPage[app.id] === page.name
                                  ? app.shade
                                  : undefined,
                              "--hover-color": app.shade,
                            } as any
                          }
                          onClick={() => {
                            if (isSidebarMobileOpen)
                              setIsSidebarMobileOpen(false);
                            setActiveAppPage((prev) => ({
                              ...prev,
                              [app.id]: page.name,
                            }));
                          }}
                          onMouseEnter={(e) => {
                            if (activeAppPage[app.id] !== page.name)
                              e.currentTarget.style.color = app.shade;
                          }}
                          onMouseLeave={(e) => {
                            if (activeAppPage[app.id] !== page.name)
                              e.currentTarget.style.color = "";
                          }}
                        >
                          <page.icon className="w-3.5 h-3.5 mr-2 inline-block opacity-70" />
                          {page.name}
                        </div>
                      ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col gap-4 min-w-0">
        {/* Topbar Card */}
        <header className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4 h-[88px] rounded-xl flex items-center justify-between shrink-0 transition-colors">
          <div className="flex items-center gap-2 sm:gap-4 px-1 sm:px-2">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsSidebarMobileOpen(true)}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex w-8 h-8 rounded-lg items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 flex-shrink-0"
            >
              {isSidebarCollapsed ? (
                <PanelLeft className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

            <Link
              to="/"
              className="px-3 py-1.5 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <ArrowLeft className="w-3 h-3 mr-1.5" /> Marketing
            </Link>

            <div className="flex items-center gap-2 hidden xl:flex">
              <button
                onClick={() => setShowChangelog(true)}
                className="px-3 py-1.5 flex items-center gap-2 rounded-lg border border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors shadow-sm mr-2"
              >
                <Zap className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Future Updates
                </span>
              </button>
              <div className="flex items-center bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-lg border border-slate-100 dark:border-slate-800 shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 bg-[#3b82f61a] border border-[#3b82f633] text-[#3b82f6] text-[9px] font-black uppercase tracking-tightest rounded-lg">
                    ArqonOS Active
                  </div>
                  <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    9 Add-ons Modules
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 px-1 sm:px-2">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors hidden sm:flex">
              <Settings className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 cursor-pointer group hover:bg-white dark:hover:bg-slate-900 transition-all">
              <div className="w-8 h-8 bg-[#3b82f6] rounded-lg shadow-md shadow-[#3b82f633] flex items-center justify-center text-white font-bold text-xs uppercase">
                WA
              </div>
              <div className="flex flex-col hidden md:flex text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white transition-colors group-hover:text-[#3b82f6] leading-none mb-1">
                  Workspace Admin
                </div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                  Enterprise Access
                </div>
              </div>
            </div>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Module Content Card (Standardized with Nest scroll behavior) */}
        <div className="flex-grow overflow-hidden relative group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl transition-colors">
          <div className="h-full overflow-y-auto custom-scrollbar relative flex flex-col">
            <div className="p-8 flex-grow flex flex-col min-h-0">
              {activeApp === "quest" ? (
                <QuestApp
                  activePage={activeAppPage["quest"] || "Overview"}
                  onNavigate={(page) =>
                    setActiveAppPage((prev) => ({ ...prev, quest: page }))
                  }
                  navigateToApp={navigateToApp}
                />
              ) : activeApp === "flow" ? (
                <FlowApp
                  activePage={activeAppPage["flow"] || "Overview"}
                  onNavigate={(page) =>
                    setActiveAppPage((prev) => ({ ...prev, flow: page }))
                  }
                  navigateToApp={navigateToApp}
                />
              ) : activeApp === "people" ? (
                <PeopleApp
                  activePage={activeAppPage["people"] || "Directory"}
                  onNavigate={(page) =>
                    setActiveAppPage((prev) => ({ ...prev, people: page }))
                  }
                  navigateToApp={navigateToApp}
                />
              ) : activeApp === "connect" ? (
                <ConnectApp
                  activePage={activeAppPage["connect"] || "CRM Dashboard"}
                  onNavigate={(page) =>
                    setActiveAppPage((prev) => ({ ...prev, connect: page }))
                  }
                  navigateToApp={navigateToApp}
                />
              ) : activeApp === "studio" ? (
                <StudioApp
                  activePage={activeAppPage["studio"] || "Dashboard"}
                  onNavigate={(page) =>
                    setActiveAppPage((prev) => ({ ...prev, studio: page }))
                  }
                  navigateToApp={navigateToApp}
                />
              ) : activeApp === "cost" ? (
                <CostApp
                  activePage={activeAppPage["cost"] || "Overview"}
                  onNavigate={(page) =>
                    setActiveAppPage((prev) => ({ ...prev, cost: page }))
                  }
                  navigateToApp={navigateToApp}
                />
              ) : activeApp === "vendor" ? (
                <VendorApp
                  activePage={activeAppPage["vendor"] || "Overview"}
                  onNavigate={(page) =>
                    setActiveAppPage((prev) => ({ ...prev, vendor: page }))
                  }
                  navigateToApp={navigateToApp}
                />
              ) : activeApp === "insight" ? (
                <InsightApp
                  activePage={activeAppPage["insight"] || "Overview"}
                  onNavigate={(page) =>
                    setActiveAppPage((prev) => ({ ...prev, insight: page }))
                  }
                  navigateToApp={navigateToApp}
                />
              ) : activeApp === "ai" ? (
                <AiApp
                  activePage={activeAppPage["ai"] || "Overview"}
                  onNavigate={(page) =>
                    setActiveAppPage((prev) => ({ ...prev, ai: page }))
                  }
                  navigateToApp={navigateToApp}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  {apps.map(
                    (app) =>
                      activeApp === app.id && (
                        <div
                          key={app.id}
                          className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full p-6 sm:p-8"
                        >
                          <div
                            className={cn(
                              "w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center mx-auto mb-6 border",
                              app.bgClass,
                              app.borderClass,
                              app.colorClass,
                            )}
                          >
                            <app.icon className="w-8 h-8 sm:w-10 sm:h-10" />
                          </div>
                          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 transition-colors">
                            {app.name}{" "}
                            <span className="text-slate-400">Dashboard</span>
                          </h2>
                          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-md mx-auto mb-8 leading-relaxed px-4 transition-colors">
                            Welcome to your {app.name} module. Your data
                            perfectly streams across the entire ArqonOS
                            ecosystem.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 p-6 rounded-lg text-left shadow-sm transition-colors">
                              <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1 transition-colors">
                                0
                              </div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                Active Items
                              </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 p-6 rounded-lg text-left shadow-sm transition-colors">
                              <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1 transition-colors">
                                0
                              </div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                Pending Action
                              </div>
                            </div>
                          </div>
                        </div>
                      ),
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Updates Modal */}
      <UpdatesModal
        isOpen={showChangelog}
        activeApp={apps.find((a) => a.id === activeApp)?.name || "ArqonOS"}
        onClose={() => setShowChangelog(false)}
        onNavigateToEngine={(engineId) => {
          navigateToApp(engineId, 'Overview');
          setShowChangelog(false);
        }}
      />
    </div>
  );
}
