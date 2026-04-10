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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose} // Clicking the dark area closes the modal
    >
      
      {/* Modal Container */}
      <div 
        className="bg-white w-full max-w-md max-h-[90vh] flex flex-col rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // CRITICAL: Stops the close event from firing when clicking inside
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Plus size={16} strokeWidth={3} />
            </div>
            <h2 className="font-bold text-slate-900">New Project</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Name</label>
              <input 
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Arca Platform"
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none text-sm transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Type</label>
              <select 
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full h-10 px-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-sm appearance-none cursor-pointer"
              >
                <option>Software</option>
                <option>Marketing</option>
                <option>Design</option>
              </select>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Color Theme</label>
              <div className="flex flex-wrap gap-2.5 mt-1">
                {colorOptions.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.bg)}
                    className={`w-7 h-7 rounded-md ${color.bg} transition-all ${selectedColor === color.bg ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:opacity-80 active:scale-90'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Refined Preview Section */}
          <div className="pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-blue-500" />
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Card Preview</label>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-4 group">
              <div className={`w-12 h-12 rounded-lg ${selectedColor} flex-shrink-0 flex items-center justify-center text-white font-bold text-base shadow-sm transition-all duration-300`}>
                {projectName ? projectName.substring(0, 2).toUpperCase() : '??'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {projectName || 'Your New Project'}
                </p>
                <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-tight">
                  {projectType} Project
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button 
          onClick={ () => {addProject(projectName, projectType, projectId, selectedColor);onClose}}
            className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            Create Project
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateProject;