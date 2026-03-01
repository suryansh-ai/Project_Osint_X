import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Copy, Download, RefreshCw, Info, Wifi, MapPin, Globe, Building2, Radio } from 'lucide-react';
import { useToast } from '../common/Toast';
import { useHistory } from '../../context/HistoryContext';
import useClipboard from '../../context/hooks/useClipboard';
import { trackToolUsage } from '../../utils/analytics';
import { exportToJSON } from '../../utils/export';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const WiFiGeoTool = ({ onClose, onConsume }) => {
  const toast = useToast();
  const { addToHistory } = useHistory();
  const { copy } = useClipboard();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5, speedX: (Math.random() - 0.5) * 0.3, speedY: (Math.random() - 0.5) * 0.3,
      color: ['#06b6d4', '#22d3ee', '#0891b2', '#67e8f9'][Math.floor(Math.random() * 4)],
    }));
    let id;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { ctx.beginPath(); ctx.fillStyle = p.color + '15'; ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); p.x += p.speedX; p.y += p.speedY; if (p.x < 0 || p.x > canvas.width) p.speedX *= -1; if (p.y < 0 || p.y > canvas.height) p.speedY *= -1; });
      id = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(id);
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) { toast.error('Enter a BSSID (MAC address)'); return; }
    trackToolUsage('wifigeo', 'lookup', 'start');
    setIsSearching(true); setResults(null); onConsume?.(10);
    try {
      const resp = await fetch(`${API_BASE}/tools/wifi/lookup`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bssid: query.trim() }),
      });
      if (!resp.ok) { const e = await resp.json().catch(() => ({})); throw new Error(e.error || 'Lookup failed'); }
      const data = await resp.json();
      setResults(data);
      addToHistory('wifigeo', query, data);
      toast.success(data.found ? 'Location found!' : 'BSSID queried — no location match');
    } catch (err) { toast.error(err.message); }
    finally { setIsSearching(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={onClose}>
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 18 }} onClick={e => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-cyan-950/10 to-slate-950 border border-cyan-500/30 shadow-[0_0_100px_rgba(6,182,212,0.1)]">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="relative z-10 flex flex-col max-h-[92vh]">
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30"><Wifi className="w-6 h-6 text-cyan-400" /></div>
              <div><h2 className="text-xl font-bold text-white">WiFi Geolocation</h2><p className="text-sm text-slate-400">Locate access points by BSSID</p></div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5"><X className="w-5 h-5 text-slate-400" /></button>
          </div>
          <div className="p-6 border-b border-white/5">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Radio className="absolute w-5 h-5 left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter BSSID (e.g. 00:1A:2B:3C:4D:5E)" className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none font-mono" />
              </div>
              <button onClick={handleSearch} disabled={isSearching}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
                {isSearching ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                {isSearching ? 'Locating...' : 'Locate'}
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {isSearching && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                <p className="mt-4 text-slate-400">Querying WiFi databases...</p>
              </div>
            )}
            {results && !isSearching && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-slate-400 flex items-center gap-2"><Wifi className="w-4 h-4" /> BSSID</p>
                    <p className="text-lg font-bold text-cyan-400 font-mono">{results.bssid}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-slate-400 flex items-center gap-2"><Building2 className="w-4 h-4" /> Vendor</p>
                    <p className="text-lg font-bold text-white">{results.vendor || 'Unknown'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-slate-400 flex items-center gap-2"><MapPin className="w-4 h-4" /> Located</p>
                    <p className={`text-lg font-bold ${results.found ? 'text-green-400' : 'text-yellow-400'}`}>
                      {results.found ? 'Yes' : 'No Match'}
                    </p>
                  </div>
                </div>
                {results.location && (
                  <div className="p-5 rounded-xl bg-white/5 border border-cyan-500/20">
                    <p className="text-sm text-slate-400 mb-3 flex items-center gap-2"><Globe className="w-4 h-4" /> Geolocation</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div><p className="text-slate-500">Latitude</p><p className="text-white font-mono">{results.location.latitude}</p></div>
                      <div><p className="text-slate-500">Longitude</p><p className="text-white font-mono">{results.location.longitude}</p></div>
                      <div><p className="text-slate-500">Accuracy</p><p className="text-white">{results.location.accuracy}m</p></div>
                    </div>
                    <a href={`https://www.google.com/maps?q=${results.location.latitude},${results.location.longitude}`} target="_blank" rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300">
                      <MapPin className="w-3 h-3" /> View on Google Maps
                    </a>
                  </div>
                )}
                {results.macDetails && (
                  <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-slate-400 mb-3">MAC Details</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div><p className="text-slate-500">Company</p><p className="text-white">{results.macDetails.company || 'N/A'}</p></div>
                      <div><p className="text-slate-500">Country</p><p className="text-white">{results.macDetails.country || 'N/A'}</p></div>
                      <div><p className="text-slate-500">Type</p><p className="text-white">{results.macDetails.type || 'N/A'}</p></div>
                      <div><p className="text-slate-500">Updated</p><p className="text-white">{results.macDetails.updated || 'N/A'}</p></div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 justify-end">
                  <button onClick={() => copy(JSON.stringify(results, null, 2))} className="p-2 rounded-lg hover:bg-white/10"><Copy className="w-4 h-4 text-slate-400" /></button>
                  <button onClick={() => exportToJSON(results, 'wifi-geo-results')} className="p-2 rounded-lg hover:bg-white/10"><Download className="w-4 h-4 text-slate-400" /></button>
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-2"><Info className="w-3 h-3" /> Sources: {results.dataSources?.join(', ')} • {results.searchDuration}</div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WiFiGeoTool;
