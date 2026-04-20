import React, { useState } from "react";
import { motion } from "framer-motion";
import { Video, X } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebase";

const ScheduleMeetingModal = ({ onClose, projectId, userData }) => {
  const [title, setTitle] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !meetLink.trim() || !scheduledAt) return;
    if (!meetLink.includes("meet.google.com")) {
      setError("Please enter a valid Google Meet link (meet.google.com/...)");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "projects", projectId, "meetings"), {
        title: title.trim(),
        meetLink: meetLink.trim(),
        scheduledAt: new Date(scheduledAt),
        duration: Number(duration),
        createdBy: userData.uid,
        createdAt: serverTimestamp(),
      });
      onClose();
    } catch (err) {
      console.error("Failed to schedule meeting:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <Video size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-[14px] font-bold text-slate-900 dark:text-slate-100">Schedule Meeting</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">Meeting Title</label>
            <input
              autoFocus
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Sprint Review, Design Sync..."
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">Google Meet Link</label>
            <input
              required
              value={meetLink}
              onChange={e => { setMeetLink(e.target.value); setError(""); }}
              placeholder="https://meet.google.com/abc-defg-hij"
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-blue-500 outline-none transition-colors"
            />
            <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1 ml-0.5">Create a meeting in Google Meet first, then paste the link here.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">Date & Time</label>
              <input
                required
                type="datetime-local"
                value={scheduledAt}
                onChange={e => setScheduledAt(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none transition-colors cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">Duration</label>
              <select
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none transition-colors cursor-pointer"
              >
                {[15, 30, 45, 60, 90, 120].map(d => (
                  <option key={d} value={d}>{d === 60 ? "1 hour" : d === 90 ? "1.5 hours" : d === 120 ? "2 hours" : `${d} min`}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-3 flex gap-3 justify-end border-t border-gray-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
            >
              <Video size={14} />
              {loading ? "Scheduling..." : "Schedule Meeting"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ScheduleMeetingModal;
