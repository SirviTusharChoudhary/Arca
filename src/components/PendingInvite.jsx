import React, { useState, useEffect } from "react";
import { X, Check, UserMinus, ShieldCheck, Clock, Loader2 } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#091E428A] p-4">
      <div className="bg-white w-full max-w-md rounded shadow-lg border border-[#DFE1E6] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DFE1E6] bg-white">
          <div className="flex items-center gap-2">
            <Clock className="text-[#0052CC]" size={18} />
            <h2 className="text-sm font-semibold text-[#172B4D]">
              Access Requests
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#42526E] hover:text-[#172B4D] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="max-h-[400px] overflow-y-auto">
          {localPending.length > 0 ? (
            localPending.map((uid) => (
              <div
                key={uid}
                className="flex items-center justify-between px-6 py-4 border-b border-[#DFE1E6] last:border-0 hover:bg-[#F4F5F7] transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-[#0052CC] text-white rounded-full flex items-center justify-center font-bold text-sm uppercase">
                    {usersMap[uid]?.name?.charAt(0) || "?"}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#172B4D]">
                      {usersMap[uid]?.displayName || "Unknown User"}
                    </span>
                    <span className="text-[11px] text-[#42526E] font-medium">
                      @{usersMap[uid]?.username || "user"} •{" "}
                      {usersMap[uid]?.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction(uid, "decline")}
                    className="p-1.5 text-[#42526E] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Decline"
                  >
                    <UserMinus size={18} />
                  </button>
                  <button
                    onClick={() => handleAction(uid, "accept")}
                    className="px-3 py-1.5 bg-[#0052CC] text-white text-xs font-medium rounded hover:bg-[#0747A6] transition-colors"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center px-6">
              <div className="w-12 h-12 bg-[#F4F5F7] rounded-full flex items-center justify-center mx-auto mb-3 border border-[#DFE1E6]">
                <ShieldCheck className="text-[#42526E]" size={24} />
              </div>
              <p className="text-sm font-medium text-[#42526E]">
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
