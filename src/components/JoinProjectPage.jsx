import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Loader2, ArrowLeft, UserCheck, Zap } from "lucide-react";

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
          const alreadyIn =
            data.admin === user?.uid || data.members?.includes(user?.uid);
          setIsMember(alreadyIn);
          if (data.pendingInvite?.includes(user?.uid)) {
            setRequestSent(true);
          }
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
      await updateDoc(docRef, {
        pendingInvite: arrayUnion(user.uid),
      });
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
        <Loader2 className="animate-spin text-blue-600 dark:text-blue-500" size={32} />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 font-sans transition-colors duration-300">
      <div className="w-full max-w-[400px]">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all mb-6 text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-8 shadow-sm dark:shadow-xl text-center">
          <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-slate-700 mx-auto mb-6">
            {isMember ? (
              <UserCheck className="text-blue-600 dark:text-blue-400" size={32} />
            ) : (
              <ShieldCheck className="text-blue-600 dark:text-blue-400" size={32} />
            )}
          </div>

          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1 tracking-tight">
            {project?.projectName}
          </h1>
          <p className="text-gray-500 dark:text-slate-400 font-mono text-[10px] uppercase tracking-widest mb-8">
            PROJ-{projectid.slice(0, 6)}
          </p>

          <div className="space-y-4">
            {isMember ? (
              <>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium tracking-tight">
                  You already have access to this project
                </p>
                <button
                  onClick={() => navigate(`/project/${projectid}`)}
                  className="w-full py-2 bg-blue-600 dark:bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
                >
                  View Project
                </button>
              </>
            ) : requestSent ? (
               <div className="flex flex-col items-center gap-3">
                 <div className="text-slate-900 dark:text-slate-100 text-sm font-medium border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 w-full text-left">
                   <p className="mb-1 text-blue-600 dark:text-blue-400 font-semibold">Request Sent 🎉</p>
                   <p className="font-normal text-gray-500 dark:text-slate-400 text-xs">The project admin has been notified. You'll gain access once they approve.</p>
                 </div>
                 <button disabled className="w-full bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 text-sm font-medium py-2 rounded-md flex items-center justify-center gap-2 cursor-not-allowed">
                   <UserCheck size={16} />
                   <span>Request Pending...</span>
                 </button>
               </div>
            ) : (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                {joining ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Zap size={16} />
                    <span>Request Access</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinProjectPage;
