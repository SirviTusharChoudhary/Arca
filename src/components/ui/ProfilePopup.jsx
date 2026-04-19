const ProfilePopup = ({ isOpen, onClose, userData, onSignOut }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* 1. Backdrop for closing */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* 2. The Popup Card */}
      <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-right">
        {/* User Identity Section */}
        <div className="p-4 flex flex-col items-center gap-0.5">
          {/* Display Name - Increased to text-sm for clarity */}
          <p className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate w-full text-center px-2">
            {userData?.displayName}
          </p>

          {/* Handle - Increased to text-xs */}
          <p className="text-xs text-gray-500 dark:text-slate-400 font-medium lowercase truncate w-full text-center px-2">
            @{userData?.username}
          </p>
        </div>

        {/* 3. Divider */}
        <div className="border-t border-gray-100 dark:border-slate-800 w-full" />

        {/* Action Section */}
        <div className="p-1.5">
          <button
            onClick={onSignOut}
            className="w-full py-2.5 text-xs font-bold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePopup;
