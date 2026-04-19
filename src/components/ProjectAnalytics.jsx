import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { 
  Trophy, 
  Target, 
  AlertCircle, 
  Clock,
  LayoutDashboard,
  Users
} from "lucide-react";

const ProjectAnalytics = ({ tasks, usersMap }) => {
  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "Done").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const todo = tasks.filter((t) => t.status === "To Do" || !t.status).length;
    const now = Date.now();
    const overdue = tasks.filter(
      (t) => t.deadline && new Date(t.deadline).getTime() < now && t.status !== "Done"
    ).length;

    return { total, done, inProgress, todo, overdue };
  }, [tasks]);

  const statusData = [
    { name: "Done", value: stats.done, color: "#10b981" },
    { name: "In Progress", value: stats.inProgress, color: "#3b82f6" },
    { name: "To Do", value: stats.todo, color: "#94a3b8" },
  ];

  const priorityData = useMemo(() => {
    const counts = { Urgent: 0, High: 0, Medium: 0, Low: 0 };
    tasks.forEach((t) => {
      if (counts[t.priority] !== undefined) counts[t.priority]++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tasks]);

  const workloadData = useMemo(() => {
    const userCounts = {};
    tasks.forEach((t) => {
      const name = usersMap?.[t.assignedTo]?.displayName || usersMap?.[t.assignedTo]?.name || "Unassigned";
      userCounts[name] = (userCounts[name] || 0) + 1;
    });
    return Object.entries(userCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [tasks, usersMap]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl">
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-1">
            {payload[0].name}
          </p>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {payload[0].value} Tasks
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Tasks", val: stats.total, icon: LayoutDashboard, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Completed", val: stats.done, icon: Trophy, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Overdue", val: stats.overdue, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
          { label: "Efficiency", val: stats.total ? Math.round((stats.done / stats.total) * 100) + "%" : "0%", icon: Target, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
        ].map((item, id) => (
          <div key={id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${item.bg} ${item.color}`}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">{item.label}</p>
              <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{item.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Donut */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Clock size={16} className="text-blue-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Status Distribution</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {statusData.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">{s.name}</span>
                </div>
                <span className="text-slate-900 dark:text-slate-100 font-bold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle size={16} className="text-red-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Priority Breakdown</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                <Bar 
                  dataKey="value" 
                  radius={[6, 6, 0, 0]} 
                  barSize={40}
                >
                  {priorityData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name === 'Urgent' ? '#ef4444' : entry.name === 'High' ? '#f97316' : entry.name === 'Medium' ? '#3b82f6' : '#10b981'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workload Bar Chart */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Users size={16} className="text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Team Workload Distribution</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#94a3b8" opacity={0.2} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                  width={120}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalytics;
