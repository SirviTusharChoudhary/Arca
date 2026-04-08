import { motion } from "framer-motion";

const AuthLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#F4F5F7]">
      <motion.div
        className="w-16 h-16 bg-[#0052CC] rounded-lg shadow-lg"
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 0, 180, 180, 0],
          borderRadius: ["20%", "20%", "50%", "50%", "20%"],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
        }}
      />
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 text-[#172B4D] font-bold text-2xl tracking-tight"
      >
        Arca
      </motion.h2>
      <p className="text-[#42526E] text-sm mt-2">Setting up your workspace...</p>
    </div>
  );
};

export default AuthLoader;