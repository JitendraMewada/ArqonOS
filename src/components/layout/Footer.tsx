import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Box, Workflow, Hexagon, Users, Layers, Database, Truck, LineChart, Brain, 
  Shield, Zap, Layout, CreditCard, LogIn, ArrowRight, Globe, Info, History, 
  Target, Rocket, BookOpen, Code, Activity, HelpCircle, ChevronDown
} from 'lucide-react';

export function Footer() {
  const [isExpanded, setIsExpanded] = useState(false);

  const b2bApps = [
    { name: 'Quest', id: 'quest', icon: Box, color: '#3b82f6' },
    { name: 'Flow', id: 'flow', icon: Workflow, color: '#3b82f6' },
    { name: 'Connect', id: 'connect', icon: Hexagon, color: '#3b82f6' },
    { name: 'People', id: 'people', icon: Users, color: '#a855f7' },
    { name: 'Studio', id: 'studio', icon: Layers, color: '#f97316' },
    { name: 'Cost', id: 'cost', icon: Database, color: '#94a3b8' },
    { name: 'Vendor', id: 'vendor', icon: Truck, color: '#07B9CE' },
    { name: 'Insight', id: 'insight', icon: LineChart, color: '#94a3b8' },
    { name: 'AI', id: 'ai', icon: Brain, color: '#A0D6B4' },
  ];

  const b2cApps = [
    { name: 'Nest', id: 'nest', icon: Shield, color: '#22c55e' },
  ];

  const d2cApps = [
    { name: 'Essence', id: 'essence', icon: Layers, color: '#94a3b8' },
    { name: 'PRAVARA', id: 'pravara', icon: Zap, color: '#d4af37' },
  ];

  return (
    <footer className="relative mt-auto pt-10">
      {/* Collapsible Toggle Handle */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="group cursor-pointer flex flex-col items-center justify-center transition-all duration-300"
      >
        <div className="w-full flex items-center justify-center px-6 md:px-12">
          <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800 transition-colors group-hover:bg-[#3b82f644]" />
          <div className="mx-4 px-2 py-1 flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-sm hover:border-[#3b82f688] transition-all group-hover:px-4">
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-500 ${isExpanded ? 'rotate-180 text-[#3b82f6]' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              {isExpanded ? 'Close Sitemap' : 'Explore Arqon Blueprint'}
            </span>
          </div>
          <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800 transition-colors group-hover:bg-[#3b82f644]" />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-slate-900 py-16 px-6 md:px-12 transition-colors">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12 mb-16">
                  <div className="col-span-2 md:col-span-3 lg:col-span-1 flex flex-col">
                    <Link to="/" className="flex items-center gap-3 mb-6">
                      <div className="grid grid-cols-2 gap-1 w-8 h-8">
                        <div className="bg-[#3b82f6] rounded-[2px]"></div>
                        <div className="bg-[#3b82f6] rounded-[2px] opacity-80"></div>
                        <div className="bg-[#3b82f6] rounded-[2px] opacity-60"></div>
                        <div className="bg-[#3b82f6] rounded-[2px] opacity-40"></div>
                      </div>
                      <span className="font-display font-black text-xl tracking-tighter text-slate-900 dark:text-white transition-colors">
                        ARQON<span className="text-[#3b82f6]">.</span>
                      </span>
                    </Link>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6 transition-colors max-w-xs">
                      The Operating System for the Built Environment. Unified architecture for design, management, and living systems.
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 flex items-center justify-center cursor-pointer hover:border-[#3b82f6] hover:text-[#3b82f6] transition-all">
                        <Globe className="w-3.5 h-3.5" />
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 flex items-center justify-center cursor-pointer hover:border-[#3b82f6] hover:text-[#3b82f6] transition-all">
                        <Layout className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <h4 className="text-slate-900 dark:text-white font-bold text-[10px] uppercase tracking-[0.3em] mb-2 opacity-50">Workspace</h4>
                    <div className="flex flex-col gap-3">
                      {b2bApps.map(app => (
                        <Link key={app.id} to="/gateway" className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-colors">
                          <app.icon className="w-3 h-3 group-hover:scale-110 transition-transform" style={{ color: app.color }} />
                          <span>{app.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h4 className="text-slate-900 dark:text-white font-bold text-[10px] uppercase tracking-[0.3em] mb-2 opacity-50">Ecosystem</h4>
                    <div className="flex flex-col gap-3">
                      <Link to="/modules/nest" className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#22c55e] text-xs font-bold transition-colors">
                        <Shield className="w-3 h-3 text-[#22c55e]" />
                        <span>Nest (B2C)</span>
                      </Link>
                      <Link to="/modules/essence" className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-colors">
                        <Layers className="w-3 h-3 text-slate-400" />
                        <span>Essence (D2C)</span>
                      </Link>
                      <Link to="/modules/pravara" className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#d4af37] text-xs font-bold transition-colors">
                        <Zap className="w-3 h-3 text-[#d4af37]" />
                        <span>PRAVARA (D2C)</span>
                      </Link>
                      <Link to="/modules/arqonos" className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#3b82f6] text-xs font-bold transition-colors">
                        <Box className="w-3 h-3 text-[#3b82f6]" />
                        <span>ArqonOS Suite</span>
                      </Link>
                      <Link to="/gateway" className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#3b82f6] text-xs font-bold transition-colors">
                        <Rocket className="w-3 h-3 text-slate-400" />
                        <span>Enterprise Plan</span>
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h4 className="text-slate-900 dark:text-white font-bold text-[10px] uppercase tracking-[0.3em] mb-2 opacity-50">Company</h4>
                    <div className="flex flex-col gap-3">
                      <Link to="/" className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#3b82f6] text-xs font-bold transition-colors">
                        <Info className="w-3 h-3 text-slate-400" />
                        <span>Foundation</span>
                      </Link>
                      <Link to="/" className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#3b82f6] text-xs font-bold transition-colors">
                        <History className="w-3 h-3 text-slate-400" />
                        <span>Revelation</span>
                      </Link>
                      <Link to="/" className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#3b82f6] text-xs font-bold transition-colors">
                        <Target className="w-3 h-3 text-slate-400" />
                        <span>Investment</span>
                      </Link>
                      <Link to="/" className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#3b82f6] text-xs font-bold transition-colors">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>Career Hub</span>
                      </Link>
                      <Link to="/" className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#3b82f6] text-xs font-bold transition-colors">
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span>Media Kit</span>
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h4 className="text-slate-900 dark:text-white font-bold text-[10px] uppercase tracking-[0.3em] mb-2 opacity-50">Resources</h4>
                    <div className="flex flex-col gap-3">
                      <Link to="/pricing" className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#3b82f6] text-xs font-bold transition-colors">
                        <CreditCard className="w-3 h-3 text-slate-400" />
                        <span>Pricing</span>
                      </Link>
                      <Link to="/" className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#3b82f6] text-xs font-bold transition-colors">
                        <BookOpen className="w-3 h-3 text-slate-400" />
                        <span>Documentation</span>
                      </Link>
                      <Link to="/" className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#3b82f6] text-xs font-bold transition-colors">
                        <Code className="w-3 h-3 text-slate-400" />
                        <span>API Docs</span>
                      </Link>
                      <Link to="/" className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#3b82f6] text-xs font-bold transition-colors">
                        <Activity className="w-3 h-3 text-slate-400" />
                        <span>Status Core</span>
                      </Link>
                      <Link to="/" className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#3b82f6] text-xs font-bold transition-colors">
                        <HelpCircle className="w-3 h-3 text-slate-400" />
                        <span>Help Center</span>
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h4 className="text-slate-900 dark:text-white font-bold text-[10px] uppercase tracking-[0.3em] mb-2 opacity-50">Sync</h4>
                    <div className="flex flex-col gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">HQ Location</span>
                        <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">Ahmedabad, IN</span>
                      </div>
                      <Link to="/gateway" className="flex items-center justify-between p-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02] transition-transform">
                        <span className="text-[10px] font-black uppercase tracking-widest">Sign In</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                    <div className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">
                      &copy; {new Date().getFullYear()} ArqonOS Pvt Ltd. Built on Intelligent Systems.
                    </div>
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
                    <div className="flex items-center gap-6">
                      <Link to="/privacy" className="text-[11px] font-bold text-slate-400 hover:text-[#3b82f6] uppercase tracking-widest transition-colors">Privacy Policy</Link>
                      <Link to="/terms" className="text-[11px] font-bold text-slate-400 hover:text-[#3b82f6] uppercase tracking-widest transition-colors">Terms of Service</Link>
                      <Link to="/cookies" className="text-[11px] font-bold text-slate-400 hover:text-[#3b82f6] uppercase tracking-widest transition-colors">Cookies</Link>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-100 dark:border-slate-800 transition-colors">
                    <Shield className="w-3.5 h-3.5 text-[#3b82f6]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Enterprise Grade Security Certified</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Base Identity (Visible when collapsed) */}
      {!isExpanded && (
        <div className="py-8 px-6 text-center animate-in fade-in duration-700">
           <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
              <div className="grid grid-cols-2 gap-1 w-6 h-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                <div className="bg-[#3b82f6] rounded-[1px]"></div>
                <div className="bg-[#3b82f6] rounded-[1px] opacity-80"></div>
                <div className="bg-[#3b82f6] rounded-[1px] opacity-60"></div>
                <div className="bg-[#3b82f6] rounded-[1px] opacity-40"></div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-700 ml-[0.4em]">
                Built on Systems
              </p>
           </div>
        </div>
      )}
    </footer>
  );
}
