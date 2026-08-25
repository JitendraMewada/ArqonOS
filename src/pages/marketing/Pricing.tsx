import { useState, useMemo } from 'react';
import { 
  Check, 
  MessageSquare, 
  Palette, 
  CreditCard, 
  BarChart3, 
  Zap, 
  Users, 
  Plus, 
  Info,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PRICING_CONFIG } from '../../constants/pricing';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

export function Pricing() {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [userCount, setUserCount] = useState(5);

  const pricingDetails = useMemo(() => {
    const activeAddons = PRICING_CONFIG.ADD_ONS.filter(addon => selectedAddons.includes(addon.id));
    const basePrice = PRICING_CONFIG.BASE_PLAN.price;
    const addonsTotal = activeAddons.reduce((sum, addon) => sum + addon.price, 0);
    
    // Find the highest user tier among active add-ons
    const activeTiers = activeAddons.map(a => a.extraUserTier);
    const highestTier = Math.max(PRICING_CONFIG.BASE_PLAN.extraUserPrice, ...activeTiers);
    
    const extraUsers = Math.max(0, userCount - PRICING_CONFIG.BASE_PLAN.includedUsers);
    const extraUsersTotal = extraUsers * highestTier;
    
    const total = basePrice + addonsTotal + extraUsersTotal;

    return {
      basePrice,
      addonsTotal,
      highestTier,
      extraUsers,
      extraUsersTotal,
      total,
      activeAddons
    };
  }, [selectedAddons, userCount]);

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare': return <MessageSquare className="w-5 h-5" />;
      case 'Palette': return <Palette className="w-5 h-5" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      default: return <Plus className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 px-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3b82f6] px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded inline-block mb-6 shadow-sm"
          >
            Built on Intelligent Systems
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6"
          >
            The Operating System <br className="hidden sm:block" />
            <span className="text-slate-400 dark:text-slate-500">for the Built Environment</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium"
          >
            Start at ₹699. Pay more only as your team and system grow.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start px-4">
          {/* Left Column: Configuration */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Base Bundle (Mandatory) */}
            <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl rounded-full" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Step 1: The Foundation</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Base System Bundle</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Non-negotiable core for every firm.</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-slate-900 dark:text-white">₹699<span className="text-sm font-medium text-slate-500">/mo</span></div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Includes 5 Users</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {PRICING_CONFIG.BASE_PLAN.includes.map((app) => (
                  <div key={app} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{app.split(' (')[0]}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Adjust Team Size</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Extra users at <span className="text-slate-900 dark:text-white font-bold">₹{pricingDetails.highestTier}/user</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                   <button 
                     onClick={() => setUserCount(Math.max(1, userCount - 1))}
                     className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                   >
                     -
                   </button>
                   <input 
                     type="number" 
                     value={userCount} 
                     onChange={(e) => setUserCount(Math.max(1, parseInt(e.target.value) || 1))}
                     className="w-12 text-center text-sm font-bold bg-transparent outline-none text-slate-900 dark:text-white"
                   />
                   <button 
                     onClick={() => setUserCount(userCount + 1)}
                     className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                   >
                     +
                   </button>
                </div>
              </div>
            </section>

            {/* Step 2: Modular Add-ons */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Step 2: Modular Expansion</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PRICING_CONFIG.ADD_ONS.map((addon) => {
                  const isActive = selectedAddons.includes(addon.id);
                  const activeColorClass = addon.id === 'connect' ? 'border-blue-500 shadow-blue-500/10' :
                    addon.id === 'studio' ? 'border-orange-500 shadow-orange-500/10' :
                    addon.id === 'cost_vendor' ? 'border-slate-400 shadow-slate-400/10' :
                    addon.id === 'insight' ? 'border-slate-400 shadow-slate-400/10' :
                    addon.id === 'ai' ? 'border-emerald-300 shadow-emerald-300/10' : 'border-blue-500';

                  const activeBgClass = addon.id === 'connect' ? 'bg-blue-500' :
                    addon.id === 'studio' ? 'bg-orange-500' :
                    addon.id === 'cost_vendor' ? 'bg-slate-400' :
                    addon.id === 'insight' ? 'bg-slate-400' :
                    addon.id === 'ai' ? 'bg-emerald-300' : 'bg-blue-500';

                  return (
                    <motion.div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "p-6 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between h-full",
                        isActive 
                          ? `bg-white dark:bg-slate-900 ${activeColorClass} shadow-lg` 
                          : "bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      )}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                            isActive ? `${activeBgClass} text-white` : "bg-white dark:bg-slate-800 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                          )}>
                            {getIcon(addon.icon)}
                          </div>
                          <div className={cn(
                            "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                            isActive ? `${activeBgClass} ${activeColorClass.replace('shadow','border')} text-white` : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                          )}>
                            {isActive && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{addon.name}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{addon.layer}</p>
                      </div>
                      <div className="mt-6 flex items-end justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Base Price</div>
                          <div className="text-xl font-black text-slate-900 dark:text-white">₹{addon.price}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">User Tier</div>
                          <div className="text-base font-bold text-slate-900 dark:text-white">₹{addon.extraUserTier}</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Checkout/Summary */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden border border-slate-800">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] -translate-y-1/2 translate-x-1/2" />
               
               <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 mb-8">System Summary</h3>
               
               <div className="space-y-6 mb-10 pb-10 border-b border-slate-800">
                  <div className="flex justify-between items-center group">
                    <span className="text-sm text-slate-400 font-medium">Base System (5 Users)</span>
                    <span className="text-sm font-bold">₹699</span>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {pricingDetails.activeAddons.map(addon => (
                      <motion.div 
                        key={addon.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center gap-2">
                          <Plus className="w-3 h-3 text-blue-500" />
                          <span className="text-sm text-slate-400 font-medium">{addon.name} Module</span>
                        </div>
                        <span className="text-sm font-bold">₹{addon.price}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {pricingDetails.extraUsers > 0 && (
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Extra Users (×{pricingDetails.extraUsers})</div>
                        <div className="text-xs text-blue-400 font-bold">₹{pricingDetails.highestTier}/user tier applied</div>
                      </div>
                      <span className="text-sm font-bold">₹{pricingDetails.extraUsersTotal}</span>
                    </div>
                  )}
               </div>

               <div className="mb-10">
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Monthly Liability</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black tracking-tighter">₹{pricingDetails.total.toLocaleString()}</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">/ Month</span>
                  </div>
                  <div className="mt-4 p-3 bg-slate-800/30 rounded italic border border-slate-800/50">
                    <div className="flex gap-2">
                      <Info className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        Per-user cost increases as you add advanced modules. Highest active tier is applied to all extra users.
                      </p>
                    </div>
                  </div>
               </div>

               <Link 
                to="/gateway" 
                className="w-full flex items-center justify-center gap-3 py-5 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 hover:text-white transition-all group active:scale-95 shadow-xl shadow-blue-500/10"
               >
                 Activate System <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Link>

               <div className="mt-6 flex items-center justify-center gap-4 text-slate-500">
                  <div className="h-px bg-slate-800 flex-grow" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Production Ready</span>
                  <div className="h-px bg-slate-800 flex-grow" />
               </div>
            </div>
          </div>
        </div>

        {/* Nest B2C Section */}
        <div className="mt-32 pt-24 border-t border-slate-200 dark:border-slate-800 px-4">
          <div className="flex items-center gap-4 mb-16 overflow-hidden">
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow"></div>
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">B2C Mass Adoption (Arqon Nest)</h2>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING_CONFIG.NEST_PLANS.map((plan) => (
              <motion.div 
                key={plan.id}
                whileHover={{ y: -5 }}                
                className="bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-green-500/20 shadow-lg hover:border-green-500/50 transition-all flex flex-col"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{plan.positioning}</p>
                </div>
                
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">₹{plan.price}</span>
                  <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">/ group / mo</span>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-lg text-[10px] font-bold text-green-700 dark:text-green-300 uppercase tracking-widest mb-6 space-y-1">
                    <div>• 3 users included</div>
                    <div>• ₹99 per extra user</div>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                   {plan.includes.map(inc => <li key={inc} className="flex items-center text-xs font-bold text-slate-700 dark:text-slate-300"><Check className="w-3 h-3 text-green-500 mr-2"/> {inc}</li>)}
                </ul>

                <Link to="/gateway" className="block text-center py-3 bg-green-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-green-600 transition-colors">Select {plan.name}</Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* D2C Free Section */}
        <div className="mt-24 mb-10 px-4">
          <div className="flex items-center gap-4 mb-12 overflow-hidden">
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow"></div>
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">D2C Free Ecosystem</h2>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center group hover:border-[#94a3b8]/50 transition-all">
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Essence</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">Showcase portfolio for designers. Always free to build your legacy.</p>
                <Link to="/modules/essence" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-[#94a3b8] transition-colors">Explore Essence</Link>
             </div>
             
             <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center group hover:border-[#d4af37]/50 transition-all">
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2 tracking-tight">PRAVARA</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">Luxury fashion collective. Free access to explore the collection.</p>
                <Link to="/modules/pravara" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-[#d4af37] transition-colors">Explore PRAVARA</Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
