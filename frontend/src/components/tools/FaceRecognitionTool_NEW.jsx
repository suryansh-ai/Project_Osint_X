import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  User, X, Search, Zap, Camera, Eye, Shield, AlertTriangle,
  CheckCircle, Clock, RefreshCw, Activity, Database, Globe,
  Upload, Image, Scan, UserCheck, Users, Link2, MapPin, Calendar,
  XCircle, Target, Crosshair, Cpu, Binary, Fingerprint, Focus,
  ScanLine, CircleSlash, Network, Aperture, Radio, Radar, Brain,
  AlertCircle, FileWarning, ExternalLink
} from 'lucide-react';
import { Download } from 'lucide-react';
import { useToast } from '../common/Toast';
import { useHistory } from '../../context/HistoryContext';
import useClipboard from '../../context/hooks/useClipboard';
import { trackToolUsage } from '../../utils/analytics';
import { exportToJSON, exportToCSV, formatForExport } from '../../utils/export';

// ═══════════════════════════════════════════════════════════════════════════════
// BIOMETRIC SCANNER - Circular scanning animation with face detection effect
// ═══════════════════════════════════════════════════════════════════════════════
const BiometricScanner = ({ isScanning, progress, onComplete }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let scanAngle = 0;
    let pulseRadius = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(centerX, centerY) - 10;
      
      // Draw concentric rings
      for (let i = 1; i <= 5; i++) {
        const radius = (maxRadius / 5) * i;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168, 85, 247, ${0.1 + i * 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // Draw crosshairs
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - maxRadius, centerY);
      ctx.lineTo(centerX + maxRadius, centerY);
      ctx.moveTo(centerX, centerY - maxRadius);
      ctx.lineTo(centerX, centerY + maxRadius);
      ctx.stroke();
      
      // Draw diagonal lines
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI / 4) * i;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * maxRadius,
          centerY + Math.sin(angle) * maxRadius
        );
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
        ctx.stroke();
      }
      
      if (isScanning) {
        // Scanning beam
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, maxRadius, scanAngle, scanAngle + Math.PI / 6);
        ctx.closePath();
        
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0.5)');
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Pulse effect
        if (pulseRadius < maxRadius) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(236, 72, 153, ${1 - pulseRadius / maxRadius})`;
          ctx.lineWidth = 2;
          ctx.stroke();
          pulseRadius += 2;
        } else {
          pulseRadius = 0;
        }
        
        scanAngle += 0.05;
      }
      
      // Center target
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fillStyle = isScanning ? '#a855f7' : '#6b7280';
      ctx.fill();
      
      // Corner brackets
      const bracketSize = 20;
      const bracketOffset = maxRadius - 15;
      ctx.strokeStyle = isScanning ? '#ec4899' : '#6b7280';
      ctx.lineWidth = 2;
      
      // Top-left
      ctx.beginPath();
      ctx.moveTo(centerX - bracketOffset, centerY - bracketOffset + bracketSize);
      ctx.lineTo(centerX - bracketOffset, centerY - bracketOffset);
      ctx.lineTo(centerX - bracketOffset + bracketSize, centerY - bracketOffset);
      ctx.stroke();
      
      // Top-right
      ctx.beginPath();
      ctx.moveTo(centerX + bracketOffset - bracketSize, centerY - bracketOffset);
      ctx.lineTo(centerX + bracketOffset, centerY - bracketOffset);
      ctx.lineTo(centerX + bracketOffset, centerY - bracketOffset + bracketSize);
      ctx.stroke();
      
      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(centerX - bracketOffset, centerY + bracketOffset - bracketSize);
      ctx.lineTo(centerX - bracketOffset, centerY + bracketOffset);
      ctx.lineTo(centerX - bracketOffset + bracketSize, centerY + bracketOffset);
      ctx.stroke();
      
      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(centerX + bracketOffset - bracketSize, centerY + bracketOffset);
      ctx.lineTo(centerX + bracketOffset, centerY + bracketOffset);
      ctx.lineTo(centerX + bracketOffset, centerY + bracketOffset - bracketSize);
      ctx.stroke();
      
      animationId = requestAnimationFrame(animate);
    };
    
    canvas.width = 220;
    canvas.height = 220;
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, [isScanning]);
  
  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-[220px] h-[220px]" />
      {isScanning && (
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <span className="text-xs text-purple-400 font-mono animate-pulse">
            SCANNING... {progress}%
          </span>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// FACE MESH VISUALIZATION - 3D-like face mesh with landmark points
// ═══════════════════════════════════════════════════════════════════════════════
const FaceMeshVisualization = ({ isActive, landmarks = 68 }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;
    
    // Generate face mesh points in a face-like pattern
    const generateFacePoints = () => {
      const points = [];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Face outline (oval)
      for (let i = 0; i < 17; i++) {
        const angle = Math.PI + (Math.PI * i / 16);
        const rx = 60;
        const ry = 75;
        points.push({
          x: centerX + Math.cos(angle) * rx,
          y: centerY + Math.sin(angle) * ry * 0.9 + 10,
          type: 'outline'
        });
      }
      
      // Left eyebrow
      for (let i = 0; i < 5; i++) {
        points.push({
          x: centerX - 35 + i * 10,
          y: centerY - 30 + Math.sin(i * 0.5) * 3,
          type: 'eyebrow'
        });
      }
      
      // Right eyebrow
      for (let i = 0; i < 5; i++) {
        points.push({
          x: centerX + 15 + i * 10,
          y: centerY - 30 + Math.sin(i * 0.5) * 3,
          type: 'eyebrow'
        });
      }
      
      // Left eye
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 / 6) * i;
        points.push({
          x: centerX - 25 + Math.cos(angle) * 12,
          y: centerY - 10 + Math.sin(angle) * 6,
          type: 'eye'
        });
      }
      
      // Right eye
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 / 6) * i;
        points.push({
          x: centerX + 25 + Math.cos(angle) * 12,
          y: centerY - 10 + Math.sin(angle) * 6,
          type: 'eye'
        });
      }
      
      // Nose
      for (let i = 0; i < 9; i++) {
        points.push({
          x: centerX + (i < 4 ? 0 : (i - 6) * 5),
          y: centerY + i * 5 - 5,
          type: 'nose'
        });
      }
      
      // Mouth
      for (let i = 0; i < 12; i++) {
        const angle = Math.PI + (Math.PI * i / 11);
        points.push({
          x: centerX + Math.cos(angle) * 25,
          y: centerY + 45 + Math.sin(angle) * 8,
          type: 'mouth'
        });
      }
      
      return points;
    };
    
    const facePoints = generateFacePoints();
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections between nearby points
      facePoints.forEach((point, i) => {
        facePoints.slice(i + 1).forEach(other => {
          const dx = other.x - point.x;
          const dy = other.y - point.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 30 && point.type === other.type) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = isActive 
              ? `rgba(168, 85, 247, ${0.3 + Math.sin(time + i) * 0.1})`
              : 'rgba(100, 100, 100, 0.2)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });
      
      // Draw points
      facePoints.forEach((point, i) => {
        const pulse = isActive ? Math.sin(time * 2 + i * 0.5) * 0.5 + 1 : 1;
        const size = 2 * pulse;
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        
        const colors = {
          outline: '#a855f7',
          eyebrow: '#ec4899',
          eye: '#06b6d4',
          nose: '#f59e0b',
          mouth: '#ef4444'
        };
        
        ctx.fillStyle = isActive ? colors[point.type] : '#6b7280';
        ctx.fill();
        
        // Glow effect
        if (isActive) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, size + 3, 0, Math.PI * 2);
          ctx.fillStyle = `${colors[point.type]}30`;
          ctx.fill();
        }
      });
      
      time += 0.05;
      animationId = requestAnimationFrame(animate);
    };
    
    canvas.width = 180;
    canvas.height = 200;
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, [isActive, landmarks]);
  
  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-[180px] h-[200px]" />
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <span className="text-[10px] text-purple-400/70">{landmarks} LANDMARKS</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIDENCE METER - Semicircular gauge with animated fill
// ═══════════════════════════════════════════════════════════════════════════════
const ConfidenceMeter = ({ value, label = "Match Confidence", size = 160 }) => {
  const radius = (size / 2) - 20;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  const getColor = (val) => {
    if (val >= 85) return { stroke: '#10b981', text: 'text-emerald-400', label: 'High' };
    if (val >= 70) return { stroke: '#f59e0b', text: 'text-amber-400', label: 'Medium' };
    return { stroke: '#ef4444', text: 'text-red-400', label: 'Low' };
  };
  
  const colors = getColor(value);
  
  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size / 2 + 20} className="overflow-visible">
        {/* Background arc */}
        <path
          d={`M ${20} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 20} ${size / 2}`}
          fill="none"
          stroke="#1e293b"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <motion.path
          d={`M ${20} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 20} ${size / 2}`}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${colors.stroke}60)` }}
        />
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick, i) => {
          const angle = Math.PI - (tick / 100) * Math.PI;
          const x1 = size / 2 + Math.cos(angle) * (radius - 18);
          const y1 = size / 2 + Math.sin(angle) * (radius - 18);
          const x2 = size / 2 + Math.cos(angle) * (radius + 5);
          const y2 = size / 2 + Math.sin(angle) * (radius + 5);
          return (
            <g key={tick}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#475569" strokeWidth="2" />
              <text
                x={size / 2 + Math.cos(angle) * (radius + 18)}
                y={size / 2 + Math.sin(angle) * (radius + 18)}
                fill="#64748b"
                fontSize="10"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {tick}
              </text>
            </g>
          );
        })}
      </svg>
      
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <motion.div
          className={`text-3xl font-bold ${colors.text}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {value}%
        </motion.div>
        <div className="text-xs text-slate-500">{label}</div>
        <div className={`text-xs ${colors.text} mt-1`}>{colors.label} Confidence</div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// IDENTITY NETWORK - Shows connections between found profiles
// ═══════════════════════════════════════════════════════════════════════════════
const IdentityNetwork = ({ matches, socialProfiles }) => {
  const canvasRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Create nodes from data
    const nodes = [
      { x: centerX, y: centerY, label: 'Subject', type: 'center', size: 20 },
      ...matches.slice(0, 3).map((m, i) => ({
        x: centerX + Math.cos(Math.PI * 2 / 3 * i - Math.PI / 2) * 70,
        y: centerY + Math.sin(Math.PI * 2 / 3 * i - Math.PI / 2) * 70,
        label: m.platform,
        confidence: m.confidence,
        type: 'match',
        size: 12
      })),
      ...socialProfiles.filter(s => s.found).slice(0, 4).map((s, i) => ({
        x: centerX + Math.cos(Math.PI * 2 / 4 * i) * 120,
        y: centerY + Math.sin(Math.PI * 2 / 4 * i) * 120,
        label: s.platform,
        confidence: s.confidence,
        type: 'social',
        size: 10
      }))
    ];
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      nodes.slice(1).forEach((node, i) => {
        const pulse = Math.sin(time * 2 + i) * 0.3 + 0.7;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = node.type === 'match' 
          ? `rgba(168, 85, 247, ${0.3 * pulse})`
          : `rgba(6, 182, 212, ${0.3 * pulse})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Animated particle along connection
        const particlePos = (time * 0.3 + i * 0.3) % 1;
        const px = centerX + (node.x - centerX) * particlePos;
        const py = centerY + (node.y - centerY) * particlePos;
        
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = node.type === 'match' ? '#a855f7' : '#06b6d4';
        ctx.fill();
      });
      
      // Draw nodes
      nodes.forEach(node => {
        // Glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + 5, 0, Math.PI * 2);
        const glowColor = node.type === 'center' ? '#ec4899' : 
                         node.type === 'match' ? '#a855f7' : '#06b6d4';
        ctx.fillStyle = `${glowColor}30`;
        ctx.fill();
        
        // Node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = node.type === 'center' ? '#ec4899' : 
                       node.type === 'match' ? '#a855f7' : '#06b6d4';
        ctx.fill();
        
        // Inner circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();
      });
      
      time += 0.02;
      animationId = requestAnimationFrame(animate);
    };
    
    canvas.width = 280;
    canvas.height = 280;
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, [matches, socialProfiles]);
  
  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-[280px] h-[280px]" />
      <div className="absolute top-2 left-2 text-[10px] text-purple-400/70 font-mono">
        IDENTITY NETWORK
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEEPFAKE DETECTOR - AI authenticity visualization
// ═══════════════════════════════════════════════════════════════════════════════
const DeepfakeDetector = ({ aiGenerated, manipulated }) => {
  const isAuthentic = !aiGenerated && !manipulated;
  
  return (
    <div className="p-4 rounded-xl bg-slate-900/50 border border-purple-500/20">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="w-5 h-5 text-purple-400" />
        <span className="text-sm font-semibold text-white">AI Authenticity Check</span>
      </div>
      
      <div className="flex items-center justify-center mb-4">
        <motion.div
          className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${
            isAuthentic 
              ? 'border-emerald-500 bg-emerald-500/10' 
              : 'border-red-500 bg-red-500/10'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          {isAuthentic ? (
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          ) : (
            <AlertCircle className="w-12 h-12 text-red-400" />
          )}
        </motion.div>
      </div>
      
      <div className="text-center mb-4">
        <div className={`text-lg font-bold ${isAuthentic ? 'text-emerald-400' : 'text-red-400'}`}>
          {isAuthentic ? 'AUTHENTIC' : 'SUSPICIOUS'}
        </div>
        <div className="text-xs text-slate-500">
          {isAuthentic ? 'No AI manipulation detected' : 'Potential manipulation detected'}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50">
          <span className="text-xs text-slate-400">AI Generated</span>
          <span className={`text-xs font-medium ${aiGenerated ? 'text-red-400' : 'text-emerald-400'}`}>
            {aiGenerated ? 'Detected' : 'No'}
          </span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50">
          <span className="text-xs text-slate-400">Image Manipulation</span>
          <span className={`text-xs font-medium ${manipulated ? 'text-red-400' : 'text-emerald-400'}`}>
            {manipulated ? 'Detected' : 'No'}
          </span>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// REVERSE SEARCH RADAR - Shows search engines coverage
// ═══════════════════════════════════════════════════════════════════════════════
const ReverseSearchRadar = ({ searchData }) => {
  const engines = searchData?.sources || ['Google', 'Bing', 'Yandex', 'TinEye'];
  
  return (
    <div className="p-4 rounded-xl bg-slate-900/50 border border-purple-500/20">
      <div className="flex items-center gap-2 mb-4">
        <Radar className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-semibold text-white">Reverse Image Search</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        {engines.map((engine, i) => (
          <motion.div
            key={engine}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-300">{engine}</span>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <div className="text-lg font-bold text-purple-400">{searchData?.totalResults || 0}</div>
          <div className="text-[10px] text-slate-500">Total</div>
        </div>
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-lg font-bold text-emerald-400">{searchData?.exactMatches || 0}</div>
          <div className="text-[10px] text-slate-500">Exact</div>
        </div>
        <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
          <div className="text-lg font-bold text-cyan-400">{searchData?.similarImages || 0}</div>
          <div className="text-[10px] text-slate-500">Similar</div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// FACE ATTRIBUTE BARS - Horizontal animated attribute indicators
// ═══════════════════════════════════════════════════════════════════════════════
const AttributeBar = ({ label, value, icon: Icon, color = 'purple' }) => {
  const colors = {
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
    cyan: 'from-cyan-500 to-cyan-600',
    amber: 'from-amber-500 to-amber-600',
    emerald: 'from-emerald-500 to-emerald-600'
  };
  
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
        <Icon className={`w-4 h-4 text-${color}-400`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">{label}</span>
          <span className="text-white font-medium">{value}</span>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MATCH CARD - Individual match result display
// ═══════════════════════════════════════════════════════════════════════════════
const MatchCard = ({ match, index }) => {
  const confidenceColor = match.confidence >= 85 ? 'emerald' : match.confidence >= 70 ? 'amber' : 'red';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 rounded-xl bg-gradient-to-r from-slate-900/80 to-slate-800/50 border border-purple-500/20 hover:border-purple-500/40 transition-all group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
            <UserCheck className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <div className="text-white font-medium">{match.name}</div>
            <div className="text-xs text-slate-500">{match.source}</div>
            <div className="text-xs text-purple-400">{match.platform}</div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold text-${confidenceColor}-400`}>
            {match.confidence}%
          </div>
          <div className="text-[10px] text-slate-500">confidence</div>
          
          {/* Confidence bar */}
          <div className="w-20 h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-${confidenceColor}-500`}
              initial={{ width: 0 }}
              animate={{ width: `${match.confidence}%` }}
              transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {match.location}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {match.lastActive}
        </span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="ml-auto flex items-center gap-1 text-purple-400 hover:text-purple-300"
        >
          <ExternalLink className="w-3 h-3" />
          View
        </motion.button>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN FACE RECOGNITION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const FaceRecognitionTool = ({ onClose, onConsume }) => {
  const toast = useToast();
  const { addToHistory } = useHistory();
  const { copy } = useClipboard();
  
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('matches');
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleRefresh = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setResults(null);
    setAnalyzeProgress(0);
    setScanPhase('');
    toast.info('Ready for new analysis');
  };

  const handleExportJSON = () => {
    if (!results) { toast.error('No results to export'); return; }
    const ok = exportToJSON(results, `face_recognition_${Date.now()}.json`);
    if (ok) toast.success('Exported JSON'); else toast.error('Export failed');
  };

  // Neural network background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const nodes = [];
    const nodeCount = 30;
    
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }
    
    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.06)';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x < 0 || node.x > canvas.offsetWidth) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.offsetHeight) node.vy *= -1;
        
        nodes.slice(i + 1).forEach(other => {
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${(1 - dist / 100) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    setUploadedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }

    trackToolUsage('face-recognition', 'analyze', 'start');
    setIsAnalyzing(true);
    setAnalyzeProgress(0);
    setResults(null);
    onConsume?.(20);

    const phases = [
      'Detecting face...',
      'Extracting landmarks...',
      'Generating biometric hash...',
      'Searching databases...',
      'Cross-referencing profiles...',
      'Analyzing authenticity...',
      'Compiling results...'
    ];

    for (let i = 0; i < phases.length; i++) {
      setScanPhase(phases[i]);
      await new Promise(resolve => setTimeout(resolve, 500));
      setAnalyzeProgress(((i + 1) / phases.length) * 100);
    }

    const resultData = {
      faceDetected: true,
      facesCount: 1,
      imageQuality: 'High',
      faceAttributes: {
        age: '28-32',
        gender: 'Male',
        emotion: 'Neutral',
        skinTone: 'Medium',
        facialHair: 'Clean Shaven',
        eyeglasses: false,
        sunglasses: false,
        headPose: { pitch: 2.5, roll: -1.2, yaw: 3.8 },
        faceQuality: 0.92,
      },
      biometricData: {
        faceId: 'FR-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        confidence: 94.7,
        landmarks: 68,
        encodingDimensions: 128,
      },
      matches: [
        {
          source: 'Social Media Database',
          confidence: 92.5,
          name: 'REDACTED',
          platform: 'LinkedIn',
          profileUrl: '#',
          location: 'Mumbai, India',
          lastActive: '2024-01-08',
        },
        {
          source: 'Public Records',
          confidence: 88.3,
          name: 'REDACTED',
          platform: 'Government Portal',
          profileUrl: '#',
          location: 'Maharashtra',
          lastActive: '2023-12-15',
        },
        {
          source: 'Image Search',
          confidence: 76.8,
          name: 'Unknown',
          platform: 'News Article',
          profileUrl: '#',
          location: 'Unknown',
          lastActive: '2023-11-20',
        },
      ],
      socialProfiles: [
        { platform: 'Facebook', found: true, confidence: 85, url: '#' },
        { platform: 'Instagram', found: true, confidence: 78, url: '#' },
        { platform: 'LinkedIn', found: true, confidence: 92, url: '#' },
        { platform: 'Twitter/X', found: false, confidence: 0, url: null },
        { platform: 'TikTok', found: false, confidence: 0, url: null },
        { platform: 'GitHub', found: true, confidence: 65, url: '#' },
      ],
      reverseImageSearch: {
        totalResults: 47,
        exactMatches: 3,
        similarImages: 44,
        sources: ['Google Images', 'Bing', 'Yandex', 'TinEye'],
      },
      riskIndicators: {
        duplicateProfiles: 2,
        inconsistentInfo: false,
        aiGenerated: false,
        manipulated: false,
        suspiciousActivity: 'None',
      },
      metadata: {
        analysisTime: '3.2s',
        modelVersion: 'FaceNet v2.1',
        accuracy: 'High',
        timestamp: new Date().toISOString(),
      },
    };

    setResults(resultData);
    addToHistory({
      tool: 'Face Recognition',
      query: uploadedImage.name,
      timestamp: new Date().toISOString(),
      results: resultData,
    });
    setIsAnalyzing(false);
    toast.success('Face analysis completed');
  };

  const tabs = [
    { id: 'matches', label: 'Matches', icon: Users },
    { id: 'biometric', label: 'Biometric', icon: Fingerprint },
    { id: 'social', label: 'Social', icon: Globe },
    { id: 'risk', label: 'Risk Analysis', icon: Shield },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 border border-purple-500/30 shadow-2xl shadow-purple-500/10"
      >
        {/* Background */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-500/8 rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="relative px-4 sm:px-6 py-4 sm:py-5 border-b border-purple-500/20 bg-slate-950/60 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <motion.div
                className="relative flex-shrink-0"
                animate={{ rotateY: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
                >
                  <Scan className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <motion.div
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-purple-400 flex items-center justify-center border-2 border-slate-950"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Eye className="w-3 h-3 text-slate-900" />
                </motion.div>
              </motion.div>
              
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 flex-wrap">
                  <span>Face Recognition</span>
                  <span className="px-2 py-0.5 text-[10px] sm:text-xs bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">AI</span>
                </h2>
                <p className="text-xs sm:text-sm text-purple-300/70 flex items-center gap-1.5 mt-0.5">
                  <Fingerprint className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">Biometric analysis & identity matching</span>
                </p>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="p-2 rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 transition-all"
                title="New Analysis"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                disabled={!results}
                onClick={handleExportJSON}
                className="hidden sm:flex p-2 rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 transition-all disabled:opacity-40"
                title="Export JSON"
              >
                <Download className="w-5 h-5 text-purple-400" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 transition-all"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-100px)] custom-scrollbar">
          {!results ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Upload section with scanner */}
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                {/* Scanner visualization */}
                <div className="flex-shrink-0">
                  <BiometricScanner 
                    isScanning={isAnalyzing} 
                    progress={Math.round(analyzeProgress)} 
                  />
                </div>
                
                {/* Upload area */}
                <div className="flex-1 w-full">
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                      dragActive
                        ? 'border-purple-500 bg-purple-500/10'
                        : imagePreview
                        ? 'border-purple-500/50 bg-slate-900/50'
                        : 'border-slate-700 bg-slate-900/30 hover:border-purple-500/50 hover:bg-slate-900/50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                      className="hidden"
                    />
                    
                    {imagePreview ? (
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="max-h-48 rounded-lg object-contain border border-purple-500/30" 
                          />
                          {/* Scanning overlay */}
                          {isAnalyzing && (
                            <motion.div
                              className="absolute inset-0 rounded-lg overflow-hidden"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <motion.div
                                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                                animate={{ top: ['0%', '100%', '0%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                              />
                            </motion.div>
                          )}
                        </div>
                        <p className="mt-3 text-sm text-slate-400">{uploadedImage?.name}</p>
                        <p className="text-xs text-slate-600">Click to change image</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-6">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4">
                          <Upload className="w-8 h-8 text-purple-400" />
                        </div>
                        <p className="text-lg text-white font-medium">Drop image or click to upload</p>
                        <p className="text-sm text-slate-500 mt-1">JPG, PNG, WebP (Max 10MB)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Scan progress */}
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-purple-400 font-medium">{scanPhase}</span>
                      <span className="text-slate-400">{Math.round(analyzeProgress)}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #a855f7, #ec4899)' }}
                        animate={{ width: `${analyzeProgress}%` }}
                      />
                    </div>
                    
                    {/* Phase indicators */}
                    <div className="flex justify-between">
                      {['Detect', 'Extract', 'Hash', 'Search', 'Cross-ref', 'Auth', 'Done'].map((phase, i) => (
                        <div key={phase} className="flex flex-col items-center">
                          <div className={`w-2 h-2 rounded-full transition-colors ${
                            analyzeProgress >= ((i + 1) / 7) * 100 ? 'bg-purple-400' : 'bg-slate-700'
                          }`} />
                          <span className="text-[8px] text-slate-500 mt-1 hidden sm:block">{phase}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Privacy notice */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-amber-400 font-medium text-sm">Privacy & Ethics Notice</p>
                    <ul className="mt-2 text-xs text-amber-300/80 space-y-1">
                      <li>• Face recognition for authorized investigation only</li>
                      <li>• AI matching has accuracy limitations</li>
                      <li>• Data processed securely, not stored</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Analyze button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                disabled={isAnalyzing || !uploadedImage}
                className="w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
                style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
              >
                {isAnalyzing ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Scan className="w-6 h-6" />
                    </motion.div>
                    Analyzing Face...
                  </>
                ) : (
                  <>
                    <Scan className="w-6 h-6" />
                    Analyze Face
                  </>
                )}
              </motion.button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Results header */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Image and face mesh */}
                <div className="flex gap-4 items-start">
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Analyzed" 
                      className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl border-2 border-purple-500/30" 
                    />
                    <motion.div
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.3 }}
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  
                  <div className="hidden xl:block">
                    <FaceMeshVisualization isActive={true} landmarks={results.biometricData.landmarks} />
                  </div>
                </div>
                
                {/* Summary stats */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    Analysis Summary
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-purple-500/20 text-center">
                      <div className="text-2xl font-bold text-purple-400">{results.matches.length}</div>
                      <div className="text-[10px] text-slate-500">Matches</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-purple-500/20 text-center">
                      <div className="text-2xl font-bold text-emerald-400">{results.biometricData.confidence}%</div>
                      <div className="text-[10px] text-slate-500">Confidence</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-purple-500/20 text-center">
                      <div className="text-2xl font-bold text-cyan-400">{results.reverseImageSearch.totalResults}</div>
                      <div className="text-[10px] text-slate-500">Images</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-purple-500/20 text-center">
                      <div className="text-2xl font-bold text-pink-400">{results.biometricData.landmarks}</div>
                      <div className="text-[10px] text-slate-500">Landmarks</div>
                    </div>
                  </div>
                  
                  {/* Biometric ID */}
                  <div className="mt-3 p-3 rounded-lg bg-slate-800/50 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500">Biometric ID</div>
                      <div className="text-sm font-mono text-purple-400">{results.biometricData.faceId}</div>
                    </div>
                    <button
                      onClick={() => { copy(results.biometricData.faceId); toast.success('Copied!'); }}
                      className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
                    >
                      <Fingerprint className="w-4 h-4 text-purple-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map(tab => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium whitespace-nowrap transition-all text-sm ${
                      activeTab === tab.id
                        ? 'text-white shadow-lg shadow-purple-500/30'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-purple-500/20'
                    }`}
                    style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #a855f7, #ec4899)' } : {}}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Matches tab */}
                  {activeTab === 'matches' && (
                    <div className="grid lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-3">
                        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-400" />
                          Identity Matches
                        </h4>
                        {results.matches.map((match, i) => (
                          <MatchCard key={i} match={match} index={i} />
                        ))}
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <ConfidenceMeter value={results.biometricData.confidence} label="Overall Confidence" />
                        </div>
                        <IdentityNetwork matches={results.matches} socialProfiles={results.socialProfiles} />
                      </div>
                    </div>
                  )}

                  {/* Biometric tab */}
                  {activeTab === 'biometric' && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-slate-900/50 border border-purple-500/20">
                          <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <User className="w-4 h-4 text-purple-400" />
                            Face Attributes
                          </h4>
                          <div className="space-y-3">
                            <AttributeBar label="Age Range" value={results.faceAttributes.age} icon={Calendar} color="purple" />
                            <AttributeBar label="Gender" value={results.faceAttributes.gender} icon={User} color="pink" />
                            <AttributeBar label="Emotion" value={results.faceAttributes.emotion} icon={Activity} color="cyan" />
                            <AttributeBar label="Skin Tone" value={results.faceAttributes.skinTone} icon={Eye} color="amber" />
                            <AttributeBar label="Facial Hair" value={results.faceAttributes.facialHair} icon={User} color="emerald" />
                          </div>
                        </div>
                        
                        <div className="p-4 rounded-xl bg-slate-900/50 border border-purple-500/20">
                          <h4 className="text-sm font-semibold text-white mb-4">Accessories</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className={`p-3 rounded-lg ${results.faceAttributes.eyeglasses ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-slate-800/50'}`}>
                              <div className="text-xs text-slate-400">Eyeglasses</div>
                              <div className={`text-sm font-medium ${results.faceAttributes.eyeglasses ? 'text-purple-400' : 'text-slate-500'}`}>
                                {results.faceAttributes.eyeglasses ? 'Yes' : 'No'}
                              </div>
                            </div>
                            <div className={`p-3 rounded-lg ${results.faceAttributes.sunglasses ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-slate-800/50'}`}>
                              <div className="text-xs text-slate-400">Sunglasses</div>
                              <div className={`text-sm font-medium ${results.faceAttributes.sunglasses ? 'text-purple-400' : 'text-slate-500'}`}>
                                {results.faceAttributes.sunglasses ? 'Yes' : 'No'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-slate-900/50 border border-purple-500/20">
                          <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-purple-400" />
                            Biometric Data
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between p-2 rounded-lg bg-slate-800/50">
                              <span className="text-xs text-slate-400">Face ID</span>
                              <span className="text-xs font-mono text-purple-400">{results.biometricData.faceId}</span>
                            </div>
                            <div className="flex justify-between p-2 rounded-lg bg-slate-800/50">
                              <span className="text-xs text-slate-400">Landmarks</span>
                              <span className="text-xs text-white">{results.biometricData.landmarks} points</span>
                            </div>
                            <div className="flex justify-between p-2 rounded-lg bg-slate-800/50">
                              <span className="text-xs text-slate-400">Encoding</span>
                              <span className="text-xs text-white">{results.biometricData.encodingDimensions}D vector</span>
                            </div>
                            <div className="flex justify-between p-2 rounded-lg bg-slate-800/50">
                              <span className="text-xs text-slate-400">Face Quality</span>
                              <span className="text-xs text-emerald-400">{(results.faceAttributes.faceQuality * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <ReverseSearchRadar searchData={results.reverseImageSearch} />
                      </div>
                    </div>
                  )}

                  {/* Social tab */}
                  {activeTab === 'social' && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.socialProfiles.map((profile, i) => (
                        <motion.div
                          key={profile.platform}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`p-4 rounded-xl border transition-all ${
                            profile.found 
                              ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-400/50' 
                              : 'bg-slate-900/50 border-slate-700/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                profile.found ? 'bg-emerald-500/20' : 'bg-slate-800'
                              }`}>
                                <Globe className={`w-5 h-5 ${profile.found ? 'text-emerald-400' : 'text-slate-500'}`} />
                              </div>
                              <div>
                                <div className={`font-medium ${profile.found ? 'text-white' : 'text-slate-500'}`}>
                                  {profile.platform}
                                </div>
                                <div className={`text-xs ${profile.found ? 'text-emerald-400' : 'text-slate-600'}`}>
                                  {profile.found ? 'Profile Found' : 'Not Found'}
                                </div>
                              </div>
                            </div>
                            {profile.found && (
                              <div className="text-right">
                                <div className="text-lg font-bold text-emerald-400">{profile.confidence}%</div>
                                <div className="text-[10px] text-slate-500">match</div>
                              </div>
                            )}
                          </div>
                          
                          {profile.found && (
                            <div className="mt-3 pt-3 border-t border-emerald-500/20">
                              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-emerald-500 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${profile.confidence}%` }}
                                  transition={{ duration: 1, delay: i * 0.1 }}
                                />
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Risk tab */}
                  {activeTab === 'risk' && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <DeepfakeDetector 
                        aiGenerated={results.riskIndicators.aiGenerated}
                        manipulated={results.riskIndicators.manipulated}
                      />
                      
                      <div className="p-4 rounded-xl bg-slate-900/50 border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-4">
                          <Shield className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-semibold text-white">Risk Indicators</span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className={`p-3 rounded-lg flex items-center justify-between ${
                            results.riskIndicators.duplicateProfiles > 0 
                              ? 'bg-amber-500/10 border border-amber-500/30' 
                              : 'bg-slate-800/50'
                          }`}>
                            <span className="text-xs text-slate-400">Duplicate Profiles</span>
                            <span className={`text-sm font-medium ${
                              results.riskIndicators.duplicateProfiles > 0 ? 'text-amber-400' : 'text-emerald-400'
                            }`}>
                              {results.riskIndicators.duplicateProfiles}
                            </span>
                          </div>
                          
                          <div className={`p-3 rounded-lg flex items-center justify-between ${
                            results.riskIndicators.inconsistentInfo 
                              ? 'bg-red-500/10 border border-red-500/30' 
                              : 'bg-slate-800/50'
                          }`}>
                            <span className="text-xs text-slate-400">Inconsistent Info</span>
                            <span className={`text-sm font-medium ${
                              results.riskIndicators.inconsistentInfo ? 'text-red-400' : 'text-emerald-400'
                            }`}>
                              {results.riskIndicators.inconsistentInfo ? 'Yes' : 'No'}
                            </span>
                          </div>
                          
                          <div className="p-3 rounded-lg flex items-center justify-between bg-slate-800/50">
                            <span className="text-xs text-slate-400">Suspicious Activity</span>
                            <span className="text-sm font-medium text-emerald-400">
                              {results.riskIndicators.suspiciousActivity}
                            </span>
                          </div>
                        </div>
                        
                        {/* Metadata */}
                        <div className="mt-4 pt-4 border-t border-slate-700/50">
                          <div className="text-[10px] text-slate-500 mb-2">Analysis Metadata</div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-slate-400">Model: <span className="text-purple-400">{results.metadata.modelVersion}</span></div>
                            <div className="text-slate-400">Time: <span className="text-white">{results.metadata.analysisTime}</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* Scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.5);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  );
};

export default FaceRecognitionTool;
