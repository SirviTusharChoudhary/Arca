import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { db } from "../../services/firebase";
import { v4 as uuidv4 } from "uuid";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useParams } from "react-router-dom";

const CreateTask = ({ projData, roomId, onClose, usersMap }) => { 
  const { projectid } = useParams();
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState(null);
  const [assignedTo, setAssignedTo] = useState(projData?.admin || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !assignedTo) return;

    setLoading(true);
    try {
      const taskId = uuidv4();
      await setDoc(doc(db, "tasks", taskId), {
        title: taskTitle,
        description: description,
        taskId: taskId,
        projectId: projectid,
        assignedTo: assignedTo,
        deadline: deadline,
        status: "To Do",
        starred: false,
        priority: priority,
        projectName: projData.projectName,
        createdAt: serverTimestamp(),
      });
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-lg shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Create New Task
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                Task Title
              </label>
              <input
                autoFocus
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-slate-500"
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details about this task..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-sm resize-none placeholder:text-gray-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {/* Priority Menu */}
            <div className="col-span-1">
              <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2 truncate">
                Priority
              </label>
              <div className="relative">
                <select
                  value={priority}
                  required
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full appearance-none px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option className="bg-white dark:bg-slate-800" value="Low">
                    Low
                  </option>
                  <option className="bg-white dark:bg-slate-800" value="Medium">
                    Medium
                  </option>
                  <option className="bg-white dark:bg-slate-800" value="High">
                    High
                  </option>
                  <option className="bg-white dark:bg-slate-800" value="Urgent">
                    Urgent
                  </option>
                </select>
                <ChevronDown
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none"
                  size={14}
                />
              </div>
            </div>

            {/* AssignedTo Selection Menu */}
            <div className="col-span-3">
              <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                Assign Member
              </label>
              <div className="relative">
                <select
                  value={assignedTo}
                  required
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 outline-none focus:border-blue-500 cursor-pointer truncate pr-8"
                >
                  <option
                    className="bg-white dark:bg-slate-800"
                    value={projData?.admin}
                  >
                    {usersMap?.[projData?.admin]?.displayName ||
                      usersMap?.[projData?.admin]?.name ||
                      "Admin"}{" "}
                    (Self)
                  </option>
                  {projData?.members?.map((uid) => (
                    <option
                      className="bg-white dark:bg-slate-800"
                      key={uid}
                      value={uid}
                    >
                      {usersMap?.[uid]?.displayName && usersMap?.[uid]?.username
                        ? `${usersMap[uid].displayName} (@${usersMap[uid].username})`
                        : usersMap?.[uid]?.name || `Member: ${uid.slice(0, 6)}`}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none"
                  size={14}
                />
              </div>
            </div>

            {/* Deadline Input */}
            <div className="col-span-4 mt-2">
              <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-0.5">
                Target Deadline
              </label>
              <div className="relative group">
                <input
                  required
                  type="datetime-local"
                  onChange={(e) => setDeadline(e.target.value ? new Date(e.target.value).getTime() : null)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-sm appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !taskTitle.trim()}
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? "Processing..." : "Assign Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
