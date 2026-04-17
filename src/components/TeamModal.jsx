import React from "react";
import {
  X,
  ShieldCheck,
  UserPlus,
  MoreHorizontal,
  UserMinus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../services/firebase";

const TeamModal = ({ isOpen, onClose, projData, usersMap, projectid }) => {
  const { user } = useAuth();

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

  const admins = teamMembers.filter((m) => m.role === "Admin");
  const members = teamMembers.filter((m) => m.role === "Member");

  const renderMember = (member) => (
    <div
      key={member.id}
      className="group flex items-center gap-3 px-6 py-3 hover:bg-[#F4F5F7] rounded transition-all cursor-default"
    >
      {/* Avatar */}
      <div className="h-10 w-10 rounded-full bg-[#0052CC] flex items-center justify-center text-white font-bold text-sm">
        {member.displayName
          ? member.displayName.charAt(0)
          : member.name?.charAt(0) || "?"}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-[#172B4D] truncate">
            {member.name || member.displayName}
          </p>
          {member.role === "Admin" && (
            <ShieldCheck size={14} className="text-[#0052CC]" title="Admin" />
          )}
        </div>
        <p className="text-xs text-[#42526E] truncate">{member.email}</p>
      </div>

      {/* Action */}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
        {isAdmin && member.role !== "Admin" && (
          <button
            onClick={() => handleRemoveMember(member.id)}
            className="p-1.5 text-[#42526E] hover:text-red-600 hover:bg-red-50 rounded transition-all"
            title="Remove Member"
          >
            <UserMinus size={18} />
          </button>
        )}
        <button className="p-1.5 text-[#42526E] hover:text-[#172B4D] hover:bg-[#DFE1E6] rounded transition-all">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#091E428A]"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white border border-[#DFE1E6] rounded shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DFE1E6]">
          <div>
            <h3 className="text-lg font-semibold text-[#172B4D]">
              Project Team
            </h3>
            <p className="text-xs text-[#42526E]">
              {teamMembers.length} members have access
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#F4F5F7] rounded text-[#42526E] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search / Invite Bar */}
        <div className="px-6 py-4 bg-white border-b border-[#DFE1E6] flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Filter by name or email..."
              className="w-full pl-3 pr-3 py-2 text-sm bg-white border border-[#DFE1E6] rounded focus:outline-none focus:border-[#0052CC] transition-all"
            />
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0052CC] hover:bg-[#0747A6] text-white text-sm font-medium rounded transition-colors">
            <UserPlus size={14} />
            <span>Add people</span>
          </button>
        </div>

        {/* Member List */}
        <div className="max-h-[400px] overflow-y-auto py-2">
          {teamMembers.length > 0 ? (
            <>
              {admins.length > 0 && (
                <div className="mb-2">
                  <h4 className="px-6 text-xs font-semibold text-[#42526E] mt-2 mb-1">
                    Administrators
                  </h4>
                  {admins.map(renderMember)}
                </div>
              )}

              {members.length > 0 && (
                <div>
                  <h4 className="px-6 text-xs font-semibold text-[#42526E] mt-4 mb-1">
                    Members
                  </h4>
                  {members.map(renderMember)}
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center text-sm text-[#42526E]">
              No members found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamModal;
