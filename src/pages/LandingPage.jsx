import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, LogIn, UserPlus, CheckCircle2, Star, Zap } from 'lucide-react';
import Login from '../components/Login';
import Signup from '../components/Signup';

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [modalMode, setModalMode] = useState('login');

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
    <div className="min-h-screen bg-arca-bg font-sans text-arca-dark selection:bg-blue-100 relative overflow-hidden">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-blue-50/50 rounded-full blur-[120px]"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          style={{ top: '10%', right: '-10%' }}
        />
        <motion.div
          className="absolute w-72 h-72 bg-slate-100/50 rounded-full blur-[100px]"
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{ bottom: '15%', left: '-5%' }}
        />
      </div>

      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-arca-border px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5">
            <Box className="w-8 h-8 text-arca-blue" strokeWidth={1.5} />
            <span className="text-3xl font-bold tracking-tighter">Arca</span>
          </motion.div>
          
          <div className="flex items-center gap-7">
            <motion.button 
              whileHover={{ y: -1 }}
              onClick={() => openAuth('login')}
              className="text-[16px] font-semibold text-arca-gray hover:text-arca-blue flex items-center gap-1.5 transition-colors"
            >
              <LogIn size={16} strokeWidth={2} />
              Log in
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openAuth('signup')}
              className="bg-arca-blue text-white px-5 py-2 rounded-[3px] font-semibold text-[16px] hover:bg-arca-hover transition-all shadow-[0_1px_1px_rgba(9,30,66,.25)]"
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
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-[12px] font-extrabold tracking-widest text-arca-blue bg-blue-50 rounded-full uppercase border border-blue-100">
          <CheckCircle2 size={14} className="animate-pulse" />
          Secure. Scalable. Organized.
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-[76px] leading-[1.05] font-extrabold tracking-tight mb-8">
          The <span className="text-arca-blue">elegant</span> workspace for <br/> ambitious teams.
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-[22px] text-arca-gray mb-10 max-w-2xl font-light leading-relaxed">
          Arca centralizes your tasks, syncs your team, and helps you ship
          better products - without the traditional project management bulk.
        </motion.p>
        
        <motion.button 
          variants={itemVariants}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => openAuth('signup')}
          className="bg-arca-blue text-white px-10 py-4 rounded-[4px] text-xl font-bold hover:bg-arca-hover shadow-[0_4px_14px_rgba(0,82,204,.3)] transition-all flex items-center gap-2"
        >
          <Zap size={20} strokeWidth={2.5} />
          Start Building Free
        </motion.button>
      </motion.main>


      <div className="relative z-10 border-t border-b border-arca-border bg-arca-subtle/40 py-12">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-[12px] font-bold text-arca-gray/70 uppercase tracking-[0.2em] mb-8">
            The Professional's Standard
          </p>
          <div className="flex justify-center items-center gap-20 grayscale opacity-60">
            <div className="flex items-center gap-3 text-2xl font-bold tracking-tight text-arca-gray/90">
              <Star className="text-arca-blue" fill="#0052CC" size={24} strokeWidth={1.5} />
              TRUSTED
            </div>
            <div className="flex items-center gap-3 text-2xl font-bold tracking-tight text-arca-gray/90">
              <Zap size={24} strokeWidth={1.5} />
              SECURE
            </div>
            <div className="flex items-center gap-3 text-2xl font-bold tracking-tight text-arca-gray/90">
              <UserPlus size={24} strokeWidth={1.5} />
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