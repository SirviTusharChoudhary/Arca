import React from "react";
import { motion } from "framer-motion";
import { Users, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProjectList = ({ projects, isAdminUid, userData }) => {
  const nav = useNavigate();
  if (!projects || projects.length === 0) {
    return (
      <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 transition-colors">
        <LayoutGrid size={48} className="text-gray-300 dark:text-slate-600 mb-4" />
        <p className="text-gray-900 dark:text-slate-100 font-medium">No rooms found</p>
        <p className="text-gray-500 dark:text-slate-400 text-sm">
          Create a project to get started.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {projects.map((project) => (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
          }}
          whileHover={{ y: -5, boxShadow: "0 16px 48px rgba(37,99,235,0.12)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => nav(`/project/${project.projectId}`)}
          key={project.projectId}
          className="group bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-md p-5 hover:border-blue-200 dark:hover:border-slate-700 transition-all cursor-pointer flex flex-col gap-4"
        >
          {/* Top Section */}
          <div className="flex justify-between items-start">
            <motion.div
              whileHover={{ rotate: [0, -8, 8, -4, 0], transition: { duration: 0.5 } }}
              className={`w-12 h-12 rounded-md ${project.selectedColor || "bg-blue-600"} flex items-center justify-center text-white font-bold text-lg shadow-sm`}
            >
              {project.projectName?.substring(0, 2).toUpperCase()}
            </motion.div>
          </div>

          {/* Info Section */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
              {project.projectName}
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest font-bold">
              {project.projectType || "Software"} Room
            </p>
          </div>

          {/* Bottom Section */}
          <div className="mt-2 flex items-center justify-between border-t border-gray-50 dark:border-slate-800 pt-4">
            <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400">
              <Users size={14} />
              <span className="text-xs font-medium">
                {(project.members?.length || 0) +
                  (project.managers?.length || 0) +
                  1}{" "}
                members
              </span>
            </div>

            {project.admin === isAdminUid && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 18, delay: 0.1 }}
                className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50"
              >
                Admin
              </motion.span>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProjectList;
