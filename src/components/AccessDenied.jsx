import React, { useState } from 'react';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const nav = useNavigate();

  const handleBackToDashboard = () => {
    nav('/dashboard');
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-[#F4F5F7] text-slate-900 items-center justify-center p-6">
      
      {/* Main Card */}
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-2xl p-10 flex flex-col items-center text-center gap-8">
        
        {/* The Shield: Constant Glow + Hover Shake */}
        <div className="relative group">
          {/* Outer Glow Layer */}
          <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          
          {/* Icon Container */}
          <div className="relative p-7 rounded-full bg-red-50 text-red-600 border border-red-100 shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all duration-300">
            <ShieldAlert size={64} strokeWidth={1.5} />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">Access Denied</h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-[280px] mx-auto">
            You don't have permission to access this project. Please contact the administrator for a room invite.
          </p>
          <div className="inline-block px-3 py-1 bg-gray-100 text-gray-500 rounded text-[10px] font-bold uppercase tracking-widest">
            Forbidden • 403
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full pt-4 border-t border-gray-50">
          <button 
            onClick={handleBackToDashboard}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            Back to My Dashboard
          </button>
        </div>
      </div>

      <p className="mt-8 text-[10px] text-gray-400 font-semibold uppercase tracking-[0.2em]">
        Arca Security Protocol
      </p>
    </div>
  );
};

export default AccessDenied;