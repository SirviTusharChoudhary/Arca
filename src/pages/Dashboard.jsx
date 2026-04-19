import React, { useState, useEffect } from "react";
import { Search, Plus, LayoutGrid, MoreVertical, Users } from "lucide-react";
import { useParams } from "react-router-dom";
import { db } from "../services/firebase";
import {
  getDoc,
  doc,
  serverTimestamp,
  writeBatch,
  arrayUnion,
} from "firebase/firestore";
import CreateProject from "../components/CreateProject";
import ProjectList from "../components/ProjectList";
import AccessDenied from "../components/AccessDenied";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";

const Dashboard = () => {
  const { uid } = useParams();
  const { user, userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [joinedProject, setJoinedProject] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!userData) {
        setLoading(false);
        return;
      }
      const projIds = userData.joinedProjects || [];
      const projObjs = await Promise.all(
        projIds.map(async (id) => {
          const projDoc = await getDoc(doc(db, "projects", id));
          return projDoc.exists() ? projDoc.data() : null;
        }),
      );
      setJoinedProject(projObjs.filter((p) => p));
      setLoading(false);
    };

    fetchProjects();
  }, [userData]);

  async function addProject(
    projectName,
    projectType,
    projectId,
    selectedColor,
  ) {
    const newProj = {
      projectId: projectId,
      projectName: projectName,
      projectType: projectType,
      selectedColor: selectedColor,
      admin: userData.uid,
      pendingInvite: [],
      managers: [],
      members: [],
      createdAt: serverTimestamp(),
    };

    const projectRef = doc(db, "projects", projectId);
    const userRef = doc(db, "users", userData.uid);
    const batch = writeBatch(db);

    batch.set(projectRef, newProj);
    batch.update(userRef, {
      joinedProjects: arrayUnion(projectId),
    });

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
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-500"></div>
      </div>
    );
  }

  if (user.uid !== uid) {
    return <AccessDenied />;
  }

  const filteredProjects = joinedProject.filter(proj => 
    proj.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proj.projectType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 h-full min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* 1. Global Navigation */}
      <Navbar text={"Project"} onSearch={setSearchQuery} />

      <main className="max-w-7xl mx-auto w-full p-6 lg:p-10 flex flex-col gap-10">
        {/* 2. Hero Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Your Work</h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm">
              Manage your rooms and collaborative workspaces.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalOpen(!modalOpen)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus size={16} />
              Create project
            </button>
          </div>
        </div>

        <ProjectList projects={filteredProjects} isAdminUid={user.uid} />

        {modalOpen && (
          <CreateProject
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            addProject={addProject}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
