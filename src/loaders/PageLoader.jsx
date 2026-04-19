import { motion } from "framer-motion";


const PageLoader = ({ message = "Loading your workspace..." }) => {
  const bars = [
    { delay: 0, height: 28, color: "#2563EB" },    
    { delay: 0.15, height: 40, color: "#3B82F6" },  
    { delay: 0.30, height: 28, color: "#60A5FA" },  
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Animated bar equalizer */}
      <div className="flex items-end gap-[6px] h-14 mb-8">
        {bars.map((bar, i) => (
          <motion.div
            key={i}
            className="w-[10px] rounded-full"
            style={{ backgroundColor: bar.color }}
            animate={{
              height: [bar.height, bar.height * 1.8, bar.height],
              opacity: [0.7, 1, 0.7],
              scaleY: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.9,
              delay: bar.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Wordmark */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex flex-col items-center gap-2"
      >
        <span className="text-2xl font-extrabold tracking-tight text-blue-600 dark:text-blue-500">
          Arca
        </span>
        <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-[0.22em]">
          {message}
        </p>
      </motion.div>
    </div>
  );
};

export default PageLoader;
