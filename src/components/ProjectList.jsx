import React from "react";
import { MoreVertical, Users, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProjectList = ({ projects, isAdminUid }) => {
  const nav = useNavigate();
  if (!projects || projects.length === 0) {
    return (
      <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-white">
        <LayoutGrid size={48} className="text-gray-300 mb-4" />
        <p className="text-gray-900 font-medium">No rooms found</p>
        <p className="text-gray-500 text-sm">
          Create a project to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          onClick={() => nav(`/project/${project.projectId}`)}
          key={project.projectId}
          className="group bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col gap-4"
        >
          {/* Top Section */}
          <div className="flex justify-between items-start">
            <div
              className={`w-12 h-12 rounded-lg ${project.selectedColor || "bg-blue-600"} flex items-center justify-center text-white font-bold text-lg shadow-sm`}
            >
              {project.projectName?.substring(0, 2).toUpperCase()}
            </div>
            <button className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-slate-900 transition-all">
              <MoreVertical size={18} />
            </button>
          </div>

          {/* Info Section */}
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
              {project.projectName}
            </h3>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">
              {project.projectType || "Software"} Room
            </p>
          </div>

          {/* Bottom Section */}
          <div className="mt-2 flex items-center justify-between border-t border-gray-50 pt-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Users size={14} />
              <span className="text-xs font-medium">
                {(project.members?.length || 0) +
                  (project.managers?.length || 0) +
                  1}{" "}
                members
              </span>
            </div>

            {project.admin === isAdminUid && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                Admin
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
