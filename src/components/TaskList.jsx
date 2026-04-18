import React, { useState } from "react";
import {
  CheckCircle2,
  Star,
  Trash2,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const TaskList = ({ task, isAdmin, handleDeleteTask, usersMap, isReadOnly }) => {
  const [star, setStar] = useState(task.starred);
  const [expanded, setExpanded] = useState(false);

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
    <div
      key={task.id}
      className="flex flex-col px-6 py-4 border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors last:border-b-0"
    >
      <div
        className="flex items-center gap-4 w-full cursor-pointer"
        onClick={() => task.description && setExpanded(!expanded)}
      >
        {/* Priority Icon */}
        <CheckCircle2
          className={`w-5 h-5 shrink-0 ${
            task.priority === "High" ? "text-red-500" : "text-gray-400 dark:text-slate-500"
          }`}
        />

        {/* Task Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {task.title}
          </p>

          <div className="flex items-center text-xs text-gray-500 dark:text-slate-400 mt-0.5 gap-2 min-w-0">
            <span className="whitespace-nowrap shrink-0">
              Assigned to:{" "}
              {usersMap?.[task.assignedTo]?.displayName ||
                usersMap?.[task.assignedTo]?.name ||
                "Unknown"}
            </span>

            {task.description && (
              <div className="flex items-center min-w-0 shrink">
                <span className="text-gray-300 dark:text-slate-600 shrink-0">•</span>
                <span className="truncate ml-1.5 mr-1">
                  {task.description.length > 50
                    ? task.description.slice(0, 50) + "..."
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

        {/* Status Badge */}
        <select
          value={task.status || "To Do"}
          onClick={(e) => e.stopPropagation()}
          onChange={updateStatus}
          disabled={isReadOnly}
          className={`px-2 py-0.5 text-xs font-semibold rounded outline-none border border-transparent ${isReadOnly ? 'cursor-default opacity-90 appearance-none' : 'cursor-pointer'} transition-colors duration-300 focus:ring-1 focus:ring-blue-500 ${
            task.status === "In Progress"
              ? "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900/50"
              : task.status === "Done"
                ? "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50"
                : "bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
        >
          <option value="To Do" className="bg-white text-gray-800 dark:bg-slate-900 dark:text-slate-300">
            To Do
          </option>
          <option
            value="In Progress"
            className="bg-white text-gray-800 dark:bg-slate-900 dark:text-slate-300"
          >
            In Progress
          </option>
          <option value="Done" className="bg-white text-gray-800 dark:bg-slate-900 dark:text-slate-300">
            Done
          </option>
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

        {/* Admin-only Delete Button */}
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTask(e, task.id);
            }}
            className="p-1.5 text-gray-400 dark:text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        )}

        {/* Options Menu */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-gray-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 shrink-0"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Expanded Description Area */}
      {expanded && task.description && (
        <div className="mt-2 pl-[3.25rem] w-full pr-4 pb-2 text-sm text-gray-700 dark:text-slate-300 leading-relaxed animate-in slide-in-from-top-2 fade-in duration-200 break-all whitespace-pre-wrap overflow-hidden">
          {task.description}
        </div>
      )}
    </div>
  );
};

export default TaskList;
