import { useEffect, useState } from "react";
import {
  Plus,
  CheckCircle2,
  UserPlus,
  Link as LinkIcon,
  Users,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useParams, useNavigate } from "react-router-dom";
import CreateTask from "../components/CreateTask";
import PendingInvite from "../components/PendingInvite";
import TaskList from "../components/TaskList";
import TeamModal from "../components/TeamModal";

const ProjectPage = () => {
  const { userData, user } = useAuth();
  const { projectid } = useParams();
  const navigate = useNavigate();
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [projData, setProjData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addTaskModalOpen, setAddTaskModelOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [category, setCategory] = useState(1);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [usersMap, setUsersMap] = useState({});

  useEffect(() => {
    async function fetchUsers() {
      if (!projData.projectId) return;

      const uids = new Set();
      if (projData.admin) uids.add(projData.admin);
      if (projData.members) projData.members.forEach((uid) => uids.add(uid));
      if (projData.pendingInvite)
        projData.pendingInvite.forEach((uid) => uids.add(uid));

      const uidsToFetch = Array.from(uids).filter((uid) => !usersMap[uid]);

      if (uidsToFetch.length > 0) {
        try {
          const snaps = await Promise.all(
            uidsToFetch.map((uid) => getDoc(doc(db, "users", uid))),
          );
          setUsersMap((prev) => {
            const newMap = { ...prev };
            snaps.forEach((snap) => {
              if (snap.exists()) newMap[snap.id] = snap.data();
            });
            return newMap;
          });
        } catch (err) {
          console.error("Failed to fetch users map:", err);
        }
      }
    }
    fetchUsers();
  }, [projData.pendingInvite, projData.members, projData.admin]);

  useEffect(() => {
    let unsubTasks;
    let unsubProj;
    async function fetchData() {
      const taskRef = collection(db, "tasks");
      const ProjRef = doc(db, "projects", projectid);

      unsubProj = onSnapshot(ProjRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const isAdmin = data.admin === userData?.uid;
          const isMember = data.members?.includes(userData?.uid);

          if (!isAdmin && !isMember) {
            navigate(`/join/${projectid}`, { replace: true });
            return;
          }

          setProjData(data);
          setPendingInvites(data.pendingInvite || []);
        } else {
          // If project doesn't exist, kick to dashboard
          navigate('/dashboard', { replace: true });
        }
      });

      let q;
      if (category == 0) {
        q = query(
          taskRef,
          where("projectId", "==", projectid),
          orderBy("createdAt", "desc"),
        );
      } else if (category == 1) {
        q = query(
          taskRef,
          where("assignedTo", "==", userData.uid),
          where("projectId", "==", projectid),
          where("status", "!=", "Done"),
          orderBy("createdAt", "desc"),
        );
      } else if (category == 2) {
        q = query(
          taskRef,
          where("assignedTo", "==", userData.uid),
          where("projectId", "==", projectid),
          where("status", "==", "Done"),
          orderBy("createdAt", "desc"),
        );
      } else if (category == 3) {
        q = query(
          taskRef,
          where("assignedTo", "==", userData.uid),
          where("projectId", "==", projectid),
          where("starred", "==", true),
          orderBy("createdAt", "desc"),
        );
      }
      unsubTasks = onSnapshot(q, (data) => {
        const tasks = data.docs.map((ele) => ({
          id: ele.id,
          ...ele.data(),
        }));
        setAssignedTasks(tasks);
        setLoading(false);
      });
    }
    fetchData();

    return () => {
      if (unsubTasks) unsubTasks();
      if (unsubProj) unsubProj();
    };
  }, [projectid, userData?.uid, category]);

  async function handleDeleteTask(e, id) {
    e.stopPropagation();
    if (projData.admin !== userData?.uid) return;
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteDoc(doc(db, "tasks", id));
        console.log("Task deleted");
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  }

  if (loading) return <p>LOL WAIT....</p>;

  return (
    <div className="flex flex-col flex-1 h-full min-h-screen bg-gray-50 text-slate-900">
      {/* 1. Using our Arca Navbar instead of the old header */}
      <Navbar text={"Task"} />

      {/* Main Content Area */}
      <main className="flex flex-1 p-2 lg:p-10 gap-10">
        {/* Left Section (Main Dashboard) */}
        <div className="flex-1 flex flex-col gap-5">
          {/* 2. Hero Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            {/* Left Side: Project Info & Resource Links */}
            <div className="flex flex-col gap-3">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                  {projData.projectName}
                </h1>
              </div>

              {/* Integrated Copy and Team Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    const inviteLink = `${window.location.origin}/join/${projectid}`;
                    await navigator.clipboard.writeText(inviteLink);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`flex items-center self-start gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] border-2 border-dashed rounded-lg transition-all active:scale-95 ${
                    copied
                      ? "bg-green-50 border-green-200 text-green-600"
                      : "bg-white border-slate-200 text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30"
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 size={14} />
                      <span>Invite Link Copied</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon size={14} />
                      <span>Copy Invite Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setTeamModalOpen(true)}
                  className="flex items-center self-start gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] border-2 border-slate-200 bg-white rounded-lg transition-all hover:bg-slate-50 active:scale-95 text-slate-500 hover:border-slate-300 shadow-sm"
                >
                  <Users size={14} />
                  <span>Team</span>
                </button>
              </div>
            </div>

            {/* Right Side: Admin Action Buttons */}
            {projData?.admin === user?.uid && (
              <div className="flex items-center gap-3">
                {/* Pending Invites */}
                <button
                  onClick={() => setInviteModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
                >
                  <div className="relative">
                    <UserPlus size={18} className="text-slate-500" />
                    {pendingInvites?.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white animate-pulse" />
                    )}
                  </div>
                  <span>Pending Invites</span>
                </button>

                {/* Add Task */}
                <button
                  onClick={() => setAddTaskModelOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                >
                  <Plus size={18} />
                  <span>Add Task</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. The "Big Three" Tabs */}
          <div className="flex flex-col gap-8">
            {/* Tab Navigation */}
            <div className="flex items-center border-b border-slate-200 gap-6 text-sm font-medium text-slate-500">
              {["All Tasks", "Assigned to me", "Worked on", "Starred"].map(
                (tab, index) => (
                  <button
                    key={tab}
                    onClick={() => setCategory(index)}
                    className={`pb-3 border-b-2 transition-colors ${index === category ? "border-blue-600 text-slate-900 font-bold" : "border-transparent hover:text-slate-900 hover:border-slate-300"}`}
                  >
                    {tab}
                    {index === category && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {assignedTasks.length}
                      </span>
                    )}
                  </button>
                ),
              )}
            </div>

            {/* Task List (Row Based) */}
            <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {assignedTasks?.length > 0 ? (
                assignedTasks.map((task, index) => (
                  <TaskList
                    key={index}
                    task={task}
                    isAdmin={projData.admin === user.uid}
                    handleDeleteTask={handleDeleteTask}
                    usersMap={usersMap}
                  />
                ))
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center p-12 text-center text-sm font-medium text-slate-500 min-h-[150px]">
                  No tasks to display in this category.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {addTaskModalOpen && (
        <CreateTask
          projData={projData}
          onClose={() => setAddTaskModelOpen(false)}
          usersMap={usersMap}
        />
      )}

      {inviteModalOpen && (
        <PendingInvite
          projectid={projData.projectId}
          onClose={() => setInviteModalOpen(false)}
          projData={projData}
          usersMap={usersMap}
        />
      )}

      <TeamModal
        isOpen={teamModalOpen}
        onClose={() => setTeamModalOpen(false)}
        projData={projData}
        usersMap={usersMap}
        projectid={projectid}
      />
    </div>
  );
};

export default ProjectPage;
