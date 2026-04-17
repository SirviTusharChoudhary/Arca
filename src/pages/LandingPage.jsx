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
            <span className="text-3xl text-arca-blue font-bold tracking-tighter">Arca</span>
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



{/* <div className="flex flex-col flex-1 h-full min-h-screen bg-gray-50 text-slate-900">
      
    //   {/* 1. Top Navigation Bar (Jira Style) */}
    //   <header className="flex items-center justify-between h-14 px-6 bg-white border-b border-gray-200 sticky top-0 z-10">
    //     <div className="flex items-center gap-1 text-sm text-gray-600">
    //       <span>Projects</span>
    //       <span className="text-gray-400">/</span>
    //       <span className="font-medium text-slate-800">Arca Platform</span>
    //     </div>
        
    //     <div className="flex items-center gap-4">
    //       <div className="relative">
    //         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    //         <input  */}
    //           type="search" 
    //           placeholder="Search Arca..." 
    //           className="w-72 h-9 pl-9 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all"
    //         />
    //       </div>
    //       <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">
    //         <Zap size={18} />
    //       </button>
    //       <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border-2 border-white ring-1 ring-gray-200">TS</div>
    //     </div>
    //   </header>

    //   {/* Main Content Area */}
    //   <main className="flex flex-1 p-2 lg:p-10 gap-10">
        
    //     {/* Left Section (Main Dashboard) */}
    //     <div className="flex-1 flex flex-col gap-10">
          
    //       {/* 2. Hero Header */}
    //       <div className="flex items-center justify-between gap-4">
    //         <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Your Work</h1>
    //         <div className="flex items-center gap-3">
    //           <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors">
    //             Go to profile
    //           </button>
    //           <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
    //             <Plus size={16} />
    //             Create project
    //           </button>
    //         </div>
    //       </div>

    //       {/* 3. The "Big Three" Tabs (Static Layout) */}
    //       <div className="flex flex-col gap-8">
            
    //         {/* Tab Navigation (Static) */}
    //         <div className="flex items-center border-b border-gray-200 gap-6 text-sm font-medium text-gray-600">
    //           {['Assigned to me', 'Worked on', 'Starred'].map((tab, index) => (
    //             <button 
    //               key={tab} 
    //               className={`pb-3 border-b-2 transition-colors ${index === 0 ? 'border-blue-600 text-blue-700 font-semibold' : 'border-transparent hover:text-blue-600 hover:border-gray-300'}`}
    //             >
    //               {tab}
    //               {index === 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">{assignedTasks.length}</span>}
    //             </button>       
    //           ))}
    //         </div>

    //         {/* Task List (Static Copy) */}
    //         <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
    //           {assignedTasks.map((task) => (
    //             <div key={task.id} className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer last:border-b-0">
    //               <CheckCircle2 className={`w-5 h-5 ${task.priority === 'High' ? 'text-red-500' : 'text-gray-400'}`} />
    //               <div className="flex-1 min-w-0">
    //                 <p className="text-sm font-medium text-slate-900 truncate">{task.title}</p>
    //                 <p className="text-xs text-gray-500 truncate">{task.id} • {task.project}</p>
    //               </div>
    //               <div className={`px-2 py-0.5 text-xs font-semibold rounded ${task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-900' : 'bg-gray-100 text-gray-800'}`}>
    //                 {task.status}
    //               </div>
    //               <Star className="w-4 h-4 text-gray-300 hover:text-yellow-500 cursor-pointer transition-colors" />
    //               <button className="text-gray-400 hover:text-slate-900"><MoreVertical size={16} /></button>
    //             </div>
    //           ))}
    //         </div>
    //       </div>

    //       {/* Recently Viewed (Secondary Section) */}
    //       <div className="flex flex-col gap-5">
    //         <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2"><Clock size={20} className="text-gray-500"/> Recently viewed</h2>
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    //           {recentProjects.map(proj => (
    //             <div key={proj.key} className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer">
    //               <div className={`w-10 h-10 rounded ${proj.iconColor} flex items-center justify-center text-white font-bold text-sm`}>{proj.key}</div>
    //               <div>
    //                 <p className="font-semibold text-slate-950">{proj.name}</p>
    //                 <p className="text-xs text-gray-500">Software project • Board</p>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </div>

    //     </div>

    //     {/* 4. Right Sidebar (Jira Quick Links) */}
    //     <aside className="hidden xl:flex w-80 flex-col gap-8 sticky top-24 self-start">
          
    //       <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
    //         <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
    //         <div className="flex flex-col gap-2.5 text-sm text-blue-700 font-medium">
    //           {['My open issues', 'Done issues', 'View all boards', 'Create a filter'].map(link => (
    //             <a key={link} href="#" className="hover:underline">{link}</a>
    //           ))}
    //         </div>
    //       </div>

    //       <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
    //         <h3 className="text-sm font-semibold text-gray-900 mb-5 flex items-center justify-between">
    //           Recent Projects
    //           <a href="#" className="text-xs text-blue-700 hover:underline">View all</a>
    //         </h3>
    //         <div className="flex flex-col gap-4">
    //           {recentProjects.map(proj => (
    //             <div key={proj.key} className="flex items-center gap-3 text-sm">
    //               <div className={`w-7 h-7 rounded-sm ${proj.iconColor} flex items-center justify-center text-white font-bold text-xs`}>
    //                 {proj.key}
    //               </div>
    //               <span className="font-medium text-slate-900 truncate">{proj.name}</span>
    //             </div>
    //           ))}
    //         </div>
    //       </div>
          
    //     </aside> {/* Corrected tag here */}
    //   </main>
    // </div>