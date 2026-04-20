import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Plus } from "lucide-react";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";
import MeetingCard from "./MeetingCard";
import ScheduleMeetingModal from "./ScheduleMeetingModal";

const MeetingsPanel = ({ projectId, projData, userData }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [tab, setTab] = useState("upcoming");
  const [now, setNow] = useState(() => Date.now());
  const isAdmin = projData?.admin === userData?.uid;

  // Tick every 30s to re-classify live vs upcoming vs completed
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  // Firestore real-time listener
  useEffect(() => {
    if (!projectId) return;
    const q = query(
      collection(db, "projects", projectId, "meetings"),
      orderBy("scheduledAt", "asc")
    );
    const unsub = onSnapshot(q, snap => {
      setMeetings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error("Meetings listener error:", err);
      setLoading(false);
    });
    return () => unsub();
  }, [projectId]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "projects", projectId, "meetings", id));
  };

  const { live, upcoming, completed } = useMemo(() => {
    const live = [], upcoming = [], completed = [];
    meetings.forEach(m => {
      const start = m.scheduledAt?.toDate ? m.scheduledAt.toDate().getTime() : 0;
      const end = start + (m.duration || 30) * 60000;
      if (now >= start && now < end) live.push(m);
      else if (now < start) upcoming.push(m);
      else completed.push(m);
    });
    return { live, upcoming, completed: completed.reverse() };
  }, [meetings, now]);

  const tabs = [
    { id: "upcoming", label: "Upcoming", count: upcoming.length + live.length },
    { id: "completed", label: "Completed", count: completed.length },
  ];

  const displayList = tab === "upcoming" ? [...live, ...upcoming] : completed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Meetings</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Schedule and join Google Meet sessions for your team.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setScheduleOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={15} />
            Schedule
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-gray-200 dark:border-slate-800 gap-5">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              tab === t.id
                ? "border-blue-600 text-blue-700 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`px-1.5 py-0.5 text-[11px] font-bold rounded-full ${
                tab === t.id
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400"
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-slate-800">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <p className="text-xs font-semibold tracking-wide text-blue-700 dark:text-blue-300 uppercase">
                Loading meetings
              </p>
            </div>
            <div className="pt-3 space-y-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-12 rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-pulse"
                />
              ))}
            </div>
        </div>
      ) : displayList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center">
              <Video size={28} className="text-gray-300 dark:text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 dark:text-slate-400">
                {tab === "upcoming" ? "No upcoming meetings" : "No completed meetings yet"}
              </p>
              {tab === "upcoming" && isAdmin && (
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                  Click <strong>Schedule</strong> to set up your first meeting.
                </p>
              )}
            </div>
        </div>
      ) : (
        <div className="flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          {displayList.map((m, i) => (
            <MeetingCard
              key={m.id}
              meeting={m}
              index={i}
              isAdmin={isAdmin}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      <AnimatePresence>
        {scheduleOpen && (
          <ScheduleMeetingModal
            onClose={() => setScheduleOpen(false)}
            projectId={projectId}
            userData={userData}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MeetingsPanel;
