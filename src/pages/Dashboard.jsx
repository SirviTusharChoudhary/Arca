import React, { useEffect, useState } from 'react';
import { Search, Star, Clock, CheckCircle2, MoreVertical, Plus, Box, User, Zap } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { db } from '../services/firebase';
import { getDoc, doc } from 'firebase/firestore';

const Dashboard = () => {
    const {uid} = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joinedRoom, setJoinedRoom] = useState([]);

    const assignedTasks = [
        { id: 'ARC-101', title: 'Setup Firebase Auth Rules', project: 'Arca', priority: 'High', status: 'In Progress' },
        { id: 'ARC-102', title: 'Design Kanban Column UI', project: 'Arca', priority: 'Medium', status: 'To Do' },
        { id: 'ARC-103', title: 'Implement Create Room Modal', project: 'Arca', priority: 'Low', status: 'To Do' },
      ];
    
      const recentProjects = [
        { name: 'Arca Platform', key: 'ARC', iconColor: 'bg-blue-600' },
        { name: 'Marketing Website', key: 'MKT', iconColor: 'bg-purple-600' },
      ];

    useEffect(() => {
        async function fetchUser() {
            try {
                const userRef = doc(db, "users", uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUserData(userSnap.data());
                    setJoinedRoom(userSnap.data().joinedRooms);
                }
            }
            catch (error) {
                alert(error);
                console.log(error);
            }
            finally {{setLoading(false)}}
        }

        fetchUser();
    }, [uid])

  return (
    <div className="flex flex-col flex-1 h-full min-h-screen bg-gray-50 text-slate-900">
      
      {/* 1. Top Navigation Bar (Jira Style) */}
      <header className="flex items-center justify-between h-14 px-6 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span>Projects</span>
          <span className="text-gray-400">/</span>
          <span className="font-medium text-slate-800">Arca Platform</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="search" 
              placeholder="Search Arca..." 
              className="w-72 h-9 pl-9 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
          <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">
            <Zap size={18} />
          </button>
            {userData.photoURL}
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border-2 border-white ring-1 ring-gray-200">TS</div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 p-6 lg:p-10 gap-10">
        
        {/* Left Section (Main Dashboard) */}
        <div className="flex-1 flex flex-col gap-10">
          
          {/* 2. Hero Header */}
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Your Work</h1>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors">
                Go to profile
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus size={16} />
                Create project
              </button>
            </div>
          </div>

          {/* 3. The "Big Three" Tabs (Static Layout) */}
          <div className="flex flex-col gap-8">
            
            {/* Tab Navigation (Static) */}
            <div className="flex items-center border-b border-gray-200 gap-6 text-sm font-medium text-gray-600">
              {['Assigned to me', 'Worked on', 'Starred'].map((tab, index) => (
                <button 
                  key={tab} 
                  className={`pb-3 border-b-2 transition-colors ${index === 0 ? 'border-blue-600 text-blue-700 font-semibold' : 'border-transparent hover:text-blue-600 hover:border-gray-300'}`}
                >
                  {tab}
                  {index === 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">{assignedTasks.length}</span>}
                </button>
              ))}
            </div>

            {/* Task List (Static Copy) */}
            <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {assignedTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer last:border-b-0">
                  <CheckCircle2 className={`w-5 h-5 ${task.priority === 'High' ? 'text-red-500' : 'text-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{task.title}</p>
                    <p className="text-xs text-gray-500 truncate">{task.id} • {task.project}</p>
                  </div>
                  <div className={`px-2 py-0.5 text-xs font-semibold rounded ${task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-900' : 'bg-gray-100 text-gray-800'}`}>
                    {task.status}
                  </div>
                  <Star className="w-4 h-4 text-gray-300 hover:text-yellow-500 cursor-pointer transition-colors" />
                  <button className="text-gray-400 hover:text-slate-900"><MoreVertical size={16} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Viewed (Secondary Section) */}
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2"><Clock size={20} className="text-gray-500"/> Recently viewed</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {recentProjects.map(proj => (
                <div key={proj.key} className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer">
                  <div className={`w-10 h-10 rounded ${proj.iconColor} flex items-center justify-center text-white font-bold text-sm`}>{proj.key}</div>
                  <div>
                    <p className="font-semibold text-slate-950">{proj.name}</p>
                    <p className="text-xs text-gray-500">Software project • Board</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 4. Right Sidebar (Jira Quick Links) */}
        <aside className="hidden xl:flex w-80 flex-col gap-8 sticky top-24 self-start">
          
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2.5 text-sm text-blue-700 font-medium">
              {['My open issues', 'Done issues', 'View all boards', 'Create a filter'].map(link => (
                <a key={link} href="#" className="hover:underline">{link}</a>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-5 flex items-center justify-between">
              Recent Projects
              <a href="#" className="text-xs text-blue-700 hover:underline">View all</a>
            </h3>
            <div className="flex flex-col gap-4">
              {recentProjects.map(proj => (
                <div key={proj.key} className="flex items-center gap-3 text-sm">
                  <div className={`w-7 h-7 rounded-sm ${proj.iconColor} flex items-center justify-center text-white font-bold text-xs`}>
                    {proj.key}
                  </div>
                  <span className="font-medium text-slate-900 truncate">{proj.name}</span>
                </div>
              ))}
            </div>
          </div>
          
        </aside> {/* Corrected tag here */}
      </main>
    </div>
  );
};


export default Dashboard;