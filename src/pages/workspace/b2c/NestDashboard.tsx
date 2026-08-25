import { useState } from 'react';
import { 
  Home, 
  Wallet, 
  PieChart, 
  Users, 
  Bell, 
  Settings, 
  LogOut, 
  ChevronRight, 
  ArrowLeft, 
  Menu, 
  Sun, 
  Moon,
  PlusCircle,
  Receipt,
  Target,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

const nestApps = [
  { id: 'overview', name: 'Overview', icon: Home, colorClass: 'text-[#22c55e]', bgClass: 'bg-[#22c55e1a]', activeBg: 'bg-[#22c55e]', borderClass: 'border-[#22c55e33]', shade: '#22c55e', pages: ['Daily Feed', 'Account Balances'] },
  { id: 'expenses', name: 'Expenses', icon: Receipt, colorClass: 'text-[#22c55e]', bgClass: 'bg-[#22c55e1a]', activeBg: 'bg-[#22c55e]', borderClass: 'border-[#22c55e33]', shade: '#22c55e', pages: ['Transaction History', 'Bill Splitter', 'Invoices'] },
  { id: 'budgets', name: 'Budgets', icon: Wallet, colorClass: 'text-[#22c55e]', bgClass: 'bg-[#22c55e1a]', activeBg: 'bg-[#22c55e]', borderClass: 'border-[#22c55e33]', shade: '#22c55e', pages: ['Monthly Planner', 'Category Limits'] },
  { id: 'savings', name: 'Savings', icon: Target, colorClass: 'text-[#22c55e]', bgClass: 'bg-[#22c55e1a]', activeBg: 'bg-[#22c55e]', borderClass: 'border-[#22c55e33]', shade: '#22c55e', pages: ['Goal Tracking', 'Airdrop Savings'] },
  { id: 'family', name: 'Family', icon: Users, colorClass: 'text-[#22c55e]', bgClass: 'bg-[#22c55e1a]', activeBg: 'bg-[#22c55e]', borderClass: 'border-[#22c55e33]', shade: '#22c55e', pages: ['Members', 'Shared Vaults', 'Allowances'] },
  { id: 'analytics', name: 'Analytics', icon: PieChart, colorClass: 'text-[#22c55e]', bgClass: 'bg-[#22c55e1a]', activeBg: 'bg-[#22c55e]', borderClass: 'border-[#22c55e33]', shade: '#22c55e', pages: ['Spending Reports', 'Wealth Roadmap'] },
];

export function NestDashboard() {
  const [activeApp, setActiveApp] = useState<string>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col lg:flex-row p-4 gap-4 font-sans lg:h-screen lg:overflow-hidden relative transition-colors duration-300">
       
       {/* Mobile Overlay */}
       <div 
         className={cn(
           "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
           isSidebarMobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
         )}
         onClick={() => setIsSidebarMobileOpen(false)}
       />

       {/* Sidebar */}
       <aside className={cn(
         "lg:flex flex-shrink-0 flex flex-col gap-4 transition-all duration-300 fixed lg:relative inset-y-0 left-0 bg-slate-50 dark:bg-slate-950 lg:bg-transparent z-50 p-4 lg:p-0",
         isSidebarMobileOpen ? "translate-x-0 w-80 shadow-2xl" : "-translate-x-full lg:translate-x-0",
         isSidebarCollapsed ? "lg:w-[100px]" : "lg:w-80"
       )}>
          {/* Logo Card */}
          <div className={cn("bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl flex items-center transition-all duration-300", isSidebarCollapsed ? "lg:p-4 lg:justify-center h-[88px]" : "p-6 gap-3 h-[88px]")}>
             <div className="w-10 h-10 shrink-0 flex items-center justify-center">
               <div className="grid grid-cols-2 gap-1 w-8 h-8">
                 <div className="bg-[#22c55e] rounded-[2px]"></div>
                 <div className="bg-[#22c55e] rounded-[2px] opacity-80"></div>
                 <div className="bg-[#22c55e] rounded-[2px] opacity-60"></div>
                 <div className="bg-[#22c55e] rounded-[2px] opacity-40"></div>
               </div>
             </div>
             {(!isSidebarCollapsed || isSidebarMobileOpen) && (
               <div className="animate-in fade-in duration-300 overflow-hidden whitespace-nowrap">
                 <h2 className="font-bold tracking-tight text-lg text-slate-900 dark:text-white leading-tight">Arqon Nest</h2>
                 <p className="text-xs font-semibold uppercase tracking-wider text-[#22c55e]">B2C Workspace</p>
               </div>
             )}
          </div>

          {/* Nav Pills Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4 rounded-xl flex-grow overflow-y-auto custom-scrollbar space-y-2 transition-colors">
             <div className={cn("flex items-center mb-4 mt-2 px-2 transition-all duration-300", (isSidebarCollapsed && !isSidebarMobileOpen) ? "justify-center" : "justify-between")}>
                {(!isSidebarCollapsed || isSidebarMobileOpen) && <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Space</div>}
             </div>
             {nestApps.map(app => (
               <button 
                 key={app.id} 
                 onClick={() => { setActiveApp(app.id); if(isSidebarMobileOpen) setIsSidebarMobileOpen(false); }}
                 className={cn(
                   "w-full flex items-center p-3 rounded-lg transition-all border",
                   activeApp === app.id ? cn(app.bgClass, app.borderClass, app.colorClass) : "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400",
                   (isSidebarCollapsed && !isSidebarMobileOpen) ? "justify-center" : "justify-between"
                 )}
                 title={isSidebarCollapsed ? app.name : undefined}
               >
                 <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg shrink-0 flex items-center justify-center transition-colors", activeApp === app.id ? cn(app.activeBg, 'text-white shadow-md shadow-[#22c55e33]') : "bg-slate-100 dark:bg-slate-800")}>
                      <app.icon className="w-4 h-4" />
                    </div>
                    {(!isSidebarCollapsed || isSidebarMobileOpen) && <span className="font-semibold text-sm whitespace-nowrap">{app.name}</span>}
                 </div>
                 {(!isSidebarCollapsed || isSidebarMobileOpen) && <ChevronRight className={cn("w-4 h-4 text-slate-400 transition-transform", activeApp === app.id && "rotate-90")} />}
               </button>
             ))}
          </div>

          {/* Quick Action Card (New for Nest) */}
          <div className={cn("bg-[#22c55e] rounded-xl text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-[#22c55e33] transition-all duration-300", isSidebarCollapsed ? "p-4 flex items-center justify-center" : "p-5")}>
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-md blur-2xl group-hover:scale-125 transition-transform" />
             <div className={cn("relative z-10 flex", isSidebarCollapsed ? "flex-col items-center" : "items-start gap-4")}>
                <PlusCircle className={cn("shrink-0", isSidebarCollapsed ? "w-6 h-6" : "w-8 h-8 mb-3")} />
                {(!isSidebarCollapsed || isSidebarMobileOpen) && (
                  <div>
                    <h4 className="font-bold text-sm">Add Transaction</h4>
                    <p className="text-[10px] text-white/80 font-medium">Quickly log an expense</p>
                  </div>
                )}
             </div>
          </div>
       </aside>

       {/* Main Content Area */}
       <main className="flex-grow flex flex-col gap-4 min-w-0">
          {/* Topbar Card */}
          <header className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4 h-[88px] rounded-xl flex items-center justify-between shrink-0 transition-colors">
             <div className="flex items-center gap-2 sm:gap-4 px-1 sm:px-2">
                <button 
                  onClick={() => setIsSidebarMobileOpen(true)}
                  className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <button 
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="hidden lg:flex w-10 h-10 rounded-lg items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 flex-shrink-0"
                >
                   {isSidebarCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                </button>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

                <div className="hidden sm:flex items-center bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-lg border border-slate-100 dark:border-slate-800 shadow-inner">
                  <div className="flex items-center gap-3">
                    <div className="px-2 py-0.5 bg-[#22c55e1a] border border-[#22c55e33] text-[#22c55e] text-[9px] font-black uppercase tracking-tight rounded-lg">
                      Nest Pro
                    </div>
                    <div className="h-3 w-px bg-slate-200 dark:bg-slate-800"></div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Users className="w-3 h-3" /> Family Plan Active
                    </div>
                  </div>
                </div>
             </div>

             <div className="flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                   {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
                <Link to="/" className="px-3 py-1.5 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hidden sm:flex">
                  <ArrowLeft className="w-3 h-3 mr-1.5" /> Marketing
                </Link>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 cursor-pointer group hover:bg-white dark:hover:bg-slate-900 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-[#2c3e50] flex items-center justify-center text-white overflow-hidden shadow-sm">
                     <img src="https://ui-avatars.com/api/?name=Jane+Doe&background=22c55e&color=fff" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                     <span className="text-xs font-bold text-slate-900 dark:text-white transition-colors group-hover:text-[#22c55e]">Jane Doe</span>
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Family Organizer</span>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
             </div>
          </header>

          {/* Dashboard Canvas */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-8 rounded-xl flex-grow overflow-y-auto custom-scrollbar relative transition-colors">
              <div className="max-w-6xl mx-auto space-y-8">
                 {/* Welcome Message */}
                 <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Good morning, <span className="text-[#22c55e]">Jane.</span></h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Your family finance is on track. <span className="text-xs text-[#22c55e] font-bold underline cursor-pointer">View Roadmap</span></p>
                 </div>

                 {/* Overview Cards */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Total Balance</p>
                       <div className="text-3xl font-bold text-slate-900 dark:text-white">₹1,42,500</div>
                       <div className="flex items-center gap-1 text-[10px] text-[#22c55e] font-bold mt-2">
                          <PlusCircle className="w-3 h-3" /> +₹12,400 this month
                       </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Active Budgets</p>
                       <div className="text-3xl font-bold text-slate-900 dark:text-white">12 Categories</div>
                       <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-md mt-4 overflow-hidden">
                          <div className="h-full bg-[#22c55e] w-[65%]"></div>
                       </div>
                       <p className="text-[9px] text-slate-400 font-medium mt-2">65% of monthly budget utilized</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Savings Goals</p>
                       <div className="text-3xl font-bold text-slate-900 dark:text-white">₹8,00,000</div>
                       <div className="flex items-center gap-4 mt-4">
                          <div className="flex -space-x-2">
                             {[1,2,3].map(i => (
                               <div key={i} className="w-6 h-6 rounded-md border-2 border-white dark:border-slate-950 bg-slate-200">
                                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Family" className="w-full h-full rounded-full" />
                               </div>
                             ))}
                          </div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Shared with family</span>
                       </div>
                    </div>
                 </div>

                 {/* Recent Activity Section */}
                 <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                       <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white uppercase tracking-widest">Recent Activity</h3>
                       <button className="text-[10px] font-black uppercase text-[#22c55e] hover:underline">View All</button>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                       {[
                         { title: 'Grocery Supermart', type: 'Food', amount: '-₹2,450', color: 'text-red-500', time: '2 hours ago' },
                         { title: 'Salary Credit', type: 'Income', amount: '+₹85,000', color: 'text-[#22c55e]', time: 'Yesterday' },
                         { title: 'Netflix Subscription', type: 'Entertainment', amount: '-₹499', color: 'text-red-500', time: '2 days ago' },
                         { title: 'Shared Vacation Fund', type: 'Savings', amount: '+₹5,000', color: 'text-[#22c55e]', time: '3 days ago' },
                       ].map((item, idx) => (
                         <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                                  <Receipt className="w-5 h-5 text-slate-400" />
                               </div>
                               <div>
                                  <div className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.type} • {item.time}</div>
                               </div>
                            </div>
                            <div className={cn("font-bold text-sm", item.color)}>{item.amount}</div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </main>
     </div>
  );
}
