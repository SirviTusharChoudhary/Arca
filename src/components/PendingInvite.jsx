import React, { useState, useEffect } from 'react';
import { X, Check, UserMinus, ShieldCheck, Clock, Loader2 } from 'lucide-react';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../services/firebase';

const PendingInvite = ({ projData, projectid, onClose }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!projData?.pendingInvite || projData.pendingInvite.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const userPromises = projData.pendingInvite.map((uid) => 
          getDoc(doc(db, "users", uid))
        );
        const userSnaps = await Promise.all(userPromises);

        const mappedData = userSnaps.reduce((acc, snap) => {
          if (snap.exists()) {
            acc[snap.id] = snap.data();
          }
          return acc;
        }, {});

        setUserData(mappedData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [projData.pendingInvite]);

  const handleAction = async (uid, action) => {
    const docRef = doc(db, "projects", projectid);
    const userRef = doc(db, "users", uid);
    try {
      if (action === 'accept') {
        await updateDoc(docRef, {
          members: arrayUnion(uid),
          pendingInvite: arrayRemove(uid)
        });
        await updateDoc(userRef, {
            joinedProjects: arrayUnion(projData.projectId)
        })
      } else {
        await updateDoc(docRef, {
          pendingInvite: arrayRemove(uid)
        });
      }
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Clock className="text-blue-600" size={18} />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Access Requests</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="animate-spin text-blue-600" size={24} />
            </div>
          ) : Object.keys(userData).length > 0 ? (
            Object.keys(userData).map((uid) => (
              <div key={uid} className="flex items-center justify-between px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  {/* Avatar with Initial */}
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold border border-blue-100 uppercase">
                    {userData[uid]?.name?.charAt(0) || '?'}
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">
                      {userData[uid]?.name || "Unknown User"}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      @{userData[uid]?.username || 'user'} • {userData[uid]?.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleAction(uid, 'decline')}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Decline"
                  >
                    <UserMinus size={18} />
                  </button>
                  <button 
                    onClick={() => handleAction(uid, 'accept')}
                    className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all active:scale-95"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center px-6">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-100">
                <ShieldCheck className="text-slate-300" size={24} />
              </div>
              <p className="text-sm font-medium text-slate-400 italic">No pending access requests</p>
            </div>
          )}
        </div>

        {/* Branding Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Arca Security Protocol</p>
        </div>
      </div>
    </div>
  );
};

export default PendingInvite;