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
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5F7]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user.uid !== uid) {
    return <AccessDenied />;
  }

  return (
    <div className="flex flex-col flex-1 h-full min-h-screen bg-[#F4F5F7] text-slate-900">
      {/* 1. Global Navigation */}
      <Navbar text={"Project"} />

      <main className="max-w-7xl mx-auto w-full p-6 lg:p-10">
        {/* 2. Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
            <p className="text-gray-500 text-sm">
              Manage your rooms and collaborative workspaces.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(!modalOpen)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            Create Project
          </button>
        </div>

        <ProjectList projects={joinedProject} isAdminUid={user.uid} />

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
