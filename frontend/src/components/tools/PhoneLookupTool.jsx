// ═══════════════════════════════════════════════════════════════════════════════
// ██████╗ ██╗  ██╗ ██████╗ ███╗   ██╗███████╗    ██╗███╗   ██╗████████╗███████╗██╗
// ██╔══██╗██║  ██║██╔═══██╗████╗  ██║██╔════╝    ██║████╗  ██║╚══██╔══╝██╔════╝██║
// ██████╔╝███████║██║   ██║██╔██╗ ██║█████╗      ██║██╔██╗ ██║   ██║   █████╗  ██║
// ██╔═══╝ ██╔══██║██║   ██║██║╚██╗██║██╔══╝      ██║██║╚██╗██║   ██║   ██╔══╝  ██║
// ██║     ██║  ██║╚██████╔╝██║ ╚████║███████╗    ██║██║ ╚████║   ██║   ███████╗███████╗
// ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝    ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚══════╝
//  MEGA PHONE INTELLIGENCE ENGINE v6 — 17+ OSINT Sources · Multi-Engine Analysis · PhoneInfoga · OSINT Dorks
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Search, Globe, Shield, Signal, AlertTriangle, CheckCircle, AlertCircle,
  Copy, Download, X, ChevronDown, Info, Hash, Lock, ExternalLink, Activity,
  Radio, Database, MapPin, Smartphone, Cpu, Clock, RefreshCw, Zap, Link2,
  MessageSquare, BarChart3, Target, User, Map, Building, Calendar, Flag, Mail,
  FileText, Crosshair, Layers, BookOpen, Code, Eye,
} from 'lucide-react';
import { useToast } from '../common/Toast';
import { useHistory } from '../../context/HistoryContext';
import useClipboard from '../../context/hooks/useClipboard';
import { trackToolUsage } from '../../utils/analytics';
import { exportToJSON, exportToCSV, formatForExport } from '../../utils/export';

// Leaflet for map visualization
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon — wrapped in try-catch for safety
try {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
} catch (e) {
  console.warn('[PhoneLookupTool] Leaflet icon fix failed:', e);
}

// ═══════════════════════════════════════════════════════════════
// COUNTRY CODES DATABASE — 60+ countries with flags & formats
// ═══════════════════════════════════════════════════════════════
const COUNTRY_CODES = [
  { code: 'US', dial: '+1',   flag: '🇺🇸', name: 'United States',    format: '(XXX) XXX-XXXX',     maxLen: 10, region: 'Americas' },
  { code: 'GB', dial: '+44',  flag: '🇬🇧', name: 'United Kingdom',   format: 'XXXX XXXXXX',        maxLen: 11, region: 'Europe' },
  { code: 'IN', dial: '+91',  flag: '🇮🇳', name: 'India',            format: 'XXXXX XXXXX',        maxLen: 10, region: 'Asia' },
  { code: 'DE', dial: '+49',  flag: '🇩🇪', name: 'Germany',          format: 'XXXX XXXXXXX',       maxLen: 11, region: 'Europe' },
  { code: 'FR', dial: '+33',  flag: '🇫🇷', name: 'France',           format: 'X XX XX XX XX',      maxLen: 10, region: 'Europe' },
  { code: 'IT', dial: '+39',  flag: '🇮🇹', name: 'Italy',            format: 'XXX XXX XXXX',       maxLen: 10, region: 'Europe' },
  { code: 'ES', dial: '+34',  flag: '🇪🇸', name: 'Spain',            format: 'XXX XXX XXX',        maxLen: 9,  region: 'Europe' },
  { code: 'AU', dial: '+61',  flag: '🇦🇺', name: 'Australia',        format: 'XXXX XXX XXX',       maxLen: 10, region: 'Oceania' },
  { code: 'CA', dial: '+1',   flag: '🇨🇦', name: 'Canada',           format: '(XXX) XXX-XXXX',     maxLen: 10, region: 'Americas' },
  { code: 'JP', dial: '+81',  flag: '🇯🇵', name: 'Japan',            format: 'XX-XXXX-XXXX',       maxLen: 10, region: 'Asia' },
  { code: 'KR', dial: '+82',  flag: '🇰🇷', name: 'South Korea',      format: 'XX-XXXX-XXXX',       maxLen: 10, region: 'Asia' },
  { code: 'CN', dial: '+86',  flag: '🇨🇳', name: 'China',            format: 'XXX XXXX XXXX',      maxLen: 11, region: 'Asia' },
  { code: 'RU', dial: '+7',   flag: '🇷🇺', name: 'Russia',           format: '(XXX) XXX-XX-XX',    maxLen: 10, region: 'Europe/Asia' },
  { code: 'BR', dial: '+55',  flag: '🇧🇷', name: 'Brazil',           format: '(XX) XXXXX-XXXX',    maxLen: 11, region: 'Americas' },
  { code: 'MX', dial: '+52',  flag: '🇲🇽', name: 'Mexico',           format: 'XX XXXX XXXX',       maxLen: 10, region: 'Americas' },
  { code: 'TR', dial: '+90',  flag: '🇹🇷', name: 'Turkey',           format: 'XXX XXX XXXX',       maxLen: 10, region: 'Europe/Asia' },
  { code: 'SA', dial: '+966', flag: '🇸🇦', name: 'Saudi Arabia',     format: 'XX XXX XXXX',        maxLen: 9,  region: 'Middle East' },
  { code: 'AE', dial: '+971', flag: '🇦🇪', name: 'UAE',              format: 'XX XXX XXXX',        maxLen: 9,  region: 'Middle East' },
  { code: 'PK', dial: '+92',  flag: '🇵🇰', name: 'Pakistan',         format: 'XXX XXXXXXX',        maxLen: 10, region: 'Asia' },
  { code: 'BD', dial: '+880', flag: '🇧🇩', name: 'Bangladesh',       format: 'XXXX XXXXXX',        maxLen: 10, region: 'Asia' },
  { code: 'ID', dial: '+62',  flag: '🇮🇩', name: 'Indonesia',        format: 'XXX XXXX XXXX',      maxLen: 12, region: 'Asia' },
  { code: 'TH', dial: '+66',  flag: '🇹🇭', name: 'Thailand',         format: 'XX XXX XXXX',        maxLen: 9,  region: 'Asia' },
  { code: 'VN', dial: '+84',  flag: '🇻🇳', name: 'Vietnam',          format: 'XXX XXX XXXX',       maxLen: 10, region: 'Asia' },
  { code: 'PH', dial: '+63',  flag: '🇵🇭', name: 'Philippines',      format: 'XXX XXX XXXX',       maxLen: 10, region: 'Asia' },
  { code: 'MY', dial: '+60',  flag: '🇲🇾', name: 'Malaysia',         format: 'XX XXXX XXXX',       maxLen: 10, region: 'Asia' },
  { code: 'SG', dial: '+65',  flag: '🇸🇬', name: 'Singapore',        format: 'XXXX XXXX',          maxLen: 8,  region: 'Asia' },
  { code: 'NG', dial: '+234', flag: '🇳🇬', name: 'Nigeria',          format: 'XXX XXX XXXX',       maxLen: 10, region: 'Africa' },
  { code: 'KE', dial: '+254', flag: '🇰🇪', name: 'Kenya',            format: 'XXX XXXXXX',         maxLen: 9,  region: 'Africa' },
  { code: 'ZA', dial: '+27',  flag: '🇿🇦', name: 'South Africa',     format: 'XX XXX XXXX',        maxLen: 9,  region: 'Africa' },
  { code: 'EG', dial: '+20',  flag: '🇪🇬', name: 'Egypt',            format: 'XX XXXX XXXX',       maxLen: 10, region: 'Africa' },
  { code: 'NL', dial: '+31',  flag: '🇳🇱', name: 'Netherlands',      format: 'X XXXXXXXX',         maxLen: 9,  region: 'Europe' },
  { code: 'SE', dial: '+46',  flag: '🇸🇪', name: 'Sweden',           format: 'XX XXX XXXX',        maxLen: 9,  region: 'Europe' },
  { code: 'NO', dial: '+47',  flag: '🇳🇴', name: 'Norway',           format: 'XXXX XXXX',          maxLen: 8,  region: 'Europe' },
  { code: 'DK', dial: '+45',  flag: '🇩🇰', name: 'Denmark',          format: 'XXXX XXXX',          maxLen: 8,  region: 'Europe' },
  { code: 'FI', dial: '+358', flag: '🇫🇮', name: 'Finland',          format: 'XX XXXXXXX',         maxLen: 9,  region: 'Europe' },
  { code: 'PL', dial: '+48',  flag: '🇵🇱', name: 'Poland',           format: 'XXX XXX XXX',        maxLen: 9,  region: 'Europe' },
  { code: 'UA', dial: '+380', flag: '🇺🇦', name: 'Ukraine',          format: 'XX XXX XXXX',        maxLen: 9,  region: 'Europe' },
  { code: 'NP', dial: '+977', flag: '🇳🇵', name: 'Nepal',            format: 'XXXX XXXXXX',        maxLen: 10, region: 'Asia' },
  { code: 'LK', dial: '+94',  flag: '🇱🇰', name: 'Sri Lanka',        format: 'XX XXX XXXX',        maxLen: 9,  region: 'Asia' },
  { code: 'IL', dial: '+972', flag: '🇮🇱', name: 'Israel',           format: 'XX XXX XXXX',        maxLen: 9,  region: 'Middle East' },
  { code: 'GR', dial: '+30',  flag: '🇬🇷', name: 'Greece',           format: 'XXX XXX XXXX',       maxLen: 10, region: 'Europe' },
  { code: 'AF', dial: '+93',  flag: '🇦🇫', name: 'Afghanistan',      format: 'XX XXX XXXX',        maxLen: 9,  region: 'Asia' },
  { code: 'IR', dial: '+98',  flag: '🇮🇷', name: 'Iran',             format: 'XXX XXX XXXX',       maxLen: 10, region: 'Middle East' },
  { code: 'IQ', dial: '+964', flag: '🇮🇶', name: 'Iraq',             format: 'XXX XXX XXXX',       maxLen: 10, region: 'Middle East' },
  { code: 'QA', dial: '+974', flag: '🇶🇦', name: 'Qatar',            format: 'XXXX XXXX',          maxLen: 8,  region: 'Middle East' },
  { code: 'OM', dial: '+968', flag: '🇴🇲', name: 'Oman',             format: 'XXXX XXXX',          maxLen: 8,  region: 'Middle East' },
  { code: 'BH', dial: '+973', flag: '🇧🇭', name: 'Bahrain',          format: 'XXXX XXXX',          maxLen: 8,  region: 'Middle East' },
  { code: 'KW', dial: '+965', flag: '🇰🇼', name: 'Kuwait',           format: 'XXXX XXXX',          maxLen: 8,  region: 'Middle East' },
  { code: 'JO', dial: '+962', flag: '🇯🇴', name: 'Jordan',           format: 'X XXXX XXXX',        maxLen: 9,  region: 'Middle East' },
  { code: 'LB', dial: '+961', flag: '🇱🇧', name: 'Lebanon',          format: 'XX XXX XXX',         maxLen: 8,  region: 'Middle East' },
  { code: 'AR', dial: '+54',  flag: '🇦🇷', name: 'Argentina',        format: 'XX XXXX-XXXX',       maxLen: 10, region: 'Americas' },
  { code: 'CL', dial: '+56',  flag: '🇨🇱', name: 'Chile',            format: 'X XXXX XXXX',        maxLen: 9,  region: 'Americas' },
  { code: 'CO', dial: '+57',  flag: '🇨🇴', name: 'Colombia',         format: 'XXX XXX XXXX',       maxLen: 10, region: 'Americas' },
  { code: 'PT', dial: '+351', flag: '🇵🇹', name: 'Portugal',         format: 'XXX XXX XXX',        maxLen: 9,  region: 'Europe' },
  { code: 'CH', dial: '+41',  flag: '🇨🇭', name: 'Switzerland',      format: 'XX XXX XX XX',       maxLen: 9,  region: 'Europe' },
  { code: 'AT', dial: '+43',  flag: '🇦🇹', name: 'Austria',          format: 'XXXX XXXXXX',        maxLen: 11, region: 'Europe' },
  { code: 'BE', dial: '+32',  flag: '🇧🇪', name: 'Belgium',          format: 'XXX XX XX XX',       maxLen: 9,  region: 'Europe' },
  { code: 'IE', dial: '+353', flag: '🇮🇪', name: 'Ireland',          format: 'XX XXX XXXX',        maxLen: 9,  region: 'Europe' },
  { code: 'NZ', dial: '+64',  flag: '🇳🇿', name: 'New Zealand',      format: 'XX XXX XXXX',        maxLen: 9,  region: 'Oceania' },
  { code: 'OTHER', dial: '+', flag: '🌐', name: 'Other / Direct',   format: 'Full number with +', maxLen: 15, region: 'Other' },
];

// ═══════════════════════════════════════════════════════════════
// RISK GAUGE — SVG semicircle with animated needle
// ═══════════════════════════════════════════════════════════════
function RiskGauge({ score, level }) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const angle = -90 + (clampedScore / 100) * 180;
  const getColor = (s) => {
    if (s <= 20) return '#10b981';
    if (s <= 45) return '#f59e0b';
    if (s <= 70) return '#f97316';
    return '#ef4444';
  };
  const color = getColor(clampedScore);
  return (
    <div className="flex flex-col items-center p-5 rounded-2xl bg-gradient-to-b from-slate-800/40 to-slate-900/40 border border-white/5">
      <svg width="200" height="120" viewBox="0 0 200 120">
        <defs>
          <linearGradient id="phoneGauge" x1="0%" y1="0%" x2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="65%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <path d="M 20 105 A 80 80 0 0 1 180 105" fill="none" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" />
        <path d="M 20 105 A 80 80 0 0 1 180 105" fill="none" stroke="url(#phoneGauge)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${clampedScore * 2.51} 251`}
          style={{ transition: 'stroke-dasharray 1.5s ease-out' }} />
        <motion.line
          x1="100" y1="105" x2="100" y2="35" stroke={color} strokeWidth="3" strokeLinecap="round"
          initial={{ rotate: -90, originX: '100px', originY: '105px' }}
          animate={{ rotate: angle }}
          transition={{ type: 'spring', damping: 15 }}
          style={{ transformOrigin: '100px 105px' }}
        />
        <circle cx="100" cy="105" r="6" fill={color} />
        <text x="100" y="85" textAnchor="middle" fill={color} fontSize="28" fontWeight="bold">{clampedScore}</text>
        <text x="100" y="100" textAnchor="middle" fill="#9ca3af" fontSize="10">/100</text>
        <text x="20" y="118" textAnchor="start" fill="#4ade80" fontSize="9">LOW</text>
        <text x="180" y="118" textAnchor="end" fill="#ef4444" fontSize="9">CRITICAL</text>
      </svg>
      <div className="flex items-center gap-2 mt-1">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm font-bold" style={{ color }}>{level}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SOURCE BADGE
// ═══════════════════════════════════════════════════════════════
function SourceBadge({ name, status = 'success' }) {
  const colors = {
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    failed: 'bg-red-500/15 text-red-400 border-red-500/30',
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${colors[status] || colors.success}`}>
      {status === 'success' ? <CheckCircle className="w-3 h-3" /> : status === 'failed' ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
      {name}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════
// INFO ROW
// ═══════════════════════════════════════════════════════════════
function InfoRow({ icon: Icon, label, value, mono, highlight, copyable, onCopy }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4, backgroundColor: 'rgba(245,158,11,0.05)' }}
      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-white/5 group transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        {Icon && <Icon className="w-4 h-4 text-amber-400 flex-shrink-0" />}
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2 min-w-0">
        <span className={`text-sm truncate max-w-[220px] ${highlight ? 'text-amber-300 font-semibold' : mono ? 'font-mono text-cyan-300' : 'text-white font-medium'}`}>
          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
        </span>
        {copyable && value && (
          <button onClick={() => onCopy?.(String(value))} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10">
            <Copy className="w-3 h-3 text-gray-500" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════════════════════════════
function StatCard({ icon: Icon, label, value, color = 'text-amber-400', sub }) {
  return (
    <div className="p-3 rounded-xl bg-slate-800/40 border border-white/5 text-center group hover:border-amber-500/20 transition-colors">
      <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
      <div className={`font-semibold text-sm ${color}`}>{value || 'N/A'}</div>
      <div className="text-xs text-gray-500">{label}</div>
      {sub && <div className="text-[10px] text-gray-600 mt-0.5">{sub}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// NUMBER PERMUTATION ENGINE — Format variations for OSINT searching
// ═══════════════════════════════════════════════════════════════
function NumberPermutations({ phone, countryDial, onCopy }) {
  if (!phone) return null;
  const raw = phone.replace(/[^0-9]/g, '');
  const withPlus = phone.startsWith('+') ? phone : `+${phone}`;
  const withoutPlus = phone.replace(/^\+/, '');
  const national = countryDial ? withoutPlus.replace(new RegExp(`^${countryDial.replace('+', '')}`), '') : raw;
  const dialCode = countryDial ? countryDial.replace('+', '') : '';

  const permutations = [
    { label: 'E.164',           value: withPlus },
    { label: 'No +',            value: withoutPlus },
    { label: 'National',        value: national },
    { label: '0-Prefixed',      value: `0${national}` },
    { label: 'Dashed',          value: withPlus.replace(/(\d{2,4})/g, '$1-').replace(/-$/, '') },
    { label: 'Dotted',          value: withPlus.replace(/(\d{2,4})/g, '$1.').replace(/\.$/, '') },
    { label: 'Spaced',          value: withPlus.replace(/(\d{2,4})/g, '$1 ').trim() },
    { label: 'Parenthesized',   value: dialCode ? `(${dialCode}) ${national}` : `(${raw.slice(0, 3)}) ${raw.slice(3)}` },
    { label: 'URL-encoded',     value: encodeURIComponent(withPlus) },
    { label: 'tel: URI',        value: `tel:${withPlus}` },
    { label: 'Google Dork',     value: `"${withPlus}" OR "${withoutPlus}" OR "${national}"` },
    { label: 'Reverse (Digits)',value: raw.split('').reverse().join('') },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-indigo-300 text-sm font-medium">
        <Hash className="w-4 h-4" />
        Number Permutations ({permutations.length})
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {permutations.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-white/5 group hover:border-indigo-500/20 transition-colors">
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">{p.label}</div>
              <div className="text-xs font-mono text-gray-300 truncate">{p.value}</div>
            </div>
            <button onClick={() => onCopy?.(p.value)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/10 transition-all flex-shrink-0 ml-2">
              <Copy className="w-3 h-3 text-indigo-400" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LINKED NUMBER SCANNER — Adjacent ±3 numbers quick-check
// ═══════════════════════════════════════════════════════════════
function LinkedNumberScanner({ phone, countryDial }) {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState([]);
  const [range, setRange] = useState(3);

  const generateAdjacentNumbers = useCallback(() => {
    if (!phone) return [];
    const raw = phone.replace(/[^0-9]/g, '');
    const base = parseInt(raw, 10);
    if (isNaN(base)) return [];
    const nums = [];
    for (let i = -range; i <= range; i++) {
      if (i === 0) continue;
      const adj = (base + i).toString().padStart(raw.length, '0');
      const full = phone.startsWith('+') ? `+${adj}` : adj;
      nums.push({ number: full, offset: i > 0 ? `+${i}` : `${i}`, status: 'pending' });
    }
    return nums;
  }, [phone, range]);

  const scanAdjacent = useCallback(async () => {
    const nums = generateAdjacentNumbers();
    if (nums.length === 0) return;
    setScanning(true);
    setResults(nums);

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const updated = [...nums];

    for (let i = 0; i < nums.length; i++) {
      try {
        const resp = await fetch(`${API_BASE}/tools/phone/quick-check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: nums[i].number }),
        });
        const data = await resp.json();
        updated[i] = { ...updated[i], ...data, status: data.valid ? 'valid' : 'invalid' };
      } catch {
        updated[i] = { ...updated[i], status: 'error' };
      }
      setResults([...updated]);
    }
    setScanning(false);
  }, [generateAdjacentNumbers]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-teal-300 text-sm font-medium">
          <Target className="w-4 h-4" />
          Adjacent Number Scanner
        </div>
        <div className="flex items-center gap-2">
          <select value={range} onChange={e => setRange(Number(e.target.value))}
            className="px-2 py-1 rounded-lg bg-slate-800/70 border border-white/10 text-xs text-gray-300 focus:outline-none">
            <option value={1}>±1</option>
            <option value={3}>±3</option>
            <option value={5}>±5</option>
            <option value={10}>±10</option>
          </select>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={scanAdjacent}
            disabled={scanning || !phone}
            className="px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-300 text-xs font-medium disabled:opacity-40 transition-colors flex items-center gap-1.5">
            {scanning ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><RefreshCw className="w-3 h-3" /></motion.div> Scanning...</> : <><Search className="w-3 h-3" /> Scan</>}
          </motion.button>
        </div>
      </div>
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
          {results.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
              className={`flex items-center justify-between p-2 rounded-lg border ${
                r.status === 'valid' ? 'bg-emerald-500/10 border-emerald-500/20' :
                r.status === 'invalid' ? 'bg-slate-800/30 border-white/5' :
                r.status === 'error' ? 'bg-red-500/10 border-red-500/20' :
                'bg-slate-800/20 border-white/5'
              }`}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] text-gray-500 w-6">{r.offset}</span>
                <span className="text-xs font-mono text-gray-300 truncate">{r.number}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {r.status === 'valid' && <span className="text-[10px] text-emerald-400">{r.type || 'Valid'}</span>}
                {r.status === 'valid' && r.carrier && r.carrier !== 'Unknown' && (
                  <span className="text-[10px] text-cyan-400 max-w-[80px] truncate">{r.carrier}</span>
                )}
                {r.status === 'valid' && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                {r.status === 'invalid' && <X className="w-3 h-3 text-gray-600" />}
                {r.status === 'error' && <AlertCircle className="w-3 h-3 text-red-400" />}
                {r.status === 'pending' && <Clock className="w-3 h-3 text-gray-600 animate-pulse" />}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {results.length === 0 && (
        <div className="text-center py-4 text-gray-600 text-xs">
          Click Scan to check adjacent numbers (same carrier block analysis)
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CASE NOTES & TAGS — localStorage-based per-number notes
// ═══════════════════════════════════════════════════════════════
const TAG_PRESETS = [
  { label: 'Person of Interest', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { label: 'Verified',           color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { label: 'Suspicious',         color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { label: 'Burner / Disposable',color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { label: 'VoIP',               color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
  { label: 'Scammer',            color: 'bg-red-600/20 text-red-300 border-red-600/30' },
  { label: 'Linked to Case',     color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { label: 'Associate',          color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { label: 'Cleared',            color: 'bg-green-500/20 text-green-400 border-green-500/30' },
];

function CaseNotes({ phone }) {
  const storageKey = `osintx_phone_notes_${phone?.replace(/[^0-9+]/g, '') || 'unknown'}`;
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState([]);
  const [saved, setSaved] = useState(false);

  // Load on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotes(parsed.notes || '');
        setTags(parsed.tags || []);
      }
    } catch {}
  }, [storageKey]);

  const save = useCallback(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ notes, tags, phone, updatedAt: new Date().toISOString() }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
  }, [notes, tags, phone, storageKey]);

  const toggleTag = useCallback((label) => {
    setTags(prev => prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
          <FileText className="w-4 h-4" />
          Case Notes
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={save}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            saved ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'bg-slate-700/50 border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
          }`}>
          {saved ? <><CheckCircle className="w-3 h-3" /> Saved</> : <><Download className="w-3 h-3" /> Save</>}
        </motion.button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {TAG_PRESETS.map(tag => (
          <button key={tag.label} onClick={() => toggleTag(tag.label)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
              tags.includes(tag.label) ? tag.color + ' ring-1 ring-white/10' : 'bg-slate-800/30 text-gray-600 border-white/5 hover:text-gray-400'
            }`}>
            {tag.label}
          </button>
        ))}
      </div>

      {/* Notes textarea */}
      <textarea value={notes} onChange={e => setNotes(e.target.value)}
        placeholder="Add investigation notes, observations, leads..."
        rows={6}
        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-amber-500/30 resize-none scrollbar-thin" />
      <div className="text-[10px] text-gray-600 flex items-center justify-between">
        <span>Notes are saved locally per phone number</span>
        <span>{notes.length} chars</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LIVE SCAN BUTTON — Per-platform social check
// ═══════════════════════════════════════════════════════════════
function LiveScanButton({ platform, phone, onResult }) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const scan = useCallback(async () => {
    if (!phone || !platform) return;
    setScanning(true);
    setResult(null);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const resp = await fetch(`${API_BASE}/tools/phone/social-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, platform: platform.toLowerCase() }),
      });
      const data = await resp.json();
      setResult(data);
      onResult?.(data);
    } catch (err) {
      setResult({ exists: 'error', note: 'Scan failed' });
    } finally {
      setScanning(false);
    }
  }, [phone, platform, onResult]);

  return (
    <div className="flex items-center gap-2">
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={scan} disabled={scanning}
        className="px-2 py-1 rounded-lg bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/25 text-violet-300 text-[10px] font-medium disabled:opacity-40 transition-all flex items-center gap-1">
        {scanning ? (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
            <RefreshCw className="w-2.5 h-2.5" />
          </motion.div>
        ) : <Zap className="w-2.5 h-2.5" />}
        {scanning ? 'Checking...' : 'Live Scan'}
      </motion.button>
      {result && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
          result.exists === true ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
          result.exists === false ? 'bg-gray-500/20 text-gray-500 border-gray-500/30' :
          result.exists === 'check_manually' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
          'bg-slate-700/50 text-gray-500 border-white/10'
        }`}>
          {result.exists === true ? 'Found' : result.exists === false ? 'Not Found' : result.exists === 'check_manually' ? 'Check Link' : '?'}
        </span>
      )}
      {result?.profileUrl && (
        <a href={result.profileUrl} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-white/10">
          <ExternalLink className="w-3 h-3 text-gray-500 hover:text-violet-400 transition-colors" />
        </a>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// NUMBER HISTORY HOOK — Save / retrieve lookup snapshots
// ═══════════════════════════════════════════════════════════════
function useNumberHistory(phone) {
  const key = `osintx_phone_history_${phone?.replace(/[^0-9+]/g, '') || 'global'}`;
  const globalKey = 'osintx_phone_history_all';

  const getHistory = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch { return []; }
  }, [key]);

  const getAllHistory = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(globalKey) || '[]');
    } catch { return []; }
  }, []);

  const saveSnapshot = useCallback((data) => {
    if (!phone || !data) return;
    try {
      const snapshot = {
        phone,
        timestamp: new Date().toISOString(),
        riskScore: data.riskAssessment?.score || 0,
        riskLevel: data.riskAssessment?.level || 'Unknown',
        carrier: data.carrier || 'Unknown',
        country: data.country || 'Unknown',
        sources: data.sourceCount || 0,
        valid: data.valid || false,
        type: data.type || 'Unknown',
      };
      // Per-number history
      const history = getHistory();
      history.unshift(snapshot);
      if (history.length > 20) history.length = 20;
      localStorage.setItem(key, JSON.stringify(history));

      // Global history
      const all = getAllHistory();
      all.unshift(snapshot);
      if (all.length > 100) all.length = 100;
      localStorage.setItem(globalKey, JSON.stringify(all));
    } catch {}
  }, [phone, key, getHistory, getAllHistory]);

  return { getHistory, getAllHistory, saveSnapshot };
}

// ═══════════════════════════════════════════════════════════════
// TAB DEFINITIONS
// ═══════════════════════════════════════════════════════════════
const TABS = [
  { id: 'overview',  label: 'Overview',      icon: Layers,         color: 'amber' },
  { id: 'carrier',   label: 'Carrier',       icon: Radio,          color: 'cyan' },
  { id: 'geo',       label: 'Geo Intel',     icon: Globe,          color: 'emerald' },
  { id: 'social',    label: 'Social',        icon: MessageSquare,  color: 'violet' },
  { id: 'security',  label: 'Security',      icon: Shield,         color: 'red' },
  { id: 'breach',    label: 'Breach',        icon: AlertTriangle,  color: 'orange' },
  { id: 'dorks',     label: 'OSINT Dorks',   icon: Code,           color: 'pink' },
  { id: 'actions',   label: 'Quick Actions', icon: Crosshair,      color: 'blue' },
  { id: 'notes',     label: 'Case Notes',    icon: FileText,       color: 'slate' },
  { id: 'advanced',  label: 'Advanced',      icon: Target,         color: 'indigo' },
];

// ─── Tab Color Maps (Tailwind cannot generate dynamic class names) ───
const TAB_ACTIVE_CLASSES = {
  amber:   'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10',
  cyan:    'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10',
  emerald: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10',
  violet:  'bg-violet-500/20 text-violet-400 border border-violet-500/30 shadow-lg shadow-violet-500/10',
  red:     'bg-red-500/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/10',
  orange:  'bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-lg shadow-orange-500/10',
  pink:    'bg-pink-500/20 text-pink-400 border border-pink-500/30 shadow-lg shadow-pink-500/10',
  blue:    'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10',
  slate:   'bg-slate-500/20 text-slate-400 border border-slate-500/30 shadow-lg shadow-slate-500/10',
  indigo:  'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-500/10',
};

// ─── Category Color Maps for OSINT Dorks ───
const CATEGORY_STYLES = {
  'General':           { border: 'border-cyan-500/15',    text: 'text-cyan-400',    hoverBorder: 'hover:border-cyan-500/30' },
  'Social Media':      { border: 'border-blue-500/15',    text: 'text-blue-400',    hoverBorder: 'hover:border-blue-500/30' },
  'Paste Sites':       { border: 'border-yellow-500/15',  text: 'text-yellow-400',  hoverBorder: 'hover:border-yellow-500/30' },
  'Documents':         { border: 'border-amber-500/15',   text: 'text-amber-400',   hoverBorder: 'hover:border-amber-500/30' },
  'Phone Directories': { border: 'border-emerald-500/15', text: 'text-emerald-400', hoverBorder: 'hover:border-emerald-500/30' },
  'Temporary Numbers': { border: 'border-red-500/15',     text: 'text-red-400',     hoverBorder: 'hover:border-red-500/30' },
  'Reputation':        { border: 'border-orange-500/15',  text: 'text-orange-400',  hoverBorder: 'hover:border-orange-500/30' },
  'Financial':         { border: 'border-violet-500/15',  text: 'text-violet-400',  hoverBorder: 'hover:border-violet-500/30' },
  'Professional':      { border: 'border-indigo-500/15',  text: 'text-indigo-400',  hoverBorder: 'hover:border-indigo-500/30' },
  'Government':        { border: 'border-slate-500/15',   text: 'text-slate-400',   hoverBorder: 'hover:border-slate-500/30' },
  'Messaging':         { border: 'border-teal-500/15',    text: 'text-teal-400',    hoverBorder: 'hover:border-teal-500/30' },
  'Caller ID':         { border: 'border-pink-500/15',    text: 'text-pink-400',    hoverBorder: 'hover:border-pink-500/30' },
  'Spam':              { border: 'border-rose-500/15',    text: 'text-rose-400',    hoverBorder: 'hover:border-rose-500/30' },
  'Telecom':           { border: 'border-sky-500/15',     text: 'text-sky-400',     hoverBorder: 'hover:border-sky-500/30' },
};
const DEFAULT_CAT_STYLE = { border: 'border-gray-500/15', text: 'text-gray-400', hoverBorder: 'hover:border-gray-500/30' };
const getCatStyle = (cat) => CATEGORY_STYLES[cat] || DEFAULT_CAT_STYLE;

// ═══════════════════════════════════════════════════════════════════════════════
// PHONE LOOKUP TOOL — MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const PhoneLookupTool = ({ onClose, onConsume }) => {
  const toast = useToast();
  const { addToHistory } = useHistory();
  const { copy } = useClipboard();
  const inputRef = useRef(null);
  const countryPickerRef = useRef(null);
  // ── State ──
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[2]); // India default
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [scanPhase, setScanPhase] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [activeSources, setActiveSources] = useState([]);
  const [lastLookupTime, setLastLookupTime] = useState(null);
  const [regionFilter, setRegionFilter] = useState('All');

  // ── Number history (hook at component level) ──
  const currentFullNumber = useMemo(() => {
    if (results?.number) return results.number;
    if (results?.formatted) return results.formatted;
    if (phoneNumber) return `${selectedCountry.dial}${phoneNumber.replace(/^0+/, '')}`;
    return '';
  }, [results, phoneNumber, selectedCountry]);
  const { getHistory, getAllHistory, saveSnapshot } = useNumberHistory(currentFullNumber);

  // ── Save snapshot when results change ──
  useEffect(() => {
    if (results && currentFullNumber) {
      saveSnapshot(results);
    }
  }, [results]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Close country picker on outside click ──
  useEffect(() => {
    const handleOutside = (e) => {
      if (countryPickerRef.current && !countryPickerRef.current.contains(e.target)) {
        setShowCountryPicker(false);
      }
    };
    if (showCountryPicker) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [showCountryPicker]);

  // ── Region list ──
  const regions = useMemo(() => {
    const r = new Set(COUNTRY_CODES.map(c => c.region));
    return ['All', ...Array.from(r).sort()];
  }, []);

  // ── Filtered country list ──
  const filteredCountries = useMemo(() => {
    let list = COUNTRY_CODES;
    if (regionFilter !== 'All') list = list.filter(c => c.region === regionFilter);
    if (countrySearch.trim()) {
      const q = countrySearch.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.dial.includes(q)
      );
    }
    return list;
  }, [countrySearch, regionFilter]);

  // ── Display phone ──
  const displayPhone = useMemo(() => {
    if (!phoneNumber) return '';
    return `${selectedCountry.dial} ${phoneNumber}`;
  }, [phoneNumber, selectedCountry]);

  // ── Truecaller Connection State ──
  const [tcStatus, setTcStatus] = useState({ connected: false, loading: true });
  const [tcSetup, setTcSetup] = useState({ show: false, step: 'idle', phone: '', otp: '', requestId: '', loading: false, error: '' });
  const API_BASE = useMemo(() => import.meta.env.VITE_API_URL || 'http://localhost:5000/api', []);

  useEffect(() => {
    // Check Truecaller connection status on mount
    fetch(`${API_BASE}/tools/truecaller/status`).then(r => r.json())
      .then(d => setTcStatus({ connected: d.connected, verifiedAt: d.verifiedAt, loading: false }))
      .catch(() => setTcStatus(s => ({ ...s, loading: false })));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const tcLogin = useCallback(async () => {
    if (!tcSetup.phone.trim()) return;
    setTcSetup(s => ({ ...s, loading: true, error: '' }));
    try {
      const r = await fetch(`${API_BASE}/tools/truecaller/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: tcSetup.phone.trim() }),
      });
      const d = await r.json();
      if (d.requestId) {
        setTcSetup(s => ({ ...s, step: 'otp', requestId: d.requestId, loading: false }));
        toast.success('OTP sent to your Truecaller number');
      } else {
        setTcSetup(s => ({ ...s, loading: false, error: d.error || d.message || 'Failed to send OTP' }));
      }
    } catch (e) {
      setTcSetup(s => ({ ...s, loading: false, error: e.message }));
    }
  }, [tcSetup.phone, API_BASE, toast]);

  const tcVerify = useCallback(async () => {
    if (!tcSetup.otp.trim() || !tcSetup.requestId) return;
    setTcSetup(s => ({ ...s, loading: true, error: '' }));
    try {
      const r = await fetch(`${API_BASE}/tools/truecaller/verify`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: tcSetup.requestId, otp: tcSetup.otp.trim() }),
      });
      const d = await r.json();
      if (d.success) {
        setTcStatus({ connected: true, verifiedAt: new Date().toISOString(), loading: false });
        setTcSetup({ show: false, step: 'idle', phone: '', otp: '', requestId: '', loading: false, error: '' });
        toast.success('Truecaller connected! Caller ID is now active.');
      } else {
        setTcSetup(s => ({ ...s, loading: false, error: d.error || 'Verification failed' }));
      }
    } catch (e) {
      setTcSetup(s => ({ ...s, loading: false, error: e.message }));
    }
  }, [tcSetup.otp, tcSetup.requestId, API_BASE, toast]);

  // ═══════════════════════════════════════════
  // SEARCH HANDLER
  // ═══════════════════════════════════════════
  const handleSearch = useCallback(async () => {
    if (!phoneNumber.trim()) { toast.error('Enter a phone number'); return; }

    const fullNumber = selectedCountry.code === 'OTHER'
      ? phoneNumber.trim()
      : `${selectedCountry.dial}${phoneNumber.trim().replace(/^0+/, '')}`;

    trackToolUsage('phone-lookup', 'search', 'start');
    setIsSearching(true);
    setResults(null);
    setActiveTab('overview');
    setScanProgress(0);
    setActiveSources([]);
    onConsume?.(5);

    // ── Scanning phase animation ──
    const sourceNames = [
      'libphonenumber', 'REST Countries', 'Numverify', 'Veriphone',
      'Abstract API', 'IPQualityScore', 'Hudson Rock', 'StopForumSpam',
      'Ignorant Social', 'Carrier DB', 'NumLookup API', 'PhoneInfoga Scanner',
      'OSINT Links', 'Format Analysis', 'Risk Engine', 'Google Dorks', 'Intel Fusion',
    ];
    const phases = [
      'Parsing number format...', 'Querying carrier networks...', 'Validating via multi-APIs...',
      'Checking breach databases...', 'Scanning social platforms...', 'Running PhoneInfoga scanner...',
      'Generating Google dorks...', 'Analyzing risk factors...', 'Building OSINT link map...',
      'Correlating intelligence...', 'Fusing all sources...',
    ];
    let phaseIdx = 0;
    let sourceIdx = 0;
    const phaseTimer = setInterval(() => {
      if (phaseIdx < phases.length) { setScanPhase(phases[phaseIdx]); phaseIdx++; }
    }, 1200);
    const sourceTimer = setInterval(() => {
      if (sourceIdx < sourceNames.length) {
        setActiveSources(prev => [...prev, sourceNames[sourceIdx]]);
        setScanProgress(((sourceIdx + 1) / sourceNames.length) * 100);
        sourceIdx++;
      }
    }, 600);

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE}/tools/phone/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullNumber }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      clearInterval(phaseTimer);
      clearInterval(sourceTimer);
      setScanPhase('');
      setScanProgress(100);
      setActiveSources([]);

      setResults(data);
      setLastLookupTime(new Date());
      addToHistory('phone-lookup', fullNumber, data);
      trackToolUsage('phone-lookup', 'search', 'success');
      toast.success(`Phone intel complete — ${data.sourceCount || data.dataSources?.length || 0} sources · ${data.country || 'Unknown'}`);
    } catch (error) {
      clearInterval(phaseTimer);
      clearInterval(sourceTimer);
      setScanPhase('');
      setScanProgress(0);
      setActiveSources([]);
      console.error('Phone lookup error:', error);
      toast.error(error.message || 'Lookup failed');
      trackToolUsage('phone-lookup', 'search', 'error');
    } finally {
      setIsSearching(false);
    }
  }, [phoneNumber, selectedCountry, toast, addToHistory, onConsume]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter' && !isSearching && phoneNumber.trim()) handleSearch();
      if (e.key === 'Escape') { if (showCountryPicker) setShowCountryPicker(false); else onClose?.(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSearch, isSearching, phoneNumber, showCountryPicker, onClose]);

  // ── Reset ──
  const handleRefresh = () => {
    setPhoneNumber('');
    setResults(null);
    setLastLookupTime(null);
    setScanPhase('');
    setScanProgress(0);
    setActiveSources([]);
    toast.info('Ready for new search');
    inputRef.current?.focus();
  };

  // ── Export ──
  const handleExportJSON = () => {
    if (!results) { toast.error('No results'); return; }
    const ok = exportToJSON(results, `phone_intel_${results.number?.replace(/\+/g, '') || Date.now()}.json`);
    if (ok) toast.success('JSON exported'); else toast.error('Export failed');
  };
  const handleExportCSV = () => {
    if (!results) { toast.error('No results'); return; }
    const prepared = formatForExport(results, 'csv');
    const ok = exportToCSV(prepared, `phone_intel_${results.number?.replace(/\+/g, '') || Date.now()}.csv`);
    if (ok) toast.success('CSV exported'); else toast.error('Export failed');
  };

  const copyValue = (val) => { copy(val); toast.success('Copied'); };

  // ═══════════════════════════════════════════════════════════════
  // TAB RENDERERS — called as functions, NOT as JSX components
  // ═══════════════════════════════════════════════════════════════

  // ── OVERVIEW TAB ──
  function renderOverview() {
    if (!results) return null;
    const r = results;
    const risk = r.riskAssessment || {};
    return (
      <div className="space-y-4">
        {/* Hero Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-[60px]" />
          <div className="flex items-start justify-between gap-4 flex-wrap relative">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="text-5xl">{r.flag || '📞'}</div>
                {r.valid && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-900">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-mono tracking-wide">{r.formatted || r.number}</div>
                <div className="text-sm text-amber-300/70 mt-1 flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${r.valid ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {r.valid ? '✓ Valid' : '✗ Invalid'}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">{r.type || 'Unknown'}</span>
                  <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-violet-500/20 text-violet-400 border border-violet-500/30">{r.country || 'Unknown'}</span>
                  {r.carrierConfidence && (
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${r.carrierConfidence === 'High' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                      {r.carrierConfidence} Confidence
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Intelligence Sources</div>
              <div className="text-3xl font-bold text-amber-400">{r.sourceCount || r.dataSources?.length || 0}</div>
              {r.queryTime && <div className="text-xs text-gray-500 mt-1">{r.queryTime}ms query</div>}
            </div>
          </div>
        </div>

        {/* Source badges */}
        {r.dataSources?.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
              <Database className="w-3 h-3 text-emerald-400" />
              Live Intelligence Sources ({r.dataSources.length})
              <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] border border-emerald-500/25">LIVE DATA</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {r.dataSources.map(s => <SourceBadge key={s} name={s} status="success" />)}
            </div>
          </div>
        )}

        {/* Data Pipeline Workflow */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-slate-800/50 via-indigo-900/20 to-slate-800/50 border border-indigo-500/15">
          <div className="flex items-center gap-2 text-indigo-300 text-sm font-semibold mb-3">
            <Activity className="w-4 h-4" />
            Intelligence Pipeline
          </div>
          <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin">
            {[
              { label: 'Parse', icon: '⚡', done: true },
              { label: 'Validate', icon: '✓', done: r.valid !== undefined },
              { label: 'Carrier', icon: '📡', done: !!r.carrier },
              { label: 'Geo', icon: '🌍', done: !!r.country },
              { label: 'Social', icon: '👥', done: r.socialProfiles?.length > 0 },
              { label: 'Risk', icon: '🛡', done: !!r.riskAssessment?.score },
              { label: 'Breach', icon: '🔓', done: r.infostealerData !== undefined },
              { label: 'Dorks', icon: '🔍', done: r.phoneInfoga?.googleDorks?.length > 0 },
              { label: 'OSINT', icon: '🔗', done: r.phoneInfoga?.osintLinks?.length > 0 },
              { label: 'Hashes', icon: '#', done: Object.keys(r.phoneInfoga?.hashes || {}).length > 0 },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-1 flex-shrink-0">
                <div className={`flex flex-col items-center px-2 py-1.5 rounded-lg transition-all ${
                  step.done ? 'bg-emerald-500/15 border border-emerald-500/25' : 'bg-slate-800/40 border border-white/5'
                }`}>
                  <span className="text-sm">{step.icon}</span>
                  <span className={`text-[9px] mt-0.5 ${step.done ? 'text-emerald-400' : 'text-gray-600'}`}>{step.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className={`w-4 h-px ${step.done ? 'bg-emerald-500/40' : 'bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Signal} label="Carrier" value={r.carrier || 'Unknown'} color="text-cyan-400" />
          <StatCard icon={Phone} label="Line Type" value={r.lineType || r.type || 'Unknown'} color="text-amber-400" />
          <StatCard icon={Globe} label="Country" value={r.country || 'Unknown'} color="text-emerald-400" />
          <StatCard icon={Shield} label="Risk" value={risk.level || 'Unknown'}
            color={risk.level === 'Low' ? 'text-emerald-400' : risk.level === 'Medium' ? 'text-amber-400' : risk.level === 'High' ? 'text-orange-400' : 'text-red-400'}
            sub={`Score: ${risk.score || 0}/100`} />
        </div>

        {/* PhoneInfoga & NumLookup quick stats */}
        {(r.phoneInfoga || r.numLookup) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {r.phoneInfoga?.googleDorks?.length > 0 && (
              <StatCard icon={Code} label="Google Dorks" value={r.phoneInfoga.googleDorks.length} color="text-pink-400" sub="Auto-generated" />
            )}
            {r.phoneInfoga?.osintLinks?.length > 0 && (
              <StatCard icon={Eye} label="OSINT Links" value={r.phoneInfoga.osintLinks.length} color="text-blue-400" sub="Intelligence URLs" />
            )}
            {r.numLookup?.carrier && (
              <StatCard icon={Radio} label="NumLookup" value={r.numLookup.carrier} color="text-violet-400" sub={r.numLookup.lineType || 'Carrier lookup'} />
            )}
            {r.phoneInfoga?.numberIntelligence?.number_type && (
              <StatCard icon={Target} label="Intel Type" value={r.phoneInfoga.numberIntelligence.number_type} color="text-teal-400" sub="PhoneInfoga" />
            )}
          </div>
        )}

        {/* ═══ Identity Resolution Card ═══ */}
        {r.identityData && (r.identityData.bestName || r.identityData.names?.length > 0 || r.identityData.emails?.length > 0 || r.identityData.photos?.length > 0) && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-fuchsia-500/5 to-transparent border border-purple-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-[60px]" />
            <div className="flex items-center gap-2 text-purple-300 text-sm font-semibold mb-4">
              <User className="w-4 h-4" />
              Identity Resolution
              <span className="ml-auto px-2 py-0.5 rounded-lg text-xs bg-purple-500/20 border border-purple-500/30 text-purple-300">
                {[...new Set([...(r.identityData.names?.map(n => n.source) || []), ...(r.identityData.emails?.map(e => e.source) || [])])].length} source(s)
              </span>
            </div>
            <div className="relative flex flex-col sm:flex-row gap-4">
              {/* Photo */}
              {r.identityData.bestPhoto && (
                <div className="flex-shrink-0">
                  <img src={r.identityData.bestPhoto} alt="Owner" className="w-20 h-20 rounded-xl object-cover border-2 border-purple-500/30 shadow-lg" onError={e => { e.target.style.display = 'none'; }} />
                </div>
              )}
              <div className="flex-1 space-y-2.5">
                {/* Names */}
                {r.identityData.names?.length > 0 && (
                  <div className="space-y-1">
                    {r.identityData.names.map((n, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                        <span className="text-white font-medium text-sm">{n.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">{n.source}</span>
                        {n.confidence && <span className={`px-1.5 py-0.5 rounded text-[10px] ${n.confidence === 'High' ? 'bg-emerald-500/20 text-emerald-300' : n.confidence === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-gray-500/20 text-gray-300'}`}>{n.confidence}</span>}
                        {n.type === 'alternate' && <span className="text-[10px] text-gray-500 italic">alt</span>}
                      </div>
                    ))}
                  </div>
                )}
                {/* Emails */}
                {r.identityData.emails?.length > 0 && (
                  <div className="space-y-1">
                    {r.identityData.emails.map((e, i) => (
                      <div key={i} className="flex items-center gap-2 group cursor-pointer" onClick={() => copyValue(e.email)} title="Click to copy">
                        <Mail className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="text-cyan-300 text-sm font-mono">{e.email}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">{e.source}</span>
                        {e.type === 'breach' && <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-300">breach</span>}
                      </div>
                    ))}
                  </div>
                )}
                {/* Organizations */}
                {r.identityData.organizations?.length > 0 && (
                  <div className="space-y-1">
                    {r.identityData.organizations.map((o, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span className="text-amber-300 text-sm">{o.title ? `${o.title} at ${o.name}` : o.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">{o.source}</span>
                      </div>
                    ))}
                  </div>
                )}
                {/* Social links from identity */}
                {r.identityData.socialLinks?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {r.identityData.socialLinks.map((s, i) => (
                      <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border border-fuchsia-500/20 text-fuchsia-300 text-xs transition-colors">
                        <ExternalLink className="w-3 h-3" />
                        {s.platform} {s.username ? `(${s.username})` : ''}
                      </a>
                    ))}
                  </div>
                )}
                {/* Addresses */}
                {r.identityData.addresses?.length > 0 && (
                  <div className="space-y-1">
                    {r.identityData.addresses.map((a, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="text-emerald-300 text-sm">{[a.city, a.countryCode, a.timeZone].filter(Boolean).join(', ')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Breach data summary */}
            {r.identityData.breachData?.length > 0 && (
              <div className="mt-3 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                <div className="flex items-center gap-2 text-red-400 text-xs font-medium mb-2">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Found in {r.identityData.breachData.length} breach record(s)
                </div>
                <div className="space-y-1">
                  {r.identityData.breachData.slice(0, 5).map((b, i) => (
                    <div key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span><span className="text-red-300 font-medium">{b.database}:</span> {typeof b.data === 'object' ? JSON.stringify(b.data).substring(0, 80) : String(b.data).substring(0, 80)}</span>
                    </div>
                  ))}
                  {r.identityData.breachData.length > 5 && (
                    <div className="text-xs text-gray-500 italic mt-1">...and {r.identityData.breachData.length - 5} more</div>
                  )}
                </div>
              </div>
            )}
            {/* IntelX results */}
            {r.identityData.intelxResults?.length > 0 && (
              <div className="mt-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-medium mb-2">
                  <Database className="w-3.5 h-3.5" />
                  IntelX Intelligence ({r.identityData.intelxResults.length} selectors)
                </div>
                <div className="space-y-1">
                  {r.identityData.intelxResults.slice(0, 8).map((ir, i) => (
                    <div key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
                      <span className="text-indigo-400">›</span>
                      <span className="font-mono text-indigo-300">{ir.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Risk Gauge */}
        <RiskGauge score={risk.score || 0} level={risk.level || 'Unknown'} />

        {/* Risk flags */}
        {risk.flags?.length > 0 && (
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
            <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
              <AlertTriangle className="w-4 h-4" />
              Risk Flags ({risk.flags.length})
            </div>
            {risk.flags.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-red-500 mt-0.5">•</span>
                <span className="text-gray-300">{f}</span>
              </div>
            ))}
          </div>
        )}

        {/* Core info */}
        <div className="space-y-2">
          <InfoRow icon={Hash} label="Number" value={r.number} mono copyable onCopy={copyValue} />
          <InfoRow icon={Phone} label="Formatted" value={r.formatted} mono copyable onCopy={copyValue} />
          <InfoRow icon={Phone} label="National" value={r.nationalFormatted} mono copyable onCopy={copyValue} />
          <InfoRow icon={Globe} label="Country Code" value={r.countryCallingCode} copyable onCopy={copyValue} />
          <InfoRow icon={Link2} label="Tel URI" value={r.uri} mono copyable onCopy={copyValue} />
          <InfoRow icon={Activity} label="Carrier Confidence" value={r.carrierConfidence || 'Medium'} highlight />
        </div>

        {/* Format analysis */}
        {r.formatAnalysis && (
          <div className="p-4 rounded-xl bg-slate-800/30 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-violet-300 text-sm font-medium">
              <FileText className="w-4 h-4" />
              Format Analysis
            </div>
            <InfoRow icon={Hash} label="E.164" value={r.formatAnalysis.e164} mono copyable onCopy={copyValue} />
            <InfoRow icon={Hash} label="International" value={r.formatAnalysis.international} mono copyable onCopy={copyValue} />
            <InfoRow icon={Hash} label="National" value={r.formatAnalysis.national} mono copyable onCopy={copyValue} />
            <InfoRow icon={Hash} label="Digits Only" value={r.formatAnalysis.digits_only} mono copyable onCopy={copyValue} />
            <InfoRow icon={BarChart3} label="Length" value={r.formatAnalysis.length} />
            <InfoRow icon={Link2} label="RFC 3966" value={r.formatAnalysis.rfc3966} mono copyable onCopy={copyValue} />
          </div>
        )}

        {/* Investigation Steps — structured actionable steps with links */}
        {r.investigationSteps?.length > 0 && (
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-3">
              <Crosshair className="w-4 h-4" />
              Investigation Steps ({r.investigationSteps.length})
            </div>
            <div className="space-y-3">
              {r.investigationSteps.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="p-3 rounded-xl bg-slate-800/40 border border-white/5 hover:border-blue-500/20 transition-colors group">
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5 flex-shrink-0">{step.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white mb-1">{step.title}</div>
                      <div className="text-xs text-gray-400 leading-relaxed">{step.description}</div>
                      {step.url && (
                        <a href={step.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 text-xs font-medium transition-colors">
                          <ExternalLink className="w-3 h-3" /> Open
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── CARRIER TAB ──
  function renderCarrier() {
    if (!results) return null;
    const r = results;
    const net = r.networkDetails || {};
    const sim = r.simInfo || {};
    const nv = r.numverify || {};
    const vp = r.veriphone || {};
    const ab = r.abstractApi || {};
    const iq = r.ipqs || {};
    const nl = r.numLookup || {};
    const pf = r.phoneInfoga || {};
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-cyan-300 font-semibold">
          <Radio className="w-5 h-5" />
          Carrier & Network Intelligence
        </div>

        {/* Main carrier card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[60px]" />
          <div className="flex items-center gap-4 mb-4 relative">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Signal className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{r.carrier || 'Unknown Carrier'}</div>
              <div className="text-sm text-cyan-300/70">{net.networkType || 'Unknown'} · {r.lineType || r.type || 'Unknown'}</div>
              {r.carrierConfidence && (
                <div className={`text-xs mt-0.5 ${r.carrierConfidence === 'High' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  Confidence: {r.carrierConfidence}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/40">
              <div className="text-xs text-gray-500">Network</div>
              <div className="text-sm font-medium text-white">{net.networkName || 'Unknown'}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40">
              <div className="text-xs text-gray-500">Location</div>
              <div className="text-sm font-medium text-white">{net.location || net.city || 'Unknown'}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40">
              <div className="text-xs text-gray-500">Prepaid</div>
              <div className={`text-sm font-medium ${net.isPrepaid ? 'text-amber-400' : 'text-gray-400'}`}>{net.isPrepaid ? 'Yes' : 'No / Unknown'}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40">
              <div className="text-xs text-gray-500">DNC Status</div>
              <div className={`text-sm font-medium ${net.doNotCall ? 'text-red-400' : 'text-gray-400'}`}>{net.doNotCall ? 'On DNC List' : 'Not on DNC'}</div>
            </div>
          </div>
        </div>

        {/* Multi-source carrier data */}
        <div className="space-y-2">
          <div className="text-xs text-gray-500 uppercase tracking-wide px-1">Multi-Source Carrier Verification</div>
          <InfoRow icon={Signal} label="libphonenumber" value={r.type || 'N/A'} />
          {nv.carrier && <InfoRow icon={Database} label="Numverify Carrier" value={nv.carrier} />}
          {nv.lineType && <InfoRow icon={Radio} label="Numverify Type" value={nv.lineType} />}
          {nv.location && <InfoRow icon={MapPin} label="Numverify Location" value={nv.location} />}
          {vp.carrier && <InfoRow icon={Database} label="Veriphone Carrier" value={vp.carrier} />}
          {vp.type && <InfoRow icon={Radio} label="Veriphone Type" value={vp.type} />}
          {vp.region && <InfoRow icon={MapPin} label="Veriphone Region" value={vp.region} />}
          {ab.carrier && <InfoRow icon={Database} label="Abstract Carrier" value={ab.carrier} />}
          {ab.type && <InfoRow icon={Radio} label="Abstract Type" value={ab.type} />}
          {ab.location && <InfoRow icon={MapPin} label="Abstract Location" value={ab.location} />}
          {iq.carrier && <InfoRow icon={Database} label="IPQS Carrier" value={iq.carrier} />}
          {iq.lineType && <InfoRow icon={Radio} label="IPQS Type" value={iq.lineType} />}
          {iq.region && <InfoRow icon={MapPin} label="IPQS Region" value={iq.region} />}
          {iq.city && <InfoRow icon={Building} label="IPQS City" value={iq.city} />}
          {nl.carrier && <InfoRow icon={Database} label="NumLookup Carrier" value={nl.carrier} />}
          {nl.lineType && <InfoRow icon={Radio} label="NumLookup Type" value={nl.lineType} />}
          {nl.location && <InfoRow icon={MapPin} label="NumLookup Location" value={nl.location} />}
          {nl.countryName && <InfoRow icon={Globe} label="NumLookup Country" value={nl.countryName} />}
          {pf.geoDescription && <InfoRow icon={MapPin} label="PhoneInfoga Geo" value={pf.geoDescription} highlight />}
        </div>

        {/* SIM Info */}
        {sim && Object.keys(sim).length > 0 && (
          <div className="p-4 rounded-xl bg-slate-800/30 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 text-sm font-medium"><Cpu className="w-4 h-4" /> SIM & Network Details</div>
            <InfoRow icon={Signal} label="Carrier" value={sim.estimatedCarrier || r.carrier} />
            {sim.carrierConfidence && <InfoRow icon={Target} label="Confidence" value={sim.carrierConfidence} highlight />}
            {sim.circle && <InfoRow icon={MapPin} label="Telecom Circle" value={sim.circle} />}
            {sim.areaCode && <InfoRow icon={Hash} label="Area Code" value={sim.areaCode} />}
            {sim.region && <InfoRow icon={Globe} label="Region" value={sim.region} />}
            {sim.mobilePrefix && <InfoRow icon={Hash} label="Mobile Prefix" value={sim.mobilePrefix} />}
            {sim.portedStatus && <InfoRow icon={Activity} label="Port Status" value={sim.portedStatus} />}
            {sim.doNotDisturbActive && <InfoRow icon={Shield} label="DND Status" value={sim.doNotDisturbActive} />}
            {sim.note && <div className="text-xs text-gray-600 px-1 mt-2">{sim.note}</div>}
          </div>
        )}

        {iq.smsEmail && (
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="text-xs text-gray-500 mb-1">SMS Gateway Email</div>
            <div className="text-sm font-mono text-blue-300">{iq.smsEmail}</div>
          </div>
        )}
      </div>
    );
  }

  // ── GEO INTEL TAB ──
  function renderGeo() {
    if (!results) return null;
    const r = results;
    const ci = r.countryInfo || {};
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-emerald-300 font-semibold"><Globe className="w-5 h-5" /> Geographic Intelligence</div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px]" />
          <div className="flex items-center gap-4 mb-4 relative">
            {r.flagUrl ? (
              <img src={r.flagUrl} alt={r.country} className="w-16 h-12 rounded-lg object-cover border border-white/10 shadow-lg" />
            ) : (
              <div className="text-5xl">{r.flag || '🌍'}</div>
            )}
            <div>
              <div className="text-xl font-bold text-white">{r.country || 'Unknown'}</div>
              <div className="text-sm text-emerald-300/70">{ci.official || ''}</div>
              <div className="text-xs text-gray-500">{r.region || ''}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/40"><div className="text-xs text-gray-500">Capital</div><div className="text-sm font-medium text-white">{ci.capital || r.capital || 'Unknown'}</div></div>
            <div className="p-3 rounded-xl bg-slate-800/40"><div className="text-xs text-gray-500">Population</div><div className="text-sm font-medium text-white">{ci.population ? ci.population.toLocaleString() : 'Unknown'}</div></div>
            <div className="p-3 rounded-xl bg-slate-800/40"><div className="text-xs text-gray-500">Timezone</div><div className="text-sm font-medium text-amber-300">{r.timezone || 'Unknown'}</div></div>
          </div>
        </div>

        <div className="space-y-2">
          <InfoRow icon={Globe} label="Country Code" value={r.countryCode} copyable onCopy={copyValue} />
          <InfoRow icon={Phone} label="Calling Code" value={r.countryCallingCode || ci.callingCode} copyable onCopy={copyValue} />
          <InfoRow icon={MapPin} label="Region" value={r.region || ci.subregion} />
          <InfoRow icon={Globe} label="Continent" value={ci.continents?.join(', ')} />
          {ci.area && <InfoRow icon={Map} label="Area" value={`${ci.area?.toLocaleString()} km²`} />}
          <InfoRow icon={Activity} label="Landlocked" value={ci.landlocked ? 'Yes' : 'No'} />
          {ci.languages?.length > 0 && <InfoRow icon={MessageSquare} label="Languages" value={ci.languages.join(', ')} />}
          {r.currency && <InfoRow icon={Activity} label="Currency" value={`${r.currency.name} (${r.currency.symbol} ${r.currency.code})`} />}
          {ci.borders?.length > 0 && <InfoRow icon={Flag} label="Borders" value={ci.borders.join(', ')} />}
          {ci.tld?.length > 0 && <InfoRow icon={Globe} label="TLD" value={ci.tld.join(', ')} />}
          {ci.drivingSide && <InfoRow icon={Info} label="Driving Side" value={ci.drivingSide} />}
          {ci.latlng && <InfoRow icon={Crosshair} label="Coordinates" value={`${ci.latlng[0]?.toFixed(4)}, ${ci.latlng[1]?.toFixed(4)}`} mono copyable onCopy={copyValue} />}
        </div>

        {(r.networkDetails?.city || r.networkDetails?.region) && (
          <div className="p-4 rounded-xl bg-slate-800/30 border border-white/5 space-y-2">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Network Registration Location</div>
            {r.networkDetails.city && <InfoRow icon={Building} label="City" value={r.networkDetails.city} />}
            {r.networkDetails.region && <InfoRow icon={MapPin} label="Region" value={r.networkDetails.region} />}
            {r.networkDetails.zip && <InfoRow icon={Hash} label="ZIP" value={r.networkDetails.zip} />}
          </div>
        )}

        {ci.timezones?.length > 1 && (
          <div className="p-4 rounded-xl bg-slate-800/30 border border-white/5">
            <div className="text-xs text-gray-500 mb-2">All Timezones ({ci.timezones.length})</div>
            <div className="flex flex-wrap gap-1.5">
              {ci.timezones.map(tz => (
                <span key={tz} className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs border border-emerald-500/20">{tz}</span>
              ))}
            </div>
          </div>
        )}

        {/* ═══ Leaflet Map Visualization ═══ */}
        {ci.latlng && ci.latlng[0] && ci.latlng[1] && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl overflow-hidden border border-emerald-500/20 shadow-lg">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/60 border-b border-white/5">
              <Map className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">Country Location Map</span>
              <span className="ml-auto text-[10px] text-gray-500">{ci.latlng[0].toFixed(4)}, {ci.latlng[1].toFixed(4)}</span>
            </div>
            <div style={{ height: '280px', width: '100%' }}>
              <MapContainer
                center={[ci.latlng[0], ci.latlng[1]]}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[ci.latlng[0], ci.latlng[1]]}>
                  <Popup>
                    <div className="text-center">
                      <strong>{r.country || 'Unknown'}</strong><br />
                      {ci.capital && <span>Capital: {ci.capital}<br /></span>}
                      {r.carrier && r.carrier !== 'Unknown' && <span>Carrier: {r.carrier}<br /></span>}
                      <span className="text-xs text-gray-500">{r.formatted || r.number}</span>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </motion.div>
        )}

        {/* PhoneInfoga Geo Data */}
        {r.phoneInfoga?.geoDescription && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs text-gray-500">PhoneInfoga Geolocation</div>
                <div className="text-sm font-medium text-emerald-300">{r.phoneInfoga.geoDescription}</div>
              </div>
            </div>
          </div>
        )}

        {/* PhoneInfoga Timezones */}
        {r.phoneInfoga?.timezones?.length > 0 && (
          <div className="p-3 rounded-xl bg-slate-800/30 border border-white/5">
            <div className="text-xs text-gray-500 mb-2">Detected Timezones (PhoneInfoga)</div>
            <div className="flex flex-wrap gap-1.5">
              {r.phoneInfoga.timezones.map(tz => (
                <span key={tz} className="px-2 py-1 rounded-lg bg-teal-500/10 text-teal-300 text-xs border border-teal-500/20">{tz}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── SOCIAL TAB ──
  function renderSocial() {
    if (!results) return null;
    const r = results;
    const profiles = (r.socialProfiles || []).filter(p => p.registered === true || p.registered === false || p.checkUrl);
    const recovery = r.recoveryUrls || {};
    const platformColors = {
      WhatsApp:        { bg: 'bg-green-500/15',  border: 'border-green-500/30',  text: 'text-green-400',  icon: '💬' },
      Telegram:        { bg: 'bg-blue-500/15',   border: 'border-blue-500/30',   text: 'text-blue-400',   icon: '✈️' },
      Signal:          { bg: 'bg-indigo-500/15',  border: 'border-indigo-500/30', text: 'text-indigo-400', icon: '🔒' },
      Viber:           { bg: 'bg-purple-500/15',  border: 'border-purple-500/30', text: 'text-purple-400', icon: '📱' },
      Truecaller:      { bg: 'bg-blue-600/15',   border: 'border-blue-600/30',   text: 'text-blue-300',   icon: '📇' },
      'Sync.me':       { bg: 'bg-teal-500/15',   border: 'border-teal-500/30',   text: 'text-teal-400',   icon: '🔄' },
      'CallerID Test': { bg: 'bg-amber-500/15',  border: 'border-amber-500/30',  text: 'text-amber-400',  icon: '📞' },
      Facebook:        { bg: 'bg-blue-700/15',   border: 'border-blue-700/30',   text: 'text-blue-300',   icon: '👤' },
      Google:          { bg: 'bg-red-500/15',    border: 'border-red-500/30',    text: 'text-red-400',    icon: '🔍' },
      Microsoft:       { bg: 'bg-cyan-500/15',   border: 'border-cyan-500/30',   text: 'text-cyan-400',   icon: '🪟' },
      Instagram:       { bg: 'bg-pink-500/15',   border: 'border-pink-500/30',   text: 'text-pink-400',   icon: '📸' },
      'Twitter/X':     { bg: 'bg-gray-500/15',   border: 'border-gray-500/30',   text: 'text-gray-300',   icon: '🐦' },
      Snapchat:        { bg: 'bg-yellow-500/15', border: 'border-yellow-500/30', text: 'text-yellow-400', icon: '👻' },
      LINE:            { bg: 'bg-green-600/15',  border: 'border-green-600/30',  text: 'text-green-300',  icon: '💚' },
      KakaoTalk:       { bg: 'bg-yellow-600/15', border: 'border-yellow-600/30', text: 'text-yellow-300', icon: '💛' },
      Amazon:          { bg: 'bg-orange-500/15', border: 'border-orange-500/30', text: 'text-orange-400', icon: '📦' },
    };
    const emails = r.ipqs?.associatedEmails || [];

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-violet-300 font-semibold">
          <MessageSquare className="w-5 h-5" />
          Social & Messaging Platforms ({profiles.length})
        </div>

        <div className="grid gap-2">
          {profiles.map((p, i) => {
            const style = platformColors[p.platform] || { bg: 'bg-slate-700/30', border: 'border-slate-600/30', text: 'text-gray-300', icon: '🔗' };
            return (
              <motion.div key={p.platform} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className={`p-3 rounded-xl ${style.bg} border ${style.border} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{style.icon}</span>
                  <div>
                    <div className={`font-semibold text-sm ${style.text}`}>{p.platform}</div>
                    <div className="text-[11px] text-gray-500">{p.registered === true ? 'Account found — registered on this platform' : p.registered === false ? 'Not registered on this platform' : p.note || 'Verify via link'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  {p.registered === true && <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Found</span>}
                  {p.registered === false && <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-500/20 text-gray-500 border border-gray-500/30">N/A</span>}
                  {['WhatsApp', 'Telegram', 'Signal', 'Viber'].includes(p.platform) && (
                    <LiveScanButton platform={p.platform} phone={r.number || r.formatted} />
                  )}
                  {p.checkUrl && (
                    <a href={p.checkUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {emails.length > 0 && (
          <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <div className="flex items-center gap-2 text-violet-400 text-sm font-medium mb-2"><User className="w-4 h-4" /> Associated Email Addresses</div>
            {emails.map((email, i) => (
              <div key={i} className="flex items-center gap-2 text-sm py-1">
                <span className="text-gray-400 font-mono text-xs">{email}</span>
                <button onClick={() => copyValue(email)} className="p-1 rounded hover:bg-white/10"><Copy className="w-3 h-3 text-gray-600" /></button>
              </div>
            ))}
          </div>
        )}

        {Object.keys(recovery).length > 0 && (
          <div className="p-4 rounded-xl bg-slate-800/30 border border-white/5">
            <div className="flex items-center gap-2 text-amber-300 text-sm font-medium mb-3"><Lock className="w-4 h-4" /> Account Recovery Links ({Object.keys(recovery).length})</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(recovery).map(([name, url]) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 border border-white/5 flex items-center gap-2 transition-colors">
                  <ExternalLink className="w-3 h-3 text-amber-400" /><span className="text-xs text-gray-300 capitalize">{name}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {r.ipqs?.name && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2"><User className="w-4 h-4 text-emerald-400" /><div><div className="text-xs text-gray-500">Potential Owner Name</div><div className="text-sm font-medium text-emerald-300">{r.ipqs.name}</div></div></div>
          </div>
        )}
      </div>
    );
  }

  // ── SECURITY TAB ──
  function renderSecurity() {
    if (!results) return null;
    const r = results;
    const risk = r.riskAssessment || {};
    const rep = r.reputation || {};
    const iq = r.ipqs || {};
    const spam = r.spamData || {};
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-red-300 font-semibold"><Shield className="w-5 h-5" /> Security & Risk Analysis</div>

        <RiskGauge score={risk.score || 0} level={risk.level || 'Unknown'} />

        {risk.breakdown && Object.keys(risk.breakdown).length > 0 && (
          <div className="p-4 rounded-xl bg-slate-800/30 border border-white/5 space-y-3">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Risk Score Breakdown</div>
            {Object.entries(risk.breakdown).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
              <div key={k}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-400 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-xs text-amber-400 font-mono">+{v}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-700">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-500"
                    initial={{ width: 0 }} animate={{ width: `${Math.min(v * 3, 100)}%` }} transition={{ duration: 0.8 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'VoIP', value: risk.isVoIP, bad: true },
            { label: 'Disposable', value: risk.isDisposable, bad: true },
            { label: 'Leaked', value: risk.isLeaked, bad: true },
            { label: 'Spammer', value: risk.isSpammer, bad: true },
            { label: 'Do Not Call', value: risk.doNotCall },
            { label: 'Toll-Free', value: risk.isTollFree },
            { label: 'Premium', value: risk.isPremium, bad: true },
            { label: 'Virtual', value: risk.isVirtual, bad: true },
          ].map(item => (
            <div key={item.label} className={`p-3 rounded-xl text-center transition-colors ${
              item.value ? (item.bad ? 'bg-red-500/15 border border-red-500/30' : 'bg-amber-500/15 border border-amber-500/30') : 'bg-slate-800/30 border border-white/5'
            }`}>
              {item.value ? (item.bad ? <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-1" /> : <Info className="w-5 h-5 text-amber-400 mx-auto mb-1" />) : <CheckCircle className="w-5 h-5 text-gray-600 mx-auto mb-1" />}
              <div className={`text-xs ${item.value ? (item.bad ? 'text-red-400' : 'text-amber-400') : 'text-gray-500'}`}>{item.label}</div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-slate-800/30 border border-white/5 space-y-2">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Reputation Summary</div>
          <InfoRow icon={Shield} label="Status" value={rep.reputation || 'Unknown'} highlight />
          <InfoRow icon={BarChart3} label="Spam Score" value={rep.spamScore || 0} />
          <InfoRow icon={AlertTriangle} label="Robocall" value={rep.robocall ? 'Yes' : 'No'} />
          <InfoRow icon={Database} label="Spam Reports" value={rep.reportsCount || 0} />
          {rep.truecallerUrl && (
            <a href={rep.truecallerUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm hover:bg-blue-500/15 transition-colors">
              <ExternalLink className="w-4 h-4" /> Check on Truecaller
            </a>
          )}
        </div>

        {iq && Object.keys(iq).length > 0 && (
          <div className="p-4 rounded-xl bg-slate-800/30 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide"><Database className="w-3 h-3" /> IPQualityScore Data</div>
            {iq.fraudScore !== undefined && <InfoRow icon={Target} label="Fraud Score" value={iq.fraudScore} highlight />}
            {iq.active !== undefined && <InfoRow icon={Activity} label="Active" value={iq.active ? 'Yes' : 'No'} />}
            {iq.region && <InfoRow icon={MapPin} label="Region" value={iq.region} />}
            {iq.city && <InfoRow icon={Building} label="City" value={iq.city} />}
            {iq.name && <InfoRow icon={User} label="Owner Name" value={iq.name} />}
            {iq.prepaid !== undefined && <InfoRow icon={Smartphone} label="Prepaid" value={iq.prepaid ? 'Yes' : 'No'} />}
          </div>
        )}

        {spam && spam.appears && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 space-y-2">
            <div className="flex items-center gap-2 text-red-400 text-sm font-medium"><AlertTriangle className="w-4 h-4" /> StopForumSpam Detection</div>
            <InfoRow icon={BarChart3} label="Frequency" value={spam.frequency || 0} />
            {spam.lastSeen && <InfoRow icon={Calendar} label="Last Seen" value={spam.lastSeen} />}
            {spam.confidence && <InfoRow icon={Target} label="Confidence" value={`${spam.confidence}%`} />}
          </div>
        )}

        {/* HLR Virtual Number Detection */}
        {r.hlrLookup && (
          <div className={`p-4 rounded-xl border space-y-3 ${
            r.hlrLookup.isVirtual
              ? 'bg-red-500/10 border-red-500/20'
              : r.hlrLookup.verdict === 'POSSIBLY_VIRTUAL'
                ? 'bg-amber-500/10 border-amber-500/20'
                : 'bg-emerald-500/10 border-emerald-500/20'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Radio className="w-4 h-4" />
                <span className={r.hlrLookup.isVirtual ? 'text-red-400' : r.hlrLookup.verdict === 'POSSIBLY_VIRTUAL' ? 'text-amber-400' : 'text-emerald-400'}>
                  HLR Virtual Number Detection
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                r.hlrLookup.isVirtual ? 'bg-red-500/20 text-red-300' : r.hlrLookup.verdict === 'POSSIBLY_VIRTUAL' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>{r.hlrLookup.verdict}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Confidence</span>
                  <span className="text-gray-300 font-mono">{r.hlrLookup.confidence}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-700">
                  <motion.div
                    className={`h-full rounded-full ${r.hlrLookup.isVirtual ? 'bg-gradient-to-r from-red-500 to-red-400' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'}`}
                    initial={{ width: 0 }} animate={{ width: `${r.hlrLookup.confidence}%` }} transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>

            {r.hlrLookup.matchedProvider && (
              <InfoRow icon={Smartphone} label="Provider" value={r.hlrLookup.matchedProvider} />
            )}

            {r.hlrLookup.reasons?.length > 0 && (
              <div className="space-y-1">
                {r.hlrLookup.reasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <AlertCircle className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{reason}</span>
                  </div>
                ))}
              </div>
            )}

            {r.hlrLookup.checkUrls?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {r.hlrLookup.checkUrls.map((u, i) => (
                  <a key={i} href={u.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-700/50 text-xs text-blue-300 hover:bg-slate-600/50 transition-colors">
                    <ExternalLink className="w-3 h-3" /> {u.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {risk.flags?.length > 0 && (
          <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">All Risk Flags ({risk.flags.length})</div>
            {risk.flags.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-sm py-1">
                <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">{f}</span>
              </div>
            ))}
          </div>
        )}

        {/* Truecaller Caller ID Investigation Links */}
        {r.identityData?.truecallerInvestigationLinks?.length > 0 && (
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📇</span>
              <span className="text-sm font-semibold text-blue-300">Caller ID Investigation</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400 font-bold">{r.identityData.truecallerInvestigationLinks.length} services</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {r.identityData.truecallerInvestigationLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/10 transition-all group">
                  <span className="text-sm">{link.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-gray-200 group-hover:text-blue-300 truncate">{link.name}</div>
                    <div className="text-[10px] text-gray-500 truncate">{link.description}</div>
                  </div>
                  <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-blue-400 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── BREACH TAB ──
  function renderBreach() {
    if (!results) return null;
    const r = results;
    const info = r.infostealerData || {};
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-orange-300 font-semibold"><AlertTriangle className="w-5 h-5" /> Breach & Infostealer Intelligence</div>

        <div className={`p-5 rounded-2xl ${info.found ? 'bg-gradient-to-br from-red-500/15 to-orange-500/10 border border-red-500/30' : 'bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${info.found ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
              {info.found ? <AlertTriangle className="w-7 h-7 text-red-400" /> : <CheckCircle className="w-7 h-7 text-emerald-400" />}
            </div>
            <div>
              <div className={`text-xl font-bold ${info.found ? 'text-red-400' : 'text-emerald-400'}`}>
                {info.found ? `COMPROMISED — ${info.totalStealers} infostealer${info.totalStealers > 1 ? 's' : ''}` : 'No Breaches Found'}
              </div>
              <div className="text-sm text-gray-400">{info.found ? 'Phone number found in infostealer malware logs' : 'Not found in checked databases'}</div>
            </div>
          </div>
        </div>

        {info.found && info.stealers?.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Compromised Devices ({info.totalStealers})</div>
            {info.stealers.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="p-4 rounded-xl bg-red-500/5 border border-red-500/15 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-300">Device #{i + 1}</span>
                  {s.date_compromised && <span className="text-xs text-gray-500">{new Date(s.date_compromised).toLocaleDateString()}</span>}
                </div>
                {s.computer_name && <InfoRow icon={Smartphone} label="Computer" value={s.computer_name} />}
                {s.operating_system && <InfoRow icon={Cpu} label="OS" value={s.operating_system} />}
                {s.ip && <InfoRow icon={Globe} label="IP" value={s.ip} mono copyable onCopy={copyValue} />}
                {s.malware_path && <InfoRow icon={AlertTriangle} label="Malware" value={s.malware_path} mono />}
              </motion.div>
            ))}
          </div>
        )}

        {r.riskAssessment?.isLeaked && !info.found && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-medium"><AlertTriangle className="w-4 h-4" /> Data Leak Detected</div>
            <p className="text-sm text-gray-400 mt-2">This phone number was found in data leak databases.</p>
          </div>
        )}

        {!info.found && !r.riskAssessment?.isLeaked && (
          <div className="text-center py-8">
            <Shield className="w-16 h-16 text-emerald-500/30 mx-auto mb-4" />
            <div className="text-gray-400">No breaches or infostealers detected.</div>
            <div className="text-xs text-gray-600 mt-2">Sources: Hudson Rock, IPQualityScore, StopForumSpam</div>
          </div>
        )}
      </div>
    );
  }

  // ── QUICK ACTIONS TAB ──
  function renderQuickActions() {
    if (!results) return null;
    const r = results;
    const actions = r.quickActions || [];
    const steps = r.investigationSteps || [];
    const iconMap = { 'caller-id': '📇', messaging: '💬', search: '🔍', social: '👤', regulatory: '🏛️' };
    return (
      <div className="space-y-5">
        {/* Quick Actions — direct lookups */}
        <div>
          <div className="flex items-center gap-2 text-blue-300 font-semibold mb-3"><Crosshair className="w-5 h-5" /> Quick Lookup Actions ({actions.length})</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {actions.map((action, i) => (
              <motion.a key={action.name} href={action.url} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(59,130,246,0.08)' }}
                className="p-3.5 rounded-xl bg-slate-800/40 border border-white/5 hover:border-blue-500/25 transition-all group">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-lg group-hover:bg-blue-500/20 transition-colors flex-shrink-0">
                    {iconMap[action.icon] || '🔗'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">{action.name}</span>
                      <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{action.description}</div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
          {actions.length === 0 && <div className="text-center py-6 text-gray-500">No quick actions available</div>}
        </div>

        {/* Investigation Steps — detailed OSINT procedures */}
        {steps.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-amber-300 font-semibold mb-3"><BookOpen className="w-5 h-5" /> Investigation Procedures ({steps.length})</div>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="p-3.5 rounded-xl bg-slate-800/30 border border-white/5 hover:border-amber-500/15 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5 flex-shrink-0">{step.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{step.title}</div>
                      <div className="text-xs text-gray-400 mt-1 leading-relaxed">{step.description}</div>
                      {step.url && (
                        <a href={step.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-xs font-medium transition-colors">
                          <ExternalLink className="w-3 h-3" /> Execute
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── OSINT DORKS TAB ──
  function renderDorks() {
    if (!results) return null;
    const r = results;
    const pf = r.phoneInfoga || {};
    const dorks = pf.googleDorks || [];
    const links = pf.osintLinks || [];
    const hashes = pf.hashes || {};
    const formats = pf.formatVariants || {};

    const dorkCategories = [...new Set(dorks.map(d => d.category))];
    const linkCategories = [...new Set(links.map(l => l.category))];

    const categoryColors = {
      'General': 'cyan', 'Social Media': 'blue', 'Paste Sites': 'yellow', 'Documents': 'amber',
      'Phone Directories': 'emerald', 'Temporary Numbers': 'red', 'Reputation': 'orange',
      'Financial': 'violet', 'Professional': 'indigo', 'Government': 'slate', 'Messaging': 'teal',
      'Caller ID': 'pink', 'Spam': 'rose', 'Telecom': 'sky'
    };
    const getColor = (cat) => categoryColors[cat] || 'gray';

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between text-pink-300 font-semibold">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5" /> OSINT Dorks & Intelligence Links
          </div>
          {(dorks.length > 0 || links.length > 0) && (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-[10px] font-medium border border-emerald-500/25 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> PhoneInfoga Active
            </span>
          )}
        </div>

        {dorks.length === 0 && links.length === 0 ? (
          <div className="text-center py-12">
            <Code className="w-16 h-16 text-pink-500/20 mx-auto mb-4" />
            <div className="text-gray-400">No OSINT dork data available</div>
            <div className="text-xs text-gray-600 mt-1">PhoneInfoga scanner did not return results. Ensure the backend is running.</div>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-center">
                <div className="text-xl font-bold text-pink-400">{dorks.length}</div>
                <div className="text-[10px] text-gray-500">Google Dorks</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                <div className="text-xl font-bold text-blue-400">{links.length}</div>
                <div className="text-[10px] text-gray-500">OSINT Links</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <div className="text-xl font-bold text-emerald-400">{dorkCategories.length}</div>
                <div className="text-[10px] text-gray-500">Dork Categories</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                <div className="text-xl font-bold text-amber-400">{Object.keys(hashes).length}</div>
                <div className="text-[10px] text-gray-500">Hash Formats</div>
              </div>
            </div>

            {/* Google Dorks by category */}
            {dorkCategories.length > 0 && (
              <div>
                <div className="text-sm text-pink-300 font-medium mb-3 flex items-center gap-2">
                  <Search className="w-4 h-4" /> Google Dorks ({dorks.length})
                  <button
                    onClick={() => {
                      const allDorks = dorks.map(d => d.dork).join('\n');
                      copyValue(allDorks);
                    }}
                    className="ml-auto px-2.5 py-1 rounded-lg bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/25 text-pink-400 text-[10px] font-medium transition-all flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy All
                  </button>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
                  {dorkCategories.map(cat => {
                    const catStyle = getCatStyle(cat);
                    const catDorks = dorks.filter(d => d.category === cat);
                    return (
                      <div key={cat} className={`p-3 rounded-xl bg-slate-800/30 border ${catStyle.border}`}>
                        <div className={`text-xs font-semibold ${catStyle.text} uppercase tracking-wide mb-2`}>{cat} ({catDorks.length})</div>
                        <div className="space-y-2">
                          {catDorks.map((d, i) => (
                            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                              className="flex items-start gap-2 group">
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-gray-400 mb-1">{d.description}</div>
                                <div className="font-mono text-[11px] text-gray-300 bg-black/30 rounded-lg px-3 py-2 border border-white/5 break-all select-all">
                                  {d.dork}
                                </div>
                              </div>
                              <div className="flex flex-col gap-1.5 flex-shrink-0 mt-4">
                                <button onClick={() => copyValue(d.dork)}
                                  className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/70 border border-white/5 text-gray-500 hover:text-white transition-all"
                                  title="Copy dork">
                                  <Copy className="w-3 h-3" />
                                </button>
                                <a href={d.url} target="_blank" rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-blue-500/20 border border-white/5 text-gray-500 hover:text-blue-400 transition-all"
                                  title="Search on Google">
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* OSINT Links by category */}
            {linkCategories.length > 0 && (
              <div>
                <div className="text-sm text-blue-300 font-medium mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> OSINT Intelligence Links ({links.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[350px] overflow-y-auto scrollbar-thin pr-1">
                  {links.map((link, i) => {
                    const linkStyle = getCatStyle(link.category);
                    return (
                      <motion.a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                        className={`p-3 rounded-xl bg-slate-800/30 border border-white/5 ${linkStyle.hoverBorder} transition-all group`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-semibold ${linkStyle.text}`}>{link.name}</span>
                          <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-blue-400 transition-colors ml-auto" />
                        </div>
                        <div className="text-[10px] text-gray-500">{link.category}</div>
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Number Hashes */}
            {Object.keys(hashes).length > 0 && (
              <div>
                <div className="text-sm text-amber-300 font-medium mb-3 flex items-center gap-2">
                  <Hash className="w-4 h-4" /> Number Hashes ({Object.keys(hashes).length})
                  <button
                    onClick={() => {
                      const allHashes = Object.entries(hashes).map(([a, h]) => `${a.toUpperCase()}: ${h}`).join('\n');
                      copyValue(allHashes);
                    }}
                    className="ml-auto px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/25 text-amber-400 text-[10px] font-medium transition-all flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy All
                  </button>
                </div>
                <div className="space-y-2">
                  {Object.entries(hashes).map(([algo, hash]) => (
                    <motion.div key={algo} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-amber-500/10 hover:border-amber-500/25 transition-colors group">
                      <span className={`text-xs font-bold uppercase w-16 flex-shrink-0 px-2 py-1 rounded-lg text-center ${
                        algo === 'md5' ? 'bg-orange-500/15 text-orange-400 border border-orange-500/25' :
                        algo === 'sha1' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25' :
                        'bg-violet-500/15 text-violet-400 border border-violet-500/25'
                      }`}>{algo}</span>
                      <span className="font-mono text-[11px] text-gray-400 break-all flex-1 select-all">{hash}</span>
                      <button onClick={() => copyValue(hash)} className="p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-700 text-gray-500 hover:text-white transition-all flex-shrink-0 opacity-0 group-hover:opacity-100">
                        <Copy className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Format Variants */}
            {Object.keys(formats).length > 0 && (
              <div>
                <div className="text-sm text-teal-300 font-medium mb-3 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" /> Number Format Variants ({Object.keys(formats).length})
                  <button
                    onClick={() => {
                      const allFormats = Object.entries(formats).map(([l, v]) => `${l}: ${v}`).join('\n');
                      copyValue(allFormats);
                    }}
                    className="ml-auto px-2.5 py-1 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/25 text-teal-400 text-[10px] font-medium transition-all flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy All
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(formats).map(([label, val], i) => (
                    <motion.div key={label} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/30 border border-teal-500/10 hover:border-teal-500/25 transition-colors group cursor-pointer"
                      onClick={() => copyValue(val)}>
                      <span className="text-xs text-gray-500 capitalize">{label.replace(/_/g, ' ')}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-teal-300 select-all">{val}</span>
                        <Copy className="w-3 h-3 text-gray-700 group-hover:text-teal-400 transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // ── CASE NOTES TAB ──
  function renderNotes() {
    const fullNumber = results?.number || results?.formatted || `${selectedCountry.dial}${phoneNumber}`;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-300 font-semibold"><FileText className="w-5 h-5" /> Case Notes & Classification</div>
        <CaseNotes phone={fullNumber} />
      </div>
    );
  }

  // ── ADVANCED TAB ──
  function renderAdvanced() {
    const fullNumber = currentFullNumber;
    const history = getHistory();
    const allHistory = getAllHistory();

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-indigo-300 font-semibold"><Target className="w-5 h-5" /> Advanced Investigation Tools</div>

        {/* Number Permutations */}
        <div className="p-4 rounded-xl bg-slate-800/20 border border-indigo-500/10">
          <NumberPermutations phone={fullNumber} countryDial={selectedCountry.dial} onCopy={copyValue} />
        </div>

        {/* Adjacent Number Scanner */}
        <div className="p-4 rounded-xl bg-slate-800/20 border border-teal-500/10">
          <LinkedNumberScanner phone={fullNumber} countryDial={selectedCountry.dial} />
        </div>

        {/* Number History Timeline */}
        <div className="p-4 rounded-xl bg-slate-800/20 border border-amber-500/10">
          <div className="flex items-center gap-2 text-amber-300 text-sm font-medium mb-3">
            <Clock className="w-4 h-4" />
            Lookup History — This Number ({history.length})
          </div>
          {history.length > 0 ? (
            <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin pr-1">
              {history.map((h, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/30 border border-white/5">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                      h.riskLevel === 'Low' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      h.riskLevel === 'Medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                      h.riskLevel === 'High' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>{h.riskLevel}</span>
                    <span className="text-xs text-gray-400">Score: {h.riskScore}</span>
                    <span className="text-xs text-gray-600">{h.carrier}</span>
                  </div>
                  <div className="text-[10px] text-gray-600 flex-shrink-0">
                    {new Date(h.timestamp).toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-600 text-xs">No previous lookups for this number</div>
          )}
        </div>

        {/* Recent Global Lookups */}
        <div className="p-4 rounded-xl bg-slate-800/20 border border-slate-500/10">
          <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-3">
            <Database className="w-4 h-4" />
            Recent Lookups — All Numbers ({allHistory.length})
          </div>
          {allHistory.length > 0 ? (
            <div className="space-y-1.5 max-h-[200px] overflow-y-auto scrollbar-thin pr-1">
              {allHistory.slice(0, 15).map((h, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/20 border border-white/5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-mono text-gray-400 truncate max-w-[140px]">{h.phone}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                      h.riskLevel === 'Low' ? 'text-emerald-500' : h.riskLevel === 'Medium' ? 'text-amber-500' : 'text-red-500'
                    }`}>{h.riskLevel}</span>
                  </div>
                  <span className="text-[10px] text-gray-700">{new Date(h.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-600 text-xs">No lookups recorded yet</div>
          )}
        </div>

        {/* PhoneInfoga Intelligence Summary */}
        {results?.phoneInfoga && (
          <div className="p-4 rounded-xl bg-slate-800/20 border border-pink-500/10">
            <div className="flex items-center gap-2 text-pink-300 text-sm font-medium mb-3">
              <Code className="w-4 h-4" />
              PhoneInfoga Scanner Intelligence
            </div>
            <div className="space-y-3">
              {results.phoneInfoga.numberIntelligence && (
                <div className="p-3 rounded-xl bg-pink-500/5 border border-pink-500/10">
                  <div className="text-xs text-gray-500 mb-2">Number Intelligence</div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(results.phoneInfoga.numberIntelligence).map(([k, v]) => (
                      <div key={k} className="flex justify-between p-2 rounded-lg bg-black/20">
                        <span className="text-[10px] text-gray-500 capitalize">{k.replace(/_/g, ' ')}</span>
                        <span className="text-[10px] text-gray-300 font-medium">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Dorks: <strong className="text-pink-400">{results.phoneInfoga.googleDorks?.length || 0}</strong></span>
                <span>Links: <strong className="text-blue-400">{results.phoneInfoga.osintLinks?.length || 0}</strong></span>
                <span>Hashes: <strong className="text-amber-400">{Object.keys(results.phoneInfoga.hashes || {}).length}</strong></span>
                <span>Formats: <strong className="text-teal-400">{Object.keys(results.phoneInfoga.formatVariants || {}).length}</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* NumLookup API Summary */}
        {results?.numLookup && (
          <div className="p-4 rounded-xl bg-slate-800/20 border border-violet-500/10">
            <div className="flex items-center gap-2 text-violet-300 text-sm font-medium mb-3">
              <Eye className="w-4 h-4" />
              NumLookup API Data
            </div>
            <div className="grid grid-cols-2 gap-2">
              {results.numLookup.carrier && <InfoRow icon={Radio} label="NL Carrier" value={results.numLookup.carrier} />}
              {results.numLookup.lineType && <InfoRow icon={Smartphone} label="NL Line Type" value={results.numLookup.lineType} />}
              {results.numLookup.location && <InfoRow icon={MapPin} label="NL Location" value={results.numLookup.location} />}
              {results.numLookup.countryName && <InfoRow icon={Globe} label="NL Country" value={results.numLookup.countryName} />}
            </div>
          </div>
        )}

        {/* Data Sources Summary */}
        <div className="p-4 rounded-xl bg-slate-800/20 border border-gray-500/10">
          <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-3">
            <Database className="w-4 h-4" />
            Active Data Sources
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['NumVerify', 'Veriphone', 'AbstractAPI', 'IPQualityScore', 'libphonenumber', 'REST Countries',
              'Ignorant', 'StopForumSpam', 'Hudson Rock', 'PhoneInfoga', 'NumLookup',
              ...(results?.truecallerData ? ['Truecaller'] : []),
              ...(results?.fullContactData ? ['FullContact'] : []),
            ].map(src => (
              <span key={src} className="px-2 py-1 rounded-full bg-slate-800/50 border border-white/5 text-[10px] text-gray-500">{src}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // TAB RENDERER MAP
  // ═══════════════════════════════════════════
  const tabRenderers = {
    overview: renderOverview,
    carrier: renderCarrier,
    geo: renderGeo,
    social: renderSocial,
    security: renderSecurity,
    breach: renderBreach,
    dorks: renderDorks,
    actions: renderQuickActions,
    notes: renderNotes,
    advanced: renderAdvanced,
  };

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 22 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-950 via-amber-950/15 to-slate-950 border border-amber-500/25 shadow-[0_0_80px_rgba(245,158,11,0.12)]"
      >
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute top-1/4 right-1/4 w-80 h-80 opacity-15">
            {[0, 1, 2, 3, 4].map(i => (
              <motion.circle key={i} cx="50%" cy="50%" r={40 + i * 35} fill="none" stroke="#f59e0b" strokeWidth="0.8"
                animate={{ opacity: [0.4, 0], scale: [1, 1.4] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.35 }} />
            ))}
          </svg>
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-500/8 rounded-full blur-[100px]" />
        </div>

        {/* HEADER */}
        <div className="relative px-3 sm:px-6 py-3 sm:py-4 border-b border-amber-500/15 bg-slate-950/60 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <motion.div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0"
                animate={{ rotate: isSearching ? [0, -5, 5, 0] : 0 }}
                transition={{ duration: 0.5, repeat: isSearching ? Infinity : 0 }}
              >
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
                  <span className="truncate">Phone Intelligence</span>
                  <span className="px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">v6</span>
                </h2>
                <p className="text-[11px] sm:text-xs text-amber-300/60 flex items-center gap-1">
                  <Database className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">17+ OSINT sources · PhoneInfoga · Google Dorks · Multi-engine analysis</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <div className="hidden sm:flex px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-amber-300">5</span>
                <span className="text-[10px] text-amber-200/60">cr</span>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRefresh}
                className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500/15 border border-white/10 transition-all" title="New Search">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} disabled={!results} onClick={handleExportJSON}
                className="hidden sm:flex p-2 rounded-lg bg-white/5 hover:bg-amber-500/15 border border-white/10 transition-all disabled:opacity-40" title="Export JSON">
                <Download className="w-4 h-4 text-amber-400" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} disabled={!results} onClick={handleExportCSV}
                className="hidden sm:flex p-2 rounded-lg bg-white/5 hover:bg-cyan-500/15 border border-white/10 transition-all disabled:opacity-40" title="Export CSV">
                <FileText className="w-4 h-4 text-cyan-400" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 transition-all">
                <X className="w-4 h-4 text-gray-400" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative overflow-y-auto max-h-[calc(95vh-70px)] sm:max-h-[calc(95vh-80px)]">
          <div className="p-3 sm:p-5">

            {/* INPUT SECTION */}
            <div className="mb-5">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/50 border border-amber-500/15 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Country selector */}
                  <div className="relative" ref={countryPickerRef}>
                    <button onClick={() => setShowCountryPicker(!showCountryPicker)}
                      className="w-full sm:w-auto flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/70 border border-amber-500/20 hover:border-amber-500/40 transition-colors">
                      <span className="text-2xl">{selectedCountry.flag}</span>
                      <span className="text-white font-mono font-medium">{selectedCountry.dial}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showCountryPicker ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Country picker dropdown */}
                    <AnimatePresence>
                      {showCountryPicker && (
                        <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute top-full left-0 mt-2 w-[340px] max-h-[400px] overflow-hidden rounded-xl bg-slate-900 border border-amber-500/30 shadow-2xl shadow-black/50 z-50">
                          <div className="p-2 border-b border-white/5 space-y-2">
                            <input type="text" value={countrySearch} onChange={e => setCountrySearch(e.target.value)}
                              placeholder="Search country, code, or dial..." autoFocus
                              className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500/40" />
                            <div className="flex gap-1 flex-wrap">
                              {regions.map(r => (
                                <button key={r} onClick={() => setRegionFilter(r)}
                                  className={`px-2 py-0.5 rounded-full text-[10px] transition-colors ${
                                    regionFilter === r ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800/50 text-gray-500 border border-white/5 hover:text-gray-300'
                                  }`}>{r}</button>
                              ))}
                            </div>
                          </div>
                          <div className="overflow-y-auto max-h-[300px]">
                            {filteredCountries.length === 0 && <div className="text-center py-4 text-gray-500 text-sm">No countries found</div>}
                            {filteredCountries.map(c => (
                              <button key={c.code + c.dial} onClick={() => { setSelectedCountry(c); setShowCountryPicker(false); setCountrySearch(''); setRegionFilter('All'); inputRef.current?.focus(); }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-amber-500/10 transition-colors ${c.code === selectedCountry.code && c.dial === selectedCountry.dial ? 'bg-amber-500/15' : ''}`}>
                                <span className="text-xl">{c.flag}</span>
                                <div className="text-left flex-1 min-w-0">
                                  <div className="text-sm text-white truncate">{c.name}</div>
                                  <div className="text-[11px] text-gray-500">{c.format} · {c.region}</div>
                                </div>
                                <span className="text-xs font-mono text-amber-400">{c.dial}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Phone input */}
                  <div className="flex-1 relative">
                    <input ref={inputRef} type="tel" value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      onKeyDown={e => { if (e.key === 'Enter' && !isSearching) handleSearch(); }}
                      placeholder={selectedCountry.format || 'Enter number'}
                      maxLength={selectedCountry.maxLen || 15}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/70 border-2 border-amber-500/20 text-white text-lg font-mono placeholder-gray-600 focus:outline-none focus:border-amber-400/60 transition-colors" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 font-mono">{phoneNumber.length}/{selectedCountry.maxLen || 15}</div>
                  </div>

                  {/* Search button */}
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSearch}
                    disabled={isSearching || !phoneNumber.trim()}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-amber-500/25 min-w-[140px]">
                    {isSearching ? (
                      <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Signal className="w-5 h-5" /></motion.div><span className="hidden sm:inline">Scanning...</span></>
                    ) : (
                      <><Search className="w-5 h-5" /><span>Investigate</span></>
                    )}
                  </motion.button>
                </div>

                {/* Format hint */}
                <div className="mt-2 flex items-center justify-between flex-wrap gap-1">
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    <Info className="w-3 h-3" /> Format: {selectedCountry.dial} {selectedCountry.format} · Press Enter to search
                  </div>
                  <div className="flex items-center gap-3">
                    {displayPhone && <div className="text-xs text-amber-400/60 font-mono">{displayPhone}</div>}
                    {lastLookupTime && <div className="text-[10px] text-gray-600">Last: {lastLookupTime.toLocaleTimeString()}</div>}
                  </div>
                </div>

                {/* Truecaller Connection Status */}
                <div className="mt-3">
                  {!tcSetup.show ? (
                    <button onClick={() => setTcSetup(s => ({ ...s, show: true, step: tcStatus.connected ? 'connected' : 'phone' }))}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-xs ${
                        tcStatus.connected
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/15'
                          : 'bg-blue-500/10 border-blue-500/20 text-blue-300 hover:bg-blue-500/15'
                      }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-base">📇</span>
                        <span className="font-medium">Truecaller Caller ID</span>
                        {tcStatus.connected ? (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">ACTIVE</span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold">CONNECT</span>
                        )}
                      </div>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      className="p-3 rounded-xl bg-slate-800/60 border border-blue-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-white">
                          <span>📇</span> Truecaller Setup
                        </div>
                        <button onClick={() => setTcSetup(s => ({ ...s, show: false }))} className="text-gray-500 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {tcStatus.connected ? (
                        <div className="text-xs text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Truecaller is connected — phone lookups include real-time caller ID data.
                          {tcStatus.verifiedAt && <span className="text-gray-500 ml-1">Since {new Date(tcStatus.verifiedAt).toLocaleDateString()}</span>}
                        </div>
                      ) : tcSetup.step === 'phone' ? (
                        <div className="space-y-2">
                          <p className="text-[11px] text-gray-400">Enter your Truecaller-registered phone number to activate real-time caller ID lookups.</p>
                          <div className="flex gap-2">
                            <input type="tel" value={tcSetup.phone} onChange={e => setTcSetup(s => ({ ...s, phone: e.target.value }))}
                              placeholder="+919876543210" className="flex-1 px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-blue-500/40" />
                            <button onClick={tcLogin} disabled={tcSetup.loading || !tcSetup.phone.trim()}
                              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-40 hover:bg-blue-500 transition-colors">
                              {tcSetup.loading ? 'Sending...' : 'Send OTP'}
                            </button>
                          </div>
                          {tcSetup.error && <p className="text-[11px] text-red-400">{tcSetup.error}</p>}
                        </div>
                      ) : tcSetup.step === 'otp' ? (
                        <div className="space-y-2">
                          <p className="text-[11px] text-amber-300">OTP sent to {tcSetup.phone}. Enter it below to verify.</p>
                          <div className="flex gap-2">
                            <input type="text" value={tcSetup.otp} onChange={e => setTcSetup(s => ({ ...s, otp: e.target.value }))}
                              placeholder="Enter 6-digit OTP" maxLength={6} className="flex-1 px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-amber-500/40 tracking-widest text-center" />
                            <button onClick={tcVerify} disabled={tcSetup.loading || !tcSetup.otp.trim()}
                              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium disabled:opacity-40 hover:bg-emerald-500 transition-colors">
                              {tcSetup.loading ? 'Verifying...' : 'Verify'}
                            </button>
                          </div>
                          {tcSetup.error && <p className="text-[11px] text-red-400">{tcSetup.error}</p>}
                          <button onClick={() => setTcSetup(s => ({ ...s, step: 'phone', otp: '', error: '' }))} className="text-[11px] text-gray-500 hover:text-blue-400">
                            ← Change number
                          </button>
                        </div>
                      ) : null}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* SCANNING ANIMATION */}
            <AnimatePresence>
              {isSearching && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-5">
                  <div className="p-5 rounded-2xl bg-slate-900/50 border border-amber-500/15">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                        <Cpu className="w-6 h-6 text-amber-400" />
                      </motion.div>
                      <div>
                        <div className="text-white font-medium">Multi-Engine Intelligence Scan</div>
                        <motion.div key={scanPhase} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-amber-300/70">
                          {scanPhase || 'Initializing engines...'}
                        </motion.div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-3">
                      {['libphonenumber', 'REST Countries', 'Numverify', 'Veriphone', 'Abstract API', 'IPQualityScore', 'Hudson Rock',
                        'StopForumSpam', 'Ignorant', 'Carrier DB', 'NumLookup', 'PhoneInfoga', 'OSINT Dorks', 'Format Engine', 'Risk Engine', 'Google Dorks', 'Intel Fusion'].map((source, i) => (
                        <motion.div key={source} initial={{ opacity: 0.3 }}
                          animate={{
                            opacity: activeSources.includes(source) || activeSources.length > i ? 1 : [0.3, 0.6, 0.3],
                            borderColor: activeSources.length > i ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.2)',
                          }}
                          transition={{ duration: 1.5, repeat: activeSources.length > i ? 0 : Infinity, delay: i * 0.08 }}
                          className="px-2 py-1.5 rounded-lg bg-slate-800/40 border text-center">
                          <div className="text-[10px] text-gray-400 truncate">{source}</div>
                          {activeSources.length > i && <CheckCircle className="w-3 h-3 text-emerald-400 mx-auto mt-0.5" />}
                        </motion.div>
                      ))}
                    </div>

                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"
                        initial={{ width: '0%' }} animate={{ width: `${scanProgress}%` }} transition={{ duration: 0.3 }} />
                    </div>
                    <div className="text-right text-[10px] text-gray-600 mt-1">{Math.round(scanProgress)}% complete</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* RESULTS */}
            {results ? (
              <div>
                {/* Tab bar */}
                <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 scrollbar-thin">
                  {TABS.map(tab => (
                    <motion.button key={tab.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                        activeTab === tab.id
                          ? TAB_ACTIVE_CLASSES[tab.color] || TAB_ACTIVE_CLASSES.amber
                          : 'bg-slate-800/30 text-gray-500 border border-transparent hover:bg-slate-700/30 hover:text-gray-300'
                      }`}>
                      <tab.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                  <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }} className="p-4 sm:p-5 rounded-2xl bg-slate-900/40 border border-white/5 min-h-[350px]">
                    {(tabRenderers[activeTab] || renderOverview)()}
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : !isSearching ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-16 sm:py-20">
                <motion.div className="relative mb-6" animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }} transition={{ duration: 5, repeat: Infinity }}>
                  <Phone className="w-20 h-20 text-amber-500/20" />
                  <motion.div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Signal className="w-4 h-4 text-amber-400" />
                  </motion.div>
                </motion.div>
                <h3 className="text-lg text-gray-400 mb-2">Phone Intelligence Engine v6</h3>
                <p className="text-sm text-gray-600 text-center max-w-md mb-4">
                  Select a country code, enter a phone number, and run a comprehensive multi-source investigation. Returns real data from 17+ live OSINT engines including PhoneInfoga, Google Dorks, breach databases, and carrier intelligence.
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 max-w-lg">
                  {['libphonenumber', 'Numverify', 'Veriphone', 'Abstract API', 'IPQualityScore',
                    'Hudson Rock', 'StopForumSpam', 'REST Countries', 'Ignorant Social', 'Carrier DB',
                    'PhoneInfoga', 'NumLookup', 'Google Dorks', 'OSINT Links', 'Format Analysis', 'Risk Engine', 'Intel Fusion'].map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800/50 text-gray-600 border border-white/5">{s}</span>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> 60+ countries</span>
                  <span className="flex items-center gap-1"><Database className="w-3 h-3" /> 17+ sources</span>
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> 10-factor risk</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PhoneLookupTool;
