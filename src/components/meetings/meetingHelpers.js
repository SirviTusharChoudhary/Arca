/* ─── Meeting Helpers ─────────────────────────────────── */
export function formatDate(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((day - today) / 86400000);
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diff === 0) return `Today at ${time}`;
  if (diff === 1) return `Tomorrow at ${time}`;
  if (diff === -1) return `Yesterday at ${time}`;
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }) + ` at ${time}`;
}

export function formatCountdown(scheduledAt) {
  const start = scheduledAt.toDate ? scheduledAt.toDate() : new Date(scheduledAt);
  const diff = Math.max(0, start - Date.now());
  if (diff === 0) return null;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
