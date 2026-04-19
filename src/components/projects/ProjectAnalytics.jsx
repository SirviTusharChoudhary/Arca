import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import {
  Trophy, Target, AlertCircle, Clock,
  LayoutDashboard, Users, TrendingUp, CheckCircle2,
} from "lucide-react";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

/* ── Shared tooltip ── */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-slate-800 px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg text-xs">
        <p className="font-bold text-slate-900 dark:text-slate-100 mb-0.5">{payload[0].name}</p>
        <p className="text-blue-600 dark:text-blue-400 font-semibold">{payload[0].value} tasks</p>
      </div>
    );
  }
  return null;
};

/* ── Section card wrapper ── */
const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-md ${className}`}>
    {children}
  </div>
);

/* ── Section header ── */
const CardHeader = ({ icon, title }) => (
  <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-slate-800">
    {icon}
    <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest">{title}</h3>
  </div>
);

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

  const efficiency = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;

  const statusData = [
    { name: "Done", value: stats.done, color: "#10b981" },
    { name: "In Progress", value: stats.inProgress, color: "#3b82f6" },
    { name: "To Do", value: stats.todo, color: "#cbd5e1" },
  ];

  const priorityData = useMemo(() => {
    const counts = { Urgent: 0, High: 0, Medium: 0, Low: 0 };
    tasks.forEach((t) => { if (counts[t.priority] !== undefined) counts[t.priority]++; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tasks]);

  const PRIORITY_COLORS = { Urgent: "#ef4444", High: "#f97316", Medium: "#eab308", Low: "#10b981" };

  const workloadData = useMemo(() => {
    const userCounts = {};
    tasks.forEach((t) => {
      const name =
        usersMap?.[t.assignedTo]?.displayName?.split(" ")[0] ||
        usersMap?.[t.assignedTo]?.username ||
        "Unassigned";
      userCounts[name] = (userCounts[name] || 0) + 1;
    });
    return Object.entries(userCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [tasks, usersMap]);

  const maxWorkload = workloadData[0]?.value || 1;

  const STAT_CARDS = [
    { label: "Total Tasks", val: stats.total, icon: <LayoutDashboard size={18} />, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/40" },
    { label: "Completed", val: stats.done, icon: <Trophy size={18} />, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/40" },
    { label: "Overdue", val: stats.overdue, icon: <AlertCircle size={18} />, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/40" },
    { label: "Efficiency", val: `${efficiency}%`, icon: <Target size={18} />, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-900/40" },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-5"
    >
      {/* ── Stat cards ── */}
      <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAT_CARDS.map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-md p-4 flex items-center gap-3 transition-all"
          >
            <div className={`p-2.5 rounded-md border ${item.bg} ${item.color}`}>
              {item.icon}
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-gray-500 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">{item.label}</p>
              <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{item.val}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Efficiency progress bar ── */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardHeader icon={<TrendingUp size={14} className="text-blue-600" />} title="Overall Progress" />
          <div className="px-5 py-4 flex items-center gap-4">
            <div className="flex-1 bg-gray-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${efficiency}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              />
            </div>
            <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 shrink-0 w-12 text-right">{efficiency}%</span>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-500 shrink-0">
              <CheckCircle2 size={13} className="text-emerald-500" />
              {stats.done}/{stats.total} done
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ── Charts row ── */}
      <motion.div variants={stagger} className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Donut — Status */}
        <motion.div variants={fadeUp}>
          <Card className="h-full">
            <CardHeader icon={<Clock size={14} className="text-blue-600" />} title="Status Split" />
            <div className="px-5 py-4">
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={52} outerRadius={72} paddingAngle={6} dataKey="value">
                      {statusData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {statusData.map((s, i) => {
                  const pct = stats.total ? Math.round((s.value / stats.total) * 100) : 0;
                  return (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="text-gray-600 dark:text-slate-400 font-medium">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 dark:text-slate-600">{pct}%</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 w-4 text-right">{s.value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Bar — Priority */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader icon={<AlertCircle size={14} className="text-red-500" />} title="Priority Breakdown" />
            <div className="px-5 py-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData} barCategoryGap="35%">
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" className="dark:[&>line]:stroke-slate-700" opacity={0.8} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }}
                      dy={8}
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59,130,246,0.06)" }} />
                    <Bar dataKey="value" radius={[3, 3, 0, 0]} barSize={36}>
                      {priorityData.map((entry, i) => (
                        <Cell key={i} fill={PRIORITY_COLORS[entry.name] || "#3b82f6"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Priority legend with counts */}
              <div className="flex items-center justify-center gap-4 mt-2">
                {priorityData.map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: PRIORITY_COLORS[p.name] }} />
                    <span className="text-gray-500 dark:text-slate-500">{p.name}</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* ── Workload — horizontal progress bars (Jira style) ── */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardHeader icon={<Users size={14} className="text-blue-600" />} title="Team Workload" />
          <div className="px-5 py-4 space-y-3">
            {workloadData.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-slate-600 text-center py-4">No assignee data yet</p>
            ) : (
              workloadData.map((u, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {u.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{u.name}</span>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-slate-600 ml-2 shrink-0">{u.value} tasks</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(u.value / maxWorkload) * 100}%` }}
                        transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 + i * 0.07 }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ProjectAnalytics;
