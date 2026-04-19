import { motion } from "framer-motion";

const AuthLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Morphing shape */}
      <div className="relative flex items-center justify-center mb-10">
        {/* Soft glow ring */}
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-blue-500/10 dark:bg-blue-500/20"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Core morphing block */}
        <motion.div
          className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 shadow-xl shadow-blue-500/40"
          animate={{
            borderRadius: ["16%", "16%", "50%", "50%", "16%"],
            rotate: [0, 0, 135, 135, 0],
            scale: [1, 1.08, 1.08, 1, 1],
          }}
          transition={{
            duration: 2.2,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
          }}
        />
      </div>

      {/* Wordmark + message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="flex flex-col items-center gap-2"
      >
        <span className="text-2xl font-extrabold tracking-tight text-blue-600 dark:text-blue-500">
          Arca
        </span>
        <motion.p
          className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.25em]"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Setting up your workspace
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AuthLoader;