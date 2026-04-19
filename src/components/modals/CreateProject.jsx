import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import {v4 as uuidv4} from 'uuid';

const CreateProject = ({ isOpen, onClose, addProject }) => {
  // --- UI States ---
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('Software');
  const [selectedColor, setSelectedColor] = useState('bg-blue-600');
  const projectId = uuidv4();

  // --- Theme Constants ---
  const colorOptions = [
    { name: 'Blue', bg: 'bg-blue-600' },
    { name: 'Indigo', bg: 'bg-indigo-500' },
    { name: 'Teal', bg: 'bg-teal-500' },
    { name: 'Rose', bg: 'bg-rose-500' },
    { name: 'Amber', bg: 'bg-amber-500' },
    { name: 'Slate', bg: 'bg-slate-700' },
    { name: 'Violet', bg: 'bg-violet-600' },
    { name: 'Emerald', bg: 'bg-emerald-600' },
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-md max-h-[90vh] flex flex-col rounded-lg shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Plus size={16} strokeWidth={3} />
            </div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">New Project</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-500 dark:text-slate-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Project Name</label>
              <input 
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Arca Platform"
                className="w-full h-10 px-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:focus:border-blue-500 outline-none text-sm text-slate-900 dark:text-slate-100 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Type</label>
              <select 
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full h-10 px-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md outline-none focus:border-blue-500 dark:focus:border-blue-500 text-sm text-slate-900 dark:text-slate-100 appearance-none cursor-pointer"
              >
                <option className="bg-white dark:bg-slate-800">Software</option>
                <option className="bg-white dark:bg-slate-800">Marketing</option>
                <option className="bg-white dark:bg-slate-800">Design</option>
              </select>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Color Theme</label>
              <div className="flex flex-wrap gap-2.5 mt-1">
                {colorOptions.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.bg)}
                    className={`w-7 h-7 rounded-sm ${color.bg} transition-all ${selectedColor === color.bg ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-blue-500 scale-110' : 'hover:opacity-80 active:scale-90'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Refined Preview Section */}
          <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-blue-500 dark:text-blue-400" />
              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Card Preview</label>
            </div>
            
            <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 flex items-center gap-4 group">
              <div className={`w-12 h-12 rounded-lg ${selectedColor} flex-shrink-0 flex items-center justify-center text-white font-bold text-base shadow-sm transition-all duration-300`}>
                {projectName ? projectName.substring(0, 2).toUpperCase() : '??'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {projectName || 'Your New Project'}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium uppercase tracking-widest mt-1">
                  {projectType} Project
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 flex justify-end gap-3 flex-shrink-0 mt-auto">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              if (!projectName.trim()) {
                alert("Please enter a project name first.");
                return;
              }
              addProject(projectName, projectType, projectId, selectedColor);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 active:scale-95 transition-all"
          >
            Create Project
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateProject;