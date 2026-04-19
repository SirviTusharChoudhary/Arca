import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useDebounce from '../../hooks/useDebounce';
import { useNavigate } from 'react-router-dom';
import { Search, Box, Sun, Moon } from 'lucide-react';
import ProfilePopup from '../ui/ProfilePopup';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

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
    <motion.header
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-center justify-between h-14 px-6 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300"
    >
      {/* Left: Branding */}
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 cursor-pointer"
          onClick={() => { if (userData?.uid) nav(`/dashboard/${userData.uid}`); }}
        >
          <Box className="w-6 h-6 text-blue-600 dark:text-blue-500" strokeWidth={1.5} />
          <div className="font-bold text-xl text-blue-600 dark:text-blue-500 tracking-tight">
            Arca
          </div>
        </motion.div>
      </div>

      {/* Right: Search, Theme Toggle & Profile */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="search"
            placeholder={`Search ${text}...`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-56 focus:w-72 h-9 pl-9 pr-3 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-200 dark:focus:ring-blue-500/30 text-slate-900 dark:text-slate-100 outline-none transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Theme Toggle */}
        <motion.button
          whileTap={{ scale: 0.85, rotate: 20 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 transition-colors"
          title="Toggle Theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {/* Profile */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => setShowProfile(!showProfile)}
            className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-blue-500/30 ring-2 ring-white dark:ring-slate-900 transition-transform"
          >
            {(userData?.displayName?.trim()?.[0] || userData?.email?.[0] || "U").toUpperCase()}
          </motion.button>

          <ProfilePopup
            isOpen={showProfile}
            onClose={() => setShowProfile(false)}
            userData={userData}
            onSignOut={signout}
          />
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;