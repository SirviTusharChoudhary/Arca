import React, { useState } from 'react';
import { X, Plus, ChevronDown, UserCheck } from 'lucide-react';
import { db } from '../services/firebase';
import { v4 as uuidv4 } from 'uuid'; 
import { collection, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

const CreateTask = ({ projData, roomId, onClose }) => {
  const { projectid } = useParams();
  const [taskTitle, setTaskTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState(projData?.admin || ""); 
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !assignedTo) return;

    setLoading(true);
    try {
      const taskId = uuidv4();
      console.log(taskId);
      await setDoc(doc(db, "tasks", taskId), {
        title: taskTitle,
        taskId: taskId,
        projectId: projectid,
        assignedTo: assignedTo,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/30">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tighter">Create New Task</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
              Task Summary
            </label>
            <input
              autoFocus
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority Menu */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                Priority
              </label>
              <div className="relative">
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </div>

            {/* AssignedTo Selection Menu */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                Assign Member
              </label>
              <div className="relative">
                <select 
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value={projData?.admin}>Admin (Self)</option>
                  {projData?.members?.map((uid) => (
                    <option key={uid} value={uid}>
                      Member ID: {uid.slice(0, 6)}...
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !taskTitle.trim()}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 disabled:opacity-50 transition-all active:scale-95"
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