import React, { useState } from 'react';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const nav = useNavigate();

  const handleBackToDashboard = () => {
    nav('/dashboard');
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-[#F4F5F7] text-[#172B4D] items-center justify-center p-6">
      
      {/* Main Card */}
      <div className="w-full max-w-sm bg-white border border-[#DFE1E6] rounded shadow-sm p-8 flex flex-col items-center text-center gap-4">
        
        {/* Icon Container */}
        <div className="w-12 h-12 rounded bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0 mb-2">
          <ShieldAlert size={24} strokeWidth={2} />
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h1 className="text-lg font-semibold tracking-tight">Access Denied</h1>
          <p className="text-sm text-[#42526E] leading-relaxed">
            You don't have permission to access this project. Please contact the administrator for a room invite.
          </p>
        </div>

        {/* Action Button */}
        <div className="w-full pt-4">
          <button 
            onClick={handleBackToDashboard}
            className="w-full py-2 bg-[#0052CC] hover:bg-[#0747A6] text-white text-sm font-medium rounded transition-colors flex items-center justify-center gap-2"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;