import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, RotateCcw, Clock } from 'lucide-react';

const FilterSidebar = ({ isOpen, onClose, filters, setFilters }) => {
  const priorities = ['Urgent', 'High', 'Medium', 'Low'];
  const statuses = ['To Do', 'In Progress', 'Done'];
  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Deadline (Closest)', value: 'deadlineAsc' },
    { label: 'Deadline (Furthest)', value: 'deadlineDesc' },
  ];

  const toggleFilter = (type, value) => {
    setFilters(prev => {
      const current = prev[type] || [];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [type]: next };
    });
  };

  const setSort = (value) => {
    setFilters(prev => ({ ...prev, sortBy: value }));
  };

  const clearFilters = () => {
    setFilters({ priority: [], status: [], sortBy: 'newest', overdueOnly: false });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-[2px] z-[60]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl z-[70] border-l border-gray-200 dark:border-slate-800 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-blue-600" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Filters & Sort
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors text-gray-500 dark:text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Overdue Toggle */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Urgency
                </h3>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, overdueOnly: !prev.overdueOnly }))}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold border transition-all ${
                    filters.overdueOnly
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400'
                      : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-red-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock size={16} className={filters.overdueOnly ? 'text-red-600' : 'text-gray-400'} />
                    <span>Overdue Only</span>
                  </div>
                  <div className={`w-9 h-5 rounded-full relative transition-colors ${filters.overdueOnly ? 'bg-red-600' : 'bg-gray-300 dark:bg-slate-600'}`}>
                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${filters.overdueOnly ? 'translate-x-4' : ''}`} />
                  </div>
                </button>
              </div>

              {/* Sorting Section */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Sort By
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {sortOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSort(opt.value)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                        filters.sortBy === opt.value
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-blue-400'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${filters.sortBy === opt.value ? 'border-white' : 'border-gray-300 dark:border-slate-600'}`}>
                        {filters.sortBy === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Filter Priority
                </h3>
                <div className="flex flex-wrap gap-2">
                  {priorities.map(p => (
                    <button
                      key={p}
                      onClick={() => toggleFilter('priority', p)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                        filters.priority?.includes(p)
                          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                          : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-blue-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Filter Status
                </h3>
                <div className="flex flex-col gap-2">
                  {statuses.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleFilter('status', s)}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                        filters.status?.includes(s)
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                          : 'bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-800 text-gray-700 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                      }`}
                    >
                      {s}
                      {filters.status?.includes(s) && (
                        <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
              <button
                onClick={clearFilters}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <RotateCcw size={14} />
                Reset Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterSidebar;
