import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, X, Search, Zap, Camera, Eye, Shield, AlertTriangle,
  CheckCircle, Clock, RefreshCw, Activity, Database, Globe,
  Upload, Image, Scan, UserCheck, Users, Link2, MapPin, Calendar
} from 'lucide-react';
import { Download } from 'lucide-react';
import { useToast } from '../common/Toast';
import { useHistory } from '../../context/HistoryContext';
import useClipboard from '../../context/hooks/useClipboard';
import { trackToolUsage } from '../../utils/analytics';
import { exportToJSON, exportToCSV, formatForExport } from '../../utils/export';

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
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleRefresh = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setResults(null);
    setAnalyzeProgress(0);
    toast.info('Ready for new analysis');
  };

  const handleExportJSON = () => {
    if (!results) { toast.error('No results to export'); return; }
    const ok = exportToJSON(results, `face_recognition_${Date.now()}.json`);
    if (ok) toast.success('Exported JSON'); else toast.error('Export failed');
  };

  const handleExportCSV = () => {
    if (!results) { toast.error('No results to export'); return; }
    const prepared = formatForExport(results, 'csv');
    const ok = exportToCSV(prepared, `face_recognition_${Date.now()}.csv`);
    if (ok) toast.success('Exported CSV'); else toast.error('Export failed');
  };

  // Background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.4 + 0.2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y > canvas.height || p.y < 0) p.speedY *= -1;
        if (p.x > canvas.width || p.x < 0) p.speedX *= -1;
      });
      requestAnimationFrame(animate);
    };
    animate();
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
    onConsume?.(20);

    const progressInterval = setInterval(() => {
      setAnalyzeProgress(prev => Math.min(prev + 2, 95));
    }, 80);

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const formData = new FormData();
      formData.append('image', uploadedImage);

      const response = await fetch(`${API_BASE}/tools/face/analyze`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setAnalyzeProgress(100);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Face analysis failed');
      }

      const resultData = await response.json();
      setResults(resultData);
      addToHistory({
        tool: 'Face Recognition',
        query: uploadedImage.name,
        timestamp: new Date().toISOString(),
        results: resultData,
      });
      trackToolUsage('face-recognition', 'analyze', 'success');
      toast.success('Face analysis completed — real data!');
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Face analysis error:', error);
      toast.error(error.message || 'Analysis failed. Is the backend running?');
      trackToolUsage('face-recognition', 'analyze', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const tabs = [
    { id: 'matches', label: 'Matches', icon: Users },
    { id: 'attributes', label: 'Attributes', icon: User },
    { id: 'social', label: 'Social', icon: Globe },
    { id: 'facesearch', label: 'Face Search', icon: Scan },
    { id: 'biometric', label: 'Biometric', icon: Scan },
    { id: 'risk', label: 'Risk', icon: Shield },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-5xl max-h-[90vh] bg-gradient-to-br from-gray-900 via-purple-950/30 to-gray-900 rounded-2xl border border-purple-500/30 overflow-hidden"
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between gap-2 p-3 sm:p-4 border-b border-purple-500/30 bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
              <Scan className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">Face Recognition</h2>
              <p className="text-xs sm:text-sm text-purple-400/80 truncate hidden sm:block">AI-powered facial analysis & matching</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-purple-200 hidden sm:inline">New Search</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!results}
              onClick={handleExportJSON}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/30 transition-all hidden sm:flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-pink-400" />
              <span className="text-xs text-pink-200">Export JSON</span>
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 hidden sm:flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-amber-300">25</span>
              <span className="text-xs text-amber-200/70">credits</span>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 transition-all"
            >
              <X className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {!results ? (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Upload Section */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                  dragActive
                    ? 'border-purple-500 bg-purple-500/10'
                    : imagePreview
                    ? 'border-purple-500/50 bg-gray-800/50'
                    : 'border-gray-700 bg-gray-800/30 hover:border-purple-500/50'
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
                    <img src={imagePreview} alt="Preview" className="max-h-64 rounded-lg object-contain" />
                    <p className="mt-3 text-sm text-gray-400">{uploadedImage?.name}</p>
                    <p className="text-xs text-gray-600">Click to change image</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                      <Upload className="w-10 h-10 text-purple-400" />
                    </div>
                    <p className="text-lg text-white font-medium">Drop image here or click to upload</p>
                    <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG, WebP (Max 10MB)</p>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <p className="text-amber-400 font-medium">Privacy Notice</p>
                    <ul className="mt-2 text-sm text-amber-300/80 space-y-1">
                      <li>• Face recognition is for authorized investigation purposes only</li>
                      <li>• Results may include publicly available information</li>
                      <li>• AI matching has inherent accuracy limitations</li>
                      <li>• All data is processed securely and not stored</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !uploadedImage}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-lg flex items-center justify-center gap-3 hover:from-purple-400 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
              >
                {isAnalyzing ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Scan className="w-6 h-6" />
                    </motion.div>
                    Analyzing Face... {analyzeProgress}%
                  </>
                ) : (
                  <>
                    <Scan className="w-6 h-6" />
                    Analyze Face
                  </>
                )}
              </button>

              {isAnalyzing && (
                <div className="space-y-3">
                  <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${analyzeProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-purple-400 text-sm">
                    <Eye className="w-4 h-4 animate-pulse" />
                    <span>Processing facial features...</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview & Summary */}
              <div className="flex gap-6">
                <div className="w-48 flex-shrink-0">
                  <img src={imagePreview} alt="Analyzed" className="w-full rounded-xl border border-purple-500/30" />
                  <div className="mt-3 p-3 rounded-lg bg-gray-800/50 border border-purple-500/20">
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Face Detected</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Confidence: {results.biometricData.confidence}%</p>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-3">Analysis Summary</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-gray-800/50 border border-purple-500/20 text-center">
                      <p className="text-2xl font-bold text-purple-400">{results.matches.length}</p>
                      <p className="text-xs text-gray-500">Matches Found</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-800/50 border border-purple-500/20 text-center">
                      <p className="text-2xl font-bold text-purple-400">{results.reverseImageSearch.totalResults}</p>
                      <p className="text-xs text-gray-500">Image Results</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-800/50 border border-purple-500/20 text-center">
                      <p className="text-2xl font-bold text-green-400">{results.biometricData.confidence}%</p>
                      <p className="text-xs text-gray-500">Confidence</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Results Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'matches' && (
                  <motion.div
                    key="matches"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    {results.matches.map((match, i) => (
                      <div key={i} className="p-4 rounded-xl bg-gray-800/50 border border-purple-500/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                              <UserCheck className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{match.name}</p>
                              <p className="text-sm text-gray-500">{match.source} • {match.platform}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${match.confidence > 85 ? 'text-green-400' : match.confidence > 70 ? 'text-amber-400' : 'text-gray-400'}`}>
                              {match.confidence}%
                            </p>
                            <p className="text-xs text-gray-500">confidence</p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-700 flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{match.location}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{match.lastActive}</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'attributes' && (
                  <motion.div
                    key="attributes"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid md:grid-cols-2 gap-4"
                  >
                    <div className="p-4 rounded-xl bg-gray-800/50 border border-purple-500/20">
                      <h3 className="text-sm font-mono text-purple-400 mb-3">DEMOGRAPHICS</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Estimated Age</span>
                          <span className="text-white">{results.faceAttributes.age}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Gender</span>
                          <span className="text-white">{results.faceAttributes.gender}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Emotion</span>
                          <span className="text-white">{results.faceAttributes.emotion}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Skin Tone</span>
                          <span className="text-white">{results.faceAttributes.skinTone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-800/50 border border-purple-500/20">
                      <h3 className="text-sm font-mono text-purple-400 mb-3">FEATURES</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Facial Hair</span>
                          <span className="text-white">{results.faceAttributes.facialHair}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Eyeglasses</span>
                          <span className="text-white">{results.faceAttributes.eyeglasses ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Sunglasses</span>
                          <span className="text-white">{results.faceAttributes.sunglasses ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Face Quality</span>
                          <span className="text-green-400">{(results.faceAttributes.faceQuality * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'social' && (
                  <motion.div
                    key="social"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid md:grid-cols-2 gap-4"
                  >
                    {results.socialProfiles.map((profile, i) => (
                      <div key={i} className="p-4 rounded-xl bg-gray-800/50 border border-purple-500/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${profile.found ? 'bg-green-500/20' : 'bg-gray-700'}`}>
                              <Globe className={`w-5 h-5 ${profile.found ? 'text-green-400' : 'text-gray-500'}`} />
                            </div>
                            <div>
                              <p className="text-white font-medium">{profile.platform}</p>
                              <p className="text-xs text-gray-500">{profile.found ? 'Profile Found' : 'Not Found'}</p>
                            </div>
                          </div>
                          {profile.found && (
                            <span className="text-green-400 font-bold">{profile.confidence}%</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'facesearch' && (
                  <motion.div
                    key="facesearch"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-xl bg-gray-800/50 border border-purple-500/20">
                      <h3 className="text-sm font-mono text-purple-400 mb-3">FACE SEARCH ENGINES</h3>
                      <p className="text-xs text-gray-500 mb-4">Upload this image to these specialized face search engines to find matching faces across the internet.</p>
                      <div className="grid md:grid-cols-2 gap-3">
                        {(results.reverseImageSearch?.services || [])
                          .filter(s => s.category === 'face')
                          .map((service, i) => (
                          <a key={i} href={service.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-start gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all group">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                              <Scan className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-white font-medium text-sm">{service.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{service.description || 'Face search service'}</div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-purple-400 flex-shrink-0 mt-1" />
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-800/50 border border-purple-500/20">
                      <h3 className="text-sm font-mono text-purple-400 mb-3">GENERAL REVERSE IMAGE SEARCH</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {(results.reverseImageSearch?.services || [])
                          .filter(s => s.category === 'general' || !s.category)
                          .map((service, i) => (
                          <a key={i} href={service.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-700/50 border border-gray-600/30 hover:bg-gray-700/70 transition-all group">
                            <Globe className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="text-white text-sm">{service.name}</div>
                              {service.description && <div className="text-xs text-gray-500 mt-0.5">{service.description}</div>}
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>

                    {results.imageAnalysis && (
                      <div className="p-4 rounded-xl bg-gray-800/50 border border-purple-500/20">
                        <h3 className="text-sm font-mono text-purple-400 mb-3">IMAGE HASHES (for search)</h3>
                        <div className="space-y-2">
                          {results.imageAnalysis.imageHash && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-xs">SHA-256</span>
                              <span className="text-purple-300 font-mono text-[10px] truncate max-w-[250px]">{results.imageAnalysis.imageHash}</span>
                            </div>
                          )}
                          {results.imageAnalysis.imageMd5 && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-xs">MD5</span>
                              <span className="text-purple-300 font-mono text-xs">{results.imageAnalysis.imageMd5}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'biometric' && (
                  <motion.div
                    key="biometric"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid md:grid-cols-2 gap-4"
                  >
                    <div className="p-4 rounded-xl bg-gray-800/50 border border-purple-500/20">
                      <h3 className="text-sm font-mono text-purple-400 mb-3">BIOMETRIC DATA</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Face ID</span>
                          <span className="text-purple-400 font-mono">{results.biometricData.faceId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Landmarks</span>
                          <span className="text-white">{results.biometricData.landmarks} points</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Encoding Dimensions</span>
                          <span className="text-white">{results.biometricData.encodingDimensions}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-800/50 border border-purple-500/20">
                      <h3 className="text-sm font-mono text-purple-400 mb-3">REVERSE IMAGE SEARCH</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Results</span>
                          <span className="text-white">{results.reverseImageSearch.totalResults}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Exact Matches</span>
                          <span className="text-green-400">{results.reverseImageSearch.exactMatches}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Similar Images</span>
                          <span className="text-white">{results.reverseImageSearch.similarImages}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'risk' && (
                  <motion.div
                    key="risk"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-gray-800/50 border border-purple-500/20"
                  >
                    <h3 className="text-sm font-mono text-purple-400 mb-3">RISK INDICATORS</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Duplicate Profiles</span>
                          <span className={results.riskIndicators.duplicateProfiles > 0 ? 'text-amber-400' : 'text-green-400'}>
                            {results.riskIndicators.duplicateProfiles}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Inconsistent Info</span>
                          <span className={results.riskIndicators.inconsistentInfo ? 'text-red-400' : 'text-green-400'}>
                            {results.riskIndicators.inconsistentInfo ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">AI Generated</span>
                          <span className={results.riskIndicators.aiGenerated ? 'text-red-400' : 'text-green-400'}>
                            {results.riskIndicators.aiGenerated ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Manipulated</span>
                          <span className={results.riskIndicators.manipulated ? 'text-red-400' : 'text-green-400'}>
                            {results.riskIndicators.manipulated ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Suspicious Activity</span>
                          <span className="text-green-400">{results.riskIndicators.suspiciousActivity}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FaceRecognitionTool;
