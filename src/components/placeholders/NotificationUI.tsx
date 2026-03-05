import { useState, useEffect } from "react";
import React from "react";
import {
  motion, AnimatePresence,
} from "framer-motion";
import {
  Bell, AlertCircle, CheckCircle2, X, Download,
  Battery, Shield, Star, Flame, Globe,
  RefreshCw, Camera, MapPin,
  ChevronDown,
  Sparkles,
} from "lucide-react";

/* ─── SPRING CONFIGS ─────────────────────────────────────────────── */
const spring = { type: "spring", stiffness: 400, damping: 28 };
const softSpring = { type: "spring", stiffness: 260, damping: 24 };

/* ═══════════════════════════════════════════════════════════════════
   1. GLASSMORPHIC AURORA  — frosted blur with animated gradient blob
══════════════════════════════════════════════════════════════════════ */
function GlassNotification({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-5 shadow-[0_8px_32px_rgba(99,102,241,0.25)]">
      {/* animated blob */}
      <motion.div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-indigo-500/30 blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-violet-500/20 blur-3xl"
        animate={{ scale: [1, 1.15, 1], x: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <div className="relative flex items-center gap-4">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.4 }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/40"
        >
          <Sparkles size={18} className="text-white" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="font-['Crimson_Pro'] text-[17px] font-semibold text-white leading-tight">
            AI Insights just unlocked
          </p>
          <p className="mt-0.5 text-xs text-white/60 font-['Space_Mono']">
            Your workspace is now augmented
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur hover:bg-white/25 transition-colors"
          >
            Explore
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onDismiss}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/50 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X size={13} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   2. NEON TERMINAL — scanline, glitch pulse, monospace brutalism
══════════════════════════════════════════════════════════════════════ */
function NeonNotification({ onDismiss }: { onDismiss: () => void }) {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#060608] border border-[#ff2d78]/40 p-4 shadow-[0_0_30px_rgba(255,45,120,0.2)]">
      {/* scan line */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff2d78] to-transparent"
        animate={{ y: [0, 80, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <div className="flex items-center gap-3">
        <motion.div
          animate={glitch ? { x: [-2, 2, -1, 0], skewX: [-2, 2, 0] } : {}}
          transition={{ duration: 0.12 }}
          className="text-[#ff2d78]"
          style={{ filter: glitch ? "drop-shadow(2px 0 #00ffff)" : "drop-shadow(0 0 6px #ff2d78)" }}
        >
          <AlertCircle size={22} />
        </motion.div>
        <div className="flex-1 min-w-0">
          <motion.p
            animate={glitch ? { x: [0, 3, -2, 0] } : {}}
            className="font-['Space_Mono'] text-sm font-bold text-[#ff2d78]"
            style={{
              textShadow: glitch ? "2px 0 #00ffff, -1px 0 #ff2d78" : "0 0 8px rgba(255,45,120,0.8)",
            }}
          >
            {glitch ? "⚠ SYST3M_BR34CH" : "⚠ SYSTEM_BREACH"}
          </motion.p>
          <p className="font-['Space_Mono'] text-[10px] text-[#ff2d78]/50 mt-0.5 truncate">
            ORIGIN::DEVICE_ID_7743 · {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <motion.button
            whileHover={{ boxShadow: "0 0 16px rgba(255,45,120,0.6)" }}
            whileTap={{ scale: 0.95 }}
            className="border border-[#ff2d78]/60 bg-transparent px-3 py-1.5 font-['Space_Mono'] text-[10px] text-[#ff2d78] rounded hover:bg-[#ff2d78]/10 transition-colors tracking-widest"
          >
            REVIEW
          </motion.button>
          <button onClick={onDismiss} className="text-[#ff2d78]/40 hover:text-[#ff2d78] transition-colors">
            <X size={15} />
          </button>
        </div>
      </div>
      {/* corner brackets */}
      <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-[#ff2d78]/40" />
      <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-[#ff2d78]/40" />
      <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-[#ff2d78]/40" />
      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-[#ff2d78]/40" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   3. FLOATING PILL — dark pill that pops up with live interaction
══════════════════════════════════════════════════════════════════════ */
function PillNotification({ onDismiss }: { onDismiss: () => void }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(24);

  return (
    <div className="flex justify-center">
      <motion.div
        layout
        className="inline-flex items-center gap-3 rounded-full bg-zinc-900 px-4 py-2.5 shadow-2xl border border-white/8"
      >
        <motion.div
          animate={{ rotate: liked ? [0, -15, 15, -10, 0] : 0 }}
          transition={{ duration: 0.5 }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500"
        >
          <Star size={14} className="text-white fill-white" />
        </motion.div>
        <p className="font-['Crimson_Pro'] text-sm text-white/90 whitespace-nowrap">
          <span className="font-semibold text-amber-400">Alex Rivera</span> starred your repo
        </p>
        <div className="w-px h-4 bg-white/10" />
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => { setLiked(!liked); setCount(c => liked ? c - 1 : c + 1); }}
          className="flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors"
          style={{ background: liked ? "rgba(239,68,68,0.15)" : "transparent" }}
        >
          <motion.span
            animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Flame size={13} className={liked ? "text-red-400 fill-red-400" : "text-white/40"} />
          </motion.span>
          <motion.span
            key={count}
            initial={{ y: liked ? -8 : 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-['Space_Mono'] text-[10px] text-white/50"
          >
            {count}
          </motion.span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
          onClick={onDismiss}
          className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/40 hover:text-white transition-colors"
        >
          <X size={10} />
        </motion.button>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   4. ANIMATED PROGRESS — dark card, live fill, state transition
══════════════════════════════════════════════════════════════════════ */
function ProgressCard({ onDismiss }: { onDismiss: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setDone(true); return 100; }
        return Math.min(p + 1.5, 100);
      });
    }, 45);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl bg-zinc-900 border border-white/8 p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={done ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.4 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: done
                ? "linear-gradient(135deg,#10b981,#059669)"
                : "linear-gradient(135deg,#3b82f6,#6366f1)"
            }}
          >
            <AnimatePresence mode="wait">
              {done
                ? <motion.div key="check" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={spring}><CheckCircle2 size={18} className="text-white" /></motion.div>
                : <motion.div key="dl" initial={{ scale: 0 }} animate={{ scale: 1 }}><Download size={18} className="text-white" /></motion.div>
              }
            </AnimatePresence>
          </motion.div>
          <div>
            <AnimatePresence mode="wait">
              <motion.p
                key={done ? "done" : "loading"}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="font-['Crimson_Pro'] text-base font-semibold text-white"
              >
                {done ? "Download complete!" : "Fetching design assets…"}
              </motion.p>
            </AnimatePresence>
            <p className="font-['Space_Mono'] text-[10px] text-white/40 mt-0.5">
              design-system-v4.zip · {done ? "84 MB" : `${(progress * 0.84).toFixed(1)} / 84 MB`}
            </p>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onDismiss}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/8 text-white/40 hover:text-white"
        ><X size={13} /></motion.button>
      </div>

      {/* track */}
      <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: done ? "linear-gradient(90deg,#10b981,#34d399)" : "linear-gradient(90deg,#3b82f6,#8b5cf6)" }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.05 }}
        />
      </div>
      <div className="mt-2 flex justify-between">
        <motion.span
          key={Math.round(progress)}
          className="font-['Space_Mono'] text-[11px] font-bold"
          style={{ color: done ? "#10b981" : "#3b82f6" }}
        >
          {Math.min(Math.round(progress), 100)}%
        </motion.span>
        <span className="font-['Space_Mono'] text-[11px] text-white/30">
          {done ? "✓ saved to Downloads" : `~${Math.max(0, Math.round((100 - progress) / 2.2))}s left`}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   5. EXPANDABLE SOCIAL CARD — stacked avatars, expand on click
══════════════════════════════════════════════════════════════════════ */
const AVATARS = [
  { color: "from-amber-400 to-orange-500", name: "Jamie", emoji: "🔥" },
  { color: "from-blue-400 to-indigo-500", name: "Priya", emoji: "❤️" },
  { color: "from-emerald-400 to-teal-500", name: "Sam",   emoji: "👏" },
  { color: "from-pink-400 to-rose-500",   name: "Chris",  emoji: "⭐" },
];

function AvatarNotification({ onDismiss }: { onDismiss: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      layout
      onClick={() => setOpen(o => !o)}
      className="cursor-pointer rounded-2xl bg-white border border-black/6 shadow-md hover:shadow-lg transition-shadow p-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex shrink-0">
          {AVATARS.map((a, i) => (
            <motion.div
              key={a.name}
              style={{ marginLeft: i ? -10 : 0, zIndex: AVATARS.length - i }}
              whileHover={{ y: -4, zIndex: 10 }}
              transition={spring}
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${a.color} border-2 border-white font-['Crimson_Pro'] text-sm font-bold text-white shadow-sm`}
            >
              {a.name[0]}
            </motion.div>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-['Crimson_Pro'] text-[15px] font-semibold text-slate-800 leading-tight">
            4 people reacted to your post
          </p>
          <p className="text-xs text-slate-400 mt-0.5">🔥 ❤️ 👏 ⭐ · tap to {open ? "collapse" : "expand"}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={spring}>
            <ChevronDown size={16} className="text-slate-400" />
          </motion.div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); onDismiss(); }}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          ><X size={11} /></motion.button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={softSpring}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              {AVATARS.map((a, i) => (
                <motion.div
                  key={a.name}
                  initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  transition={{ ...softSpring, delay: i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${a.color} font-['Crimson_Pro'] text-xs font-bold text-white`}>
                    {a.name[0]}
                  </div>
                  <span className="font-['Crimson_Pro'] text-sm text-slate-700">{a.name}</span>
                  <span className="ml-auto text-base">{a.emoji}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   6. CALENDAR EVENT — gradient date spine, stateful RSVP button
══════════════════════════════════════════════════════════════════════ */
function CalendarCard({ onDismiss }: { onDismiss: () => void }) {
  const [rsvp, setRsvp] = useState<null | "yes" | "no">(null);
  return (
    <div className="overflow-hidden rounded-2xl shadow-xl flex">
      {/* date spine */}
      <div className="flex w-16 shrink-0 flex-col items-center justify-center bg-gradient-to-b from-violet-600 to-indigo-700 py-5 gap-0.5">
        <span className="font-['Space_Mono'] text-[10px] text-violet-200 uppercase tracking-widest">MAR</span>
        <span className="font-['Bebas_Neue'] text-4xl text-white leading-none">18</span>
        <span className="font-['Space_Mono'] text-[10px] text-violet-200">MON</span>
      </div>
      {/* content */}
      <div className="flex-1 bg-zinc-900 border border-white/8 border-l-0 p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-['Crimson_Pro'] text-base font-semibold text-white leading-tight">
              Design Sprint Kickoff
            </p>
            <p className="font-['Space_Mono'] text-[10px] text-white/40 mt-0.5">2:30 – 4:00 PM · Room 3B</p>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onDismiss}
            className="text-white/30 hover:text-white transition-colors"
          ><X size={14} /></motion.button>
        </div>
        {/* mini avatars */}
        <div className="flex items-center gap-2 mb-4">
          {["from-amber-400 to-orange-500","from-blue-400 to-indigo-500","from-pink-400 to-rose-500"].map((g, i) => (
            <div key={i} style={{ marginLeft: i ? -8 : 0 }}
              className={`h-6 w-6 rounded-full bg-gradient-to-br ${g} border-2 border-zinc-900`}
            />
          ))}
          <span className="font-['Space_Mono'] text-[10px] text-white/30 ml-1">+5 attending</span>
        </div>
        <AnimatePresence mode="wait">
          {!rsvp ? (
            <motion.div key="btns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2">
              {[
                { label: "Accept", value: "yes" as const, cls: "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/30" },
                { label: "Decline", value: "no" as const, cls: "bg-white/8 hover:bg-white/15 text-white/60" },
              ].map(b => (
                <motion.button key={b.value} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setRsvp(b.value)}
                  className={`flex-1 rounded-full py-1.5 font-['Crimson_Pro'] text-sm font-semibold transition-colors ${b.cls}`}
                >{b.label}</motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-['Crimson_Pro'] font-semibold ${rsvp === "yes" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}
            >
              {rsvp === "yes" ? <><CheckCircle2 size={14} /> Going!</> : <><X size={14} /> Declined</>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   7. CHAT NOTIFICATION — message bubble with quick-reply strip
══════════════════════════════════════════════════════════════════════ */
const REPLIES = ["👍 Looks great!", "On my way!", "Can we reschedule?"];

function ChatNotification({ onDismiss }: { onDismiss: () => void }) {
  const [sent, setSent] = useState<string | null>(null);
  return (
    <div className="rounded-2xl overflow-hidden shadow-xl border border-white/8">
      {/* header */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 font-['Crimson_Pro'] font-bold text-white text-sm">M</div>
        <div className="flex-1">
          <p className="font-['Crimson_Pro'] text-sm font-semibold text-white">Maya Chen</p>
          <div className="flex items-center gap-1.5">
            <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
            />
            <span className="font-['Space_Mono'] text-[10px] text-white/70">online now</span>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onDismiss} className="text-white/50 hover:text-white transition-colors"><X size={15} /></motion.button>
      </div>
      {/* body */}
      <div className="bg-zinc-900 p-4">
        <motion.div
          initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1, ...softSpring }}
          className="max-w-[85%] rounded-[4px_18px_18px_18px] bg-white/10 px-4 py-3"
        >
          <p className="font-['Crimson_Pro'] text-sm text-white/90 leading-relaxed">
            Hey! Did you get a chance to review the mockups I sent? Would love your thoughts 🎨
          </p>
        </motion.div>
        <p className="font-['Space_Mono'] text-[10px] text-white/30 mt-1.5 ml-1">2 min ago</p>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              initial={{ x: 12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={softSpring}
              className="mt-3 flex justify-end"
            >
              <div className="max-w-[75%] rounded-[18px_4px_18px_18px] bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5">
                <p className="font-['Crimson_Pro'] text-sm text-white">{sent}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="replies" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, ...softSpring }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {REPLIES.map((r) => (
                <motion.button key={r} whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setSent(r)}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-['Crimson_Pro'] text-[13px] text-white/70 hover:border-cyan-500/50 hover:text-white hover:bg-white/10 transition-all"
                >{r}</motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   8. NEUMORPHIC BATTERY — soft-shadow, pulsing bar, alert state
══════════════════════════════════════════════════════════════════════ */
function BatteryCard({ onDismiss }: { onDismiss: () => void }) {
  const [level, setLevel] = useState(15);
  const [lowPower, setLowPower] = useState(false);
  const [charging, setCharging] = useState(false);

  const isLow = level <= 20;
  const isMid = level > 20 && level <= 60;

  const barColor = charging
    ? "from-emerald-400 to-green-300"
    : isLow
    ? "from-red-500 to-orange-400"
    : isMid
    ? "from-yellow-400 to-amber-300"
    : "from-emerald-500 to-teal-400";

  const labelColor = charging
    ? "#6ee7b7"
    : isLow
    ? "#f87171"
    : isMid
    ? "#fbbf24"
    : "#34d399";

  const statusText = charging
    ? `Charging · ${level}%`
    : isLow
    ? `Critical · ${level}% left`
    : `${level}% · ${Math.round((100 - level) * 1.2)}min remaining`;

  // Dark neumorphic palette
  const base = "#161b27";
  const shadow1 = "rgba(0,0,0,0.55)";
  const highlight = "rgba(255,255,255,0.04)";

  return (
    <div
      className="rounded-2xl p-5 w-full"
      style={{
        background: base,
        boxShadow: `8px 8px 20px ${shadow1}, -4px -4px 14px ${highlight}`,
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: base,
              boxShadow: `4px 4px 10px ${shadow1}, -3px -3px 8px ${highlight}`,
            }}
          >
            <motion.div
              animate={isLow && !charging ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
              transition={{ duration: 1.1, repeat: Infinity }}
            >
              <Battery size={20} style={{ color: labelColor }} />
            </motion.div>
          </div>
          <div>
            <p className="font-['Crimson_Pro'] text-base font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>
              {charging ? "Charging" : isLow ? "Critical Battery" : "Battery Status"}
            </p>
            <p className="font-['Space_Mono'] text-[10px]" style={{ color: labelColor }}>
              {statusText}
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          onClick={onDismiss}
          className="flex h-7 w-7 items-center justify-center rounded-full"
          style={{
            background: base,
            boxShadow: `3px 3px 8px ${shadow1}, -2px -2px 6px ${highlight}`,
            border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)",
          }}
        >
          <X size={13} />
        </motion.button>
      </div>

      {/* Battery bar — inset neumorphic track */}
      <div
        className="h-3 rounded-full overflow-hidden mb-1"
        style={{
          background: base,
          boxShadow: `inset 3px 3px 8px ${shadow1}, inset -2px -2px 6px ${highlight}`,
        }}
      >
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
          animate={{
            width: `${level}%`,
            boxShadow: charging
              ? ["0 0 6px rgba(52,211,153,0.4)", "0 0 16px rgba(52,211,153,0.8)", "0 0 6px rgba(52,211,153,0.4)"]
              : isLow
              ? ["0 0 6px rgba(239,68,68,0.4)", "0 0 14px rgba(239,68,68,0.8)", "0 0 6px rgba(239,68,68,0.4)"]
              : undefined,
          }}
          transition={{ width: { duration: 0.4, ease: "easeOut" }, boxShadow: { duration: 1.4, repeat: Infinity } }}
        />
      </div>

      {/* Drag to adjust level */}
      <input
        type="range" min={1} max={100} value={level}
        onChange={e => setLevel(Number(e.target.value))}
        className="w-full mt-2 mb-4 cursor-pointer"
        style={{ accentColor: labelColor, height: 3 }}
      />

      {/* Action buttons */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => setLowPower(lp => !lp)}
          className="flex-1 rounded-full py-2 font-['Crimson_Pro'] text-sm font-semibold transition-all"
          style={{
            background: lowPower ? "rgba(251,146,60,0.15)" : base,
            boxShadow: lowPower
              ? "none"
              : `4px 4px 10px ${shadow1}, -3px -3px 8px ${highlight}`,
            border: lowPower ? "1px solid rgba(251,146,60,0.4)" : "1px solid rgba(255,255,255,0.05)",
            color: lowPower ? "#fb923c" : "rgba(255,255,255,0.45)",
            cursor: "pointer",
          }}
        >
          {lowPower ? "Low Power On ✓" : "Low Power Mode"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => setCharging(c => !c)}
          className="px-4 rounded-full py-2 font-['Space_Mono'] text-[10px] font-bold"
          style={{
            background: charging ? "rgba(52,211,153,0.15)" : base,
            boxShadow: charging ? "none" : `4px 4px 10px ${shadow1}, -3px -3px 8px ${highlight}`,
            border: charging ? "1px solid rgba(52,211,153,0.4)" : "1px solid rgba(255,255,255,0.05)",
            color: charging ? "#34d399" : "rgba(255,255,255,0.3)",
            cursor: "pointer",
          }}
        >
          {charging ? "⚡ ON" : "⚡ OFF"}
        </motion.button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   9. SECURITY SHIELD — dark emerald, animated check reveals
══════════════════════════════════════════════════════════════════════ */
const CHECKS = ["Two-factor authentication enabled", "Passkey device connected", "Session fingerprint verified"];

function SecurityCard({ onDismiss }: { onDismiss: () => void }) {
  const [done, setDone] = useState<boolean[]>([false, false, false]);
  useEffect(() => {
    CHECKS.forEach((_, i) => {
      setTimeout(() => setDone(d => { const n = [...d]; n[i] = true; return n; }), (i + 1) * 500);
    });
  }, []);
  const allDone = done.every(Boolean);
  return (
    <div className="rounded-2xl bg-[#052e16] border border-emerald-900/60 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_60px_rgba(16,185,129,0.08)]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <motion.div
            animate={allDone ? { scale: [1, 1.15, 1], boxShadow: ["0 0 0px rgba(52,211,153,0)", "0 0 25px rgba(52,211,153,0.6)", "0 0 10px rgba(52,211,153,0.3)"] } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-emerald-700 bg-emerald-900/50"
          >
            <Shield size={20} className="text-emerald-400" />
          </motion.div>
          <div>
            <p className="font-['Crimson_Pro'] text-base font-semibold text-emerald-50">Account Secured</p>
            <p className="font-['Space_Mono'] text-[10px] text-emerald-700">
              {allDone ? "All checks passed ✓" : "Running security checks…"}
            </p>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onDismiss} className="text-emerald-800 hover:text-emerald-500 transition-colors"><X size={14} /></motion.button>
      </div>
      <div className="flex flex-col gap-3">
        {CHECKS.map((c, i) => (
          <div key={c} className="flex items-center gap-3">
            <motion.div
              animate={done[i] ? { scale: [0.7, 1.2, 1], opacity: 1 } : { scale: 1, opacity: 1 }}
              transition={spring}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors"
              style={{
                background: done[i] ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.04)",
                border: `1.5px solid ${done[i] ? "#34d399" : "rgba(255,255,255,0.08)"}`
              }}
            >
              <AnimatePresence>
                {done[i] && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring}>
                    <CheckCircle2 size={11} className="text-emerald-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.span
              animate={{ color: done[i] ? "#a7f3d0" : "rgba(255,255,255,0.2)" }}
              transition={{ duration: 0.4 }}
              className="font-['Crimson_Pro'] text-sm"
            >{c}</motion.span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   10. STATUS BANNER — connectivity strip with live pulse
══════════════════════════════════════════════════════════════════════ */
function StatusBanner({ onDismiss }: { onDismiss: () => void }) {
  const [offline, setOffline] = useState(false);
  return (
    <div className={`rounded-xl border px-4 py-3 flex items-center gap-3 transition-all duration-500 ${offline ? "bg-red-950/40 border-red-900/50" : "bg-emerald-950/40 border-emerald-900/50"}`}>
      <motion.div
        animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        className={`h-2.5 w-2.5 rounded-full shrink-0 ${offline ? "bg-red-500" : "bg-emerald-500"}`}
      />
      <Globe size={15} className={offline ? "text-red-500" : "text-emerald-500"} />
      <p className="font-['Space_Mono'] text-xs text-white/70 flex-1">
        {offline ? "Connection lost · Reconnecting…" : "All systems operational · 12ms"}
      </p>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setOffline(o => !o)}
        className="font-['Space_Mono'] text-[10px] text-white/40 hover:text-white border border-white/10 rounded px-2 py-1 transition-colors"
      >
        TOGGLE
      </motion.button>
      <button onClick={onDismiss} className="text-white/30 hover:text-white transition-colors"><X size={13} /></button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   11. UPDATE BANNER — app update available with version
══════════════════════════════════════════════════════════════════════ */
function UpdateBanner({ onDismiss }: { onDismiss: () => void }) {
  const [installing, setInstalling] = useState(false);
  const [done, setDone] = useState(false);

  const install = () => {
    setInstalling(true);
    setTimeout(() => { setInstalling(false); setDone(true); }, 2000);
  };

  return (
    <div className="rounded-xl border px-4 py-3 flex items-start gap-3" style={{ background: 'rgba(77,143,200,0.08)', borderColor: 'rgba(77,143,200,0.25)' }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(77,143,200,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <RefreshCw size={15} style={{ color: '#7eb8e8' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs font-bold text-white">Update Available</p>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(77,143,200,0.2)', color: '#7eb8e8' }}>v2.4.0</span>
        </div>
        <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Performance improvements and security patches included.</p>
        <div className="flex items-center gap-2 mt-2">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.span key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] font-semibold flex items-center gap-1" style={{ color: '#22c55e' }}>
                <CheckCircle2 size={10} /> Installed!
              </motion.span>
            ) : (
              <motion.button key="btn" whileTap={{ scale: 0.95 }} onClick={install} disabled={installing}
                className="text-[10px] font-bold px-3 py-1 rounded-lg flex items-center gap-1.5"
                style={{ background: '#4d8fc8', border: 'none', color: '#fff', cursor: installing ? 'default' : 'pointer' }}>
                {installing ? <><RefreshCw size={9} className="animate-spin" /> Installing…</> : 'Install Now'}
              </motion.button>
            )}
          </AnimatePresence>
          <button onClick={onDismiss} className="text-[10px]" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>Later</button>
        </div>
      </div>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)' }}><X size={13} /></button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   12. PERMISSION PROMPT — request camera / location
══════════════════════════════════════════════════════════════════════ */
function PermissionPrompt({ onDismiss: _dismiss }: { onDismiss: () => void }) {
  const [state, setState] = useState<'idle' | 'granted' | 'denied'>('idle');

  return (
    <div className="rounded-xl border px-4 py-4" style={{ background: 'rgba(17,24,39,0.8)', borderColor: 'rgba(255,255,255,0.09)' }}>
      <div className="flex items-start gap-3 mb-3">
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(167,139,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Camera size={18} style={{ color: '#a78bfa' }} />
        </div>
        <div>
          <p className="text-xs font-bold text-white mb-0.5">Allow Camera Access</p>
          <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>This app wants to use your camera and microphone for video calls.</p>
        </div>
      </div>
      <div className="flex items-center gap-2 pl-1">
        <MapPin size={11} style={{ color: 'rgba(255,255,255,0.2)' }} />
        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>Component Playground · localhost:5173</p>
      </div>
      <AnimatePresence mode="wait">
        {state === 'idle' ? (
          <motion.div key="buttons" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2 mt-3">
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => setState('granted')}
              className="flex-1 py-2 rounded-lg text-xs font-bold text-white"
              style={{ background: '#a78bfa', border: 'none', cursor: 'pointer' }}>Allow</motion.button>
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => setState('denied')}
              className="flex-1 py-2 rounded-lg text-xs font-semibold"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }}>Deny</motion.button>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: state === 'granted' ? '#22c55e' : '#f87171' }}>
              {state === 'granted' ? '✓ Permission granted' : '✗ Permission denied'}
            </span>
            <button onClick={() => setState('idle')} className="text-[10px] underline ml-auto" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a78bfa' }}>Reset</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   13. TOAST STACK — live stacking toasts, click to add
══════════════════════════════════════════════════════════════════════ */
let nextId = 1;
const TOAST_TYPES = [
  { type: 'success', label: 'Changes saved successfully', color: '#22c55e', bg: 'rgba(34,197,94,0.08)', icon: CheckCircle2 },
  { type: 'info',    label: 'New update ready to install', color: '#7eb8e8', bg: 'rgba(77,143,200,0.08)', icon: Bell },
  { type: 'warning', label: 'Storage almost full (91%)',   color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' , icon: AlertCircle },
  { type: 'error',   label: 'Connection failed — retrying', color: '#f87171', bg: 'rgba(248,113,113,0.08)', icon: X },
] as const;

function ToastStack({ onDismiss }: { onDismiss: () => void }) {
  const [toasts, setToasts] = useState<{ id: number; idx: number }[]>([]);

  const addToast = () => {
    const id = nextId++;
    const idx = Math.floor(Math.random() * TOAST_TYPES.length);
    setToasts(prev => [...prev.slice(-3), { id, idx }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  return (
    <div className="rounded-xl border px-4 py-4" style={{ background: 'rgba(17,24,39,0.8)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-white">Toast Feed</p>
        <div className="flex items-center gap-2">
          <motion.button whileTap={{ scale: 0.95 }} onClick={addToast}
            className="text-[10px] font-bold px-3 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
            + Toast
          </motion.button>
          <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)' }}><X size={13} /></button>
        </div>
      </div>
      <div className="relative min-h-[56px]">
        <AnimatePresence>
          {toasts.length === 0 && (
            <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-[11px] text-center py-4" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Click "+ Toast" to spawn notifications
            </motion.p>
          )}
          {toasts.map(({ id, idx }) => {
            const t = TOAST_TYPES[idx];
            return (
              <motion.div key={id} layout
                initial={{ opacity: 0, x: 40, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.95 }} transition={{ ...softSpring }}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 mb-1.5"
                style={{ background: t.bg, border: `1px solid ${t.color}22` }}>
                <t.icon size={12} style={{ color: t.color, flexShrink: 0 }} />
                <p className="text-[11px] flex-1" style={{ color: 'rgba(255,255,255,0.65)' }}>{t.label}</p>
                <button onClick={() => setToasts(prev => prev.filter(x => x.id !== id))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)' }}>
                  <X size={10} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SHARED CHROME
══════════════════════════════════════════════════════════════════════ */
interface ShowcaseCardProps { title: string; description: string; useCase: string; children: React.ReactNode; }
const ShowcaseCard: React.FC<ShowcaseCardProps> = ({ title, description, useCase, children }) => (
  <div className="rounded-xl flex flex-col" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
    <div className="px-5 pt-5 pb-1">
      <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.88)' }}>{title}</h3>
      <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.36)' }}>{description}</p>
    </div>
    <div className="mx-5 my-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem 1.25rem' }}>
      {children}
    </div>
    <div className="px-5 pb-4 flex items-center gap-1.5">
      <span className="text-[9px] tracking-[0.2em] uppercase font-semibold" style={{ color: 'rgba(255,255,255,0.16)' }}>use case</span>
      <span className="text-[11px]" style={{ color: '#4d8fc8', opacity: 0.75 }}>— {useCase}</span>
    </div>
  </div>
);

interface SectionHeaderProps { number: string; title: string; subtitle: string; accent: string; }
const SectionHeader: React.FC<SectionHeaderProps> = ({ number, title, subtitle, accent }) => (
  <div className="flex items-start gap-4 mb-7">
    <span className="text-[11px] font-black tabular-nums mt-1 shrink-0" style={{ color: accent, fontFamily: 'monospace', opacity: 0.55 }}>{number}</span>
    <div>
      <h2 className="text-xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{title}</h2>
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.32)' }}>{subtitle}</p>
    </div>
  </div>
);

/* Each showcased notification gets its own local dismiss state so the card stays intact */
const Sandboxed: React.FC<{ Component: React.FC<{ onDismiss: () => void }> }> = ({ Component }) => {
  const [dismissed, setDismissed] = useState(false);
  return (
    <AnimatePresence mode="wait">
      {dismissed ? (
        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-6 gap-2"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>dismissed</p>
          <button onClick={() => setDismissed(false)}
            className="text-[10px] font-semibold px-3 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
            Restore
          </button>
        </motion.div>
      ) : (
        <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Component onDismiss={() => setDismissed(true)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SECTION DATA
══════════════════════════════════════════════════════════════════════ */
const SECTIONS = [
  {
    number: '01', title: 'Visual Styles', accent: '#4d8fc8',
    subtitle: 'Notifications that double as art — glassmorphism, neon scan lines, live status strips, and app update banners.',
    items: [
      { title: 'Aurora Glass',       description: 'Animated indigo/violet colour blobs sit under a frosted glass panel. The ambient gradient layers shift continuously.',                       useCase: 'SaaS alerts, AI feature announcements', C: GlassNotification },
      { title: 'Neon Terminal',      description: 'Hot-pink scan line sweeps every 3.5s. Text glitches with slight offsets simulating CRT noise. Cyberpunk-inspired.',                       useCase: 'Gaming UIs, developer tools',           C: NeonNotification  },
      { title: 'Status Banner',      description: 'Live connectivity strip with a pulsing dot. Toggle between "All systems operational" and "Connection lost" states.',                     useCase: 'System health monitors, dashboards',    C: StatusBanner      },
      { title: 'Update Banner',      description: 'Version badge, short description of what\'s new, and an Install button with a loading state. Dismissable with "Later".',                  useCase: 'App update prompts, changelog CTAs',    C: UpdateBanner      },
    ],
  },
  {
    number: '02', title: 'Social & Messaging', accent: '#a78bfa',
    subtitle: 'Notifications that invite interaction — reactions, quick-reply, permission prompts, and expandable social cards.',
    items: [
      { title: 'Floating Pill',      description: 'Star and flame reaction counters with AnimatePresence number morphs. Pill shape with glow and floating animation.',                      useCase: 'Social feeds, post engagement',         C: PillNotification  },
      { title: 'Quick-Reply Chat',   description: 'Typing indicator dots, online pulse, chat bubbles animate in, and reply buttons settle into the card.',                                  useCase: 'Messenger previews, support widgets',   C: ChatNotification  },
      { title: 'Social Reactions',   description: 'Stacked avatar row expands on click to reveal a full reaction breakdown. AnimatePresence drives the list reveal.',                       useCase: 'Post likes, activity feeds',            C: AvatarNotification },
      { title: 'Permission Prompt',  description: 'Camera permission dialog with camera icon, site origin, and Allow/Deny buttons. Result state plays in after decision.',                  useCase: 'Media permissions, location requests',  C: PermissionPrompt  },
    ],
  },
  {
    number: '03', title: 'System & Security', accent: '#34d399',
    subtitle: 'Notifications that report status — downloads, security checks, battery warnings, and live toast feeds.',
    items: [
      { title: 'Live Progress',      description: 'Download bar fills via setInterval. State transitions drive the label: Downloading → Verifying → Done. Can be re-triggered.',           useCase: 'File downloads, background tasks',      C: ProgressCard     },
      { title: 'Security Check',     description: 'Three-step animated security sequence auto-runs on mount with staggered timing. Each step glows green as it passes.',                   useCase: 'Auth flows, 2FA confirmations',          C: SecurityCard     },
      { title: 'Neumorphic Battery', description: 'Dark neumorphic card with inset track. Drag the slider to change charge level — color shifts red → amber → green. Toggle Low Power and Charging states.',  useCase: 'Device status, IoT dashboards', C: BatteryCard },
      { title: 'Toast Stack',        description: 'Click "+ Toast" to push a random toast type into a live stack. Each toast auto-dismisses after 3.5s. Can be manually closed.',         useCase: 'Global feedback systems, action results', C: ToastStack      },
    ],
  },
  {
    number: '04', title: 'Temporal & Contextual', accent: '#fb923c',
    subtitle: 'Notifications anchored to time and context — event invitations, calendar RSVPs, and expandable date cards.',
    items: [
      { title: 'Event RSVP Card',    description: 'Date spine on the left with month/day. Accept triggers a confirmation state; Decline turns the card muted. AnimatePresence handles both.', useCase: 'Calendar invites, event apps',          C: CalendarCard  },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════ */
export default function NotificationVariants() {
  return (
    <div className="min-h-screen" style={{ background: '#06080f', color: '#e4eaf0' }}>

      {/* ambient blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div style={{ position: 'absolute', top: -80, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(77,143,200,0.06)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: 0, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(167,139,250,0.05)', filter: 'blur(80px)' }} />
      </div>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 55% 60% at 0% 0%, rgba(77,143,200,0.09) 0%, transparent 65%)' }} />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-10 pb-9">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-[10px] tracking-[0.3em] uppercase mb-3 font-semibold" style={{ color: '#4d8fc8', opacity: 0.6, fontFamily: 'monospace' }}>Playground / UI Components</p>
            <h1 className="mb-3 leading-tight" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>Notification Showcase</h1>
            <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'rgba(255,255,255,0.36)' }}>13 interactive notification patterns — glassmorphism, neon glitch, live toasts, RSVP cards, security flows, and more. Each one dismissable and interactive.</p>
          </motion.div>
          <motion.div className="flex flex-wrap gap-2 mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {['4 categories', '13 patterns', 'All dismissable', 'Framer Motion'].map(tag => (
              <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.4)' }}>{tag}</span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Sections ── */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 space-y-16">
        {SECTIONS.map(section => (
          <motion.div key={section.number} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            <SectionHeader number={section.number} title={section.title} subtitle={section.subtitle} accent={section.accent} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.items.map(item => (
                <ShowcaseCard key={item.title} title={item.title} description={item.description} useCase={item.useCase}>
                  <Sandboxed Component={item.C} />
                </ShowcaseCard>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
