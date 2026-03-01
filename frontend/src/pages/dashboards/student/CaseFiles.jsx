import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  FolderOpen,
  Search,
  Clock,
  AlertTriangle,
  Target,
  FileText,
  Filter,
  Plus,
  MoreVertical,
  ChevronRight,
  Eye,
  Archive,
  Trash2
} from 'lucide-react';

const CaseFiles = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);

  const cases = [
    {
      id: 'CASE-2024001',
      title: 'IP Origin Investigation',
      status: 'active',
      created: '2024-01-15',
      lastActivity: '2h ago',
      toolsUsed: ['IP Tracer', 'Geo Locate'],
      creditsSpent: 45,
      dataPoints: 12
    },
    {
      id: 'CASE-2024002',
      title: 'Domain Analysis - Suspicious Site',
      status: 'active',
      created: '2024-01-14',
      lastActivity: '1d ago',
      toolsUsed: ['Domain Lookup', 'WHOIS', 'SSL Analyzer'],
      creditsSpent: 65,
      dataPoints: 28
    },
    {
      id: 'CASE-2024003',
      title: 'Email Trace Operation',
      status: 'paused',
      created: '2024-01-10',
      lastActivity: '3d ago',
      toolsUsed: ['Email OSINT', 'Breach Check'],
      creditsSpent: 40,
      dataPoints: 8
    },
    {
      id: 'CASE-2024004',
      title: 'Social Profile Mapping',
      status: 'completed',
      created: '2024-01-08',
      lastActivity: '5d ago',
      toolsUsed: ['Social Scanner', 'Username Search'],
      creditsSpent: 55,
      dataPoints: 34
    },
    {
      id: 'CASE-2024005',
      title: 'Network Footprint Analysis',
      status: 'completed',
      created: '2024-01-05',
      lastActivity: '1w ago',
      toolsUsed: ['Network Scanner', 'DNS Enum'],
      creditsSpent: 80,
      dataPoints: 45
    }
  ];

  const statusColors = {
    active: 'bg-green-500',
    paused: 'bg-amber-500',
    completed: 'bg-gray-500'
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 investigation-grid-student opacity-30" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 animate-signal-pulse" />

      {/* Restriction Banner */}
      <div className="relative z-50 bg-cyan-950/80 border-b border-cyan-500/30">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-300 text-sm font-mono">
            CASE FILES: Limited correlation data • Export restrictions apply
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-40 border-b border-cyan-900/50 bg-gray-950/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard/student"
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-cyan-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-cyan-400 font-mono">CASE FILES</h1>
                <p className="text-xs text-gray-500 font-mono">Investigation Records</p>
              </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 transition-colors">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-mono">NEW CASE</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Active Cases', value: cases.filter(c => c.status === 'active').length, color: 'green' },
            { label: 'Paused', value: cases.filter(c => c.status === 'paused').length, color: 'amber' },
            { label: 'Completed', value: cases.filter(c => c.status === 'completed').length, color: 'gray' },
            { label: 'Total Data Points', value: cases.reduce((sum, c) => sum + c.dataPoints, 0), color: 'cyan' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-student rounded-xl p-4 border border-cyan-500/20"
            >
              <p className="text-xs text-gray-500 font-mono mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 rounded-lg bg-gray-900 border border-gray-800 focus:border-cyan-500/50 outline-none text-gray-300 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              {['all', 'active', 'paused', 'completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    statusFilter === status
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cases List */}
        <div className="space-y-3">
          {filteredCases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-student rounded-xl p-4 border border-cyan-500/20 hover:border-cyan-500/50 transition-all cursor-pointer group"
              onClick={() => setSelectedCase(caseItem)}
            >
              <div className="flex items-center gap-4">
                {/* Status & Icon */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <FolderOpen className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${statusColors[caseItem.status]} ${caseItem.status === 'active' ? 'animate-pulse' : ''}`} />
                </div>

                {/* Case Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-500">{caseItem.id}</span>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                      caseItem.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      caseItem.status === 'paused' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {caseItem.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-200 mt-1">{caseItem.title}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-500">Created: {caseItem.created}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">Last activity: {caseItem.lastActivity}</span>
                  </div>
                </div>

                {/* Tools Used */}
                <div className="hidden md:block">
                  <p className="text-xs text-gray-500 mb-1">Tools Used</p>
                  <div className="flex flex-wrap gap-1">
                    {caseItem.toolsUsed.slice(0, 3).map((tool, i) => (
                      <span key={i} className="text-xs font-mono bg-gray-800 px-2 py-0.5 rounded text-gray-400">
                        {tool}
                      </span>
                    ))}
                    {caseItem.toolsUsed.length > 3 && (
                      <span className="text-xs text-gray-500">+{caseItem.toolsUsed.length - 3}</span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right">
                  <div className="text-xs text-gray-500">Data Points</div>
                  <div className="text-lg font-bold text-cyan-400">{caseItem.dataPoints}</div>
                  <div className="text-xs text-amber-400 mt-1">-{caseItem.creditsSpent}c spent</div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-cyan-400 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-cyan-400 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">No cases found</p>
          </div>
        )}
      </main>

      {/* Case Detail Modal */}
      {selectedCase && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedCase(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl glass-student rounded-2xl border border-cyan-500/30 overflow-hidden"
          >
            <div className="p-6 border-b border-cyan-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-cyan-500">{selectedCase.id}</span>
                  <h2 className="text-xl font-bold text-white mt-1">{selectedCase.title}</h2>
                </div>
                <button 
                  onClick={() => setSelectedCase(null)}
                  className="text-gray-500 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Dates */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-gray-900/50">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className={`text-sm font-mono ${
                    selectedCase.status === 'active' ? 'text-green-400' :
                    selectedCase.status === 'paused' ? 'text-amber-400' : 'text-gray-400'
                  }`}>{selectedCase.status.toUpperCase()}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-900/50">
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm text-gray-300">{selectedCase.created}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-900/50">
                  <p className="text-xs text-gray-500">Last Activity</p>
                  <p className="text-sm text-gray-300">{selectedCase.lastActivity}</p>
                </div>
              </div>

              {/* Tools Used */}
              <div>
                <p className="text-xs text-gray-500 mb-2 font-mono">TOOLS USED</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.toolsUsed.map((tool, i) => (
                    <span key={i} className="text-sm font-mono bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-lg text-cyan-400">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <Target className="w-5 h-5 text-cyan-400 mb-2" />
                  <p className="text-2xl font-bold text-white">{selectedCase.dataPoints}</p>
                  <p className="text-xs text-gray-500">Data Points Collected</p>
                </div>
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <FileText className="w-5 h-5 text-amber-400 mb-2" />
                  <p className="text-2xl font-bold text-white">{selectedCase.creditsSpent}c</p>
                  <p className="text-xs text-gray-500">Credits Spent</p>
                </div>
              </div>

              {/* Field Restriction Notice */}
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-mono text-amber-400">FIELD ACCESS NOTICE</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Case data is limited to single-layer correlation. Full correlation analysis requires elevated access.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  View Case Data
                </button>
                <button className="px-4 py-3 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
                  <Archive className="w-4 h-4" />
                </button>
                <button className="px-4 py-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CaseFiles;
