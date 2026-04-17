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

const TaskList = ({ task, isAdmin, handleDeleteTask, usersMap }) => {
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
      className="flex flex-col px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-b-0"
    >
      <div
        className="flex items-center gap-4 w-full cursor-pointer"
        onClick={() => task.description && setExpanded(!expanded)}
      >
        {/* Priority Icon */}
        <CheckCircle2
          className={`w-5 h-5 shrink-0 ${
            task.priority === "High" ? "text-red-500" : "text-gray-400"
          }`}
        />

        {/* Task Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <p className="text-[15px] font-semibold text-[#172B4D] truncate group-hover:text-[#0052CC] transition-colors">
            {task.title}
          </p>

          <div className="flex items-center text-[13px] text-[#42526E] mt-1 gap-2 min-w-0">
            <span className="whitespace-nowrap shrink-0 font-medium">
              Assigned to:{" "}
              {usersMap?.[task.assignedTo]?.displayName ||
                usersMap?.[task.assignedTo]?.name ||
                "Unknown"}
            </span>

            {task.description && (
              <div className="flex items-center min-w-0 shrink">
                <span className="text-[#DFE1E6] shrink-0">•</span>
                <span className="truncate text-[#42526E] ml-1.5 mr-1">
                  {task.description.length > 50
                    ? task.description.slice(0, 50) + "..."
                    : task.description}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(!expanded);
                  }}
                  className="p-0.5 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-800 transition-colors shrink-0"
                >
                  <ChevronDown
                    size={16}
                    className={`text-[#42526E] hover:text-[#172B4D] transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
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
          className={`px-2 py-1 text-xs font-semibold rounded outline-none border-none cursor-pointer transition-colors duration-300 focus:ring-0 ${
            task.status === "In Progress"
              ? "bg-yellow-100 text-yellow-900"
              : task.status === "Done"
                ? "bg-green-100 text-green-900"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          <option value="To Do" className="bg-white text-gray-800 font-medium">
            To Do
          </option>
          <option
            value="In Progress"
            className="bg-white text-gray-800 font-medium"
          >
            In Progress
          </option>
          <option value="Done" className="bg-white text-gray-800 font-medium">
            Done
          </option>
        </select>

        {/* Action Icons */}
        <Star
          onClick={(e) => {
            e.stopPropagation();
            setStar(!star);
            Starred(task);
          }}
          className={`w-4 h-4 cursor-pointer transition-colors ${
            star
              ? "text-yellow-500 fill-yellow-500"
              : "text-gray-300 hover:text-yellow-500"
          }`}
        />

        {/* Admin-only Delete Button */}
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTask(e, task.id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        )}

        {/* Options Menu */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-gray-400 hover:text-slate-900 shrink-0"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Expanded Description Area */}
      {expanded && task.description && (
        <div className="mt-2 pl-[3.25rem] w-full pr-4 pb-4 text-sm text-[#172B4D] leading-relaxed animate-in slide-in-from-top-2 fade-in duration-200 break-all whitespace-pre-wrap overflow-hidden">
          {task.description}
        </div>
      )}
    </div>
  );
};

export default TaskList;
