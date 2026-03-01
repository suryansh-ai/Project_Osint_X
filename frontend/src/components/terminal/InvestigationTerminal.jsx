import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal, X, Send, Loader2, Download, Upload, Copy, CheckCircle,
  AlertTriangle, Shield, Zap, Clock, Globe, Database, Search,
  ChevronDown, ChevronRight, Trash2, Save, FileText, Settings,
  BarChart3, Network, Eye, Hash, Mail, Phone, MapPin, Wallet,
  User, Link2, Server, RefreshCw, Maximize2, Minimize2, Minus,
  Square, GripVertical, ExternalLink, ArrowUpRight, Crosshair,
  Activity, Radio, Cpu, Lock, Unlock, BookOpen, ScanLine, Grip
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ═══════════════════════════════════════════════════════════════
//  CONSTANTS & METADATA
// ═══════════════════════════════════════════════════════════════

const TYPE_META = {
  email:       { icon: Mail,    color: '#06b6d4', gradient: 'from-cyan-500 to-blue-500',    label: 'Email Address' },
  domain:      { icon: Globe,   color: '#3b82f6', gradient: 'from-blue-500 to-indigo-500',  label: 'Domain' },
  url:         { icon: Link2,   color: '#6366f1', gradient: 'from-indigo-500 to-violet-500', label: 'URL' },
  ipv4:        { icon: Server,  color: '#22c55e', gradient: 'from-green-500 to-emerald-500', label: 'IPv4 Address' },
  ipv6:        { icon: Server,  color: '#10b981', gradient: 'from-emerald-500 to-teal-500',  label: 'IPv6 Address' },
  phone:       { icon: Phone,   color: '#eab308', gradient: 'from-yellow-500 to-amber-500',  label: 'Phone Number' },
  md5:         { icon: Hash,    color: '#ef4444', gradient: 'from-red-500 to-rose-500',      label: 'MD5 Hash' },
  sha1:        { icon: Hash,    color: '#f97316', gradient: 'from-orange-500 to-red-500',    label: 'SHA-1 Hash' },
  sha256:      { icon: Hash,    color: '#ec4899', gradient: 'from-pink-500 to-rose-500',     label: 'SHA-256 Hash' },
  username:    { icon: User,    color: '#a855f7', gradient: 'from-purple-500 to-violet-500', label: 'Username' },
  btc_wallet:  { icon: Wallet,  color: '#f59e0b', gradient: 'from-amber-500 to-yellow-500',  label: 'Bitcoin Wallet' },
  eth_wallet:  { icon: Wallet,  color: '#8b5cf6', gradient: 'from-violet-500 to-purple-500', label: 'Ethereum Wallet' },
  upi:         { icon: Wallet,  color: '#10b981', gradient: 'from-emerald-500 to-green-500', label: 'UPI ID' },
  mac_address: { icon: Network, color: '#14b8a6', gradient: 'from-teal-500 to-cyan-500',    label: 'MAC Address' },
  geo_coords:  { icon: MapPin,  color: '#f43f5e', gradient: 'from-rose-500 to-pink-500',    label: 'Coordinates' },
  cve:         { icon: Shield,  color: '#ef4444', gradient: 'from-red-500 to-orange-500',   label: 'CVE ID' },
  general:     { icon: Search,  color: '#6b7280', gradient: 'from-gray-500 to-slate-500',   label: 'General Query' },
};

const SEVERITY = {
  critical: { bg: 'bg-red-500/15',    border: 'border-red-500/40',    text: 'text-red-400',    dot: 'bg-red-500',    glow: 'shadow-red-500/20' },
  high:     { bg: 'bg-orange-500/15',  border: 'border-orange-500/40',  text: 'text-orange-400',  dot: 'bg-orange-500',  glow: 'shadow-orange-500/20' },
  medium:   { bg: 'bg-yellow-500/15',  border: 'border-yellow-500/40',  text: 'text-yellow-400',  dot: 'bg-yellow-500',  glow: 'shadow-yellow-500/20' },
  low:      { bg: 'bg-blue-500/15',    border: 'border-blue-500/40',    text: 'text-blue-400',    dot: 'bg-blue-500',    glow: 'shadow-blue-500/20' },
  info:     { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/30',    text: 'text-cyan-400',    dot: 'bg-cyan-500',    glow: 'shadow-cyan-500/20' },
};

// ═══════════════════════════════════════════════════════════════
//  HOOKS
// ═══════════════════════════════════════════════════════════════

function useTypingEffect(text, speed = 10) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!text) { setDisplayed(''); setDone(true); return; }
    setDone(false); let i = 0; setDisplayed('');
    const id = setInterval(() => {
      i += 2;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return { displayed, done };
}

function useResizable(minW, minH, initialW, initialH) {
  const [size, setSize] = useState({ w: initialW, h: initialH });
  const resizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ w: 0, h: 0 });

  const startResize = useCallback((e, direction) => {
    e.preventDefault(); e.stopPropagation();
    resizing.current = direction;
    startPos.current = { x: e.clientX, y: e.clientY };
    startSize.current = { ...size };

    const onMove = (ev) => {
      if (!resizing.current) return;
      const dx = ev.clientX - startPos.current.x;
      const dy = ev.clientY - startPos.current.y;
      setSize({
        w: Math.max(minW, direction.includes('e') ? startSize.current.w + dx : direction.includes('w') ? startSize.current.w - dx : startSize.current.w),
        h: Math.max(minH, direction.includes('s') ? startSize.current.h + dy : direction.includes('n') ? startSize.current.h - dy : startSize.current.h),
      });
    };
    const onUp = () => { resizing.current = false; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [size, minW, minH]);

  return { size, setSize, startResize };
}

function useDraggable(initialX = 100, initialY = 80) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const dragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  const startDrag = useCallback((e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) return;
    dragging.current = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startPos.current = { ...pos };

    const onMove = (ev) => {
      if (!dragging.current) return;
      setPos({
        x: Math.max(0, startPos.current.x + (ev.clientX - startMouse.current.x)),
        y: Math.max(0, startPos.current.y + (ev.clientY - startMouse.current.y)),
      });
    };
    const onUp = () => { dragging.current = false; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [pos]);

  return { pos, setPos, startDrag };
}

// ═══════════════════════════════════════════════════════════════
//  INPUT CLASSIFICATION (client-side preview)
// ═══════════════════════════════════════════════════════════════

function classifyInput(q) {
  if (!q?.trim()) return null;
  q = q.trim();
  const upi = ['@upi','@ybl','@paytm','@okaxis','@oksbi','@okhdfcbank','@ibl','@axl','@sbi','@apl'];
  if (upi.some(s => q.toLowerCase().endsWith(s))) return { type: 'upi', confidence: 95 };
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(q)) return { type: 'email', confidence: 98 };
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(q)) return { type: 'ipv4', confidence: 99 };
  if (/^([0-9a-fA-F]{1,4}:){2,7}[0-9a-fA-F]{1,4}$/.test(q)) return { type: 'ipv6', confidence: 95 };
  if (/^[a-fA-F0-9]{32}$/.test(q)) return { type: 'md5', confidence: 90 };
  if (/^[a-fA-F0-9]{40}$/.test(q)) return { type: 'sha1', confidence: 92 };
  if (/^[a-fA-F0-9]{64}$/.test(q)) return { type: 'sha256', confidence: 95 };
  if (/^\+?[\d\s\-().]{7,18}$/.test(q)) return { type: 'phone', confidence: 85 };
  if (/^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,62}$/.test(q)) return { type: 'btc_wallet', confidence: 96 };
  if (/^0x[a-fA-F0-9]{40}$/.test(q)) return { type: 'eth_wallet', confidence: 97 };
  if (/^([0-9A-Fa-f]{2}[:\-]){5}[0-9A-Fa-f]{2}$/.test(q)) return { type: 'mac_address', confidence: 97 };
  if (/^-?\d{1,3}\.\d+,\s*-?\d{1,3}\.\d+$/.test(q)) return { type: 'geo_coords', confidence: 95 };
  if (/^CVE-\d{4}-\d{4,}$/i.test(q)) return { type: 'cve', confidence: 99 };
  if (/^https?:\/\/.+/i.test(q)) return { type: 'url', confidence: 95 };
  if (/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(q)) return { type: 'domain', confidence: 88 };
  if (/^[a-zA-Z0-9_.\-]{3,32}$/.test(q)) return { type: 'username', confidence: 60 };
  return { type: 'general', confidence: 30 };
}

// ═══════════════════════════════════════════════════════════════
//  SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

/* ── Risk Gauge ── */
const RiskGauge = ({ score = 0, level = 'N/A' }) => {
  const color = score >= 75 ? '#ef4444' : score >= 50 ? '#f97316' : score >= 25 ? '#eab308' : '#22c55e';
  const c = 2 * Math.PI * 42;
  const off = c - (score / 100) * c;
  return (
    <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
      <svg width="112" height="112" className="transform -rotate-90" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r="42" fill="none" stroke="#1e293b" strokeWidth="7" />
        <motion.circle cx="56" cy="56" r="42" fill="none" stroke={color} strokeWidth="7"
          strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: off }}
          transition={{ duration: 1.2, ease: 'easeOut' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-2xl font-black font-mono" style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, type: 'spring' }}>
          {score}
        </motion.span>
        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">{level}</span>
      </div>
    </div>
  );
};

/* ── Section expander ── */
const Section = ({ title, icon: Icon, children, defaultOpen = false, count, accentColor }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.06] bg-white/[0.02] mb-3">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-white/[0.03] transition text-left group">
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.15 }}>
          <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyan-400 transition" />
        </motion.div>
        {Icon && <Icon className="w-4 h-4" style={{ color: accentColor || '#06b6d4' }} />}
        <span className="text-sm font-medium text-gray-200 flex-1">{title}</span>
        {count !== undefined && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium"
            style={{ background: (accentColor || '#06b6d4') + '20', color: accentColor || '#06b6d4' }}>{count}</span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="px-4 pb-3 text-sm border-t border-white/[0.04]">
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Tool Progress ── */
const ToolProgress = ({ plan = [], timings = {}, errors = {}, results = {} }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
    {plan.map((tool, i) => {
      const done = timings[tool.name] !== undefined;
      const failed = errors[tool.name];
      return (
        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono transition
            ${failed ? 'bg-red-500/5 border border-red-500/20' : done ? 'bg-green-500/5 border border-green-500/20' : 'bg-white/[0.02] border border-white/[0.05]'}`}>
          <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
            {!done ? <Loader2 className="w-3 h-3 animate-spin text-cyan-400" /> :
              failed ? <X className="w-3 h-3 text-red-400" /> :
              <CheckCircle className="w-3 h-3 text-green-400" />}
          </span>
          <span className={`flex-1 truncate ${failed ? 'text-red-400/70' : done ? 'text-green-400/80' : 'text-cyan-300/50'}`}>
            {tool.name}
          </span>
          {done && <span className="text-gray-600 tabular-nums">{(timings[tool.name] / 1000).toFixed(1)}s</span>}
        </motion.div>
      );
    })}
  </div>
);

/* ── Relationship Graph (canvas) ── */
const RelationshipGraph = ({ nodes = [], edges = [] }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !nodes.length) return;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const cw = rect.width, ch = rect.height;

    const colors = {
      input: '#06b6d4', social: '#a855f7', exposure: '#ef4444',
      infrastructure: '#3b82f6', threat: '#f97316', financial: '#eab308', location: '#22c55e',
    };

    const positions = {};
    const root = nodes.find(n => n.id === 'root');
    if (root) positions[root.id] = { x: cw / 2, y: ch / 2 };
    const others = nodes.filter(n => n.id !== 'root');
    others.forEach((n, i) => {
      const angle = (2 * Math.PI * i) / others.length - Math.PI / 2;
      const radius = Math.min(cw, ch) / 2 - 50;
      positions[n.id] = { x: cw / 2 + Math.cos(angle) * radius, y: ch / 2 + Math.sin(angle) * radius };
    });

    let frame = 0;
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, cw, ch);
      frame++;
      edges.forEach(e => {
        const a = positions[e.from], b = positions[e.to];
        if (!a || !b) return;
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, 'rgba(6,182,212,0.25)');
        grad.addColorStop(1, 'rgba(6,182,212,0.05)');
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.stroke();
        const t = ((frame * 0.008) % 1);
        const px = a.x + (b.x - a.x) * t, py = a.y + (b.y - a.y) * t;
        ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6,182,212,0.6)'; ctx.fill();
      });
      nodes.forEach(n => {
        const pos = positions[n.id]; if (!pos) return;
        const col = colors[n.group] || '#6b7280';
        const r = n.id === 'root' ? 10 : 6;
        const glowGrad = ctx.createRadialGradient(pos.x, pos.y, r, pos.x, pos.y, r + 12);
        glowGrad.addColorStop(0, col + '40'); glowGrad.addColorStop(1, col + '00');
        ctx.beginPath(); ctx.arc(pos.x, pos.y, r + 12, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad; ctx.fill();
        ctx.beginPath(); ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fillStyle = col; ctx.fill();
        ctx.strokeStyle = col + '80'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = '#cbd5e1'; ctx.textAlign = 'center';
        ctx.font = n.id === 'root' ? 'bold 10px ui-monospace, monospace' : '8px ui-monospace, monospace';
        const label = (n.label || '').length > 18 ? n.label.slice(0, 17) + '…' : n.label;
        ctx.fillText(label, pos.x, pos.y + r + 14);
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [nodes, edges]);

  return (
    <div ref={containerRef} className="w-full h-72 relative">
      <canvas ref={canvasRef} className="w-full h-full rounded-xl" />
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
        {Object.entries({ input: '#06b6d4', social: '#a855f7', exposure: '#ef4444', infra: '#3b82f6', threat: '#f97316' }).map(([k, c]) => (
          <span key={k} className="flex items-center gap-1 text-[9px] font-mono text-gray-500 bg-black/40 backdrop-blur px-1.5 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} /> {k}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ── Boot Sequence ── */
const BootSequence = ({ onComplete }) => {
  const lines = [
    { text: '█▓▒░ OsintX Investigation Terminal v2.0 ░▒▓█', cls: 'text-cyan-400 font-bold' },
    { text: '[INIT] Loading neural OSINT engine...', cls: 'text-gray-400' },
    { text: '[LOAD] 48 intelligence modules registered', cls: 'text-gray-400' },
    { text: '[CONN] 95+ data source connectors active', cls: 'text-gray-400' },
    { text: '[  AI] Reasoning layer: ONLINE', cls: 'text-emerald-400' },
    { text: '[CRYP] AES-256-GCM encryption: ACTIVE', cls: 'text-emerald-400' },
    { text: '[STAT] All systems nominal — ready for investigation', cls: 'text-green-400 font-bold' },
  ];
  const [line, setLine] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (line >= lines.length) { setTimeout(onComplete, 200); return; }
    if (charIdx < lines[line].text.length) {
      const t = setTimeout(() => setCharIdx(c => c + 2), 8);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setLine(l => l + 1); setCharIdx(0); }, 60);
    return () => clearTimeout(t);
  }, [line, charIdx, onComplete]);

  return (
    <div className="p-5 font-mono text-xs leading-relaxed select-none">
      <div className="pointer-events-none fixed inset-0 z-[999] opacity-[0.03]"
        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.1) 2px, rgba(0,255,255,0.1) 4px)' }} />
      {lines.slice(0, line).map((l, i) => (
        <div key={i} className={`${l.cls} mb-0.5`}>{l.text}</div>
      ))}
      {line < lines.length && (
        <div className={lines[line].cls}>
          {lines[line].text.slice(0, charIdx)}
          <span className="inline-block w-2 h-3.5 bg-cyan-400 ml-px animate-pulse" />
        </div>
      )}
    </div>
  );
};

/* ── Welcome Screen ── */
const WelcomeScreen = ({ onExampleClick }) => {
  const examples = [
    { q: 'test@gmail.com', type: 'email' },
    { q: '8.8.8.8', type: 'ipv4' },
    { q: 'example.com', type: 'domain' },
    { q: 'octocat', type: 'username' },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 select-none">
      <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 
            flex items-center justify-center backdrop-blur-sm">
            <Terminal className="w-12 h-12 text-cyan-400" />
          </div>
          <motion.div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#070d18]"
            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 space-y-2">
        <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-mono">
          AI Investigation Copilot
        </h2>
        <p className="text-sm text-gray-500 font-mono max-w-md leading-relaxed">
          Enter any identifier below. The engine auto-detects the type and
          launches all relevant intelligence modules autonomously.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 max-w-xl">
        {Object.entries(TYPE_META).filter(([k]) => !['general','ipv6','sha1','sha256','eth_wallet','upi','mac_address','geo_coords'].includes(k)).map(([key, m]) => {
          const I = m.icon;
          return (
            <div key={key} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]
              text-xs font-mono text-gray-400 hover:border-cyan-500/30 hover:text-cyan-400 transition cursor-default">
              <I className="w-3.5 h-3.5 flex-shrink-0" style={{ color: m.color }} />
              <span className="truncate">{m.label}</span>
            </div>
          );
        })}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        className="flex flex-wrap justify-center gap-2 mt-5">
        <span className="text-[10px] text-gray-600 font-mono mr-1 self-center">Try:</span>
        {examples.map((ex, i) => (
          <button key={i} onClick={() => onExampleClick(ex.q)}
            className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 
              hover:bg-cyan-500/20 hover:border-cyan-400/40 transition">
            {ex.q}
          </button>
        ))}
      </motion.div>

      <div className="flex gap-4 mt-6 text-[10px] font-mono text-gray-600">
        <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-cyan-500" /> Instant ~15s</span>
        <span className="flex items-center gap-1"><ScanLine className="w-3 h-3 text-orange-500" /> Deep Scan 1-3min</span>
      </div>
    </div>
  );
};

/* ── Running View ── */
const RunningView = ({ session }) => {
  const meta = TYPE_META[session.classification?.type] || TYPE_META.general;
  const Icon = meta.icon;
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" 
        style={{ background: meta.color + '08', borderColor: meta.color + '30' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: meta.color + '15' }}>
          <Icon className="w-5 h-5" style={{ color: meta.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-sm text-gray-200 font-medium truncate">{session.query}</p>
          <p className="text-[10px] font-mono text-gray-500">{meta.label} • {session.classification?.confidence}% confidence</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-mono text-xs tabular-nums">{elapsed}s</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 pl-1">
        {[
          { text: 'Input classified successfully', delay: 0, done: true },
          { text: 'Tool dispatch plan generated', delay: 0.3, done: true },
          { text: 'Executing intelligence modules in parallel...', delay: 0.7, done: false },
          { text: 'AI reasoning engine awaiting data...', delay: 1.2, done: false },
        ].map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: step.delay }}
            className="flex items-center gap-2 font-mono text-xs">
            {step.done ? <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" /> :
              <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin flex-shrink-0" />}
            <span className={step.done ? 'text-green-400/70' : 'text-cyan-300/60'}>{step.text}</span>
          </motion.div>
        ))}
      </div>

      <div className="space-y-2 mt-4">
        {[80, 65, 50, 90, 35].map((w, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
            className="h-3 rounded-full bg-cyan-500/20" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
};

/* ── Results View ── */
const ResultsView = ({ session, onExportJSON, onExportCSV, onExportPDF, onCopy, copied }) => {
  const r = session.result;
  if (!r) return null;
  const { analysis, investigation, toolResults, toolTimings, toolErrors, graph, stats } = r;
  const meta = TYPE_META[investigation?.classification?.type] || TYPE_META.general;
  const Icon = meta.icon;
  const { displayed: summaryText, done: summaryDone } = useTypingEffect(analysis?.executiveSummary, 4);
  const [expandedFindings, setExpandedFindings] = useState({});
  const [expandedTools, setExpandedTools] = useState({});

  const toggleFinding = (i) => setExpandedFindings(p => ({ ...p, [i]: !p[i] }));
  const toggleTool = (name) => setExpandedTools(p => ({ ...p, [name]: !p[name] }));
  const copyText = (text) => { navigator.clipboard.writeText(text); };

  return (
    <div className="p-5 space-y-5">
      {/* ═══ HERO CARD ═══ */}
      <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 px-5 py-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: meta.color + '15', border: `1px solid ${meta.color}30` }}>
              <Icon className="w-6 h-6" style={{ color: meta.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-mono text-base font-bold text-white truncate">{investigation?.query}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] font-mono text-gray-500">
                <span className="px-1.5 py-0.5 rounded bg-white/[0.06]">{investigation?.classification?.type?.toUpperCase()}</span>
                <span>{investigation?.duration}</span>
                <span className="hidden sm:inline">ID: {investigation?.id?.slice(0, 12)}</span>
                {analysis?.categoryBreakdown && (
                  <div className="flex gap-1 ml-1">
                    {analysis.categoryBreakdown.critical > 0 && <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">{analysis.categoryBreakdown.critical}C</span>}
                    {analysis.categoryBreakdown.high > 0 && <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold">{analysis.categoryBreakdown.high}H</span>}
                    {analysis.categoryBreakdown.medium > 0 && <span className="px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-400">{analysis.categoryBreakdown.medium}M</span>}
                    {analysis.categoryBreakdown.info > 0 && <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{analysis.categoryBreakdown.info}I</span>}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              {[
                { fn: onCopy, icon: copied ? CheckCircle : Copy, tip: 'Copy', cls: 'hover:text-cyan-400' },
                { fn: onExportJSON, icon: Download, tip: 'JSON', cls: 'hover:text-blue-400' },
                { fn: onExportCSV, icon: FileText, tip: 'CSV', cls: 'hover:text-yellow-400' },
                { fn: onExportPDF, icon: BookOpen, tip: 'Report', cls: 'hover:text-rose-400' },
              ].map((btn, i) => (
                <button key={i} onClick={btn.fn} title={btn.tip}
                  className={`p-2 rounded-lg text-gray-500 ${btn.cls} hover:bg-white/[0.05] transition`}>
                  <btn.icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Risk + Executive Summary */}
        <div className="flex flex-col md:flex-row gap-5 p-5 bg-black/20">
          <RiskGauge score={analysis?.riskScore || 0} level={analysis?.riskLevel || 'N/A'} />
          <div className="flex-1 min-w-0 space-y-3">
            <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Executive Summary</h4>
            <p className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-line">
              {summaryText}
              {!summaryDone && <span className="inline-block w-1.5 h-4 bg-cyan-400/80 animate-pulse ml-0.5 align-middle" />}
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-5 divide-x divide-white/[0.04] bg-black/10">
          {[
            { label: 'Tools Run', val: stats?.toolsExecuted, icon: Cpu, color: '#06b6d4' },
            { label: 'Succeeded', val: stats?.toolsSucceeded, icon: CheckCircle, color: '#22c55e' },
            { label: 'Failed', val: stats?.toolsFailed, icon: AlertTriangle, color: '#ef4444' },
            { label: 'Findings', val: analysis?.totalFindings, icon: Eye, color: '#eab308' },
            { label: 'IOCs', val: analysis?.iocs?.length || 0, icon: Crosshair, color: '#f97316' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * i }}
              className="px-3 py-3 text-center">
              <s.icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: s.color }} />
              <p className="text-lg font-bold font-mono" style={{ color: s.color }}>{s.val || 0}</p>
              <p className="text-[8px] text-gray-500 font-mono uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══ IDENTITY INTELLIGENCE (NEW) ═══ */}
      {analysis?.identitySummary?.primaryName && (
        <Section title="Identity Intelligence" icon={User} defaultOpen={true} count={analysis.identitySummary.totalAccounts} accentColor="#a855f7">
          <div className="flex items-start gap-4 mb-4">
            {analysis.identitySummary.photos?.[0] && (
              <img src={analysis.identitySummary.photos[0]} alt="Profile"
                className="w-14 h-14 rounded-xl border-2 border-purple-500/30 bg-slate-800 object-cover"
                onError={e => { e.target.style.display = 'none'; }} />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-bold text-white">{analysis.identitySummary.primaryName}</h4>
              {analysis.identitySummary.names.length > 1 && (
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">Also known as: {analysis.identitySummary.names.slice(1, 4).join(', ')}</p>
              )}
              {analysis.identitySummary.locations.length > 0 && (
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3 text-purple-400 flex-shrink-0" />{analysis.identitySummary.locations.join(' · ')}</p>
              )}
              {analysis.identitySummary.bios[0] && (
                <p className="text-[10px] text-gray-500 italic mt-1 line-clamp-2">&ldquo;{analysis.identitySummary.bios[0]}&rdquo;</p>
              )}
              {analysis.identitySummary.emails.length > 0 && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Mail className="w-3 h-3 text-purple-400 flex-shrink-0" />
                  {analysis.identitySummary.emails.map((em, i) => (
                    <span key={i} className="text-[10px] font-mono text-cyan-400">{em}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-black font-mono text-purple-400">{analysis.identitySummary.totalAccounts}</p>
              <p className="text-[8px] text-gray-500 uppercase tracking-wider font-mono">Accounts</p>
            </div>
          </div>
          {analysis.identitySummary.accounts.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {analysis.identitySummary.accounts.slice(0, 15).map((acc, i) => {
                const Wrapper = acc.url ? 'a' : 'div';
                const wrapperProps = acc.url ? { href: acc.url, target: '_blank', rel: 'noopener noreferrer' } : {};
                return (
                  <Wrapper key={i} {...wrapperProps}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-purple-500/5 border border-purple-500/15 text-xs font-mono hover:bg-purple-500/10 transition truncate cursor-pointer">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                    <span className="text-purple-300 truncate">{acc.platform}</span>
                    {acc.url && <ExternalLink className="w-2.5 h-2.5 text-gray-600 flex-shrink-0 ml-auto" />}
                  </Wrapper>
                );
              })}
            </div>
          )}
        </Section>
      )}

      {/* ═══ THREAT ASSESSMENT (NEW) ═══ */}
      {analysis?.threatAssessment?.length > 0 && (
        <Section title="Threat Assessment Matrix" icon={Shield} defaultOpen={true} count={analysis.threatAssessment.length} accentColor="#ef4444">
          <div className="space-y-3">
            {analysis.threatAssessment.map((cat, i) => {
              const color = cat.level === 'critical' ? '#ef4444' : cat.level === 'high' ? '#f97316' : cat.level === 'medium' ? '#eab308' : '#22c55e';
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 group">
                  <span className="text-xs text-gray-400 w-36 truncate font-mono">{cat.name}</span>
                  <div className="flex-1 h-3 bg-slate-800/80 rounded-full overflow-hidden border border-white/[0.04]">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${cat.score}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                      className="h-full rounded-full relative"
                      style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}>
                      {cat.score >= 20 && (
                        <span className="absolute right-1.5 top-0 h-full flex items-center text-[8px] font-bold font-mono text-white/80">
                          {cat.score}
                        </span>
                      )}
                    </motion.div>
                  </div>
                  {cat.score < 20 && <span className="text-xs font-mono font-bold w-8 text-right" style={{ color }}>{cat.score}</span>}
                  <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded w-16 text-center ${
                    cat.level === 'critical' ? 'bg-red-500/15 text-red-400' :
                    cat.level === 'high' ? 'bg-orange-500/15 text-orange-400' :
                    cat.level === 'medium' ? 'bg-yellow-500/15 text-yellow-400' :
                    'bg-green-500/15 text-green-400'
                  }`}>{cat.level}</span>
                </motion.div>
              );
            })}
          </div>
        </Section>
      )}

      {/* ═══ FINDINGS (ENHANCED) ═══ */}
      {analysis?.findings?.length > 0 && (
        <Section title="Detailed Findings" icon={AlertTriangle} defaultOpen={true} count={analysis.findings.length} accentColor="#ef4444">
          <div className="space-y-2">
            {analysis.findings.map((f, i) => {
              const sev = SEVERITY[f.severity] || SEVERITY.info;
              const isExpanded = expandedFindings[i];
              return (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className={`rounded-xl border overflow-hidden ${sev.bg} ${sev.border}`}>
                  <button onClick={() => toggleFinding(i)}
                    className="w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-white/[0.02] transition">
                    <span className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${sev.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${sev.text} leading-relaxed`}>{f.text}</p>
                      <p className="text-[10px] text-gray-600 mt-0.5">{f.source}</p>
                    </div>
                    <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded ${sev.text} bg-black/20 flex-shrink-0`}>{f.severity}</span>
                    {(f.detail || f.evidence) && (
                      <ChevronDown className={`w-3 h-3 text-gray-600 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                  <AnimatePresence>
                    {isExpanded && (f.detail || f.evidence) && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                        className="border-t border-white/[0.04]">
                        <div className="px-4 py-3 space-y-2">
                          {f.detail && (
                            <p className="text-[11px] text-gray-400 leading-relaxed font-mono">{f.detail}</p>
                          )}
                          {f.evidence && Array.isArray(f.evidence) && f.evidence.length > 0 && (
                            <div className="mt-2">
                              <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-1.5">Supporting Evidence</p>
                              <div className="space-y-1.5">
                                {f.evidence.slice(0, 6).map((ev, j) => (
                                  <div key={j} className="px-3 py-2 rounded-lg bg-black/20 border border-white/[0.04]">
                                    {typeof ev === 'object' ? (
                                      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] font-mono">
                                        {Object.entries(ev).filter(([k, v]) => v != null && v !== '' && !['html','description'].includes(k)).slice(0, 8).map(([k, v]) => (
                                          <div key={k} className="flex items-center">
                                            <span className="text-gray-600 mr-1.5">{k}:</span>
                                            <span className="text-gray-300 truncate">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-[10px] font-mono text-gray-300">{String(ev)}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </Section>
      )}

      {/* ═══ RELATIONSHIP GRAPH ═══ */}
      {graph?.nodes?.length > 1 && (
        <Section title="Relationship Graph" icon={Network} count={graph.nodes.length} accentColor="#a855f7">
          <RelationshipGraph nodes={graph.nodes} edges={graph.edges} />
        </Section>
      )}

      {/* ═══ IOC TABLE (NEW) ═══ */}
      {analysis?.iocs?.length > 0 && (
        <Section title="Indicators of Compromise" icon={Crosshair} count={analysis.iocs.length} accentColor="#f97316">
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-2 px-2 text-gray-500 font-medium text-[10px] uppercase tracking-wider">Type</th>
                  <th className="text-left py-2 px-2 text-gray-500 font-medium text-[10px] uppercase tracking-wider">Value</th>
                  <th className="text-left py-2 px-2 text-gray-500 font-medium text-[10px] uppercase tracking-wider">Severity</th>
                  <th className="text-left py-2 px-2 text-gray-500 font-medium text-[10px] uppercase tracking-wider hidden sm:table-cell">Context</th>
                  <th className="py-2 px-1 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {analysis.iocs.map((ioc, i) => {
                  const sev = SEVERITY[ioc.severity] || SEVERITY.info;
                  return (
                    <motion.tr key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                      <td className="py-1.5 px-2">
                        <span className="px-1.5 py-0.5 rounded bg-white/[0.05] text-gray-400 text-[10px]">{ioc.type}</span>
                      </td>
                      <td className="py-1.5 px-2 text-cyan-300 max-w-[200px] truncate">{ioc.value}</td>
                      <td className="py-1.5 px-2">
                        <span className={`text-[9px] uppercase font-bold ${sev.text}`}>{ioc.severity}</span>
                      </td>
                      <td className="py-1.5 px-2 text-gray-500 max-w-[200px] truncate hidden sm:table-cell">{ioc.context}</td>
                      <td className="py-1.5 px-1">
                        <button onClick={() => copyText(ioc.value)}
                          className="p-1 hover:bg-white/[0.06] rounded transition group">
                          <Copy className="w-3 h-3 text-gray-600 group-hover:text-cyan-400 transition" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* ═══ TIMELINE (ENHANCED) ═══ */}
      {analysis?.timeline?.length > 0 && (
        <Section title="Threat Timeline" icon={Clock} count={analysis.timeline.length} accentColor="#3b82f6">
          <div className="relative ml-3 border-l-2 border-white/[0.06] space-y-4 py-1">
            {analysis.timeline.map((t, i) => {
              const sev = SEVERITY[t.severity] || SEVERITY.info;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  className="relative pl-5">
                  <span className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ${sev.dot} ring-2 ring-[#070d18]`} />
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${sev.text}`}>{t.event}</p>
                      {t.detail && <p className="text-[10px] text-gray-500 mt-0.5 font-mono">{t.detail}</p>}
                      <p className="text-[10px] text-gray-600 mt-0.5">{t.date || 'Unknown date'} · {t.source}</p>
                    </div>
                    <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${sev.text} bg-black/20`}>{t.severity}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Section>
      )}

      {/* ═══ RECOMMENDATIONS (ENHANCED) ═══ */}
      {analysis?.recommendations?.length > 0 && (
        <Section title="Actionable Recommendations" icon={Zap} count={analysis.recommendations.length} accentColor="#22c55e">
          <div className="space-y-2">
            {analysis.recommendations.map((rec, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-start gap-2.5 text-xs">
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold flex-shrink-0 mt-0.5 ${
                  rec.priority === 'Critical' ? 'bg-red-500/15 text-red-400' :
                  rec.priority === 'High' ? 'bg-orange-500/15 text-orange-400' :
                  rec.priority === 'Medium' ? 'bg-yellow-500/15 text-yellow-400' :
                  'bg-green-500/15 text-green-400'
                }`}>{rec.priority}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-gray-300 leading-relaxed">{rec.text}</span>
                  {rec.category && (
                    <span className="inline-block ml-2 text-[9px] text-gray-600 font-mono">[{rec.category}]</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* ═══ INTELLIGENCE MODULE RESULTS (REPLACES RAW JSON) ═══ */}
      {analysis?.toolSummaries && Object.keys(analysis.toolSummaries).length > 0 && (
        <Section title="Intelligence Module Results" icon={Cpu} count={Object.keys(analysis.toolSummaries).length} accentColor="#06b6d4">
          <div className="space-y-2">
            {Object.entries(analysis.toolSummaries).map(([name, sum]) => {
              const timing = toolTimings?.[name];
              const hasError = toolErrors?.[name];
              const isExpanded = expandedTools[name];
              return (
                <div key={name} className={`rounded-xl border overflow-hidden transition ${
                  hasError ? 'border-red-500/20 bg-red-500/[0.03]' : 'border-white/[0.06] bg-white/[0.015]'}`}>
                  <button onClick={() => toggleTool(name)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.02] transition text-left">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${hasError ? 'bg-red-500' : 'bg-green-500'}`} />
                    <span className="text-xs font-medium text-gray-200 flex-1 truncate">{name}</span>
                    {sum.keyFindings?.length > 0 && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 font-mono flex-shrink-0">
                        {sum.keyFindings.length} findings
                      </span>
                    )}
                    {sum.links?.length > 0 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-mono flex-shrink-0">
                        {sum.links.length} links
                      </span>
                    )}
                    {timing && <span className="text-[10px] text-gray-600 font-mono flex-shrink-0 tabular-nums">{(timing / 1000).toFixed(1)}s</span>}
                    <ChevronDown className={`w-3 h-3 text-gray-600 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                        className="border-t border-white/[0.04]">
                        <div className="px-4 py-3">
                          {/* Error state */}
                          {hasError && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 mb-3">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                              <span className="text-xs text-red-400 font-mono">{toolErrors[name]}</span>
                            </div>
                          )}

                          {/* Key Findings */}
                          {sum.keyFindings?.length > 0 && (
                            <div className="mb-3">
                              <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-2 font-mono">Key Findings</p>
                              <div className="space-y-1.5">
                                {sum.keyFindings.map((f, i) => (
                                  <div key={i} className="flex items-start gap-2 text-xs">
                                    <CheckCircle className="w-3 h-3 text-cyan-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-300 leading-relaxed">{f}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Data Points Grid */}
                          {Object.keys(sum.dataPoints || {}).filter(k => sum.dataPoints[k] != null && sum.dataPoints[k] !== '').length > 0 && (
                            <div className="mb-3">
                              <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-2 font-mono">Data Points</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 p-3 rounded-lg bg-black/20 border border-white/[0.04]">
                                {Object.entries(sum.dataPoints).filter(([, v]) => v != null && v !== '').map(([k, v]) => (
                                  <div key={k} className="flex items-center text-[11px] overflow-hidden">
                                    <span className="text-gray-500 mr-2 flex-shrink-0 min-w-[90px]">{k}</span>
                                    <span className={`font-mono truncate ${
                                      String(v).includes('⚠') || String(v) === 'YES ⚠' ? 'text-red-400 font-bold' :
                                      String(v) === 'active' || String(v) === 'Detected' || String(v) === 'Yes' || String(v) === 'Present' ? 'text-emerald-400' :
                                      'text-gray-300'
                                    }`}>{String(v)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Links */}
                          {sum.links?.length > 0 && (
                            <div>
                              <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-2 font-mono">Investigation Links</p>
                              <div className="flex flex-wrap gap-1.5">
                                {sum.links.slice(0, 10).map((l, i) => (
                                  <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-[10px] border border-cyan-500/15 hover:bg-cyan-500/20 transition font-mono">
                                    {l.label}<ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Raw JSON toggle */}
                          {toolResults?.[name] && (
                            <details className="mt-3">
                              <summary className="text-[10px] text-gray-600 cursor-pointer font-mono hover:text-cyan-400 transition">
                                View raw JSON response
                              </summary>
                              <pre className="text-[9px] text-gray-500 mt-2 p-3 bg-black/30 rounded-xl overflow-x-auto max-h-48 custom-scrollbar border border-white/[0.04] font-mono leading-relaxed">
                                {JSON.stringify(toolResults[name], null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* ═══ DATA SOURCES ═══ */}
      {stats?.dataSources?.length > 0 && (
        <Section title="Data Sources" icon={Database} count={stats.dataSources.length} accentColor="#8b5cf6">
          <div className="flex flex-wrap gap-1.5">
            {stats.dataSources.map((ds, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] font-mono text-cyan-400">{ds}</span>
            ))}
          </div>
        </Section>
      )}

      {/* ═══ ANALYST NOTES ═══ */}
      <Section title="Analyst Notes" icon={FileText} accentColor="#f59e0b">
        <textarea
          className="w-full bg-black/20 border border-white/[0.06] rounded-xl p-3 text-xs font-mono text-gray-300 
            placeholder-gray-700 outline-none focus:border-cyan-500/30 resize-y min-h-[60px] transition"
          placeholder="Add your investigation notes here..."
          defaultValue={session.notes}
        />
      </Section>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
//  Modes: fullscreen | windowed | minimized
//  Props: isTab=true renders inline (no overlay) for dashboard tab
// ═══════════════════════════════════════════════════════════════

const InvestigationTerminal = ({ isOpen, onClose, userId, isTab = false }) => {
  const [booted, setBooted] = useState(false);
  const [input, setInput] = useState('');
  const [scanMode, setScanMode] = useState('instant');
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [copied, setCopied] = useState(false);
  const [windowMode, setWindowMode] = useState('fullscreen');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const fileInputRef = useRef(null);

  const { size, setSize, startResize } = useResizable(500, 400, 900, 600);
  const { pos, setPos, startDrag } = useDraggable(100, 80);

  const detectedType = useMemo(() => classifyInput(input), [input]);

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [sessions, activeSession]);

  useEffect(() => {
    if (booted && inputRef.current) inputRef.current.focus();
  }, [booted]);

  useEffect(() => {
    if (windowMode === 'windowed') {
      setPos({ x: Math.max(0, (window.innerWidth - size.w) / 2), y: Math.max(0, (window.innerHeight - size.h) / 2) });
    }
  }, [windowMode]);

  useEffect(() => {
    if (isTab) return;
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (windowMode === 'fullscreen') onClose?.();
        else if (windowMode === 'windowed') setWindowMode('minimized');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [windowMode, isTab, onClose]);

  const investigate = useCallback(async (overrideQuery) => {
    const query = (overrideQuery || input).trim();
    if (!query || isInvestigating) return;
    if (!overrideQuery) setInput('');
    setIsInvestigating(true);
    const det = classifyInput(query);

    const session = {
      id: Date.now(), query, timestamp: new Date().toISOString(),
      status: 'running', classification: det || { type: 'general', confidence: 30 },
      result: null, notes: '',
    };
    setSessions(prev => [session, ...prev]);
    setActiveSession(session.id);

    try {
      const res = await fetch(`${API_BASE}/terminal/investigate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, mode: scanMode }),
      });
      const data = await res.json();
      setSessions(prev => prev.map(s =>
        s.id === session.id ? { ...s, status: 'completed', result: data, classification: data.investigation?.classification || s.classification } : s
      ));
    } catch (err) {
      setSessions(prev => prev.map(s =>
        s.id === session.id ? { ...s, status: 'error', error: err.message } : s
      ));
    } finally {
      setIsInvestigating(false);
    }
  }, [input, scanMode, isInvestigating]);

  const exportJSON = (s) => {
    const blob = new Blob([JSON.stringify(s.result, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `osintx-${s.query}-${Date.now()}.json`; a.click();
  };
  const exportCSV = (s) => {
    if (!s.result?.analysis?.findings) return;
    const rows = [['Severity','Source','Finding'], ...s.result.analysis.findings.map(f => [f.severity, f.source, `"${f.text}"`])];
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `osintx-findings-${s.query}-${Date.now()}.csv`; a.click();
  };
  const exportPDF = (s) => {
    const r = s.result; if (!r) return;
    const html = `<!DOCTYPE html><html><head><title>OsintX Report - ${r.investigation?.query}</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Courier New',monospace;background:#0a0f1a;color:#e2e8f0;padding:40px;max-width:960px;margin:0 auto}
    .header{border-bottom:2px solid #06b6d4;padding-bottom:16px;margin-bottom:20px}h1{color:#06b6d4;font-size:24px}
    h2{color:#38bdf8;margin:24px 0 12px;font-size:16px;border-left:3px solid #06b6d4;padding-left:8px}
    .meta{color:#64748b;font-size:11px;margin-top:4px}.risk{font-size:56px;font-weight:900;text-align:center;padding:24px}
    table{width:100%;border-collapse:collapse;margin:8px 0;font-size:12px}td,th{border:1px solid #1e293b;padding:8px;text-align:left}th{background:#0f172a;color:#94a3b8}
    .c{color:#ef4444;font-weight:700}.h{color:#f97316}.m{color:#eab308}.l{color:#3b82f6}
    ul{padding-left:20px;margin:8px 0}li{margin:4px 0;font-size:12px}
    @media print{body{background:#fff;color:#000}th{background:#f1f5f9;color:#334155}td,th{border-color:#cbd5e1}}</style></head>
    <body><div class="header"><h1>OsintX Investigation Report</h1>
    <p class="meta">Generated: ${new Date().toISOString()} | ID: ${r.investigation?.id} | Mode: ${r.investigation?.mode} | Duration: ${r.investigation?.duration}</p></div>
    <h2>Target</h2><table><tr><th>Query</th><td>${r.investigation?.query}</td></tr><tr><th>Type</th><td>${r.investigation?.classification?.type?.toUpperCase()}</td></tr>
    <tr><th>Confidence</th><td>${r.investigation?.classification?.confidence}%</td></tr>
    <tr><th>Tools</th><td>${r.stats?.toolsExecuted} run (${r.stats?.toolsSucceeded} ok, ${r.stats?.toolsFailed} failed)</td></tr></table>
    <div class="risk" style="color:${r.analysis?.riskScore >= 75 ? '#ef4444' : r.analysis?.riskScore >= 50 ? '#f97316' : r.analysis?.riskScore >= 25 ? '#eab308' : '#22c55e'}">
    ${r.analysis?.riskScore}/100 — ${r.analysis?.riskLevel}</div>
    <h2>Executive Summary</h2><p style="font-size:13px;line-height:1.6">${r.analysis?.executiveSummary || 'N/A'}</p>
    <h2>Findings (${r.analysis?.totalFindings || 0})</h2><table><tr><th>Severity</th><th>Source</th><th>Detail</th></tr>
    ${(r.analysis?.findings || []).map(f => `<tr><td class="${f.severity[0]}">${f.severity.toUpperCase()}</td><td>${f.source}</td><td>${f.text}</td></tr>`).join('')}</table>
    ${r.analysis?.timeline?.length ? `<h2>Timeline</h2><table><tr><th>Date</th><th>Event</th><th>Source</th></tr>${r.analysis.timeline.map(t => `<tr><td>${t.date||'?'}</td><td>${t.event}</td><td>${t.source}</td></tr>`).join('')}</table>` : ''}
    <h2>Recommendations</h2><ul>${(r.analysis?.recommendations||[]).map(rec => `<li><strong>[${rec.priority}]</strong> ${rec.text}</li>`).join('')}</ul>
    <h2>Data Sources</h2><p style="font-size:12px">${(r.stats?.dataSources||[]).join(', ')||'N/A'}</p>
    <hr style="margin:24px 0;border-color:#1e293b"><p class="meta">Report by OsintX AI Investigation Terminal. Authorized use only.</p></body></html>`;
    const w = window.open('', '_blank'); w.document.write(html); w.document.close();
    setTimeout(() => w.print(), 400);
  };

  const importCSV = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const lines = ev.target.result.trim().split('\n').slice(1);
      for (const line of lines) {
        const query = line.split(',')[0]?.trim().replace(/^"|"$/g, '');
        if (query) { await investigate(query); await new Promise(r => setTimeout(r, 1000)); }
      }
    };
    reader.readAsText(file);
  };

  const copyResult = (s) => {
    if (!s.result) return;
    navigator.clipboard.writeText(JSON.stringify(s.result, null, 2));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const deleteSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSession === id) setActiveSession(null);
  };

  const clearSessions = () => { setSessions([]); setActiveSession(null); };
  const currentSession = sessions.find(s => s.id === activeSession);

  if (!isOpen && !isTab) return null;

  // ── MINIMIZED ──
  if (windowMode === 'minimized' && !isTab) {
    return (
      <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200]">
        <div className="flex items-center gap-3 px-5 py-3 bg-[#0a1520] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10 backdrop-blur-xl cursor-pointer hover:border-cyan-400/50 transition"
          onClick={() => setWindowMode('windowed')}>
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-mono text-cyan-300 font-medium">OsintX Terminal</span>
          {isInvestigating && <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
          {sessions.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-[10px] font-mono text-cyan-400 font-medium">{sessions.length}</span>
          )}
          <div className="flex items-center gap-1 ml-3 border-l border-white/[0.08] pl-3">
            <button onClick={(e) => { e.stopPropagation(); setWindowMode('windowed'); }}
              className="p-1.5 text-gray-500 hover:text-cyan-400 transition rounded-lg hover:bg-white/[0.05]" title="Restore">
              <Maximize2 className="w-3.5 h-3.5" /></button>
            <button onClick={(e) => { e.stopPropagation(); setWindowMode('fullscreen'); }}
              className="p-1.5 text-gray-500 hover:text-green-400 transition rounded-lg hover:bg-white/[0.05]" title="Fullscreen">
              <Square className="w-3 h-3" /></button>
            <button onClick={(e) => { e.stopPropagation(); onClose?.(); }}
              className="p-1.5 text-gray-500 hover:text-red-400 transition rounded-lg hover:bg-red-500/10" title="Close">
              <X className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </motion.div>
    );
  }

  const isFS = windowMode === 'fullscreen' || isTab;

  // ── Title Bar ──
  const TitleBar = (
    <div className={`flex items-center gap-2 px-3 py-2 border-b border-white/[0.06] select-none flex-shrink-0
      ${isTab ? 'bg-slate-900/50' : 'bg-gradient-to-r from-[#0a1118] via-[#0d1520] to-[#0a1118]'}`}
      onMouseDown={!isTab && !isFS ? startDrag : undefined}
      style={!isTab && !isFS ? { cursor: 'move' } : {}}>
      
      {!isTab && (
        <div className="flex gap-1.5 mr-1">
          <button onClick={onClose}
            className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 transition group relative">
            <X className="w-2 h-2 text-[#ff5f57] group-hover:text-black/60 absolute inset-0.5 opacity-0 group-hover:opacity-100 transition" />
          </button>
          <button onClick={() => setWindowMode('minimized')}
            className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#febc2e]/80 transition group relative">
            <Minus className="w-2 h-2 text-[#febc2e] group-hover:text-black/60 absolute inset-0.5 opacity-0 group-hover:opacity-100 transition" />
          </button>
          <button onClick={() => setWindowMode(isFS ? 'windowed' : 'fullscreen')}
            className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#28c840]/80 transition group relative">
            <Maximize2 className="w-1.5 h-1.5 text-[#28c840] group-hover:text-black/60 absolute inset-[3px] opacity-0 group-hover:opacity-100 transition" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.04]">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-mono text-cyan-300/90 font-medium hidden sm:inline">OsintX Terminal</span>
        </div>
        <span className="text-[9px] text-gray-600 font-mono">v2.0</span>
        {isInvestigating && (
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center gap-1 text-[10px] font-mono text-cyan-400/60">
            <Radio className="w-3 h-3" /> investigating
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button onClick={() => setScanMode(m => m === 'instant' ? 'deep' : 'instant')}
          className={`flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 rounded-lg border transition ${
            scanMode === 'deep'
              ? 'border-orange-500/30 text-orange-400 bg-orange-500/10 hover:bg-orange-500/15'
              : 'border-cyan-500/20 text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10'
          }`}>
          {scanMode === 'instant' ? <><Zap className="w-3 h-3" /> INSTANT</> : <><ScanLine className="w-3 h-3" /> DEEP</>}
        </button>
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 text-gray-500 hover:text-cyan-400 hover:bg-white/[0.04] rounded-lg transition" title="Toggle sidebar">
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        {!isTab && (
          <>
            <button onClick={() => setWindowMode('minimized')}
              className="p-1.5 text-gray-500 hover:text-yellow-400 hover:bg-white/[0.04] rounded-lg transition" title="Minimize">
              <Minus className="w-3.5 h-3.5" /></button>
            <button onClick={() => setWindowMode(isFS ? 'windowed' : 'fullscreen')}
              className="p-1.5 text-gray-500 hover:text-green-400 hover:bg-white/[0.04] rounded-lg transition" title="Toggle size">
              {isFS ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}</button>
            <button onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition" title="Close">
              <X className="w-3.5 h-3.5" /></button>
          </>
        )}
      </div>
    </div>
  );

  // ── Sidebar ──
  const Sidebar = (
    <div className={`border-r border-white/[0.04] bg-black/20 flex flex-col overflow-hidden transition-all duration-300
      ${sidebarCollapsed ? 'w-0 min-w-0 opacity-0 border-r-0' : 'w-52 min-w-[13rem]'}`}>
      <div className="p-3 border-b border-white/[0.04] flex items-center justify-between">
        <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
          <Clock className="w-3 h-3" /> Sessions
        </h3>
        {sessions.length > 0 && (
          <button onClick={clearSessions} className="text-gray-600 hover:text-red-400 transition" title="Clear all">
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {sessions.length === 0 ? (
          <p className="text-[10px] text-gray-700 p-3 font-mono text-center">No investigations</p>
        ) : sessions.map(s => {
          const sType = TYPE_META[s.classification?.type] || TYPE_META.general;
          const SIcon = sType.icon;
          return (
            <div key={s.id} className={`relative group ${activeSession === s.id ? 'bg-cyan-500/[0.07]' : 'hover:bg-white/[0.02]'}`}>
              <button onClick={() => setActiveSession(s.id)}
                className={`w-full text-left px-3 py-2.5 border-b border-white/[0.03] transition ${
                  activeSession === s.id ? 'border-l-2 border-l-cyan-500' : ''}`}>
                <div className="flex items-center gap-2">
                  <SIcon className="w-3 h-3 flex-shrink-0" style={{ color: sType.color }} />
                  <span className="text-xs font-mono text-gray-300 truncate">{s.query}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 ml-5">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    s.status === 'running' ? 'bg-yellow-400 animate-pulse' : s.status === 'error' ? 'bg-red-400' : 'bg-green-400'}`} />
                  <span className="text-[9px] text-gray-600 font-mono">{new Date(s.timestamp).toLocaleTimeString()}</span>
                  {s.result?.analysis?.riskScore !== undefined && (
                    <span className={`text-[9px] font-mono font-bold ${
                      s.result.analysis.riskScore >= 75 ? 'text-red-400' : s.result.analysis.riskScore >= 50 ? 'text-orange-400' : 
                      s.result.analysis.riskScore >= 25 ? 'text-yellow-400' : 'text-green-400'
                    }`}>{s.result.analysis.riskScore}</span>
                  )}
                </div>
              </button>
              <button onClick={() => deleteSession(s.id)}
                className="absolute top-2 right-2 p-1 rounded text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition">
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          );
        })}
      </div>
      <div className="p-2 border-t border-white/[0.04] flex gap-1">
        <button onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-1 text-[10px] font-mono px-2 py-1.5 rounded-lg
            bg-white/[0.03] text-gray-500 hover:text-cyan-400 hover:bg-white/[0.06] transition border border-white/[0.05]">
          <Upload className="w-3 h-3" /> Import
        </button>
        <input ref={fileInputRef} type="file" accept=".csv" onChange={importCSV} className="hidden" />
        {currentSession?.result && (
          <button onClick={() => exportJSON(currentSession)}
            className="flex-1 flex items-center justify-center gap-1 text-[10px] font-mono px-2 py-1.5 rounded-lg
              bg-white/[0.03] text-gray-500 hover:text-cyan-400 hover:bg-white/[0.06] transition border border-white/[0.05]">
            <Download className="w-3 h-3" /> Export
          </button>
        )}
      </div>
    </div>
  );

  // ── Input Bar ──
  const InputBar = (
    <div className="border-t border-white/[0.06] bg-black/30 px-4 py-3 flex-shrink-0">
      <AnimatePresence>
        {detectedType && input.trim() && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 mb-2 text-xs font-mono overflow-hidden">
            {(() => { const T = TYPE_META[detectedType.type]?.icon || Search; return <T className="w-3.5 h-3.5" style={{ color: TYPE_META[detectedType.type]?.color }} />; })()}
            <span style={{ color: TYPE_META[detectedType.type]?.color }}>{TYPE_META[detectedType.type]?.label}</span>
            <span className="text-gray-600">detected</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
              detectedType.confidence >= 90 ? 'bg-green-500/15 text-green-400' :
              detectedType.confidence >= 70 ? 'bg-yellow-500/15 text-yellow-400' :
              'bg-gray-500/10 text-gray-500'
            }`}>{detectedType.confidence}%</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center gap-3">
        <span className="text-cyan-500 font-mono text-sm font-bold select-none">❯</span>
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) investigate(); }}
          disabled={isInvestigating}
          placeholder={isInvestigating ? 'Investigation in progress...' : 'Enter email, IP, domain, hash, phone, username, wallet, CVE...'}
          className="flex-1 bg-transparent text-cyan-50 placeholder-gray-700 outline-none font-mono text-sm 
            caret-cyan-400 disabled:opacity-40"
          autoComplete="off" spellCheck={false} />
        <button onClick={() => investigate()} disabled={!input.trim() || isInvestigating}
          className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 
            hover:from-cyan-500/30 hover:to-blue-500/30 disabled:opacity-20 disabled:cursor-not-allowed 
            transition border border-cyan-500/20 hover:border-cyan-400/40">
          {isInvestigating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  // ── Terminal Content Shell ──
  const terminalContent = (
    <div className={`w-full h-full bg-[#070d18] flex flex-col overflow-hidden
      ${isTab ? 'rounded-2xl border border-white/[0.08]' : !isFS ? 'rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/50' : ''}`}
      style={{ position: 'relative' }}>
      {TitleBar}
      <div className="flex flex-1 overflow-hidden">
        {Sidebar}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div ref={outputRef} className="flex-1 overflow-y-auto custom-scrollbar">
            {!booted ? (
              <BootSequence onComplete={() => setBooted(true)} />
            ) : !currentSession ? (
              <WelcomeScreen onExampleClick={(q) => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }} />
            ) : currentSession.status === 'running' ? (
              <RunningView session={currentSession} />
            ) : currentSession.status === 'error' ? (
              <div className="p-5 font-mono text-sm">
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span className="text-red-400">{currentSession.error || 'Investigation failed'}</span>
                </div>
              </div>
            ) : (
              <ResultsView session={currentSession}
                onExportJSON={() => exportJSON(currentSession)}
                onExportCSV={() => exportCSV(currentSession)}
                onExportPDF={() => exportPDF(currentSession)}
                onCopy={() => copyResult(currentSession)}
                copied={copied} />
            )}
          </div>
          {InputBar}
        </div>
      </div>
      {/* Resize handles */}
      {!isTab && windowMode === 'windowed' && (
        <>
          <div className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize z-20" onMouseDown={(e) => startResize(e, 'se')} />
          <div className="absolute bottom-0 left-0 right-5 h-1.5 cursor-s-resize z-20" onMouseDown={(e) => startResize(e, 's')} />
          <div className="absolute top-8 bottom-0 right-0 w-1.5 cursor-e-resize z-20" onMouseDown={(e) => startResize(e, 'e')} />
          <div className="absolute top-8 bottom-0 left-0 w-1.5 cursor-w-resize z-20" onMouseDown={(e) => startResize(e, 'w')} />
          <div className="absolute top-0 left-0 right-0 h-1.5 cursor-n-resize z-20" onMouseDown={(e) => startResize(e, 'n')} />
          <div className="absolute bottom-1.5 right-1.5 text-gray-700 pointer-events-none z-10">
            <Grip className="w-3 h-3" />
          </div>
        </>
      )}
    </div>
  );

  // ── TAB mode: inline, no overlay ──
  if (isTab) {
    return <div className="w-full h-[calc(100vh-140px)]">{terminalContent}</div>;
  }

  // ── FULLSCREEN ──
  if (isFS) {
    return (
      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-[#070d18]">
          {terminalContent}
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── WINDOWED (draggable + resizable) ──
  return (
    <>
      {/* Dim backdrop */}
      <div className="fixed inset-0 z-[199] bg-black/40 backdrop-blur-sm" onClick={() => setWindowMode('minimized')} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="fixed z-[200]"
        style={{ left: pos.x, top: pos.y, width: size.w, height: size.h }}>
        {terminalContent}
      </motion.div>
    </>
  );
};

export default InvestigationTerminal;
