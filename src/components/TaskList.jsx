import React, { useState } from "react";
import { CheckCircle2, Star, Trash2, MoreVertical } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const TaskList = ({ task, isAdmin, handleDeleteTask }) => {
  const [star, setStar] = useState(task.starred);

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
        status : newStatus
    });
  }

  return (
    <div
      key={task.id}
      className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer last:border-b-0"
    >
      {/* Priority Icon */}
      <CheckCircle2
        className={`w-5 h-5 ${
          task.priority === "High" ? "text-red-500" : "text-gray-400"
        }`}
      />

      {/* Task Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">
          {task.title}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {task.id} • {task.project}
        </p>
      </div>

      {/* Status Badge */}
      <select 
        value={task.status || "To Do"}
        onChange={updateStatus}
        className={`px-2 py-1 text-xs font-semibold rounded outline-none border-none cursor-pointer transition-colors duration-300 focus:ring-0 ${
          task.status === "In Progress"
            ? "bg-yellow-100 text-yellow-900"
            : task.status === "Done"
            ? "bg-green-100 text-green-900"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        <option value="To Do" className="bg-white text-gray-800 font-medium">To Do</option>
        <option value="In Progress" className="bg-white text-gray-800 font-medium">In Progress</option>
        <option value="Done" className="bg-white text-gray-800 font-medium">Done</option>
      </select>

      {/* Action Icons */}
      <Star
        onClick={() => {setStar(!star);Starred(task)}}
        className={`w-4 h-4 cursor-pointer transition-colors ${
          star ? "text-yellow-500 fill-yellow-500" : "text-gray-300 hover:text-yellow-500"
        }`}
      />

      {/* Admin-only Delete Button */}
      {isAdmin && (
        <button
          onClick={(e) => handleDeleteTask(e, task.id)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
          title="Delete Task"
        >
          <Trash2 size={16} />
        </button>
      )}

      {/* Options Menu */}
      <button className="text-gray-400 hover:text-slate-900">
        <MoreVertical size={16} />
      </button>
    </div>
  );
};

export default TaskList;
