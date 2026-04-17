import { useEffect, useState } from "react";
import { Plus, Trash2, CheckCircle2, Star, MoreVertical, UserPlus, Link as LinkIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { collection, doc, getDoc, onSnapshot, query, where, orderBy, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useParams } from "react-router-dom";
import CreateTask from "../components/CreateTask";
import PendingInvite from "../components/PendingInvite";

const ProjectPage = () => {
  const { userData, user } = useAuth();
  const { projectid } = useParams();
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [projData, setProjData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addTaskModalOpen, setAddTaskModelOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let unsub;
    async function fetchData() {
      const taskRef = collection(db, "tasks");
      const ProjRef = doc(db, "projects", projectid);
      const proj = await getDoc(ProjRef);
      if (proj.exists()) {
        setProjData(proj.data());
      }

      const q = query(
        taskRef,
        where("assignedTo", "==", userData.uid),
        where("projectId", "==", projectid),
        orderBy("createdAt", "desc")
      );
      unsub = onSnapshot(q, (data) => {
        const tasks = data.docs.map((ele) => ({
          id : ele.id,
          ...ele.data(),
        }))
        setAssignedTasks(tasks);
        setLoading(false);
      })
      
    }
    fetchData();

    return () => {
      if (unsub) unsub(); 
    }
  }, [projectid, userData?.uid]);

  async function handleDeleteTask(e, id) {
    e.stopPropagation();
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

              {/* Integrated Copy Button below project text */}
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
                    {projData?.pendingInvite?.length > 0 && (
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
            <div className="flex items-center border-b border-gray-200 gap-6 text-sm font-medium text-gray-600">
              {["Assigned to me", "Worked on", "Starred"].map((tab, index) => (
                <button
                  key={tab}
                  className={`pb-3 border-b-2 transition-colors ${index === 0 ? "border-blue-600 text-blue-700 font-semibold" : "border-transparent hover:text-blue-600 hover:border-gray-300"}`}
                >
                  {tab}
                  {index === 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {assignedTasks.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Task List (Row Based) */}
            <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {assignedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer last:border-b-0"
                >
                  <CheckCircle2
                    className={`w-5 h-5 ${task.priority === "High" ? "text-red-500" : "text-gray-400"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {task.id} • {task.project}
                    </p>
                  </div>
                  <div
                    className={`px-2 py-0.5 text-xs font-semibold rounded ${task.status === "In Progress" ? "bg-yellow-100 text-yellow-900" : "bg-gray-100 text-gray-800"}`}
                  >
                    {task.status}
                  </div>
                  <Star className="w-4 h-4 text-gray-300 hover:text-yellow-500 cursor-pointer transition-colors" />
                  {projData?.admin === user?.uid && (
                    <button
                      onClick={(e) => handleDeleteTask(e, task.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                      title="Delete Task"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <button className="text-gray-400 hover:text-slate-900">
                    <MoreVertical size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Right Sidebar (Jira Quick Links) */}
        {/* <aside className="hidden xl:flex w-80 flex-col gap-8 sticky top-24 self-start">
          
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider text-[11px]">Quick Links</h3>
            <div className="flex flex-col gap-2.5 text-sm text-blue-700 font-medium">
              {['My open issues', 'Done issues', 'View all boards', 'Create a filter'].map(link => (
                <a key={link} href="#" className="hover:underline">{link}</a>
              ))}
            </div>
          </div>
          
        </aside> */}
      </main>

      {addTaskModalOpen && (
        <CreateTask
          projData={projData}
          onClose={() => setAddTaskModelOpen(false)}
        />
      )}

      {inviteModalOpen && (
        <PendingInvite
          projectid={projData.projectId}
          onClose={() => setInviteModalOpen(false)}
          projData={projData}
        />
      )}
    </div>
  );
};

export default ProjectPage;
