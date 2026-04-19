import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Loader2, ArrowLeft, UserCheck, Zap, CheckCircle2, Clock, Box } from "lucide-react";

const JoinProjectPage = () => {
  const { projectid } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [joining, setJoining] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, "projects", projectid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProject(data);
          const alreadyIn = data.admin === user?.uid || data.members?.includes(user?.uid);
          setIsMember(alreadyIn);
          if (data.pendingInvite?.includes(user?.uid)) setRequestSent(true);
        }
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.uid) fetchProject();
  }, [projectid, user?.uid]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      const docRef = doc(db, "projects", projectid);
      await updateDoc(docRef, { pendingInvite: arrayUnion(user.uid) });
      setRequestSent(true);
    } catch (err) {
      console.error("Join failed:", err);
    } finally {
      setJoining(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-md animate-pulse" />
          <Loader2 className="animate-spin text-blue-600 dark:text-blue-500" size={20} />
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">

      {/* Top bar */}
      <div className="border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 h-14 flex items-center gap-2">
        <Box className="w-5 h-5 text-blue-600 dark:text-blue-500" strokeWidth={1.5} />
        <span className="font-bold text-blue-600 dark:text-blue-500 tracking-tighter text-lg">Arca</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-[420px]"
        >
          {/* Back link */}
          <Link
            to={`/dashboard/${user?.uid}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8"
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </Link>

          {/* Card */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-md shadow-sm dark:shadow-xl overflow-hidden">

            {/* Card header — blue accent bar */}
            <div className="h-1 w-full bg-blue-600" />

            <div className="p-8">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 rounded-md flex items-center justify-center mx-auto mb-6"
              >
                {isMember
                  ? <UserCheck className="text-blue-600 dark:text-blue-400" size={28} />
                  : <ShieldCheck className="text-blue-600 dark:text-blue-400" size={28} />
                }
              </motion.div>

              {/* Project name */}
              <div className="text-center mb-8">
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                  {project?.projectName || "Project Invite"}
                </h1>
                <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-slate-600">
                  PROJ-{projectid.slice(0, 6).toUpperCase()}
                </p>
              </div>

              {/* Actions */}
              <AnimatePresence mode="wait">
                {isMember ? (
                  <motion.div
                    key="member"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-md px-4 py-3 font-medium">
                      <CheckCircle2 size={15} />
                      You already have access to this project
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/project/${projectid}`)}
                      className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      Open Project
                    </motion.button>
                  </motion.div>
                ) : requestSent ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-4"
                  >
                    <div className="bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-md p-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Clock size={14} className="text-blue-600 dark:text-blue-400" />
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Request Sent</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                        The project admin has been notified. You'll gain access once they approve your request.
                      </p>
                    </div>
                    <button
                      disabled
                      className="w-full py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 text-sm font-semibold rounded-md flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <UserCheck size={15} />
                      Pending Approval...
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="join"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-3"
                  >
                    <p className="text-sm text-gray-500 dark:text-slate-400 text-center leading-relaxed">
                      You've been invited to join this project. The admin will review and approve your request.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleJoin}
                      disabled={joining}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                    >
                      {joining
                        ? <Loader2 className="animate-spin" size={16} />
                        : <><Zap size={15} /><span>Request Access</span></>
                      }
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer hint */}
          <p className="text-center text-xs text-gray-400 dark:text-slate-600 mt-6">
            Access is managed by the project administrator.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinProjectPage;
