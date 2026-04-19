import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const nav = useNavigate();

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-gray-50 dark:bg-slate-950 items-center justify-center p-6 transition-colors duration-300">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg shadow-sm dark:shadow-xl p-8 flex flex-col items-center text-center gap-4">
        
        {/* Icon Container */}
        <div className="w-12 h-12 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 flex items-center justify-center shrink-0 mb-2">
          <ShieldAlert size={24} strokeWidth={2} />
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">Access Denied</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed font-medium">
            You don't have permission to access this project. Please contact the administrator for a room invite.
          </p>
        </div>

        {/* Action Button */}
        <div className="w-full pt-4">
          <button 
            onClick={() => nav('/dashboard')}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;