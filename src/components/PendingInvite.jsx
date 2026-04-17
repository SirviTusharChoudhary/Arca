import React, { useState, useEffect } from "react";
import { X, UserMinus, ShieldCheck, Clock } from "lucide-react";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../services/firebase";

const PendingInvite = ({ projData, projectid, onClose, usersMap }) => {
  const [localPending, setLocalPending] = useState([]);

  useEffect(() => {
    if (projData?.pendingInvite) {
      setLocalPending(projData.pendingInvite);
    }
  }, [projData?.pendingInvite]);

  const handleAction = async (uid, action) => {
    setLocalPending((prev) => prev.filter((id) => id !== uid));

    const docRef = doc(db, "projects", projectid);
    const userRef = doc(db, "users", uid);
    try {
      if (action === "accept") {
        await updateDoc(docRef, {
          members: arrayUnion(uid),
          pendingInvite: arrayRemove(uid),
        });
        await updateDoc(userRef, {
          joinedProjects: arrayUnion(projData.projectId),
        });
      } else {
        await updateDoc(docRef, {
          pendingInvite: arrayRemove(uid),
        });
      }
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-lg shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Clock className="text-blue-600 dark:text-blue-400" size={18} />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Access Requests
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Area */}
        <div className="max-h-[400px] overflow-y-auto">
          {localPending.length > 0 ? (
            localPending.map((uid) => (
              <div
                key={uid}
                className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800/60 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm uppercase">
                    {usersMap[uid]?.name?.charAt(0) || "?"}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {usersMap[uid]?.displayName || "Unknown User"}
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
                      @{usersMap[uid]?.username || "user"} •{" "}
                      {usersMap[uid]?.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction(uid, "decline")}
                    className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Decline"
                  >
                    <UserMinus size={18} />
                  </button>
                  <button
                    onClick={() => handleAction(uid, "accept")}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center px-6">
              <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-200 dark:border-slate-700">
                <ShieldCheck className="text-gray-400 dark:text-slate-500" size={24} />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                No pending access requests
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingInvite;
