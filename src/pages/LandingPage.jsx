import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  Box, LogIn, Zap, Sun, Moon, ArrowRight,
  CheckCircle2, Users, BarChart2, ShieldCheck,
  GitBranch, Bell, Clock, Star, Flame, AlertTriangle,
  Rocket, TrendingUp, Shield
} from 'lucide-react';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import { useTheme } from '../context/ThemeContext';

/* ── Data ──────────────────────────────────────── */
const FEATURES = [
  { icon: <CheckCircle2 size={20} className="text-blue-600" />, title: "Task Management", desc: "Create, assign & track tasks from backlog to shipped." },
  { icon: <Users size={20} className="text-violet-600" />, title: "Team Collaboration", desc: "Invite teammates, manage roles, keep everyone aligned." },
  { icon: <BarChart2 size={20} className="text-emerald-600" />, title: "Live Analytics", desc: "Real-time dashboards, workload heatmaps & deadline risk." },
  { icon: <ShieldCheck size={20} className="text-orange-500" />, title: "Access Control", desc: "Role gating, request-based onboarding, admin-only ops." },
  { icon: <GitBranch size={20} className="text-pink-600" />, title: "Priority Lanes", desc: "Urgent · High · Medium · Low — color-coded & visible." },
  { icon: <Bell size={20} className="text-amber-500" />, title: "Deadline Tracking", desc: "Smart overdue detection with live badge updates." },
];

const STEPS = [
  { step: "01", icon: <Rocket size={28} />, label: "Create a project", desc: "Set up your workspace in seconds — name it, pick a type, go." },
  { step: "02", icon: <Users size={28} />, label: "Invite your team", desc: "Share your project link. Admin reviews and approves requests." },
  { step: "03", icon: <Zap size={28} />, label: "Ship together", desc: "Assign tasks, track progress, and hit every deadline as a unit." },
];

const TICKER = [
  { label: "Sprint Planning", icon: <Rocket size={13} />, color: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800" },
  { label: "Bug Triage", icon: <Flame size={13} />, color: "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800" },
  { label: "Feature Roadmap", icon: <TrendingUp size={13} />, color: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800" },
  { label: "Code Reviews", icon: <GitBranch size={13} />, color: "text-violet-600 bg-violet-50 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800" },
  { label: "Urgent Tasks", icon: <AlertTriangle size={13} />, color: "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800" },
  { label: "Team OKRs", icon: <Shield size={13} />, color: "text-pink-600 bg-pink-50 border-pink-200 dark:bg-pink-950/60 dark:text-pink-300 dark:border-pink-800" },
  { label: "Deadline Alerts", icon: <Clock size={13} />, color: "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800" },
  { label: "Progress Reports", icon: <BarChart2 size={13} />, color: "text-sky-600 bg-sky-50 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800" },
];

const MOCK_TASKS = [
  { priority: "Urgent", title: "Fix critical auth token expiry bug", status: "In Progress", user: "TK", time: "2h ago" },
  { priority: "High", title: "Implement CSV export for analytics", status: "To Do", user: "SR", time: "5h ago" },
  { priority: "Medium", title: "Update onboarding copy & illustrations", status: "Done", user: "AM", time: "1d ago" },
  { priority: "Low", title: "Refactor legacy API utility functions", status: "To Do", user: "JP", time: "2d ago" },
];

const STATS = [
  { value: "10k+", label: "Tasks shipped" },
  { value: "500+", label: "Teams onboard" },
  { value: "99.9%", label: "Uptime" },
  { value: "< 3s", label: "Load time" },
];

/* ── Animation variants ─────────────────────────── */
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: 'easeOut' } },
};

/* ── Priority pill helper ───────────────────────── */
const PriorityBadge = ({ p }) => {
  const cls = p === 'Urgent' ? 'bg-red-100 text-red-600 border-red-300 dark:bg-red-950/80 dark:text-red-300 dark:border-red-700'
    : p === 'High' ? 'bg-orange-100 text-orange-600 border-orange-300 dark:bg-orange-950/80 dark:text-orange-300 dark:border-orange-700'
    : p === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/60 dark:text-yellow-300 dark:border-yellow-600'
    : 'bg-emerald-50 text-emerald-600 border-emerald-300 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600';
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${cls}`}>{p}</span>;
};

const StatusBadge = ({ s }) => {
  const cls = s === 'In Progress' ? 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-600'
    : s === 'Done' ? 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-600'
    : 'bg-slate-100 text-slate-500 border-slate-300 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600';
  return <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${cls}`}>{s}</span>;
};

/* ── Floating card (background decoration) ─────── */
const FloatingCard = ({ delay, x, y, rotate, task }) => (
  <motion.div
    className="absolute hidden lg:flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md px-3 py-2 shadow-lg text-xs font-medium text-slate-700 dark:text-slate-300 select-none pointer-events-none"
    style={{ left: x, top: y, rotate }}
    animate={{ y: [0, -12, 0], rotate: [rotate, rotate + 2, rotate] }}
    transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
  >
    <PriorityBadge p={task.priority} />
    <span className="truncate max-w-[140px]">{task.title}</span>
  </motion.div>
);

/* ── Ticker strip ───────────────────────────────── */
const Ticker = () => {
  const repeated = [...TICKER, ...TICKER, ...TICKER];
  return (
    <div className="overflow-hidden py-5 border-y border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 relative z-10">
      <motion.div
        className="flex gap-3 whitespace-nowrap"
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{ width: 'max-content' }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-[11px] font-bold border ${item.color}`}
          >
            {item.icon}
            {item.label}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

/* ── Main component ─────────────────────────────── */
const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [modalMode, setModalMode] = useState('login');
  const { theme, toggleTheme } = useTheme();
  const openAuth = (mode) => { setModalMode(mode); setShowAuth(true); };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900/40 overflow-x-hidden transition-colors duration-300">

      {/* ── Ambient blobs ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute w-[700px] h-[700px] bg-blue-400/8 dark:bg-blue-600/8 rounded-full blur-[160px]"
          animate={{ x: [0, 80, 0], y: [0, -50, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-15%', right: '-15%' }}
        />
        <motion.div className="absolute w-[500px] h-[500px] bg-violet-400/8 dark:bg-violet-600/8 rounded-full blur-[140px]"
          animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
          style={{ bottom: '5%', left: '-10%' }}
        />
      </div>

      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-1.5">
            <Box className="w-7 h-7 text-blue-600 dark:text-blue-500" strokeWidth={1.5} />
            <span className="text-2xl text-blue-600 dark:text-blue-500 font-bold tracking-tighter">Arca</span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <motion.button whileTap={{ scale: 0.8, rotate: 30 }} onClick={toggleTheme}
              className="w-8 h-8 rounded-md flex items-center justify-center bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 transition-colors">
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            </motion.button>
            <button onClick={() => openAuth('login')}
              className="text-sm font-semibold text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 px-3 py-2">
              <LogIn size={14} /> Log in
            </button>
            <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
              onClick={() => openAuth('signup')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-[3px] transition-colors shadow-sm shadow-blue-600/30">
              Get started free
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section className="relative z-10 pt-20 pb-10 px-6 text-center overflow-hidden">

        {/* Floating decorative task cards */}
        <FloatingCard delay={0} x="3%" y="15%" rotate={-6} task={MOCK_TASKS[0]} />
        <FloatingCard delay={1.2} x="76%" y="20%" rotate={5} task={MOCK_TASKS[2]} />
        <FloatingCard delay={0.6} x="80%" y="55%" rotate={-4} task={MOCK_TASKS[3]} />
        <FloatingCard delay={1.8} x="2%" y="60%" rotate={4} task={MOCK_TASKS[1]} />

        <motion.div variants={stagger} initial="hidden" animate="visible"
          className="max-w-4xl mx-auto flex flex-col items-center">

          {/* Badge */}
          <motion.div variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-[11px] font-extrabold tracking-[0.16em] uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/60 rounded-[3px]">
            <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
            Built for modern engineering teams
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp}
            className="text-[64px] md:text-[80px] leading-[1.04] font-extrabold tracking-tight mb-5 text-slate-950 dark:text-white">
            Move fast.<br />
            <span className="text-blue-600 dark:text-blue-500">Ship together.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p variants={fadeUp} className="text-xl text-gray-500 dark:text-slate-400 mb-8 max-w-xl leading-relaxed">
            Arca is the project management platform built for teams that ship. Plan sprints, assign work, hit deadlines — without the bloat.
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeUp} className="flex items-center gap-4 flex-wrap justify-center mb-8">
            <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
              onClick={() => openAuth('signup')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold px-8 py-3.5 rounded-[3px] shadow-lg shadow-blue-500/30 transition-all">
              <Zap size={18} strokeWidth={2.5} /> Start for free
            </motion.button>
            <button onClick={() => openAuth('login')}
              className="flex items-center gap-2 text-base font-semibold text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Sign in <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Stars */}
          <motion.div variants={fadeUp} className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-slate-600">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
            <span className="ml-1">Loved by developers who ship</span>
          </motion.div>
        </motion.div>

        {/* ── Mock browser UI ── */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.65, ease: 'easeOut' }}
          className="relative z-10 max-w-4xl mx-auto mt-16 border border-gray-200 dark:border-slate-800 rounded-md overflow-hidden shadow-2xl shadow-slate-900/10 dark:shadow-slate-950/70"
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
            <div className="w-3 h-3 bg-red-400 rounded-full" />
            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
            <div className="w-3 h-3 bg-green-400 rounded-full" />
            <div className="flex-1 ml-3 h-6 bg-white dark:bg-slate-700 rounded-sm text-[11px] text-gray-400 dark:text-slate-500 flex items-center px-3 gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              app.arca.io/project/acme-sprint-4
            </div>
            <div className="flex gap-1 ml-2">
              {['All Tasks','Starred','Analytics'].map((t,i) => (
                <span key={i} className={`text-[10px] px-2 py-0.5 rounded-sm font-medium ${i===0 ? 'bg-blue-600 text-white' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600'}`}>{t}</span>
              ))}
            </div>
          </div>
          {/* Task table header */}
          <div className="grid grid-cols-[90px_1fr_80px_90px_60px] gap-2 px-5 py-2 bg-gray-50 dark:bg-slate-800/60 border-b border-gray-100 dark:border-slate-800 text-[10px] font-extrabold tracking-widest uppercase text-gray-400 dark:text-slate-600">
            <span>Priority</span><span>Task</span><span>Assignee</span><span>Status</span><span>Date</span>
          </div>
          {/* Task rows */}
          {MOCK_TASKS.map((row, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 + i * 0.08 }}
              className="grid grid-cols-[90px_1fr_80px_90px_60px] gap-2 items-center px-5 py-3.5 border-b border-gray-100 dark:border-slate-800/70 last:border-b-0 hover:bg-blue-50/30 dark:hover:bg-slate-800/30 transition-colors">
              <PriorityBadge p={row.priority} />
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate text-left">{row.title}</p>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white shrink-0">{row.user}</div>
              </div>
              <StatusBadge s={row.status} />
              <span className="text-[10px] text-gray-400 dark:text-slate-600">{row.time}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── TICKER ── */}
      <Ticker />

      {/* ── FEATURES ── */}
      <section className="relative z-10 py-20 px-6 bg-gray-50 dark:bg-slate-900/50 border-y border-gray-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <p className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400 mb-3">Everything you need</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white">Built for teams that ship</h2>
            <p className="mt-3 text-lg text-gray-500 dark:text-slate-400 max-w-lg mx-auto">Every feature removes friction and keeps your team in flow.</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(0,0,0,0.07)' }}
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-md p-6 transition-all">
                <div className="w-10 h-10 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── "What teams track" fun animated block ── */}
      <section className="relative z-10 py-16 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center text-[11px] font-extrabold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400 mb-10">
            What teams track in Arca
          </motion.p>
          {/* Staggered animated floating badges grid */}
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3">
            {[
              { t: "🔥 P0 Incident", c: "bg-red-100 text-red-700 border-red-300 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800" },
              { t: "⚡ Sprint Goal", c: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800" },
              { t: "📦 Release v2.0", c: "bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-950/70 dark:text-violet-300 dark:border-violet-800" },
              { t: "🐛 Bug Report", c: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950/70 dark:text-orange-300 dark:border-orange-800" },
              { t: "🎨 UI Polish", c: "bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-950/70 dark:text-pink-300 dark:border-pink-800" },
              { t: "📊 Q2 Metrics", c: "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800" },
              { t: "🔐 Auth Refactor", c: "bg-sky-100 text-sky-700 border-sky-300 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-800" },
              { t: "🚀 Deploy Prod", c: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800" },
              { t: "✅ Code Review", c: "bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-950/70 dark:text-teal-300 dark:border-teal-800" },
              { t: "📝 Docs Update", c: "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700" },
              { t: "🧪 Test Coverage", c: "bg-lime-100 text-lime-700 border-lime-300 dark:bg-lime-950/70 dark:text-lime-300 dark:border-lime-800" },
              { t: "🔧 CI Pipeline", c: "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800" },
            ].map((b, i) => (
              <motion.span
                key={i}
                variants={{ hidden: { opacity: 0, scale: 0.7 }, visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20, delay: i * 0.05 } } }}
                whileHover={{ scale: 1.08, y: -3 }}
                className={`inline-flex items-center px-3.5 py-2 rounded-[3px] text-sm font-bold border cursor-default select-none transition-all ${b.c}`}
              >
                {b.t}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SECOND TICKER (reverse direction) ── */}
      <div className="overflow-hidden py-4 border-y border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/40 relative z-10">
        <motion.div
          className="flex gap-3 whitespace-nowrap"
          animate={{ x: ['-33.33%', '0%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ width: 'max-content' }}
        >
          {[...TICKER].reverse().concat([...TICKER].reverse(), [...TICKER].reverse()).map((item, i) => (
            <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-[11px] font-bold border ${item.color}`}>
              {item.icon}{item.label}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
            <p className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400 mb-3">Simple by design</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white">Up in minutes, shipping in hours</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[18%] right-[18%] h-[1px] bg-gradient-to-r from-transparent via-blue-400 dark:via-blue-600 to-transparent" />
            {STEPS.map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="flex flex-col items-center text-center relative">
                <motion.div whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }} transition={{ duration: 0.4 }}
                  className="w-20 h-20 bg-blue-600 text-white rounded-md flex flex-col items-center justify-center mb-5 shadow-lg shadow-blue-500/30 z-10 gap-1">
                  {s.icon}
                  <span className="text-[10px] font-black tracking-widest opacity-70">{s.step}</span>
                </motion.div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1.5">{s.label}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed max-w-[200px]">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative z-10 py-20 px-6 bg-blue-600 dark:bg-blue-700 overflow-hidden">
        <motion.div className="absolute inset-0 opacity-[0.07]"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{ backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 40%)', backgroundSize: '28px 28px' }}
        />
        {/* Floating emoji on CTA */}
        {['🚀','⚡','✅','🎯','🔥'].map((e, i) => (
          <motion.span key={i} className="absolute text-2xl opacity-20 pointer-events-none select-none"
            style={{ left: `${10 + i * 20}%`, top: `${20 + (i % 2) * 40}%` }}
            animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          >{e}</motion.span>
        ))}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}
          className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">Your next sprint starts here.</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-lg mx-auto">Join teams who trust Arca to keep them aligned and on schedule.</p>
          <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
            onClick={() => openAuth('signup')}
            className="bg-white text-blue-600 font-bold text-base px-10 py-3.5 rounded-[3px] hover:bg-blue-50 transition-colors shadow-lg flex items-center gap-2 mx-auto">
            <Zap size={18} strokeWidth={2.5} /> Get started — it's free
          </motion.button>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-gray-200 dark:border-slate-800 py-8 px-6 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Box className="w-5 h-5 text-blue-600 dark:text-blue-500" strokeWidth={1.5} />
            <span className="font-bold text-blue-600 dark:text-blue-500 tracking-tighter">Arca</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-600">© 2026 Arca. Built for teams who build things.</p>
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-600">
            <Clock size={12} /> Real-time · Secure · Fast
          </div>
        </div>
      </footer>

      {/* ── Auth modal ── */}
      <AnimatePresence>
        {showAuth && (modalMode === 'login'
          ? <Login swap={() => setModalMode('signup')} onClose={() => setShowAuth(false)} />
          : <Signup swap={() => setModalMode('login')} onClose={() => setShowAuth(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;