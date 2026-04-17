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
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#0052CC]" size={32} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[400px]">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-[#42526E] hover:text-[#0052CC] transition-all mb-6 text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="bg-white border border-[#DFE1E6] rounded p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-[#F4F5F7] rounded flex items-center justify-center border border-[#DFE1E6] mx-auto mb-6">
            {isMember ? (
              <UserCheck className="text-[#0052CC]" size={32} />
            ) : (
              <ShieldCheck className="text-[#0052CC]" size={32} />
            )}
          </div>

          <h1 className="text-xl font-semibold text-[#172B4D] mb-1 tracking-tight">
            {project?.projectName}
          </h1>
          <p className="text-[#42526E] font-mono text-[10px] uppercase tracking-widest mb-8">
            PROJ-{projectid.slice(0, 6)}
          </p>

          <div className="space-y-4">
            {isMember ? (
              <>
                <p className="text-[#0052CC] text-sm font-medium tracking-tight">
                  You already have access to this project
                </p>
                <button
                  onClick={() => navigate(`/project/${projectid}`)}
                  className="w-full py-2 bg-[#0052CC] text-white text-sm font-medium rounded hover:bg-[#0747A6] transition-colors"
                >
                  View Project
                </button>
              </>
            ) : requestSent ? (
               <div className="flex flex-col items-center gap-3">
                 <div className="text-[#172B4D] text-sm font-medium border border-[#DFE1E6] bg-[#F4F5F7] rounded p-4 w-full text-left">
                   <p className="mb-1 text-[#0052CC] font-semibold">Request Sent 🎉</p>
                   <p className="font-normal text-[#42526E] text-xs">The project admin has been notified. You'll gain access once they approve.</p>
                 </div>
                 <button disabled className="w-full bg-[#091E420F] text-[#42526E] text-sm font-medium py-2 rounded flex items-center justify-center gap-2 cursor-not-allowed">
                   <UserCheck size={16} />
                   <span>Request Pending...</span>
                 </button>
               </div>
            ) : (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="w-full bg-[#0052CC] hover:bg-[#0747A6] text-white text-sm font-medium py-2 rounded transition-colors flex items-center justify-center gap-2"
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
