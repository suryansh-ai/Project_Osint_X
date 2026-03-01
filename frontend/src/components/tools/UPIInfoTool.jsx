import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, X, Search, Zap, User, Shield, AlertTriangle,
  CheckCircle, Clock, RefreshCw, Activity, Database, IndianRupee,
  Building, CreditCard, ArrowUpDown, Calendar, Phone, Mail
} from 'lucide-react';
import { Download } from 'lucide-react';
import { useToast } from '../common/Toast';
import { useHistory } from '../../context/HistoryContext';
import useClipboard from '../../context/hooks/useClipboard';
import { trackToolUsage } from '../../utils/analytics';
import { exportToJSON, exportToCSV, formatForExport } from '../../utils/export';

const UPIInfoTool = ({ onClose, onConsume }) => {
  const toast = useToast();
  const { addToHistory } = useHistory();
  const { copy } = useClipboard();
  
  const [upiId, setUpiId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('account');
  const [searchProgress, setSearchProgress] = useState(0);
  const canvasRef = useRef(null);

  const handleRefresh = () => {
    setUpiId('');
    setResults(null);
    setSearchProgress(0);
    toast.info('Ready for new search');
  };

  const handleExportJSON = () => {
    if (!results) { toast.error('No results to export'); return; }
    const ok = exportToJSON(results, `upi_info_${Date.now()}.json`);
    if (ok) toast.success('Exported JSON'); else toast.error('Export failed');
  };

  const handleExportCSV = () => {
    if (!results) { toast.error('No results to export'); return; }
    const prepared = formatForExport(results, 'csv');
    const ok = exportToCSV(prepared, `upi_info_${Date.now()}.csv`);
    if (ok) toast.success('Exported CSV'); else toast.error('Export failed');
  };

  // Background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`;
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

  const handleSearch = async () => {
    if (!upiId.trim()) {
      toast.error('Please enter a UPI ID');
      return;
    }

    if (!upiId.includes('@')) {
      toast.error('Invalid UPI ID format. Must contain @');
      return;
    }

    trackToolUsage('upi-info', 'search', 'start');
    setIsSearching(true);
    setSearchProgress(0);
    onConsume?.(10);

    const progressInterval = setInterval(() => {
      setSearchProgress(prev => Math.min(prev + 3, 95));
    }, 80);

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE}/tools/upi/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upiId: upiId.trim().toLowerCase() }),
      });

      clearInterval(progressInterval);
      setSearchProgress(100);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'UPI lookup failed');
      }

      const resultData = await response.json();
      setResults(resultData);
      addToHistory({
        tool: 'UPI Info',
        query: upiId,
        timestamp: new Date().toISOString(),
        results: resultData,
      });
      trackToolUsage('upi-info', 'search', 'success');
      toast.success('UPI information retrieved — real data!');
    } catch (error) {
      clearInterval(progressInterval);
      console.error('UPI lookup error:', error);
      toast.error(error.message || 'Search failed. Is the backend running?');
      trackToolUsage('upi-info', 'search', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  function getPspFullName(psp) {
    const pspMap = {
      'paytm': 'Paytm Payments Bank',
      'ybl': 'Yes Bank - PhonePe',
      'okaxis': 'Axis Bank - Google Pay',
      'okhdfcbank': 'HDFC Bank - Google Pay',
      'oksbi': 'SBI - Google Pay',
      'axl': 'Axis Bank',
      'ibl': 'ICICI Bank',
      'sbi': 'State Bank of India',
      'upi': 'BHIM UPI',
    };
    return pspMap[psp.toLowerCase()] || `${psp.toUpperCase()} Payment Service`;
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'bank', label: 'Bank Details', icon: Building },
    { id: 'transactions', label: 'Transactions', icon: ArrowUpDown },
    { id: 'risk', label: 'Risk Analysis', icon: Shield },
    { id: 'activity', label: 'Activity', icon: Activity },
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
        className="relative w-full max-w-5xl max-h-[90vh] bg-gradient-to-br from-gray-900 via-blue-950/30 to-gray-900 rounded-2xl border border-blue-500/30 overflow-hidden"
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-3 sm:p-4 border-b border-blue-500/30 bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">UPI ID Info</h2>
              <p className="text-xs sm:text-sm text-blue-400/80 hidden sm:block">VPA lookup & transaction analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/30 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-blue-200">New Search</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!results}
              onClick={handleExportJSON}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/30 transition-all hidden sm:flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-indigo-200">Export JSON</span>
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 hidden sm:flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-amber-300">18</span>
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
        <div className="relative z-10 p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-70px)] sm:max-h-[calc(90vh-80px)]">
          {!results ? (
            <div className="max-w-xl mx-auto space-y-4 sm:space-y-6">
              {/* Input Section */}
              <div className="p-3 sm:p-6 rounded-lg sm:rounded-xl bg-gray-800/50 border border-blue-500/20">
                <label className="block text-xs sm:text-sm text-blue-400 mb-2 font-mono">UPI ID / VPA</label>
                <div className="relative">
                  <Wallet className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value.toLowerCase())}
                    placeholder="username@psp"
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-lg bg-gray-900 border border-blue-500/30 focus:border-blue-500 outline-none text-white text-base sm:text-lg font-mono placeholder-gray-600 lowercase"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">Examples: name@paytm, mobile@ybl, user@okaxis</p>
              </div>

              {/* Supported PSPs */}
              <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700">
                <p className="text-sm text-gray-400 mb-3">Supported Payment Service Providers:</p>
                <div className="flex flex-wrap gap-2">
                  {['@paytm', '@ybl', '@okaxis', '@okhdfcbank', '@oksbi', '@axl', '@ibl', '@sbi'].map(psp => (
                    <span key={psp} className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-mono">{psp}</span>
                  ))}
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg flex items-center justify-center gap-3 hover:from-blue-400 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
              >
                {isSearching ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Search className="w-6 h-6" />
                    </motion.div>
                    Searching NPCI Database... {searchProgress}%
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6" />
                    Search UPI ID
                  </>
                )}
              </button>

              {isSearching && (
                <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${searchProgress}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Header */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/10 border border-blue-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Wallet className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white font-mono">{results.upiId}</p>
                      <p className="text-blue-400">{results.account.accountHolderName} • {results.pspDetails.fullName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      results.valid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {results.valid ? 'Valid VPA' : 'Invalid'}
                    </span>
                    <p className="text-sm text-gray-400 mt-2">KYC: {results.pspDetails.kycStatus}</p>
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
                        ? 'bg-blue-500 text-white'
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
                {activeTab === 'account' && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid md:grid-cols-2 gap-4"
                  >
                    <div className="p-4 rounded-xl bg-gray-800/50 border border-blue-500/20">
                      <h3 className="text-sm font-mono text-blue-400 mb-3">ACCOUNT DETAILS</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between"><span className="text-gray-400">Name</span><span className="text-white">{results.account.accountHolderName}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">VPA</span><span className="text-blue-400 font-mono">{results.account.vpa}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Linked Mobile</span><span className="text-white">{results.account.linkedMobile}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Registered</span><span className="text-white">{results.account.registrationDate}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Last Active</span><span className="text-green-400">{results.account.lastActive}</span></div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-800/50 border border-blue-500/20">
                      <h3 className="text-sm font-mono text-blue-400 mb-3">PSP DETAILS</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between"><span className="text-gray-400">PSP Name</span><span className="text-white">{results.pspDetails.pspName}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Full Name</span><span className="text-white">{results.pspDetails.fullName}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">App Version</span><span className="text-white">{results.pspDetails.appVersion}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Device</span><span className="text-white">{results.pspDetails.deviceInfo}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">KYC Status</span><span className="text-green-400">{results.pspDetails.kycStatus}</span></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'bank' && (
                  <motion.div
                    key="bank"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-xl bg-gray-800/50 border border-blue-500/20">
                      <h3 className="text-sm font-mono text-blue-400 mb-3">PRIMARY BANK</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between"><span className="text-gray-400">Bank Name</span><span className="text-white">{results.account.bankName}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">IFSC</span><span className="text-cyan-400 font-mono">{results.account.bankIfsc}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Account Type</span><span className="text-white">{results.account.accountType}</span></div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-800/50 border border-blue-500/20">
                      <h3 className="text-sm font-mono text-blue-400 mb-3">LINKED ACCOUNTS</h3>
                      <div className="space-y-3">
                        {results.linkedAccounts.map((acc, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50">
                            <div className="flex items-center gap-3">
                              <Building className="w-5 h-5 text-blue-400" />
                              <div>
                                <p className="text-white">{acc.bankName}</p>
                                <p className="text-sm text-gray-500">{acc.accountEnding}</p>
                              </div>
                            </div>
                            {acc.primary && <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">Primary</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'transactions' && (
                  <motion.div
                    key="transactions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-gray-800/50 border border-blue-500/20"
                  >
                    <h3 className="text-sm font-mono text-blue-400 mb-3">TRANSACTION SUMMARY</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 rounded-lg bg-gray-900/50 text-center">
                        <p className="text-2xl font-bold text-blue-400">{results.transactions.totalTransactions}</p>
                        <p className="text-xs text-gray-500">Total Txns</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-900/50 text-center">
                        <p className="text-2xl font-bold text-blue-400">{results.transactions.avgMonthlyTxn}</p>
                        <p className="text-xs text-gray-500">Avg/Month</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-900/50 text-center">
                        <p className="text-sm font-bold text-green-400">{results.transactions.lastTransactionDate}</p>
                        <p className="text-xs text-gray-500">Last Txn</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-900/50 text-center">
                        <p className="text-sm font-bold text-white">{results.transactions.transactionPattern}</p>
                        <p className="text-xs text-gray-500">Pattern</p>
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
                    className="grid md:grid-cols-2 gap-4"
                  >
                    <div className="p-4 rounded-xl bg-gray-800/50 border border-blue-500/20">
                      <h3 className="text-sm font-mono text-blue-400 mb-3">RISK ASSESSMENT</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Risk Score</span>
                          <span className={`text-xl font-bold ${results.riskIndicators.riskScore < 30 ? 'text-green-400' : results.riskIndicators.riskScore < 70 ? 'text-amber-400' : 'text-red-400'}`}>
                            {results.riskIndicators.riskScore}/100
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Risk Level</span>
                          <span className={`px-2 py-1 rounded text-sm ${results.riskIndicators.riskLevel === 'Low' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {results.riskIndicators.riskLevel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-800/50 border border-blue-500/20">
                      <h3 className="text-sm font-mono text-blue-400 mb-3">FRAUD INDICATORS</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between"><span className="text-gray-400">Fraud Reports</span><span className={results.riskIndicators.fraudReports > 0 ? 'text-red-400' : 'text-green-400'}>{results.riskIndicators.fraudReports}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Merchant Account</span><span className="text-white">{results.riskIndicators.merchantAccount ? 'Yes' : 'No'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Bulk Transfer</span><span className={results.riskIndicators.bulkTransfer ? 'text-amber-400' : 'text-green-400'}>{results.riskIndicators.bulkTransfer ? 'Yes' : 'No'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Suspicious Activity</span><span className={results.riskIndicators.suspiciousActivity ? 'text-red-400' : 'text-green-400'}>{results.riskIndicators.suspiciousActivity ? 'Yes' : 'No'}</span></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'activity' && (
                  <motion.div
                    key="activity"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <h3 className="text-sm font-mono text-blue-400">RECENT ACTIVITY</h3>
                    {results.recentActivity.map((item, i) => (
                      <div key={i} className="p-4 rounded-xl bg-gray-800/50 border border-blue-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === 'Received' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                            <IndianRupee className={`w-5 h-5 ${item.type === 'Received' ? 'text-green-400' : 'text-red-400'}`} />
                          </div>
                          <div>
                            <p className="text-white">{item.type}</p>
                            <p className="text-sm text-gray-500">{item.from || item.to}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${item.type === 'Received' ? 'text-green-400' : 'text-red-400'}`}>{item.amount}</p>
                          <p className="text-xs text-gray-500">{item.date}</p>
                        </div>
                      </div>
                    ))}
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

export default UPIInfoTool;
