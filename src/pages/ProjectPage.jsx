import React from 'react';
import { 
  Search, Zap, Plus, CheckCircle2, Star, 
  MoreVertical, Clock 
} from 'lucide-react';
import Navbar from '../components/Navbar';

const ProjectPage = ({ assignedTasks = [], recentProjects = [] }) => {
  return (
    <div className="flex flex-col flex-1 h-full min-h-screen bg-gray-50 text-slate-900">
      
      {/* 1. Using our Arca Navbar instead of the old header */}
      <Navbar text={"Task"}/>

      {/* Main Content Area */}
      <main className="flex flex-1 p-2 lg:p-10 gap-10">
        
        {/* Left Section (Main Dashboard) */}
        <div className="flex-1 flex flex-col gap-10">
          
          {/* 2. Hero Header */}
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Your Work</h1>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors">
                Go to profile
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
                <Plus size={16} />
                Create project
              </button>
            </div>
          </div>

          {/* 3. The "Big Three" Tabs */}
          <div className="flex flex-col gap-8">
            
            {/* Tab Navigation */}
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

            {/* Task List (Row Based) */}
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

          {/* Recently Viewed */}
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <Clock size={20} className="text-gray-500"/> Recently viewed
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {recentProjects.map(proj => (
                <div key={proj.key} className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer">
                  <div className={`w-10 h-10 rounded ${proj.iconColor} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                    {proj.key}
                  </div>
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
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider text-[11px]">Quick Links</h3>
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
                  <div className={`w-7 h-7 rounded-sm ${proj.iconColor} flex items-center justify-center text-white font-bold text-[10px]`}>
                    {proj.key}
                  </div>
                  <span className="font-medium text-slate-900 truncate">{proj.name}</span>
                </div>
              ))}
            </div>
          </div>
          
        </aside>
      </main>
    </div>
  );
};

export default ProjectPage;