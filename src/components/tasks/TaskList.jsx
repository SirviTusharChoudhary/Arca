import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Trash2,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

const TaskList = ({ task, isAdmin, handleDeleteTask, usersMap, isReadOnly }) => {
  const [star, setStar] = useState(task.starred);
  const [expanded, setExpanded] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!task.deadline || task.status === "Done") return;
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, [task.deadline, task.status]);

  async function Starred(task) {
    const docRef = doc(db, "tasks", task.taskId || task.id);
    await updateDoc(docRef, {
      starred: !star,
    });
  }

  async function updateStatus(e) {
    const newStatus = e.target.value;
    const docRef = doc(db, "tasks", task.taskId || task.id);
    await updateDoc(docRef, {
      status: newStatus,
    });
  }

  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="group flex flex-col px-5 py-3.5 border-b border-gray-100 dark:border-slate-800 hover:bg-blue-50/30 dark:hover:bg-slate-800/40 transition-colors last:border-b-0"
    >
      <div
        className="flex items-center gap-3 w-full cursor-pointer"
        onClick={() => task.description && setExpanded(!expanded)}
      >
        {/* Priority Badge — fixed width so different label lengths don't shift layout */}
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={`inline-flex items-center justify-center shrink-0 w-16 py-0.5 rounded text-[10px] font-bold leading-none border select-none ${
              task.priority === "Urgent"
                ? "bg-red-100 text-red-600 border-red-400 dark:bg-red-950/80 dark:text-red-300 dark:border-red-700/70"
              : task.priority === "High"
                ? "bg-orange-100 text-orange-600 border-orange-400 dark:bg-orange-950/80 dark:text-orange-300 dark:border-orange-700/70"
              : task.priority === "Medium"
                ? "bg-yellow-100 text-yellow-700 border-yellow-400 dark:bg-yellow-900/60 dark:text-yellow-300 dark:border-yellow-600/70"
              : "bg-emerald-50 text-emerald-600 border-emerald-300 dark:bg-slate-700/60 dark:text-slate-300 dark:border-slate-600"
          }`}>
          {task.priority || "Low"}
        </motion.span>

        {/* Task Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {task.title}
          </p>

          <div className="flex items-center text-xs text-gray-500 dark:text-slate-400 mt-0.5 gap-2 min-w-0">
            {isReadOnly && <span className="whitespace-nowrap shrink-0">
              Assigned to:{" "}
              {`@${usersMap?.[task.assignedTo]?.username}` ||
                usersMap?.[task.assignedTo]?.name ||
                "Unknown"}
            </span>}

            {task.deadline && (
              <div className="flex items-center gap-2 min-w-0 shrink-0">
                <span className="text-gray-300 dark:text-slate-600 shrink-0">•</span>
                {(() => {
                  const deadlineTime = new Date(task.deadline).getTime();
                  const isOverdue = deadlineTime < now && task.status !== "Done";
                  return (
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1.5 font-bold tracking-tight ${isOverdue ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>
                        <Calendar size={13} strokeWidth={2.5} />
                        <span className="whitespace-nowrap">
                          {(() => {
                            const d = new Date(task.deadline);
                            const now = new Date();
                            const options = { month: 'short', day: 'numeric' };
                            if (d.getFullYear() !== now.getFullYear()) options.year = 'numeric';
                            return d.toLocaleDateString([], options);
                          })()}
                        </span>
                      </div>
                      {isOverdue && (
                        <span className="px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-black uppercase rounded-[4px] leading-none shrink-0 shadow-sm animate-pulse">
                          Overdue
                        </span>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {task.description && (
              <div className="flex items-center min-w-0 shrink">
                <span className="text-gray-300 dark:text-slate-600 shrink-0">•</span>
                <span className="truncate ml-1.5 mr-1">
                  {task.description.length > 50
                    ? task.description.slice(0, 60) + "..."
                    : task.description}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(!expanded);
                  }}
                  className="p-0.5 hover:bg-gray-200 dark:hover:bg-slate-700 rounded text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors shrink-0"
                >
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        <select
          value={task.status || "To Do"}
          onClick={(e) => e.stopPropagation()}
          onChange={updateStatus}
          disabled={isReadOnly}
          className={`shrink-0 px-2.5 py-1 text-[11px] font-bold rounded outline-none border ${
            isReadOnly ? 'cursor-default opacity-90 appearance-none' : 'cursor-pointer'
          } transition-all duration-200 focus:ring-2 focus:ring-blue-400/30 ${
            task.status === "In Progress"
              ? "bg-blue-100 text-blue-700 border-blue-400 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-600/70"
              : task.status === "Done"
                ? "bg-emerald-100 text-emerald-700 border-emerald-400 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-600/70"
                : "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-700/60 dark:text-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <option value="To Do" className="bg-white text-gray-800 dark:bg-slate-900 dark:text-slate-300">To Do</option>
          <option value="In Progress" className="bg-white text-gray-800 dark:bg-slate-900 dark:text-slate-300">In Progress</option>
          <option value="Done" className="bg-white text-gray-800 dark:bg-slate-900 dark:text-slate-300">Done</option>
        </select>

        {/* Action Icons */}
        <Star
          onClick={(e) => {
            e.stopPropagation();
            if (isReadOnly) return;
            setStar(!star);
            Starred(task);
          }}
          className={`w-4 h-4 ${isReadOnly ? 'cursor-default opacity-50' : 'cursor-pointer'} transition-colors ${
            star
              ? "text-yellow-500 fill-yellow-500"
              : "text-gray-300 dark:text-slate-600 hover:text-yellow-500 dark:hover:text-yellow-500"
          }`}
        />

        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTask(e, task.id);
            }}
            className="p-1.5 text-gray-400 dark:text-slate-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
            title="Delete Task"
          >
            <Trash2 size={15} />
          </motion.button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {expanded && task.description && (
          <motion.div
            key="desc"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-2 ml-[88px] pr-4 pb-2 text-sm text-gray-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap break-all border-l-2 border-blue-200 dark:border-blue-900/60 pl-3">
              {task.description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskList;
