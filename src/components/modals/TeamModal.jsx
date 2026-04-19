import React, { useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import {
  X,
  ShieldCheck,
  UserMinus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../../services/firebase";

const TeamModal = ({ isOpen, onClose, projData, usersMap, projectid }) => {
  const { user } = useAuth();
  const [memberSearch, setMemberSearch] = useState("");
  const debouncedSearch = useDebounce(memberSearch, 300);

  if (!isOpen) return null;

  const isAdmin = projData?.admin === user?.uid;

  const handleRemoveMember = async (uid) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      try {
        const docRef = doc(db, "projects", projectid);
        const userRef = doc(db, "users", uid);
        await updateDoc(docRef, {
          members: arrayRemove(uid),
        });
        await updateDoc(userRef, {
          joinedProjects: arrayRemove(projectid),
        });
      } catch (err) {
        console.error("Failed to remove member:", err);
      }
    }
  };

  const teamMembers = [];
  if (projData?.admin && usersMap[projData.admin]) {
    teamMembers.push({
      id: projData.admin,
      ...usersMap[projData.admin],
      role: "Admin",
    });
  }
  if (projData?.members) {
    projData.members.forEach((uid) => {
      if (uid !== projData.admin && usersMap[uid]) {
        teamMembers.push({ id: uid, ...usersMap[uid], role: "Member" });
      }
    });
  }

  const admins = teamMembers
    .filter((m) => m.role === "Admin")
    .filter(m => 
      !debouncedSearch || 
      m.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
      m.displayName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      m.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  const members = teamMembers
    .filter((m) => m.role === "Member")
    .filter(m => 
      !debouncedSearch || 
      m.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
      m.displayName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      m.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

  const renderMember = (member) => (
    <div
      key={member.id}
      className="group flex items-center gap-3 px-6 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-sm transition-all cursor-default"
    >
      {/* Avatar */}
      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
        {member.displayName
          ? member.displayName.charAt(0)
          : member.name?.charAt(0) || "?"}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
            {member.name || member.displayName}
          </p>
          {member.role === "Admin" && (
            <ShieldCheck size={14} className="text-blue-600 dark:text-blue-400" title="Admin" />
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{member.email}</p>
      </div>

      {/* Action */}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
        {isAdmin && member.role !== "Admin" && (
          <button
            onClick={() => handleRemoveMember(member.id)}
            className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
            title="Remove Member"
          >
            <UserMinus size={18} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Project Team
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
              {teamMembers.length} members have access
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md text-gray-500 dark:text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search / Invite Bar */}
        <div className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Filter by name or email..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-md focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:focus:border-blue-500 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Member List */}
        <div className="max-h-[400px] overflow-y-auto py-2">
          {admins.length > 0 || members.length > 0 ? (
            <>
              {admins.length > 0 && (
                <div className="mb-2">
                  <h4 className="px-6 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400 mt-2 mb-1">
                    Administrators
                  </h4>
                  {admins.map(renderMember)}
                </div>
              )}

              {members.length > 0 && (
                <div>
                  <h4 className="px-6 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400 mt-4 mb-1">
                    Members
                  </h4>
                  {members.map(renderMember)}
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center text-sm font-medium text-gray-500 dark:text-slate-400">
              No members found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamModal;
