import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Loader2, ArrowLeft, UserCheck, Zap } from 'lucide-react';

const JoinProjectPage = () => {
  const { projectid } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [joining, setJoining] = useState(false);

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
        pendingInvite: arrayUnion(user.uid)
      });
    } catch (err) {
      console.error("Join failed:", err);
    } finally {
      setJoining(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0c10] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[400px]">
        
        <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-white transition-all mb-6 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 shadow-xl text-center">
          <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20 mx-auto mb-6">
            {isMember ? <UserCheck className="text-green-400" size={32} /> : <ShieldCheck className="text-blue-500" size={32} />}
          </div>

          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
            {project?.projectName}
          </h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mb-8">
            ID: {projectid.slice(0, 12)}
          </p>

          <div className="space-y-4">
            {isMember ? (
              <>
                {/* Minimalist "Already Member" text exactly above the button */}
                <p className="text-green-400 text-sm font-semibold tracking-tight">
                  You are already a part of this project
                </p>
                <button 
                  onClick={() => navigate(`/project/${projectid}`)}
                  className="w-full py-3.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-slate-200 transition-all active:scale-95"
                >
                  Go to Project 
                </button>
              </>
            ) : (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                {joining ? <Loader2 className="animate-spin" size={18} /> : (
                  <>
                    <Zap size={16} />
                    <span>Initialize Access</span>
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