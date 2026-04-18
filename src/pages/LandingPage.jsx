import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, LogIn, UserPlus, CheckCircle2, Star, Zap, Sun, Moon } from 'lucide-react';
import Login from '../components/Login';
import Signup from '../components/Signup';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [modalMode, setModalMode] = useState('login');
  const { theme, toggleTheme } = useTheme();

  const openAuth = (mode) => {
    setModalMode(mode);
    setShowAuth(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 25, stiffness: 300 },
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900/40 relative overflow-hidden transition-colors duration-300">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-[120px]"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          style={{ top: '10%', right: '-10%' }}
        />
        <motion.div
          className="absolute w-72 h-72 bg-slate-100/50 dark:bg-slate-800/20 rounded-full blur-[100px]"
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{ bottom: '15%', left: '-5%' }}
        />
      </div>

      <nav className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm border-b border-gray-200 dark:border-slate-800 px-6 py-2 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5">
            <Box className="w-8 h-8 text-blue-600 dark:text-blue-500" strokeWidth={1.5} />
            <span className="text-3xl text-blue-600 dark:text-blue-500 font-bold tracking-tighter">Arca</span>
          </motion.div>
          
          <div className="flex items-center gap-5 md:gap-7">
            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <motion.button 
              whileHover={{ y: -1 }}
              onClick={() => openAuth('login')}
              className="text-[16px] font-semibold text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 flex items-center gap-1.5 transition-colors"
            >
              <LogIn size={16} strokeWidth={2} />
              <span className="hidden sm:inline">Log in</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openAuth('signup')}
              className="bg-blue-600 text-white px-5 py-2 rounded-[3px] font-semibold text-[16px] hover:bg-blue-700 transition-all shadow-sm"
            >
              Get it free
            </motion.button>
          </div>
        </div>
      </nav>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 text-center flex flex-col items-center"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-[12px] font-extrabold tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full uppercase border border-blue-100 dark:border-blue-900/50">
          <CheckCircle2 size={14} className="animate-pulse" />
          Secure. Scalable. Organized.
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-[76px] leading-[1.05] font-extrabold tracking-tight mb-8 text-slate-950 dark:text-white">
          The <span className="text-blue-600 dark:text-blue-500">elegant</span> workspace for <br/> ambitious teams.
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-[22px] text-gray-500 dark:text-slate-400 mb-10 max-w-2xl font-light leading-relaxed">
          Arca centralizes your tasks, syncs your team, and helps you ship
          better products - without the traditional project management bulk.
        </motion.p>
        
        <motion.button 
          variants={itemVariants}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => openAuth('signup')}
          className="bg-blue-600 text-white px-10 py-4 rounded-md text-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
        >
          <Zap size={20} strokeWidth={2.5} />
          Start Building Free
        </motion.button>
      </motion.main>

      <div className="relative z-10 border-t border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-[12px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-8">
            The Professional's Standard
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 grayscale opacity-60 dark:opacity-40">
            <div className="flex items-center gap-3 text-2xl font-bold tracking-tight text-gray-500 dark:text-slate-400">
              <Star className="text-blue-600 dark:text-blue-500" fill="currentColor" size={24} strokeWidth={1.5} />
              TRUSTED
            </div>
            <div className="flex items-center gap-3 text-2xl font-bold tracking-tight text-gray-500 dark:text-slate-400">
              <Zap size={24} strokeWidth={1.5} className="text-gray-500 dark:text-slate-400" />
              SECURE
            </div>
            <div className="flex items-center gap-3 text-2xl font-bold tracking-tight text-gray-500 dark:text-slate-400">
              <UserPlus size={24} strokeWidth={1.5} className="text-gray-500 dark:text-slate-400" />
              SCALABLE
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAuth && ((modalMode == 'login' ? <Login swap={() => setModalMode('signup')} onClose={() => setShowAuth(false)}/> : <Signup swap={() => setModalMode('login')} onClose={() => setShowAuth(false)}/>))}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;