import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto h-full px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="grid grid-cols-2 gap-1 w-8 h-8 group-hover:rotate-90 transition-transform duration-500">
            <div className="bg-[#3b82f6] rounded-[2px]"></div>
            <div className="bg-[#3b82f6] rounded-[2px] opacity-80"></div>
            <div className="bg-[#3b82f6] rounded-[2px] opacity-60"></div>
            <div className="bg-[#3b82f6] rounded-[2px] opacity-40"></div>
          </div>
          <span className="font-display font-black text-2xl tracking-tighter text-slate-900 dark:text-white transition-colors">
            ARQON<span className="text-[#3b82f6] text-xl ">OS.</span>
          </span>
         
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400 underline-offset-8">
          <Link to="/modules/arqonos" className="hover:text-[#3b82f6] transition-colors uppercase tracking-[0.1em] text-[11px] font-black">Ecosystem</Link>
          <Link to="/pricing" className="hover:text-[#3b82f6] transition-colors uppercase tracking-[0.1em] text-[11px] font-black">Pricing</Link>
          <Link to="/gateway" className="hover:text-[#3b82f6] transition-colors uppercase tracking-[0.1em] text-[11px] font-black">Workspace</Link>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <Link to="/gateway" className="hidden md:block text-[11px] font-black uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 hover:text-[#3b82f6] transition-colors">Sign In</Link>
          <Link to="/gateway" className="px-3 py-1.5 md:px-5 md:py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] md:text-sm font-bold md:font-semibold rounded-md shadow-lg shadow-slate-200 dark:shadow-none hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
            Get Started
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              <Link onClick={() => setIsOpen(false)} to="/modules/arqonos" className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white py-3 border-b border-slate-50 dark:border-slate-800 hover:text-[#3b82f6] transition-colors">Ecosystem</Link>
              <Link onClick={() => setIsOpen(false)} to="/pricing" className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white py-3 border-b border-slate-50 dark:border-slate-800 hover:text-[#3b82f6] transition-colors">Pricing</Link>
              <Link onClick={() => setIsOpen(false)} to="/gateway" className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white py-3 border-b border-slate-50 dark:border-slate-800 hover:text-[#3b82f6] transition-colors">Workspace</Link>
              <Link onClick={() => setIsOpen(false)} to="/gateway" className="text-sm font-black uppercase tracking-widest text-[#3b82f6] py-3">Sign In</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
