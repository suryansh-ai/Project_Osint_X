// =============================================================================
// VEHICLE INTELLIGENCE ENGINE v2 - NHTSA / Indian RTO / Recalls / Challans
// =============================================================================

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car, X, Search, Zap, MapPin, User, Shield, AlertTriangle,
  CheckCircle, Clock, RefreshCw, Activity, Database, FileText,
  Calendar, Settings, Eye, Lock, Truck, Navigation, Info, Hash,
  ExternalLink, Copy, Download, Globe, Star, BarChart3, Crosshair,
  AlertCircle, Target, Link2, Layers, BookOpen, ChevronDown,
  DollarSign, TrendingDown, Scroll
} from 'lucide-react';
import { useToast } from '../common/Toast';
import { useHistory } from '../../context/HistoryContext';
import useClipboard from '../../context/hooks/useClipboard';
import { trackToolUsage } from '../../utils/analytics';
import { exportToJSON, exportToCSV, formatForExport } from '../../utils/export';

// -- Reusable Components --
function InfoRow({ icon: Icon, label, value, mono, highlight, copyable, onCopy, link }) {
  if (!value || value === 'N/A' || value === 'null' || value === 'undefined') return null;
  return (
    <div className="flex items-center justify-between py-1.5 group">
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        {Icon && <Icon className="w-3.5 h-3.5 text-orange-400/60" />}
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer"
            className={'text-sm text-cyan-400 hover:text-cyan-300 underline ' + (mono ? 'font-mono' : '')}>{value}</a>
        ) : (
          <span className={'text-sm ' + (highlight ? 'text-orange-300 font-medium' : 'text-white') + ' ' + (mono ? 'font-mono' : '')}>{value}</span>
        )}
        {copyable && onCopy && (
          <button onClick={() => onCopy(String(value))} className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5">
            <Copy className="w-3 h-3 text-gray-500 hover:text-white" />
          </button>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color = 'text-white', sub }) {
  return (
    <div className="p-3 rounded-xl bg-gray-800/40 border border-white/5 hover:border-orange-500/20 transition-colors">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={'w-4 h-4 ' + color} />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <div className={'text-sm font-semibold ' + color + ' truncate'}>{value || 'N/A'}</div>
      {sub && <div className="text-[10px] text-gray-500 mt-0.5">{sub}</div>}
    </div>
  );
}

function SourceBadge({ name }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <CheckCircle className="w-2.5 h-2.5" /> {name}
    </span>
  );
}

function RiskGauge({ score, level }) {
  const color = level === 'Low' ? '#22c55e' : level === 'Medium' ? '#f59e0b' : level === 'High' ? '#f97316' : '#ef4444';
  return (
    <div className="p-4 rounded-xl bg-gray-800/40 border border-white/5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400">Vehicle Risk Score</span>
        <span className="text-xs font-bold" style={{ color }}>{level}</span>
      </div>
      <div className="h-2.5 rounded-full bg-gray-700/50 overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
          initial={{ width: 0 }} animate={{ width: Math.min(score, 100)+'%' }}
          transition={{ duration: 1, ease: 'easeOut' }} />
      </div>
      <div className="text-right mt-1">
        <span className="text-xs font-mono" style={{ color }}>{score}/100</span>
      </div>
    </div>
  );
}

function SafetyStarRating({ rating, label }) {
  if (!rating || rating === 'Not Rated') return null;
  const stars = parseInt(rating) || 0;
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-gray-400">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} className={'w-4 h-4 ' + (i <= stars ? 'text-amber-400 fill-amber-400' : 'text-gray-600')} />
        ))}
        <span className="text-xs text-gray-500 ml-1">{rating}/5</span>
      </div>
    </div>
  );
}


const VehicleInfoTool = ({ onClose, onConsume }) => {
  const toast = useToast();
  const { addToHistory } = useHistory();
  const { copy } = useClipboard();

  const [vehicleNumber, setVehicleNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchProgress, setSearchProgress] = useState(0);
  const [lookupType, setLookupType] = useState('indian');
  const [dorkFilter, setDorkFilter] = useState('all');
  const canvasRef = useRef(null);

  const copyValue = (val) => { if (!val) return; copy(val); toast.success('Copied!'); };

  const handleRefresh = () => {
    setVehicleNumber(''); setResults(null); setSearchProgress(0); setActiveTab('overview');
    toast.info('Ready for new search');
  };

  const handleExportJSON = () => {
    if (!results) { toast.error('No results to export'); return; }
    const ok = exportToJSON(results, 'vehicle_'+vehicleNumber+'_'+Date.now()+'.json');
    if (ok) toast.success('Exported JSON'); else toast.error('Export failed');
  };

  // Background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const particles = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1, speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3, opacity: Math.random() * 0.4 + 0.2,
    }));
    let running = true;
    const animate = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(251, 146, 60, '+p.opacity+')';
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.y += p.speedY; p.x += p.speedX;
        if (p.y > canvas.height || p.y < 0) p.speedY *= -1;
        if (p.x > canvas.width || p.x < 0) p.speedX *= -1;
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => { running = false; };
  }, []);

  const handleSearch = async () => {
    if (!vehicleNumber.trim()) {
      toast.error(lookupType === 'vin' ? 'Please enter a VIN' : 'Please enter a vehicle number');
      return;
    }
    if (lookupType === 'vin') {
      const cleanVin = vehicleNumber.replace(/[\s-]/g, '').toUpperCase();
      if (cleanVin.length !== 17) { toast.error('VIN must be exactly 17 characters'); return; }
      if (/[IOQ]/.test(cleanVin)) { toast.error('VIN cannot contain letters I, O, or Q'); return; }
    }

    trackToolUsage('vehicle-info', 'search', 'start');
    setIsSearching(true); setSearchProgress(0);
    onConsume && onConsume(12);

    const progressInterval = setInterval(() => {
      setSearchProgress(prev => Math.min(prev + 2, 95));
    }, 100);

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const endpoint = lookupType === 'vin' ? 'tools/vehicle/vin' : 'tools/vehicle/lookup';
      const bodyKey = lookupType === 'vin' ? 'vin' : 'vehicleNumber';

      const response = await fetch(API_BASE+'/'+endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [bodyKey]: vehicleNumber.trim().toUpperCase() }),
      });

      clearInterval(progressInterval);
      setSearchProgress(100);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Vehicle lookup failed');
      }

      const resultData = await response.json();
      setResults({ ...resultData, lookupType });
      setActiveTab('overview');
      addToHistory({ tool: 'Vehicle Info', query: vehicleNumber, timestamp: new Date().toISOString(), results: resultData });
      trackToolUsage('vehicle-info', 'search', 'success');
      toast.success(lookupType === 'vin'
        ? 'VIN decoded - '+(resultData.sourceCount || 1)+' sources queried!'
        : 'Vehicle info retrieved - '+(resultData.sourceCount || 1)+' sources!');
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Vehicle lookup error:', error);
      toast.error(error.message || 'Search failed');
      trackToolUsage('vehicle-info', 'search', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  // -- Tab definitions --
  const vinTabs = [
    { id: 'overview', label: 'Overview', icon: Car },
    { id: 'engine', label: 'Engine', icon: Settings },
    { id: 'safety', label: 'Safety', icon: Shield },
    { id: 'recalls', label: 'Recalls', icon: AlertTriangle },
    { id: 'osint', label: 'OSINT Links', icon: Crosshair },
  ];
  const indianTabs = [
    { id: 'overview', label: 'Overview', icon: Car },
    { id: 'vehicle', label: 'Vehicle', icon: Settings },
    { id: 'owner', label: 'Owner', icon: User },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'challan', label: 'Challan', icon: AlertTriangle },
    { id: 'dorks', label: 'Google Dorks', icon: Scroll },
    { id: 'osint', label: 'OSINT Links', icon: Crosshair },
  ];
  const tabs = results && results.lookupType === 'vin' ? vinTabs : indianTabs;

  // ============= VIN OVERVIEW TAB =============
  function renderVinOverview() {
    const r = results;
    const d = r.decoded || {};
    const risk = r.riskAssessment || {};
    const va = r.vinAnalysis || {};
    return (
      <div className="space-y-4">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-[60px]" />
          <div className="flex items-start justify-between gap-4 flex-wrap relative">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{'\u{1F697}'}</div>
              <div>
                <div className="text-2xl font-bold text-white font-mono tracking-wide">{r.vin}</div>
                <div className="text-sm text-orange-300/70 mt-1">{d.year} {d.make} {d.model} {d.trim || ''}</div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={'px-2 py-0.5 rounded-lg text-xs font-medium '+(va.checkDigitValid ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30')}>
                    {va.checkDigitValid ? '\u2713 Valid VIN' : '\u2717 Check Digit Invalid'}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">{d.bodyClass || d.vehicleType || 'Vehicle'}</span>
                  <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-violet-500/20 text-violet-400 border border-violet-500/30">{va.originCountry || 'Unknown'}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Sources</div>
              <div className="text-3xl font-bold text-orange-400">{r.sourceCount || 0}</div>
              {r.queryTime && <div className="text-xs text-gray-500 mt-1">{r.queryTime}ms</div>}
            </div>
          </div>
        </div>

        {r.dataSources && r.dataSources.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {r.dataSources.map(function(s) { return <SourceBadge key={s} name={s} />; })}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Car} label="Make" value={d.make || 'Unknown'} color="text-cyan-400" />
          <StatCard icon={Settings} label="Engine" value={r.engine && r.engine.cylinders ? r.engine.cylinders+' cyl '+(r.engine.displacement || '')+'L' : 'Unknown'} color="text-amber-400" />
          <StatCard icon={AlertTriangle} label="Recalls" value={(r.recallCount || 0)+' found'} color={r.recallCount > 0 ? 'text-red-400' : 'text-emerald-400'} />
          <StatCard icon={Shield} label="Risk" value={risk.level || 'Unknown'}
            color={risk.level === 'Low' ? 'text-emerald-400' : risk.level === 'Medium' ? 'text-amber-400' : 'text-red-400'}
            sub={'Score: '+(risk.score || 0)+'/100'} />
        </div>

        {risk.score !== undefined && <RiskGauge score={risk.score} level={risk.level} />}

        {risk.flags && risk.flags.length > 0 && (
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
            <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
              <AlertTriangle className="w-4 h-4" /> Risk Flags ({risk.flags.length})
            </div>
            {risk.flags.map(function(f, i) { return (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-red-500 mt-0.5">{'\u2022'}</span>
                <span className="text-gray-300">{f}</span>
              </div>
            ); })}
          </div>
        )}

        <div className="p-4 rounded-xl bg-gray-800/30 border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-violet-300 text-sm font-medium mb-2">
            <Hash className="w-4 h-4" /> VIN Structure Analysis
          </div>
          <InfoRow icon={Hash} label="WMI (Manufacturer)" value={va.wmi && va.wmiMeaning ? va.wmi+' \u2014 '+va.wmiMeaning : va.wmi} mono />
          <InfoRow icon={Hash} label="VDS (Descriptor)" value={va.vds} mono />
          <InfoRow icon={Hash} label="VIS (Identifier)" value={va.vis} mono />
          <InfoRow icon={Globe} label="Origin Country" value={va.originCountry} />
          <InfoRow icon={Calendar} label="Model Year Code" value={va.modelYearCode} />
          <InfoRow icon={MapPin} label="Assembly Plant" value={va.assemblyPlant} />
          <InfoRow icon={Hash} label="Serial Number" value={va.serialNumber} mono />
          <InfoRow icon={Truck} label="Manufacturer" value={d.manufacturer} />
          <InfoRow icon={MapPin} label="Plant Location" value={[d.plantCity, d.plantState, d.plantCountry].filter(Boolean).join(', ')} />
        </div>

        <div className="p-4 rounded-xl bg-gray-800/30 border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 text-sm font-medium mb-2">
            <Car className="w-4 h-4" /> Vehicle Identification
          </div>
          <InfoRow icon={Car} label="Make" value={d.make} />
          <InfoRow icon={Car} label="Model" value={d.model} />
          <InfoRow icon={Calendar} label="Year" value={d.year} />
          <InfoRow icon={Car} label="Body Class" value={d.bodyClass} />
          <InfoRow icon={Car} label="Vehicle Type" value={d.vehicleType} />
          <InfoRow icon={Car} label="Series" value={d.series} />
          <InfoRow icon={Car} label="Trim" value={d.trim} />
          <InfoRow icon={Car} label="Doors" value={d.doors} />
          <InfoRow icon={Car} label="Drive Type" value={d.driveType} />
          <InfoRow icon={Car} label="GVWR" value={d.gvwr} />
        </div>

        {r.safetyRatings && (
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
              <Star className="w-4 h-4" /> NHTSA Safety Ratings
            </div>
            <SafetyStarRating rating={r.safetyRatings.overallRating} label="Overall Rating" />
            <SafetyStarRating rating={r.safetyRatings.overallFrontCrash} label="Front Crash" />
            <SafetyStarRating rating={r.safetyRatings.overallSideCrash} label="Side Crash" />
            <SafetyStarRating rating={r.safetyRatings.rollover} label="Rollover" />
          </div>
        )}
      </div>
    );
  }

  // ============= VIN ENGINE TAB =============
  function renderVinEngine() {
    const eng = results.engine || {};
    const trans = results.transmission || {};
    const dims = results.dimensions || {};
    const elec = results.electric || {};
    const hasElectric = Object.values(elec).some(function(v) { return v; });
    return (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gray-800/30 border border-white/5 space-y-2">
            <div className="text-sm font-mono text-orange-400 mb-2">ENGINE SPECIFICATIONS</div>
            <InfoRow icon={Settings} label="Engine Model" value={eng.engineModel} />
            <InfoRow icon={Settings} label="Displacement" value={eng.displacement ? eng.displacement+'L' : null} />
            <InfoRow icon={Settings} label="Cylinders" value={eng.cylinders} />
            <InfoRow icon={Settings} label="Configuration" value={eng.configuration} />
            <InfoRow icon={Zap} label="Horsepower" value={eng.horsepower ? eng.horsepower+' HP' : null} />
            <InfoRow icon={Settings} label="Fuel Type" value={eng.fuelType} />
            <InfoRow icon={Settings} label="Turbo" value={eng.turbo} />
            <InfoRow icon={Settings} label="Valve Train" value={eng.valve_train} />
            <InfoRow icon={Settings} label="Fuel Delivery" value={eng.fuelDeliveryType} />
            <InfoRow icon={Settings} label="Cooling" value={eng.cooling} />
            <InfoRow icon={Truck} label="Engine Manufacturer" value={eng.engineManufacturer} />
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gray-800/30 border border-white/5 space-y-2">
              <div className="text-sm font-mono text-orange-400 mb-2">TRANSMISSION</div>
              <InfoRow icon={Settings} label="Type" value={trans.type} />
              <InfoRow icon={Settings} label="Speeds" value={trans.speeds} />
            </div>
            <div className="p-4 rounded-xl bg-gray-800/30 border border-white/5 space-y-2">
              <div className="text-sm font-mono text-orange-400 mb-2">DIMENSIONS</div>
              <InfoRow icon={Car} label="Wheelbase" value={dims.wheelbase ? dims.wheelbase+' in' : null} />
              <InfoRow icon={Car} label="Track Width" value={dims.trackWidth ? dims.trackWidth+' in' : null} />
              <InfoRow icon={Car} label="Curb Weight" value={dims.weight ? dims.weight+' lbs' : null} />
              <InfoRow icon={Car} label="Bed Length" value={dims.bedLength ? dims.bedLength+' in' : null} />
            </div>
            {hasElectric && (
              <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 space-y-2">
                <div className="text-sm font-mono text-green-400 mb-2">{'\u26A1'} ELECTRIC VEHICLE</div>
                <InfoRow icon={Zap} label="Battery Type" value={elec.batteryType} />
                <InfoRow icon={Zap} label="Battery kWh" value={elec.batteryKwh} />
                <InfoRow icon={Zap} label="Charger Level" value={elec.chargerLevel} />
                <InfoRow icon={Zap} label="Charger Power" value={elec.chargerPowerKw ? elec.chargerPowerKw+' kW' : null} />
                <InfoRow icon={Zap} label="EV Drive Unit" value={elec.evDriveUnit} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============= VIN SAFETY TAB =============
  function renderVinSafety() {
    const s = results.safety || {};
    const sr = results.safetyRatings || {};
    return (
      <div className="space-y-4">
        {sr.overallRating && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mb-3">
              <Star className="w-4 h-4" /> NHTSA Crash Test Ratings
            </div>
            <SafetyStarRating rating={sr.overallRating} label="Overall Rating" />
            <SafetyStarRating rating={sr.overallFrontCrash} label="Front Crash (Overall)" />
            <SafetyStarRating rating={sr.frontCrashDriver} label="Front Crash (Driver)" />
            <SafetyStarRating rating={sr.frontCrashPassenger} label="Front Crash (Passenger)" />
            <SafetyStarRating rating={sr.overallSideCrash} label="Side Crash (Overall)" />
            <SafetyStarRating rating={sr.sideCrashDriver} label="Side Crash (Driver)" />
            <SafetyStarRating rating={sr.sideCrashPassenger} label="Side Crash (Passenger)" />
            <SafetyStarRating rating={sr.rollover} label="Rollover" />
            {sr.rolloverPossibility && (
              <div className="text-xs text-gray-400 mt-1">Rollover probability: {sr.rolloverPossibility}</div>
            )}
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gray-800/30 border border-white/5 space-y-2">
            <div className="text-sm font-mono text-orange-400 mb-2">SAFETY FEATURES</div>
            {s.abs && <div className="flex justify-between py-1"><span className="text-sm text-gray-400">ABS</span><span className={'text-sm '+(s.abs==='Standard'?'text-emerald-400':'text-white')}>{s.abs}</span></div>}
            {s.esc && <div className="flex justify-between py-1"><span className="text-sm text-gray-400">ESC</span><span className={'text-sm '+(s.esc==='Standard'?'text-emerald-400':'text-white')}>{s.esc}</span></div>}
            {s.airbags && <div className="flex justify-between py-1"><span className="text-sm text-gray-400">Front Airbags</span><span className="text-sm text-white">{s.airbags}</span></div>}
            {s.sideAirbags && <div className="flex justify-between py-1"><span className="text-sm text-gray-400">Side Airbags</span><span className="text-sm text-white">{s.sideAirbags}</span></div>}
            {s.curtainAirbags && <div className="flex justify-between py-1"><span className="text-sm text-gray-400">Curtain Airbags</span><span className="text-sm text-white">{s.curtainAirbags}</span></div>}
            {s.kneeAirbag && <div className="flex justify-between py-1"><span className="text-sm text-gray-400">Knee Airbag</span><span className="text-sm text-white">{s.kneeAirbag}</span></div>}
            {s.tpms && <div className="flex justify-between py-1"><span className="text-sm text-gray-400">TPMS</span><span className="text-sm text-white">{s.tpms}</span></div>}
            {s.tractionControl && <div className="flex justify-between py-1"><span className="text-sm text-gray-400">Traction Control</span><span className="text-sm text-white">{s.tractionControl}</span></div>}
            {s.backupCamera && <div className="flex justify-between py-1"><span className="text-sm text-gray-400">Backup Camera</span><span className="text-sm text-white">{s.backupCamera}</span></div>}
          </div>
          <div className="p-4 rounded-xl bg-gray-800/30 border border-white/5 space-y-2">
            <div className="text-sm font-mono text-orange-400 mb-2">DRIVER ASSISTANCE</div>
            {s.blindSpotMon && <div className="flex justify-between py-1"><span className="text-sm text-gray-400">Blind Spot Monitor</span><span className="text-sm text-white">{s.blindSpotMon}</span></div>}
            {s.laneDepartureWarning && <div className="flex justify-between py-1"><span className="text-sm text-gray-400">Lane Departure Warning</span><span className="text-sm text-white">{s.laneDepartureWarning}</span></div>}
            {s.laneKeepingAssistance && <div className="flex justify-between py-1"><span className="text-sm text-gray-400">Lane Keeping Assist</span><span className="text-sm text-white">{s.laneKeepingAssistance}</span></div>}
            {s.forwardCollisionWarning && <div className="flex justify-between py-1"><span className="text-sm text-gray-400">Forward Collision Warning</span><span className="text-sm text-white">{s.forwardCollisionWarning}</span></div>}
            {s.automaticCrashNotification && <div className="flex justify-between py-1"><span className="text-sm text-gray-400">Crash Notification</span><span className="text-sm text-white">{s.automaticCrashNotification}</span></div>}
            {s.adaptiveCruiseControl && <div className="flex justify-between py-1"><span className="text-sm text-gray-400">Adaptive Cruise</span><span className="text-sm text-white">{s.adaptiveCruiseControl}</span></div>}
            {s.crashImminentBraking && <div className="flex justify-between py-1"><span className="text-sm text-gray-400">Crash Imminent Braking</span><span className="text-sm text-white">{s.crashImminentBraking}</span></div>}
            {s.parkAssist && <div className="flex justify-between py-1"><span className="text-sm text-gray-400">Park Assist</span><span className="text-sm text-white">{s.parkAssist}</span></div>}
            {s.rearVisibilitySystem && <div className="flex justify-between py-1"><span className="text-sm text-gray-400">Rear Visibility</span><span className="text-sm text-white">{s.rearVisibilitySystem}</span></div>}
            {s.keylessIgnition && <div className="flex justify-between py-1"><span className="text-sm text-gray-400">Keyless Ignition</span><span className="text-sm text-white">{s.keylessIgnition}</span></div>}
          </div>
        </div>
      </div>
    );
  }

  // ============= RECALLS & COMPLAINTS TAB =============
  function renderRecalls() {
    const recalls = results.recalls || [];
    const complaints = results.complaints || [];
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
          <div className="flex items-center gap-2 text-red-400 text-sm font-semibold mb-3">
            <AlertTriangle className="w-4 h-4" /> NHTSA Recalls ({recalls.length})
          </div>
          {recalls.length === 0 ? (
            <div className="text-sm text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> No active recalls found for this VIN
            </div>
          ) : (
            <div className="space-y-3">
              {recalls.map(function(r, i) { return (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="p-3 rounded-xl bg-gray-800/40 border border-red-500/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-red-400 font-mono">{r.campaignNumber}</span>
                    <span className="text-xs text-gray-500">{r.reportDate}</span>
                  </div>
                  <div className="text-sm text-orange-300 font-medium">{r.component}</div>
                  <div className="text-xs text-gray-400 leading-relaxed">{r.summary ? r.summary.substring(0, 250) : ''}{r.summary && r.summary.length > 250 ? '...' : ''}</div>
                  {r.consequence && <div className="text-xs text-red-300"><span className="font-medium">Consequence:</span> {r.consequence.substring(0, 150)}</div>}
                  {r.remedy && <div className="text-xs text-emerald-300"><span className="font-medium">Remedy:</span> {r.remedy.substring(0, 150)}</div>}
                </motion.div>
              ); })}
            </div>
          )}
        </div>

        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mb-3">
            <FileText className="w-4 h-4" /> NHTSA Complaints ({complaints.length})
          </div>
          {complaints.length === 0 ? (
            <div className="text-sm text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> No complaints filed for this VIN
            </div>
          ) : (
            <div className="space-y-3">
              {complaints.slice(0, 10).map(function(c, i) { return (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="p-3 rounded-xl bg-gray-800/40 border border-amber-500/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-400 font-mono">#{c.odiNumber}</span>
                    <span className="text-xs text-gray-500">{c.dateComplaint}</span>
                  </div>
                  <div className="text-sm text-orange-300 font-medium">{c.component}</div>
                  <div className="text-xs text-gray-400 leading-relaxed">{c.summary ? c.summary.substring(0, 200) : ''}{c.summary && c.summary.length > 200 ? '...' : ''}</div>
                  <div className="flex items-center gap-3 text-xs">
                    {c.crash && <span className="text-red-400">{'\u{1F4A5}'} Crash reported</span>}
                    {c.fire && <span className="text-red-400">{'\u{1F525}'} Fire reported</span>}
                    {c.injuries > 0 && <span className="text-amber-400">{'\u{1F915}'} {c.injuries} injury(ies)</span>}
                    {c.speed && <span className="text-gray-500">Speed: {c.speed} mph</span>}
                  </div>
                </motion.div>
              ); })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============= INDIAN OVERVIEW TAB =============
  function renderIndianOverview() {
    const r = results;
    const reg = r.registration || {};
    const veh = r.vehicle || {};
    const st = r.status || {};
    const sd = r.structuralDecode || {};
    const risk = r.riskAssessment || {};
    const ins = r.insurance || {};
    return (
      <div className="space-y-4">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-[60px]" />
          <div className="flex items-start justify-between gap-4 flex-wrap relative">
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-lg bg-white text-black font-bold text-xl font-mono border-2 border-gray-300 shadow-md">
                {r.vehicleNumber}
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {veh.make && veh.make !== '\u25CF\u25CF\u25CF\u25CF\u25CF' ? veh.make+' '+(veh.model || '') : reg.registrationState || 'Vehicle'}
                </div>
                <div className="text-sm text-orange-300/70 mt-0.5">
                  {[veh.color, veh.fuelType, veh.bodyType, veh.manufacturingYear ? '~'+veh.manufacturingYear : null].filter(Boolean).join(' \u2022 ')}
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={'px-2 py-0.5 rounded-lg text-xs font-medium '+(r.dataQuality === 'live' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : r.dataQuality === 'partial' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30')}>
                    {r.dataQuality === 'live' ? '\u2713 Live API Data' : r.dataQuality === 'partial' ? '\u26A0 Partial Data (Scraped)' : '\u{1F9E0} Intelligence Estimate'}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    {reg.vehicleClass || 'Vehicle'}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-violet-500/20 text-violet-400 border border-violet-500/30">
                    {'\u{1F1EE}\u{1F1F3}'} {reg.registrationState || 'India'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Sources</div>
              <div className="text-3xl font-bold text-orange-400">{r.sourceCount || 0}</div>
              {r.queryTime && <div className="text-xs text-gray-500 mt-1">{r.queryTime}ms</div>}
            </div>
          </div>
        </div>

        {r.dataSources && r.dataSources.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {r.dataSources.map(function(s) { return <SourceBadge key={s} name={s} />; })}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Car} label="Make" value={veh.make || 'Unknown'} color="text-cyan-400" sub={veh.model || ''} />
          <StatCard icon={Settings} label="Engine" value={veh.engineCapacity || 'N/A'} color="text-amber-400" sub={veh.fuelType || ''} />
          <StatCard icon={Shield} label="Insurance" value={ins.status || 'Unknown'}
            color={ins.status === 'Active' ? 'text-emerald-400' : 'text-red-400'}
            sub={ins.company ? ins.company.substring(0, 20) : ''} />
          <StatCard icon={AlertTriangle} label="Risk" value={risk.level || 'Unknown'}
            color={risk.level === 'Low' ? 'text-emerald-400' : risk.level === 'Medium' ? 'text-amber-400' : 'text-red-400'}
            sub={'Score: '+(risk.score || 0)+'/100'} />
        </div>

        {risk.score !== undefined && <RiskGauge score={risk.score} level={risk.level} />}

        {risk.risks && risk.risks.length > 0 && (
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
            <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
              <AlertTriangle className="w-4 h-4" /> Risk Factors ({risk.risks.length})
            </div>
            {risk.risks.map(function(rf, i) { return (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className={'w-2 h-2 rounded-full flex-shrink-0 '+(rf.severity === 'critical' ? 'bg-red-500' : rf.severity === 'high' ? 'bg-orange-500' : rf.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500')} />
                <span className="text-gray-300">{rf.type}</span>
                <span className="text-gray-500 text-xs ml-auto">{rf.detail}</span>
              </div>
            ); })}
          </div>
        )}

        {/* Market Value Estimation */}
        {r.marketValue && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-500/20 space-y-3">
            <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
              <DollarSign className="w-4 h-4" /> Estimated Market Value
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center">
                <div className="text-xs text-gray-500">Ex-Showroom (MSRP)</div>
                <div className="text-sm font-bold text-white">{r.marketValue.msrp}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Current Est. Value</div>
                <div className="text-lg font-bold text-green-400">{r.marketValue.estimatedCurrent}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Depreciation</div>
                <div className="flex items-center justify-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-sm font-bold text-red-400">{r.marketValue.depreciationPercent}%</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Vehicle Age</div>
                <div className="text-sm font-bold text-amber-400">{r.marketValue.vehicleAge} yr{r.marketValue.vehicleAge !== 1 ? 's' : ''}</div>
              </div>
            </div>
            <div className="h-2 rounded-full bg-gray-700/50 overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-green-500 to-red-500"
                initial={{ width: 0 }} animate={{ width: r.marketValue.depreciationPercent+'%' }}
                transition={{ duration: 1, ease: 'easeOut' }} />
            </div>
            <div className="text-xs text-gray-500">{r.marketValue.note}</div>
          </div>
        )}

        <div className="p-4 rounded-xl bg-gray-800/30 border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-violet-300 text-sm font-medium mb-2">
            <Hash className="w-4 h-4" /> Registration Number Decode
          </div>
          {sd.stateCode && <InfoRow icon={MapPin} label="State Code" value={sd.stateCode.value+' \u2014 '+sd.stateCode.meaning} highlight />}
          {sd.districtCode && <InfoRow icon={MapPin} label="District / RTO" value={sd.districtCode.value+' \u2014 '+sd.districtCode.meaning} />}
          {sd.series && <InfoRow icon={Car} label="Series" value={sd.series.value+' \u2014 '+sd.series.meaning} />}
          {sd.number && <InfoRow icon={Hash} label="Serial Number" value={sd.number.value} mono />}
        </div>

        <div className="p-4 rounded-xl bg-gray-800/30 border border-white/5 space-y-2">
          <div className="text-sm font-mono text-orange-400 mb-2">REGISTRATION INFO</div>
          <InfoRow icon={Calendar} label="Registration Date" value={reg.registrationDate} />
          <InfoRow icon={Clock} label="Valid Until" value={reg.registrationValidity} />
          <InfoRow icon={MapPin} label="Authority" value={reg.registrationAuthority} />
          <InfoRow icon={Car} label="Category" value={reg.vehicleCategory} />
        </div>

        {r.investigationSteps && r.investigationSteps.length > 0 && (
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-3">
              <Crosshair className="w-4 h-4" /> Investigation Steps
            </div>
            <div className="space-y-2.5">
              {r.investigationSteps.map(function(step, i) { return (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="p-3 rounded-xl bg-slate-800/40 border border-white/5 hover:border-blue-500/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">{step.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{step.title}</div>
                      <div className="text-xs text-gray-400">{step.description}</div>
                      {step.url && (
                        <a href={step.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1.5 px-3 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 text-xs font-medium transition-colors">
                          <ExternalLink className="w-3 h-3" /> Open
                        </a>
                      )}
                    </div>
                    {step.priority && (
                      <span className={'px-1.5 py-0.5 rounded text-[10px] '+(step.priority === 'high' ? 'bg-red-500/20 text-red-300' : step.priority === 'medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-gray-500/20 text-gray-400')}>
                        {step.priority}
                      </span>
                    )}
                  </div>
                </motion.div>
              ); })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============= INDIAN VEHICLE TAB =============
  function renderIndianVehicle() {
    const veh = results.vehicle || {};
    return (
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gray-800/30 border border-white/5 space-y-2">
          <div className="text-sm font-mono text-orange-400 mb-2">VEHICLE SPECIFICATIONS</div>
          <InfoRow icon={Car} label="Make" value={veh.make} />
          <InfoRow icon={Car} label="Model" value={veh.model} />
          <InfoRow icon={Car} label="Variant" value={veh.variant} />
          <InfoRow icon={Car} label="Body Type" value={veh.bodyType} />
          <InfoRow icon={Eye} label="Color" value={veh.color} />
          <InfoRow icon={Settings} label="Fuel Type" value={veh.fuelType} />
          <InfoRow icon={Settings} label="Engine Capacity" value={veh.engineCapacity} />
          <InfoRow icon={Settings} label="Cylinders" value={veh.cylinderCount} />
          <InfoRow icon={Calendar} label="Manufacturing Year" value={veh.manufacturingYear} />
          <InfoRow icon={Settings} label="Emission Norms" value={veh.norms} />
          {veh.note && <p className="text-xs text-gray-500 italic mt-2">{veh.note}</p>}
        </div>
        <div className="p-4 rounded-xl bg-gray-800/30 border border-white/5 space-y-2">
          <div className="text-sm font-mono text-orange-400 mb-2">ENGINE & CHASSIS</div>
          <InfoRow icon={Hash} label="Engine Number" value={veh.engineNumber} mono copyable onCopy={copyValue} />
          <InfoRow icon={Hash} label="Chassis Number" value={veh.chassisNumber} mono copyable onCopy={copyValue} />
          <InfoRow icon={User} label="Seating Capacity" value={veh.seatingCapacity} />
          <InfoRow icon={User} label="Standing Capacity" value={veh.standingCapacity} />
          <InfoRow icon={Truck} label="Unladen Weight" value={veh.unladenWeight} />
          <InfoRow icon={Truck} label="Gross Weight" value={veh.grossWeight} />
          <InfoRow icon={Car} label="Wheelbase" value={veh.wheelbase} />
          <InfoRow icon={Calendar} label="Vehicle Age" value={veh.vehicleAge} />
        </div>
      </div>
    );
  }

  // ============= INDIAN OWNER TAB =============
  function renderIndianOwner() {
    const own = results.owner || {};
    const ins = results.insurance || {};
    return (
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gray-800/30 border border-white/5 space-y-2">
          <div className="text-sm font-mono text-orange-400 mb-2">OWNER DETAILS</div>
          <InfoRow icon={User} label="Owner Name" value={own.ownerName} highlight />
          <InfoRow icon={User} label="Father's Name" value={own.fatherName} />
          <InfoRow icon={FileText} label="Ownership Type" value={own.ownershipType} />
          <InfoRow icon={Hash} label="Owner Serial" value={own.ownerSerialNumber} />
          <InfoRow icon={Hash} label="Ownership Count" value={own.ownerCount} />
          {own.mobileNumber && <InfoRow icon={User} label="Mobile" value={own.mobileNumber} />}
          {own.permanentAddress && <InfoRow icon={MapPin} label="Permanent Address" value={own.permanentAddress} />}
          {own.presentAddress && <InfoRow icon={MapPin} label="Present Address" value={own.presentAddress} />}
          {own.note && <p className="text-xs text-gray-500 italic mt-2">{own.note}</p>}
        </div>
        <div className="p-4 rounded-xl bg-gray-800/30 border border-white/5 space-y-2">
          <div className="text-sm font-mono text-orange-400 mb-2">INSURANCE</div>
          <InfoRow icon={Shield} label="Status" value={ins.status}
            highlight={ins.status === 'Active' || ins.status === 'Expired'} />
          <InfoRow icon={Shield} label="Company" value={ins.company} />
          <InfoRow icon={Hash} label="Policy Number" value={ins.policyNumber} mono copyable onCopy={copyValue} />
          <InfoRow icon={FileText} label="Type" value={ins.type} />
          <InfoRow icon={Calendar} label="Valid From" value={ins.validFrom} />
          <InfoRow icon={Calendar} label="Valid Until" value={ins.validUpto} highlight />
          {ins.note && <p className="text-xs text-gray-500 italic mt-2">{ins.note}</p>}
          <div className="mt-3">
            <a href="https://iib.gov.in/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 text-xs font-medium transition-colors">
              <ExternalLink className="w-3 h-3" /> Verify on IIB Portal
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ============= COMPLIANCE TAB =============
  function renderCompliance() {
    const fit = results.fitness || {};
    const tax = results.tax || {};
    const st = results.status || {};
    return (
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gray-800/30 border border-white/5 space-y-2">
          <div className="text-sm font-mono text-orange-400 mb-2">FITNESS & PUC</div>
          {fit.fitnessValid !== null && <InfoRow icon={Shield} label="Fitness Valid" value={fit.fitnessValid ? '\u2713 Yes' : '\u2717 Expired'} highlight />}
          <InfoRow icon={Calendar} label="Fitness Valid Upto" value={fit.fitnessValidUpto} />
          {fit.pucValid !== null && <InfoRow icon={Shield} label="PUC Valid" value={fit.pucValid ? '\u2713 Yes' : '\u2717 Expired'} highlight />}
          <InfoRow icon={Calendar} label="PUC Valid Upto" value={fit.pucValidUpto} />
          <InfoRow icon={Hash} label="PUC Number" value={fit.pucNumber} mono />
          <InfoRow icon={Calendar} label="Last Inspection" value={fit.lastInspectionDate} />
          {fit.note && <p className="text-xs text-gray-500 italic mt-2">{fit.note}</p>}
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gray-800/30 border border-white/5 space-y-2">
            <div className="text-sm font-mono text-orange-400 mb-2">TAX DETAILS</div>
            {tax.taxPaid && <InfoRow icon={FileText} label="Tax Paid" value={'\u2713 Yes'} highlight />}
            <InfoRow icon={FileText} label="Tax Type" value={tax.taxType} />
            <InfoRow icon={Calendar} label="Valid Upto" value={tax.taxValidUpto} />
            <InfoRow icon={FileText} label="Amount" value={tax.roadTaxAmount} />
            <InfoRow icon={Calendar} label="Last Paid" value={tax.lastTaxPaidDate} />
            {tax.note && <p className="text-xs text-gray-500 italic mt-2">{tax.note}</p>}
          </div>
          <div className="p-4 rounded-xl bg-gray-800/30 border border-white/5 space-y-2">
            <div className="text-sm font-mono text-orange-400 mb-2">STATUS FLAGS</div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-400">Vehicle Status</span>
              <span className={'text-sm '+(st.vehicleStatus === 'Active' ? 'text-emerald-400' : 'text-amber-400')}>{typeof st.vehicleStatus === 'string' ? st.vehicleStatus : 'Check Portal'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-400">Blacklisted</span>
              <span className={'text-sm '+(st.blacklisted === true ? 'text-red-400 font-bold' : st.blacklisted === false ? 'text-emerald-400' : 'text-gray-400')}>
                {st.blacklisted === true ? '\u26A0\uFE0F Yes' : st.blacklisted === false ? '\u2713 No' : 'Check Portal'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-400">Hypothecated</span>
              <span className={'text-sm '+(st.hypothecated ? 'text-amber-400' : 'text-emerald-400')}>
                {st.hypothecated ? 'Yes \u2014 '+(st.financier || 'Unknown') : '\u2713 No'}
              </span>
            </div>
            {st.nocIssued && <InfoRow icon={FileText} label="NOC Issued" value={st.nocIssued} />}
          </div>
        </div>
      </div>
    );
  }

  // ============= CHALLAN TAB =============
  function renderChallan() {
    const ch = results.challan || {};
    const stateCode = results.registration && results.registration.stateCode;
    const hasData = ch.dataAvailable && (ch.challans?.length > 0 || ch.pendingCount);
    return (
      <div className="space-y-4">
        {/* Challan Summary Banner */}
        <div className={'p-5 rounded-2xl border ' + (hasData ? 'bg-gradient-to-r from-red-500/15 via-red-500/5 to-transparent border-red-500/30' : 'bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-transparent border-green-500/20')}>
          <div className="flex items-center justify-between mb-2">
            <div className={'flex items-center gap-2 text-sm font-bold ' + (hasData ? 'text-red-400' : 'text-green-400')}>
              {hasData ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              {hasData ? `${ch.pendingCount || ch.challans?.length || 0} Challan(s) Found` : 'No Challans Detected'}
            </div>
            {hasData && ch.totalAmount && (
              <span className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 text-sm font-bold border border-red-500/30">
                Total: {ch.totalAmount}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400">
            {hasData
              ? `Source: ${ch.source || 'eChallan Portal'}. ${ch.note || ''}`
              : 'No pending challans found from available data sources. Government portals may have additional data behind captcha.'}
          </p>
        </div>

        {/* Inline Challan Details Table */}
        {hasData && ch.challans && ch.challans.length > 0 && (
          <div className="rounded-xl overflow-hidden border border-red-500/20">
            <div className="bg-red-500/10 px-4 py-2.5 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-red-300">Challan Records</span>
              <span className="ml-auto text-xs text-gray-500">{ch.challans.length} record(s)</span>
            </div>
            <div className="divide-y divide-white/5">
              {ch.challans.map(function(c2, i) { return (
                <div key={i} className="px-4 py-3 bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-red-400 font-mono text-xs font-bold bg-red-500/10 px-2 py-0.5 rounded">{c2.challanNo || `#${i + 1}`}</span>
                      {c2.date && <span className="text-gray-400 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" />{c2.date}</span>}
                    </div>
                    <span className="text-amber-300 text-sm font-bold">{c2.amount || 'N/A'}</span>
                  </div>
                  {(c2.violation || c2.status || c2.location) && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {c2.violation && <span className="text-xs text-gray-300 bg-gray-700/50 px-2 py-0.5 rounded">{c2.violation}</span>}
                      {c2.status && <span className={'text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ' + (c2.status === 'Paid' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400')}>{c2.status}</span>}
                      {c2.location && <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{c2.location}</span>}
                    </div>
                  )}
                </div>
              ); })}
            </div>
          </div>
        )}

        {/* Violations Summary */}
        {ch.violations && ch.violations.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Violation Types
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ch.violations.map(function(v, i) { return (
                <span key={i} className="text-xs px-2 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">{v}</span>
              ); })}
            </div>
          </div>
        )}

        {/* Vehicle History Timeline */}
        {results.history && results.history.length > 0 && (
          <div className="p-4 rounded-xl bg-gray-800/30 border border-white/5">
            <div className="text-sm font-semibold text-orange-400 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Vehicle History Timeline
            </div>
            <div className="space-y-2">
              {results.history.map(function(item, i) { return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/40 border border-white/5">
                  <Calendar className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm text-white">{item.event}</div>
                    <div className="text-xs text-gray-500">{item.details}</div>
                  </div>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
              ); })}
            </div>
          </div>
        )}

        {/* Fallback portal link - only if no data */}
        {!hasData && (
          <div className="p-3 rounded-xl bg-gray-800/20 border border-white/5">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Info className="w-3.5 h-3.5 flex-shrink-0" />
              <span>For captcha-protected eChallan data, check <a href={ch.lookupUrl || 'https://echallan.parivahan.gov.in/publicview/'} target="_blank" rel="noopener noreferrer" className="text-orange-400 underline hover:text-orange-300">echallan.parivahan.gov.in</a></span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============= GOOGLE DORKS TAB =============
  function renderGoogleDorks() {
    const dorks = results.googleDorks || [];
    const categories = [...new Set(dorks.map(function(d) { return d.category; }))];

    const filtered = dorkFilter === 'all' ? dorks : dorks.filter(function(d) { return d.category === dorkFilter; });

    return (
      <div className="space-y-4">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent border border-cyan-500/20">
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold mb-2">
            <Scroll className="w-4 h-4" /> Google Dork Queries ({dorks.length})
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Pre-built investigation search queries. Click any query to open in Google. These help discover mentions of this vehicle across the internet.
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            <button onClick={function() { setDorkFilter('all'); }}
              className={'px-2.5 py-1 rounded-lg text-xs font-medium transition-all '+(dorkFilter === 'all' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/40' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white')}>
              All ({dorks.length})
            </button>
            {categories.map(function(cat) { return (
              <button key={cat} onClick={function() { setDorkFilter(cat); }}
                className={'px-2.5 py-1 rounded-lg text-xs font-medium transition-all '+(dorkFilter === cat ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/40' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white')}>
                {cat} ({dorks.filter(function(d) { return d.category === cat; }).length})
              </button>
            ); })}
          </div>
        </div>
        <div className="space-y-2">
          {filtered.map(function(dork, i) {
            var searchUrl = 'https://www.google.com/search?q='+encodeURIComponent(dork.query);
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.6) }}
                className="p-3 rounded-xl bg-gray-800/40 border border-white/5 hover:border-cyan-500/20 transition-colors group">
                <div className="flex items-start gap-3">
                  <span className={'w-2 h-2 rounded-full mt-1.5 flex-shrink-0 '+(dork.priority === 'high' ? 'bg-red-500' : dork.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500')} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase font-bold">{dork.category}</span>
                      <span className={'text-[10px] px-1.5 py-0.5 rounded uppercase font-bold '+(dork.priority === 'high' ? 'bg-red-500/10 text-red-400' : dork.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400')}>{dork.priority}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-1.5">{dork.description}</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-cyan-300 font-mono bg-cyan-500/5 px-2 py-1 rounded flex-1 truncate">{dork.query}</code>
                      <a href={searchUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 text-xs font-medium transition-colors flex-shrink-0">
                        <Search className="w-3 h-3" /> Search
                      </a>
                      <button onClick={function() { copyValue(dork.query); }}
                        className="p-1 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all">
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        {dorks.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No Google dork queries available for this lookup type.
          </div>
        )}
      </div>
    );
  }

  // ============= OSINT LINKS TAB =============
  function renderOsintLinks() {
    const links = results.osintLinks || [];
    const statePortals = results.stateSpecificPortals || [];
    const categoryMap = {};
    links.forEach(function(link) {
      var cat = link.category || 'General';
      if (!categoryMap[cat]) categoryMap[cat] = [];
      categoryMap[cat].push(link);
    });
    var categoryOrder = ['Government', 'Insurance', 'Legal', 'Marketplace', 'General'];
    var sortedCats = Object.keys(categoryMap).sort(function(a, b) {
      var ia = categoryOrder.indexOf(a); var ib = categoryOrder.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
    var catColors = { Government: 'blue', Insurance: 'green', Legal: 'red', Marketplace: 'amber', General: 'purple' };

    return (
      <div className="space-y-4">
        {/* Grouped OSINT Links */}
        {sortedCats.map(function(cat) {
          var col = catColors[cat] || 'purple';
          return (
            <div key={cat} className={'p-4 rounded-xl bg-'+col+'-500/5 border border-'+col+'-500/20'}>
              <div className={'flex items-center gap-2 text-'+col+'-400 text-sm font-semibold mb-3'}>
                <Crosshair className="w-4 h-4" /> {cat} ({categoryMap[cat].length})
              </div>
              <div className="space-y-2">
                {categoryMap[cat].map(function(link, i) { return (
                  <motion.a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    className={'flex items-center gap-3 p-3 rounded-xl bg-gray-800/40 border border-white/5 hover:border-'+col+'-500/20 transition-colors group'}>
                    <span className="text-xl flex-shrink-0">{link.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className={'text-sm font-medium text-white group-hover:text-'+col+'-300 transition-colors'}>{link.title}</div>
                      <div className="text-xs text-gray-500 truncate">{link.description}</div>
                    </div>
                    <ExternalLink className={'w-4 h-4 text-gray-500 group-hover:text-'+col+'-400 flex-shrink-0'} />
                  </motion.a>
                ); })}
              </div>
            </div>
          );
        })}

        {/* State-Specific Portals */}
        {statePortals.length > 0 && (
          <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-3">
              <MapPin className="w-4 h-4" /> State-Specific Portals ({statePortals.length})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {statePortals.map(function(sp, i) { return (
                <a key={i} href={sp.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/40 border border-white/5 hover:border-indigo-500/20 transition-colors group">
                  <span className="text-lg">{sp.icon || '\u{1F3DB}\uFE0F'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">{sp.title}</div>
                    <div className="text-xs text-gray-500 truncate">{sp.description}</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-indigo-400 flex-shrink-0" />
                </a>
              ); })}
            </div>
          </div>
        )}

        {/* Data quality footer */}
        <div className="p-3 rounded-xl bg-gray-800/20 border border-white/5">
          <p className="text-xs text-gray-500">{results.disclaimer || results.dataSourceNote || results.dataSource || ''}</p>
        </div>
        {(results.dataQuality === 'intelligence' || results.dataQuality === 'partial') && (
          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-300/80">
                <span className="font-medium">{results.dataQuality === 'partial' ? 'Partial data retrieved.' : 'Want verified data?'}</span>{' '}
                {results.dataQuality === 'partial'
                  ? 'VAHAN scraped data may be incomplete. For full RC details, visit the VAHAN portal or subscribe to a Vehicle API.'
                  : (<>Subscribe to a Vehicle Information API on{' '}
                    <a href="https://rapidapi.com/search/indian%20vehicle%20rc" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline hover:text-amber-300">RapidAPI</a>
                    {' '}(free tier available). The system will automatically use live data when an API is subscribed.</>)
                }
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -- Tab renderer map --
  const tabRenderers = results && results.lookupType === 'vin'
    ? { overview: renderVinOverview, engine: renderVinEngine, safety: renderVinSafety, recalls: renderRecalls, osint: renderOsintLinks }
    : { overview: renderIndianOverview, vehicle: renderIndianVehicle, owner: renderIndianOwner, compliance: renderCompliance, challan: renderChallan, dorks: renderGoogleDorks, osint: renderOsintLinks };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-5xl max-h-[90vh] bg-gradient-to-br from-gray-900 via-orange-950/30 to-gray-900 rounded-2xl border border-orange-500/30 overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-3 sm:p-4 border-b border-orange-500/30 bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Car className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Vehicle Intelligence</h2>
              <p className="text-xs sm:text-sm text-orange-400/80 hidden sm:block">NHTSA + Indian RTO + Recalls + Challans + Safety Ratings</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRefresh}
              className="px-2 sm:px-3 py-2 rounded-xl bg-white/5 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/30 transition-all flex items-center gap-1 sm:gap-2">
              <RefreshCw className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-orange-200 hidden sm:inline">New</span>
            </motion.button>
            {results && (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleExportJSON}
                className="px-2 sm:px-3 py-2 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/30 transition-all flex items-center gap-1 sm:gap-2">
                <Download className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-amber-200 hidden sm:inline">Export</span>
              </motion.button>
            )}
            <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 transition-all">
              <X className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-70px)] sm:max-h-[calc(90vh-80px)]">
          {!results ? (
            <div className="max-w-xl mx-auto space-y-4 sm:space-y-6">
              {/* Lookup Type Toggle */}
              <div className="flex bg-gray-800/50 rounded-xl p-1 border border-orange-500/20">
                <button onClick={function() { setLookupType('indian'); setVehicleNumber(''); }}
                  className={'flex-1 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 '+(
                    lookupType === 'indian' ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                  )}>
                  <span className="text-lg">{'\u{1F1EE}\u{1F1F3}'}</span> Indian Reg. No.
                </button>
                <button onClick={function() { setLookupType('vin'); setVehicleNumber(''); }}
                  className={'flex-1 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 '+(
                    lookupType === 'vin' ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                  )}>
                  <span className="text-lg">{'\u{1F30D}'}</span> VIN Decode (Global)
                </button>
              </div>

              {/* Input */}
              <div className="p-4 sm:p-6 rounded-xl bg-gray-800/50 border border-orange-500/20">
                <label className="block text-xs sm:text-sm text-orange-400 mb-2 font-mono">
                  {lookupType === 'vin' ? 'VEHICLE IDENTIFICATION NUMBER (VIN)' : 'VEHICLE REGISTRATION NUMBER'}
                </label>
                <div className="relative">
                  <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                  <input type="text" value={vehicleNumber} onChange={function(e) { setVehicleNumber(e.target.value.toUpperCase()); }}
                    placeholder={lookupType === 'vin' ? '1HGCM82633A123456' : 'MH 01 AB 1234'}
                    maxLength={lookupType === 'vin' ? 17 : 15}
                    className="w-full pl-12 pr-4 py-4 rounded-lg bg-gray-900 border border-orange-500/30 focus:border-orange-500 outline-none text-white text-lg font-mono placeholder-gray-600 uppercase"
                    onKeyDown={function(e) { if (e.key === 'Enter') handleSearch(); }} />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {lookupType === 'vin'
                    ? '17-character VIN \u2014 decodes via NHTSA + Recalls + Safety Ratings + Complaints'
                    : 'Indian format: XX 00 XX 0000 \u2014 Decodes state, RTO, vehicle class'}
                </p>
                {lookupType === 'vin' && (
                  <div className="mt-3 p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                    <p className="text-xs text-green-400 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      NHTSA vPIC + Recalls + Complaints + Safety Ratings \u2014 All FREE, no API key needed
                    </p>
                  </div>
                )}
              </div>

              {/* Feature cards */}
              <div className="grid grid-cols-2 gap-3">
                {lookupType === 'vin' ? (
                  <>
                    <div className="p-3 rounded-xl bg-gray-800/30 border border-gray-700 flex items-center gap-3">
                      <Car className="w-5 h-5 text-orange-400" /><span className="text-sm text-gray-300">Make/Model/Year</span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-800/30 border border-gray-700 flex items-center gap-3">
                      <Settings className="w-5 h-5 text-orange-400" /><span className="text-sm text-gray-300">Engine & Specs</span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-800/30 border border-gray-700 flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400" /><span className="text-sm text-gray-300">Recall Alerts</span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-800/30 border border-gray-700 flex items-center gap-3">
                      <Star className="w-5 h-5 text-amber-400" /><span className="text-sm text-gray-300">Safety Ratings</span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-800/30 border border-gray-700 flex items-center gap-3">
                      <Shield className="w-5 h-5 text-orange-400" /><span className="text-sm text-gray-300">30+ Safety Features</span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-800/30 border border-gray-700 flex items-center gap-3">
                      <Crosshair className="w-5 h-5 text-purple-400" /><span className="text-sm text-gray-300">OSINT Links</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 rounded-xl bg-gray-800/30 border border-gray-700 flex items-center gap-3">
                      <FileText className="w-5 h-5 text-orange-400" /><span className="text-sm text-gray-300">RTO Decode</span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-800/30 border border-gray-700 flex items-center gap-3">
                      <User className="w-5 h-5 text-orange-400" /><span className="text-sm text-gray-300">Owner Info</span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-800/30 border border-gray-700 flex items-center gap-3">
                      <Shield className="w-5 h-5 text-orange-400" /><span className="text-sm text-gray-300">Insurance/Fitness</span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-800/30 border border-gray-700 flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400" /><span className="text-sm text-gray-300">eChallan Status</span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-800/30 border border-gray-700 flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-orange-400" /><span className="text-sm text-gray-300">50+ RTO Districts</span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-800/30 border border-gray-700 flex items-center gap-3">
                      <Crosshair className="w-5 h-5 text-purple-400" /><span className="text-sm text-gray-300">OSINT Links</span>
                    </div>
                  </>
                )}
              </div>

              {/* Search Button */}
              <button onClick={handleSearch} disabled={isSearching}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-lg flex items-center justify-center gap-3 hover:from-orange-400 hover:to-amber-500 transition-all disabled:opacity-50 shadow-lg shadow-orange-500/30">
                {isSearching ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Search className="w-6 h-6" />
                    </motion.div>
                    {lookupType === 'vin' ? 'Querying NHTSA + Recalls...' : 'Searching RTO Database...'} {searchProgress}%
                  </>
                ) : (
                  <><Search className="w-6 h-6" />{lookupType === 'vin' ? 'Decode VIN' : 'Search Vehicle'}</>
                )}
              </button>

              {isSearching && (
                <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                    initial={{ width: 0 }} animate={{ width: searchProgress+'%' }} />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map(function(tab) { return (
                  <button key={tab.id} onClick={function() { setActiveTab(tab.id); }}
                    className={'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap '+(
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg'
                        : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
                    )}>
                    <tab.icon className="w-4 h-4" />{tab.label}
                  </button>
                ); })}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  {(tabRenderers[activeTab] || (results && results.lookupType === 'vin' ? renderVinOverview : renderIndianOverview))()}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VehicleInfoTool;
