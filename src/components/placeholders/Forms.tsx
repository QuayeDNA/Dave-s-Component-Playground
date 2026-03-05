import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, Check, X, Upload, Search,
  Tag, ChevronRight, ChevronLeft, Loader2,
  CreditCard, Lock, User, Mail, Sparkles,
} from 'lucide-react';

// ── Shared page chrome ─────────────────────────────────

interface CardProps { title: string; description: string; useCase: string; children: React.ReactNode; }
const ShowcaseCard: React.FC<CardProps> = ({ title, description, useCase, children }) => (
  <div className="rounded-xl flex flex-col" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
    <div className="px-5 pt-5 pb-1">
      <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.88)' }}>{title}</h3>
      <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.36)' }}>{description}</p>
    </div>
    <div className="mx-5 my-3 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)', minHeight: 140, padding: '2rem 1.5rem' }}>
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

// ═══════════════════════════════════════════════════════
// SECTION 1 — INPUT INTERACTIONS
// ═══════════════════════════════════════════════════════

// 1 · Floating Label
const FloatingLabelInput: React.FC = () => {
  const [values, setValues] = useState({ name: '', email: '' });
  const [focused, setFocused] = useState<string | null>(null);

  const Field = ({ id, label, type = 'text' }: { id: 'name' | 'email'; label: string; type?: string }) => {
    const isActive = focused === id || values[id].length > 0;
    return (
      <div className="relative w-full">
        <input
          id={id} type={type} value={values[id]}
          onChange={e => setValues(v => ({ ...v, [id]: e.target.value }))}
          onFocus={() => setFocused(id)} onBlur={() => setFocused(null)}
          className="w-full px-3 pt-5 pb-2 rounded-lg text-sm outline-none transition-all"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${isActive ? '#4d8fc8' : 'rgba(255,255,255,0.1)'}`,
            color: 'rgba(255,255,255,0.85)',
            boxShadow: isActive ? '0 0 0 3px rgba(77,143,200,0.12)' : 'none',
          }}
        />
        <motion.label
          htmlFor={id}
          animate={isActive ? { y: -10, scale: 0.78, color: '#7eb8e8' } : { y: 0, scale: 1, color: 'rgba(255,255,255,0.3)' }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', left: 12, top: 13, originX: 0, pointerEvents: 'none', fontSize: 13 }}
        >{label}</motion.label>
      </div>
    );
  };

  return (
    <form className="w-full max-w-xs space-y-3" onSubmit={e => e.preventDefault()}>
      <Field id="name" label="Full Name" />
      <Field id="email" label="Email Address" type="email" />
      <motion.button type="submit" whileTap={{ scale: 0.97 }}
        className="w-full py-2.5 rounded-lg text-sm font-semibold text-white"
        style={{ background: '#4d8fc8', border: 'none', cursor: 'pointer' }}>
        Continue
      </motion.button>
    </form>
  );
};

// 2 · OTP Input
const OTPInput: React.FC = () => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [verified, setVerified] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handle = (i: number, val: string) => {
    const v = val.replace(/\D/g, '').slice(-1);
    const next = [...digits]; next[i] = v; setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
    if (next.every(d => d !== '') && !verified) {
      setTimeout(() => setVerified(true), 300);
    }
  };
  const onKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };
  const reset = () => { setDigits(['', '', '', '', '', '']); setVerified(false); setTimeout(() => refs.current[0]?.focus(), 50); };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Enter the 6-digit code</p>
      <div className="flex gap-2">
        {digits.map((d, i) => (
          <motion.input key={i}
            ref={el => { refs.current[i] = el; }}
            type="text" inputMode="numeric" maxLength={1} value={d}
            onChange={e => handle(i, e.target.value)}
            onKeyDown={e => onKey(i, e)}
            animate={verified ? { scale: [1, 1.12, 1], borderColor: '#22c55e' } : { scale: 1 }}
            transition={{ delay: i * 0.04 }}
            className="w-10 h-11 rounded-lg text-center font-bold text-base outline-none transition-all"
            style={{
              background: d ? 'rgba(77,143,200,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${d ? '#4d8fc8' : 'rgba(255,255,255,0.1)'}`,
              color: verified ? '#22c55e' : 'rgba(255,255,255,0.85)',
            }}
          />
        ))}
      </div>
      <AnimatePresence mode="wait">
        {verified
          ? <motion.div key="ok" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#22c55e' }}>
              <Check size={13} /> Verified!
              <button onClick={reset} className="ml-2 text-[10px] opacity-50 hover:opacity-100 underline" style={{ color: '#4d8fc8', background: 'none', border: 'none', cursor: 'pointer' }}>Reset</button>
            </motion.div>
          : <motion.p key="hint" className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
              {digits.filter(Boolean).length}/6 digits
            </motion.p>
        }
      </AnimatePresence>
    </div>
  );
};

// 3 · Password Strength
const PasswordStrength: React.FC = () => {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);

  const checks = [
    { label: 'At least 8 characters', ok: pw.length >= 8 },
    { label: 'Uppercase letter',       ok: /[A-Z]/.test(pw) },
    { label: 'Number or symbol',       ok: /[\d\W]/.test(pw) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['transparent', '#ef4444', '#f59e0b', '#22c55e'];
  const labels = ['', 'Weak', 'Fair', 'Strong'];

  return (
    <div className="w-full max-w-xs space-y-3">
      <div className="relative">
        <input type={show ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)}
          placeholder="New password"
          className="w-full px-3 py-2.5 pr-9 rounded-lg text-sm outline-none"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.82)' }}
        />
        <button type="button" onClick={() => setShow(s => !s)}
          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3].map(n => (
          <motion.div key={n} className="h-1 flex-1 rounded-full" animate={{ backgroundColor: score >= n ? colors[score] : 'rgba(255,255,255,0.07)' }} transition={{ duration: 0.3 }} />
        ))}
      </div>
      {pw && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] font-semibold" style={{ color: colors[score] }}>{labels[score]}</motion.p>}
      <div className="space-y-1.5">
        {checks.map(c => (
          <motion.div key={c.label} className="flex items-center gap-2 text-[11px]"
            animate={{ color: c.ok ? '#22c55e' : 'rgba(255,255,255,0.3)' }}>
            <Check size={10} style={{ opacity: c.ok ? 1 : 0.2 }} /> {c.label}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// 4 · Credit Card Input
const CreditCardInput: React.FC = () => {
  const [num, setNum] = useState('');
  const [exp, setExp] = useState('');
  const [cvv, setCvv] = useState('');
  const [flipped, setFlipped] = useState(false);

  const fmtNum = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExp = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };

  const displayNum = num.padEnd(16, '·').replace(/(.{4})/g, '$1 ').trim();

  return (
    <div className="w-full max-w-xs space-y-3">
      {/* Mini card preview */}
      <div className="relative w-full h-24 cursor-pointer select-none" style={{ perspective: 800 }} onClick={() => setFlipped(f => !f)}>
        <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.5 }} style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
          {/* Front */}
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', background: 'linear-gradient(135deg,#1a3a5c,#0f2d4a)', borderRadius: 10, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex justify-between items-start">
              <CreditCard size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />
              <div className="flex gap-1">
                <div style={{ width: 16, height: 10, borderRadius: '50%', background: '#eb001b', opacity: 0.8 }} />
                <div style={{ width: 16, height: 10, borderRadius: '50%', background: '#f79e1b', opacity: 0.8, marginLeft: -6 }} />
              </div>
            </div>
            <div className="mt-2 font-mono text-xs tracking-widest" style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.14em' }}>{displayNum}</div>
            <div className="mt-1 flex justify-between">
              <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{exp || 'MM/YY'}</span>
            </div>
          </div>
          {/* Back */}
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'linear-gradient(135deg,#1a3a5c,#0f2d4a)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <div style={{ height: 20, background: 'rgba(0,0,0,0.4)', marginTop: 16 }} />
            <div className="mt-3 mx-4 flex items-center justify-end">
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 3, padding: '2px 10px', fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                {cvv || '···'}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <input value={fmtNum(num)} onChange={e => setNum(e.target.value.replace(/\s/g, ''))} placeholder="Card number" maxLength={19}
        className="w-full px-3 py-2 rounded-lg text-xs font-mono outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.12em' }} />
      <div className="flex gap-2">
        <input value={exp} onChange={e => setExp(fmtExp(e.target.value))} placeholder="MM/YY" maxLength={5}
          className="flex-1 px-3 py-2 rounded-lg text-xs font-mono outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }} />
        <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g,'').slice(0,3))} placeholder="CVV" maxLength={3}
          onFocus={() => setFlipped(true)} onBlur={() => setFlipped(false)}
          className="w-20 px-3 py-2 rounded-lg text-xs font-mono outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }} />
      </div>
      <p className="text-[10px] text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>Focus CVV to flip card · click card to flip manually</p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// SECTION 2 — SEARCH & SELECT
// ═══════════════════════════════════════════════════════

// 5 · Search with suggestions
const ITEMS = ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite', 'Next.js', 'Zustand', 'Radix UI', 'Three.js', 'Zod'];

const SearchSuggestions: React.FC = () => {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const filtered = ITEMS.filter(i => i.toLowerCase().includes(q.toLowerCase())).slice(0, 5);

  return (
    <div className="relative w-full max-w-xs">
      <div className="relative">
        <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
        <input value={q} onChange={e => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search packages…"
          className="w-full pl-8 pr-3 py-2.5 rounded-lg text-sm outline-none"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.82)' }} />
      </div>
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.ul initial={{ opacity: 0, y: -6, scaleY: 0.95 }} animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-1 rounded-lg overflow-hidden z-10 py-1"
            style={{ transformOrigin: 'top', background: '#0d1520', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}>
            {filtered.map((item, i) => (
              <motion.li key={item} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                <button type="button" onMouseDown={() => { setQ(item); setOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.65)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(77,143,200,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)'; }}>
                  <Search size={10} style={{ opacity: 0.4 }} /> {item}
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

// 6 · Tag input with chips
const TagInput: React.FC = () => {
  const [tags, setTags] = useState(['design', 'react']);
  const [input, setInput] = useState('');
  const COLORS = ['#4d8fc8', '#a78bfa', '#34d399', '#fb923c', '#f87171'];

  const add = () => {
    const t = input.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags(p => [...p, t]);
    setInput('');
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
    if (e.key === 'Backspace' && !input) setTags(t => t.slice(0, -1));
  };

  return (
    <div className="w-full max-w-xs">
      <div className="flex flex-wrap gap-1.5 p-2 rounded-lg min-h-[42px]"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <AnimatePresence>
          {tags.map((tag, i) => (
            <motion.span key={tag} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold text-white"
              style={{ background: `${COLORS[i % COLORS.length]}22`, border: `1px solid ${COLORS[i % COLORS.length]}44`, color: COLORS[i % COLORS.length] }}>
              <Tag size={8} />
              {tag}
              <button type="button" onClick={() => setTags(t => t.filter(x => x !== tag))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', lineHeight: 1, padding: 0, opacity: 0.6 }}><X size={9} /></button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey} onBlur={add}
          placeholder={tags.length === 0 ? 'Add tags…' : ''}
          className="flex-1 min-w-[60px] bg-transparent text-xs outline-none"
          style={{ color: 'rgba(255,255,255,0.7)', border: 'none' }} />
      </div>
      <p className="mt-1.5 text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>Press Enter or comma to add a tag</p>
    </div>
  );
};

// 7 · Animated Range Slider
const RangeSlider: React.FC = () => {
  const [min, setMin] = useState(20);
  const [max, setMax] = useState(80);

  const pct = (v: number) => `${v}%`;

  return (
    <div className="w-full max-w-xs space-y-4">
      <div className="flex justify-between text-xs font-semibold" style={{ color: '#4d8fc8' }}>
        <span>${min}</span>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>Price range</span>
        <span>${max}</span>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="absolute left-0 right-0 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="absolute h-1.5 rounded-full" style={{ left: pct(min), right: pct(100 - max), background: 'linear-gradient(90deg, #4d8fc8, #7eb8e8)' }} />
        {(['min', 'max'] as const).map(key => (
          <input key={key} type="range" min={0} max={100}
            value={key === 'min' ? min : max}
            onChange={e => {
              const v = Number(e.target.value);
              if (key === 'min') { if (v < max - 5) setMin(v); }
              else { if (v > min + 5) setMax(v); }
            }}
            className="absolute w-full h-full opacity-0 cursor-pointer"
            style={{ pointerEvents: 'all' }}
          />
        ))}
        {[min, max].map((v, i) => (
          <motion.div key={i} layout className="absolute w-4 h-4 rounded-full border-2 border-white z-10 pointer-events-none"
            style={{ left: `calc(${pct(v)} - 8px)`, background: '#4d8fc8', boxShadow: '0 0 0 4px rgba(77,143,200,0.25)' }} />
        ))}
      </div>
      <div className="flex gap-2">
        {[min, max].map((v, i) => (
          <div key={i} className="flex-1 rounded-lg p-2 text-center text-xs font-mono font-semibold"
            style={{ background: 'rgba(77,143,200,0.08)', border: '1px solid rgba(77,143,200,0.2)', color: '#7eb8e8' }}>
            ${v}
          </div>
        ))}
      </div>
    </div>
  );
};

// 8 · Toggle / Switch Form
const ToggleSwitchForm: React.FC = () => {
  const [prefs, setPrefs] = useState({ email: true, push: false, analytics: true, beta: false });
  type PrefKey = keyof typeof prefs;
  const items: { key: PrefKey; label: string; sub: string }[] = [
    { key: 'email',     label: 'Email notifications', sub: 'Weekly digests and alerts' },
    { key: 'push',      label: 'Push notifications',  sub: 'Real-time on-device alerts' },
    { key: 'analytics', label: 'Usage analytics',     sub: 'Help improve the product' },
    { key: 'beta',      label: 'Beta features',       sub: 'Early access experiments' },
  ];
  return (
    <div className="w-full max-w-xs space-y-2">
      {items.map(item => (
        <div key={item.key} className="flex items-center justify-between py-1.5">
          <div>
            <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{item.label}</p>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.28)' }}>{item.sub}</p>
          </div>
          <motion.button type="button"
            onClick={() => setPrefs(p => ({ ...p, [item.key]: !p[item.key] }))}
            animate={{ backgroundColor: prefs[item.key] ? '#4d8fc8' : 'rgba(255,255,255,0.08)' }}
            className="relative rounded-full shrink-0"
            style={{ width: 36, height: 20, border: 'none', cursor: 'pointer', padding: 0 }}>
            <motion.div animate={{ x: prefs[item.key] ? 18 : 2 }} transition={{ type: 'spring', stiffness: 420, damping: 22 }}
              style={{ position: 'absolute', top: 2, width: 16, height: 16, borderRadius: '50%', background: '#fff' }} />
          </motion.button>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// SECTION 3 — MULTI-STEP & COMPLEX
// ═══════════════════════════════════════════════════════

// 9 · Multi-step form
const steps = [
  { label: 'Account', icon: User },
  { label: 'Profile', icon: Sparkles },
  { label: 'Confirm', icon: Lock },
];

const MultiStepForm: React.FC = () => {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const dir = useRef(1);

  const variants = {
    enter: { x: dir.current * 40, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: dir.current * -40, opacity: 0 },
  };

  const go = (d: number) => { dir.current = d; setStep(s => s + d); };

  return (
    <div className="w-full max-w-xs">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-5">
        {steps.map((s, i) => (
          <React.Fragment key={s.label}>
            <div className="flex flex-col items-center gap-1">
              <motion.div animate={{ background: i <= step ? '#4d8fc8' : 'rgba(255,255,255,0.07)', borderColor: i <= step ? '#4d8fc8' : 'rgba(255,255,255,0.1)' }}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
                {i < step ? <Check size={13} style={{ color: '#fff' }} /> : <s.icon size={12} style={{ color: i === step ? '#fff' : 'rgba(255,255,255,0.25)' }} />}
              </motion.div>
              <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: i === step ? '#7eb8e8' : 'rgba(255,255,255,0.2)' }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <motion.div className="flex-1 h-px mx-2" animate={{ background: i < step ? '#4d8fc8' : 'rgba(255,255,255,0.07)' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      {!done ? (
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={dir.current}>
            <motion.div key={step} variants={variants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
              {step === 0 && (
                <div className="space-y-2">
                  <input placeholder="Email address" className="w-full px-3 py-2 rounded-lg text-xs outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)' }} />
                  <input placeholder="Password" type="password" className="w-full px-3 py-2 rounded-lg text-xs outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)' }} />
                </div>
              )}
              {step === 1 && (
                <div className="space-y-2">
                  <input placeholder="Display name" className="w-full px-3 py-2 rounded-lg text-xs outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)' }} />
                  <input placeholder="Bio (optional)" className="w-full px-3 py-2 rounded-lg text-xs outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)' }} />
                </div>
              )}
              {step === 2 && (
                <div className="rounded-lg p-3 text-xs space-y-1" style={{ background: 'rgba(77,143,200,0.08)', border: '1px solid rgba(77,143,200,0.2)' }}>
                  <p style={{ color: 'rgba(255,255,255,0.5)' }}>Review your information before continuing. Your account will be created and you can edit details anytime.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-2">
          <Check size={28} style={{ color: '#22c55e', margin: '0 auto 6px' }} />
          <p className="text-sm font-semibold text-white">Account Created!</p>
          <button type="button" onClick={() => { setStep(0); setDone(false); }} className="text-[10px] mt-2 underline" style={{ color: '#4d8fc8', background: 'none', border: 'none', cursor: 'pointer' }}>Start over</button>
        </motion.div>
      )}

      {!done && (
        <div className="flex justify-between mt-4">
          <motion.button type="button" onClick={() => go(-1)} disabled={step === 0}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: step === 0 ? 'transparent' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: step === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.55)', cursor: step === 0 ? 'default' : 'pointer' }}>
            <ChevronLeft size={12} /> Back
          </motion.button>
          <motion.button type="button" onClick={() => step === steps.length - 1 ? setDone(true) : go(1)}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-semibold text-white"
            style={{ background: '#4d8fc8', border: 'none', cursor: 'pointer' }}>
            {step === steps.length - 1 ? 'Create Account' : 'Next'} <ChevronRight size={12} />
          </motion.button>
        </div>
      )}
    </div>
  );
};

// 10 · File Upload Drop Zone
const FileUpload: React.FC = () => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (name: string) => {
    setFile(name); setProgress(0); setUploaded(false);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 14 + 4;
      if (p >= 100) { clearInterval(iv); setProgress(100); setTimeout(() => setUploaded(true), 300); return; }
      setProgress(Math.min(p, 99));
    }, 100);
  };

  return (
    <div className="w-full max-w-xs">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div key="drop" exit={{ opacity: 0, scale: 0.95 }}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]?.name ?? 'file.png'); }}
            onClick={() => inputRef.current?.click()}
            animate={{ borderColor: dragging ? '#4d8fc8' : 'rgba(255,255,255,0.1)', background: dragging ? 'rgba(77,143,200,0.08)' : 'rgba(255,255,255,0.02)' }}
            className="rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer py-8 text-center"
            style={{ border: '2px dashed', transition: 'none' }}>
            <motion.div animate={dragging ? { y: [-4, 4, -4], transition: { repeat: Infinity, duration: 0.8 } } : { y: 0 }}>
              <Upload size={22} style={{ color: dragging ? '#4d8fc8' : 'rgba(255,255,255,0.2)' }} />
            </motion.div>
            <p className="text-xs font-medium" style={{ color: dragging ? '#7eb8e8' : 'rgba(255,255,255,0.4)' }}>
              {dragging ? 'Drop to upload' : 'Drop a file or click to browse'}
            </p>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.18)' }}>PNG, PDF, ZIP up to 10 MB</p>
            <input ref={inputRef} type="file" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0].name)} />
          </motion.div>
        ) : (
          <motion.div key="progress" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium truncate" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 160 }}>{file}</p>
              {uploaded
                ? <span className="text-xs font-semibold" style={{ color: '#22c55e' }}>Done ✓</span>
                : <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{Math.round(progress)}%</span>}
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <motion.div className="h-full rounded-full" animate={{ width: `${progress}%`, backgroundColor: uploaded ? '#22c55e' : '#4d8fc8' }} transition={{ ease: 'linear', duration: 0.08 }} />
            </div>
            <button type="button" onClick={() => { setFile(null); setProgress(0); setUploaded(false); }}
              className="text-[10px] underline" style={{ color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer' }}>
              Upload another
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// SECTION 4 — FEEDBACK & VALIDATION
// ═══════════════════════════════════════════════════════

// 11 · Error Shake
const ErrorShake: React.FC = () => {
  const [val, setVal] = useState('');
  const [shake, setShake] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!val || !/^\S+@\S+\.\S+$/.test(val)) { setShake(true); setTimeout(() => setShake(false), 500); return; }
    setSubmitted(true);
  };

  return (
    <form onSubmit={submit} className="w-full max-w-xs space-y-2">
      <motion.div animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}} transition={{ duration: 0.4 }}>
        <input value={submitted ? '' : val} onChange={e => { setVal(e.target.value); setSubmitted(false); }}
          placeholder="Enter your email"
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
          style={{
            background: shake ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${shake ? 'rgba(239,68,68,0.5)' : submitted ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)'}`,
            color: 'rgba(255,255,255,0.82)',
            transition: 'border-color 0.2s, background 0.2s',
          }} />
      </motion.div>
      <AnimatePresence mode="wait">
        {shake && <motion.p key="err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="text-[11px]" style={{ color: '#f87171' }}>Please enter a valid email address.</motion.p>}
        {submitted && <motion.p key="ok" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="text-[11px] flex items-center gap-1" style={{ color: '#22c55e' }}><Check size={10} /> Looks good!</motion.p>}
      </AnimatePresence>
      <motion.button type="submit" whileTap={{ scale: 0.97 }}
        className="w-full py-2.5 rounded-lg text-sm font-semibold text-white"
        style={{ background: submitted ? '#22c55e' : '#4d8fc8', border: 'none', cursor: 'pointer', transition: 'background 0.3s' }}>
        {submitted ? '✓ Subscribed' : 'Subscribe'}
      </motion.button>
    </form>
  );
};

// 12 · Character Counter Textarea
const CharacterCounter: React.FC = () => {
  const MAX = 280;
  const [text, setText] = useState('');
  const left = MAX - text.length;
  const pct = text.length / MAX;
  const color = pct > 0.9 ? '#ef4444' : pct > 0.75 ? '#f59e0b' : '#4d8fc8';
  const radius = 9; const circ = 2 * Math.PI * radius;

  return (
    <div className="w-full max-w-xs space-y-2">
      <textarea value={text} onChange={e => setText(e.target.value.slice(0, MAX))}
        placeholder="What's on your mind?"
        rows={3}
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
        style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${left < 20 ? color + '55' : 'rgba(255,255,255,0.09)'}`, color: 'rgba(255,255,255,0.82)', fontFamily: 'inherit' }} />
      <div className="flex items-center justify-between">
        <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="px-4 py-1.5 rounded-full text-xs font-semibold text-white"
          style={{ background: '#4d8fc8', border: 'none', cursor: 'pointer' }}>Post</motion.button>
        <div className="flex items-center gap-2">
          {left < 20 && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold tabular-nums" style={{ color }}>{left}</motion.span>}
          <svg width={24} height={24}>
            <circle cx={12} cy={12} r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={2} />
            <motion.circle cx={12} cy={12} r={radius} fill="none" stroke={color} strokeWidth={2}
              strokeDasharray={circ} strokeLinecap="round"
              animate={{ strokeDashoffset: circ * (1 - Math.min(pct, 1)), stroke: color }}
              transition={{ duration: 0.1 }}
              style={{ rotate: -90, transformOrigin: '12px 12px' }} />
          </svg>
        </div>
      </div>
    </div>
  );
};

// 13 · Loading Submit
const LoadingSubmit: React.FC = () => {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [email, setEmail] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    setTimeout(() => {
      setState(email.includes('@') ? 'success' : 'error');
      setTimeout(() => setState('idle'), 2500);
    }, 1800);
  };

  const cfg = { idle: { bg: '#4d8fc8', label: 'Send Magic Link' }, loading: { bg: '#3a7ab5', label: '' }, success: { bg: '#22c55e', label: '✓ Link Sent!' }, error: { bg: '#ef4444', label: '✗ Invalid Email' } };

  return (
    <form onSubmit={submit} className="w-full max-w-xs space-y-2">
      <div className="relative">
        <Mail size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email"
          className="w-full pl-8 pr-3 py-2.5 rounded-lg text-sm outline-none"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.82)' }} />
      </div>
      <motion.button type="submit" disabled={state !== 'idle'}
        animate={{ backgroundColor: cfg[state].bg }}
        whileTap={state === 'idle' ? { scale: 0.97 } : {}}
        className="w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2"
        style={{ border: 'none', cursor: state === 'idle' ? 'pointer' : 'default' }}>
        {state === 'loading' ? <Loader2 size={15} className="animate-spin" /> : cfg[state].label}
      </motion.button>
    </form>
  );
};

// 14 · Login / Signup Toggle  
const AuthToggle: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  return (
    <div className="w-full max-w-xs">
      <div className="flex rounded-lg p-0.5 mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
        {(['login', 'signup'] as const).map(m => (
          <button key={m} type="button" onClick={() => setMode(m)}
            className="flex-1 py-1.5 rounded-md text-xs font-semibold capitalize transition-all relative"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: mode === m ? '#fff' : 'rgba(255,255,255,0.35)', zIndex: 1 }}>
            {mode === m && <motion.div layoutId="auth-pill" className="absolute inset-0 rounded-md" style={{ background: '#4d8fc8', zIndex: -1 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }} />}
            {m === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={mode} initial={{ opacity: 0, x: mode === 'signup' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          className="space-y-2">
          {mode === 'signup' && <input placeholder="Full name" className="w-full px-3 py-2 rounded-lg text-xs outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)' }} />}
          <input placeholder="Email" className="w-full px-3 py-2 rounded-lg text-xs outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)' }} />
          <input placeholder="Password" type="password" className="w-full px-3 py-2 rounded-lg text-xs outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)' }} />
          <motion.button type="button" whileTap={{ scale: 0.97 }} className="w-full py-2.5 rounded-lg text-xs font-bold text-white"
            style={{ background: '#4d8fc8', border: 'none', cursor: 'pointer' }}>
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════

const SECTIONS = [
  {
    number: '01', title: 'Input Interactions', accent: '#4d8fc8',
    subtitle: 'Inputs that communicate clearly — animated labels, validation cues, and real-time formatting.',
    items: [
      { title: 'Floating Label',    description: 'Labels animate up into a compact header on focus or when a value is present, keeping the layout clean and contextual.',                                 useCase: 'Profile & settings forms',    Component: FloatingLabelInput },
      { title: 'OTP Code Input',    description: '6 individual digit boxes with auto-advance. Characters auto-move focus forward; backspace moves backward. Celebrates on completion.',                   useCase: 'Auth verification codes',     Component: OTPInput           },
      { title: 'Password Strength', description: 'Real-time three-tier strength meter with rule checklist. Eye toggle reveals the password. Strength color progresses red → amber → green.',             useCase: 'Account registration',        Component: PasswordStrength   },
      { title: 'Credit Card',       description: '3D flip card preview updates live as you type. CVV field flips to the back side on focus. Automatic number grouping with 4×4 formatting.',             useCase: 'Checkout payment flows',      Component: CreditCardInput    },
    ],
  },
  {
    number: '02', title: 'Search & Selects', accent: '#a78bfa',
    subtitle: 'Inputs that help users find and organise — live filtering, chip collections, and range controls.',
    items: [
      { title: 'Search Suggestions', description: 'Dropdown results filter as you type with staggered item entrance animations. Click to select, blur to close. Results are limited to top 5.',           useCase: 'Package / command palettes',  Component: SearchSuggestions },
      { title: 'Tag Chips Input',    description: 'Press Enter or comma to crystallise text into a coloured chip. Backspace removes the last chip. Each tag gets a unique accent hue from a cycle.',       useCase: 'Taxonomy / filtering UIs',    Component: TagInput          },
      { title: 'Range Slider',       description: 'Dual-handle price range slider — both thumbs animate with layout transitions. The active fill track re-sizes fluidly between handles.',                 useCase: 'Product filtering / pricing', Component: RangeSlider       },
      { title: 'Preference Toggles', description: 'Compact switch list for boolean settings. Each toggle slides its thumb with spring physics and background animates between off-grey and brand blue.',   useCase: 'Settings / notifications',    Component: ToggleSwitchForm  },
    ],
  },
  {
    number: '03', title: 'Multi-step & Complex', accent: '#34d399',
    subtitle: 'Forms that guide users through longer flows — progress, drag-and-drop, step transitions.',
    items: [
      { title: 'Multi-Step Form',   description: 'Three-step wizard with a progress timeline. Slide-in transitions change direction based on forward/back navigation.',                                    useCase: 'Onboarding / registration',   Component: MultiStepForm },
      { title: 'File Upload Zone',  description: 'Drag-and-drop zone with hover breathing animation. Simulates an upload with a live progress bar and transitions into a done state.',                     useCase: 'Media / document uploads',    Component: FileUpload    },
    ],
  },
  {
    number: '04', title: 'Feedback & Validation', accent: '#fb923c',
    subtitle: 'Forms that respond — shake on error, count characters, animate submit states, morph between modes.',
    items: [
      { title: 'Error Shake',           description: 'Invalid submit triggers a horizontal shake animation drawn from a spring easing curve. Border flashes red. Valid input turns green.',               useCase: 'Contact & subscribe forms',  Component: ErrorShake      },
      { title: 'Character Counter',     description: 'Twitter-style circular SVG counter turns amber then red as the limit approaches. The exact remaining count appears under 20 characters.',           useCase: 'Status / post composer',     Component: CharacterCounter },
      { title: 'Progressive Submit',    description: 'Four-state button flow: idle → loading spinner → success or error — each with its own colour and label. Auto-resets after 2.5 seconds.',           useCase: 'Magic link / API forms',     Component: LoadingSubmit   },
      { title: 'Login / Signup Toggle', description: 'Sliding pill indicator morphs between Login and Sign Up modes with slide transitions. The extra name field animates in on signup mode.',            useCase: 'Auth entry points',          Component: AuthToggle      },
    ],
  },
];

const Forms: React.FC = () => (
  <div className="min-h-screen" style={{ background: '#06080f', color: '#e4eaf0' }}>
    {/* Hero */}
    <div className="relative overflow-hidden" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 55% 60% at 0% 0%, rgba(77,143,200,0.1) 0%, transparent 65%)' }} />
      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-10 pb-9">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-[10px] tracking-[0.3em] uppercase mb-3 font-semibold" style={{ color: '#4d8fc8', opacity: 0.6, fontFamily: 'monospace' }}>Playground / UI Components</p>
          <h1 className="mb-3 leading-tight" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>Form Showcase</h1>
          <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'rgba(255,255,255,0.36)' }}>14 interactive form patterns — floating labels, OTP, credit cards, multi-step flows, validation feedback, and more. All built with React + Framer Motion.</p>
        </motion.div>
        <motion.div className="flex flex-wrap gap-2 mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }}>
          {['4 categories', '14 patterns', 'Accessible', 'All interactive'].map(tag => (
            <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.4)' }}>{tag}</span>
          ))}
        </motion.div>
      </div>
    </div>

    {/* Sections */}
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 space-y-16">
      {SECTIONS.map(section => (
        <motion.div key={section.number} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <SectionHeader number={section.number} title={section.title} subtitle={section.subtitle} accent={section.accent} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {section.items.map(item => (
              <ShowcaseCard key={item.title} title={item.title} description={item.description} useCase={item.useCase}>
                <item.Component />
              </ShowcaseCard>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default Forms;