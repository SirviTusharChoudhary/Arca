import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Video, Clock, Check, Calendar, Trash2 } from "lucide-react";
import { formatDate, formatCountdown } from "./meetingHelpers";

const MeetingCard = ({ meeting, isAdmin, userData, onDelete, index = 0 }) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const start = meeting.scheduledAt?.toDate ? meeting.scheduledAt.toDate() : new Date(meeting.scheduledAt);
  const end = new Date(start.getTime() + meeting.duration * 60000);
  const isLive = now >= start.getTime() && now < end.getTime();
  const isCompleted = now >= end.getTime();
  const countdown = !isLive && !isCompleted ? formatCountdown(meeting.scheduledAt) : null;
  const canDelete = isAdmin || meeting.createdBy === userData?.uid;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, delay: Math.min(index * 0.03, 0.12), ease: "easeOut" }}
      className={`group flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-slate-800 last:border-b-0 transition-colors
        ${isLive ? "bg-green-50/60 dark:bg-green-900/10" : "hover:bg-gray-50/70 dark:hover:bg-slate-800/40"}
        ${isCompleted ? "opacity-60" : ""}
      `}
    >
      {/* Status dot */}
      <div className="shrink-0">
        {isLive ? (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
        ) : isCompleted ? (
          <Check size={12} className="text-gray-300 dark:text-slate-600" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-blue-400/60 dark:bg-blue-600/40" />
        )}
      </div>

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold truncate ${isCompleted ? "text-gray-400 dark:text-slate-500" : "text-slate-800 dark:text-slate-100"}`}>
          {meeting.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5 text-[13.5px] text-gray-500 dark:text-slate-400 font-medium">
          <Calendar size={10} className="shrink-0" />
          <span>{formatDate(meeting.scheduledAt)}</span>
          <span className="text-gray-300 dark:text-slate-600">·</span>
          <Clock size={10} className="shrink-0" />
          <span>{meeting.duration < 60 ? `${meeting.duration}m` : `${meeting.duration / 60}h`}</span>
          {countdown && (
            <>
              <span className="text-gray-300 dark:text-slate-600">·</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">in {countdown}</span>
            </>
          )}
          {isLive && <span className="text-green-600 dark:text-green-400 font-bold">Live now</span>}
          {isCompleted && <span className="text-gray-400 dark:text-slate-500">Ended</span>}
        </div>
      </div>

      {/* Join button */}
      <a
        href={isLive ? meeting.meetLink : undefined}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => { if (!isLive) e.preventDefault(); }}
        aria-disabled={!isLive}
        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-[14px] font-bold rounded-md border transition-all duration-200
          ${isLive
            ? "bg-green-600 border-green-600 text-white hover:bg-green-700 hover:scale-[1.02] shadow-sm"
            : "bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-300 dark:text-slate-600 cursor-not-allowed select-none"
          }`}
      >
        <Video size={12} />
        {isLive ? "Join" : isCompleted ? "Ended" : "Join"}
      </a>

      {/* Delete */}
      {canDelete && (
        <button
          onClick={() => onDelete(meeting.id)}
          className="shrink-0 p-1.5 text-gray-300 dark:text-slate-700 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={13} />
        </button>
      )}
    </motion.div>
  );
};

export default MeetingCard;
