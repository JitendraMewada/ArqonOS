import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Layers } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

const modulesData: Record<string, any> = {
  quest: {
    name: 'Quest',
    theme: 'blue',
    hex: '#3b82f6',
    description: 'To-do, task management, calendar, and messenger. Your daily driver for organizing tasks, schedules, and communication.',
    features: ['Task tracking & delegation', 'Calendar synchronization', 'Real-time team messenger', 'Automated reminders'],
    useCases: ['Daily organization', 'Team coordination', 'Deadline tracking'],
    integrations: ['Flow', 'People', 'ArqonOS'],
    roles: ['Help Desk', 'Coordinator', 'All Roles'],
    pages: ['Overview', 'Task Page', 'Calendar Page', 'Messenger Page']
  },
  flow: {
    name: 'Flow',
    theme: 'sky',
    hex: '#0ea5e9',
    description: 'Workflow management. Structures projects and processes so tasks flow into broader workflows seamlessly.',
    features: ['Visual process builder', 'Automated triggers', 'Bottleneck tracking', 'Cross-module task generation'],
    useCases: ['Project structuring', 'Standardizing procedures', 'Scaling operations'],
    integrations: ['Quest', 'Insight', 'Connect'],
    roles: ['Project Manager', 'Team Members'],
    pages: ['Workflow Builder', 'Automation Page', 'Tracking Page']
  },
  connect: {
    name: 'Connect',
    theme: 'orange',
    hex: '#f97316',
    description: 'CRM, lead management, pipeline tracking, communication, and client management. Your growth engine.',
    features: ['Lead capture & scoring', 'Pipeline visualization', 'Client communication hub', 'Email integration'],
    useCases: ['Sales tracking', 'Client onboarding', 'Relationship building'],
    integrations: ['Flow', 'People', 'Cost'],
    roles: ['Sales Manager', 'Account Executive'],
    pages: ['CRM Dashboard', 'Pipeline Page', 'Communication Page']
  },
  people: {
    name: 'People',
    theme: 'purple',
    hex: '#a855f7',
    description: 'HR, team, and client management. Manages internal teams, roles, and collaborative structuring efficiently.',
    features: ['Detailed team directory', 'Role-based access control', 'Performance & client tracking', 'Collaboration tools'],
    useCases: ['HR management', 'Resource allocation', 'Access control'],
    integrations: ['Quest', 'Connect', 'Vendor'],
    roles: ['HR Manager', 'Team Leads'],
    pages: ['Directory Page', 'Roles Page', 'Collaboration Page']
  },
  studio: {
    name: 'Studio',
    theme: 'orange',
    hex: '#f97316',
    description: 'Design and creative workspace. Provides the creative environment for design and project visualization.',
    features: ['Collaborative design canvas', 'Centralized asset library', 'Client presentation mode', 'Version control'],
    useCases: ['Creative brainstorming', 'Design execution', 'Client reviews'],
    integrations: ['Connect', 'Cost'],
    roles: ['Designer', 'Creative Director'],
    pages: ['Design Page', 'Library Page', 'Presentation Page']
  },
  cost: {
    name: 'Cost',
    theme: 'silver',
    hex: '#94a3b8',
    description: 'Budgeting and expense tracking. Tracks financials, budgets, and project costs safely.',
    features: ['Real-time budget planning', 'Expense tracking & categorization', 'Financial reporting', 'Approval workflows'],
    useCases: ['Project budgeting', 'Profit margin analysis', 'Expense approvals'],
    integrations: ['Vendor', 'Insight', 'Connect'],
    roles: ['Finance Manager', 'Project Leads'],
    pages: ['Budget Page', 'Expense Page', 'Reports Page']
  },
  vendor: {
    name: 'Vendor',
    theme: 'cyan',
    hex: '#07B9CE',
    description: 'Vendor and supplier coordination. Coordinates external suppliers and clear procurement processes.',
    features: ['Supplier directory', 'Procurement & PO tracking', 'Contract & renewal management'],
    useCases: ['Supplier vetting', 'Purchase orders', 'Renewal tracking'],
    integrations: ['Cost', 'People', 'Insight'],
    roles: ['Procurement Officer', 'Finance Team'],
    pages: ['Directory Page', 'Procurement Page', 'Contracts Page']
  },
  insight: {
    name: 'Insight',
    theme: 'silver',
    hex: '#94a3b8',
    description: 'Analytics and reporting. Generates powerful insights from workflows, costs, people, and vendors.',
    features: ['Custom modular dashboards', 'Predictive analytics & forecasting', 'Automated reporting', 'Data exports'],
    useCases: ['Performance reviews', 'Financial forecasting', 'Resource planning'],
    integrations: ['Cost', 'Flow', 'AI'],
    roles: ['Analyst', 'Managers'],
    pages: ['Dashboard Page', 'Reports Page', 'Forecast Page']
  },
  ai: {
    name: 'AI',
    theme: 'mint',
    hex: '#A0D6B4',
    description: 'Artificial intelligence-powered tools. Adds intelligence, automation, and predictive capabilities across all modules.',
    features: ['Smart task automation', 'Predictive modeling', 'Contextual workflow suggestions', 'Natural language queries'],
    useCases: ['Risk mitigation', 'Workflow optimization', 'Data entry reduction'],
    integrations: ['Insight', 'Flow', 'ArqonOS'],
    roles: ['AI Specialist', 'Managers'],
    pages: ['Automation Page', 'Prediction Page', 'Optimization Page']
  },
  nest: {
    name: 'Nest',
    theme: 'emerald',
    hex: '#22c55e',
    description: 'Family and friends finance organizer. The core of the B2C ecosystem.',
    features: ['Shared household budgets', 'Event & trip planning', 'Expense splitting', 'Goal tracking'],
    useCases: ['Family vacations', 'Household expenses', 'Friend group trips'],
    integrations: ['ArqonOS'],
    roles: ['Users', 'Households'],
    pages: ['Finances', 'Events', 'Goals']
  },
  arqonos: {
    name: 'ArqonOS',
    theme: 'indigo',
    hex: '#3b82f6',
    description: 'Bundled suite of all web apps. Integrates all apps and enables subscription bundling and add-ons.',
    features: ['Unified single-sign-on dashboard', 'Cross-module automated data flow', 'Centralized billing', 'Scalable architecture'],
    useCases: ['Enterprise management', 'Full-stack agency control', 'Scalable operations'],
    integrations: ['All Modules'],
    roles: ['System Admin', 'Users'],
    pages: ['Dashboard', 'Subscriptions', 'Settings']
  },
  essence: {
    name: 'Essence',
    theme: 'silver',
    hex: '#94a3b8',
    description: 'Interior designer showcase portfolio. A platform to exhibit creativity and expertise in the built environment.',
    features: ['Project gallery', 'Service listings', 'Client testimonials', 'Booking integration'],
    useCases: ['Portfolio display', 'Brand building', 'Lead generation'],
    integrations: ['ArqonOS', 'Connect'],
    roles: ['Designers', 'Architects'],
    pages: ['Gallery', 'Services', 'Contact']
  },
  pravara: {
    name: 'PRAVARA',
    theme: 'gold',
    hex: '#d4af37',
    description: 'Women\'s luxury clothing and fashion e-commerce brand. Experience premium fashion through an intelligent platform.',
    features: ['E-commerce store', 'Dynamic collections', 'Secure payments', 'Order tracking'],
    useCases: ['Luxury retail', 'Brand management', 'Customer engagement'],
    integrations: ['ArqonOS', 'Cost'],
    roles: ['Customers', 'Admins'],
    pages: ['Shop', 'Collections', 'Account']
  }
}

const getThemeClasses = (hex: string) => {
  const normalizedHex = hex.toLowerCase();
  
  const themes: Record<string, any> = {
    '#3b82f6': { // Arqon, ArqonOS, Quest
      bgLabel: 'bg-[#3b82f61a] text-[#3b82f6]',
      iconBg: 'bg-[#3b82f61a]',
      iconText: 'text-[#3b82f6]',
      btnBg: 'bg-[#3b82f6] hover:bg-[#3b82f6e6] shadow-[0_4px_14px_0_#3b82f633]',
      textMain: 'text-[#3b82f6]'
    },
    '#22c55e': { // Nest
      bgLabel: 'bg-[#22c55e1a] text-[#22c55e]',
      iconBg: 'bg-[#22c55e1a]',
      iconText: 'text-[#22c55e]',
      btnBg: 'bg-[#22c55e] hover:bg-[#22c55ee6] shadow-[0_4px_14px_0_#22c55e33]',
      textMain: 'text-[#22c55e]'
    },
    '#d4af37': { // PRAVARA
      bgLabel: 'bg-[#d4af371a] text-[#d4af37]',
      iconBg: 'bg-[#d4af371a]',
      iconText: 'text-[#d4af37]',
      btnBg: 'bg-[#d4af37] hover:bg-[#d4af37e6] shadow-[0_4px_14px_0_#d4af3733]',
      textMain: 'text-[#d4af37]'
    },
    '#94a3b8': { // Cost, Insight, Essence
      bgLabel: 'bg-[#94a3b81a] text-[#94a3b8]',
      iconBg: 'bg-[#94a3b81a]',
      iconText: 'text-[#94a3b8]',
      btnBg: 'bg-[#94a3b8] hover:bg-[#94a3b8e6] shadow-[0_4px_14px_0_#94a3b833]',
      textMain: 'text-[#94a3b8]'
    },
    '#a855f7': { // People
      bgLabel: 'bg-[#a855f71a] text-[#a855f7]',
      iconBg: 'bg-[#a855f71a]',
      iconText: 'text-[#a855f7]',
      btnBg: 'bg-[#a855f7] hover:bg-[#a855f7e6] shadow-[0_4px_14px_0_#a855f733]',
      textMain: 'text-[#a855f7]'
    },
    '#f97316': { // Studio, Connect
      bgLabel: 'bg-[#f973161a] text-[#f97316]',
      iconBg: 'bg-[#f973161a]',
      iconText: 'text-[#f97316]',
      btnBg: 'bg-[#f97316] hover:bg-[#f97316e6] shadow-[0_4px_14px_0_#f9731633]',
      textMain: 'text-[#f97316]'
    },
    '#07b9ce': { // Vendor
      bgLabel: 'bg-[#07b9ce1a] text-[#07b9ce]',
      iconBg: 'bg-[#07b9ce1a]',
      iconText: 'text-[#07b9ce]',
      btnBg: 'bg-[#07b9ce] hover:bg-[#07b9cee6] shadow-[0_4px_14px_0_#07b9ce33]',
      textMain: 'text-[#07b9ce]'
    },
    '#a0d6b4': { // AI
      bgLabel: 'bg-[#a0d6b41a] text-[#a0d6b4]',
      iconBg: 'bg-[#a0d6b41a]',
      iconText: 'text-[#a0d6b4]',
      btnBg: 'bg-[#a0d6b4] hover:bg-[#a0d6b4e6] shadow-[0_4px_14px_0_#a0d6b433]',
      textMain: 'text-[#a0d6b4]'
    },
    '#0ea5e9': { // Flow
      bgLabel: 'bg-[#0ea5e91a] text-[#0ea5e9]',
      iconBg: 'bg-[#0ea5e91a]',
      iconText: 'text-[#0ea5e9]',
      btnBg: 'bg-[#0ea5e9] hover:bg-[#0ea5e9e6] shadow-[0_4px_14px_0_#0ea5e933]',
      textMain: 'text-[#0ea5e9]'
    }
  };
  return themes[normalizedHex] || themes['#3b82f6'];
}

export function ModuleShowcase() {
  const { moduleId } = useParams<{ moduleId: string }>();
  
  if (!moduleId || !modulesData[moduleId]) {
    return <Navigate to="/" replace />;
  }
  
  const mod = modulesData[moduleId];
  const colorClasses = getThemeClasses(mod.hex);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 md:px-12 bg-slate-50 dark:bg-slate-950 flex justify-center items-center transition-colors duration-300">
      <div className="max-w-4xl mx-auto w-full">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium mb-8 sm:mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Ecosystem
        </Link>

        <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 md:p-12 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden transition-all">
           {/* Geometric decorative background */}
           <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-slate-50 dark:bg-slate-800/50 rounded-bl-full -mr-8 -mt-8 sm:-mr-16 sm:-mt-16 pointer-events-none border-b border-l border-slate-100 dark:border-slate-700" />
           
           <div className="relative z-10">
              <div className={cn("inline-block px-3 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded mb-8 shadow-sm", colorClasses.textMain)}>
                Module Deep Dive
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <div className={cn("w-12 h-12 rounded flex items-center justify-center shrink-0", colorClasses.iconBg, colorClasses.iconText)}>
                  <Layers className="w-6 h-6" />
                </div>
                <h1 className={cn("text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight", colorClasses.textMain)}>
                   {mod.name}
                </h1>
              </div>

              <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium mb-10 sm:mb-12 leading-relaxed max-w-2xl">
                {mod.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-12">
                 <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border border-slate-100 dark:border-slate-700">
                   <h4 className="font-bold text-slate-900 dark:text-white mb-2">Strategic Role</h4>
                   <p className="text-slate-500 dark:text-slate-400 text-sm">Part of the intelligent system built to process and optimize the built environment.</p>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border border-slate-100 dark:border-slate-700">
                   <h4 className="font-bold text-slate-900 dark:text-white mb-2">Access Type</h4>
                   <p className="text-slate-500 dark:text-slate-400 text-sm">Available as a standalone module or bundled natively within ArqonOS.</p>
                 </div>
              </div>

               {/* Module Specific Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 sm:mb-12 border-t border-slate-100 dark:border-slate-800 pt-10 sm:pt-12">
                
                {/* Key Features */}
                {mod.features && (
                  <div className="space-y-4">
                     <h4 className="font-bold text-lg" style={{ color: mod.hex }}>Key Features</h4>
                    <ul className="space-y-3">
                      {mod.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                          <CheckCircle2 className={cn("w-4 h-4 shrink-0 mt-0.5", colorClasses.iconText)} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sub Web Apps / Pages */}
                {mod.pages && (
                  <div>
                    <h4 className="font-bold mb-4 text-lg" style={{ color: mod.hex }}>Web App Pages</h4>
                    <ul className="space-y-3">
                      {mod.pages.map((page: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                          <CheckCircle2 className={cn("w-4 h-4 shrink-0 mt-0.5", colorClasses.iconText)} />
                          <span>{page}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Roles & Responsibilities */}
                {mod.roles && (
                  <div>
                    <h4 className="font-bold mb-4 text-lg" style={{ color: mod.hex }}>Roles & Users</h4>
                    <div className="flex flex-col gap-2">
                       {mod.roles.map((role: string, idx: number) => (
                         <div key={idx} className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 py-2 rounded text-sm text-slate-600 dark:text-slate-400 font-medium">
                           {role}
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {/* Use Cases */}
                {mod.useCases && (
                  <div>
                    <h4 className="font-bold mb-4 text-lg" style={{ color: mod.hex }}>Use Cases</h4>
                    <div className="flex flex-col gap-2">
                       {mod.useCases.map((useCase: string, idx: number) => (
                         <div key={idx} className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 py-2 rounded text-sm text-slate-600 dark:text-slate-400 font-medium">
                           {useCase}
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                 {/* Integrations */}
                 {mod.integrations && (
                  <div>
                    <h4 className="font-bold mb-4 text-lg" style={{ color: mod.hex }}>Integrations</h4>
                    <div className="flex flex-wrap gap-2">
                       {mod.integrations.map((integration: string, idx: number) => (
                         <span key={idx} className={cn("px-3 py-1 bg-opacity-10 text-xs font-bold uppercase tracking-wider rounded border", colorClasses.iconBg, colorClasses.iconText)} style={{ borderColor: `${mod.hex}40` }}>
                           {integration}
                         </span>
                       ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-100 dark:border-slate-800">
                {(moduleId === 'essence' || moduleId === 'pravara') ? (
                  <>
                    <a 
                      href={moduleId === 'essence' ? 'https://essence.arqon.com' : 'https://pravara.arqon.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn("px-8 py-4 text-white font-bold rounded-md text-center transition-all shadow-lg cursor-pointer inline-block", colorClasses.btnBg)}
                    >
                      Go to Web
                    </a>
                    <Link 
                      to="/gateway" 
                      className="px-8 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-md text-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors inline-block"
                    >
                      Enter Workspace
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/pricing" 
                      className={cn("px-8 py-4 text-white font-bold rounded-md text-center transition-all shadow-lg", colorClasses.btnBg)}
                    >
                      View Pricing
                    </Link>
                    <Link 
                      to="/gateway" 
                      className="px-8 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-md text-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      Enter Workspace
                    </Link>
                  </>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
