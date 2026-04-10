import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import ProfilePopup from './ProfilePopup';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const Navbar = ({ userData }) => {
  const [showProfile, setShowProfile] = useState(false);
  const nav = useNavigate();

    async function signout() {
        await signOut(auth);
        nav('/')
    }

  return (
    <header className="flex items-center justify-between h-14 px-6 bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Left: Branding */}
      <div className="flex items-center gap-4">
        <div className="font-bold text-xl text-blue-600 tracking-tight">
          Arca
        </div>
      </div>

      {/* Right: Search & Profile */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search projects..."
            className="w-64 h-9 pl-9 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* --- Profile Logic Starts Here --- */}
        <div className="relative">
          {/* Your Avatar Icon as a Button */}
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white transition-transform active:scale-90"
          >
            {userData?.displayName?.split(" ")[0][0].toUpperCase() || "U"}
          </button>

          {/* The Tiny Popup */}
          <ProfilePopup 
            isOpen={showProfile} 
            onClose={() => setShowProfile(false)} 
            userData={userData} 
            onSignOut={signout} 
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar