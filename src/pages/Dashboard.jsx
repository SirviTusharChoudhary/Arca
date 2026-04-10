import React, { useState, useEffect } from "react";
import { Search, Plus, LayoutGrid, MoreVertical, Users } from "lucide-react";
import { useParams } from 'react-router-dom';
import { db } from '../services/firebase';
import { getDoc, doc, serverTimestamp, writeBatch, arrayUnion, onSnapshot } from 'firebase/firestore';
import CreateProject from "../components/CreateProject";
import ProjectList from "../components/ProjectList";
import AccessDenied from "../components/AccessDenied";
import { useAuth } from '../context/AuthContext.jsx'

const Dashboard = () => {
  const { uid } = useParams();
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinedProject, setJoinedProject] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
  const userRef = doc(db, "users", uid);
  const unsub = onSnapshot(
    userRef,
    async (userSnap) => {
      if (userSnap.exists()) {
        setUserData(userSnap.data());
        const projIds = userSnap.data().joinedProjects || [];
        const projObjs = await Promise.all(
          projIds.map(async (id) => {
            const projDoc = await getDoc(doc(db, "projects", id));
            return projDoc.exists() ? projDoc.data() : null;
          })
        );
        setJoinedProject(projObjs.filter((p) => p));
        setLoading(false);
      }
    },
    (error) => {
      console.error(error);
      setLoading(false);
    }
  );

  return () => unsub();
}, [uid]);

  async function addProject(projectName, projectType, projectId, selectedColor) {
    const newProj = {
      projectId : projectId,
      projectName : projectName,
      projectType : projectType,
      selectedColor : selectedColor,
      admin : userData.uid,
      pendingInvite : [],
      managers : [],
      members : [],
      createdAt: serverTimestamp(),
    }

    const projectRef = doc(db, "projects", projectId);
    const userRef = doc(db, "users", userData.uid);
    const batch = writeBatch(db);

    batch.set(projectRef, newProj);
    batch.update(userRef, {
      joinedProjects: arrayUnion(projectId)
    })

    try {
      await batch.commit();
      console.log("Project created and User profile updated successfully!");
    } catch (error) {
      console.error("Batch update failed: ", error);
    } 
    setModalOpen(false);
  }

  if (loading) {
    return (
      <div
        style={{
          background: "blue",
          color: "white",
          height: "100vh",
          padding: "50px",
        }}
      >
        <h1>Dashboard is reaching the return statement!</h1>
        <p>User UID from URL: {uid}</p>
        <p>User Data status: {userData ? "Loaded" : "Not Loaded"}</p>
      </div>
    );
  }

  if (user.uid != uid) {
    return <AccessDenied/>
  }

  return (
    <div className="flex flex-col flex-1 h-full min-h-screen bg-[#F4F5F7] text-slate-900">
      {/* 1. Global Navigation */}
      <header className="flex items-center justify-between h-14 px-6 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="font-bold text-xl text-blue-600 tracking-tight">
            Arca
          </div>
          {/* <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-600">
            <a href="#" className="px-3 py-1 bg-blue-50 text-blue-700 rounded">Dashboards</a>
            <a href="#" className="hover:text-blue-600">Projects</a>
            <a href="#" className="hover:text-blue-600">People</a>
          </nav> */}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search projects..."
              className="w-64 h-9 pl-9 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
            JD
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full p-6 lg:p-10">
        {/* 2. Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
            <p className="text-gray-500 text-sm">
              Manage your rooms and collaborative workspaces.
            </p>
          </div>
          <button onClick={() => setModalOpen(!modalOpen)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
            <Plus size={18} />
            Create Project
          </button>
        </div>

        <ProjectList projects={joinedProject} isAdminUid={user.uid}/>

        {/* 4. Secondary Section: Recent Activity / Activity Stream */}
        {/* <div className="mt-12">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Clock size={16} />
            Recent Activity
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            <div className="p-4 flex items-center gap-4 text-sm">
               <div className="w-2 h-2 rounded-full bg-blue-500"></div>
               <span className="text-gray-600">You created task <span className="font-semibold text-slate-900">ARCA-12</span> in <span className="font-semibold text-blue-600">Arca Platform</span></span>
               <span className="text-gray-400 ml-auto">2 hours ago</span>
            </div>
            <div className="p-4 flex items-center gap-4 text-sm">
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
               <span className="text-gray-600">Updated room settings for <span className="font-semibold text-blue-600">Design System</span></span>
               <span className="text-gray-400 ml-auto">Yesterday</span>
            </div>
          </div>
        </div> */}

        {modalOpen && <CreateProject isOpen={modalOpen} onClose={() => setModalOpen(false)} addProject={addProject}/>}
      </main>
    </div>
  );
};

export default Dashboard;
