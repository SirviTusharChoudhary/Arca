import React, { useState, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';
import { useNavigate } from 'react-router-dom';
import { Search, Box, Sun, Moon } from 'lucide-react';
import ProfilePopup from './ProfilePopup';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ text, onSearch }) => {
  const { userData } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 300);
  const nav = useNavigate();

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch]);

  async function signout() {
    await signOut(auth);
    nav('/');
  }

  return (
    <header className="flex items-center justify-between h-14 px-6 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
      {/* Left: Branding & Breadcrumbs (Jira Style) */}
      <div className="flex items-center gap-4">
        <div 
          className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => {
            if (userData?.uid) {
              nav(`/dashboard/${userData.uid}`);
            }
          }}
        >
          <Box className="w-6 h-6 text-blue-600 dark:text-blue-500" strokeWidth={1.5} />
          <div className="font-bold text-xl text-blue-600 dark:text-blue-500 tracking-tight">
            Arca
          </div>
        </div>

        {/* Breadcrumb styling from snippet */}
        <div className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-slate-400 ml-4 border-l border-gray-200 dark:border-slate-700 pl-4">
          <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Projects</span>
          <span className="text-gray-300 dark:text-slate-600">/</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{text === 'Project' ? 'Dashboard' : text}</span>
        </div>
      </div>

      {/* Right: Search, Theme Toggle & Profile */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
          <input
            type="search"
            placeholder={`Search ${text}...`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-72 h-9 pl-9 pr-3 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-200 dark:focus:ring-blue-500/30 text-slate-900 dark:text-slate-100 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* --- Profile Logic Starts Here --- */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="w-8 h-8 rounded-full bg-slate-700 dark:bg-slate-600 flex items-center justify-center text-xs font-bold text-white border-2 border-white dark:border-slate-800 ring-1 ring-gray-200 dark:ring-slate-700 transition-transform hover:opacity-90 active:scale-95"
          >
            {userData?.displayName?.split(" ")[0][0].toUpperCase() || "U"}
          </button>

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

export default Navbar;