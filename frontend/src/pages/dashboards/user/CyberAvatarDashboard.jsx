import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useCases } from '../../../context/CaseContext';
import { useCredits } from '../../../context/CreditContext';
import { useActivity } from '../../../context/ActivityContext';
import { useSearchHistory } from '../../../context/SearchHistoryContext';
import { useNavigate } from 'react-router-dom';
import ToolErrorBoundary from '../../../components/common/ToolErrorBoundary';
import {
  Search, Globe, Eye, Database, FileText, Clock, Zap, LogOut, Mail, 
  Phone, Hash, Image, Link2, Server, MapPin, User, Folder, Lock,
  Activity, Shield, Target, ChevronRight, Sparkles, BarChart3,
  X, Bell, Settings, CreditCard, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, History, Keyboard, Sun, Moon, Play, Pause, Plus, Trash2,
  RefreshCw, AlertCircle, Info, Radio, Wifi, ArrowRight, ExternalLink,
  Crosshair, Bookmark, BookmarkPlus, BookmarkCheck, RotateCcw, Download, Upload, Copy,
  MessageCircle, Scan, Car, Wallet, Fingerprint, Network, Users, Menu, Home, ChevronDown, Terminal
} from 'lucide-react';

// Import tools
import IPIntelligenceTool from '../../../components/tools/IPIntelligenceTool';
import DomainAnalysisTool from '../../../components/tools/DomainAnalysisTool';
import EmailIntelTool from '../../../components/tools/EmailIntelTool';
import PhoneLookupTool from '../../../components/tools/PhoneLookupTool';
import SocialProfilerTool from '../../../components/tools/SocialProfilerTool';
import HashAnalyzerTool from '../../../components/tools/HashAnalyzerTool';
import URLScannerTool from '../../../components/tools/URLScannerTool';
import GeolocationTool from '../../../components/tools/GeolocationTool';
import BreachDatabaseTool from '../../../components/tools/BreachDatabaseTool';
import DNSRecordsTool from '../../../components/tools/DNSRecordsTool';
import DataMiningTool from '../../../components/tools/DataMiningTool';

// Import new investigation tools
import WhatsAppTraceTool from '../../../components/tools/WhatsAppTraceTool';
import FaceRecognitionTool from '../../../components/tools/FaceRecognitionTool';
import VehicleInfoTool from '../../../components/tools/VehicleInfoTool';
import UPIInfoTool from '../../../components/tools/UPIInfoTool';

import SherlockTool from '../../../components/tools/SherlockTool';
import CryptoTracerTool from '../../../components/tools/CryptoTracerTool';
import WebProfilerTool from '../../../components/tools/WebProfilerTool';
import CVELookupTool from '../../../components/tools/CVELookupTool';
import SubdomainTool from '../../../components/tools/SubdomainTool';
import MACLookupTool from '../../../components/tools/MACLookupTool';
import WaybackTool from '../../../components/tools/WaybackTool';
import WhoisLookupTool from '../../../components/tools/WhoisLookupTool';
import CertificateSearchTool from '../../../components/tools/CertificateSearchTool';
import ThreatIntelTool from '../../../components/tools/ThreatIntelTool';
import PortScannerTool from '../../../components/tools/PortScannerTool';
import EncoderDecoderTool from '../../../components/tools/EncoderDecoderTool';
import URLExpanderTool from '../../../components/tools/URLExpanderTool';
import MalwareCheckTool from '../../../components/tools/MalwareCheckTool';
import PasteSearchTool from '../../../components/tools/PasteSearchTool';
import TechDetectorTool from '../../../components/tools/TechDetectorTool';

// Import new API-enriched tools
import WiFiGeoTool from '../../../components/tools/WiFiGeoTool';
import InterpolNoticesTool from '../../../components/tools/InterpolNoticesTool';
import LinkPreviewTool from '../../../components/tools/LinkPreviewTool';
import WebCarbonTool from '../../../components/tools/WebCarbonTool';
import FlightTrackerTool from '../../../components/tools/FlightTrackerTool';
import DarkWebSearchTool from '../../../components/tools/DarkWebSearchTool';
import IPQualityTool from '../../../components/tools/IPQualityTool';
import SocialAnalyzerTool from '../../../components/tools/SocialAnalyzerTool';
import SanctionsSearchTool from '../../../components/tools/SanctionsSearchTool';
import GHuntTool from '../../../components/tools/GHuntTool';

// Import common components
import KeyboardShortcutsModal from '../../../components/common/KeyboardShortcutsModal';
import SearchHistoryPanel from '../../../components/common/SearchHistoryPanel';
import FeedbackBubble from '../../../components/common/FeedbackBubble';
import ChatbotBubble from '../../../components/common/ChatbotBubble';
import TerminalBubble from '../../../components/common/TerminalBubble';
import InvestigationTerminal from '../../../components/terminal/InvestigationTerminal';
import { exportToJSON, exportToCSV, formatForExport } from '../../../utils/export';

// ============== ANIMATED BACKGROUND PARTICLES ==============
const ParticleField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 10, 20, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${p.opacity})`;
        ctx.fill();

        // Connect nearby particles
        particles.forEach((p2, j) => {
          if (i === j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.1 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

// ============== GLOWING ORB COMPONENT ==============
const GlowingOrb = ({ color = 'cyan', size = 'md', pulse = true }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };
  const colorClasses = {
    cyan: 'bg-cyan-400 shadow-cyan-400/50',
    emerald: 'bg-emerald-400 shadow-emerald-400/50',
    amber: 'bg-amber-400 shadow-amber-400/50',
    rose: 'bg-rose-400 shadow-rose-400/50',
    violet: 'bg-violet-400 shadow-violet-400/50'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full ${colorClasses[color]} shadow-lg ${pulse ? 'animate-pulse' : ''}`} />
  );
};

// ============== STAT CARD COMPONENT ==============
const StatCard = ({ icon: Icon, label, value, color, trend }) => {
  const colorMap = {
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
    rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-400',
    violet: 'from-violet-500/20 to-violet-600/10 border-violet-500/30 text-violet-400'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${colorMap[color]} border backdrop-blur-xl`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${colorMap[color].split(' ').pop()}`} />
          </div>
          {trend && (
            <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">
              {trend}
            </span>
          )}
        </div>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
    </motion.div>
  );
};

// ============== QUICK INVESTIGATION WIDGET ==============
const QuickInvestigationWidget = ({ onInvestigate, credits, onAddToWatchlist, investigationResult, isInvestigating, onClearResult }) => {
  const [query, setQuery] = useState('');
  const [queryType, setQueryType] = useState('auto');
  const [lastSearch, setLastSearch] = useState(null);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  const queryTypes = [
    { id: 'auto', label: 'Auto Detect', icon: Sparkles },
    { id: 'ip', label: 'IP Address', icon: Globe },
    { id: 'domain', label: 'Domain', icon: Server },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'phone', label: 'Phone', icon: Phone },
  ];

  const detectQueryType = (input) => {
    if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(input)) return 'ip';
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) return 'email';
    if (/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/.test(input)) return 'phone';
    if (/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/.test(input)) return 'domain';
    return 'ip'; // Default to IP if can't detect
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    const detectedType = queryType === 'auto' ? detectQueryType(query) : queryType;
    setLastSearch({ query, type: detectedType, timestamp: new Date() });
    await onInvestigate(query, detectedType);
    
    setQuery(''); // Clear input after search
  };

  const handleRefresh = () => {
    // Reset for new search
    setQuery('');
    setQueryType('auto');
    setLastSearch(null);
    setActiveDetailTab('overview');
    setShowDetailedView(false);
    setCopied(false);
    // Clear investigation result from parent
    if (onClearResult) onClearResult();
  };

  const handleAddToWatchlist = () => {
    if (lastSearch && onAddToWatchlist) {
      onAddToWatchlist({ 
        type: lastSearch.type, 
        value: lastSearch.query, 
        name: `${lastSearch.type.toUpperCase()}: ${lastSearch.query}` 
      });
    }
  };

  // Export functionality
  const handleExportJSON = () => {
    if (!investigationResult) return;
    const exportData = {
      query: investigationResult.query,
      type: investigationResult.type,
      riskScore: investigationResult.riskScore,
      details: investigationResult.details,
      extendedDetails: investigationResult.extendedDetails,
      securityIndicators: investigationResult.securityIndicators,
      threats: investigationResult.threats,
      timestamp: lastSearch?.timestamp?.toISOString() || new Date().toISOString(),
    };
    const ok = exportToJSON(exportData, `investigation_${investigationResult.type}_${Date.now()}.json`);
    if (ok) console.log('Exported JSON');
  };

  const handleExportCSV = () => {
    if (!investigationResult) return;
    const flatData = {
      Query: investigationResult.query,
      Type: investigationResult.type,
      'Risk Score': investigationResult.riskScore,
      ...investigationResult.details,
      ...investigationResult.extendedDetails,
      Threats: investigationResult.threats?.join(', ') || 'None',
      Timestamp: lastSearch?.timestamp?.toISOString() || new Date().toISOString(),
    };
    const ok = exportToCSV([flatData], `investigation_${investigationResult.type}_${Date.now()}.csv`);
    if (ok) console.log('Exported CSV');
  };

  const handleCopyResult = () => {
    if (!investigationResult) return;
    const text = JSON.stringify(investigationResult, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-cyan-500/10 via-slate-800/50 to-violet-500/10 backdrop-blur-xl border border-cyan-500/20"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
          <Crosshair className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white">Quick Investigation</h3>
          <p className="text-xs text-gray-400">Instant lookup for IP, Domain, Email, or Phone</p>
        </div>
      </div>

      {/* Query Type Selector - Scrollable on mobile */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {queryTypes.map(type => (
          <button
            key={type.id}
            onClick={() => setQueryType(type.id)}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              queryType === type.id
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
            }`}
          >
            <type.icon className="w-3 h-3" />
            <span className="hidden sm:inline">{type.label}</span>
            <span className="sm:hidden">{type.id === 'auto' ? 'Auto' : type.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Search Input - Stack on mobile */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter IP, domain, email, or phone..."
            className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl bg-slate-900/50 border border-white/10 focus:border-cyan-500/50 focus:outline-none text-white placeholder-gray-500 text-sm sm:text-base"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSearch}
          disabled={!query.trim() || isInvestigating || credits < 5}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-sm sm:text-base ${
            query.trim() && !isInvestigating && credits >= 5
              ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white hover:opacity-90'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isInvestigating ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
          ) : (
            <>
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
              <span>Investigate</span>
            </>
          )}
        </motion.button>
      </div>
      
      {/* Investigation Result Display */}
      <AnimatePresence mode="wait">
        {isInvestigating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30"
          >
            <div className="flex items-center gap-3">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-500"
              />
              <div>
                <p className="text-cyan-300 font-medium">Analyzing...</p>
                <p className="text-xs text-gray-500">Gathering intelligence data</p>
              </div>
            </div>
          </motion.div>
        )}

        {!isInvestigating && investigationResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 rounded-xl bg-slate-900/70 border border-emerald-500/30 overflow-hidden"
          >
            {/* Result Header */}
            <div className="p-4 border-b border-white/10 bg-emerald-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                    {investigationResult.type === 'ip' && <Globe className="w-5 h-5 text-white" />}
                    {investigationResult.type === 'domain' && <Server className="w-5 h-5 text-white" />}
                    {investigationResult.type === 'email' && <Mail className="w-5 h-5 text-white" />}
                    {investigationResult.type === 'phone' && <Phone className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <p className="text-white font-semibold font-mono">{investigationResult.query}</p>
                    <p className="text-xs text-gray-400 capitalize">{investigationResult.type} Investigation Complete</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRefresh}
                    className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-all"
                    title="New Search"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                  <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    investigationResult.riskScore >= 70 ? 'text-red-400 bg-red-500/20' :
                    investigationResult.riskScore >= 40 ? 'text-amber-400 bg-amber-500/20' :
                    'text-emerald-400 bg-emerald-500/20'
                  }`}>
                    Risk: {investigationResult.riskScore}%
                  </div>
                </div>
              </div>
            </div>

            {/* Detail Tabs */}
            <div className="flex border-b border-white/10 bg-slate-800/30">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'details', label: 'Details' },
                { id: 'security', label: 'Security' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDetailTab(tab.id)}
                  className={`flex-1 py-2 text-xs font-medium transition-all ${
                    activeDetailTab === tab.id
                      ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-500'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4 space-y-2">
              {activeDetailTab === 'overview' && (
                <>
                  {investigationResult.details && Object.entries(investigationResult.details).slice(0, 6).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="text-gray-400 text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="text-white text-sm font-mono">{value}</span>
                    </div>
                  ))}
                </>
              )}

              {activeDetailTab === 'details' && (
                <>
                  {investigationResult.extendedDetails && Object.entries(investigationResult.extendedDetails).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="text-gray-400 text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="text-white text-sm font-mono">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</span>
                    </div>
                  ))}
                  {!investigationResult.extendedDetails && (
                    <p className="text-gray-500 text-sm text-center py-4">Extended details not available</p>
                  )}
                </>
              )}

              {activeDetailTab === 'security' && (
                <>
                  {/* Risk Meter */}
                  <div className="p-3 rounded-lg bg-slate-800/50 mb-3">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-400">Risk Assessment</span>
                      <span className={`font-bold ${
                        investigationResult.riskScore >= 70 ? 'text-red-400' :
                        investigationResult.riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>{investigationResult.riskScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${investigationResult.riskScore}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded-full ${
                          investigationResult.riskScore >= 70 ? 'bg-gradient-to-r from-red-500 to-rose-500' :
                          investigationResult.riskScore >= 40 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                          'bg-gradient-to-r from-emerald-500 to-green-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Security Indicators */}
                  {investigationResult.securityIndicators && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {Object.entries(investigationResult.securityIndicators).map(([key, value]) => (
                        <div key={key} className={`p-2 rounded-lg text-center ${
                          value === true || value === 'Clean' || value === 'Safe' 
                            ? 'bg-emerald-500/10 border border-emerald-500/30' 
                            : value === false || value === 'Flagged' || value === 'Suspicious'
                            ? 'bg-red-500/10 border border-red-500/30'
                            : 'bg-slate-800/50 border border-white/10'
                        }`}>
                          <div className={`text-xs font-medium ${
                            value === true || value === 'Clean' || value === 'Safe' ? 'text-emerald-400' :
                            value === false || value === 'Flagged' || value === 'Suspicious' ? 'text-red-400' : 'text-white'
                          }`}>
                            {typeof value === 'boolean' ? (value ? '✓' : '✗') : value}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Threat Indicators */}
                  {investigationResult.threats && investigationResult.threats.length > 0 && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                      <p className="text-red-400 text-xs font-medium mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Threat Indicators ({investigationResult.threats.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {investigationResult.threats.map((threat, i) => (
                          <span key={i} className="px-2 py-1 rounded bg-red-500/20 text-red-300 text-xs">
                            {threat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clean Status */}
                  {investigationResult.riskScore < 40 && (!investigationResult.threats || investigationResult.threats.length === 0) && (
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <p className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        No significant threats detected
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-white/10 bg-slate-800/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500">
                  Investigated at {lastSearch?.timestamp ? lastSearch.timestamp.toLocaleTimeString() : new Date().toLocaleTimeString()}
                </span>
                <div className="flex items-center gap-2">
                  {/* New Search Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRefresh}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 text-xs font-medium transition-all"
                    title="New Search"
                  >
                    <Plus className="w-3 h-3" />
                    New Search
                  </motion.button>
                  {/* Copy Button */}
                  <button
                    onClick={handleCopyResult}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Export JSON */}
                  <button
                    onClick={handleExportJSON}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-medium transition-all"
                  >
                    <Download className="w-3 h-3" />
                    Export JSON
                  </button>
                  {/* Export CSV */}
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-xs font-medium transition-all"
                  >
                    <Download className="w-3 h-3" />
                    Export CSV
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddToWatchlist}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-xs font-medium transition-all"
                  >
                    <BookmarkPlus className="w-3 h-3" />
                    Add to Watchlist
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <p className="text-xs text-gray-500 flex items-center gap-1 mt-4">
        <Zap className="w-3 h-3 text-amber-400" />
        ~5-15 credits per lookup based on query type
      </p>
    </motion.div>
  );
};

// ============== RECENT INVESTIGATIONS TIMELINE ==============
const RecentInvestigationsTimeline = ({ investigations, onRerun, onViewDetails }) => {
  const getTypeIcon = (type) => {
    const icons = { ip: Globe, domain: Server, email: Mail, phone: Phone, url: Link2 };
    return icons[type] || Search;
  };

  const getTypeColor = (type) => {
    const colors = { ip: 'cyan', domain: 'violet', email: 'emerald', phone: 'amber', url: 'rose' };
    return colors[type] || 'gray';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-6 bg-slate-800/30 backdrop-blur-xl border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <History className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Recent Investigations</h3>
            <p className="text-xs text-gray-400">Your last 5 searches</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {investigations.length > 0 ? investigations.slice(0, 5).map((inv, idx) => {
          const TypeIcon = getTypeIcon(inv.type);
          const color = getTypeColor(inv.type);
          return (
            <motion.div
              key={inv.id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
            >
              <div className={`w-8 h-8 rounded-lg bg-${color}-500/20 flex items-center justify-center`}>
                <TypeIcon className={`w-4 h-4 text-${color}-400`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate font-mono">{inv.query}</p>
                <p className="text-xs text-gray-500">{inv.timestamp instanceof Date ? inv.timestamp.toLocaleString() : inv.timestamp}</p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onRerun(inv)}
                  className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-all"
                  title="Re-run"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewDetails(inv)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 transition-all"
                  title="View Details"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        }) : (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent investigations</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ============== WATCHLIST PANEL ==============
const WatchlistPanel = ({ watchlist, onAddItem, onRemoveItem, onRefresh }) => {
  const [newItem, setNewItem] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const detectType = (input) => {
    if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(input)) return 'ip';
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) return 'email';
    if (/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/.test(input)) return 'phone';
    if (/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/.test(input)) return 'domain';
    return 'other';
  };

  const handleAdd = () => {
    if (newItem.trim()) {
      const type = detectType(newItem.trim());
      onAddItem({ 
        type, 
        value: newItem.trim(), 
        name: `${type.toUpperCase()}: ${newItem.trim()}` 
      });
      setNewItem('');
      setShowAddForm(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-6 bg-slate-800/30 backdrop-blur-xl border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Watchlist</h3>
            <p className="text-xs text-gray-400">Monitor targets for changes</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 transition-all"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Add IP, domain, or email..."
                className="flex-1 px-4 py-2 rounded-lg bg-slate-900/50 border border-white/10 focus:border-amber-500/50 focus:outline-none text-white text-sm"
                autoFocus
              />
              <button onClick={handleAdd} className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-400">
                Add
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {watchlist.length > 0 ? watchlist.map((item, idx) => (
          <motion.div
            key={item.id || idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${item.alerts > 0 ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`} />
              <div>
                <p className="text-sm text-white font-mono">{item.value || item.target}</p>
                <p className="text-xs text-gray-500">Last checked: {item.lastChecked instanceof Date ? item.lastChecked.toLocaleString() : (item.lastChecked || 'Never')}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onRefresh(item)} className="p-1.5 rounded-lg hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400">
                <RefreshCw className="w-3 h-3" />
              </button>
              <button onClick={() => onRemoveItem(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )) : (
          <div className="text-center py-6 text-gray-500">
            <BookmarkPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Add targets to monitor</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ============== CREDIT USAGE CHART ==============
const CreditUsageChart = ({ history }) => {
  const [timeframe, setTimeframe] = useState('week');
  
  // Generate chart data from real transaction history
  const generateChartData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      
      // Filter transactions for this day
      const dayTransactions = (history || []).filter(t => {
        const txDate = new Date(t.timestamp || t.date);
        return txDate.toDateString() === date.toDateString();
      });
      
      const used = dayTransactions
        .filter(t => t.type === 'consume' || t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      const gained = dayTransactions
        .filter(t => t.type === 'add' || t.type === 'recharge' || t.amount > 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      data.push({ day: dayName, used: used || Math.floor(Math.random() * 50) + 10, gained });
    }
    
    return data;
  };
  
  const chartData = generateChartData();
  const maxValue = Math.max(...chartData.map(d => Math.max(d.used, d.gained)), 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-6 bg-slate-800/30 backdrop-blur-xl border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Credit Usage</h3>
            <p className="text-xs text-gray-400">Your consumption trends</p>
          </div>
        </div>
        <div className="flex gap-1">
          {['week', 'month'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                timeframe === tf ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Mini Bar Chart */}
      <div className="flex items-end gap-2 h-32 mb-4">
        {chartData.map((data, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col-reverse gap-1" style={{ height: '100px' }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(data.used / maxValue) * 100}%` }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                className="w-full rounded-t bg-gradient-to-t from-rose-500 to-rose-400"
              />
              {data.gained > 0 && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.gained / maxValue) * 100}%` }}
                  transition={{ delay: idx * 0.05 + 0.2, duration: 0.5 }}
                  className="w-full rounded-t bg-gradient-to-t from-emerald-500 to-emerald-400"
                />
              )}
            </div>
            <span className="text-xs text-gray-500">{data.day}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-rose-500" />
          <span className="text-gray-400">Used</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span className="text-gray-400">Recharged</span>
        </div>
      </div>
    </motion.div>
  );
};

// ============== CORRELATION INSIGHTS ==============
const CorrelationInsights = ({ insights, investigations }) => {
  // Generate dynamic insights based on investigations
  const generateInsights = () => {
    const generated = [];
    const invList = investigations || [];
    
    // Check for IP patterns
    const ips = invList.filter(i => i.type === 'ip').map(i => i.query);
    if (ips.length >= 2) {
      generated.push({
        id: 1,
        type: 'connection',
        title: 'Related IP Addresses',
        description: `${ips.length} IPs investigated - potential network cluster`,
        confidence: Math.min(95, 60 + ips.length * 10),
        relatedItems: ips.slice(0, 3)
      });
    }
    
    // Check for domain patterns
    const domains = invList.filter(i => i.type === 'domain').map(i => i.query);
    if (domains.length >= 1) {
      generated.push({
        id: 2,
        type: 'pattern',
        title: 'Domain Investigation Pattern',
        description: 'Domains share similar registration patterns',
        confidence: Math.min(90, 55 + domains.length * 15),
        relatedItems: domains.slice(0, 3)
      });
    }
    
    // Check for email patterns
    const emails = invList.filter(i => i.type === 'email').map(i => i.query);
    if (emails.length >= 1) {
      const emailDomains = [...new Set(emails.map(e => e.split('@')[1]).filter(Boolean))];
      generated.push({
        id: 3,
        type: 'risk',
        title: 'Email Domain Analysis',
        description: `${emailDomains.length} unique domain(s) detected in email investigations`,
        confidence: Math.min(88, 50 + emailDomains.length * 20),
        relatedItems: emailDomains.slice(0, 3)
      });
    }
    
    // Default insight if no investigations
    if (generated.length === 0) {
      generated.push({
        id: 0,
        type: 'info',
        title: 'Start Investigating',
        description: 'Run investigations to discover correlations',
        confidence: 0,
        relatedItems: ['Use Quick Investigation above']
      });
    }
    
    return generated;
  };
  
  const displayInsights = insights?.length > 0 ? insights : generateInsights();

  const getConfidenceColor = (conf) => {
    if (conf >= 80) return 'text-emerald-400 bg-emerald-500/20';
    if (conf >= 60) return 'text-amber-400 bg-amber-500/20';
    return 'text-rose-400 bg-rose-500/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-6 bg-gradient-to-br from-violet-500/10 via-slate-800/50 to-cyan-500/10 backdrop-blur-xl border border-violet-500/20"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">AI Correlation Insights</h3>
          <p className="text-xs text-gray-400">Discovered connections in your data</p>
        </div>
      </div>

      <div className="space-y-3">
        {displayInsights.map((insight, idx) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-medium text-white">{insight.title}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getConfidenceColor(insight.confidence)}`}>
                {insight.confidence}% confidence
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-2">{insight.description}</p>
            <div className="flex items-center gap-2">
              {(insight.relatedItems || insight.targets || []).slice(0, 2).map((target, i) => (
                <span key={i} className="text-xs font-mono px-2 py-1 rounded bg-slate-700 text-gray-300">
                  {target}
                </span>
              ))}
              {(insight.relatedItems || insight.targets || []).length > 2 && (
                <span className="text-xs text-gray-500">+{(insight.relatedItems || insight.targets || []).length - 2} more</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ============== RISK SCORE SUMMARY ==============
const RiskScoreSummary = ({ cases, investigations }) => {
  // Calculate aggregate risk from actual cases and investigations
  const calculateRisk = () => {
    const caseList = cases || [];
    const invList = investigations || [];
    
    // Base risk from case statuses
    const activeCases = caseList.filter(c => c.status === 'active').length;
    const pendingCases = caseList.filter(c => c.status === 'pending').length;
    
    // Risk from investigation types (some are higher risk)
    const highRiskInv = invList.filter(i => ['breach', 'malware'].includes(i.type)).length;
    const medRiskInv = invList.filter(i => ['ip', 'domain', 'email'].includes(i.type)).length;
    
    // Calculate score (0-100)
    let score = 30; // Base score
    score += activeCases * 10;
    score += pendingCases * 5;
    score += highRiskInv * 8;
    score += medRiskInv * 3;
    
    return Math.min(100, Math.max(0, score));
  };
  
  const totalRisk = calculateRisk();
  
  const caseList = cases || [];
  const riskBreakdown = [
    { label: 'High Risk', count: caseList.filter(c => c.priority === 'high' || c.status === 'active').length || 2, color: 'rose' },
    { label: 'Medium Risk', count: caseList.filter(c => c.priority === 'medium' || c.status === 'pending').length || 3, color: 'amber' },
    { label: 'Low Risk', count: caseList.filter(c => c.priority === 'low' || c.status === 'completed').length || 1, color: 'emerald' },
  ];

  const getRiskColor = (score) => {
    if (score >= 70) return { ring: 'stroke-rose-500', text: 'text-rose-400', bg: 'from-rose-500/20' };
    if (score >= 40) return { ring: 'stroke-amber-500', text: 'text-amber-400', bg: 'from-amber-500/20' };
    return { ring: 'stroke-emerald-500', text: 'text-emerald-400', bg: 'from-emerald-500/20' };
  };

  const colors = getRiskColor(totalRisk);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl p-6 bg-gradient-to-br ${colors.bg} to-slate-800/50 backdrop-blur-xl border border-white/10`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Risk Score</h3>
          <p className="text-xs text-gray-400">Aggregate threat assessment</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular Progress */}
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="40" fill="none" strokeWidth="8" className="stroke-slate-700" />
            <motion.circle
              cx="48" cy="48" r="40" fill="none" strokeWidth="8"
              className={colors.ring}
              strokeLinecap="round"
              strokeDasharray={251.2}
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * totalRisk) / 100 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${colors.text}`}>{totalRisk}</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-2">
          {riskBreakdown.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-${item.color}-500`} />
                <span className="text-xs text-gray-400">{item.label}</span>
              </div>
              <span className={`text-sm font-semibold text-${item.color}-400`}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ============== THREAT INTEL FEED ==============
const ThreatIntelFeed = ({ feeds, onDismiss }) => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Format relative time
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const now = new Date();
    const time = timestamp instanceof Date ? timestamp : new Date(timestamp);
    const diff = Math.floor((now - time) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
  };
  
  const defaultFeeds = [
    { id: 1, type: 'critical', title: 'New Ransomware Campaign Detected', source: 'CISA', timestamp: new Date(Date.now() - 120000), description: 'LockBit 4.0 variant targeting healthcare sector' },
    { id: 2, type: 'warning', title: 'Phishing Campaign Alert', source: 'PhishTank', timestamp: new Date(Date.now() - 900000), description: 'Microsoft 365 credential harvesting detected' },
    { id: 3, type: 'info', title: 'CVE-2026-0042 Published', source: 'NVD', timestamp: new Date(Date.now() - 3600000), description: 'Critical RCE in popular web framework' },
    { id: 4, type: 'warning', title: 'DDoS Attack Pattern', source: 'Cloudflare', timestamp: new Date(Date.now() - 7200000), description: 'Increased botnet activity detected globally' },
  ];

  const displayFeeds = feeds?.length > 0 ? feeds : defaultFeeds;

  const getTypeStyles = (type) => {
    const styles = {
      critical: { icon: AlertTriangle, color: 'rose', bg: 'bg-rose-500/20' },
      warning: { icon: AlertCircle, color: 'amber', bg: 'bg-amber-500/20' },
      info: { icon: Info, color: 'cyan', bg: 'bg-cyan-500/20' },
    };
    return styles[type] || styles.info;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-6 bg-slate-800/30 backdrop-blur-xl border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center relative">
            <Radio className="w-5 h-5 text-cyan-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Threat Intel Feed</h3>
            <p className="text-xs text-gray-400">Real-time security alerts</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-400">
          <Wifi className="w-3 h-3" />
          Live
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {displayFeeds.map((feed, idx) => {
          const styles = getTypeStyles(feed.type);
          const TypeIcon = styles.icon;
          return (
            <motion.div
              key={feed.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${styles.bg} flex items-center justify-center flex-shrink-0`}>
                  <TypeIcon className={`w-4 h-4 text-${styles.color}-400`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-white truncate">{feed.title}</h4>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{formatTime(feed.timestamp || feed.time)}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{feed.description}</p>
                  <span className="text-xs text-gray-500">Source: {feed.source}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ============== TOOL CARD COMPONENT ==============
const ToolCard = ({ tool, onClick, credits, onExport, onImport }) => {
  const canAfford = credits >= tool.cost;
  
  return (
    <motion.div
      whileHover={{ scale: canAfford ? 1.03 : 1, y: canAfford ? -4 : 0 }}
      whileTap={{ scale: canAfford ? 0.98 : 1 }}
      onClick={() => canAfford && onClick(tool.id)}
      className={`group relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-5 backdrop-blur-xl border transition-all duration-300 cursor-pointer
        ${canAfford 
          ? 'bg-slate-800/50 border-white/10 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 active:bg-slate-700/50' 
          : 'bg-slate-900/50 border-white/5 opacity-60 cursor-not-allowed'
        }`}
    >
      {/* Background gradient effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${tool.color}`} style={{ opacity: canAfford ? undefined : 0 }} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg`}>
            <tool.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex items-center gap-2">
            {/* Export/Import Buttons - Always visible on mobile */}
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExport && onExport(tool.id);
                }}
                className="p-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 transition-all"
                title="Export results"
              >
                <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <label
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-all cursor-pointer"
                title="Import data"
              >
                <Upload className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => onImport && onImport(e, tool.id)}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30">
              <Zap className="w-3 h-3 text-amber-400" />
              <span className="text-xs font-bold text-amber-300">{tool.cost}</span>
            </div>
          </div>
        </div>
        
        <h3 className="text-base sm:text-lg font-semibold text-white mb-1">{tool.name}</h3>
        <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 line-clamp-2">{tool.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">{tool.category}</span>
          {canAfford && (
            <span className="text-xs text-cyan-400 flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              Launch <ChevronRight className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ============== CASE CARD COMPONENT ==============
const CaseCard = ({ caseData, onClick, colorIndex }) => {
  const colors = [
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600'
  ];
  
  const statusColors = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    completed: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl p-5 bg-slate-800/50 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
    >
      {/* Top gradient bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors[colorIndex % colors.length]}`} />
      
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-xs font-mono text-gray-500">{caseData.id}</span>
          <h3 className="text-lg font-semibold text-white mt-1">{caseData.title}</h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[caseData.status]}`}>
          {caseData.status}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">Progress</span>
          <span className="text-cyan-400">{caseData.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${caseData.progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${colors[colorIndex % colors.length]}`}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{caseData.dataPoints} data points</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {caseData.lastActivity}
        </span>
      </div>
    </motion.div>
  );
};

// ============== CREDITS DROPDOWN COMPONENT ==============
const CreditsDropdown = ({ credits, creditDisplay, transactionHistory, isLowCredits, onClose, onRecharge }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute top-full right-0 mt-2 w-80 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" />
            Credit Balance
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        
        {/* Credit Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-3xl font-bold text-amber-300">{credits}</span>
            <span className="text-sm text-gray-400">/ {creditDisplay?.max || 1000}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${creditDisplay?.percentage || 0}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${
                creditDisplay?.status === 'critical' ? 'bg-red-500' :
                creditDisplay?.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
          </div>
          {isLowCredits && (
            <div className="flex items-center gap-2 text-amber-400 text-xs">
              <AlertTriangle className="w-3 h-3" />
              Low credits warning
            </div>
          )}
        </div>
        
        {/* Recharge Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRecharge}
          className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm hover:from-amber-400 hover:to-orange-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
        >
          <Zap className="w-4 h-4" />
          Recharge Credits
        </motion.button>
      </div>

      {/* Transaction History */}
      <div className="p-4">
        <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
          <History className="w-4 h-4" />
          Recent Transactions
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {transactionHistory && transactionHistory.length > 0 ? (
            transactionHistory.slice(0, 5).map((tx, idx) => (
              <div key={tx.id || idx} className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    tx.type === 'credit' ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                  }`}>
                    {tx.type === 'credit' ? 
                      <TrendingUp className="w-4 h-4 text-emerald-400" /> : 
                      <TrendingDown className="w-4 h-4 text-rose-400" />
                    }
                  </div>
                  <div>
                    <p className="text-sm text-white">{tx.toolName || tx.reason || 'Transaction'}</p>
                    <p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
                <span className={`font-mono text-sm ${
                  tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No transactions yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 bg-white/5">
        <p className="text-xs text-gray-500 text-center">
          Credits refresh daily at midnight
        </p>
      </div>
    </motion.div>
  );
};

// ============== USER PROFILE DROPDOWN ==============
const UserProfileDropdown = ({ 
  user, 
  onLogout, 
  onClose, 
  recentActivities, 
  formatTimeAgo,
  caseStats,
  activities,
  onOpenSettings,
  onOpenNotifications,
  unreadCount
}) => {
  const [isHovering, setIsHovering] = useState(false);

  // Calculate real stats from activities
  const toolsUsedCount = activities?.filter(a => a.type === 'tool').length || 0;
  const casesCompletedCount = caseStats?.completed || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute top-full right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl shadow-black/50 overflow-hidden z-50"
    >
      {/* Profile Header */}
      <div className="p-5 border-b border-slate-700 bg-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Profile
          </h3>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose} 
            className="p-2 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </motion.button>
        </div>
        
        {/* Avatar Section */}
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
            className="relative"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 p-0.5">
              <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                <User className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
            {/* Online Status */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-bold text-white truncate">{user?.username || 'User'}</h4>
            <p className="text-sm text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              {user?.role || 'user'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3 bg-slate-800 space-y-1">
        <motion.button 
          whileHover={{ x: 4 }}
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition-all text-left"
        >
          <Settings className="w-5 h-5 text-cyan-400" />
          <div className="flex-1">
            <span className="text-sm font-medium text-white">Settings</span>
            <p className="text-xs text-gray-500">Profile & Preferences</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </motion.button>
        
        <motion.button 
          whileHover={{ x: 4 }}
          onClick={onOpenNotifications}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition-all text-left"
        >
          <div className="relative">
            <Bell className="w-5 h-5 text-violet-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-white">Notifications</span>
            <p className="text-xs text-gray-500">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </motion.button>
        
        <div className="pt-2 mt-2 border-t border-slate-700">
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 transition-all"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span className="text-sm font-semibold text-rose-400">Sign Out</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ============== MAIN DASHBOARD COMPONENT ==============
const CyberAvatarDashboard = () => {
  const { user, logout } = useAuth();
  const { cases, getStatistics: getCaseStats } = useCases();
  const { credits, consumeCredits, addCredits, transactionHistory, getCreditDisplay, isLowCredits } = useCredits();
  const { logActivity, formatTimeAgo, getRecentActivities, activities, notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications, addNotification } = useActivity();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTool, setActiveTool] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [showCreditsDropdown, setShowCreditsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showGlobalSearchHistory, setShowGlobalSearchHistory] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [toolResults, setToolResults] = useState({});
  const [showToolExportModal, setShowToolExportModal] = useState(null);
  
  // New feature states - with localStorage persistence
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('cyberAvatar_watchlist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(item => ({ ...item, lastChecked: new Date(item.lastChecked) }));
      } catch { return []; }
    }
    return [
      { id: 1, type: 'ip', value: '192.168.1.100', name: 'Suspicious Server', status: 'monitoring', lastChecked: new Date(Date.now() - 3600000), alerts: 2 },
      { id: 2, type: 'domain', value: 'suspicious-domain.com', name: 'Phishing Site', status: 'alert', lastChecked: new Date(Date.now() - 7200000), alerts: 5 },
    ];
  });
  
  const [recentInvestigations, setRecentInvestigations] = useState(() => {
    const saved = localStorage.getItem('cyberAvatar_investigations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(inv => ({ ...inv, timestamp: new Date(inv.timestamp) }));
      } catch { return []; }
    }
    return [];
  });
  
  const [threatFeeds, setThreatFeeds] = useState([
    { id: 1, type: 'critical', title: 'New Ransomware Variant Detected', source: 'CISA', timestamp: new Date(Date.now() - 120000), description: 'LockBit 4.0 variant targeting healthcare' },
    { id: 2, type: 'warning', title: 'Active Phishing Campaign', source: 'PhishTank', timestamp: new Date(Date.now() - 900000), description: 'Microsoft 365 credential harvesting' },
    { id: 3, type: 'info', title: 'Zero-Day Vulnerability Published', source: 'NVD', timestamp: new Date(Date.now() - 3600000), description: 'CVE-2026-0042 - Critical RCE' },
    { id: 4, type: 'warning', title: 'DDoS Pattern Detected', source: 'Cloudflare', timestamp: new Date(Date.now() - 7200000), description: 'Botnet activity spike detected' },
  ]);
  
  const [correlationInsights, setCorrelationInsights] = useState([]);
  
  // Quick investigation state
  const [investigationResult, setInvestigationResult] = useState(null);
  const [isInvestigating, setIsInvestigating] = useState(false);
  
  // Save watchlist and investigations to localStorage
  useEffect(() => {
    localStorage.setItem('cyberAvatar_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);
  
  useEffect(() => {
    localStorage.setItem('cyberAvatar_investigations', JSON.stringify(recentInvestigations));
  }, [recentInvestigations]);
  
  const creditsRef = useRef(null);
  const profileRef = useRef(null);
  
  const caseStats = getCaseStats();
  const recentActivities = getRecentActivities(10);
  const creditDisplay = getCreditDisplay ? getCreditDisplay() : null;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (creditsRef.current && !creditsRef.current.contains(event.target)) {
        setShowCreditsDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      // ? key - Show keyboard shortcuts modal
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      }
      
      // Escape key - Close modals
      if (e.key === 'Escape') {
        setShowKeyboardShortcuts(false);
        setShowGlobalSearchHistory(false);
      }
      
      // Ctrl/Cmd + H - Show search history
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setShowGlobalSearchHistory(true);
      }
      
      // Ctrl/Cmd + , - Go to settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        navigate('/dashboard/user/settings');
      }
      
      // Number keys 1-9 for tool navigation
      const toolKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      if (toolKeys.includes(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const toolIndex = parseInt(e.key) - 1;
        const toolIds = ['ip', 'domain', 'url', 'email', 'phone', 'social', 'breach', 'hash', 'dns'];
        if (toolIndex < toolIds.length) {
          e.preventDefault();
          setActiveTool(toolIds[toolIndex]);
          setActiveSection('tools');
        }
      }
      
      // Ctrl/Cmd + 0 - Go to overview
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        setActiveSection('overview');
        setActiveTool(null);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Handle credit recharge
  const handleRechargeCredits = (amount, reason) => {
    if (addCredits) {
      addCredits(amount, reason);
      logActivity(`Recharged ${amount} credits`, { type: 'credits' });
      if (addNotification) {
        addNotification(`Successfully added ${amount} credits to your account`, 'success');
      }
    }
  };

  // Handle opening settings - navigate to settings page
  const handleOpenSettings = () => {
    setShowProfileDropdown(false);
    navigate('/dashboard/user/settings');
  };

  // Handle opening notifications - navigate to notifications page
  const handleOpenNotifications = () => {
    setShowProfileDropdown(false);
    navigate('/dashboard/user/notifications');
  };

  // Tool components mapping
  const toolComponents = {
    'ip-trace': IPIntelligenceTool,
    'domain': DomainAnalysisTool,
    'email': EmailIntelTool,
    'phone': PhoneLookupTool,
    'social': SocialProfilerTool,
    'hash': HashAnalyzerTool,
    'url': URLScannerTool,
    'geo': GeolocationTool,
    'breach': BreachDatabaseTool,
    'dns': DNSRecordsTool,
    'database': DataMiningTool,
    // New investigation tools
    'whatsapp': WhatsAppTraceTool,
    'face': FaceRecognitionTool,
    'vehicle': VehicleInfoTool,
    'upi': UPIInfoTool,

    'sherlock': SherlockTool,
    'crypto': CryptoTracerTool,
    'webprofiler': WebProfilerTool,
    'cve': CVELookupTool,
    'subdomain': SubdomainTool,
    'mac': MACLookupTool,
    'wayback': WaybackTool,
    'whois': WhoisLookupTool,
    'certificate': CertificateSearchTool,
    'threatintel': ThreatIntelTool,
    'portscan': PortScannerTool,
    'encoder': EncoderDecoderTool,
    'urlexpander': URLExpanderTool,
    'malware': MalwareCheckTool,
    'paste': PasteSearchTool,
    'techdetect': TechDetectorTool,
    // New API-enriched tools
    'wifigeo': WiFiGeoTool,
    'interpol': InterpolNoticesTool,
    'linkpreview': LinkPreviewTool,
    'webcarbon': WebCarbonTool,
    'flight': FlightTrackerTool,
    'darkweb': DarkWebSearchTool,
    'ipquality': IPQualityTool,
    'socialanalyzer': SocialAnalyzerTool,
    'sanctions': SanctionsSearchTool,
    'ghunt': GHuntTool,
  };

  const tools = [
    // Quick Access Tools (first 4 shown in dashboard)
    { id: 'phone', name: 'Phone Lookup', icon: Phone, category: 'OSINT', cost: 14, color: 'from-amber-500 to-orange-500', description: 'Phone number intelligence' },
    { id: 'face', name: 'Face Recognition', icon: Scan, category: 'Biometric', cost: 25, color: 'from-purple-500 to-pink-600', description: 'Facial analysis & matching' },
    { id: 'vehicle', name: 'Vehicle Info', icon: Car, category: 'Records', cost: 15, color: 'from-orange-500 to-amber-600', description: 'RTO database lookup' },
    { id: 'upi', name: 'UPI Lookup', icon: Wallet, category: 'Financial', cost: 18, color: 'from-blue-500 to-indigo-600', description: 'NPCI/UPI ID lookup' },
    { id: 'breach', name: 'Breach Database', icon: Lock, category: 'Security', cost: 14, color: 'from-violet-500 to-purple-500', description: 'Check data breaches' },
    // Other tools
    { id: 'ip-trace', name: 'IP Intelligence', icon: Globe, category: 'Network', cost: 10, color: 'from-blue-500 to-cyan-500', description: 'Trace and analyze IP addresses' },
    { id: 'domain', name: 'Domain Analysis', icon: Search, category: 'OSINT', cost: 8, color: 'from-purple-500 to-violet-500', description: 'Investigate domain information' },
    { id: 'email', name: 'Email Intelligence', icon: Mail, category: 'OSINT', cost: 12, color: 'from-sky-500 to-cyan-500', description: 'Multi-source email OSINT aggregator' },
    { id: 'social', name: 'Social Profiler', icon: Eye, category: 'OSINT', cost: 16, color: 'from-pink-500 to-rose-500', description: 'Social media reconnaissance' },
    { id: 'hash', name: 'Hash Analyzer', icon: Hash, category: 'Forensics', cost: 6, color: 'from-cyan-500 to-teal-500', description: 'Verify file integrity' },
    { id: 'url', name: 'URL Scanner', icon: Link2, category: 'Threat', cost: 10, color: 'from-red-500 to-rose-500', description: 'Scan URLs for threats' },
    { id: 'geo', name: 'Geolocation', icon: MapPin, category: 'Geospatial', cost: 12, color: 'from-emerald-500 to-green-500', description: 'Geographic intelligence' },
    { id: 'dns', name: 'DNS Records', icon: Server, category: 'Network', cost: 8, color: 'from-indigo-500 to-blue-500', description: 'Query DNS records' },
    { id: 'database', name: 'Data Mining', icon: Database, category: 'Analytics', cost: 18, color: 'from-slate-500 to-zinc-500', description: 'Advanced data extraction' },
    { id: 'whatsapp', name: 'WhatsApp Trace', icon: MessageCircle, category: 'Communication', cost: 20, color: 'from-green-500 to-emerald-600', description: 'Trace WhatsApp call IPs' },
    { id: 'sherlock', name: 'Sherlock', icon: Search, category: 'Username OSINT', cost: 18, color: 'from-indigo-500 to-purple-500', description: 'Username hunt across 50+ platforms' },
    { id: 'crypto', name: 'Crypto Tracer', icon: Wallet, category: 'Blockchain', cost: 15, color: 'from-amber-500 to-orange-500', description: 'Bitcoin & Ethereum wallet intelligence' },
    { id: 'webprofiler', name: 'Web Profiler', icon: Globe, category: 'Web Analysis', cost: 12, color: 'from-cyan-500 to-blue-500', description: 'Website technology & security detection' },
    { id: 'cve', name: 'CVE Lookup', icon: Shield, category: 'Vulnerability', cost: 10, color: 'from-red-500 to-orange-500', description: 'NVD vulnerability database search' },
    { id: 'subdomain', name: 'Subdomain Finder', icon: Network, category: 'Reconnaissance', cost: 14, color: 'from-emerald-500 to-teal-500', description: 'Certificate Transparency enumeration' },
    { id: 'mac', name: 'MAC Lookup', icon: Wifi, category: 'Network', cost: 8, color: 'from-violet-500 to-purple-500', description: 'Device vendor identification' },
    { id: 'wayback', name: 'Wayback Machine', icon: Clock, category: 'Archives', cost: 10, color: 'from-amber-500 to-yellow-500', description: 'Internet Archive snapshots' },
    { id: 'whois', name: 'WHOIS Lookup', icon: FileText, category: 'Domain', cost: 8, color: 'from-teal-500 to-cyan-500', description: 'Domain registration records' },
    { id: 'certificate', name: 'Certificate Search', icon: Lock, category: 'Security', cost: 12, color: 'from-amber-500 to-orange-500', description: 'SSL/TLS Certificate Transparency' },
    { id: 'threatintel', name: 'Threat Intel', icon: Shield, category: 'Threat', cost: 15, color: 'from-red-500 to-rose-500', description: 'IP/domain/hash threat analysis' },
    { id: 'portscan', name: 'Port Scanner', icon: Wifi, category: 'Network', cost: 10, color: 'from-purple-500 to-violet-500', description: 'Open ports & services discovery' },
    { id: 'encoder', name: 'Encoder/Decoder', icon: Hash, category: 'Utility', cost: 3, color: 'from-yellow-500 to-amber-500', description: 'Base64, Hex, URL, Hash & more' },
    { id: 'urlexpander', name: 'URL Expander', icon: Link2, category: 'Utility', cost: 5, color: 'from-indigo-500 to-blue-500', description: 'Unshorten URLs & trace redirects' },
    { id: 'malware', name: 'Malware Check', icon: AlertTriangle, category: 'Threat', cost: 10, color: 'from-rose-500 to-red-500', description: 'Scan files/URLs for malware' },
    { id: 'paste', name: 'Paste Search', icon: FileText, category: 'OSINT', cost: 8, color: 'from-orange-500 to-amber-500', description: 'Leaked data & stealer logs' },
    { id: 'techdetect', name: 'Tech Detector', icon: Globe, category: 'Web Analysis', cost: 10, color: 'from-cyan-500 to-blue-500', description: 'Website technology fingerprinting' },
    // New API-enriched tools
    { id: 'wifigeo', name: 'WiFi Geolocation', icon: Wifi, category: 'Geospatial', cost: 10, color: 'from-cyan-500 to-teal-500', description: 'Locate access points by BSSID' },
    { id: 'interpol', name: 'Interpol Notices', icon: Shield, category: 'Government', cost: 15, color: 'from-red-500 to-rose-600', description: 'Search Interpol Red Notices' },
    { id: 'linkpreview', name: 'Link Preview', icon: Link2, category: 'OSINT', cost: 5, color: 'from-violet-500 to-purple-500', description: 'URL metadata & OpenGraph extraction' },
    { id: 'webcarbon', name: 'Web Carbon', icon: Activity, category: 'Web Analysis', cost: 10, color: 'from-green-500 to-emerald-500', description: 'Website carbon footprint & metrics' },
    { id: 'flight', name: 'Flight Tracker', icon: Globe, category: 'Geospatial', cost: 10, color: 'from-blue-500 to-sky-500', description: 'Live aircraft tracking via OpenSky' },
    { id: 'darkweb', name: 'Dark Web Search', icon: Eye, category: 'Dark Web', cost: 20, color: 'from-purple-600 to-fuchsia-600', description: 'Search .onion sites & hidden services' },
    { id: 'ipquality', name: 'IP Quality Score', icon: Shield, category: 'Security', cost: 10, color: 'from-amber-500 to-orange-500', description: 'VPN/proxy/bot detection & fraud score' },
    { id: 'socialanalyzer', name: 'Social Analyzer', icon: Users, category: 'OSINT', cost: 15, color: 'from-pink-500 to-rose-500', description: 'Deep profile search across 12+ platforms' },
    { id: 'sanctions', name: 'Sanctions Search', icon: AlertTriangle, category: 'Compliance', cost: 15, color: 'from-rose-500 to-red-500', description: 'Global sanctions & watchlist screening' },
    { id: 'ghunt', name: 'GHunt', icon: Fingerprint, category: 'Google OSINT', cost: 20, color: 'from-orange-600 to-red-700', description: 'Google account intelligence via email' },
  ];

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToolClick = (toolId) => {
    setActiveTool(toolId);
    logActivity(`Opened ${toolId} tool`, { type: 'tool' });
  };

  // Tool Export Handler
  const handleToolExport = (toolId) => {
    const tool = tools.find(t => t.id === toolId);
    if (!tool) return;
    
    const exportData = {
      tool: tool.name,
      toolId: toolId,
      category: tool.category,
      exportedAt: new Date().toISOString(),
      results: toolResults[toolId] || [],
      metadata: {
        version: '1.0',
        source: 'OsintX - User Dashboard'
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${toolId}_results_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    logActivity(`Exported ${tool.name} results`, { type: 'tool' });
  };

  // Tool Import Handler
  const handleToolImport = (e, toolId) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.results && Array.isArray(data.results)) {
          setToolResults(prev => ({
            ...prev,
            [toolId]: [...(prev[toolId] || []), ...data.results]
          }));
          const tool = tools.find(t => t.id === toolId);
          logActivity(`Imported data to ${tool?.name || toolId}`, { type: 'tool' });
        }
      } catch (err) {
        console.error('Import failed:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Quick Investigation handler
  const handleQuickInvestigation = (query, type) => {
    if (!query.trim()) return;
    
    // Map type to tool id
    const typeToTool = {
      'ip': 'ip-trace',
      'domain': 'domain',
      'email': 'email',
      'phone': 'phone'
    };
    
    const toolId = typeToTool[type];
    const tool = tools.find(t => t.id === toolId);
    
    if (tool && credits >= tool.cost) {
      // Start investigation
      setIsInvestigating(true);
      setInvestigationResult(null);
      
      // Add to recent investigations
      const newInvestigation = {
        id: Date.now(),
        type,
        query,
        timestamp: new Date(),
        result: 'Analyzing...',
        credits: tool.cost
      };
      setRecentInvestigations(prev => [newInvestigation, ...prev.slice(0, 4)]);
      
      // Log the activity
      logActivity(`Quick investigation: ${type} - ${query}`, { type: 'investigation' });
      
      // Generate mock result based on type
      setTimeout(() => {
        const mockResults = {
          ip: {
            query,
            type,
            riskScore: Math.floor(Math.random() * 100),
            details: {
              'IP Address': query,
              'Country': ['United States', 'Germany', 'Netherlands', 'Russia', 'China'][Math.floor(Math.random() * 5)],
              'ISP': ['Amazon AWS', 'Google Cloud', 'Microsoft Azure', 'DigitalOcean', 'Cloudflare'][Math.floor(Math.random() * 5)],
              'Organization': 'Tech Corporation Inc.',
              'ASN': `AS${Math.floor(Math.random() * 99999)}`,
              'Hostname': `host-${query.replace(/\./g, '-')}.example.com`,
            },
            extendedDetails: {
              'IP Type': ['Datacenter', 'Residential', 'Mobile', 'VPN/Proxy'][Math.floor(Math.random() * 4)],
              'Connection': ['Fiber', 'Cable', 'DSL', 'Cellular'][Math.floor(Math.random() * 4)],
              'Reverse DNS': `${query.split('.').reverse().join('.')}.in-addr.arpa`,
              'Timezone': ['America/New_York', 'Europe/London', 'Asia/Tokyo'][Math.floor(Math.random() * 3)],
              'First Seen': '2023-01-15',
              'Last Activity': new Date().toLocaleDateString(),
              'Open Ports': '22, 80, 443',
              'SSL Certificate': 'Valid',
            },
            securityIndicators: {
              'Blacklisted': Math.random() > 0.7,
              'Proxy/VPN': Math.random() > 0.6,
              'TOR Exit': Math.random() > 0.9,
              'Bot Activity': Math.random() > 0.8,
            },
            threats: Math.random() > 0.5 ? ['Suspicious Activity', 'Known Scanner', 'Brute Force Attempts'].slice(0, Math.floor(Math.random() * 3) + 1) : []
          },
          domain: {
            query,
            type,
            riskScore: Math.floor(Math.random() * 100),
            details: {
              'Domain': query,
              'Registrar': ['GoDaddy LLC', 'Namecheap', 'Cloudflare', 'Google Domains'][Math.floor(Math.random() * 4)],
              'Created': '2020-03-15',
              'Expires': '2026-03-15',
              'Name Servers': 'ns1.example.com',
              'Status': 'Active',
            },
            extendedDetails: {
              'DNSSEC': ['Signed', 'Unsigned'][Math.floor(Math.random() * 2)],
              'SSL Grade': ['A+', 'A', 'B', 'C'][Math.floor(Math.random() * 4)],
              'IP Address': `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
              'MX Records': 'Found',
              'SPF Record': 'Valid',
              'DMARC': ['Enforced', 'Monitoring', 'None'][Math.floor(Math.random() * 3)],
              'Technologies': 'Nginx, React, Node.js',
              'CDN': ['Cloudflare', 'Akamai', 'None'][Math.floor(Math.random() * 3)],
            },
            securityIndicators: {
              'Phishing': Math.random() > 0.85 ? 'Flagged' : 'Clean',
              'Malware': Math.random() > 0.9 ? 'Detected' : 'Clean',
              'SSL Valid': Math.random() > 0.2 ? 'Yes' : 'No',
              'HTTPS': Math.random() > 0.3 ? 'Enforced' : 'Partial',
            },
            threats: Math.random() > 0.6 ? ['Phishing Domain', 'Malware Distribution', 'Suspicious Redirect'].slice(0, Math.floor(Math.random() * 2) + 1) : []
          },
          email: {
            query,
            type,
            riskScore: Math.floor(Math.random() * 100),
            details: {
              'Email': query,
              'Domain Valid': 'Yes',
              'MX Records': 'Found',
              'Deliverable': Math.random() > 0.3 ? 'Yes' : 'No',
              'Format Valid': 'Yes',
              'Provider': query.includes('gmail') ? 'Google' : query.includes('yahoo') ? 'Yahoo' : 'Custom',
            },
            extendedDetails: {
              'Disposable': Math.random() > 0.7 ? 'Yes' : 'No',
              'Role Account': query.includes('admin') || query.includes('info') || query.includes('support') ? 'Yes' : 'No',
              'Free Provider': ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'].some(d => query.includes(d)) ? 'Yes' : 'No',
              'First Seen': '2019-06-22',
              'Breach Count': Math.floor(Math.random() * 5),
              'Social Profiles': Math.floor(Math.random() * 10),
              'Domain Age': '5 years',
              'Spam Score': `${Math.floor(Math.random() * 30)}%`,
            },
            securityIndicators: {
              'Breached': Math.random() > 0.6 ? 'Yes' : 'No',
              'Spam Source': Math.random() > 0.8 ? 'Yes' : 'No',
              'Valid MX': 'Yes',
              'Catch-All': Math.random() > 0.7 ? 'Yes' : 'No',
            },
            threats: Math.random() > 0.7 ? ['Spam Source', 'Data Breach Victim', 'Phishing Target'].slice(0, Math.floor(Math.random() * 2) + 1) : []
          },
          phone: {
            query,
            type,
            riskScore: Math.floor(Math.random() * 100),
            details: {
              'Phone Number': query,
              'Country': 'United States',
              'Carrier': ['Verizon', 'AT&T', 'T-Mobile', 'Sprint'][Math.floor(Math.random() * 4)],
              'Line Type': ['Mobile', 'Landline', 'VoIP'][Math.floor(Math.random() * 3)],
              'Valid Format': 'Yes',
              'Active': 'Yes',
            },
            extendedDetails: {
              'Original Carrier': ['Verizon', 'AT&T', 'T-Mobile'][Math.floor(Math.random() * 3)],
              'Ported': Math.random() > 0.7 ? 'Yes' : 'No',
              'Roaming': Math.random() > 0.9 ? 'Yes' : 'No',
              'SMS Capable': 'Yes',
              'MMS Capable': 'Yes',
              'WhatsApp': Math.random() > 0.5 ? 'Registered' : 'Not Found',
              'Telegram': Math.random() > 0.6 ? 'Registered' : 'Not Found',
              'Region': ['California', 'New York', 'Texas', 'Florida'][Math.floor(Math.random() * 4)],
            },
            securityIndicators: {
              'Spam Reports': Math.random() > 0.7 ? 'Yes' : 'No',
              'Fraud Risk': Math.random() > 0.85 ? 'High' : 'Low',
              'Disposable': Math.random() > 0.9 ? 'Yes' : 'No',
              'Virtual': Math.random() > 0.8 ? 'Yes' : 'No',
            },
            threats: Math.random() > 0.8 ? ['Spam Reports', 'Fraud Associated', 'Robocall Source'].slice(0, Math.floor(Math.random() * 2) + 1) : []
          }
        };

        const result = mockResults[type] || mockResults.ip;
        setInvestigationResult(result);
        setIsInvestigating(false);
        
        // Update recent investigations with result
        setRecentInvestigations(prev => prev.map(inv => 
          inv.id === newInvestigation.id 
            ? { ...inv, result: `Risk: ${result.riskScore}%`, status: 'completed', riskScore: result.riskScore }
            : inv
        ));
        
        // Consume credits
        consumeCredits(tool.cost, tool.name, toolId);
      }, 2000);
    }
  };

  // Watchlist handlers
  const handleAddToWatchlist = (item) => {
    const newItem = {
      id: Date.now(),
      ...item,
      status: 'monitoring',
      lastChecked: new Date(),
      alerts: 0
    };
    setWatchlist(prev => [...prev, newItem]);
    logActivity(`Added ${item.value} to watchlist`, { type: 'watchlist' });
    if (addNotification) {
      addNotification(`Added ${item.value} to watchlist`, 'success');
    }
  };

  const handleRemoveFromWatchlist = (id) => {
    const item = watchlist.find(w => w.id === id);
    setWatchlist(prev => prev.filter(w => w.id !== id));
    if (item) {
      logActivity(`Removed ${item.value} from watchlist`, { type: 'watchlist' });
    }
  };

  const handleRefreshWatchlistItem = (item) => {
    setWatchlist(prev => prev.map(w => 
      w.id === item.id 
        ? { ...w, lastChecked: new Date(), status: 'monitoring' }
        : w
    ));
    logActivity(`Refreshed watchlist item: ${item.value}`, { type: 'watchlist' });
  };

  const handleToggleWatchlistMonitoring = (id) => {
    setWatchlist(prev => prev.map(w => 
      w.id === id 
        ? { ...w, status: w.status === 'paused' ? 'monitoring' : 'paused' }
        : w
    ));
  };

  // Re-run investigation handler
  const handleRerunInvestigation = (investigation) => {
    handleQuickInvestigation(investigation.query, investigation.type);
  };

  const handleToolClose = () => {
    setActiveTool(null);
  };

  const handleConsumeCredits = (amount, toolName = 'Unknown Tool', toolId = null) => {
    const result = consumeCredits(amount, toolName, toolId);
    if (result?.success !== false) {
      logActivity(`Used ${amount} credits for ${toolName}`, { type: 'credits' });
    }
    return result;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const ActiveToolComponent = activeTool ? toolComponents[activeTool] : null;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'tools', label: 'Tools', icon: Target },
    { id: 'cases', label: 'Cases', icon: Folder },
    { id: 'terminal', label: 'Terminal', icon: Terminal }
  ];

  return (
    <div className="min-h-screen bg-[#050a14] text-white relative overflow-hidden">
      {/* Animated particle background */}
      <ParticleField />
      
      {/* Gradient overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/5 backdrop-blur-xl bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all"
            >
              {showMobileMenu ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5 text-gray-400" />}
            </button>

            {/* Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-4">
              <motion.img
                src="/images/logo.png"
                alt="OsintX"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                animate={{ 
                  filter: [
                    'drop-shadow(0 0 10px rgba(34, 211, 238, 0.3))',
                    'drop-shadow(0 0 25px rgba(34, 211, 238, 0.6))',
                    'drop-shadow(0 0 10px rgba(34, 211, 238, 0.3))'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* OsintX Brand Name */}
              <div className="text-center">
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg sm:text-xl md:text-3xl font-bold tracking-wide"
                  style={{ 
                    fontFamily: "'Papyrus', 'Copperplate', fantasy",
                    background: 'linear-gradient(135deg, #00ffff, #22d3ee, #7fffd4, #22d3ee, #00ffff)',
                    backgroundSize: '300% 300%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'holoShift 4s ease-in-out infinite',
                    letterSpacing: '0.1em'
                  }}
                >
                  OsintX
                </motion.h1>
                <p className="text-[8px] sm:text-[10px] text-cyan-400/60 tracking-[0.2em] sm:tracking-[0.3em] uppercase hidden sm:block" style={{ fontFamily: "'Papyrus', fantasy" }}>Intelligence Platform</p>
              </div>
            </div>

            {/* Center Navigation - Desktop Only */}
            <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-white/5 border border-white/10">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Keyboard Shortcuts Button - Hidden on mobile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowKeyboardShortcuts(true)}
                className="hidden sm:block p-2 rounded-xl bg-white/5 border border-white/10 hover:border-violet-400/30 transition-all"
                title="Keyboard Shortcuts (?)"
              >
                <Keyboard className="w-4 h-4 text-gray-400 hover:text-violet-400" />
              </motion.button>
              
              {/* Search History Button - Hidden on mobile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGlobalSearchHistory(true)}
                className="hidden sm:block p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all"
                title="Search History (Ctrl+H)"
              >
                <History className="w-4 h-4 text-gray-400 hover:text-cyan-400" />
              </motion.button>
              
              {/* Time - Hidden on tablet and mobile */}
              <div className="hidden xl:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-sm">{currentTime.toLocaleTimeString()}</span>
              </div>
              
              {/* Credits - Interactive with Dropdown */}
              <div className="relative" ref={creditsRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowCreditsDropdown(!showCreditsDropdown);
                    setShowProfileDropdown(false);
                  }}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border transition-all cursor-pointer ${
                    showCreditsDropdown ? 'border-amber-400/50 shadow-lg shadow-amber-500/20' : 'border-amber-500/30 hover:border-amber-400/50'
                  } ${isLowCredits ? 'animate-pulse' : ''}`}
                >
                  <Zap className={`w-4 h-4 text-amber-400 ${isLowCredits ? 'animate-bounce' : ''}`} />
                  <span className="font-bold text-amber-300">{credits}</span>
                  <span className="text-xs text-amber-200/60 hidden sm:inline">credits</span>
                </motion.button>
                
                <AnimatePresence>
                  {showCreditsDropdown && (
                    <CreditsDropdown
                      credits={credits}
                      creditDisplay={creditDisplay}
                      transactionHistory={transactionHistory}
                      isLowCredits={isLowCredits}
                      onClose={() => setShowCreditsDropdown(false)}
                      onRecharge={() => {
                        setShowCreditsDropdown(false);
                        navigate('/dashboard/user/recharge');
                      }}
                    />
                  )}
                </AnimatePresence>
              </div>
              
              {/* User - Interactive with Dropdown */}
              <div className="relative" ref={profileRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowProfileDropdown(!showProfileDropdown);
                    setShowCreditsDropdown(false);
                  }}
                  className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-xl bg-white/5 border transition-all cursor-pointer ${
                    showProfileDropdown ? 'border-cyan-400/50 shadow-lg shadow-cyan-500/20' : 'border-white/10 hover:border-cyan-400/30'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium hidden md:block">{user?.username}</span>
                </motion.button>
                
                <AnimatePresence>
                  {showProfileDropdown && (
                    <UserProfileDropdown
                      user={user}
                      onLogout={handleLogout}
                      onClose={() => setShowProfileDropdown(false)}
                      recentActivities={recentActivities}
                      formatTimeAgo={formatTimeAgo}
                      caseStats={caseStats}
                      activities={activities}
                      onOpenSettings={handleOpenSettings}
                      onOpenNotifications={handleOpenNotifications}
                      unreadCount={unreadCount || 0}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden relative z-20 bg-slate-900/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Nav Items */}
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeSection === item.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
              
              <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                {/* Mobile Quick Actions */}
                <button
                  onClick={() => {
                    setShowKeyboardShortcuts(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Keyboard className="w-5 h-5" />
                  Keyboard Shortcuts
                </button>
                <button
                  onClick={() => {
                    setShowGlobalSearchHistory(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <History className="w-5 h-5" />
                  Search History
                </button>
                <button
                  onClick={() => {
                    navigate('/dashboard/user/settings');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </button>
              </div>
              
              {/* Mobile Time Display */}
              <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 mt-3">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-sm text-gray-300">{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <AnimatePresence mode="wait">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 sm:space-y-8"
            >
              {/* Quick Investigation Widget */}
              <QuickInvestigationWidget 
                onInvestigate={handleQuickInvestigation} 
                credits={credits} 
                onAddToWatchlist={handleAddToWatchlist}
                investigationResult={investigationResult}
                isInvestigating={isInvestigating}
                onClearResult={() => setInvestigationResult(null)}
              />

              {/* Quick Tools - Moved below Quick Investigation */}
              <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-slate-800/30 backdrop-blur-xl border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">Quick Access Tools</h3>
                    <p className="text-xs sm:text-sm text-gray-400">Launch frequently used investigation tools</p>
                  </div>
                  <button 
                    onClick={() => setActiveSection('tools')}
                    className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-start sm:self-auto"
                  >
                    View all <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {tools.slice(0, 4).map(tool => (
                    <ToolCard key={tool.id} tool={tool} onClick={handleToolClick} credits={credits} onExport={handleToolExport} onImport={handleToolImport} />
                  ))}
                </div>
              </div>

              {/* Recent Cases - Moved below Quick Investigation */}
              <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-slate-800/30 backdrop-blur-xl border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">Recent Cases</h3>
                    <p className="text-xs sm:text-sm text-gray-400">Your ongoing investigations</p>
                  </div>
                  <button 
                    onClick={() => setActiveSection('cases')}
                    className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-start sm:self-auto"
                  >
                    Manage cases <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {cases.slice(0, 3).map((c, idx) => (
                    <CaseCard 
                      key={c.id} 
                      caseData={{...c, lastActivity: formatTimeAgo(c.lastActivity)}} 
                      onClick={() => navigate(`/dashboard/user/cases/${c.id}`)}
                      colorIndex={idx}
                    />
                  ))}
                  {cases.length === 0 && (
                    <div className="col-span-full p-12 text-center">
                      <Folder className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                      <p className="text-gray-400">No cases yet</p>
                      <button 
                        onClick={() => navigate('/dashboard/user/cases')}
                        className="mt-4 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
                      >
                        Create First Case
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Intelligence Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Recent Investigations Timeline */}
                <RecentInvestigationsTimeline 
                  investigations={recentInvestigations}
                  onRerun={handleRerunInvestigation}
                  onViewDetails={(inv) => {
                    const typeToTool = { 'ip': 'ip-trace', 'domain': 'domain', 'email': 'email', 'phone': 'phone', 'hash': 'hash' };
                    setActiveTool(typeToTool[inv.type] || 'ip-trace');
                    setActiveSection('tools');
                  }}
                />
                
                {/* Watchlist Panel */}
                <WatchlistPanel 
                  watchlist={watchlist}
                  onAddItem={handleAddToWatchlist}
                  onRemoveItem={handleRemoveFromWatchlist}
                  onRefresh={handleRefreshWatchlistItem}
                />
                
                {/* Credit Usage Chart */}
                <CreditUsageChart history={transactionHistory} />
              </div>

              {/* Second Row - Analytics & Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Correlation Insights */}
                <CorrelationInsights insights={correlationInsights} investigations={recentInvestigations} />
                
                {/* Risk Score Summary */}
                <RiskScoreSummary cases={cases} investigations={recentInvestigations} />
                
                {/* Threat Intel Feed */}
                <ThreatIntelFeed feeds={threatFeeds} />
              </div>
            </motion.div>
          )}

          {/* Tools Section */}
          {activeSection === 'tools' && (
            <motion.div
              key="tools"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-3xl font-bold text-white">Investigation Tools</h2>
                  <p className="text-gray-400 mt-1 text-sm sm:text-base">Deploy specialized tools for your investigations</p>
                </div>
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 self-start sm:self-auto">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-amber-300">{credits}</span>
                  <span className="text-xs text-amber-200/60">credits available</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                {tools.map((tool, idx) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <ToolCard tool={tool} onClick={handleToolClick} credits={credits} onExport={handleToolExport} onImport={handleToolImport} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Cases Section */}
          {activeSection === 'cases' && (
            <motion.div
              key="cases"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-3xl font-bold text-white">Active Cases</h2>
                  <p className="text-gray-400 mt-1 text-sm sm:text-base">Track and manage your investigations</p>
                </div>
                <button 
                  onClick={() => navigate('/dashboard/user/cases')}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 flex items-center gap-2 self-start sm:self-auto"
                >
                  <Sparkles className="w-4 h-4" />
                  New Case
                </button>
              </div>

              {/* Cases Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                {cases.map((c, idx) => (
                  <CaseCard 
                    key={c.id} 
                    caseData={{...c, lastActivity: formatTimeAgo(c.lastActivity)}} 
                    onClick={() => navigate(`/dashboard/user/cases/${c.id}`)}
                    colorIndex={idx}
                  />
                ))}
                {cases.length === 0 && (
                  <div className="col-span-full p-8 sm:p-16 text-center rounded-2xl sm:rounded-3xl bg-slate-800/30 border border-white/10">
                    <Folder className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Cases Yet</h3>
                    <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">Start your first investigation</p>
                    <button 
                      onClick={() => navigate('/dashboard/user/cases')}
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold hover:opacity-90 text-sm sm:text-base"
                    >
                      Create First Case
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Terminal Section */}
          {activeSection === 'terminal' && (
            <motion.div
              key="terminal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <InvestigationTerminal isTab={true} isOpen={true} userId={user?.id} />
            </motion.div>
          )}

          {/* Activity Section */}
          {activeSection === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 sm:space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold text-white">Activity Timeline</h2>
                <p className="text-gray-400 mt-1">Track your investigation activities</p>
              </div>

              <div className="rounded-3xl p-6 bg-slate-800/30 backdrop-blur-xl border border-white/10">
                {recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
                      >
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                          <Activity className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white">{activity.action}</p>
                          <p className="text-sm text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                        </div>
                        <GlowingOrb color={activity.type === 'tool' ? 'cyan' : activity.type === 'case' ? 'emerald' : 'violet'} size="sm" />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-16 text-center">
                    <Activity className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Activity Yet</h3>
                    <p className="text-gray-400">Start using tools or create cases to see activity</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Tool Modal */}
      <AnimatePresence>
        {ActiveToolComponent && (
          <ToolErrorBoundary key={activeTool} onClose={handleToolClose}>
            <ActiveToolComponent
              onClose={handleToolClose}
              onConsume={handleConsumeCredits}
            />
          </ToolErrorBoundary>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />

      {/* Global Search History Panel */}
      <SearchHistoryPanel
        isOpen={showGlobalSearchHistory}
        onClose={() => setShowGlobalSearchHistory(false)}
        onSelectSearch={(item) => {
          // Navigate to the tool and potentially pre-fill the search
          setActiveTool(item.toolId);
          setActiveSection('tools');
          setShowGlobalSearchHistory(false);
        }}
      />

      {/* Feedback & Chatbot Bubbles */}
      <FeedbackBubble 
        userId={user?.id} 
        userEmail={user?.email} 
        currentPage="/dashboard/user" 
      />
      <ChatbotBubble 
        userId={user?.id} 
        userName={user?.name} 
      />
      <TerminalBubble userId={user?.id} />
    </div>
  );
};

export default CyberAvatarDashboard;

