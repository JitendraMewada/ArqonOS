import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, Layers, Zap, Hexagon, Database, Shield, Workflow, Users, Truck, LineChart, Brain, History, Sparkles, Target, GitMerge, Activity, Cpu, Command, Globe, Calendar, MessageSquare, Milestone, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

const modules = [
  { id: 'quest', name: 'Quest', icon: Box, color: '#3b82f6', description: 'To-do, task management, calendar, and messenger.', number: '01' },
  { id: 'flow', name: 'Flow', icon: Workflow, color: '#0ea5e9', description: 'Workflow management and process structures.', number: '02' },
  { id: 'connect', name: 'Connect', icon: Hexagon, color: '#f97316', description: 'CRM, lead management, and client communication.', number: '03' },
  { id: 'people', name: 'People', icon: Users, color: '#a855f7', description: 'HR, team roles, and collaborative structuring.', number: '04' },
  { id: 'studio', name: 'Studio', icon: Layers, color: '#f97316', description: 'Design and creative workspace tailored for builders.', number: '05' },
  { id: 'cost', name: 'Cost', icon: Database, color: '#94a3b8', description: 'Budgeting, financial insights, and expense tracking.', number: '06' },
  { id: 'vendor', name: 'Vendor', icon: Truck, color: '#07B9CE', description: 'Supplier coordination and procurement processes.', number: '07' },
  { id: 'insight', name: 'Insight', icon: LineChart, color: '#94a3b8', description: 'Analytics and reporting from workflows and costs.', number: '08' },
  { id: 'ai', name: 'AI', icon: Brain, color: '#A0D6B4', description: 'Artificial intelligence tools across all modules.', number: '09', colSpan: 'md:col-span-2 lg:col-span-1' },
  { id: 'nest', name: 'Nest', icon: Shield, color: '#22c55e', description: 'B2C Ecosystem. Family and friends finance organizer.', number: '10', colSpan: 'md:col-span-2 lg:col-span-1' },
  { id: 'arqonos', name: 'ArqonOS Bundle', icon: Zap, color: '#3b82f6', description: 'The full bundle. All engines unified tightly into one system.', number: '11', colSpan: 'md:col-span-2 lg:col-span-2', isFeatured: true },
  { id: 'essence', name: 'Essence', icon: Layers, color: '#94a3b8', description: 'D2C Showcase. Interior designer portfolio showcase. Free to Access.', number: '12', isFree: true },
  { id: 'pravara', name: 'PRAVARA', icon: Zap, color: '#d4af37', description: 'D2C Fashion. Women\'s luxury clothing and commerce. Free to Access.', number: '13', isFree: true },
];

export function LandingPage() {
  const [radius, setRadius] = useState(typeof window !== 'undefined' && window.innerWidth >= 768 ? 250 : 150);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleResize = () => {
      setRadius(window.innerWidth >= 768 ? 250 : 150);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-[#3b82f6] origin-left z-[100]" 
        style={{ scaleX }} 
      />

      {/* Hero Section */}
      <section className="relative px-6 md:px-12 py-20 lg:py-32 flex flex-col items-center text-center overflow-hidden">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-5xl mx-auto flex flex-col items-center"
        >
          <div className="flex flex-col items-center mb-10 gap-6 group">
            <div className="relative w-24 h-24">
              {/* Outer Glow */}
              <div className="absolute inset-x-0 bottom-0 top-0 bg-[#3b82f622] blur-3xl rounded-full scale-150 opacity-50" />
              
              <div className="grid grid-cols-2 gap-2 w-full h-full relative z-10">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 - i * 0.15 }}
                    transition={{ 
                      delay: i * 0.1, 
                      duration: 0.5,
                      repeat: i === 3 ? Infinity : 0,
                      repeatType: "reverse",
                      repeatDelay: 2
                    }}
                    className={cn(
                      "rounded-lg shadow-xl",
                      i === 3 ? "bg-slate-200 dark:bg-slate-800" : "bg-[#3b82f6]"
                    )}
                    style={{
                      boxShadow: i < 3 ? `0 10px 20px -5px ${i === 0 ? '#3b82f666' : '#3b82f633'}` : 'none'
                    }}
                  />
                ))}
              </div>
              
              {/* Inner Core Pulsing */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
              >
                <div className="w-5 h-5 bg-white dark:bg-slate-900 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
              </motion.div>
            </div>

            <div className="flex flex-col items-center">
              <motion.h2 
                initial={{ letterSpacing: "0.2em", opacity: 0 }}
                animate={{ letterSpacing: "-0.05em", opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white flex items-baseline gap-1"
              >
                ARQON<span className="text-[#3b82f6] text-4xl md:text-5xl font-extrabold">OS</span>
              </motion.h2>
              <div className="h-1 w-48 bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent mt-2 opacity-50" />
            </div>
          </div>

          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3b82f6] px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded inline-block mb-8 shadow-sm">
            ArqonOS - Built on Intelligent Systems
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-extrabold tracking-tight mb-8 leading-[1.1] text-slate-500 dark:text-slate-400">
            The Operating System for the <span className="text-[#3b82f6]">Built Environment.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed transition-colors">
            Unifying work, life, and living spaces into a single intelligent system. Systems beat Skill.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/gateway" className="px-8 py-4 bg-[#3b82f6] text-white font-bold rounded-md flex items-center justify-center gap-2 group w-full sm:w-auto shadow-lg shadow-[#3b82f633] hover:bg-[#3b82f6e6] transition-all hover:translate-y-[-2px]">
              Enter Workspace <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/modules/arqonos" className="px-6 py-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-md hover:bg-white dark:hover:bg-slate-900 w-full sm:w-auto flex items-center justify-center transition-all">
              Explore Ecosystem
            </Link>
          </div>

          {/* Hero Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="flex flex-col items-center gap-2 pointer-events-none"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Scroll to discover</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5 text-[#3b82f6]" />
            </motion.div>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#3b82f6] to-transparent mt-1" />
          </motion.div>
        </motion.div>
      </section>

      {/* Why We Exist Section */}
      <section className="px-6 md:px-12 py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3b82f6] px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded inline-block mb-8 shadow-sm">
                The Arqon Origin
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#3b82f61a] text-[#3b82f6] flex items-center justify-center shrink-0">
                  <History className="w-7 h-7" />
                </div>
                Why We Exist
              </h2>
              <div className="space-y-6">
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  Founded in 1998 as <span className="text-slate-900 dark:text-white font-bold">Essence</span>, our journey began with a simple observation of the built environment. We spent decades watching how skill alone failed against the entropy of disconnection.
                </p>
                <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#3b82f6]" />
                  <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white italic leading-snug">
                    "Systems beat Skill. Every single time."
                  </p>
                </div>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  We exist to replace fragmented, fragile tools with a singular, resilient operating system. ArqonOS isn't just software; it's the intelligent architecture of your business logic.
                </p>
                
                <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                    <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase"><span className="text-[#3b82f6]">ArqonOS</span> is the Operating System.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                    <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase"><span className="text-[#3b82f6]">Modules</span> are Functional Engines.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                    <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase"><span className="text-[#3b82f6]">Workflow</span> is the User Experience Layer.</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {[
                {
                  icon: History,
                  title: "Legacy to Logic",
                  desc: "Transitioning 25 years of domain expertise into automated systems."
                },
                {
                  icon: Target,
                  title: "Singular Focus",
                  desc: "Eliminating the 'integration tax' through native, unified architecture."
                },
                {
                  icon: GitMerge,
                  title: "The Unification",
                  desc: "Merging marketing, workspace, and lifecycle into one ecosystem."
                },
                {
                  icon: Sparkles,
                  title: "Innate Intelligence",
                  desc: "Systems that learn from your growth and predict your needs."
                }
              ].map((item, idx) => (
                <div key={idx} className="p-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-[#3b82f61a] text-[#3b82f6] rounded-xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 shadow-sm">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Ecosystem Grid */}
      <section className="px-6 md:px-12 py-24 bg-white dark:bg-slate-900 relative border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3b82f6] px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded inline-block mb-8 shadow-sm">
              Functional Engines
            </span>
            <h2 className="text-3xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#3b82f61a] text-[#3b82f6] flex items-center justify-center shrink-0">
                <Box className="w-7 h-7" />
              </div>
              Modular SaaS Engines
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl font-medium">
              Arqon is built on specialized engines that can run independently or combine into ArqonOS.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {modules.map((mod) => (
              <Link 
                key={mod.id}
                to={mod.id === 'arqonos' ? '/modules/arqonos' : `/modules/${mod.id}`} 
                className={cn(
                  "group p-8 rounded-xl border bg-slate-50 dark:bg-slate-950 shadow-md hover:shadow-2xl transition-all flex flex-col relative overflow-hidden hover:bg-white dark:hover:bg-slate-900",
                  mod.isFeatured 
                    ? "border-[#3b82f633] dark:border-[#3b82f64d] hover:border-[#3b82f6] shadow-[#3b82f61a]" 
                    : "border-slate-100 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600",
                  mod.colSpan || ""
                )}
              >
                {/* Brand Color Top Line */}
                <div 
                  className="absolute top-0 left-0 w-full h-[2px] opacity-20 group-hover:opacity-100 transition-opacity" 
                  style={{ backgroundColor: mod.color }}
                />
                {/* Background Decor Number */}
                <div 
                  className="absolute -top-6 -right-2 text-[8rem] leading-none font-black opacity-[0.03] group-hover:opacity-[0.08] transition-all pointer-events-none z-0"
                  style={{ color: mod.color }}
                >
                  {mod.number}
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div 
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 shadow-sm",
                      mod.isFeatured ? "bg-[#3b82f6] text-white" : ""
                    )}
                    style={mod.isFeatured ? {} : { backgroundColor: `${mod.color}1a`, color: mod.color }}
                  >
                    <mod.icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="font-bold text-xl mb-3 tracking-tight group-hover:translate-x-1 transition-transform" style={{ color: mod.isFeatured ? '#3b82f6' : mod.color }}>
                    {mod.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6">
                    {mod.description}
                  </p>
                  
                  <div 
                    className="mt-auto pt-6 border-t flex items-center justify-between transition-colors"
                    style={{ borderColor: `${mod.color}33` }}
                  >
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-inherit transition-colors">
                      {mod.isFeatured ? 'System Bundle' : mod.isFree ? 'Free Access' : 'Module'}
                    </span>
                    <div 
                      className="w-8 h-8 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center transition-all transform group-hover:translate-x-1 text-[var(--mod-color)] group-hover:bg-[var(--mod-color)] group-hover:text-white group-hover:border-transparent" 
                      style={{ '--mod-color': mod.color } as any}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* Systemic Growth: Strategy & Roadmap */}
      <section className="px-6 md:px-12 py-32 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#3b82f608] rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#3b82f605] rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3b82f6] px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded inline-block mb-8 shadow-sm">
              Systemic Growth
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#3b82f61a] text-[#3b82f6] flex items-center justify-center shrink-0">
                <Command className="w-7 h-7" />
              </div>
              The Arqon Blueprint
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Pillar 1: Ecosystem Strategy */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col group hover:border-[#3b82f644] transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#3b82f61a] flex items-center justify-center text-[#3b82f6] mb-8 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Ecosystem Strategy</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Solving the "Fragmented Tools" crisis. Arqon bridges the gap between Work (B2B), Finance (B2C), and Identity (D2C) through a singular neural layer.
              </p>
              <div className="space-y-4 mt-auto">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  100% Native Architecture
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                  Zero-Integration Flow
                </div>
              </div>
            </motion.div>

            {/* Pillar 2: Business Strategy (The Loop) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#3b82f6] p-8 rounded-2xl border border-[#3b82f6] shadow-2xl shadow-[#3b82f633] flex flex-col text-white transform lg:-translate-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-8">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4 italic">The Growth Loop</h3>
              <p className="text-blue-100 mb-8 leading-relaxed">
                Our Modular SaaS model allows frictionless entry and infinite expansion. Start with what you need, upgrade to the full OS when you scale.
              </p>
              
              <div className="space-y-6">
                {[
                  { step: "01", label: "Entry", desc: "Single Engine (₹499)" },
                  { step: "02", label: "Expansion", desc: "Modular Add-ons" },
                  { step: "03", label: "Upgrade", desc: "ArqonOS Bundle (₹2499)" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-4 border-l-2 border-white/20 pl-4 py-1">
                    <span className="text-[10px] font-black opacity-60">STEP {s.step}</span>
                    <div>
                      <div className="font-bold text-sm tracking-tight">{s.label}</div>
                      <div className="text-[10px] opacity-60 uppercase tracking-widest">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Pillar 3: Ecosystem Roadmap */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col group hover:border-[#3b82f644] transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-8 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Future Roadmap</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Constant evolution of the operating system. We are expanding the intelligence layer to cover every sector of the built environment.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="text-[10px] font-black text-[#3b82f6] bg-[#3b82f61a] px-2 py-0.5 rounded shrink-0 mt-1">Q3 24</div>
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-300">Predictive Outcome AI Engine</div>
                </div>
                <div className="flex gap-4 items-start opacity-60">
                  <div className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded shrink-0 mt-1">Q4 24</div>
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-300">Global Vendor Network v2.0</div>
                </div>
                <div className="flex gap-4 items-start opacity-40">
                  <div className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded shrink-0 mt-1">2025</div>
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-300">Arqon Autonomous Enterprise</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Your Project Path: The Universal Experience Layer */}
      <section className="px-6 md:px-12 py-32 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors overflow-hidden relative">
        {/* Background Decor */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3b82f60a] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#3b82f605] blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-32">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3b82f6] px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded inline-block mb-8 shadow-sm">
              The Experience Layer
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1] flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#3b82f61a] text-[#3b82f6] flex items-center justify-center shrink-0">
                <Milestone className="w-7 h-7" />
              </div>
              Your Project Path
            </h2>
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
              The Universal Experience Layer. Arqon adapts to your natural workflow, providing a clear and guided experience from first task to terminal intelligence.
            </p>
          </div>

          <div className="relative">
            {/* The Path Line - Refined */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#3b82f688] via-slate-200 dark:via-slate-800 to-transparent md:-translate-x-1/2" />
            
            {/* Data Flow Pulse */}
            <motion.div 
              animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute left-8 md:left-1/2 w-1 h-32 bg-gradient-to-b from-transparent via-[#3b82f6] to-transparent md:-translate-x-1/2 z-10 pointer-events-none"
            />

            <div className="space-y-40 relative">
              {[
                { 
                  phase: "01 Foundation", 
                  title: "Organization", 
                  apps: [modules[0], modules[1]], // Quest, Flow
                  desc: "Replace manual friction with structural clarity. Define your tasks and transform them into automated, repeatable systems."
                },
                { 
                  phase: "02 Growth", 
                  title: "Acquisition", 
                  apps: [modules[2], modules[3]], // Connect, People
                  desc: "Scale your revenue engine. Manage client pipelines and team roles through a single, unified identity layer."
                },
                { 
                  phase: "03 Execution", 
                  title: "Realization", 
                  apps: [modules[4], modules[5], modules[6]], // Studio, Cost, Vendor
                  desc: "Design and deliver with total cost visibility. Coordinate external procurement natively within your creative workspace."
                },
                { 
                  phase: "04 Intelligence", 
                  title: "Optimization", 
                  apps: [modules[7], modules[8], modules[10]], // Insight, AI, ArqonOS
                  desc: "Harness the power of the intelligent brain. Predictive analytics and automated insights drive your business logic."
                }
              ].map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className={cn(
                    "flex flex-col md:flex-row items-start md:items-center gap-12 lg:gap-24",
                    idx % 2 === 0 ? "md:flex-row-reverse" : ""
                  )}
                >
                  {/* Content Side */}
                  <div className={cn(
                    "flex-1 text-left pl-20 md:pl-0",
                    idx % 2 === 0 ? "md:text-left" : "md:text-right"
                  )}>
                    <div className="inline-flex items-center gap-2 mb-4 group cursor-default">
                      <span className="w-8 h-px bg-[#3b82f644] group-hover:w-12 transition-all" />
                      <span className="text-[#3b82f6] font-black text-xs uppercase tracking-widest">{step.phase}</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">{step.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium">
                      {step.desc}
                    </p>
                  </div>

                  {/* Marker (Center) */}
                  <div className="absolute left-0 md:relative md:left-auto flex items-center justify-center shrink-0 z-20">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border-4 border-slate-50 dark:border-slate-800 shadow-2xl flex items-center justify-center transition-all hover:scale-110 group cursor-pointer overflow-hidden">
                      <div className="absolute inset-0 bg-[#3b82f60a] group-hover:bg-[#3b82f61a] transition-colors" />
                      <div className="w-4 h-4 rounded-full bg-[#3b82f6] shadow-[0_0_20px_2px_#3b82f6] pulse group-hover:scale-125 transition-transform" />
                    </div>
                  </div>

                  {/* Apps Side */}
                  <div className="flex-1 flex flex-wrap justify-start md:justify-center gap-4 pl-20 md:pl-0">
                    {step.apps.map((app, appIdx) => (
                      <div 
                        key={appIdx}
                        className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group w-36 flex flex-col items-center text-center relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: app.color }} />
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 shadow-sm"
                          style={{ backgroundColor: `${app.color}1a`, color: app.color }}
                        >
                          <app.icon className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                          {app.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ArqonOS Section */}
      <section className="px-6 md:px-12 py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3b82f6] px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded inline-block mb-8 shadow-sm">
              Unified OS
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#3b82f61a] text-[#3b82f6] flex items-center justify-center shrink-0">
                <Zap className="w-7 h-7" />
              </div>
              ArqonOS: One Platform. <br className="hidden md:block" /><span className="text-[#3b82f6]">Infinite Control.</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              The command center of your entire ecosystem. All engines, one brain.
            </p>
          </div>

          <div className="relative h-[400px] md:h-[600px] flex items-center justify-center">
            {/* Background Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] border border-slate-100 dark:border-slate-800 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] border border-slate-100 dark:border-slate-800 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            </div>

            {/* Central Hub */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="relative z-20 w-24 h-24 md:w-36 md:h-36 bg-white dark:bg-slate-900 border-2 border-[#3b82f6] rounded-2xl md:rounded-3xl shadow-2xl shadow-[#3b82f64d] flex items-center justify-center group"
            >
              {/* Outer Core Aura */}
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[#3b82f6] rounded-2xl md:rounded-3xl blur-xl md:blur-2xl -z-10"
              />

              <div className="grid grid-cols-2 gap-1 md:gap-1.5 w-9 h-9 md:w-15 md:h-15 group-hover:rotate-180 transition-transform duration-1000">
                <div className="bg-[#3b82f6] rounded-sm"></div>
                <div className="bg-[#3b82f6] rounded-sm opacity-80"></div>
                <div className="bg-[#3b82f6] rounded-sm opacity-60"></div>
                <div className="bg-[#3b82f6] rounded-sm opacity-40"></div>
              </div>
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-black text-xs md:text-sm tracking-[0.2em] text-[#3b82f6] uppercase">
                ArqonOS
              </div>
            </motion.div>

            {/* Orbiting Icons */}
            {[
              { id: 'quest', icon: Box, color: '#3b82f6', angle: 0, delay: 0 },
              { id: 'flow', icon: Workflow, color: '#0ea5e9', angle: 40, delay: 0.1 },
              { id: 'connect', icon: Hexagon, color: '#f97316', angle: 80, delay: 0.2 },
              { id: 'people', icon: Users, color: '#a855f7', angle: 120, delay: 0.3 },
              { id: 'studio', icon: Layers, color: '#f97316', angle: 160, delay: 0.4 },
              { id: 'cost', icon: Database, color: '#94a3b8', angle: 200, delay: 0.5 },
              { id: 'vendor', icon: Truck, color: '#07B9CE', angle: 240, delay: 0.6 },
              { id: 'insight', icon: LineChart, color: '#94a3b8', angle: 280, delay: 0.7 },
              { id: 'ai', icon: Brain, color: '#A0D6B4', angle: 320, delay: 0.8 },
            ].map((app, i) => {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="absolute z-10 w-10 h-10 md:w-16 md:h-16 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg flex items-center justify-center group hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer transition-colors"
                  style={{
                    left: '50%',
                    top: '50%',
                    color: app.color,
                  } as any}
                  animate={{
                    x: [
                      `calc(-50% + ${Math.cos((app.angle * Math.PI) / 180) * radius}px)`,
                      `calc(-50% + ${Math.cos((app.angle * Math.PI) / 180) * (radius + 10)}px)`,
                      `calc(-50% + ${Math.cos((app.angle * Math.PI) / 180) * radius}px)`
                    ],
                    y: [
                      `calc(-50% + ${Math.sin((app.angle * Math.PI) / 180) * radius}px)`,
                      `calc(-50% + ${Math.sin((app.angle * Math.PI) / 180) * (radius + 10)}px)`,
                      `calc(-50% + ${Math.sin((app.angle * Math.PI) / 180) * radius}px)`
                    ],
                  } as any}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut", 
                    delay: app.delay,
                    opacity: { duration: 0.5, delay: app.delay },
                    scale: { type: "spring", stiffness: 100, delay: app.delay }
                  }}
                >
                  <app.icon className="w-5 h-5 md:w-7 md:h-7 group-hover:scale-110 transition-transform" />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black rounded-md opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-xl border border-slate-700 dark:border-slate-200 uppercase tracking-[0.1em]">
                    {app.id.toUpperCase()}
                  </div>
                  
                  {/* Connection Line */}
                  <div 
                    className="absolute top-1/2 left-1/2 w-[150px] md:w-[250px] h-[1px] bg-gradient-to-r from-[#3b82f644] to-transparent origin-left -z-10 group-hover:from-[#3b82f6aa] transition-all duration-500"
                    style={{ 
                      transform: `rotate(${app.angle + 180}deg) scaleX(1)`,
                      width: `${radius + 20}px`,
                      maxWidth: '400px'
                    }}
                  />

                  {/* Pulsing Data Flow Node */}
                  <motion.div
                    animate={{ 
                      offsetDistance: ['0%', '100%'],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      delay: app.delay * 5,
                      ease: "linear"
                    }}
                    className="absolute w-1.5 h-1.5 bg-[#3b82f6] rounded-full blur-[1px] shadow-[0_0_8px_#3b82f6] pointer-events-none"
                    style={{
                      offsetPath: `path('M 0 0 L ${-Math.cos((app.angle * Math.PI) / 180) * radius} ${-Math.sin((app.angle * Math.PI) / 180) * radius}')`
                    } as any}
                  />
                </motion.div>
              );
            })}
          </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-900 shadow-sm hover:shadow-md group">
              <div className="w-12 h-12 bg-[#3b82f61a] text-[#3b82f6] rounded-xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 shadow-sm">
                <Command className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Unified Workspace</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                One identity, one dashboard, and zero context switching between marketing and operations.
              </p>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-900 shadow-sm hover:shadow-md group">
              <div className="w-12 h-12 bg-[#22c55e1a] text-[#22c55e] rounded-xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 shadow-sm">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Live Sync Intelligence</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Data flows natively between modules. When a lead closes in Connect, a project starts in Flow automatically.
              </p>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-900 shadow-sm hover:shadow-md group">
              <div className="w-12 h-12 bg-[#a855f71a] text-[#a855f7] rounded-xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 shadow-sm">
                <Cpu className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Infinite Scalability</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Subscribe to what you need. Unlock ArqonOS to gain total control over the entire Arqon ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Get In Touch */}
      <section className="px-6 md:px-12 py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
         <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#3b82f61a] text-[#3b82f6] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-7 h-7" />
                </div>
                Get In Touch
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl font-medium">
                Connect with our team to explore enterprise solutions and strategic partnerships.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 max-w-3xl">
               {/* Enterprise Inquiry */}
               <div className="bg-slate-50 dark:bg-slate-950 p-8 sm:p-12 rounded-xl border border-slate-100 dark:border-slate-800 relative overflow-hidden group transition-all hover:bg-white dark:hover:bg-slate-900 shadow-sm hover:shadow-md">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#3b82f61a] rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                  <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3b82f6] px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded inline-block mb-8 shadow-sm">Enterprise</span>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Start a Conversation</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                      Custom deployments, volume licensing, and strategic implementation support for global organizations.
                    </p>
                    <a href="mailto:enterprise@arqon.com" className="inline-flex items-center gap-2 text-[#3b82f6] font-bold hover:gap-3 transition-all">
                      enterprise@arqonos.com <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
